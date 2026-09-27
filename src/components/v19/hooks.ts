"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (notify: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", notify);
  return () => mq.removeEventListener("change", notify);
};

/** Reduced-motion preference. False on the server and during hydration, so markup always matches. */
export function useReduced() {
  return useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE).matches,
    () => false,
  );
}

/** Whether an element is on screen. Used to pause timers and loops offscreen. */
export function useInView(ref: RefObject<Element | null>, margin = "0px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return inView;
}

/**
 * Reports scroll progress through a section, at most once per frame.
 * "pinned": 0 when its top meets the viewport top, 1 when its bottom meets the viewport bottom.
 * "through": 0 when its top enters from below, 1 when its bottom leaves at the top.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
  enabled = true,
  mode: "pinned" | "through" = "pinned",
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let p: number;
      if (mode === "through") p = clamp01((vh - r.top) / (vh + r.height));
      else {
        const span = r.height - vh;
        p = span > 0 ? clamp01(-r.top / span) : 0;
      }
      onProgress(p);
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, onProgress, enabled, mode]);
}

/** Deterministic PRNG, so generated geometry is identical on server and client. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const r1 = (v: number) => Math.round(v * 10) / 10;
/** Smoothstep from a to b. */
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
