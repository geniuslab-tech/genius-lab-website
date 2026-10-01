"use client";

import { LAYERS, Narrative, STEP_MS, SplitStage, layerButton, useLayerCycle } from "./shared";

const WIDTHS = [100, 94, 88, 82, 76];
const SHAPE = "polygon(3% 0, 97% 0, 100% 76%, 97% 100%, 3% 100%, 0 76%)";

/**
 * The original stacked-slab story, refined: real hairline borders that follow
 * the chamfer, a timer line on the active slab, data packets rising through
 * the stack, and detail chips in the narrative.
 */
export function V1Refined() {
  const { ref, active, select, running, held } = useLayerCycle();
  return (
    <div ref={ref}>
      <SplitStage
        narrative={<Narrative active={active} running={running} held={held} showDetails />}
        visual={
          <div className="relative mx-auto w-full max-w-[56rem]">
            <div className="pointer-events-none absolute inset-x-[14%] bottom-0 h-[24rem] rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.7_0.17_252/22%),transparent_70%)] blur-2xl" aria-hidden="true" />

            {/* rising data packets through the centre of the stack */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-24 -translate-x-1/2" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className="layers-rise absolute bottom-6 h-1.5 w-1.5 rounded-full bg-[var(--cyan)] shadow-[0_0_10px_var(--cyan)]"
                  style={{ left: `${18 + ((i * 37) % 64)}%`, animationDelay: `${i * 0.9}s` }}
                />
              ))}
            </div>

            <div className="relative flex min-h-[30rem] flex-col-reverse justify-center gap-3 py-2">
              {LAYERS.map((layer, i) => {
                const on = i === active;
                const below = i < active;
                return (
                  <div
                    key={layer.number}
                    {...layerButton(i, select, `Show ${layer.name}`)}
                    className={`group relative mx-auto h-[5.2rem] cursor-pointer transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none ${
                      on ? "z-10 -translate-y-1" : "z-0"
                    }`}
                    style={{ width: `${WIDTHS[i]}%` }}
                  >
                    {/* active glow */}
                    <div
                      className={`absolute -inset-3 rounded-[2rem] blur-2xl transition-opacity duration-700 ${on ? "opacity-100" : "opacity-0"} bg-[radial-gradient(ellipse_at_center,oklch(0.77_0.155_66/30%),transparent_70%)]`}
                      aria-hidden="true"
                    />
                    {/* border shell, then fill inset by 1px so the hairline follows the chamfer */}
                    <div
                      className={`absolute inset-0 transition-colors duration-700 ${
                        on ? "bg-[oklch(0.77_0.155_66/75%)]" : below ? "bg-[oklch(0.7_0.17_252/55%)]" : "bg-[oklch(0.7_0.17_252/30%)] group-hover:bg-[oklch(0.7_0.17_252/55%)]"
                      }`}
                      style={{ clipPath: SHAPE }}
                    />
                    <div
                      className="absolute inset-px overflow-hidden transition-[background] duration-700"
                      style={{
                        clipPath: SHAPE,
                        background: on
                          ? "linear-gradient(90deg, oklch(0.15 0.032 264), oklch(0.3 0.07 70 / 70%) 50%, oklch(0.15 0.032 264))"
                          : "linear-gradient(90deg, oklch(0.14 0.03 264), oklch(0.22 0.06 258) 50%, oklch(0.14 0.03 264))",
                      }}
                    >
                      {/* top highlight */}
                      <span
                        className={`absolute inset-x-[4%] top-0 h-px transition-opacity duration-700 ${
                          on ? "bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" : "bg-gradient-to-r from-transparent via-[oklch(0.7_0.17_252/50%)] to-transparent opacity-60"
                        }`}
                      />
                      {/* travelling signal on idle slabs */}
                      {!on ? (
                        <span className="absolute inset-x-[4%] top-0 h-px overflow-hidden">
                          <span className="layers-signal block h-px w-1/3 bg-gradient-to-r from-transparent via-[var(--data)] to-transparent" style={{ animationDelay: `${i * 1.7}s` }} />
                        </span>
                      ) : null}
                      {/* timer line on the active slab */}
                      {on ? (
                        <span className="absolute inset-x-[4%] bottom-0 h-[2px] overflow-hidden bg-gl-foreground/5">
                          <span
                            key={`${active}`}
                            className={`absolute inset-y-0 left-0 bg-gradient-to-r from-[oklch(0.77_0.155_66/40%)] to-[var(--gold)] ${running && !held ? "layers-progress" : "w-full"}`}
                            style={{ animationDuration: `${STEP_MS}ms` }}
                          />
                        </span>
                      ) : null}
                      <div className="relative flex h-full min-w-0 items-center gap-5 px-[7%]">
                        <span className={`shrink-0 font-gl-mono text-[0.8rem] tracking-[0.16em] transition-colors duration-700 ${on ? "text-gl-gold" : below ? "text-gl-data" : "text-gl-foreground/35"}`}>
                          {layer.number}
                        </span>
                        <span className={`shrink-0 font-gl-display text-[1.2rem] tracking-[-0.01em] transition-colors duration-700 ${on ? "text-gl-foreground" : "text-gl-foreground/70"}`}>
                          {layer.name}
                        </span>
                        <span className="h-px flex-1 bg-gl-foreground/10" />
                        <span
                          className={`hidden min-w-0 max-w-[62%] shrink text-right font-gl-mono text-[0.6rem] uppercase leading-[1.6] tracking-[0.08em] [text-wrap:balance] transition-colors duration-700 md:block ${
                            on ? "text-gl-gold" : "text-gl-foreground/45"
                          }`}
                        >
                          {layer.details.join(" · ")}
                        </span>
                      </div>
                    </div>
                    {/* slab underside */}
                    <div
                      className={`absolute inset-x-[4%] -bottom-[7px] h-[7px] transition-colors duration-700 ${on ? "bg-[oklch(0.45_0.1_70/60%)]" : "bg-[oklch(0.2_0.05_262)]"}`}
                      style={{ clipPath: "polygon(0 0, 100% 0, 97% 100%, 3% 100%)" }}
                      aria-hidden="true"
                    />
                  </div>
                );
              })}
            </div>
            {/* plinth */}
            <div className="mx-auto mt-3 h-px w-[90%] bg-gradient-to-r from-transparent via-[oklch(0.7_0.17_252/50%)] to-transparent" aria-hidden="true" />
          </div>
        }
      />
    </div>
  );
}
