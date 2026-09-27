"use client";

import { motion } from "motion/react";
import { Rise, SectionHead, SPRING, type Tint } from "./ui";

const SEGMENTS: { name: string; body: string; outcomes: string[]; tint: Tint }[] = [
  {
    name: "Investment Firms",
    body: "One live view across every portfolio company, with value creation tracked against the plan.",
    outcomes: ["Portfolio monitoring", "Value creation plans", "Board-ready reporting"],
    tint: "terra",
  },
  {
    name: "M&A Teams",
    body: "Diligence on real data, then integration that connects two companies' systems from day one.",
    outcomes: ["Data-driven diligence", "Day-one integration", "Synergy tracking"],
    tint: "sky",
  },
  {
    name: "Multi-Entity Companies",
    body: "Every entity, currency and ledger consolidated into one trusted group picture.",
    outcomes: ["Automated consolidation", "Entity comparisons", "Group-wide KPIs"],
    tint: "ochre",
  },
  {
    name: "Operating Companies",
    body: "Daily operations run on shared numbers, with agents that flag what needs attention.",
    outcomes: ["Operational dashboards", "Forecasting", "Proactive alerts"],
    tint: "sage",
  },
];

export function Segments17() {
  return (
    <section id="segments" className="scroll-mt-20 py-24 sm:py-32" aria-labelledby="v17-segments-title">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
        <SectionHead
          id="v17-segments-title"
          label="Solutions"
          tint="sky"
          title={
            <>
              Value creation for every <em>stage of growth</em>.
            </>
          }
          className="max-w-[46rem]"
        />
        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {SEGMENTS.map((s, i) => (
            <li key={s.name}>
              <Rise delay={(i % 2) * 0.08}>
                <motion.article
                  whileHover={{ y: -8, rotate: i % 2 ? 0.8 : -0.8 }}
                  transition={SPRING}
                  className={`v17-panel v17-tint-${s.tint} flex h-full flex-col p-7 sm:p-10`}
                >
                  <p className="v17-hand text-[1.0625rem] text-[var(--ink-2)]">For</p>
                  <h3 className="v17-display mt-1 text-[clamp(1.875rem,3.2vw,2.5rem)]">{s.name}</h3>
                  <p className="mt-4 max-w-[42ch] text-pretty text-[1.0625rem] leading-[1.65] text-[var(--ink-2)]">{s.body}</p>
                  <ul className="mt-8 flex flex-wrap gap-2">
                    {s.outcomes.map((o) => (
                      <li key={o} className="rounded-full bg-[var(--paper)] px-3.5 py-1.5 text-[0.875rem] font-medium text-[var(--ink)]">
                        {o}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              </Rise>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
