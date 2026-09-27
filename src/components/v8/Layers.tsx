import { Opener, Rule, Up, shell } from "./type";

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

/** The four layers set as a ledger: each one an addend, the decision the sum. */
export function Layers() {
  return (
    <section id="layers" data-chapter="layers" className="scroll-mt-[var(--head-h)] border-t border-[color:var(--rule)] bg-[color:var(--paper-2)]/60 py-20 sm:py-28" aria-labelledby="v8-layers-title">
      <div className={shell}>
        <Opener numeral="II" kicker="The platform" title="One intelligence and execution layer across your *business.*" titleId="v8-layers-title" folio="14">
          <Up delay={250}>
            <p className="f-text mt-8 max-w-[44ch] text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.4]">
              Not four products. Every layer is built on the one beneath it, and the top of the stack is a better decision.
            </p>
          </Up>
        </Opener>

        <div className="mt-16 lg:mt-24">
          <div className="label flex justify-between text-[color:var(--ink-3)]">
            <span>Layer</span>
            <span className="hidden lg:inline">Delivers</span>
          </div>
          <Rule ink className="mt-3" />
          <ol aria-label="Layers, foundation first">
            {LAYERS.map((l, i) => (
              <li key={l.n} className="relative border-b border-[color:var(--rule)]">
                <Up className="grid gap-x-8 gap-y-4 py-9 md:grid-cols-12 lg:py-11" delay={i * 60}>
                  <div className="flex items-start gap-3 md:col-span-2">
                    <span className="f-display w-5 pt-3 text-[1.5rem] text-[color:var(--red)]" aria-hidden="true">
                      {i === 0 ? "" : "+"}
                    </span>
                    <span className="f-display text-[clamp(3.5rem,6vw,5.5rem)] leading-[0.8] tabular-nums">{l.n}</span>
                  </div>
                  <div className="md:col-span-10 lg:col-span-4">
                    <h3 className="f-display text-[clamp(2rem,3vw,2.75rem)] leading-[1]">{l.name}</h3>
                    <p className="f-text mt-2 text-[1.1875rem] italic text-[color:var(--red-ink)]">{l.role}</p>
                  </div>
                  <p className="body-copy md:col-span-6 md:col-start-3 lg:col-span-4 lg:col-start-auto">{l.body}</p>
                  <ul className="smallcaps space-y-1.5 text-[color:var(--ink)] md:col-span-4 lg:col-span-2 lg:border-l lg:border-[color:var(--rule)] lg:pl-5">
                    {l.gives.map((g) => (
                      <li key={g} className="flex gap-2">
                        <span className="text-[color:var(--red)]" aria-hidden="true">
                          &mdash;
                        </span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </Up>
              </li>
            ))}
          </ol>

          {/* The sum rule, then the total. */}
          <div className="double-rule mt-1" aria-hidden="true" />
          <Up className="grid gap-x-8 gap-y-4 py-10 md:grid-cols-12">
            <div className="flex items-start gap-3 md:col-span-2">
              <span className="f-display w-5 pt-1 text-[1.5rem] text-[color:var(--red)]" aria-hidden="true">
                =
              </span>
              <span className="label pt-3 text-[color:var(--red)]">The outcome</span>
            </div>
            <h3 className="f-display text-[clamp(2.5rem,5vw,4.5rem)] italic leading-[0.95] md:col-span-10 lg:col-span-6">Better business decisions.</h3>
            <p className="body-copy md:col-span-8 md:col-start-3 lg:col-span-4 lg:col-start-auto lg:self-end">
              Each layer builds on the one beneath it. Together they give executives clear insight, full visibility and the
              confidence to act.
            </p>
          </Up>
        </div>
      </div>
    </section>
  );
}
