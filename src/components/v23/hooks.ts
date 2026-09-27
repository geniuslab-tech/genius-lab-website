"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";
import { clamp01 } from "./math";

/**
 * Scroll-driven scenes run only when motion is allowed and the viewport is tall enough to pin a
 * stage. The same query gates the CSS in v23.css, so markup and styles always agree.
 */
export const LIVE_QUERY = "(prefers-reduced-motion: no-preference) and (min-height: 560px)";
export const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

const subs = new Map<string, (notify: () => void) => () => void>();
function subscribe(query: string) {
  let fn = subs.get(query);
  if (!fn) {
    fn = (notify: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    };
    subs.set(query, fn);
  }
  return fn;
}

/** A media query. False on the server and during hydration, so markup always matches. */
export function useMedia(query: string) {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useReduced = () => useMedia(REDUCE_QUERY);

/** Whether an element is near the viewport. Used to pause loops and timers. */
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
 * Reports how far a tall pinned track has been scrolled: 0 when its top meets the viewport top,
 * 1 when its bottom meets the viewport bottom. At most once per frame.
 */
export function usePinProgress(ref: RefObject<HTMLElement | null>, onProgress: (p: number) => void, enabled: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      onProgress(span > 0 ? clamp01(-r.top / span) : 0);
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
  }, [ref, onProgress, enabled]);
}

export { clamp01, easeOut, hexToRgb, lerp, mixHex, mulberry32, round, smooth } from "./math";
