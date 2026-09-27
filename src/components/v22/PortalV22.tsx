"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { ChartLineUp, FlowArrow, Lightning, Plugs, Robot, ShieldCheck } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/v2/ui";
import { hexPoints } from "@/lib/hex";
import { Illustrative, SectionHead } from "./ui";

const Row = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <li className={`flex items-center justify-between gap-4 border-b border-[var(--rule)] py-3 text-[0.875rem] last:border-0 ${className}`}>{children}</li>
);
const Chip = ({ children, tone = "ok" }: { children: ReactNode; tone?: "ok" | "info" | "muted" }) => (
  <span
    className={`ch v22-mono shrink-0 px-2 py-0.5 text-[0.6875rem] [--c:5px] ${
      tone === "ok" ? "bg-[#e3f6ef] text-[#0b6b52]" : tone === "info" ? "bg-[var(--signal-soft)] text-[var(--signal-ink)]" : "bg-[var(--paper-2)] text-[var(--ink-2)]"
    }`}
  >
    {children}
  </span>
);

/** Six modules, each with an illustrative view. */
const MODULES: { Icon: typeof Plugs; name: string; body: string; view: ReactNode }[] = [
  {
    Icon: Plugs,
    name: "Connectors",
    body: "Ready integrations for ERP, CRM, finance, files and APIs.",
    view: (
      <ul>
        {[
          ["ERP", "Synced 2 min ago"],
          ["CRM", "Synced 4 min ago"],
          ["Finance ledger", "Synced 11 min ago"],
          ["Warehouse", "Streaming"],
          ["Sheets", "Synced 1 h ago"],
        ].map(([s, t]) => (
          <Row key={s}>
            <span className="font-medium">{s}</span>
            <Chip tone={t === "Streaming" ? "info" : "ok"}>{t}</Chip>
          </Row>
        ))}
      </ul>
    ),
  },
  {
    Icon: FlowArrow,
    name: "Data Transformation",
    body: "Pipelines that clean, model and unify data, tested like software.",
    view: (
      <div>
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {["Extract", "Clean", "Model", "Publish"].map((s, i) => (
            <li key={s} className={`ch px-3 py-3 text-[0.8125rem] font-semibold [--c:8px] ${i === 3 ? "bg-[var(--navy)] text-white" : "bg-[var(--paper)]"}`}>
              <span className="v22-mono block text-[0.6875rem] font-normal opacity-60">0{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
        <ul className="mt-4">
          <Row>
            <span>orders_unified</span>
            <Chip>148 tests passing</Chip>
          </Row>
          <Row>
            <span>customer_360</span>
            <Chip>92 tests passing</Chip>
          </Row>
          <Row>
            <span>gl_consolidated</span>
            <Chip tone="info">Running</Chip>
          </Row>
        </ul>
      </div>
    ),
  },
  {
    Icon: ChartLineUp,
    name: "Analytics",
    body: "Dashboards, drill-downs and forecasts on one shared model.",
    view: (
      <div>
        <p className="text-[0.8125rem] text-[var(--ink-3)]">Gross margin by entity, %</p>
        <ul className="mt-4 space-y-3">
          {[
            ["Industrial North", 41],
            ["Distribution EMEA", 37],
            ["Retail Direct", 34],
            ["Industrial Southeast", 29],
          ].map(([n, v]) => (
            <li key={n} className="grid grid-cols-[9.5rem_1fr_2.5rem] items-center gap-3 text-[0.8125rem] max-sm:grid-cols-[6.5rem_1fr_2.5rem]">
              <span className="truncate">{n}</span>
              <span className="h-3 bg-[var(--paper-2)]">
                <span className="block h-full bg-[var(--signal)]" style={{ width: `${(Number(v) / 45) * 100}%` }} />
              </span>
              <span className="v22-mono text-right">{v}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    Icon: ShieldCheck,
    name: "Governance",
    body: "Definitions, lineage, access and audit trails in one place.",
    view: (
      <div>
        <div className="ch bg-[var(--paper)] p-4 [--c:10px]">
          <p className="v22-label text-[var(--ink-3)]">Definition · Net revenue</p>
          <p className="mt-2 text-[0.875rem] leading-[1.6]">Invoiced revenue less returns, rebates and discounts, recognised on delivery.</p>
        </div>
        <ol className="mt-4 flex flex-wrap items-center gap-2 text-[0.75rem]" aria-label="Lineage">
          {["erp.invoices", "orders_unified", "net_revenue", "Board pack"].map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              {i > 0 && <span className="h-px w-4 bg-[var(--rule-2)]" aria-hidden="true" />}
              <span className="v22-mono border border-[var(--rule)] px-2 py-1">{s}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-[0.8125rem] text-[var(--ink-3)]">Owner: Group Finance · Access: Finance, Executive</p>
      </div>
    ),
  },
  {
    Icon: Lightning,
    name: "Automation",
    body: "Alerts, workflows and scheduled actions across your systems.",
    view: (
      <ul>
        <Row>
          <span>When free cash flow drops below plan, notify the CFO</span>
          <Chip>On</Chip>
        </Row>
        <Row>
          <span>Every Monday, publish the entity scorecard</span>
          <Chip>On</Chip>
        </Row>
        <Row>
          <span>When a supplier invoice is overdue, open a task in ERP</span>
          <Chip tone="muted">Draft</Chip>
        </Row>
      </ul>
    ),
  },
  {
    Icon: Robot,
    name: "AI Agents",
    body: "Agents that read the Second Brain and answer or act.",
    view: (
      <ul>
        {[
          ["Finance agent", "Answering", "info"],
          ["Operations agent", "Watching 14 metrics", "ok"],
          ["Board pack agent", "Scheduled", "muted"],
        ].map(([n, s, t]) => (
          <Row key={n}>
            <span className="flex items-center gap-3 font-medium">
              <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true">
                <polygon points={hexPoints(8, 9, 7.5)} fill="#5577ff" />
              </svg>
              {n}
            </span>
            <Chip tone={t as "ok" | "info" | "muted"}>{s}</Chip>
          </Row>
        ))}
      </ul>
    ),
  },
];

const SYSTEMS = ["ERP", "CRM", "Warehouse", "BI tools", "Sheets", "Cloud apps"];

export function PortalV22() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const M = MODULES[active];

  const onKey = (e: KeyboardEvent) => {
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + MODULES.length) % MODULES.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="portal" className="scroll-mt-[var(--nav)] bg-[var(--paper)] py-24 sm:py-32" aria-labelledby="v22-portal-title">
      <div className="v22-shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead n="05" label="Genius Portal" id="v22-portal-title" title="Expertise and technology, working as one" className="lg:col-span-7" />
          <p data-v22r="up" className="text-pretty max-w-[48ch] text-[1.0625rem] leading-[1.7] text-[var(--ink-2)] lg:col-span-5">
            Our specialists build on the Genius Portal, our own platform. Everything a client needs to connect, govern and
            run intelligence lives in one place.
          </p>
        </div>

        {/* The device: a navy bezel, chamfered like the wordmark, around an illustrative screen. */}
        <div className="mt-14 [filter:drop-shadow(0_40px_40px_rgb(16_20_64/0.18))] lg:mt-16">
          <div data-v22r="wipe" className="ch bg-[var(--navy)] p-2 [--c:40px] sm:p-3">
            <div className="ch bg-white [--c:32px]">
              <div className="flex items-center justify-between gap-4 border-b border-[var(--rule)] py-3.5 pl-10 pr-5 sm:pl-12">
                <div className="flex min-w-0 items-center gap-4">
                  <BrandLogo tone="navy" className="h-[12px] w-auto shrink-0" />
                  <span className="hidden text-[0.8125rem] text-[var(--ink-3)] sm:inline">Portal · {M.name}</span>
                </div>
                <Illustrative>Illustrative preview</Illustrative>
              </div>

              <div className="grid md:grid-cols-[260px_1fr]">
                <div role="tablist" aria-label="Genius Portal modules" aria-orientation="vertical" onKeyDown={onKey} className="flex gap-1 overflow-x-auto border-[var(--rule)] p-3 [scrollbar-width:none] max-md:border-b md:flex-col md:border-r">
                  {MODULES.map(({ Icon, name }, i) => {
                    const on = i === active;
                    return (
                      <button
                        key={name}
                        ref={(el) => {
                          tabs.current[i] = el;
                        }}
                        type="button"
                        role="tab"
                        id={`v22-mod-${i}`}
                        aria-selected={on}
                        aria-controls="v22-mod-panel"
                        tabIndex={on ? 0 : -1}
                        onClick={() => setActive(i)}
                        className={`ch flex shrink-0 items-center gap-3 whitespace-nowrap px-3.5 py-2.5 text-left text-[0.875rem] font-medium transition-colors duration-200 [--c:8px] ${
                          on ? "bg-[var(--navy)] text-white" : "text-[var(--ink-2)] hover:bg-[var(--paper)] hover:text-[var(--navy)]"
                        }`}
                      >
                        <Icon size={17} aria-hidden="true" className={on ? "text-[var(--signal-lt)]" : ""} />
                        {name}
                      </button>
                    );
                  })}
                </div>

                <div id="v22-mod-panel" role="tabpanel" aria-labelledby={`v22-mod-${active}`} className="min-h-[22rem] p-5 pb-12 sm:p-8 sm:pb-12">
                  <div key={active} className="v22-swap">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h3 className="v22-display text-[1.6rem]">{M.name}</h3>
                      <span className="v22-mono text-[0.75rem] text-[var(--ink-3)]">0{active + 1} / 06</span>
                    </div>
                    <p className="mt-2 max-w-[48ch] text-[0.9375rem] text-[var(--ink-2)]">{M.body}</p>
                    <div className="mt-6">{M.view}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Building on the software the client already runs. */}
        <div className="mt-16 grid gap-8 lg:mt-20 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <p className="v22-label text-[var(--signal-ink)]">Integrations</p>
            <p className="v22-display mt-4 max-w-[20ch] text-[clamp(1.5rem,2.4vw,2rem)]">Keep the technology that already runs the business.</p>
          </div>
          <div data-v22r="up" className="lg:col-span-8">
            <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-[repeat(6,1fr)_auto] lg:items-center">
              <span className="v22-rail absolute left-0 right-[4.5rem] top-1/2 hidden h-px bg-[var(--signal)] lg:block" aria-hidden="true" />
              <ul className="contents" aria-label="ERP, CRM, data warehouse, BI tools, spreadsheets and cloud apps all connect into Genius Lab.">
                {SYSTEMS.map((s, i) => (
                  <li key={s} className="v22-seq ch relative flex items-center justify-between gap-2 bg-white px-3 py-3 text-[0.875rem] font-medium [--c:8px]" style={{ "--i": i } as CSSProperties}>
                    {s}
                    <span className="h-1.5 w-1.5 bg-[var(--trace)]" aria-hidden="true" />
                  </li>
                ))}
              </ul>
              <span className="v22-seq relative col-span-2 flex items-center justify-center sm:col-span-3 lg:col-span-1" style={{ "--i": 6 } as CSSProperties} aria-hidden="true">
                <svg width="64" height="72" viewBox="0 0 64 72">
                  <polygon points={hexPoints(32, 36, 31)} fill="#101440" />
                  <polygon points={hexPoints(32, 36, 12)} fill="#5577ff" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
