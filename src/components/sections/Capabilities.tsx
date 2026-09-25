"use client";

import { useId, useMemo, useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { contourAt, contourGenerator, contourPath, hillsAt, thresholds } from "@/lib/terrain";

type Cap = { name: string; code: string; body: string; items: string[]; Figure: () => React.ReactElement };

const draw = "[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-[1400ms] ease-[var(--ease-out-expo)] group-data-[open=true]/cap:[stroke-dashoffset:0]";

function PipelineFigure() {
  const rows = [60, 130, 200, 270];
  return (
    <svg viewBox="0 0 520 330" className="h-full w-full" aria-hidden="true">
      {rows.map((y, i) => (
        <path key={i} pathLength={1} className={draw} d={`M20,${y} C140,${y} 170,165 260,165`} fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />
      ))}
      <path pathLength={1} className={draw} d="M260,165 H380 M380,165 C430,165 440,95 500,95 M380,165 C430,165 440,235 500,235" fill="none" stroke="var(--color-survey)" strokeWidth="1.8" />
      {rows.map((y, i) => (
        <rect key={i} x="14" y={y - 6} width="12" height="12" fill="var(--color-ink)" />
      ))}
      <rect x="248" y="153" width="24" height="24" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1.5" />
      <rect x="368" y="153" width="24" height="24" fill="var(--color-survey)" />
      <rect x="494" y="89" width="12" height="12" fill="var(--color-survey)" />
      <rect x="494" y="229" width="12" height="12" fill="var(--color-survey)" />
      {["ingest", "model", "serve"].map((t, i) => (
        <text key={t} x={[20, 250, 380][i]} y="316" className="type-mono fill-ink-3 text-[13px]">
          {t}
        </text>
      ))}
    </svg>
  );
}

function DistributionFigure() {
  const bars = [4, 9, 17, 28, 39, 46, 42, 33, 22, 13, 7, 3];
  const curve = bars.map((_, i) => {
    const x = 40 + i * 38 + 15;
    const v = 46 * Math.exp(-((i - 5.4) ** 2) / (2 * 2.3 ** 2));
    return `${i ? "L" : "M"}${x},${(290 - v * 5.2).toFixed(1)}`;
  });
  return (
    <svg viewBox="0 0 520 330" className="h-full w-full" aria-hidden="true">
      <path d="M30,290H500" stroke="var(--color-ink)" strokeWidth="1" />
      {bars.map((b, i) => (
        <rect
          key={i}
          x={40 + i * 38}
          y={290 - b * 5.2}
          width="30"
          height={b * 5.2}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="1"
          className="origin-bottom scale-y-0 transition-transform duration-700 ease-[var(--ease-out-expo)] [transform-box:fill-box] group-data-[open=true]/cap:scale-y-100"
          style={{ transitionDelay: `${i * 35}ms` }}
        />
      ))}
      <path pathLength={1} className={draw} d={curve.join("")} fill="none" stroke="var(--color-survey)" strokeWidth="2" />
      <text x="30" y="318" className="type-mono fill-ink-3 text-[13px]">
        distribution of order value
      </text>
    </svg>
  );
}

function MultiplesFigure() {
  const series = [
    [5, 7, 6, 9, 8, 11, 12],
    [9, 8, 8, 6, 7, 5, 4],
    [4, 6, 9, 8, 10, 9, 11],
    [6, 6, 7, 7, 6, 8, 9],
    [3, 5, 4, 7, 9, 12, 14],
    [8, 9, 7, 8, 6, 7, 6],
  ];
  return (
    <svg viewBox="0 0 520 330" className="h-full w-full" aria-hidden="true">
      {series.map((s, k) => {
        const ox = 20 + (k % 3) * 168;
        const oy = 20 + Math.floor(k / 3) * 150;
        const d = s.map((v, i) => `${i ? "L" : "M"}${ox + 10 + i * 22},${oy + 110 - v * 7}`).join("");
        return (
          <g key={k}>
            <rect x={ox} y={oy} width="150" height="128" fill="none" stroke="var(--color-rule-strong)" />
            <path pathLength={1} className={draw} d={d} fill="none" stroke={k === 4 ? "var(--color-survey)" : "var(--color-ink)"} strokeWidth={k === 4 ? 2 : 1.3} style={{ transitionDelay: `${k * 80}ms` }} />
          </g>
        );
      })}
    </svg>
  );
}

function DescentFigure() {
  const { paths, route } = useMemo(() => {
    const cols = 104;
    const rows = 66;
    const hills = [
      { x: 0.72, y: 0.62, h: -1, r: 0.2 },
      { x: 0.25, y: 0.3, h: 0.6, r: 0.18 },
      { x: 0.4, y: 0.8, h: -0.35, r: 0.14 },
    ];
    const values = new Float64Array(cols * rows);
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) values[j * cols + i] = hillsAt(hills, i / cols, j / rows, cols / rows);
    const gen = contourGenerator().size([cols, rows]);
    const paths = thresholds(-0.95, 0.55, 9).map((t) => contourPath(contourAt(gen, values, t), 5));
    const route = [
      [95, 70], [140, 98], [190, 122], [238, 150], [284, 178], [322, 199], [350, 212], [366, 218], [372, 220],
    ];
    return { paths, route };
  }, []);
  return (
    <svg viewBox="0 0 520 330" className="h-full w-full" aria-hidden="true">
      {paths.map((d, i) => (
        <path key={i} pathLength={1} d={d} className={draw} fill="none" stroke="var(--color-ink)" strokeOpacity={0.55} strokeWidth="1" style={{ transitionDelay: `${i * 40}ms` }} />
      ))}
      <path pathLength={1} className={draw} d={route.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join("")} fill="none" stroke="var(--color-survey)" strokeWidth="1.8" style={{ transitionDelay: "300ms" }} />
      {route.map(([x, y], i) => (
        <rect key={i} x={x - 3} y={y - 3} width="6" height="6" fill="var(--color-survey)" className="opacity-0 transition-opacity duration-300 group-data-[open=true]/cap:opacity-100" style={{ transitionDelay: `${500 + i * 90}ms` }} />
      ))}
      <text x="382" y="244" className="type-mono fill-ink-2 text-[13px]">
        loss minimum
      </text>
    </svg>
  );
}

const CAPS: Cap[] = [
  {
    name: "Data Engineering",
    code: "DE",
    body: "Text text text. Reliable pipelines from every source into a governed lakehouse, tested like software.",
    items: ["Batch and streaming ingestion", "Lakehouse architecture", "dbt transformation", "Observability and quality"],
    Figure: PipelineFigure,
  },
  {
    name: "Analytics",
    code: "AN",
    body: "Text text text. Rigorous analysis that explains what moved, why it moved, and how sure we are.",
    items: ["Exploratory analysis", "Experiment design", "Segmentation", "Causal inference"],
    Figure: DistributionFigure,
  },
  {
    name: "Business Intelligence",
    code: "BI",
    body: "Text text text. A single semantic layer, so every chart in the company agrees with every other chart.",
    items: ["Semantic modelling", "Executive dashboards", "Embedded reporting", "Metric governance"],
    Figure: MultiplesFigure,
  },
  {
    name: "Artificial Intelligence",
    code: "AI",
    body: "Text text text. Models in production, measured against the business outcome they were built for.",
    items: ["Forecasting", "Recommendation", "LLM and retrieval systems", "MLOps"],
    Figure: DescentFigure,
  },
];

export function Capabilities() {
  const [open, setOpen] = useState(0);
  const base = useId();

  return (
    <section id="capabilities" className="scroll-mt-16 py-28 sm:py-36 lg:py-44" aria-labelledby="cap-title">
      <div className="shell">
        <h2 id="cap-title" data-reveal="up" className="type-display max-w-[16ch] text-[clamp(2.25rem,4.6vw,4.25rem)]">
          Four disciplines. One chain.
        </h2>

        <div className="mt-16 border-b border-rule-strong lg:mt-24">
          {CAPS.map((c, i) => {
            const isOpen = open === i;
            const panelId = `${base}-panel-${i}`;
            return (
              <div key={c.code} data-open={isOpen} className="group/cap border-t border-rule-strong">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-8"
                  >
                    <span
                      className={`type-display block text-[clamp(1.75rem,5vw,4.75rem)] transition-[font-variation-settings,color] duration-500 ease-[var(--ease-out-expo)] ${
                        isOpen ? "text-survey [font-variation-settings:'wdth'_125]" : "text-ink [font-variation-settings:'wdth'_100] group-hover:[font-variation-settings:'wdth'_125]"
                      }`}
                    >
                      {c.name}
                    </span>
                    <span className="flex shrink-0 items-center gap-5">
                      <span className="inline-flex h-11 w-11 items-center justify-center border border-rule-strong transition-colors group-hover:border-ink">
                        <Plus
                          size={18}
                          className={`transition-transform duration-500 ease-[var(--ease-out-expo)] ${isOpen ? "rotate-45" : ""}`}
                        />
                      </span>
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-label={c.name}
                  className={`grid transition-[grid-template-rows] duration-700 ease-[var(--ease-out-expo)] ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`grid gap-10 pb-12 pt-2 transition-opacity duration-500 md:grid-cols-12 lg:pb-16 ${
                        isOpen ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="md:col-span-5">
                        <p className="max-w-[42ch] text-lg leading-relaxed text-ink-2">{c.body}</p>
                        <ul className="mt-8 grid grid-cols-1 gap-x-6 sm:grid-cols-2 md:grid-cols-1">
                          {c.items.map((it) => (
                            <li key={it} className="flex items-center gap-3 border-t border-rule py-3 text-[0.9375rem]">
                              <span className="h-1.5 w-1.5 bg-ink" aria-hidden="true" />
                              {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="aspect-[52/33] md:col-span-6 md:col-start-7">
                        <c.Figure />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
