"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { lerp, r1, smoothPath, type Pt } from "./geo";
import { Sticker, useReduced, type Tint } from "./ui";

const W = 1000;
const H = 360;
const N = 46;

/** The same line twice: once knotted by growth, once calm. Deterministic, so SSR matches. */
const TANGLED: Pt[] = [];
const CALM: Pt[] = [];
for (let i = 0; i < N; i++) {
  const u = i / (N - 1);
  const taper = Math.pow(Math.sin(Math.PI * u), 0.55);
  const x = 30 + u * (W - 60);
  TANGLED.push([
    x + taper * (74 * Math.sin(i * 1.93) + 38 * Math.sin(i * 0.71 + 1)),
    H / 2 + taper * (118 * Math.sin(i * 1.31 + 0.5) * Math.cos(i * 0.43) + 22 * Math.sin(i * 2.7)),
  ]);
  CALM.push([x, H / 2 + 22 * Math.sin(u * Math.PI * 3.2)]);
}

const pointAt = (i: number, t: number): Pt => [lerp(TANGLED[i][0], CALM[i][0], t), lerp(TANGLED[i][1], CALM[i][1], t)];
const pathAt = (t: number) => smoothPath(TANGLED.map((_, i) => pointAt(i, t)));

/** Systems that ride the line: jumbled while it is knotted, evenly spaced once calm. */
const RIDERS: { name: string; i: number; tint: Tint; rot: number; wide?: boolean }[] = [
  { name: "ERP", i: 5, tint: "sky", rot: -8 },
  { name: "Spreadsheets", i: 13, tint: "ochre", rot: 7, wide: true },
  { name: "CRM", i: 21, tint: "terra", rot: -5 },
  { name: "Manual handoffs", i: 29, tint: "sage", rot: 9, wide: true },
  { name: "Finance", i: 36, tint: "sky", rot: -6 },
  { name: "Reports", i: 42, tint: "ochre", rot: 5, wide: true },
];

/** Illustrative growth of what a company has to hold together, founding to enterprise. */
const COUNTS = [
  { label: "Systems", from: 3, to: 46 },
  { label: "Reports", from: 8, to: 940 },
  { label: "Manual handoffs", from: 2, to: 210 },
  { label: "People in a decision", from: 2, to: 19 },
];

function Rider({ r, t }: { r: (typeof RIDERS)[number]; t: MotionValue<number> }) {
  const left = useTransform(t, (v) => `${r1((pointAt(r.i, v)[0] / W) * 100)}%`);
  const top = useTransform(t, (v) => `${r1((pointAt(r.i, v)[1] / H) * 100)}%`);
  const rotate = useTransform(t, (v) => r1(r.rot * (1 - v)));
  return (
    <motion.div className={`absolute -translate-x-1/2 -translate-y-1/2 ${r.wide ? "hidden sm:block" : ""}`} style={{ left, top, rotate }}>
      <Sticker tint={r.tint} rotate={0} className="text-[0.75rem] sm:text-[0.875rem]">
        {r.name}
      </Sticker>
    </motion.div>
  );
}

function Line({ t }: { t: MotionValue<number> }) {
  const d = useTransform(t, pathAt);
  const width = useTransform(t, [0, 1], [2.2, 3]);
  return (
    <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true" fill="none">
        <motion.path d={d} stroke="var(--ink)" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={TANGLED[0][0]} cy={TANGLED[0][1]} r="6" fill="var(--ink)" />
        <circle cx={TANGLED[N - 1][0]} cy={TANGLED[N - 1][1]} r="6" fill="var(--terra)" />
      </svg>
      {RIDERS.map((r) => (
        <Rider key={r.name} r={r} t={t} />
      ))}
    </div>
  );
}

function Counts() {
  return (
    <div className="mt-8">
      <dl className="flex flex-wrap gap-2.5">
        {COUNTS.map((c) => (
          <div key={c.label} className="flex items-baseline gap-2 rounded-full border border-[var(--rule)] bg-[var(--paper)] px-4 py-2">
            <dt className="text-[0.8125rem] text-[var(--ink-3)]">{c.label}</dt>
            <dd className="v17-serif text-[1.0625rem] text-[var(--ink)]">
              {c.from} <span aria-label="grows to">&rarr;</span> {c.to.toLocaleString("en-US")}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[0.75rem] text-[var(--ink-3)]">Founding to enterprise, illustrative</p>
    </div>
  );
}

const CopyA = () => (
  <div>
    <h2 id="v17-problem-title" className="v17-display text-balance text-[clamp(2.25rem,5.4vw,4.25rem)]">
      Complexity Is the <em>Cost of Growth</em>.
    </h2>
    <p className="mt-6 max-w-[58ch] text-pretty text-[1.0625rem] leading-[1.7] text-[var(--ink-2)] sm:text-[1.125rem]">
      Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding everything
      together. Leadership loses visibility, execution slows down, and the business pays the price.
    </p>
  </div>
);

const CopyBridge = () => (
  <p className="v17-display max-w-[24ch] text-balance text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.12] text-[var(--ink-2)]">
    When the business becomes fragmented, replacing systems can feel like the <em>natural next step</em>.
  </p>
);

const CopyB = () => (
  <div>
    <h2 className="v17-display text-balance text-[clamp(2.25rem,5.4vw,4.25rem)]">
      Solve the <em>Right Problem</em>.
    </h2>
    <p className="mt-6 max-w-[58ch] text-pretty text-[1.0625rem] leading-[1.7] text-[var(--ink-2)] sm:text-[1.125rem]">
      Sometimes replacement is necessary. But often, the problem can be solved without the cost, operational load, and
      disruption risk of a system transition. Building on what already works reduces complexity, expands capabilities, and
      unlocks more value from your systems and people.
    </p>
  </div>
);

export function Problem17() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReduced();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });
  const untangle = useTransform(p, [0.28, 0.8], [0, 1], { clamp: true });
  const eased = useTransform(untangle, (v) => r1(v * v * (3 - 2 * v) * 1000) / 1000);
  const aOpacity = useTransform(p, [0.2, 0.3], [1, 0]);
  const aY = useTransform(p, [0.2, 0.3], [0, -24]);
  const bridgeOpacity = useTransform(p, [0.26, 0.36, 0.56, 0.64], [0, 1, 1, 0]);
  const bridgeY = useTransform(p, [0.26, 0.36, 0.56, 0.64], [24, 0, 0, -24]);
  const bOpacity = useTransform(p, [0.62, 0.72], [0, 1]);
  const bY = useTransform(p, [0.62, 0.72], [24, 0]);
  const stamp = useTransform(p, [0.78, 0.86], [0, 1]);
  const calm = useTransform(p, () => 1);

  if (reduce) {
    return (
      <section ref={ref} id="problem" className="py-24 sm:py-32" aria-labelledby="v17-problem-title">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
          <span data-thread className="v17-knot v17-fill-terra mb-8 block" aria-hidden="true" />
          <CopyA />
          <Counts />
          <div className="mt-16">
            <CopyBridge />
          </div>
          <div className="mt-12">
            <Line t={calm} />
          </div>
          <div className="mt-12">
            <CopyB />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="problem" className="relative h-[300vh]" aria-labelledby="v17-problem-title">
      <span data-thread className="v17-knot v17-fill-terra absolute left-4 top-24 sm:left-8" aria-hidden="true" />
      <div className="sticky top-[4.5rem] flex h-[calc(100svh-4.5rem)] flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-8">
          <div className="grid [grid-template-areas:'s']">
            <motion.div style={{ opacity: aOpacity, y: aY }} className="[grid-area:s]">
              <CopyA />
              <div className="hidden sm:block">
                <Counts />
              </div>
            </motion.div>
            <motion.div style={{ opacity: bridgeOpacity, y: bridgeY }} className="self-center [grid-area:s]">
              <CopyBridge />
            </motion.div>
            <motion.div style={{ opacity: bOpacity, y: bY }} className="[grid-area:s]">
              <CopyB />
            </motion.div>
          </div>
          <div className="relative mt-8 sm:mt-10">
            <Line t={eased} />
            <motion.div style={{ opacity: stamp, scale: stamp }} className="absolute -top-2 right-2 sm:right-8">
              <Sticker tint="ink" rotate={-5} className="text-[0.8125rem]">
                Connected, not replaced
              </Sticker>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
