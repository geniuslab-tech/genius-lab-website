"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useMediaQuery } from "@/lib/useMediaQuery";

const STAGES = ["Founding", "Product fit", "Scale-up", "Multi-unit", "Enterprise"];

/** Illustrative growth of what a company has to hold together, by stage. */
const COUNTS = [
  { label: "Systems", from: 3, to: 46 },
  { label: "Reports", from: 8, to: 940 },
  { label: "Manual handoffs", from: 2, to: 210 },
  { label: "People in a decision", from: 2, to: 19 },
];

// Both curves are functions of company age (0..1): revenue compounds gently,
// complexity compounds faster and overtakes it.
const revenue = (x: number) => 0.08 + 0.45 * x + 0.05 * x * x;
const complexity = (x: number) => 0.04 + (0.9 * (Math.exp(2.6 * x) - 1)) / (Math.exp(2.6) - 1);
// Where complexity first exceeds revenue.
const CROSS = (() => {
  for (let x = 0; x <= 1; x += 0.002) if (complexity(x) > revenue(x)) return x;
  return 1;
})();

export function ProblemV2() {
  const track = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const counters = useRef<(HTMLSpanElement | null)[]>([]);
  const reduce = useReducedMotion();
  const compact = useMediaQuery("(max-width: 767px)");
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });

  const W = compact ? 600 : 1200;
  const H = compact ? 560 : 520;
  const L = compact ? 24 : 40;
  const R = W - (compact ? 24 : 40);
  const T = 40;
  const B = H - 70;
  const X = (x: number) => L + (R - L) * x;
  const Y = (v: number) => B - (B - T) * v;

  const curve = (f: (x: number) => number, upTo: number) => {
    let d = "";
    const n = 80;
    for (let i = 0; i <= n; i++) {
      const x = (i / n) * upTo;
      d += `${i ? "L" : "M"}${X(x).toFixed(1)},${Y(f(x)).toFixed(1)}`;
    }
    return d;
  };

  const render = (v: number) => {
    const root = svg.current;
    if (!root) return;
    const x = Math.max(0.18, Math.min(1, 0.18 + v * 0.9));
    root.querySelector("[data-rev]")?.setAttribute("d", curve(revenue, x));
    root.querySelector("[data-cpx]")?.setAttribute("d", curve(complexity, x));
    // The gap where complexity outgrows revenue.
    const cross = CROSS;
    let gap = "";
    if (x > cross) {
      const n = 40;
      const top: string[] = [];
      const bot: string[] = [];
      for (let i = 0; i <= n; i++) {
        const xx = cross + ((x - cross) * i) / n;
        top.push(`${X(xx).toFixed(1)},${Y(complexity(xx)).toFixed(1)}`);
        bot.unshift(`${X(xx).toFixed(1)},${Y(revenue(xx)).toFixed(1)}`);
      }
      gap = `M${top.join("L")}L${bot.join("L")}Z`;
    }
    root.querySelector("[data-gap]")?.setAttribute("d", gap);
    const gl = root.querySelector<SVGElement>("[data-gap-label]");
    if (gl) gl.style.opacity = String(Math.max(0, Math.min(1, (x - CROSS - 0.1) / 0.1)));
    const cx = X(x);
    root.querySelector("[data-cursor]")?.setAttribute("transform", `translate(${cx.toFixed(1)} 0)`);
    root.querySelector("[data-dot-rev]")?.setAttribute("cy", Y(revenue(x)).toFixed(1));
    root.querySelector("[data-dot-cpx]")?.setAttribute("cy", Y(complexity(x)).toFixed(1));
    root.querySelectorAll<SVGTextElement>("[data-stage]").forEach((el, i) => {
      const at = i / (STAGES.length - 1);
      el.style.opacity = x + 0.02 >= at ? "1" : "0.35";
    });
    const eased = (Math.exp(2.2 * x) - 1) / (Math.exp(2.2) - 1);
    COUNTS.forEach((c, i) => {
      const el = counters.current[i];
      if (el) el.textContent = Math.round(c.from + (c.to - c.from) * eased).toLocaleString("en-US");
    });
  };

  useMotionValueEvent(p, "change", (v) => render(reduce ? 1 : v));
  useEffect(() => render(reduce ? 1 : p.get()));

  return (
    <section className="relative pt-16 sm:pt-24 lg:pt-28" aria-label="Complexity Is the Cost of Growth">
      {/* On phones the supporting copy reads before the pinned chart. */}
      <div className="shell lg:hidden">
        <h2
          id="v2-problem-title"
          className="type-display max-w-[14ch] text-[clamp(2.25rem,8vw,3rem)] leading-[1] text-navy [font-variation-settings:'wdth'_112]"
        >
          Complexity Is the Cost of Growth
        </h2>
        <p className="text-pretty mt-6 max-w-[58ch] text-lg leading-relaxed text-navy/70">
          Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding
          everything together. Leadership loses visibility, execution slows down, and the business pays the price.
        </p>
      </div>

      <div ref={track} className="relative h-[200vh]">
        <div className="shell sticky top-[var(--nav-h)] grid h-[calc(100dvh-var(--nav-h))] content-center gap-6 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* The headline stays with the chart for the whole pinned sequence. */}
          <div className="lg:col-span-4">
            <h2 className="type-display hidden max-w-[12ch] text-[clamp(2.5rem,3.6vw,3.75rem)] leading-[1] text-navy [font-variation-settings:'wdth'_112] lg:block">
              Complexity Is the Cost of Growth
            </h2>
            <p className="text-pretty mt-6 hidden text-lg leading-relaxed text-navy/70 lg:block">
              Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding
          everything together. Leadership loses visibility, execution slows down, and the business pays the price.
            </p>
            <dl className="mt-0 grid grid-cols-2 gap-x-6 gap-y-4 max-lg:order-last lg:mt-10">
              {COUNTS.map((c, i) => (
                <div key={c.label}>
                  <dt className="text-[0.8125rem] text-navy/60">{c.label}</dt>
                  <dd>
                    <span
                      ref={(el) => {
                        counters.current[i] = el;
                      }}
                      className="type-mono block text-2xl text-navy"
                    >
                      {c.from}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-8">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[0.9375rem] text-navy">
            <span className="flex items-center gap-3">
              <span className="h-[2px] w-7 bg-navy" aria-hidden="true" />
              Revenue
            </span>
            <span className="flex items-center gap-3">
              <span className="h-[2px] w-7 bg-signal-ink" aria-hidden="true" />
              Operational complexity
            </span>
            <span className="type-mono ml-auto text-[0.75rem] text-navy/50">Illustrative</span>
          </div>

          <svg
            ref={svg}
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto max-h-[46dvh] w-full lg:max-h-[68dvh]"
            role="img"
            aria-label="Illustrative chart: as a company grows from founding to enterprise, revenue rises steadily while operational complexity rises exponentially and overtakes it."
          >
            <defs>
              <pattern id="gap-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <path d="M0 0v8" stroke="var(--color-signal-ink)" strokeOpacity="0.35" strokeWidth="1.5" />
              </pattern>
            </defs>
            {[0.25, 0.5, 0.75, 1].map((g) => (
              <line key={g} x1={L} x2={R} y1={Y(g)} y2={Y(g)} stroke="var(--color-navy)" strokeOpacity="0.07" />
            ))}
            <line x1={L} x2={R} y1={B} y2={B} stroke="var(--color-navy)" strokeOpacity="0.35" />
            {STAGES.map((s, i) => {
              const x = X(i / (STAGES.length - 1));
              const anchor = i === 0 ? "start" : i === STAGES.length - 1 ? "end" : "middle";
              return (
                <g key={s}>
                  <line x1={x} x2={x} y1={B} y2={B + 8} stroke="var(--color-navy)" strokeOpacity="0.35" />
                  <text data-stage="" x={x} y={B + 34} textAnchor={anchor} className={`fill-navy ${compact ? "text-[19px]" : "text-[15px]"} font-medium`}>
                    {s}
                  </text>
                </g>
              );
            })}
            <path data-gap="" fill="url(#gap-hatch)" />
            <path data-rev="" fill="none" stroke="var(--color-navy)" strokeWidth="2.5" />
            <path data-cpx="" fill="none" stroke="var(--color-signal-ink)" strokeWidth="2.5" />
            <text
              data-gap-label=""
              x={X(0.9) - 14}
              y={Y((revenue(0.9) + complexity(0.9)) / 2) + 6}
              textAnchor="end"
              className={`fill-signal-ink ${compact ? "text-[19px]" : "text-[15px]"} font-semibold`}
              style={{ opacity: 0 }}
            >
              The cost of complexity
            </text>
            <g data-cursor="">
              <line x1={0} x2={0} y1={T - 10} y2={B} stroke="var(--color-navy)" strokeOpacity="0.25" strokeDasharray="3 5" />
              <circle data-dot-rev="" cx={0} cy={B} r="6" fill="var(--color-paper)" stroke="var(--color-navy)" strokeWidth="2.5" />
              <circle data-dot-cpx="" cx={0} cy={B} r="6" fill="var(--color-signal-ink)" />
            </g>
          </svg>

          </div>
        </div>
      </div>
    </section>
  );
}
