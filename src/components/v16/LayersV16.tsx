"use client";

import { useCallback, useRef, useState, type CSSProperties, type ReactNode, type Ref } from "react";
import { ChartLineUp, Database, PresentationChart, Sparkle, Target } from "@phosphor-icons/react/dist/ssr";
import { smooth, useReduced, useScrollProgress } from "./hooks";
import { SectionHead } from "./ui";

const LAYERS = [
  {
    n: "01",
    Icon: Database,
    name: "Data Engineering",
    role: "The foundation.",
    body: "We connect your systems and engineer their data into one governed, reliable foundation: integration, pipelines, modeling and quality.",
    gives: ["Connected systems", "A unified data platform", "Trusted, tested pipelines"],
  },
  {
    n: "02",
    Icon: ChartLineUp,
    name: "Analytics",
    role: "Organized data becomes understanding.",
    body: "Analysis and modeling explain what is happening, why it is happening and what is likely to happen next.",
    gives: ["Performance analysis", "Forecasts and drivers", "Customer and operational insight"],
  },
  {
    n: "03",
    Icon: PresentationChart,
    name: "Business Intelligence",
    role: "Understanding becomes visible.",
    body: "One set of definitions behind every dashboard and report, so leadership sees the same numbers, at the same time.",
    gives: ["Executive dashboards", "Shared metrics and KPIs", "Self-service reporting"],
  },
  {
    n: "04",
    Icon: Sparkle,
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

/** Progress at which each layer takes focus, and when the outcome arrives. */
const layerAt = (p: number) => Math.min(3, Math.floor((p / 0.8) * 4));
const OUTCOME_AT = 0.84;

function Header() {
  return (
    <SectionHead
      n="01"
      id="v16-layers-title"
      kicker="Platform"
      title={<>One intelligence and execution layer across your&nbsp;business.</>}
      lead="Not four products. Every layer is built on the one beneath it, and the top of the stack is a better decision."
    />
  );
}

function Slab({ i, on, children, outcome, ref, hidden }: { i: number; on?: boolean; outcome?: boolean; hidden?: boolean; children: ReactNode; ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className="v16-slab" style={{ "--i": i, opacity: hidden ? 0 : undefined } as CSSProperties} data-on={on || undefined} data-outcome={outcome || undefined}>
      <div className="v16-slab-shadow" aria-hidden="true" />
      <div className="v16-slab-edge" aria-hidden="true" />
      <div className="v16-slab-face flex items-center justify-between gap-4 overflow-hidden px-4 sm:px-6">{children}</div>
    </div>
  );
}

export function LayersV16() {
  const reduce = useReduced();
  const track = useRef<HTMLDivElement>(null);
  const rig = useRef<HTMLDivElement>(null);
  const outcomeRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [done, setDone] = useState(false);

  const onProgress = useCallback((p: number) => {
    const t = smooth(0.08, 0.78, p);
    rig.current?.style.setProperty("--t", t.toFixed(4));
    if (outcomeRef.current) {
      const o = smooth(0.78, 0.9, p);
      outcomeRef.current.style.opacity = o.toFixed(3);
    }
    setActive(layerAt(p));
    setDone(p >= OUTCOME_AT);
  }, []);
  useScrollProgress(track, onProgress, !reduce);

  const jump = (i: number) => {
    const el = track.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + span * ((i + 0.5) / 4) * 0.8 });
  };

  if (reduce) {
    return (
      <section id="layers" className="scroll-mt-16 py-24 sm:py-32" aria-labelledby="v16-layers-title">
        <div className="v16-wrap">
          <Header />
          <ol className="mt-14 grid gap-3 sm:grid-cols-2" aria-label="Layers, foundation first">
            {LAYERS.map(({ n, Icon, name, role, body, gives }) => (
              <li key={n} className="v16-panel p-6">
                <div className="flex items-center justify-between">
                  <span className="v16-label text-[color:var(--ice)]">Layer {n}</span>
                  <Icon size={20} className="text-[color:var(--ice)]" aria-hidden="true" />
                </div>
                <h3 className="v16-display mt-6 text-[1.5rem]">{name}</h3>
                <p className="mt-1 font-medium text-[color:var(--ice-2)]">{role}</p>
                <p className="mt-3 text-[color:var(--tx-2)]">{body}</p>
                <p className="v16-mono mt-4 text-[0.75rem] text-[color:var(--tx-3)]">{gives.join(" · ")}</p>
              </li>
            ))}
            <li className="v16-panel p-6 sm:col-span-2">
              <span className="v16-label text-[color:var(--warm)]">The outcome</span>
              <h3 className="v16-display mt-4 text-[1.75rem]">{OUTCOME.name}</h3>
              <p className="mt-2 max-w-[60ch] text-[color:var(--tx-2)]">{OUTCOME.body}</p>
            </li>
          </ol>
        </div>
      </section>
    );
  }

  const L = LAYERS[active];

  return (
    <section id="layers" className="scroll-mt-16 pt-24 sm:pt-32" aria-labelledby="v16-layers-title">
      <div className="v16-wrap">
        <Header />
      </div>

      <div ref={track} className="relative h-[340svh]">
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-16">
          <div className="v16-wrap grid h-full w-full grid-rows-[auto_1fr] gap-4 py-4 lg:grid-cols-12 lg:grid-rows-1 lg:gap-10 lg:py-10">
            {/* Narration: one layer in focus at a time. */}
            <div className="lg:col-span-5 lg:flex lg:flex-col lg:justify-center">
              <ol className="hidden space-y-1 lg:block" aria-label="Layers, foundation first">
                {LAYERS.map((x, i) => {
                  const on = i === active && !done;
                  return (
                    <li key={x.n}>
                      <button
                        type="button"
                        onClick={() => jump(i)}
                        aria-current={on ? "step" : undefined}
                        className={`w-full border-l py-3 pl-5 text-left transition-colors duration-300 ${on ? "border-[color:var(--ice)]" : "border-[color:var(--line)] hover:border-[color:var(--line-2)]"}`}
                      >
                        <span className="flex items-baseline gap-4">
                          <span className={`v16-label ${on ? "text-[color:var(--ice)]" : "text-[color:var(--tx-3)]"}`}>{x.n}</span>
                          <span className={`v16-display text-[1.375rem] transition-colors ${on ? "text-white" : "text-[color:var(--tx-3)]"}`}>{x.name}</span>
                        </span>
                        <span className={`grid transition-[grid-template-rows,opacity] duration-500 ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                          <span className="overflow-hidden">
                            <span className="block pt-2 font-medium text-[color:var(--ice-2)]">{x.role}</span>
                            <span className="block pt-1 leading-[1.65] text-[color:var(--tx-2)]">{x.body}</span>
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
                <li className={`border-l py-3 pl-5 transition-colors duration-300 ${done ? "border-[color:var(--warm)]" : "border-[color:var(--line)]"}`}>
                  <span className="flex items-baseline gap-4">
                    <span className={`v16-label ${done ? "text-[color:var(--warm)]" : "text-[color:var(--tx-3)]"}`}>=</span>
                    <span className={`v16-display text-[1.375rem] ${done ? "text-white" : "text-[color:var(--tx-3)]"}`}>{OUTCOME.name}</span>
                  </span>
                  <span className={`grid transition-[grid-template-rows,opacity] duration-500 ${done ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <span className="overflow-hidden">
                      <span className="block pt-2 leading-[1.65] text-[color:var(--tx-2)]">{OUTCOME.body}</span>
                    </span>
                  </span>
                </li>
              </ol>

              {/* Compact caption on small screens. */}
              <div className="lg:hidden" aria-live="polite">
                <p className={`v16-label ${done ? "text-[color:var(--warm)]" : "text-[color:var(--ice)]"}`}>{done ? "The outcome" : `Layer ${L.n} of 04`}</p>
                <p className="v16-display mt-2 text-[1.375rem]">{done ? OUTCOME.name : L.name}</p>
                <p className="mt-1 text-[0.9375rem] leading-snug text-[color:var(--tx-2)]">{done ? OUTCOME.body : L.role}</p>
              </div>
            </div>

            {/* The stack itself. */}
            <div className="v16-stage-3d relative min-h-0 lg:col-span-7" aria-hidden="true">
              <div ref={rig} className="v16-rig">
                {LAYERS.map((x, i) => {
                  const Icon = x.Icon;
                  const on = i === active && !done;
                  return (
                    <Slab key={x.n} i={i} on={on}>
                      <div className="min-w-0">
                        <p className={`v16-label ${on ? "text-[color:var(--ice)]" : "text-[color:var(--tx-3)]"}`}>Layer {x.n}</p>
                        <p className="v16-display mt-1.5 truncate text-[1.0625rem] sm:text-[1.3125rem]">{x.name}</p>
                        <p className="v16-mono mt-1.5 hidden truncate text-[0.6875rem] text-[color:var(--tx-3)] sm:block">{x.gives.join(" · ")}</p>
                      </div>
                      <span className={`v16-hex inline-flex h-10 w-11 shrink-0 items-center justify-center transition-colors duration-300 sm:h-12 sm:w-[3.4rem] ${on ? "bg-[color:var(--ice)] text-[color:var(--g1)]" : "bg-[rgb(143_220_255/0.1)] text-[color:var(--ice)]"}`}>
                        <Icon size={20} />
                      </span>
                    </Slab>
                  );
                })}
                <Slab i={4} outcome hidden ref={outcomeRef}>
                    <div className="min-w-0">
                      <p className="v16-label text-[color:var(--warm)]">The outcome</p>
                      <p className="v16-display mt-1.5 truncate text-[1.0625rem] sm:text-[1.3125rem]">{OUTCOME.name}</p>
                    </div>
                    <span className="v16-hex inline-flex h-10 w-11 shrink-0 items-center justify-center bg-[color:var(--warm)] text-[color:var(--g1)] sm:h-12 sm:w-[3.4rem]">
                      <Target size={20} />
                    </span>
                </Slab>
              </div>
              <p className="v16-label absolute bottom-2 right-0 text-[color:var(--tx-3)]">{done ? "Flat stack" : "Exploded view"} · scroll</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
