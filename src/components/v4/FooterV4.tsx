import { BrandLogo } from "@/components/v2/ui";
import { Pulse } from "./ui";

const COLUMNS = [
  { title: "Capabilities", links: ["Data Engineering", "Analytics", "Business Intelligence", "Artificial Intelligence"] },
  { title: "Genius", links: ["Second Brain", "AI Agents", "Genius Portal"] },
  { title: "Company", links: ["About", "Careers", "Contact"] },
];

export function FooterV4() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="shell grid gap-14 pb-12 pt-20 md:grid-cols-12 lg:pt-24">
        <div className="md:col-span-5">
          <BrandLogo tone="white" className="h-6 w-auto" />
          <p className="mt-6 max-w-[34ch] leading-relaxed text-white/55">Connected systems, unified data and intelligence for the decisions that matter.</p>
          <p className="v4-label mt-8 flex items-center gap-2 text-[0.6875rem] text-white/40">
            <Pulse className="bg-emerald-400" /> All systems operational
          </p>
        </div>
        {COLUMNS.map((c, i) => (
          <nav key={c.title} aria-label={c.title} className={`md:col-span-2 ${i === 0 ? "md:col-start-7" : ""}`}>
            <h2 className="v4-label text-[0.6875rem] text-white/35">{c.title}</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="group inline-flex items-center gap-2 text-[0.9375rem] text-white/70 transition-colors hover:text-white">
                    <span className="h-px w-0 bg-cyan transition-[width] duration-300 group-hover:w-3" aria-hidden="true" />
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="shell v4-label flex flex-col gap-4 border-t border-line py-6 text-[0.6875rem] text-white/40 sm:flex-row sm:justify-between">
        <span>&copy; 2026 Genius Lab Technology</span>
        <span className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
        </span>
      </div>
    </footer>
  );
}
