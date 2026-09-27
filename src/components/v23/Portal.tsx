import { BrandLogo } from "@/components/v2/ui";
import { round } from "./math";
import { SectionHead, rd } from "./ui";

const MODULES = [
  { name: "Connectors", body: "Ready integrations for ERP, CRM, finance, files and APIs.", tag: "connect" },
  { name: "Data Transformation", body: "Pipelines that clean, model and unify data, tested like software.", tag: "engineer" },
  { name: "Analytics", body: "Dashboards, drill-downs and forecasts on one shared model.", tag: "understand" },
  { name: "Governance", body: "Definitions, lineage, access and audit trails in one place.", tag: "govern" },
  { name: "Automation", body: "Alerts, workflows and scheduled actions across your systems.", tag: "orchestrate" },
  { name: "AI Agents", body: "Agents that read the Second Brain and answer or act.", tag: "reason" },
];

const SYSTEMS = ["ERP", "CRM", "Warehouse", "BI tools", "Sheets", "Cloud apps"];
const H = 360;
const ROW = H / SYSTEMS.length;
const HUB = { x: 330, y: H / 2 };

export function Portal() {
  return (
    <section id="portal" className="scroll-mt-16 bg-white py-24 sm:py-32" data-v23-tone="light" data-v23-chapter="Genius Portal" aria-labelledby="v23-portal-title">
      <div className="v23-wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead n="05" id="v23-portal-title" kicker="Genius Portal" title="Expertise and technology, working as one." className="lg:col-span-7" />
          <p data-v23-rv style={rd(120)} className="max-w-[50ch] text-pretty text-[1.0625rem] leading-[1.7] text-(--tx-2) lg:col-span-5">
            Our specialists build on the Genius Portal, our own platform. Everything a client needs to connect, govern and run intelligence lives in one place.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          <ol className="overflow-hidden rounded-[16px] border border-(--line) lg:col-span-7" aria-label="Inside the Genius Portal">
            {MODULES.map((m, i) => (
              <li
                key={m.name}
                data-v23-rv
                style={rd(i * 50)}
                className="grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-1 border-b border-(--line) px-5 py-5 last:border-b-0 sm:grid-cols-[2.5rem_11rem_1fr_auto] sm:items-baseline sm:px-6"
              >
                <span className="v23-mono text-[0.75rem] text-(--tx-3)">0{i + 1}</span>
                <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em]">{m.name}</h3>
                <p className="col-start-2 text-[0.9375rem] leading-[1.6] text-(--tx-2) sm:col-start-3">{m.body}</p>
                <span className="v23-mono col-start-2 mt-2 justify-self-start rounded-full bg-(--chip) px-2 py-0.5 text-[0.6875rem] text-(--tx-3) sm:col-start-4 sm:mt-0">{m.tag}</span>
              </li>
            ))}
          </ol>

          <div data-v23-rv style={rd(120)} className="flex flex-col rounded-[16px] bg-[#101440] p-6 text-white sm:p-8 lg:col-span-5">
            <p className="v23-label text-[#8fd6e6]">Integrations</p>
            <p className="mt-3 max-w-[26ch] text-[1.375rem] font-semibold leading-snug tracking-[-0.02em]">Keep the technology that already runs the business.</p>
            <svg viewBox={`0 0 420 ${H}`} className="mt-8 h-auto w-full" role="img" aria-label="ERP, CRM, data warehouse, BI tools, spreadsheets and cloud apps all connect into the Genius Portal.">
              {SYSTEMS.map((s, i) => {
                const y = round(ROW * i + ROW / 2);
                const d = `M104 ${y} C 220 ${y}, 230 ${HUB.y}, ${HUB.x - 44} ${HUB.y}`;
                return (
                  <g key={s}>
                    <path d={d} fill="none" stroke="rgb(170 195 255 / 0.22)" />
                    <path d={d} fill="none" stroke="#8fd6e6" strokeWidth="1.6" strokeDasharray="3 22" className="v23-flow" style={{ animationDelay: `${-i * 340}ms` }} />
                    <rect x="0" y={y - 17} width="104" height="34" rx="8" fill="rgb(255 255 255 / 0.05)" stroke="rgb(170 195 255 / 0.22)" />
                    <circle cx="16" cy={y} r="3" fill="#7fe0c4" />
                    <text x="28" y={y + 4.5} fontSize="13" fill="#e8eeff">
                      {s}
                    </text>
                  </g>
                );
              })}
              <polygon
                points={Array.from({ length: 6 }, (_, k) => `${round(HUB.x + Math.cos((Math.PI / 3) * k) * 50)},${round(HUB.y + Math.sin((Math.PI / 3) * k) * 50)}`).join(" ")}
                fill="#fff"
              />
              <text x={HUB.x} y={HUB.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#101440">
                PORTAL
              </text>
            </svg>
            <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/10 pt-5">
              <BrandLogo tone="white" className="h-[14px] w-auto" />
              <span className="v23-mono text-[0.6875rem] text-white/60">connect, never rip and replace</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
