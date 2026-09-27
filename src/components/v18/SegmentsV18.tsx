"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";
import { Illustrative, SectionHead } from "./ui";

function Bar({ v, warn = false }: { v: number; warn?: boolean }) {
  return (
    <span className="block h-1.5 w-full overflow-hidden rounded-full bg-(--grey-2)" aria-hidden="true">
      <span className={`v18-grow-x block h-full rounded-full ${warn ? "bg-(--ember)" : "bg-(--navy)"}`} style={{ width: `${v}%` }} />
    </span>
  );
}

function Row({ a, b, c }: { a: ReactNode; b: ReactNode; c?: ReactNode }) {
  return (
    <li className="grid grid-cols-[1fr_5.5rem] items-center gap-4 border-b border-(--rule) py-3 last:border-b-0 sm:grid-cols-[1fr_8rem_5rem]">
      <span className="text-[0.875rem] font-semibold">{a}</span>
      <span className="hidden sm:block">{b}</span>
      <span className="v18-mono text-right text-[0.8125rem] text-(--ink-2)">{c}</span>
    </li>
  );
}

const SEGMENTS: { id: string; name: string; body: string; outcomes: string[]; view: { title: string; rows: ReactNode } }[] = [
  {
    id: "investment",
    name: "Investment Firms",
    body: "One live view across every portfolio company, with value creation tracked against the plan.",
    outcomes: ["Portfolio monitoring", "Value creation plans", "Board-ready reporting"],
    view: {
      title: "Value creation plan · by portfolio company",
      rows: [
        ["Portfolio company A", 78, "78%"],
        ["Portfolio company B", 64, "64%"],
        ["Portfolio company C", 41, "41%", true],
        ["Portfolio company D", 86, "86%"],
      ].map(([a, v, c, w]) => <Row key={a as string} a={a} b={<Bar v={v as number} warn={!!w} />} c={c} />),
    },
  },
  {
    id: "ma",
    name: "M&A Teams",
    body: "Diligence on real data, then integration that connects two companies' systems from day one.",
    outcomes: ["Data-driven diligence", "Day-one integration", "Synergy tracking"],
    view: {
      title: "Day-one integration · systems mapped",
      rows: [
        ["Finance and ledger", 100, "Mapped"],
        ["Customers and contracts", 92, "92%"],
        ["Supply chain", 70, "70%"],
        ["People and payroll", 35, "35%", true],
      ].map(([a, v, c, w]) => <Row key={a as string} a={a} b={<Bar v={v as number} warn={!!w} />} c={c} />),
    },
  },
  {
    id: "multi",
    name: "Multi-Entity Companies",
    body: "Every entity, currency and ledger consolidated into one trusted group picture.",
    outcomes: ["Automated consolidation", "Entity comparisons", "Group-wide KPIs"],
    view: {
      title: "Group consolidation · month end",
      rows: [
        ["Entities reconciled", 100, "14 / 14"],
        ["Currencies converted", 100, "6 / 6"],
        ["Intercompany matched", 88, "88%"],
        ["Adjustments open", 20, "3", true],
      ].map(([a, v, c, w]) => <Row key={a as string} a={a} b={<Bar v={v as number} warn={!!w} />} c={c} />),
    },
  },
  {
    id: "operating",
    name: "Operating Companies",
    body: "Daily operations run on shared numbers, with agents that flag what needs attention.",
    outcomes: ["Operational dashboards", "Forecasting", "Proactive alerts"],
    view: {
      title: "Operations today · against forecast",
      rows: [
        ["Orders shipped", 96, "96%"],
        ["On-time delivery", 91, "91%"],
        ["Inventory turns", 74, "74%"],
        ["Southeast backlog", 48, "Flagged", true],
      ].map(([a, v, c, w]) => <Row key={a as string} a={a} b={<Bar v={v as number} warn={!!w} />} c={c} />),
    },
  },
];

export function SegmentsV18() {
  const [active, setActive] = useState(0);
  const S = SEGMENTS[active];
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let n = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (i + 1) % SEGMENTS.length;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (i - 1 + SEGMENTS.length) % SEGMENTS.length;
    if (n < 0) return;
    e.preventDefault();
    setActive(n);
    document.getElementById(`v18-seg-${n}`)?.focus();
  };

  return (
    <section id="solutions" className="scroll-mt-16 bg-(--grey) py-24 sm:py-32" aria-labelledby="v18-seg-title">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        <SectionHead id="v18-seg-title" index="06" label="Solutions" title="Value creation for every stage of growth." />
        <div className="mt-14 grid gap-4 lg:mt-16 lg:grid-cols-12">
          <div role="tablist" aria-label="Who we work with" aria-orientation="vertical" className="grid gap-2 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1" data-rv="">
            {SEGMENTS.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.id}
                  id={`v18-seg-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="v18-seg-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`flex items-center justify-between gap-4 rounded-[12px] px-5 py-4 text-left transition-[background-color,box-shadow,color] duration-300 ${
                    on ? "bg-(--navy) text-white" : "bg-white text-(--ink) shadow-[0_0_0_1px_var(--rule)] hover:shadow-[0_0_0_1px_var(--rule-2)]"
                  }`}
                >
                  <span className="text-[1.0625rem] font-bold tracking-[-0.015em]">{s.name}</span>
                  <span className={`v18-mono text-[0.75rem] ${on ? "text-(--ember)" : "text-(--ink-3)"}`}>0{i + 1}</span>
                </button>
              );
            })}
          </div>

          <div id="v18-seg-panel" role="tabpanel" aria-labelledby={`v18-seg-${active}`} className="v18-tile grid gap-8 p-6 sm:p-8 lg:col-span-8 lg:grid-cols-[1fr_1.35fr]" data-rv="" style={{ ["--rd" as string]: "90ms" }}>
            <div key={`t-${active}`} className="v18-screen-in flex flex-col">
              <h3 className="text-[1.625rem] font-bold leading-tight tracking-[-0.025em]">{S.name}</h3>
              <p className="text-pretty mt-3 leading-[1.7] text-(--ink-2)">{S.body}</p>
              <ul className="mt-6 grid gap-2">
                {S.outcomes.map((o) => (
                  <li key={o} className="flex items-center gap-3 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-(--ember)" aria-hidden="true" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            <div key={`v-${active}`} className="v18-screen-in v18-well p-4 sm:p-5" style={{ animationDelay: "80ms" }}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.8125rem] font-bold">{S.view.title}</p>
                <Illustrative />
              </div>
              <ul className="mt-3 rounded-[8px] bg-white px-4 shadow-[0_0_0_1px_var(--rule)]">{S.view.rows}</ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
