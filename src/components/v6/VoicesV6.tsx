import { Quotes } from "@phosphor-icons/react/dist/ssr";
import { Intro } from "./ui";

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

export function VoicesV6() {
  const [feature, ...rest] = VOICES;
  return (
    <section id="clients" className="scroll-mt-[4.5rem] bg-white py-24 sm:py-32" aria-labelledby="v6-voices-title">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Intro id="v6-voices-title" label="Clients" title="What our clients say." />
          <p className="v6-label text-steel-3">Illustrative testimonials · placeholders for approved quotes</p>
        </div>

        <div className="mt-14 grid gap-4 lg:mt-16 lg:grid-cols-12">
          <figure data-reveal="up" className="relative flex flex-col justify-between overflow-hidden rounded-[14px] bg-abyss p-8 text-white sm:p-10 lg:col-span-5 lg:row-span-2">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgb(242_154_31/0.3),transparent)]" aria-hidden="true" />
            <Quotes size={36} weight="fill" className="relative text-ember" aria-hidden="true" />
            <blockquote className="relative mt-8 text-[clamp(1.375rem,2.2vw,1.875rem)] font-semibold leading-[1.35] tracking-[-0.02em]">&ldquo;{feature.q}&rdquo;</blockquote>
            <figcaption className="relative mt-10 flex items-center gap-4 border-t border-white/10 pt-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ember text-[0.875rem] font-bold text-[#1a1205]">{initials(feature.name)}</span>
              <span>
                <span className="block font-bold">{feature.name}</span>
                <span className="block text-[0.875rem] text-white/60">{feature.role}</span>
              </span>
            </figcaption>
          </figure>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {rest.map((v, i) => (
              <figure
                key={v.name}
                data-reveal="up"
                data-delay={String((i % 2) * 70)}
                className="flex flex-col justify-between rounded-[14px] border border-rule6 bg-white p-6 sm:last:col-span-2 transition-[border-color,box-shadow] duration-300 hover:border-sky/40 hover:shadow-[0_24px_40px_-30px_rgb(37_99_235/0.45)]"
              >
                <blockquote className="leading-[1.65] text-steel">&ldquo;{v.q}&rdquo;</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-rule6 pt-4">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-frost text-[0.75rem] font-bold text-steel">{initials(v.name)}</span>
                  <span className="min-w-0">
                    <span className="block text-[0.9375rem] font-bold text-steel">{v.name}</span>
                    <span className="block truncate text-[0.8125rem] text-steel-3">{v.role}</span>
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
