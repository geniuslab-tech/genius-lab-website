import { BrandLogo } from "@/components/v2/ui";

const COLUMNS = [
  { title: "Capabilities", links: ["Data Engineering", "Analytics", "Business Intelligence", "Artificial Intelligence"] },
  { title: "Genius", links: ["Second Brain", "AI Agents", "Genius Portal"] },
  { title: "Company", links: ["About", "Careers", "Contact"] },
];

export function FooterV16() {
  return (
    <footer className="border-t border-[color:var(--line)] bg-[color:var(--g0)]">
      <div className="v16-wrap grid gap-12 pb-12 pt-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <BrandLogo tone="white" className="h-5 w-auto" />
          <p className="mt-5 max-w-[34ch] leading-[1.7] text-[color:var(--tx-3)]">
            Connected systems, unified data and intelligence for the decisions that matter.
          </p>
        </div>
        {COLUMNS.map((c, i) => (
          <nav key={c.title} aria-label={c.title} className={`md:col-span-2 ${i === 0 ? "md:col-start-7" : ""}`}>
            <h2 className="v16-label text-[color:var(--tx-3)]">{c.title}</h2>
            <ul className="mt-5 space-y-3">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[0.9375rem] text-[color:var(--tx-2)] transition-colors hover:text-white">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="v16-wrap flex flex-col gap-3 border-t border-[color:var(--line)] py-6 text-[0.8125rem] text-[color:var(--tx-3)] sm:flex-row sm:justify-between">
        <span>&copy; 2026 Genius Lab Technology. Figures, dashboards and client marks shown are illustrative.</span>
        <span className="flex gap-6">
          <a href="#" className="hover:text-white">
            Privacy
          </a>
          <a href="#" className="hover:text-white">
            Terms
          </a>
        </span>
      </div>
    </footer>
  );
}
