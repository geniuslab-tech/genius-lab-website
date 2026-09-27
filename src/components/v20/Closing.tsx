import { BrandLogo } from "@/components/v2/ui";
import { More, Note, Pill, R } from "./ui";

/**
 * Placeholder quotes. They stand in for approved client quotes and carry no names; they must be
 * replaced before launch.
 */
const VOICES = [
  { q: "They didn’t sell us another tool. They built on what we already had and ran it for us.", sector: "Specialty retail" },
  { q: "Our analysts spend their time on decisions now, not on reconciling reports.", sector: "Logistics" },
  { q: "The Second Brain understands our definitions. When it says margin, it means our margin.", sector: "Distribution" },
];

export function Voices() {
  return (
    <section id="clients" data-tone="mist" className="v20-sec py-28 sm:py-40" aria-labelledby="v20-voices-title">
      <div className="mx-auto max-w-[1120px] px-5">
        <div className="text-center">
          <R as="p" className="v20-eyebrow">
            Clients
          </R>
          <R as="h2" delay={60} id="v20-voices-title" className="v20-display v20-h2 mx-auto mt-3 max-w-[14ch]">
            What our clients say.
          </R>
          <Note className="mt-5">Placeholder quotes, shown for layout. Approved client quotes will replace them.</Note>
        </div>

        <ul className="mt-16 grid gap-4 lg:grid-cols-3">
          {VOICES.map((v, i) => (
            <R as="li" key={v.sector} delay={i * 90} className="v20-card flex flex-col p-8 sm:p-10">
              <span className="v20-chip self-start">Placeholder</span>
              <blockquote className="v20-display mt-8 text-[1.5rem] leading-[1.25] tracking-[-0.028em]">&ldquo;{v.q}&rdquo;</blockquote>
              <p className="v20-fg3 mt-auto pt-10 text-[0.9375rem]">Client name to be confirmed · {v.sector}</p>
            </R>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Cta() {
  return (
    <section id="contact" data-tone="black" className="v20-sec py-32 sm:py-48" aria-labelledby="v20-cta-title">
      <div className="mx-auto max-w-[1120px] px-5 text-center">
        <R as="p" className="v20-fg3 text-[1.0625rem] font-medium">
          One partner. One platform. One source of truth.
        </R>
        <R as="h2" delay={60} id="v20-cta-title" className="v20-display v20-h2 mx-auto mt-5 max-w-[16ch]">
          Turn your business knowledge into intelligent systems.
        </R>
        <R as="p" delay={120} className="v20-lead mx-auto mt-7 max-w-[44ch]">
          Tell us where your systems and data stand today. We&rsquo;ll show you how Genius Lab turns them into one intelligence and
          execution layer, fully managed.
        </R>
        <R delay={180} className="mt-11 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Pill href="#">Talk to us</Pill>
          <More href="#action">Watch it in action</More>
        </R>
      </div>
    </section>
  );
}

const COLUMNS = [
  { title: "Capabilities", links: ["Data Engineering", "Analytics", "Business Intelligence", "Artificial Intelligence"] },
  { title: "Genius", links: ["Second Brain", "AI Agents", "Genius Portal"] },
  { title: "Company", links: ["About", "Careers", "Contact"] },
];

export function Footer() {
  return (
    <footer data-tone="mist" className="v20-sec text-[0.8125rem]">
      <div className="mx-auto max-w-[1120px] px-5 pb-10 pt-14">
        <ol className="v20-fg3 space-y-2 border-b v20-rule pb-8 leading-[1.6]">
          <li>1. Figures, dashboards and agent answers shown on this page are illustrative and are not client data.</li>
          <li>2. The Genius Portal interface is shown as an illustrative preview.</li>
          <li>3. Client marks and quotes are placeholders pending approval.</li>
        </ol>

        <div className="grid gap-10 py-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <BrandLogo tone="navy" className="h-[15px] w-auto" />
            <p className="v20-fg2 mt-4 max-w-[34ch] leading-[1.6]">Connected systems, unified data and intelligence for the decisions that matter.</p>
          </div>
          {COLUMNS.map((c, i) => (
            <nav key={c.title} aria-label={c.title} className={`md:col-span-2 ${i === 0 ? "md:col-start-7" : ""}`}>
              <h2 className="v20-fg font-semibold">{c.title}</h2>
              <ul className="mt-3 space-y-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="v20-fg2 hover:underline">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="v20-fg3 flex flex-col gap-3 border-t v20-rule pt-6 sm:flex-row sm:justify-between">
          <span>&copy; 2026 Genius Lab Technology. All rights reserved.</span>
          <span className="flex gap-6">
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Terms
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
