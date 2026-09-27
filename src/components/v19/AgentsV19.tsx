"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "@phosphor-icons/react";
import { useInView, useReduced } from "./hooks";
import { HexMark, SectionHead, rd } from "./ui";

type Line = { t: string; v: string; o: string; m?: string };
type Agent = {
  name: string;
  scope: string;
  task: string;
  lines: Line[];
  result: string;
  decision?: string;
  offset: number;
};

/** Illustrative agent runs. Every figure here is a demonstration, not a client result. */
const AGENTS: Agent[] = [
  {
    name: "Finance agent",
    scope: "Finance workspace",
    task: "Why did our EBITDA margin drop in Q3, and what should we do about it?",
    lines: [
      { t: "0.2s", v: "read", o: "finance.gl_entries", m: "6.7M rows" },
      { t: "0.9s", v: "compare", o: "cost centres Q2 → Q3", m: "212 centres" },
      { t: "1.4s", v: "trace", o: "freight, discounts", m: "2 drivers" },
      { t: "1.8s", v: "join", o: "crm.deals · Northeast", m: "418 deals" },
      { t: "2.3s", v: "answer", o: "drafted with sources", m: "3 tables" },
    ],
    result: "EBITDA margin fell from 18.2% to 15.9%. Freight rose 14% after the July carrier change; Northeast discounting added $1.1M.",
    decision: "Renegotiate freight and cap regional discounts: ~1.8 pts back next quarter",
    offset: 0,
  },
  {
    name: "Cash agent",
    scope: "Treasury",
    task: "What will our cash position look like over the next 90 days?",
    lines: [
      { t: "0.3s", v: "read", o: "ar.invoices, ap.schedule", m: "3,140 items" },
      { t: "0.8s", v: "model", o: "payment behaviour by customer" },
      { t: "1.5s", v: "project", o: "weekly balances", m: "13 weeks" },
      { t: "1.9s", v: "check", o: "floor $4.0M", m: "ok" },
    ],
    result: "Cash stays above the $4M floor, with a low of $4.6M in week 7. Collecting three overdue enterprise invoices lifts it to $5.9M.",
    offset: 3,
  },
  {
    name: "Operations agent",
    scope: "Operations",
    task: "Which orders are at risk of shipping late this week?",
    lines: [
      { t: "0.2s", v: "read", o: "erp.orders · open", m: "2,906" },
      { t: "0.6s", v: "stream", o: "ops.events · carrier scans" },
      { t: "1.1s", v: "match", o: "SLA rules by account", m: "64 rules" },
      { t: "1.6s", v: "notify", o: "ops lead", m: "sent" },
    ],
    result: "37 orders are at risk, across three key accounts. The operations lead has the list and the carrier contacts.",
    offset: 6,
  },
  {
    name: "Portfolio agent",
    scope: "Investment firm",
    task: "Prepare portfolio KPIs for Thursday's board pack.",
    lines: [
      { t: "0.4s", v: "read", o: "9 entities · ledgers", m: "4 currencies" },
      { t: "1.2s", v: "normalise", o: "FX and calendars" },
      { t: "1.7s", v: "map", o: "group definitions", m: "38 KPIs" },
      { t: "2.4s", v: "build", o: "board pack draft", m: "14 pages" },
    ],
    result: "Draft ready: nine companies on one set of definitions, with variances against the value creation plan.",
    offset: 9,
  },
];

const HOLD = 5;
const TICK_MS = 850;

function AgentCard({ a, step, index }: { a: Agent; step: number | null; index: number }) {
  const n = a.lines.length;
  const shown = step === null ? n : Math.min(step, n);
  const complete = shown >= n;
  const running = step !== null && !complete;
  return (
    <li className="v19-rv" style={rd(index * 80)}>
      <article className="v19-beam relative grid overflow-hidden rounded-[14px] border border-[color:var(--line)] bg-[linear-gradient(180deg,var(--g3),var(--g2))] lg:grid-cols-[260px_1fr_320px]" data-on={running || undefined}>
        <div className="border-[color:var(--line)] p-5 max-lg:border-b lg:border-r">
          <div className="flex items-center gap-3">
            <span className="v19-hex inline-flex h-9 w-10 items-center justify-center bg-[rgb(var(--acc-rgb)/0.14)] text-[color:var(--acc-2)]">
              <HexMark size={15} />
            </span>
            <div>
              <h3 className="font-medium text-white">{a.name}</h3>
              <p className="text-[0.8125rem] text-[color:var(--tx-3)]">{a.scope}</p>
            </div>
          </div>
          <p className="mt-4 text-[0.9375rem] leading-[1.55] text-[color:var(--tx-2)]">&ldquo;{a.task}&rdquo;</p>
          <p className="v19-label mt-4 flex items-center gap-2 text-[color:var(--tx-3)]">
            <span className={`v19-dot ${running ? "v19-dot-acc v19-dot-live" : complete ? "v19-dot-ok" : "v19-dot-dim"}`} aria-hidden="true" />
            {running ? "Running" : complete ? "Complete" : "Queued"}
          </p>
        </div>

        <div className="min-w-0 border-[color:var(--line)] bg-[#060816] p-5 max-lg:border-b lg:border-r">
          <p className="v19-label text-[color:var(--tx-3)]">Task log</p>
          <ol className="v19-mono mt-3 min-h-[8.5rem] space-y-1.5 text-[0.75rem]" aria-label={`${a.name} task log`}>
            {a.lines.slice(0, shown).map((l, i) => (
              <li key={`${i}-${l.o}`} className={`${step === null ? "" : "v19-log-line"} grid grid-cols-[3rem_4.75rem_1fr] gap-2`}>
                <span className="text-[color:var(--tx-3)]">+{l.t}</span>
                <span className="text-[color:var(--acc-2)]">{l.v}</span>
                <span className="min-w-0 truncate text-[color:var(--tx)]">
                  {l.o}
                  {l.m && <span className="text-[color:var(--tx-3)]"> · {l.m}</span>}
                </span>
              </li>
            ))}
            {running && (
              <li className="grid grid-cols-[3rem_1fr] gap-2 text-[color:var(--tx-3)]" aria-hidden="true">
                <span />
                <span className="inline-block h-3.5 w-1.5 animate-pulse bg-[color:var(--acc)]" />
              </li>
            )}
          </ol>
        </div>

        <div className="flex flex-col p-5">
          <p className="v19-label text-[color:var(--tx-3)]">Answer</p>
          <div className={`mt-3 transition-[opacity,filter] duration-700 ${complete ? "opacity-100" : "opacity-30 blur-[2px]"}`}>
            <p className="text-[0.9375rem] leading-[1.55] text-[color:var(--tx)]">{a.result}</p>
            {a.decision && (
              <p className="mt-3 flex items-start gap-2 rounded-[10px] border border-[rgb(var(--warm-rgb)/0.45)] bg-[rgb(var(--warm-rgb)/0.07)] px-3 py-2 text-[0.8125rem] leading-[1.45] text-[#ffe2bd]">
                <Check size={14} weight="bold" className="mt-0.5 shrink-0 text-[color:var(--warm)]" aria-hidden="true" />
                {a.decision}
              </p>
            )}
          </div>
        </div>
      </article>
    </li>
  );
}

export function AgentsV19() {
  const reduce = useReduced();
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, "-10% 0px");
  const [tick, setTick] = useState<number | null>(null);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = window.setInterval(() => setTick((t) => (t === null ? 0 : t + 1)), TICK_MS);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  const stepOf = (a: Agent) => {
    if (tick === null || reduce) return null;
    const cycle = a.lines.length + HOLD;
    return (tick + cycle * 4 - a.offset) % cycle;
  };

  return (
    <section ref={root} id="agents" className="relative scroll-mt-16 py-24 sm:py-32" aria-labelledby="v19-agents-title">
      <div className="v19-wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead n="03" id="v19-agents-title" kicker="AI Agents" title="AI Agents that know your business." className="lg:col-span-7" />
          <p className="v19-rv v19-lead lg:col-span-5" style={rd(120)}>
            Built on the Second Brain, Genius agents answer executive questions end to end, reading the systems, tables and
            metrics behind every number, and showing their work.
          </p>
        </div>

        <ul className="mt-14 space-y-3 lg:mt-16">
          {AGENTS.map((a, i) => (
            <AgentCard key={a.name} a={a} step={stepOf(a)} index={i} />
          ))}
        </ul>
        <p className="v19-label mt-4 text-[color:var(--tx-3)]">Illustrative agent runs · figures are demonstrations</p>
      </div>
    </section>
  );
}
