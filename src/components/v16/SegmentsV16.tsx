import { Buildings, ChartPieSlice, Factory, GitMerge } from "@phosphor-icons/react/dist/ssr";
import { SectionHead } from "./ui";
import { Tilt } from "./Tilt";

const SEGMENTS = [
  {
    Icon: ChartPieSlice,
    name: "Investment Firms",
    body: "One live view across every portfolio company, with value creation tracked against the plan.",
    outcomes: ["Portfolio monitoring", "Value creation plans", "Board-ready reporting"],
  },
  {
    Icon: GitMerge,
    name: "M&A Teams",
    body: "Diligence on real data, then integration that connects two companies’ systems from day one.",
    outcomes: ["Data-driven diligence", "Day-one integration", "Synergy tracking"],
  },
  {
    Icon: Buildings,
    name: "Multi-Entity Companies",
    body: "Every entity, currency and ledger consolidated into one trusted group picture.",
    outcomes: ["Automated consolidation", "Entity comparisons", "Group-wide KPIs"],
  },
  {
    Icon: Factory,
    name: "Operating Companies",
    body: "Daily operations run on shared numbers, with agents that flag what needs attention.",
    outcomes: ["Operational dashboards", "Forecasting", "Proactive alerts"],
  },
];

export function SegmentsV16() {
  return (
    <section id="segments" className="scroll-mt-16 py-24 sm:py-32" aria-labelledby="v16-segments-title">
      <div className="v16-wrap">
        <SectionHead n="07" id="v16-segments-title" kicker="Solutions" title="Value creation for every stage of growth." />
        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {SEGMENTS.map(({ Icon, name, body, outcomes }) => (
            <Tilt as="li" key={name} className="v16-panel flex flex-col p-6 sm:p-7" max={8}>
              <Icon size={24} className="text-[color:var(--ice)]" aria-hidden="true" />
              <h3 className="v16-display mt-10 text-[1.3125rem]">{name}</h3>
              <p className="mt-2 leading-[1.65] text-[color:var(--tx-2)]">{body}</p>
              <ul className="mt-auto space-y-2 border-t border-[color:var(--line)] pt-5 text-[0.9375rem]">
                {outcomes.map((o) => (
                  <li key={o} className="flex items-center gap-2.5">
                    <span className="h-px w-3 bg-[color:var(--ice)]" aria-hidden="true" />
                    {o}
                  </li>
                ))}
              </ul>
            </Tilt>
          ))}
        </ul>
      </div>
    </section>
  );
}
