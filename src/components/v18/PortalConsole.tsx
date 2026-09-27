"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { ChartBar, Check, CircleNotch, Database, Graph, House, Lightning, MagnifyingGlass, Plugs, Robot, ShieldCheck } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/v2/ui";
import { Ticker } from "./ui";
import { useScript, type Turn } from "./useScript";

/* Everything on this console is illustrative. No figure, client or answer here is real. */

export type Screen = "overview" | "connect" | "model" | "dashboards" | "agents";

export const CONSOLE_W = 1120;
export const CONSOLE_H = 700;

const NAV: { id: Screen | "auto"; name: string; Icon: typeof House; count?: number }[] = [
  { id: "overview", name: "Overview", Icon: House },
  { id: "connect", name: "Connectors", Icon: Plugs, count: 8 },
  { id: "model", name: "Data model", Icon: Graph },
  { id: "dashboards", name: "Dashboards", Icon: ChartBar },
  { id: "agents", name: "Agents", Icon: Robot, count: 3 },
  { id: "auto", name: "Automations", Icon: Lightning },
];

const TITLES: Record<Screen, [string, string]> = {
  overview: ["Group overview", "Q3 · week 7"],
  connect: ["Connectors", "8 sources · governed"],
  model: ["Data model", "Metric definitions"],
  dashboards: ["Board dashboard", "Q3 · group"],
  agents: ["Genius agent", "Finance workspace"],
};

const r1 = (v: number) => Math.round(v * 10) / 10;

/** Catmull-Rom through points, as cubic Béziers, with rounded coordinates. */
function smooth(pts: [number, number][]) {
  let d = `M${r1(pts[0][0])},${r1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)},${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)},${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])},${r1(p2[1])}`;
  }
  return d;
}

function spark(s: number[], w = 64, h = 18) {
  const lo = Math.min(...s);
  const hi = Math.max(...s);
  return smooth(s.map((v, i) => [(i / (s.length - 1)) * w, h - ((v - lo) / (hi - lo || 1)) * h]));
}

/** Advances a counter every `ms` while live. */
function useBeat(live: boolean, ms: number) {
  const [beat, setBeat] = useState(0);
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setBeat((b) => b + 1), ms);
    return () => clearInterval(id);
  }, [live, ms]);
  return beat;
}

function Card({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div style={style} className={`rounded-[10px] bg-white shadow-[0_0_0_1px_#e2e6ee,0_1px_2px_rgb(14_18_51/0.04)] ${className}`}>
      {children}
    </div>
  );
}

function CardHead({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-[0.75rem] font-bold text-(--ink)">{title}</p>
      {right}
    </div>
  );
}

const tiny = "v18-mono text-[0.5625rem] uppercase tracking-[0.12em] text-(--ink-3)";

/* ------------------------------------------------------------------ Overview */

const KPIS = [
  { k: "Revenue QTD", seq: [1412.4, 1418.9, 1423.6, 1431.2], pre: "$", suf: "M", dec: 1, d: "+6.4% vs plan", warn: false, spark: [3, 3.2, 3.1, 3.6, 3.5, 4, 4.3] },
  { k: "EBITDA", seq: [284.2, 285.1, 286.0, 287.4], pre: "$", suf: "M", dec: 1, d: "+1.2pp vs plan", warn: false, spark: [3, 3.4, 3.8, 3.6, 3.9, 3.7, 3.9] },
  { k: "Gross margin", seq: [38.6, 38.6, 38.7, 38.8], pre: "", suf: "%", dec: 1, d: "+0.8pp vs plan", warn: false, spark: [3, 3.1, 3.3, 3.2, 3.6, 3.7, 3.8] },
  { k: "Free cash flow", seq: [96.4, 95.8, 97.1, 98.3], pre: "$", suf: "M", dec: 1, d: "-$4.2M vs plan", warn: true, spark: [4, 4.3, 4.1, 4.2, 3.9, 3.6, 3.4] },
];

const REV = [96, 97, 95, 98, 99, 98, 101, 103, 102, 105, 104, 107, 109, 108, 111, 113, 115, 118, 121, 123, 124, 126, 128, 129, 132, 135];
const PLAN = REV.map((_, i) => 97 + i * 1.28);
const CW = 560;
const CHh = 200;
const PX = 36;
const PT = 12;
const PB = 24;
const cx = (i: number) => PX + (i / (REV.length - 1)) * (CW - PX - 12);
const cy = (v: number) => PT + (1 - (v - 88) / (144 - 88)) * (CHh - PT - PB);
const REV_D = smooth(REV.map((v, i) => [cx(i), cy(v)]));
const PLAN_D = `M${r1(cx(0))},${r1(cy(PLAN[0]))}L${r1(cx(REV.length - 1))},${r1(cy(PLAN[PLAN.length - 1]))}`;
const AREA_D = `${REV_D}L${r1(cx(REV.length - 1))},${CHh - PB}L${r1(cx(0))},${CHh - PB}Z`;
const LAST = REV.length - 1;

const ENTITIES = [
  { n: "Industrial North", r: "$482.6M", p: "+8.1%", warn: false },
  { n: "Industrial Southeast", r: "$311.4M", p: "-2.4%", warn: true },
  { n: "Distribution EMEA", r: "$268.9M", p: "+11.3%", warn: false },
  { n: "Retail Direct", r: "$214.7M", p: "+4.7%", warn: false },
];

export const OVERVIEW_TURNS: Turn[] = [
  {
    q: "Why is free cash flow behind plan this quarter?",
    reads: ["finance.cash_ledger", "inventory by entity", "open receivables"],
    a: "Free cash flow is $4.2M behind plan. Most of the gap sits in Southeast inventory, up 18% while demand slowed. Releasing $1.4M of slow stock and collecting three overdue invoices closes it in about six weeks.",
  },
  {
    q: "Which entity is carrying the quarter?",
    reads: ["revenue by entity", "price and volume drivers", "plan vs actual"],
    a: "Distribution EMEA. Revenue is 11.3% above plan on stronger volume with steady pricing, and it accounts for roughly 40% of group growth this quarter.",
  },
];

function Overview({ live, reduce }: { live: boolean; reduce: boolean }) {
  const beat = useBeat(live && !reduce, 2600);
  const s = useScript(OVERVIEW_TURNS, { live, reduce });
  return (
    <div className="grid h-full grid-cols-[1fr_300px] grid-rows-[auto_1fr] gap-3">
      <div className="col-span-2 grid grid-cols-4 gap-3">
        {KPIS.map((k, i) => (
          <Card key={k.k} className="v18-screen-in p-3.5" style={{ animationDelay: `${120 + i * 70}ms` }}>
            <p className={tiny}>{k.k}</p>
            <div className="mt-2 flex items-end justify-between gap-2">
              <Ticker value={k.seq[beat % k.seq.length]} decimals={k.dec} prefix={k.pre} suffix={k.suf} className="text-[1.3125rem] font-bold leading-none tracking-[-0.02em] text-(--ink)" />
              <svg viewBox="0 0 64 18" className="h-[18px] w-16 overflow-visible" aria-hidden="true">
                <path d={spark(k.spark)} fill="none" stroke={k.warn ? "#f29a1f" : "#1f5fd1"} strokeWidth="1.5" />
              </svg>
            </div>
            <p className={`mt-2 text-[0.6875rem] font-semibold ${k.warn ? "text-(--ember-ink)" : "text-(--sky-ink)"}`}>{k.d}</p>
          </Card>
        ))}
      </div>

      <div className="grid min-h-0 grid-rows-[1fr_auto] gap-3">
        <Card className="v18-screen-in relative p-3.5" style={{ animationDelay: "260ms" }}>
          <CardHead
            title="Weekly revenue vs plan"
            right={
              <span className="flex items-center gap-3 text-[0.625rem] text-(--ink-3)">
                <span className="flex items-center gap-1.5">
                  <span className="h-[2px] w-3 bg-(--sky-ink)" /> Actual
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-0 w-3 border-t border-dashed border-(--ink-3)" /> Plan
                </span>
              </span>
            }
          />
          <svg viewBox={`0 0 ${CW} ${CHh}`} className="mt-2 h-auto w-full" aria-hidden="true">
            <defs>
              <linearGradient id="v18-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1f5fd1" stopOpacity="0.16" />
                <stop offset="1" stopColor="#1f5fd1" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[96, 112, 128, 144].map((v) => (
              <g key={v}>
                <line x1={PX} x2={CW - 12} y1={r1(cy(v))} y2={r1(cy(v))} stroke="#e2e6ee" />
                <text x={PX - 6} y={r1(cy(v) + 3)} textAnchor="end" className="v18-mono fill-(--ink-3) text-[8.5px]">
                  {v}
                </text>
              </g>
            ))}
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => (
              <text key={m} x={r1(PX + (i / 5) * (CW - PX - 12))} y={CHh - 6} textAnchor="middle" className="v18-mono fill-(--ink-3) text-[8.5px] uppercase">
                {m}
              </text>
            ))}
            <path d={AREA_D} fill="url(#v18-area)" className="v18-fade-in" style={{ animationDelay: "1500ms" }} />
            <path d={PLAN_D} fill="none" stroke="#8d93ad" strokeWidth="1.2" strokeDasharray="3 4" />
            <path d={REV_D} pathLength={1} fill="none" stroke="#1f5fd1" strokeWidth="2.2" strokeLinecap="round" className="v18-draw" style={{ animationDelay: "500ms" }} />
            <g className="v18-fade-in" style={{ animationDelay: "2100ms" }}>
              <circle cx={r1(cx(LAST))} cy={r1(cy(REV[LAST]))} r="8" fill="#1f5fd1" fillOpacity="0.15" />
              <circle cx={r1(cx(LAST))} cy={r1(cy(REV[LAST]))} r="3.5" fill="#fff" stroke="#1f5fd1" strokeWidth="2" />
            </g>
          </svg>
          <div className="v18-fade-in absolute right-5 top-11 rounded-[6px] bg-(--navy) px-2.5 py-2 text-white shadow-[0_10px_24px_-10px_rgb(14_18_51/0.6)]" style={{ animationDelay: "2200ms" }}>
            <p className="v18-mono text-[0.5625rem] uppercase tracking-[0.12em] text-white/60">Jun · wk 4</p>
            <p className="mt-1 text-[0.75rem] font-bold">$135.0M</p>
            <p className="text-[0.625rem] text-(--ember)">+5.1% vs plan</p>
          </div>
        </Card>

        <Card className="v18-screen-in p-3.5" style={{ animationDelay: "340ms" }}>
          <CardHead title="Performance by entity" right={<span className={tiny}>vs plan</span>} />
          <ul className="mt-2">
            {ENTITIES.map((e) => (
              <li key={e.n} className="grid grid-cols-[1fr_5rem_4rem_6.5rem] items-center gap-2 border-b border-(--rule) py-[7px] text-[0.6875rem] last:border-b-0">
                <span className="flex items-center gap-2 font-medium text-(--ink)">
                  <span className={`h-1.5 w-1.5 rounded-full ${e.warn ? "bg-(--ember)" : "bg-(--sky-ink)"}`} />
                  {e.n}
                </span>
                <span className="v18-mono text-right text-(--ink-2)">{e.r}</span>
                <span className={`v18-mono text-right font-semibold ${e.warn ? "text-(--ember-ink)" : "text-(--sky-ink)"}`}>{e.p}</span>
                <span className="flex justify-end">
                  <span className={`v18-chip !h-5 ${e.warn ? "bg-(--ember-soft) text-(--ember-ink)" : "bg-(--sky-soft) text-(--sky-ink)"}`}>{e.warn ? "Attention" : "On track"}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="v18-screen-in flex min-h-0 flex-col overflow-hidden" style={{ animationDelay: "420ms" }}>
        <AgentPanel s={s} />
      </Card>
    </div>
  );
}

function AgentPanel({ s, big = false }: { s: ReturnType<typeof useScript>; big?: boolean }) {
  const text = big ? "text-[0.8125rem]" : "text-[0.71875rem]";
  return (
    <>
      <div className="flex items-center justify-between border-b border-(--rule) px-3.5 py-2.5">
        <p className="flex items-center gap-2 text-[0.75rem] font-bold text-(--ink)">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-[5px] bg-(--navy) text-white">
            <Robot size={11} weight="bold" />
          </span>
          Genius agent
        </p>
        <span className={`flex items-center gap-1.5 text-[0.625rem] font-semibold ${s.phase === "hold" ? "text-(--ok)" : "text-(--ember-ink)"}`}>
          <span className="v18-live" />
          {s.phase === "read" ? "Reading" : s.phase === "answer" ? "Answering" : s.phase === "ask" ? "Listening" : "Ready"}
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-2.5 p-3.5">
        {s.asked && <div className={`ml-auto max-w-[88%] rounded-[10px] rounded-tr-[3px] bg-(--navy) px-3 py-2 ${text} leading-[1.5] text-white`}>{s.T.q}</div>}
        {s.asked && (
          <ol className="space-y-1">
            {s.T.reads.map((r, i) => {
              const done = i < s.readDone;
              const now = s.phase === "read" && i === s.readDone;
              return (
                <li key={r} className={`v18-mono flex items-center gap-2 text-[0.625rem] ${done ? "text-(--ink-2)" : now ? "text-(--ember-ink)" : "text-(--ink-3)/60"}`}>
                  <span className={`inline-flex h-3.5 w-3.5 items-center justify-center rounded-full ${done ? "bg-(--sky-ink) text-white" : "border border-current"}`}>
                    {done ? <Check size={8} weight="bold" /> : now ? <CircleNotch size={8} weight="bold" className="motion-safe:animate-spin" /> : null}
                  </span>
                  Reading {r}
                </li>
              );
            })}
          </ol>
        )}
        {s.answer && (
          <div className={`max-w-[96%] rounded-[10px] rounded-tl-[3px] bg-(--grey) px-3 py-2.5 ${text} leading-[1.55] text-(--ink) shadow-[inset_0_0_0_1px_#e2e6ee]`}>
            {s.answer}
            {s.answering && <span className="v18-caret" />}
          </div>
        )}
      </div>
      <div className="border-t border-(--rule) p-2.5">
        <div className="flex h-9 items-center gap-2 rounded-[7px] bg-(--grey) px-3 shadow-[inset_0_0_0_1px_#e2e6ee]">
          <span className={`min-w-0 flex-1 truncate text-[0.6875rem] ${s.phase === "ask" && s.question ? "text-(--ink)" : "text-(--ink-3)"}`}>
            {s.phase === "ask" ? s.question || "Ask about the business" : "Ask about the business"}
            {s.phase === "ask" && <span className="v18-caret" />}
          </span>
          <span className={`inline-flex h-6 w-6 items-center justify-center rounded-[5px] ${s.phase === "ask" && s.question ? "bg-(--ember) text-[#1a1205]" : "bg-(--grey-2) text-(--ink-3)"}`}>
            <MagnifyingGlass size={11} weight="bold" />
          </span>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ Connect */

const SOURCES = [
  { n: "ERP · finance", t: "General ledger, invoices", rows: 1284602 },
  { n: "CRM", t: "Accounts, pipeline", rows: 412880 },
  { n: "Warehouse system", t: "Stock, shipments", rows: 2019334 },
  { n: "HR platform", t: "Headcount, cost centres", rows: 18240 },
  { n: "E-commerce", t: "Orders, returns", rows: 903117 },
  { n: "Bank feeds", t: "Cash, payments", rows: 66402 },
  { n: "Spreadsheets", t: "Budgets, plans", rows: 4210 },
  { n: "Cloud apps", t: "Tickets, projects", rows: 120955 },
];

function Connect({ live, reduce }: { live: boolean; reduce: boolean }) {
  const beat = useBeat(live && !reduce, 900);
  const syncing = beat % SOURCES.length;
  const total = SOURCES.reduce((a, s) => a + s.rows, 0);
  return (
    <div className="grid h-full grid-cols-[1fr_340px] gap-3">
      <Card className="v18-screen-in flex flex-col p-3.5" style={{ animationDelay: "80ms" }}>
        <CardHead title="Connected sources" right={<span className={tiny}>Builds on existing systems</span>} />
        <div className={`mt-3 grid grid-cols-[1.3fr_1fr_7rem_6rem] gap-2 px-2 ${tiny}`}>
          <span>Source</span>
          <span>Objects</span>
          <span className="text-right">Rows</span>
          <span className="text-right">Status</span>
        </div>
        <ul className="mt-1.5 grid flex-1 content-start gap-1.5">
          {SOURCES.map((s, i) => {
            const on = !reduce && live && i === syncing;
            return (
              <li key={s.n} className={`grid grid-cols-[1.3fr_1fr_7rem_6rem] items-center gap-2 rounded-[8px] px-2 py-[9px] text-[0.71875rem] transition-colors duration-300 ${on ? "bg-(--sky-soft)" : "bg-(--grey)"}`}>
                <span className="flex items-center gap-2 font-semibold text-(--ink)">
                  <Database size={12} className="text-(--ink-3)" />
                  {s.n}
                </span>
                <span className="truncate text-(--ink-2)">{s.t}</span>
                <span className="v18-mono text-right text-(--ink-2)">
                  <Ticker value={s.rows + (live && !reduce ? Math.floor(beat / SOURCES.length) * ((i * 37 + 11) % 90) : 0)} duration={600} />
                </span>
                <span className={`flex items-center justify-end gap-1.5 text-[0.625rem] font-semibold ${on ? "text-(--sky-ink)" : "text-(--ok)"}`}>
                  {on ? <CircleNotch size={10} weight="bold" className="motion-safe:animate-spin" /> : <Check size={10} weight="bold" />}
                  {on ? "Syncing" : "Synced"}
                </span>
              </li>
            );
          })}
        </ul>
      </Card>

      <div className="grid grid-rows-[auto_1fr] gap-3">
        <div className="grid grid-cols-2 gap-3">
          <Card className="v18-screen-in p-3.5" style={{ animationDelay: "160ms" }}>
            <p className={tiny}>Rows governed</p>
            <p className="mt-2 text-[1.25rem] font-bold tracking-[-0.02em] text-(--ink)">
              <Ticker value={Math.round((total + beat * 173) / 1000) / 1000} decimals={2} suffix="M" duration={700} />
            </p>
          </Card>
          <Card className="v18-screen-in p-3.5" style={{ animationDelay: "220ms" }}>
            <p className={tiny}>Tests passing</p>
            <p className="mt-2 text-[1.25rem] font-bold tracking-[-0.02em] text-(--ok)">
              100%
            </p>
          </Card>
        </div>
        <Card className="v18-screen-in p-3.5" style={{ animationDelay: "280ms" }}>
          <CardHead title="Pipeline" right={<span className={tiny}>Every 15 min</span>} />
          <svg viewBox="0 0 312 380" className="mt-2 h-auto w-full" aria-hidden="true">
            {SOURCES.slice(0, 6).map((s, i) => {
              const y = 26 + i * 58;
              return (
                <g key={s.n}>
                  <path d={`M92,${y} C150,${y} 140,190 196,190`} fill="none" stroke={i === syncing % 6 && live && !reduce ? "#1f5fd1" : "#cfd5e1"} strokeWidth="1.4" className="v18-flow" />
                  <rect x="4" y={y - 13} width="88" height="26" rx="6" fill="#f4f6fa" stroke="#e2e6ee" />
                  <text x="14" y={y + 3.5} className="fill-(--ink) text-[9.5px] font-semibold">
                    {s.n.split(" ")[0]}
                  </text>
                </g>
              );
            })}
            <rect x="196" y="150" width="112" height="80" rx="10" fill="#101440" />
            <text x="252" y="182" textAnchor="middle" className="fill-white text-[10px] font-bold">
              Genius Portal
            </text>
            <text x="252" y="198" textAnchor="middle" className="v18-mono fill-white/60 text-[7.5px] uppercase tracking-[0.12em]">
              model · test · publish
            </text>
            <rect x="222" y="210" width="60" height="4" rx="2" fill="#ffffff" fillOpacity="0.12" />
            <rect x="222" y="210" width={((beat % 10) + 1) * 6} height="4" rx="2" fill="#f29a1f" style={{ transition: "width 800ms" }} />
          </svg>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Model */

const LINEAGE = {
  sources: ["erp.invoices", "erp.credit_notes", "crm.accounts"],
  objects: ["Order", "Customer"],
  uses: ["Board pack", "Ops dashboard", "Agent answers"],
};

const OBJECTS = [
  { n: "Customer", rel: 14, rows: "48.2K" },
  { n: "Order", rel: 11, rows: "2.9M" },
  { n: "Product", rel: 9, rows: "31.4K" },
  { n: "Supplier", rel: 7, rows: "1.8K" },
  { n: "Entity", rel: 6, rows: "14" },
];

function Model({ live, reduce }: { live: boolean; reduce: boolean }) {
  const beat = useBeat(live && !reduce, 1400);
  const hot = beat % 3;
  const col = (n: number, x: number, h = 380) => Array.from({ length: n }, (_, i) => ({ x, y: r1(((i + 1) * h) / (n + 1)) }));
  const S = col(3, 70);
  const O = col(2, 230);
  const M = [{ x: 380, y: 190 }];
  const U = col(3, 530);
  return (
    <div className="grid h-full grid-cols-[360px_1fr] gap-3">
      <div className="grid grid-rows-[auto_1fr] gap-3">
        <Card className="v18-screen-in p-4" style={{ animationDelay: "80ms" }}>
          <div className="flex items-center justify-between">
            <p className={tiny}>Metric</p>
            <span className="v18-chip !h-5 bg-(--sky-soft) text-(--sky-ink)">
              <ShieldCheck size={10} weight="bold" /> Certified
            </span>
          </div>
          <p className="mt-2 text-[1.125rem] font-bold tracking-[-0.02em] text-(--ink)">Net revenue</p>
          <p className="mt-1 text-[0.6875rem] leading-[1.5] text-(--ink-2)">Invoiced revenue less credit notes, posted in the period, in group currency.</p>
          <pre className="v18-mono mt-3 overflow-hidden rounded-[8px] bg-(--navy) p-3 text-[0.625rem] leading-[1.7] text-white/85">
            <span className="text-(--ember)">sum</span>(invoice.amount){"\n"}
            {"  "}- <span className="text-(--ember)">sum</span>(credit_note.amount){"\n"}
            <span className="text-white/50">where</span> status = <span className="text-(--sky)">&apos;posted&apos;</span>
          </pre>
          <dl className="mt-3 grid grid-cols-3 gap-2 text-[0.625rem]">
            {[
              ["Owner", "Group Finance"],
              ["Used in", "23 reports"],
              ["Version", "v4 · Aug"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-[6px] bg-(--grey) px-2 py-1.5">
                <dt className="text-(--ink-3)">{k}</dt>
                <dd className="mt-0.5 font-semibold text-(--ink)">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card className="v18-screen-in p-3.5" style={{ animationDelay: "160ms" }}>
          <CardHead title="Business objects" right={<span className={tiny}>Ontology</span>} />
          <ul className="mt-2">
            {OBJECTS.map((o) => (
              <li key={o.n} className="grid grid-cols-[1fr_auto_3.5rem] items-center gap-3 border-b border-(--rule) py-[7px] text-[0.6875rem] last:border-b-0">
                <span className="flex items-center gap-2 font-semibold text-(--ink)">
                  <span className="h-2 w-2 rotate-45 rounded-[2px] bg-(--navy)" />
                  {o.n}
                </span>
                <span className="text-(--ink-3)">{o.rel} relationships</span>
                <span className="v18-mono text-right text-(--ink-2)">{o.rows}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="v18-screen-in p-3.5" style={{ animationDelay: "240ms" }}>
        <CardHead title="Lineage · Net revenue" right={<span className={tiny}>Source to decision</span>} />
        <svg viewBox="0 0 600 380" className="mt-2 h-auto w-full" aria-hidden="true">
          {[
            ["Sources", 70],
            ["Objects", 230],
            ["Metric", 380],
            ["Used in", 530],
          ].map(([t, x]) => (
            <text key={t} x={x} y="12" textAnchor="middle" className="v18-mono fill-(--ink-3) text-[8px] uppercase tracking-[0.14em]">
              {t}
            </text>
          ))}
          {S.map((a, i) =>
            O.map((b, j) => (i === 2 && j === 0) || (i < 2 && j === 1) ? null : (
              <path key={`${i}${j}`} d={`M${a.x + 56},${a.y} C${a.x + 110},${a.y} ${b.x - 100},${b.y} ${b.x - 44},${b.y}`} fill="none" stroke="#cfd5e1" strokeWidth="1.2" />
            )),
          )}
          {O.map((b, j) => (
            <path key={j} d={`M${b.x + 44},${b.y} C${b.x + 90},${b.y} ${M[0].x - 90},${M[0].y} ${M[0].x - 50},${M[0].y}`} fill="none" stroke="#1f5fd1" strokeWidth="1.4" className="v18-flow" />
          ))}
          {U.map((u, k) => (
            <path key={k} d={`M${M[0].x + 50},${M[0].y} C${M[0].x + 90},${M[0].y} ${u.x - 100},${u.y} ${u.x - 58},${u.y}`} fill="none" stroke={k === hot ? "#f29a1f" : "#cfd5e1"} strokeWidth={k === hot ? 1.8 : 1.2} style={{ transition: "stroke 400ms" }} />
          ))}
          {S.map((a, i) => (
            <g key={LINEAGE.sources[i]}>
              <rect x={a.x - 58} y={a.y - 14} width="116" height="28" rx="6" fill="#f4f6fa" stroke="#e2e6ee" />
              <text x={a.x} y={a.y + 3.5} textAnchor="middle" className="v18-mono fill-(--ink) text-[8.5px]">
                {LINEAGE.sources[i]}
              </text>
            </g>
          ))}
          {O.map((b, j) => (
            <g key={LINEAGE.objects[j]}>
              <rect x={b.x - 44} y={b.y - 15} width="88" height="30" rx="15" fill="#fff" stroke="#101440" strokeWidth="1.2" />
              <text x={b.x} y={b.y + 3.5} textAnchor="middle" className="fill-(--ink) text-[10px] font-bold">
                {LINEAGE.objects[j]}
              </text>
            </g>
          ))}
          <rect x={M[0].x - 50} y={M[0].y - 22} width="100" height="44" rx="8" fill="#101440" />
          <text x={M[0].x} y={M[0].y - 2} textAnchor="middle" className="fill-white text-[10px] font-bold">
            Net revenue
          </text>
          <text x={M[0].x} y={M[0].y + 11} textAnchor="middle" className="v18-mono fill-(--ember) text-[7.5px] uppercase tracking-[0.12em]">
            one definition
          </text>
          {U.map((u, k) => (
            <g key={LINEAGE.uses[k]}>
              <rect x={u.x - 58} y={u.y - 14} width="116" height="28" rx="6" fill={k === hot ? "#fff3e2" : "#fff"} stroke={k === hot ? "#f29a1f" : "#e2e6ee"} style={{ transition: "fill 400ms, stroke 400ms" }} />
              <text x={u.x} y={u.y + 3.5} textAnchor="middle" className="fill-(--ink) text-[9.5px] font-semibold">
                {LINEAGE.uses[k]}
              </text>
            </g>
          ))}
        </svg>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ Dashboards */

const BARS = [
  { n: "North", a: 482.6, p: 446 },
  { n: "Southeast", a: 311.4, p: 319 },
  { n: "EMEA", a: 268.9, p: 241.6 },
  { n: "Retail", a: 214.7, p: 205 },
  { n: "Services", a: 134.2, p: 128 },
];
const BRIDGE = [
  { k: "Q2 margin", v: 36.9, base: true },
  { k: "Price", v: 0.9 },
  { k: "Volume", v: 0.6 },
  { k: "Mix", v: -0.3 },
  { k: "Freight", v: -0.5 },
  { k: "Q3 margin", v: 37.6, base: true },
];
const B_LO = 35.5;
const B_SCALE = 150 / (38 - B_LO);
const BRIDGE_GEO = (() => {
  let run = 0;
  return BRIDGE.map((b) => {
    let y0: number;
    let y1: number;
    if (b.base) {
      y0 = 200;
      y1 = 200 - (b.v - B_LO) * B_SCALE;
      run = b.v;
    } else {
      const next = run + b.v;
      y0 = 200 - (run - B_LO) * B_SCALE;
      y1 = 200 - (next - B_LO) * B_SCALE;
      run = next;
    }
    return { top: Math.min(y0, y1), h: Math.max(2, Math.abs(y1 - y0)) };
  });
})();

function Dashboards({ live, reduce }: { live: boolean; reduce: boolean }) {
  const beat = useBeat(live && !reduce, 2200);
  const pick = beat % BARS.length;
  const max = 520;
  return (
    <div className="grid h-full grid-cols-2 grid-rows-[1fr_auto] gap-3">
      <Card className="v18-screen-in flex flex-col p-3.5" style={{ animationDelay: "80ms" }}>
        <CardHead title="Revenue by entity, $M" right={<span className={tiny}>Actual · plan</span>} />
        <ul className="mt-4 grid flex-1 grid-cols-5 items-end gap-4 px-2" aria-hidden="true">
          {BARS.map((b, i) => {
            const on = i === pick;
            const warn = b.a < b.p;
            return (
              <li key={b.n} className="flex h-full flex-col items-center justify-end gap-1.5">
                <span className={`v18-mono text-[0.625rem] font-semibold transition-colors ${on ? "text-(--ink)" : "text-(--ink-3)"}`}>{b.a.toFixed(0)}</span>
                <span className="relative flex h-[230px] w-full max-w-[52px] items-end">
                  <span className="absolute inset-x-0 border-t-2 border-dashed border-(--ink-3)/60" style={{ bottom: `${(b.p / max) * 100}%` }} />
                  <span
                    className={`v18-grow w-full rounded-t-[5px] transition-colors duration-300 ${warn ? "bg-(--ember)" : on ? "bg-(--navy)" : "bg-(--sky-ink)/80"}`}
                    style={{ height: `${(b.a / max) * 100}%`, animationDelay: `${200 + i * 80}ms` }}
                  />
                </span>
                <span className="text-[0.625rem] text-(--ink-2)">{b.n}</span>
              </li>
            );
          })}
        </ul>
      </Card>
      <Card className="v18-screen-in flex flex-col p-3.5" style={{ animationDelay: "160ms" }}>
        <CardHead title="Gross margin bridge, %" right={<span className={tiny}>Q2 to Q3</span>} />
        <svg viewBox="0 0 420 250" className="mt-3 h-auto w-full flex-1" aria-hidden="true">
          {BRIDGE.map((b, i) => {
            const x = 20 + i * 66;
            const { top, h } = BRIDGE_GEO[i];
            const fill = b.base ? "#101440" : b.v > 0 ? "#1f5fd1" : "#f29a1f";
            return (
              <g key={b.k}>
                <rect x={x} y={r1(top)} width="46" height={r1(h)} rx="3" fill={fill} className="v18-grow" style={{ animationDelay: `${300 + i * 90}ms` }} />
                <text x={x + 23} y={r1(top - 6)} textAnchor="middle" className="v18-mono fill-(--ink) text-[9px] font-semibold">
                  {b.base ? b.v.toFixed(1) : `${b.v > 0 ? "+" : ""}${b.v.toFixed(1)}`}
                </text>
                <text x={x + 23} y="222" textAnchor="middle" className="fill-(--ink-2) text-[9px]">
                  {b.k}
                </text>
              </g>
            );
          })}
          <line x1="14" x2="410" y1="200" y2="200" stroke="#cfd5e1" />
        </svg>
      </Card>
      <Card className="v18-screen-in col-span-2 grid grid-cols-4 divide-x divide-(--rule) p-0" style={{ animationDelay: "240ms" }}>
        {[
          ["Board pack", "Ready · Thursday", true],
          ["Revenue definition", "One, certified", true],
          ["Entities reconciled", "14 of 14", true],
          ["Open questions", "2 for Southeast", false],
        ].map(([k, v, ok]) => (
          <div key={k as string} className="p-3.5">
            <p className={tiny}>{k}</p>
            <p className={`mt-1.5 flex items-center gap-1.5 text-[0.8125rem] font-bold ${ok ? "text-(--ink)" : "text-(--ember-ink)"}`}>
              {ok ? <Check size={12} weight="bold" className="text-(--ok)" /> : <span className="h-1.5 w-1.5 rounded-full bg-(--ember)" />}
              {v}
            </p>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ Agents */

const AGENT_TURNS: Turn[] = [
  {
    q: "Prepare the three points the board should hear about Q3.",
    reads: ["group P&L and plan", "cash and working capital", "entity commentary"],
    a: "1. Revenue is 6.4% ahead of plan, led by EMEA and North. 2. Margin rose 0.7 points on pricing, partly offset by freight. 3. Cash is the watch item: Southeast inventory holds $1.4M that a release plan can recover this quarter.",
  },
];

const AUTOMATIONS = [
  { n: "Month-end close checks", t: "06:00", ok: true },
  { n: "Inventory ageing alert", t: "06:12", ok: false },
  { n: "Board pack refresh", t: "07:30", ok: true },
  { n: "Overdue invoice follow-up", t: "08:05", ok: true },
];

function Agents({ live, reduce }: { live: boolean; reduce: boolean }) {
  const s = useScript(AGENT_TURNS, { live, reduce });
  return (
    <div className="grid h-full grid-cols-[1fr_320px] gap-3">
      <Card className="v18-screen-in flex min-h-0 flex-col overflow-hidden" style={{ animationDelay: "80ms" }}>
        <AgentPanel s={s} big />
      </Card>
      <div className="grid grid-rows-[auto_1fr] gap-3">
        <Card className="v18-screen-in p-3.5" style={{ animationDelay: "160ms" }}>
          <CardHead title="Recommended actions" right={<span className={tiny}>Needs approval</span>} />
          <ul className="mt-2.5 space-y-2">
            {[
              { a: "Release Southeast slow stock", i: "Cash +$1.4M", b: "Approve" },
              { a: "Hold price floor on 1,284 SKUs", i: "Margin +120bp", b: "Review" },
            ].map((r) => (
              <li key={r.a} className="flex items-center justify-between gap-3 rounded-[8px] bg-(--grey) px-3 py-2.5">
                <span>
                  <span className="block text-[0.6875rem] font-semibold text-(--ink)">{r.a}</span>
                  <span className="block text-[0.625rem] font-semibold text-(--ember-ink)">{r.i}</span>
                </span>
                <span className="rounded-[5px] bg-(--navy) px-2 py-1 text-[0.625rem] font-semibold text-white">{r.b}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="v18-screen-in p-3.5" style={{ animationDelay: "240ms" }}>
          <CardHead title="Automations today" right={<span className={tiny}>4 runs</span>} />
          <ol className="mt-2.5 space-y-0">
            {AUTOMATIONS.map((a) => (
              <li key={a.n} className="flex items-center gap-3 border-b border-(--rule) py-2.5 text-[0.6875rem] last:border-b-0">
                <span className="v18-mono w-9 text-(--ink-3)">{a.t}</span>
                <span className={`h-1.5 w-1.5 rounded-full ${a.ok ? "bg-(--ok)" : "bg-(--ember)"}`} />
                <span className="flex-1 font-medium text-(--ink)">{a.n}</span>
                <span className={`text-[0.625rem] font-semibold ${a.ok ? "text-(--ok)" : "text-(--ember-ink)"}`}>{a.ok ? "Done" : "Flagged"}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Shell */

const DESCRIPTIONS: Record<Screen, string> = {
  overview: "Illustrative Genius Portal overview: four KPI cards, a weekly revenue chart running ahead of plan, performance by entity, and the Genius agent answering a question about free cash flow.",
  connect: "Illustrative Genius Portal connectors screen: eight existing business systems syncing into one governed pipeline.",
  model: "Illustrative Genius Portal data model: one certified definition of net revenue, traced from source tables through business objects to the reports and agents that use it.",
  dashboards: "Illustrative Genius Portal board dashboard: revenue by entity against plan and a gross margin bridge from Q2 to Q3.",
  agents: "Illustrative Genius Portal agent screen: the agent drafts three board points, with recommended actions awaiting approval and today's automations.",
};

/** The Genius Portal, drawn at a fixed 1120 by 700 and scaled by its frame. Illustrative throughout. */
export function PortalConsole({ screen = "overview", live = true }: { screen?: Screen; live?: boolean }) {
  const reduce = !!useReducedMotion();
  const [title, sub] = TITLES[screen];
  return (
    <div
      role="img"
      aria-label={DESCRIPTIONS[screen]}
      className="grid overflow-hidden rounded-[14px] bg-(--grey) text-(--ink) shadow-[0_0_0_1px_rgb(255_255_255/0.12),0_50px_100px_-30px_rgb(4_6_26/0.7)]"
      style={{ width: CONSOLE_W, height: CONSOLE_H, gridTemplateColumns: "200px 1fr", gridTemplateRows: "48px 1fr" }}
    >
      <div className="col-span-2 flex items-center justify-between gap-4 border-b border-(--rule) bg-white px-4">
        <div className="flex items-center gap-4">
          <BrandLogo tone="navy" className="h-[11px] w-auto" />
          <span className="h-4 w-px bg-(--rule)" />
          <span className="text-[0.75rem] font-semibold text-(--ink-2)">Meridian Holdings</span>
        </div>
        <div className="flex h-8 w-[340px] items-center gap-2 rounded-[7px] bg-(--grey) px-3 text-[0.6875rem] text-(--ink-3) shadow-[inset_0_0_0_1px_#e2e6ee]">
          <MagnifyingGlass size={12} />
          Ask Genius or search metrics
          <span className="v18-mono ml-auto rounded-[4px] bg-white px-1.5 text-[0.5625rem] shadow-[0_0_0_1px_#e2e6ee]">⌘K</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="v18-chip !h-6 bg-(--ember-soft) text-(--ember-ink)">Illustrative data</span>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-(--navy) text-[0.625rem] font-bold text-white">CF</span>
        </div>
      </div>

      <aside className="flex flex-col justify-between border-r border-(--rule) bg-white px-3 py-4">
        <div>
          <p className={`${tiny} px-2.5`}>Workspace</p>
          <ul className="mt-2 space-y-0.5">
            {NAV.map(({ id, name, Icon, count }) => {
              const on = id === screen;
              return (
                <li key={name} className={`relative flex items-center justify-between rounded-[7px] px-2.5 py-[7px] text-[0.75rem] transition-colors duration-300 ${on ? "bg-(--navy) font-semibold text-white" : "text-(--ink-2)"}`}>
                  <span className="flex items-center gap-2.5">
                    <Icon size={14} weight={on ? "bold" : "regular"} />
                    {name}
                  </span>
                  {count && <span className={`v18-mono rounded-[4px] px-1.5 text-[0.5625rem] ${on ? "bg-white/15 text-white" : "bg-(--ember-soft) text-(--ember-ink)"}`}>{count}</span>}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="rounded-[9px] bg-(--grey) p-3 shadow-[inset_0_0_0_1px_#e2e6ee]">
          <p className="flex items-center gap-1.5 text-[0.6875rem] font-bold text-(--ink)">
            <span className="text-(--ok)">
              <span className="v18-live" />
            </span>
            All systems governed
          </p>
          <p className="mt-1 text-[0.625rem] leading-[1.45] text-(--ink-3)">14 entities · 8 sources · last sync 2 min ago</p>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-col p-4">
        <div key={`h-${screen}`} className="v18-screen-in mb-3 flex items-baseline justify-between">
          <p className="text-[1rem] font-bold tracking-[-0.02em]">{title}</p>
          <p className={tiny}>{sub}</p>
        </div>
        <div key={screen} className="min-h-0 flex-1">
          {screen === "overview" && <Overview live={live} reduce={reduce} />}
          {screen === "connect" && <Connect live={live} reduce={reduce} />}
          {screen === "model" && <Model live={live} reduce={reduce} />}
          {screen === "dashboards" && <Dashboards live={live} reduce={reduce} />}
          {screen === "agents" && <Agents live={live} reduce={reduce} />}
        </div>
      </div>
    </div>
  );
}

/**
 * Scales the fixed-size console to its frame. CSS sets a first guess by breakpoint, so the
 * server render and a no-JS page are laid out correctly; the measured scale then refines it.
 * `bleed` lets the console run past the frame's right edge on wide screens.
 */
export function ConsoleFrame({ children, bleed = 1, bleedSm = 1, className = "" }: { children: ReactNode; bleed?: number; bleedSm?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const wide = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      const k = wide.matches ? bleed : bleedSm;
      setScale(Math.round(Math.min(1, (el.clientWidth * k) / CONSOLE_W) * 1000) / 1000);
    };
    const first = setTimeout(measure, 0);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    wide.addEventListener("change", measure);
    return () => {
      clearTimeout(first);
      ro.disconnect();
      wide.removeEventListener("change", measure);
    };
  }, [bleed, bleedSm]);
  const style = scale === null ? undefined : ({ "--fit": scale } as CSSProperties);
  return (
    <div ref={ref} className={`v18-fit ${className}`} style={style}>
      <div className="v18-fit-inner">{children}</div>
    </div>
  );
}
