import { Heading } from "./ui";

const SEGMENTS = [
  {
    name: "Investment Firms",
    body: "One live view across every portfolio company, with value creation tracked against the plan.",
    outcomes: ["Portfolio monitoring", "Value creation plans", "Board-ready reporting"],
    tint: "bg-[linear-gradient(160deg,#eaf2ff,#ffffff_70%)]",
    dot: "#0071e3",
  },
  {
    name: "M&A Teams",
    body: "Diligence on real data, then integration that connects two companies' systems from day one.",
    outcomes: ["Data-driven diligence", "Day-one integration", "Synergy tracking"],
    tint: "bg-[linear-gradient(160deg,#f1edff,#ffffff_70%)]",
    dot: "#5e5ce6",
  },
  {
    name: "Multi-Entity Companies",
    body: "Every entity, currency and ledger consolidated into one trusted group picture.",
    outcomes: ["Automated consolidation", "Entity comparisons", "Group-wide KPIs"],
    tint: "bg-[linear-gradient(160deg,#e7f7f1,#ffffff_70%)]",
    dot: "#34c759",
  },
  {
    name: "Operating Companies",
    body: "Daily operations run on shared numbers, with agents that flag what needs attention.",
    outcomes: ["Operational dashboards", "Forecasting", "Proactive alerts"],
    tint: "bg-[linear-gradient(160deg,#fff3e6,#ffffff_70%)]",
    dot: "#ff9f0a",
  },
];

export function SegmentsV5() {
  return (
    <section id="segments" className="scroll-mt-12 bg-mist py-28 sm:py-40" aria-labelledby="v5-segments-title">
      <div className="mx-auto max-w-[1080px] px-5">
        <Heading id="v5-segments-title" eyebrow="Who it’s for" title="Value creation for every stage of growth." />

        <ul className="mt-16 grid gap-5 sm:mt-20 md:grid-cols-2">
          {SEGMENTS.map((s, i) => (
            <li
              key={s.name}
              data-reveal="up"
              data-delay={String((i % 2) * 90)}
              className={`flex flex-col rounded-[28px] p-8 shadow-[0_2px_12px_rgb(0_0_0/0.04)] transition-transform duration-500 ease-[var(--ease-out-expo)] hover:scale-[1.01] sm:p-10 ${s.tint}`}
            >
              <h3 className="v5-display text-[clamp(1.75rem,2.6vw,2.25rem)] text-graphite">{s.name}</h3>
              <p className="v5-body mt-3 text-[1.1875rem] text-graphite-2">{s.body}</p>
              <ul className="mt-auto flex flex-wrap gap-2 pt-10">
                {s.outcomes.map((o) => (
                  <li key={o} className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-[0.875rem] text-graphite shadow-[0_1px_2px_rgb(0_0_0/0.06)]">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} aria-hidden="true" />
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
