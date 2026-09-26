import { SectionTag, h2v4 } from "./ui";

const LAYERS = [
  {
    n: "01",
    name: "Data Engineering",
    role: "The foundation.",
    body: "We connect your systems and engineer their data into one governed, reliable foundation: integration, pipelines, modeling and quality.",
    gives: ["Connected systems", "A unified data platform", "Trusted, tested pipelines"],
  },
  {
    n: "02",
    name: "Analytics",
    role: "Organized data becomes understanding.",
    body: "Analysis and modeling explain what is happening, why it is happening and what is likely to happen next.",
    gives: ["Performance analysis", "Forecasts and drivers", "Customer and operational insight"],
  },
  {
    n: "03",
    name: "Business Intelligence",
    role: "Understanding becomes visible.",
    body: "One set of definitions behind every dashboard and report, so leadership sees the same numbers, at the same time.",
    gives: ["Executive dashboards", "Shared metrics and KPIs", "Self-service reporting"],
  },
  {
    n: "04",
    name: "Artificial Intelligence",
    role: "Visibility gains context and reasoning.",
    body: "AI learns your business context and becomes its Second Brain. AI Agents reason across systems, tables, metrics and processes to answer and act.",
    gives: ["Second Brain", "AI Agents", "Orchestrated execution"],
  },
];

const OUTCOME = {
  name: "Better business decisions",
  body: "Each layer builds on the one beneath it. Together they give executives clear insight, full visibility and the confidence to act.",
};

/** Stack depth readout: how many layers sit beneath this one. */
function Level({ k }: { k: number }) {
  return (
    <span className="flex flex-col-reverse gap-[3px]" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={`block h-[3px] w-7 transition-colors duration-300 ${i <= k ? (i === k ? "bg-cyan" : "bg-signal") : "bg-white/10"}`} />
      ))}
    </span>
  );
}

/** The four layers drawn as a stack, top to bottom, with a data bus carrying the signal upward. */
export function LayersV4() {
  const stack = [...LAYERS].reverse();
  return (
    <section id="layers" className="relative scroll-mt-16 py-24 sm:py-32" aria-labelledby="v4-layers-title">
      <div className="shell">
        <SectionTag n="02">Architecture</SectionTag>
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 id="v4-layers-title" data-reveal="up" className={`${h2v4} max-w-[18ch] lg:col-span-8`}>
            One intelligence and execution layer across your&nbsp;business.
          </h2>
          <p data-reveal="up" data-delay="100" className="max-w-[44ch] text-lg leading-relaxed text-white/60 lg:col-span-4">
            Not four products. Every layer is built on the one beneath it, and the top of the stack is a better
            decision.
          </p>
        </div>

        <div className="relative mt-14 pl-8 sm:pl-14 lg:mt-20">
          {/* Data bus: the signal climbs the stack. */}
          <div className="absolute bottom-0 left-2 top-0 w-px overflow-hidden bg-white/10 sm:left-5" aria-hidden="true">
            <span className="v4-rise absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-cyan to-transparent" />
          </div>

          {/* Output. */}
          <div className="relative">
            <span className="absolute -left-[1.85rem] top-1/2 z-10 h-3 w-3 -translate-y-1/2 rotate-45 border border-cyan bg-void sm:-left-[2.65rem]" aria-hidden="true" />
            <div data-reveal="up" className="grid gap-4 border border-cyan/40 bg-[linear-gradient(90deg,rgb(85_119_255/0.22),rgb(110_231_255/0.06))] p-6 sm:p-8 lg:grid-cols-12 lg:items-center">
              <span className="v4-label text-cyan lg:col-span-2">Output</span>
              <h3 className="type-display text-[clamp(1.5rem,2.6vw,2.25rem)] text-white [font-variation-settings:'wdth'_112] lg:col-span-5">{OUTCOME.name}</h3>
              <p className="leading-relaxed text-white/70 lg:col-span-5">{OUTCOME.body}</p>
            </div>
          </div>

          <ol className="mt-3 flex flex-col gap-3" aria-label="Layers, top of the stack first">
            {stack.map((l, idx) => {
              const k = LAYERS.length - 1 - idx;
              return (
                <li key={l.n} className="group relative">
                  <span className="absolute -left-[1.75rem] top-9 z-10 h-2 w-2 bg-white/50 transition-colors group-hover:bg-cyan sm:-left-[2.53rem] sm:top-11" aria-hidden="true" />
                  <div
                    data-reveal="up"
                    data-delay={String(80 + idx * 70)}
                    className="grid gap-5 border border-line p-6 transition-colors duration-300 group-hover:border-white/30 sm:p-8 lg:grid-cols-12"
                    style={{ background: `rgb(85 119 255 / ${0.03 + k * 0.025})` }}
                  >
                    <div className="flex items-start justify-between gap-4 lg:col-span-2 lg:flex-col lg:justify-start">
                      <span className="type-mono text-3xl leading-none text-white/30 transition-colors group-hover:text-cyan">{l.n}</span>
                      <Level k={k} />
                    </div>
                    <div className="lg:col-span-5">
                      <h3 className="type-display text-[clamp(1.5rem,2.4vw,2rem)] text-white [font-variation-settings:'wdth'_112]">{l.name}</h3>
                      <p className="mt-2 font-medium text-[#9fb4ff]">{l.role}</p>
                      <p className="mt-4 max-w-[52ch] leading-relaxed text-white/60">{l.body}</p>
                    </div>
                    <ul className="flex flex-wrap content-start gap-2 lg:col-span-5 lg:justify-end">
                      {l.gives.map((g) => (
                        <li key={g} className="type-mono inline-flex h-8 items-center gap-2 border border-line bg-void/60 px-3 text-[0.75rem] text-white/75">
                          <span className="h-1 w-1 bg-cyan" aria-hidden="true" />
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
