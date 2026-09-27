import type { CSSProperties } from "react";
import { Caption, Opener, Rule, Up, shell } from "./type";

/** Illustrative growth of what a company has to hold together, founding to enterprise. */
const COUNTS = [
  { label: "Reports", from: 8, to: 940 },
  { label: "Manual handoffs", from: 2, to: 210 },
  { label: "Systems", from: 3, to: 46 },
  { label: "People in a decision", from: 2, to: 19 },
];

const W = 420;
const H = 340;
const PAD_T = 20;
const PAD_B = 34;
const X0 = 70;
const X1 = W - 150;
const y = (v: number) => Math.round((PAD_T + (H - PAD_T - PAD_B) * (1 - Math.log10(v) / 3)) * 10) / 10;

function Slope() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="plate block h-auto w-full" data-v8="draw" aria-hidden="true">
      {[1, 10, 100, 1000].map((t) => (
        <g key={t}>
          <line x1={X0} x2={X1} y1={y(t)} y2={y(t)} stroke="var(--rule)" strokeDasharray="2 4" />
          <text x={X0 - 12} y={y(t) + 4} textAnchor="end" fill="var(--ink-3)" fontSize="10">
            {t.toLocaleString("en-US")}
          </text>
        </g>
      ))}
      <line x1={X0} x2={X0} y1={PAD_T - 6} y2={H - PAD_B} stroke="var(--ink)" />
      <line x1={X1} x2={X1} y1={PAD_T - 6} y2={H - PAD_B} stroke="var(--ink)" />
      <text x={X0} y={H - 12} textAnchor="middle" fill="var(--ink)" fontSize="10" fontWeight="600" letterSpacing="1.4">
        FOUNDING
      </text>
      <text x={X1} y={H - 12} textAnchor="middle" fill="var(--ink)" fontSize="10" fontWeight="600" letterSpacing="1.4">
        ENTERPRISE
      </text>
      {COUNTS.map((c, i) => {
        const lead = i === 0;
        return (
          <g key={c.label}>
            <line
              x1={X0}
              y1={y(c.from)}
              x2={X1}
              y2={y(c.to)}
              pathLength={1}
              className="d"
              stroke={lead ? "var(--red)" : "var(--ink)"}
              strokeWidth={lead ? 2 : 1.1}
              style={{ "--i": i * 4 } as CSSProperties}
            />
            <circle cx={X0} cy={y(c.from)} r={3} fill="var(--paper)" stroke="var(--ink)" className="f" style={{ "--i": i } as CSSProperties} />
            <circle cx={X1} cy={y(c.to)} r={3.5} fill={lead ? "var(--red)" : "var(--ink)"} className="f" style={{ "--i": i + 4 } as CSSProperties} />
            <g className="f" style={{ "--i": i + 6 } as CSSProperties}>
              <text x={X1 + 12} y={y(c.to) + 1} fill="var(--ink)" fontSize="19" className="serif">
                {c.to.toLocaleString("en-US")}
              </text>
              <text x={X1 + 12} y={y(c.to) + 15} fill="var(--ink-3)" fontSize="9.5" letterSpacing="0.3">
                {c.label}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

export function Complexity() {
  return (
    <section id="complexity" data-chapter="complexity" className="scroll-mt-[var(--head-h)] py-20 sm:py-28" aria-labelledby="v8-complexity-title">
      <div className={shell}>
        <Opener numeral="I" kicker="The problem" title="Complexity Is the *Cost of Growth.*" titleId="v8-complexity-title" folio="04">
          <Up delay={250}>
            <p className="f-text mt-8 max-w-[40ch] text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.4] text-[color:var(--ink)]">
              Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding
              everything together. Leadership loses visibility, execution slows down, and the business pays the price.
            </p>
          </Up>
        </Opener>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Rule />
            <Up className="body-copy cols-2 mt-6">
              <p className="dropcap">
                When the business becomes fragmented, replacing systems can feel like the natural next step. A new platform
                promises a clean start, and a clean start is hard to argue with in a board meeting.
              </p>
              <p>
                But the strain rarely lives inside one system. It lives between them: in the exports, the reconciliations and
                the people who carry numbers from one screen to the next.
              </p>
              <h3 className="f-display no-break mb-3 mt-6 text-[1.875rem] leading-[1] text-[color:var(--ink)]">
                Solve the <span className="italic text-[color:var(--red)]">right</span> problem.
              </h3>
              <p className="!indent-0">
                Sometimes replacement is necessary. But often, the problem can be solved without the cost, operational load,
                and disruption risk of a system transition.
              </p>
              <p>
                Building on what already works reduces complexity, expands capabilities, and unlocks more value from your
                systems and people.
              </p>
            </Up>

            <Up as="blockquote" className="mt-12 border-l-2 border-[color:var(--red)] pl-6 sm:pl-8">
              <p className="f-display text-[clamp(2rem,3.6vw,3rem)] italic leading-[1.02]">
                &ldquo;People become the glue holding everything together.&rdquo;
              </p>
              <footer className="label mt-4 text-[color:var(--ink-3)]">The cost nobody budgets for</footer>
            </Up>
          </div>

          <figure className="lg:col-span-5 lg:border-l lg:border-[color:var(--rule)] lg:pl-10">
            <p className="label text-[color:var(--ink-2)]">What growth adds</p>
            <p className="f-display mt-2 text-[1.75rem] leading-[1.05]">Founding to enterprise</p>
            <div className="mt-6">
              <Slope />
            </div>
            <table className="smallcaps mt-6 w-full border-collapse text-left">
              <caption className="sr-only">What growth adds, founding to enterprise (illustrative)</caption>
              <thead>
                <tr className="border-b border-[color:var(--ink)] text-[color:var(--ink-3)]">
                  <th scope="col" className="py-2 font-semibold">Measure</th>
                  <th scope="col" className="py-2 text-right font-semibold">Founding</th>
                  <th scope="col" className="py-2 text-right font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {COUNTS.map((c) => (
                  <tr key={c.label} className="border-b border-[color:var(--rule)] text-[color:var(--ink)]">
                    <th scope="row" className="py-2 font-medium">{c.label}</th>
                    <td className="py-2 text-right tabular-nums">{c.from}</td>
                    <td className="py-2 text-right tabular-nums">{c.to.toLocaleString("en-US")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Caption fig="Fig. 2">Illustrative figures, not client data. Logarithmic scale.</Caption>
          </figure>
        </div>
      </div>
    </section>
  );
}
