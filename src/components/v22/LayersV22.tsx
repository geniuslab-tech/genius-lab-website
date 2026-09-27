"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Check } from "@phosphor-icons/react";
import { SectionHead } from "./ui";

const LAYERS = [
  {
    n: "01",
    name: "Data Engineering",
    role: "The foundation.",
    body: "We connect your systems and engineer their data into one governed, reliable foundation: integration, pipelines, modeling and quality.",
    gives: ["Connected systems", "A unified data platform", "Trusted, tested pipelines"],
  },
  {
    n: "02",
    name: "Analytics",
    role: "Organized data becomes understanding.",
    body: "Analysis and modeling explain what is happening, why it is happening and what is likely to happen next.",
    gives: ["Performance analysis", "Forecasts and drivers", "Customer and operational insight"],
  },
  {
    n: "03",
    name: "Business Intelligence",
    role: "Understanding becomes visible.",
    body: "One set of definitions behind every dashboard and report, so leadership sees the same numbers, at the same time.",
    gives: ["Executive dashboards", "Shared metrics and KPIs", "Self-service reporting"],
  },
  {
    n: "04",
    name: "Artificial Intelligence",
    role: "Visibility gains context and reasoning.",
    body: "AI learns your business context and becomes its Second Brain. AI Agents reason across systems, tables, metrics and processes to answer and act.",
    gives: ["Second Brain", "AI Agents", "Orchestrated execution"],
  },
];

/** Four chamfered slabs, foundation at the bottom, each a tab onto its detail. */
export function LayersV22() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const L = LAYERS[active];

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const dir = e.key === "ArrowUp" || e.key === "ArrowRight" ? 1 : e.key === "ArrowDown" || e.key === "ArrowLeft" ? -1 : 0;
    if (!dir && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const next = e.key === "Home" ? 0 : e.key === "End" ? LAYERS.length - 1 : (active + dir + LAYERS.length) % LAYERS.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="layers" className="scroll-mt-[var(--nav)] bg-[var(--paper)] py-24 sm:py-32" aria-labelledby="v22-layers-title">
      <div className="v22-shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead
            n="02"
            label="Platform"
            id="v22-layers-title"
            title={<>One intelligence and execution layer across your&nbsp;business</>}
            className="lg:col-span-7"
            titleClass="max-w-[18ch]"
          />
          <p data-v22r="up" className="text-pretty max-w-[46ch] text-[1.0625rem] leading-[1.7] text-[var(--ink-2)] lg:col-span-5">
            Not four products. Every layer is built on the one beneath it, and the top of the stack is a better decision.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          {/* The stack. DOM order is foundation first; it renders bottom-up. */}
          <div className="lg:col-span-6">
            <div data-v22r="wipe" className="ch mb-2 bg-[var(--navy)] px-6 py-5 text-white [--c:18px] sm:mx-[20%]" style={{ "--rd": "500ms" } as CSSProperties}>
              <p className="v22-label text-[var(--signal-lt)]">The outcome</p>
              <p className="v22-wide mt-1.5 text-[1.125rem]">Better business decisions</p>
            </div>
            <div role="tablist" aria-label="Layers, foundation at the bottom" aria-orientation="vertical" onKeyDown={onKey} className="flex flex-col-reverse gap-2">
              {LAYERS.map((l, i) => {
                const on = i === active;
                return (
                  <div key={l.n} data-v22r="wipe" className="ch [--c:18px] sm:mx-[var(--m)]" style={{ "--rd": `${i * 110}ms`, "--m": `${i * 5}%` } as CSSProperties}>
                    <button
                      ref={(el) => {
                        tabs.current[i] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`v22-layer-tab-${i}`}
                      aria-selected={on}
                      aria-controls="v22-layer-panel"
                      tabIndex={on ? 0 : -1}
                      onClick={() => setActive(i)}
                      className={`chb group block w-full text-left [--c:18px] ${on ? "[--bd:var(--navy)]" : "[--bd:var(--rule-2)] hover:[--bd:var(--signal)]"}`}
                    >
                      <span className={`chi flex items-center gap-5 px-5 py-5 transition-colors duration-300 sm:px-7 ${on ? "bg-[var(--navy)] text-white" : "bg-white text-[var(--ink)]"}`}>
                        <span className={`v22-num text-[1.5rem] ${on ? "text-[var(--signal-lt)]" : "text-[var(--signal-ink)]"}`}>{l.n}</span>
                        <span className="min-w-0 flex-1">
                          <span className="v22-wide block text-[1.0625rem] sm:text-[1.1875rem]">{l.name}</span>
                          <span className={`mt-0.5 block truncate text-[0.875rem] ${on ? "text-white/65" : "text-[var(--ink-3)]"}`}>{l.role}</span>
                        </span>
                        <span className={`hidden h-[3px] w-8 transition-[background-color,width] duration-300 sm:block ${on ? "w-12 bg-[var(--trace)]" : "bg-[var(--rule-2)] group-hover:bg-[var(--signal)]"}`} aria-hidden="true" />
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
            <p className="v22-label mt-4 text-center text-[var(--ink-3)]">Foundation first · each layer builds on the last</p>
          </div>

          <div className="lg:col-span-6">
            <div data-v22r="wipe" className="chb h-full [--bd:var(--rule-2)] [--c:32px]">
              <div id="v22-layer-panel" role="tabpanel" aria-labelledby={`v22-layer-tab-${active}`} className="chi relative flex flex-col bg-white p-7 sm:p-10">
                <div key={active} className="v22-swap flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-6">
                    <p className="v22-label text-[var(--ink-3)]">Layer {L.n} of 04</p>
                    <span className="v22-num text-[clamp(3.5rem,7vw,6rem)] leading-[0.8] text-[var(--signal-soft)] [-webkit-text-stroke:1px_#5577ff]" aria-hidden="true">
                      {L.n}
                    </span>
                  </div>
                  <h3 className="v22-display -mt-4 text-[clamp(1.9rem,3.2vw,2.75rem)]">{L.name}</h3>
                  <p className="mt-3 text-[1.0625rem] font-semibold text-[var(--signal-ink)]">{L.role}</p>
                  <p className="text-pretty mt-4 max-w-[52ch] text-[1.0625rem] leading-[1.7] text-[var(--ink-2)]">{L.body}</p>

                  <div className="mt-8 grid gap-6 border-t border-[var(--rule)] pt-6 sm:grid-cols-2">
                    <div>
                      <p className="v22-label text-[var(--ink-3)]">What you get</p>
                      <ul className="mt-4 space-y-2.5">
                        {L.gives.map((g) => (
                          <li key={g} className="flex items-center gap-3 text-[0.9375rem] font-medium">
                            <span className="ch inline-flex h-5 w-5 shrink-0 items-center justify-center bg-[var(--navy)] text-white [--c:5px]" aria-hidden="true">
                              <Check size={11} weight="bold" />
                            </span>
                            {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="v22-label text-[var(--ink-3)]">Builds on</p>
                      <ol className="mt-4 flex flex-wrap gap-1.5" aria-label="Layers beneath">
                        {LAYERS.slice(0, active + 1).map((b) => (
                          <li key={b.n} className={`ch v22-mono px-2.5 py-1 text-[0.75rem] [--c:6px] ${b.n === L.n ? "bg-[var(--signal-ink)] text-white" : "bg-[var(--paper-2)] text-[var(--ink-2)]"}`}>
                            {b.n} {b.name.split(" ")[0]}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
