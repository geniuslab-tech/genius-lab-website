"use client";

import { useState } from "react";
import { LAYERS, isTop } from "./data";

/** Study 05: five columns side by side; the one you point at opens and the rest step back. */
export function Panels() {
  const [active, setActive] = useState(4);

  return (
    <div className="flex h-[720px] flex-col-reverse gap-2 md:h-[460px] md:flex-row">
      {LAYERS.map((l, i) => {
        const on = active === i;
        const top = isTop(l);
        return (
          <button
            key={l.n}
            type="button"
            aria-expanded={on}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            className={`group relative min-h-0 min-w-0 overflow-hidden rounded-[8px] border text-left transition-[flex-grow,border-color,background-color] duration-[650ms] ease-[var(--ease-out-strong)] ${
              on ? "grow-[5]" : "grow"
            } basis-0 ${
              on
                ? top
                  ? "border-ember/50 bg-gradient-to-br from-ember/[0.14] to-abyss-2"
                  : "border-sky/40 bg-gradient-to-br from-sky/[0.14] to-abyss-2"
                : "border-white/[0.08] bg-white/[0.015] hover:bg-white/[0.03]"
            }`}
          >
            {/* Collapsed face */}
            <span
              className={`absolute inset-0 flex items-center gap-4 px-5 transition-opacity duration-300 md:flex-col md:items-center md:justify-between md:px-0 md:py-6 ${
                on ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
            >
              <span className={`v6-label text-[0.625rem] ${top ? "text-ember" : "text-sky"}`}>{l.n}</span>
              <span className="whitespace-nowrap text-[1rem] font-semibold tracking-[-0.01em] text-white/60 md:rotate-180 md:[writing-mode:vertical-rl]">{l.name}</span>
            </span>

            {/* Open face */}
            <span
              className={`absolute inset-0 flex flex-col p-6 transition-opacity duration-500 sm:p-8 md:min-w-[460px] ${
                on ? "opacity-100 delay-150" : "pointer-events-none opacity-0"
              }`}
            >
              <span className="v6-display pointer-events-none absolute -bottom-6 right-4 text-[clamp(8rem,16vw,14rem)] leading-none text-white/[0.035]" aria-hidden="true">{l.n}</span>
              <span className="flex items-center justify-between">
                <span className={`v6-label text-[0.625rem] ${top ? "text-ember" : "text-sky"}`}>Layer {l.n}</span>
                <span className="v6-label text-[0.5625rem] text-white/30">{i + 1} / 5</span>
              </span>
              <span className="v6-display mt-4 block text-[clamp(1.75rem,3vw,2.5rem)] text-white md:mt-auto">{l.name}</span>
              <span className="mt-3 block max-w-[42ch] text-[0.9375rem] leading-[1.6] text-white/55">{l.body}</span>
              <span className="mt-6 flex flex-wrap gap-1.5">
                {l.tags.map((t) => (
                  <span key={t} className={`v6-label rounded-[3px] border px-2.5 py-1.5 text-[0.5625rem] ${top ? "border-ember/30 text-ember/90" : "border-sky/25 text-white/70"}`}>
                    {t}
                  </span>
                ))}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
