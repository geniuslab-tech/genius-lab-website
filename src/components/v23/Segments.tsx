"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Check } from "@phosphor-icons/react";
import { SectionHead } from "./ui";

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

/** Segments as a tab set: the list on one side, the selected segment in full on the other. */
export function Segments() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent) => {
    const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (active + d + SEGMENTS.length) % SEGMENTS.length;
    setActive(n);
    tabs.current[n]?.focus();
  };
  const s = SEGMENTS[active];
  return (
    <section id="segments" className="scroll-mt-16 bg-white py-24 sm:py-32" data-v23-tone="light" data-v23-chapter="Solutions" aria-labelledby="v23-segments-title">
      <div className="v23-wrap">
        <SectionHead n="07" id="v23-segments-title" kicker="Solutions" title="Value creation for every stage of growth." />
        <div data-v23-rv className="mt-14 grid gap-4 lg:grid-cols-12">
          <div role="tablist" aria-orientation="vertical" aria-label="Solutions by segment" className="grid content-start border-t border-(--line-2) lg:col-span-5" onKeyDown={onKey}>
            {SEGMENTS.map((g, i) => {
              const on = i === active;
              return (
                <button
                  key={g.name}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`v23-seg-tab-${i}`}
                  aria-selected={on}
                  aria-controls="v23-seg-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className="group relative flex items-center justify-between gap-4 border-b border-(--line-2) py-5 pl-5 text-left"
                >
                  <span className={`absolute left-0 top-0 h-full w-[2px] origin-top transition-transform duration-500 ease-[var(--ease)] ${on ? "scale-y-100 bg-(--accent-2)" : "scale-y-0 bg-(--accent-2)"}`} aria-hidden="true" />
                  <span className={`text-[1.25rem] font-semibold tracking-[-0.02em] transition-colors ${on ? "text-(--tx)" : "text-(--tx-3) group-hover:text-(--tx)"}`}>{g.name}</span>
                  <span className="v23-mono text-[0.75rem] text-(--tx-3)">0{i + 1}</span>
                </button>
              );
            })}
          </div>
          <div id="v23-seg-panel" role="tabpanel" aria-labelledby={`v23-seg-tab-${active}`} className="v23-spot v23-tile relative overflow-hidden lg:col-span-7">
            <div key={s.name} className="v23-fade grid gap-8 sm:grid-cols-[1fr_auto]">
              <div>
                <p className="v23-label text-(--accent)">For {s.name}</p>
                <p className="mt-4 max-w-[30ch] text-pretty text-[1.5rem] font-semibold leading-snug tracking-[-0.02em]">{s.body}</p>
                <ul className="mt-8 grid gap-3">
                  {s.outcomes.map((o) => (
                    <li key={o} className="flex items-center gap-3 text-[1rem]">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#e3ebff] text-[#1f4fd1]">
                        <Check size={12} weight="bold" aria-hidden="true" />
                      </span>
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="v23-display self-start text-[clamp(4rem,9vw,7rem)] leading-none text-[#e6ecf5]" aria-hidden="true">
                0{active + 1}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
