import { BrandLogo } from "@/components/v2/ui";

const COLUMNS = [
  { title: "Capabilities", links: ["Data Engineering", "Analytics", "Business Intelligence", "Artificial Intelligence"] },
  { title: "Genius", links: ["Second Brain", "AI Agents", "Genius Portal"] },
  { title: "Company", links: ["About", "Careers", "Contact"] },
];

/** Apple-style footer: small type, footnotes first, then the directory. */
export function FooterV5() {
  return (
    <footer className="bg-mist text-[0.75rem] leading-[1.35] text-graphite-2">
      <div className="mx-auto max-w-[1080px] px-5 pb-6 pt-10">
        <ol className="list-decimal space-y-2 border-b border-hairline pb-6 pl-4">
          <li>Dashboard figures, chart values, agent conversations and insights shown on this page are illustrative.</li>
          <li>Testimonials are placeholders and will be replaced with approved client quotes.</li>
        </ol>

        <div className="grid gap-8 py-8 sm:grid-cols-2 md:grid-cols-5">
          <div className="md:col-span-2">
            <BrandLogo tone="navy" className="h-[13px] w-auto" />
            <p className="mt-3 max-w-[34ch]">Connected systems, unified data and intelligence for the decisions that matter.</p>
          </div>
          {COLUMNS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2 className="font-semibold text-graphite">{c.title}</h2>
              <ul className="mt-2.5 space-y-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-graphite hover:underline">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-hairline pt-5 sm:flex-row sm:justify-between">
          <span>Copyright &copy; 2026 Genius Lab Technology. All rights reserved.</span>
          <span className="flex gap-4">
            <a href="#" className="hover:text-graphite hover:underline">Privacy Policy</a>
            <span className="text-hairline" aria-hidden="true">|</span>
            <a href="#" className="hover:text-graphite hover:underline">Terms of Use</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
