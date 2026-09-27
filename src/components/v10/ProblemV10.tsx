import { Chapter, Exhibit } from "./ui";
import { CountUp } from "./CountUp";
import { InView } from "./InView";

/** Illustrative growth of what a company has to hold together, founding to enterprise. */
const COUNTS = [
  { label: "Systems in use", from: 3, to: 46 },
  { label: "Reports in circulation", from: 8, to: 940 },
  { label: "Manual handoffs", from: 2, to: 210 },
  { label: "People in a decision", from: 2, to: 19 },
];

const RESPONSES = [
  { k: "Cost", replace: "A capital-intensive programme, paid before value arrives.", build: "Investment goes into the layer above the systems you run." },
  { k: "Operational load", replace: "Teams run the old and the new in parallel.", build: "Day-to-day systems keep running as they are." },
  { k: "Disruption risk", replace: "Concentrated at cut-over.", build: "Contained. Nothing is switched off." },
  { k: "Time to value", replace: "After migration completes.", build: "As each layer lands." },
  { k: "Existing investment", replace: "Written off.", build: "Extended, with more value from systems and people." },
];

export function ProblemV10() {
  return (
    <Chapter
      id="problem"
      n="01"
      label="The problem"
      title="Complexity Is the Cost of Growth."
      lead="Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding everything together. Leadership loses visibility, execution slows down, and the business pays the price."
      note={<>Figures in Exhibit 1 describe a typical growth path. They are illustrative, not measured client data.</>}
    >
      <Exhibit
        n={1}
        className="mt-14 sm:mt-16"
        title="What a growing company has to hold together, founding to enterprise"
        source="Genius Lab. Illustrative figures for a typical company; not client data."
      >
        <div className="hidden grid-cols-[minmax(0,15rem)_1fr_6rem] gap-6 border-b border-[color:var(--rule)] pb-2 text-[color:var(--slate)] md:grid">
          <span className="caps">Measure</span>
          <span className="caps">At founding / at enterprise scale</span>
          <span className="caps text-right">Enterprise</span>
        </div>
        <dl>
          {COUNTS.map((c, i) => {
            const pct = Math.max(1.5, Math.round((c.from / c.to) * 1000) / 10);
            return (
              <div key={c.label} className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 border-b border-[color:var(--rule)] py-5 md:grid-cols-[minmax(0,15rem)_1fr_6rem]">
                <dt className="text-[0.9375rem] font-medium text-[color:var(--ink)]">{c.label}</dt>
                <dd className="order-3 col-span-2 md:order-none md:col-span-1">
                  <div className="flex items-center gap-3">
                    <span className="draw-x h-[6px] shrink-0 bg-[color:var(--slate-2)]" style={{ width: `${pct}%`, ["--i" as string]: i }} aria-hidden="true" />
                    <span className="tnum text-[0.8125rem] text-[color:var(--slate)]">
                      <span className="sr-only">From </span>
                      {c.from}
                    </span>
                  </div>
                  <div className="mt-2 h-[14px] w-full bg-[color:var(--paper-2)]">
                    <span className="draw-x block h-full w-full bg-[#101440]" style={{ ["--i" as string]: i }} aria-hidden="true" />
                  </div>
                </dd>
                <dd className="serif tnum text-right text-[clamp(1.75rem,3vw,2.5rem)] leading-none text-[color:var(--ink)]">
                  <span className="sr-only">to </span>
                  <CountUp to={c.to} duration={1300 + i * 150} />
                </dd>
              </div>
            );
          })}
        </dl>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[0.75rem] text-[color:var(--slate)]" aria-hidden="true">
          <span className="flex items-center gap-2">
            <span className="h-[6px] w-5 bg-[color:var(--slate-2)]" /> At founding, to scale
          </span>
          <span className="flex items-center gap-2">
            <span className="h-[10px] w-5 bg-[#101440]" /> At enterprise scale
          </span>
        </div>
      </Exhibit>

      <div className="mt-20 grid gap-8 lg:grid-cols-10 lg:gap-6">
        <p data-reveal="up" className="serif text-pretty text-[clamp(1.375rem,2.4vw,1.875rem)] italic leading-[1.35] text-[color:var(--ink)] lg:col-span-4">
          When the business becomes fragmented, replacing systems can feel like the natural next step.
        </p>
        <div className="lg:col-span-6">
          <h3 data-reveal="up" className="serif text-[clamp(1.625rem,2.6vw,2.125rem)] leading-[1.15] text-[color:var(--ink)]">
            Solve the Right Problem.
          </h3>
          <p data-reveal="up" data-delay="80" className="text-pretty mt-4 max-w-[62ch] text-[1.0625rem] leading-[1.75] text-[color:var(--slate)]">
            Sometimes replacement is necessary. But often, the problem can be solved without the cost, operational load,
            and disruption risk of a system transition. Building on what already works reduces complexity, expands
            capabilities, and unlocks more value from your systems and people.
          </p>
        </div>
      </div>

      <Exhibit
        n={2}
        className="mt-14"
        title="Two responses to a fragmented business"
        source="Genius Lab. Qualitative comparison; illustrative. Replacement is sometimes the right answer."
      >
        <InView as="div" threshold={0.1}>
          <table className="ledger text-[0.9375rem] leading-[1.6]">
            <caption className="sr-only">Replacing systems compared with building on what already works</caption>
            <thead>
              <tr className="caps text-[color:var(--slate)]">
                <th scope="col" className="w-[22%] font-medium">Consideration</th>
                <th scope="col" className="w-[39%] font-medium">Replace the systems</th>
                <th scope="col" className="col-with w-[39%] font-medium text-[color:var(--ink)]">Build on what works</th>
              </tr>
            </thead>
            <tbody>
              {RESPONSES.map((r, i) => (
                <tr key={r.k} className="row-in" style={{ ["--i" as string]: i }}>
                  <th scope="row" className="font-medium text-[color:var(--ink)]">{r.k}</th>
                  <td data-label="Replace the systems" className="text-[color:var(--slate)]">{r.replace}</td>
                  <td data-label="Build on what works" className="col-with text-[color:var(--ink)]">{r.build}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </InView>
      </Exhibit>
    </Chapter>
  );
}
