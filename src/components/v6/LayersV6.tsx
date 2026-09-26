import { ArrowDown, ChartLineUp, Database, PresentationChart, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { Intro } from "./ui";

const LAYERS = [
  {
    n: "01",
    Icon: Database,
    name: "Data Engineering",
    role: "The foundation.",
    body: "We connect your systems and engineer their data into one governed, reliable foundation: integration, pipelines, modeling and quality.",
    gives: ["Connected systems", "A unified data platform", "Trusted, tested pipelines"],
  },
  {
    n: "02",
    Icon: ChartLineUp,
    name: "Analytics",
    role: "Organized data becomes understanding.",
    body: "Analysis and modeling explain what is happening, why it is happening and what is likely to happen next.",
    gives: ["Performance analysis", "Forecasts and drivers", "Customer and operational insight"],
  },
  {
    n: "03",
    Icon: PresentationChart,
    name: "Business Intelligence",
    role: "Understanding becomes visible.",
    body: "One set of definitions behind every dashboard and report, so leadership sees the same numbers, at the same time.",
    gives: ["Executive dashboards", "Shared metrics and KPIs", "Self-service reporting"],
  },
  {
    n: "04",
    Icon: Sparkle,
    name: "Artificial Intelligence",
    role: "Visibility gains context and reasoning.",
    body: "AI learns your business context and becomes its Second Brain. AI Agents reason across systems, tables, metrics and processes to answer and act.",
    gives: ["Second Brain", "AI Agents", "Orchestrated execution"],
  },
];

const OUTCOME = {
  name: "Better business decisions",
  body: "Each layer builds on the one beneath it. Together they give executives clear insight, full visibility and the confidence to act.",
};

export function LayersV6() {
  return (
    <section id="layers" className="scroll-mt-[4.5rem] bg-white py-24 sm:py-32" aria-labelledby="v6-layers-title">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Intro
              id="v6-layers-title"
              label="Platform"
              title={<>One intelligence and execution layer across your&nbsp;business.</>}
              lead="Not four products. Every layer is built on the one beneath it, and the top of the stack is a better decision."
            />
          </div>
        </div>

        <ol className="lg:col-span-7" aria-label="Layers, foundation first">
          {LAYERS.map(({ n, Icon, name, role, body, gives }) => (
            <li key={n}>
              <article data-reveal="up" className="group grid gap-6 rounded-[12px] border border-rule6 bg-white p-6 transition-[border-color,box-shadow] duration-300 hover:border-sky/40 hover:shadow-[0_20px_40px_-28px_rgb(37_99_235/0.45)] sm:grid-cols-[auto_1fr] sm:p-8">
                <div className="flex items-center gap-4 sm:flex-col sm:items-start">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] bg-frost text-sky-ink transition-colors duration-300 group-hover:bg-sky group-hover:text-white">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span className="v6-label text-steel-3">Layer {n}</span>
                </div>
                <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
                  <div>
                    <h3 className="text-[1.5rem] font-bold tracking-[-0.02em] text-steel">{name}</h3>
                    <p className="mt-1 font-semibold text-sky-ink">{role}</p>
                    <p className="mt-3 leading-[1.7] text-steel-2">{body}</p>
                  </div>
                  <ul className="space-y-2 self-start border-rule6 md:border-l md:pl-6">
                    {gives.map((g) => (
                      <li key={g} className="flex items-center gap-2.5 text-[0.9375rem] text-steel">
                        <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden="true" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
              <div className="flex justify-center py-2 text-steel-3" aria-hidden="true">
                <ArrowDown size={16} />
              </div>
            </li>
          ))}
          <li>
            <article data-reveal="up" className="relative overflow-hidden rounded-[12px] bg-abyss p-8 text-white sm:p-10">
              <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgb(242_154_31/0.35),transparent)]" aria-hidden="true" />
              <p className="v6-label relative text-ember">The outcome</p>
              <div className="relative mt-4 grid gap-4 md:grid-cols-2 md:items-end">
                <h3 className="v6-display text-[clamp(1.75rem,3vw,2.5rem)]">{OUTCOME.name}</h3>
                <p className="leading-[1.7] text-white/65">{OUTCOME.body}</p>
              </div>
            </article>
          </li>
        </ol>
      </div>
    </section>
  );
}
