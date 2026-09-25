"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { BrainSphere, HUBS } from "./BrainSphere";

/** The three kinds of context the Second Brain holds, and the hubs each one lights. */
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

export function BrainV2() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [touched, setTouched] = useState(false);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The topics take turns until the reader picks one.
  useEffect(() => {
    if (!inView || reduce || touched) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % TOPICS.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [inView, reduce, touched, active]);

  const topic = TOPICS[active];

  return (
    <section ref={root} id="brain" className="relative scroll-mt-16 py-24 text-navy sm:py-32 lg:py-40" aria-labelledby="v2-brain-title">
      <div className="shell grid items-center gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2
            id="v2-brain-title"
            data-reveal="up"
            className="type-display max-w-[14ch] text-[clamp(2.25rem,4.4vw,4.25rem)] leading-[1.02] [font-variation-settings:'wdth'_112]"
          >
            A Second Brain for your business.
          </h2>
          <p data-reveal="up" data-delay="100" className="mt-8 max-w-[52ch] text-lg leading-relaxed text-navy/70">
            The intelligence layer holds the full context of the company: its systems, tables, metrics, dashboards,
            processes, customers, operations and finances. AI Agents work on top of it, end to end.
          </p>

          <ol className="mt-10 border-t border-navy/12" aria-label="Context in the Second Brain">
            {TOPICS.map((t, i) => {
              const on = i === active;
              return (
                <li key={t.name} className="relative border-b border-navy/12">
                  <button
                    type="button"
                    onClick={() => {
                      setTouched(true);
                      setActive(i);
                    }}
                    aria-expanded={on}
                    className="group grid w-full grid-cols-[2.25rem_1fr] items-baseline gap-x-3 py-5 text-left"
                  >
                    <span className={`type-mono text-[0.8125rem] transition-colors ${on ? "text-signal-ink" : "text-navy/40"}`}>0{i + 1}</span>
                    <span>
                      <span className={`type-wide block text-xl font-medium transition-colors ${on ? "text-navy" : "text-navy/55 group-hover:text-navy"}`}>
                        {t.name}
                      </span>
                      <span
                        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)] ${
                          on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <span className="overflow-hidden">
                          <span className="block pt-2 leading-relaxed text-navy/70">{t.body}</span>
                          <span className="mt-3 flex flex-wrap gap-2" aria-hidden="true">
                            {t.hubs.map((h) => (
                              <span key={h} className="type-mono inline-flex h-7 items-center gap-2 bg-signal-ink/8 px-2.5 text-[0.75rem] text-signal-ink">
                                <span className="h-1.5 w-1.5 rounded-full bg-signal-ink" />
                                {HUBS[h]}
                              </span>
                            ))}
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  {on && !reduce && !touched && (
                    <span
                      key={`timer-${active}`}
                      className="absolute inset-x-0 -bottom-px block h-px origin-left animate-[topic-timer_5200ms_linear_forwards] bg-signal-ink"
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="lg:col-span-7">
          <div className="relative mx-auto w-full max-w-[720px]">
            <BrainSphere state={{ visited: topic.hubs, step: 1 }} />
            <p className="sr-only">
              The Second Brain drawn as a rotating sphere of connected knowledge. Highlighted now: {topic.name}, covering{" "}
              {topic.hubs.map((h) => HUBS[h]).join(", ")}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
