"use client";

import { useEffect } from "react";

/**
 * Arms every [data-reveal] element on the page with one shared IntersectionObserver.
 * Elements are visible without JS; the `.js` class gates the hidden start state.
 * Clip-path reveals start fully clipped, which IntersectionObserver treats as invisible,
 * so those are observed through their parent.
 */
export function RevealController() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const byTarget = new Map<Element, HTMLElement[]>();
    for (const el of els) {
      const target = el.dataset.reveal === "up" ? el : (el.parentElement ?? el);
      byTarget.set(target, [...(byTarget.get(target) ?? []), el]);
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting && entry.boundingClientRect.top > 0) continue;
          for (const el of byTarget.get(entry.target) ?? []) {
            el.style.transitionDelay = `${Number(el.dataset.delay ?? 0)}ms`;
            el.dataset.shown = "true";
          }
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );
    byTarget.forEach((_, target) => io.observe(target));
    // Safety net: anything on screen or already passed is shown, even if an observer event was missed.
    const sweep = window.setInterval(() => {
      for (const el of els) if (!el.dataset.shown && el.getBoundingClientRect().top < window.innerHeight) el.dataset.shown = "true";
    }, 1200);
    return () => {
      io.disconnect();
      window.clearInterval(sweep);
    };
  }, []);
  return null;
}
