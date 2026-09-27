"use client";

import { useEffect } from "react";

/**
 * Arms scroll reveals for Version 20. Content is visible by default: hidden states only apply
 * once this runs and adds `v20-armed` to the page root. If the tab is hidden (where
 * IntersectionObserver and animation frames pause) or nothing has been observed shortly after
 * arming, everything is shown so no content can stay invisible.
 */
export function RevealController() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".v20");
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.hidden) return;

    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-v20-r]"));
    const show = (el: Element) => el.setAttribute("data-in", "");
    const showAll = () => els.forEach(show);

    // Anything already on screen or above it is shown before the hidden state ever applies.
    const H = window.innerHeight;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < H * 0.95) show(el);
    });
    root.classList.add("v20-armed");

    let observed = false;
    const io = new IntersectionObserver(
      (entries) => {
        observed = true;
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => {
      if (!el.hasAttribute("data-in")) io.observe(el);
    });

    const onHidden = () => {
      if (document.hidden) showAll();
    };
    document.addEventListener("visibilitychange", onHidden);
    // Safety net: if the observer never reported, reveal everything.
    const safety = window.setTimeout(() => {
      if (!observed || document.hidden) showAll();
    }, 2500);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onHidden);
      window.clearTimeout(safety);
    };
  }, []);
  return null;
}
