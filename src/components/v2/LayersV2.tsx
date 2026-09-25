"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { Delaunay } from "d3-delaunay";
import { hexPath, hexVertices, type Pt } from "@/lib/hex";
import { mulberry32, smoothstep } from "@/lib/terrain";
import { h2Class } from "./ui";
import { useMediaQuery } from "@/lib/useMediaQuery";

const W = 1000;
const H = 900;
const CX = 440;
const RX = 270;
const SY = 0.42;
const T = 22;
const PLATE_Y = [720, 575, 430, 285];
const CROWN_Y = 132;

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

// Flat-space mesh on a plate's top face: jittered points inside the hexagon, triangulated.
const SQ3 = Math.sqrt(3);
const inHex = (x: number, y: number, r: number) => Math.abs(y) <= (SQ3 / 2) * r && SQ3 * Math.abs(x) + Math.abs(y) <= SQ3 * r;
const meshRand = mulberry32(2718);
const MESH: Pt[] = [];
for (let gy = -RX; gy <= RX; gy += 26) {
  for (let gx = -RX; gx <= RX; gx += 30) {
    const x = gx + (meshRand() - 0.5) * 22;
    const y = gy + (meshRand() - 0.5) * 20;
    if (inHex(x, y, RX * 0.93)) MESH.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
  }
}
const MESH_EDGES = (() => {
  const d = Delaunay.from(MESH, (p) => p.x, (p) => p.y);
  const out: [number, number][] = [];
  for (let e = 0; e < d.triangles.length; e++) {
    if (e < d.halfedges[e]) continue;
    const a = d.triangles[e];
    const b = d.triangles[e % 3 === 2 ? e - 2 : e + 1];
    if (Math.hypot(MESH[a].x - MESH[b].x, MESH[a].y - MESH[b].y) < 46) out.push([a, b]);
  }
  return out;
})();
const MESH_PATH = MESH_EDGES.map(([a, b]) => `M${MESH[a].x},${MESH[a].y}L${MESH[b].x},${MESH[b].y}`).join("");
const toScreen = (p: Pt, plateY: number): Pt => ({ x: CX + p.x, y: plateY + p.y * SY });

const HEAT = MESH.map((c) => {
  const v =
    0.5 * Math.exp(-((c.x - 70) ** 2 + (c.y + 40) ** 2) / (2 * 90 ** 2)) +
    0.35 * Math.exp(-((c.x + 120) ** 2 + (c.y - 60) ** 2) / (2 * 70 ** 2));
  return Math.round((0.08 + v * 1.1) * 1000) / 1000;
});

const rand = mulberry32(404);
const BARS = [-170, -110, -50, 10, 70, 130, 190].map((x, i) => ({
  x,
  y: 30 - i * 12 + (rand() - 0.5) * 20,
  h: 18 + i * 6 + rand() * 8,
}));
// Analytics: observations and the trend fitted through them (illustrative).
const SCATTER = [-200, -160, -120, -80, -40, 0, 40, 80, 120, 160, 200].map((x, i) => {
  const trend = 26 + i * 7;
  const noise = [6, -8, 10, -4, 12, -10, 3, -6, 18, -3, 5][i];
  return { x, y: 40 - i * 9 + ((i * 37) % 23) - 11, h: trend + noise, trend, hot: i === 8 };
});
const AI_NODES: Pt[] = [
  { x: -180, y: 20 }, { x: -120, y: -90 }, { x: -60, y: 80 }, { x: 0, y: -20 },
  { x: 60, y: 110 }, { x: 110, y: -100 }, { x: 170, y: 30 }, { x: 40, y: -140 }, { x: -20, y: 150 },
];
const AI_LINKS: [number, number][] = [
  [0, 3], [1, 3], [2, 3], [3, 5], [3, 6], [4, 6], [5, 7], [1, 7], [2, 8], [4, 8], [0, 1],
];

/** Shared paint for every plate: lit top face, active edge light, and the glow beneath. */
export function PlateDefs() {
  return (
    <>
      <linearGradient id="plate-top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a3180" />
        <stop offset="1" stopColor="#12164a" />
      </linearGradient>
      <linearGradient id="plate-edge" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#8fa4ff" />
        <stop offset="0.5" stopColor="#ffffff" />
        <stop offset="1" stopColor="#5577ff" />
      </linearGradient>
      <radialGradient id="plate-glow">
        <stop offset="0" stopColor="#5577ff" stopOpacity="0.55" />
        <stop offset="1" stopColor="#5577ff" stopOpacity="0" />
      </radialGradient>
    </>
  );
}

function Plate({ i, active }: { i: number; active: boolean }) {
  const y = PLATE_Y[i];
  const v = hexVertices(CX, y, RX, true, SY);
  const down = (p: Pt) => `${p.x.toFixed(1)},${(p.y + T).toFixed(1)}`;
  const up = (p: Pt) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  const faces = [
    [v[0], v[1], "#1f2566"],
    [v[1], v[2], "#171c52"],
    [v[2], v[3], "#0f1340"],
  ] as const;
  const meshAlpha = [0.26, 0.12, 0.1, 0.12][i];
  return (
    <>
      <ellipse
        cx={CX}
        cy={y + T + 26}
        rx={RX * 1.05}
        ry={RX * SY * 0.9}
        fill="url(#plate-glow)"
        className="transition-opacity duration-700"
        style={{ opacity: active ? 1 : 0 }}
      />
      {faces.map(([a, b, fill], k) => (
        <polygon key={k} points={`${up(a)} ${up(b)} ${down(b)} ${down(a)}`} fill={fill} stroke="rgb(255 255 255 / 0.12)" strokeWidth="0.8" />
      ))}
      <path d={hexPath(CX, y, RX, true, SY)} fill="url(#plate-top)" />
      <g clipPath={`url(#plate-clip-${i})`}>
        <g transform={`translate(${CX} ${y}) scale(1 ${SY})`}>
          <path d={MESH_PATH} fill="none" stroke={`rgb(255 255 255 / ${meshAlpha})`} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          {MESH.map((c, k) =>
            i === 1 ? (
              <circle key={k} cx={c.x} cy={c.y} r={1.4 + HEAT[k] * 4} fill={`rgb(170 190 255 / ${Math.min(0.95, HEAT[k])})`} />
            ) : (
              <circle key={k} cx={c.x} cy={c.y} r={i === 0 ? 2.2 : 1.6} fill={`rgb(255 255 255 / ${i === 0 ? 0.6 : 0.35})`} />
            ),
          )}
          {i === 0 &&
            [[-250, -40], [-150, 150], [210, -120], [240, 90]].map(([x, yy], k) => (
              <path key={k} d={`M${x},${yy} L0,0`} stroke="rgb(255 255 255 / 0.7)" strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
            ))}
          {i === 0 && <circle cx={0} cy={0} r={16} fill="white" />}
        </g>
      </g>
      <path
        d={hexPath(CX, y, RX, true, SY)}
        fill="none"
        stroke={active ? "url(#plate-edge)" : "rgb(255 255 255 / 0.3)"}
        strokeWidth={active ? 1.8 : 1}
      />
      {i === 1 && (
        <g>
          {SCATTER.map((d, k) => {
            const p = toScreen({ x: d.x, y: d.y }, y);
            return (
              <g key={k}>
                <line x1={p.x} x2={p.x} y1={p.y} y2={p.y - d.h} stroke="rgb(255 255 255 / 0.75)" strokeWidth="2" />
                <ellipse cx={p.x} cy={p.y} rx="3.5" ry="1.6" fill="rgb(255 255 255 / 0.5)" />
                <circle cx={p.x} cy={p.y - d.h} r={d.hot ? 7 : 5} fill={d.hot ? "var(--color-signal)" : "white"} />
              </g>
            );
          })}
          <path
            d={SCATTER.slice()
              .sort((a, b) => a.x - b.x)
              .map((d, k) => {
                const p = toScreen({ x: d.x, y: d.y }, y);
                return `${k ? "L" : "M"}${p.x.toFixed(1)},${(p.y - d.trend).toFixed(1)}`;
              })
              .join("")}
            fill="none"
            stroke="var(--color-signal)"
            strokeWidth="2.2"
            strokeDasharray="5 4"
          />
        </g>
      )}
      {i === 2 && (
        <g>
          {BARS.map((b, k) => {
            const p = toScreen({ x: b.x, y: b.y }, y);
            return <rect key={k} x={p.x - 5} y={p.y - b.h} width="10" height={b.h} fill={k === BARS.length - 1 ? "var(--color-signal)" : "rgb(255 255 255 / 0.85)"} />;
          })}
          <path
            d={BARS.map((b, k) => {
              const p = toScreen({ x: b.x, y: b.y }, y);
              return `${k ? "L" : "M"}${p.x},${p.y - b.h - 14}`;
            }).join("")}
            fill="none"
            stroke="white"
            strokeWidth="1.2"
            strokeDasharray="3 4"
          />
        </g>
      )}
      {i === 3 && (
        <g>
          {AI_LINKS.map(([a, b], k) => {
            const A = toScreen(AI_NODES[a], y);
            const B = toScreen(AI_NODES[b], y);
            const lift = 40 + (k % 3) * 18;
            return (
              <path
                key={k}
                d={`M${A.x},${A.y} Q${(A.x + B.x) / 2},${Math.min(A.y, B.y) - lift} ${B.x},${B.y}`}
                fill="none"
                stroke={k % 4 === 0 ? "var(--color-signal)" : "rgb(255 255 255 / 0.55)"}
                strokeWidth="1.2"
              />
            );
          })}
          {AI_NODES.map((p0, k) => {
            const p = toScreen(p0, y);
            return <circle key={k} cx={p.x} cy={p.y} r={k === 3 ? 5 : 3.5} fill={k === 3 ? "var(--color-signal)" : "white"} />;
          })}
        </g>
      )}
    </>
  );
}

export function LayersV2() {
  const track = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(0);
  const compact = useMediaQuery("(max-width: 1023px)");
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });

  const render = (p: number) => {
    const root = svg.current;
    if (!root) return;
    const s = p * 5.1 - 0.15;
    root.querySelectorAll<SVGGElement>("[data-plate]").forEach((el, k) => {
      const e = k === 0 ? 1 : smoothstep(k - 0.45, k + 0.15, s);
      el.style.transform = `translateY(${((1 - e) * -110).toFixed(1)}px)`;
      el.style.opacity = String(e);
    });
    root.querySelectorAll<SVGElement>("[data-riser]").forEach((el) => {
      const k = Number(el.dataset.riser);
      el.style.opacity = String(smoothstep(k + 0.1, k + 0.4, s));
    });
    const crown = smoothstep(3.6, 4.2, s);
    root.querySelectorAll<SVGElement>("[data-crown]").forEach((el) => {
      el.style.opacity = String(crown);
      el.style.transform = `translateY(${((1 - crown) * -40).toFixed(1)}px)`;
    });
    const beam = root.querySelector<SVGLineElement>("[data-beam]");
    if (beam) beam.style.strokeDashoffset = String(1 - smoothstep(3.5, 4.1, s));
    const next = Math.max(0, Math.min(4, Math.floor(s + 0.25)));
    setStage((cur) => (cur === next ? cur : next));
  };

  useMotionValueEvent(scrollYProgress, "change", (p) => render(reduce ? 1 : p));
  useEffect(() => render(reduce ? 1 : scrollYProgress.get()));

  const goTo = (k: number) => {
    const el = track.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * ((k + 0.35) / 5.1), behavior: reduce ? "auto" : "smooth" });
  };

  const content = stage < 4 ? LAYERS[stage] : null;

  return (
    <section id="layers" className="relative isolate scroll-mt-0 text-navy" aria-labelledby="v2-layers-title">
      <div className="shell pt-12 sm:pt-16 lg:pt-20">
        <div>
          <h2 id="v2-layers-title" data-reveal="up" className={`${h2Class} max-w-[18ch]`}>
            One intelligence and execution layer across your&nbsp;business.
          </h2>
          <p data-reveal="up" data-delay="100" className="mt-8 max-w-[56ch] text-lg leading-relaxed text-navy/70">
            Not four products. Every layer is built on the one beneath it, and the top of the stack is a better
            decision.
          </p>
        </div>
      </div>

      <div ref={track} className="relative h-[420vh]">
        <div className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden pt-[var(--nav-h)] lg:flex-row lg:items-center">
          <div className="shell grid h-full w-full grid-rows-[minmax(0,1fr)_auto] gap-2 lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:gap-10">
            {/* Stage copy. */}
            <div className="order-2 pb-6 lg:order-1 lg:col-span-5 lg:pb-0">
              <ol className="mb-8 hidden gap-1 lg:flex" aria-label="Layers">
                {[...LAYERS.map((l) => l.n), "out"].map((n, k) => (
                  <li key={n}>
                    <button
                      type="button"
                      onClick={() => goTo(k)}
                      aria-current={stage === k ? "step" : undefined}
                      aria-label={k < 4 ? `${LAYERS[k].n} ${LAYERS[k].name}` : OUTCOME.name}
                      className={`press type-mono h-9 text-[0.8125rem] ${k < 4 ? "w-12" : "px-4"} ${
                        stage === k ? "bg-navy text-white" : stage > k ? "bg-navy/10 text-navy" : "text-navy/50 shadow-[inset_0_0_0_1px_rgb(16_20_64/0.2)] hover:text-navy"
                      }`}
                    >
                      {k < 4 ? n : "Decisions"}
                    </button>
                  </li>
                ))}
              </ol>
              <div className="flex gap-1.5 pb-4 lg:hidden" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((k) => (
                  <span key={k} className={`h-[3px] flex-1 transition-colors duration-500 ${stage >= k ? "bg-navy" : "bg-navy/15"}`} />
                ))}
              </div>

              <div key={stage} className="animate-[layerIn_700ms_var(--ease-out-expo)]">
                {content ? (
                  <>
                    <div className="flex items-baseline gap-4">
                      <span className="type-mono text-lg text-signal-ink">{content.n}</span>
                      <h3 className="type-display text-[clamp(1.75rem,3.2vw,3rem)] [font-variation-settings:'wdth'_108]">{content.name}</h3>
                    </div>
                    <p className="mt-3 text-lg font-medium text-navy lg:mt-5 lg:text-xl">{content.role}</p>
                    <p className="mt-3 max-w-[46ch] leading-relaxed text-navy/70 max-lg:line-clamp-3 lg:mt-4 lg:text-lg">{content.body}</p>
                    <ul className="mt-8 hidden border-t border-navy/12 lg:block">
                      {content.gives.map((g) => (
                        <li key={g} className="flex items-center justify-between border-b border-navy/12 py-3.5 text-[0.9375rem]">
                          {g}
                          <span className="h-[5px] w-[5px] bg-signal-ink" aria-hidden="true" />
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <h3 className="type-display text-[clamp(1.75rem,3.2vw,3rem)] [font-variation-settings:'wdth'_108]">{OUTCOME.name}</h3>
                    <p className="mt-4 max-w-[46ch] leading-relaxed text-navy/70 lg:text-lg">{OUTCOME.body}</p>
                  </>
                )}
              </div>
            </div>

            {/* The stack. */}
            <div className="order-1 flex min-h-0 items-center justify-center lg:order-2 lg:col-span-7 lg:h-full">
              <svg
                ref={svg}
                viewBox={compact ? "150 96 580 720" : `0 0 ${W} ${H}`}
                className="h-full max-h-[86dvh] w-full"
                role="img"
                aria-label="Four stacked hexagonal layers: Data Engineering at the base, then Analytics, Business Intelligence and Artificial Intelligence, with better business decisions at the top."
              >
                <defs>
                  <PlateDefs />
                  {PLATE_Y.map((y, i) => (
                    <clipPath key={i} id={`plate-clip-${i}`}>
                      <path d={hexPath(CX, y, RX - 6, true, SY)} />
                    </clipPath>
                  ))}
                </defs>

                {/* The architecture to come: unbuilt layers wait as outlines. */}
                {[...PLATE_Y, CROWN_Y].map((y, i) => (
                  <path
                    key={`ghost-${i}`}
                    d={hexPath(CX, y, i < 4 ? RX : 74, true, SY)}
                    fill="none"
                    stroke="var(--color-navy)"
                    strokeOpacity="0.32"
                    strokeDasharray="4 6"
                  />
                ))}
                {[0, 1, 2, 3].map((i) => (
                  <g key={i}>
                    {i > 0 &&
                      [-150, 0, 150].map((dx) => (
                        <line
                          key={dx}
                          data-riser={i}
                          x1={CX + dx}
                          x2={CX + dx}
                          y1={PLATE_Y[i] + 30}
                          y2={PLATE_Y[i - 1] - 8}
                          stroke="var(--color-signal-ink)"
                          strokeOpacity="0.6"
                          strokeDasharray="2 5"
                          className="riser-flow"
                          style={{ opacity: 0 }}
                        />
                      ))}
                    <g data-plate="" style={{ opacity: 0 }} className="[transform-box:view-box]">
                      <Plate i={i} active={stage === i} />
                      <g className="max-lg:hidden">
                        <line x1={CX + RX + 12} x2={CX + RX + 44} y1={PLATE_Y[i]} y2={PLATE_Y[i]} stroke="rgb(16 20 64 / 0.3)" />
                        <text x={CX + RX + 54} y={PLATE_Y[i] - 4} className={`type-mono text-[15px] ${stage === i ? "fill-signal-ink" : "fill-navy/45"}`}>
                          {LAYERS[i].n}
                        </text>
                        <text x={CX + RX + 54} y={PLATE_Y[i] + 18} className={`text-[18px] font-medium ${stage === i ? "fill-navy" : "fill-navy/55"}`}>
                          {LAYERS[i].name}
                        </text>
                      </g>
                    </g>
                  </g>
                ))}

                {/* Output: the decision the stack exists for. */}
                <line
                  data-beam=""
                  x1={CX}
                  x2={CX}
                  y1={PLATE_Y[3] - 30}
                  y2={CROWN_Y + 20}
                  pathLength={1}
                  strokeDasharray="1"
                  stroke="var(--color-signal)"
                  strokeWidth="2"
                  style={{ strokeDashoffset: 1 }}
                />
                <g data-crown="" style={{ opacity: 0 }}>
                  <path d={hexPath(CX, CROWN_Y + T, 74, true, SY)} fill="var(--color-navy-300)" />
                  <path d={hexPath(CX, CROWN_Y, 74, true, SY)} fill="var(--color-navy)" />
                  <path d={hexPath(CX, CROWN_Y, 34, true, SY)} fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="1.4" />
                  <path d={hexPath(CX, CROWN_Y, 12, true, SY)} fill="white" />
                  <line className="max-lg:hidden" x1={CX + 90} x2={CX + RX + 44} y1={CROWN_Y} y2={CROWN_Y} stroke="rgb(16 20 64 / 0.3)" />
                  <text x={CX + RX + 54} y={CROWN_Y + 7} className="fill-navy text-[18px] font-semibold max-lg:hidden">
                    Better decisions
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
