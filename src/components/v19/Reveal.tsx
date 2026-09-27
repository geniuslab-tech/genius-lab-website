"use client";

import { useEffect } from "react";

/**
 * Staggered reveals for every `.v19-rv` element.
 * Hidden start states only apply once this controller arms the root (`data-rv`), so without
 * JS, or before hydration, everything is visible. A sweep also shows anything on screen or
 * already passed, in case an observer event is missed (background tabs, fast scrolling).
 */
export function RevealV19() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".v19");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>(".v19-rv"));
    const show = (el: HTMLElement) => {
      el.dataset.in = "";
    };
    // Anything already on screen at arm time shows immediately, without a flash.
    const vh = window.innerHeight;
    for (const el of els) if (el.getBoundingClientRect().top < vh * 0.92) show(el);
    root.dataset.rv = "";

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting && e.boundingClientRect.top > 0) continue;
          show(e.target as HTMLElement);
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );
    for (const el of els) if (!("in" in el.dataset)) io.observe(el);

    const sweep = () => {
      const h = window.innerHeight;
      for (const el of els) if (!("in" in el.dataset) && el.getBoundingClientRect().top < h) show(el);
    };
    const timer = window.setInterval(sweep, 900);
    document.addEventListener("visibilitychange", sweep);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", sweep);
      delete root.dataset.rv;
    };
  }, []);
  return null;
}
