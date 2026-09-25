import { BrandLogo } from "./ui";

const COLUMNS = [
  { title: "Capabilities", links: ["Data Engineering", "Analytics", "Business Intelligence", "Artificial Intelligence"] },
  { title: "Genius", links: ["Second Brain", "AI Agents", "Genius Portal"] },
  { title: "Company", links: ["About", "Careers", "Contact"] },
];

export function FooterV2() {
  return (
    <footer data-ground="dark" className="bg-navy text-white">
      <div className="shell grid gap-14 pb-12 pt-20 md:grid-cols-12 lg:pt-24">
        <div className="md:col-span-5">
          <BrandLogo tone="white" className="h-6 w-auto" />
          <p className="mt-6 max-w-[34ch] leading-relaxed text-white/65">
            Connected systems, unified data and intelligence for the decisions that matter.
          </p>
        </div>
        {COLUMNS.map((c, i) => (
          <nav key={c.title} aria-label={c.title} className={`md:col-span-2 ${i === 0 ? "md:col-start-7" : ""}`}>
            <h2 className="text-[0.875rem] font-semibold">{c.title}</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[0.9375rem] text-white/70 transition-colors hover:text-white">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="shell flex flex-col gap-4 border-t border-white/12 py-6 text-[0.875rem] text-white/55 sm:flex-row sm:justify-between">
        <span>&copy; 2026 Genius Lab Technology</span>
        <span className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
        </span>
      </div>
    </footer>
  );
}
