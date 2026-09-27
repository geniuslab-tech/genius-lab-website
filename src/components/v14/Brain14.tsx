"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import { Head, Section } from "./ui";
import { useInView14 } from "./useInView14";

const ENTITIES = ["Systems", "Data tables", "Metrics", "Dashboards", "Processes", "Customers", "Operations", "Finances"];

const TOPICS = [
  {
    name: "Semantic Context",
    body: "What every number means. Shared definitions for metrics, tables and dashboards, so revenue means the same thing in every report.",
    on: [1, 2, 3],
  },
  {
    name: "Business Context",
    body: "How the company actually works. Customers, operations and finance, and the relationships that connect them.",
    on: [5, 6, 7],
  },
  {
    name: "Event Context",
    body: "What is happening right now. Transactions, process steps and system events, captured as they occur.",
    on: [0, 4],
  },
];

const CYCLE = 4200;

export function Brain14() {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView14(box, 0.35);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const auto = inView && !reduce && !touched;

  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % TOPICS.length), CYCLE);
    return () => clearTimeout(t);
  }, [auto, active]);

  const topic = TOPICS[active];

  return (
    <Section id="brain" n="03" label="Second Brain" titleId="v14-brain-title">
      <Head
        id="v14-brain-title"
        title="A Second Brain for your business."
        lead="The intelligence layer holds the full context of the company: its systems, tables, metrics, dashboards, processes, customers, operations and finances. AI Agents work on top of it, end to end."
      />

      <div ref={box}>
        <div className="grid grid-cols-1 gap-[2px] bg-black sm:grid-cols-3" role="group" aria-label="Context in the Second Brain">
          {TOPICS.map((t, i) => {
            const on = i === active;
            return (
              <button
                key={t.name}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setTouched(true);
                  setActive(i);
                }}
                className={`relative flex items-baseline justify-between gap-4 px-4 py-4 text-left sm:px-6 ${on ? "bg-[#1f3bff] text-white" : "v14-inv bg-white text-black"}`}
              >
                <span className="v14-head text-[clamp(1.5rem,2.4vw,2.25rem)]">{t.name}</span>
                <span className="v14-mono">0{i + 1}</span>
                {on && auto ? (
                  <span key={`t-${active}`} className="v14-timer absolute inset-x-0 bottom-0 h-1 bg-white" style={{ "--dur": `${CYCLE}ms` } as CSSProperties} aria-hidden="true" />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="grid border-t-2 border-black lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <div className="flex flex-col justify-between gap-8 border-black px-4 py-8 sm:px-6 max-lg:border-b-2 lg:border-r-2">
            <div>
              <p className="v14-mono text-[#555]">Now reading · 0{active + 1}</p>
              <p key={active} className="text-pretty mt-4 max-w-[40ch] text-[1.25rem] font-semibold leading-[1.4] tracking-[-0.01em]">
                {topic.body}
              </p>
            </div>
            <p className="v14-mono">
              {topic.on.length} of {ENTITIES.length} entities in view
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-[2px] bg-black sm:grid-cols-4" aria-label="What the Second Brain holds">
            {ENTITIES.map((e, i) => {
              const on = topic.on.includes(i);
              return (
                <li key={e} className={`flex min-h-[7.5rem] flex-col justify-between p-3 sm:p-4 ${on ? "bg-black text-white" : "bg-white text-black"}`}>
                  <span className="flex items-center justify-between">
                    <span className="v14-mono">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`inline-block h-3 w-3 ${on ? "bg-[#1f3bff] outline outline-2 outline-white" : "border-2 border-black"}`} aria-hidden="true" />
                  </span>
                  <span className="v14-head text-[clamp(1.375rem,2.2vw,2rem)]">
                    {e}
                    {on ? <span className="sr-only"> (highlighted)</span> : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}
