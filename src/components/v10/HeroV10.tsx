import { CHAPTERS } from "./chapters";
import { Btn } from "./ui";

const SUMMARY = [
  "Growth fragments systems, teams and processes. People become the glue, and leadership loses visibility.",
  "Replacing systems is rarely the right first move. We build on the software you already rely on.",
  "Four connected layers, Data Engineering, Analytics, Business Intelligence and AI, turn fragmented data into better decisions.",
  "A Second Brain holds the full context of the company. AI Agents reason across it to answer and to act.",
  "Delivered on our own Genius Portal and fully managed: designed, built, run and improved by Genius Lab.",
];

/** Placeholder client marks, to be replaced with approved logos. */
const LOGOS = ["Vanta Group", "Helios", "Caldera", "Orbis", "Stratum", "Northpeak"];

/** The cover page: title, standfirst, executive summary and contents. */
export function HeroV10() {
  return (
    <section id="top" aria-labelledby="v10-hero-title" className="pt-16">
      <div className="wrap">
        {/* Running line, as on the cover of a report. */}
        <div className="enter flex flex-col gap-1 border-b border-[color:var(--ink)] py-4 text-[color:var(--slate)] sm:flex-row sm:items-baseline sm:justify-between [--d:0ms]">
          <p className="caps">Genius Lab Technology · A briefing for leadership teams</p>
          <p className="caps hidden sm:block">Data Engineering · Analytics · BI · AI</p>
        </div>

        <div className="grid grid-cols-12 gap-x-6 gap-y-14 pb-20 pt-12 sm:pt-16 lg:pb-24 lg:pt-20">
          <div className="col-span-12 lg:col-span-7">
            <p className="enter caps text-[color:var(--brass)] [--d:60ms]">One partner. One platform. One source of truth.</p>
            <h1 id="v10-hero-title" className="enter serif text-balance mt-6 text-[clamp(2.6rem,6.2vw,5.25rem)] leading-[1.02] text-[color:var(--ink)] [--d:120ms]">
              Transform Business Complexity into Strategic Advantage
            </h1>
            <p className="enter serif mt-8 max-w-[34ch] text-[clamp(1.25rem,2vw,1.5rem)] italic leading-[1.4] text-[color:var(--ink-2)] [--d:200ms]">
              A fully managed intelligence and execution layer for your entire business.
            </p>
            <p className="enter text-pretty mt-5 max-w-[56ch] text-[1.0625rem] leading-[1.75] text-[color:var(--slate)] [--d:260ms]">
              We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on
              the software you already rely on.
            </p>
            <div className="enter mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 [--d:320ms]">
              <Btn href="#contact">Book a briefing</Btn>
              <a href="#problem" className="ulink text-[0.9375rem] font-medium text-[color:var(--ink)]">
                Read the briefing
              </a>
            </div>
          </div>

          {/* Executive summary. */}
          <aside aria-labelledby="v10-summary-title" className="enter col-span-12 self-start border-t-[3px] border-[color:var(--ink)] bg-[color:var(--card)] px-5 pb-7 pt-5 shadow-[0_1px_0_var(--rule)] sm:px-8 lg:col-span-5 [--d:380ms]">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="v10-summary-title" className="serif text-[1.5rem] text-[color:var(--ink)]">
                Executive summary
              </h2>
              <span className="caps text-[color:var(--slate)]">5 points</span>
            </div>
            <ol className="mt-5">
              {SUMMARY.map((s, i) => (
                <li key={i} className="grid grid-cols-[2rem_1fr] gap-2 border-t border-[color:var(--rule-2)] py-3.5 text-[0.9375rem] leading-[1.6] text-[color:var(--ink-2)]">
                  <span className="serif tnum text-[1.125rem] leading-[1.35] text-[color:var(--brass)]">{i + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        {/* Contents. */}
        <nav aria-label="In this briefing" className="grid grid-cols-12 gap-x-6 border-t border-[color:var(--rule)] py-10">
          <p className="caps col-span-12 mb-5 text-[color:var(--slate)] lg:col-span-2 lg:mb-0">In this briefing</p>
          <ol className="col-span-12 grid gap-x-10 sm:grid-cols-2 lg:col-span-10 lg:grid-cols-3">
            {CHAPTERS.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} className="group flex items-baseline gap-3 py-2 text-[0.9375rem] text-[color:var(--ink)]">
                  <span className="group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{c.label}</span>
                  <span className="leader" aria-hidden="true" />
                  <span className="tnum text-[0.8125rem] text-[color:var(--slate)]">{c.n}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid grid-cols-12 gap-x-6 gap-y-4 border-t border-[color:var(--rule)] py-8">
          <p className="caps col-span-12 text-[color:var(--slate)] lg:col-span-2">
            Client marks
            <span className="block normal-case tracking-normal text-[color:var(--slate-2)]">Placeholders</span>
          </p>
          <ul className="col-span-12 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:col-span-10 lg:grid-cols-6" aria-label="Client logos (placeholders)">
            {LOGOS.map((l) => (
              <li key={l} className="serif text-[1.125rem] text-[color:var(--slate-2)]">
                {l}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
