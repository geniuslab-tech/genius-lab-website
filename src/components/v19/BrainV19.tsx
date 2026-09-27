"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Delaunay } from "d3-delaunay";
import { mulberry32, r1, useInView, useReduced } from "./hooks";
import { SectionHead, rd } from "./ui";

type Ctx = 0 | 1 | 2;

const TOPICS: { name: string; body: string }[] = [
  {
    name: "Semantic Context",
    body: "What every number means. Shared definitions for metrics, tables and dashboards, so revenue means the same thing in every report.",
  },
  {
    name: "Business Context",
    body: "How the company actually works. Customers, operations and finance, and the relationships that connect them.",
  },
  {
    name: "Event Context",
    body: "What is happening right now. Transactions, process steps and system events, captured as they occur.",
  },
];

const VW = 760;
const VH = 540;
const CENTER = { x: 380, y: 270 };
const CLUSTERS = [
  { x: 210, y: 170 },
  { x: 560, y: 180 },
  { x: 390, y: 420 },
];

const HUBS: { label: string; kind: string; ctx: Ctx; x: number; y: number }[] = [
  { label: "metrics.revenue", kind: "Metric", ctx: 0, x: 150, y: 120 },
  { label: "gross_margin", kind: "Metric", ctx: 0, x: 262, y: 94 },
  { label: "definitions", kind: "Glossary", ctx: 0, x: 118, y: 232 },
  { label: "bi.dashboards", kind: "Dashboard", ctx: 0, x: 262, y: 236 },
  { label: "customers", kind: "Object", ctx: 1, x: 520, y: 100 },
  { label: "orders", kind: "Object", ctx: 1, x: 640, y: 140 },
  { label: "suppliers", kind: "Object", ctx: 1, x: 620, y: 262 },
  { label: "finance.gl", kind: "System", ctx: 1, x: 490, y: 236 },
  { label: "transactions", kind: "Event stream", ctx: 2, x: 290, y: 430 },
  { label: "process.steps", kind: "Event stream", ctx: 2, x: 420, y: 486 },
  { label: "ops.events", kind: "Event stream", ctx: 2, x: 500, y: 400 },
];

/** A seeded graph: labeled hubs, a cloud of smaller facts around each context, and the core. */
const GRAPH = (() => {
  const rand = mulberry32(1919);
  const pts: { x: number; y: number; ctx: Ctx | -1; hub: number }[] = [{ ...CENTER, ctx: -1, hub: -1 }];
  HUBS.forEach((h, i) => pts.push({ x: h.x, y: h.y, ctx: h.ctx, hub: i }));
  CLUSTERS.forEach((c, ci) => {
    for (let k = 0; k < 13; k++) {
      const a = rand() * Math.PI * 2;
      const d = 40 + rand() * 120;
      pts.push({ x: r1(Math.min(VW - 20, Math.max(20, c.x + Math.cos(a) * d * 1.2))), y: r1(Math.min(VH - 20, Math.max(20, c.y + Math.sin(a) * d * 0.8))), ctx: ci as Ctx, hub: -1 });
    }
  });
  const del = Delaunay.from(pts.map((p) => [p.x, p.y] as [number, number]));
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  const t = del.triangles;
  for (let i = 0; i < t.length; i += 3) {
    for (const [a, b] of [
      [t[i], t[i + 1]],
      [t[i + 1], t[i + 2]],
      [t[i + 2], t[i]],
    ]) {
      const k = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (seen.has(k)) continue;
      seen.add(k);
      const dx = pts[a].x - pts[b].x;
      const dy = pts[a].y - pts[b].y;
      if (Math.hypot(dx, dy) < 150) edges.push([a, b]);
    }
  }
  // Every hub is wired to the core.
  const kept = new Set(edges.map(([a, b]) => (a < b ? `${a}-${b}` : `${b}-${a}`)));
  HUBS.forEach((_, i) => {
    if (!kept.has(`0-${i + 1}`)) edges.push([0, i + 1]);
  });
  const nbrs = pts.map(() => new Set<number>());
  edges.forEach(([a, b]) => {
    nbrs[a].add(b);
    nbrs[b].add(a);
  });
  return { pts, edges, nbrs };
})();

const CYCLE_MS = 5000;

export function BrainV19() {
  const reduce = useReduced();
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, "-20% 0px");
  const [topic, setTopic] = useState<Ctx>(0);
  const [touched, setTouched] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    if (!inView || reduce || touched || hover !== null) return;
    const t = setTimeout(() => setTopic((a) => ((a + 1) % 3) as Ctx), CYCLE_MS);
    return () => clearTimeout(t);
  }, [inView, reduce, touched, hover, topic]);

  const lit = useMemo(() => {
    const nodes = new Set<number>();
    if (hover !== null) {
      nodes.add(hover);
      GRAPH.nbrs[hover].forEach((n) => nodes.add(n));
    } else {
      GRAPH.pts.forEach((p, i) => p.ctx === topic && nodes.add(i));
      nodes.add(0);
    }
    return nodes;
  }, [hover, topic]);

  const edgeLit = (a: number, b: number) => (hover !== null ? a === hover || b === hover : lit.has(a) && lit.has(b) && (GRAPH.pts[a].ctx === topic || GRAPH.pts[b].ctx === topic));

  const info = hover !== null && hover > 0 ? GRAPH.pts[hover] : null;
  const infoHub = info && info.hub >= 0 ? HUBS[info.hub] : null;
  const linkedHubs = hover !== null ? [...GRAPH.nbrs[hover]].filter((n) => GRAPH.pts[n].hub >= 0).map((n) => HUBS[GRAPH.pts[n].hub].label) : [];

  const pick = (i: Ctx) => {
    setTouched(true);
    setTopic(i);
  };

  return (
    <section ref={root} id="brain" className="relative isolate scroll-mt-16 overflow-hidden py-24 sm:py-32" aria-labelledby="v19-brain-title">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_55%_at_70%_50%,#0d1640_0%,transparent_70%)]" aria-hidden="true" />
      <div className="v19-wrap grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <SectionHead
            n="02"
            id="v19-brain-title"
            kicker="Second Brain"
            title="A Second Brain for your business."
            lead="The intelligence layer holds the full context of the company: its systems, tables, metrics, dashboards, processes, customers, operations and finances. AI Agents work on top of it, end to end."
          />
          <ol className="mt-10 space-y-2" aria-label="Context in the Second Brain">
            {TOPICS.map((t, i) => {
              const on = i === topic && hover === null;
              return (
                <li key={t.name} className="v19-rv" style={rd(160 + i * 70)}>
                  <button
                    type="button"
                    onClick={() => pick(i as Ctx)}
                    aria-pressed={i === topic}
                    data-on={on || undefined}
                    className={`v19-beam relative w-full overflow-hidden rounded-[12px] border px-4 py-3.5 text-left transition-colors duration-300 ${on ? "border-[rgb(var(--acc-rgb)/0.35)] bg-white/[0.03]" : "border-[color:var(--line)] hover:border-[color:var(--line-2)]"}`}
                  >
                    <span className="flex items-center justify-between gap-4">
                      <span className={`font-medium ${on ? "text-white" : "text-[color:var(--tx-2)]"}`}>{t.name}</span>
                      <span className="v19-label text-[color:var(--tx-3)]">0{i + 1}</span>
                    </span>
                    <span className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease)] ${i === topic ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <span className="overflow-hidden">
                        <span className="block pt-2 text-[0.9375rem] leading-[1.6] text-[color:var(--tx-2)]">{t.body}</span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="v19-rv lg:col-span-8" style={rd(120)}>
          <div className="v19-conic relative rounded-[18px] bg-[color:var(--g2)]">
            <div className="flex items-center justify-between border-b border-[color:var(--line)] px-5 py-3">
              <span className="text-[0.8125rem] font-medium">Knowledge graph</span>
              <span className="v19-label text-[color:var(--tx-3)]">
                <span className="hidden sm:inline">Hover a node · </span>illustrative
              </span>
            </div>
            <div className="relative p-2 sm:p-4" onPointerLeave={() => setHover(null)}>
              <svg viewBox={`0 0 ${VW} ${VH}`} className="h-auto w-full" aria-label={`Knowledge graph. Highlighted: ${infoHub ? infoHub.label : TOPICS[topic].name}.`} role="group">
                <defs>
                  <radialGradient id="v19-core">
                    <stop offset="0" stopColor="#5b8cff" stopOpacity="0.55" />
                    <stop offset="1" stopColor="#5b8cff" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx={CENTER.x} cy={CENTER.y} r="150" fill="url(#v19-core)" />
                {GRAPH.edges.map(([a, b]) => {
                  const on = edgeLit(a, b);
                  const A = GRAPH.pts[a];
                  const B = GRAPH.pts[b];
                  return (
                    <line
                      key={`${a}-${b}`}
                      x1={A.x}
                      y1={A.y}
                      x2={B.x}
                      y2={B.y}
                      className={`v19-kg-edge ${on && !reduce ? "v19-kg-flow" : ""}`}
                      stroke={on ? "#8fb0ff" : "rgb(150 170 255)"}
                      strokeOpacity={on ? 0.75 : 0.1}
                      strokeWidth={on ? 1.2 : 0.8}
                      strokeDasharray={on && !reduce ? "6 4" : undefined}
                    />
                  );
                })}
                {GRAPH.pts.map((p, i) => {
                  if (p.hub >= 0 || i === 0) return null;
                  const on = lit.has(i);
                  return (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r={hover === i ? 6 : on ? 3.6 : 2.6}
                      className="v19-kg-node cursor-pointer"
                      fill={on ? "#a9c3ff" : "rgb(150 170 255 / 0.35)"}
                      onPointerEnter={() => setHover(i)}
                    />
                  );
                })}
                {HUBS.map((h, hi) => {
                  const i = hi + 1;
                  const on = lit.has(i);
                  const isHover = hover === i;
                  return (
                    <g
                      key={h.label}
                      tabIndex={0}
                      role="button"
                      aria-label={`${h.label}, ${h.kind}, ${TOPICS[h.ctx].name}`}
                      className="cursor-pointer outline-none"
                      onPointerEnter={() => setHover(i)}
                      onFocus={() => setHover(i)}
                      onBlur={() => setHover(null)}
                    >
                      {on && <circle cx={h.x} cy={h.y} r={isHover ? 26 : 16} fill="#5b8cff" fillOpacity={isHover ? 0.28 : 0.16} className="v19-kg-node" />}
                      <circle cx={h.x} cy={h.y} r={isHover ? 8 : 6} fill={on ? "#dbe6ff" : "#27306a"} stroke={on ? "#5b8cff" : "rgb(150 170 255 / 0.35)"} strokeWidth="1.5" className="v19-kg-node" />
                      <text x={h.x} y={h.y - 14} textAnchor="middle" fontSize="12" className="v19-mono" fill={on ? "#eef1fa" : "rgb(222 228 247 / 0.5)"} style={{ transition: "fill 300ms" }}>
                        {h.label}
                      </text>
                    </g>
                  );
                })}
                <g onPointerEnter={() => setHover(0)} className="cursor-pointer">
                  <path d={`M${CENTER.x - 24} ${CENTER.y - 40}h48l24 40-24 40h-48l-24-40z`} fill="#0b1133" stroke="#5b8cff" strokeWidth="1.6" />
                  <text x={CENTER.x} y={CENTER.y - 2} textAnchor="middle" fontSize="11" fontWeight="600" fill="#eef1fa">
                    Second
                  </text>
                  <text x={CENTER.x} y={CENTER.y + 12} textAnchor="middle" fontSize="11" fontWeight="600" fill="#eef1fa">
                    Brain
                  </text>
                </g>
              </svg>

              {/* Readout for the node under the cursor. */}
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-col gap-1 sm:bottom-6 sm:left-6 sm:right-auto sm:w-[300px]" aria-live="polite">
                <div className={`rounded-[12px] border border-[color:var(--line-2)] bg-[#0a0e24] p-3.5 transition-[opacity,transform] duration-300 ${hover !== null ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}>
                  {hover === 0 ? (
                    <>
                      <p className="v19-label text-[color:var(--acc-2)]">Core</p>
                      <p className="mt-1 text-[0.9375rem] font-medium">Second Brain</p>
                      <p className="mt-1 text-[0.8125rem] text-[color:var(--tx-2)]">Linked to all {HUBS.length} hubs across semantic, business and event context.</p>
                    </>
                  ) : info ? (
                    <>
                      <p className="v19-label text-[color:var(--acc-2)]">
                        {infoHub ? infoHub.kind : "Fact"} · {TOPICS[info.ctx as Ctx].name}
                      </p>
                      <p className="v19-mono mt-1 text-[0.875rem] text-white">{infoHub ? infoHub.label : `node_${String(hover).padStart(3, "0")}`}</p>
                      <p className="mt-1 text-[0.8125rem] text-[color:var(--tx-2)]">
                        {GRAPH.nbrs[hover ?? 0].size} links{linkedHubs.length ? `, including ${linkedHubs.slice(0, 3).join(", ")}` : ""}.
                      </p>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
