"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { lerp, mulberry32, smoothstep } from "@/lib/terrain";

const S = 600;
const N = 48;
const FORECAST_FROM = 36;

const ENTITIES = ["Customers", "Orders", "Products", "Stores", "Campaigns", "Support"];

const STAGES = [
  {
    verb: "Collect",
    title: "Every source, sampled and trusted.",
    body: "Text text text. Records arrive from dozens of systems in dozens of shapes. We land them, test them and keep their history.",
    reading: "48 records · 6 sources",
  },
  {
    verb: "Connect",
    title: "Records become entities.",
    body: "Text text text. Customers, orders and products are resolved and joined, so the business can be read as one model.",
    reading: "6 entities · 55 relations",
  },
  {
    verb: "Interpret",
    title: "The model becomes a decision.",
    body: "Text text text. Trends, forecasts and their uncertainty, framed as a choice someone can act on this quarter.",
    reading: "Forecast · 90% band",
  },
];

function buildLayouts() {
  const rand = mulberry32(88);
  const raw = Array.from({ length: N }, () => [60 + rand() * 480, 60 + rand() * 480] as [number, number]);

  const centers = ENTITIES.map((_, k) => {
    const a = (k / ENTITIES.length) * Math.PI * 2 - Math.PI / 2;
    return [S / 2 + Math.cos(a) * 185, S / 2 + Math.sin(a) * 185] as [number, number];
  });
  const graph = Array.from({ length: N }, (_, i) => {
    const k = i % ENTITIES.length;
    const j = Math.floor(i / ENTITIES.length);
    const a = (j / 8) * Math.PI * 2 + k;
    return [centers[k][0] + Math.cos(a) * 44, centers[k][1] + Math.sin(a) * 44] as [number, number];
  });

  // Illustrative series: trend + season + noise, with a forecast tail.
  const chart = Array.from({ length: N }, (_, i) => {
    const x = 70 + (i / (N - 1)) * 470;
    const v = 0.3 + i * 0.0095 + 0.07 * Math.sin(i / 2.2) + (i < FORECAST_FROM ? (rand() - 0.5) * 0.06 : 0);
    return [x, 470 - v * 380] as [number, number];
  });

  const links: [number, number][] = [
    [0, 1], [1, 2], [0, 4], [1, 3], [2, 3], [0, 5], [4, 1],
  ];
  return { raw, graph, chart, centers, links };
}

const LAYOUTS = buildLayouts();

export function Transformation() {
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(0);
  const L = LAYOUTS;
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });

  const render = (p: number) => {
    const root = svg.current;
    if (!root) return;
    const t1 = smoothstep(0.16, 0.42, p);
    const t2 = smoothstep(0.58, 0.84, p);
    const pts = L.raw.map((r, i) => {
      const g = L.graph[i];
      const c = L.chart[i];
      return [lerp(lerp(r[0], g[0], t1), c[0], t2), lerp(lerp(r[1], g[1], t1), c[1], t2)];
    });

    root.querySelectorAll<SVGRectElement>("[data-pt]").forEach((el, i) => {
      el.setAttribute("x", (pts[i][0] - 3).toFixed(1));
      el.setAttribute("y", (pts[i][1] - 3).toFixed(1));
    });

    const graphAlpha = t1 * (1 - t2);
    root.querySelectorAll<SVGLineElement>("[data-spoke]").forEach((el, i) => {
      const k = i % ENTITIES.length;
      el.setAttribute("x1", pts[i][0].toFixed(1));
      el.setAttribute("y1", pts[i][1].toFixed(1));
      el.setAttribute("x2", L.centers[k][0].toFixed(1));
      el.setAttribute("y2", L.centers[k][1].toFixed(1));
      el.style.opacity = String(graphAlpha * 0.5);
    });
    root.querySelectorAll<SVGElement>("[data-graph]").forEach((el) => (el.style.opacity = String(graphAlpha)));
    root.querySelectorAll<SVGElement>("[data-chart]").forEach((el) => (el.style.opacity = String(t2)));

    const line = root.querySelector<SVGPathElement>("[data-series]");
    const fline = root.querySelector<SVGPathElement>("[data-forecast]");
    if (line && fline) {
      line.setAttribute(
        "d",
        pts.slice(0, FORECAST_FROM).map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(""),
      );
      fline.setAttribute(
        "d",
        pts.slice(FORECAST_FROM - 1).map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(""),
      );
      line.style.opacity = String(t2);
      fline.style.opacity = String(t2);
    }
    const next = p < 0.36 ? 0 : p < 0.68 ? 1 : 2;
    setStage((s) => (s === next ? s : next));
  };

  useMotionValueEvent(scrollYProgress, "change", (p) => render(reduce ? 1 : p));
  useEffect(() => render(reduce ? 1 : scrollYProgress.get()));

  const band = useMemo(() => {
    const tail = L.chart.slice(FORECAST_FROM - 1);
    const up = tail.map(([x, y], i) => `${i ? "L" : "M"}${x},${(y - 6 - i * 4.2).toFixed(1)}`).join("");
    const down = [...tail]
      .reverse()
      .map(([x, y], i) => `L${x},${(y + 6 + (tail.length - 1 - i) * 4.2).toFixed(1)}`)
      .join("");
    return up + down + "Z";
  }, [L]);

  return (
    <section className="relative bg-paper-2" aria-labelledby="transform-title">
      <div className="shell pt-28 sm:pt-36 lg:pt-44">
        <h2 id="transform-title" data-reveal="up" className="type-display max-w-[18ch] text-[clamp(2.25rem,4.6vw,4.25rem)]">
          Watch one dataset become a decision.
        </h2>
      </div>

      <div ref={wrap} className="shell relative grid grid-cols-1 gap-x-16 lg:h-[300vh] lg:grid-cols-12">
        <div className="sticky top-[var(--nav-h)] z-10 -mx-[var(--gutter)] self-start bg-paper-2 px-[var(--gutter)] py-4 lg:top-0 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:mx-0 lg:flex lg:h-[100dvh] lg:items-center lg:px-0 lg:py-0">
          <figure className="relative w-full">
            <svg
              ref={svg}
              viewBox={`0 0 ${S} ${S}`}
              className="mx-auto block aspect-square max-h-[46dvh] w-full bg-paper lg:max-h-[78dvh]"
              role="img"
              aria-label="Illustration: scattered records join into six entities, then resolve into a forecast chart."
            >
              {/* Plate frame with corner ticks. */}
              <rect x="0.5" y="0.5" width={S - 1} height={S - 1} fill="none" stroke="var(--color-rule-strong)" />
              {[[0, 0], [S, 0], [0, S], [S, S]].map(([x, y], i) => (
                <path
                  key={i}
                  d={`M${x + (x ? -14 : 14)},${y}H${x}V${y + (y ? -14 : 14)}`}
                  stroke="var(--color-ink)"
                  strokeWidth="2"
                  fill="none"
                />
              ))}

              {/* Graph layer. */}
              <g data-graph style={{ opacity: 0 }}>
                {L.links.map(([a, b], i) => (
                  <line
                    key={i}
                    x1={L.centers[a][0]}
                    y1={L.centers[a][1]}
                    x2={L.centers[b][0]}
                    y2={L.centers[b][1]}
                    stroke="var(--color-ink)"
                    strokeWidth="1"
                    strokeDasharray="3 4"
                  />
                ))}
                {L.centers.map(([x, y], k) => (
                  <g key={ENTITIES[k]}>
                    <circle cx={x} cy={y} r="7" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1.5" />
                    <text
                      x={x}
                      y={y + (y < S / 2 ? -62 : 72)}
                      textAnchor="middle"
                      className="type-mono fill-ink-2 text-[14px]"
                    >
                      {ENTITIES[k]}
                    </text>
                  </g>
                ))}
              </g>
              {L.raw.map((_, i) => (
                <line key={i} data-spoke stroke="var(--color-ink)" strokeWidth="1" style={{ opacity: 0 }} />
              ))}

              {/* Chart layer. */}
              <g data-chart style={{ opacity: 0 }}>
                <path d="M70,480H548M70,480V70" stroke="var(--color-ink)" strokeWidth="1" fill="none" />
                {[0, 1, 2, 3, 4].map((i) => (
                  <g key={i}>
                    <line x1="64" x2="70" y1={480 - i * 95} y2={480 - i * 95} stroke="var(--color-ink)" />
                    <line x1="70" x2="548" y1={480 - i * 95} y2={480 - i * 95} stroke="var(--color-rule)" />
                  </g>
                ))}
                {["Q1", "Q2", "Q3", "Q4"].map((q, i) => (
                  <text key={q} x={70 + i * 132 + 40} y="506" className="type-mono fill-ink-3 text-[13px]">
                    {q}
                  </text>
                ))}
                <path d={band} fill="var(--color-survey-soft)" />
                <line
                  x1={L.chart[FORECAST_FROM - 1][0]}
                  x2={L.chart[FORECAST_FROM - 1][0]}
                  y1="70"
                  y2="480"
                  stroke="var(--color-ink)"
                  strokeDasharray="2 4"
                />
                <text x={L.chart[FORECAST_FROM - 1][0] + 10} y="92" className="type-mono fill-ink-2 text-[13px]">
                  FORECAST
                </text>
                <g transform={`translate(${L.chart[N - 1][0] - 128}, ${L.chart[N - 1][1] - 78})`}>
                  <rect width="140" height="50" fill="var(--color-survey)" />
                  <text x="12" y="20" className="type-mono fill-on-survey-2 text-[11px]">
                    NEXT QUARTER
                  </text>
                  <text x="12" y="40" className="type-mono fill-on-survey text-[17px] font-semibold">
                    +12.4%
                  </text>
                </g>
                <text x="548" y="580" textAnchor="end" className="type-mono fill-ink-3 text-[12px]">
                  Illustrative data
                </text>
              </g>
              <path data-series fill="none" stroke="var(--color-ink)" strokeWidth="1.6" style={{ opacity: 0 }} />
              <path data-forecast fill="none" stroke="var(--color-survey)" strokeWidth="2" strokeDasharray="5 4" style={{ opacity: 0 }} />

              {L.raw.map((r, i) => (
                <rect
                  key={i}
                  data-pt
                  x={r[0] - 3}
                  y={r[1] - 3}
                  width="6"
                  height="6"
                  fill={i >= FORECAST_FROM ? "var(--color-survey)" : "var(--color-ink)"}
                />
              ))}
            </svg>
            <figcaption className="mt-3 flex items-center justify-between text-ink-3 lg:absolute lg:inset-x-0 lg:-bottom-9">
              <span className="text-[0.9375rem] font-medium text-survey">{STAGES[stage].verb}</span>
              <span className="type-mono text-[0.8125rem]">{STAGES[stage].reading}</span>
            </figcaption>
          </figure>
        </div>

        <ol className="relative lg:col-span-5 lg:col-start-1 lg:row-start-1">
          {STAGES.map((s, i) => (
            <li
              key={s.verb}
              className={`flex min-h-[44vh] flex-col justify-start pb-16 pt-6 transition-opacity lg:justify-center duration-500 lg:h-[100vh] lg:py-0 ${
                stage === i ? "opacity-100" : "lg:opacity-30"
              }`}
            >
              <h3 className="type-wide max-w-[20ch] text-[clamp(1.75rem,2.8vw,2.5rem)] font-medium leading-[1.1]">
                {s.title}
              </h3>
              <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-ink-2">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="h-20 lg:h-28" aria-hidden="true" />
    </section>
  );
}
