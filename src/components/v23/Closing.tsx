import { BrandLogo } from "@/components/v2/ui";
import { Aurora } from "./Aurora";
import { MagButton } from "./Interactive";
import { rd } from "./ui";

/** The journey closes where it began: on navy, with the same light field, now brighter. */
export function Cta() {
  return (
    <section id="contact" className="bg-white px-3 pb-3 sm:px-5 sm:pb-5" data-v23-chapter="Contact" aria-labelledby="v23-cta-title">
      <div className="relative isolate overflow-hidden rounded-[22px] bg-[#101440]" data-tone="dark" data-v23-tone="dark">
        <Aurora lift={1} className="absolute inset-0 -z-10" />
        <div className="v23-wrap py-24 sm:py-32">
          <p data-v23-rv className="v23-label text-(--tx-3)">
            One partner. One platform. One source of truth.
          </p>
          <h2 id="v23-cta-title" data-v23-rv style={rd(60)} className="v23-display mt-6 max-w-[18ch] text-[clamp(2.4rem,5.4vw,4.5rem)]">
            Turn your business knowledge into intelligent systems.
          </h2>
          <p data-v23-rv style={rd(120)} className="v23-lead mt-6 max-w-[54ch]">
            Tell us where your systems and data stand today. We&rsquo;ll show you how Genius Lab turns them into one intelligence and execution layer, fully managed.
          </p>
          <div data-v23-rv style={rd(180)} className="mt-10 flex flex-wrap gap-3">
            <MagButton href="#" size="lg">
              Talk to us
            </MagButton>
            <MagButton href="#action" tone="ghost" size="lg" arrow={false}>
              Watch it in action
            </MagButton>
          </div>
        </div>
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
    <footer className="bg-white" data-tone="light" data-v23-tone="light" data-v23-chapter="Contact">
      <div className="v23-wrap grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <BrandLogo tone="navy" className="h-[18px] w-auto" />
          <p className="mt-5 max-w-[36ch] text-[0.9375rem] leading-[1.65] text-(--tx-2)">Connected systems, unified data and intelligence for the decisions that matter.</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
          {COLUMNS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2 className="v23-label text-(--tx-3)">{c.title}</h2>
              <ul className="mt-4 grid gap-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[0.9375rem] text-(--tx-2) transition-colors hover:text-(--tx)">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="v23-wrap flex flex-col gap-3 border-t border-(--line) py-6 text-[0.8125rem] text-(--tx-3) sm:flex-row sm:items-center sm:justify-between">
        <span>&copy; 2026 Genius Lab Technology. Figures, dashboards and client marks shown are illustrative.</span>
        <span className="flex gap-6">
          <a href="#" className="hover:text-(--tx)">
            Privacy
          </a>
          <a href="#" className="hover:text-(--tx)">
            Terms
          </a>
        </span>
      </div>
    </footer>
  );
}
