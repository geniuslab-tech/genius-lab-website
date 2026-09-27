import type { CSSProperties } from "react";
import { BrandLogo } from "@/components/v2/ui";
import { MODULES, SYSTEMS } from "./data";
import { Pane, SECTION, SectionHead, WRAP } from "./ui";

const FAN = SYSTEMS.map((s, i) => {
  const glyph = i === 0 ? "┐" : i === SYSTEMS.length - 1 ? "┘" : i === 3 ? "┼" : "┤";
  const tail = i === 3 ? "───> GENIUS PORTAL" : "";
  return `  ${s} ${"─".repeat(13 - s.length)}${glyph}${tail}`;
});

export function Portal() {
  return (
    <section id="portal" tabIndex={-1} className={SECTION} aria-labelledby="v11-portal-title">
      <div className={WRAP}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <SectionHead index="06" cmd="ls -l /genius/portal/modules" id="v11-portal-title" title="Expertise and technology, working as one." className="lg:col-span-7" />
          <p data-boot="" className="max-w-[56ch] text-pretty text-[15.5px] leading-[1.75] text-(--fg-2) lg:col-span-5">
            Our specialists build on the Genius Portal, our own platform. Everything a client needs to connect, govern and run intelligence
            lives in one place.
          </p>
        </div>

        <Pane title="/genius/portal/modules" meta={`${MODULES.length} modules`} className="mt-12" bodyClass="v11-term text-[13.5px]">
          <ol aria-label="Inside the Genius Portal">
            {MODULES.map((m, i) => (
              <li
                key={m.slug}
                className="group grid gap-x-6 gap-y-1 border-b border-(--rule) px-4 py-4 transition-colors last:border-0 hover:bg-(--bg-3) sm:px-5 md:grid-cols-[6.5rem_14rem_1fr] md:items-baseline"
              >
                <span className="hidden text-[12px] text-(--fg-3) md:block" aria-hidden="true">
                  drwxr-x 0{i + 1}
                </span>
                <h3 className="font-medium text-(--fg) group-hover:text-(--amber)">
                  <span className="text-(--amber-2)" aria-hidden="true">
                    {m.slug}/
                  </span>
                  <span className="ml-3 text-[12.5px] font-normal text-(--fg-3) md:hidden">{m.name}</span>
                  <span className="sr-only">{m.name}</span>
                </h3>
                <p className="leading-[1.65] text-(--fg-2)">{m.body}</p>
              </li>
            ))}
          </ol>
        </Pane>

        <div className="mt-4 grid gap-4 lg:grid-cols-12">
          <div data-boot="" className="border border-(--rule-2) bg-(--bg-3) p-6 sm:p-8 lg:col-span-5">
            <p className="v11-label text-(--amber-2)">Integrations</p>
            <p className="v11-display mt-4 text-[clamp(1.4rem,2.4vw,1.9rem)] text-(--fg)">Keep the technology that already runs the business.</p>
            <div className="mt-8 flex items-center gap-3 border-t border-(--rule) pt-6">
              <BrandLogo tone="white" className="h-[12px] w-auto opacity-90" />
              <span className="v11-term text-[12px] text-(--fg-3)">builds on it, never rips it out</span>
            </div>
          </div>
          <Pane title="integrations.map" meta="fan-in" className="min-w-0 lg:col-span-7" bodyClass="v11-cq px-4 py-6 sm:px-6">
            <div className="v11-ascii text-(--fg-2)" style={{ "--cols": 36, "--max": "15px" } as CSSProperties} aria-hidden="true">
              {FAN.map((l, i) => (
                <div key={i}>
                  {i === 3 ? (
                    <>
                      {l.replace("───> GENIUS PORTAL", "")}
                      <span className="text-(--amber)">───&gt; </span>
                      <span className="v11-glow text-(--amber)">GENIUS PORTAL</span>
                    </>
                  ) : (
                    l
                  )}
                </div>
              ))}
            </div>
            <p className="sr-only">ERP, CRM, data warehouse, BI tools, spreadsheets and cloud apps all connect into the Genius Portal.</p>
          </Pane>
        </div>
      </div>
    </section>
  );
}
