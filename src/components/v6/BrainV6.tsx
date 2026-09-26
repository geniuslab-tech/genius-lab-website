"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { BrainSphere, HUBS } from "@/components/v2/BrainSphere";
import { Intro } from "./ui";

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

export function BrainV6() {
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

  useEffect(() => {
    if (!inView || reduce || touched) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % TOPICS.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [inView, reduce, touched, active]);

  const topic = TOPICS[active];

  return (
    <section ref={root} id="brain" className="relative isolate scroll-mt-[4.5rem] overflow-hidden bg-abyss py-24 text-white sm:py-32" aria-labelledby="v6-brain-title">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_60%_at_75%_50%,#0e2a55_0%,transparent_70%)]" aria-hidden="true" />
      <div className="mx-auto grid max-w-[1320px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Intro
            dark
            accent="ember"
            id="v6-brain-title"
            label="Second Brain"
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
                    onClick={() => {
                      setTouched(true);
                      setActive(i);
                    }}
                    aria-expanded={on}
                    className={`relative w-full overflow-hidden rounded-[10px] border px-5 py-4 text-left transition-colors duration-300 ${
                      on ? "border-ember/40 bg-white/[0.05]" : "border-white/10 hover:border-white/25"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-4">
                      <span className={`text-[1.0625rem] font-semibold ${on ? "text-white" : "text-white/60"}`}>{t.name}</span>
                      <span className="v6-label text-white/35">0{i + 1}</span>
                    </span>
                    <span className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)] ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <span className="overflow-hidden">
                        <span className="block pt-2 leading-[1.65] text-white/65">{t.body}</span>
                        <span className="mt-3 flex flex-wrap gap-2">
                          {t.hubs.map((h) => (
                            <span key={h} className="rounded-[4px] bg-ember/10 px-2 py-0.5 font-mono text-[0.6875rem] text-ember">
                              {HUBS[h]}
                            </span>
                          ))}
                        </span>
                      </span>
                    </span>
                    {on && !reduce && !touched && (
                      <span key={`timer-${active}`} className="absolute inset-x-0 bottom-0 block h-[2px] origin-left animate-[topic-timer_5200ms_linear_forwards] bg-ember" aria-hidden="true" />
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div data-reveal="up" className="lg:col-span-7">
          <div className="overflow-hidden rounded-[14px] border border-white/10 bg-[#0a1424]/80 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)]">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3">
              <span className="text-[0.8125rem] font-semibold">Knowledge graph</span>
              <span className="v6-label text-white/35">Drag to rotate</span>
            </div>
            <div className="mx-auto max-w-[600px] p-3">
              <BrainSphere tone="abyss" state={{ visited: topic.hubs, step: 1 }} />
              <p className="sr-only">
                The Second Brain drawn as a rotating sphere of connected knowledge. Highlighted now: {topic.name}, covering {topic.hubs.map((h) => HUBS[h]).join(", ")}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
