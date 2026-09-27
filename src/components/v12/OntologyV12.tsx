"use client";

import { useState } from "react";
import { SectionHead, Tile } from "./ui";

const AXES = [
  { name: "Data", role: "The facts", body: "Every system connected and reconciled into one set of trusted records." },
  { name: "Analytics", role: "The meaning", body: "Metrics and rules defined once, on the business objects themselves." },
  { name: "AI", role: "The reasoning", body: "Agents that read the model, answer questions and act on what they find." },
  { name: "People", role: "The judgement", body: "Owners, roles and decisions: who is accountable, who approves, who acts." },
  { name: "Business Context", role: "The why", body: "Strategy, processes and rules of the business that give every number its purpose." },
];

/** Five axes as columns. The one you point at opens; the others make room. */
export function OntologyV12() {
  const [active, setActive] = useState(0);
  return (
    <section id="ontology" className="scroll-mt-24 py-20 sm:py-28" aria-labelledby="v12-ontology-title">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <SectionHead
          id="v12-ontology-title"
          index="05"
          label="Our approach"
          title="Data Ontology Intelligence."
          lead="We are not only a data, analytics or AI company. We work where data, analytics, AI, people and business context meet."
        />

        <Tile className="mt-12 p-2 sm:p-3">
          <ul className="flex flex-col gap-1.5 lg:h-[340px] lg:flex-row" aria-label="The five axes">
            {AXES.map((a, i) => {
              const on = i === active;
              return (
                <li
                  key={a.name}
                  className={`min-w-0 transition-[flex-grow] duration-[800ms] ease-[var(--spring)] lg:basis-0 ${on ? "lg:grow-[3.2]" : "lg:grow"}`}
                >
                  <button
                    type="button"
                    aria-pressed={on}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={`flex h-full w-full flex-col justify-between gap-6 overflow-hidden rounded-[14px] p-5 text-left transition-colors duration-500 sm:p-6 ${
                      on ? "bg-(--ink) text-white" : "bg-(--ground) text-(--ink) hover:bg-(--ground-2)"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className={`v12-mono text-[0.75rem] ${on ? "text-(--lime)" : "text-(--ink-3)"}`}>0{i + 1}</span>
                      <span className={`v12-label truncate ${on ? "text-white/55" : "text-(--ink-3)"}`}>{a.role}</span>
                    </span>
                    <span className="block">
                      <span className="block text-[clamp(1.375rem,2.2vw,1.875rem)] font-semibold leading-[1.05] tracking-[-0.035em]">{a.name}</span>
                      <span
                        className={`mt-3 block max-w-[34ch] text-[0.9375rem] leading-[1.6] transition-opacity duration-500 lg:min-w-[26ch] ${
                          on ? "text-white/70 opacity-100" : "text-(--ink-2) lg:opacity-0"
                        }`}
                      >
                        {a.body}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="flex flex-wrap items-center justify-between gap-2 px-3 pb-2 pt-4 text-[0.875rem] text-(--ink-2) sm:px-4">
            <span>
              Where they meet: <span className="font-semibold text-(--ink)">Data Ontology Intelligence</span>, one model of how your business works.
            </span>
            <span className="v12-label text-(--ink-3)">Hover or focus an axis</span>
          </p>
        </Tile>
      </div>
    </section>
  );
}
