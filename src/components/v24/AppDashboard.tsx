"use client";

import { CountUp, useInView } from "./motion";
const brandLogo = "/brand/genius-lab-logo-white.svg";

const nav = [
  { label: "Executive Briefing", active: true },
  { label: "Performance" },
  { label: "Revenue" },
  { label: "Margin & Cost" },
  { label: "Cash & Working Capital" },
  { label: "Entities" },
  { label: "Decisions", badge: "3" },
  { label: "Automations", badge: "6" },
  { label: "Agents", badge: "4" },
  { label: "Board Reports" },
];


/** deterministic pseudo-random series so SSR and client match */
function series(n: number, seed: number, base: number, amp: number) {
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < n; i++) {
    const wobble = Math.sin((i + seed) * 0.55) * amp * 0.16;
    const drift = Math.sin((i + seed) * 0.11) * amp + i * (amp * 0.035);
    v = base + drift + wobble;
    out.push(v);
  }
  return out;
}

/** round to 2 decimals so SSR and client render byte-identical path data */
const r2 = (n: number) => Math.round(n * 100) / 100;

function areaPath(values: number[], w: number, h: number, pad = 6) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => {
    const x = r2(i * step);
    const y = r2(pad + (1 - (v - min) / span) * (h - pad * 2));
    return [x, y] as const;
  });
  let d = `M ${pts[0]![0]} ${pts[0]![1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1]!;
    const [x, y] = pts[i]!;
    const cx = (px + x) / 2;
    d += ` C ${cx} ${py}, ${cx} ${y}, ${x} ${y}`;
  }
  return { line: d, area: `${d} L ${w} ${h} L 0 ${h} Z`, pts };
}

function Spark({ values, tone }: { values: number[]; tone: "data" | "gold" }) {
  const { line } = areaPath(values, 68, 22, 3);
  return (
    <svg viewBox="0 0 68 22" className="h-5 w-[68px]" aria-hidden="true">
      <path
        d={line}
        fill="none"
        stroke={tone === "data" ? "var(--data)" : "var(--gold)"}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

type Status = "ahead" | "track" | "attention";

const statusCopy: Record<Status, string> = {
  ahead: "Ahead of plan",
  track: "On track",
  attention: "Attention required",
};

function StatusPill({ status }: { status: Status }) {
  const tone =
    status === "attention"
      ? "border-gl-gold/40 bg-gl-gold/10 text-gl-gold"
      : status === "ahead"
        ? "border-gl-data/40 bg-gl-data/10 text-gl-data"
        : "border-gl-border/70 bg-gl-navy/50 text-gl-muted-foreground";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-1.5 py-[2px] text-[0.56rem] uppercase tracking-[0.1em] ${tone}`}
    >
      <span
        className={`h-1 w-1 animate-pulse rounded-full ${
          status === "attention" ? "bg-gl-gold" : status === "ahead" ? "bg-gl-data" : "bg-gl-muted-foreground/60"
        }`}
      />
      {statusCopy[status]}
    </span>
  );
}

const kpis = [
  {
    label: "Revenue",
    value: "$1.42B",
    num: 1.42,
    prefix: "$",
    suffix: "B",
    decimals: 2,
    delta: "+6.4% vs prior quarter",
    status: "ahead" as Status,
    tone: "data" as const,
    seed: 2,
  },
  {
    label: "EBITDA",
    value: "$284M",
    num: 284,
    prefix: "$",
    suffix: "M",
    decimals: 0,
    delta: "+1.2pp vs prior quarter",
    status: "ahead" as Status,
    tone: "data" as const,
    seed: 9,
  },
  {
    label: "Gross margin",
    value: "38.6%",
    num: 38.6,
    prefix: "",
    suffix: "%",
    decimals: 1,
    delta: "+0.8pp vs prior quarter",
    status: "track" as Status,
    tone: "data" as const,
    seed: 5,
  },
  {
    label: "Free cash flow",
    value: "$96.4M",
    num: 96.4,
    prefix: "$",
    suffix: "M",
    decimals: 1,
    delta: "−$4.2M vs prior quarter",
    status: "attention" as Status,
    tone: "gold" as const,
    seed: 14,
  },
];

const budgetDeltas: Record<(typeof kpis)[number]["label"], string> = {
  Revenue: "+6.4% vs budget",
  EBITDA: "+1.2pp vs budget",
  "Gross margin": "+0.8pp vs budget",
  "Free cash flow": "−$4.2M vs budget",
};

type Health = "healthy" | "attention" | "critical";

const healthTone: Record<Health, string> = {
  healthy: "bg-gl-data",
  attention: "bg-gl-gold",
  critical: "bg-destructive",
};

const rows: {
  name: string;
  revenue: string;
  vsPlan: string;
  margin: string;
  ebitda: string;
  health: Health;
  seed: number;
}[] = [
  { name: "Industrial — North", revenue: "$482.6M", vsPlan: "+8.1%", margin: "41.2%", ebitda: "$104M", health: "healthy", seed: 3 },
  { name: "Industrial — Southeast", revenue: "$311.4M", vsPlan: "−2.4%", margin: "33.8%", ebitda: "$58M", health: "attention", seed: 7 },
  { name: "Distribution — EMEA", revenue: "$268.9M", vsPlan: "+11.3%", margin: "36.1%", ebitda: "$61M", health: "healthy", seed: 11 },
  { name: "Retail — Direct", revenue: "$214.7M", vsPlan: "+4.7%", margin: "44.9%", ebitda: "$47M", health: "healthy", seed: 4 },
  { name: "Services — Global", revenue: "$142.1M", vsPlan: "+1.9%", margin: "39.4%", ebitda: "$14M", health: "attention", seed: 12 },
];

const actions = [
  {
    title: "Release $1.4M of Southeast inventory",
    impact: "Cash flow +$1.4M · closes the gap to plan",
    cta: "Approve",
  },
  {
    title: "Hold price floor on 1,284 SKUs",
    impact: "Margin +120bp · $8.6M annualised",
    cta: "Review",
  },
  {
    title: "Dual-source Tier-1 supplier — 3 plants",
    impact: "Protects $22.6M of at-risk revenue",
    cta: "Execute",
  },
];

/* dual-axis chart data — 12 half-month points across Jan–Jun */
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"];
const revenueGrowth = [96, 101, 99, 106, 112, 110, 117, 122, 120, 127.4, 133, 138];
const grossMargin = [36.4, 36.5, 36.3, 36.9, 37.2, 37.1, 37.6, 37.9, 37.8, 38.2, 38.4, 38.6];

const PLOT = { x0: 40, x1: 668, y0: 14, y1: 158 };
const LEFT_AXIS = { min: 84, max: 150, ticks: [150, 128, 106, 90] };
const RIGHT_AXIS = { min: 35.5, max: 39.5, ticks: [39.5, 38.5, 37.5, 36.5] };

function scaledPath(values: number[], min: number, max: number) {
  const span = max - min || 1;
  const step = (PLOT.x1 - PLOT.x0) / (values.length - 1);
  const pts = values.map((v, i) => {
    const x = r2(PLOT.x0 + i * step);
    const y = r2(PLOT.y1 - ((v - min) / span) * (PLOT.y1 - PLOT.y0));
    return [x, y] as const;
  });
  let d = `M ${pts[0]![0]} ${pts[0]![1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1]!;
    const [x, y] = pts[i]!;
    const cx = (px + x) / 2;
    d += ` C ${cx} ${py}, ${cx} ${y}, ${x} ${y}`;
  }
  return { line: d, area: `${d} L ${PLOT.x1} ${PLOT.y1} L ${PLOT.x0} ${PLOT.y1} Z`, pts };
}

function axisY(value: number, axis: { min: number; max: number }) {
  return PLOT.y1 - ((value - axis.min) / (axis.max - axis.min)) * (PLOT.y1 - PLOT.y0);
}

export function AppDashboard({
  fluid = false,
  animated = false,
  compact = false,
  budgetComparison = false,
}: {
  /** fluid: adapt internal layout to the container width (hero usage). */
  fluid?: boolean;
  /** animated: count-up KPIs, self-drawing chart and live packet. */
  animated?: boolean;
  /** compact: trimmed briefing + fewer table rows to reduce overall height. */
  compact?: boolean;
  /** budgetComparison: align headline performance language to budget. */
  budgetComparison?: boolean;
}) {
  const visibleRows = compact ? rows.slice(0, 4) : rows;
  const visibleActions = compact ? actions.slice(0, 2) : actions;
  const cardPad = compact ? "p-3.5" : "p-4";
  const rowY = compact ? "py-[7px]" : "py-[9px]";
  const rev = scaledPath(revenueGrowth, LEFT_AXIS.min, LEFT_AXIS.max);
  const gm = scaledPath(grossMargin, RIGHT_AXIS.min, RIGHT_AXIS.max);
  const hoverIdx = 9;
  const revPt = rev.pts[hoverIdx]!;
  const gmPt = gm.pts[hoverIdx]!;
  const { ref: chartRef, inView: chartInView } = useInView<HTMLDivElement>(0.3);
  const draw = animated && chartInView;



  return (
    <div className="glass-panel overflow-hidden rounded-[1.15rem] p-0 shadow-[var(--shadow-elevated)] backdrop-blur-xl">
      <div className={`flex ${compact ? "min-h-[500px]" : "min-h-[560px]"}`}>
        {/* sidebar */}
        <aside
          className={`${fluid ? "hidden xl:flex" : "hidden md:flex"} w-[208px] shrink-0 flex-col border-r border-gl-border/70 bg-gl-navy/70 p-4`}
        >
          <div className="mb-7 flex items-center gap-2.5 px-1.5 pt-1.5">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[7px] bg-gl-data/15 text-gl-data">
              <span className="h-1.5 w-1.5 rounded-full bg-gl-data" />
            </span>
            <img src={brandLogo} alt="Genius Lab" className="h-[0.72rem] w-auto" />
          </div>
          <nav className="flex flex-1 flex-col gap-0.5">
            {nav.map((n) => (
              <span
                key={n.label}
                className={`flex items-center justify-between rounded-md px-2.5 py-[7px] text-[0.72rem] ${
                  n.active
                    ? "bg-gl-data/12 text-gl-foreground ring-1 ring-inset ring-gl-data/25"
                    : "text-gl-muted-foreground/75"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`h-1 w-1 rounded-full ${n.active ? "bg-gl-data" : "bg-gl-muted-foreground/35"}`}
                  />
                  {n.label}
                </span>
                {n.badge ? (
                  <span className="rounded bg-gl-gold/15 px-1.5 text-[0.6rem] text-gl-gold">
                    {n.badge}
                  </span>
                ) : null}
              </span>
            ))}
          </nav>
          <div className="mt-6 rounded-lg border border-gl-border/70 bg-charcoal/50 p-2.5">
            <p className="text-[0.68rem] text-gl-foreground">Meridian Holdings</p>
            <p className="mt-0.5 text-[0.62rem] text-gl-muted-foreground/70">
              14 entities · governed
            </p>
          </div>
        </aside>

        {/* main */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between border-b border-gl-border/70 px-5 py-3.5">
            <div>
              <p className="font-gl-display text-[0.86rem] tracking-tight">
                Executive Operating System
              </p>
              <p className="text-[0.66rem] text-gl-muted-foreground/70">
                Meridian Holdings · FY26 Q3 · 14 entities live
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden rounded-md border border-gl-border/70 px-2.5 py-1.5 text-[0.66rem] text-gl-muted-foreground sm:block">
                Quarter to date
              </span>
              <span className="rounded-md bg-gl-gold px-2.5 py-1.5 text-[0.66rem] font-medium text-gl-background">
                Ask Genius
              </span>
            </div>

          </div>

          <div className={compact ? "space-y-3 p-4" : "space-y-3.5 p-4 lg:p-5"}>
            {/* chart */}
            <div
              ref={chartRef}
              className={`rounded-xl border border-gl-border/70 bg-charcoal/40 ${cardPad} ${animated ? "light-sweep" : ""}`}
            >
              <div className={`${compact ? "mb-2" : "mb-3"} flex items-center justify-between`}>
                <div>
                  <p className="text-[0.72rem] text-gl-foreground">
                    Business performance — revenue and gross margin
                  </p>
                  <p className="text-[0.6rem] text-gl-muted-foreground/65">
                    Dual axis · left: Rev $M · right: GM %
                  </p>

                </div>
                <div className="flex items-center gap-4 text-[0.62rem] text-gl-muted-foreground/75">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gl-data" /> Revenue ($M)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gl-gold" /> Gross margin %
                  </span>
                </div>
              </div>
              <div className="relative">
                <svg viewBox="0 0 720 178" className="w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="glDataFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--data)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="var(--data)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="glGoldFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.16" />
                      <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glLineGlow" x="-20%" y="-60%" width="140%" height="220%">
                      <feGaussianBlur stdDeviation="4" result="b" />
                      <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>


                  {/* gridlines + axis ticks */}
                  {LEFT_AXIS.ticks.map((t, i) => {
                    const y = axisY(t, LEFT_AXIS);
                    return (
                      <g key={t}>
                        <line
                          x1={PLOT.x0}
                          x2={PLOT.x1}
                          y1={y}
                          y2={y}
                          stroke="var(--border)"
                          strokeWidth="1"
                          opacity="0.45"
                        />
                        <text
                          x={PLOT.x0 - 8}
                          y={y + 3}
                          textAnchor="end"
                          className="font-gl-mono"
                          fontSize="8"
                          fill="var(--data)"
                          opacity="0.75"
                        >
                          ${t}M
                        </text>
                        <text
                          x={PLOT.x1 + 8}
                          y={axisY(RIGHT_AXIS.ticks[i]!, RIGHT_AXIS) + 3}
                          textAnchor="start"
                          className="font-gl-mono"
                          fontSize="8"
                          fill="var(--gold)"
                          opacity="0.75"
                        >
                          {RIGHT_AXIS.ticks[i]!.toFixed(1)}%
                        </text>
                      </g>
                    );
                  })}

                  {/* axis captions */}
                  <text
                    x={PLOT.x0 - 8}
                    y={PLOT.y0 - 6}
                    textAnchor="end"
                    fontSize="7"
                    letterSpacing="1"
                    fill="var(--data)"
                    opacity="0.7"
                  >
                    REV $M
                  </text>
                  <text
                    x={PLOT.x1 + 8}
                    y={PLOT.y0 - 6}
                    textAnchor="start"
                    fontSize="7"
                    letterSpacing="1"
                    fill="var(--gold)"
                    opacity="0.7"
                  >
                    GM %
                  </text>


                  {/* gross margin — secondary */}
                  <path
                    d={gm.area}
                    fill="url(#glGoldFill)"
                    style={
                      animated
                        ? { opacity: draw ? 1 : 0, transition: "opacity 1.2s ease 1.1s" }
                        : undefined
                    }
                  />
                  <path
                    d={gm.line}
                    fill="none"
                    stroke="var(--gold)"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                    filter="url(#glLineGlow)"
                    pathLength={animated ? 100 : undefined}
                    strokeDasharray={animated ? 100 : undefined}
                    strokeDashoffset={animated ? (draw ? 0 : 100) : undefined}
                    style={
                      animated
                        ? { transition: "stroke-dashoffset 2.2s var(--ease-premium) 0.25s" }
                        : undefined
                    }
                  />
                  {/* revenue growth — primary */}
                  <path
                    d={rev.area}
                    fill="url(#glDataFill)"
                    style={
                      animated
                        ? { opacity: draw ? 1 : 0, transition: "opacity 1.2s ease 0.9s" }
                        : undefined
                    }
                  />
                  <path
                    d={rev.line}
                    fill="none"
                    stroke="var(--data)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glLineGlow)"
                    pathLength={animated ? 100 : undefined}
                    strokeDasharray={animated ? 100 : undefined}
                    strokeDashoffset={animated ? (draw ? 0 : 100) : undefined}
                    style={
                      animated
                        ? { transition: "stroke-dashoffset 2s var(--ease-premium)" }
                        : undefined
                    }
                  />
                  {draw ? (
                    <circle r="3" fill="var(--cyan)" filter="url(#glLineGlow)">
                      <animateMotion dur="7s" repeatCount="indefinite" path={rev.line} />
                    </circle>
                  ) : null}


                  {/* hover marker */}
                  <line
                    x1={revPt[0]}
                    x2={revPt[0]}
                    y1={PLOT.y0}
                    y2={PLOT.y1}
                    stroke="var(--muted-foreground)"
                    strokeWidth="1"
                    opacity="0.35"
                    strokeDasharray="3 3"
                  />
                  <circle cx={revPt[0]} cy={revPt[1]} r="3.5" fill="var(--data)" />
                  <circle cx={revPt[0]} cy={revPt[1]} r="8" fill="var(--data)" opacity="0.16" />
                  <circle cx={gmPt[0]} cy={gmPt[1]} r="3.5" fill="var(--gold)" />
                  <circle cx={gmPt[0]} cy={gmPt[1]} r="8" fill="var(--gold)" opacity="0.16" />

                  {/* month labels */}
                  {MONTHS.map((m, i) => (
                    <text
                      key={m}
                      x={PLOT.x0 + (i * (PLOT.x1 - PLOT.x0)) / (MONTHS.length - 1)}
                      y={PLOT.y1 + 15}
                      textAnchor="middle"
                      className="font-gl-mono"
                      fontSize="8"
                      fill="var(--muted-foreground)"
                      opacity="0.55"
                    >
                      {m}
                    </text>
                  ))}
                </svg>

                {/* hover tooltip */}
                <div className="pointer-events-none absolute left-[54%] top-2 rounded-lg border border-gl-border/80 bg-gl-navy/90 px-3 py-2 backdrop-blur">
                  <p className="text-[0.6rem] text-gl-muted-foreground/70">May · week 2</p>
                  <p className="mt-1 flex items-center justify-between gap-6 text-[0.66rem]">
                    <span className="text-gl-muted-foreground">Revenue</span>
                    <span className="font-gl-mono text-gl-data">$127.4M</span>
                  </p>
                  <p className="flex items-center justify-between gap-6 text-[0.66rem]">
                    <span className="text-gl-muted-foreground">Gross margin</span>
                    <span className="font-gl-mono text-gl-gold">38.2%</span>
                  </p>
                  <p className="flex items-center justify-between gap-6 text-[0.66rem]">
                    <span className="text-gl-muted-foreground">vs prior period</span>
                    <span className="font-gl-mono text-gl-foreground">+6.2% · +0.4pp</span>
                  </p>
                </div>
              </div>
            </div>


            {/* kpis */}
            <div
              className={`grid grid-cols-2 gap-3.5 ${fluid ? "min-[1700px]:grid-cols-4" : "lg:grid-cols-4"}`}
            >
              {kpis.map((k) => (
                <div
                  key={k.label}
                  className={`rounded-xl border border-gl-border/70 bg-charcoal/40 ${compact ? "p-3" : "p-3.5"}`}
                >
                  <p className="text-[0.62rem] uppercase tracking-[0.12em] text-gl-muted-foreground/65">
                    {k.label}
                  </p>
                  <p className={`${compact ? "mt-1.5" : "mt-2"} font-gl-display text-[1.25rem] tracking-tight`}>
                    {animated ? (
                      <CountUp
                        to={k.num}
                        prefix={k.prefix}
                        suffix={k.suffix}
                        decimals={k.decimals}
                      />
                    ) : (
                      k.value
                    )}
                  </p>
                  <div className="mt-1.5 flex items-end justify-between">
                    <span
                      className={`text-[0.62rem] ${k.tone === "gold" ? "text-gl-gold" : "text-gl-data"}`}
                    >
                      {budgetComparison ? budgetDeltas[k.label] : k.delta}
                    </span>
                    <Spark values={series(14, k.seed, 40, 14)} tone={k.tone} />
                  </div>
                  <div className={compact ? "mt-2" : "mt-2.5"}>
                    <StatusPill status={k.status} />
                  </div>
                </div>
              ))}
            </div>

            {/* executive briefing + entity performance */}
            <div
              className={`grid gap-3.5 ${fluid ? "min-[1700px]:grid-cols-[1.15fr_1fr]" : "lg:grid-cols-[1.15fr_1fr]"}`}
            >
              <div className={`rounded-xl border border-gl-data/25 bg-charcoal/40 ${cardPad} ring-1 ring-inset ring-gl-data/10`}>
                <div className="mb-2.5 flex items-center justify-between">
                  <p className="flex items-center gap-2 text-[0.72rem]">
                    <span className="h-1.5 w-1.5 rounded-full bg-gl-data" />
                    Executive Briefing
                  </p>
                  <span className="font-gl-mono text-[0.58rem] uppercase tracking-[0.12em] text-gl-muted-foreground/55">
                    Today · 06:12
                  </span>
                </div>
                <div className={`${compact ? "space-y-1.5 text-[0.66rem] leading-normal" : "space-y-2 text-[0.68rem] leading-relaxed"} text-gl-foreground/85`}>
                  <p>
                    The quarter is <span className="text-gl-data">ahead of plan</span>. Revenue is{" "}
                    <span className="text-gl-data">6.4% above budget</span> and EBITDA is up{" "}
                    <span className="text-gl-data">1.2 points</span>, carried by North and EMEA.
                  </p>
                  <p className="text-gl-muted-foreground">
                    The one real risk is cash:{" "}
                    <span className="text-gl-gold">Southeast inventory</span> is tying up working
                    capital as demand slows, leaving free cash flow{" "}
                    <span className="text-gl-gold">$4.2M behind plan</span>. A Tier-1 supplier is also
                    showing delivery slippage across three plants.
                  </p>
                  {!compact && (
                    <p className="text-gl-muted-foreground">
                      Opportunity: pricing discipline in Retail could add{" "}
                      <span className="text-gl-data">120bp of margin</span>. Overnight I reconciled
                      four entities and completed{" "}
                      <span className="text-gl-foreground/90">327 workflows</span>.
                    </p>
                  )}
                  <p>
                    My recommendation: approve the inventory release first, then review pricing
                    before the board pack goes out Thursday.
                  </p>
                </div>
                <p className={`${compact ? "mt-2.5 mb-1.5" : "mt-3.5 mb-2"} text-[0.58rem] uppercase tracking-[0.14em] text-gl-muted-foreground/55`}>
                  Recommended actions
                </p>
                <ul className="space-y-2">
                  {visibleActions.map((p) => (
                    <li
                      key={p.title}
                      className={`flex items-center justify-between gap-3 rounded-lg border border-gl-border/60 bg-gl-navy/40 px-2.5 ${compact ? "py-1.5" : "py-2"}`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[0.66rem] text-gl-foreground/90">
                          {p.title}
                        </span>
                        <span className="block truncate text-[0.58rem] text-gl-gold/80">
                          {p.impact}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-md border border-gl-gold/40 bg-gl-gold/10 px-2 py-[3px] text-[0.58rem] text-gl-gold">
                        {p.cta}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`rounded-xl border border-gl-border/70 bg-charcoal/40 ${cardPad}`}>
                <p className={`${compact ? "mb-2" : "mb-3"} text-[0.72rem]`}>Performance by business unit</p>
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="text-[0.58rem] uppercase tracking-[0.14em] text-gl-muted-foreground/55">
                      <th className="pb-2 font-normal">Business unit</th>
                      <th className="pb-2 font-normal">Revenue</th>
                      <th className="hidden pb-2 font-normal sm:table-cell">vs plan</th>
                      <th className="hidden pb-2 font-normal sm:table-cell">Trend</th>
                      <th className="pb-2 text-right font-normal">EBITDA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.map((r) => (
                      <tr key={r.name} className="border-t border-gl-border/50">
                        <td className={`${rowY} text-[0.68rem] text-gl-foreground/90`}>
                          <span className="flex items-center gap-2">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${healthTone[r.health]}`}
                              title={r.health}
                            />
                            {r.name}
                          </span>
                        </td>
                        <td className={`${rowY} font-gl-mono text-[0.66rem] text-gl-muted-foreground`}>
                          {r.revenue}
                        </td>
                        <td
                          className={`hidden ${rowY} font-gl-mono text-[0.66rem] sm:table-cell ${
                            r.vsPlan.startsWith("−") ? "text-gl-gold/85" : "text-gl-data/85"
                          }`}
                        >
                          {r.vsPlan}
                        </td>
                        <td className={`hidden ${rowY} sm:table-cell`}>
                          <Spark
                            values={series(12, r.seed, 40, r.health === "healthy" ? 14 : 6)}
                            tone={r.health === "healthy" ? "data" : "gold"}
                          />
                        </td>
                        <td className={`${rowY} text-right font-gl-mono text-[0.66rem] text-gl-data`}>
                          {r.ebitda}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={`${compact ? "mt-2 pt-2" : "mt-3 pt-2.5"} flex items-center gap-4 border-t border-gl-border/50 text-[0.56rem] uppercase tracking-[0.12em] text-gl-muted-foreground/55`}>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gl-data" /> Healthy
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gl-gold" /> Attention
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive" /> Critical
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
