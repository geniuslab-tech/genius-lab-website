"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { PortalWindow } from "./PortalWindow";
import { More, Note, Pill } from "./ui";

/** Placeholder client marks, to be replaced with approved logos. */
const LOGOS = ["Vanta Group", "Helios", "Caldera", "Orbis", "Stratum", "Northpeak"];

/**
 * Centred headline, then the Genius Portal presented like hardware. As the page scrolls the
 * window rises out of its tilt and grows to full size on a critically damped spring, while
 * the headline eases back to give it the stage.
 */
export function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start end", "center center"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.6 });
  const scale = useTransform(p, [0, 1], [0.84, 1]);
  const rotateX = useTransform(p, [0, 1], [18, 0]);
  const y = useTransform(p, [0, 1], [90, 0]);

  const { scrollY } = useScroll();
  const copyY = useSpring(useTransform(scrollY, [0, 500], [0, -60]), { stiffness: 90, damping: 28 });
  const copyO = useTransform(scrollY, [0, 420], [1, 0.35]);

  return (
    <section id="top" data-tone="white" className="v20-sec relative overflow-hidden pt-[calc(3.25rem+4rem)] sm:pt-[calc(3.25rem+6.5rem)]" aria-labelledby="v20-hero-title">
      <motion.div style={reduce ? undefined : { y: copyY, opacity: copyO }} className="mx-auto max-w-[1120px] px-5 text-center">
        <p className="v20-intro v20-eyebrow" style={{ ["--d" as string]: "100ms" }}>
          Genius Lab
        </p>
        <h1 id="v20-hero-title" className="v20-intro v20-display v20-h1 mx-auto mt-4 max-w-[14ch]" style={{ ["--d" as string]: "180ms" }}>
          Transform Business Complexity into Strategic Advantage
        </h1>
        <p className="v20-intro v20-lead mx-auto mt-7 max-w-[40ch]" style={{ ["--d" as string]: "300ms" }}>
          We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the
          software you already rely on.
        </p>
        <div className="v20-intro mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4" style={{ ["--d" as string]: "420ms" }}>
          <Pill href="#contact">Talk to us</Pill>
          <More href="#story">See how it works</More>
        </div>
      </motion.div>

      <div ref={stage} className="mx-auto mt-16 max-w-[1180px] px-4 pb-20 sm:mt-24 sm:px-5 sm:pb-28">
        <div className="v20-intro [perspective:1800px]" style={{ ["--d" as string]: "560ms" }}>
          <motion.div style={reduce ? undefined : { scale, rotateX, y }} className="origin-[50%_100%] will-change-transform">
            <div className="v20-device">
              <PortalWindow />
            </div>
          </motion.div>
        </div>
        <Note className="mt-8 text-center">Genius Portal. Illustrative interface and data.</Note>

        <div className="mx-auto mt-20 max-w-[960px] text-center sm:mt-24">
          <p className="v20-fg3 text-[0.9375rem]">Trusted by operators, manufacturers and value creation teams</p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-14" aria-label="Client logos (placeholders)">
            {LOGOS.map((l) => (
              <li key={l} className="v20-display text-[1.0625rem] tracking-[-0.02em] text-[#6e7082] sm:text-[1.25rem]">
                {l}
              </li>
            ))}
          </ul>
          <Note className="mt-5">Placeholder marks, to be replaced with approved client logos.</Note>
        </div>
      </div>
    </section>
  );
}
