"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { ArrowUp, Check, Sparkle } from "@phosphor-icons/react";
import { Eyebrow, Illustrative, Lines, SectionHead, useInView, useReducedMotion21 } from "./ui";
import { rd, wrap } from "./shared";

/* ---------- Second Brain: three kinds of context on one graph ---------- */

const TOPICS = [
  {
    name: "Semantic Context",
    body: "What every number means. Shared definitions for metrics, tables and dashboards, so revenue means the same thing in every report.",
    examples: ["Net revenue", "EBITDA margin", "Active customer"],
    nodes: [0, 1, 2, 3],
  },
  {
    name: "Business Context",
    body: "How the company actually works. Customers, operations and finance, and the relationships that connect them.",
    examples: ["Customers", "Entities", "Cost centres"],
    nodes: [4, 5, 6, 7],
  },
  {
    name: "Event Context",
    body: "What is happening right now. Transactions, process steps and system events, captured as they occur.",
    examples: ["Invoice posted", "Order shipped", "Forecast refreshed"],
    nodes: [8, 9, 10, 11],
  },
];

const r1 = (v: number) => Math.round(v * 10) / 10;
const GX = 250;
const GY = 200;
/* Twelve nodes on three rings of a hexagonal field, one ring per context. */
const NODES = Array.from({ length: 12 }, (_, i) => {
  const ring = Math.floor(i / 4);
  const k = i % 4;
  const rad = [72, 128, 176][ring];
  const ang = ((k * 90 + ring * 30 - 60) * Math.PI) / 180;
  return { x: r1(GX + Math.cos(ang) * rad * 1.15), y: r1(GY + Math.sin(ang) * rad * 0.92) };
});
const LABELS = ["Net revenue", "Margin", "Churn", "DSO", "Customers", "Entities", "Suppliers", "Cost centres", "Invoices", "Orders", "Payroll run", "Forecast"];
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [0, 4], [1, 5], [2, 6], [3, 7], [4, 5], [6, 7],
  [4, 8], [5, 9], [6, 10], [7, 11], [8, 9], [10, 11], [9, 6], [11, 4],
];

function hex(x: number, y: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = ((60 * i - 30) * Math.PI) / 180;
    return `${i ? "L" : "M"}${r1(x + r * Math.cos(a))} ${r1(y + r * Math.sin(a))}`;
  }).join(" ") + "Z";
}

function Graph({ active }: { active: number }) {
  const on = new Set(TOPICS[active].nodes);
  return (
    <svg viewBox="-70 0 640 400" className="h-auto w-full" role="img" aria-label={`The Second Brain as a graph of connected business knowledge. Highlighted: ${TOPICS[active].name}.`} data-rv="draw">
      {[72, 128, 176].map((rad, i) => (
        <ellipse key={i} cx={GX} cy={GY} rx={r1(rad * 1.15)} ry={r1(rad * 0.92)} fill="none" stroke="#e6e0d6" strokeDasharray="2 5" />
      ))}
      {EDGES.map(([a, b], i) => {
        const lit = on.has(a) && on.has(b);
        const half = on.has(a) || on.has(b);
        return (
          <path
            key={i}
            d={`M${NODES[a].x} ${NODES[a].y} L${NODES[b].x} ${NODES[b].y}`}
            pathLength={1}
            fill="none"
            stroke={lit ? "#2f55d4" : half ? "#9fb0e6" : "#d4ccbf"}
            strokeWidth={lit ? 1.6 : 1}
            className="v21-draw"
            style={{ transition: `stroke 500ms, stroke-width 500ms, stroke-dashoffset 1800ms cubic-bezier(0.22,1,0.36,1) ${i * 40}ms` }}
          />
        );
      })}
      <path d={hex(GX, GY, 30)} fill="#101440" />
      <path d={hex(GX, GY, 13)} fill="#2f55d4" />
      {NODES.map((n, i) => {
        const lit = on.has(i);
        const right = n.x >= GX;
        return (
          <g key={i} className="v21-fade" style={{ "--dd": `${500 + i * 40}ms` } as CSSProperties}>
            <path d={hex(n.x, n.y, lit ? 9 : 7)} fill={lit ? "#b0502a" : "#fcfbf8"} stroke={lit ? "#b0502a" : "#101440"} strokeWidth="1.2" style={{ transition: "fill 500ms, stroke 500ms" }} />
            <text
              x={right ? n.x + 15 : n.x - 15}
              y={n.y + 4}
              textAnchor={right ? "start" : "end"}
              fontSize="11.5"
              fontWeight={lit ? 600 : 400}
              fill={lit ? "#101440" : "#5f6178"}
            >
              {LABELS[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- AI Agents: a question answered, with the work shown ---------- */

const SCRIPT = [
  {
    q: "Why did our EBITDA margin drop in Q3, and what should we do about it?",
    steps: ["Read finance.gl_entries", "Compared Q2 and Q3 cost centres", "Traced freight and discount drivers"],
    a: "EBITDA margin fell from 18.2% to 15.9%. Freight rose 14% after the July carrier change, and Northeast discounting added $1.1M in promotional spend. Renegotiating freight and capping regional discounts recovers about 1.8 points next quarter.",
    next: "Draft a freight renegotiation brief for the COO",
  },
  {
    q: "What will our cash position look like over the next 90 days?",
    steps: ["Read ar.invoices and ap.schedule", "Applied payment behaviour by customer", "Projected weekly balances"],
    a: "Cash stays above the $4M floor, with a low of $4.6M in week 7 when the insurance premium and two supplier payments land together. Collecting three overdue enterprise invoices early lifts that low to $5.9M.",
    next: "Send collection reminders for the three invoices",
  },
];

const DONE = 5;

function AgentRun() {
  const reduce = useReducedMotion21();
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const [turn, setTurn] = useState(0);
  const [step, setStep] = useState(DONE);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!inView || reduce) return;
    let t: number;
    if (!started) {
      t = window.setTimeout(() => {
        setStarted(true);
        setStep(0);
      }, 300);
    } else if (step < DONE) {
      t = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? 900 : 1000);
    } else {
      t = window.setTimeout(() => {
        setTurn((n) => (n + 1) % SCRIPT.length);
        setStep(0);
      }, 7000);
    }
    return () => window.clearTimeout(t);
  }, [inView, reduce, started, step]);

  const S = SCRIPT[turn];
  const shownStep = reduce ? DONE : step;
  const answering = shownStep >= 4;

  return (
    <div ref={ref} className="v21-frame">
      <div className="v21-screen">
        <div className="flex items-center justify-between border-b border-[#efe9e0] px-4 py-3 sm:px-5">
          <span className="flex items-center gap-2 text-[0.8125rem] font-semibold text-[var(--ink)]">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-[8px] bg-[var(--blue-tint)] text-[var(--blue)]">
              <Sparkle size={13} weight="fill" aria-hidden="true" />
            </span>
            Finance agent
          </span>
          <span className={`v21-chip ${answering ? "v21-chip-ok" : "v21-chip-blue"}`}>{answering ? "Answered" : "Working"}</span>
        </div>

        <div className="space-y-4 bg-[#fdfcfa] p-4 sm:p-6" aria-live="polite">
          <div className="ml-auto max-w-[88%] rounded-[14px] rounded-tr-[4px] bg-[var(--ink)] px-4 py-3 text-[0.875rem] leading-[1.55] text-[#f4f1ec]">{S.q}</div>

          <ol className="space-y-2" aria-label="What the agent did">
            {S.steps.map((s, i) => {
              const done = shownStep > i + 1 || (shownStep === DONE);
              const now = shownStep === i + 1;
              return (
                <li key={s} className={`flex items-center gap-3 text-[0.8125rem] transition-opacity duration-500 ${shownStep > i ? "opacity-100" : "opacity-30"}`}>
                  <span
                    className={`inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                      done ? "bg-[var(--ok)] text-white" : now ? "text-[var(--blue)] shadow-[inset_0_0_0_1.5px_var(--blue)]" : "shadow-[inset_0_0_0_1.5px_#cfc7b9]"
                    }`}
                    aria-hidden="true"
                  >
                    {done ? <Check size={10} weight="bold" /> : now ? <span className="v21-pulse h-1.5 w-1.5 rounded-full bg-current" /> : null}
                  </span>
                  <span className="v21-mono text-[var(--ink-2)]">{s}</span>
                </li>
              );
            })}
          </ol>

          <div className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${answering ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">
              <div className="rounded-[14px] rounded-tl-[4px] border border-[#ece7df] bg-white px-4 py-3.5">
                <p className="text-[0.875rem] leading-[1.6] text-[var(--ink)]">{S.a}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#f0ebe3] pt-3">
                  <span className="text-[0.75rem] text-[var(--ink-3)]">Suggested next step</span>
                  <span className="v21-chip v21-chip-terra">{S.next}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-[12px] border border-[#ece7df] bg-white py-1.5 pl-4 pr-1.5" aria-hidden="true">
            <span className="flex-1 truncate text-[0.8125rem] text-[var(--ink-3)]">Ask a follow-up question</span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-[9px] bg-[var(--ink)] text-[#f4f1ec]">
              <ArrowUp size={14} weight="bold" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const TRAITS = [
  { k: "Reads the source", v: "Every answer names the tables and systems behind it." },
  { k: "Knows your definitions", v: "Margin means your margin, as defined in the Second Brain." },
  { k: "Acts with approval", v: "Agents draft, flag and schedule. People approve what matters." },
];

export function Brain21() {
  const reduce = useReducedMotion21();
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!inView || reduce || touched) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % TOPICS.length), 5200);
    return () => window.clearTimeout(t);
  }, [inView, reduce, touched, active]);

  return (
    <section id="brain" className="relative scroll-mt-20 py-20 sm:py-28" aria-labelledby="v21-brain-title">
      <div className={wrap}>
        <div className="rounded-[28px] bg-[var(--surface)] px-5 py-14 sm:px-10 sm:py-16 lg:py-20 xl:-mx-10">
          <div ref={ref} className="grid gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <SectionHead
                label="Second Brain"
                id="v21-brain-title"
                lines={["A Second Brain", "for your business."]}
                lead="The intelligence layer holds the full context of the company: its systems, tables, metrics, dashboards, processes, customers, operations and finances."
              />
              <ul className="mt-10 space-y-2" aria-label="Context in the Second Brain">
                {TOPICS.map((t, i) => {
                  const on = i === active;
                  return (
                    <li key={t.name}>
                      <button
                        type="button"
                        aria-expanded={on}
                        onClick={() => {
                          setTouched(true);
                          setActive(i);
                        }}
                        className={`w-full rounded-[16px] px-5 py-4 text-left transition-[background-color,box-shadow] duration-300 ${
                          on ? "bg-[var(--paper)] shadow-[0_0_0_1px_var(--rule),0_12px_28px_-22px_rgb(60_44_20/0.5)]" : "hover:bg-[#e2dcd2]"
                        }`}
                      >
                        <span className="flex items-center justify-between gap-4">
                          <span className="text-[1.0625rem] font-semibold text-[var(--ink)]">{t.name}</span>
                          <span className="v21-mono text-[0.75rem] text-[var(--ink-3)]">0{i + 1}</span>
                        </span>
                        <span className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                          <span className="overflow-hidden">
                            <span className="block pt-2 leading-[1.65] text-[var(--ink-2)]">{t.body}</span>
                            <span className="mt-3 flex flex-wrap gap-1.5">
                              {t.examples.map((x) => (
                                <span key={x} className="v21-chip v21-chip-terra">
                                  {x}
                                </span>
                              ))}
                            </span>
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div data-rv="up" style={rd(120)} className="lg:col-span-7 lg:self-center">
              <div className="rounded-[22px] bg-[var(--paper)] p-4 shadow-[0_0_0_1px_var(--rule-soft)] sm:p-8">
                <Graph active={active} />
              </div>
              <Illustrative className="mt-3">Knowledge graph · illustrative</Illustrative>
            </div>
          </div>
        </div>

        {/* Agents on top of the Second Brain. */}
        <div id="agents" className="mt-20 grid scroll-mt-20 gap-12 sm:mt-28 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Eyebrow>AI Agents</Eyebrow>
            <Lines lines={["AI Agents that know", "your business."]} className="v21-display mt-5 text-[clamp(2.1rem,4.6vw,3.6rem)]" />
            <p data-rv="up" style={rd(120)} className="v21-lead mt-6 max-w-[48ch]">
              Built on the Second Brain, Genius agents answer executive questions end to end, reading the systems, tables and metrics behind every number.
            </p>
            <dl className="mt-10 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
              {TRAITS.map((t, i) => (
                <div key={t.k} data-rv="up" style={rd(i * 80)} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="font-semibold text-[var(--ink)]">{t.k}</dt>
                  <dd className="leading-[1.6] text-[var(--ink-2)]">{t.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div data-rv="up" style={rd(100)} className="lg:col-span-7">
            <AgentRun />
            <Illustrative className="mt-3">Illustrative conversation · sample data</Illustrative>
          </div>
        </div>
      </div>
    </section>
  );
}
