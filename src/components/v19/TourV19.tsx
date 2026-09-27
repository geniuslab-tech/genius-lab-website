"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ChartLineUp, FlowArrow, Lightning, Plugs, Robot, ShieldCheck } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/v2/ui";
import { useInView, useReduced } from "./hooks";
import { ScreenAgents, ScreenAnalytics, ScreenAutomation, ScreenConnectors, ScreenGovernance, ScreenPipelines } from "./TourScreensV19";
import { SectionHead, rd } from "./ui";

const MODULES = [
  { Icon: Plugs, name: "Connectors", body: "Ready integrations for ERP, CRM, finance, files and APIs.", Screen: ScreenConnectors },
  { Icon: FlowArrow, name: "Data Transformation", body: "Pipelines that clean, model and unify data, tested like software.", Screen: ScreenPipelines },
  { Icon: ChartLineUp, name: "Analytics", body: "Dashboards, drill-downs and forecasts on one shared model.", Screen: ScreenAnalytics },
  { Icon: ShieldCheck, name: "Governance", body: "Definitions, lineage, access and audit trails in one place.", Screen: ScreenGovernance },
  { Icon: Lightning, name: "Automation", body: "Alerts, workflows and scheduled actions across your systems.", Screen: ScreenAutomation },
  { Icon: Robot, name: "AI Agents", body: "Agents that read the Second Brain and answer or act.", Screen: ScreenAgents },
];

const SYSTEMS = ["ERP", "CRM", "Warehouse", "BI tools", "Sheets", "Cloud apps"];
const CYCLE_MS = 6500;

export function TourV19() {
  const reduce = useReduced();
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(root, "-25% 0px");
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const auto = inView && !reduce && !touched;

  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % MODULES.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [auto, active]);

  const pick = (i: number, focus = false) => {
    setTouched(true);
    setActive(i);
    if (focus) tabs.current[i]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    const n = MODULES.length;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") pick((active + 1) % n, true);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") pick((active - 1 + n) % n, true);
    else if (e.key === "Home") pick(0, true);
    else if (e.key === "End") pick(n - 1, true);
    else return;
    e.preventDefault();
  };

  const M = MODULES[active];
  const Screen = M.Screen;

  return (
    <section ref={root} id="portal" className="relative isolate scroll-mt-16 overflow-hidden py-24 sm:py-32" aria-labelledby="v19-portal-title">
      <div className="v19-grid -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_20%,transparent_80%)]" aria-hidden="true" />
      <div className="v19-sweep -z-10 [animation-delay:-4s]" aria-hidden="true" />
      <div className="v19-wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead n="04" id="v19-portal-title" kicker="Genius Portal" title="Expertise and technology, working as one." className="lg:col-span-7" />
          <p className="v19-rv v19-lead lg:col-span-5" style={rd(120)}>
            Our specialists build on the Genius Portal, our own platform. Everything a client needs to connect, govern and
            run intelligence lives in one place.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:mt-16 lg:grid-cols-12 lg:gap-6">
          {/* Tabs. */}
          <div role="tablist" aria-label="Genius Portal modules" aria-orientation="vertical" onKeyDown={onKey} className="v19-rv -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:col-span-4 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
            {MODULES.map(({ Icon, name, body }, i) => {
              const on = i === active;
              return (
                <button
                  key={name}
                  ref={(el) => void (tabs.current[i] = el)}
                  type="button"
                  role="tab"
                  id={`v19-tab-${i}`}
                  aria-selected={on}
                  aria-controls="v19-tabpanel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => pick(i)}
                  className={`group relative shrink-0 overflow-hidden rounded-[12px] border text-left transition-[background-color,border-color] duration-300 max-lg:px-3.5 max-lg:py-2.5 lg:w-full lg:px-4 lg:py-3.5 ${
                    on ? "border-[color:var(--line-2)] bg-white/[0.035]" : "border-transparent hover:bg-white/[0.02]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={17} className={on ? "text-[color:var(--acc-2)]" : "text-[color:var(--tx-3)]"} aria-hidden="true" />
                    <span className={`whitespace-nowrap text-[0.9375rem] font-medium ${on ? "text-white" : "text-[color:var(--tx-2)]"}`}>{name}</span>
                    <span className="v19-label ml-auto hidden text-[color:var(--tx-3)] lg:inline">0{i + 1}</span>
                  </span>
                  <span className={`hidden transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease)] lg:grid ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <span className="overflow-hidden">
                      <span className="block pl-[1.9rem] pt-1.5 text-[0.875rem] leading-[1.55] text-[color:var(--tx-2)]">{body}</span>
                    </span>
                  </span>
                  {on && auto && (
                    <span key={`bar-${active}`} className="v19-tab-bar absolute inset-x-0 bottom-0 h-px bg-[color:var(--acc)]" data-run="" style={{ "--dur": `${CYCLE_MS}ms` } as CSSProperties} aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>

          {/* The screen. */}
          <div className="v19-rv lg:col-span-8" style={rd(100)}>
            <div className="v19-conic rounded-[18px] bg-[linear-gradient(180deg,#0b0f24,#070918)] shadow-[0_60px_120px_-60px_rgb(var(--acc-rgb)/0.35)]">
              <div className="flex h-11 items-center justify-between gap-4 border-b border-[color:var(--line)] px-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex gap-1.5" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
                  </span>
                  <BrandLogo tone="white" className="h-[9px] w-auto opacity-80" />
                  <span className="truncate text-[0.8125rem] text-[color:var(--tx-3)]">
                    <span className="px-1 text-white/20">/</span> {M.name}
                  </span>
                </div>
                <span className="v19-label shrink-0 rounded-full border border-[rgb(var(--warm-rgb)/0.4)] px-2.5 py-0.5 text-[0.5625rem] text-[color:var(--warm)]">Illustrative preview</span>
              </div>
              <div className="grid md:grid-cols-[168px_1fr]">
                <ul className="hidden space-y-0.5 border-r border-[color:var(--line)] p-2.5 md:block" aria-hidden="true">
                  {MODULES.map(({ Icon, name }, i) => (
                    <li key={name} className={`flex items-center gap-2 rounded-[8px] px-2.5 py-2 text-[0.75rem] transition-colors duration-300 ${i === active ? "bg-[rgb(var(--acc-rgb)/0.12)] text-white" : "text-[color:var(--tx-3)]"}`}>
                      <Icon size={13} />
                      <span className="truncate">{name}</span>
                    </li>
                  ))}
                </ul>
                <div id="v19-tabpanel" role="tabpanel" aria-labelledby={`v19-tab-${active}`} className="min-h-[430px] min-w-0 p-4 sm:p-6">
                  <div key={active} className="v19-screen">
                    <Screen />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Building on the software the client already runs. */}
        <div className="v19-rv v19-panel mt-16 grid gap-8 p-6 sm:p-10 lg:mt-20 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <p className="v19-label text-[color:var(--acc-2)]">Integrations</p>
            <p className="v19-h3 mt-3 text-[clamp(1.375rem,2.2vw,1.875rem)]">Keep the technology that already runs the business.</p>
          </div>
          <div className="grid items-center gap-5 sm:grid-cols-[1fr_auto] lg:col-span-8">
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label="ERP, CRM, data warehouse, BI tools, spreadsheets and cloud apps all connect into Genius Lab.">
              {SYSTEMS.map((s) => (
                <li key={s} className="flex items-center justify-between gap-3 rounded-[10px] border border-[color:var(--line)] bg-white/[0.02] px-4 py-3">
                  <span className="text-[0.9375rem]">{s}</span>
                  <span className="v19-dot v19-dot-acc" aria-hidden="true" />
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4 sm:flex-col" aria-hidden="true">
              <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,var(--acc))] sm:h-10 sm:w-px sm:bg-[linear-gradient(180deg,transparent,var(--acc))]" />
              <span className="v19-conic inline-flex items-center rounded-[12px] bg-[color:var(--g3)] px-5 py-4">
                <BrandLogo tone="white" className="h-[13px] w-auto" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
