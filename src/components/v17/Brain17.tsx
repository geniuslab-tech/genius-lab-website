"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { handCurve, r1, type Pt } from "./geo";
import { DrawPath, EASE_OUT, HandArrow, SectionHead, SPRING, useReduced, type Tint } from "./ui";

const TOPICS: { name: string; tint: Tint; body: string }[] = [
  {
    name: "Semantic Context",
    tint: "sky",
    body: "What every number means. Shared definitions for metrics, tables and dashboards, so revenue means the same thing in every report.",
  },
  {
    name: "Business Context",
    tint: "sage",
    body: "How the company actually works. Customers, operations and finance, and the relationships that connect them.",
  },
  {
    name: "Event Context",
    tint: "ochre",
    body: "What is happening right now. Transactions, process steps and system events, captured as they occur.",
  },
];

/** Thoughts around the Second Brain, clockwise from the top. `g` is the context each belongs to. */
const THOUGHTS: { name: string; g: number }[] = [
  { name: "Metrics", g: 0 },
  { name: "Tables", g: 0 },
  { name: "Dashboards", g: 0 },
  { name: "Customers", g: 1 },
  { name: "Operations", g: 1 },
  { name: "Finance", g: 1 },
  { name: "Processes", g: 1 },
  { name: "Transactions", g: 2 },
  { name: "Process steps", g: 2 },
  { name: "System events", g: 2 },
  { name: "Definitions", g: 0 },
];

const CENTER: Pt = [50, 50];
const NODES = THOUGHTS.map((t, i) => {
  const a = -Math.PI / 2 + (i / THOUGHTS.length) * Math.PI * 2;
  // A slightly uneven ring, the way a hand would place them.
  const wob = 1 + 0.06 * Math.sin(i * 2.1);
  return { ...t, at: [r1(50 + Math.cos(a) * 34 * wob), r1(50 + Math.sin(a) * 40 * wob)] as Pt };
});

/** Neighbouring thoughts within the same context are linked, like a mind map. */
const LINKS = NODES.flatMap((n, i) => {
  const next = NODES[(i + 1) % NODES.length];
  return n.g === next.g ? [{ a: n.at, b: next.at, g: n.g, key: `${n.name}-${next.name}` }] : [];
});

const CYCLE_MS = 5600;

export function Brain17() {
  const reduce = useReduced();
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
  const color = (g: number) => (g === active ? `var(--${TOPICS[g].tint}-ink)` : "var(--ink)");

  return (
    <section ref={root} id="brain" className="scroll-mt-20 py-24 sm:py-32" aria-labelledby="v17-brain-title">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
        <div className="v17-panel bg-[var(--paper)] px-5 py-12 shadow-[0_0_0_1px_var(--rule)] sm:px-10 sm:py-16 lg:px-14">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <SectionHead
                id="v17-brain-title"
                label="Second Brain"
                tint="sky"
                title={
                  <>
                    A Second Brain for your <em>business</em>.
                  </>
                }
                lead="The intelligence layer holds the full context of the company: its systems, tables, metrics, dashboards, processes, customers, operations and finances. AI Agents work on top of it, end to end."
              />
              <div className="mt-10" role="group" aria-label="Context in the Second Brain">
                <div className="flex flex-wrap gap-2">
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
                        className={`relative overflow-hidden rounded-full px-4 py-2.5 text-[0.9375rem] font-semibold transition-colors duration-300 ${
                          on ? `v17-tint-${t.tint} text-[var(--ink)] shadow-[inset_0_0_0_1.5px_var(--ink)]` : "text-[var(--ink-2)] shadow-[inset_0_0_0_1px_var(--rule)] hover:bg-[var(--cream)]"
                        }`}
                      >
                        {t.name}
                        {on && !reduce && !touched && inView && (
                          <motion.span
                            key={`timer-${active}`}
                            className="absolute bottom-0 left-0 h-[2px] bg-[var(--ink)]"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 min-h-[7rem]" aria-live="polite">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={topic.name}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: EASE_OUT }}
                      className="max-w-[46ch] text-pretty text-[1.0625rem] leading-[1.7] text-[var(--ink-2)]"
                    >
                      {topic.body}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* The connected-thoughts diagram. */}
            <div className="relative lg:col-span-7">
              <div
                className="relative mx-auto aspect-[4/5] w-full max-w-[40rem] sm:aspect-[6/5]"
                role="img"
                aria-label={`A hand-drawn map of connected thoughts around the Second Brain. Highlighted: ${topic.name}, covering ${NODES.filter((n) => n.g === active)
                  .map((n) => n.name)
                  .join(", ")}.`}
              >
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true" fill="none">
                  {NODES.map((n, i) => (
                    <g key={n.name} style={{ transition: "opacity 400ms" }} opacity={n.g === active ? 1 : 0.35}>
                      <DrawPath
                        d={handCurve(CENTER, n.at, i % 2 ? 4 : -4)}
                        stroke={color(n.g)}
                        width={n.g === active ? 2 : 1.3}
                        nonScaling
                        delay={0.2 + i * 0.08}
                        duration={1}
                      />
                    </g>
                  ))}
                  {LINKS.map((l) => (
                    <g key={l.key} style={{ transition: "opacity 400ms" }} opacity={l.g === active ? 0.9 : 0.25}>
                      <DrawPath d={handCurve(l.a, l.b, 5)} stroke={color(l.g)} width={1.3} nonScaling delay={1.1} duration={0.8} />
                    </g>
                  ))}
                </svg>

                {NODES.map((n, i) => {
                  const on = n.g === active;
                  return (
                    <div
                      key={n.name}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${n.at[0]}%`, top: `${n.at[1]}%` }}
                    >
                      <motion.span
                        animate={{ scale: on ? 1.06 : 1, rotate: on ? (i % 2 ? 2.5 : -2.5) : 0 }}
                        transition={SPRING}
                        className={`block whitespace-nowrap rounded-full px-3 py-1.5 text-[0.75rem] font-semibold transition-[background-color,color,box-shadow] duration-300 sm:px-3.5 sm:text-[0.875rem] ${
                          on
                            ? `v17-tint-${TOPICS[n.g].tint} text-[var(--ink)] shadow-[0_0_0_1.5px_var(--ink),0_0_0_4px_var(--paper)]`
                            : "bg-[var(--paper)] text-[var(--ink-3)] shadow-[0_0_0_1px_var(--rule)]"
                        }`}
                      >
                        {n.name}
                      </motion.span>
                    </div>
                  );
                })}

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="v17-float" style={{ ["--v17-lift" as string]: "-4px", ["--v17-dur" as string]: "7s" }}>
                    <div className="flex size-[6.5rem] flex-col items-center justify-center rounded-full bg-[var(--ink)] text-center text-[var(--cream)] shadow-[0_0_0_6px_var(--paper),0_0_0_7.5px_var(--ink)] sm:size-[8.5rem]">
                      <span className="v17-display text-[1.1rem] leading-[1.05] sm:text-[1.45rem]">
                        Second
                        <br />
                        <em>Brain</em>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none mt-4 flex items-start gap-2 sm:absolute sm:-bottom-6 sm:right-0 sm:mt-0 sm:w-[15rem] sm:flex-col sm:items-end">
                <HandArrow className="hidden h-12 w-20 -scale-y-100 rotate-[160deg] sm:block" />
                <p className="v17-hand rotate-[-2deg] text-[1.0625rem] leading-snug text-[var(--ink-2)] sm:text-right">
                  when it says margin, it means <span className="underline decoration-[var(--terra)] decoration-2 underline-offset-4">your</span>{" "}
                  margin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
