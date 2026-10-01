"use client";

import { LAYERS, Narrative, SplitStage, layerButton, useLayerCycle } from "./shared";

const W = 280;
const H = 68;
const D = 150;
const GAP = 10;

const ACTIONS = ["Approve", "Write-back", "Notify", "Reorder", "Reprice"];
const SOURCES = ["ERP", "CRM", "Finance", "MES", "WMS", "HRIS", "Email", "Docs", "ERP", "CRM", "Finance", "MES"];

/**
 * The monolith. Five dark slabs form one tower; a gold core rises through a
 * slit in the face and lights each slab it reaches. Sources stream in at the
 * base and actions leave the top: one system, end to end.
 */
export function V7Monolith() {
  const { ref, active, select, running, held } = useLayerCycle();
  const coreH = (active + 1) * (H + GAP) - GAP / 2;
  return (
    <div ref={ref}>
      <SplitStage
        narrative={<Narrative active={active} running={running} held={held} showDetails />}
        visual={
          <div className="relative grid grid-cols-1 items-center gap-4 md:grid-cols-[minmax(0,1fr)_15rem]">
            <div className="relative flex flex-col items-center">
              {/* actions leaving the top */}
              <div className="relative h-20 w-[18rem] overflow-hidden" aria-hidden="true">
                {ACTIONS.map((a, i) => (
                  <span
                    key={a}
                    className="mono-up absolute bottom-0 rounded-full border border-gl-gold/40 bg-gl-gold/10 px-2 py-0.5 font-gl-mono text-[0.52rem] uppercase tracking-[0.12em] text-gl-gold"
                    style={{ left: `${10 + i * 17}%`, animationDelay: `${i * 0.9}s`, opacity: active === 4 ? undefined : 0.35 }}
                  >
                    {a}
                  </span>
                ))}
              </div>

              <div className="[perspective:1600px]">
                <div className="relative [transform-style:preserve-3d]" style={{ width: W, height: 5 * (H + GAP), transform: "rotateX(-14deg) rotateY(-32deg)" }}>
                  {LAYERS.map((layer, i) => {
                    const on = i === active;
                    const lit = i <= active;
                    const y = (4 - i) * (H + GAP);
                    return (
                      <div
                        key={layer.number}
                        {...layerButton(i, select, `Show ${layer.name}`)}
                        className="absolute left-0 cursor-pointer outline-none [transform-style:preserve-3d] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{ top: y, width: W, height: H, transform: on ? "translateX(-14px)" : "none" }}
                      >
                        {/* front face */}
                        <div
                          className="absolute inset-0 overflow-hidden border transition-[background,border-color,box-shadow] duration-700"
                          style={{
                            transform: `translateZ(${D / 2}px)`,
                            borderColor: on ? "oklch(0.85 0.12 75 / 70%)" : "oklch(1 0 0 / 9%)",
                            background: on
                              ? "linear-gradient(180deg, oklch(0.32 0.07 72), oklch(0.17 0.035 264))"
                              : lit
                                ? "linear-gradient(180deg, oklch(0.22 0.045 260), oklch(0.13 0.03 264))"
                                : "linear-gradient(180deg, oklch(0.18 0.03 262), oklch(0.11 0.025 264))",
                            boxShadow: on ? "0 0 60px -6px oklch(0.77 0.155 66 / 55%)" : "none",
                          }}
                        >
                          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                          <span className={`absolute left-4 top-3 font-gl-mono text-[0.6rem] tracking-[0.2em] ${on ? "text-gl-gold" : "text-gl-foreground/35"}`}>{layer.number}</span>
                          <span className={`absolute bottom-3 left-4 font-gl-display text-[0.95rem] ${on ? "text-gl-foreground" : "text-gl-foreground/50"}`}>{layer.name}</span>
                        </div>
                        {/* right face */}
                        <div
                          className="absolute top-0 h-full transition-[background] duration-700"
                          style={{
                            width: D,
                            left: W - D / 2,
                            transform: "rotateY(90deg)",
                            background: on ? "linear-gradient(90deg, oklch(0.26 0.06 70), oklch(0.12 0.03 264))" : "linear-gradient(90deg, oklch(0.14 0.03 264), oklch(0.08 0.02 264))",
                            borderTop: "1px solid oklch(1 0 0 / 6%)",
                          }}
                        />
                        {/* top face */}
                        <div
                          className="absolute left-0 transition-[background] duration-700"
                          style={{
                            width: W,
                            height: D,
                            top: -D / 2,
                            transform: "rotateX(90deg)",
                            background: on ? "oklch(0.3 0.06 70 / 90%)" : "oklch(0.2 0.035 262 / 90%)",
                            border: "1px solid oklch(1 0 0 / 6%)",
                          }}
                        />
                      </div>
                    );
                  })}
                  {/* gold core slit on the front faces */}
                  <div
                    className="pointer-events-none absolute bottom-0 right-10 w-[3px] [transform-style:preserve-3d]"
                    style={{ height: 5 * (H + GAP), transform: `translateZ(${D / 2 + 1}px)` }}
                    aria-hidden="true"
                  >
                    <span className="absolute inset-0 bg-gl-foreground/[0.06]" />
                    <span
                      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--data)] via-[var(--cyan)] to-[var(--gold)] shadow-[0_0_16px_2px_oklch(0.77_0.155_66/60%)] transition-[height] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{ height: coreH }}
                    />
                  </div>
                </div>
              </div>

              {/* sources streaming into the base */}
              <div className="relative mt-10 w-full max-w-[22rem] overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)]" aria-hidden="true">
                <div className="mono-ticker flex w-max gap-2">
                  {[...SOURCES, ...SOURCES].map((s, i) => (
                    <span key={i} className="rounded-full border border-gl-data/30 bg-gl-data/[0.07] px-2 py-0.5 font-gl-mono text-[0.52rem] uppercase tracking-[0.12em] text-gl-data/90">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pointer-events-none absolute bottom-6 left-1/2 h-24 w-[26rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.7_0.17_252/30%),transparent_70%)] blur-2xl" aria-hidden="true" />
            </div>

            {/* legend */}
            <ol className="hidden flex-col-reverse gap-2 md:flex">
              {LAYERS.map((l, i) => {
                const on = i === active;
                return (
                  <li key={l.number}>
                    <button type="button" onClick={() => select(i)} className="group flex w-full items-center gap-3 py-2 text-left">
                      <span className={`h-px transition-all duration-500 ${on ? "w-10 bg-gl-gold" : "w-5 bg-gl-foreground/20 group-hover:w-7"}`} />
                      <span className={`font-gl-mono text-[0.6rem] ${on ? "text-gl-gold" : "text-gl-foreground/35"}`}>{l.number}</span>
                      <span className={`text-[0.85rem] transition-colors duration-500 ${on ? "text-gl-foreground" : "text-gl-foreground/50"}`}>{l.name}</span>
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
