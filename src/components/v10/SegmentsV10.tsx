import { Chapter, Exhibit } from "./ui";

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

export function SegmentsV10() {
  return (
    <Chapter
      id="segments"
      n="09"
      label="Solutions"
      title="Value creation for every stage of growth."
      lead="The same four layers, applied to the situation each leadership team is in."
    >
      <Exhibit n={10} className="mt-14 sm:mt-16" title="Where Genius Lab applies" source="Genius Lab. Deliverables are representative.">
        <table className="ledger text-[0.9375rem] leading-[1.6]">
          <caption className="sr-only">Solutions by type of organisation</caption>
          <thead>
            <tr className="caps text-[color:var(--slate)]">
              <th scope="col" className="w-[26%] font-medium">Organisation</th>
              <th scope="col" className="w-[42%] font-medium">What changes</th>
              <th scope="col" className="font-medium">Typical deliverables</th>
            </tr>
          </thead>
          <tbody>
            {SEGMENTS.map((s, i) => (
              <tr key={s.name} className="row-in" style={{ ["--i" as string]: i }}>
                <th scope="row" className="serif text-[1.3125rem] font-normal leading-[1.25] text-[color:var(--ink)]">{s.name}</th>
                <td data-label="What changes" className="text-[color:var(--slate)]">{s.body}</td>
                <td data-label="Typical deliverables">
                  <ul className="space-y-1 text-[color:var(--ink)]">
                    {s.outcomes.map((o) => (
                      <li key={o} className="flex gap-2.5">
                        <span className="mt-[0.75em] h-px w-3 shrink-0 bg-[color:var(--ink)]" aria-hidden="true" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Exhibit>
    </Chapter>
  );
}
