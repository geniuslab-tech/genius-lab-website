import { BrandLogo } from "@/components/v2/ui";
import { shell } from "./type";

const COLUMNS = [
  { title: "Capabilities", links: ["Data Engineering", "Analytics", "Business Intelligence", "Artificial Intelligence"] },
  { title: "Genius", links: ["Second Brain", "AI Agents", "Genius Portal"] },
  { title: "Company", links: ["About", "Careers", "Contact"] },
];

/** Footer set as a colophon. */
export function Colophon() {
  return (
    <footer className="border-t border-[color:var(--ink)] bg-[color:var(--paper-2)]">
      <div className={`${shell} grid gap-12 pb-12 pt-14 md:grid-cols-12`}>
        <div className="md:col-span-5">
          <BrandLogo tone="navy" className="h-[18px] w-auto" />
          <p className="f-text mt-5 max-w-[34ch] text-[1.0625rem] leading-[1.55] text-[color:var(--ink-2)]">
            Connected systems, unified data and intelligence for the decisions that matter.
          </p>
          <p className="smallcaps mt-8 max-w-[44ch] leading-[1.6] text-[color:var(--ink-3)]">
            <span className="font-bold text-[color:var(--ink)]">Colophon.</span> Set in Instrument Serif, Newsreader and
            Schibsted Grotesk. Figures drawn for this issue.
          </p>
        </div>
        {COLUMNS.map((c, i) => (
          <nav key={c.title} aria-label={c.title} className={`md:col-span-2 ${i === 0 ? "md:col-start-7" : ""}`}>
            <h2 className="label border-b border-[color:var(--ink)] pb-2 text-[color:var(--ink-2)]">{c.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="link-ink text-[0.9375rem] text-[color:var(--ink)]">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className={`${shell} smallcaps flex flex-col gap-3 border-t border-[color:var(--rule)] py-6 text-[color:var(--ink-3)] sm:flex-row sm:justify-between`}>
        <span>&copy; 2026 Genius Lab Technology. Figures, dashboards and client marks shown are illustrative.</span>
        <span className="flex gap-6">
          <a href="#" className="link-ink hover:text-[color:var(--ink)]">
            Privacy
          </a>
          <a href="#" className="link-ink hover:text-[color:var(--ink)]">
            Terms
          </a>
        </span>
      </div>
    </footer>
  );
}
