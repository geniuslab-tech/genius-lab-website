import { CountUp } from "./ui";

/** Illustrative growth of what a company has to hold together, founding to enterprise. */
const COUNTS = [
  { label: "Systems", from: 3, to: 46 },
  { label: "Reports", from: 8, to: 940 },
  { label: "Manual handoffs", from: 2, to: 210 },
  { label: "People in a decision", from: 2, to: 19 },
];

export function ProblemV18() {
  return (
    <section className="bg-white py-24 sm:py-32" aria-labelledby="v18-problem-title">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6" data-rv="">
            <p className="v18-label flex items-center gap-3 text-(--ink-3)">
              <span className="text-(--sky-ink)">01</span>
              <span className="h-px w-8 bg-(--rule-2)" aria-hidden="true" />
              The problem
            </p>
            <h2 id="v18-problem-title" className="v18-h2 mt-5 max-w-[14ch]">
              Complexity Is the Cost of Growth
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-12" data-rv="" style={{ ["--rd" as string]: "90ms" }}>
            <p className="text-pretty max-w-[54ch] text-[1.125rem] leading-[1.75] text-(--ink-2)">
              Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding everything together. Leadership loses visibility, execution slows down, and the business pays the price.
            </p>
            <div className="mt-8 border-l-2 border-(--ember) pl-5">
              <p className="font-bold text-(--ink)">Solve the right problem.</p>
              <p className="text-pretty mt-2 max-w-[52ch] leading-[1.7] text-(--ink-2)">
                Replacing systems can feel like the natural next step. Sometimes it is necessary, but often the problem can be solved without the cost, operational load and disruption of a system transition. Building on what already works reduces complexity and unlocks more value from your systems and people.
              </p>
            </div>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 overflow-hidden rounded-[16px] bg-(--rule) [gap:1px] shadow-[0_0_0_1px_var(--rule)] lg:mt-20 lg:grid-cols-4">
          {COUNTS.map((c, i) => (
            <div key={c.label} data-rv="" style={{ ["--rd" as string]: `${i * 70}ms` }} className="flex flex-col bg-white p-5 sm:p-7">
              <dt className="v18-label order-3 mt-4 text-(--ink-3)">{c.label}</dt>
              <dd className="order-1 flex items-baseline gap-2.5">
                <span className="v18-mono text-[0.875rem] text-(--ink-3)">{c.from}</span>
                <span className="text-(--ink-3)" aria-hidden="true">
                  →
                </span>
                <CountUp to={c.to} className="v18-display text-[clamp(2rem,3.6vw,3rem)] text-(--ink)" />
              </dd>
              <dd className="order-2 mt-4 h-1 overflow-hidden rounded-full bg-(--grey-2)" aria-hidden="true">
                <span className={`block h-full rounded-full ${i === 2 ? "bg-(--ember)" : "bg-(--navy)"}`} style={{ width: `${Math.round(30 + (i * 17) % 60)}%` }} />
              </dd>
            </div>
          ))}
        </dl>
        <p className="v18-label mt-4 text-(--ink-3)">Founding to enterprise · illustrative figures</p>
      </div>
    </section>
  );
}
