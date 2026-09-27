"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Heading, R } from "./ui";

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

function Outcomes({ items }: { items: string[] }) {
  return (
    <ul className="mt-8 border-t v20-rule">
      {items.map((o) => (
        <li key={o} className="v20-fg flex items-center justify-between gap-4 border-b v20-rule py-3.5 text-[1rem] font-medium">
          {o}
          <span className="v20-dot" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
}

/**
 * Four starting points. On wide screens the names are a quiet index on the left and the
 * detail cross-fades in a large card on the right; on phones every segment is simply listed.
 */
export function Solutions() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const seg = SEGMENTS[active];

  return (
    <section id="solutions" data-tone="mist" className="v20-sec py-28 sm:py-40" aria-labelledby="v20-solutions-title">
      <div className="mx-auto max-w-[1120px] px-5">
        <Heading id="v20-solutions-title" eyebrow="Solutions" title="Value creation for every stage of growth." width="16ch" />

        {/* Wide: index + detail */}
        <R className="mt-20 hidden gap-12 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div role="tablist" aria-label="Solutions" aria-orientation="vertical" className="flex flex-col justify-center">
            {SEGMENTS.map((s, i) => (
              <button
                key={s.name}
                type="button"
                role="tab"
                id={`v20-sol-tab-${i}`}
                aria-selected={i === active}
                aria-controls="v20-sol-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                    e.preventDefault();
                    const n = (active + (e.key === "ArrowDown" ? 1 : SEGMENTS.length - 1)) % SEGMENTS.length;
                    setActive(n);
                    document.getElementById(`v20-sol-tab-${n}`)?.focus();
                  }
                }}
                className={`v20-display py-3 text-left text-[clamp(1.75rem,2.8vw,2.5rem)] tracking-[-0.035em] transition-colors duration-500 ${i === active ? "v20-fg" : "v20-fg3 hover:text-[var(--fg2)]"}`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div id="v20-sol-panel" role="tabpanel" aria-labelledby={`v20-sol-tab-${active}`} className="v20-card relative min-h-[420px] overflow-hidden p-12">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={seg.name}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 24, mass: 0.8 }}
              >
                <p className="v20-acc v20-num text-[0.9375rem] font-semibold">0{active + 1}</p>
                <h3 className="v20-display v20-h3 mt-3">{seg.name}</h3>
                <p className="v20-lead mt-5 max-w-[34ch]">{seg.body}</p>
                <Outcomes items={seg.outcomes} />
              </motion.div>
            </AnimatePresence>
          </div>
        </R>

        {/* Narrow: every segment in turn */}
        <ol className="mt-14 space-y-4 lg:hidden">
          {SEGMENTS.map((s, i) => (
            <R as="li" key={s.name} className="v20-card p-7">
              <p className="v20-acc v20-num text-[0.9375rem] font-semibold">0{i + 1}</p>
              <h3 className="v20-display v20-h4 mt-2 text-[1.625rem]">{s.name}</h3>
              <p className="v20-fg2 mt-3">{s.body}</p>
              <Outcomes items={s.outcomes} />
            </R>
          ))}
        </ol>
      </div>
    </section>
  );
}
