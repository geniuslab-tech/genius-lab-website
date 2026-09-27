"use client";

import { useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { ChartLegend, ForecastChart, KPIS, KpiTile, PipelineList, TaskList } from "./Minis21";
import { Illustrative, SectionHead, useInView, useReducedMotion21 } from "./ui";
import { rd, wrap } from "./shared";

const CYCLE = 7000;

function Drivers() {
  const rows = [
    { name: "Price and mix", v: "+3.1%", w: 62, good: true },
    { name: "Volume", v: "+2.2%", w: 44, good: true },
    { name: "Freight", v: "−1.4%", w: 28, good: false },
  ];
  return (
    <ul className="mt-3 space-y-2">
      {rows.map((r) => (
        <li key={r.name} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-3 text-[0.75rem]">
          <span className="text-[var(--ink-2)]">{r.name}</span>
          <span className="h-1.5 rounded-full bg-[#f1ece4]">
            <span className={`block h-full rounded-full ${r.good ? "bg-[var(--blue)]" : "bg-[var(--terra)]"}`} style={{ width: `${r.w}%` }} />
          </span>
          <span className="v21-mono text-right text-[var(--ink)]">{r.v}</span>
        </li>
      ))}
    </ul>
  );
}

const LAYERS: { n: string; name: string; role: string; body: string; gives: string[]; ui: ReactNode; uiLabel: string }[] = [
  {
    n: "01",
    name: "Data Engineering",
    role: "The foundation.",
    body: "We connect your systems and engineer their data into one governed, reliable foundation: integration, pipelines, modeling and quality.",
    gives: ["Connected systems", "A unified data platform", "Trusted, tested pipelines"],
    uiLabel: "Pipelines",
    ui: <PipelineList />,
  },
  {
    n: "02",
    name: "Analytics",
    role: "Organized data becomes understanding.",
    body: "Analysis and modeling explain what is happening, why it is happening and what is likely to happen next.",
    gives: ["Performance analysis", "Forecasts and drivers", "Customer and operational insight"],
    uiLabel: "Forecast",
    ui: (
      <div className="rounded-[14px] border border-[#ece7df] bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[0.8125rem] font-semibold text-[var(--ink)]">Revenue forecast, next six months</p>
          <ChartLegend />
        </div>
        <ForecastChart className="mt-3" />
        <div className="mt-2 border-t border-[#f0ebe3] pt-3">
          <p className="text-[0.6875rem] font-semibold text-[var(--ink-3)]">What moved revenue this quarter</p>
          <Drivers />
        </div>
      </div>
    ),
  },
  {
    n: "03",
    name: "Business Intelligence",
    role: "Understanding becomes visible.",
    body: "One set of definitions behind every dashboard and report, so leadership sees the same numbers, at the same time.",
    gives: ["Executive dashboards", "Shared metrics and KPIs", "Self-service reporting"],
    uiLabel: "KPI board",
    ui: (
      <div className="rounded-[16px] bg-[#f6f3ee] p-3">
        <div className="grid grid-cols-2 gap-2.5">
          {KPIS.map((k, i) => (
            <KpiTile key={k.label} k={k} delay={i * 90} />
          ))}
        </div>
        <div className="mt-2.5 rounded-[12px] border border-[#ece7df] bg-white px-3.5 py-3">
          <p className="text-[0.6875rem] font-semibold text-[var(--ink-3)]">Metric definition</p>
          <p className="v21-mono mt-1 text-[0.75rem] text-[var(--ink)]">EBITDA margin = EBITDA ÷ net revenue</p>
          <p className="mt-1.5 flex flex-wrap gap-1.5">
            <span className="v21-chip v21-chip-muted">Owner: Finance</span>
            <span className="v21-chip v21-chip-blue">Used in 14 dashboards</span>
          </p>
        </div>
      </div>
    ),
  },
  {
    n: "04",
    name: "Artificial Intelligence",
    role: "Visibility gains context and reasoning.",
    body: "AI learns your business context and becomes its Second Brain. AI Agents reason across systems, tables, metrics and processes to answer and act.",
    gives: ["Second Brain", "AI Agents", "Orchestrated execution"],
    uiLabel: "Agent tasks",
    ui: <TaskList />,
  },
];

export function Capabilities21() {
  const reduce = useReducedMotion21();
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const [active, setActive] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [hold, setHold] = useState(false);
  const auto = inView && !reduce && !stopped;

  const pick = (i: number) => {
    setStopped(true);
    setActive(i);
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = LAYERS.length;
    const to = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    pick(to);
    document.getElementById(`v21-tab-${to}`)?.focus();
  };

  return (
    <section id="capabilities" className="relative scroll-mt-20 py-20 sm:py-28" aria-labelledby="v21-cap-title">
      <div className={wrap}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead
            className="lg:col-span-7"
            label="Platform"
            id="v21-cap-title"
            lines={["One intelligence and", "execution layer across", "your business."]}
          />
          <p data-rv="up" style={rd(120)} className="v21-lead max-w-[46ch] lg:col-span-5 lg:pb-2">
            Not four products. Every layer is built on the one beneath it, and the top of the stack is a better decision.
          </p>
        </div>

        <div
          ref={ref}
          className="mt-12 sm:mt-16"
          onPointerEnter={() => setHold(true)}
          onPointerLeave={() => setHold(false)}
          onFocus={() => setHold(true)}
          onBlur={() => setHold(false)}
        >
          <div role="tablist" aria-label="Capability layers, foundation first" className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {LAYERS.map((l, i) => {
              const on = i === active;
              return (
                <button
                  key={l.n}
                  id={`v21-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls={`v21-panel-${i}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => pick(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`group relative overflow-hidden rounded-[14px] px-4 pb-4 pt-3.5 text-left transition-[background-color,box-shadow] duration-300 ${
                    on ? "bg-[var(--paper)] shadow-[0_0_0_1px_var(--rule),0_10px_24px_-18px_rgb(60_44_20/0.4)]" : "hover:bg-[#efebe4]"
                  }`}
                >
                  <span className="v21-mono block text-[0.75rem] text-[var(--ink-3)]">Layer {l.n}</span>
                  <span className={`mt-1 block text-[0.9375rem] font-semibold sm:text-[1rem] ${on ? "text-[var(--ink)]" : "text-[var(--ink-2)]"}`}>{l.name}</span>
                  <span className="absolute inset-x-4 bottom-2 h-[2px] overflow-hidden rounded-full bg-[var(--rule-soft)]" aria-hidden="true">
                    <span
                      key={`${i}-${active}-${auto}`}
                      className="v21-progress block h-full rounded-full bg-[var(--terra)]"
                      style={{ "--dur": `${CYCLE}ms` } as CSSProperties}
                      data-run={on && auto ? "" : undefined}
                      data-paused={on && auto && hold ? "" : undefined}
                      data-full={(on && !auto) || i < active ? "" : undefined}
                      onAnimationEnd={() => on && setActive((a) => (a + 1) % LAYERS.length)}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 grid">
            {LAYERS.map((l, i) => {
              const on = i === active;
              return (
                <div
                  key={l.n}
                  id={`v21-panel-${i}`}
                  role="tabpanel"
                  aria-labelledby={`v21-tab-${i}`}
                  data-panel
                  data-active={on ? "" : undefined}
                  inert={!on}
                  className="v21-card grid gap-8 p-5 [grid-area:1/1] sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10"
                >
                  <div className="flex flex-col lg:col-span-5">
                    <p className="v21-mono text-[0.8125rem] text-[var(--terra-ink)]">Layer {l.n}</p>
                    <h3 className="v21-display mt-3 text-[clamp(1.75rem,3vw,2.4rem)]">{l.name}</h3>
                    <p className="mt-2 font-semibold text-[var(--ink)]">{l.role}</p>
                    <p className="v21-lead mt-3 text-[1rem]!">{l.body}</p>
                    <ul className="mt-6 space-y-2.5 border-t border-[var(--rule-soft)] pt-5 lg:mt-auto">
                      {l.gives.map((g) => (
                        <li key={g} className="flex items-center gap-3 text-[0.9375rem] text-[var(--ink)]">
                          <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0" aria-hidden="true">
                            <path d="M2 6.2 4.8 9 10 3" fill="none" stroke="var(--terra)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="min-w-0 lg:col-span-7">
                    <div className="v21-frame rounded-[22px]! p-2!">
                      <div className="rounded-[16px] bg-[#fbfaf7] p-2 sm:p-3">{l.ui}</div>
                    </div>
                    <Illustrative className="mt-3">{l.uiLabel} · illustrative, sample data</Illustrative>
                  </div>
                </div>
              );
            })}
          </div>

          <div data-rv="up" className="mt-3 flex flex-col gap-4 rounded-[20px] bg-[var(--ink)] p-6 text-[#f4f1ec] sm:p-8 md:flex-row md:items-center md:justify-between md:gap-10">
            <p className="v21-display shrink-0 text-[clamp(1.5rem,2.6vw,2rem)]">
              The outcome: <em className="text-[#e9a383]!">better business decisions.</em>
            </p>
            <p className="max-w-[56ch] leading-[1.65] text-[#cfcbd8]">
              Each layer builds on the one beneath it. Together they give executives clear insight, full visibility and the confidence to act.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
