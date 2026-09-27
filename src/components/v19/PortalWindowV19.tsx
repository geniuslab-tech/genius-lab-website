import {
  ChartLineUp,
  FlowArrow,
  Lightning,
  MagnifyingGlass,
  Plugs,
  Robot,
  ShieldCheck,
  SquaresFour,
} from "@phosphor-icons/react/dist/ssr";
import { BrandLogo } from "@/components/v2/ui";
import { HexMark } from "./ui";

/** Every value on this window is an illustrative preview. */
const NAV = [
  { Icon: SquaresFour, name: "Overview" },
  { Icon: Plugs, name: "Connectors" },
  { Icon: FlowArrow, name: "Pipelines" },
  { Icon: ChartLineUp, name: "Analytics" },
  { Icon: ShieldCheck, name: "Governance" },
  { Icon: Lightning, name: "Automation" },
  { Icon: Robot, name: "Agents" },
];

const KPIS = [
  { k: "Revenue", v: "$48.2M", d: "+6.1%", warm: false },
  { k: "Gross margin", v: "41.7%", d: "+0.8 pt", warm: false },
  { k: "Cash", v: "$9.4M", d: "+$0.6M", warm: false },
  { k: "EBITDA margin", v: "15.9%", d: "−2.3 pt", warm: true },
];

const SOURCES = [
  { name: "ERP", table: "erp.orders", t: "12s" },
  { name: "CRM", table: "crm.accounts", t: "40s" },
  { name: "Ledger", table: "finance.gl_entries", t: "1m" },
  { name: "Warehouse", table: "ops.events", t: "8s" },
];

const ACTUAL = [31, 33, 32, 36, 35, 39, 41, 40, 44, 47];
const FORECAST = [47, 49, 52];
const PLAN = [30, 32, 34, 35, 37, 38, 40, 42, 43, 45, 47, 49];

const W = 560;
const H = 180;
const X = (i: number) => Math.round((i / 11) * W * 10) / 10;
const Y = (v: number) => Math.round((H - ((v - 24) / 32) * H) * 10) / 10;
const line = (s: number[], from = 0) => s.map((v, i) => `${i ? "L" : "M"}${X(i + from)} ${Y(v)}`).join(" ");
const ACTUAL_D = line(ACTUAL);
const AREA_D = `${ACTUAL_D} L${X(ACTUAL.length - 1)} ${H} L0 ${H} Z`;
const FORECAST_D = line(FORECAST, ACTUAL.length - 1);
const PLAN_D = line(PLAN);

/**
 * An illustrative Genius Portal screen built as depth layers: the frame sits at z=0,
 * panels rise off it, and the agent's answer floats highest. Parents keep preserve-3d.
 */
export function PortalWindowV19() {
  return (
    <div className="v19-z relative rounded-[18px]">
      <div className="absolute inset-0 overflow-hidden rounded-[18px] border border-[color:var(--line-2)] bg-[linear-gradient(180deg,#0b0f24,#070918)] shadow-[0_100px_140px_-60px_rgb(0_0_0/0.95),0_0_0_1px_rgb(var(--acc-rgb)/0.05)]">
        <div className="v19-hlight" />
      </div>
      <div className="v19-hrim" aria-hidden="true" />

      {/* Chrome. */}
      <div className="relative flex h-12 items-center justify-between gap-4 border-b border-[color:var(--line)] px-5">
        <div className="flex items-center gap-4">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
          </span>
          <BrandLogo tone="white" className="h-[10px] w-auto opacity-85" />
          <span className="text-[0.8125rem] text-[color:var(--tx-3)]">
            Portal <span className="px-1.5 text-white/20">/</span> <span className="text-[color:var(--tx-2)]">Executive overview</span>
          </span>
        </div>
        <div className="flex h-8 w-[300px] items-center gap-2.5 rounded-full border border-[color:var(--line)] bg-white/[0.02] px-3.5 text-[0.8125rem] text-[color:var(--tx-3)]">
          <MagnifyingGlass size={13} />
          Ask the Second Brain
          <span className="v19-mono ml-auto rounded-[4px] border border-[color:var(--line)] px-1.5 text-[0.6875rem]">⌘K</span>
        </div>
        <span className="v19-label rounded-full border border-[rgb(var(--warm-rgb)/0.4)] px-2.5 py-1 text-[0.625rem] text-[color:var(--warm)]">Illustrative preview</span>
      </div>

      <div className="v19-z relative grid grid-cols-[200px_1fr] gap-0">
        {/* Sidebar. */}
        <div className="v19-z1 border-r border-[color:var(--line)] p-3">
          <ul className="space-y-0.5">
            {NAV.map(({ Icon, name }, i) => (
              <li
                key={name}
                className={`flex items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-[0.8125rem] ${
                  i === 0 ? "bg-[rgb(var(--acc-rgb)/0.12)] text-white shadow-[inset_0_0_0_1px_rgb(var(--acc-rgb)/0.25)]" : "text-[color:var(--tx-3)]"
                }`}
              >
                <Icon size={15} />
                {name}
              </li>
            ))}
          </ul>
          <p className="v19-label mt-6 px-2.5 text-[0.5625rem] text-[color:var(--tx-3)]">Workspaces</p>
          <ul className="mt-2 space-y-0.5 text-[0.8125rem] text-[color:var(--tx-3)]">
            {["Finance", "Operations", "Portfolio"].map((w, i) => (
              <li key={w} className="flex items-center gap-2.5 px-2.5 py-1.5">
                <span className={`h-2 w-2 rounded-[2px] ${i === 0 ? "bg-[color:var(--acc)]" : "bg-white/15"}`} />
                {w}
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-[10px] border border-[color:var(--line)] p-3">
            <p className="flex items-center gap-2 text-[0.75rem] text-[color:var(--tx-2)]">
              <span className="v19-dot v19-dot-ok" /> 46 systems in sync
            </p>
            <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full w-[92%] rounded-full bg-[color:var(--acc)]" />
            </div>
          </div>
        </div>

        {/* Main. */}
        <div className="v19-z p-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="v19-label text-[0.5625rem] text-[color:var(--tx-3)]">Q3 · Group, all entities</p>
              <p className="v19-h3 mt-1 text-[1.25rem]">Good morning. Four numbers moved overnight.</p>
            </div>
            <div className="flex gap-1.5 text-[0.75rem] text-[color:var(--tx-3)]">
              {["7D", "QTD", "YTD"].map((r, i) => (
                <span key={r} className={`rounded-[6px] px-2 py-1 ${i === 1 ? "bg-white/[0.06] text-white" : ""}`}>
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div className="v19-z1 mt-4 grid grid-cols-4 gap-2.5">
            {KPIS.map((k) => (
              <div
                key={k.k}
                className={`rounded-[10px] border p-3 ${
                  k.warm ? "border-[rgb(var(--warm-rgb)/0.35)] bg-[rgb(var(--warm-rgb)/0.05)]" : "border-[color:var(--line)] bg-[color:var(--g3)]"
                }`}
              >
                <p className="text-[0.6875rem] text-[color:var(--tx-3)]">{k.k}</p>
                <p className="v19-h3 mt-1 text-[1.375rem] tabular-nums">{k.v}</p>
                <p className={`v19-mono text-[0.6875rem] ${k.warm ? "text-[color:var(--warm)]" : "text-[color:var(--acc-2)]"}`}>{k.d}</p>
              </div>
            ))}
          </div>

          <div className="v19-z mt-2.5 grid grid-cols-[1fr_236px] gap-2.5">
            <div className="v19-z2 rounded-[12px] border border-[color:var(--line-2)] bg-[linear-gradient(180deg,#10163a,#0b0f26)] p-4 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)]">
              <div className="flex items-center justify-between">
                <p className="text-[0.8125rem] font-medium">Revenue vs plan</p>
                <div className="flex items-center gap-4 text-[0.6875rem] text-[color:var(--tx-3)]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-0.5 w-3 bg-[color:var(--acc)]" />
                    Actual
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-0.5 w-3 bg-white/30" />
                    Plan
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-0 w-3 border-t border-dashed border-[color:var(--acc-2)]" />
                    Forecast
                  </span>
                </div>
              </div>
              <svg viewBox={`0 -6 ${W} ${H + 12}`} className="mt-3 h-[190px] w-full overflow-visible">
                <defs>
                  <linearGradient id="v19-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#5b8cff" stopOpacity="0.35" />
                    <stop offset="1" stopColor="#5b8cff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3].map((g) => (
                  <line key={g} x1="0" x2={W} y1={(g * H) / 3} y2={(g * H) / 3} stroke="rgb(150 170 255 / 0.08)" />
                ))}
                <path d={AREA_D} fill="url(#v19-area)" />
                <path d={PLAN_D} fill="none" stroke="rgb(255 255 255 / 0.28)" strokeWidth="1.5" />
                <path d={ACTUAL_D} fill="none" stroke="#5b8cff" strokeWidth="2.25" strokeLinejoin="round" />
                <path d={FORECAST_D} fill="none" stroke="#a9c3ff" strokeWidth="1.75" strokeDasharray="4 5" />
                <circle cx={X(ACTUAL.length - 1)} cy={Y(ACTUAL[ACTUAL.length - 1])} r="4.5" fill="#dbe6ff" />
                <circle cx={X(ACTUAL.length - 1)} cy={Y(ACTUAL[ACTUAL.length - 1])} r="11" fill="#5b8cff" fillOpacity="0.2" />
              </svg>
              <div className="v19-mono mt-2 flex justify-between text-[0.625rem] text-[color:var(--tx-3)]">
                {["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>

            <div className="v19-z1 rounded-[12px] border border-[color:var(--line)] bg-[color:var(--g3)] p-3.5">
              <div className="flex items-center justify-between">
                <p className="text-[0.8125rem] font-medium">Sources</p>
                <span className="v19-label text-[0.5625rem] text-[color:var(--acc-2)]">Live</span>
              </div>
              <ul className="mt-3 space-y-2">
                {SOURCES.map((s) => (
                  <li key={s.name} className="flex items-center gap-2.5 rounded-[8px] border border-[color:var(--line)] px-2.5 py-2">
                    <span className="v19-dot v19-dot-acc" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.75rem] text-white">{s.name}</span>
                      <span className="v19-mono block truncate text-[0.625rem] text-[color:var(--tx-3)]">{s.table}</span>
                    </span>
                    <span className="v19-mono text-[0.625rem] text-[color:var(--tx-3)]">{s.t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Floating layers, highest first. */}
      <div className="v19-z3 absolute -right-10 bottom-[-46px] w-[360px] rounded-[14px] border border-[rgb(var(--acc-rgb)/0.4)] bg-[linear-gradient(180deg,#131a44,#0c1030)] p-4 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.95),0_0_60px_-20px_rgb(var(--acc-rgb)/0.6)]">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-[0.8125rem] font-medium">
            <HexMark size={14} className="text-[color:var(--acc-2)]" /> Genius agent
          </p>
          <span className="v19-mono text-[0.625rem] text-[color:var(--tx-3)]">read 3 tables · 1.8s</span>
        </div>
        <p className="mt-2.5 text-[0.8125rem] leading-[1.55] text-[color:var(--tx-2)]">
          EBITDA margin fell 2.3 pts. Freight rose 14% after the July carrier change, and Northeast discounting added $1.1M.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["finance.gl_entries", "erp.orders", "crm.deals"].map((c) => (
            <span key={c} className="v19-mono rounded-[4px] bg-white/[0.05] px-1.5 py-0.5 text-[0.625rem] text-[color:var(--tx-3)]">
              {c}
            </span>
          ))}
        </div>
      </div>
      <div className="v19-z4 absolute -right-4 bottom-[-78px] flex items-center gap-2.5 rounded-full border border-[rgb(var(--warm-rgb)/0.55)] bg-[#1b1509] py-1.5 pl-2 pr-3.5 text-[0.75rem] text-[#ffe2bd] shadow-[0_0_40px_-8px_rgb(var(--warm-rgb)/0.7),0_20px_40px_-20px_rgb(0_0_0/0.9)]">
        <span className="v19-dot v19-dot-warm" />
        Decision ready: renegotiate freight, recover ~1.8 pts
      </div>
      <div className="v19-z3 absolute -left-8 bottom-[70px] rounded-[12px] border border-[color:var(--line-2)] bg-[#0d1130] px-3.5 py-3 shadow-[0_30px_60px_-24px_rgb(0_0_0/0.95)]">
        <p className="v19-label text-[0.5625rem] text-[color:var(--tx-3)]">Lineage</p>
        <p className="v19-mono mt-1.5 flex items-center gap-2 text-[0.6875rem] text-[color:var(--tx-2)]">
          <span className="text-[color:var(--acc-2)]">metrics.revenue</span>
          <span className="text-white/25">←</span>
          finance.gl_entries
          <span className="text-white/25">←</span>
          erp.orders
        </p>
      </div>
    </div>
  );
}
