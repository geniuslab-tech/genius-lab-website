"use client";

import { useState } from "react";
import { LAYERS, TOP_DOWN, isTop } from "./data";

const C = 300;
const RADII = [282, 226, 170, 114, 58];
const DURATIONS = ["90s", "70s", "54s", "40s", "28s"];

/** Study 02: the layers as concentric rings; execution is the core everything else protects and feeds. */
export function Orbit() {
  const [active, setActive] = useState(4);

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      <div className="relative mx-auto w-full max-w-[560px]">
        <svg viewBox="0 0 600 600" className="w-full" aria-hidden="true">
          <defs>
            <radialGradient id="orb-core">
              <stop offset="0" stopColor="#f29a1f" stopOpacity="0.55" />
              <stop offset="0.6" stopColor="#f29a1f" stopOpacity="0.12" />
              <stop offset="1" stopColor="#f29a1f" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="orb-field">
              <stop offset="0" stopColor="#4d8dff" stopOpacity="0.16" />
              <stop offset="1" stopColor="#4d8dff" stopOpacity="0" />
            </radialGradient>
            {RADII.map((r, i) => (
              <path key={i} id={`orb-arc-${i}`} d={`M ${C - (r - 18)} ${C} A ${r - 18} ${r - 18} 0 0 1 ${C + (r - 18)} ${C}`} />
            ))}
          </defs>
          <circle cx={C} cy={C} r="296" fill="url(#orb-field)" />

          {LAYERS.map((l, i) => {
            const r = RADII[i];
            const on = active === i;
            const top = isTop(l);
            return (
              <g key={l.n} onMouseEnter={() => setActive(i)} className="cursor-pointer">
                <circle
                  cx={C}
                  cy={C}
                  r={r}
                  fill={top ? "url(#orb-core)" : on ? "rgb(77 141 255 / 0.07)" : "transparent"}
                  stroke={top ? "#f29a1f" : on ? "#8db6ff" : "rgb(125 170 255 / 0.28)"}
                  strokeWidth={on ? 1.6 : 1}
                  style={{ transition: "stroke 300ms, fill 300ms" }}
                />
                {!top && (
                  <>
                    <circle cx={C} cy={C} r={r} fill="none" stroke="rgb(125 170 255 / 0.25)" strokeDasharray="1 7" transform={`rotate(${i * 17} ${C} ${C})`} />
                    <g className="v7-spin" style={{ ["--dur" as string]: DURATIONS[i], animationDirection: i % 2 ? "reverse" : "normal" }}>
                      <circle cx={C + r} cy={C} r={on ? 4 : 3} fill={on ? "#cfe0ff" : "#4d8dff"} />
                    </g>
                    <text fontFamily="var(--font-mono)" fontSize="11" letterSpacing="3" fill={on ? "#ffffff" : "rgb(255 255 255 / 0.42)"}>
                      <textPath href={`#orb-arc-${i}`} startOffset="50%" textAnchor="middle">
                        {`${l.n} · ${l.name.toUpperCase()}`}
                      </textPath>
                    </text>
                  </>
                )}
              </g>
            );
          })}

          <circle cx={C} cy={C} r="5" fill="#f29a1f" />
          <circle cx={C} cy={C} r="18" fill="none" stroke="#f29a1f" strokeOpacity="0.5" className="v7-breathe" />
          <text x={C} y={C + 36} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="3" fill="#f29a1f">
            05 · EXECUTION
          </text>
        </svg>
      </div>

      <ol aria-label="Layers, core first" className="border-t border-white/[0.07]">
        {TOP_DOWN.map((l) => {
          const i = Number(l.n) - 1;
          const on = active === i;
          return (
            <li key={l.n} className="border-b border-white/[0.07]">
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-expanded={on}
                className="group grid w-full grid-cols-[2.5rem_1fr] items-baseline gap-x-2 py-4 text-left"
              >
                <span className={`v6-label text-[0.625rem] ${isTop(l) ? "text-ember" : "text-sky"}`}>{l.n}</span>
                <span className={`text-[1.125rem] font-semibold tracking-[-0.01em] transition-colors ${on ? "text-white" : "text-white/55 group-hover:text-white/80"}`}>{l.name}</span>
                <span
                  className={`col-start-2 grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-strong)] ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <span className="overflow-hidden">
                    <span className="block pt-2 text-[0.9375rem] leading-[1.6] text-white/55">{l.body}</span>
                    <span className="mt-3 flex flex-wrap gap-1.5">
                      {l.tags.map((t) => (
                        <span key={t} className="v6-label rounded-[3px] border border-white/10 px-2 py-1 text-[0.5625rem] text-white/60">
                          {t}
                        </span>
                      ))}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
