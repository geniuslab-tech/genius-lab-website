"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BrainSphere, HUBS } from "@/components/v2/BrainSphere";
import { Heading } from "./ui";

const TOPICS = [
  {
    name: "Semantic Context",
    short: "Semantic",
    body: "What every number means. Shared definitions for metrics, tables and dashboards, so revenue means the same thing in every report.",
    hubs: [1, 2, 3],
  },
  {
    name: "Business Context",
    short: "Business",
    body: "How the company actually works. Customers, operations and finance, and the relationships that connect them.",
    hubs: [5, 6, 7],
  },
  {
    name: "Event Context",
    short: "Event",
    body: "What is happening right now. Transactions, process steps and system events, captured as they occur.",
    hubs: [0, 4],
  },
];

const CYCLE_MS = 5200;
const SPRING = { type: "spring", bounce: 0, duration: 0.4 } as const;

export function BrainV5() {
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
    <section ref={root} id="brain" className="scroll-mt-12 bg-black py-28 text-white sm:py-40" aria-labelledby="v5-brain-title">
      <div className="mx-auto max-w-[1080px] px-5">
        <Heading
          dark
          id="v5-brain-title"
          eyebrow="Second Brain"
          title="A Second Brain for your business."
          lead="The intelligence layer holds the full context of the company: its systems, tables, metrics, dashboards, processes, customers, operations and finances. AI Agents work on top of it, end to end."
        />

        <div data-reveal="up" className="relative mx-auto mt-12 w-full max-w-[620px]">
          <BrainSphere tone="night" state={{ visited: topic.hubs, step: 1 }} />
          <p className="sr-only">
            The Second Brain drawn as a rotating sphere of connected knowledge. Highlighted now: {topic.name}, covering {topic.hubs.map((h) => HUBS[h]).join(", ")}.
          </p>
        </div>

        {/* Segmented control. */}
        <div className="mt-6 flex justify-center">
          <div role="tablist" aria-label="Context in the Second Brain" className="inline-flex rounded-full bg-white/[0.1] p-1">
            {TOPICS.map((t, i) => {
              const on = i === active;
              return (
                <button
                  key={t.name}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => {
                    setTouched(true);
                    setActive(i);
                  }}
                  className={`relative h-9 rounded-full px-4 text-[0.875rem] tracking-[-0.01em] transition-colors duration-200 sm:px-6 ${on ? "text-black" : "text-white/70 hover:text-white"}`}
                >
                  {on && <motion.span layoutId="v5-brain-thumb" transition={reduce ? { duration: 0 } : SPRING} className="absolute inset-0 rounded-full bg-white" />}
                  <span className="relative">
                    <span className="sm:hidden">{t.short}</span>
                    <span className="hidden sm:inline">{t.name}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-8 min-h-[9rem] max-w-[36rem] text-center" role="tabpanel" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <p className="v5-body text-[1.1875rem] text-[#a1a1a6]">
                <span className="font-semibold text-white">{topic.name}.</span> {topic.body}
              </p>
              <ul className="mt-5 flex flex-wrap justify-center gap-2">
                {topic.hubs.map((h) => (
                  <li key={h} className="rounded-full border border-white/15 px-3 py-1 text-[0.8125rem] text-white/80">
                    {HUBS[h]}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
