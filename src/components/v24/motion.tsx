"use client";

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";

/** One-shot IntersectionObserver hook: true once the element enters the viewport. */
export function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/** Metric that counts up from zero when scrolled into view. */
export function CountUp({
  to,
  duration = 1600,
  suffix = "",
  prefix = "",
  decimals = 0,
  className = "",
}: {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/**
 * Field of glowing particles drifting upward.
 * Positions/timing are deterministic so SSR and hydration match.
 */
export function ParticleField({
  count = 16,
  rise = "-18rem",
  className = "",
  tone = "data",
}: {
  count?: number;
  rise?: string;
  className?: string;
  tone?: "data" | "cyan";
}) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * 61 + 7) % 100}%`,
        size: 2 + ((i * 13) % 3),
        delay: ((i * 1.37) % 8).toFixed(2),
        duration: (7 + ((i * 29) % 6)).toFixed(2),
      })),
    [count],
  );

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ "--rise": rise } as CSSProperties}
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className={`particle ${tone === "cyan" ? "particle-cyan" : ""}`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

const FLOW_PATHS = [
  "M -20 120 C 120 40, 260 60, 340 160 S 520 300, 620 260",
  "M -20 300 C 140 340, 240 220, 380 200 S 540 120, 620 140",
  "M -20 200 C 160 160, 300 260, 420 120 S 560 60, 620 90",
  "M -20 60 C 180 90, 320 20, 440 80 S 580 200, 620 180",
];

/** Curved data paths with glowing packets traveling along them. */
export function FlowField({
  className = "",
  colorVar = "--data",
}: {
  className?: string;
  colorVar?: string;
}) {
  const gradId = useId();
  return (
    <svg
      viewBox="0 0 600 380"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={`var(${colorVar})`} stopOpacity="0" />
          <stop offset="45%" stopColor={`var(${colorVar})`} stopOpacity="0.45" />
          <stop offset="100%" stopColor={`var(${colorVar})`} stopOpacity="0" />
        </linearGradient>
      </defs>
      {FLOW_PATHS.map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke={`url(#${gradId})`} strokeWidth="1" />
          <circle r="2.4" fill={`var(${colorVar})`} opacity="0.9">
            <animateMotion
              dur={`${6 + i * 1.6}s`}
              begin={`${i * 1.1}s`}
              repeatCount="indefinite"
              path={d}
            />
          </circle>
        </g>
      ))}
    </svg>
  );
}

const SPARK_PATH = "M0 34 C 18 32, 30 24, 48 26 S 82 18, 100 20 S 142 10, 168 6";

/** Mini trend chart that draws itself on scroll, with a live packet looping the line. */
export function Sparkline({ className = "" }: { className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.5);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      <svg viewBox="0 0 168 40" preserveAspectRatio="none" className="h-10 w-full">
        <defs>
          <linearGradient id="tf-spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--data)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--data)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${SPARK_PATH} L168 40 L0 40 Z`}
          fill="url(#tf-spark-fill)"
          style={{ opacity: inView ? 1 : 0, transition: "opacity 1.2s ease 0.9s" }}
        />
        <path
          d={SPARK_PATH}
          fill="none"
          stroke="var(--data)"
          strokeWidth="1.6"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={inView ? 0 : 100}
          style={{ transition: "stroke-dashoffset 1.8s var(--ease-premium)" }}
        />
        {inView ? (
          <circle r="2.6" fill="var(--data)">
            <animateMotion dur="4.5s" repeatCount="indefinite" path={SPARK_PATH} />
          </circle>
        ) : null}
      </svg>
    </div>
  );
}
