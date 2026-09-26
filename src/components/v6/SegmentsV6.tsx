import { Buildings, ChartPieSlice, Factory, GitMerge } from "@phosphor-icons/react/dist/ssr";
import { Intro } from "./ui";

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
    body: "Diligence on real data, then integration that connects two companies' systems from day one.",
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

export function SegmentsV6() {
  return (
    <section id="segments" className="scroll-mt-[4.5rem] bg-white py-24 sm:py-32" aria-labelledby="v6-segments-title">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <Intro id="v6-segments-title" label="Solutions" title="Value creation for every stage of growth." />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {SEGMENTS.map(({ Icon, name, body, outcomes }, i) => (
            <li
              key={name}
              data-reveal="up"
              data-delay={String(i * 70)}
              className="group relative flex flex-col overflow-hidden rounded-[14px] border border-rule6 bg-white p-7 transition-[border-color,box-shadow,transform] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-sky/40 hover:shadow-[0_30px_50px_-34px_rgb(37_99_235/0.5)]"
            >
              <span className={`absolute inset-x-0 top-0 h-[3px] ${i % 2 ? "bg-ember" : "bg-sky"}`} aria-hidden="true" />
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-frost text-steel">
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-8 text-[1.3125rem] font-bold tracking-[-0.015em] text-steel">{name}</h3>
              <p className="mt-2 leading-[1.65] text-steel-2">{body}</p>
              <ul className="mt-auto space-y-2 border-t border-rule6 pt-5 text-[0.9375rem] text-steel">
                {outcomes.map((o) => (
                  <li key={o} className="flex items-center gap-2.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${i % 2 ? "bg-ember" : "bg-sky"}`} aria-hidden="true" />
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
