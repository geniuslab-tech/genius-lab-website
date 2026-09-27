import { ArrowUpRight, ChartLineUp, Graph, House, Robot, ShieldCheck, Sparkle, TreeStructure } from "@phosphor-icons/react/dist/ssr";

/** Illustrative figures only. */
const KPIS = [
  { k: "Revenue, YTD", v: "$48.2M", d: "+6.1%" },
  { k: "EBITDA margin", v: "17.4%", d: "+0.8 pt" },
  { k: "Cash, 90-day low", v: "$4.6M", d: "Week 7" },
  { k: "Open alerts", v: "3", d: "2 new" },
];

const NAV = [
  { Icon: House, label: "Overview", on: true },
  { Icon: Graph, label: "Second Brain" },
  { Icon: Robot, label: "Agents" },
  { Icon: TreeStructure, label: "Pipelines" },
  { Icon: ChartLineUp, label: "Analytics" },
  { Icon: ShieldCheck, label: "Governance" },
];

// A fixed, hand-shaped revenue line (12 months), so the markup is identical on server and client.
const SERIES = [42, 44, 43, 47, 49, 48, 53, 55, 54, 58, 61, 64];
const PLAN = [42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64];
const W = 560;
const Hh = 150;
const x = (i: number) => Math.round((i / (SERIES.length - 1)) * W * 10) / 10;
const y = (v: number) => Math.round((Hh - ((v - 38) / 30) * Hh) * 10) / 10;
const LINE = SERIES.map((v, i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join(" ");
const AREA = `${LINE} L${W} ${Hh} L0 ${Hh} Z`;
const PLAN_LINE = PLAN.map((v, i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join(" ");

/**
 * The Genius Portal, drawn as a window. Everything inside is an illustrative preview, not a
 * screenshot of a shipped product.
 */
export function PortalWindow() {
  return (
    <div className="v20-screen text-[#0c0e24]" role="img" aria-label="Illustrative preview of the Genius Portal: an executive overview with revenue, margin, cash and alerts, a revenue trend against plan, and an answer from the Genius agent.">
      {/* Title bar */}
      <div className="flex h-9 items-center gap-2 border-b border-[#e8e8ed] bg-[#f5f5f7] px-4 sm:h-11" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-[#d2d2d7]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#d2d2d7]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#d2d2d7]" />
        <span className="mx-auto rounded-md bg-white px-3 py-0.5 text-[0.6875rem] text-[#5f6277] shadow-[0_0_0_1px_#e8e8ed] sm:text-[0.75rem]">portal.geniuslab.tech</span>
        <span className="w-10" />
      </div>

      <div className="flex" aria-hidden="true">
        {/* Sidebar */}
        <aside className="hidden w-[184px] shrink-0 border-r border-[#ececf0] bg-[#fbfbfd] px-3 py-5 md:block">
          <p className="px-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#5f6277]">Genius Portal</p>
          <ul className="mt-3 space-y-0.5">
            {NAV.map(({ Icon, label, on }) => (
              <li key={label} className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[0.8125rem] ${on ? "bg-[#e9edff] font-semibold text-[#2548f0]" : "text-[#4a4d62]"}`}>
                <Icon size={15} weight={on ? "fill" : "regular"} />
                {label}
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-xl bg-white p-3 shadow-[0_0_0_1px_#ececf0]">
            <p className="text-[0.6875rem] font-semibold text-[#0c0e24]">Connected systems</p>
            <p className="mt-1 text-[0.6875rem] leading-snug text-[#5f6277]">ERP, CRM, Finance, Warehouse, Sheets</p>
            <p className="mt-2 flex items-center gap-1.5 text-[0.6875rem] font-medium text-[#1a7f4b]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1a9d5c]" /> All pipelines healthy
            </p>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1 p-4 sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.75rem] text-[#5f6277]">Executive overview · Group</p>
              <p className="mt-0.5 text-[1.0625rem] font-semibold tracking-[-0.02em] sm:text-[1.375rem]">Good morning. Here is the business today.</p>
            </div>
            <span className="hidden rounded-full bg-[#f5f5f7] px-3 py-1 text-[0.75rem] text-[#4a4d62] sm:inline">Q3 · All entities</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3 lg:grid-cols-4">
            {KPIS.map((k) => (
              <div key={k.k} className="rounded-2xl bg-[#f5f5f7] p-3 sm:p-4">
                <p className="text-[0.6875rem] text-[#5f6277] sm:text-[0.75rem]">{k.k}</p>
                <p className="mt-1 text-[1.125rem] font-semibold tracking-[-0.03em] tabular-nums sm:text-[1.5rem]">{k.v}</p>
                <p className="text-[0.6875rem] font-medium text-[#2548f0]">{k.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-3 sm:mt-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div className="rounded-2xl p-3 shadow-[0_0_0_1px_#ececf0] sm:p-4">
              <div className="flex items-center justify-between">
                <p className="text-[0.8125rem] font-semibold">Revenue vs plan</p>
                <p className="flex items-center gap-3 text-[0.6875rem] text-[#5f6277]">
                  <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded bg-[#2548f0]" />Actual</span>
                  <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded bg-[#b8bac6]" />Plan</span>
                </p>
              </div>
              <svg viewBox={`0 0 ${W} ${Hh}`} className="mt-3 h-auto w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="v20-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#2548f0" stopOpacity="0.16" />
                    <stop offset="1" stopColor="#2548f0" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0.25, 0.5, 0.75].map((f) => (
                  <line key={f} x1="0" x2={W} y1={Hh * f} y2={Hh * f} stroke="#ececf0" />
                ))}
                <path d={AREA} fill="url(#v20-area)" />
                <path d={PLAN_LINE} fill="none" stroke="#b8bac6" strokeWidth="1.5" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" />
                <path d={LINE} fill="none" stroke="#2548f0" strokeWidth="2.25" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                <circle cx={x(11)} cy={y(64)} r="4" fill="#2548f0" />
              </svg>
            </div>

            <div className="hidden flex-col rounded-2xl bg-[#0c0e24] p-4 text-white sm:flex">
              <p className="flex items-center gap-2 text-[0.75rem] font-semibold">
                <Sparkle size={14} weight="fill" className="text-[#8fa6ff]" /> Ask Genius
              </p>
              <p className="mt-3 text-[0.8125rem] leading-snug text-white/70">Why did EBITDA margin dip in July?</p>
              <p className="mt-3 text-[0.8125rem] leading-[1.5]">
                Freight rose after the carrier change. Renegotiating it recovers about 1.8 points next quarter.
              </p>
              <p className="mt-auto flex items-center gap-1 pt-3 text-[0.6875rem] text-[#8fa6ff]">
                Read finance.gl_entries, ops.shipments <ArrowUpRight size={11} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
