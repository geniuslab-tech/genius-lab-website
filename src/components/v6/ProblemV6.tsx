import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { h2v6 } from "./ui";

/** Illustrative growth of what a company has to hold together, founding to enterprise. */
const COUNTS = [
  { label: "Systems", from: 3, to: 46 },
  { label: "Reports", from: 8, to: 940 },
  { label: "Manual handoffs", from: 2, to: 210 },
  { label: "People in a decision", from: 2, to: 19 },
];

export function ProblemV6() {
  return (
    <section className="relative bg-[linear-gradient(180deg,#ffffff,#f5f7fb)] py-24 sm:py-32" aria-labelledby="v6-problem-title">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="grid border-t border-rule6 lg:grid-cols-12">
          <div className="border-rule6 py-12 lg:col-span-5 lg:border-r lg:py-16 lg:pr-12">
            <span className="block h-[2px] w-10 bg-sky" aria-hidden="true" />
            <h2 id="v6-problem-title" data-reveal="up" className={`${h2v6} mt-8 max-w-[13ch] text-steel`}>
              Complexity Is the Cost of Growth.
            </h2>
            <p data-reveal="up" data-delay="100" className="text-pretty mt-8 max-w-[48ch] text-[1.0625rem] leading-[1.75] text-steel-2">
              Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding
              everything together. Leadership loses visibility, execution slows down, and the business pays the price.
            </p>
          </div>

          <div className="flex items-center justify-center border-rule6 py-10 max-lg:border-t lg:col-span-2 lg:border-r lg:px-6">
            <p data-reveal="up" className="text-pretty max-w-[24ch] text-center text-[1.0625rem] leading-[1.6] text-steel-2">
              When the business becomes fragmented, replacing systems can feel like the natural next step.
            </p>
          </div>

          <div className="py-12 max-lg:border-t max-lg:border-rule6 lg:col-span-5 lg:py-16 lg:pl-12">
            <span className="block h-[2px] w-10 bg-ember" aria-hidden="true" />
            <h2 data-reveal="up" className={`${h2v6} mt-8 max-w-[13ch] text-steel`}>
              Solve the Right Problem.
            </h2>
            <p data-reveal="up" data-delay="100" className="text-pretty mt-8 max-w-[50ch] text-[1.0625rem] leading-[1.75] text-steel-2">
              Sometimes replacement is necessary. But often, the problem can be solved without the cost, operational load,
              and disruption risk of a system transition. Building on what already works reduces complexity, expands
              capabilities, and unlocks more value from your systems and people.
            </p>
          </div>
        </div>

        {/* What growth adds, founding to enterprise. */}
        <dl className="grid grid-cols-2 border-y border-rule6 lg:grid-cols-4">
          {COUNTS.map((c, i) => (
            <div key={c.label} data-reveal="up" data-delay={String(i * 70)} className="flex flex-col border-rule6 px-1 py-8 sm:px-6 lg:[&:not(:last-child)]:border-r max-lg:odd:border-r max-lg:[&:nth-child(-n+2)]:border-b">
              <dt className="v6-label order-2 mt-3 text-steel-3">{c.label}</dt>
              <dd className="order-1 flex items-baseline gap-3">
                <span className="font-mono text-[0.9375rem] text-steel-3">{c.from}</span>
                <ArrowRight size={14} className="text-steel-3" aria-hidden="true" />
                <span className="v6-display text-[clamp(2.25rem,3.6vw,3rem)] text-steel">{c.to.toLocaleString("en-US")}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="v6-label mt-4 text-steel-3">Founding to enterprise · illustrative</p>
      </div>
    </section>
  );
}
