import type { CSSProperties } from "react";
import { mulberry32, round } from "./math";
import { HexMark } from "./ui";

/*
 * The Genius Portal console, drawn as nine panels on one flat grid so each can fly on its own.
 * Every figure here is illustrative. In the hero the panels start scattered in depth (the
 * fragmented business) and assemble as the page scrolls; elsewhere the console is static.
 */

export const FRAGS = ["top", "side", "k1", "k2", "k3", "k4", "chart", "sys", "agent"] as const;
type Frag = (typeof FRAGS)[number];

/** Where each fragment waits before it assembles: offset in vw/vh, depth in px, tilt in degrees. */
const rand = mulberry32(2323);
export const SCATTER = FRAGS.map((f, i) => {
  const side = i % 2 ? 1 : -1;
  return {
    f,
    x: round(side * (14 + rand() * 30), 1),
    y: round((rand() * 2 - 1) * 26, 1),
    z: Math.round(-380 - rand() * 900),
    rx: round((rand() * 2 - 1) * 22, 1),
    ry: round(side * (10 + rand() * 22), 1),
    rz: round((rand() * 2 - 1) * 9, 1),
    delay: round(0.04 + rand() * 0.26, 3),
  };
});

/** Source tags shown on a fragment while it is still loose. */
const SOURCE: Record<Frag, string> = {
  top: "portal.shell",
  side: "access.roles",
  k1: "erp.orders",
  k2: "gl.entries",
  k3: "ar.invoices",
  k4: "wms.shipments",
  chart: "fpa.plan_v3.xlsx",
  sys: "crm.accounts",
  agent: "brain.context",
};

export const scatterTransform = (s: (typeof SCATTER)[number], k = 1) =>
  `translate3d(${round(s.x * k, 2)}vw,${round(s.y * k, 2)}vh,${Math.round(s.z * k)}px) rotateX(${round(s.rx * k, 2)}deg) rotateY(${round(s.ry * k, 2)}deg) rotateZ(${round(s.rz * k, 2)}deg)`;

const KPIS = [
  { k: "k1", name: "Revenue, YTD", value: "$48.2M", delta: "+6.4% vs plan", up: true, seed: 11 },
  { k: "k2", name: "EBITDA margin", value: "17.1%", delta: "+0.9 pts", up: true, seed: 12 },
  { k: "k3", name: "Cash, 90-day low", value: "$4.6M", delta: "Week 7", up: false, seed: 13 },
  { k: "k4", name: "On-time delivery", value: "94.2%", delta: "+1.3 pts", up: true, seed: 14 },
] as const;

function spark(seed: number, n = 16) {
  const r = mulberry32(seed);
  let v = 0.5;
  return Array.from({ length: n }, (_, i) => {
    v = Math.min(0.95, Math.max(0.05, v + (r() - 0.45) * 0.22));
    return `${round((i / (n - 1)) * 100, 1)},${round((1 - v) * 28, 1)}`;
  }).join(" ");
}

const r12 = mulberry32(77);
const BARS = Array.from({ length: 12 }, (_, i) => ({
  actual: round(0.42 + i * 0.03 + r12() * 0.12, 3),
  plan: round(0.46 + i * 0.028, 3),
}));
const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

const SYSTEMS = [
  { name: "ERP", note: "synced 2m ago" },
  { name: "CRM", note: "synced 4m ago" },
  { name: "General ledger", note: "synced 6m ago" },
  { name: "Warehouse", note: "streaming" },
  { name: "Planning sheets", note: "synced 1h ago" },
];

const NAV = ["Overview", "Connectors", "Pipelines", "Metrics", "Second Brain", "Agents", "Governance"];

function Tag({ f }: { f: Frag }) {
  return (
    <span className="v23-frag-tag v23-mono" aria-hidden="true">
      {SOURCE[f]}
    </span>
  );
}

export function Console({ scatter = false, className = "" }: { scatter?: boolean; className?: string }) {
  const fragProps = (f: Frag) => {
    const s = SCATTER.find((x) => x.f === f)!;
    return {
      "data-frag": f,
      className: `v23-frag v23-frag-${f}`,
      style: scatter ? ({ "--sc": scatterTransform(s) } as CSSProperties) : undefined,
    };
  };

  return (
    <div className={`v23-console ${scatter ? "is-scatter" : ""} ${className}`} aria-hidden="true">
      <div className="v23-console-frame" data-frame aria-hidden="true" />

      <div {...fragProps("top")}>
        <Tag f="top" />
        <div className="flex h-full items-center gap-3 px-4">
          <HexMark size={16} className="text-[#8fd6e6]" />
          <span className="text-[0.8125rem] font-semibold tracking-[-0.01em] text-white">Genius Portal</span>
          <span className="v23-mono hidden text-[0.6875rem] text-white/45 sm:inline">/ Group overview</span>
          <span className="ml-auto hidden h-7 min-w-0 flex-1 items-center rounded-[6px] border border-white/10 px-2.5 text-[0.75rem] text-white/45 md:flex md:max-w-[260px]">
            Ask the Second Brain&hellip;
          </span>
          <span className="v23-mono ml-auto rounded-full border border-white/15 px-2 py-0.5 text-[0.5625rem] uppercase tracking-[0.14em] text-white/60 md:ml-0">
            Illustrative preview
          </span>
        </div>
      </div>

      <div {...fragProps("side")}>
        <Tag f="side" />
        <ul className="grid gap-0.5 p-2.5">
          {NAV.map((n, i) => (
            <li
              key={n}
              className={`flex items-center gap-2 rounded-[6px] px-2.5 py-1.5 text-[0.75rem] ${i === 0 ? "bg-white/[0.07] text-white" : "text-white/55"}`}
            >
              <span className={`h-1.5 w-1.5 rounded-[2px] ${i === 0 ? "bg-[#8fd6e6]" : "bg-white/20"}`} />
              {n}
            </li>
          ))}
        </ul>
      </div>

      {KPIS.map((k) => (
        <div key={k.k} {...fragProps(k.k)}>
          <Tag f={k.k} />
          <div className="p-3.5">
            <p className="text-[0.6875rem] text-white/55">{k.name}</p>
            <p className="v23-num mt-1 text-[1.25rem] font-semibold tracking-[-0.02em] text-white sm:text-[1.375rem]">{k.value}</p>
            <div className="mt-1 flex items-end justify-between gap-2">
              <span className={`v23-mono text-[0.625rem] ${k.up ? "text-[#8fe3c9]" : "text-[#ffc38a]"}`}>{k.delta}</span>
              <svg viewBox="0 0 100 28" className="h-5 w-16 overflow-visible" aria-hidden="true" preserveAspectRatio="none">
                <polyline points={spark(k.seed)} fill="none" stroke={k.up ? "#7fd4e4" : "#ffc38a"} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </div>
        </div>
      ))}

      <div {...fragProps("chart")}>
        <Tag f="chart" />
        <div className="flex h-full flex-col p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.75rem] font-medium text-white/80">Revenue vs plan, trailing 12 months</p>
            <span className="v23-mono hidden text-[0.625rem] text-white/45 sm:inline">actual / plan</span>
          </div>
          <svg viewBox="0 0 240 100" preserveAspectRatio="none" className="mt-3 min-h-[110px] w-full flex-1" aria-hidden="true">
            {[25, 50, 75].map((y) => (
              <line key={y} x1="0" x2="240" y1={y} y2={y} stroke="rgb(255 255 255 / 0.06)" vectorEffect="non-scaling-stroke" />
            ))}
            {BARS.map((b, i) => (
              <rect key={i} x={i * 20 + 5} width="10" y={round(100 - b.actual * 100, 2)} height={round(b.actual * 100, 2)} rx="1.5" fill={i === 11 ? "#8fd6e6" : "rgb(143 190 255 / 0.32)"} />
            ))}
            <polyline
              points={BARS.map((b, i) => `${i * 20 + 10},${round(100 - b.plan * 100, 2)}`).join(" ")}
              fill="none"
              stroke="#ffc38a"
              strokeWidth="1.4"
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="v23-mono mt-1.5 grid grid-cols-12 text-center text-[0.5625rem] text-white/35" aria-hidden="true">
            {MONTHS.map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        </div>
      </div>

      <div {...fragProps("sys")}>
        <Tag f="sys" />
        <div className="p-3.5">
          <p className="text-[0.75rem] font-medium text-white/80">Connected systems</p>
          <ul className="mt-2.5 grid gap-2">
            {SYSTEMS.map((s) => (
              <li key={s.name} className="flex items-center justify-between gap-2 text-[0.6875rem]">
                <span className="flex items-center gap-2 text-white/75">
                  <span className="v23-live-dot" />
                  {s.name}
                </span>
                <span className="v23-mono text-[0.5625rem] text-white/40">{s.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div {...fragProps("agent")}>
        <Tag f="agent" />
        <div className="p-3.5">
          <p className="v23-mono flex items-center gap-2 text-[0.625rem] uppercase tracking-[0.14em] text-[#8fd6e6]">
            <HexMark size={11} /> Finance agent
          </p>
          <p className="mt-2 text-[0.75rem] leading-[1.5] text-white/80">
            Freight costs rose 14% after the July carrier change. Renegotiating recovers about 1.8 margin points.
          </p>
          <div className="mt-3 flex gap-1.5">
            <span className="rounded-[5px] bg-[#d6f1f7] px-2 py-1 text-[0.625rem] font-semibold text-[#07102a]">Review</span>
            <span className="rounded-[5px] border border-white/15 px-2 py-1 text-[0.625rem] text-white/70">Assign owner</span>
          </div>
        </div>
      </div>
    </div>
  );
}
