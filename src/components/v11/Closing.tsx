import { BrandLogo } from "@/components/v2/ui";
import { SECTIONS, VOICES } from "./data";
import { Pane, SECTION, SectionHead, Tag, WRAP } from "./ui";

export function Voices() {
  return (
    <section id="clients" tabIndex={-1} className={SECTION} aria-labelledby="v11-voices-title">
      <div className={WRAP}>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHead index="--" cmd="tail clients.log" id="v11-voices-title" title="What our clients say." />
          <Tag>placeholders &middot; awaiting approved quotes</Tag>
        </div>
        <Pane title="clients.log" meta="3 placeholder entries" className="mt-12" bodyClass="v11-term text-[14px]">
          <ul>
            {VOICES.map((v, i) => (
              <li key={v.role} className="grid gap-x-6 gap-y-2 border-b border-(--rule) px-5 py-6 last:border-0 sm:px-6 md:grid-cols-[9rem_1fr_16rem] md:items-baseline">
                <span className="text-[12px] text-(--fg-3)">
                  entry_0{i + 1} <span className="text-(--warn)">[draft]</span>
                </span>
                <blockquote className="max-w-[62ch] text-pretty text-[15.5px] leading-[1.7] text-(--fg)">&ldquo;{v.q}&rdquo;</blockquote>
                <p className="text-[12.5px] text-(--fg-2)">
                  <span className="text-(--fg-3)" aria-hidden="true">
                    --{" "}
                  </span>
                  {v.role}
                </p>
              </li>
            ))}
          </ul>
        </Pane>
        <p className="v11-term mt-3 text-[12px] text-(--fg-3)"># Illustrative placeholder quotes. Real, approved client quotes replace these before launch.</p>
      </div>
    </section>
  );
}

export function Cta() {
  return (
    <section id="contact" tabIndex={-1} className={`${SECTION} overflow-hidden`} aria-labelledby="v11-cta-title">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(ellipse_60%_80%_at_20%_100%,rgb(255_173_66/0.1),transparent_70%)]"
        aria-hidden="true"
      />
      <div className={`${WRAP} relative grid gap-10 lg:grid-cols-12 lg:items-end`}>
        <div className="lg:col-span-8">
          <SectionHead
            index="00"
            cmd="genius init --company yours"
            id="v11-cta-title"
            title="Turn your business knowledge into intelligent systems."
            lead="Tell us where your systems and data stand today. We'll show you how Genius Lab turns them into one intelligence and execution layer, fully managed."
          />
          <p data-boot="" className="v11-label mt-8 text-(--amber-2)">
            {"// One partner. One platform. One source of truth."}
          </p>
        </div>
        <div data-boot="" className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
          <a href="#" className="v11-btn">
            Talk to us <span aria-hidden="true">&rarr;</span>
          </a>
          <a href="#action" className="v11-btn v11-btn-ghost">
            Watch it in action
          </a>
        </div>
      </div>
    </section>
  );
}

const COLUMNS = [
  { title: "capabilities", links: ["Data Engineering", "Analytics", "Business Intelligence", "Artificial Intelligence"] },
  { title: "genius", links: ["Second Brain", "AI Agents", "Genius Portal"] },
  { title: "company", links: ["About", "Careers", "Contact"] },
];

export function Footer() {
  return (
    <footer className="border-t border-(--rule-2) bg-(--bg-2)">
      <div className={`${WRAP} grid gap-12 pb-12 pt-16 md:grid-cols-12`}>
        <div className="md:col-span-4">
          <BrandLogo tone="white" className="h-[16px] w-auto" />
          <p className="mt-5 max-w-[36ch] text-[14px] leading-[1.7] text-(--fg-2)">
            Connected systems, unified data and intelligence for the decisions that matter.
          </p>
        </div>
        {COLUMNS.map((c) => (
          <nav key={c.title} aria-label={c.title} className="v11-term text-[13.5px] md:col-span-2">
            <h2 className="text-(--amber)">{c.title}/</h2>
            <ul className="mt-2">
              {c.links.map((l, i) => (
                <li key={l} className="flex gap-2">
                  <span className="text-(--fg-3)" aria-hidden="true">
                    {i === c.links.length - 1 ? "└──" : "├──"}
                  </span>
                  <a href="#" className="py-0.5 text-(--fg-2) transition-colors hover:text-(--fg)">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div className="v11-term text-[12.5px] md:col-span-2">
          <h2 className="text-(--amber)">shortcuts/</h2>
          <ul className="mt-2 space-y-1 text-(--fg-2)">
            <li>
              <kbd>Ctrl</kbd> <kbd>K</kbd> commands
            </li>
            <li>
              <kbd>/</kbd> commands
            </li>
            <li>
              <kbd>1</kbd>&ndash;<kbd>0</kbd> sections
            </li>
            <li>
              <kbd>g</kbd> top
            </li>
          </ul>
        </div>
      </div>
      <div className={`${WRAP} v11-term hidden border-t border-(--rule) py-4 text-[12px] text-(--fg-3) lg:block`}>
        <ul className="flex flex-wrap gap-x-5 gap-y-1" aria-label="Section keys">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <span className="text-(--fg-2)">{s.key}</span> {s.path}
            </li>
          ))}
        </ul>
      </div>
      <div className={`${WRAP} flex flex-col gap-3 border-t border-(--rule) py-6 text-[12.5px] text-(--fg-3) sm:flex-row sm:justify-between`}>
        <span>&copy; 2026 Genius Lab Technology. Figures, dashboards and client marks shown are illustrative.</span>
        <span className="flex gap-6">
          <a href="#" className="hover:text-(--fg)">
            Privacy
          </a>
          <a href="#" className="hover:text-(--fg)">
            Terms
          </a>
        </span>
      </div>
    </footer>
  );
}
