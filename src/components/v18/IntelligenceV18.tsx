"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowUp, Check, CircleNotch, Robot } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/v2/ui";
import { Illustrative, SectionHead, Tile, useInView } from "./ui";
import { useScript, type Turn } from "./useScript";

/* ---------------------------------------------------------------- shared radio row */

function Choice<T extends string>({ options, value, onChange, label, navy = false }: { options: { id: T; label: string }[]; value: T; onChange: (v: T) => void; label: string; navy?: boolean }) {
  const idx = Math.max(0, options.findIndex((o) => o.id === value));
  const move = (e: KeyboardEvent<HTMLButtonElement>, dir: number) => {
    e.preventDefault();
    const next = (idx + dir + options.length) % options.length;
    onChange(options[next].id);
    e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  };
  return (
    <div role="radiogroup" aria-label={label} className={`flex flex-wrap gap-1 rounded-[9px] p-1 ${navy ? "bg-white/10" : "bg-(--grey) shadow-[inset_0_0_0_1px_var(--rule)]"}`}>
      {options.map((o, i) => {
        const on = i === idx;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") move(e, 1);
              else if (e.key === "ArrowLeft" || e.key === "ArrowUp") move(e, -1);
            }}
            className={`h-8 flex-1 whitespace-nowrap rounded-[6px] px-2.5 text-[0.8125rem] font-semibold transition-[background-color,color,box-shadow] duration-300 ${
              on ? (navy ? "bg-white text-(--navy)" : "bg-white text-(--ink) shadow-[0_0_0_1px_var(--rule-2),0_2px_6px_-3px_rgb(14_18_51/0.25)]") : navy ? "text-white/70 hover:text-white" : "text-(--ink-3) hover:text-(--ink)"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- Agent */

const TURNS: Turn[] = [
  {
    q: "Why did our EBITDA margin drop in Q3, and what should we do about it?",
    reads: ["finance.gl_entries", "Q2 and Q3 cost centres", "freight and discount drivers"],
    a: "EBITDA margin fell from 18.2% to 15.9%. Two drivers explain most of it: freight rose 14% after the July carrier change, and Northeast discounting added $1.1M of promotional spend. Renegotiating freight and capping regional discounts recovers about 1.8 points next quarter.",
  },
  {
    q: "What will our cash position look like over the next 90 days?",
    reads: ["ar.invoices and ap.schedule", "payment behaviour by customer", "weekly balance projection"],
    a: "Cash stays above the $4M floor, with a low of $4.6M in week 7 when the insurance premium and two supplier payments land together. Collecting the three overdue enterprise invoices early lifts that low point to $5.9M.",
  },
  {
    q: "Which customers are most at risk of churning this quarter?",
    reads: ["crm.accounts and tickets", "order frequency by account", "contract renewal dates"],
    a: "Seven accounts show the pattern: order frequency down over 30%, open service tickets, and renewals inside 90 days. Together they represent $3.2M of annual revenue. Four share one unresolved delivery issue in the Southeast.",
  },
];

function AgentTile() {
  const reduce = !!useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const [pick, setPick] = useState(0);
  const s = useScript(TURNS, { live: inView, reduce, auto: false, index: pick });
  return (
    <Tile className="flex flex-col overflow-hidden lg:col-span-7 lg:row-span-2">
      <div ref={ref} className="flex items-center justify-between gap-3 border-b border-(--rule) px-5 py-4 sm:px-6">
        <p className="flex items-center gap-2.5 font-bold">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-[7px] bg-(--navy) text-white">
            <Robot size={15} weight="bold" aria-hidden="true" />
          </span>
          Ask Genius
        </p>
        <span className="flex items-center gap-3">
          <span className={`flex items-center gap-1.5 text-[0.8125rem] font-semibold ${s.phase === "hold" ? "text-(--ok)" : "text-(--ember-ink)"}`}>
            <span className="v18-live" aria-hidden="true" />
            {s.phase === "read" ? "Reading sources" : s.phase === "answer" ? "Answering" : s.phase === "ask" ? "Listening" : "Ready"}
          </span>
          <Illustrative />
        </span>
      </div>

      <div className="flex min-h-[20rem] flex-1 flex-col gap-4 bg-(--grey) px-5 py-6 sm:px-6">
        {s.asked && <div className="ml-auto max-w-[86%] rounded-[12px] rounded-tr-[4px] bg-(--navy) px-4 py-3 text-[0.9375rem] leading-[1.6] text-white">{s.T.q}</div>}
        {s.asked && (
          <ol className="grid gap-1.5" aria-label="What the agent reads">
            {s.T.reads.map((r, i) => {
              const done = i < s.readDone;
              const now = s.phase === "read" && i === s.readDone;
              return (
                <li key={r} className={`v18-mono flex items-center gap-2.5 text-[0.75rem] ${done ? "text-(--ink-2)" : now ? "text-(--ember-ink)" : "text-(--ink-3)"}`}>
                  <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full ${done ? "bg-(--sky-ink) text-white" : "border border-current"}`} aria-hidden="true">
                    {done ? <Check size={9} weight="bold" /> : now ? <CircleNotch size={9} weight="bold" className="motion-safe:animate-spin" /> : null}
                  </span>
                  Reading {r}
                </li>
              );
            })}
          </ol>
        )}
        {s.answer && (
          <div className="max-w-[94%] rounded-[12px] rounded-tl-[4px] bg-white px-4 py-3.5 text-[0.9375rem] leading-[1.65] text-(--ink) shadow-[0_0_0_1px_var(--rule)]">
            {s.answer}
            {s.answering && <span className="v18-caret" aria-hidden="true" />}
          </div>
        )}
        <div className="mt-auto" />
      </div>

      <div className="border-t border-(--rule) p-4 sm:p-5">
        <p className="v18-label text-(--ink-3)">Try an executive question</p>
        <div className="mt-3 grid gap-2" role="group" aria-label="Example questions">
          {TURNS.map((t, i) => {
            const on = i === s.turn;
            return (
              <button
                key={t.q}
                type="button"
                aria-pressed={on}
                onClick={() => setPick(i)}
                className={`flex items-center justify-between gap-3 rounded-[9px] px-4 py-3 text-left text-[0.875rem] font-semibold transition-[background-color,box-shadow,color] duration-300 ${
                  on ? "bg-(--navy) text-white" : "bg-white text-(--ink) shadow-[inset_0_0_0_1px_var(--rule-2)] hover:shadow-[inset_0_0_0_1px_var(--ink-3)]"
                }`}
              >
                {t.q}
                <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] ${on ? "bg-(--ember) text-[#1a1205]" : "bg-(--grey) text-(--ink-3)"}`} aria-hidden="true">
                  <ArrowUp size={13} weight="bold" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Tile>
  );
}

/* ---------------------------------------------------------------- Second Brain */

type Ctx = "semantic" | "business" | "event";
const CONTEXTS: Record<Ctx, { label: string; body: string }> = {
  semantic: { label: "Semantic", body: "What every number means. Shared definitions for metrics, tables and dashboards, so revenue means the same thing in every report." },
  business: { label: "Business", body: "How the company actually works. Customers, operations and finance, and the relationships that connect them." },
  event: { label: "Event", body: "What is happening right now. Transactions, process steps and system events, captured as they occur." },
};
const NODES: { t: string; g: Ctx; x: number; y: number }[] = [
  { t: "Metrics", g: "semantic", x: 70, y: 52 },
  { t: "Tables", g: "semantic", x: 150, y: 28 },
  { t: "Dashboards", g: "semantic", x: 52, y: 128 },
  { t: "Customers", g: "business", x: 330, y: 40 },
  { t: "Operations", g: "business", x: 390, y: 110 },
  { t: "Finance", g: "business", x: 262, y: 22 },
  { t: "Processes", g: "business", x: 370, y: 186 },
  { t: "Transactions", g: "event", x: 96, y: 206 },
  { t: "Process steps", g: "event", x: 214, y: 236 },
  { t: "System events", g: "event", x: 300, y: 222 },
];
const HUB = { x: 220, y: 128 };
const ORDER: Ctx[] = ["semantic", "business", "event"];

function BrainTile() {
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const [ctx, setCtx] = useState<Ctx>("semantic");
  const [touched, setTouched] = useState(false);
  const order = ORDER;
  useEffect(() => {
    if (!inView || reduce || touched) return;
    const t = setTimeout(() => setCtx((c) => ORDER[(ORDER.indexOf(c) + 1) % 3]), 4200);
    return () => clearTimeout(t);
  }, [inView, reduce, touched, ctx]);
  return (
    <Tile navy delay={80} className="flex flex-col p-5 sm:p-6 lg:col-span-5">
      <div ref={ref} className="flex items-center justify-between gap-3">
        <p className="v18-label text-(--ember)">Second Brain</p>
        <Illustrative navy>Illustrative graph</Illustrative>
      </div>
      <h3 className="mt-4 text-[1.5rem] font-bold leading-tight tracking-[-0.02em]">A Second Brain for your business.</h3>
      <p className="text-pretty mt-2 text-[0.9375rem] leading-[1.65] text-white/70">
        The intelligence layer holds the full context of the company. AI Agents work on top of it, end to end.
      </p>
      <svg viewBox="0 0 440 260" className="mt-5 h-auto w-full" role="img" aria-label={`Knowledge graph around the Second Brain. Highlighted: ${CONTEXTS[ctx].label} context.`}>
        {NODES.map((n) => {
          const on = n.g === ctx;
          return <line key={`e-${n.t}`} x1={HUB.x} y1={HUB.y} x2={n.x} y2={n.y} stroke={on ? "#f29a1f" : "#ffffff"} strokeOpacity={on ? 0.9 : 0.14} strokeWidth={on ? 1.5 : 1} style={{ transition: "stroke 500ms, stroke-opacity 500ms" }} />;
        })}
        <circle cx={HUB.x} cy={HUB.y} r="30" fill="#ffffff" />
        <text x={HUB.x} y={HUB.y - 2} textAnchor="middle" className="fill-(--navy) text-[9.5px] font-bold">
          Second
        </text>
        <text x={HUB.x} y={HUB.y + 10} textAnchor="middle" className="fill-(--navy) text-[9.5px] font-bold">
          Brain
        </text>
        {NODES.map((n) => {
          const on = n.g === ctx;
          const w = n.t.length * 5.6 + 18;
          return (
            <g key={n.t} style={{ transition: "opacity 500ms" }} opacity={on ? 1 : 0.55}>
              <rect x={Math.round(n.x - w / 2)} y={n.y - 11} width={Math.round(w)} height="22" rx="11" fill={on ? "#f29a1f" : "#232a6b"} style={{ transition: "fill 500ms" }} />
              <text x={n.x} y={n.y + 3.5} textAnchor="middle" className={`text-[9.5px] font-semibold ${on ? "fill-[#1a1205]" : "fill-white"}`}>
                {n.t}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-5">
        <Choice
          navy
          label="Context in the Second Brain"
          value={ctx}
          onChange={(v) => {
            setTouched(true);
            setCtx(v);
          }}
          options={order.map((id) => ({ id, label: CONTEXTS[id].label }))}
        />
        <p key={ctx} className="v18-screen-in text-pretty mt-3 min-h-[4.9em] text-[0.875rem] leading-[1.6] text-white/75">
          <span className="font-bold text-white">{CONTEXTS[ctx].label} context.</span> {CONTEXTS[ctx].body}
        </p>
      </div>
    </Tile>
  );
}

/* ---------------------------------------------------------------- Ontology */

const AXES = [
  { id: "data", name: "Data", role: "The facts", body: "Every system connected and reconciled into one set of trusted records." },
  { id: "analytics", name: "Analytics", role: "The meaning", body: "Metrics and rules defined once, on the business objects themselves." },
  { id: "ai", name: "AI", role: "The reasoning", body: "Agents that read the model, answer questions and act on what they find." },
  { id: "people", name: "People", role: "The judgement", body: "Owners, roles and decisions: who is accountable, who approves, who acts." },
  { id: "context", name: "Context", role: "The why", body: "Strategy, processes and rules of the business that give every number its purpose." },
] as const;
type Axis = (typeof AXES)[number]["id"];
const ring = AXES.map((a, i) => {
  const ang = -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length;
  return { ...a, x: Math.round(90 + Math.cos(ang) * 66), y: Math.round(90 + Math.sin(ang) * 66) };
});

function OntologyTile() {
  const [axis, setAxis] = useState<Axis>("data");
  const A = AXES.find((a) => a.id === axis)!;
  return (
    <Tile delay={120} className="grid gap-5 p-5 sm:grid-cols-[180px_1fr] sm:p-6 lg:col-span-5">
      <svg viewBox="0 0 180 180" className="mx-auto h-auto w-[160px] sm:w-full" aria-hidden="true">
        <circle cx="90" cy="90" r="66" fill="none" stroke="#e2e6ee" strokeDasharray="2 5" />
        {ring.map((n) => (
          <line key={n.id} x1="90" y1="90" x2={n.x} y2={n.y} stroke={n.id === axis ? "#f29a1f" : "#cfd5e1"} strokeWidth={n.id === axis ? 2 : 1} style={{ transition: "stroke 400ms" }} />
        ))}
        <circle cx="90" cy="90" r="24" fill="#101440" />
        <text x="90" y="93" textAnchor="middle" className="fill-white text-[7.5px] font-bold uppercase tracking-[0.08em]">
          Ontology
        </text>
        {ring.map((n) => (
          <g key={`n-${n.id}`}>
            <circle cx={n.x} cy={n.y} r="17" fill={n.id === axis ? "#101440" : "#fff"} stroke={n.id === axis ? "#f29a1f" : "#cfd5e1"} strokeWidth="1.5" style={{ transition: "fill 400ms, stroke 400ms" }} />
            <text x={n.x} y={n.y + 3} textAnchor="middle" className={`text-[7.5px] font-bold ${n.id === axis ? "fill-white" : "fill-(--ink)"}`}>
              {n.name}
            </text>
          </g>
        ))}
      </svg>
      <div className="min-w-0">
        <p className="v18-label text-(--sky-ink)">Our approach</p>
        <h3 className="mt-3 text-[1.375rem] font-bold leading-tight tracking-[-0.02em]">Data Ontology Intelligence.</h3>
        <p className="text-pretty mt-2 text-[0.875rem] leading-[1.6] text-(--ink-2)">
          A living model of your business: its objects, such as customers, orders, products and suppliers, their relationships and rules. We work where five axes meet on that one model.
        </p>
        <div className="mt-4">
          <Choice label="Ontology axis" value={axis} onChange={setAxis} options={AXES.map((a) => ({ id: a.id, label: a.name }))} />
        </div>
        <p key={axis} className="v18-screen-in mt-3 text-[0.875rem] leading-[1.6] text-(--ink-2)">
          <span className="font-bold text-(--ink)">{A.role}.</span> {A.body}
        </p>
      </div>
    </Tile>
  );
}

/* ---------------------------------------------------------------- One definition */

const REPORTS = [
  { n: "Board pack", before: 14.9 },
  { n: "Ops dashboard", before: 13.6 },
  { n: "Finance report", before: 14.2 },
];

function DefinitionTile() {
  const [mode, setMode] = useState<"before" | "after">("before");
  const after = mode === "after";
  return (
    <Tile delay={0} className="flex flex-col p-5 sm:p-6 lg:col-span-4">
      <div className="flex items-center justify-between gap-3">
        <p className="v18-label text-(--sky-ink)">Business intelligence</p>
        <Illustrative />
      </div>
      <h3 className="mt-4 text-[1.25rem] font-bold leading-tight tracking-[-0.02em]">One definition behind every report.</h3>
      <div className="mt-4">
        <Choice
          label="Revenue definition"
          value={mode}
          onChange={setMode}
          options={[
            { id: "before", label: "Three definitions" },
            { id: "after", label: "One definition" },
          ]}
        />
      </div>
      <ul className="mt-4 grid gap-2" aria-live="polite">
        {REPORTS.map((r) => {
          const v = after ? 14.4 : r.before;
          return (
            <li key={r.n} className="v18-well flex items-center justify-between gap-3 px-3.5 py-3">
              <span className="text-[0.875rem] font-semibold">{r.n}</span>
              <span className="flex items-center gap-3">
                <span className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-white sm:block" aria-hidden="true">
                  <span className={`block h-full rounded-full transition-[width,background-color] duration-700 ease-[var(--spring)] ${after ? "bg-(--sky-ink)" : "bg-(--ember)"}`} style={{ width: `${Math.round(((v - 12) / 4) * 100)}%` }} />
                </span>
                <span className={`v18-mono text-[0.9375rem] font-semibold transition-colors ${after ? "text-(--sky-ink)" : "text-(--ember-ink)"}`}>+{v.toFixed(1)}%</span>
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-auto pt-4 text-[0.8125rem] leading-[1.55] text-(--ink-3)">{after ? "Revenue growth, one certified definition. Every report agrees." : "Revenue growth as three teams calculate it. Which is right?"}</p>
    </Tile>
  );
}

/* ---------------------------------------------------------------- Alerts feed */

const EVENTS = [
  { t: "Inventory ageing above threshold", s: "Southeast · flagged to COO", warn: true },
  { t: "Board pack refreshed", s: "23 reports · one definition", warn: false },
  { t: "Overdue invoices followed up", s: "3 accounts · $2.1M", warn: false },
  { t: "Freight cost variance detected", s: "July carrier · +14%", warn: true },
  { t: "Month-end checks passed", s: "14 entities reconciled", warn: false },
];

function FeedTile() {
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const [head, setHead] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setHead((h) => h + 1), 2600);
    return () => clearInterval(id);
  }, [inView, reduce]);
  const rows = [0, 1, 2, 3].map((k) => ({ ...EVENTS[(head + EVENTS.length * 4 - k) % EVENTS.length], key: head - k }));
  return (
    <Tile delay={80} className="flex flex-col p-5 sm:p-6 lg:col-span-4">
      <div ref={ref} className="flex items-center justify-between gap-3">
        <p className="v18-label text-(--sky-ink)">Automation</p>
        <span className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-(--ok)">
          <span className="v18-live" aria-hidden="true" /> Live feed
        </span>
      </div>
      <h3 className="mt-4 text-[1.25rem] font-bold leading-tight tracking-[-0.02em]">Alerts and workflows that run themselves.</h3>
      <ol className="mt-4 grid gap-2" aria-label="Recent automations, illustrative">
        {rows.map((r, i) => (
          <li key={r.key} className={`flex items-start gap-3 rounded-[9px] px-3 py-2.5 ${i === 0 && !reduce ? "v18-screen-in" : ""} ${i === 0 ? "bg-(--grey) shadow-[inset_0_0_0_1px_var(--rule)]" : ""}`}>
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${r.warn ? "bg-(--ember)" : "bg-(--sky-ink)"}`} aria-hidden="true" />
            <span className="min-w-0">
              <span className="block truncate text-[0.875rem] font-semibold">{r.t}</span>
              <span className="block truncate text-[0.75rem] text-(--ink-3)">{r.s}</span>
            </span>
          </li>
        ))}
      </ol>
    </Tile>
  );
}

/* ---------------------------------------------------------------- Integrations */

const SYSTEMS = ["ERP", "CRM", "Warehouse", "BI tools", "Spreadsheets", "Cloud apps"];

function IntegrationsTile() {
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const [hot, setHot] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setHot((h) => (h + 1) % SYSTEMS.length), 1100);
    return () => clearInterval(id);
  }, [inView, reduce]);
  return (
    <Tile navy delay={160} className="flex flex-col p-5 sm:p-6 lg:col-span-4">
      <div ref={ref} className="flex items-center justify-between gap-3">
        <p className="v18-label text-(--ember)">Integrations</p>
        <Illustrative navy />
      </div>
      <h3 className="mt-4 text-[1.25rem] font-bold leading-tight tracking-[-0.02em]">Keep the technology that already runs the business.</h3>
      <ul className="mt-5 grid grid-cols-2 gap-2" aria-label="ERP, CRM, warehouse, BI tools, spreadsheets and cloud apps all connect into Genius Lab.">
        {SYSTEMS.map((s, i) => (
          <li key={s} className={`flex items-center justify-between gap-2 rounded-[8px] px-3 py-2.5 transition-colors duration-300 ${i === hot && inView && !reduce ? "bg-white/[0.14]" : "bg-white/[0.06]"}`}>
            <span className="text-[0.875rem] font-semibold">{s}</span>
            <span className="text-(--sky)">
              <span className="v18-live" aria-hidden="true" />
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center gap-3 pt-5" aria-hidden="true">
        <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-(--ember)" />
        <span className="inline-flex items-center rounded-[8px] bg-white px-3.5 py-2.5">
          <BrandLogo tone="navy" className="h-[11px] w-auto" />
        </span>
      </div>
    </Tile>
  );
}

export function IntelligenceV18() {
  return (
    <section id="intelligence" className="scroll-mt-16 bg-white py-24 sm:py-32" aria-labelledby="v18-intel-title">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        <SectionHead
          id="v18-intel-title"
          index="04"
          label="Intelligence layer"
          title="AI Agents that know your business."
          lead="Built on the Second Brain, Genius agents answer executive questions end to end, reading the systems, tables and metrics behind every number. Every tile here is a working preview."
        />
        <div className="mt-14 grid gap-4 lg:mt-16 lg:grid-cols-12">
          <AgentTile />
          <BrainTile />
          <OntologyTile />
          <DefinitionTile />
          <FeedTile />
          <IntegrationsTile />
        </div>
      </div>
    </section>
  );
}
