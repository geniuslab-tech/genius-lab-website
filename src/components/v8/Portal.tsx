import type { CSSProperties } from "react";
import { Caption, Opener, Rule, Up, shell } from "./type";

const MODULES = [
  { name: "Connectors", body: "Ready integrations for ERP, CRM, finance, files and APIs." },
  { name: "Data Transformation", body: "Pipelines that clean, model and unify data, tested like software." },
  { name: "Analytics", body: "Dashboards, drill-downs and forecasts on one shared model." },
  { name: "Governance", body: "Definitions, lineage, access and audit trails in one place." },
  { name: "Automation", body: "Alerts, workflows and scheduled actions across your systems." },
  { name: "AI Agents", body: "Agents that read the Second Brain and answer or act." },
];

const SYSTEMS = ["ERP", "CRM", "Warehouse", "BI tools", "Sheets", "Cloud apps"];

const PX = 390;
const PY = 40;
const PW = 570;
const CW = PW / 3;
const CH = 150;
const r = (v: number) => Math.round(v * 10) / 10;

/** Plate II: the client's systems wired into the Portal, with specialists as its base. */
function Plate() {
  const sysY = (i: number) => 70 + i * 66;
  return (
    <svg viewBox="0 0 1000 460" className="plate block h-auto w-full" data-v8="draw" aria-hidden="true">
      <text x={40} y={34} fontSize="11" fontWeight="600" letterSpacing="1.8" fill="var(--ink-3)">
        YOUR SYSTEMS, KEPT
      </text>
      {SYSTEMS.map((s, i) => {
        const y = sysY(i);
        const ty = r(PY + 60 + (i % 3) * 40 + (i > 2 ? 150 : 0));
        return (
          <g key={s}>
            <rect x={40} y={y - 18} width={150} height={36} fill="var(--paper)" stroke="var(--ink)" className="f" style={{ "--i": i } as CSSProperties} />
            <text x={56} y={y + 5} fontSize="14" fontWeight="500" fill="var(--ink)" className="f" style={{ "--i": i } as CSSProperties}>
              {s}
            </text>
            <path
              d={`M190,${y} C290,${y} 290,${ty} ${PX},${ty}`}
              fill="none"
              stroke={i === 0 ? "var(--red)" : "var(--ink)"}
              strokeWidth={i === 0 ? 1.6 : 0.9}
              pathLength={1}
              className="d"
              style={{ "--i": i * 2, "--d": "300ms" } as CSSProperties}
            />
            <circle cx={PX} cy={ty} r={3} fill="var(--ink)" className="f" style={{ "--i": i + 6 } as CSSProperties} />
          </g>
        );
      })}

      {/* The Portal frame */}
      <rect x={PX} y={PY} width={PW} height={CH * 2} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.4} pathLength={1} className="d" />
      <line x1={PX} x2={PX + PW} y1={PY + CH} y2={PY + CH} stroke="var(--rule)" />
      <line x1={PX + CW} x2={PX + CW} y1={PY} y2={PY + CH * 2} stroke="var(--rule)" />
      <line x1={PX + CW * 2} x2={PX + CW * 2} y1={PY} y2={PY + CH * 2} stroke="var(--rule)" />
      <text x={PX + PW} y={PY - 12} textAnchor="end" fontSize="20" fontStyle="italic" className="serif" fill="var(--ink)">
        The Genius Portal
      </text>
      {MODULES.map((m, i) => {
        const cx = PX + (i % 3) * CW;
        const cy = PY + Math.floor(i / 3) * CH;
        return (
          <g key={m.name} className="f" style={{ "--i": i + 4 } as CSSProperties}>
            <circle cx={cx + 26} cy={cy + 28} r={11} fill="none" stroke="var(--red)" />
            <text x={cx + 26} y={cy + 32} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--red)">
              {i + 1}
            </text>
            <text x={cx + 20} y={cy + 96} fontSize="25" className="serif" fill="var(--ink)">
              {m.name === "Data Transformation" ? "Transformation" : m.name}
            </text>
            <line x1={cx + 20} x2={cx + 60} y1={cy + 114} y2={cy + 114} stroke="var(--ink)" />
          </g>
        );
      })}

      {/* Specialists: the base the technology stands on. */}
      <rect x={PX} y={PY + CH * 2 + 20} width={PW} height={44} fill="var(--ink)" className="f" style={{ "--i": 10 } as CSSProperties} />
      <text x={PX + 20} y={PY + CH * 2 + 48} fontSize="11" fontWeight="600" letterSpacing="1.8" fill="var(--paper)" className="f" style={{ "--i": 10 } as CSSProperties}>
        GENIUS LAB SPECIALISTS · DATA ENGINEERING · ANALYTICS · BI · AI
      </text>
      <path d={`M${PX + PW / 2},${PY + CH * 2} L${PX + PW / 2},${PY + CH * 2 + 20}`} stroke="var(--ink)" pathLength={1} className="d" style={{ "--d": "800ms" } as CSSProperties} />
      <text x={PX} y={PY + CH * 2 + 100} fontSize="11" fill="var(--ink-3)">
        Schematic. Not an interface screenshot.
      </text>
    </svg>
  );
}

export function Portal() {
  return (
    <section id="portal" data-chapter="portal" className="scroll-mt-[var(--head-h)] py-20 sm:py-28" aria-labelledby="v8-portal-title">
      <div className={shell}>
        <Opener numeral="V" kicker="Genius Portal" title="Expertise and technology, *working as one.*" titleId="v8-portal-title" folio="36">
          <Up delay={250}>
            <p className="f-text mt-8 max-w-[50ch] text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.4]">
              Our specialists build on the Genius Portal, our own platform. Everything a client needs to connect, govern and
              run intelligence lives in one place.
            </p>
          </Up>
        </Opener>

        <figure className="mt-14 hidden md:block lg:mt-20">
          <div className="grain border border-[color:var(--ink)] p-6 lg:p-10">
            <Plate />
          </div>
          <Caption fig="Plate II">
            Anatomy of the Genius Portal. The systems a client already runs connect on the left; six modules work on one model;
            Genius Lab specialists build and run it underneath. Illustrative schematic.
          </Caption>
        </figure>

        <div className="mt-12 lg:mt-16">
          <p className="label text-[color:var(--ink-3)]">Key to the plate</p>
          <Rule ink className="mt-3" />
          <ol className="grid gap-px bg-[color:var(--rule)] sm:grid-cols-2 lg:grid-cols-3" aria-label="Inside the Genius Portal">
            {MODULES.map((m, i) => (
              <li key={m.name} className="bg-[color:var(--paper)]">
                <Up delay={(i % 3) * 70} className="flex gap-4 py-6 sm:px-5">
                  <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[color:var(--red)] text-[0.6875rem] font-bold text-[color:var(--red)]">
                    {i + 1}
                  </span>
                  <span>
                    <span className="f-display block text-[1.625rem] leading-[1.05]">{m.name}</span>
                    <span className="body-copy mt-1.5 block !text-[1rem]">{m.body}</span>
                  </span>
                </Up>
              </li>
            ))}
          </ol>
          <Rule />
        </div>

        {/* Integrations: building on what already runs. */}
        <div className="mt-16 grid gap-8 lg:mt-20 lg:grid-cols-12 lg:items-end lg:gap-10">
          <Up as="blockquote" className="lg:col-span-7">
            <p className="f-display text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[1]">
              &ldquo;Keep the technology that <span className="italic text-[color:var(--red)]">already</span> runs the
              business.&rdquo;
            </p>
          </Up>
          <div className="lg:col-span-5">
            <p className="label text-[color:var(--ink-3)]">Connects, never replaces</p>
            <ul className="mt-3 grid grid-cols-2 border-t border-[color:var(--ink)] sm:grid-cols-3" aria-label="ERP, CRM, data warehouse, BI tools, spreadsheets and cloud apps all connect into Genius Lab.">
              {SYSTEMS.map((s) => (
                <li key={s} className="flex items-center justify-between border-b border-[color:var(--rule)] py-3 pr-4 text-[0.9375rem] font-medium">
                  {s}
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--red)]" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
