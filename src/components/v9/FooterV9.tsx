import { BrandLogo } from "@/components/v2/ui";

const COLUMNS = [
  { title: "Capabilities", links: ["Data Engineering", "Analytics", "Business Intelligence", "Artificial Intelligence"] },
  { title: "Genius", links: ["Second Brain", "AI Agents", "Genius Portal"] },
  { title: "Company", links: ["About", "Careers", "Contact"] },
];

/** Placeholder client marks, to be replaced with approved logos. */
const MARKS = ["Vanta Group", "Helios", "Caldera", "Orbis", "Stratum", "Northpeak"];

/** End credits. */
export function FooterV9() {
  return (
    <footer data-scene="End of reel" className="border-t border-(--v9-rule) bg-black pb-14 text-white">
      <div className="mx-auto max-w-[1440px] px-4 pt-20 sm:px-8">
        <p className="v9-tc text-center text-(--v9-dim)">End of reel 01</p>
        <div className="mx-auto mt-6 flex justify-center">
          <BrandLogo tone="white" className="h-5 w-auto" />
        </div>
        <p className="mx-auto mt-5 max-w-[40ch] text-center leading-[1.7] text-(--v9-fog)">
          Connected systems, unified data and intelligence for the decisions that matter.
        </p>

        <div className="mx-auto mt-14 max-w-[720px] text-center">
          <p className="v9-tc text-(--v9-dim)">Trusted by operators, manufacturers and value creation teams</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-2" aria-label="Client marks (placeholders)">
            {MARKS.map((m) => (
              <li key={m} className="v9-tc text-white/45">
                {m}
              </li>
            ))}
          </ul>
          <p className="v9-tc mt-3 text-white/30">Placeholder marks, pending approved client logos</p>
        </div>

        <div className="mx-auto mt-16 grid max-w-[900px] gap-10 text-center sm:grid-cols-3">
          {COLUMNS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2 className="v9-tc text-(--v9-ice)">{c.title}</h2>
              <ul className="mt-4 space-y-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[0.9375rem] text-(--v9-fog) transition-colors hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-3 border-t border-(--v9-rule) pt-6 text-center text-[0.8125rem] text-white/45 sm:flex-row sm:justify-between sm:text-left">
          <span>&copy; 2026 Genius Lab Technology. Figures, dashboards and client marks shown are illustrative.</span>
          <span className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
