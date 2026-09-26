"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Dashboard } from "@/components/v2/PortalV2";
import { More, Pill } from "./ui";

export function HeroV5() {
  const device = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: device, offset: ["start end", "center center"] });
  // Critically damped follow, so the device settles instead of tracking scroll jitter.
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const scale = useTransform(p, [0, 1], [0.86, 1]);
  const rotateX = useTransform(p, [0, 1], [14, 0]);
  const y = useTransform(p, [0, 1], [40, 0]);

  return (
    <section className="relative overflow-hidden bg-snow pt-[calc(3.25rem+4.5rem)] sm:pt-[calc(3.25rem+6rem)]" aria-labelledby="v5-hero-title">
      <div className="mx-auto max-w-[1080px] px-5 text-center">
        <p className="intro v5-eyebrow text-[1.1875rem] text-graphite-2 [--d:0ms]">Genius Lab</p>
        <h1 id="v5-hero-title" className="intro v5-display mx-auto mt-3 max-w-[16ch] text-[clamp(2.75rem,7vw,5.5rem)] text-graphite [--d:80ms]">
          Transform Business Complexity into Strategic Advantage.
        </h1>
        <p className="intro v5-body text-pretty mx-auto mt-6 max-w-[38ch] text-[clamp(1.1875rem,1.8vw,1.5rem)] font-medium text-graphite-2 [--d:180ms]">
          We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the
          software you already rely on.
        </p>
        <div className="intro mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 [--d:260ms]">
          <Pill href="#contact" size="lg">
            Talk to us
          </Pill>
          <More href="#layers">See how it works</More>
        </div>
      </div>

      {/* The product, presented like hardware. */}
      <div className="mx-auto mt-16 max-w-[1180px] px-5 pb-20 sm:mt-20 sm:pb-28">
        <div className="intro [perspective:1600px] [--d:360ms]">
        <motion.div ref={device} style={reduce ? undefined : { scale, rotateX, y }} className="origin-bottom">
          <div className="rounded-[26px] bg-[#1d1d1f] p-[10px] shadow-[0_60px_120px_-40px_rgb(16_20_64/0.45),0_0_0_1px_rgb(0_0_0/0.9),inset_0_0_0_1px_rgb(255_255_255/0.12)] sm:rounded-[34px] sm:p-[14px]">
            <div className="overflow-hidden rounded-[16px] sm:rounded-[22px] [&_figure>div]:shadow-none [&_figure>div]:ring-0 [&_figure>div]:[clip-path:none]">
              <Dashboard captionClassName="sr-only" />
            </div>
          </div>
          <div className="mx-auto h-3 w-[104%] -translate-x-[2%] rounded-b-[18px] bg-gradient-to-b from-[#d6d7db] to-[#a7a8ad] shadow-[0_20px_30px_-18px_rgb(0_0_0/0.5)] sm:h-4" aria-hidden="true">
            <div className="mx-auto h-1.5 w-[16%] rounded-b-lg bg-[#8f9095]" />
          </div>
        </motion.div>
        </div>
        <p className="mt-8 text-center text-[0.75rem] text-graphite-3">Genius Portal executive dashboard. Illustrative data.</p>
      </div>
    </section>
  );
}
