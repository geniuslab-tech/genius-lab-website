"use client";

import { useEffect } from "react";

/** Marks [data-r] elements inside .v14 as they enter the viewport, once. */
export function Reveal14() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".v14 [data-r]"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.setAttribute("data-in", ""));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    // Groups wait until their top edge is well inside the viewport, then play as one sequence.
    const late = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "");
            late.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -40% 0px", threshold: 0 },
    );
    els.forEach((el) => (el.dataset.r === "group" ? late : io).observe(el));
    return () => {
      io.disconnect();
      late.disconnect();
    };
  }, []);
  return null;
}
