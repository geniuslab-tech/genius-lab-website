"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/v24/Reveal";
import { ParticleField } from "@/components/v24/motion";

const LOGOS = ["NORTHWIND", "AXIOM", "MERIDIAN", "VANTA GROUP", "HELIOS", "CALDERA", "ORBIS", "STRATUM"];

/** The approved hero copy, shared by every version. */
export function HeroCopy({ after, headlineClass = "" }: { after?: ReactNode; headlineClass?: string }) {
  return (
    <Reveal className="min-w-0 self-center">
      <p className="eyebrow mb-8">One partner. One platform. One source of truth.</p>
      <div className="lg:w-fit">
        <h1
          className={`font-gl-display text-[2.15rem] font-semibold leading-[1.06] tracking-[-0.03em] text-gradient-light sm:text-[2.4rem] lg:whitespace-nowrap lg:text-[2.6rem] xl:text-[2.5rem] ${headlineClass}`}
        >
          <span className="block">Transform Business Complexity</span>
          <span className="block">into Strategic Advantage</span>
        </h1>
        <p className="mt-10 max-w-[38rem] text-[1.05rem] leading-relaxed text-gl-muted-foreground lg:max-w-[40.5rem]">
          <span className="font-medium text-gl-foreground lg:block">
            A fully managed intelligence and execution layer for your entire business.
          </span>{" "}
          <span className="lg:mt-2 lg:block">
            We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the
            software you already rely on.
          </span>
        </p>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <a
          href="#demo"
          className="light-sweep rounded-md bg-gl-gold px-6 py-3.5 text-sm font-medium text-gl-background transition-opacity duration-500 hover:opacity-90"
        >
          See Genius Lab in action
        </a>
        <a href="#cta" className="rounded-md border border-gl-border px-6 py-3.5 text-sm transition-colors duration-500 hover:border-gl-foreground/30">
          Book a demo
        </a>
      </div>
      {after}
    </Reveal>
  );
}

export function LogoMarquee({ className = "mt-14 lg:mt-16" }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-[0.62rem] uppercase tracking-[0.3em] text-gl-muted-foreground/65">
        Trusted by operators, manufacturers and value creation teams
      </p>
      <div className="relative mt-5 flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="marquee-track flex shrink-0 items-center gap-10 pr-10">
          {[...LOGOS, ...LOGOS].map((name, i) => (
            <span key={`${name}-${i}`} className="whitespace-nowrap font-gl-display text-[0.72rem] tracking-[0.24em] text-gl-muted-foreground/55">
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** One blue spotlight falling from above, as in v16. */
export function SpotlightBackdrop({ tint = "blue" }: { tint?: "blue" | "amber" | "violet" }) {
  const glow =
    tint === "amber"
      ? "[background:radial-gradient(ellipse_at_center,oklch(0.7_0.14_70/34%),oklch(0.5_0.17_254/16%)_52%,transparent_74%)]"
      : tint === "violet"
        ? "[background:radial-gradient(ellipse_at_center,oklch(0.6_0.19_285/42%),oklch(0.5_0.17_254/16%)_52%,transparent_74%)]"
        : "[background:radial-gradient(ellipse_at_center,oklch(0.62_0.19_252/48%),oklch(0.5_0.17_254/17%)_52%,transparent_74%)]";
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className={`glow-breathe absolute -top-[24rem] left-1/2 h-[50rem] w-[78rem] -translate-x-1/2 rounded-full blur-[120px] ${glow}`} />
      <ParticleField count={14} tone="cyan" className="opacity-40" />
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_50%_0%,transparent_30%,var(--background)_88%)]" />
      <div className="absolute inset-x-0 bottom-0 h-64 [background:linear-gradient(180deg,transparent,var(--background))]" />
    </div>
  );
}

/** Wraps a demo so it bleeds off the right edge on desktop, with a blue glow behind it. */
export function DemoColumn({ children, caption }: { children: ReactNode; caption?: ReactNode }) {
  return (
    <Reveal className="relative min-w-0" delay={150}>
      <div className="glow-breathe pointer-events-none absolute -inset-x-10 -inset-y-8 -z-10 blur-[90px] [background:radial-gradient(ellipse_at_center,oklch(0.7_0.17_252/26%),transparent_70%)]" />
      <div id="demo" className="relative rounded-[1.15rem] shadow-[var(--shadow-glow-blue)]">
        {children}
      </div>
      {caption}
    </Reveal>
  );
}

/** Grid used by v25–v27: copy left, demo right. */
export function HeroGrid({ copy, demo }: { copy: ReactNode; demo: ReactNode }) {
  return (
    <div className="relative mx-auto grid max-w-[112rem] grid-cols-[minmax(0,1fr)] items-center gap-12 px-6 pt-20 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:gap-10 lg:px-10 lg:pt-10 xl:grid-cols-[minmax(0,40rem)_minmax(0,1fr)] xl:gap-12">
      {copy}
      {demo}
    </div>
  );
}

/** Horizontal step rail under a demo; the active step fills while it plays. */
export function StepRail<K extends string>({
  steps,
  active,
  label = "Live product demo",
}: {
  steps: { key: K; title: string }[];
  active: K;
  label?: string;
}) {
  const idx = steps.findIndex((s) => s.key === active);
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 ">
      <span className="flex items-center gap-2 font-gl-mono text-[0.6rem] uppercase tracking-[0.2em] text-gl-muted-foreground/70">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-gl-gold opacity-60" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-gl-gold" />
        </span>
        {label}
      </span>
      <ol className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {steps.map((s, i) => (
          <li
            key={s.key}
            className={`flex items-center gap-2 text-[0.72rem] transition-colors duration-500 ${
              i === idx ? "text-gl-foreground" : i < idx ? "text-gl-muted-foreground" : "text-gl-muted-foreground/50"
            }`}
          >
            <span
              className={`grid h-4 w-4 place-items-center rounded-full border font-gl-mono text-[0.5rem] transition-all duration-500 ${
                i === idx ? "border-gl-gold bg-gl-gold text-gl-background" : i < idx ? "border-gl-data/60 text-gl-data" : "border-gl-border"
              }`}
            >
              {i + 1}
            </span>
            {s.title}
          </li>
        ))}
      </ol>
    </div>
  );
}
