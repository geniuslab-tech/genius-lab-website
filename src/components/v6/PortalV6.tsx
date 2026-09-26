import { ChartLineUp, FlowArrow, Lightning, Plugs, Robot, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { BrandLogo } from "@/components/v2/ui";
import { Intro } from "./ui";

const MODULES = [
  { Icon: Plugs, name: "Connectors", body: "Ready integrations for ERP, CRM, finance, files and APIs." },
  { Icon: FlowArrow, name: "Data Transformation", body: "Pipelines that clean, model and unify data, tested like software." },
  { Icon: ChartLineUp, name: "Analytics", body: "Dashboards, drill-downs and forecasts on one shared model." },
  { Icon: ShieldCheck, name: "Governance", body: "Definitions, lineage, access and audit trails in one place." },
  { Icon: Lightning, name: "Automation", body: "Alerts, workflows and scheduled actions across your systems." },
  { Icon: Robot, name: "AI Agents", body: "Agents that read the Second Brain and answer or act." },
];

const SYSTEMS = ["ERP", "CRM", "Warehouse", "BI tools", "Sheets", "Cloud apps"];

export function PortalV6() {
  return (
    <section id="portal" className="scroll-mt-[4.5rem] bg-white py-24 sm:py-32" aria-labelledby="v6-portal-title">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Intro id="v6-portal-title" label="Genius Portal" title="Expertise and technology, working as one." className="lg:col-span-7" />
          <p data-reveal="up" className="text-pretty max-w-[52ch] text-[1.0625rem] leading-[1.7] text-steel-2 lg:col-span-5">
            Our specialists build on the Genius Portal, our own platform. Everything a client needs to connect, govern and
            run intelligence lives in one place.
          </p>
        </div>

        <ol className="mt-14 grid overflow-hidden rounded-[14px] border border-rule6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3" aria-label="Inside the Genius Portal">
          {MODULES.map(({ Icon, name, body }, i) => (
            <li
              key={name}
              data-reveal="up"
              data-delay={String((i % 3) * 70)}
              className="group relative border-rule6 p-8 transition-colors duration-300 hover:bg-frost max-sm:[&:not(:last-child)]:border-b sm:max-lg:odd:border-r sm:max-lg:[&:nth-child(-n+4)]:border-b lg:[&:not(:nth-child(3n))]:border-r lg:[&:nth-child(-n+3)]:border-b"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-frost text-sky-ink transition-colors duration-300 group-hover:bg-white">
                  <Icon size={21} aria-hidden="true" />
                </span>
                <span className="v6-label text-steel-3">0{i + 1}</span>
              </div>
              <h3 className="mt-8 text-[1.25rem] font-bold tracking-[-0.015em] text-steel">{name}</h3>
              <p className="mt-2 leading-[1.65] text-steel-2">{body}</p>
              <span className="absolute inset-x-8 top-0 h-[2px] origin-left scale-x-0 bg-ember transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100" aria-hidden="true" />
            </li>
          ))}
        </ol>

        {/* Building on the software the client already runs. */}
        <div className="mt-16 grid gap-10 rounded-[14px] bg-abyss p-8 text-white sm:p-12 lg:mt-20 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <p className="v6-label text-ember">Integrations</p>
            <p className="v6-display mt-4 text-[clamp(1.5rem,2.4vw,2rem)]">Keep the technology that already runs the business.</p>
          </div>
          <div className="lg:col-span-8">
            <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label="ERP, CRM, data warehouse, BI tools, spreadsheets and cloud apps all connect into Genius Lab.">
                {SYSTEMS.map((s) => (
                  <li key={s} className="flex items-center justify-between gap-3 rounded-[8px] border border-white/10 bg-white/[0.03] px-4 py-3">
                    <span className="text-[0.9375rem] font-medium">{s}</span>
                    <span className="flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-sky">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky" aria-hidden="true" />
                      Live
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4 sm:flex-col" aria-hidden="true">
                <span className="h-px w-10 bg-gradient-to-r from-white/10 to-ember sm:h-10 sm:w-px sm:bg-gradient-to-b" />
                <span className="inline-flex items-center rounded-[10px] bg-white px-5 py-4 shadow-[0_0_40px_-10px_rgb(242_154_31/0.6)]">
                  <BrandLogo tone="navy" className="h-[14px] w-auto" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
