"use client";

import { useRef, type PointerEvent } from "react";
import { SectionHead, rd } from "./ui";

const SEGMENTS = [
  {
    name: "Investment Firms",
    body: "One live view across every portfolio company, with value creation tracked against the plan.",
    outcomes: ["Portfolio monitoring", "Value creation plans", "Board-ready reporting"],
  },
  {
    name: "M&A Teams",
    body: "Diligence on real data, then integration that connects two companies' systems from day one.",
    outcomes: ["Data-driven diligence", "Day-one integration", "Synergy tracking"],
  },
  {
    name: "Multi-Entity Companies",
    body: "Every entity, currency and ledger consolidated into one trusted group picture.",
    outcomes: ["Automated consolidation", "Entity comparisons", "Group-wide KPIs"],
  },
  {
    name: "Operating Companies",
    body: "Daily operations run on shared numbers, with agents that flag what needs attention.",
    outcomes: ["Operational dashboards", "Forecasting", "Proactive alerts"],
  },
];

/** A row that carries a soft light under the cursor. */
function Row({ s, i }: { s: (typeof SEGMENTS)[number]; i: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const onMove = (e: PointerEvent<HTMLLIElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${(e.clientX - r.left).toFixed(0)}px`);
    el.style.setProperty("--sy", `${(e.clientY - r.top).toFixed(0)}px`);
    el.style.setProperty("--so", "1");
  };
  const onLeave = () => ref.current?.style.setProperty("--so", "0");
  return (
    <li
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="v19-rv v19-spot group relative grid gap-4 border-b border-[color:var(--line)] py-8 md:grid-cols-12 md:items-baseline md:gap-8 md:px-4"
      style={rd(i * 80)}
    >
      <span className="v19-label text-[color:var(--acc-2)] md:col-span-1">0{i + 1}</span>
      <h3 className="v19-h3 text-[clamp(1.5rem,2.6vw,2.125rem)] transition-transform duration-500 ease-[var(--ease)] md:col-span-4 md:group-hover:translate-x-1.5">{s.name}</h3>
      <p className="leading-[1.65] text-[color:var(--tx-2)] md:col-span-4">{s.body}</p>
      <ul className="flex flex-wrap gap-1.5 md:col-span-3 md:justify-end">
        {s.outcomes.map((o) => (
          <li key={o} className="v19-mono rounded-full border border-[color:var(--line-2)] px-2.5 py-1 text-[0.6875rem] text-[color:var(--tx-2)] transition-colors duration-300 group-hover:border-[rgb(var(--acc-rgb)/0.4)]">
            {o}
          </li>
        ))}
      </ul>
    </li>
  );
}

export function SegmentsV19() {
  return (
    <section id="segments" className="relative scroll-mt-16 border-t border-[color:var(--line)] py-24 sm:py-32" aria-labelledby="v19-segments-title">
      <div className="v19-wrap">
        <SectionHead n="07" id="v19-segments-title" kicker="Solutions" title="Value creation for every stage of growth." />
        <ul className="mt-12 border-t border-[color:var(--line)] lg:mt-16">
          {SEGMENTS.map((s, i) => (
            <Row key={s.name} s={s} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
