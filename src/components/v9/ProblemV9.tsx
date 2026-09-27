"use client";

import { useRef } from "react";
import { backOut, motion, useTransform, type MotionValue } from "motion/react";
import { mulberry32 } from "@/lib/terrain";
import { Slate, usePin, useStill, round1 } from "./shared";

const SYSTEMS = ["ERP", "CRM", "Finance", "Spreadsheets", "Warehouse", "HR", "Billing", "Inventory", "BI tools", "Email", "Ticketing", "Cloud apps"];

/** Illustrative growth of what a company has to hold together, founding to enterprise. */
const COUNTS = [
  { label: "Systems", from: 3, to: 46 },
  { label: "Reports", from: 8, to: 940 },
  { label: "Manual handoffs", from: 2, to: 210 },
  { label: "People in a decision", from: 2, to: 19 },
];

/* Where each system starts, scattered around the frame. Authored once, deterministic. */
const rand = mulberry32(914);
const SCATTER = SYSTEMS.map((_, i) => {
  const col = i % 6;
  const side = col < 3 ? -1 : 1;
  return {
    x: round1(side * (6 + rand() * 16)),
    y: round1((rand() - 0.62) * 46),
    r: round1((rand() - 0.5) * 34),
  };
});

const COPY_A = {
  title: "Complexity Is the Cost of Growth.",
  body: "Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding everything together. Leadership loses visibility, execution slows down, and the business pays the price.",
};
const COPY_MID = "When the business becomes fragmented, replacing systems can feel like the natural next step.";
const COPY_B = {
  title: "Solve the Right Problem.",
  body: "Sometimes replacement is necessary. But often, the problem can be solved without the cost, operational load, and disruption risk of a system transition. Building on what already works reduces complexity, expands capabilities, and unlocks more value from your systems and people.",
};

const h2 = "v9-display text-[clamp(2.4rem,min(7vw,11svh),6.5rem)] text-white";

function Chip({ name, i, p }: { name: string; i: number; p: MotionValue<number> }) {
  const s = SCATTER[i];
  const stops = [0, 0.44, 0.52, 0.62];
  // Drift apart, hold, then snap into line with a small overshoot.
  const x = useTransform(p, stops, [`${s.x}vw`, `${round1(s.x * 1.8)}vw`, `${round1(s.x * 1.8)}vw`, "0vw"], { ease: [(t) => t, (t) => t, backOut] });
  const y = useTransform(p, stops, [`${s.y}svh`, `${round1(s.y * 1.5)}svh`, `${round1(s.y * 1.5)}svh`, "0svh"], { ease: [(t) => t, (t) => t, backOut] });
  const rotate = useTransform(p, stops, [s.r, s.r * 1.8, s.r * 1.8, 0], { ease: [(t) => t, (t) => t, backOut] });
  const opacity = useTransform(p, [0, 0.44, 0.52, 0.6], [0.85, 0.35, 0.35, 1]);
  const snapped = useTransform(p, [0.58, 0.64], [0, 1]);
  return (
    <motion.li className="relative" style={{ x, y, rotate, opacity }}>
      <span className="v9-tc flex h-10 items-center justify-between gap-2 border border-white/15 bg-(--v9-ink) px-3 text-white">
        {name}
        <span className="text-(--v9-dim)">S{String(i + 1).padStart(2, "0")}</span>
      </span>
      <motion.span className="pointer-events-none absolute inset-0 border border-(--v9-ice)" style={{ opacity: snapped }} aria-hidden="true" />
    </motion.li>
  );
}

function Count({ c, p }: { c: (typeof COUNTS)[number]; p: MotionValue<number> }) {
  const v = useTransform(p, [0.02, 0.44], [c.from, c.to], { clamp: true });
  const text = useTransform(v, (n) => Math.round(n).toLocaleString("en-US"));
  return (
    <div className="flex flex-col border-l border-(--v9-rule) pl-4">
      <dt className="v9-tc order-2 mt-1 text-(--v9-dim)">{c.label}</dt>
      <dd className="order-1 flex items-baseline gap-2">
        <span className="v9-tc text-(--v9-dim)">{c.from} →</span>
        <motion.span className="v9-display text-[2.25rem] tabular-nums text-white">{text}</motion.span>
      </dd>
    </div>
  );
}

function StaticProblem() {
  return (
    <section data-scene="SC 02 · The cost of growth" className="bg-(--v9-ink) py-24" aria-labelledby="v9-problem-title">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <Slate sc="02">The cost of growth</Slate>
        <h2 id="v9-problem-title" className={`${h2} mt-8 max-w-[14ch]`}>
          {COPY_A.title}
        </h2>
        <p className="text-pretty mt-6 max-w-[56ch] leading-[1.7] text-(--v9-fog)">{COPY_A.body}</p>
        <p className="mt-10 max-w-[40ch] text-[1.125rem] text-white">{COPY_MID}</p>
        <h2 className={`${h2} mt-12 max-w-[14ch]`}>{COPY_B.title}</h2>
        <p className="text-pretty mt-6 max-w-[60ch] leading-[1.7] text-(--v9-fog)">{COPY_B.body}</p>
        <ul className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6" aria-label="Systems a growing company holds together">
          {SYSTEMS.map((s) => (
            <li key={s} className="v9-tc flex h-10 items-center border border-white/15 px-3">
              {s}
            </li>
          ))}
        </ul>
        <dl className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {COUNTS.map((c) => (
            <div key={c.label} className="border-l border-(--v9-rule) pl-4">
              <dt className="v9-tc text-(--v9-dim)">{c.label}</dt>
              <dd className="v9-display mt-1 text-[2.25rem]">
                <span className="v9-tc mr-2 text-(--v9-dim)">{c.from} →</span>
                {c.to.toLocaleString("en-US")}
              </dd>
            </div>
          ))}
        </dl>
        <p className="v9-tc mt-4 text-(--v9-dim)">Founding to enterprise · illustrative</p>
      </div>
    </section>
  );
}

export function ProblemV9() {
  const still = useStill();
  const ref = useRef<HTMLElement>(null);
  const p = usePin(ref);

  const aOpacity = useTransform(p, [0, 0.34, 0.42], [1, 1, 0]);
  const aY = useTransform(p, [0.34, 0.42], [0, -30]);
  const midOpacity = useTransform(p, [0.4, 0.45, 0.53, 0.58], [0, 1, 1, 0]);
  const bOpacity = useTransform(p, [0.6, 0.68], [0, 1]);
  const bY = useTransform(p, [0.6, 0.68], [30, 0]);
  const line = useTransform(p, [0.62, 0.74], [0, 1]);
  const countsOpacity = useTransform(p, [0, 0.5, 0.58], [1, 1, 0.35]);

  if (still) return <StaticProblem />;

  return (
    <section ref={ref} data-scene="SC 02 · The cost of growth" className="relative h-[340svh] bg-(--v9-ink)" aria-labelledby="v9-problem-title">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 -z-0 h-2/3 bg-[radial-gradient(ellipse_60%_70%_at_50%_100%,#0d1142_0%,transparent_70%)]" aria-hidden="true" />
        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col px-4 pb-12 pt-16 sm:px-8 sm:pb-14 sm:pt-20">
          <Slate sc="02">The cost of growth</Slate>

          <div className="mt-6 grid flex-1 content-start sm:mt-10">
            <motion.div className="[grid-area:1/1]" style={{ opacity: aOpacity, y: aY }}>
              <h2 id="v9-problem-title" className={`${h2} max-w-[14ch]`}>
                {COPY_A.title}
              </h2>
              <p className="text-pretty mt-5 max-w-[56ch] text-[0.9375rem] leading-[1.65] text-(--v9-fog) sm:text-[1.0625rem]">{COPY_A.body}</p>
            </motion.div>
            <motion.p className="v9-display self-center text-balance [grid-area:1/1] max-w-[22ch] text-[clamp(1.75rem,4vw,3.25rem)] text-(--v9-ice)" style={{ opacity: midOpacity }}>
              {COPY_MID}
            </motion.p>
            <motion.div className="[grid-area:1/1]" style={{ opacity: bOpacity, y: bY }}>
              <h2 className={`${h2} max-w-[14ch]`}>{COPY_B.title}</h2>
              <p className="text-pretty mt-5 max-w-[62ch] text-[0.9375rem] leading-[1.65] text-(--v9-fog) sm:text-[1.0625rem]">{COPY_B.body}</p>
            </motion.div>
          </div>

          <div className="relative">
            <motion.span className="absolute -top-3 left-0 right-0 h-px origin-left bg-(--v9-ice)" style={{ scaleX: line }} aria-hidden="true" />
            <ul className="grid grid-cols-3 gap-1.5 md:grid-cols-6" aria-label="Systems a growing company holds together">
              {SYSTEMS.map((s, i) => (
                <Chip key={s} name={s} i={i} p={p} />
              ))}
            </ul>
            <motion.div style={{ opacity: countsOpacity }} className="mt-6 hidden md:block">
              <dl className="grid grid-cols-4 gap-6">
                {COUNTS.map((c) => (
                  <Count key={c.label} c={c} p={p} />
                ))}
              </dl>
              <p className="v9-tc mt-3 text-(--v9-dim)">Founding to enterprise · illustrative</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
