"use client";

import { useEffect, useRef, useState } from "react";
import { easeOut, useInView, useReduced } from "./hooks";
import { Kicker, rd } from "./ui";

/** Placeholder client marks, to be replaced with approved logos. */
const LOGOS = ["Vanta Group", "Helios", "Caldera", "Orbis", "Stratum", "Northpeak"];

/** Illustrative growth of what a company has to hold together, founding to enterprise. */
const COUNTS = [
  { label: "Systems", from: 3, to: 46 },
  { label: "Reports", from: 8, to: 940 },
  { label: "Manual handoffs", from: 2, to: 210 },
  { label: "People in a decision", from: 2, to: 19 },
];

const COMPARE = [
  { k: "Replace the systems", v: ["Transition cost", "Operational load", "Disruption risk"], ours: false },
  { k: "Build on what works", v: ["Less complexity", "Expanded capabilities", "More value from systems and people"], ours: true },
];

/** Counts up once when it first scrolls into view. Renders the final figure until then. */
function Count({ from, to }: { from: number; to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, "0px 0px -15% 0px");
  const reduce = useReduced();
  const [v, setV] = useState(to);
  const done = useRef(false);
  useEffect(() => {
    if (!inView || reduce || done.current) return;
    done.current = true;
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / 1600);
      setV(Math.round(from + (to - from) * easeOut(t)));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    // If frames are throttled (background tab), land on the real figure anyway.
    const safety = window.setTimeout(() => setV(to), 2200);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
    };
  }, [inView, reduce, from, to]);
  return (
    <span ref={ref} className="v23-num">
      {v.toLocaleString("en-US")}
    </span>
  );
}

export function Problem() {
  return (
    <section id="problem" className="relative py-24 sm:py-32" data-v23-tone="dark" data-v23-chapter="Complexity" aria-labelledby="v23-problem-title">
      <div className="v23-wrap">
        <div className="border-y border-(--line) py-6" data-v23-rv>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-10">
            <p className="v23-label shrink-0 text-(--tx-3)">Trusted by operators, manufacturers and value creation teams · placeholder marks</p>
            <ul className="flex flex-wrap gap-x-8 gap-y-2" aria-label="Client logos (placeholders)">
              {LOGOS.map((l) => (
                <li key={l} className="text-[0.9375rem] font-semibold tracking-[-0.01em] text-(--tx-3)">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-24 grid gap-14 lg:mt-32 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <div data-v23-rv>
              <Kicker n="01">The problem</Kicker>
            </div>
            <h2 id="v23-problem-title" data-v23-rv style={rd(60)} className="v23-h2 mt-6 max-w-[14ch]">
              Complexity Is the Cost of Growth.
            </h2>
            <p data-v23-rv style={rd(120)} className="v23-lead mt-6 max-w-[52ch]">
              Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding everything together. Leadership loses visibility, execution slows down, and the business pays the price.
            </p>
          </div>

          <div className="lg:col-span-6 lg:pt-16">
            <dl className="grid grid-cols-2 border-l border-t border-(--line)">
              {COUNTS.map((c, i) => (
                <div key={c.label} data-v23-rv style={rd(i * 70)} className="border-b border-r border-(--line) p-5 sm:p-7">
                  <dt className="v23-label text-(--tx-3)">{c.label}</dt>
                  <dd className="mt-4 flex items-baseline gap-2">
                    <span className="v23-mono text-[0.8125rem] text-(--tx-3) line-through decoration-(--line-2)">{c.from}</span>
                    <span className="v23-display text-[clamp(2rem,4vw,3rem)] leading-none">
                      <Count from={c.from} to={c.to} />
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="v23-label mt-4 text-(--tx-3)">Founding to enterprise · illustrative</p>
          </div>
        </div>

        <div className="mt-28 grid gap-12 lg:mt-36 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p data-v23-rv className="max-w-[40ch] text-[1.0625rem] leading-[1.7] text-(--tx-2)">
              When the business becomes fragmented, replacing systems can feel like the natural next step.
            </p>
            <h2 data-v23-rv style={rd(60)} className="v23-h2 mt-6 max-w-[14ch]">
              Solve the Right Problem.
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p data-v23-rv style={rd(100)} className="v23-lead max-w-[60ch]">
              Sometimes replacement is necessary. But often, the problem can be solved without the cost, operational load, and disruption risk of a system transition. Building on what already works reduces complexity, expands capabilities, and unlocks more value from your systems and people.
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {COMPARE.map((c, i) => (
                <div
                  key={c.k}
                  data-v23-rv
                  style={rd(160 + i * 90)}
                  className={`rounded-[14px] border p-5 ${c.ours ? "border-(--accent)/40 bg-[rgb(124_216_232/0.06)]" : "border-(--line)"}`}
                >
                  <p className={`v23-label ${c.ours ? "text-(--accent)" : "text-(--tx-3)"}`}>{c.ours ? "Our approach" : "The usual reflex"}</p>
                  <p className="mt-3 text-[1.125rem] font-semibold tracking-[-0.015em]">{c.k}</p>
                  <ul className="mt-4 grid gap-2">
                    {c.v.map((v) => (
                      <li key={v} className="flex items-center gap-2.5 text-[0.9375rem] text-(--tx-2)">
                        <span className={`h-px w-3 ${c.ours ? "bg-(--accent)" : "bg-(--tx-3)"}`} aria-hidden="true" />
                        {v}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
