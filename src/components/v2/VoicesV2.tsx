import { Quotes } from "@phosphor-icons/react/dist/ssr";
import { h2Class } from "./ui";

/**
 * Placeholder testimonials. They are illustrative only and must be replaced with real,
 * approved client quotes before launch.
 */
const VOICES = [
  {
    q: "For the first time, the board pack and the operating numbers come from the same place. Month-end close went from twelve days to five.",
    name: "Helena Marques",
    role: "CFO, multi-entity manufacturing group",
    feature: true,
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

export function VoicesV2() {
  const [feature, ...rest] = VOICES;
  return (
    <section id="clients" className="relative scroll-mt-16 py-24 text-navy sm:py-32 lg:py-40" aria-labelledby="v2-voices-title">
      <div className="shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 id="v2-voices-title" data-reveal="up" className={`${h2Class} max-w-[14ch]`}>
            What our clients say.
          </h2>
          <span className="type-mono text-[0.75rem] text-navy/45">Illustrative testimonials, placeholders for approved quotes</span>
        </div>

        <div data-reveal="up" data-delay="100" className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-12">
          {/* The featured voice. */}
          <figure className="relative flex flex-col justify-between overflow-hidden bg-navy p-8 text-white [clip-path:polygon(0_0,calc(100%-24px)_0,100%_24px,100%_100%,0_100%)] sm:p-10 lg:col-span-5 lg:row-span-2">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgb(85_119_255/0.45),transparent)]" aria-hidden="true" />
            <Quotes size={40} weight="fill" className="relative text-signal" aria-hidden="true" />
            <blockquote className="type-wide relative mt-8 text-[clamp(1.375rem,2.2vw,1.875rem)] font-medium leading-snug">
              &ldquo;{feature.q}&rdquo;
            </blockquote>
            <figcaption className="relative mt-10 flex items-center gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[conic-gradient(from_210deg,#5577ff,#9fb4ff,#ffffff,#5577ff)] text-[0.875rem] font-semibold text-navy">
                {initials(feature.name)}
              </span>
              <span>
                <span className="block font-semibold">{feature.name}</span>
                <span className="block text-[0.875rem] text-white/65">{feature.role}</span>
              </span>
            </figcaption>
          </figure>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {rest.map((v) => (
              <figure
                key={v.name}
                className="group flex flex-col justify-between bg-white p-6 ring-1 ring-navy/10 transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:shadow-[0_28px_50px_-36px_rgb(16_20_64/0.55)]"
              >
                <blockquote className="leading-relaxed text-navy/85">&ldquo;{v.q}&rdquo;</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-navy/10 pt-4">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy/[0.06] text-[0.75rem] font-semibold text-navy transition-colors group-hover:bg-signal-ink group-hover:text-white">
                    {initials(v.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.9375rem] font-semibold">{v.name}</span>
                    <span className="block truncate text-[0.8125rem] text-navy/55">{v.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
