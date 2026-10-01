"use client";

import { LAYERS, Narrative, SplitStage, layerButton, useLayerCycle } from "./shared";

const GAP = 54; // px between plates in Z
const LIFT = 34; // extra lift for the active plate
const SIZE = 300;

/**
 * Isometric plates. The stack separates so each layer reads as its own
 * surface; the active plate lifts and lights, and data rises through the
 * core from the foundation to execution.
 */
export function V2Isometric() {
  const { ref, active, select, running, held } = useLayerCycle();
  return (
    <div ref={ref}>
      <SplitStage
        narrative={<Narrative active={active} running={running} held={held} showDetails />}
        visual={
          <div className="relative grid min-h-[26rem] grid-cols-1 items-center gap-6 sm:min-h-[34rem] md:grid-cols-[minmax(0,1fr)_14rem]">
            <div className="pointer-events-none absolute left-[10%] top-[30%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,oklch(0.7_0.17_252/26%),transparent_68%)] blur-2xl" aria-hidden="true" />
            <div className="relative grid h-[26rem] place-items-center [perspective:2200px] max-sm:scale-[0.72] sm:h-[34rem]">
              <div
                className="relative [transform-style:preserve-3d]"
                style={{ width: SIZE, height: SIZE, transform: "translateY(110px) rotateX(58deg) rotateZ(-42deg)" }}
              >
                {/* core beam */}
                <div
                  className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
                  style={{ transform: "translate(-50%,-50%)" }}
                  aria-hidden="true"
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className="iso-rise absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-[var(--cyan)] shadow-[0_0_12px_var(--cyan)]"
                      style={{ animationDelay: `${i * 0.8}s`, ["--iso-top" as string]: `${GAP * 4 + LIFT}px` }}
                    />
                  ))}
                </div>
                {LAYERS.map((layer, i) => {
                  const on = i === active;
                  const z = i * GAP + (i > active ? LIFT : 0) + (on ? LIFT / 2 : 0);
                  return (
                    <div
                      key={layer.number}
                      {...layerButton(i, select, `Show ${layer.name}`)}
                      className="absolute inset-0 cursor-pointer outline-none [transform-style:preserve-3d] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{ transform: `translateZ(${z}px)` }}
                    >
                      {/* thickness */}
                      {[1, 2, 3, 4, 5, 6].map((d) => (
                        <div
                          key={d}
                          className={`absolute inset-0 rounded-[22px] ${on ? "bg-[oklch(0.42_0.1_70)]" : "bg-[oklch(0.2_0.05_262)]"}`}
                          style={{ transform: `translateZ(${-d}px)` }}
                        />
                      ))}
                      {/* top face */}
                      <div
                        className={`absolute inset-0 overflow-hidden rounded-[22px] border transition-[background,border-color,box-shadow] duration-700 ${
                          on
                            ? "border-[oklch(0.85_0.12_75/80%)] shadow-[0_0_60px_10px_oklch(0.77_0.155_66/35%)]"
                            : "border-[oklch(0.7_0.17_252/40%)] shadow-[0_0_30px_-4px_oklch(0.7_0.17_252/25%)]"
                        }`}
                        style={{
                          background: on
                            ? "linear-gradient(135deg, oklch(0.36 0.08 70 / 95%), oklch(0.2 0.04 262 / 95%))"
                            : "linear-gradient(135deg, oklch(0.26 0.06 258 / 92%), oklch(0.15 0.03 264 / 92%))",
                        }}
                      >
                        <div className="iso-grid absolute inset-0 opacity-40" />
                        <span className={`absolute left-6 top-5 font-gl-mono text-[0.9rem] tracking-[0.18em] ${on ? "text-gl-gold" : "text-gl-foreground/40"}`}>{layer.number}</span>
                        <span className={`absolute bottom-6 left-6 font-gl-display text-[1.25rem] tracking-[-0.01em] ${on ? "text-gl-foreground" : "text-gl-foreground/55"}`}>
                          {layer.name}
                        </span>
                        <span className={`absolute right-5 top-5 h-2 w-2 rounded-full ${on ? "bg-gl-gold shadow-[0_0_12px_var(--gold)]" : "bg-gl-data/60"}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* legend */}
            <ol className="relative hidden flex-col-reverse gap-3 md:flex">
              {LAYERS.map((layer, i) => {
                const on = i === active;
                return (
                  <li key={layer.number}>
                    <button
                      type="button"
                      onClick={() => select(i)}
                      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all duration-500 ${
                        on ? "border-gl-gold/40 bg-gl-gold/[0.07]" : "border-transparent hover:border-gl-foreground/10"
                      }`}
                    >
                      <span className={`font-gl-mono text-[0.62rem] ${on ? "text-gl-gold" : "text-gl-foreground/35"}`}>{layer.number}</span>
                      <span className={`text-[0.85rem] ${on ? "text-gl-foreground" : "text-gl-foreground/55"}`}>{layer.name}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        }
      />
    </div>
  );
}
