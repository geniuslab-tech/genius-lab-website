import { Note, R } from "./ui";

/** Illustrative growth of what a company has to hold together, founding to enterprise. */
const COUNTS = [
  { label: "Systems", from: 3, to: 46 },
  { label: "Reports", from: 8, to: 940 },
  { label: "Manual handoffs", from: 2, to: 210 },
  { label: "People in a decision", from: 2, to: 19 },
];

export function Problem() {
  return (
    <section id="problem" data-tone="mist" className="v20-sec py-28 sm:py-40" aria-labelledby="v20-problem-title">
      <div className="mx-auto max-w-[1120px] px-5">
        <div className="mx-auto max-w-[56rem] text-center">
          <R as="p" className="v20-eyebrow">
            The problem
          </R>
          <R as="h2" delay={60} id="v20-problem-title" className="v20-display v20-h2 mx-auto mt-3 max-w-[13ch]">
            Complexity Is the Cost of Growth
          </R>
          <R as="p" delay={120} className="v20-lead mx-auto mt-7 max-w-[44ch]">
            Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding
            everything together. Leadership loses visibility, execution slows down, and the business pays the price.
          </R>
        </div>

        <R delay={80} className="v20-card mt-16 px-6 py-10 sm:mt-20 sm:px-12 sm:py-14">
          <p className="v20-fg2 text-center text-[1.0625rem] font-medium">What growth adds, from founding to enterprise<sup className="v20-fg3 ml-0.5 text-[0.625rem]">1</sup></p>
          <dl className="mt-10 grid grid-cols-2 gap-y-10 lg:grid-cols-4">
            {COUNTS.map((c) => (
              <div key={c.label} className="flex flex-col text-center">
                <dt className="v20-fg order-2 mt-1 text-[0.9375rem] font-medium">{c.label}</dt>
                <dd className="v20-display v20-num order-1 text-[clamp(2.75rem,5vw,4rem)] tracking-[-0.05em]">
                  <span className="sr-only">From {c.from} to </span>
                  {c.to.toLocaleString("en-US")}
                </dd>
                <dd className="v20-fg3 order-3 text-[0.8125rem]" aria-hidden="true">
                  from {c.from}
                </dd>
              </div>
            ))}
          </dl>
        </R>
        <Note n={1} className="mt-5 text-center">
          Illustrative figures for a typical growing company. Not client data.
        </Note>
      </div>
    </section>
  );
}
