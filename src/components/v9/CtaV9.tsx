"use client";

import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { BrandLogo } from "@/components/v2/ui";
import { Slate, usePin, useStill } from "./shared";

const ROWS = [
  { text: "Turn your business", from: 38, to: -14, outline: false },
  { text: "knowledge into", from: -42, to: 10, outline: false },
  { text: "intelligent", from: 46, to: -8, outline: true },
  { text: "systems.", from: -30, to: 18, outline: false },
];

function Row({ r, p }: { r: (typeof ROWS)[number]; p: MotionValue<number> }) {
  const x = useTransform(p, [0, 0.5, 1], [`${r.from}vw`, "0vw", `${r.to}vw`]);
  return (
    <motion.span className={`block whitespace-nowrap will-change-transform ${r.outline ? "v9-outline" : ""}`} style={{ x }}>
      {r.text}
    </motion.span>
  );
}

const Copy = () => (
  <>
    <p className="text-pretty max-w-[56ch] leading-[1.7] text-(--v9-fog) sm:text-[1.0625rem]">
      Tell us where your systems and data stand today. We&rsquo;ll show you how Genius Lab turns them into one intelligence
      and execution layer, fully managed.
    </p>
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <a href="#" className="v9-btn v9-btn-ice">
        Talk to us
      </a>
      <a href="#action" className="v9-btn v9-btn-line">
        Watch it in action
      </a>
    </div>
  </>
);

/** SC 11: the closing title, set as giant kinetic type that slides into register. */
export function CtaV9() {
  const still = useStill();
  const ref = useRef<HTMLElement>(null);
  const p = usePin(ref);
  const copyOpacity = useTransform(p, [0.4, 0.55], [0, 1]);
  const copyY = useTransform(p, [0.4, 0.55], [30, 0]);

  const size = "v9-display text-[clamp(3.5rem,min(15vw,21svh),16rem)] leading-[0.84]";

  if (still) {
    return (
      <section id="contact" data-scene="SC 11 · Fade out" className="scroll-mt-12 bg-(--v9-ink) py-24" aria-labelledby="v9-cta-title">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <Slate sc="11">One partner. One platform. One source of truth.</Slate>
          <h2 id="v9-cta-title" className="v9-display mt-8 text-[clamp(3rem,10vw,9rem)] leading-[0.9]">
            Turn your business knowledge into <span className="text-(--v9-ice)">intelligent</span> systems.
          </h2>
          <div className="mt-10">
            <Copy />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="contact" data-scene="SC 11 · Fade out" className="relative h-[280svh] bg-(--v9-ink)" aria-labelledby="v9-cta-title">
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden pb-12 pt-16 sm:pb-14 sm:pt-20">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_70%_80%_at_50%_100%,#101440_0%,transparent_70%)]" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-8">
          <Slate sc="11">One partner. One platform. One source of truth.</Slate>
        </div>
        <h2 id="v9-cta-title" className={`${size} relative mt-auto px-4 text-white sm:px-8`}>
          {ROWS.map((r) => (
            <Row key={r.text} r={r} p={p} />
          ))}
        </h2>
        <motion.div className="relative mx-auto mt-6 w-full max-w-[1440px] px-4 sm:mt-10 sm:px-8" style={{ opacity: copyOpacity, y: copyY }}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Copy />
            </div>
            <BrandLogo tone="white" className="hidden h-[15px] w-auto opacity-60 lg:block" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
