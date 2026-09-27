"use client";

import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";

/** Soft, slightly springy motion used across the page. */
export const SPRING = { type: "spring", stiffness: 130, damping: 19, mass: 0.9 } as const;
export const SOFT = { type: "spring", stiffness: 80, damping: 18 } as const;
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** False on the server and during hydration, so markup always matches. */
export function useReduced() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export type Tint = "terra" | "sage" | "ochre" | "sky";

/** Rises gently into place the first time it scrolls into view. */
export function Rise({
  children,
  delay = 0,
  className,
  y = 22,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ ...SOFT, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Section label. The small knot is where the page-long thread passes through. */
export function Eyebrow({ children, tint = "terra", className = "" }: { children: ReactNode; tint?: Tint; className?: string }) {
  return (
    <p className={`v17-eyebrow ${className}`}>
      <span data-thread className={`v17-knot v17-fill-${tint}`} aria-hidden="true" />
      {children}
    </p>
  );
}

export function SectionHead({
  label,
  title,
  lead,
  id,
  tint,
  className = "",
  children,
}: {
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  id: string;
  tint?: Tint;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={className}>
      <Eyebrow tint={tint}>{label}</Eyebrow>
      <Rise>
        <h2 id={id} className="v17-display mt-6 text-balance text-[clamp(2.25rem,5vw,4rem)]">
          {title}
        </h2>
      </Rise>
      {lead && (
        <Rise delay={0.08}>
          <p className="mt-6 max-w-[56ch] text-pretty text-[1.0625rem] leading-[1.7] text-[var(--ink-2)] sm:text-[1.125rem]">{lead}</p>
        </Rise>
      )}
      {children}
    </div>
  );
}

/** A rotated, sticker-like label. */
export function Sticker({
  children,
  tint = "ochre",
  rotate = -3,
  className = "",
  style,
}: {
  children: ReactNode;
  tint?: Tint | "paper" | "ink";
  rotate?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={`v17-sticker v17-tint-${tint} ${className}`} style={{ rotate: `${rotate}deg`, ...style }}>
      {children}
    </span>
  );
}

export function PillLink({
  href,
  children,
  tone = "ink",
  onClick,
  className = "",
  tabIndex,
}: {
  href: string;
  children: ReactNode;
  tone?: "ink" | "outline" | "cream";
  onClick?: () => void;
  className?: string;
  tabIndex?: number;
}) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      tabIndex={tabIndex}
      className={`v17-btn v17-btn-${tone} ${className}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING}
    >
      {children}
    </motion.a>
  );
}

/** A stroke that draws itself in when it scrolls into view. */
export function DrawPath({
  d,
  stroke = "var(--ink)",
  width = 2,
  delay = 0,
  duration = 1.4,
  className,
  nonScaling = false,
  dash,
  opacity = 1,
}: {
  d: string;
  stroke?: string;
  width?: number;
  delay?: number;
  duration?: number;
  className?: string;
  nonScaling?: boolean;
  dash?: string;
  opacity?: number;
}) {
  const reduce = useReduced();
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dash}
      opacity={opacity}
      className={className}
      vectorEffect={nonScaling ? "non-scaling-stroke" : undefined}
      initial={reduce || dash ? false : { pathLength: 0 }}
      whileInView={reduce || dash ? undefined : { pathLength: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: EASE_OUT }}
    />
  );
}

/** A playful hand-drawn arrow: a curved shaft and a two-stroke head. */
export function HandArrow({
  className = "",
  flip = false,
  delay = 0.2,
  label,
}: {
  className?: string;
  flip?: boolean;
  delay?: number;
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 80"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      fill="none"
    >
      <DrawPath d="M6 12 C 30 4, 66 8, 84 34 C 92 46, 96 56, 98 66" stroke="var(--ink)" width={2} delay={delay} duration={0.9} />
      <DrawPath d="M86 58 L98 68 L106 53" stroke="var(--ink)" width={2} delay={delay + 0.75} duration={0.35} />
    </svg>
  );
}

/** A loose hand-drawn underline for a display phrase. */
export function Underline({ className = "", color = "var(--terra)", delay = 0.5 }: { className?: string; color?: string; delay?: number }) {
  return (
    <svg viewBox="0 0 300 20" preserveAspectRatio="none" className={className} aria-hidden="true" fill="none">
      <DrawPath d="M4 13 C 60 6, 120 5, 180 8 S 270 14, 296 7" stroke={color} width={4} delay={delay} duration={1} nonScaling />
      <DrawPath d="M30 17 C 90 12, 170 12, 250 15" stroke={color} width={2.5} delay={delay + 0.6} duration={0.8} nonScaling opacity={0.7} />
    </svg>
  );
}
