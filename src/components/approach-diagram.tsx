import type { CSSProperties } from "react";

type NodeRole = "source" | "relay" | "core" | "fanout" | "operation";

type LayerSpec = {
  role: NodeRole;
  x: number;
  count: number;
  compactCount: number;
  /** Dot scale once the system is assembled. */
  dot: number;
  labels?: readonly string[];
};

const VIEW_WIDTH = 420;
const VIEW_HEIGHT = 480;
const EDGE_PAD = 46;

// Ordered right to left, matching the Persian reading direction.
const LAYERS: readonly LayerSpec[] = [
  {
    role: "source",
    x: 358,
    count: 6,
    compactCount: 3,
    dot: 0.92,
    labels: ["CRM", "ERP", "حسابداری", "سایت", "داده", "ابزارها"],
  },
  { role: "relay", x: 276, count: 5, compactCount: 2, dot: 0.55 },
  { role: "core", x: 188, count: 4, compactCount: 3, dot: 1.15 },
  { role: "fanout", x: 106, count: 5, compactCount: 2, dot: 0.55 },
  { role: "operation", x: 44, count: 3, compactCount: 2, dot: 0.85 },
];

const LATIN_LABELS = new Set(["CRM", "ERP"]);
const MAX_FLOWS = 8;
const NOISE_NEIGHBOURS = 2;

/** Closed circuit used by the third stage: the system becomes a running loop. */
const LOOP = { x0: 66, x1: 354, y0: 48, y1: 404, r: 86 };
const LOOP_H = LOOP.x1 - LOOP.x0 - LOOP.r * 2;
const LOOP_V = LOOP.y1 - LOOP.y0 - LOOP.r * 2;
const LOOP_ARC = (Math.PI * LOOP.r) / 2;
const LOOP_PERIMETER = LOOP_H * 2 + LOOP_V * 2 + LOOP_ARC * 4;
const LOOP_CENTER = [(LOOP.x0 + LOOP.x1) / 2, (LOOP.y0 + LOOP.y1) / 2] as const;

type Point = readonly [number, number];

type DiagramNode = {
  id: string;
  role: NodeRole;
  layer: number;
  dot: number;
  scatter: Point;
  system: Point;
  loop: Point;
  label?: string;
  signal: boolean;
};

type DiagramLink = {
  from: number;
  to: number;
  tier: number;
};

/** Walks the rounded-rect perimeter clockwise from the start of the top edge. */
function loopPoint(distance: number): Point {
  const { x0, x1, y0, y1, r } = LOOP;
  let d = ((distance % LOOP_PERIMETER) + LOOP_PERIMETER) % LOOP_PERIMETER;
  const round = (point: Point): Point => [Math.round(point[0] * 10) / 10, Math.round(point[1] * 10) / 10];

  if (d < LOOP_H) return round([x0 + r + d, y0]);
  d -= LOOP_H;

  if (d < LOOP_ARC) {
    const angle = (d / LOOP_ARC) * (Math.PI / 2);
    return round([x1 - r + r * Math.sin(angle), y0 + r - r * Math.cos(angle)]);
  }
  d -= LOOP_ARC;

  if (d < LOOP_V) return round([x1, y0 + r + d]);
  d -= LOOP_V;

  if (d < LOOP_ARC) {
    const angle = (d / LOOP_ARC) * (Math.PI / 2);
    return round([x1 - r + r * Math.cos(angle), y1 - r + r * Math.sin(angle)]);
  }
  d -= LOOP_ARC;

  if (d < LOOP_H) return round([x1 - r - d, y1]);
  d -= LOOP_H;

  if (d < LOOP_ARC) {
    const angle = (d / LOOP_ARC) * (Math.PI / 2);
    return round([x0 + r - r * Math.sin(angle), y1 - r + r * Math.cos(angle)]);
  }
  d -= LOOP_ARC;

  if (d < LOOP_V) return round([x0, y1 - r - d]);
  d -= LOOP_V;

  const angle = (d / LOOP_ARC) * (Math.PI / 2);
  return round([x0 + r - r * Math.cos(angle), y0 + r - r * Math.sin(angle)]);
}

/** Deterministic so server and client render identical geometry. */
function createRandom(seed: number) {
  let state = seed;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function span(from: readonly [number, number], to: readonly [number, number]) {
  return Math.round(Math.hypot(to[0] - from[0], to[1] - from[1]) * 10) / 10;
}

/** Jittered grid over the whole canvas, then shuffled, so the loose state reads as clutter. */
function scatterSlots(total: number, random: () => number) {
  const columns = Math.max(2, Math.round(Math.sqrt((total * VIEW_WIDTH) / VIEW_HEIGHT)));
  const rows = Math.max(2, Math.ceil(total / columns));
  const cellWidth = VIEW_WIDTH / columns;
  const cellHeight = VIEW_HEIGHT / rows;
  const slots: [number, number][] = [];

  for (let row = 0; row < rows && slots.length < total; row += 1) {
    for (let column = 0; column < columns && slots.length < total; column += 1) {
      const x = cellWidth * (column + 0.5) + (random() - 0.5) * cellWidth * 0.9;
      const y = cellHeight * (row + 0.5) + (random() - 0.5) * cellHeight * 0.9;
      slots.push([
        Math.round(Math.min(Math.max(x, 20), VIEW_WIDTH - 20) * 10) / 10,
        Math.round(Math.min(Math.max(y, 20), VIEW_HEIGHT - 20) * 10) / 10,
      ]);
    }
  }

  for (let i = slots.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }

  return slots;
}

function buildDiagram(compact: boolean) {
  const random = createRandom(compact ? 2411 : 917);
  const counts = LAYERS.map((layer) => (compact ? layer.compactCount : layer.count));
  const slots = scatterSlots(
    counts.reduce((total, count) => total + count, 0),
    random,
  );

  const nodes: DiagramNode[] = [];
  const byLayer: number[][] = [];
  const usable = VIEW_HEIGHT - EDGE_PAD * 2;

  LAYERS.forEach((layer, layerIndex) => {
    const count = counts[layerIndex];
    const indices: number[] = [];

    for (let i = 0; i < count; i += 1) {
      const y = EDGE_PAD + ((i + 0.5) * usable) / count + (random() - 0.5) * 9;
      const labelIndex = layer.labels
        ? Math.round((i * (layer.labels.length - 1)) / Math.max(count - 1, 1))
        : -1;

      indices.push(nodes.length);
      nodes.push({
        id: `${layer.role}-${i}`,
        role: layer.role,
        layer: layerIndex,
        dot: layer.dot,
        scatter: slots[nodes.length] ?? [layer.x, y],
        system: [layer.x, Math.round(y * 10) / 10],
        loop: [layer.x, y],
        label: labelIndex >= 0 ? layer.labels?.[labelIndex] : undefined,
        signal: layer.role === "core",
      });
    }

    byLayer.push(indices);
  });

  // The loop keeps the layer order, so the pipeline becomes a clockwise cycle.
  const loopStart = LOOP_H + LOOP_ARC * 0.55;
  nodes.forEach((node, index) => {
    node.loop = loopPoint(loopStart + (index * LOOP_PERIMETER) / nodes.length);
  });

  const seen = new Set<string>();
  const links: DiagramLink[] = [];

  const addLink = (from: number, to: number, tier: number) => {
    const key = from < to ? `${from}-${to}` : `${to}-${from}`;
    if (seen.has(key)) return;
    seen.add(key);
    links.push({ from, to, tier });
  };

  // Each layer fans into the next by vertical proximity, which reads as a system rather than a web.
  for (let layerIndex = 0; layerIndex < byLayer.length - 1; layerIndex += 1) {
    const current = byLayer[layerIndex];
    const next = byLayer[layerIndex + 1];

    for (const from of current) {
      const nearest = next
        .map((to) => ({ to, delta: Math.abs(nodes[to].system[1] - nodes[from].system[1]) }))
        .sort((a, b) => a.delta - b.delta)
        .slice(0, 2);

      for (const target of nearest) addLink(from, target.to, layerIndex);
    }

    // Nothing downstream should be left unconnected.
    for (const to of next) {
      if (links.some((link) => link.to === to)) continue;
      const nearest = current
        .map((from) => ({ from, delta: Math.abs(nodes[from].system[1] - nodes[to].system[1]) }))
        .sort((a, b) => a.delta - b.delta)[0];
      if (nearest) addLink(nearest.from, to, layerIndex);
    }
  }

  const spine = byLayer[2];
  for (let i = 0; i < spine.length - 1; i += 1) addLink(spine[i], spine[i + 1], 4);

  const circuit = nodes.map((_, index) => [index, (index + 1) % nodes.length] as [number, number]);

  // Chords across the loop: the AI layer now touches every part of the cycle.
  const reach = Math.floor(nodes.length / 2);
  const chordSources = [...spine, byLayer[0][1], byLayer[3][1]];
  const chords = chordSources.map((from) => [from, (from + reach) % nodes.length] as [number, number]);

  const flows = circuit.filter((_, index) => index % 3 === 0).slice(0, MAX_FLOWS);

  const noiseSeen = new Set<string>();
  const noise: [number, number][] = [];

  for (let i = 0; i < nodes.length; i += 1) {
    const nearest = nodes
      .map((node, index) => ({ index, distance: span(nodes[i].scatter, node.scatter) }))
      .filter((entry) => entry.index !== i)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, NOISE_NEIGHBOURS);

    for (const entry of nearest) {
      const key = i < entry.index ? `${i}-${entry.index}` : `${entry.index}-${i}`;
      if (noiseSeen.has(key)) continue;
      noiseSeen.add(key);
      noise.push([i, entry.index]);
    }
  }

  const coreNodes = spine.map((index) => nodes[index].system[1]);
  const opsNodes = byLayer[4].map((index) => nodes[index].system[1]);

  const bands = {
    core: {
      x: LAYERS[2].x - 17,
      y: Math.min(...coreNodes) - 26,
      width: 34,
      height: Math.max(...coreNodes) - Math.min(...coreNodes) + 52,
    },
    ops: {
      x: LAYERS[4].x - 19,
      y: Math.min(...opsNodes) - 26,
      width: 38,
      height: Math.max(...opsNodes) - Math.min(...opsNodes) + 52,
    },
  };

  return { nodes, links, circuit, chords, flows, noise, bands };
}

const FULL = buildDiagram(false);
const COMPACT = buildDiagram(true);

type ApproachDiagramProps = {
  /** Pins the diagram to one stage. Left out, it follows the surrounding track. */
  stage?: 1 | 2 | 3;
  compact?: boolean;
};

export function ApproachDiagram({ stage, compact = false }: ApproachDiagramProps) {
  const { nodes, links, circuit, chords, flows, noise, bands } = compact ? COMPACT : FULL;

  return (
    <svg
      aria-hidden="true"
      className={compact ? "apx apx--compact" : "apx"}
      data-stage={stage}
      focusable="false"
      role="presentation"
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
    >
      <g className="apx-bands">
        <rect
          className="apx-band apx-band--core"
          height={bands.core.height}
          rx="17"
          width={bands.core.width}
          x={bands.core.x}
          y={bands.core.y}
        />
        <rect
          className="apx-band apx-band--ops"
          height={bands.ops.height}
          rx="19"
          width={bands.ops.width}
          x={bands.ops.x}
          y={bands.ops.y}
        />
      </g>

      <g className="apx-noise">
        {noise.map(([from, to]) => (
          <line
            className="apx-noise-line"
            key={`noise-${from}-${to}`}
            x1={nodes[from].scatter[0]}
            x2={nodes[to].scatter[0]}
            y1={nodes[from].scatter[1]}
            y2={nodes[to].scatter[1]}
          />
        ))}
      </g>

      <g className="apx-links">
        {links.map((link) => (
          <line
            className="apx-link"
            data-tier={link.tier}
            key={`link-${link.from}-${link.to}`}
            style={{ "--len": span(nodes[link.from].system, nodes[link.to].system), "--tier": link.tier } as CSSProperties}
            x1={nodes[link.from].system[0]}
            x2={nodes[link.to].system[0]}
            y1={nodes[link.from].system[1]}
            y2={nodes[link.to].system[1]}
          />
        ))}
      </g>

      <g className="apx-circuit">
        {circuit.map(([from, to], index) => (
          <line
            className="apx-loop-line"
            key={`loop-${from}-${to}`}
            style={{ "--len": span(nodes[from].loop, nodes[to].loop), "--i": index } as CSSProperties}
            x1={nodes[from].loop[0]}
            x2={nodes[to].loop[0]}
            y1={nodes[from].loop[1]}
            y2={nodes[to].loop[1]}
          />
        ))}

        {chords.map(([from, to], index) => (
          <line
            className="apx-chord"
            key={`chord-${from}-${to}`}
            style={{ "--len": span(nodes[from].loop, nodes[to].loop), "--i": index } as CSSProperties}
            x1={nodes[from].loop[0]}
            x2={nodes[to].loop[0]}
            y1={nodes[from].loop[1]}
            y2={nodes[to].loop[1]}
          />
        ))}
      </g>

      <g className="apx-flows">
        {flows.map(([from, to], index) => (
          <line
            className="apx-flow"
            key={`flow-${from}-${to}`}
            style={{ "--len": span(nodes[from].loop, nodes[to].loop), "--i": index } as CSSProperties}
            x1={nodes[from].loop[0]}
            x2={nodes[to].loop[0]}
            y1={nodes[from].loop[1]}
            y2={nodes[to].loop[1]}
          />
        ))}
      </g>

      <g className="apx-nodes">
        {nodes.map((node, index) => (
          <g
            className={`apx-node apx-node--${node.role}`}
            data-signal={node.signal ? "true" : undefined}
            key={node.id}
            style={
              {
                "--x1": node.scatter[0],
                "--y1": node.scatter[1],
                "--x2": node.system[0],
                "--y2": node.system[1],
                "--x3": node.loop[0],
                "--y3": node.loop[1],
                "--dot": node.dot,
                "--layer": node.layer,
                "--i": index,
              } as CSSProperties
            }
          >
            {node.signal ? <circle className="apx-ring" r="12" /> : null}
            <circle className="apx-dot" r="4" />
          </g>
        ))}
      </g>

      <g className="apx-labels">
        {nodes.map((node) =>
          node.label ? (
            <text
              className={`apx-label apx-label--system apx-label--${LATIN_LABELS.has(node.label) ? "en" : "fa"}`}
              key={`label-${node.id}`}
              textAnchor="middle"
              x={node.system[0]}
              y={node.system[1] - 15}
            >
              {node.label}
            </text>
          ) : null,
        )}

        <text className="apx-label apx-label--core apx-label--fa" textAnchor="middle" x={LAYERS[2].x} y={VIEW_HEIGHT - 22}>
          لایهٔ هوش مصنوعی
        </text>

        <text
          className="apx-label apx-label--loop apx-label--fa"
          textAnchor="middle"
          x={LOOP_CENTER[0]}
          y={LOOP_CENTER[1] + 4}
        >
          کار روزمره
        </text>
      </g>
    </svg>
  );
}
