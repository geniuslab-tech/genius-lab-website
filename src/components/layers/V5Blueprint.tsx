"use client";

import { LAYERS, Narrative, SplitStage, layerButton, useLayerCycle } from "./shared";

const FLOOR_H = 84;

/**
 * An architectural section. The operating system drawn as a building: each
 * layer is a floor whose rooms are its capabilities, data enters at ground
 * level, a lift carries it up to the active floor, and action leaves the roof.
 */
export function V5Blueprint() {
  const { ref, active, select, running, held } = useLayerCycle();
  return (
    <div ref={ref}>
      <SplitStage
        narrative={<Narrative active={active} running={running} held={held} />}
        visual={
          <div className="blueprint relative overflow-hidden rounded-2xl border border-[oklch(0.7_0.17_252/22%)] p-4 sm:p-8 sm:pr-20">
            {/* roof: action leaves the building */}
            <div className="relative ml-[76px] flex h-14 items-end justify-center gap-10" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span key={i} className="relative h-12 w-px overflow-hidden bg-[oklch(0.77_0.155_66/18%)]">
                  <span className={`bp-up absolute inset-x-0 h-4 bg-gradient-to-t from-transparent to-[var(--gold)] ${active === 4 ? "opacity-100" : "opacity-30"}`} style={{ animationDelay: `${i * 0.4}s` }} />
                </span>
              ))}
              <span className="absolute -top-1 right-0 font-gl-mono text-[0.55rem] uppercase tracking-[0.2em] text-gl-gold/70">Action out</span>
            </div>

            <div className="relative flex">
              {/* lift shaft */}
              <div className="relative mr-4 w-[60px] shrink-0 border-x border-dashed border-[oklch(0.7_0.17_252/35%)]" style={{ height: FLOOR_H * 5 }} aria-hidden="true">
                <span
                  className="absolute inset-x-2 h-[52px] rounded-md border border-[var(--gold)] bg-[oklch(0.77_0.155_66/14%)] shadow-[0_0_24px_-4px_oklch(0.77_0.155_66/60%)] transition-[bottom] duration-[1100ms] ease-[cubic-bezier(0.65,0,0.25,1)]"
                  style={{ bottom: active * FLOOR_H + (FLOOR_H - 52) / 2 }}
                >
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gl-gold/60" />
                </span>
                <span className="absolute -left-6 bottom-0 top-0 flex flex-col-reverse justify-between py-1 font-gl-mono text-[0.5rem] text-[oklch(0.7_0.17_252/60%)]">
                  {LAYERS.map((l) => (
                    <span key={l.number}>L{l.number}</span>
                  ))}
                </span>
              </div>

              {/* floors */}
              <div className="flex flex-1 flex-col-reverse">
                {LAYERS.map((layer, i) => {
                  const on = i === active;
                  const lit = i <= active;
                  return (
                    <div
                      key={layer.number}
                      {...layerButton(i, select, `Show ${layer.name}`)}
                      className={`relative flex cursor-pointer items-stretch gap-2 border-t px-3 py-3 outline-none transition-colors duration-700 ${
                        on ? "border-[var(--gold)] bg-[oklch(0.77_0.155_66/6%)]" : "border-[oklch(0.7_0.17_252/40%)] hover:bg-[oklch(0.7_0.17_252/4%)]"
                      }`}
                      style={{ height: FLOOR_H }}
                    >
                      <div className="flex w-[9.5rem] shrink-0 flex-col justify-center">
                        <span className={`font-gl-mono text-[0.55rem] tracking-[0.2em] ${on ? "text-gl-gold" : "text-[oklch(0.7_0.17_252/80%)]"}`}>LVL {layer.number}</span>
                        <span className={`mt-1 text-[0.82rem] leading-tight ${on ? "text-gl-foreground" : "text-gl-foreground/60"}`}>{layer.name}</span>
                      </div>
                      <div className="hidden min-w-0 flex-1 gap-1.5 sm:flex">
                        {layer.details.slice(0, 5).map((d, k) => (
                          <span
                            key={d}
                            className={`flex min-w-0 flex-1 items-end rounded-[3px] border px-1.5 pb-1 font-gl-mono text-[0.48rem] uppercase leading-tight tracking-[0.06em] transition-all duration-500 ${
                              on
                                ? "border-[oklch(0.77_0.155_66/55%)] bg-[oklch(0.77_0.155_66/12%)] text-gl-foreground/85"
                                : lit
                                  ? "border-[oklch(0.7_0.17_252/40%)] bg-[oklch(0.7_0.17_252/7%)] text-gl-foreground/45"
                                  : "border-dashed border-[oklch(0.7_0.17_252/25%)] text-gl-foreground/25"
                            }`}
                            style={{ transitionDelay: on ? `${k * 70}ms` : "0ms" }}
                          >
                            <span className="truncate">{d}</span>
                          </span>
                        ))}
                      </div>
                      {/* dimension mark */}
                      <span className="absolute -right-14 top-0 hidden -translate-y-1/2 items-center sm:flex gap-1.5 font-gl-mono text-[0.5rem] text-[oklch(0.7_0.17_252/55%)]">
                        <span className="h-px w-3 bg-current" />+{(i * 3.6).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ground: data enters */}
            <div className="relative ml-[76px] mt-0 border-t-2 border-[oklch(0.7_0.17_252/60%)] pt-3" aria-hidden="true">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="shrink-0 font-gl-mono text-[0.55rem] uppercase tracking-[0.2em] text-[oklch(0.7_0.17_252/80%)]">Data in</span>
                <div className="relative h-px flex-1 overflow-hidden bg-[oklch(0.7_0.17_252/20%)]">
                  <span className="bp-in absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-[var(--cyan)] to-transparent" />
                </div>
                {["ERP", "CRM", "MES", "WMS", "HRIS"].map((s) => (
                  <span key={s} className="rounded-[3px] border border-[oklch(0.7_0.17_252/35%)] px-1.5 py-0.5 font-gl-mono text-[0.5rem] text-gl-foreground/55">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
