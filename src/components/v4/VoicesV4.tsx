import { SectionTag, h2v4 } from "./ui";

/**
 * Placeholder testimonials. They are illustrative only and must be replaced with real,
 * approved client quotes before launch.
 */
const VOICES = [
  {
    q: "For the first time, the board pack and the operating numbers come from the same place. Month-end close went from twelve days to five.",
    name: "Helena Marques",
    role: "CFO, multi-entity manufacturing group",
  },
  {
    q: "We connected nine portfolio companies in a quarter. Now I ask the agent instead of chasing spreadsheets.",
    name: "Daniel Okafor",
    role: "Operating Partner, private equity firm",
  },
  {
    q: "They didn't sell us another tool. They built on what we already had and ran it for us.",
    name: "Priya Raman",
    role: "COO, specialty retailer",
  },
  {
    q: "Integration planning used to be guesswork. Genius Lab gave us a single view of both companies before day one.",
    name: "Marcus Lindqvist",
    role: "Head of M&A integration, services group",
  },
  {
    q: "Our analysts spend their time on decisions now, not on reconciling reports.",
    name: "Sofia Albuquerque",
    role: "VP Finance, logistics company",
  },
  {
    q: "The Second Brain understands our definitions. When it says margin, it means our margin.",
    name: "Thomas Reyes",
    role: "CEO, distribution business",
  },
];

const initials = (n: string) =>
  n
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

function Card({ v, hidden }: { v: (typeof VOICES)[number]; hidden?: boolean }) {
  return (
    <figure aria-hidden={hidden || undefined} className={`mr-3 flex w-[22rem] shrink-0 flex-col justify-between border border-line bg-void-2/80 p-6 transition-colors duration-300 hover:border-white/25 sm:w-[26rem] ${hidden ? "motion-reduce:hidden" : ""}`}>
      <blockquote className="leading-relaxed text-white/80">&ldquo;{v.q}&rdquo;</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-4">
        <span className="type-mono inline-flex h-9 w-9 shrink-0 items-center justify-center border border-line text-[0.75rem] text-cyan">{initials(v.name)}</span>
        <span className="min-w-0">
          <span className="block text-[0.9375rem] font-semibold text-white">{v.name}</span>
          <span className="block truncate text-[0.8125rem] text-white/45">{v.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function VoicesV4() {
  const [feature, ...rest] = VOICES;
  return (
    <section id="clients" className="relative scroll-mt-16 overflow-x-clip py-24 sm:py-32" aria-labelledby="v4-voices-title">
      <div className="shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionTag n="10">Clients</SectionTag>
            <h2 id="v4-voices-title" data-reveal="up" className={`${h2v4} mt-8 max-w-[14ch]`}>
              What our clients say.
            </h2>
          </div>
          <span className="v4-label text-[0.6875rem] text-white/30">Illustrative testimonials, placeholders for approved quotes</span>
        </div>

        {/* The featured voice. */}
        <figure data-reveal="up" className="relative mt-14 border-l-2 border-cyan pl-6 sm:pl-10 lg:mt-20">
          <span className="type-mono absolute left-6 top-0 text-[0.75rem] text-cyan sm:left-10" aria-hidden="true">
            &gt; quote --featured
          </span>
          <blockquote className="type-display pt-8 text-[clamp(1.625rem,3.2vw,3rem)] leading-[1.12] text-white [font-variation-settings:'wdth'_108]">
            &ldquo;{feature.q}&rdquo;
          </blockquote>
          <figcaption className="mt-8 flex items-center gap-4">
            <span className="type-mono inline-flex h-12 w-12 items-center justify-center bg-cyan text-[0.875rem] font-semibold text-void">{initials(feature.name)}</span>
            <span>
              <span className="block font-semibold text-white">{feature.name}</span>
              <span className="block text-[0.875rem] text-white/55">{feature.role}</span>
            </span>
          </figcaption>
        </figure>
      </div>

      {/* The rest scroll past like a live feed. */}
      <div className="mt-16 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] motion-reduce:overflow-x-auto lg:mt-20">
        <div className="v4-marquee flex w-max">
          {rest.map((v) => (
            <Card key={v.name} v={v} />
          ))}
          {rest.map((v) => (
            <Card key={`dup-${v.name}`} v={v} hidden />
          ))}
        </div>
      </div>
    </section>
  );
}
