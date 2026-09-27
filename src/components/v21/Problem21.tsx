import type { CSSProperties } from "react";
import { Illustrative, Lines, SectionHead } from "./ui";
import { rd, wrap } from "./shared";

/** Illustrative growth of what a company has to hold together, founding to enterprise. */
const COUNTS = [
  { label: "Systems", from: 3, to: 46 },
  { label: "Reports", from: 8, to: 940 },
  { label: "Manual handoffs", from: 2, to: 210 },
  { label: "People in a decision", from: 2, to: 19 },
];

const dd = (ms: number) => ({ "--dd": `${ms}ms` }) as CSSProperties;

/* Before: systems scattered, held together by people (small rings) along crooked paths. */
const BEFORE = [
  { x: 40, y: 50, t: "ERP" },
  { x: 150, y: 28, t: "CRM" },
  { x: 205, y: 120, t: "Sheets" },
  { x: 58, y: 170, t: "Payroll" },
  { x: 170, y: 230, t: "BI" },
  { x: 36, y: 262, t: "Files" },
];
const BEFORE_LINKS = [
  "M64 62 L96 104 L176 44",
  "M176 44 L150 88 L220 132",
  "M84 182 L132 152 L220 132",
  "M84 182 L110 222 L186 242",
  "M62 274 L118 196 L186 242",
  "M64 62 L30 118 L84 182",
];
const PEOPLE = [
  [96, 104],
  [150, 88],
  [132, 152],
  [110, 222],
  [118, 196],
  [30, 118],
];

/* After: the same systems, each wired once to a shared layer at the centre. */
const AC = { x: 420, y: 150 };
const AFTER = [
  { x: 420, y: 36, t: "ERP" },
  { x: 518, y: 92, t: "CRM" },
  { x: 518, y: 208, t: "Sheets" },
  { x: 420, y: 264, t: "BI" },
  { x: 322, y: 208, t: "Files" },
  { x: 322, y: 92, t: "Payroll" },
];

function Sys({ x, y, t }: { x: number; y: number; t: string }) {
  return (
    <g>
      <rect x={x - 26} y={y - 12} width="52" height="24" rx="7" fill="#fcfbf8" stroke="#101440" strokeWidth="1" />
      <text x={x} y={y + 3.5} textAnchor="middle" fontSize="10" fontWeight="600" fill="#101440">
        {t}
      </text>
    </g>
  );
}

function Illustration() {
  return (
    <svg viewBox="0 0 560 300" className="h-auto w-full" role="img" aria-label="Before: six systems held together by people along crooked paths. After: the same six systems each connected once to a shared layer." data-rv="draw" fill="none">
      {BEFORE_LINKS.map((d, i) => (
        <path key={i} d={d} pathLength={1} stroke="#9a9384" strokeWidth="1" className="v21-draw" style={dd(i * 120)} />
      ))}
      {PEOPLE.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill="#f4f1ec" stroke="#b0502a" strokeWidth="1.2" className="v21-fade" style={dd(500 + i * 80)} />
      ))}
      {BEFORE.map((s) => (
        <Sys key={s.t} {...s} />
      ))}

      <line x1="270" y1="30" x2="270" y2="270" stroke="#d9d1c4" strokeDasharray="2 4" />

      {AFTER.map((s, i) => (
        <path key={s.t} d={`M${s.x} ${s.y} L${AC.x} ${AC.y}`} pathLength={1} stroke="#2f55d4" strokeWidth="1.2" className="v21-draw" style={dd(900 + i * 90)} />
      ))}
      <path d="M420 118 447.7 134v32L420 182 392.3 166v-32Z" fill="#101440" className="v21-fade" style={dd(900)} />
      <path d="M420 136 432.1 143v14L420 164 407.9 157v-14Z" fill="#2f55d4" className="v21-fade" style={dd(1100)} />
      {AFTER.map((s) => (
        <Sys key={s.t} {...s} />
      ))}
    </svg>
  );
}

export function Problem21() {
  return (
    <section className="relative py-20 sm:py-28" aria-labelledby="v21-problem-title">
      <div className={wrap}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <SectionHead
            className="lg:col-span-6"
            label="The problem"
            id="v21-problem-title"
            lines={["Complexity Is the", "Cost of Growth."]}
            lead="Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding everything together. Leadership loses visibility, execution slows down, and the business pays the price."
          />
          <figure data-rv="up" style={rd(120)} className="v21-card p-5 sm:p-7 lg:col-span-6 lg:self-end">
            <div className="flex items-center justify-between text-[0.75rem] font-semibold text-[var(--ink-3)]">
              <span>Held together by people</span>
              <span>Built on what already works</span>
            </div>
            <div className="mt-4">
              <Illustration />
            </div>
            <figcaption className="sr-only">A comparison of fragmented and connected systems.</figcaption>
          </figure>
        </div>

        <div className="mt-20 grid gap-10 border-t border-[var(--rule)] pt-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p data-rv="up" className="v21-serif text-[1.25rem] italic leading-[1.5] text-[var(--ink-2)]">
              When the business becomes fragmented, replacing systems can feel like the natural next step.
            </p>
          </div>
          <div className="lg:col-span-7">
            <Lines lines={["Solve the Right Problem."]} className="v21-display text-[clamp(1.9rem,3.6vw,2.75rem)]" />
            <p data-rv="up" style={rd(100)} className="v21-lead mt-5 max-w-[60ch]">
              Sometimes replacement is necessary. But often, the problem can be solved without the cost, operational load, and disruption risk of a system transition. Building on what already works reduces complexity, expands capabilities, and unlocks more value from your systems and people.
            </p>
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {COUNTS.map((c, i) => (
            <div key={c.label} data-rv="up" style={rd(i * 80)} className="v21-card v21-lift flex flex-col p-5 sm:p-6">
              <dt className="order-2 mt-3 text-[0.875rem] font-medium text-[var(--ink-3)]">{c.label}</dt>
              <dd className="order-1 flex items-baseline gap-2.5">
                <span className="v21-mono text-[0.875rem] text-[var(--ink-3)]">{c.from}</span>
                <svg viewBox="0 0 24 8" className="h-2 w-5 text-[var(--terra)]" aria-hidden="true">
                  <path d="M0 4h21M18 1l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                <span className="v21-display text-[clamp(2rem,3.4vw,2.75rem)] leading-none">{c.to.toLocaleString("en-US")}</span>
              </dd>
            </div>
          ))}
        </dl>
        <Illustrative className="mt-4">Founding to enterprise · illustrative figures</Illustrative>
      </div>
    </section>
  );
}
