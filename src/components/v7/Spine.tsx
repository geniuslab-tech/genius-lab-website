import { TOP_DOWN, isTop } from "./data";

/** Study 07: one vertical spine, layers branching off it in alternation, a pulse climbing from signals to action. */
export function Spine() {
  return (
    <div className="relative mx-auto max-w-[1040px]">
      <p className="v6-label mb-8 pl-10 text-[0.625rem] text-ember md:pl-0 md:text-center">↑ Business action</p>

      <div className="relative">
        <div
          className="absolute bottom-0 left-[11px] top-0 w-px bg-gradient-to-t from-sky/10 via-sky/60 to-ember md:left-1/2 md:-translate-x-1/2"
          aria-hidden="true"
        >
          <span className="v7-run-y absolute left-1/2 h-8 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-t from-transparent via-white to-transparent shadow-[0_0_12px_2px_rgb(77_141_255/0.7)]" />
        </div>

        <ol className="space-y-6 md:space-y-0" aria-label="Layers, top first">
          {TOP_DOWN.map((l, k) => {
            const top = isTop(l);
            const right = k % 2 === 1;
            return (
              <li key={l.n} className={`relative grid pl-10 md:grid-cols-2 md:pl-0 ${k > 0 ? "md:-mt-16" : ""}`}>
                {/* Node on the spine */}
                <span
                  className={`absolute left-[11px] top-7 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 md:left-1/2 ${
                    top ? "border-ember bg-ember" : "border-sky bg-abyss"
                  }`}
                  aria-hidden="true"
                />
                {top && <span className="v7-breathe absolute left-[11px] top-[22px] h-6 w-6 -translate-x-1/2 rounded-full border border-ember/50 md:left-1/2" aria-hidden="true" />}

                <div className={`relative ${right ? "md:col-start-2 md:pl-14" : "md:pr-14"}`}>
                  {/* Branch from the spine */}
                  <span
                    className={`absolute top-[33px] hidden h-px w-14 md:block ${right ? "left-0 bg-gradient-to-r" : "right-0 bg-gradient-to-l"} ${
                      top ? "from-ember to-ember/10" : "from-sky/70 to-sky/10"
                    }`}
                    aria-hidden="true"
                  />
                  <article
                    data-reveal="up"
                    className={`rounded-[8px] border p-5 sm:p-6 ${right ? "" : "md:text-right"} ${
                      top ? "border-ember/40 bg-gradient-to-b from-ember/[0.10] to-abyss-2/40" : "border-white/[0.08] bg-abyss-2/60"
                    }`}
                  >
                    <p className={`v6-label text-[0.625rem] ${top ? "text-ember" : "text-sky"}`}>Layer {l.n}</p>
                    <h3 className="mt-2 text-[1.375rem] font-semibold tracking-[-0.015em] text-white">{l.name}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-[1.6] text-white/50">{l.body}</p>
                    <ul className={`mt-4 flex flex-wrap gap-1.5 ${right ? "" : "md:justify-end"}`}>
                      {l.tags.map((t) => (
                        <li key={t} className="v6-label rounded-[3px] bg-white/[0.05] px-2 py-1 text-[0.5625rem] text-white/60">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="v6-label mt-8 pl-10 text-[0.625rem] text-white/35 md:pl-0 md:text-center">Business signals in</p>
    </div>
  );
}
