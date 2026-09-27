import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Kicker } from "./ui";
import { Tilt } from "./Tilt";

/** Illustrative growth of what a company has to hold together, founding to enterprise. */
const COUNTS = [
  { label: "Systems", from: 3, to: 46 },
  { label: "Reports", from: 8, to: 940 },
  { label: "Manual handoffs", from: 2, to: 210 },
  { label: "People in a decision", from: 2, to: 19 },
];

export function ProblemV16() {
  return (
    <section className="relative py-24 sm:py-32" aria-labelledby="v16-problem-title">
      <div className="v16-wrap">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Kicker n="00">The problem</Kicker>
            <h2 id="v16-problem-title" className="v16-h2 mt-6 max-w-[14ch]">
              Complexity Is the Cost of Growth
            </h2>
            <p className="v16-lead mt-7 max-w-[50ch]">
              Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding
              everything together. Leadership loses visibility, execution slows down, and the business pays the price.
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-16">
            <p className="text-[1.0625rem] leading-[1.65] text-[color:var(--tx-3)]">
              When the business becomes fragmented, replacing systems can feel like the natural next step.
            </p>
            <h3 className="v16-display mt-8 text-[clamp(1.625rem,2.6vw,2.25rem)]">
              Solve the <span className="text-[color:var(--ice)]">Right</span> Problem.
            </h3>
            <p className="v16-lead mt-5">
              Sometimes replacement is necessary. But often, the problem can be solved without the cost, operational load,
              and disruption risk of a system transition. Building on what already works reduces complexity, expands
              capabilities, and unlocks more value from your systems and people.
            </p>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-20 lg:grid-cols-4">
          {COUNTS.map((c, i) => (
            <Tilt key={c.label} className="v16-panel flex flex-col p-5 sm:p-7" max={9}>
              <dt className="v16-label order-2 mt-4 text-[color:var(--tx-3)]">{c.label}</dt>
              <dd className="order-1">
                <span className="v16-mono flex items-center gap-2 text-[0.8125rem] text-[color:var(--tx-3)]">
                  {c.from}
                  <ArrowRight size={12} aria-hidden="true" />
                  <span className="sr-only">to</span>
                </span>
                <span className={`v16-display mt-2 block text-[clamp(2.25rem,4vw,3.25rem)] ${i === 3 ? "text-[color:var(--warm)]" : ""}`}>
                  {c.to.toLocaleString("en-US")}
                </span>
              </dd>
            </Tilt>
          ))}
        </dl>
        <p className="v16-label mt-4 text-[color:var(--tx-3)]">Founding to enterprise · illustrative</p>
      </div>
    </section>
  );
}
