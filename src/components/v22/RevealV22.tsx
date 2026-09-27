"use client";

import { useEffect } from "react";

/**
 * Arms the page's scroll reveals. Content is complete without it: hidden states only apply
 * once `data-armed` is set on the .v22 root, and every fallback path marks elements in.
 * - Hidden tab at mount: never arms.
 * - Observer silent for 4s (paused tab, headless capture): shows everything.
 * - A 1s sweep shows anything already on or above the screen.
 */
export function RevealV22() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".v22");
    if (!root || document.visibilityState === "hidden") return;
    if (!("IntersectionObserver" in window)) return;

    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-v22r]"));
    const show = (el: HTMLElement) => {
      el.dataset.in = "1";
    };
    const showAll = () => els.forEach(show);

    // Clipped elements have no visible box, so watch their parent instead.
    const byTarget = new Map<Element, HTMLElement[]>();
    for (const el of els) {
      const t = el.dataset.v22r === "up" ? el : (el.parentElement ?? el);
      byTarget.set(t, [...(byTarget.get(t) ?? []), el]);
    }

    let heard = false;
    const io = new IntersectionObserver(
      (entries) => {
        heard = true;
        for (const e of entries) {
          if (!e.isIntersecting && e.boundingClientRect.top > 0) continue;
          byTarget.get(e.target)?.forEach(show);
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    // Anything already on screen at hydration stays put rather than flashing out and back.
    const vh0 = window.innerHeight;
    for (const el of els) if (el.getBoundingClientRect().top < vh0 * 0.85) show(el);
    root.dataset.armed = "";
    byTarget.forEach((_, t) => io.observe(t));

    const sweep = window.setInterval(() => {
      const vh = window.innerHeight;
      for (const el of els) {
        if (el.dataset.in) continue;
        const box = (el.dataset.v22r === "up" ? el : (el.parentElement ?? el)).getBoundingClientRect();
        if (box.top < vh * 0.94) show(el);
      }
    }, 1000);
    const safety = window.setTimeout(() => {
      if (!heard) showAll();
    }, 4000);
    const onHide = () => {
      if (document.visibilityState === "hidden") showAll();
    };
    document.addEventListener("visibilitychange", onHide);

    return () => {
      io.disconnect();
      window.clearInterval(sweep);
      window.clearTimeout(safety);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);
  return null;
}
