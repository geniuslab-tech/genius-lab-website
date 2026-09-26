import { Check } from "@phosphor-icons/react/dist/ssr";
import { Heading } from "./ui";

const LAYERS = [
  {
    n: "01",
    name: "Data Engineering",
    role: "The foundation.",
    body: "We connect your systems and engineer their data into one governed, reliable foundation: integration, pipelines, modeling and quality.",
    gives: ["Connected systems", "A unified data platform", "Trusted, tested pipelines"],
  },
  {
    n: "02",
    name: "Analytics",
    role: "Organized data becomes understanding.",
    body: "Analysis and modeling explain what is happening, why it is happening and what is likely to happen next.",
    gives: ["Performance analysis", "Forecasts and drivers", "Customer and operational insight"],
  },
  {
    n: "03",
    name: "Business Intelligence",
    role: "Understanding becomes visible.",
    body: "One set of definitions behind every dashboard and report, so leadership sees the same numbers, at the same time.",
    gives: ["Executive dashboards", "Shared metrics and KPIs", "Self-service reporting"],
  },
  {
    n: "04",
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

/** Where this layer sits in the stack: four slabs, this one lit. */
function Stack({ k }: { k: number }) {
  return (
    <svg viewBox="0 0 64 56" className="h-12 w-14" aria-hidden="true">
      {[3, 2, 1, 0].map((i) => {
        const y = 6 + (3 - i) * 12;
        const on = i === k;
        const below = i < k;
        return (
          <g key={i}>
            <path d={`M32 ${y} L60 ${y + 8} L32 ${y + 16} L4 ${y + 8} Z`} fill={on ? "#0071e3" : below ? "#1d1d1f" : "#e8e8ed"} fillOpacity={below ? 0.14 : 1} />
          </g>
        );
      })}
    </svg>
  );
}

export function LayersV5() {
  return (
    <section id="layers" className="scroll-mt-12 bg-mist py-28 sm:py-40" aria-labelledby="v5-layers-title">
      <div className="mx-auto max-w-[1080px] px-5">
        <Heading
          id="v5-layers-title"
          eyebrow="Capabilities"
          title={<>One intelligence and execution layer across your&nbsp;business.</>}
          lead="Not four products. Every layer is built on the one beneath it, and the top of the stack is a better decision."
        />

        <div className="mt-16 grid gap-5 sm:mt-20 md:grid-cols-2">
          {LAYERS.map((l, k) => (
            <article
              key={l.n}
              data-reveal="up"
              data-delay={String((k % 2) * 90)}
              className="flex flex-col rounded-[28px] bg-white p-8 shadow-[0_2px_12px_rgb(0_0_0/0.04)] transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgb(0_0_0/0.18)] sm:p-10"
            >
              <div className="flex items-start justify-between gap-6">
                <p className="text-[0.875rem] font-semibold text-azure">Layer {l.n}</p>
                <Stack k={k} />
              </div>
              <h3 className="v5-display mt-4 text-[clamp(1.75rem,2.6vw,2.25rem)] text-graphite">{l.name}</h3>
              <p className="mt-2 text-[1.1875rem] font-semibold tracking-[-0.015em] text-graphite">{l.role}</p>
              <p className="v5-body mt-4 text-[1.0625rem] text-graphite-2">{l.body}</p>
              <ul className="mt-auto space-y-2.5 pt-8">
                {l.gives.map((g) => (
                  <li key={g} className="flex items-center gap-3 text-[0.9375rem] text-graphite">
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-azure/10 text-azure" aria-hidden="true">
                      <Check size={11} weight="bold" />
                    </span>
                    {g}
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <article
            data-reveal="up"
            className="relative overflow-hidden rounded-[28px] bg-graphite p-8 text-white sm:p-12 md:col-span-2"
          >
            <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgb(0_113_227/0.55),transparent)]" aria-hidden="true" />
            <p className="relative text-[0.875rem] font-semibold text-[#2997ff]">The outcome</p>
            <div className="relative mt-4 grid gap-6 md:grid-cols-2 md:items-end">
              <h3 className="v5-display text-[clamp(2rem,4vw,3.25rem)]">{OUTCOME.name}</h3>
              <p className="v5-body text-[1.1875rem] text-[#a1a1a6]">{OUTCOME.body}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
