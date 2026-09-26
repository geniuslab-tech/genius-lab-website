import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { SectionTag, h2v4 } from "./ui";

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

/** Audiences as an index: one row each, lit on hover. */
export function SegmentsV4() {
  return (
    <section id="segments" className="relative scroll-mt-16 py-24 sm:py-32" aria-labelledby="v4-segments-title">
      <div className="shell">
        <SectionTag n="08">Who it&rsquo;s for</SectionTag>
        <h2 id="v4-segments-title" data-reveal="up" className={`${h2v4} mt-8 max-w-[18ch]`}>
          Value creation for every stage of growth.
        </h2>

        <div className="mt-14 lg:mt-20">
          <div className="v4-label hidden grid-cols-12 gap-6 border-b border-line pb-3 text-[0.6875rem] text-white/30 lg:grid">
            <span className="col-span-1">ID</span>
            <span className="col-span-3">Segment</span>
            <span className="col-span-4">What changes</span>
            <span className="col-span-4">Outcomes</span>
          </div>
          <ul>
            {SEGMENTS.map((s, i) => (
              <li
                key={s.name}
                data-reveal="up"
                data-delay={String(i * 70)}
                className="group relative grid gap-4 border-b border-line py-8 transition-colors duration-300 hover:bg-[linear-gradient(90deg,rgb(85_119_255/0.12),transparent_70%)] lg:grid-cols-12 lg:items-start lg:gap-6"
              >
                <span className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-cyan transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100" aria-hidden="true" />
                <span className="type-mono text-white/30 transition-colors group-hover:text-cyan lg:col-span-1 lg:pl-4">S-0{i + 1}</span>
                <h3 className="type-display flex items-start justify-between gap-4 text-[clamp(1.5rem,2.4vw,2rem)] text-white [font-variation-settings:'wdth'_112] lg:col-span-3">
                  {s.name}
                  <ArrowUpRight size={20} className="mt-1 shrink-0 text-white/30 transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan lg:hidden" aria-hidden="true" />
                </h3>
                <p className="max-w-[48ch] leading-relaxed text-white/60 lg:col-span-4">{s.body}</p>
                <ul className="flex flex-wrap gap-2 lg:col-span-4">
                  {s.outcomes.map((o) => (
                    <li key={o} className="type-mono inline-flex h-8 items-center gap-2 border border-line px-3 text-[0.75rem] text-white/75 transition-colors group-hover:border-white/20">
                      <span className="h-1 w-1 bg-cyan" aria-hidden="true" />
                      {o}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
