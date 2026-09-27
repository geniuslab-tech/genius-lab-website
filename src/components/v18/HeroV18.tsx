"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { ConsoleFrame, PortalConsole } from "./PortalConsole";
import { useInView } from "./ui";

export function HeroV18() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const [liveRef, live] = useInView<HTMLDivElement>(0.15);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  // The console starts turned toward the headline and settles flat as you scroll.
  const rotateX = useTransform(p, [0, 0.4], [9, 0]);
  const rotateY = useTransform(p, [0, 0.4], [-14, 0]);
  const scale = useTransform(p, [0, 0.4], [0.95, 1]);
  const y = useTransform(p, [0, 0.4], [0, -24]);

  return (
    <section ref={root} id="top" className="v18-band on-navy relative overflow-hidden pt-[76px]" aria-labelledby="v18-hero-title">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-(--navy-deep)/60" aria-hidden="true" />
      <div className="mx-auto grid max-w-[1360px] items-center gap-12 px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:gap-14 lg:pb-28 lg:pt-20">
        <div className="relative z-10">
          <p className="v18-intro v18-label flex items-center gap-3 text-white/65" style={{ ["--d" as string]: "0ms" }}>
            <span className="h-px w-8 bg-(--ember)" aria-hidden="true" />
            One partner. One platform. One source of truth.
          </p>
          <h1 id="v18-hero-title" className="v18-intro v18-display mt-6 text-[clamp(2.5rem,5.2vw,4.25rem)] text-white" style={{ ["--d" as string]: "80ms" }}>
            Transform Business Complexity into Strategic Advantage
          </h1>
          <p className="v18-intro text-pretty mt-7 max-w-[48ch] text-[1.125rem] leading-[1.7] text-white/75" style={{ ["--d" as string]: "160ms" }}>
            We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the software you already rely on.
          </p>
          <div className="v18-intro mt-9 flex flex-wrap gap-3" style={{ ["--d" as string]: "240ms" }}>
            <a href="#action" className="v18-btn v18-btn-lg v18-btn-ember">
              See Genius Lab in action
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </a>
            <a href="#contact" className="v18-btn v18-btn-lg v18-btn-ghost-dark">
              Book a demo
            </a>
          </div>
          <dl className="v18-intro mt-12 grid max-w-[460px] grid-cols-3 border-t border-white/15 pt-6" style={{ ["--d" as string]: "320ms" }}>
            {[
              ["Services", "Specialist team"],
              ["Technology", "Genius Portal"],
              ["Delivery", "Fully managed"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="v18-label text-white/50">{k}</dt>
                <dd className="mt-2 text-[0.9375rem] font-semibold text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div ref={liveRef} className="v18-intro relative [perspective:1800px]" style={{ ["--d" as string]: "200ms" }}>
          <motion.div style={reduce ? undefined : { rotateX, rotateY, scale, y, transformOrigin: "20% 50%" }} className="will-change-transform">
            <ConsoleFrame bleed={1.32} bleedSm={1.45}>
              <PortalConsole screen="overview" live={live} />
            </ConsoleFrame>
          </motion.div>
          <p className="v18-label mt-5 flex items-center gap-2 text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-(--ember)" aria-hidden="true" />
            Genius Portal · illustrative preview, not client data
          </p>
        </div>
      </div>
    </section>
  );
}

/** Placeholder marks. Real client logos replace these once approved. */
const MARKS = [
  "M8 2 14 5.5 14 12.5 8 16 2 12.5 2 5.5Z",
  "M2 14 8 2 14 14Z",
  "M2 2H14V14H2Z",
  "M8 2A6 6 0 1 1 8 14 6 6 0 1 1 8 2Z",
  "M2 8 8 2 14 8 8 14Z",
  "M2 3H14L8 14Z",
  "M3 2H13L15 8 13 14H3L1 8Z",
];

export function LogosV18() {
  return (
    <section className="border-b border-(--rule) bg-white py-10" aria-label="Clients">
      <div className="mx-auto flex max-w-[1360px] flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-center lg:gap-12">
        <p className="v18-label shrink-0 text-(--ink-3) lg:max-w-[15rem]">Client logos · placeholders until approved</p>
        <div className="min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
          <p className="sr-only">Seven placeholder marks stand in for client logos.</p>
          <ul className="v18-marquee flex w-max gap-14" aria-hidden="true">
            {[...MARKS, ...MARKS].map((d, i) => (
              <li key={i} className="flex items-center gap-3 text-(--ink-3)">
                <svg viewBox="0 0 16 16" className="h-5 w-5" aria-hidden="true">
                  <path d={d} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
                <span className="flex flex-col gap-1.5" aria-hidden="true">
                  <span className="block h-[5px] rounded-full bg-(--rule-2)" style={{ width: 52 + ((i * 23) % 40) }} />
                  <span className="block h-[5px] w-8 rounded-full bg-(--grey-2)" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
