import type { CSSProperties } from "react";
import { Illustrative, SectionHead } from "./ui";
import { rd, wrap } from "./shared";

const MODULES = [
  { name: "Connectors", body: "Ready integrations for ERP, CRM, finance, files and APIs." },
  { name: "Data Transformation", body: "Pipelines that clean, model and unify data, tested like software." },
  { name: "Analytics", body: "Dashboards, drill-downs and forecasts on one shared model." },
  { name: "Governance", body: "Definitions, lineage, access and audit trails in one place." },
  { name: "Automation", body: "Alerts, workflows and scheduled actions across your systems." },
  { name: "AI Agents", body: "Agents that read the Second Brain and answer or act." },
];

const SYSTEMS = ["ERP", "CRM", "Warehouse", "BI tools", "Sheets", "Cloud apps"];
const OUTPUTS = ["Dashboards", "Second Brain", "AI Agents"];

const W = 640;
const H = 340;
const PX = 330;
const PY = 170;
const sy = (i: number) => 36 + i * 53.6;
const oy = (i: number) => 90 + i * 80;
const r1 = (v: number) => Math.round(v * 10) / 10;
const dd = (ms: number) => ({ "--dd": `${ms}ms` }) as CSSProperties;

function Flow() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="ERP, CRM, warehouse, BI tools, spreadsheets and cloud apps all connect into the Genius Portal, which powers dashboards, the Second Brain and AI Agents." data-rv="draw" fill="none">
      {SYSTEMS.map((s, i) => {
        const y = r1(sy(i));
        return (
          <g key={s}>
            <path d={`M118 ${y} C ${210} ${y}, ${230} ${PY}, ${PX - 58} ${PY}`} pathLength={1} stroke="#b9ae9c" strokeWidth="1" className="v21-draw" style={dd(i * 90)} />
            <rect x="8" y={y - 14} width="110" height="28" rx="14" fill="#fcfbf8" stroke="#d9d1c4" />
            <circle cx="26" cy={y} r="3.5" fill="#3f6b4a" />
            <text x="38" y={y + 4} fontSize="11.5" fontWeight="600" fill="#101440">
              {s}
            </text>
          </g>
        );
      })}
      {OUTPUTS.map((o, i) => {
        const y = oy(i);
        return (
          <g key={o}>
            <path d={`M${PX + 58} ${PY} C ${450} ${PY}, ${460} ${y}, ${512} ${y}`} pathLength={1} stroke="#2f55d4" strokeWidth="1.3" className="v21-draw" style={dd(900 + i * 120)} />
            <rect x="512" y={y - 15} width="120" height="30" rx="10" fill="#fff" stroke="#2f55d4" strokeOpacity="0.5" className="v21-fade" style={dd(1300 + i * 120)} />
            <text x="572" y={y + 4} textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#2443b0" className="v21-fade" style={dd(1300 + i * 120)}>
              {o}
            </text>
          </g>
        );
      })}
      <rect x={PX - 58} y={PY - 46} width="116" height="92" rx="18" fill="#101440" />
      <path d={`M${PX} ${PY - 26} ${PX + 15.6} ${PY - 17}v18L${PX} ${PY + 10} ${PX - 15.6} ${PY + 1}v-18Z`} fill="none" stroke="#f4f1ec" strokeWidth="1.4" strokeLinejoin="round" />
      <path d={`M${PX} ${PY - 15} ${PX + 6} ${PY - 11.5}v7L${PX} ${PY - 1} ${PX - 6} ${PY - 4.5}v-7Z`} fill="#6f8cf0" />
      <text x={PX} y={PY + 30} textAnchor="middle" fontSize="11" fontWeight="600" fill="#f4f1ec">
        Genius Portal
      </text>
    </svg>
  );
}

export function Portal21() {
  return (
    <section id="portal" className="relative scroll-mt-20 py-20 sm:py-28" aria-labelledby="v21-portal-title">
      <div className={wrap}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead className="lg:col-span-7" label="Genius Portal" id="v21-portal-title" lines={["Expertise and technology,", "working as one."]} />
          <p data-rv="up" style={rd(120)} className="v21-lead max-w-[48ch] lg:col-span-5 lg:pb-2">
            Our specialists build on the Genius Portal, our own platform. Everything a client needs to connect, govern and run intelligence lives in one place.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-12">
          <figure data-rv="up" className="v21-card p-5 sm:p-8 lg:col-span-7">
            <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="v21-serif text-[1.375rem] text-[var(--ink)]">Keep the technology that already runs the business.</span>
            </figcaption>
            <div className="mt-6 overflow-x-auto">
              <div className="min-w-[520px]">
                <Flow />
              </div>
            </div>
            <Illustrative className="mt-4">Connection map · illustrative</Illustrative>
          </figure>

          <div data-rv="up" style={rd(100)} className="v21-card p-2 lg:col-span-5">
            <p className="v21-label px-5 pb-2 pt-5">Inside the Genius Portal</p>
            <ol className="divide-y divide-[var(--rule-soft)]">
              {MODULES.map((m, i) => (
                <li key={m.name} className="group grid grid-cols-[2.25rem_1fr] gap-2 rounded-[14px] px-5 py-4 transition-colors duration-300 hover:bg-[#f5f2ec]">
                  <span className="v21-mono pt-0.5 text-[0.75rem] text-[var(--terra-ink)]">0{i + 1}</span>
                  <span>
                    <span className="block font-semibold text-[var(--ink)]">{m.name}</span>
                    <span className="mt-0.5 block text-[0.9375rem] leading-[1.55] text-[var(--ink-2)]">{m.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
