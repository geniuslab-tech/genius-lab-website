import { BrandLogo } from "@/components/v2/ui";

const COLUMNS = [
  { title: "Capabilities", links: ["Data Engineering", "Analytics", "Business Intelligence", "Artificial Intelligence"] },
  { title: "Genius", links: ["Second Brain", "AI Agents", "Genius Portal"] },
  { title: "Company", links: ["About", "Careers", "Contact"] },
];

export function Footer17() {
  return (
    <footer className="relative z-[1] rounded-t-[2rem] bg-[var(--ink)] text-[var(--cream)] sm:rounded-t-[3rem]">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 pb-10 pt-16 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <BrandLogo tone="white" className="h-[17px] w-auto" />
          <p className="v17-hand mt-6 max-w-[30ch] text-[1.25rem] leading-snug text-[var(--cream)]/85">
            Connected systems, unified data and intelligence for the decisions that matter.
          </p>
        </div>
        {COLUMNS.map((c) => (
          <nav key={c.title} aria-label={c.title} className="md:col-span-2">
            <h2 className="text-[0.8125rem] font-semibold text-[var(--ochre-tint)]">{c.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[0.9375rem] text-[var(--cream)]/80 transition-colors hover:text-[var(--cream)]">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-3 border-t border-[var(--cream)]/15 px-4 py-6 text-[0.8125rem] text-[var(--cream)]/70 sm:flex-row sm:justify-between sm:px-8">
        <span>&copy; 2026 Genius Lab Technology. Figures, dashboards and client marks shown are illustrative.</span>
        <span className="flex gap-5">
          <a href="#" className="hover:text-[var(--cream)]">
            Privacy
          </a>
          <a href="#" className="hover:text-[var(--cream)]">
            Terms
          </a>
        </span>
      </div>
    </footer>
  );
}
