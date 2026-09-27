import { Opener, Rule, Up, shell } from "./type";

/**
 * Placeholder quotes. Illustrative only, attributed by role rather than by invented names,
 * and to be replaced with real, approved client quotes before launch.
 */
const VOICES = [
  {
    q: "For the first time, the board pack and the operating numbers come from the same place. Month-end close went from twelve days to five.",
    role: "CFO, multi-entity manufacturing group",
  },
  { q: "We connected nine portfolio companies in a quarter. Now I ask the agent instead of chasing spreadsheets.", role: "Operating Partner, private equity firm" },
  { q: "They didn't sell us another tool. They built on what we already had and ran it for us.", role: "COO, specialty retailer" },
  { q: "Integration planning used to be guesswork. Genius Lab gave us a single view of both companies before day one.", role: "Head of M&A integration, services group" },
  { q: "Our analysts spend their time on decisions now, not on reconciling reports.", role: "VP Finance, logistics company" },
  { q: "The Second Brain understands our definitions. When it says margin, it means our margin.", role: "CEO, distribution business" },
];

export function Voices() {
  const [lead, ...rest] = VOICES;
  return (
    <section id="voices" data-chapter="voices" className="scroll-mt-[var(--head-h)] py-20 sm:py-28" aria-labelledby="v8-voices-title">
      <div className={shell}>
        <Opener numeral="X" kicker="Clients" title="What our clients *say.*" titleId="v8-voices-title" folio="72">
          <Up delay={250}>
            <p className="smallcaps mt-6 inline-block border border-[color:var(--red)] px-3 py-1.5 text-[color:var(--red)]">
              Illustrative placeholders, to be replaced with approved client quotes
            </p>
          </Up>
        </Opener>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <Up as="figure" className="lg:col-span-7">
            <blockquote className="f-display text-[clamp(2.25rem,4.2vw,3.75rem)] leading-[1.02]">
              <span className="text-[color:var(--red)]">&ldquo;</span>
              {lead.q}
              <span className="text-[color:var(--red)]">&rdquo;</span>
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <span className="hair-ink block w-10" aria-hidden="true" />
              <span className="smallcaps text-[color:var(--ink-2)]">{lead.role} &nbsp;·&nbsp; placeholder</span>
            </figcaption>
          </Up>

          <div className="lg:col-span-5 lg:border-l lg:border-[color:var(--rule)] lg:pl-10">
            <Rule ink className="lg:hidden" />
            <ul>
              {rest.map((v, i) => (
                <li key={v.role} className="border-b border-[color:var(--rule)] last:border-b-0">
                  <Up as="figure" delay={i * 60} className="py-5">
                    <blockquote className="f-text text-[1.1875rem] italic leading-[1.45] text-[color:var(--ink)]">&ldquo;{v.q}&rdquo;</blockquote>
                    <figcaption className="smallcaps mt-2 text-[color:var(--ink-3)]">&mdash; {v.role}</figcaption>
                  </Up>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
