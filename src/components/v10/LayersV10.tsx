import { Chapter, Exhibit } from "./ui";

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

const TINTS = ["#e9e3d3", "#efeadd", "#f4f0e6", "#faf8f2"];

export function LayersV10() {
  return (
    <Chapter
      id="framework"
      n="02"
      label="The framework"
      title={<>One intelligence and execution layer across your&nbsp;business.</>}
      lead="Not four products. Every layer is built on the one beneath it, and the top of the stack is a better decision."
      note={<>Read Exhibit 3 from the bottom up. Each layer depends on the one below it being in place.</>}
    >
      <Exhibit
        n={3}
        className="mt-14 sm:mt-16"
        title="The Genius Lab framework: four connected layers, one outcome"
        source="Genius Lab. Schematic; layer contents are representative, not exhaustive."
      >
        <div className="grid grid-cols-[1.75rem_1fr] gap-x-4 sm:grid-cols-[2.5rem_1fr] sm:gap-x-6">
          {/* Axis: foundation to intelligence. */}
          <div className="relative flex flex-col items-center" aria-hidden="true">
            <span className="caps absolute top-1/2 left-1/2 w-max -translate-x-1/2 -translate-y-1/2 -rotate-90 bg-[color:var(--paper)] px-2 text-[color:var(--slate)]">
              Foundation to intelligence
            </span>
            <svg viewBox="0 0 10 8" className="h-2 w-2.5 text-[color:var(--ink)]" aria-hidden="true">
              <path d="M0 8 L5 0 L10 8 Z" fill="currentColor" className="fade-in" style={{ ["--i" as string]: 6 }} />
            </svg>
            <span className="draw-up block w-px flex-1 bg-[#101440]" style={{ ["--i" as string]: 0 }} />
          </div>

          <ol className="flex flex-col-reverse gap-[3px]" aria-label="The four layers, foundation first">
            {LAYERS.map((l, i) => (
              <li key={l.n} className="relative">
                <span className="draw-x absolute inset-0 block" style={{ background: TINTS[i], ["--i" as string]: i }} aria-hidden="true" />
                <article
                  className="row-in relative grid gap-x-6 gap-y-3 px-4 py-6 sm:px-6 md:grid-cols-[3rem_minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,1fr)] md:py-7"
                  style={{ ["--i" as string]: i + 1 }}
                >
                  <p className="serif tnum text-[1.5rem] leading-none text-[color:var(--brass)] md:text-[1.75rem]">{l.n}</p>
                  <div>
                    <h3 className="serif text-[1.5rem] leading-[1.15] text-[color:var(--ink)]">{l.name}</h3>
                    <p className="mt-1 text-[0.9375rem] font-medium text-[color:var(--ink-2)]">{l.role}</p>
                  </div>
                  <p className="text-[0.9375rem] leading-[1.65] text-[color:var(--slate)]">{l.body}</p>
                  <ul className="space-y-1.5 border-t border-[color:var(--rule)] pt-3 text-[0.875rem] text-[color:var(--ink-2)] md:border-l md:border-t-0 md:pl-5 md:pt-0" aria-label={`${l.name} delivers`}>
                    {l.gives.map((g) => (
                      <li key={g} className="flex gap-2.5">
                        <span className="mt-[0.6em] h-px w-3 shrink-0 bg-[color:var(--ink)]" aria-hidden="true" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
            <li className="relative mb-3">
              <span className="draw-x absolute inset-0 block bg-[#101440]" style={{ ["--i" as string]: 4 }} aria-hidden="true" />
              <div className="row-in relative grid gap-x-6 gap-y-2 px-4 py-7 text-white sm:px-6 md:grid-cols-[3rem_minmax(0,1.1fr)_minmax(0,2.4fr)] md:items-baseline" style={{ ["--i" as string]: 5 }}>
                <p className="caps text-[color:var(--brass-2)]">Result</p>
                <h3 className="serif text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.1]">Better business decisions</h3>
                <p className="text-[0.9375rem] leading-[1.65] text-white/75">
                  Each layer builds on the one beneath it. Together they give executives clear insight, full visibility and
                  the confidence to act.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </Exhibit>
    </Chapter>
  );
}
