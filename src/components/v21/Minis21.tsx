import { ArrowUpRight, Check, CircleNotch, Database, Sparkle } from "@phosphor-icons/react/dist/ssr";
import type { CSSProperties } from "react";

/*
  Product mini-UIs for Version 21. All figures are illustrative sample data.
  Geometry is computed at module load and rounded, so server and client agree.
*/

const r1 = (v: number) => Math.round(v * 10) / 10;

function linePath(pts: [number, number][]) {
  return pts.map(([x, y], i) => `${i ? "L" : "M"}${r1(x)} ${r1(y)}`).join(" ");
}

/* ---------- Forecast chart ---------- */

const ACTUAL = [3.4, 3.55, 3.5, 3.78, 3.9, 4.06, 3.98, 4.3, 4.42, 4.25, 4.62, 4.8];
const FORECAST = [4.8, 4.94, 5.06, 5.02, 5.3, 5.48, 5.62];
const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const CW = 560;
const CH = 210;
const PL = 36;
const PR = 10;
const PT = 12;
const PB = 26;
const Y0 = 3;
const Y1 = 6.2;
const N = ACTUAL.length + FORECAST.length - 1;
const cx = (i: number) => PL + ((CW - PL - PR) * i) / (N - 1);
const cy = (v: number) => PT + (CH - PT - PB) * (1 - (v - Y0) / (Y1 - Y0));

const actualPts = ACTUAL.map((v, i) => [cx(i), cy(v)] as [number, number]);
const forecastPts = FORECAST.map((v, i) => [cx(i + ACTUAL.length - 1), cy(v)] as [number, number]);
const ACTUAL_D = linePath(actualPts);
const FORECAST_D = linePath(forecastPts);
const AREA_D = `${ACTUAL_D} L${r1(cx(ACTUAL.length - 1))} ${CH - PB} L${PL} ${CH - PB} Z`;
const BAND_D = (() => {
  const up = FORECAST.map((v, i) => [cx(i + ACTUAL.length - 1), cy(v + i * 0.075)] as [number, number]);
  const lo = FORECAST.map((v, i) => [cx(i + ACTUAL.length - 1), cy(v - i * 0.075)] as [number, number]).reverse();
  return `${linePath(up)} ${lo.map(([x, y]) => `L${r1(x)} ${r1(y)}`).join(" ")} Z`;
})();
const TICKS = [3, 4, 5, 6];

export function ForecastChart({ className = "", delay = 0, title = "Revenue, actual and forecast" }: { className?: string; delay?: number; title?: string }) {
  const last = actualPts[actualPts.length - 1];
  const end = forecastPts[forecastPts.length - 1];
  return (
    <svg
      viewBox={`0 0 ${CW} ${CH}`}
      className={`h-auto w-full ${className}`}
      role="img"
      aria-label={`${title}: illustrative monthly revenue rising from 3.4 to 4.8 million over twelve months, forecast to reach about 5.6 million in six months.`}
      data-rv="draw"
      style={{ "--rd": `${delay}ms` } as CSSProperties}
    >
      {TICKS.map((t) => (
        <g key={t}>
          <line x1={PL} x2={CW - PR} y1={r1(cy(t))} y2={r1(cy(t))} stroke="#ece7df" />
          <text x={PL - 8} y={r1(cy(t)) + 3.5} textAnchor="end" fontSize="10" fill="#7a7c90" className="v21-mono">
            ${t}M
          </text>
        </g>
      ))}
      {MONTHS.map((m, i) =>
        i % 3 === 0 ? (
          <text key={i} x={r1(cx(i))} y={CH - 8} textAnchor="middle" fontSize="10" fill="#7a7c90" className="v21-mono">
            {m}
          </text>
        ) : null,
      )}
      <line x1={r1(last[0])} x2={r1(last[0])} y1={PT} y2={CH - PB} stroke="#d9d1c4" strokeDasharray="2 4" />
      <text x={r1(last[0]) + 6} y={PT + 10} fontSize="10" fill="#5f6178" className="v21-mono">
        Today
      </text>
      <path d={AREA_D} fill="#2f55d4" fillOpacity="0.06" className="v21-fade" />
      <path d={BAND_D} fill="#b0502a" fillOpacity="0.1" className="v21-fade" style={{ "--dd": "1100ms" } as CSSProperties} />
      <path d={ACTUAL_D} pathLength={1} fill="none" stroke="#2f55d4" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" className="v21-draw" />
      <path
        d={FORECAST_D}
        pathLength={1}
        fill="none"
        stroke="#b0502a"
        strokeWidth="2"
        strokeLinecap="round"
        className="v21-draw"
        style={{ "--dd": "900ms" } as CSSProperties}
      />
      <g className="v21-fade" style={{ "--dd": "1500ms" } as CSSProperties}>
        <circle cx={r1(last[0])} cy={r1(last[1])} r="4" fill="#fff" stroke="#2f55d4" strokeWidth="2" />
        <circle cx={r1(end[0])} cy={r1(end[1])} r="4" fill="#fff" stroke="#b0502a" strokeWidth="2" />
      </g>
    </svg>
  );
}

export function ChartLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.6875rem] text-[var(--ink-3)]">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-[2px] w-3 rounded bg-[var(--blue)]" aria-hidden="true" /> Actual
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-[2px] w-3 rounded bg-[var(--terra)]" aria-hidden="true" /> Forecast
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-3 rounded-[2px] bg-[var(--terra)]/15" aria-hidden="true" /> Range
      </span>
    </div>
  );
}

/* ---------- KPI tile ---------- */

function spark(values: number[], w = 88, h = 26) {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  return linePath(values.map((v, i) => [(w * i) / (values.length - 1), h - 2 - ((h - 4) * (v - lo)) / (hi - lo || 1)]));
}

export type Kpi = { label: string; value: string; delta: string; up: boolean; good: boolean; series: number[] };

export const KPIS: Kpi[] = [
  { label: "Revenue, Q3", value: "$14.2M", delta: "+6.4%", up: true, good: true, series: [9, 10, 9.6, 11, 11.4, 12.2, 12, 13.1, 14.2] },
  { label: "EBITDA margin", value: "15.9%", delta: "−2.3 pts", up: false, good: false, series: [17.6, 18, 18.2, 17.9, 18.2, 17.1, 16.4, 16.2, 15.9] },
  { label: "Cash, 90-day low", value: "$4.6M", delta: "Above floor", up: true, good: true, series: [6.1, 5.8, 5.9, 5.2, 5.0, 4.8, 4.6, 5.1, 5.4] },
  { label: "Days sales outstanding", value: "41 days", delta: "−3 days", up: false, good: true, series: [47, 46, 46, 45, 44, 44, 43, 42, 41] },
];

export function KpiTile({ k, delay = 0, className = "" }: { k: Kpi; delay?: number; className?: string }) {
  return (
    <div className={`rounded-[14px] border border-[#ece7df] bg-white p-3.5 ${className}`}>
      <p className="truncate text-[0.6875rem] font-medium text-[var(--ink-3)]">{k.label}</p>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        <p className="v21-mono text-[1.2rem] font-medium leading-none tracking-[-0.02em] text-[var(--ink)]">{k.value}</p>
        <svg viewBox="0 0 88 26" className="h-[22px] w-[64px] shrink-0 overflow-visible" aria-hidden="true" data-rv="draw" style={{ "--rd": `${delay}ms` } as CSSProperties}>
          <path d={spark(k.series)} pathLength={1} fill="none" stroke={k.good ? "#2f55d4" : "#b0502a"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="v21-draw" />
        </svg>
      </div>
      <p className={`mt-2 text-[0.6875rem] font-semibold ${k.good ? "text-[var(--ok)]" : "text-[var(--terra-ink)]"}`}>{k.delta}</p>
    </div>
  );
}

/* ---------- Pipelines ---------- */

const PIPES = [
  { src: "ERP", obj: "General ledger", rows: "1.24M rows", fresh: "4 min ago", tests: "42/42", state: "ok" },
  { src: "CRM", obj: "Opportunities", rows: "86.1K rows", fresh: "6 min ago", tests: "18/18", state: "ok" },
  { src: "Payroll", obj: "Headcount and cost", rows: "12.4K rows", fresh: "1 h ago", tests: "9/9", state: "ok" },
  { src: "Warehouse", obj: "Inventory movements", rows: "402K rows", fresh: "Running", tests: "27/31", state: "run" },
  { src: "Spreadsheets", obj: "Budget 2026", rows: "3.1K rows", fresh: "Yesterday", tests: "6/6", state: "ok" },
] as const;

export function PipelineList() {
  return (
    <div className="overflow-hidden rounded-[14px] border border-[#ece7df] bg-white">
      <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-[#f0ebe3] px-4 py-2.5 text-[0.6875rem] font-semibold text-[var(--ink-3)] sm:grid-cols-[1.4fr_1fr_0.8fr_auto]">
        <span>Source</span>
        <span className="hidden sm:block">Freshness</span>
        <span className="hidden sm:block">Tests</span>
        <span>Status</span>
      </div>
      <ul>
        {PIPES.map((p, i) => (
          <li
            key={p.src}
            data-rv="up"
            style={{ "--rd": `${120 + i * 70}ms` } as CSSProperties}
            className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[#f4f0ea] px-4 py-3 last:border-0 sm:grid-cols-[1.4fr_1fr_0.8fr_auto]"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#f3efe8] text-[var(--ink-2)]">
                <Database size={15} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[0.8125rem] font-semibold text-[var(--ink)]">{p.src}</span>
                <span className="block truncate text-[0.75rem] text-[var(--ink-3)]">
                  {p.obj} · {p.rows}
                </span>
              </span>
            </span>
            <span className="v21-mono hidden text-[0.75rem] text-[var(--ink-2)] sm:block">{p.fresh}</span>
            <span className="v21-mono hidden text-[0.75rem] text-[var(--ink-2)] sm:block">{p.tests}</span>
            {p.state === "ok" ? (
              <span className="v21-chip v21-chip-ok">
                <Check size={10} weight="bold" aria-hidden="true" /> Synced
              </span>
            ) : (
              <span className="v21-chip v21-chip-blue">
                <CircleNotch size={10} weight="bold" className="v21-spin" aria-hidden="true" /> Syncing
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Second Brain answer ---------- */

export const QA = {
  q: "Why did EBITDA margin drop in Q3?",
  a: "Margin fell from 18.2% to 15.9%. Two drivers explain most of it: freight rose 14% after the July carrier change, and Northeast discounting added $1.1M in promotional spend.",
  sources: ["finance.gl_entries", "ops.freight_invoices", "crm.discounts"],
};

export function AnswerCard({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={`rounded-[14px] border border-[#ece7df] bg-white p-4 ${className}`}>
      <p className="flex items-center gap-2 text-[0.6875rem] font-semibold text-[var(--blue-ink)]">
        <Sparkle size={12} weight="fill" aria-hidden="true" /> Second Brain
      </p>
      <p className="mt-2.5 text-[0.8125rem] font-semibold leading-snug text-[var(--ink)]">{QA.q}</p>
      <p className={`mt-2 text-[0.8125rem] leading-[1.55] text-[var(--ink-2)] ${compact ? "line-clamp-3" : ""}`}>{QA.a}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {QA.sources.map((s) => (
          <span key={s} className="v21-mono rounded-[6px] bg-[#f3efe8] px-1.5 py-0.5 text-[0.625rem] text-[var(--ink-2)]">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Agent tasks ---------- */

export const TASKS = [
  { name: "Reconcile intercompany balances", agent: "Finance agent", state: "done", meta: "3 entities · 0 exceptions" },
  { name: "Flag invoices overdue more than 30 days", agent: "Collections agent", state: "done", meta: "7 flagged · owners notified" },
  { name: "Refresh 13-week cash forecast", agent: "Treasury agent", state: "run", meta: "Reading ar.invoices" },
  { name: "Draft board pack commentary", agent: "Reporting agent", state: "wait", meta: "Waiting for approval" },
] as const;

export function TaskRow({ t, className = "" }: { t: (typeof TASKS)[number]; className?: string }) {
  return (
    <li className={`flex items-start gap-3 px-4 py-3 ${className}`}>
      <span
        className={`mt-0.5 inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
          t.state === "done" ? "bg-[var(--ok)] text-white" : t.state === "run" ? "text-[var(--blue)] shadow-[inset_0_0_0_1.5px_var(--blue)]" : "shadow-[inset_0_0_0_1.5px_#cfc7b9]"
        }`}
        aria-hidden="true"
      >
        {t.state === "done" && <Check size={10} weight="bold" />}
        {t.state === "run" && <span className="v21-pulse h-1.5 w-1.5 rounded-full bg-current" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.8125rem] font-semibold leading-snug text-[var(--ink)]">{t.name}</span>
        <span className="mt-0.5 block truncate text-[0.72rem] text-[var(--ink-3)]">
          {t.agent} · {t.meta}
        </span>
      </span>
      {t.state === "wait" && (
        <span className="v21-chip v21-chip-terra shrink-0">
          Review <ArrowUpRight size={10} weight="bold" aria-hidden="true" />
        </span>
      )}
    </li>
  );
}

export function TaskList({ className = "", limit = TASKS.length }: { className?: string; limit?: number }) {
  return (
    <div className={`overflow-hidden rounded-[14px] border border-[#ece7df] bg-white ${className}`}>
      <div className="flex items-center justify-between border-b border-[#f0ebe3] px-4 py-2.5">
        <span className="text-[0.75rem] font-semibold text-[var(--ink)]">Agent tasks</span>
        <span className="v21-mono text-[0.6875rem] text-[var(--ink-3)]">2 of {limit} done</span>
      </div>
      <ul className="divide-y divide-[#f4f0ea]">
        {TASKS.slice(0, limit).map((t) => (
          <TaskRow key={t.name} t={t} />
        ))}
      </ul>
    </div>
  );
}
