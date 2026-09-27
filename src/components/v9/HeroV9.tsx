"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useTransform } from "motion/react";
import { contourAt, contourGenerator, contourPath, hillsAt, type Hill } from "@/lib/terrain";
import { Slate, usePin, useStill } from "./shared";

/* The contour terrain, computed once and rounded so server and client draw the same lines. */
const GW = 96;
const GH = 54;
const HILLS: Hill[] = [
  { x: 0.72, y: 0.42, h: 1, r: 0.16 },
  { x: 0.86, y: 0.7, h: 0.55, r: 0.12 },
  { x: 0.55, y: 0.72, h: 0.45, r: 0.14 },
  { x: 0.3, y: 0.25, h: 0.35, r: 0.18 },
  { x: 0.12, y: 0.8, h: 0.3, r: 0.15 },
  { x: 0.95, y: 0.15, h: 0.4, r: 0.1 },
];
const LEVELS = 14;

function buildTerrain() {
  const values = new Float64Array(GW * GH);
  let max = 0;
  for (let j = 0; j < GH; j++) {
    for (let i = 0; i < GW; i++) {
      const x = i / (GW - 1);
      const y = j / (GH - 1);
      const ripple = 0.035 * Math.sin(x * 23 + y * 7) * Math.cos(y * 17 - x * 5);
      const v = hillsAt(HILLS, x, y, 16 / 9) + ripple;
      values[j * GW + i] = v;
      if (v > max) max = v;
    }
  }
  const gen = contourGenerator().size([GW, GH]);
  const sx = 1600 / (GW - 1);
  const sy = 900 / (GH - 1);
  return Array.from({ length: LEVELS }, (_, k) => {
    const level = (max * (k + 1)) / (LEVELS + 1);
    return { k, d: contourPath(contourAt(gen, values, level), sx, sy) };
  });
}
const TERRAIN = buildTerrain();

function Terrain() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      {TERRAIN.map(({ k, d }) => (
        <path
          key={k}
          d={d}
          fill="none"
          stroke={k > LEVELS - 4 ? "var(--v9-ice)" : "#6f78c9"}
          strokeOpacity={k > LEVELS - 4 ? 0.75 : 0.16 + k * 0.025}
          strokeWidth={k > LEVELS - 4 ? 1.3 : 1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {/* The agent's reticle, reading the summit. */}
      <g transform="translate(1152 378)">
        <circle r="26" fill="none" stroke="var(--v9-ice)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path d="M-40 0H-14M14 0H40M0 -40V-14M0 14V40" stroke="var(--v9-ice)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <text x="44" y="-30" fill="var(--v9-ice)" className="v9-tc" style={{ fontSize: 14 }}>
          GENIUS AGENT · READING
        </text>
      </g>
    </svg>
  );
}

const LINES = ["Transform business", "complexity into", "strategic", "advantage"];

function HeroCopy() {
  return (
    <>
      <p className="text-pretty max-w-[34ch] text-[1.0625rem] font-semibold leading-snug text-white sm:text-[1.1875rem]">
        A fully managed intelligence and execution layer for your entire business.
      </p>
      <p className="text-pretty mt-3 max-w-[52ch] text-[0.9375rem] leading-[1.65] text-(--v9-fog) sm:text-[1rem]">
        We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the
        software you already rely on.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <a href="#action" className="v9-btn v9-btn-ice">
          See Genius Lab in action
        </a>
        <a href="#contact" className="v9-tc text-white underline decoration-white/30 underline-offset-8 transition-colors hover:decoration-(--v9-ice)">
          Book a demo
        </a>
      </div>
    </>
  );
}

function Headline({ id }: { id: string }) {
  return (
    <h1 id={id} className="v9-display text-[clamp(2.75rem,min(10.4vw,15svh),11.5rem)] text-white">
      {LINES.map((l, i) => (
        <span key={l} className="block overflow-hidden pb-[0.04em]">
          <span className={`v9-unmask block ${i === 2 ? "text-(--v9-ice)" : ""}`} style={{ "--d": `${120 + i * 110}ms` } as CSSProperties}>
            {l}
          </span>
        </span>
      ))}
    </h1>
  );
}

export function HeroV9() {
  const still = useStill();
  const ref = useRef<HTMLElement>(null);
  const p = usePin(ref);

  // The camera pushes into the headline until it passes through it.
  const hScale = useTransform(p, [0, 0.72], [1, 9]);
  const hOpacity = useTransform(p, [0.3, 0.62], [1, 0]);
  const copyOpacity = useTransform(p, [0, 0.16], [1, 0]);
  const copyY = useTransform(p, [0, 0.16], [0, -40]);
  const tScale = useTransform(p, [0, 1], [1, 2.6]);
  const tOpacity = useTransform(p, [0, 0.55, 0.9], [1, 0.8, 0]);
  const nextOpacity = useTransform(p, [0.6, 0.78, 0.94, 1], [0, 1, 1, 0]);
  const nextScale = useTransform(p, [0.6, 1], [0.7, 1.1]);
  const black = useTransform(p, [0.9, 1], [0, 1]);

  if (still) {
    return (
      <section id="top" data-scene="SC 01 · Int. the business" className="relative isolate overflow-hidden bg-(--v9-ink) pb-16 pt-24" aria-labelledby="v9-hero-title">
        <div className="absolute inset-0 -z-10 opacity-70">
          <Terrain />
        </div>
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <Slate sc="01">Int. the business · night</Slate>
          <div className="mt-8">
            <Headline id="v9-hero-title" />
          </div>
          <div className="mt-10">
            <HeroCopy />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="top" data-scene="SC 01 · Int. the business" className="relative h-[260svh] bg-(--v9-ink)" aria-labelledby="v9-hero-title">
      <div className="sticky top-0 isolate h-svh overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_72%_42%,#101440_0%,transparent_70%)]" aria-hidden="true" />
        <motion.div className="absolute inset-0 -z-10 origin-[72%_42%]" style={{ scale: tScale, opacity: tOpacity }}>
          <div className="v9-fadein h-full w-full">
            <Terrain />
          </div>
        </motion.div>

        <div className="mx-auto flex h-full max-w-[1440px] flex-col px-4 pb-12 pt-16 sm:px-8 sm:pb-14 sm:pt-20">
          <motion.div style={{ opacity: copyOpacity }}>
            <Slate sc="01" className="v9-fadein">
              Int. the business · night
            </Slate>
          </motion.div>

          <div className="flex flex-1 flex-col justify-end">
            <motion.div className="origin-[38%_58%] will-change-transform" style={{ scale: hScale, opacity: hOpacity }}>
              <Headline id="v9-hero-title" />
            </motion.div>
            <motion.div className="mt-6 sm:mt-8" style={{ opacity: copyOpacity, y: copyY }}>
              <div className="v9-fadein" style={{ "--d": "560ms" } as CSSProperties}>
                <HeroCopy />
              </div>
            </motion.div>
          </div>
        </div>

        {/* The next scene's slate, arriving out of the zoom. */}
        <motion.div className="pointer-events-none absolute inset-0 grid place-items-center" style={{ opacity: nextOpacity, scale: nextScale }} aria-hidden="true">
          <div className="text-center">
            <p className="v9-tc text-(--v9-ice)">Cut to · SC 02</p>
            <p className="v9-display mt-3 text-[clamp(2rem,6vw,5rem)] text-white">The cost of growth</p>
          </div>
        </motion.div>
        <motion.div className="pointer-events-none absolute inset-0 bg-(--v9-ink)" style={{ opacity: black }} aria-hidden="true" />
      </div>
    </section>
  );
}
