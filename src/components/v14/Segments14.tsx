import { Head, Section, delay } from "./ui";

const SEGMENTS = [
  {
    name: "Investment Firms",
    body: "One live view across every portfolio company, with value creation tracked against the plan.",
    outcomes: ["Portfolio monitoring", "Value creation plans", "Board-ready reporting"],
  },
  {
    name: "M&A Teams",
    body: "Diligence on real data, then integration that connects two companies’ systems from day one.",
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

export function Segments14() {
  return (
    <Section id="segments" n="08" label="Solutions" titleId="v14-segments-title">
      <Head id="v14-segments-title" title="Value creation for every stage of growth." />
      <ul className="grid grid-cols-1 gap-[2px] bg-black sm:grid-cols-2 xl:grid-cols-4">
        {SEGMENTS.map((s, i) => (
          <li key={s.name} data-r="up" style={delay(i * 90)} className="v14-inv group flex flex-col bg-white px-4 py-5 sm:px-5">
            <span className="v14-display text-[4.5rem] text-[#1f3bff] group-hover:text-white" aria-hidden="true">
              {String.fromCharCode(65 + i)}
            </span>
            <h3 className="v14-head mt-6 text-[clamp(1.75rem,2.4vw,2.25rem)]">{s.name}</h3>
            <p className="v14-soft mt-3 leading-[1.55]">{s.body}</p>
            <ul className="mt-auto border-b-2 border-current pt-6">
              {s.outcomes.map((o) => (
                <li key={o} className="v14-mono border-t-2 border-current py-2">
                  {o}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}
