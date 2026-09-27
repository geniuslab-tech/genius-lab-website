"use client";

import { useEffect } from "react";

/**
 * Arms every [data-lx] element inside .v15 with one IntersectionObserver.
 * Curtains start fully clipped, so they are observed through their parent.
 * A periodic sweep picks up nodes mounted later (client-only ornaments, the
 * gallery switching modes) and anything the observer missed.
 */
export function RevealV15() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".v15");
    if (!root) return;
    const byTarget = new Map<Element, HTMLElement[]>();
    const known = new WeakSet<HTMLElement>();

    const show = (el: HTMLElement) => el.setAttribute("data-in", "");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting && entry.boundingClientRect.top > 0) continue;
          for (const el of byTarget.get(entry.target) ?? []) show(el);
          byTarget.delete(entry.target);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    const arm = () => {
      for (const el of Array.from(root.querySelectorAll<HTMLElement>("[data-lx]:not([data-in])"))) {
        if (known.has(el)) continue;
        known.add(el);
        const target = el.dataset.lx === "curtain" ? (el.parentElement ?? el) : el;
        byTarget.set(target, [...(byTarget.get(target) ?? []), el]);
        io.observe(target);
      }
    };
    arm();

    const sweep = window.setInterval(() => {
      arm();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      byTarget.forEach((els, target) => {
        const b = target.getBoundingClientRect();
        const onScreen = b.top < vh && b.bottom > 0 && b.left < vw && b.right > 0;
        if (onScreen || b.bottom < 0) {
          for (const el of els) show(el);
          byTarget.delete(target);
          io.unobserve(target);
        }
      });
    }, 1400);

    return () => {
      io.disconnect();
      window.clearInterval(sweep);
    };
  }, []);
  return null;
}
