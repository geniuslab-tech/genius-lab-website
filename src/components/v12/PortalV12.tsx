"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ChartLineUp, FlowArrow, Lightning, Plugs, Robot, ShieldCheck, type Icon } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/v2/ui";
import { Illustrative, SectionHead, Tile, TileHead } from "./ui";

type Row = { a: string; b: string; tone: "ok" | "run" | "warn" | "mute" };

const MODULES: { id: string; Icon: Icon; name: string; body: string; rows: Row[] }[] = [
  {
    id: "connectors",
    Icon: Plugs,
    name: "Connectors",
    body: "Ready integrations for ERP, CRM, finance, files and APIs.",
    rows: [
      { a: "ERP · orders, invoices", b: "in sync", tone: "ok" },
      { a: "CRM · accounts, deals", b: "in sync", tone: "ok" },
      { a: "Finance · general ledger", b: "syncing", tone: "run" },
    ],
  },
  {
    id: "transform",
    Icon: FlowArrow,
    name: "Data Transformation",
    body: "Pipelines that clean, model and unify data, tested like software.",
    rows: [
      { a: "stg_orders → fct_sales", b: "tests passed", tone: "ok" },
      { a: "stg_accounts → dim_customer", b: "tests passed", tone: "ok" },
      { a: "stg_gl → fct_finance", b: "running", tone: "run" },
    ],
  },
  {
    id: "analytics",
    Icon: ChartLineUp,
    name: "Analytics",
    body: "Dashboards, drill-downs and forecasts on one shared model.",
    rows: [
      { a: "Executive overview", b: "shared", tone: "ok" },
      { a: "Margin by region", b: "drill-down", tone: "mute" },
      { a: "90-day cash forecast", b: "refreshing", tone: "run" },
    ],
  },
  {
    id: "governance",
    Icon: ShieldCheck,
    name: "Governance",
    body: "Definitions, lineage, access and audit trails in one place.",
    rows: [
      { a: "gross_margin · owner: Finance", b: "certified", tone: "ok" },
      { a: "active_customer · owner: Sales", b: "certified", tone: "ok" },
      { a: "headcount · owner: People", b: "review", tone: "warn" },
    ],
  },
  {
    id: "automation",
    Icon: Lightning,
    name: "Automation",
    body: "Alerts, workflows and scheduled actions across your systems.",
    rows: [
      { a: "Cash below floor → alert CFO", b: "armed", tone: "ok" },
      { a: "Month-end → close checklist", b: "scheduled", tone: "mute" },
      { a: "Stock below reorder → notify ops", b: "fired", tone: "warn" },
    ],
  },
  {
    id: "agents",
    Icon: Robot,
    name: "AI Agents",
    body: "Agents that read the Second Brain and answer or act.",
    rows: [
      { a: "Finance agent", b: "answering", tone: "run" },
      { a: "Operations agent", b: "idle", tone: "mute" },
      { a: "Board-pack agent", b: "drafting", tone: "run" },
    ],
  },
];

const TONE: Record<Row["tone"], string> = {
  ok: "bg-(--lime) text-(--ink)",
  run: "bg-(--blue-soft) text-(--blue-ink)",
  warn: "bg-(--coral-soft) text-(--coral)",
  mute: "bg-(--ground-2) text-(--ink-2)",
};

function PortalWindow() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const m = MODULES[active];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const n = MODULES.length;
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (active + 1) % n;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (active - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="overflow-hidden rounded-[14px] bg-white shadow-[0_0_0_1px_var(--rule-2),0_30px_60px_-40px_rgb(16_20_64/0.45)]">
      {/* Title bar */}
      <div className="flex items-center justify-between gap-3 border-b border-(--rule) bg-(--ground) px-4 py-2.5">
        <span className="flex items-center gap-3">
          <BrandLogo tone="navy" className="h-[11px] w-auto" />
          <span className="h-3 w-px bg-(--rule-2)" aria-hidden="true" />
          <span className="text-[0.8125rem] font-medium text-(--ink-2)">Portal</span>
        </span>
        <span className="v12-mono hidden truncate text-[0.6875rem] text-(--ink-3) sm:block">portal / {m.id}</span>
      </div>

      <div className="grid sm:grid-cols-[210px_1fr]">
        <div role="tablist" aria-label="Genius Portal modules" aria-orientation="vertical" className="flex gap-1 overflow-x-auto border-(--rule) p-2 max-sm:border-b sm:flex-col sm:border-r">
          {MODULES.map((x, i) => {
            const on = i === active;
            return (
              <button
                key={x.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`v12-tab-${x.id}`}
                aria-selected={on}
                aria-controls="v12-portal-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={onKey}
                className={`flex shrink-0 items-center gap-2.5 rounded-[9px] px-3 py-2 text-left text-[0.8125rem] font-medium transition-colors duration-200 ${
                  on ? "bg-(--ink) text-white" : "text-(--ink-2) hover:bg-(--ground) hover:text-(--ink)"
                }`}
              >
                <x.Icon size={15} weight={on ? "fill" : "regular"} aria-hidden="true" />
                <span className="whitespace-nowrap">{x.name}</span>
              </button>
            );
          })}
        </div>

        <div id="v12-portal-panel" role="tabpanel" aria-labelledby={`v12-tab-${m.id}`} className="min-h-[300px] p-4 sm:p-6">
          <div key={m.id} className="v12-intro [--d:0ms]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[1.25rem] font-semibold tracking-[-0.025em]">{m.name}</h3>
                <p className="mt-1 max-w-[44ch] text-[0.9375rem] leading-[1.6] text-(--ink-2)">{m.body}</p>
              </div>
            </div>
            <ul className="mt-5 grid gap-1.5">
              {m.rows.map((r) => (
                <li key={r.a} className="v12-well flex items-center justify-between gap-3 px-3.5 py-3">
                  <span className="v12-mono min-w-0 truncate text-[0.75rem] text-(--ink)">{r.a}</span>
                  <span className={`v12-chip shrink-0 ${TONE[r.tone]}`}>{r.b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 grid grid-cols-3 gap-1.5" aria-hidden="true">
              {[0.72, 0.46, 0.88].map((w, i) => (
                <span key={i} className="h-1.5 overflow-hidden rounded-full bg-(--ground-2)">
                  <span className="block h-full rounded-full bg-(--ink)/80" style={{ width: `${Math.round(w * 100)}%` }} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- System graph: everything you run, connected into one layer ---------- */

const SYSTEMS = [
  { name: "ERP", note: "Orders, invoices, inventory" },
  { name: "CRM", note: "Accounts, deals, pipeline" },
  { name: "Warehouse", note: "Your existing data platform" },
  { name: "BI tools", note: "The dashboards people already use" },
  { name: "Sheets", note: "Plans, budgets and trackers" },
  { name: "Cloud apps", note: "HR, payroll, support and more" },
];

const W = 360;
const H = 320;
const CX = W / 2;
const CY = H / 2;
const NODES = SYSTEMS.map((s, i) => {
  const ang = -Math.PI / 2 + (i * 2 * Math.PI) / SYSTEMS.length;
  return { ...s, x: Number((CX + Math.cos(ang) * 132).toFixed(1)), y: Number((CY + Math.sin(ang) * 118).toFixed(1)) };
});

function SystemGraph() {
  const [hot, setHot] = useState<number | null>(null);
  const [hub, setHub] = useState(false);
  const lit = (i: number) => hub || hot === i;
  const label = hot !== null ? `${NODES[hot].name}: ${NODES[hot].note}` : hub ? "Every system connected into one layer" : "Hover or focus a system";

  return (
    <div className="flex h-full flex-col">
      <TileHead label="Builds on what you run" right={<span className="v12-mono text-[0.6875rem] text-(--ink-3)">6 systems · 1 layer</span>} />
      <div className="relative mx-auto mt-4 w-full max-w-[420px]" onPointerLeave={() => setHot(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden="true">
          {NODES.map((n, i) => {
            const mx = ((n.x + CX) / 2).toFixed(1);
            const my = ((n.y + CY) / 2 + (i % 2 ? 14 : -14)).toFixed(1);
            const d = `M${n.x},${n.y} Q${mx},${my} ${CX},${CY}`;
            return (
              <g key={n.name}>
                <path d={d} fill="none" stroke="var(--rule-2)" strokeWidth="1.25" />
                <path
                  d={d}
                  fill="none"
                  stroke="var(--blue)"
                  strokeWidth="2"
                  className={`v12-dash transition-opacity duration-300 ${lit(i) ? "opacity-100" : "opacity-0"}`}
                />
              </g>
            );
          })}
          <circle cx={CX} cy={CY} r="44" fill="var(--ground)" stroke="var(--rule-2)" />
          <circle cx={CX} cy={CY} r="34" className={`transition-[fill] duration-300 ${hub || hot !== null ? "fill-(--ink)" : "fill-white"}`} stroke="var(--rule-2)" />
        </svg>

        <button
          type="button"
          onPointerEnter={() => setHub(true)}
          onPointerLeave={() => setHub(false)}
          onFocus={() => setHub(true)}
          onBlur={() => setHub(false)}
          className={`absolute flex h-[20%] w-[18%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-center text-[0.625rem] font-semibold leading-tight tracking-[-0.01em] transition-colors duration-300 sm:text-[0.6875rem] ${
            hub || hot !== null ? "text-white" : "text-(--ink)"
          }`}
          style={{ left: "50%", top: "50%" }}
          aria-label="Genius Lab: every system connected into one layer"
        >
          Genius Lab
        </button>

        {NODES.map((n, i) => (
          <button
            key={n.name}
            type="button"
            onPointerEnter={() => setHot(i)}
            onFocus={() => setHot(i)}
            onBlur={() => setHot(null)}
            aria-label={`${n.name}: ${n.note}`}
            className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-[0.75rem] font-semibold transition-[background-color,color,box-shadow,scale] duration-500 ease-[var(--spring)] sm:text-[0.8125rem] ${
              lit(i) ? "scale-105 bg-(--blue) text-white shadow-[0_8px_20px_-8px_rgb(43_85_255/0.7)]" : "bg-white text-(--ink) shadow-[0_0_0_1px_var(--rule-2)]"
            }`}
            style={{ left: `${((n.x / W) * 100).toFixed(2)}%`, top: `${((n.y / H) * 100).toFixed(2)}%` }}
          >
            {n.name}
          </button>
        ))}
      </div>
      <p className="mt-auto min-h-[2.75rem] pt-3 text-[0.875rem] text-(--ink-2)" aria-live="polite">
        {label}
      </p>
    </div>
  );
}

export function PortalV12() {
  return (
    <section id="portal" className="scroll-mt-24 py-20 sm:py-28" aria-labelledby="v12-portal-title">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <SectionHead
          id="v12-portal-title"
          index="04"
          label="Genius Portal"
          title="Expertise and technology, working as one."
          lead="Our specialists build on the Genius Portal, our own platform. Everything a client needs to connect, govern and run intelligence lives in one place."
        />
        <div className="mt-12 grid gap-3 sm:gap-4 lg:grid-cols-12">
          <Tile className="p-3 sm:p-4 lg:col-span-8">
            <div className="flex items-center justify-between gap-3 px-2 pb-3 pt-1">
              <span className="v12-label text-(--ink-3)">Inside the Genius Portal</span>
              <Illustrative>Illustrative preview</Illustrative>
            </div>
            <PortalWindow />
          </Tile>
          <Tile delay={80} className="p-5 sm:p-6 lg:col-span-4">
            <SystemGraph />
          </Tile>
        </div>
      </div>
    </section>
  );
}
