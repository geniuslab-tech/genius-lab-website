import { LogoMark } from "@/components/ui/Logo";

const COLUMNS = [
  { title: "Capabilities", links: ["Data Engineering", "Analytics", "Business Intelligence", "Artificial Intelligence"] },
  { title: "Company", links: ["About", "Careers", "Journal", "Contact"] },
  { title: "Connect", links: ["LinkedIn", "GitHub", "Newsletter"] },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-paper selection:bg-paper selection:text-ink">
      <div className="shell grid gap-14 pb-10 pt-20 md:grid-cols-12 lg:pt-28">
        <div className="md:col-span-4">
          <LogoMark className="h-9 w-9" />
          <p className="mt-6 max-w-[30ch] leading-relaxed text-paper/70">
            Genius Lab Technology. Data engineering, analytics, business intelligence and AI.
          </p>
        </div>
        {COLUMNS.map((c) => (
          <nav key={c.title} aria-label={c.title} className="md:col-span-2 md:[&:nth-child(2)]:col-start-7">
            <h2 className="text-[0.9375rem] font-medium text-paper/55">{c.title}</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[0.9375rem] text-paper/90 transition-colors hover:text-paper hover:underline hover:underline-offset-4">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="shell flex flex-col gap-4 border-t border-paper/15 py-6 text-[0.875rem] text-paper/55 sm:flex-row sm:justify-between">
        <span>&copy; 2026 Genius Lab Technology</span>
        <span className="flex gap-6">
          <a href="#" className="hover:text-paper">Privacy</a>
          <a href="#" className="hover:text-paper">Terms</a>
        </span>
      </div>

      <div aria-hidden="true" className="type-display pointer-events-none -mb-[0.22em] select-none whitespace-nowrap pl-[var(--gutter)] text-[clamp(4.5rem,21vw,22rem)] leading-[0.8] text-paper/[0.07] [font-variation-settings:'wdth'_125]">
        Genius Lab
      </div>
    </footer>
  );
}
