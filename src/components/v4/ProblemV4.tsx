"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { Frame, SectionTag, h2v4 } from "./ui";

const STAGES = ["Founding", "Product fit", "Scale-up", "Multi-unit", "Enterprise"];

/** Illustrative growth of what a company has to hold together, by stage. */
const COUNTS = [
  { label: "Systems", from: 3, to: 46 },
  { label: "Reports", from: 8, to: 940 },
  { label: "Manual handoffs", from: 2, to: 210 },
  { label: "People in a decision", from: 2, to: 19 },
];

const revenue = (x: number) => 0.08 + 0.45 * x + 0.05 * x * x;
const complexity = (x: number) => 0.04 + (0.9 * (Math.exp(2.6 * x) - 1)) / (Math.exp(2.6) - 1);
const CROSS = (() => {
  for (let x = 0; x <= 1; x += 0.002) if (complexity(x) > revenue(x)) return x;
  return 1;
})();

const RUN_MS = 3200;

/** The problem as a monitor trace: it runs once when it enters the screen, then holds at enterprise scale. */
export function ProblemV4() {
  const root = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const counters = useRef<(HTMLSpanElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const compact = useMediaQuery("(max-width: 767px)");

  const W = compact ? 600 : 1000;
  const H = compact ? 520 : 440;
  const L = 24;
  const R = W - 24;
  const T = 30;
  const B = H - 60;
  const X = (x: number) => L + (R - L) * x;
  const Y = (v: number) => B - (B - T) * v;

  const curve = (f: (x: number) => number, upTo: number) => {
    let d = "";
    for (let i = 0; i <= 80; i++) {
      const x = (i / 80) * upTo;
      d += `${i ? "L" : "M"}${X(x).toFixed(1)},${Y(f(x)).toFixed(1)}`;
    }
    return d;
  };

  const render = (v: number) => {
    const el = svg.current;
    if (!el) return;
    const x = Math.max(0.001, Math.min(1, v));
    el.querySelector("[data-rev]")?.setAttribute("d", curve(revenue, x));
    el.querySelector("[data-cpx]")?.setAttribute("d", curve(complexity, x));
    let gap = "";
    if (x > CROSS) {
      const top: string[] = [];
      const bot: string[] = [];
      for (let i = 0; i <= 40; i++) {
        const xx = CROSS + ((x - CROSS) * i) / 40;
        top.push(`${X(xx).toFixed(1)},${Y(complexity(xx)).toFixed(1)}`);
        bot.unshift(`${X(xx).toFixed(1)},${Y(revenue(xx)).toFixed(1)}`);
      }
      gap = `M${top.join("L")}L${bot.join("L")}Z`;
    }
    el.querySelector("[data-gap]")?.setAttribute("d", gap);
    const gl = el.querySelector<SVGElement>("[data-gap-label]");
    if (gl) gl.style.opacity = String(Math.max(0, Math.min(1, (x - CROSS - 0.1) / 0.1)));
    el.querySelector("[data-cursor]")?.setAttribute("transform", `translate(${X(x).toFixed(1)} 0)`);
    el.querySelector("[data-dot-rev]")?.setAttribute("cy", Y(revenue(x)).toFixed(1));
    el.querySelector("[data-dot-cpx]")?.setAttribute("cy", Y(complexity(x)).toFixed(1));
    el.querySelectorAll<SVGTextElement>("[data-stage]").forEach((s, i) => {
      s.style.opacity = x + 0.02 >= i / (STAGES.length - 1) ? "1" : "0.3";
    });
    const eased = (Math.exp(2.2 * x) - 1) / (Math.exp(2.2) - 1);
    COUNTS.forEach((c, i) => {
      const n = counters.current[i];
      if (n) n.textContent = Math.round(c.from + (c.to - c.from) * eased).toLocaleString("en-US");
      const b = bars.current[i];
      if (b) b.style.transform = `scaleX(${(0.04 + 0.96 * eased).toFixed(3)})`;
    });
  };

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      render(1);
      return;
    }
    render(0);
    let raf = 0;
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / RUN_MS);
          render(1 - (1 - p) ** 2.2);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // Geometry depends on the breakpoint; rerun when it changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compact]);

  return (
    <section ref={root} className="relative py-24 sm:py-32" aria-labelledby="v4-problem-title">
      <div className="shell">
        <SectionTag n="01">The problem</SectionTag>
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 id="v4-problem-title" data-reveal="up" className={`${h2v4} max-w-[14ch] lg:col-span-7`}>
            Complexity Is the Cost of Growth
          </h2>
          <p data-reveal="up" data-delay="100" className="text-pretty max-w-[52ch] text-lg leading-relaxed text-white/60 lg:col-span-5">
            Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding
            everything together. Leadership loses visibility, execution slows down, and the business pays the price.
          </p>
        </div>

        <Frame className="mt-14 bg-void-2/80 lg:mt-20">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
            <span className="v4-label flex items-center gap-3 text-[0.6875rem] text-white/60">
              <span className="h-2 w-2 bg-[#ff6b7a]" aria-hidden="true" />
              complexity_monitor
              <span className="text-white/25">/ founding → enterprise</span>
            </span>
            <span className="flex items-center gap-5 text-[0.8125rem] text-white/70">
              <span className="flex items-center gap-2">
                <span className="h-[2px] w-6 bg-white" aria-hidden="true" />
                Revenue
              </span>
              <span className="flex items-center gap-2">
                <span className="h-[2px] w-6 bg-cyan" aria-hidden="true" />
                Operational complexity
              </span>
              <span className="v4-label text-[0.6875rem] text-white/30">Illustrative</span>
            </span>
          </div>

          <div className="grid lg:grid-cols-[1fr_20rem]">
            <div className="v4-dots p-3 sm:p-5">
              <svg
                ref={svg}
                viewBox={`0 0 ${W} ${H}`}
                className="h-auto w-full"
                role="img"
                aria-label="Illustrative chart: as a company grows from founding to enterprise, revenue rises steadily while operational complexity rises exponentially and overtakes it."
              >
                <defs>
                  <pattern id="v4-gap-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <path d="M0 0v7" stroke="#6ee7ff" strokeOpacity="0.35" strokeWidth="1.4" />
                  </pattern>
                  <filter id="v4-glow" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="4" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {[0.25, 0.5, 0.75, 1].map((g) => (
                  <line key={g} x1={L} x2={R} y1={Y(g)} y2={Y(g)} stroke="white" strokeOpacity="0.06" />
                ))}
                <line x1={L} x2={R} y1={B} y2={B} stroke="white" strokeOpacity="0.3" />
                {STAGES.map((s, i) => {
                  const x = X(i / (STAGES.length - 1));
                  const anchor = i === 0 ? "start" : i === STAGES.length - 1 ? "end" : "middle";
                  return (
                    <g key={s}>
                      <line x1={x} x2={x} y1={B} y2={B + 7} stroke="white" strokeOpacity="0.3" />
                      <text data-stage="" x={x} y={B + 32} textAnchor={anchor} className={`type-mono fill-white/70 uppercase ${compact ? "text-[17px]" : "text-[12px]"}`}>
                        {s}
                      </text>
                    </g>
                  );
                })}
                <path data-gap="" fill="url(#v4-gap-hatch)" />
                <path data-rev="" fill="none" stroke="white" strokeWidth="2" />
                <path data-cpx="" fill="none" stroke="#6ee7ff" strokeWidth="2.4" filter="url(#v4-glow)" />
                <text
                  data-gap-label=""
                  x={X(0.9) - 14}
                  y={Y((revenue(0.9) + complexity(0.9)) / 2) + 5}
                  textAnchor="end"
                  className={`type-mono fill-cyan uppercase ${compact ? "text-[17px]" : "text-[13px]"}`}
                  style={{ opacity: 0 }}
                >
                  The cost of complexity
                </text>
                <g data-cursor="">
                  <line x1={0} x2={0} y1={T - 10} y2={B} stroke="white" strokeOpacity="0.3" strokeDasharray="2 4" />
                  <circle data-dot-rev="" cx={0} cy={B} r="5" fill="#05060e" stroke="white" strokeWidth="2" />
                  <circle data-dot-cpx="" cx={0} cy={B} r="5" fill="#6ee7ff" />
                </g>
              </svg>
            </div>

            <dl className="grid grid-cols-2 border-t border-line lg:grid-cols-1 lg:border-l lg:border-t-0">
              {COUNTS.map((c, i) => (
                <div key={c.label} className="flex flex-col justify-center gap-2 border-line p-4 sm:p-5 [&:not(:last-child)]:border-b max-lg:odd:border-r">
                  <dt className="v4-label text-[0.6875rem] text-white/45">{c.label}</dt>
                  <dd>
                    <span
                      ref={(el) => {
                        counters.current[i] = el;
                      }}
                      className="type-mono block text-[1.75rem] leading-none text-white"
                    >
                      {c.from}
                    </span>
                    <span className="mt-3 block h-[3px] bg-white/[0.06]" aria-hidden="true">
                      <span
                        ref={(el) => {
                          bars.current[i] = el;
                        }}
                        className="block h-full origin-left bg-gradient-to-r from-signal to-cyan"
                        style={{ transform: "scaleX(0.04)" }}
                      />
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Frame>
      </div>
    </section>
  );
}
