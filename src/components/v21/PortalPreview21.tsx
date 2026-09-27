import { ChartBar, Gauge, Graph, House, MagnifyingGlass, Plugs, Robot, TreeStructure } from "@phosphor-icons/react/dist/ssr";
import { AnswerCard, ChartLegend, ForecastChart, KPIS, KpiTile, TaskList } from "./Minis21";

const NAV = [
  { Icon: House, name: "Overview", on: true },
  { Icon: Plugs, name: "Connections" },
  { Icon: TreeStructure, name: "Pipelines" },
  { Icon: Gauge, name: "Metrics" },
  { Icon: ChartBar, name: "Dashboards" },
  { Icon: Graph, name: "Second Brain" },
  { Icon: Robot, name: "Agents" },
];

/** A light-mode Genius Portal preview in a warm frame. Illustrative, with sample data. */
export function PortalPreview21() {
  return (
    <div className="v21-frame">
      <div className="v21-screen" role="img" aria-label="Illustrative preview of the Genius Portal: group overview with KPIs, a revenue forecast, a Second Brain answer and a list of agent tasks. Sample data.">
        {/* Top bar */}
        <div className="flex items-center gap-3 border-b border-[#efe9e0] px-4 py-2.5 sm:px-5" aria-hidden="true">
          <span className="flex items-center gap-2">
            <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" aria-hidden="true">
              <path d="M10 1.5 17.4 5.75v8.5L10 18.5 2.6 14.25v-8.5Z" fill="none" stroke="#101440" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M10 6.2 13.3 8.1v3.8L10 13.8 6.7 11.9V8.1Z" fill="#2f55d4" />
            </svg>
            <span className="text-[0.8125rem] font-semibold text-[var(--ink)]">Genius Portal</span>
          </span>
          <span className="hidden text-[0.8125rem] text-[#b3aa9b] sm:inline">/</span>
          <span className="hidden text-[0.8125rem] text-[var(--ink-3)] sm:inline">Group overview</span>
          <span className="ml-auto flex h-8 min-w-0 items-center gap-2 rounded-[9px] bg-[#f5f2ec] px-2.5 text-[0.75rem] text-[var(--ink-3)] sm:w-[260px]">
            <MagnifyingGlass size={13} className="shrink-0" />
            <span className="hidden truncate sm:inline">Ask the Second Brain anything</span>
            <span className="v21-mono ml-auto hidden rounded-[5px] bg-white px-1.5 text-[0.625rem] shadow-[0_0_0_1px_#e6e0d6] sm:inline">⌘K</span>
          </span>
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--terra-tint)] text-[0.625rem] font-bold text-[var(--terra-ink)]">CF</span>
        </div>

        <div className="flex" aria-hidden="true">
          {/* Sidebar */}
          <div className="hidden w-[176px] shrink-0 flex-col gap-0.5 border-r border-[#efe9e0] bg-[#fbfaf7] p-3 md:flex">
            {NAV.map(({ Icon, name, on }) => (
              <span
                key={name}
                className={`flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-[0.78rem] ${on ? "bg-white font-semibold text-[var(--ink)] shadow-[0_0_0_1px_#ebe5dc,0_1px_2px_rgb(60_44_20/0.05)]" : "text-[var(--ink-3)]"}`}
              >
                <Icon size={15} weight={on ? "fill" : "regular"} className={on ? "text-[var(--blue)]" : ""} />
                {name}
              </span>
            ))}
            <div className="mt-auto rounded-[11px] border border-[#ece7df] bg-white p-3">
              <p className="text-[0.6875rem] font-semibold text-[var(--ink)]">Connected systems</p>
              <p className="v21-mono mt-1 text-[0.6875rem] text-[var(--ink-3)]">6 live · 1 syncing</p>
              <div className="mt-2 flex gap-1">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <span key={i} className={`h-1.5 flex-1 rounded-full ${i === 6 ? "bg-[var(--blue)]/35" : "bg-[var(--ok)]/70"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="min-w-0 flex-1 bg-[#fdfcfa] p-3.5 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--ink)]">Group overview</p>
              <span className="flex gap-1.5">
                <span className="v21-chip v21-chip-muted">Q3 2026</span>
                <span className="v21-chip v21-chip-muted hidden sm:inline-flex">All entities</span>
              </span>
            </div>

            <div className="mt-3.5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {KPIS.map((k, i) => (
                <KpiTile key={k.label} k={k} delay={500 + i * 90} className={i > 1 ? "max-sm:hidden" : ""} />
              ))}
            </div>

            <div className="mt-2.5 grid gap-2.5 lg:grid-cols-[1.55fr_1fr]">
              <div className="rounded-[14px] border border-[#ece7df] bg-white p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[0.75rem] font-semibold text-[var(--ink)]">Revenue, actual and forecast</p>
                  <ChartLegend />
                </div>
                <ForecastChart className="mt-2" delay={700} />
              </div>
              <div className="grid gap-2.5">
                <AnswerCard compact />
                <TaskList limit={3} className="max-lg:hidden" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
