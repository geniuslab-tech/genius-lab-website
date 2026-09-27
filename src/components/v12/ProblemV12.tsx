"use client";

import { useState, type CSSProperties } from "react";
import { Illustrative, Segmented, Tile, TileHead } from "./ui";

/** Illustrative growth of what a company has to hold together, founding to enterprise. */
const COUNTS = [
  { label: "Systems", from: 3, to: 46 },
  { label: "Reports", from: 8, to: 940 },
  { label: "Manual handoffs", from: 2, to: 210 },
  { label: "People in a decision", from: 2, to: 19 },
];

const STAGES = ["Founding", "Scaling", "Multi-site", "Group", "Enterprise"];
const CELLS = 72;

/** Qualitative comparison, no measured figures: bar length is relative, not a metric. */
const COMPARE = [
  { k: "Cost", replace: 92, build: 38 },
  { k: "Operational load", replace: 86, build: 30 },
  { k: "Disruption risk", replace: 94, build: 18 },
  { k: "Time to value", replace: 88, build: 34 },
];

function interp(from: number, to: number, p: number) {
  // Growth compounds: a gentle exponential, so the strain arrives late and all at once.
  const k = (Math.pow(12, p) - 1) / 11;
  return Math.round(from + (to - from) * k);
}

function GrowthSlider() {
  const [p, setP] = useState(62);
  const f = p / 100;
  const stage = STAGES[Math.min(STAGES.length - 1, Math.floor(f * STAGES.length))];
  const lit = Math.round(((Math.pow(12, f) - 1) / 11) * CELLS);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor="v12-growth" className="text-[0.875rem] font-medium">
          Drag to grow the company
        </label>
        <span className="v12-chip bg-(--ink) text-white" aria-live="polite">
          {stage}
        </span>
      </div>
      <input
        id="v12-growth"
        type="range"
        min={0}
        max={100}
        value={p}
        onChange={(e) => setP(Number(e.target.value))}
        aria-valuetext={`${stage} stage`}
        className="v12-range mt-2"
        style={{ "--p": `${p}%` } as CSSProperties}
      />
      <div className="mt-1 flex justify-between text-[0.75rem] text-(--ink-3)">
        <span>Founding</span>
        <span>Enterprise</span>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {COUNTS.map((c) => (
          <div key={c.label} className="v12-well px-3.5 py-3">
            <dt className="text-[0.75rem] leading-tight text-(--ink-3)">{c.label}</dt>
            <dd className="v12-tabnum mt-2 text-[1.75rem] font-semibold leading-none tracking-[-0.04em]">{interp(c.from, c.to, f).toLocaleString("en-US")}</dd>
          </div>
        ))}
      </dl>

      {/* Each cell is a handoff someone has to carry by hand. */}
      <div className="mt-4 grid grid-cols-[repeat(24,minmax(0,1fr))] gap-[3px]" aria-hidden="true">
        {Array.from({ length: CELLS }, (_, i) => (
          <span
            key={i}
            className={`aspect-square rounded-[2px] transition-colors duration-300 ${i < lit ? "bg-(--coral)" : "bg-(--ground-2)"}`}
            style={{ transitionDelay: `${(i % 24) * 6}ms` }}
          />
        ))}
      </div>
      <p className="mt-3 flex items-center justify-between text-[0.75rem] text-(--ink-3)">
        <span>People become the glue</span>
        <span>Founding to enterprise · illustrative</span>
      </p>
    </div>
  );
}

function ReplaceToggle() {
  const [mode, setMode] = useState<"replace" | "build">("replace");
  const opts = [
    { id: "replace" as const, label: "Replace systems" },
    { id: "build" as const, label: "Build on what works" },
  ];
  return (
    <div className="mt-8">
      <Segmented dark label="Compare approaches" options={opts} value={mode} onChange={setMode} />

      <ul className="mt-6 space-y-4" aria-label={`Relative impact: ${mode === "replace" ? "replacing systems" : "building on what works"}`}>
        {COMPARE.map((c) => {
          const v = mode === "replace" ? c.replace : c.build;
          return (
            <li key={c.k}>
              <div className="flex items-center justify-between text-[0.8125rem]">
                <span className="text-white/80">{c.k}</span>
                <span className="v12-mono text-[0.6875rem] text-white/45">{v > 70 ? "High" : v > 32 ? "Moderate" : "Low"}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-[width,background-color] duration-[800ms] ease-[var(--spring)] ${mode === "replace" ? "bg-(--coral)" : "bg-(--lime)"}`}
                  style={{ width: `${v}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ProblemV12() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="v12-problem-title">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-12">
          <Tile className="p-6 sm:p-8 lg:col-span-7">
            <TileHead label="01 · The problem" right={<Illustrative />} />
            <h2 id="v12-problem-title" className="v12-h2 mt-6 max-w-[14ch]">
              Complexity Is the Cost of Growth.
            </h2>
            <p className="text-pretty mt-5 max-w-[54ch] text-[1.0625rem] leading-[1.65] text-(--ink-2)">
              Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding everything together. Leadership loses visibility, execution
              slows down, and the business pays the price.
            </p>
            <GrowthSlider />
          </Tile>

          <Tile dark delay={80} className="flex flex-col p-6 sm:p-8 lg:col-span-5">
            <TileHead dark label="02 · The fix" right={<Illustrative dark>Relative, illustrative</Illustrative>} />
            <p className="text-pretty mt-6 max-w-[34ch] text-[1rem] leading-[1.6] text-white/60">
              When the business becomes fragmented, replacing systems can feel like the natural next step.
            </p>
            <h2 className="v12-h2 mt-4 max-w-[12ch] text-white">Solve the Right Problem.</h2>
            <ReplaceToggle />
            <p className="text-pretty mt-auto pt-8 text-[0.9375rem] leading-[1.65] text-white/65">
              Sometimes replacement is necessary. But often, the problem can be solved without the cost, operational load, and disruption risk of a system transition. Building on what
              already works reduces complexity, expands capabilities, and unlocks more value from your systems and people.
            </p>
          </Tile>
        </div>
      </div>
    </section>
  );
}
