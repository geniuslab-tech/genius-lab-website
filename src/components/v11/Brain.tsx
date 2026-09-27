"use client";

import { useEffect, useRef, useState } from "react";
import { CONTEXTS } from "./data";
import { useInView, useReduced } from "./hooks";
import { Pane, SECTION, SectionHead, WRAP } from "./ui";

const HUBS = ["systems", "tables", "metrics", "dashboards", "processes", "customers", "operations", "finance"];
const CYCLE = 5200;

export function Brain() {
  const reduce = useReduced();
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { once: false, threshold: 0.3 });
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!inView || reduce || touched) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % CONTEXTS.length), CYCLE);
    return () => clearTimeout(id);
  }, [inView, reduce, touched, active]);

  const c = CONTEXTS[active];
  const holds: readonly string[] = c.holds;

  return (
    <section ref={root} id="brain" tabIndex={-1} className={SECTION} aria-labelledby="v11-brain-title">
      <div className={`${WRAP} grid gap-12 lg:grid-cols-12 lg:gap-10`}>
        <div className="lg:col-span-5">
          <SectionHead
            index="03"
            cmd="genius brain --contexts"
            id="v11-brain-title"
            title="A Second Brain for your business."
            lead="The intelligence layer holds the full context of the company: its systems, tables, metrics, dashboards, processes, customers, operations and finances. AI Agents work on top of it, end to end."
          />
          <ul className="v11-term mt-10 space-y-1.5" aria-label="Context held in the Second Brain">
            {CONTEXTS.map((x, i) => {
              const on = i === active;
              return (
                <li key={x.file}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setTouched(true);
                      setActive(i);
                    }}
                    className={`relative flex w-full items-center justify-between gap-4 overflow-hidden border px-4 py-3 text-left text-[13.5px] transition-colors ${
                      on ? "border-(--amber-2) bg-(--amber-soft) text-(--fg)" : "border-(--rule) text-(--fg-2) hover:border-(--rule-2) hover:text-(--fg)"
                    }`}
                  >
                    <span>
                      <span className={on ? "text-(--amber)" : "text-(--fg-3)"} aria-hidden="true">
                        {on ? "> " : "  "}
                      </span>
                      {x.name}
                    </span>
                    <span className="text-[12px] text-(--fg-3)">{x.file}</span>
                    {on && !reduce && !touched && inView && (
                      <span
                        key={`t-${active}`}
                        className="absolute inset-x-0 bottom-0 h-px origin-left bg-(--amber) animate-[v11-timer_5200ms_linear_forwards]"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="min-w-0 lg:col-span-7 lg:pt-10">
          <Pane title={`second-brain/${c.file}`} meta="read-only" bodyClass="v11-term text-[13px]">
            <ol key={active} className="v11-code py-4 pr-4 leading-[1.7]" aria-live="polite">
              <li className="text-(--fg-3)"># {c.name}</li>
              <li className="text-(--fg-3)"># {c.tagline}</li>
              <li> </li>
              <li>
                <span>
                  <span className="text-(--ice)">context</span>
                  <span className="text-(--fg-3)">: </span>
                  <span className="text-(--amber)">{c.file.replace(".ctx", "")}</span>
                </span>
              </li>
              <li>
                <span>
                  <span className="text-(--ice)">holds</span>
                  <span className="text-(--fg-3)">: [</span>
                  <span className="text-(--fg)">{c.holds.join(", ")}</span>
                  <span className="text-(--fg-3)">]</span>
                </span>
              </li>
              <li>
                <span>
                  <span className="text-(--ice)">means</span>
                  <span className="text-(--fg-3)">: </span>
                  <span className="text-(--fg)">&ldquo;{c.body}&rdquo;</span>
                </span>
              </li>
              <li>
                <span>
                  <span className="text-(--ice)">read_by</span>
                  <span className="text-(--fg-3)">: </span>
                  <span className="text-(--fg-2)">genius-agents/*</span>
                </span>
              </li>
            </ol>
            <div className="border-t border-(--rule) px-4 py-4 sm:px-5">
              <p className="text-[12px] text-(--fg-3)"># memory map, lit where {c.name.toLowerCase()} lives</p>
              <ul className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4" aria-label={`Knowledge areas. Highlighted: ${c.holds.join(", ")}`}>
                {HUBS.map((h) => {
                  const lit = holds.includes(h);
                  return (
                    <li
                      key={h}
                      className={`border px-2.5 py-1.5 text-[12.5px] transition-colors duration-500 ${
                        lit ? "border-(--amber-2) bg-(--amber-soft) text-(--amber)" : "border-(--rule) text-(--fg-3)"
                      }`}
                    >
                      <span aria-hidden="true">{lit ? "█ " : "░ "}</span>
                      {h}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Pane>
        </div>
      </div>
    </section>
  );
}
