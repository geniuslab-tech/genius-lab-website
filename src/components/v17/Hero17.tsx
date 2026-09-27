"use client";

import { motion } from "motion/react";
import { BrandLogo } from "@/components/v2/ui";
import { handCurve, type Pt } from "./geo";
import { DrawPath, Eyebrow, PillLink, SOFT, Sticker, Underline, type Tint } from "./ui";

/** The systems a growing company already runs, scattered on the left. */
const SOURCES: { name: string; at: Pt; tint: Tint; rot: number }[] = [
  { name: "ERP", at: [21, 9], tint: "sky", rot: -4 },
  { name: "CRM", at: [36, 24], tint: "terra", rot: 3 },
  { name: "Spreadsheets", at: [19, 38], tint: "ochre", rot: -2 },
  { name: "Finance", at: [33, 56], tint: "sage", rot: 4 },
  { name: "Warehouse", at: [20, 73], tint: "sky", rot: -3 },
  { name: "Email threads", at: [33, 91], tint: "terra", rot: 2 },
];

const HUB: Pt = [58, 50];

const OUTPUTS: { name: string; at: Pt; tint: Tint; rot: number }[] = [
  { name: "Clear insight", at: [83, 24], tint: "sage", rot: 3 },
  { name: "Orchestrated execution", at: [82, 78], tint: "ochre", rot: -3 },
];

/** Placeholder client marks, to be replaced with approved logos. */
const LOGOS = ["Vanta Group", "Helios", "Caldera", "Orbis", "Stratum", "Northpeak", "Meridian", "Alder & Co"];

function Diagram() {
  return (
    <div
      className="relative mx-auto aspect-[4/5] w-full max-w-[34rem] sm:aspect-[5/5] lg:aspect-[5/6]"
      role="img"
      aria-label="Six existing systems, from ERP to email threads, drawn as loose labels with pen lines that meet at Genius Lab, which sends out clear insight and orchestrated execution."
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true" fill="none">
        {SOURCES.map((s, i) => (
          <DrawPath
            key={s.name}
            d={handCurve(s.at, HUB, i % 2 ? 5 : -5)}
            stroke="var(--ink)"
            width={1.5}
            nonScaling
            delay={0.5 + i * 0.12}
            duration={1.1}
            opacity={0.55}
          />
        ))}
        {OUTPUTS.map((o, i) => (
          <DrawPath
            key={o.name}
            d={handCurve(HUB, o.at, i ? 6 : -6)}
            stroke="var(--terra)"
            width={2.5}
            nonScaling
            delay={1.5 + i * 0.2}
            duration={0.9}
          />
        ))}
      </svg>

      {SOURCES.map((s, i) => (
        <motion.div
          key={s.name}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${s.at[0]}%`, top: `${s.at[1]}%` }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...SOFT, delay: 0.2 + i * 0.08 }}
        >
          <span
            className="v17-float block"
            style={{ ["--v17-dur" as string]: `${5 + (i % 3)}s`, ["--v17-delay" as string]: `${-i * 0.7}s` }}
          >
            <Sticker tint={s.tint} rotate={s.rot} className="text-[0.8125rem] sm:text-[0.875rem]">
              {s.name}
            </Sticker>
          </span>
        </motion.div>
      ))}

      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${HUB[0]}%`, top: `${HUB[1]}%` }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...SOFT, delay: 1.1 }}
      >
        <div className="relative flex size-[7.25rem] items-center justify-center rounded-full bg-[var(--paper)] shadow-[0_0_0_1.5px_var(--ink),0_22px_40px_-22px_rgb(16_20_64/0.55)] sm:size-[9rem]">
          <svg viewBox="0 0 100 100" className="absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)]" aria-hidden="true" fill="none">
            <DrawPath
              d="M50 4 C 76 3, 97 22, 96 50 C 95 78, 74 97, 49 96 C 22 95, 4 76, 5 49 C 6 26, 24 7, 54 6"
              stroke="var(--terra)"
              width={1.5}
              delay={1.3}
              duration={1.3}
            />
          </svg>
          <BrandLogo tone="navy" className="h-auto w-[72%]" />
        </div>
      </motion.div>

      {OUTPUTS.map((o, i) => (
        <motion.div
          key={o.name}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${o.at[0]}%`, top: `${o.at[1]}%` }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SOFT, delay: 2 + i * 0.2 }}
        >
          <Sticker tint={o.tint} rotate={o.rot} className="max-w-[8.5rem] whitespace-normal text-center text-[0.875rem] sm:max-w-none sm:whitespace-nowrap sm:text-[0.9375rem]">
            {o.name}
          </Sticker>
        </motion.div>
      ))}

      <motion.p
        className="v17-hand absolute bottom-[-0.5rem] right-0 hidden max-w-[13rem] rotate-[-3deg] text-right text-[1.05rem] leading-snug text-[var(--ink-2)] sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.6 }}
        aria-hidden="true"
      >
        no rip and replace: we build on what you run
      </motion.p>
    </div>
  );
}

export function Hero17() {
  return (
    <section id="top" className="scroll-mt-20 pb-10 pt-10 sm:pt-16" aria-labelledby="v17-hero-title">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-4 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="lg:col-span-7">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={SOFT}>
            <Eyebrow>One partner. One platform. One source of truth.</Eyebrow>
          </motion.div>
          <motion.h1
            id="v17-hero-title"
            className="v17-display mt-7 text-balance text-[clamp(2.75rem,6.4vw,5.5rem)] leading-[0.98]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SOFT, delay: 0.08 }}
          >
            Transform Business Complexity into{" "}
            <span className="relative inline-block">
              <em>Strategic Advantage</em>
              <Underline className="absolute -bottom-2 left-0 h-4 w-full sm:-bottom-3 sm:h-5" delay={0.9} />
            </span>
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SOFT, delay: 0.2 }}>
            <p className="mt-9 max-w-[34ch] text-[1.25rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--ink)] sm:text-[1.375rem]">
              A fully managed intelligence and execution layer for your entire business.
            </p>
            <p className="mt-4 max-w-[52ch] text-pretty text-[1.0625rem] leading-[1.7] text-[var(--ink-2)] sm:text-[1.125rem]">
              We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the
              software you already rely on.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <PillLink href="#action">See Genius Lab in action</PillLink>
              <PillLink href="#contact" tone="outline">
                Book a demo
              </PillLink>
            </div>
          </motion.div>
        </div>
        <div className="lg:col-span-5">
          <Diagram />
        </div>
      </div>

      {/* Placeholder client marks as a slow marquee of pills. */}
      <div className="mx-auto mt-16 max-w-[1240px] px-4 sm:mt-20 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <p className="max-w-[22ch] shrink-0 text-[0.875rem] font-medium leading-snug text-[var(--ink-3)]">
            Trusted by operators, manufacturers and value creation teams
            <span className="mt-1 block text-[0.75rem] font-normal">Placeholder marks</span>
          </p>
          <div className="v17-marquee-mask min-w-0 flex-1">
            <ul className="v17-marquee gap-3 py-2" aria-label="Client logos (placeholders)">
              {[...LOGOS, ...LOGOS].map((l, i) => (
                <li
                  key={i}
                  aria-hidden={i >= LOGOS.length || undefined}
                  className="v17-serif shrink-0 rounded-full border border-[var(--rule)] bg-[var(--paper)] px-5 py-2 text-[1.0625rem] text-[var(--ink-2)]"
                >
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
