import { BrandLogo } from "@/components/v2/ui";

const COLUMNS = [
  { title: "Capabilities", links: ["Data Engineering", "Analytics", "Business Intelligence", "Artificial Intelligence"] },
  { title: "Genius", links: ["Second Brain", "AI Agents", "Genius Portal"] },
  { title: "Company", links: ["About", "Careers", "Contact"] },
];

export function Footer14() {
  return (
    <footer className="bg-black text-white">
      <div className="grid gap-[2px] bg-white md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div className="bg-black px-4 py-8 sm:px-6">
          <BrandLogo tone="white" className="h-5 w-auto" />
          <p className="mt-5 max-w-[34ch] leading-[1.6] text-[#cfcfcf]">
            Connected systems, unified data and intelligence for the decisions that matter.
          </p>
        </div>
        {COLUMNS.map((c) => (
          <nav key={c.title} aria-label={c.title} className="bg-black px-4 py-8 sm:px-6">
            <h2 className="v14-mono text-[#bdbdbd]">{c.title}</h2>
            <ul className="mt-5 space-y-2">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="inline-block px-1 py-0.5 -mx-1 text-[0.9375rem] hover:bg-white hover:text-black">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="flex flex-col gap-3 border-t-2 border-white px-4 py-5 sm:flex-row sm:justify-between sm:px-6">
        <p className="v14-mono text-[#bdbdbd]">
          &copy; 2026 Genius Lab Technology. Figures, conversations and client marks shown are illustrative.
        </p>
        <p className="v14-mono flex gap-6">
          <a href="#" className="hover:bg-white hover:text-black">Privacy</a>
          <a href="#" className="hover:bg-white hover:text-black">Terms</a>
        </p>
      </div>
    </footer>
  );
}
