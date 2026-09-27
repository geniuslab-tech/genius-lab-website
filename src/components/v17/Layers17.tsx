"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { blobPath } from "./geo";
import { DrawPath, HandArrow, Rise, SectionHead, SPRING, Sticker, useReduced, type Tint } from "./ui";

const LAYERS: {
  n: string;
  name: string;
  role: string;
  body: string;
  gives: string[];
  tint: Tint;
  stone: { cy: number; rx: number; ry: number; seed: number };
}[] = [
  {
    n: "01",
    name: "Data Engineering",
    role: "The foundation.",
    body: "We connect your systems and engineer their data into one governed, reliable foundation: integration, pipelines, modeling and quality.",
    gives: ["Connected systems", "A unified data platform", "Trusted, tested pipelines"],
    tint: "sage",
    stone: { cy: 474, rx: 184, ry: 58, seed: 1 },
  },
  {
    n: "02",
    name: "Analytics",
    role: "Organized data becomes understanding.",
    body: "Analysis and modeling explain what is happening, why it is happening and what is likely to happen next.",
    gives: ["Performance analysis", "Forecasts and drivers", "Customer and operational insight"],
    tint: "sky",
    stone: { cy: 362, rx: 156, ry: 52, seed: 4 },
  },
  {
    n: "03",
    name: "Business Intelligence",
    role: "Understanding becomes visible.",
    body: "One set of definitions behind every dashboard and report, so leadership sees the same numbers, at the same time.",
    gives: ["Executive dashboards", "Shared metrics and KPIs", "Self-service reporting"],
    tint: "ochre",
    stone: { cy: 260, rx: 130, ry: 46, seed: 7 },
  },
  {
    n: "04",
    name: "Artificial Intelligence",
    role: "Visibility gains context and reasoning.",
    body: "AI learns your business context and becomes its Second Brain. AI Agents reason across systems, tables, metrics and processes to answer and act.",
    gives: ["Second Brain", "AI Agents", "Orchestrated execution"],
    tint: "terra",
    stone: { cy: 170, rx: 104, ry: 40, seed: 11 },
  },
];

const CX = 210;

/** The four layers as river stones, each resting on the one beneath it, with a sprout on top. */
function Cairn({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  const reduce = useReduced();
  return (
    <svg
      viewBox="0 0 420 560"
      className="h-auto w-full max-w-[26rem]"
      role="img"
      aria-label="Four stones stacked from the bottom: Data Engineering, Analytics, Business Intelligence and Artificial Intelligence, with a sprout labelled better business decisions growing from the top."
    >
      <ellipse cx={CX} cy={532} rx={196} ry={16} fill="var(--ink)" opacity={0.07} />
      {LAYERS.map((l, i) => {
        const on = i === active;
        const s = l.stone;
        return (
          <motion.g
            key={l.n}
            initial={reduce ? false : { opacity: 0, y: -70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...SPRING, delay: 0.15 + i * 0.22 }}
            onPointerEnter={(e) => e.pointerType === "mouse" && onPick(i)}
            onClick={() => onPick(i)}
            className="cursor-pointer"
          >
            <motion.g animate={{ y: on ? -8 : 0 }} transition={SPRING}>
              <path d={blobPath(CX + 4, s.cy + 10, s.rx, s.ry * 0.9, s.seed + 3)} fill="var(--ink)" opacity={0.1} />
              <path
                d={blobPath(CX, s.cy, s.rx, s.ry, s.seed)}
                fill={`var(--${l.tint}-mid)`}
                stroke="var(--ink)"
                strokeWidth={on ? 2.2 : 1.2}
                style={{ transition: "stroke-width 300ms" }}
              />
              <path
                d={`M${CX - s.rx * 0.55} ${s.cy - s.ry * 0.5} Q ${CX - s.rx * 0.1} ${s.cy - s.ry * 0.78} ${CX + s.rx * 0.35} ${s.cy - s.ry * 0.6}`}
                fill="none"
                stroke="var(--paper)"
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.55}
              />
              <text x={CX} y={s.cy - 4} textAnchor="middle" fill="var(--ink)" fontSize="13" fontWeight="600" letterSpacing="0.08em">
                {l.n}
              </text>
              <text x={CX} y={s.cy + 17} textAnchor="middle" fill="var(--ink)" fontSize={i === 3 ? 15 : 17} fontWeight="600">
                {l.name === "Artificial Intelligence" ? "AI" : l.name}
              </text>
            </motion.g>
          </motion.g>
        );
      })}
      {/* The sprout: the decision that grows out of the stack. */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <DrawPath d="M210 132 C 208 108, 214 88, 210 58" stroke="var(--sage-ink)" width={3} delay={1.3} duration={0.8} />
        <DrawPath d="M210 92 C 190 90, 172 76, 168 58 C 188 58, 204 70, 210 90" stroke="var(--sage-ink)" width={2.2} delay={1.9} duration={0.7} />
        <DrawPath d="M211 74 C 226 66, 244 52, 250 34 C 230 34, 214 48, 211 72" stroke="var(--sage-ink)" width={2.2} delay={2.2} duration={0.7} />
      </g>
    </svg>
  );
}

export function Layers17() {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = items.current.indexOf(e.target as HTMLLIElement);
          if (i >= 0) setActive(i);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="layers" className="scroll-mt-20 py-24 sm:py-32" aria-labelledby="v17-layers-title">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
        <SectionHead
          id="v17-layers-title"
          label="Platform"
          tint="sage"
          title={
            <>
              One intelligence and execution layer across your <em>business</em>.
            </>
          }
          lead="Not four products. Every layer is built on the one beneath it, and the top of the stack is a better decision."
          className="max-w-[48rem]"
        />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-[26rem] lg:sticky lg:top-28">
              <Cairn active={active} onPick={setActive} />
              <div className="absolute left-[58%] top-0 sm:left-[62%]">
                <Sticker tint="paper" rotate={4} className="text-[0.8125rem]">
                  Better business decisions
                </Sticker>
              </div>
              <div className="pointer-events-none absolute -left-2 bottom-[8%] hidden w-[7.5rem] sm:block lg:-left-10">
                <p className="v17-hand -rotate-6 text-[1rem] leading-tight text-[var(--ink-2)]">everything rests on this one</p>
                <HandArrow className="ml-6 mt-1 h-10 w-16 rotate-[20deg]" />
              </div>
            </div>
          </div>

          <ol className="space-y-4 lg:col-span-7 lg:pt-4" aria-label="Layers, foundation first">
            {LAYERS.map((l, i) => {
              const on = i === active;
              return (
                <li
                  key={l.n}
                  ref={(el) => {
                    items.current[i] = el;
                  }}
                >
                  <Rise>
                    <motion.article
                      onMouseEnter={() => setActive(i)}
                      animate={{ rotate: on ? (i % 2 ? 0.6 : -0.6) : 0, y: on ? -3 : 0 }}
                      transition={SPRING}
                      className={`v17-panel p-6 outline-none transition-[background-color,box-shadow] duration-300 sm:p-8 ${
                        on ? `v17-tint-${l.tint} shadow-[0_24px_40px_-30px_rgb(16_20_64/0.5)]` : "bg-[var(--paper)]"
                      }`}
                    >
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <span className="text-[0.8125rem] font-semibold tracking-[0.08em] text-[var(--ink-3)]">LAYER {l.n}</span>
                        <p className="v17-hand text-[1.0625rem] text-[var(--ink-2)]">{l.role}</p>
                      </div>
                      <h3 className="v17-display mt-3 text-[clamp(1.75rem,3vw,2.375rem)]">{l.name}</h3>
                      <p className="mt-3 max-w-[56ch] text-pretty leading-[1.7] text-[var(--ink-2)]">{l.body}</p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {l.gives.map((g) => (
                          <li
                            key={g}
                            className="rounded-full border border-[var(--ink)]/15 bg-[var(--paper)] px-3.5 py-1.5 text-[0.875rem] font-medium text-[var(--ink)]"
                          >
                            {g}
                          </li>
                        ))}
                      </ul>
                    </motion.article>
                  </Rise>
                </li>
              );
            })}
            <li>
              <Rise>
                <article className="v17-panel bg-[var(--ink)] p-6 text-[var(--cream)] sm:p-8">
                  <p className="text-[0.8125rem] font-semibold tracking-[0.08em] text-[var(--sage-tint)]">THE OUTCOME</p>
                  <h3 className="v17-display mt-3 text-[clamp(1.875rem,3.4vw,2.75rem)]">
                    Better business <em>decisions</em>
                  </h3>
                  <p className="mt-3 max-w-[56ch] text-pretty leading-[1.7] text-[var(--cream)]/80">
                    Each layer builds on the one beneath it. Together they give executives clear insight, full visibility and the
                    confidence to act.
                  </p>
                </article>
              </Rise>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
