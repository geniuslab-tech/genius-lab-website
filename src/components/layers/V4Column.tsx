"use client";

import { LAYERS, Narrative, SplitStage, useLayerCycle } from "./shared";

const CX = 270;
const BASE_Y = 452;
const STEP_Y = 88;
/** Beam length when it reaches the top ring. */
const BEAM_MAX = 4 * STEP_Y + 30;
const ring = (i: number) => {
  const rx = 236 - i * 30;
  return { y: BASE_Y - i * STEP_Y, rx, ry: Math.round(rx * 0.2) };
};
const arc = (i: number, front: boolean) => {
  const { y, rx, ry } = ring(i);
  return `M ${CX - rx} ${y} A ${rx} ${ry} 0 0 ${front ? 0 : 1} ${CX + rx} ${y}`;
};

/**
 * A column of light. Each layer is a ring; a beam rises from the foundation
 * and lights every ring up to the active one, so the stack reads as one
 * system powering the layer above it.
 */
export function V4Column() {
  const { ref, active, select, running, held } = useLayerCycle();
  const top = ring(active).y;
  const beamH = BASE_Y + 30 - top;
  return (
    <div ref={ref}>
      <SplitStage
        narrative={<Narrative active={active} running={running} held={held} tone="data" showDetails />}
        visual={
          <div className="relative mx-auto w-full max-w-[44rem]">
            <svg viewBox="0 0 660 520" className="block w-full overflow-visible" role="img" aria-label="Five layers lit by a rising column of light">
              <defs>
                <linearGradient id="col-beam" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="var(--data)" stopOpacity="0.15" />
                  <stop offset="70%" stopColor="var(--cyan)" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="var(--gold)" stopOpacity="1" />
                </linearGradient>
                <radialGradient id="col-floor" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="var(--data)" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="var(--data)" stopOpacity="0" />
                </radialGradient>
                <filter id="col-glow" x="-200%" y="-20%" width="500%" height="140%">
                  <feGaussianBlur stdDeviation="8" />
                </filter>
              </defs>

              <ellipse cx={CX} cy={BASE_Y + 34} rx="270" ry="46" fill="url(#col-floor)" />

              {/* back halves of rings, behind the beam */}
              {LAYERS.map((l, i) => (
                <path
                  key={`b${l.number}`}
                  d={arc(i, false)}
                  fill="none"
                  stroke={i === active ? "var(--gold)" : i < active ? "var(--data)" : "var(--foreground)"}
                  strokeOpacity={i === active ? 0.5 : i < active ? 0.35 : 0.12}
                  strokeWidth="1.2"
                  style={{ transition: "stroke .7s, stroke-opacity .7s" }}
                />
              ))}

              {/* beam */}
              {/* full-height beam scaled from its base, so the rise is a transform, not a layout change */}
              <g
                style={{
                  transform: `scaleY(${beamH / BEAM_MAX})`,
                  transformOrigin: `${CX}px ${BASE_Y}px`,
                  transition: "transform 1.1s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                <rect x={CX - 14} y={BASE_Y - BEAM_MAX} width="28" height={BEAM_MAX} fill="url(#col-beam)" filter="url(#col-glow)" opacity="0.7" />
                <rect x={CX - 2} y={BASE_Y - BEAM_MAX} width="4" height={BEAM_MAX} rx="2" fill="url(#col-beam)" />
              </g>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <circle
                  key={i}
                  cx={CX + ((i % 3) - 1) * 4}
                  cy={BASE_Y + 20}
                  r="2.2"
                  fill="var(--cyan)"
                  className="col-dot"
                  style={{ animationDelay: `${i * 0.55}s`, ["--col-h" as string]: `${-(beamH - 40)}px` }}
                />
              ))}

              {/* front halves + discs */}
              {LAYERS.map((l, i) => {
                const on = i === active;
                const lit = i <= active;
                const { y, rx, ry } = ring(i);
                return (
                  <g
                    key={`f${l.number}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Show ${l.name}`}
                    onClick={() => select(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        select(i);
                      }
                    }}
                    className="cursor-pointer outline-none"
                  >
                    <ellipse
                      cx={CX}
                      cy={y}
                      rx={rx}
                      ry={ry}
                      fill={on ? "oklch(0.77 0.155 66 / 10%)" : lit ? "oklch(0.7 0.17 252 / 7%)" : "oklch(1 0 0 / 2%)"}
                      style={{ transition: "fill .7s" }}
                    />
                    <path
                      d={arc(i, true)}
                      fill="none"
                      stroke={on ? "var(--gold)" : lit ? "var(--data)" : "var(--foreground)"}
                      strokeOpacity={on ? 1 : lit ? 0.75 : 0.22}
                      strokeWidth={on ? 2 : 1.4}
                      style={{ transition: "stroke .7s, stroke-opacity .7s" }}
                    />
                    {on ? (
                      <ellipse cx={CX} cy={y} rx={rx} ry={ry} fill="none" stroke="var(--gold)" strokeWidth="1" className="col-pulse" style={{ transformOrigin: `${CX}px ${y}px` }} />
                    ) : null}
                    {/* label */}
                    <line x1={CX + rx + 8} x2={CX + rx + 40} y1={y} y2={y} stroke={on ? "var(--gold)" : "var(--foreground)"} strokeOpacity={on ? 0.8 : 0.18} />
                    <text x={CX + rx + 48} y={y - 3} className="font-gl-mono" fontSize="10" letterSpacing="2" fill={on ? "var(--gold)" : lit ? "var(--data)" : "var(--foreground)"} fillOpacity={on || lit ? 1 : 0.35}>
                      {l.number}
                    </text>
                    <text x={CX + rx + 48} y={y + 14} className="font-gl-display" fontSize="15" fill="var(--foreground)" fillOpacity={on ? 1 : 0.55} style={{ transition: "fill-opacity .7s" }}>
                      {l.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        }
      />
    </div>
  );
}
