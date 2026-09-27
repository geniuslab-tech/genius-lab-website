"use client";

import { useEffect } from "react";

/** Marks every [data-boot] element inside .v11 as booted when it scrolls into view. */
export function BootController() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".v11 [data-boot]:not(.is-on)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-on"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-on");
          io.unobserve(e.target);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
