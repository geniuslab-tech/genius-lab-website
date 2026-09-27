import { Kicker, d } from "./ui";

/** Illustrative growth of what a company has to hold together, founding to enterprise. */
const COUNTS = [
  { label: "Systems", from: 3, to: 46 },
  { label: "Reports", from: 8, to: 940 },
  { label: "Manual handoffs", from: 2, to: 210 },
  { label: "People in a decision", from: 2, to: 19 },
];

export function ProblemV15() {
  return (
    <section id="problem" className="relative scroll-mt-20 bg-[#0c0b0a] py-32 sm:py-48" aria-labelledby="v15-problem-title">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-10">
        {/* The condition, set to the left. */}
        <div className="max-w-[640px]">
          <Kicker n="I">The condition</Kicker>
          <h2 id="v15-problem-title" data-lx="settle" style={d(150)} className="lx-display mt-10 text-[clamp(2.5rem,5.4vw,5rem)]">
            Complexity Is the <em>Cost of Growth.</em>
          </h2>
          <p data-lx="fade" style={d(350)} className="lx-body mt-10 max-w-[46ch]">
            Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding
            everything together. Leadership loses visibility, execution slows down, and the business pays the price.
          </p>
        </div>

        {/* The hinge, centred. */}
        <div className="my-28 flex flex-col items-center text-center sm:my-40">
          <span data-lx="line-y" className="lx-hair-v h-20" aria-hidden="true" />
          <p data-lx="fade" style={d(200)} className="lx-serif mt-10 max-w-[30ch] text-[clamp(1.5rem,2.6vw,2.15rem)] font-light italic leading-[1.35] text-[#ede7dc]/85">
            When the business becomes fragmented, replacing systems can feel like the natural next step.
          </p>
          <span data-lx="line-y" style={d(400)} className="lx-hair-v mt-10 h-20" aria-hidden="true" />
        </div>

        {/* The answer, set to the right. */}
        <div className="ml-auto max-w-[640px]">
          <Kicker n="II">The answer</Kicker>
          <h2 data-lx="settle" style={d(150)} className="lx-display mt-10 text-[clamp(2.5rem,5.4vw,5rem)]">
            Solve the <em className="lx-gold">Right Problem.</em>
          </h2>
          <p data-lx="fade" style={d(350)} className="lx-body mt-10 max-w-[50ch]">
            Sometimes replacement is necessary. But often, the problem can be solved without the cost, operational load, and
            disruption risk of a system transition. Building on what already works reduces complexity, expands capabilities,
            and unlocks more value from your systems and people.
          </p>
        </div>

        {/* What growth adds. */}
        <div className="mt-36 sm:mt-48">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4 lg:gap-x-10">
            {COUNTS.map((c, i) => (
              <div key={c.label} className="flex flex-col">
                <span data-lx="line" style={d(i * 160)} className="lx-hair" aria-hidden="true" />
                <dt data-lx="fade" style={d(200 + i * 160)} className="lx-caps order-2 mt-4 text-[#ede7dc]/75">
                  {c.label}
                </dt>
                <dd data-lx="fade" style={d(120 + i * 160)} className="order-1 mt-8 flex items-baseline gap-3">
                  <span className="lx-serif text-[1.1rem] text-[#ede7dc]/60">{c.from}</span>
                  <span className="lx-serif text-[1rem] text-[#ede7dc]/40" aria-hidden="true">
                    &mdash;
                  </span>
                  <span className="sr-only">to</span>
                  <span className="lx-num text-[clamp(2.75rem,5vw,4.25rem)] font-light leading-none">{c.to.toLocaleString("en-US")}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="lx-caps mt-10 text-[#ede7dc]/60">Founding to enterprise &middot; illustrative figures</p>
        </div>
      </div>
    </section>
  );
}
