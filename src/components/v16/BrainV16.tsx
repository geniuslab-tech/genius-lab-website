"use client";

import { useEffect, useRef, useState } from "react";
import { NodeField } from "./NodeField";
import { useInView, useReduced } from "./hooks";
import { SectionHead } from "./ui";

const HUBS = [
  { label: "Transactions" },
  { label: "Metrics" },
  { label: "Tables" },
  { label: "Dashboards" },
  { label: "Process steps" },
  { label: "Customers" },
  { label: "Operations" },
  { label: "Finance" },
];

const TOPICS = [
  {
    name: "Semantic Context",
    body: "What every number means. Shared definitions for metrics, tables and dashboards, so revenue means the same thing in every report.",
    hubs: [1, 2, 3],
  },
  {
    name: "Business Context",
    body: "How the company actually works. Customers, operations and finance, and the relationships that connect them.",
    hubs: [5, 6, 7],
  },
  {
    name: "Event Context",
    body: "What is happening right now. Transactions, process steps and system events, captured as they occur.",
    hubs: [0, 4],
  },
];

const CYCLE_MS = 5200;

export function BrainV16() {
  const reduce = useReduced();
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!inView || reduce || touched) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % TOPICS.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [inView, reduce, touched, active]);

  const topic = TOPICS[active];

  return (
    <section ref={root} id="brain" className="relative isolate scroll-mt-16 overflow-hidden py-24 sm:py-32" aria-labelledby="v16-brain-title">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_55%_at_72%_50%,#10184f_0%,transparent_70%)]" aria-hidden="true" />
      <div className="v16-wrap grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHead
            n="02"
            id="v16-brain-title"
            kicker="Second Brain"
            title="A Second Brain for your business."
            lead="The intelligence layer holds the full context of the company: its systems, tables, metrics, dashboards, processes, customers, operations and finances. AI Agents work on top of it, end to end."
          />
          <ol className="mt-10 space-y-2" aria-label="Context in the Second Brain">
            {TOPICS.map((t, i) => {
              const on = i === active;
              return (
                <li key={t.name}>
                  <button
                    type="button"
                    aria-expanded={on}
                    onClick={() => {
                      setTouched(true);
                      setActive(i);
                    }}
                    className={`relative w-full overflow-hidden rounded-[10px] border px-5 py-4 text-left transition-colors duration-300 ${on ? "border-[rgb(143_220_255/0.45)] bg-[rgb(143_220_255/0.05)]" : "border-[color:var(--line)] hover:border-[color:var(--line-2)]"}`}
                  >
                    <span className="flex items-center justify-between gap-4">
                      <span className={`text-[1.0625rem] font-medium ${on ? "text-white" : "text-[color:var(--tx-2)]"}`}>{t.name}</span>
                      <span className="v16-label text-[color:var(--tx-3)]">0{i + 1}</span>
                    </span>
                    <span className={`grid transition-[grid-template-rows,opacity] duration-500 ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <span className="overflow-hidden">
                        <span className="block pt-2 leading-[1.65] text-[color:var(--tx-2)]">{t.body}</span>
                        <span className="mt-3 flex flex-wrap gap-2">
                          {t.hubs.map((h) => (
                            <span key={h} className="v16-mono rounded-[4px] bg-[rgb(143_220_255/0.1)] px-2 py-0.5 text-[0.6875rem] text-[color:var(--ice)]">
                              {HUBS[h].label}
                            </span>
                          ))}
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="lg:col-span-7">
          <div className="v16-panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-[color:var(--line)] px-5 py-3">
              <span className="text-[0.8125rem] font-medium">Knowledge graph</span>
              <span className="v16-label text-[color:var(--tx-3)]">Illustrative</span>
            </div>
            <div className="relative aspect-[5/4] sm:aspect-[4/3]">
              <NodeField variant="brain" hubs={HUBS} active={topic.hubs} />
            </div>
            <p className="sr-only">
              The Second Brain drawn as a rotating sphere of connected knowledge. Highlighted now: {topic.name}, covering{" "}
              {topic.hubs.map((h) => HUBS[h].label).join(", ")}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
