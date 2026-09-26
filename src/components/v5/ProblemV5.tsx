"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { h2v5 } from "./ui";

const BODY =
  "Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding everything together. Leadership loses visibility, execution slows down, and the business pays the price.";

const STAGES = ["Founding", "Product fit", "Scale-up", "Multi-unit", "Enterprise"];

/** Illustrative growth of what a company has to hold together, founding to enterprise. */
const COUNTS = [
  { label: "Systems", from: 3, to: 46 },
  { label: "Reports", from: 8, to: 940 },
  { label: "Manual handoffs", from: 2, to: 210 },
  { label: "People in a decision", from: 2, to: 19 },
];

const revenue = (x: number) => 0.08 + 0.45 * x + 0.05 * x * x;
const complexity = (x: number) => 0.04 + (0.9 * (Math.exp(2.6 * x) - 1)) / (Math.exp(2.6) - 1);
const CROSS = (() => {
  for (let x = 0; x <= 1; x += 0.002) if (complexity(x) > revenue(x)) return x;
  return 1;
})();

const W = 1000;
const H = 420;
const L = 20;
const R = W - 20;
const T = 30;
const B = H - 56;
const X = (x: number) => L + (R - L) * x;
const Y = (v: number) => B - (B - T) * v;
const curve = (f: (x: number) => number, from = 0, to = 1) => {
  let d = "";
  for (let i = 0; i <= 80; i++) {
    const x = from + ((to - from) * i) / 80;
    d += `${i ? "L" : "M"}${X(x).toFixed(1)},${Y(f(x)).toFixed(1)}`;
  }
  return d;
};
const GAP = (() => {
  const top: string[] = [];
  const bot: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const x = CROSS + ((1 - CROSS) * i) / 40;
    top.push(`${X(x).toFixed(1)},${Y(complexity(x)).toFixed(1)}`);
    bot.unshift(`${X(x).toFixed(1)},${Y(revenue(x)).toFixed(1)}`);
  }
  return `M${top.join("L")}L${bot.join("L")}Z`;
})();

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{" "}
    </motion.span>
  );
}

export function ProblemV5() {
  const para = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: para, offset: ["start 0.85", "end 0.45"] });
  const words = BODY.split(" ");

  return (
    <section className="bg-white py-28 sm:py-40" aria-labelledby="v5-problem-title">
      <div className="mx-auto max-w-[1080px] px-5">
        <p data-reveal="up" className="v5-eyebrow text-[1.1875rem] text-graphite-2">
          The challenge
        </p>
        <h2 id="v5-problem-title" data-reveal="up" data-delay="60" className={`${h2v5} mt-3 max-w-[14ch] text-graphite`}>
          Complexity Is the Cost of Growth.
        </h2>

        {/* The body brightens word by word as it scrolls into place. */}
        <p ref={para} className="v5-display mt-12 max-w-[30ch] text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.18] text-graphite">
          {reduce ? BODY : words.map((w, i) => <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>)}
        </p>

        {/* Stats. */}
        <dl className="mt-24 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-hairline pt-12 lg:grid-cols-4">
          {COUNTS.map((c, i) => (
            <div key={c.label} data-reveal="up" data-delay={String(i * 80)} className="flex flex-col">
              <dt className="order-2 mt-2 text-[1.0625rem] font-semibold tracking-[-0.01em] text-graphite">{c.label}</dt>
              <dd className="v5-display order-1 text-[clamp(3rem,6vw,5rem)] leading-none text-graphite">
                {c.to.toLocaleString("en-US")}
              </dd>
              <dd className="order-3 mt-1 text-[0.9375rem] text-graphite-2">Up from {c.from} at founding.</dd>
            </div>
          ))}
        </dl>

        {/* Revenue against complexity. */}
        <div data-reveal="up" className="mt-24 rounded-[28px] bg-mist p-6 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-[1.3125rem] font-semibold tracking-[-0.015em] text-graphite">Revenue grows. Complexity grows faster.</p>
            <div className="flex items-center gap-6 text-[0.875rem] text-graphite-2">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-graphite" aria-hidden="true" /> Revenue
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-azure" aria-hidden="true" /> Operational complexity
              </span>
            </div>
          </div>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mt-8 h-auto w-full"
            role="img"
            aria-label="Illustrative chart: as a company grows from founding to enterprise, revenue rises steadily while operational complexity rises exponentially and overtakes it."
          >
            <defs>
              <linearGradient id="v5-gap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0071e3" stopOpacity="0.22" />
                <stop offset="1" stopColor="#0071e3" stopOpacity="0.04" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((g) => (
              <line key={g} x1={L} x2={R} y1={Y(g)} y2={Y(g)} stroke="#1d1d1f" strokeOpacity="0.06" />
            ))}
            <line x1={L} x2={R} y1={B} y2={B} stroke="#1d1d1f" strokeOpacity="0.18" />
            {STAGES.map((s, i) => (
              <text key={s} x={X(i / (STAGES.length - 1))} y={B + 36} textAnchor={i === 0 ? "start" : i === STAGES.length - 1 ? "end" : "middle"} className="fill-graphite-2 text-[15px]">
                {s}
              </text>
            ))}
            <motion.path d={GAP} fill="url(#v5-gap)" initial={reduce ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ delay: 1.4, duration: 0.8 }} />
            <motion.path d={curve(revenue)} fill="none" stroke="#1d1d1f" strokeWidth="3" strokeLinecap="round" initial={reduce ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }} />
            <motion.path d={curve(complexity)} fill="none" stroke="#0071e3" strokeWidth="3" strokeLinecap="round" initial={reduce ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }} />
            <motion.text x={X(0.9) - 16} y={Y((revenue(0.9) + complexity(0.9)) / 2) + 6} textAnchor="end" className="fill-azure text-[16px] font-semibold" initial={reduce ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ delay: 1.8, duration: 0.6 }}>
              The cost of complexity
            </motion.text>
          </svg>
        </div>
        <p className="mt-4 text-[0.75rem] text-graphite-3">Illustrative figures.</p>
      </div>
    </section>
  );
}
