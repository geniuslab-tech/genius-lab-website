import type { CSSProperties } from "react";
import { LAYERS, isTop } from "./data";

const HEIGHTS = [46, 57, 68, 80, 92];

/** Study 04: each layer is a step up in business value; the top step is where the company acts. */
export function Staircase() {
  return (
    <div className="grid gap-6 md:grid-cols-[auto_1fr]">
      <div className="hidden flex-col justify-between py-2 md:flex" aria-hidden="true">
        <p className="v6-label text-[0.5625rem] text-ember [writing-mode:vertical-rl] rotate-180">Business value ↑</p>
        <p className="v6-label text-[0.5625rem] text-white/30 [writing-mode:vertical-rl] rotate-180">Raw signals</p>
      </div>

      <div>
        <ol className="flex flex-col-reverse gap-2 md:h-[540px] md:flex-row md:items-end md:gap-3" aria-label="Layers, foundation first">
          {LAYERS.map((l, i) => {
            const top = isTop(l);
            return (
              <li
                key={l.n}
                data-reveal="up"
                data-delay={i * 90}
                style={{ "--h": `${HEIGHTS[i]}%`, "--w": `${100 - i * 8}%` } as CSSProperties}
                className="relative w-[var(--w)] md:h-[var(--h)] md:w-auto md:flex-1"
              >
                {top && (
                  <span className="absolute -top-7 left-5 hidden h-3 w-3 md:block" aria-hidden="true">
                    <span className="v7-breathe absolute inset-[-6px] rounded-full border border-ember/50" />
                    <span className="absolute inset-0 rounded-full bg-ember" />
                  </span>
                )}
                <article
                  className={`relative flex h-full flex-col overflow-hidden rounded-t-[6px] border-x border-t p-5 ${
                    top
                      ? "border-ember/50 bg-gradient-to-b from-ember/[0.14] via-ember/[0.04] to-transparent"
                      : "border-white/[0.09] bg-gradient-to-b from-sky/[0.12] via-sky/[0.03] to-transparent"
                  }`}
                >
                  <span className={`absolute inset-x-0 top-0 h-px ${top ? "bg-ember" : "bg-sky/70"}`} aria-hidden="true" />
                  <div className="flex items-baseline justify-between gap-3">
                    <span className={`v6-label text-[0.625rem] ${top ? "text-ember" : "text-sky"}`}>{l.n}</span>
                  </div>
                  <h3 className="mt-3 text-[1.125rem] font-semibold leading-tight tracking-[-0.01em] text-white">{l.name}</h3>
                  <p className="mt-2 text-[0.8125rem] leading-[1.55] text-white/45">{l.body}</p>
                  <p className="v6-label mt-auto pt-4 text-[0.5rem] leading-[1.9] text-white/40">{l.tags.join(" · ")}</p>
                </article>
              </li>
            );
          })}
        </ol>
        <div className="flex items-center gap-4 border-t border-white/20 pt-3" aria-hidden="true">
          <p className="v6-label text-[0.5625rem] text-white/30">Foundation</p>
          <span className="h-px flex-1 bg-gradient-to-r from-white/10 via-sky/50 to-ember/70" />
          <p className="v6-label text-[0.5625rem] text-ember">Execution</p>
        </div>
      </div>
    </div>
  );
}
