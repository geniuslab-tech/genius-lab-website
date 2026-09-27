"use client";

import { useCallback, useRef, useState } from "react";
import { FACES, FaceOutcome } from "./LayerFacesV19";
import { clamp01, lerp, smooth, useReduced, useScrollProgress } from "./hooks";
import { SectionHead } from "./ui";

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

/** Where each slab starts before the stack assembles: offset in x, y, z and a twist. */
const SCATTER = [
  { x: -260, y: 180, z: -260, r: -18 },
  { x: 240, y: -120, z: -80, r: 14 },
  { x: -200, y: -220, z: 120, r: 10 },
  { x: 280, y: 200, z: 300, r: -12 },
];

const FOCUS_A = 0.18;
const FOCUS_B = 0.78;
const LOCK_A = 0.8;
const LOCK_B = 0.94;

function Head() {
  return (
    <SectionHead
      n="01"
      id="v19-layers-title"
      kicker="Platform"
      title={<>One intelligence and execution layer across your&nbsp;business.</>}
      lead="Not four products. Every layer is built on the one beneath it, and the top of the stack is a better decision."
    />
  );
}

export function LayersV19() {
  const reduce = useReduced();
  const track = useRef<HTMLDivElement>(null);
  const slabs = useRef<(HTMLDivElement | null)[]>([]);
  const rail = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const [done, setDone] = useState(false);

  const onProgress = useCallback((p: number) => {
    const a = smooth(0, FOCUS_A, p);
    const lock = smooth(LOCK_A, LOCK_B, p);
    const gap = lerp(118, 20, lock);
    const q = clamp01((p - FOCUS_A) / (FOCUS_B - FOCUS_A)) * 4 - 0.5;
    LAYERS.forEach((_, i) => {
      const el = slabs.current[i];
      if (!el) return;
      const s = SCATTER[i];
      const bump = Math.max(0, 1 - Math.abs(q - i)) * (1 - lock);
      const lift = smooth(0, 1, bump) * 70;
      const x = s.x * (1 - a);
      const y = s.y * (1 - a) - lift * 0.35;
      const z = (i - 1.5) * gap + s.z * (1 - a) + lift;
      const r = s.r * (1 - a);
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateZ(${r.toFixed(2)}deg)`;
      el.style.opacity = (0.25 + 0.75 * a).toFixed(3);
    });
    const out = slabs.current[4];
    if (out) {
      out.style.transform = `translate3d(0, ${(-30 * (1 - lock)).toFixed(1)}px, ${(2.5 * gap + 26 + 160 * (1 - lock)).toFixed(1)}px)`;
      out.style.opacity = lock.toFixed(3);
    }
    rail.current?.style.setProperty("transform", `scaleY(${clamp01((p - FOCUS_A) / (LOCK_B - FOCUS_A)).toFixed(3)})`);
    setActive(Math.max(0, Math.min(3, Math.floor(clamp01((p - FOCUS_A) / (FOCUS_B - FOCUS_A)) * 4))));
    setDone(p >= LOCK_A + 0.04);
  }, []);
  useScrollProgress(track, onProgress, !reduce);

  const jump = (i: number) => {
    const el = track.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const at = i < 4 ? FOCUS_A + ((i + 0.5) / 4) * (FOCUS_B - FOCUS_A) : LOCK_B;
    window.scrollTo({ top: top + span * at, behavior: "smooth" });
  };

  if (reduce) {
    return (
      <section id="layers" className="scroll-mt-16 py-24 sm:py-32" aria-labelledby="v19-layers-title">
        <div className="v19-wrap">
          <Head />
          <ol className="mt-14 grid gap-4 md:grid-cols-2" aria-label="Layers, foundation first">
            {LAYERS.map((x, i) => {
              const Face = FACES[i];
              return (
                <li key={x.n} className="v19-panel overflow-hidden">
                  <div className="h-[300px] border-b border-[color:var(--line)]" aria-hidden="true">
                    <Face />
                  </div>
                  <div className="p-6">
                    <h3 className="v19-h3 text-[1.375rem]">{x.name}</h3>
                    <p className="mt-1 text-[color:var(--acc-2)]">{x.role}</p>
                    <p className="mt-3 text-[color:var(--tx-2)]">{x.body}</p>
                    <p className="v19-mono mt-4 text-[0.75rem] text-[color:var(--tx-3)]">{x.gives.join(" · ")}</p>
                  </div>
                </li>
              );
            })}
            <li className="v19-panel p-6 md:col-span-2">
              <p className="v19-label text-[color:var(--warm)]">The outcome</p>
              <h3 className="v19-h3 mt-3 text-[1.75rem]">{OUTCOME.name}</h3>
              <p className="mt-2 max-w-[60ch] text-[color:var(--tx-2)]">{OUTCOME.body}</p>
            </li>
          </ol>
        </div>
      </section>
    );
  }

  const L = LAYERS[active];

  return (
    <section id="layers" className="relative scroll-mt-16 pt-24 sm:pt-32" aria-labelledby="v19-layers-title">
      <div className="v19-wrap">
        <Head />
      </div>

      <div ref={track} className="relative h-[440svh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden pt-16">
          <div className="v19-wrap grid h-full grid-rows-[auto_1fr] gap-2 py-4 lg:grid-cols-12 lg:grid-rows-1 lg:gap-10 lg:py-8">
            {/* Narration. */}
            <div className="lg:col-span-5 lg:flex lg:flex-col lg:justify-center">
              <div className="relative hidden lg:block">
                <span className="absolute bottom-3 left-0 top-3 w-px bg-[color:var(--line-2)]" aria-hidden="true" />
                <span ref={rail} className="absolute bottom-3 left-0 top-3 w-px origin-top scale-y-0 bg-[linear-gradient(var(--acc),var(--acc)_85%,var(--warm))]" aria-hidden="true" />
                <ol aria-label="Layers, foundation first">
                  {LAYERS.map((x, i) => {
                    const on = i === active && !done;
                    return (
                      <li key={x.n}>
                        <button type="button" onClick={() => jump(i)} aria-current={on ? "step" : undefined} className="group w-full py-3 pl-7 text-left">
                          <span className="flex items-baseline gap-4">
                            <span className={`v19-label transition-colors duration-300 ${on ? "text-[color:var(--acc-2)]" : "text-[color:var(--tx-3)]"}`}>{x.n}</span>
                            <span className={`v19-h3 text-[1.375rem] transition-colors duration-300 ${on ? "text-white" : "text-[color:var(--tx-3)] group-hover:text-[color:var(--tx-2)]"}`}>{x.name}</span>
                          </span>
                          <span className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease)] ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                            <span className="overflow-hidden">
                              <span className="block pt-2 font-medium text-[color:var(--acc-2)]">{x.role}</span>
                              <span className="block pt-1 leading-[1.65] text-[color:var(--tx-2)]">{x.body}</span>
                              <span className="mt-3 flex flex-wrap gap-1.5">
                                {x.gives.map((g) => (
                                  <span key={g} className="v19-mono rounded-[4px] border border-[color:var(--line-2)] px-2 py-0.5 text-[0.6875rem] text-[color:var(--tx-2)]">
                                    {g}
                                  </span>
                                ))}
                              </span>
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                  <li>
                    <button type="button" onClick={() => jump(4)} aria-current={done ? "step" : undefined} className="w-full py-3 pl-7 text-left">
                      <span className="flex items-baseline gap-4">
                        <span className={`v19-label ${done ? "text-[color:var(--warm)]" : "text-[color:var(--tx-3)]"}`}>=</span>
                        <span className={`v19-h3 text-[1.375rem] transition-colors duration-300 ${done ? "text-white" : "text-[color:var(--tx-3)]"}`}>{OUTCOME.name}</span>
                      </span>
                      <span className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease)] ${done ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                        <span className="overflow-hidden">
                          <span className="block pt-2 leading-[1.65] text-[color:var(--tx-2)]">{OUTCOME.body}</span>
                        </span>
                      </span>
                    </button>
                  </li>
                </ol>
              </div>

              {/* Compact caption on small screens. */}
              <div className="lg:hidden" aria-live="polite">
                <p className={`v19-label ${done ? "text-[color:var(--warm)]" : "text-[color:var(--acc-2)]"}`}>{done ? "The outcome" : `Layer ${L.n} of 04`}</p>
                <p className="v19-h3 mt-2 text-[1.375rem]">{done ? OUTCOME.name : L.name}</p>
                <p className="mt-1 text-[0.9375rem] leading-snug text-[color:var(--tx-2)]">{done ? OUTCOME.body : `${L.role} ${L.body}`}</p>
              </div>
            </div>

            {/* The stack. */}
            <div className="v19-lstage min-h-0 lg:col-span-7" aria-hidden="true">
              <div className="pointer-events-none absolute left-1/2 top-[58%] h-[40%] w-[70%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(var(--acc-rgb)/0.22),transparent)] blur-2xl" />
              <div className="v19-lrig">
                {LAYERS.map((x, i) => {
                  const Face = FACES[i];
                  return (
                    <div
                      key={x.n}
                      ref={(el) => void (slabs.current[i] = el)}
                      className="v19-slab"
                      data-on={(i === active && !done) || undefined}
                      style={{ transform: `translate3d(${SCATTER[i].x}px, ${SCATTER[i].y}px, ${(i - 1.5) * 118 + SCATTER[i].z}px)`, opacity: 0.25 }}
                    >
                      <div className="v19-slab-edge" />
                      <div className="v19-slab-face">
                        <Face />
                      </div>
                    </div>
                  );
                })}
                <div ref={(el) => void (slabs.current[4] = el)} className="v19-slab" data-warm="" style={{ opacity: 0 }}>
                  <div className="v19-slab-edge" />
                  <div className="v19-slab-face">
                    <FaceOutcome />
                  </div>
                </div>
              </div>
              <p className="v19-label absolute bottom-1 right-0 text-[color:var(--tx-3)]">{done ? "Assembled" : "Exploded view"} · illustrative</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
