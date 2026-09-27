import { BrandLogo } from "@/components/v2/ui";
import { Kicker, ROMAN, d } from "./ui";

const MODULES = [
  { name: "Connectors", body: "Ready integrations for ERP, CRM, finance, files and APIs." },
  { name: "Data Transformation", body: "Pipelines that clean, model and unify data, tested like software." },
  { name: "Analytics", body: "Dashboards, drill-downs and forecasts on one shared model." },
  { name: "Governance", body: "Definitions, lineage, access and audit trails in one place." },
  { name: "Automation", body: "Alerts, workflows and scheduled actions across your systems." },
  { name: "AI Agents", body: "Agents that read the Second Brain and answer or act." },
];

const SYSTEMS = ["ERP", "CRM", "Warehouse", "BI tools", "Sheets", "Cloud apps"];

/** The Genius Portal, presented as a catalogue index rather than a screenshot. */
export function PortalV15() {
  return (
    <section id="portal" className="relative scroll-mt-20 bg-[#11100e] py-32 sm:py-48" aria-labelledby="v15-portal-title">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-10">
        <div className="ml-auto max-w-[760px] lg:text-right">
          <Kicker className="lg:justify-end">Genius Portal</Kicker>
          <h2 id="v15-portal-title" data-lx="settle" style={d(150)} className="lx-display mt-10 text-[clamp(2.5rem,5.2vw,4.75rem)]">
            Expertise and technology, <em className="lx-gold">working as one.</em>
          </h2>
          <p data-lx="fade" style={d(350)} className="lx-body mt-8 max-w-[50ch] lg:ml-auto">
            Our specialists build on the Genius Portal, our own platform. Everything a client needs to connect, govern and run
            intelligence lives in one place.
          </p>
        </div>

        <ol className="mt-24 grid gap-x-16 sm:mt-32 md:grid-cols-2" aria-label="Inside the Genius Portal">
          {MODULES.map((m, i) => (
            <li key={m.name} data-lx="fade" style={d((i % 2) * 180)} className="group grid grid-cols-[3rem_1fr] gap-x-4 border-t border-[#d8c29d]/15 py-9">
              <span className="lx-num pt-1 text-[1.1rem]">{ROMAN[i]}</span>
              <div>
                <h3 className="lx-display text-[clamp(1.6rem,2.2vw,2.1rem)] transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-2">
                  {m.name}
                </h3>
                <p className="lx-body mt-2 text-[1rem]">{m.body}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Building on the software the client already runs. */}
        <div className="mt-28 border border-[#d8c29d]/20 p-[7px] sm:mt-36">
          <div className="grid gap-12 border border-[#d8c29d]/10 px-6 py-12 sm:px-12 sm:py-16 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="lx-caps lx-gold">Integrations</p>
              <p data-lx="settle" className="lx-display mt-6 text-[clamp(1.9rem,3vw,2.75rem)]">
                Keep the technology that <em>already runs the business.</em>
              </p>
            </div>
            <div className="lg:col-span-7">
              <ul className="grid grid-cols-2 sm:grid-cols-3" aria-label="ERP, CRM, data warehouse, BI tools, spreadsheets and cloud apps all connect into Genius Lab.">
                {SYSTEMS.map((s, i) => (
                  <li key={s} data-lx="fade" style={d(i * 120)} className="flex flex-col items-center gap-4 py-5">
                    <span className="lx-caps text-[#ede7dc]/85">{s}</span>
                    <span className="lx-hair-v h-8 bg-[#d8c29d]/35" aria-hidden="true" />
                  </li>
                ))}
              </ul>
              <span data-lx="line" style={d(500)} className="lx-hair bg-[#d8c29d]/50" aria-hidden="true" />
              <div className="mt-10 flex justify-center">
                <BrandLogo tone="white" className="h-[14px] w-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
