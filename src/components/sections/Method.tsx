"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

const STEPS = [
  { name: "Discover", out: "Data audit", body: "Text text text. Sources, owners, quality and the questions that matter most." },
  { name: "Architect", out: "Blueprint", body: "Text text text. A target platform sized to the business, not to a vendor." },
  { name: "Build", out: "Pipelines and models", body: "Text text text. Delivered in increments, each one in production." },
  { name: "Operate", out: "Run and improve", body: "Text text text. Monitored, documented and handed over with confidence." },
];

const W = 1200;
const H = 260;
// Elevation profile: a climb with plateaus at each waypoint.
const WAY = [150, 450, 750, 1050].map((x, i) => ({ x, y: 212 - i * 52 }));
const PROFILE = (() => {
  let d = `M0,236 C60,236 90,${WAY[0].y + 8} ${WAY[0].x - 30},${WAY[0].y}`;
  WAY.forEach((p, i) => {
    d += ` L${p.x + 40},${p.y}`;
    const n = WAY[i + 1];
    if (n) {
      const mx = (p.x + n.x) / 2;
      d += ` C${mx},${p.y} ${mx - 20},${n.y + 18} ${mx + 40},${n.y + 6}`;
      d += ` S${n.x - 60},${n.y} ${n.x - 30},${n.y}`;
    }
  });
  d += ` C1130,${WAY[3].y} 1160,${WAY[3].y - 26} 1200,${WAY[3].y - 40}`;
  return d;
})();

export function Method() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });
  const length = useTransform(smooth, [0, 1], [0.02, 1]);
  const scaleY = useTransform(smooth, [0, 1], [0, 1]);

  return (
    <section id="method" className="scroll-mt-16 py-28 sm:py-36 lg:py-44" aria-labelledby="method-title">
      <div className="shell">
        <h2 id="method-title" data-reveal="up" className="type-display max-w-[18ch] text-[clamp(2.25rem,4.6vw,4.25rem)]">
          From first query to production.
        </h2>

        <div ref={ref} className="mt-16 lg:mt-24">
          {/* Desktop: one elevation profile the engagement climbs along. */}
          <div className="hidden md:block">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} x1="0" x2={W} y1={40 + i * 52} y2={40 + i * 52} stroke="var(--color-rule)" />
              ))}
              <path d={`${PROFILE} L1200,${H} L0,${H} Z`} fill="var(--color-paper-2)" />
              <path d={PROFILE} fill="none" stroke="var(--color-rule-strong)" strokeWidth="1.5" />
              <motion.path
                d={PROFILE}
                fill="none"
                stroke="var(--color-survey)"
                strokeWidth="2.5"
                style={{ pathLength: reduce ? 1 : length }}
              />
              {WAY.map((p) => (
                <g key={p.x}>
                  <line x1={p.x} x2={p.x} y1={p.y} y2={H} stroke="var(--color-ink)" strokeDasharray="2 4" />
                  <rect x={p.x - 6} y={p.y - 6} width="12" height="12" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1.5" />
                </g>
              ))}
            </svg>
            <ol className="mt-10 grid grid-cols-4 gap-8">
              {STEPS.map((s, i) => (
                <li key={s.name} data-reveal="up" data-delay={i * 90}>
                  <h3 className="type-wide text-2xl font-medium">{s.name}</h3>
                  <p className="mt-3 max-w-[30ch] leading-relaxed text-ink-2"><span className="text-ink">{s.out}.</span> {s.body}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Mobile: the profile turns vertical and draws down the page. */}
          <div className="relative md:hidden">
            <div className="absolute bottom-2 left-[5px] top-2 w-px bg-rule-strong" aria-hidden="true" />
            <motion.div
              className="absolute bottom-2 left-[4px] top-2 w-[3px] origin-top bg-survey"
              style={{ scaleY: reduce ? 1 : scaleY }}
              aria-hidden="true"
            />
            <ol className="flex flex-col gap-12">
              {STEPS.map((s) => (
                <li key={s.name} className="relative pl-10">
                  <span className="absolute left-0 top-2 h-3 w-3 border-[1.5px] border-ink bg-paper" aria-hidden="true" />
                  <h3 className="type-wide text-2xl font-medium">{s.name}</h3>
                  <p className="mt-3 leading-relaxed text-ink-2"><span className="text-ink">{s.out}.</span> {s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
