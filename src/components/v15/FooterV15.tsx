import { BrandLogo } from "@/components/v2/ui";

const COLUMNS = [
  { title: "Capabilities", links: ["Data Engineering", "Analytics", "Business Intelligence", "Artificial Intelligence"] },
  { title: "Genius", links: ["Second Brain", "AI Agents", "Genius Portal"] },
  { title: "Company", links: ["About", "Careers", "Contact"] },
];

export function FooterV15() {
  return (
    <footer className="border-t border-[#d8c29d]/15 bg-[#090807] text-[#ede7dc]">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 pb-14 pt-20 sm:px-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <BrandLogo tone="white" className="h-[15px] w-auto" />
          <p className="lx-serif mt-8 max-w-[30ch] text-[1.25rem] italic leading-[1.5] text-[#ede7dc]/80">
            Connected systems, unified data and intelligence for the decisions that matter.
          </p>
        </div>
        {COLUMNS.map((c, i) => (
          <nav key={c.title} aria-label={c.title} className={`md:col-span-2 ${i === 0 ? "md:col-start-7" : ""}`}>
            <h2 className="lx-caps lx-gold">{c.title}</h2>
            <ul className="mt-6 space-y-3">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[0.9375rem] text-[#ede7dc]/75 transition-colors duration-700 hover:text-[#ede7dc]">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto flex max-w-[1320px] flex-col gap-4 border-t border-[#d8c29d]/10 px-5 py-8 text-[0.8125rem] text-[#ede7dc]/60 sm:flex-row sm:justify-between sm:px-10">
        <span>&copy; 2026 Genius Lab Technology. Figures, dashboards and client marks shown are illustrative.</span>
        <span className="flex gap-8">
          <a href="#" className="hover:text-[#ede7dc]">Privacy</a>
          <a href="#" className="hover:text-[#ede7dc]">Terms</a>
        </span>
      </div>
    </footer>
  );
}
