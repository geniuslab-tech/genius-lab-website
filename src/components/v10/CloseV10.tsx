import { BrandLogo } from "@/components/v2/ui";
import { Btn } from "./ui";

const COLUMNS = [
  { title: "Capabilities", links: ["Data Engineering", "Analytics", "Business Intelligence", "Artificial Intelligence"] },
  { title: "Genius", links: ["Second Brain", "AI Agents", "Genius Portal"] },
  { title: "Company", links: ["About", "Careers", "Contact"] },
];

/** The closing recommendation, then the colophon. */
export function CloseV10() {
  return (
    <>
      <section id="contact" aria-labelledby="v10-close-title" className="scroll-mt-16 border-t border-[color:var(--rule)]">
        <div className="wrap grid grid-cols-12 gap-x-6 py-20 sm:py-28">
          <div className="col-span-12 mb-10 lg:col-span-2 lg:mb-0">
            <p className="caps border-t border-[color:var(--ink)] pt-3 text-[color:var(--slate)]">Next step</p>
          </div>
          <div className="col-span-12 border-t-[3px] border-[color:var(--ink)] pt-10 lg:col-span-10">
            <p className="caps text-[color:var(--brass)]">One partner. One platform. One source of truth.</p>
            <h2 id="v10-close-title" data-reveal="up" className="serif text-balance mt-6 max-w-[20ch] text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.04] text-[color:var(--ink)]">
              Turn your business knowledge into intelligent systems.
            </h2>
            <div className="mt-10 grid gap-10 lg:grid-cols-10 lg:gap-6">
              <p data-reveal="up" className="text-pretty text-[1.125rem] leading-[1.7] text-[color:var(--slate)] lg:col-span-6">
                Tell us where your systems and data stand today. We&rsquo;ll show you how Genius Lab turns them into one
                intelligence and execution layer, fully managed.
              </p>
              <div data-reveal="up" data-delay="80" className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:col-span-4 lg:justify-end">
                <Btn href="#">Talk to us</Btn>
                <a href="#action" className="ulink text-[0.9375rem] font-medium text-[color:var(--ink)]">
                  Watch it in action
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="on-navy bg-[#101440] text-white">
        <div className="wrap grid grid-cols-12 gap-x-6 gap-y-12 pb-12 pt-16">
          <div className="col-span-12 md:col-span-5">
            <BrandLogo tone="white" className="h-[17px] w-auto" />
            <p className="mt-5 max-w-[34ch] text-[0.9375rem] leading-[1.7] text-white/65">
              Connected systems, unified data and intelligence for the decisions that matter.
            </p>
          </div>
          {COLUMNS.map((c, i) => (
            <nav key={c.title} aria-label={c.title} className={`col-span-6 sm:col-span-4 md:col-span-2 ${i === 0 ? "md:col-start-7" : ""}`}>
              <h2 className="caps text-white/55">{c.title}</h2>
              <ul className="mt-5 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[0.9375rem] text-white/80 transition-colors hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="wrap flex flex-col gap-3 border-t border-white/15 py-6 text-[0.8125rem] text-white/55 sm:flex-row sm:justify-between">
          <span>&copy; 2026 Genius Lab Technology. Figures, examples and client marks shown are illustrative.</span>
          <span className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </span>
        </div>
      </footer>
    </>
  );
}
