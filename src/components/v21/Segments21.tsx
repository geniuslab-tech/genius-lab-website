import { SectionHead } from "./ui";
import { rd, wrap } from "./shared";

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

export function Segments21() {
  return (
    <section id="segments" className="relative scroll-mt-20 py-20 sm:py-28" aria-labelledby="v21-seg-title">
      <div className={wrap}>
        <SectionHead label="Solutions" id="v21-seg-title" lines={["Value creation for every", "stage of growth."]} />

        <ul className="mt-12 space-y-3 lg:mt-16">
          {SEGMENTS.map((s, i) => (
            <li key={s.name} data-rv="up" style={rd(i * 80)} className="v21-card v21-lift grid gap-5 p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-10">
              <div className="flex items-baseline gap-4 lg:col-span-4">
                <span className="v21-mono text-[0.8125rem] text-[var(--terra-ink)]">0{i + 1}</span>
                <h3 className="v21-display text-[clamp(1.6rem,2.6vw,2.1rem)]">{s.name}</h3>
              </div>
              <p className="leading-[1.65] text-[var(--ink-2)] lg:col-span-4">{s.body}</p>
              <ul className="flex flex-wrap gap-2 lg:col-span-4 lg:justify-end" aria-label={`${s.name} outcomes`}>
                {s.outcomes.map((o) => (
                  <li key={o} className="inline-flex h-8 items-center rounded-full bg-[#f3efe8] px-3 text-[0.8125rem] font-medium text-[var(--ink)]">
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
