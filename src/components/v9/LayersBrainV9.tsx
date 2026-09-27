"use client";

import { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { Slate, usePin, useStill, round1 } from "./shared";

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

const OUTCOME = {
  name: "Better business decisions",
  body: "Each layer builds on the one beneath it. Together they give executives clear insight, full visibility and the confidence to act.",
};

const HUBS = ["Systems", "Tables", "Metrics", "Dashboards", "Processes", "Customers", "Operations", "Finance"];

const TOPICS = [
  {
    name: "Semantic Context",
    body: "What every number means. Shared definitions for metrics, tables and dashboards, so revenue means the same thing in every report.",
    hubs: [1, 2, 3],
  },
  {
    name: "Business Context",
    body: "How the company actually works. Customers, operations and finance, and the relationships that connect them.",
    hubs: [5, 6, 7],
  },
  {
    name: "Event Context",
    body: "What is happening right now. Transactions, process steps and system events, captured as they occur.",
    hubs: [0, 4],
  },
];

const BRAIN_LEAD =
  "The intelligence layer holds the full context of the company: its systems, tables, metrics, dashboards, processes, customers, operations and finances. AI Agents work on top of it, end to end.";

/* Scene timing inside the one pinned range. */
const LAYER_AT = [0.03, 0.13, 0.23, 0.33];
const OUTCOME_AT = 0.43;
const IRIS = [0.52, 0.66] as const;
const TOPIC_AT = [0.66, 0.77, 0.88];

/* A hexagonal lattice, the Second Brain: one centre cell and two rings. */
const HEX_R = 34;
function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 180) * (60 * k - 30);
    return `${round1(cx + r * Math.cos(a))},${round1(cy + r * Math.sin(a))}`;
  }).join(" ");
}
const CELLS = (() => {
  const out: { q: number; r: number; x: number; y: number }[] = [];
  for (let q = -2; q <= 2; q++) {
    for (let r = Math.max(-2, -q - 2); r <= Math.min(2, -q + 2); r++) {
      const x = round1(240 + HEX_R * Math.sqrt(3) * (q + r / 2) * 1.06);
      const y = round1(240 + HEX_R * 1.5 * r * 1.06);
      out.push({ q, r, x, y });
    }
  }
  return out;
})();
/* Hub i sits on the outer ring. */
const OUTER = CELLS.filter((c) => Math.max(Math.abs(c.q), Math.abs(c.r), Math.abs(-c.q - c.r)) === 2);
const HUB_CELLS = HUBS.map((_, i) => OUTER[Math.round((i * OUTER.length) / HUBS.length) % OUTER.length]);

function Lattice({ lit }: { lit: number[] }) {
  return (
    <svg viewBox="0 0 480 480" className="h-auto w-full" role="img" aria-label={`The Second Brain as a lattice of connected knowledge. Lit now: ${lit.map((h) => HUBS[h]).join(", ")}.`}>
      {HUB_CELLS.map((c, i) => (
        <line
          key={`l${i}`}
          x1="240"
          y1="240"
          x2={c.x}
          y2={c.y}
          stroke={lit.includes(i) ? "var(--v9-ice)" : "rgb(255 255 255 / 0.12)"}
          strokeWidth={lit.includes(i) ? 1.5 : 1}
          strokeDasharray={lit.includes(i) ? undefined : "2 5"}
          style={{ transition: "stroke 500ms" }}
        />
      ))}
      {CELLS.map((c) => {
        const hub = HUB_CELLS.indexOf(c);
        const on = hub >= 0 && lit.includes(hub);
        const centre = c.q === 0 && c.r === 0;
        return (
          <g key={`${c.q},${c.r}`}>
            <polygon
              points={hexPoints(c.x, c.y, HEX_R - 3)}
              fill={centre ? "var(--v9-ice)" : on ? "rgb(169 228 255 / 0.14)" : "rgb(2 3 9 / 0.35)"}
              stroke={on ? "var(--v9-ice)" : "rgb(255 255 255 / 0.14)"}
              strokeWidth="1"
              style={{ transition: "fill 500ms, stroke 500ms" }}
            />
            {hub >= 0 && (
              <text x={c.x} y={c.y + 3} textAnchor="middle" className="v9-tc" style={{ fontSize: 8, letterSpacing: "0.08em" }} fill={on ? "#fff" : "rgb(255 255 255 / 0.5)"}>
                {HUBS[hub]}
              </text>
            )}
            {centre && (
              <text x={c.x} y={c.y + 3} textAnchor="middle" className="v9-tc" style={{ fontSize: 7.5, fontWeight: 700 }} fill="#020309">
                2ND BRAIN
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function Slab({ layer, i, p, active }: { layer: (typeof LAYERS)[number]; i: number; p: MotionValue<number>; active: boolean }) {
  const s = LAYER_AT[i];
  const y = useTransform(p, [s, s + 0.06], [70, 0]);
  const opacity = useTransform(p, [s, s + 0.05], [0, 1]);
  const clip = useTransform(p, [s, s + 0.06], [100, 0]);
  const clipPath = useMotionTemplate`inset(${clip}% 0 0 0)`;
  return (
    <motion.li style={{ y, opacity, clipPath }}>
      <div
        className={`flex h-11 items-center gap-4 border px-4 transition-colors duration-500 sm:h-14 sm:px-5 ${
          active ? "border-(--v9-ice) bg-(--v9-navy)" : "border-white/12 bg-(--v9-ink-2)"
        }`}
      >
        <span className={`v9-tc ${active ? "text-(--v9-ice)" : "text-(--v9-dim)"}`}>{layer.n}</span>
        <span className="v9-display text-[1.375rem] text-white sm:text-[1.75rem]">{layer.name}</span>
      </div>
    </motion.li>
  );
}

function StaticLayers() {
  return (
    <>
      <section id="layers" data-scene="SC 03 · The stack" className="scroll-mt-12 bg-(--v9-ink) py-24" aria-labelledby="v9-layers-title">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <Slate sc="03">The stack</Slate>
          <h2 id="v9-layers-title" className="v9-display mt-8 max-w-[20ch] text-[clamp(2.25rem,5vw,4.5rem)]">
            One intelligence and execution layer across your business.
          </h2>
          <p className="mt-5 max-w-[56ch] leading-[1.7] text-(--v9-fog)">
            Not four products. Every layer is built on the one beneath it, and the top of the stack is a better decision.
          </p>
          <ol className="mt-12 grid gap-3" aria-label="Layers, foundation first">
            {LAYERS.map((l) => (
              <li key={l.n} className="grid gap-4 border border-white/12 p-6 md:grid-cols-[6rem_1fr_1fr]">
                <span className="v9-display text-[3rem] text-(--v9-ice)">{l.n}</span>
                <div>
                  <h3 className="v9-display text-[2rem]">{l.name}</h3>
                  <p className="mt-1 font-semibold text-(--v9-ice)">{l.role}</p>
                  <p className="mt-2 leading-[1.65] text-(--v9-fog)">{l.body}</p>
                </div>
                <ul className="space-y-1.5 text-[0.9375rem]">
                  {l.gives.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </li>
            ))}
            <li className="border border-(--v9-ice) bg-(--v9-navy) p-6">
              <p className="v9-tc text-(--v9-ice)">The outcome</p>
              <h3 className="v9-display mt-2 text-[2.25rem]">{OUTCOME.name}</h3>
              <p className="mt-2 max-w-[60ch] leading-[1.65] text-(--v9-fog)">{OUTCOME.body}</p>
            </li>
          </ol>
        </div>
      </section>
      <section id="brain" data-scene="SC 04 · The Second Brain" className="scroll-mt-12 bg-(--v9-navy) py-24" aria-labelledby="v9-brain-title">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-8 lg:grid-cols-2">
          <div>
            <Slate sc="04">The Second Brain</Slate>
            <h2 id="v9-brain-title" className="v9-display mt-8 text-[clamp(2.25rem,5vw,4.5rem)]">
              A Second Brain for your business.
            </h2>
            <p className="mt-5 max-w-[56ch] leading-[1.7] text-(--v9-fog)">{BRAIN_LEAD}</p>
            <ol className="mt-10 space-y-6">
              {TOPICS.map((t) => (
                <li key={t.name}>
                  <h3 className="font-semibold text-white">{t.name}</h3>
                  <p className="mt-1 leading-[1.65] text-(--v9-fog)">{t.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="mx-auto w-full max-w-[460px]">
            <Lattice lit={[0, 1, 2, 3, 4, 5, 6, 7]} />
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * SC 03 and SC 04 share one pinned range: the four layers stack up with a rolling counter,
 * then an iris opens on the Second Brain.
 */
export function LayersBrainV9() {
  const still = useStill();
  const ref = useRef<HTMLElement>(null);
  const p = usePin(ref);
  const [layer, setLayer] = useState(0);
  const [topic, setTopic] = useState(0);

  useMotionValueEvent(p, "change", (v) => {
    let l = 0;
    LAYER_AT.forEach((s, i) => {
      if (v >= s + 0.02) l = i;
    });
    if (v >= OUTCOME_AT) l = 4;
    setLayer(l);
    let t = 0;
    TOPIC_AT.forEach((s, i) => {
      if (v >= s) t = i;
    });
    setTopic(t);
  });

  // Counter rolls 01 -> 04, holding on each layer.
  const roll = useTransform(
    p,
    [0, 0.12, 0.15, 0.22, 0.25, 0.32, 0.35],
    ["0em", "0em", "-1em", "-1em", "-2em", "-2em", "-3em"],
  );
  const outcomeOpacity = useTransform(p, [OUTCOME_AT, OUTCOME_AT + 0.05], [0, 1]);
  const outcomeY = useTransform(p, [OUTCOME_AT, OUTCOME_AT + 0.05], [40, 0]);
  const fill = useTransform(p, [0.02, OUTCOME_AT], [0, 1]);

  // The iris.
  const irisR = useTransform(p, [IRIS[0], IRIS[1]], [0, 75]);
  const irisClip = useMotionTemplate`circle(${irisR}% at 50% 55%)`;
  const underScale = useTransform(p, [IRIS[0], IRIS[1]], [1, 0.9]);
  const underOpacity = useTransform(p, [IRIS[0], IRIS[1]], [1, 0.25]);
  const ringScale = useTransform(p, [IRIS[0], IRIS[1]], [0, 1]);
  const ringOpacity = useTransform(p, [IRIS[0], IRIS[0] + 0.02, IRIS[1] - 0.02, IRIS[1]], [0, 1, 1, 0]);

  if (still) return <StaticLayers />;

  const current = LAYERS[Math.min(layer, 3)];
  const t = TOPICS[topic];

  return (
    <section ref={ref} id="layers" className="relative h-[760svh] scroll-mt-0 bg-(--v9-ink)" aria-label="The stack and the Second Brain">
      <span id="brain" className="absolute left-0 top-[64%] h-px w-px" aria-hidden="true" />
      <span data-scene="SC 03 · The stack" className="pointer-events-none absolute inset-x-0 top-0 h-[60%]" aria-hidden="true" />
      <span data-scene="SC 04 · The Second Brain" className="pointer-events-none absolute inset-x-0 top-[60%] h-[40%]" aria-hidden="true" />
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* SC 03: the stack. */}
        <motion.div className="absolute inset-0" style={{ scale: underScale, opacity: underOpacity }}>
          <div className="mx-auto flex h-full max-w-[1440px] flex-col px-4 pb-12 pt-16 sm:px-8 sm:pb-14 sm:pt-20">
            <Slate sc="03">The stack</Slate>
            <div className="mt-5 grid flex-1 gap-6 sm:mt-8 lg:grid-cols-12 lg:gap-10">
              <div className="flex flex-col lg:col-span-5">
                <h2 id="v9-layers-title" className="v9-display max-w-[18ch] text-[clamp(1.9rem,min(4.2vw,7svh),4rem)]">
                  One intelligence and execution layer across your business.
                </h2>
                <p className="text-pretty mt-3 hidden max-w-[48ch] leading-[1.65] text-(--v9-fog) sm:block">
                  Not four products. Every layer is built on the one beneath it, and the top of the stack is a better decision.
                </p>

                <div className="mt-4 flex items-end gap-4 lg:mt-auto">
                  <div className="v9-display h-[1em] overflow-hidden text-[clamp(4.5rem,min(16vw,26svh),15rem)] leading-none text-(--v9-ice)" aria-hidden="true">
                    <motion.div style={{ y: roll }}>
                      {LAYERS.map((l) => (
                        <div key={l.n} className="h-[1em]">
                          {l.n}
                        </div>
                      ))}
                    </motion.div>
                  </div>
                  <div className="pb-[0.6em] text-[clamp(1rem,2vw,1.5rem)]">
                    <span className="v9-display text-(--v9-dim)">/04</span>
                    <span className="relative mt-2 block h-px w-16 bg-white/15">
                      <motion.span className="absolute inset-0 origin-left bg-(--v9-ice)" style={{ scaleX: fill }} />
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:col-span-7">
                <div className="min-h-[8.5rem] sm:min-h-[10rem]" aria-live="polite">
                  {layer < 4 ? (
                    <div key={current.n} className="v9-swap grid gap-4 md:grid-cols-[1.4fr_1fr]">
                      <div>
                        <p className="v9-tc text-(--v9-ice)">
                          Layer {current.n} · {current.role}
                        </p>
                        <p className="text-pretty mt-2 text-[0.9375rem] leading-[1.6] text-(--v9-fog) sm:text-[1.0625rem]">{current.body}</p>
                      </div>
                      <ul className="hidden space-y-1.5 border-l border-(--v9-rule) pl-5 md:block">
                        {current.gives.map((g) => (
                          <li key={g} className="text-[0.9375rem] text-white">
                            {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="v9-swap">
                      <p className="v9-tc text-(--v9-ice)">The outcome</p>
                      <p className="text-pretty mt-2 max-w-[56ch] text-[0.9375rem] leading-[1.6] text-(--v9-fog) sm:text-[1.0625rem]">{OUTCOME.body}</p>
                    </div>
                  )}
                </div>

                <div className="mt-auto">
                  <motion.div style={{ opacity: outcomeOpacity, y: outcomeY }} className="mb-2 flex h-12 items-center justify-between bg-(--v9-ice) px-4 text-(--v9-ink) sm:h-16 sm:px-5">
                    <span className="v9-display text-[1.5rem] sm:text-[2.25rem]">{OUTCOME.name}</span>
                    <span className="v9-tc hidden sm:inline">The outcome</span>
                  </motion.div>
                  <ol className="flex flex-col-reverse gap-2" aria-label="Layers, foundation first">
                    {LAYERS.map((l, i) => (
                      <Slab key={l.n} layer={l} i={i} p={p} active={layer === i || layer === 4} />
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The iris ring, riding the edge of the opening. */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[55%] z-20 aspect-square w-[150vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border border-(--v9-ice)"
          style={{ scale: ringScale, opacity: ringOpacity, width: "calc(hypot(100vw, 100svh) * 1.0607)" }}
          aria-hidden="true"
        />

        {/* SC 04: the Second Brain, revealed through the iris. */}
        <motion.div className="absolute inset-0 z-10 bg-(--v9-navy)" style={{ clipPath: irisClip }}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_75%_55%,#1a1f5c_0%,transparent_70%)]" aria-hidden="true" />
          <div className="relative mx-auto grid h-full max-w-[1440px] content-start gap-6 px-4 pb-12 pt-16 sm:px-8 sm:pb-14 sm:pt-20 md:grid-cols-12 md:content-center md:gap-10">
            <div className="md:col-span-6">
              <Slate sc="04">The Second Brain</Slate>
              <h2 id="v9-brain-title" className="v9-display mt-5 text-[clamp(2.1rem,min(5vw,9svh),4.75rem)]">
                A Second Brain for your business.
              </h2>
              <p className="text-pretty mt-4 max-w-[54ch] text-[0.9375rem] leading-[1.6] text-(--v9-fog) sm:text-[1.0625rem]">{BRAIN_LEAD}</p>
              <ol className="mt-6 space-y-1" aria-label="Context in the Second Brain">
                {TOPICS.map((x, i) => (
                  <li key={x.name} className={`border-l-2 py-2 pl-4 transition-colors duration-500 ${i === topic ? "border-(--v9-ice)" : "border-white/10"}`}>
                    <span className="flex items-baseline justify-between gap-4">
                      <span className={`font-semibold transition-colors duration-500 ${i === topic ? "text-white" : "text-white/45"}`}>{x.name}</span>
                      <span className="v9-tc text-(--v9-dim)">0{i + 1}</span>
                    </span>
                    {i === topic && (
                      <span key={x.name} className="v9-swap mt-1 block text-[0.9375rem] leading-[1.6] text-(--v9-fog)">
                        {x.body}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
            <div className="hidden md:col-span-6 md:block">
              <div className="mx-auto w-full max-w-[min(520px,62svh)]">
                <Lattice lit={t.hubs} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
