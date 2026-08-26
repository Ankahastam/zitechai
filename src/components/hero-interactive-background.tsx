"use client";

import { useEffect, useRef } from "react";

type FieldNode = {
  anchorX: number;
  anchorY: number;
  x: number;
  y: number;
  phase: number;
  speed: number;
  amplitude: number;
  accent: boolean;
};

type FieldEdge = {
  from: number;
  to: number;
  bucket: number;
};

const TAU = Math.PI * 2;
const FRAME_INTERVAL = 1000 / 30;
const DRIFT_SCALE = 0.00008;
const POINTER_RADIUS = 190;
const POINTER_SHIFT = 12;
const NEIGHBOURS = 4;
const LINK_REACH = 1.45;
const ACCENT_SHARE = 0.07;
// Index 3 carries the violet threads; the rest are ink hairlines.
const EDGE_STROKES = [
  "rgba(25, 23, 28, 0.09)",
  "rgba(25, 23, 28, 0.14)",
  "rgba(25, 23, 28, 0.2)",
  "rgba(122, 64, 237, 0.28)",
];
const ACCENT_BUCKET = 3;
const NODE_FILL = "rgba(25, 23, 28, 0.34)";
const ACCENT_FILL = "rgba(122, 64, 237, 0.6)";
const NODE_RADIUS = 1.4;
const ACCENT_RADIUS = 2.1;

function resolveNodeCount(width: number, height: number): number {
  const cores = navigator.hardwareConcurrency || 4;
  const lowPower = cores <= 4;

  if (width < 640) return lowPower ? 22 : 30;
  if (width < 1024) return lowPower ? 38 : 54;

  // Keep mesh density constant per area instead of thinning out on wide screens.
  const byArea = Math.round((width * height) / 14000);
  return lowPower ? Math.min(Math.max(byArea, 44), 72) : Math.min(Math.max(byArea, 72), 120);
}

function buildField(width: number, height: number, count: number) {
  const columns = Math.max(2, Math.round(Math.sqrt((count * width) / Math.max(height, 1))));
  const rows = Math.max(2, Math.ceil(count / columns));
  const cellWidth = width / columns;
  const cellHeight = height / rows;
  const nodes: FieldNode[] = [];

  // Strong jitter breaks the grid into clusters and voids instead of an even lattice.
  for (let row = 0; row < rows && nodes.length < count; row += 1) {
    for (let column = 0; column < columns && nodes.length < count; column += 1) {
      const anchorX = cellWidth * (column + 0.5) + (Math.random() - 0.5) * cellWidth * 1.15;
      const anchorY = cellHeight * (row + 0.5) + (Math.random() - 0.5) * cellHeight * 1.15;

      nodes.push({
        anchorX,
        anchorY,
        x: anchorX,
        y: anchorY,
        phase: Math.random() * TAU,
        speed: 0.5 + Math.random() * 0.7,
        amplitude: 4 + Math.random() * 7,
        accent: false,
      });
    }
  }

  const accentCount = Math.max(2, Math.round(nodes.length * ACCENT_SHARE));
  for (let i = 0; i < accentCount; i += 1) {
    nodes[Math.floor(Math.random() * nodes.length)].accent = true;
  }

  // Neighbour pairs are resolved once, so the render loop never compares nodes.
  const reach = Math.hypot(cellWidth, cellHeight) * LINK_REACH;
  const pairs = new Map<string, number>();
  const distances: { index: number; length: number }[] = [];

  for (let i = 0; i < nodes.length; i += 1) {
    distances.length = 0;

    for (let j = 0; j < nodes.length; j += 1) {
      if (i === j) continue;
      const deltaX = nodes[i].anchorX - nodes[j].anchorX;
      const deltaY = nodes[i].anchorY - nodes[j].anchorY;
      const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (length > reach) continue;
      distances.push({ index: j, length });
    }

    distances.sort((first, second) => first.length - second.length);

    for (let n = 0; n < Math.min(NEIGHBOURS, distances.length); n += 1) {
      const neighbour = distances[n];
      const key = i < neighbour.index ? `${i}-${neighbour.index}` : `${neighbour.index}-${i}`;
      if (!pairs.has(key)) pairs.set(key, neighbour.length);
    }
  }

  const edges: FieldEdge[] = [];
  pairs.forEach((length, key) => {
    const [from, to] = key.split("-");
    const fromIndex = Number(from);
    const toIndex = Number(to);
    const ratio = length / reach;

    edges.push({
      from: fromIndex,
      to: toIndex,
      bucket:
        nodes[fromIndex].accent || nodes[toIndex].accent
          ? ACCENT_BUCKET
          : ratio < 0.45
            ? 2
            : ratio < 0.75
              ? 1
              : 0,
    });
  });

  return { nodes, edges };
}

export function HeroInteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: fine)");

    let nodes: FieldNode[] = [];
    let edges: FieldEdge[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let idleHandle = 0;
    let timeoutHandle = 0;
    let lastDraw = 0;
    let booted = false;
    let running = false;
    let onScreen = true;
    let pointerListening = false;
    let pointerActive = false;
    let pointerClientX = 0;
    let pointerClientY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let influence = 0;
    let rectStale = true;
    let rectLeft = 0;
    let rectTop = 0;

    const syncSize = (force: boolean) => {
      const rect = canvas.getBoundingClientRect();
      const nextWidth = Math.round(rect.width);
      const nextHeight = Math.round(rect.height);

      if (nextWidth < 1 || nextHeight < 1) return false;

      // Ignore small height changes so mobile browser chrome does not rebuild the field.
      const changed = nextWidth !== width || Math.abs(nextHeight - height) > 120;
      if (!force && !changed) return false;

      width = nextWidth;
      height = nextHeight;
      rectStale = true;

      const ratio = Math.min(window.devicePixelRatio || 1, nextWidth < 640 ? 1.25 : 1.5);
      canvas.width = Math.round(nextWidth * ratio);
      canvas.height = Math.round(nextHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const field = buildField(nextWidth, nextHeight, resolveNodeCount(nextWidth, nextHeight));
      nodes = field.nodes;
      edges = field.edges;

      return true;
    };

    const step = (time: number) => {
      const drift = time * DRIFT_SCALE;
      influence += ((pointerActive ? 1 : 0) - influence) * 0.08;
      const shift = POINTER_SHIFT * influence;

      if (shift > 0.05) {
        if (rectStale) {
          const rect = canvas.getBoundingClientRect();
          rectLeft = rect.left;
          rectTop = rect.top;
          rectStale = false;
        }
        pointerX = pointerClientX - rectLeft;
        pointerY = pointerClientY - rectTop;
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let x = node.anchorX + Math.cos(drift * node.speed + node.phase) * node.amplitude;
        let y = node.anchorY + Math.sin(drift * node.speed * 0.85 + node.phase * 1.4) * node.amplitude;

        if (shift > 0.05) {
          const deltaX = x - pointerX;
          const deltaY = y - pointerY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (distance > 0.5 && distance < POINTER_RADIUS) {
            const falloff = (1 - distance / POINTER_RADIUS) ** 2;
            x += (deltaX / distance) * falloff * shift;
            y += (deltaY / distance) * falloff * shift;
          }
        }

        node.x = x;
        node.y = y;
      }
    };

    const paint = () => {
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;

      for (let bucket = 0; bucket < EDGE_STROKES.length; bucket += 1) {
        let drawn = false;
        context.beginPath();

        for (let i = 0; i < edges.length; i += 1) {
          const edge = edges[i];
          if (edge.bucket !== bucket) continue;
          const from = nodes[edge.from];
          const to = nodes[edge.to];
          context.moveTo(from.x, from.y);
          context.lineTo(to.x, to.y);
          drawn = true;
        }

        if (!drawn) continue;
        context.strokeStyle = EDGE_STROKES[bucket];
        context.stroke();
      }

      let plainDrawn = false;
      context.beginPath();
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.accent) continue;
        context.moveTo(node.x + NODE_RADIUS, node.y);
        context.arc(node.x, node.y, NODE_RADIUS, 0, TAU);
        plainDrawn = true;
      }
      if (plainDrawn) {
        context.fillStyle = NODE_FILL;
        context.fill();
      }

      let accentDrawn = false;
      context.beginPath();
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (!node.accent) continue;
        context.moveTo(node.x + ACCENT_RADIUS, node.y);
        context.arc(node.x, node.y, ACCENT_RADIUS, 0, TAU);
        accentDrawn = true;
      }
      if (accentDrawn) {
        context.fillStyle = ACCENT_FILL;
        context.fill();
      }
    };

    const drawOnce = () => {
      step(0);
      paint();
    };

    const render = (time: number) => {
      frame = requestAnimationFrame(render);
      if (time - lastDraw < FRAME_INTERVAL) return;
      lastDraw = time;
      step(time);
      paint();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointerClientX = event.clientX;
      pointerClientY = event.clientY;
      pointerActive = true;
    };

    const handlePointerLeave = () => {
      pointerActive = false;
    };

    const markRectStale = () => {
      rectStale = true;
    };

    const attachPointer = () => {
      if (pointerListening || !pointerQuery.matches || motionQuery.matches) return;
      pointerListening = true;
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("blur", handlePointerLeave);
      document.addEventListener("pointerleave", handlePointerLeave, { passive: true });
      window.addEventListener("scroll", markRectStale, { passive: true });
    };

    const detachPointer = () => {
      if (!pointerListening) return;
      pointerListening = false;
      pointerActive = false;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", handlePointerLeave);
      document.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", markRectStale);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frame);
    };

    const start = () => {
      if (!booted || running || !onScreen || document.hidden || motionQuery.matches) return;
      running = true;
      lastDraw = 0;
      frame = requestAnimationFrame(render);
    };

    const applyMotionPreference = () => {
      if (motionQuery.matches) {
        stop();
        detachPointer();
        influence = 0;
        drawOnce();
        return;
      }
      attachPointer();
      start();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
        return;
      }
      markRectStale();
      start();
    };

    const boot = () => {
      idleHandle = 0;
      timeoutHandle = 0;
      booted = true;
      syncSize(true);
      applyMotionPreference();
    };

    const resizeObserver = new ResizeObserver(() => {
      if (!syncSize(false) || !booted) return;
      if (!running) drawOnce();
    });

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
        if (onScreen) {
          markRectStale();
          start();
        } else {
          stop();
        }
      },
      { rootMargin: "120px" },
    );

    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", handleVisibility);
    motionQuery.addEventListener("change", applyMotionPreference);
    pointerQuery.addEventListener("change", applyMotionPreference);

    // Start after the browser is idle so the hero text paints first.
    if (typeof window.requestIdleCallback === "function") {
      idleHandle = window.requestIdleCallback(boot, { timeout: 600 });
    } else {
      timeoutHandle = window.setTimeout(boot, 260);
    }

    return () => {
      stop();
      detachPointer();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      motionQuery.removeEventListener("change", applyMotionPreference);
      pointerQuery.removeEventListener("change", applyMotionPreference);

      if (idleHandle && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle) window.clearTimeout(timeoutHandle);
    };
  }, []);

  return <canvas aria-hidden="true" className="hero__canvas" ref={canvasRef} role="presentation" />;
}
