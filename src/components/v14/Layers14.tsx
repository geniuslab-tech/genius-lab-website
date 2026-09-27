import { Head, Section, Split, delay } from "./ui";

const LAYERS = [
  {
    n: "01",
    name: "Data Engineering",
    role: "The foundation.",
    body: "We connect your systems and engineer their data into one governed, reliable foundation: integration, pipelines, modeling and quality.",
    gives: ["Connected systems", "A unified data platform", "Trusted, tested pipelines"],
    tone: "k",
  },
  {
    n: "02",
    name: "Analytics",
    role: "Organized data becomes understanding.",
    body: "Analysis and modeling explain what is happening, why it is happening and what is likely to happen next.",
    gives: ["Performance analysis", "Forecasts and drivers", "Customer and operational insight"],
    tone: "w",
  },
  {
    n: "03",
    name: "Business Intelligence",
    role: "Understanding becomes visible.",
    body: "One set of definitions behind every dashboard and report, so leadership sees the same numbers, at the same time.",
    gives: ["Executive dashboards", "Shared metrics and KPIs", "Self-service reporting"],
    tone: "k",
  },
  {
    n: "04",
    name: "Artificial Intelligence",
    role: "Visibility gains context and reasoning.",
    body: "AI learns your business context and becomes its Second Brain. AI Agents reason across systems, tables, metrics and processes to answer and act.",
    gives: ["Second Brain", "AI Agents", "Orchestrated execution"],
    tone: "u",
  },
] as const;

const TONES = {
  k: "bg-black text-white",
  w: "bg-white text-black",
  u: "bg-[#1f3bff] text-white",
};

/**
 * The four layers as one stacked bar. Foundation at the bottom, each block built on the one
 * beneath it, the decision on top. Blocks drop into place from the bottom up.
 */
export function Layers14() {
  return (
    <Section id="layers" n="02" label="Platform" titleId="v14-layers-title">
      <Head
        id="v14-layers-title"
        title={<>One intelligence and execution layer across your&nbsp;business.</>}
        lead="Not four products. Every layer is built on the one beneath it, and the top of the stack is a better decision."
      />

      <div className="flex">
        {/* Axis */}
        <div className="hidden w-12 shrink-0 flex-col items-center justify-between border-r-2 border-black py-4 md:flex" aria-hidden="true">
          <span className="v14-mono">&uarr;</span>
          <span className="v14-mono [writing-mode:vertical-rl] rotate-180">Each layer builds on the one beneath it</span>
          <span className="v14-mono">00</span>
        </div>

        <div data-r="group" className="flex min-w-0 flex-1 flex-col-reverse">
          <ol aria-label="Layers, foundation first" className="flex flex-col-reverse">
            {LAYERS.map((l, i) => (
              <li
                key={l.n}
                data-rc=""
                style={delay(i * 180)}
                className={`group grid border-t-2 border-black ${TONES[l.tone]} lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]`}
              >
                <div className="flex items-start gap-4 px-4 py-6 sm:gap-6 sm:px-6 lg:py-8">
                  <span className="v14-display shrink-0 text-[clamp(3.5rem,8vw,8.5rem)] leading-[0.76]" aria-hidden="true">
                    {l.n}
                  </span>
                  <div className="min-w-0">
                    <p className="v14-mono opacity-80">Layer {l.n}</p>
                    <h3 className="v14-head mt-2 text-[clamp(2rem,4.4vw,4.5rem)]">
                      <Split text={l.name} />
                    </h3>
                    <p className="mt-3 text-[1.0625rem] font-semibold">{l.role}</p>
                  </div>
                </div>
                <div className="border-current px-4 pb-6 sm:px-6 lg:border-l-2 lg:py-8">
                  <p className="text-pretty max-w-[48ch] leading-[1.6]">{l.body}</p>
                  <ul className="mt-5 border-b-2 border-current">
                    {l.gives.map((g, gi) => (
                      <li key={g} className="v14-mono flex items-baseline gap-3 border-t-2 border-current py-2">
                        <span className="w-8 shrink-0 opacity-75">{l.n}.{gi + 1}</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>

          {/* The top of the stack */}
          <div data-rc="" style={delay(760)} className="grid bg-white md:grid-cols-[auto_1fr] md:items-end">
            <p className="v14-display px-4 pt-6 text-[clamp(3rem,7vw,7.5rem)] text-[#1f3bff] sm:px-6 md:pb-6" aria-hidden="true">
              &uarr;&nbsp;=
            </p>
            <div className="px-4 pb-6 pt-3 sm:px-6 md:pt-6">
              <p className="v14-mono">The outcome</p>
              <h3 className="v14-head mt-2 text-[clamp(2.25rem,4.6vw,4.75rem)]">Better business decisions.</h3>
              <p className="text-pretty mt-3 max-w-[60ch] leading-[1.6]">
                Each layer builds on the one beneath it. Together they give executives clear insight, full visibility and
                the confidence to act.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
