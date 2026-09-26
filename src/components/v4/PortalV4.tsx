import { ChartLineUp, FlowArrow, Lightning, Plugs, Robot, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { Dashboard } from "@/components/v2/PortalV2";
import { Pulse, SectionTag, h2v4 } from "./ui";

const MODULES = [
  { Icon: Plugs, name: "Connectors", body: "Ready integrations for ERP, CRM, finance, files and APIs." },
  { Icon: FlowArrow, name: "Data Transformation", body: "Pipelines that clean, model and unify data, tested like software." },
  { Icon: ChartLineUp, name: "Analytics", body: "Dashboards, drill-downs and forecasts on one shared model." },
  { Icon: ShieldCheck, name: "Governance", body: "Definitions, lineage, access and audit trails in one place." },
  { Icon: Lightning, name: "Automation", body: "Alerts, workflows and scheduled actions across your systems." },
  { Icon: Robot, name: "AI Agents", body: "Agents that read the Second Brain and answer or act." },
];

const SYSTEMS = ["ERP", "CRM", "Warehouse", "BI tools", "Sheets", "Cloud apps"];

export function PortalV4() {
  return (
    <section id="portal" className="relative scroll-mt-16 overflow-x-clip py-24 sm:py-32" aria-labelledby="v4-portal-title">
      <div className="shell">
        <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
          <SectionTag n="05">Genius Portal</SectionTag>
          <h2 id="v4-portal-title" data-reveal="up" className={`${h2v4} mt-8 max-w-[16ch]`}>
            Expertise and technology, working as one.
          </h2>
          <p data-reveal="up" data-delay="100" className="mt-8 max-w-[58ch] text-lg leading-relaxed text-white/60">
            Our specialists build on the Genius Portal, our own platform. Everything a client needs to connect, govern
            and run intelligence lives in one place.
          </p>
        </div>

        <div className="relative isolate mx-auto mt-14 max-w-[1100px] lg:mt-20">
          <div className="pointer-events-none absolute -inset-x-20 -bottom-16 top-1/3 -z-10 bg-[radial-gradient(closest-side,rgb(85_119_255/0.35),transparent)] blur-2xl" aria-hidden="true" />
          <div data-reveal="up" data-delay="120">
            <Dashboard captionClassName="text-white/40 text-center font-mono uppercase tracking-[0.06em] text-[0.6875rem]" />
          </div>
        </div>

        <ol className="mt-16 grid border-l border-t border-line sm:grid-cols-2 lg:mt-24 lg:grid-cols-3" aria-label="Inside the Genius Portal">
          {MODULES.map(({ Icon, name, body }, i) => (
            <li key={name} className="group relative border-b border-r border-line p-6 transition-colors duration-300 hover:bg-white/[0.03] sm:p-8">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center border border-line text-white transition-colors duration-300 group-hover:border-cyan/60 group-hover:text-cyan">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="v4-label text-white/25">M-0{i + 1}</span>
              </div>
              <h3 className="type-wide mt-8 text-xl font-medium text-white">{name}</h3>
              <p className="mt-2 leading-relaxed text-white/55">{body}</p>
              <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-cyan transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100" aria-hidden="true" />
            </li>
          ))}
        </ol>

        {/* Building on the software the client already runs. */}
        <div className="mt-16 grid gap-8 lg:mt-24 lg:grid-cols-12 lg:items-center">
          <p className="type-wide text-2xl font-medium leading-snug text-white lg:col-span-4">Keep the technology that already runs the business.</p>
          <div className="lg:col-span-8">
            <div className="v4-label flex items-center justify-between border border-b-0 border-line px-4 py-2.5 text-[0.6875rem] text-white/40">
              <span>Connected sources</span>
              <span className="flex items-center gap-2">
                <Pulse className="bg-emerald-400" /> Syncing into Genius Lab
              </span>
            </div>
            <ul className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3" aria-label="ERP, CRM, data warehouse, BI tools, spreadsheets and cloud apps all connect into Genius Lab.">
              {SYSTEMS.map((s, i) => (
                <li key={s} className="flex items-center justify-between gap-3 bg-void px-4 py-4">
                  <span className="type-mono text-[0.875rem] text-white/85">{s}</span>
                  <span className="flex items-center gap-2">
                    <span className="relative h-px w-10 overflow-hidden bg-white/10" aria-hidden="true">
                      <span
                        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent to-cyan motion-safe:animate-[v4-flow_1.6s_linear_infinite]"
                        style={{ animationDelay: `${i * -0.27}s` }}
                      />
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
