import { COUNTS } from "./data";
import { LogStream } from "./LogStream";
import { Pane, SECTION, SectionHead, Tag, WRAP } from "./ui";

const LOG: { lvl: "INFO" | "WARN" | "ERR "; msg: string }[] = [
  { lvl: "INFO", msg: "growth: new entity, new region, new product line" },
  { lvl: "WARN", msg: "systems: ERP, CRM and finance disagree on \"revenue\"" },
  { lvl: "WARN", msg: "reports: three versions of the board pack in circulation" },
  { lvl: "WARN", msg: "people: reconciling spreadsheets between systems, by hand" },
  { lvl: "ERR ", msg: "visibility: leadership view is out of date" },
  { lvl: "ERR ", msg: "execution: decisions queued behind the numbers" },
];

const LVL = { INFO: "text-(--ice)", WARN: "text-(--amber)", "ERR ": "text-(--warn)" } as const;

export function Problem() {
  return (
    <section id="problem" tabIndex={-1} className={SECTION} aria-labelledby="v11-problem-title">
      <div className={WRAP}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionHead
              index="01"
              cmd="genius diagnose --growth"
              id="v11-problem-title"
              title="Complexity Is the Cost of Growth."
              lead="Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding everything together. Leadership loses visibility, execution slows down, and the business pays the price."
            />
          </div>

          <div className="min-w-0 space-y-4 lg:col-span-7 lg:pt-10">
            <Pane title="strain.log" meta={<Tag>illustrative</Tag>} bodyClass="v11-term px-4 py-4 text-[12.5px] leading-[1.8] sm:px-5 sm:text-[13px]">
              <LogStream
                lines={LOG.map((l, i) => (
                  <span key={i} className="grid grid-cols-[3.2rem_1fr] gap-x-2 sm:grid-cols-[4.6rem_3.2rem_1fr]">
                    <span className="hidden text-(--fg-3) sm:inline">+{String(i * 3 + 1).padStart(2, "0")}mo</span>
                    <span className={LVL[l.lvl]}>{l.lvl}</span>
                    <span className="text-(--fg-2)">{l.msg}</span>
                  </span>
                ))}
              />
            </Pane>

            <Pane title="growth.tsv" meta={<Tag>founding &rarr; enterprise &middot; illustrative</Tag>} bodyClass="v11-term text-[13px]">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">Illustrative growth of what a company holds together, from founding to enterprise</caption>
                <thead>
                  <tr className="border-b border-(--rule) text-(--fg-3)">
                    <th scope="col" className="px-4 py-2.5 font-normal sm:px-5">metric</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-normal">founding</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-normal sm:px-5">enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {COUNTS.map((c) => (
                    <tr key={c.label} className="border-b border-(--rule) last:border-0">
                      <th scope="row" className="px-4 py-2.5 font-normal text-(--fg-2) sm:px-5">{c.label}</th>
                      <td className="px-4 py-2.5 text-right tabular-nums text-(--fg-3)">{c.from}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-(--amber) sm:px-5">{c.to.toLocaleString("en-US")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Pane>
          </div>
        </div>

        {/* The turn: solve the right problem. */}
        <div className="mt-20 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p data-boot="" className="v11-term text-[13px] text-(--fg-3)">
              # When the business becomes fragmented, replacing systems can feel like the natural next step.
            </p>
            <h2 data-boot="" className="v11-display mt-5 text-[clamp(1.6rem,3.2vw,2.5rem)] text-(--fg)">
              Solve the Right Problem.
            </h2>
            <p data-boot="" className="mt-6 max-w-[58ch] text-pretty text-[15.5px] leading-[1.75] text-(--fg-2)">
              Sometimes replacement is necessary. But often, the problem can be solved without the cost, operational load, and disruption
              risk of a system transition. Building on what already works reduces complexity, expands capabilities, and unlocks more value
              from your systems and people.
            </p>
          </div>
          <div className="min-w-0 lg:col-span-7">
            <Pane title="strategy.diff" meta="1 file changed" bodyClass="v11-term py-3 text-[13px] leading-[1.9]">
              <p className="px-4 text-(--fg-3) sm:px-5">@@ how the business grows from here @@</p>
              <p className="bg-(--warn)/[0.08] px-4 text-(--warn) sm:px-5">
                <span aria-hidden="true">- </span>
                <span className="sr-only">Removed: </span>rip out and replace the systems
              </p>
              <p className="bg-(--warn)/[0.08] px-4 text-(--warn)/80 sm:px-5">
                <span aria-hidden="true">- </span>
                <span className="sr-only">Removed: </span>cost, operational load, disruption risk
              </p>
              <p className="bg-(--ice)/[0.08] px-4 text-(--ice) sm:px-5">
                <span aria-hidden="true">+ </span>
                <span className="sr-only">Added: </span>build on what already works
              </p>
              <p className="bg-(--ice)/[0.08] px-4 text-(--ice)/80 sm:px-5">
                <span aria-hidden="true">+ </span>
                <span className="sr-only">Added: </span>less complexity, more capability, more value from systems and people
              </p>
            </Pane>
          </div>
        </div>
      </div>
    </section>
  );
}
