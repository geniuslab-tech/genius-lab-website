"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { axialToPixel, hexPoints, hexRing } from "@/lib/hex";
import { Illustrative, Kicker, h2Class, r1 } from "./ui";

const SYSTEMS = ["ERP", "CRM", "Finance", "HR", "Warehouse", "Sheets", "BI", "Billing", "Inventory", "Support", "Email", "Cloud"];
const HUB = { x: 280, y: 228 };
const L = 40;

const TANGLED = [
  [92, 80], [250, 50], [462, 92], [520, 236], [440, 396], [318, 312],
  [128, 398], [46, 256], [176, 176], [384, 188], [236, 402], [512, 340],
];
const ORDERED = hexRing(2).map(([q, r]) => {
  const p = axialToPixel(q, r, L);
  return [r1(HUB.x + p.x), r1(HUB.y + p.y)];
});
const RING1 = hexRing(1).map(([q, r]) => {
  const p = axialToPixel(q, r, L);
  return [r1(HUB.x + p.x), r1(HUB.y + p.y)];
});

const PAIRS = [
  [0, 5], [0, 9], [1, 6], [1, 11], [2, 7], [2, 4], [3, 8], [3, 10], [4, 8],
  [5, 11], [6, 9], [7, 10], [8, 2], [9, 1], [10, 0], [11, 7], [6, 3], [4, 1],
];

/** Illustrative growth of what a company has to hold together, founding to enterprise. */
const COUNTS = [
  { label: "Systems", from: 3, to: 46 },
  { label: "Reports", from: 8, to: 940 },
  { label: "Manual handoffs", from: 2, to: 210 },
  { label: "People in a decision", from: 2, to: 19 },
];

const EASE = [0.77, 0, 0.175, 1] as const;

function Network({ ordered, reduce }: { ordered: boolean; reduce: boolean }) {
  const pos = ordered ? ORDERED : TANGLED;
  const t = (i: number) => (reduce ? { duration: 0 } : { duration: 1.1, ease: EASE, delay: i * 0.03 });
  return (
    <svg viewBox="0 0 560 456" className="h-auto w-full" aria-hidden="true">
      {RING1.map(([x, y], i) => (
        <motion.polygon
          key={i}
          points={hexPoints(x, y, L - 4)}
          fill="#e8ecff"
          stroke="#5577ff"
          strokeOpacity="0.35"
          initial={false}
          animate={{ opacity: ordered ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.6, delay: ordered ? 0.6 + i * 0.07 : 0 }}
        />
      ))}

      {PAIRS.map(([a, b], i) => {
        const [x1, y1] = pos[a];
        const [x2, y2] = ordered ? [HUB.x, HUB.y] : pos[b];
        return (
          <motion.line
            key={i}
            initial={false}
            animate={{ x1, y1, x2, y2, stroke: ordered ? "#5577ff" : "#a8b0c6" }}
            transition={t(i)}
            strokeWidth={ordered ? 1.5 : 1}
            strokeDasharray={ordered ? undefined : "3 4"}
          />
        );
      })}

      <motion.g initial={false} animate={{ scale: ordered ? 1 : 0.7, opacity: ordered ? 1 : 0.35 }} transition={t(0)}>
        <polygon points={hexPoints(HUB.x, HUB.y, L - 2)} fill="#101440" />
        <text x={HUB.x} y={HUB.y - 2} textAnchor="middle" fill="#fff" fontSize="10.5" fontWeight="600" className="v22-wide">
          GENIUS
        </text>
        <text x={HUB.x} y={HUB.y + 11} textAnchor="middle" fill="#9aaeff" fontSize="8" letterSpacing="1" className="v22-mono">
          LAYER
        </text>
      </motion.g>

      {SYSTEMS.map((s, i) => (
        <motion.g key={s} initial={false} animate={{ x: pos[i][0], y: pos[i][1] }} transition={t(i)}>
          <polygon points={hexPoints(0, 0, 29)} fill="#fff" stroke={ordered ? "#5577ff" : "#c3c9d9"} strokeWidth="1.25" style={{ transition: "stroke 600ms" }} />
          <text y="3.5" textAnchor="middle" fontSize={s.length > 7 ? 8.5 : 10} fill="#101440" className="v22-mono">
            {s}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

export function ProblemV22() {
  const reduce = !!useReducedMotion();
  const [ordered, setOrdered] = useState(false);
  const [touched, setTouched] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el || touched || reduce) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          t = setTimeout(() => setOrdered(true), 1400);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (t) clearTimeout(t);
    };
  }, [touched, reduce]);

  const pick = (v: boolean) => {
    setTouched(true);
    setOrdered(v);
  };

  return (
    <section id="problem" className="bg-white pb-24 pt-20 sm:pb-32 sm:pt-28" aria-labelledby="v22-problem-title">
      <div className="v22-shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5 lg:pt-6">
            <Kicker n="01">The problem</Kicker>
            <h2 id="v22-problem-title" data-v22r="up" className={`${h2Class} mt-6 max-w-[13ch]`}>
              Complexity Is the Cost of Growth
            </h2>
            <p data-v22r="up" style={{ "--rd": "100ms" } as CSSProperties} className="text-pretty mt-7 max-w-[48ch] text-[1.0625rem] leading-[1.75] text-[var(--ink-2)]">
              Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding
              everything together. Leadership loses visibility, execution slows down, and the business pays the price.
            </p>
            <p data-v22r="up" style={{ "--rd": "180ms" } as CSSProperties} className="mt-10 max-w-[40ch] border-l-2 border-[var(--signal)] pl-5 text-[1.0625rem] leading-[1.6] text-[var(--ink)]">
              When the business becomes fragmented, replacing systems can feel like the natural next step.
            </p>
          </div>

          <div ref={box} className="lg:col-span-7">
            <div data-v22r="wipe" className="chb [--c:28px]">
              <div className="chi bg-[var(--paper)] p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex" role="group" aria-label="Show the business">
                    {[
                      { v: false, label: "Fragmented" },
                      { v: true, label: "Connected" },
                    ].map((o) => (
                      <button
                        key={o.label}
                        type="button"
                        aria-pressed={ordered === o.v}
                        onClick={() => pick(o.v)}
                        className={`ch h-9 px-4 text-[0.8125rem] font-semibold transition-colors duration-300 [--c:8px] ${
                          ordered === o.v ? "bg-[var(--navy)] text-white" : "bg-white text-[var(--ink-2)] hover:text-[var(--navy)]"
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                  <Illustrative />
                </div>
                <Network ordered={ordered} reduce={reduce} />
                <p className="v22-mono border-t border-[var(--rule-2)] pt-3 text-[0.75rem] text-[var(--ink-2)]" aria-live="polite">
                  {ordered ? "12 systems · one connected layer · one set of definitions" : "12 systems · 18 point-to-point handoffs · people in between"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-10 border-t border-[var(--rule)] pt-12 sm:mt-24 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h3 data-v22r="up" className="v22-display flex items-center gap-4 text-[clamp(1.75rem,3vw,2.6rem)]">
              <ArrowRight size={28} weight="bold" className="shrink-0 text-[var(--signal-ink)]" aria-hidden="true" />
              Solve the Right Problem
            </h3>
          </div>
          <p data-v22r="up" className="text-pretty max-w-[58ch] text-[1.0625rem] leading-[1.75] text-[var(--ink-2)] lg:col-span-7">
            Sometimes replacement is necessary. But often, the problem can be solved without the cost, operational load,
            and disruption risk of a system transition. Building on what already works reduces complexity, expands
            capabilities, and unlocks more value from your systems and people.
          </p>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {COUNTS.map((c, i) => (
            <div key={c.label} data-v22r="wipe" style={{ "--rd": `${i * 90}ms` } as CSSProperties} className="ch flex flex-col bg-[var(--paper)] px-4 py-6 [--c:16px] sm:px-6">
              <dt className="v22-label order-2 mt-3 text-[var(--ink-3)]">{c.label}</dt>
              <dd className="order-1 flex items-baseline gap-2.5">
                <span className="v22-mono text-[0.875rem] text-[var(--ink-3)]">{c.from}</span>
                <span className="text-[var(--ink-3)]" aria-hidden="true">→</span>
                <span className="v22-num text-[clamp(1.6rem,3vw,2.4rem)] text-[var(--navy)]">{c.to.toLocaleString("en-US")}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4">
          <Illustrative>Founding to enterprise · illustrative</Illustrative>
        </p>
      </div>
    </section>
  );
}
