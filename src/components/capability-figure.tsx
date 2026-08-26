import type { CSSProperties, ReactNode } from "react";

/**
 * Six capability diagrams built from one primitive set: hairlines, small nodes,
 * tiny labels and a single violet accent each. Geometry is authored in a shared
 * 400×300 view box so the desktop panel never shifts between states.
 */

type Point = readonly [number, number];

type CapabilityFigureId = 1 | 2 | 3 | 4 | 5 | 6;

function length(from: Point, to: Point) {
  return Math.round(Math.hypot(to[0] - from[0], to[1] - from[1]) * 10) / 10;
}

function classNames(base: string, extra?: boolean, modifier?: string) {
  return [base, modifier, extra ? "cfx-extra" : undefined].filter(Boolean).join(" ");
}

type LinkProps = {
  from: Point;
  to: Point;
  order?: number;
  dashed?: boolean;
  extra?: boolean;
};

function Link({ from, to, order = 0, dashed, extra }: LinkProps) {
  return (
    <line
      className={classNames("cfx-link", extra, dashed ? "cfx-link--dashed" : undefined)}
      style={{ "--len": length(from, to), "--i": order } as CSSProperties}
      x1={from[0]}
      x2={to[0]}
      y1={from[1]}
      y2={to[1]}
    />
  );
}

type DotProps = {
  at: Point;
  order?: number;
  accent?: boolean;
  faint?: boolean;
  extra?: boolean;
};

function Dot({ at, order = 0, accent, faint, extra }: DotProps) {
  return (
    <circle
      className={classNames("cfx-dot", extra, accent ? "cfx-dot--accent" : faint ? "cfx-dot--faint" : undefined)}
      cx={at[0]}
      cy={at[1]}
      r={accent ? 4.5 : faint ? 2.4 : 3.6}
      style={{ "--i": order } as CSSProperties}
    />
  );
}

function Ring({ at, order = 0 }: { at: Point; order?: number }) {
  return (
    <circle className="cfx-ring" cx={at[0]} cy={at[1]} r="11" style={{ "--i": order } as CSSProperties} />
  );
}

type LabelProps = {
  at: Point;
  order?: number;
  latin?: boolean;
  accent?: boolean;
  extra?: boolean;
  children: ReactNode;
};

function Label({ at, order = 0, latin, accent, extra, children }: LabelProps) {
  const modifiers = [latin ? "cfx-label--latin" : undefined, accent ? "cfx-label--accent" : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <text
      className={classNames("cfx-label", extra, modifiers || undefined)}
      style={{ "--i": order } as CSSProperties}
      textAnchor="middle"
      x={at[0]}
      y={at[1]}
    >
      {children}
    </text>
  );
}

/* 01 — Revenue Intelligence: a rising path from lead to closed deal. */

const REVENUE_STATIONS = [
  { at: [352, 236] as Point, label: "لید" },
  { at: [277, 204] as Point, label: "امتیاز" },
  { at: [202, 166] as Point, label: "CRM", latin: true },
  { at: [127, 120] as Point, label: "فالوآپ" },
  { at: [52, 66] as Point, label: "بستن", accent: true },
];

const REVENUE_LEADS: Point[] = [
  [386, 250],
  [372, 264],
  [394, 226],
];

function RevenueFigure() {
  return (
    <>
      <line className="cfx-axis" x1="26" x2="378" y1="270" y2="270" />

      {REVENUE_LEADS.map((lead, index) => (
        <g key={`lead-${index}`}>
          <Link extra from={lead} order={index} to={REVENUE_STATIONS[0].at} />
          <Dot extra faint at={lead} order={index} />
        </g>
      ))}

      {REVENUE_STATIONS.slice(0, -1).map((station, index) => (
        <Link from={station.at} key={`path-${index}`} order={index + 1} to={REVENUE_STATIONS[index + 1].at} />
      ))}

      {REVENUE_STATIONS.map((station, index) => (
        <g key={station.label}>
          {station.accent ? <Ring at={station.at} order={index} /> : null}
          <Dot accent={station.accent} at={station.at} order={index} />
          <Label at={[station.at[0], station.at[1] - 17]} latin={station.latin} order={index}>
            {station.label}
          </Label>
        </g>
      ))}
    </>
  );
}

/* 02 — Business Intelligence: scattered sources, one layer, one answer. */

const BI_SOURCES = [
  { at: [350, 62] as Point, label: "CRM", latin: true },
  { at: [350, 122] as Point, label: "ERP", latin: true },
  { at: [350, 182] as Point, label: "حسابداری" },
  { at: [350, 242] as Point, label: "عملیات", extra: true },
];

const BI_CORE: Point = [206, 152];
const BI_BARS = [
  { x: 60, height: 28 },
  { x: 82, height: 44 },
  { x: 104, height: 60 },
];

function BusinessFigure() {
  return (
    <>
      {BI_SOURCES.map((source, index) => (
        <g key={source.label}>
          <Link extra={source.extra} from={source.at} order={index} to={BI_CORE} />
          <Dot extra={source.extra} at={source.at} order={index} />
          <Label at={[source.at[0], source.at[1] - 16]} extra={source.extra} latin={source.latin} order={index}>
            {source.label}
          </Label>
        </g>
      ))}

      <Ring at={BI_CORE} order={4} />
      <Dot accent at={BI_CORE} order={4} />

      <Link dashed from={BI_CORE} order={5} to={[152, 66]} />
      <rect className="cfx-frame" height="34" rx="17" width="118" x="34" y="49" />
      <Label at={[93, 71]} order={6}>
        سؤال مدیر
      </Label>

      <Link from={BI_CORE} order={6} to={[128, 216]} />
      <Dot at={[128, 216]} order={6} />
      {BI_BARS.map((bar, index) => (
        <rect
          className="cfx-bar"
          height={bar.height}
          key={`bar-${bar.x}`}
          rx="2"
          style={{ "--i": index + 7 } as CSSProperties}
          width="10"
          x={bar.x}
          y={238 - bar.height}
        />
      ))}
      <Label at={[87, 258]} order={9}>
        بینش
      </Label>
    </>
  );
}

/* 03 — Voice Intelligence: call, transcript, insight, action. */

const WAVEFORM = [10, 18, 30, 44, 26, 52, 38, 60, 32, 20, 42, 24, 12];

function VoiceFigure() {
  return (
    <>
      {WAVEFORM.map((height, index) => (
        <rect
          className={index % 3 === 2 ? "cfx-wave cfx-extra" : "cfx-wave"}
          height={height}
          key={`wave-${index}`}
          rx="1"
          style={{ "--i": index } as CSSProperties}
          width="2"
          x={300 + index * 7}
          y={150 - height / 2}
        />
      ))}
      <Label at={[344, 106]} order={2}>
        تماس
      </Label>

      <Link from={[296, 150]} order={3} to={[274, 150]} />

      <rect className="cfx-frame" height="68" rx="14" width="106" x="168" y="116" />
      <line className="cfx-rule" x1="184" x2="258" y1="134" y2="134" />
      <line className="cfx-rule" x1="184" x2="240" y1="150" y2="150" />
      <line className="cfx-rule cfx-extra" x1="184" x2="252" y1="166" y2="166" />
      <Label at={[221, 202]} order={4}>
        رونویسی
      </Label>

      <Link from={[168, 150]} order={5} to={[118, 150]} />
      <Ring at={[118, 150]} order={5} />
      <Dot accent at={[118, 150]} order={5} />
      <Label at={[118, 126]} order={6}>
        بینش
      </Label>

      <Link from={[118, 150]} order={6} to={[48, 150]} />
      <Dot at={[48, 150]} order={6} />
      <Label at={[48, 126]} latin order={7}>
        CRM
      </Label>
    </>
  );
}

/* 04 — AI Customer Agents: every channel, one agent, two outcomes. */

const AGENT_CHANNELS = [
  { at: [348, 78] as Point, label: "سایت" },
  { at: [348, 152] as Point, label: "واتساپ" },
  { at: [348, 226] as Point, label: "تلگرام", extra: true },
];

const AGENT_CORE: Point = [200, 152];

function AgentsFigure() {
  return (
    <>
      {AGENT_CHANNELS.map((channel, index) => (
        <g key={channel.label}>
          <Link extra={channel.extra} from={channel.at} order={index} to={AGENT_CORE} />
          <Dot extra={channel.extra} at={channel.at} order={index} />
          <Label at={[channel.at[0], channel.at[1] - 16]} extra={channel.extra} order={index}>
            {channel.label}
          </Label>
        </g>
      ))}

      <Ring at={AGENT_CORE} order={3} />
      <Dot accent at={AGENT_CORE} order={3} />
      <Label at={[200, 186]} order={4}>
        ایجنت
      </Label>

      <Link from={AGENT_CORE} order={5} to={[62, 100]} />
      <Dot at={[62, 100]} order={5} />
      <Label at={[62, 80]} order={6}>
        اقدام خودکار
      </Label>

      <Link dashed from={AGENT_CORE} order={6} to={[62, 208]} />
      <Dot at={[62, 208]} order={6} />
      <Label at={[62, 232]} order={7}>
        تحویل به انسان
      </Label>
    </>
  );
}

/* 05 — Connected Automation: separate systems on one running line. */

const BUS_Y = 150;

const AUTOMATION_SYSTEMS = [
  { x: 340, above: true, label: "CRM", latin: true },
  { x: 255, above: true, label: "ERP", latin: true },
  { x: 170, above: true, label: "حسابداری", extra: true },
  { x: 85, above: true, label: "سایت" },
  { x: 297, above: false, label: "پیام‌رسان", extra: true },
  { x: 212, above: false, label: "تلفن" },
  { x: 127, above: false, label: "دیتابیس", extra: true },
];

function AutomationFigure() {
  return (
    <>
      <line className="cfx-bus" x1="36" x2="372" y1={BUS_Y} y2={BUS_Y} />

      {[0, 1].map((index) => (
        <line
          className="cfx-flow"
          key={`flow-${index}`}
          style={{ "--len": 336, "--i": index } as CSSProperties}
          x1="372"
          x2="36"
          y1={BUS_Y}
          y2={BUS_Y}
        />
      ))}

      {AUTOMATION_SYSTEMS.map((system, index) => {
        const y = system.above ? 86 : 214;

        return (
          <g key={system.label}>
            <Link extra={system.extra} from={[system.x, y]} order={index} to={[system.x, BUS_Y]} />
            <Dot extra={system.extra} at={[system.x, y]} order={index} />
            <Label
              at={[system.x, system.above ? y - 20 : y + 26]}
              extra={system.extra}
              latin={system.latin}
              order={index}
            >
              {system.label}
            </Label>
          </g>
        );
      })}
    </>
  );
}

/* 06 — Custom AI Systems: modules assembling into one architecture. */

const CUSTOM_BLOCKS = [
  { x: 58, y: 74, width: 110, height: 60 },
  { x: 178, y: 74, width: 84, height: 60 },
  { x: 272, y: 74, width: 70, height: 102, accent: true },
  { x: 58, y: 144, width: 64, height: 82 },
  { x: 132, y: 144, width: 130, height: 32 },
  { x: 132, y: 186, width: 130, height: 40 },
  { x: 272, y: 186, width: 70, height: 40 },
];

function CustomFigure() {
  return (
    <>
      <rect className="cfx-frame cfx-frame--outer" height="188" rx="22" width="320" x="40" y="56" />

      {CUSTOM_BLOCKS.map((block, index) => (
        <rect
          className={block.accent ? "cfx-block cfx-block--accent" : "cfx-block"}
          height={block.height}
          key={`block-${block.x}-${block.y}`}
          rx="10"
          style={{ "--i": index } as CSSProperties}
          width={block.width}
          x={block.x}
          y={block.y}
        />
      ))}

      <Label accent at={[307, 130]} latin order={7}>
        AI
      </Label>
      <Label at={[200, 272]} order={8}>
        معماری اختصاصی
      </Label>
    </>
  );
}

const FIGURES: Record<CapabilityFigureId, () => ReactNode> = {
  1: RevenueFigure,
  2: BusinessFigure,
  3: VoiceFigure,
  4: AgentsFigure,
  5: AutomationFigure,
  6: CustomFigure,
};

export function CapabilityFigure({ id }: { id: CapabilityFigureId }) {
  const Figure = FIGURES[id];

  return (
    <svg
      aria-hidden="true"
      className="cfx"
      data-figure={id}
      focusable="false"
      role="presentation"
      viewBox="0 0 400 300"
    >
      <Figure />
    </svg>
  );
}

export type { CapabilityFigureId };
