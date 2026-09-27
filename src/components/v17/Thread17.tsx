"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { smoothPath, type Pt } from "./geo";
import { useReduced } from "./ui";

/**
 * One continuous pen line that runs the length of the page, threading through the
 * knot beside every section label. It draws itself as the reader scrolls and sits
 * behind the panels, so it seems to pass under them.
 */
export function Thread17() {
  const ref = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<{ w: number; h: number; d: string } | null>(null);
  const reduce = useReduced();
  const { scrollYProgress } = useScroll();
  const draw = useSpring(scrollYProgress, { stiffness: 70, damping: 22, restDelta: 0.0005 });

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;

    const measure = () => {
      const box = host.getBoundingClientRect();
      const w = Math.round(box.width);
      const h = Math.round(host.scrollHeight);
      if (w < 10 || h < 10) return;
      const knots: Pt[] = Array.from(host.querySelectorAll<HTMLElement>("[data-thread]"))
        .map((a) => a.getBoundingClientRect())
        .filter((b) => b.width > 0)
        .map((b) => [b.left + b.width / 2 - box.left, b.top + b.height / 2 - box.top] as Pt)
        .sort((a, b) => a[1] - b[1]);
      if (knots.length < 2) return;

      const narrow = w < 640;
      const pts: Pt[] = [[knots[0][0] - 40, -20]];
      knots.forEach((k, i) => {
        pts.push(k);
        const next = knots[i + 1];
        if (!next) return;
        const gap = next[1] - k[1];
        if (gap < 260) return;
        // Swing out to alternate sides between sections, like a loose stitch.
        const right = i % 2 === 0;
        const x = right ? w * (narrow ? 0.96 : 0.93) : w * (narrow ? 0.03 : 0.05);
        pts.push([x, k[1] + gap * 0.3]);
        pts.push([right ? w * 0.82 : w * 0.16, k[1] + gap * 0.72]);
      });
      const last = knots[knots.length - 1];
      pts.push([last[0] + w * 0.2, last[1] + 160]);
      setGeo({ w, h, d: smoothPath(pts) });
    };

    const ro = new ResizeObserver(() => measure());
    ro.observe(host);
    let alive = true;
    document.fonts?.ready.then(() => alive && measure());
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {geo && (
        <svg width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} className="absolute left-0 top-0" fill="none">
          <path d={geo.d} stroke="var(--rule)" strokeWidth={1.5} strokeDasharray="2 7" strokeLinecap="round" />
          <motion.path
            d={geo.d}
            stroke="var(--terra)"
            strokeWidth={2}
            strokeLinecap="round"
            style={{ pathLength: reduce ? 1 : draw }}
          />
        </svg>
      )}
    </div>
  );
}
