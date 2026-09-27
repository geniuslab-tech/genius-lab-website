"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { useReducedMotion } from "motion/react";
import { useInView } from "./ui";

const LAYERS = [
  {
    n: "01",
    name: "Data Engineering",
    role: "The foundation.",
    body: "We connect your systems and engineer their data into one governed, reliable foundation: integration, pipelines, modeling and quality.",
    gives: ["Connected systems", "A unified data platform", "Trusted, tested pipelines"],
  },
  {
    n: "02",
    name: "Analytics",
    role: "Organized data becomes understanding.",
    body: "Analysis and modeling explain what is happening, why it is happening and what is likely to happen next.",
    gives: ["Performance analysis", "Forecasts and drivers", "Customer and operational insight"],
  },
  {
    n: "03",
    name: "Business Intelligence",
    role: "Understanding becomes visible.",
    body: "One set of definitions behind every dashboard and report, so leadership sees the same numbers, at the same time.",
    gives: ["Executive dashboards", "Shared metrics and KPIs", "Self-service reporting"],
  },
  {
    n: "04",
    name: "Artificial Intelligence",
    role: "Visibility gains context and reasoning.",
    body: "AI learns your business context and becomes its Second Brain. AI Agents reason across systems, tables, metrics and processes to answer and act.",
    gives: ["Second Brain", "AI Agents", "Orchestrated execution"],
  },
];

const CYCLE = 4800;
const CX = 230;
const HW = 176;
const HH = 88;
const T = 16;
const BASE = 380;
const GAP = 62;

/** Unit-square pattern drawn on each plate's top face, one motif per layer. */
function Pattern({ i, on }: { i: number; on: boolean }) {
  const ink = on ? "#ffffff" : "#8d93ad";
  const hot = on ? "#f29a1f" : "#8d93ad";
  if (i === 0)
    return (
      <g>
        {Array.from({ length: 16 }, (_, k) => (
          <rect key={k} x={0.16 + (k % 4) * 0.18} y={0.16 + Math.floor(k / 4) * 0.18} width="0.1" height="0.1" fill={k === 6 ? hot : ink} fillOpacity={on ? 0.85 : 0.5} />
        ))}
      </g>
    );
  if (i === 1)
    return <polyline points="0.14,0.8 0.3,0.62 0.46,0.68 0.62,0.4 0.78,0.46 0.88,0.2" fill="none" stroke={hot} strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />;
  if (i === 2)
    return (
      <g>
        {[0.35, 0.55, 0.45, 0.72, 0.6].map((h, k) => (
          <rect key={k} x={0.16 + k * 0.14} y={0.16} width="0.08" height={h} fill={k === 3 ? hot : ink} fillOpacity={on ? 0.9 : 0.5} />
        ))}
      </g>
    );
  const N = [
    [0.25, 0.3],
    [0.7, 0.22],
    [0.5, 0.52],
    [0.22, 0.75],
    [0.78, 0.72],
  ];
  const E = [
    [0, 2],
    [1, 2],
    [2, 3],
    [2, 4],
    [0, 3],
    [1, 4],
  ];
  return (
    <g>
      {E.map(([a, b], k) => (
        <line key={k} x1={N[a][0]} y1={N[a][1]} x2={N[b][0]} y2={N[b][1]} stroke={ink} strokeOpacity={on ? 0.6 : 0.45} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      ))}
      {N.map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r={k === 2 ? 0.06 : 0.04} fill={k === 2 ? hot : ink} />
      ))}
    </g>
  );
}

function Plate({ i, y, on, cap = false, onPick }: { i: number; y: number; on: boolean; cap?: boolean; onPick?: () => void }) {
  const hw = cap ? HW * 0.62 : HW;
  const hh = cap ? HH * 0.62 : HH;
  const top = `${CX},${y - hh} ${CX + hw},${y} ${CX},${y + hh} ${CX - hw},${y}`;
  const left = `${CX - hw},${y} ${CX},${y + hh} ${CX},${y + hh + T} ${CX - hw},${y + T}`;
  const right = `${CX},${y + hh} ${CX + hw},${y} ${CX + hw},${y + T} ${CX},${y + hh + T}`;
  const c = cap
    ? { top: "#f29a1f", l: "#c26d00", r: "#db8410", s: "#f29a1f" }
    : on
      ? { top: "#101440", l: "#0a0d2e", r: "#171c52", s: "#232a6b" }
      : { top: "#ffffff", l: "#dfe4ee", r: "#eaeef4", s: "#cfd5e1" };
  return (
    <g onClick={onPick} className={onPick ? "cursor-pointer" : undefined}>
      <polygon points={left} fill={c.l} style={{ transition: "fill 500ms" }} />
      <polygon points={right} fill={c.r} style={{ transition: "fill 500ms" }} />
      <polygon points={top} fill={c.top} stroke={c.s} strokeWidth="1" style={{ transition: "fill 500ms, stroke 500ms" }} />
      {!cap && (
        <g transform={`matrix(${hw} ${-hh} ${hw} ${hh} ${CX - hw} ${y})`}>
          <Pattern i={i} on={on} />
        </g>
      )}
    </g>
  );
}

export function StackV18() {
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLElement>(0.3);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!inView || reduce || touched) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % LAYERS.length), CYCLE);
    return () => clearTimeout(t);
  }, [inView, reduce, touched, active]);

  const pick = (i: number) => {
    setTouched(true);
    setActive(i);
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % LAYERS.length;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + LAYERS.length) % LAYERS.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = LAYERS.length - 1;
    if (next < 0) return;
    e.preventDefault();
    pick(next);
    document.getElementById(`v18-layer-tab-${next}`)?.focus();
  };

  // Plates above the selected one lift away, opening a gap that shows where it sits.
  const lift = (i: number) => (i > active ? -34 : i === active ? -8 : 0);
  const L = LAYERS[active];

  return (
    <section ref={ref} id="platform" className="scroll-mt-16 bg-(--grey) py-24 sm:py-32" aria-labelledby="v18-stack-title">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div data-rv="">
              <p className="v18-label flex items-center gap-3 text-(--ink-3)">
                <span className="text-(--sky-ink)">02</span>
                <span className="h-px w-8 bg-(--rule-2)" aria-hidden="true" />
                The platform
              </p>
              <h2 id="v18-stack-title" className="v18-h2 mt-5 max-w-[16ch]">
                Four connected layers. One better decision.
              </h2>
              <p className="text-pretty mt-6 max-w-[48ch] text-[1.0625rem] leading-[1.7] text-(--ink-2)">
                Not four products. Each layer builds on the one beneath it, and together they form one intelligence and execution layer across your business.
              </p>
            </div>

            <div role="tablist" aria-label="Platform layers, foundation first" aria-orientation="vertical" className="mt-10 grid gap-2" data-rv="" style={{ ["--rd" as string]: "120ms" }}>
              {LAYERS.map((l, i) => {
                const on = i === active;
                return (
                  <button
                    key={l.n}
                    id={`v18-layer-tab-${i}`}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls="v18-layer-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => pick(i)}
                    onKeyDown={(e) => onKey(e, i)}
                    className={`relative flex items-center gap-4 overflow-hidden rounded-[12px] px-5 py-4 text-left transition-[background-color,box-shadow,color] duration-300 ${
                      on ? "bg-(--navy) text-white shadow-[0_18px_36px_-24px_rgb(16_20_64/0.7)]" : "bg-white text-(--ink) shadow-[0_0_0_1px_var(--rule)] hover:shadow-[0_0_0_1px_var(--rule-2)]"
                    }`}
                  >
                    <span className={`v18-mono text-[0.75rem] ${on ? "text-(--ember)" : "text-(--ink-3)"}`}>{l.n}</span>
                    <span className="flex-1">
                      <span className="block text-[1.0625rem] font-bold tracking-[-0.015em]">{l.name}</span>
                      <span className={`block text-[0.875rem] ${on ? "text-white/70" : "text-(--ink-3)"}`}>{l.role}</span>
                    </span>
                    {on && !reduce && !touched && inView && <span key={`t-${active}`} className="v18-timer absolute inset-x-0 bottom-0 h-[2px] bg-(--ember)" style={{ ["--dur" as string]: `${CYCLE}ms` }} aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative mx-auto max-w-[640px]" data-rv="">
              <svg viewBox="0 0 640 520" className="h-auto w-full" role="img" aria-label={`Four stacked layers, Data Engineering at the base and Artificial Intelligence on top, crowned by better business decisions. Selected: ${L.name}.`}>
                {[...LAYERS.keys()].map((i) => {
                  const y = BASE - i * GAP;
                  const on = i === active;
                  return (
                    <g key={i} style={{ transform: `translateY(${lift(i)}px)`, transition: "transform 700ms var(--spring)" }}>
                      <Plate i={i} y={y} on={on} onPick={() => pick(i)} />
                      <line x1={CX + HW + 6} x2={CX + HW + 36} y1={y + T / 2} y2={y + T / 2} stroke={on ? "#f29a1f" : "#cfd5e1"} strokeWidth="1.2" style={{ transition: "stroke 400ms" }} />
                      <text x={CX + HW + 44} y={y + T / 2 - 4} className={`v18-mono text-[10px] ${on ? "fill-(--ember-ink)" : "fill-(--ink-3)"}`}>
                        {LAYERS[i].n}
                      </text>
                      <text x={CX + HW + 44} y={y + T / 2 + 11} className={`text-[12.5px] font-bold ${on ? "fill-(--ink)" : "fill-(--ink-2)"}`}>
                        {LAYERS[i].name}
                      </text>
                    </g>
                  );
                })}
                <g style={{ transform: `translateY(${lift(4)}px)`, transition: "transform 700ms var(--spring)" }}>
                  <Plate i={4} y={BASE - 4 * GAP - 34} on={false} cap />
                  <text x={CX} y={BASE - 4 * GAP - 30} textAnchor="middle" className="fill-[#1a1205] text-[11px] font-bold">
                    Better decisions
                  </text>
                </g>
              </svg>
            </div>

            <div id="v18-layer-panel" role="tabpanel" aria-labelledby={`v18-layer-tab-${active}`} className="v18-tile mt-6 grid gap-6 p-6 sm:grid-cols-[1.4fr_1fr] sm:p-8" data-rv="">
              <div key={active} className="v18-screen-in">
                <p className="v18-label text-(--sky-ink)">
                  Layer {L.n} · {active === 0 ? "Foundation" : `Builds on layer 0${active}`}
                </p>
                <h3 className="mt-3 text-[1.5rem] font-bold tracking-[-0.02em]">{L.name}</h3>
                <p className="text-pretty mt-2 leading-[1.7] text-(--ink-2)">{L.body}</p>
              </div>
              <ul key={`g-${active}`} className="v18-screen-in grid content-start gap-2 border-(--rule) sm:border-l sm:pl-6" aria-label={`${L.name} delivers`}>
                {L.gives.map((g) => (
                  <li key={g} className="flex items-center gap-3 rounded-[8px] bg-(--grey) px-3 py-2.5 text-[0.9375rem] font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-(--ember)" aria-hidden="true" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-4 text-[0.9375rem] leading-[1.6] text-(--ink-2)">
              <span className="font-bold text-(--ink)">The outcome: better business decisions.</span> Together the layers give executives clear insight, full visibility and the confidence to act.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
