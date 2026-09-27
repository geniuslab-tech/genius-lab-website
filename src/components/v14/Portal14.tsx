import { ChartLineUp, FlowArrow, Lightning, Plugs, Robot, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { BrandLogo } from "@/components/v2/ui";
import { Head, Section, delay } from "./ui";

const MODULES = [
  { Icon: Plugs, name: "Connectors", body: "Ready integrations for ERP, CRM, finance, files and APIs." },
  { Icon: FlowArrow, name: "Data Transformation", body: "Pipelines that clean, model and unify data, tested like software." },
  { Icon: ChartLineUp, name: "Analytics", body: "Dashboards, drill-downs and forecasts on one shared model." },
  { Icon: ShieldCheck, name: "Governance", body: "Definitions, lineage, access and audit trails in one place." },
  { Icon: Lightning, name: "Automation", body: "Alerts, workflows and scheduled actions across your systems." },
  { Icon: Robot, name: "AI Agents", body: "Agents that read the Second Brain and answer or act." },
];

const SYSTEMS = ["ERP", "CRM", "Warehouse", "BI tools", "Sheets", "Cloud apps"];

export function Portal14() {
  return (
    <Section id="portal" n="06" label="Genius Portal" titleId="v14-portal-title">
      <Head
        id="v14-portal-title"
        title="Expertise and technology, working as one."
        lead="Our specialists build on the Genius Portal, our own platform. Everything a client needs to connect, govern and run intelligence lives in one place."
      />

      <ol className="grid grid-cols-1 gap-[2px] bg-black sm:grid-cols-2 xl:grid-cols-3" aria-label="Inside the Genius Portal">
        {MODULES.map(({ Icon, name, body }, i) => (
          <li key={name} data-r="up" style={delay((i % 3) * 90)} className="v14-inv flex min-h-[13rem] flex-col bg-white px-4 py-5 sm:px-6">
            <span className="flex items-start justify-between">
              <Icon size={30} weight="bold" aria-hidden="true" />
              <span className="v14-mono">M.0{i + 1}</span>
            </span>
            <h3 className="v14-head mt-auto pt-8 text-[clamp(1.75rem,2.6vw,2.5rem)]">{name}</h3>
            <p className="v14-soft mt-2 leading-[1.55]">{body}</p>
          </li>
        ))}
      </ol>

      {/* Building on the software the client already runs. */}
      <div className="grid border-t-2 border-black xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <div className="border-black px-4 py-6 sm:px-6 max-xl:border-b-2 xl:border-r-2">
          <p className="v14-mono">Integrations</p>
          <p className="v14-head mt-3 text-[clamp(1.75rem,3vw,3rem)]">Keep the technology that already runs the business.</p>
        </div>
        <div className="grid sm:grid-cols-[minmax(0,1fr)_auto]">
          <ul
            className="grid grid-cols-2 gap-[2px] bg-black sm:grid-cols-3"
            aria-label="ERP, CRM, data warehouse, BI tools, spreadsheets and cloud apps all connect into Genius Lab."
          >
            {SYSTEMS.map((s) => (
              <li key={s} className="v14-mono flex min-h-16 items-center justify-between gap-2 bg-white px-4">
                {s}
                <span aria-hidden="true">&rarr;</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-center border-black bg-white px-8 py-8 max-sm:border-t-2 sm:border-l-2">
            <BrandLogo tone="navy" className="h-[16px] w-auto" />
          </div>
        </div>
      </div>
    </Section>
  );
}
