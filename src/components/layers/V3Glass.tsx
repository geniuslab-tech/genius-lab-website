"use client";

import { LAYERS, Narrative, STEP_MS, SplitStage, layerButton, useLayerCycle } from "./shared";

/**
 * Glass panes in depth. The foundation sits furthest back and execution in
 * front; the active pane slides forward out of the stack with its details
 * etched on the glass, the way a layer is pulled out to be read.
 */
export function V3Glass() {
  const { ref, active, select, running, held } = useLayerCycle();
  return (
    <div ref={ref}>
      <SplitStage
        narrative={<Narrative active={active} running={running} held={held} />}
        visual={
          <div className="relative h-[26rem] [perspective:1800px] max-sm:scale-[0.62] sm:h-[34rem]">
            <div className="pointer-events-none absolute right-[8%] top-[18%] h-[24rem] w-[30rem] rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.62_0.19_252/30%),transparent_70%)] blur-3xl" aria-hidden="true" />
            <div
              className="absolute left-1/2 top-1/2 h-[17rem] w-[30rem] [transform-style:preserve-3d]"
              style={{ transform: "translate(-50%,-50%) rotateY(-28deg) rotateX(10deg)" }}
            >
              {LAYERS.map((layer, i) => {
                const on = i === active;
                // back (i=0) to front (i=4)
                const depth = (i - 2) * 70;
                const out = on ? 120 : 0;
                return (
                  <div
                    key={layer.number}
                    {...layerButton(i, select, `Show ${layer.name}`)}
                    className="absolute inset-0 cursor-pointer outline-none transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ transform: `translate3d(${(i - 2) * 30 + (on ? -70 : 0)}px, ${(2 - i) * 34 + (on ? 20 : 0)}px, ${depth + out}px)` }}
                  >
                    <div
                      className={`relative h-full w-full overflow-hidden rounded-[22px] border transition-[background,border-color,box-shadow,opacity] duration-700 ${
                        on
                          ? "border-[oklch(0.9_0.08_80/55%)] shadow-[0_40px_90px_-30px_oklch(0.77_0.155_66/45%),inset_0_1px_0_oklch(1_0_0/35%)]"
                          : "border-[oklch(0.8_0.06_250/22%)] shadow-[inset_0_1px_0_oklch(1_0_0/14%)]"
                      }`}
                      style={{
                        background: on
                          ? "linear-gradient(140deg, oklch(0.4 0.07 75 / 55%), oklch(0.2 0.04 262 / 70%) 55%, oklch(0.16 0.03 264 / 80%))"
                          : "linear-gradient(140deg, oklch(0.32 0.07 252 / 88%), oklch(0.17 0.035 262 / 92%) 60%, oklch(0.13 0.03 264 / 94%))",
                      }}
                    >
                      {/* specular sweep */}
                      <span className="glass-sheen pointer-events-none absolute inset-0" />
                      <div className="relative flex h-full flex-col justify-between p-7">
                        <div className="flex items-center justify-between">
                          <span className={`font-gl-mono text-[0.75rem] tracking-[0.2em] ${on ? "text-gl-gold" : "text-gl-foreground/45"}`}>
                            LAYER {layer.number}
                            {!on ? <span className="ml-3 font-gl-display text-[0.85rem] normal-case tracking-normal text-gl-foreground/60">{layer.name}</span> : null}
                          </span>
                          <span className={`h-2 w-2 rounded-full ${on ? "bg-gl-gold shadow-[0_0_14px_var(--gold)]" : "bg-gl-foreground/25"}`} />
                        </div>
                        <div className={`transition-opacity duration-500 ${on ? "opacity-100" : "opacity-0"}`}>
                          <p className="font-gl-display text-[1.6rem] tracking-[-0.02em] text-gl-foreground">{layer.name}</p>
                          <div className={`mt-4 flex flex-wrap gap-1.5 transition-opacity duration-700 ${on ? "opacity-100" : "opacity-0"}`}>
                            {layer.details.map((d) => (
                              <span key={d} className="rounded-full border border-gl-foreground/20 bg-gl-foreground/[0.06] px-2.5 py-1 font-gl-mono text-[0.56rem] uppercase tracking-[0.1em] text-gl-foreground/80">
                                {d}
                              </span>
                            ))}
                          </div>
                          {on ? (
                            <span className="mt-5 block h-px overflow-hidden bg-gl-foreground/10">
                              <span
                                key={active}
                                className={`block h-px bg-[var(--gold)] ${running && !held ? "layers-progress" : "w-full"}`}
                                style={{ animationDuration: `${STEP_MS}ms` }}
                              />
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* reflection floor */}
            <div className="pointer-events-none absolute inset-x-[10%] bottom-6 h-24 bg-[radial-gradient(ellipse_at_center,oklch(0.7_0.17_252/30%),transparent_70%)] blur-2xl" aria-hidden="true" />
          </div>
        }
      />
    </div>
  );
}
