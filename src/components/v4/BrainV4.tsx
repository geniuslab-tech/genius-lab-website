"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { BrainSphere, HUBS } from "@/components/v2/BrainSphere";
import { Frame, SectionTag, h2v4 } from "./ui";

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

export function BrainV4() {
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
    <section ref={root} id="brain" className="relative scroll-mt-16 py-24 sm:py-32" aria-labelledby="v4-brain-title">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionTag n="03">Second Brain</SectionTag>
            <h2 id="v4-brain-title" data-reveal="up" className={`${h2v4} mt-8 max-w-[13ch]`}>
              A Second Brain for your business.
            </h2>
            <p data-reveal="up" data-delay="100" className="mt-8 max-w-[50ch] text-lg leading-relaxed text-white/60">
              The intelligence layer holds the full context of the company: its systems, tables, metrics, dashboards,
              processes, customers, operations and finances. AI Agents work on top of it, end to end.
            </p>

            {/* Hub index: which regions of the graph the current context lights. */}
            <ul className="mt-10 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4" aria-label="Knowledge hubs">
              {HUBS.map((h, k) => {
                const on = topic.hubs.includes(k);
                return (
                  <li key={h} className={`type-mono flex h-10 items-center gap-2 px-3 text-[0.75rem] transition-colors duration-500 ${on ? "bg-cyan/10 text-cyan" : "bg-void text-white/40"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${on ? "bg-cyan" : "bg-white/20"}`} aria-hidden="true" />
                    {h}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <Frame className="bg-void-2/60">
              <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                <span className="v4-label text-[0.6875rem] text-white/50">second_brain.graph</span>
                <span className="v4-label text-[0.6875rem] text-white/30">520 nodes / drag to rotate</span>
              </div>
              <div className="relative mx-auto w-full max-w-[640px] p-2">
                <BrainSphere tone="dark" state={{ visited: topic.hubs, step: 1 }} />
                <p className="sr-only">
                  The Second Brain drawn as a rotating sphere of connected knowledge. Highlighted now: {topic.name}, covering{" "}
                  {topic.hubs.map((h) => HUBS[h]).join(", ")}.
                </p>
              </div>
              <div className="v4-label flex items-center justify-between border-t border-line px-4 py-2.5 text-[0.6875rem] text-white/40">
                <span>
                  Active: <span className="text-cyan">{topic.name}</span>
                </span>
                <span>0{active + 1} / 03</span>
              </div>
            </Frame>
          </div>
        </div>

        <ol className="mt-12 grid gap-3 md:grid-cols-3" aria-label="Context in the Second Brain">
          {TOPICS.map((t, i) => {
            const on = i === active;
            return (
              <li key={t.name} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setTouched(true);
                    setActive(i);
                  }}
                  aria-pressed={on}
                  className={`press relative flex h-full w-full flex-col items-start justify-start overflow-hidden border p-6 text-left transition-colors duration-300 ${
                    on ? "border-cyan/50 bg-cyan/[0.06]" : "border-line hover:border-white/25"
                  }`}
                >
                  <span className={`v4-label ${on ? "text-cyan" : "text-white/35"}`}>Context 0{i + 1}</span>
                  <span className={`type-wide mt-4 block text-xl font-medium ${on ? "text-white" : "text-white/70"}`}>{t.name}</span>
                  <span className={`mt-3 block leading-relaxed ${on ? "text-white/70" : "text-white/45"}`}>{t.body}</span>
                  {on && !reduce && !touched && (
                    <span
                      key={`timer-${active}`}
                      className="absolute inset-x-0 bottom-0 block h-[2px] origin-left animate-[topic-timer_5200ms_linear_forwards] bg-cyan"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
