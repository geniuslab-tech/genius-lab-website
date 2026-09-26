import {
  ChartLineUp,
  CalendarBlank,
  Database,
  FlowArrow,
  House,
  Lightning,
  Plugs,
  Robot,
  ShieldCheck,
  SquaresFour,
} from "@phosphor-icons/react/dist/ssr";
import { BrandLogo, h2Class } from "./ui";

/** What the Genius Portal gives every client. */
const MODULES = [
  { Icon: Plugs, name: "Connectors", body: "Ready integrations for ERP, CRM, finance, files and APIs." },
  { Icon: FlowArrow, name: "Data Transformation", body: "Pipelines that clean, model and unify data, tested like software." },
  { Icon: ChartLineUp, name: "Analytics", body: "Dashboards, drill-downs and forecasts on one shared model." },
  { Icon: ShieldCheck, name: "Governance", body: "Definitions, lineage, access and audit trails in one place." },
  { Icon: Lightning, name: "Automation", body: "Alerts, workflows and scheduled actions across your systems." },
  { Icon: Robot, name: "AI Agents", body: "Agents that read the Second Brain and answer or act." },
];

const SYSTEMS = ["ERP", "CRM", "Warehouse", "BI tools", "Sheets", "Cloud apps"];

/* ---- Illustrative dashboard data ---- */
const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const REV = [3.4, 3.6, 3.9, 3.5, 3.7, 3.95, 4.1, 4.0, 4.3, 4.45, 4.4, 4.7];
const PLAN = [3.5, 3.6, 3.7, 3.75, 3.85, 3.95, 4.05, 4.1, 4.2, 4.3, 4.35, 4.45];
const REGIONS = [
  { name: "North", v: 0.86, label: "$14.1M" },
  { name: "South", v: 0.72, label: "$11.8M" },
  { name: "West", v: 0.61, label: "$9.9M" },
  { name: "East", v: 0.44, label: "$7.2M" },
];
const KPIS = [
  { k: "Revenue", v: "$48.2M", d: "+6.8%", up: true, s: [3, 4, 3.6, 4.4, 4.2, 5, 5.4] },
  { k: "Gross margin", v: "38.4%", d: "+1.2 pts", up: true, s: [4, 3.8, 4.1, 4.3, 4.2, 4.6, 4.8] },
  { k: "EBITDA", v: "15.9%", d: "-2.3 pts", up: false, s: [5, 4.8, 4.9, 4.4, 4.2, 4, 3.8] },
  { k: "Cash cycle", v: "41 days", d: "-3 days", up: true, s: [5, 4.8, 4.6, 4.6, 4.3, 4.1, 3.9] },
];
const UNITS = [
  { n: "Industrial", r: "$18.4M", m: "41.2%", t: "+8%" },
  { n: "Consumer", r: "$13.1M", m: "36.0%", t: "+5%" },
  { n: "Services", r: "$10.6M", m: "44.8%", t: "+11%" },
  { n: "Digital", r: "$6.1M", m: "29.5%", t: "-2%" },
];

const spark = (s: number[], w: number, h: number) => {
  const min = Math.min(...s);
  const max = Math.max(...s);
  return s
    .map((v, i) => `${i ? "L" : "M"}${((i / (s.length - 1)) * w).toFixed(1)},${(h - ((v - min) / (max - min || 1)) * h).toFixed(1)}`)
    .join("");
};

export function Dashboard({ captionClassName = "text-navy/55" }: { captionClassName?: string }) {
  const W = 560;
  const H = 190;
  const P = 26;
  const X = (i: number) => P + (i / (MONTHS.length - 1)) * (W - P * 2);
  const Y = (v: number) => H - 22 - ((v - 3.2) / (4.9 - 3.2)) * (H - 44);
  const line = REV.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join("");
  const area = `${line}L${X(MONTHS.length - 1)},${H - 22}L${X(0)},${H - 22}Z`;
  const plan = PLAN.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join("");
  const last = MONTHS.length - 1;

  return (
    <figure className="relative">
      <div className="overflow-hidden bg-navy-950 text-white shadow-[0_50px_100px_-45px_rgb(16_20_64/0.7)] ring-1 ring-navy/20 [clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,0_100%)]">
        {/* App chrome. */}
        <div className="flex h-12 items-center justify-between gap-4 border-b border-white/10 px-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-5">
            <span className="flex shrink-0 items-center gap-2.5">
              <BrandLogo tone="white" className="h-[10px] w-auto" />
              <span className="text-[0.75rem] text-white/50">Portal</span>
            </span>
            <span className="hidden items-center gap-1 text-[0.75rem] sm:flex" aria-hidden="true">
              {["Overview", "Finance", "Operations", "Sales"].map((t, i) => (
                <span key={t} className={`px-2.5 py-1 ${i === 0 ? "bg-white/10 text-white" : "text-white/45"}`}>
                  {t}
                </span>
              ))}
            </span>
          </div>
          <span className="type-mono flex shrink-0 items-center gap-1.5 text-[0.75rem] text-white/55">
            <CalendarBlank size={12} aria-hidden="true" /> Last 12 months
          </span>
        </div>

        <div className="grid grid-cols-[2.75rem_1fr]">
          <div className="flex flex-col items-center gap-5 border-r border-white/10 py-4 text-white/40" aria-hidden="true">
            <House size={16} className="text-white" />
            <SquaresFour size={16} />
            <ChartLineUp size={16} />
            <Database size={16} />
            <Robot size={16} />
          </div>

          <div className="min-w-0 space-y-3 p-3 sm:p-4">
            {/* KPI row. */}
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {KPIS.map((k) => (
                <div key={k.k} className="bg-white/[0.04] p-3 ring-1 ring-inset ring-white/8">
                  <div className="text-[0.75rem] text-white/50">{k.k}</div>
                  <div className="mt-1 flex items-end justify-between gap-2">
                    <span className="type-mono text-[1.0625rem] leading-none">{k.v}</span>
                    <svg viewBox="0 0 48 16" className="h-4 w-12 overflow-visible" aria-hidden="true">
                      <path d={spark(k.s, 48, 16)} fill="none" stroke={k.up ? "#5577ff" : "#ff8f8f"} strokeWidth="1.5" />
                    </svg>
                  </div>
                  <div className={`type-mono mt-1.5 text-[0.75rem] ${k.up ? "text-[#8fb0ff]" : "text-[#ff9c9c]"}`}>{k.d}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.7fr_1fr]">
              {/* Revenue vs plan. */}
              <div className="bg-white/[0.04] p-3 ring-1 ring-inset ring-white/8">
                <div className="flex items-center justify-between text-[0.75rem]">
                  <span className="text-white/70">Revenue vs plan</span>
                  <span className="flex items-center gap-3 text-white/45">
                    <span className="flex items-center gap-1.5">
                      <span className="h-0.5 w-3 bg-signal" />
                      Actual
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 border-t border-dashed border-white/60" />
                      Plan
                    </span>
                  </span>
                </div>
                <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 h-auto w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="rev-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#5577ff" stopOpacity="0.45" />
                      <stop offset="1" stopColor="#5577ff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 1, 2, 3].map((g) => (
                    <line key={g} x1={P} x2={W - P} y1={22 + g * ((H - 44) / 3)} y2={22 + g * ((H - 44) / 3)} stroke="white" strokeOpacity="0.07" />
                  ))}
                  <path d={area} fill="url(#rev-area)" />
                  <path d={plan} fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="1.2" strokeDasharray="4 4" />
                  <path d={line} fill="none" stroke="#5577ff" strokeWidth="2.2" />
                  {MONTHS.map((m, i) => (
                    <text key={m} x={X(i)} y={H - 4} textAnchor="middle" className="fill-white/40 text-[12px]">
                      {m}
                    </text>
                  ))}
                  <line x1={X(last)} x2={X(last)} y1={Y(REV[last])} y2={H - 22} stroke="white" strokeOpacity="0.3" strokeDasharray="2 3" />
                  <circle cx={X(last)} cy={Y(REV[last])} r="4.5" fill="#0b0e32" stroke="#5577ff" strokeWidth="2" />
                  <g transform={`translate(${X(last) - 116} ${Y(REV[last]) - 46})`}>
                    <rect width="104" height="34" fill="white" />
                    <text x="8" y="12" className="fill-navy/60 text-[10px]">
                      September
                    </text>
                    <text x="8" y="28" className="fill-navy text-[12px] font-semibold">
                      $4.70M, +5.6%
                    </text>
                  </g>
                </svg>
              </div>

              <div className="grid gap-3">
                {/* Regions. */}
                <div className="bg-white/[0.04] p-3 ring-1 ring-inset ring-white/8">
                  <div className="text-[0.75rem] text-white/70">Revenue by region</div>
                  <ul className="mt-2.5 space-y-2">
                    {REGIONS.map((r, i) => (
                      <li key={r.name} className="grid grid-cols-[3.2rem_1fr_3.2rem] items-center gap-2 text-[0.75rem]">
                        <span className="text-white/55">{r.name}</span>
                        <span className="h-1.5 bg-white/8">
                          <span className="block h-full" style={{ width: `${r.v * 100}%`, background: i === 0 ? "#5577ff" : "rgb(255 255 255 / 0.55)" }} />
                        </span>
                        <span className="type-mono text-right text-white/80">{r.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Channel mix. */}
                <div className="flex items-center gap-4 bg-white/[0.04] p-3 ring-1 ring-inset ring-white/8">
                  <svg viewBox="0 0 42 42" className="h-14 w-14 shrink-0 -rotate-90" aria-hidden="true">
                    <circle cx="21" cy="21" r="15.9" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="6" />
                    <circle cx="21" cy="21" r="15.9" fill="none" stroke="#5577ff" strokeWidth="6" strokeDasharray="54 100" pathLength={100} />
                    <circle cx="21" cy="21" r="15.9" fill="none" stroke="#9fb4ff" strokeWidth="6" strokeDasharray="28 100" strokeDashoffset="-54" pathLength={100} />
                    <circle cx="21" cy="21" r="15.9" fill="none" stroke="rgb(255 255 255 / 0.55)" strokeWidth="6" strokeDasharray="18 100" strokeDashoffset="-82" pathLength={100} />
                  </svg>
                  <ul className="space-y-1 text-[0.75rem] text-white/60">
                    <li>
                      <span className="mr-2 inline-block h-2 w-2 bg-signal" />
                      Direct 54%
                    </li>
                    <li>
                      <span className="mr-2 inline-block h-2 w-2 bg-[#9fb4ff]" />
                      Partners 28%
                    </li>
                    <li>
                      <span className="mr-2 inline-block h-2 w-2 bg-white/55" />
                      Online 18%
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Business units. */}
            <div className="bg-white/[0.04] ring-1 ring-inset ring-white/8">
              <div className="grid grid-cols-[1.4fr_1fr_1fr_0.7fr] gap-2 border-b border-white/8 px-3 py-2 text-[0.75rem] text-white/45">
                <span>Business unit</span>
                <span className="text-right">Revenue</span>
                <span className="text-right">Margin</span>
                <span className="text-right">YoY</span>
              </div>
              {UNITS.map((u) => (
                <div key={u.n} className="grid grid-cols-[1.4fr_1fr_1fr_0.7fr] gap-2 px-3 py-2 text-[0.75rem] [&:not(:last-child)]:border-b [&:not(:last-child)]:border-white/5">
                  <span className="text-white/85">{u.n}</span>
                  <span className="type-mono text-right text-white/75">{u.r}</span>
                  <span className="type-mono text-right text-white/75">{u.m}</span>
                  <span className={`type-mono text-right ${u.t.startsWith("-") ? "text-[#ff9c9c]" : "text-[#8fb0ff]"}`}>{u.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <figcaption className={`mt-4 text-[0.8125rem] ${captionClassName}`}>Genius Portal executive dashboard. Illustrative data; placeholder for product screens.</figcaption>
    </figure>
  );
}

export function PortalV2() {
  return (
    <section id="portal" className="relative scroll-mt-16 py-24 text-navy sm:py-32 lg:py-40" aria-labelledby="v2-portal-title">
      <div className="shell">
        <h2 id="v2-portal-title" data-reveal="up" className={`${h2Class} max-w-[16ch]`}>
          Expertise and technology, working as one.
        </h2>
        <p data-reveal="up" data-delay="100" className="mt-8 max-w-[60ch] text-lg leading-relaxed text-navy/70">
          Our specialists build on the Genius Portal, our own platform. Everything a client needs to connect, govern and
          run intelligence lives in one place.
        </p>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          <ol className="grid content-start gap-x-8 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1" aria-label="Inside the Genius Portal">
            {MODULES.map(({ Icon, name, body }, i) => (
              <li key={name} className="group flex gap-4 border-b border-navy/10 py-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center bg-navy text-white transition-colors duration-300 group-hover:bg-signal-ink [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,0_100%)]">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span>
                  <span className="flex items-baseline gap-2.5">
                    <span className="type-mono text-[0.75rem] text-navy/40">0{i + 1}</span>
                    <span className="type-wide text-[1.0625rem] font-medium">{name}</span>
                  </span>
                  <span className="mt-1 block text-[0.9375rem] leading-relaxed text-navy/65">{body}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="lg:col-span-8">
            <Dashboard />
          </div>
        </div>

        {/* Building on the software the client already runs. */}
        <div className="mt-20 border-t border-navy/12 pt-12 lg:mt-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <p className="type-wide text-2xl font-medium leading-snug lg:col-span-4">Keep the technology that already runs the business.</p>
            <div className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] lg:col-span-8 lg:mx-0 lg:overflow-visible lg:px-0">
              <svg viewBox="0 0 820 130" className="h-auto w-[720px] max-w-none lg:w-full" role="img" aria-label="ERP, CRM, data warehouse, BI tools, spreadsheets and cloud apps all connect into Genius Lab.">
                {SYSTEMS.map((s, i) => {
                  const x = 40 + i * 112;
                  return (
                    <g key={s}>
                      <path d={`M${x + 28},64 C${x + 28},104 ${(x + 28 + 768) / 2},${96 + i * 2} 740,62`} fill="none" stroke="var(--color-navy)" strokeOpacity="0.22" />
                      <circle cx={x + 28} cy={50} r={14} fill="var(--color-paper)" stroke="var(--color-navy)" strokeOpacity="0.45" />
                      <circle cx={x + 28} cy={50} r={4} fill="var(--color-navy)" />
                      <text x={x + 28} y={22} textAnchor="middle" className="type-mono fill-navy/70 text-[12px]">
                        {s}
                      </text>
                    </g>
                  );
                })}
                <circle cx={768} cy={62} r={34} fill="var(--color-navy)" />
                <circle cx={768} cy={62} r={22} fill="none" stroke="white" strokeOpacity="0.5" strokeDasharray="2 4" />
                <circle cx={768} cy={62} r={7} fill="var(--color-signal)" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
