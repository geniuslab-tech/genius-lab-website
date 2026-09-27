import { BrandLogo } from "@/components/v2/ui";
import { Chapter, Exhibit } from "./ui";

const MODULES = [
  { name: "Connectors", body: "Ready integrations for ERP, CRM, finance, files and APIs." },
  { name: "Data Transformation", body: "Pipelines that clean, model and unify data, tested like software." },
  { name: "Analytics", body: "Dashboards, drill-downs and forecasts on one shared model." },
  { name: "Governance", body: "Definitions, lineage, access and audit trails in one place." },
  { name: "Automation", body: "Alerts, workflows and scheduled actions across your systems." },
  { name: "AI Agents", body: "Agents that read the Second Brain and answer or act." },
];

const SYSTEMS = ["ERP", "CRM", "Warehouse", "BI tools", "Sheets", "Cloud apps"];
const OUTPUTS = ["Shared metrics and dashboards", "The Second Brain", "AI Agents and automation"];

function Connector({ i }: { i: number }) {
  return (
    <div className="flex items-center justify-center py-2 md:py-0" aria-hidden="true">
      <span className="draw-y block h-8 w-px bg-[#101440] md:hidden" style={{ ["--i" as string]: i }} />
      <span className="hidden items-center md:flex">
        <span className="draw-x block h-px w-10 bg-[#101440] lg:w-14" style={{ ["--i" as string]: i }} />
        <svg viewBox="0 0 6 10" className="h-2.5 w-1.5 text-[#101440]">
          <path d="M0 0 L6 5 L0 10 Z" fill="currentColor" className="fade-in" style={{ ["--i" as string]: i + 1 }} />
        </svg>
      </span>
    </div>
  );
}

export function PortalV10() {
  return (
    <Chapter
      id="portal"
      n="06"
      label="Genius Portal"
      title="Expertise and technology, working as one."
      lead="Our specialists build on the Genius Portal, our own platform. Everything a client needs to connect, govern and run intelligence lives in one place."
      note={<>Genius Lab is a data services company and a builder of its own technology. The Portal is where the two meet.</>}
    >
      <Exhibit
        n={7}
        className="mt-14 sm:mt-16"
        title="Keep the technology that already runs the business"
        source="Genius Lab. Schematic; systems shown are representative categories."
      >
        <div className="grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.1fr)_auto_minmax(0,1fr)] md:items-center">
          <div>
            <p className="caps mb-3 text-[color:var(--slate)]">What you already run</p>
            <ul className="grid grid-cols-2 gap-px border border-[color:var(--rule)] bg-[color:var(--rule)] md:grid-cols-1">
              {SYSTEMS.map((s, i) => (
                <li key={s} className="row-in bg-[color:var(--card)] px-4 py-2.5 text-[0.9375rem] text-[color:var(--ink)]" style={{ ["--i" as string]: i }}>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <Connector i={2} />
          <div className="row-in bg-[#101440] px-6 py-8 text-white" style={{ ["--i" as string]: 3 }}>
            <p className="caps text-[color:var(--brass-2)]">Built by Genius Lab</p>
            <p className="serif mt-3 text-[1.75rem] leading-[1.1]">Genius Portal</p>
            <p className="mt-3 text-[0.875rem] leading-[1.6] text-white/70">Connect, govern and run intelligence on top of existing systems. Nothing is replaced.</p>
            <BrandLogo tone="white" className="mt-6 h-[11px] w-auto opacity-80" />
          </div>
          <Connector i={4} />
          <div>
            <p className="caps mb-3 text-[color:var(--slate)]">What leadership gains</p>
            <ol className="border-t border-[color:var(--ink)]">
              {OUTPUTS.map((o, i) => (
                <li key={o} className="row-in grid grid-cols-[1.75rem_1fr] border-b border-[color:var(--rule)] py-3 text-[0.9375rem] text-[color:var(--ink)]" style={{ ["--i" as string]: i + 5 }}>
                  <span className="tnum text-[color:var(--brass)]">{i + 1}</span>
                  {o}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Exhibit>

      <div className="mt-16">
        <h3 data-reveal="up" className="serif text-[1.625rem] text-[color:var(--ink)]">Inside the Genius Portal</h3>
        <ol className="mt-6 grid border-t border-[color:var(--ink)] sm:grid-cols-2 lg:grid-cols-3" aria-label="Inside the Genius Portal">
          {MODULES.map((m, i) => (
            <li
              key={m.name}
              data-reveal="up"
              data-delay={String((i % 3) * 70)}
              className="grid grid-cols-[2.25rem_1fr] border-b border-[color:var(--rule)] py-6 sm:pr-6"
            >
              <span className="tnum pt-1 text-[0.8125rem] text-[color:var(--brass)]">0{i + 1}</span>
              <span>
                <span className="serif block text-[1.3125rem] text-[color:var(--ink)]">{m.name}</span>
                <span className="mt-1.5 block text-[0.9375rem] leading-[1.6] text-[color:var(--slate)]">{m.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Chapter>
  );
}
