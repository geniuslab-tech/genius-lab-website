import { Opener, Rule, Up, shell } from "./type";

const SEGMENTS = [
  {
    name: "Investment Firms",
    body: "One live view across every portfolio company, with value creation tracked against the plan.",
    outcomes: ["Portfolio monitoring", "Value creation plans", "Board-ready reporting"],
  },
  {
    name: "M&A Teams",
    body: "Diligence on real data, then integration that connects two companies' systems from day one.",
    outcomes: ["Data-driven diligence", "Day-one integration", "Synergy tracking"],
  },
  {
    name: "Multi-Entity Companies",
    body: "Every entity, currency and ledger consolidated into one trusted group picture.",
    outcomes: ["Automated consolidation", "Entity comparisons", "Group-wide KPIs"],
  },
  {
    name: "Operating Companies",
    body: "Daily operations run on shared numbers, with agents that flag what needs attention.",
    outcomes: ["Operational dashboards", "Forecasting", "Proactive alerts"],
  },
];

/** A section front: four columns divided by hairlines, like the pages of a broadsheet. */
export function Segments() {
  return (
    <section id="segments" data-chapter="segments" className="scroll-mt-[var(--head-h)] py-20 sm:py-28" aria-labelledby="v8-segments-title">
      <div className={shell}>
        <Opener numeral="VIII" kicker="Solutions" title="Value creation for every *stage of growth.*" titleId="v8-segments-title" folio="60" />

        <div className="mt-14 lg:mt-20">
          <Rule ink />
          <ul className="grid gap-px bg-[color:var(--rule)] sm:grid-cols-2 lg:grid-cols-4">
            {SEGMENTS.map((s, i) => (
              <li key={s.name} className="bg-[color:var(--paper)]">
                <Up delay={i * 80} className="flex h-full flex-col py-8 sm:px-6 lg:py-10">
                  <p className="smallcaps text-[color:var(--red)]">Section {String.fromCharCode(65 + i)}</p>
                  <h3 className="f-display mt-4 text-[clamp(2rem,2.6vw,2.5rem)] leading-[0.98]">{s.name}</h3>
                  <p className="body-copy mb-8 mt-4 !text-[1.0625rem]">{s.body}</p>
                  <ul className="smallcaps mt-auto space-y-1.5 border-t border-[color:var(--ink)] pt-4 text-[color:var(--ink)]">
                    {s.outcomes.map((o) => (
                      <li key={o} className="flex gap-2">
                        <span className="text-[color:var(--red)]" aria-hidden="true">
                          &mdash;
                        </span>
                        {o}
                      </li>
                    ))}
                  </ul>
                </Up>
              </li>
            ))}
          </ul>
          <Rule />
        </div>
      </div>
    </section>
  );
}
