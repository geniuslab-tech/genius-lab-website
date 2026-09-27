import { Kicker, ROMAN, d } from "./ui";

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

export function SegmentsV15() {
  return (
    <section id="segments" className="relative scroll-mt-20 bg-[#0c0b0a] py-32 sm:py-48" aria-labelledby="v15-segments-title">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-10">
        <div className="max-w-[760px]">
          <Kicker>Solutions</Kicker>
          <h2 id="v15-segments-title" data-lx="settle" style={d(150)} className="lx-display mt-10 text-[clamp(2.5rem,5.2vw,4.75rem)]">
            Value creation for <em className="lx-gold">every stage of growth.</em>
          </h2>
        </div>

        <ul className="mt-24 sm:mt-32">
          {SEGMENTS.map((s, i) => (
            <li key={s.name} className="group relative grid gap-5 border-t border-[#d8c29d]/15 py-10 last:border-b lg:grid-cols-12 lg:items-baseline lg:gap-8 lg:py-12">
              <span
                className="absolute left-0 top-[-1px] h-px w-full origin-left scale-x-0 bg-[#d8c29d]/70 transition-transform duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-x-100"
                aria-hidden="true"
              />
              <span data-lx="fade" className="lx-num text-[1.1rem] lg:col-span-1">
                {ROMAN[i]}
              </span>
              <h3
                data-lx="fade"
                style={d(80)}
                className="lx-display text-[clamp(1.9rem,3vw,2.75rem)] transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-3 lg:col-span-4"
              >
                {s.name}
              </h3>
              <p data-lx="fade" style={d(180)} className="lx-body text-[1rem] lg:col-span-4">
                {s.body}
              </p>
              <ul data-lx="fade" style={d(280)} className="space-y-2 lg:col-span-3" aria-label={`${s.name} outcomes`}>
                {s.outcomes.map((o) => (
                  <li key={o} className="lx-caps text-[0.625rem] text-[#ede7dc]/80">
                    {o}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
