"use client";

import { useEffect, useRef, useState } from "react";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/**
 * A figure that counts up once, when it first scrolls into view.
 * The server renders the final value, so readers without JS or with reduced
 * motion always see the true number.
 */
export function CountUp({ to, duration = 1400, className }: { to: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9) return; // already on screen: leave the final value
    let raf = 0;
    const reset = requestAnimationFrame(() => setValue(0));
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          setValue(to * eased);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(reset);
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{fmt(value)}</span>
      <span className="sr-only">{fmt(to)}</span>
    </span>
  );
}
