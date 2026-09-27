"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowUp, Check, CircleNotch, UserCircleCheck } from "@phosphor-icons/react";
import { mulberry32, round, useInView, useReduced } from "./hooks";
import { SpotlightGroup } from "./Interactive";
import { HexMark, Illustrative, SectionHead, rd } from "./ui";

function Tile({ label, title, children, className = "", delay = 0 }: { label: string; title: string; children: ReactNode; className?: string; delay?: number }) {
  return (
    <article data-v23-rv style={rd(delay)} className={`v23-tile v23-spot ${className}`}>
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="v23-label text-(--accent)">{label}</p>
          <h3 className="mt-2 text-[1.1875rem] font-semibold tracking-[-0.02em]">{title}</h3>
        </div>
        <Illustrative />
      </header>
      {children}
    </article>
  );
}

/* ---------- Ask the Second Brain: a question types, the agent reads, the answer streams ---------- */

const SCRIPT = [
  {
    q: "Why did our EBITDA margin drop in Q3, and what should we do about it?",
    reads: ["finance.gl_entries", "Q2 vs Q3 cost centres", "freight and discount drivers"],
    a: "EBITDA margin fell from 18.2% to 15.9%. Two drivers explain most of it: freight costs rose 14% after the July carrier change, and Northeast discounting added $1.1M in promotional spend. Renegotiating freight and capping regional discounts recovers about 1.8 points next quarter.",
  },
  {
    q: "What will our cash position look like over the next 90 days?",
    reads: ["ar.invoices and ap.schedule", "payment behaviour by customer", "weekly balance projection"],
    a: "Cash stays above the $4M floor, with a low of $4.6M in week 7 when the annual insurance premium and two supplier payments land together. Collecting the three overdue enterprise invoices early lifts that low point to $5.9M.",
  },
];

type Phase = "typing" | "reading" | "answering" | "done";

function AskBrain() {
  const reduce = useReduced();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, "0px 0px -10% 0px");
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [n, setN] = useState(0);
  const S = SCRIPT[turn % SCRIPT.length];
  const words = useMemo(() => S.a.split(" "), [S]);

  useEffect(() => {
    if (!inView || reduce) return;
    let id: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (n < S.q.length) id = setTimeout(() => setN((v) => v + 1), 26 + ((n * 37) % 34));
      else
        id = setTimeout(() => {
          setN(0);
          setPhase("reading");
        }, 520);
    } else if (phase === "reading") {
      if (n < S.reads.length) id = setTimeout(() => setN((v) => v + 1), 760);
      else
        id = setTimeout(() => {
          setN(0);
          setPhase("answering");
        }, 380);
    } else if (phase === "answering") {
      if (n < words.length) id = setTimeout(() => setN((v) => v + 1), 48);
      else id = setTimeout(() => setPhase("done"), 200);
    } else {
      id = setTimeout(() => {
        setTurn((t) => t + 1);
        setN(0);
        setPhase("typing");
      }, 5600);
    }
    return () => clearTimeout(id);
  }, [inView, reduce, phase, n, S, words.length]);

  const still = reduce;
  const asked = still || phase !== "typing";
  const readCount = still || phase === "answering" || phase === "done" ? S.reads.length : phase === "reading" ? n : 0;
  const answer = still || phase === "done" ? S.a : phase === "answering" ? words.slice(0, n).join(" ") : "";
  const input = !still && phase === "typing" ? S.q.slice(0, n) : "";
  const status = still ? "Answered" : phase === "reading" ? "Reading" : phase === "answering" ? "Answering" : phase === "done" ? "Answered" : "Listening";

  return (
    <div ref={ref} className="mt-6 flex flex-1 flex-col">
      <div className="v23-well flex min-h-[340px] flex-1 flex-col gap-3 p-4 sm:min-h-[380px]" aria-live="polite">
        <p className="v23-label flex items-center gap-2 text-(--tx-3)">
          <span className={`h-1.5 w-1.5 rounded-full ${status === "Answered" || status === "Listening" ? "bg-[#1f9e8a]" : "v23-pulse bg-(--accent-2)"}`} aria-hidden="true" />
          Genius agent · {status}
        </p>
        {asked && <p className="ml-auto max-w-[85%] rounded-[12px] rounded-br-[4px] bg-[#101440] px-4 py-3 text-[0.9375rem] leading-[1.55] text-white">{S.q}</p>}
        {asked && (
          <ol className="grid gap-1.5" aria-label="What the agent reads">
            {S.reads.map((r, i) => {
              const ok = i < readCount;
              const now = !still && phase === "reading" && i === n;
              return (
                <li key={r} className={`v23-mono flex items-center gap-2 text-[0.75rem] transition-opacity duration-300 ${ok || now ? "opacity-100" : "opacity-40"}`}>
                  <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full ${ok ? "bg-[#d9f2ee] text-[#0b6b61]" : "border border-(--line-2)"}`}>
                    {ok ? <Check size={9} weight="bold" aria-hidden="true" /> : now ? <CircleNotch size={9} className="v23-spin" aria-hidden="true" /> : null}
                  </span>
                  <span className="text-(--tx-2)">Reading {r}</span>
                </li>
              );
            })}
          </ol>
        )}
        {answer && (
          <p className="max-w-[92%] rounded-[12px] rounded-tl-[4px] border border-(--line) bg-white px-4 py-3 text-[0.9375rem] leading-[1.6] text-(--tx)">
            {answer}
            {!still && phase === "answering" && <span className="v23-caret" aria-hidden="true" />}
          </p>
        )}
      </div>
      <div className="mt-3 flex items-center gap-3 rounded-[12px] border border-(--line-2) bg-white px-4 py-2.5">
        <span className={`min-w-0 flex-1 truncate text-[0.9375rem] ${input ? "text-(--tx)" : "text-(--tx-3)"}`}>
          {input || "Ask about the business"}
          {input && <span className="v23-caret" aria-hidden="true" />}
        </span>
        <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] transition-colors ${input ? "bg-[#101440] text-white" : "bg-(--chip) text-(--tx-3)"}`} aria-hidden="true">
          <ArrowUp size={14} weight="bold" />
        </span>
      </div>
    </div>
  );
}

/* ---------- KPIs that tick ---------- */

const KPI = [
  { name: "Revenue, YTD", base: 48.2, step: 0.07, fmt: (v: number) => `$${v.toFixed(1)}M`, note: "+6.4% vs plan" },
  { name: "EBITDA margin", base: 17.1, step: 0.03, fmt: (v: number) => `${v.toFixed(1)}%`, note: "+0.9 pts" },
  { name: "Open orders", base: 1284, step: 9, fmt: (v: number) => Math.round(v).toLocaleString("en-US"), note: "live" },
  { name: "On-time delivery", base: 94.2, step: 0.05, fmt: (v: number) => `${v.toFixed(1)}%`, note: "+1.3 pts" },
];
const DRIFT = (() => {
  const r = mulberry32(404);
  let acc = 0;
  return Array.from({ length: 24 }, () => (acc += Math.round((r() - 0.38) * 3)));
})();

function Kpis() {
  const reduce = useReduced();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [k, setK] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setK((v) => (v + 1) % DRIFT.length), 2100);
    return () => clearInterval(id);
  }, [inView, reduce]);
  return (
    <div ref={ref} className="mt-6 grid grid-cols-2 gap-2">
      {KPI.map((m, i) => {
        const v = m.base + DRIFT[(k + i * 5) % DRIFT.length] * m.step;
        const text = m.fmt(v);
        return (
          <div key={m.name} className="v23-well p-4">
            <p className="text-[0.75rem] text-(--tx-3)">{m.name}</p>
            <p className="v23-num mt-1.5 overflow-hidden text-[1.5rem] font-semibold leading-tight tracking-[-0.025em]">
              <span key={text} className="v23-tick inline-block">
                {text}
              </span>
            </p>
            <p className="v23-mono mt-1 text-[0.6875rem] text-[#0b6b61]">{m.note}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Forecast: actuals, then a projected band, with a crosshair ---------- */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const SERIES = (() => {
  const r = mulberry32(9090);
  let v = 3.1;
  return MONTHS.map((m, i) => {
    v += 0.08 + (r() - 0.42) * 0.22;
    const f = i >= 12;
    const spread = f ? round(0.12 + (i - 11) * 0.07, 3) : 0;
    return { m, v: round(v, 2), lo: round(v - spread, 2), hi: round(v + spread, 2), f };
  });
})();
const CW = 600;
const CH = 210;
const PAD = 14;
const MIN = Math.min(...SERIES.map((s) => s.lo)) - 0.2;
const MAX = Math.max(...SERIES.map((s) => s.hi)) + 0.2;
const X = (i: number) => round(PAD + (i / (SERIES.length - 1)) * (CW - PAD * 2), 1);
const Y = (v: number) => round(CH - PAD - ((v - MIN) / (MAX - MIN)) * (CH - PAD * 2), 1);
const ACT = SERIES.slice(0, 13).map((s, i) => `${X(i)},${Y(s.v)}`).join(" ");
const FC = SERIES.slice(12).map((s, i) => `${X(i + 12)},${Y(s.v)}`).join(" ");
const BAND =
  SERIES.slice(12).map((s, i) => `${X(i + 12)},${Y(s.hi)}`).join(" ") +
  " " +
  SERIES.slice(12)
    .map((s, i) => `${X(i + 12)},${Y(s.lo)}`)
    .reverse()
    .join(" ");

function Forecast() {
  const [hover, setHover] = useState<number | null>(null);
  const idx = hover ?? 17;
  const s = SERIES[idx];
  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="v23-num text-[1.75rem] font-semibold tracking-[-0.03em]">
          ${s.v.toFixed(2)}M <span className="text-[0.875rem] font-medium text-(--tx-3)">monthly revenue</span>
        </p>
        <p className="v23-mono text-[0.75rem] text-(--tx-3)">
          {s.m} · {s.f ? `forecast, range $${s.lo.toFixed(2)}M to $${s.hi.toFixed(2)}M` : "actual"}
        </p>
      </div>
      <svg
        viewBox={`0 0 ${CW} ${CH}`}
        className="v23-chart mt-4 h-auto w-full touch-pan-y"
        role="img"
        aria-label="Illustrative monthly revenue: twelve months of actuals rising gradually, then a six-month forecast with a widening range."
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width) * CW;
          setHover(Math.max(0, Math.min(SERIES.length - 1, Math.round(((x - PAD) / (CW - PAD * 2)) * (SERIES.length - 1)))));
        }}
        onPointerLeave={() => setHover(null)}
      >
        {[0.25, 0.5, 0.75].map((t) => (
          <line key={t} x1={PAD} x2={CW - PAD} y1={round(PAD + t * (CH - PAD * 2), 1)} y2={round(PAD + t * (CH - PAD * 2), 1)} stroke="#e5eaf2" />
        ))}
        <line x1={X(12)} x2={X(12)} y1={PAD} y2={CH - PAD} stroke="#cdd5e2" strokeDasharray="3 4" />
        <text x={X(12) + 6} y={PAD + 10} className="v23-mono" fontSize="10" fill="#5a6583">
          forecast
        </text>
        <polygon points={BAND} fill="rgb(31 79 209 / 0.1)" className="v23-chart-band" />
        <polyline points={ACT} fill="none" stroke="#101440" strokeWidth="2.25" strokeLinejoin="round" pathLength={1} className="v23-draw" />
        <polyline points={FC} fill="none" stroke="#1f4fd1" strokeWidth="2" strokeDasharray="5 5" strokeLinejoin="round" className="v23-chart-band" />
        <line x1={X(idx)} x2={X(idx)} y1={PAD} y2={CH - PAD} stroke="#0b1030" strokeOpacity="0.25" />
        <circle cx={X(idx)} cy={Y(s.v)} r="5" fill="#fff" stroke={s.f ? "#1f4fd1" : "#101440"} strokeWidth="2" />
      </svg>
      <div className="v23-mono mt-2 flex justify-between text-[0.6875rem] text-(--tx-3)" aria-hidden="true">
        <span>Jan, last year</span>
        <span>Jan</span>
        <span>Jun</span>
      </div>
    </div>
  );
}

/* ---------- Agents queue: work moving through, one item waiting on a person ---------- */

const TASKS = [
  { t: "Reconcile intercompany balances", a: "Finance agent", o: 0 },
  { t: "Flag late supplier deliveries", a: "Operations agent", o: 3 },
  { t: "Draft board pack commentary", a: "Finance agent", o: 6, approve: true },
  { t: "Refresh the 90-day cash forecast", a: "Treasury agent", o: 8 },
  { t: "Check discount policy breaches", a: "Sales agent", o: 10 },
];
const CYCLE = 12;

function Queue() {
  const reduce = useReduced();
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref);
  const [step, setStep] = useState(9);
  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setStep((v) => v + 1), 900);
    return () => clearInterval(id);
  }, [inView, reduce]);
  return (
    <ul ref={ref} className="mt-6 grid gap-2">
      {TASKS.map((t) => {
        const ph = (step + t.o) % CYCLE;
        const state = ph < 3 ? "queued" : ph < 8 ? "running" : t.approve ? "approval" : "done";
        const prog = state === "running" ? (ph - 3 + 1) / 5 : state === "queued" ? 0 : 1;
        return (
          <li key={t.t} className="v23-well relative overflow-hidden px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[0.875rem] font-medium">{t.t}</p>
                <p className="v23-mono mt-0.5 text-[0.6875rem] text-(--tx-3)">{t.a}</p>
              </div>
              <span
                className={`v23-mono inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-[0.6875rem] ${
                  state === "done"
                    ? "bg-[#dcf3ee] text-[#0b6b61]"
                    : state === "running"
                      ? "bg-[#e3ebff] text-[#1f4fd1]"
                      : state === "approval"
                        ? "bg-[#fff0dc] text-[#8a4b00]"
                        : "bg-(--chip) text-(--tx-3)"
                }`}
              >
                {state === "done" && <Check size={10} weight="bold" aria-hidden="true" />}
                {state === "running" && <CircleNotch size={10} className="v23-spin" aria-hidden="true" />}
                {state === "approval" && <UserCircleCheck size={11} aria-hidden="true" />}
                {state === "approval" ? "needs approval" : state}
              </span>
            </div>
            <span className="absolute inset-x-0 bottom-0 block h-[2px] bg-transparent" aria-hidden="true">
              <span
                className={`block h-full origin-left transition-transform duration-700 ease-out ${state === "approval" ? "bg-[#e8a24a]" : "bg-(--accent-2)"}`}
                style={{ transform: `scaleX(${prog})` }}
              />
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- Context the Second Brain holds ---------- */

const CONTEXT = [
  {
    name: "Semantic",
    body: "What every number means. Shared definitions for metrics, tables and dashboards, so revenue means the same thing in every report.",
    code: [
      ["metric", "revenue"],
      ["  =", "sum(invoice.net_amount)"],
      ["  where", "invoice.status = 'posted'"],
      ["  owner", "Finance"],
    ],
  },
  {
    name: "Business",
    body: "How the company actually works. Customers, operations and finance, and the relationships that connect them.",
    code: [
      ["customer", "→ orders → invoices"],
      ["supplier", "→ purchase_orders → stock"],
      ["entity", "→ ledgers → group"],
      ["order", "→ shipment → delivery"],
    ],
  },
  {
    name: "Event",
    body: "What is happening right now. Transactions, process steps and system events, captured as they occur.",
    code: [
      ["09:41", "order.created · ERP"],
      ["09:41", "invoice.posted · GL"],
      ["09:42", "shipment.delayed · WMS"],
      ["09:42", "agent.flagged · Operations"],
    ],
  },
];

function Context() {
  const reduce = useReduced();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (!inView || reduce || touched) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % CONTEXT.length), 4600);
    return () => clearTimeout(id);
  }, [inView, reduce, touched, active]);
  const c = CONTEXT[active];
  return (
    <div ref={ref} className="mt-6">
      <div className="inline-flex rounded-[10px] bg-(--chip) p-1" role="tablist" aria-label="Context in the Second Brain">
        {CONTEXT.map((t, i) => (
          <button
            key={t.name}
            type="button"
            role="tab"
            id={`v23-ctx-tab-${i}`}
            aria-selected={i === active}
            aria-controls="v23-ctx-panel"
            onClick={() => {
              setTouched(true);
              setActive(i);
            }}
            className={`rounded-[7px] px-3 py-1.5 text-[0.8125rem] font-medium transition-[background-color,color,box-shadow] duration-200 ${
              i === active ? "bg-white text-(--tx) shadow-[0_1px_2px_rgb(16_20_64/0.12)]" : "text-(--tx-3) hover:text-(--tx)"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div id="v23-ctx-panel" role="tabpanel" aria-labelledby={`v23-ctx-tab-${active}`} className="mt-4">
        <p className="min-h-[4.9em] text-pretty text-[0.9375rem] leading-[1.6] text-(--tx-2)">{c.body}</p>
        <pre key={c.name} className="v23-code v23-mono v23-fade mt-4 overflow-x-auto text-[0.75rem] leading-[1.9]">
          {c.code.map(([a, b]) => (
            <span key={a + b} className="block">
              <span className="text-[#1f4fd1]">{a}</span> <span className="text-(--tx)">{b}</span>
            </span>
          ))}
        </pre>
      </div>
    </div>
  );
}

/* ---------- Sections ---------- */

const PATH = ["Complexity", "Connection", "Understanding", "Visibility", "Intelligence", "Decisions"];

export function Decisions() {
  return (
    <section id="decisions" className="bg-white pb-8 pt-24 sm:pt-28" data-v23-tone="light" data-v23-chapter="Decisions" aria-labelledby="v23-decisions-title">
      <div className="v23-wrap">
        <div data-v23-rv>
          <p className="v23-label flex items-center gap-3 text-(--tx-3)">
            <HexMark size={14} className="text-(--accent)" />
            The outcome
          </p>
        </div>
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 id="v23-decisions-title" data-v23-rv style={rd(60)} className="v23-display text-[clamp(2.6rem,6.4vw,5.5rem)] lg:col-span-8">
            Better business decisions.
          </h2>
          <p data-v23-rv style={rd(140)} className="v23-lead max-w-[46ch] lg:col-span-4 lg:pb-3">
            Each layer builds on the one beneath it. Together they give executives clear insight, full visibility and the confidence to act.
          </p>
        </div>
        <ol className="mt-14 grid grid-cols-2 border-t border-(--line) sm:grid-cols-3 lg:grid-cols-6" aria-label="The path from complexity to decisions">
          {PATH.map((w, i) => (
            <li key={w} data-v23-rv style={rd(i * 60)} className="border-b border-(--line) py-5 pr-4 lg:border-b-0">
              <span className="v23-mono text-[0.6875rem] text-(--tx-3)">0{i + 1}</span>
              <p className={`mt-2 text-[1.0625rem] font-semibold tracking-[-0.015em] ${i === PATH.length - 1 ? "text-(--accent-2)" : i === 0 ? "text-(--tx-3)" : ""}`}>{w}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Brain() {
  return (
    <section id="brain" className="scroll-mt-16 bg-white py-24 sm:py-28" data-v23-tone="light" data-v23-chapter="Second Brain" aria-labelledby="v23-brain-title">
      <div className="v23-wrap">
        <SectionHead
          n="03"
          id="v23-brain-title"
          kicker="Second Brain and AI Agents"
          title="A Second Brain for your business."
          lead="The intelligence layer holds the full context of the company: its systems, tables, metrics, dashboards, processes, customers, operations and finances. AI Agents work on top of it, end to end."
        />
        <SpotlightGroup className="mt-14 grid gap-3 lg:grid-cols-12">
          <Tile label="AI Agents" title="Ask the Second Brain" className="flex flex-col lg:col-span-7 lg:row-span-2">
            <p className="mt-2 max-w-[56ch] text-[0.9375rem] leading-[1.6] text-(--tx-2)">
              Genius agents answer executive questions end to end, reading the systems, tables and metrics behind every number.
            </p>
            <AskBrain />
          </Tile>
          <Tile label="Business Intelligence" title="One set of live numbers" className="lg:col-span-5" delay={80}>
            <Kpis />
          </Tile>
          <Tile label="Agents at work" title="The execution queue" className="lg:col-span-5" delay={140}>
            <Queue />
          </Tile>
          <Tile label="Analytics" title="What is likely to happen next" className="lg:col-span-7" delay={60}>
            <Forecast />
          </Tile>
          <Tile label="Context" title="What the Second Brain holds" className="lg:col-span-5" delay={120}>
            <Context />
          </Tile>
        </SpotlightGroup>
        <p className="v23-label mt-5 text-(--tx-3)">Every question, answer, figure and task shown is illustrative.</p>
      </div>
    </section>
  );
}
