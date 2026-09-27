import type { CSSProperties } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { TERRAIN, TERRAIN_H, TERRAIN_W } from "./terrain";
import { Caption, Lines, Rule, Up, shell } from "./type";

/** Placeholder client marks, to be replaced with approved logos. */
const MARKS = ["Vanta Group", "Helios", "Caldera", "Orbis", "Stratum", "Northpeak"];

const COVER_LINES = [
  { n: "II", href: "#layers", title: "Four layers, one foundation", folio: "14" },
  { n: "III", href: "#brain", title: "A Second Brain for the business", folio: "22" },
  { n: "IV", href: "#agents", title: "In conversation with an agent", folio: "30" },
  { n: "VI", href: "#ontology", title: "Where data meets judgement", folio: "44" },
];

/** Where the agent reads on its way across the terrain. */
const STOPS = [
  { x: 118, y: 404, t: "sales.orders" },
  { x: 318, y: 262, t: "finance.gl_entries" },
  { x: 548, y: 188, t: "ops.events" },
  { x: 700, y: 392, t: "crm.accounts" },
];
const ROUTE = "M40,470 C110,430 96,410 118,404 S250,300 318,262 S470,150 548,188 S650,330 700,392 S800,470 850,452";

function Terrain() {
  return (
    <svg
      viewBox={`0 0 ${TERRAIN_W} ${TERRAIN_H}`}
      className="terrain block h-auto w-full"
      role="img"
      aria-label="An engraved contour terrain standing for a growing company's systems, teams and processes, crossed by the dashed route of an AI agent reading four data sources."
      data-v8="draw"
    >
      {TERRAIN.map((c, i) => (
        <path
          key={i}
          d={c.d}
          pathLength={1}
          className="d"
          strokeWidth={c.index ? 1.15 : 0.55}
          strokeOpacity={c.index ? 0.9 : 0.55}
          style={{ "--i": i } as CSSProperties}
        />
      ))}
      <path d={ROUTE} pathLength={1} className="d" stroke="var(--red)" strokeWidth={1.6} style={{ "--i": 0, "--d": "900ms" } as CSSProperties} />
      <path d={ROUTE} fill="none" stroke="var(--paper)" strokeWidth={2} strokeDasharray="4 7" className="f" style={{ "--i": 18 } as CSSProperties} />
      {STOPS.map((s, i) => (
        <g key={s.t} className="f" style={{ "--i": 12 + i * 3 } as CSSProperties}>
          <rect x={s.x - 5} y={s.y - 5} width={10} height={10} fill="var(--paper)" stroke="var(--red)" strokeWidth={1.6} />
          <rect x={s.x + 12} y={s.y - 24} width={s.t.length * 7.2 + 30} height={20} fill="var(--paper)" />
          <text x={s.x + 16} y={s.y - 10} fill="var(--red)" style={{ font: "600 11px var(--v8-sans)", letterSpacing: "0.04em" }}>
            {`0${i + 1}`}
          </text>
          <text x={s.x + 36} y={s.y - 10} fill="var(--ink)" style={{ font: "500 11px ui-monospace, monospace" }}>
            {s.t}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function Cover() {
  return (
    <section id="top" className="relative scroll-mt-[var(--head-h)] pb-16 pt-6 sm:pt-8 lg:pb-24" aria-labelledby="v8-cover-title">
      <div className={shell}>
        {/* Issue line */}
        <div className="label grid grid-cols-2 items-end gap-4 text-[color:var(--ink-2)] sm:grid-cols-3">
          <p>Vol. I &nbsp;·&nbsp; No. 08</p>
          <p className="hidden text-center sm:block">The Intelligence Issue</p>
          <p className="text-right">Autumn 2026</p>
        </div>
        <div className="double-rule mt-3" aria-hidden="true" />

        <Lines
          as="h1"
          id="v8-cover-title"
          text="Transform Business *Complexity* into Strategic Advantage"
          className="f-display mt-8 max-w-[15ch] text-[clamp(3.4rem,10.4vw,10.75rem)] leading-[0.86] tracking-[-0.02em] sm:mt-10"
          italicClass="italic text-[color:var(--red)]"
          delay={120}
        />

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-10">
          {/* Deck */}
          <div className="lg:col-span-4 lg:pt-2">
            <Rule ink />
            <Up delay={500}>
              <p className="f-text mt-6 text-[1.5rem] italic leading-[1.3] text-[color:var(--ink)]">
                A fully managed intelligence and execution layer for your entire business.
              </p>
              <p className="body-copy mt-5">
                We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on
                the software you already rely on.
              </p>
              <p className="label mt-6 text-[color:var(--ink-3)]">One partner. One platform. One source of truth.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#action" className="btn-ink">
                  See Genius Lab in action <ArrowRight size={15} weight="bold" className="arr" aria-hidden="true" />
                </a>
                <a href="#contact" className="btn-line">
                  Book a demo
                </a>
              </div>
            </Up>
          </div>

          {/* Cover plate */}
          <figure className="lg:col-span-8">
            <div className="grain border border-[color:var(--ink)] bg-[color:var(--paper-2)]/50 p-2 sm:p-4">
              <Terrain />
            </div>
            <Caption fig="Fig. 1">
              The terrain of a growing company, engraved. Every contour is a system, a team or a process; the red line is an
              AI agent reading across them. Drawn for this issue, not a map.
            </Caption>
          </figure>
        </div>

        {/* Cover lines: the issue's contents, set as links. */}
        <div className="mt-14 lg:mt-20">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="label text-[color:var(--red)]">In this issue</h2>
            <a href="#complexity" className="label link-ink text-[color:var(--ink-2)]">
              Begin reading, p. 04
            </a>
          </div>
          <Rule ink className="mt-3" />
          <ol className="grid gap-px bg-[color:var(--rule)] sm:grid-cols-2 lg:grid-cols-4">
            {COVER_LINES.map((c, i) => (
              <li key={c.n} className="bg-[color:var(--paper)]">
                <Up delay={i * 80}>
                  <a href={c.href} className="group flex h-full items-start justify-between gap-4 py-5 sm:px-5">
                    <span>
                      <span className="f-display block text-[1.25rem] italic text-[color:var(--red)]">{c.n}</span>
                      <span className="f-display mt-1 block text-[1.75rem] leading-[1.05] transition-colors group-hover:text-[color:var(--red)]">{c.title}</span>
                    </span>
                    <span className="smallcaps shrink-0 pt-1.5 text-[color:var(--ink-3)]">p. {c.folio}</span>
                  </a>
                </Up>
              </li>
            ))}
          </ol>
          <Rule />
        </div>

        {/* Placeholder client marks */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-baseline lg:gap-10">
          <p className="smallcaps shrink-0 text-[color:var(--ink-3)]">
            Trusted by operators, manufacturers and value creation teams<sup className="text-[color:var(--red)]">*</sup>
          </p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2" aria-label="Client logos (placeholders)">
            {MARKS.map((m) => (
              <li key={m} className="f-display text-[1.375rem] italic text-[color:var(--ink-2)]/70">
                {m}
              </li>
            ))}
          </ul>
        </div>
        <p className="smallcaps mt-2 text-[color:var(--ink-3)]">
          <span className="text-[color:var(--red)]">*</span> Placeholder marks, to be replaced with approved client logos.
        </p>
      </div>
    </section>
  );
}
