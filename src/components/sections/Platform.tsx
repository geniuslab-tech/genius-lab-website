"use client";

import { useState } from "react";
import { mulberry32 } from "@/lib/terrain";

const W = 1200;
const H = 560;

type Layer = {
  id: string;
  name: string;
  short: string;
  pattern: string;
  body: string;
  parts: string[];
  depth: string;
};

const LAYERS: Layer[] = [
  {
    id: "ai",
    name: "Artificial Intelligence",
    short: "AI",
    pattern: "stipple",
    body: "Text text text. Models that forecast, classify and recommend, running on governed data rather than exports.",
    parts: ["Forecasting", "Machine learning", "LLM applications", "Model operations"],
    depth: "Surface",
  },
  {
    id: "bi",
    name: "Business Intelligence",
    short: "BI",
    pattern: "cross",
    body: "Text text text. One set of definitions behind every dashboard, report and board pack.",
    parts: ["Semantic layer", "Dashboards", "Self-serve reporting", "KPI trees"],
    depth: "Upper",
  },
  {
    id: "analytics",
    name: "Analytics",
    short: "AN",
    pattern: "hatch",
    body: "Text text text. Questions answered with statistics, experiments and clear models of the business.",
    parts: ["Exploratory analysis", "Experimentation", "Customer analytics", "Attribution"],
    depth: "Middle",
  },
  {
    id: "engineering",
    name: "Data Engineering",
    short: "DE",
    pattern: "block",
    body: "Text text text. Pipelines, warehouses and quality checks that every layer above depends on.",
    parts: ["Ingestion", "Lakehouse & warehouse", "Transformation", "Data quality"],
    depth: "Bedrock",
  },
];

const SOURCES = ["ERP", "CRM", "Events", "Files", "IoT", "APIs", "Finance", "Web"];

function buildStrata() {
  const rand = mulberry32(417);
  const phases = Array.from({ length: 12 }, () => rand() * Math.PI * 2);
  const xs: number[] = [];
  for (let x = 0; x <= W; x += 12) xs.push(x);
  const wave = (x: number, k: number, a: number) =>
    a * Math.sin(x / 140 + phases[k]) + a * 0.5 * Math.sin(x / 61 + phases[k + 4]);
  const surface = (x: number) =>
    150 - 88 * Math.exp(-(((x - 820) / 170) ** 2)) - 26 * Math.exp(-(((x - 520) / 120) ** 2)) + wave(x, 0, 7);
  // Each boundary follows the fold of the surface, flattening with depth.
  const bases = [0, 232, 330, 430];
  const follow = [1, 0.55, 0.3, 0.12];
  const boundary = (k: number) => (x: number) =>
    k === 0 ? surface(x) : bases[k] + (surface(x) - 150) * follow[k] + wave(x, k, 9 - k);
  const lines = [0, 1, 2, 3].map((k) => xs.map((x) => [x, boundary(k)(x)] as const));
  const bottom = xs.map((x) => [x, H - 40] as const);
  const toPath = (pts: readonly (readonly [number, number])[]) =>
    pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y.toFixed(1)}`).join("");
  const bands = [0, 1, 2, 3].map((k) => {
    const top = lines[k];
    const bot = k < 3 ? lines[k + 1] : bottom;
    return toPath(top) + [...bot].reverse().map(([x, y]) => `L${x},${y.toFixed(1)}`).join("") + "Z";
  });
  return { bands, surfacePath: toPath(lines[0]), lines: lines.map(toPath) };
}

function Patterns({ id, color }: { id: string; color: string }) {
  return (
    <>
      <pattern id={`stipple-${id}`} width="7" height="7" patternUnits="userSpaceOnUse">
        <rect x="3" y="3" width="1.3" height="1.3" fill={color} />
      </pattern>
      <pattern id={`cross-${id}`} width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M8 5v6M5 8h6" stroke={color} strokeWidth="1" />
      </pattern>
      <pattern id={`hatch-${id}`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M0 0v9" stroke={color} strokeWidth="1" />
      </pattern>
      <pattern id={`block-${id}`} width="36" height="18" patternUnits="userSpaceOnUse">
        <path d="M0 0.5h36M0 9.5h36M0.5 0v9M18.5 9v9" stroke={color} strokeWidth="1" />
      </pattern>
    </>
  );
}

const STRATA = buildStrata();

export function Platform() {
  const [active, setActive] = useState(3);
  const strata = STRATA;
  const layer = LAYERS[active];

  return (
    <section id="platform" className="relative scroll-mt-16 py-28 sm:py-36 lg:py-44" aria-labelledby="platform-title">
      <div className="shell">
        <div className="max-w-[46rem]">
          <h2 id="platform-title" data-reveal="up" className="type-display text-[clamp(2.25rem,4.6vw,4.25rem)]">
            One platform, four layers deep.
          </h2>
          <p data-reveal="up" data-delay="100" className="mt-6 max-w-[56ch] text-lg leading-relaxed text-ink-2">
            Text text text. Each layer rests on the one beneath it, so intelligence at the surface is only as good
            as the engineering at the bedrock.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8" data-reveal>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="h-auto w-full overflow-visible"
              role="group"
              aria-label="Cross-section of the Genius Lab platform. Select a layer."
            >
              <defs>
                <Patterns id="ink" color="var(--color-ink)" />
                <Patterns id="on" color="var(--color-survey)" />
              </defs>

              {/* Source feeds rising into the bedrock. */}
              {SOURCES.map((s, i) => {
                const x = 90 + i * 146;
                return (
                  <g key={s} className="text-ink-3">
                    <line x1={x} x2={x} y1={H - 40} y2={H - 6} stroke="currentColor" strokeWidth="1" />
                    <text x={x + 6} y={H - 10} className="type-mono fill-ink-3 text-[16px]">
                      {s}
                    </text>
                  </g>
                );
              })}

              {LAYERS.map((l, i) => {
                const on = i === active;
                return (
                  <g
                    key={l.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={on}
                    aria-label={l.name}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                    onClick={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setActive(i))}
                    className="cursor-pointer outline-none transition-[transform,opacity] duration-500 ease-[var(--ease-out-expo)]"
                    style={{
                      transform: on ? "translateY(-10px)" : "translateY(0)",
                      opacity: on ? 1 : 0.62,
                    }}
                  >
                    <path d={strata.bands[i]} fill="var(--color-paper)" />
                    <path d={strata.bands[i]} fill={`url(#${l.pattern}-${on ? "on" : "ink"})`} opacity={on ? 0.9 : 0.55} />
                    <path
                      d={strata.lines[i]}
                      fill="none"
                      stroke={on ? "var(--color-survey)" : "var(--color-ink)"}
                      strokeWidth={on ? 2 : i === 0 ? 1.5 : 1}
                    />
                  </g>
                );
              })}

              {/* Layer labels drawn on the section like a geological key. */}
              {LAYERS.map((l, i) => {
                const y = [196, 292, 392, 494][i];
                const on = i === active;
                return (
                  <g key={`label-${l.id}`} pointerEvents="none" className="transition-transform duration-500 max-md:hidden" style={{ transform: on ? "translateY(-10px)" : "none" }}>
                    <rect x="12" y={y - 22} width={l.name.length * 12.6 + 28} height="34" fill="var(--color-paper)" />
                    <text x="24" y={y + 2} className={`text-[21px] font-medium ${on ? "fill-survey" : "fill-ink"}`}>
                      {l.name}
                    </text>
                  </g>
                );
              })}

              {/* Summit reading on the surface profile. */}
              <g pointerEvents="none">
                <line x1="820" x2="820" y1="44" y2="4" stroke="var(--color-ink)" strokeWidth="1" />
                <text x="830" y="16" className="type-mono fill-ink-2 text-[16px]">
                  DECISIONS
                </text>
              </g>
            </svg>
          </div>

          <div className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-10">
            <div key={layer.id} className="animate-[layerIn_600ms_var(--ease-out-expo)]">
              <h3 className="type-wide text-[1.75rem] font-medium leading-tight">{layer.name}</h3>
              <p className="mt-4 leading-relaxed text-ink-2">{layer.body}</p>
              <ul className="mt-8">
                {layer.parts.map((p) => (
                  <li key={p} className="flex items-center justify-between border-t border-rule py-3 text-[0.9375rem]">
                    {p}
                    <span className="h-px w-6 bg-ink-3" aria-hidden="true" />
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 flex gap-2" role="tablist" aria-label="Platform layers">
              {LAYERS.map((l, i) => (
                <button
                  key={l.id}
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  className={`press type-mono h-10 flex-1 border text-[0.8125rem] ${
                    i === active ? "border-survey bg-survey text-on-survey" : "border-rule-strong text-ink-2 hover:border-ink"
                  }`}
                >
                  {l.short}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
