"use client";

import { useEffect, useRef } from "react";

/**
 * The journey, dark to light, as a thin rail on the left edge (the right edge belongs to the
 * version dock). It blends by difference, so it reads on navy and on white alike, and names the
 * chapter under the middle of the screen.
 */
export function Rail() {
  const fill = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (fill.current) fill.current.style.transform = `scaleY(${p.toFixed(4)})`;
      const mid = window.innerHeight / 2;
      let name = "";
      for (const el of document.querySelectorAll<HTMLElement>("[data-v23-chapter]")) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) name = el.dataset.v23Chapter ?? name;
      }
      if (label.current && name && label.current.textContent !== name) label.current.textContent = name;
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
  }, []);
  return (
    <div className="v23-rail" aria-hidden="true">
      <span className="v23-rail-end">Dark</span>
      <span className="v23-rail-track">
        <span ref={fill} className="v23-rail-fill" />
      </span>
      <span className="v23-rail-end">Light</span>
      <span ref={label} className="v23-rail-label">
        Complexity
      </span>
    </div>
  );
}
