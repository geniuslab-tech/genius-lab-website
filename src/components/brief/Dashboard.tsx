"use client";

import type { ReactNode } from "react";
import { Tween, smoothPath } from "@/components/hero-demo/engine";
import { renderSegments } from "@/components/hero-demo/screens";
import { GeniusOrb, GeniusShaderOrb, Waveform, stageLabel } from "./Orb";
import { INSIGHTS, insightText, useInsightCycle, type CycleStage, type Focus, type Insight } from "./insights";

export const DASH_W = 1250;
export type Variant = "refined" | "rail" | "glass" | "strip" | "voice";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

export const NAV = ["Executive Briefing", "Performance", "Revenue", "Margin & Cost", "Cash & Working Capital", "Entities", "Decisions", "Automations", "Agents", "Board Reports"];
const BADGES: Record<string, string> = { Decisions: "3", Automations: "6", Agents: "4" };

const KPIS: { key: Focus | "ebitda"; label: string; value: number; fmt: (n: number) => string; delta: string; tone: "data" | "gold"; status: string; spark: number[] }[] = [
  { key: "revenue", label: "Revenue", value: 1.42, fmt: (n) => `$${n.toFixed(2)}B`, delta: "+6.4% vs budget", tone: "data", status: "Ahead of plan", spark: [3, 4, 4, 5, 5, 6, 6, 7] },
  { key: "cash", label: "Free cash flow", value: 96.4, fmt: (n) => `$${n.toFixed(1)}M`, delta: "−$4.2M vs budget", tone: "gold", status: "Attention", spark: [7, 6, 6, 5, 5, 4, 4, 4] },
  { key: "margin", label: "Gross margin", value: 38.6, fmt: (n) => `${n.toFixed(1)}%`, delta: "+0.8pp vs budget", tone: "data", status: "On track", spark: [5, 5, 5, 6, 6, 6, 6, 7] },
  { key: "ebitda", label: "EBITDA", value: 284, fmt: (n) => `$${Math.round(n)}M`, delta: "+1.2pp vs budget", tone: "data", status: "Ahead of plan", spark: [4, 4, 5, 5, 6, 6, 7, 7] },
];

const UNITS = [
  { name: "Industrial — North", rev: "$482.6M", plan: "+8.1%", ebitda: "$104M", tone: "data", s: [3, 4, 4, 5, 6, 6, 7] },
  { name: "Industrial — Southeast", rev: "$311.4M", plan: "−2.4%", ebitda: "$58M", tone: "gold", s: [6, 6, 5, 5, 4, 4, 3] },
  { name: "Distribution — EMEA", rev: "$268.9M", plan: "+11.3%", ebitda: "$61M", tone: "data", s: [2, 3, 4, 4, 5, 6, 7] },
  { name: "Retail — Direct", rev: "$214.7M", plan: "+4.7%", ebitda: "$47M", tone: "data", s: [4, 4, 5, 5, 5, 6, 6] },
] as const;

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"];
const REV = [96, 101, 99, 106, 112, 110, 117, 122, 120, 127.4, 133, 138];
const GM = [36.4, 36.5, 36.3, 36.9, 37.2, 37.1, 37.6, 37.9, 37.8, 38.2, 38.4, 38.6];
const PLOT = { x0: 40, x1: 668, y0: 14, y1: 150 };
const px = (i: number) => PLOT.x0 + (i / (REV.length - 1)) * (PLOT.x1 - PLOT.x0);
const ry = (v: number) => PLOT.y1 - ((v - 84) / (150 - 84)) * (PLOT.y1 - PLOT.y0);
const gy = (v: number) => PLOT.y1 - ((v - 34.6) / (41.2 - 34.6)) * (PLOT.y1 - PLOT.y0);

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function Spark({ v, tone, w = 64, h = 20 }: { v: readonly number[]; tone: string; w?: number; h?: number }) {
  const min = Math.min(...v);
  const max = Math.max(...v);
  const pts = v.map((y, i) => [(i / (v.length - 1)) * w, 2 + (1 - (y - min) / (max - min || 1)) * (h - 4)] as const);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <path d={smoothPath(pts)} fill="none" stroke={tone === "gold" ? "var(--gold)" : "var(--data)"} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Cited({ on, label = "Cited by Genius" }: { on: boolean; label?: string }) {
  if (!on) return null;
  return (
    <span className="gfocus-tag absolute -top-2 right-3 z-10 flex items-center gap-1 rounded-full border border-[oklch(0.85_0.11_205/50%)] bg-[oklch(0.17_0.04_250)] px-2 py-0.5 font-gl-mono text-[0.5rem] uppercase tracking-[0.14em] text-[var(--cyan)]">
      <span className="h-1 w-1 rounded-full bg-[var(--cyan)]" /> {label}
    </span>
  );
}

export function card(glass: boolean, extra = "") {
  return glass
    ? `relative rounded-[18px] border border-white/[0.09] bg-[linear-gradient(160deg,oklch(1_0_0/6%),oklch(1_0_0/2%))] backdrop-blur-xl ${extra}`
    : `relative rounded-xl border border-gl-border/70 bg-[linear-gradient(180deg,oklch(0.21_0.03_262/70%),oklch(0.17_0.03_262/60%))] ${extra}`;
}

export function Sidebar({ narrow = false, active = "Executive Briefing", hover }: { narrow?: boolean; active?: string; hover?: string }) {
  const slug = (n: string) => `nav-${n.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  if (narrow) {
    return (
      <aside className="flex w-[64px] shrink-0 flex-col items-center gap-2 border-r border-gl-border/60 bg-gl-navy/70 py-5">
        <span className="mb-4 grid h-8 w-8 place-items-center rounded-lg bg-gl-data/15">
          <span className="h-2 w-2 rounded-full bg-gl-data" />
        </span>
        {NAV.slice(0, 9).map((n) => {
          const on = n === active;
          return (
            <span
              key={n}
              data-cursor={slug(n)}
              title={n}
              className={`grid h-9 w-9 place-items-center rounded-lg transition-colors duration-300 ${on ? "bg-gl-data/15 ring-1 ring-inset ring-gl-data/30" : hover === n ? "bg-gl-foreground/10" : ""}`}
            >
              <span className={`h-1.5 w-4 rounded-full ${on ? "bg-gl-data" : n === "Agents" ? "bg-gl-gold/70" : "bg-gl-foreground/20"}`} />
            </span>
          );
        })}
      </aside>
    );
  }
  return (
    <aside className="flex w-[208px] shrink-0 flex-col border-r border-gl-border/60 bg-gl-navy/70 p-4">
      <div className="mb-7 flex items-center gap-2.5 px-1.5 pt-1.5">
        <span className="grid h-6 w-6 place-items-center rounded-[7px] bg-gl-data/15">
          <span className="h-1.5 w-1.5 rounded-full bg-gl-data" />
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/genius-lab-logo-white.svg" alt="Genius Lab" className="h-[0.72rem] w-auto" />
      </div>
      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV.map((n) => {
          const on = n === active;
          return (
          <span
            key={n}
            data-cursor={slug(n)}
            className={`flex items-center justify-between rounded-md px-2.5 py-[7px] text-[0.72rem] transition-colors duration-300 ${on ? "bg-gl-data/12 text-gl-foreground ring-1 ring-inset ring-gl-data/25" : hover === n ? "bg-gl-foreground/[0.06] text-gl-foreground" : "text-gl-muted-foreground/75"}`}
          >
            <span className="flex items-center gap-2">
              <span className={`h-1 w-1 rounded-full ${on ? "bg-gl-data shadow-[0_0_8px_var(--data)]" : "bg-gl-muted-foreground/35"}`} />
              {n}
            </span>
            {BADGES[n] ? <span className="rounded bg-gl-gold/15 px-1.5 text-[0.6rem] text-gl-gold">{BADGES[n]}</span> : null}
          </span>
          );
        })}
      </nav>
      <div className="mt-6 rounded-lg border border-gl-border/70 bg-gl-background/40 p-2.5">
        <p className="text-[0.68rem] text-gl-foreground">Meridian Holdings</p>
        <p className="mt-0.5 text-[0.6rem] text-gl-muted-foreground/70">14 entities · governed</p>
      </div>
    </aside>
  );
}

export function Topbar({ stage, orb, shader = false }: { stage: CycleStage; orb?: boolean; shader?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-gl-border/60 px-5 py-3.5">
      <div>
        <p className="font-gl-display text-[0.88rem] tracking-tight text-gl-foreground">Executive Operating System</p>
        <p className="text-[0.64rem] text-gl-muted-foreground/70">Meridian Holdings · FY26 Q3 · 14 entities live</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-md border border-gl-border/70 px-2.5 py-1.5 font-gl-mono text-[0.56rem] uppercase tracking-[0.14em] text-gl-muted-foreground">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--success)]" /> Live
        </span>
        <span className="rounded-md border border-gl-border/70 px-2.5 py-1.5 text-[0.64rem] text-gl-muted-foreground">Quarter to date</span>
        <span className="flex items-center gap-1.5 rounded-md bg-gl-gold px-2.5 py-1.5 text-[0.66rem] font-medium text-gl-background">
          {orb ? shader ? <GeniusShaderOrb state={stage} size={16} /> : <GeniusOrb state={stage} size={14} tone="gold" /> : null}
          Ask Genius
        </span>
      </div>
    </div>
  );
}

export function Chart({ focus, glass, anomalies = false, selected = false }: { focus: Focus; glass: boolean; anomalies?: boolean; selected?: boolean }) {
  const rev = REV.map((v, i) => [px(i), ry(v)] as const);
  const gm = GM.map((v, i) => [px(i), gy(v)] as const);
  const revLine = smoothPath(rev);
  const gmLine = smoothPath(gm);
  const hi = 9;
  const onRev = focus === "revenue";
  const onGm = focus === "margin";
  return (
    <div className={card(glass, `gfocus p-4 ${onRev || onGm ? "gfocus-on" : ""}`)}>
      <Cited on={onRev || onGm} label={onGm ? "Margin · cited" : "Revenue · cited"} />
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-[0.72rem] text-gl-foreground">Business performance — revenue and gross margin</p>
          <p className="text-[0.6rem] text-gl-muted-foreground/65">Dual axis · left: Rev $M · right: GM %</p>
        </div>
        <div className="flex items-center gap-4 text-[0.62rem] text-gl-muted-foreground/75">
          <span className={`flex items-center gap-1.5 transition-opacity ${onGm ? "opacity-50" : ""}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-gl-data" /> Revenue ($M)
          </span>
          <span className={`flex items-center gap-1.5 transition-opacity ${onRev ? "opacity-50" : ""}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-gl-gold" /> Gross margin %
          </span>
        </div>
      </div>
      <div className="relative">
      <span data-cursor="chart-point" className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${(px(hi) / 720) * 100}%`, top: `${(ry(REV[hi]!) / 170) * 100}%` }} />
      <svg viewBox="0 0 720 170" className="block w-full" aria-hidden="true">
        <defs>
          <linearGradient id="bdRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--data)" stopOpacity="0.4" />
            <stop offset="1" stopColor="var(--data)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bdGm" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--gold)" stopOpacity="0.2" />
            <stop offset="1" stopColor="var(--gold)" stopOpacity="0" />
          </linearGradient>
          <filter id="bdGlow" x="-20%" y="-60%" width="140%" height="220%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[150, 128, 106, 90].map((t) => (
          <g key={t}>
            <line x1={PLOT.x0} x2={PLOT.x1} y1={ry(t)} y2={ry(t)} stroke="var(--border)" opacity="0.45" />
            <text x={PLOT.x0 - 8} y={ry(t) + 3} textAnchor="end" className="font-gl-mono" fontSize="8" fill="var(--data)" opacity="0.75">
              ${t}M
            </text>
          </g>
        ))}
        <path d={`${gmLine} L ${PLOT.x1} ${PLOT.y1} L ${PLOT.x0} ${PLOT.y1} Z`} fill="url(#bdGm)" opacity={onRev ? 0.4 : 1} style={{ transition: "opacity .6s" }} />
        <path d={gmLine} fill="none" stroke="var(--gold)" strokeWidth={onGm ? 2.6 : 1.3} filter="url(#bdGlow)" opacity={onRev ? 0.45 : 0.95} style={{ transition: "all .6s" }} />
        <path d={`${revLine} L ${PLOT.x1} ${PLOT.y1} L ${PLOT.x0} ${PLOT.y1} Z`} fill="url(#bdRev)" opacity={onGm ? 0.35 : 1} style={{ transition: "opacity .6s" }} />
        <path d={revLine} fill="none" stroke="var(--data)" strokeWidth={onRev ? 2.6 : 1.7} filter="url(#bdGlow)" opacity={onGm ? 0.45 : 1} style={{ transition: "all .6s" }} />
        <circle r="3" fill="var(--cyan)" filter="url(#bdGlow)">
          <animateMotion dur="7s" repeatCount="indefinite" path={revLine} />
        </circle>
        <line x1={px(hi)} x2={px(hi)} y1={PLOT.y0} y2={PLOT.y1} stroke="var(--muted-foreground)" strokeDasharray="3 3" opacity="0.4" />
        <circle cx={px(hi)} cy={ry(REV[hi]!)} r={onRev ? 5 : 3.5} fill="var(--data)" style={{ transition: "r .4s" }} />
        <circle cx={px(hi)} cy={ry(REV[hi]!)} r={onRev ? 13 : 8} fill="var(--data)" opacity="0.18" style={{ transition: "r .4s" }} />
        <circle cx={px(hi)} cy={gy(GM[hi]!)} r={onGm ? 5 : 3.5} fill="var(--gold)" style={{ transition: "r .4s" }} />
        <circle cx={px(hi)} cy={gy(GM[hi]!)} r={onGm ? 13 : 8} fill="var(--gold)" opacity="0.18" style={{ transition: "r .4s" }} />
        {selected ? (
          <g>
            <circle cx={px(hi)} cy={ry(REV[hi]!)} r="18" fill="none" stroke="var(--cyan)" strokeWidth="1.5" className="demo-anomaly" />
            <rect x={px(hi) - 22} y={PLOT.y0} width="44" height={PLOT.y1 - PLOT.y0} fill="var(--cyan)" opacity="0.07" rx="6" />
          </g>
        ) : null}
        {anomalies ? (
          <g>
            <circle cx={px(5)} cy={ry(REV[5]!)} r="4" fill="none" stroke="var(--gold)" strokeWidth="1.5" />
            <text x={px(5)} y={ry(REV[5]!) - 10} textAnchor="middle" className="font-gl-mono" fontSize="7.5" fill="var(--gold)">
              SUPPLY DIP
            </text>
            <circle cx={px(8)} cy={gy(GM[8]!)} r="4" fill="none" stroke="var(--gold)" strokeWidth="1.5" />
            <text x={px(8)} y={gy(GM[8]!) + 16} textAnchor="middle" className="font-gl-mono" fontSize="7.5" fill="var(--gold)">
              DISCOUNTING
            </text>
          </g>
        ) : null}
        {MONTHS.map((m, i) => (
          <text key={m} x={PLOT.x0 + (i * (PLOT.x1 - PLOT.x0)) / 5} y={PLOT.y1 + 15} textAnchor="middle" className="font-gl-mono" fontSize="8" fill="var(--muted-foreground)" opacity="0.55">
            {m}
          </text>
        ))}
      </svg>
      </div>
      <div className={`pointer-events-none absolute left-[56%] top-12 rounded-lg border px-3 py-2 backdrop-blur transition-colors duration-300 ${selected ? "border-[oklch(0.85_0.11_205/55%)] bg-[oklch(0.17_0.04_250/95%)]" : "border-gl-border/80 bg-gl-navy/90"} ${glass ? "hidden" : ""}`}>
        <p className="text-[0.58rem] text-gl-muted-foreground/70">May · week 2</p>
        <p className="mt-1 flex justify-between gap-6 text-[0.64rem]">
          <span className="text-gl-muted-foreground">Revenue</span>
          <span className="font-gl-mono text-gl-data">$127.4M</span>
        </p>
        <p className="flex justify-between gap-6 text-[0.64rem]">
          <span className="text-gl-muted-foreground">Gross margin</span>
          <span className="font-gl-mono text-gl-gold">38.2%</span>
        </p>
      </div>
    </div>
  );
}

export function Kpis({ focus, glass, big = false, selected = [], pressed }: { focus: Focus; glass: boolean; big?: boolean; selected?: string[]; pressed?: string }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {KPIS.map((k) => {
        const on = k.key === focus;
        const picked = selected.includes(k.key);
        return (
          <div
            key={k.label}
            data-cursor={`kpi-${k.key}`}
            className={card(glass, `gfocus ${big ? "p-4" : "p-3.5"} ${on || picked ? "gfocus-on" : ""} ${pressed === k.key ? "scale-[0.98]" : ""} transition-transform duration-150`)}
          >
            {picked && !on ? <Cited on label="Selected" /> : <Cited on={on} />}
            <p className="text-[0.6rem] uppercase tracking-[0.12em] text-gl-muted-foreground/70">{k.label}</p>
            <p className={`mt-1.5 font-gl-display ${big ? "text-[1.5rem]" : "text-[1.25rem]"} tabular-nums tracking-tight text-gl-foreground`}>
              <Tween value={k.value} format={k.fmt} from={0} duration={1500} />
            </p>
            <div className="mt-1.5 flex items-end justify-between">
              <span className={`text-[0.6rem] ${k.tone === "gold" ? "text-gl-gold" : "text-gl-data"}`}>{k.delta}</span>
              <Spark v={k.spark} tone={k.tone} w={big ? 80 : 60} />
            </div>
            <span
              className={`mt-2 inline-flex items-center gap-1.5 rounded-md border px-1.5 py-[2px] text-[0.52rem] uppercase tracking-[0.1em] ${
                k.tone === "gold" ? "border-gl-gold/40 bg-gl-gold/10 text-gl-gold" : "border-gl-data/35 bg-gl-data/10 text-gl-data"
              }`}
            >
              <span className={`h-1 w-1 animate-pulse rounded-full ${k.tone === "gold" ? "bg-gl-gold" : "bg-gl-data"}`} />
              {k.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function Units({ focus, glass, className = "" }: { focus: Focus; glass: boolean; className?: string }) {
  const on = focus === "units";
  return (
    <div className={card(glass, `gfocus p-4 ${on ? "gfocus-on" : ""} ${className}`)}>
      <Cited on={on} />
      <p className="mb-2.5 text-[0.72rem] text-gl-foreground">Performance by business unit</p>
      <div className="grid grid-cols-[1fr_74px_56px_70px_52px] pb-1.5 text-[0.54rem] uppercase tracking-[0.12em] text-gl-muted-foreground/55">
        <span>Business unit</span>
        <span>Revenue</span>
        <span>vs plan</span>
        <span>Trend</span>
        <span className="text-right">EBITDA</span>
      </div>
      {UNITS.map((u) => {
        const hot = on && u.tone === "gold";
        return (
          <div key={u.name} className={`grid grid-cols-[1fr_74px_56px_70px_52px] items-center border-t border-gl-border/50 py-[8px] text-[0.66rem] transition-colors duration-500 ${hot ? "-mx-2 rounded-md bg-gl-gold/10 px-2" : ""}`}>
            <span className="flex items-center gap-2 text-gl-foreground/90">
              <span className={`h-1.5 w-1.5 rounded-full ${u.tone === "gold" ? "bg-gl-gold" : "bg-gl-data"}`} />
              {u.name}
            </span>
            <span className="font-gl-mono text-gl-muted-foreground">{u.rev}</span>
            <span className={`font-gl-mono ${u.tone === "gold" ? "text-gl-gold" : "text-gl-data"}`}>{u.plan}</span>
            <Spark v={u.s} tone={u.tone} w={60} h={16} />
            <span className="text-right font-gl-mono text-gl-data">{u.ebitda}</span>
          </div>
        );
      })}
    </div>
  );
}

/** The streamed insight text with caret. */
export function InsightText({ insight, typed, stage, className = "" }: { insight: Insight; typed: number; stage: CycleStage; className?: string }) {
  if (stage === "thinking") {
    return (
      <div className={`space-y-2 pt-1 ${className}`}>
        <span className="gshimmer block h-2 w-[94%] rounded" />
        <span className="gshimmer block h-2 w-[80%] rounded" />
        <span className="gshimmer block h-2 w-[62%] rounded" />
      </div>
    );
  }
  const len = insightText(insight).length;
  return (
    <p className={className}>
      {renderSegments(insight.segments, typed)}
      {typed < len ? <span className="gcaret" /> : null}
    </p>
  );
}

export function ActionRow({ insight, show, compact = false, approve }: { insight: Insight; show: boolean; compact?: boolean; approve?: ApproveState }) {
  const done = approve?.done;
  return (
    <div className={`flex items-center justify-between gap-3 rounded-lg border border-gl-gold/30 bg-gl-gold/[0.06] px-3 ${compact ? "py-1.5" : "py-2"} transition-all duration-500 ${show ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}>
      <span className="min-w-0">
        <span className="block truncate text-[0.66rem] text-gl-foreground">{insight.action.title}</span>
        <span className="block truncate text-[0.58rem] text-gl-gold/85">{insight.action.impact}</span>
      </span>
      <span
        data-cursor="approve"
        className={`shrink-0 rounded-md px-2.5 py-1 text-[0.6rem] font-medium transition-all duration-200 ${done ? "bg-[var(--success)] text-gl-background" : "bg-gl-gold text-gl-background"} ${approve?.hover && !done ? "brightness-110 shadow-[0_0_0_4px_oklch(0.77_0.155_66/22%)]" : ""} ${approve?.pressed ? "scale-95" : ""}`}
      >
        {done ? "✓ Approved" : insight.action.cta}
      </span>
    </div>
  );
}

export function Dots({ idx }: { idx: number }) {
  return (
    <span className="flex gap-1">
      {INSIGHTS.map((_, i) => (
        <span key={i} className={`h-1 rounded-full transition-all duration-500 ${i === idx ? "w-4 bg-[var(--cyan)]" : "w-1 bg-gl-foreground/20"}`} />
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Briefing variants                                                   */
/* ------------------------------------------------------------------ */

export type Cyc = Omit<ReturnType<typeof useInsightCycle>, "ref">;

/** Approval button state, when a script drives the dashboard. */
export type ApproveState = { hover?: boolean; pressed?: boolean; done?: boolean };

/** The user's question to the agent, when a script types one. */
export type AskState = { text: string; typed: number; focused: boolean; sent: boolean; hoverSend?: boolean; pressSend?: boolean; placeholder?: string };

/** Chat input that becomes the user's message bubble once sent. */
export function AskBox({ ask, tone = "blue", className = "", cid = "ask" }: { ask: AskState; tone?: "blue" | "gold"; className?: string; cid?: string }) {
  const ring = tone === "gold" ? "oklch(0.77 0.155 66 / 55%)" : "oklch(0.85 0.11 205 / 55%)";
  if (ask.sent) {
    return (
      <div className={`gfocus-tag flex justify-end ${className}`}>
        <div className="max-w-[90%] rounded-2xl rounded-br-sm bg-gl-foreground/[0.09] px-3 py-2 text-[0.7rem] leading-snug text-gl-foreground">
          <span className="mb-0.5 block font-gl-mono text-[0.48rem] uppercase tracking-[0.14em] text-gl-muted-foreground">Elena</span>
          {ask.text}
        </div>
      </div>
    );
  }
  const shown = ask.text.slice(0, ask.typed);
  return (
    <div
      data-cursor={`${cid}-input`}
      className={`flex items-center gap-2 rounded-xl border bg-gl-background/50 py-1.5 pl-3 pr-1.5 transition-[border-color,box-shadow] duration-300 ${className}`}
      style={{ borderColor: ask.focused ? ring : "oklch(1 0 0 / 10%)", boxShadow: ask.focused ? `0 0 0 3px ${tone === "gold" ? "oklch(0.77 0.155 66 / 14%)" : "oklch(0.85 0.11 205 / 12%)"}` : "none" }}
    >
      <span className="min-h-[1.2em] flex-1 truncate text-[0.68rem] text-gl-foreground">
        {shown ? shown : <span className="text-gl-muted-foreground/60">{ask.placeholder ?? "Ask Genius about this…"}</span>}
        {ask.focused && ask.typed < ask.text.length ? <span className="gcaret" /> : null}
      </span>
      <span
        data-cursor={`${cid}-send`}
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[0.7rem] transition-all duration-200 ${shown ? (tone === "gold" ? "bg-gl-gold text-gl-background" : "bg-[var(--cyan)] text-gl-background") : "bg-gl-foreground/10 text-gl-muted-foreground"} ${ask.hoverSend ? "brightness-110" : ""} ${ask.pressSend ? "scale-90" : ""}`}
      >
        ↑
      </span>
    </div>
  );
}

export function BriefingCard({ c, glass, approve, ask }: { c: Cyc; glass: boolean; approve?: ApproveState; ask?: AskState }) {
  return (
    <div className={card(glass, "overflow-hidden p-4 ring-1 ring-inset ring-gl-data/10")}>
      <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,oklch(0.7_0.17_252/22%),transparent_70%)]" />
      <div className="relative mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GeniusShaderOrb state={c.stage} size={58} />
          <div>
            <p className="text-[0.74rem] text-gl-foreground">Executive Briefing</p>
            <p key={c.stage} className="gfocus-tag text-[0.58rem] text-gl-muted-foreground">
              Genius · {stageLabel(c.stage, c.insight.tag)}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="font-gl-mono text-[0.54rem] uppercase tracking-[0.14em] text-gl-muted-foreground/60">Today · 06:12</span>
          <Dots idx={c.idx} />
        </div>
      </div>
      <p className="relative font-gl-mono text-[0.54rem] uppercase tracking-[0.16em] text-[var(--cyan)]">
        Insight {c.idx + 1} / {INSIGHTS.length} · {c.insight.tag}
      </p>
      {ask ? <AskBox ask={ask} className="relative mt-2" /> : null}
      <div className="relative mt-1.5 min-h-[64px]">
        <InsightText insight={c.insight} typed={c.typed} stage={c.stage} className="text-[0.74rem] leading-[1.6] text-gl-foreground/90" />
      </div>
      <div className={`relative mt-2 flex gap-1.5 transition-opacity duration-500 ${c.stage === "holding" ? "opacity-100" : "opacity-0"}`}>
        {c.insight.sources.map((s) => (
          <span key={s} className="rounded border border-gl-border/80 px-1.5 py-0.5 font-gl-mono text-[0.5rem] text-gl-muted-foreground">
            {s}
          </span>
        ))}
      </div>
      <div className="relative mt-3">
        <ActionRow insight={c.insight} show={c.stage === "holding"} approve={approve} />
      </div>
    </div>
  );
}

export function GeniusRail({ c, approve, ask }: { c: Cyc; approve?: ApproveState; ask?: AskState }) {
  const history = [1, 2, 3].map((k) => INSIGHTS[(c.idx - k + INSIGHTS.length * 2) % INSIGHTS.length]!);
  return (
    <aside className="relative flex w-[300px] shrink-0 flex-col overflow-hidden border-r border-gl-border/60 bg-[linear-gradient(180deg,oklch(0.19_0.045_258/90%),oklch(0.14_0.03_264/90%))] p-5">
      <div className="pointer-events-none absolute -top-12 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.7_0.17_252/30%),transparent_70%)]" />
      <div className="relative mt-10 flex flex-col items-center text-center">
        <GeniusShaderOrb state={c.stage} size={128} />
        <p className="mt-4 font-gl-display text-[0.95rem] text-gl-foreground">Genius</p>
        <p key={c.stage} className="gfocus-tag text-[0.6rem] text-gl-muted-foreground">
          {stageLabel(c.stage, c.insight.tag)}
        </p>
        <span className="mt-2">
          <Dots idx={c.idx} />
        </span>
      </div>
      {ask ? <AskBox ask={ask} className="relative mt-4" /> : null}
      <div className={`relative rounded-xl border border-[oklch(0.85_0.11_205/30%)] bg-[oklch(0.85_0.11_205/5%)] p-3.5 ${ask ? "mt-3" : "mt-5"}`}>
        <p className="font-gl-mono text-[0.52rem] uppercase tracking-[0.16em] text-[var(--cyan)]">Now · {c.insight.tag}</p>
        <div className="mt-1.5 min-h-[92px]">
          <InsightText insight={c.insight} typed={c.typed} stage={c.stage} className="text-[0.74rem] leading-[1.6] text-gl-foreground/90" />
        </div>
        <ActionRow insight={c.insight} show={c.stage === "holding"} compact approve={approve} />
      </div>
      <p className="relative mt-5 mb-2 font-gl-mono text-[0.52rem] uppercase tracking-[0.16em] text-gl-muted-foreground/60">Earlier this morning</p>
      <div className="relative space-y-2">
        {history.map((h, k) => (
          <div key={`${h.tag}-${k}`} className="rounded-lg border border-gl-border/60 bg-gl-background/30 px-3 py-2" style={{ opacity: 1 - k * 0.22 }}>
            <p className="font-gl-mono text-[0.5rem] uppercase tracking-[0.14em] text-gl-muted-foreground">{h.tag}</p>
            <p className="mt-0.5 line-clamp-2 text-[0.62rem] leading-snug text-gl-foreground/75">{insightText(h)}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

/** The orb leaves its dock and hovers beside whatever it is talking about. */
const GUIDE_POS: Record<Focus, { left: number; top: number }> = {
  revenue: { left: 470, top: 58 },
  margin: { left: 600, top: 130 },
  cash: { left: 300, top: 196 },
  units: { left: 200, top: 470 },
};
function FloatingGuide({ c }: { c: Cyc }) {
  const pos = GUIDE_POS[c.focus];
  return (
    <div className="pointer-events-none absolute z-30 transition-[left,top] duration-[1100ms] ease-[cubic-bezier(0.65,0,0.25,1)]" style={{ left: pos.left, top: pos.top }}>
      <div className="flex items-start gap-2.5">
        <GeniusOrb state={c.stage} size={44} />
        <div className="w-[300px] rounded-2xl rounded-tl-sm border border-white/12 bg-[oklch(0.2_0.04_258/88%)] p-3 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.8)] backdrop-blur-xl">
          <p className="font-gl-mono text-[0.5rem] uppercase tracking-[0.16em] text-[var(--cyan)]">Genius · {c.insight.tag}</p>
          <div className="mt-1 min-h-[54px]">
            <InsightText insight={c.insight} typed={c.typed} stage={c.stage} className="text-[0.68rem] leading-[1.55] text-gl-foreground/90" />
          </div>
        </div>
      </div>
    </div>
  );
}

function GlassChecklist({ c }: { c: Cyc }) {
  return (
    <div className={card(true, "p-4")}>
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-2 text-[0.74rem] text-gl-foreground">
          <GeniusOrb state={c.stage} size={20} /> Executive Briefing
        </p>
        <span className="font-gl-mono text-[0.54rem] uppercase tracking-[0.14em] text-gl-muted-foreground/60">4 insights · 06:12</span>
      </div>
      <div className="space-y-1.5">
        {INSIGHTS.map((ins, i) => {
          const on = i === c.idx;
          return (
            <div key={ins.tag} className={`rounded-xl border px-3 py-2 transition-all duration-500 ${on ? "border-[oklch(0.85_0.11_205/45%)] bg-[oklch(0.85_0.11_205/7%)]" : "border-white/[0.06]"}`}>
              <div className="flex items-center justify-between">
                <span className={`font-gl-mono text-[0.52rem] uppercase tracking-[0.14em] ${on ? "text-[var(--cyan)]" : "text-gl-muted-foreground/70"}`}>{ins.tag}</span>
                <span className="text-[0.56rem] text-gl-gold">{ins.action.cta} →</span>
              </div>
              <p className={`mt-0.5 truncate text-[0.62rem] ${on ? "text-gl-foreground" : "text-gl-foreground/55"}`}>{ins.action.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BriefingStrip({ c }: { c: Cyc }) {
  return (
    <div className={card(false, "flex items-center gap-5 overflow-hidden px-5 py-4 ring-1 ring-inset ring-gl-data/10")}>
      <div className="pointer-events-none absolute -left-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.7_0.17_252/26%),transparent_70%)]" />
      <div className="relative flex shrink-0 items-center gap-3">
        <GeniusOrb state={c.stage} size={54} />
        <div className="w-[120px]">
          <p className="text-[0.74rem] text-gl-foreground">Executive Briefing</p>
          <p key={c.stage} className="gfocus-tag text-[0.56rem] leading-snug text-gl-muted-foreground">
            {stageLabel(c.stage, c.insight.tag)}
          </p>
        </div>
      </div>
      <span className="h-12 w-px shrink-0 bg-gl-border" />
      <div className="relative min-w-0 flex-1">
        <p className="font-gl-mono text-[0.52rem] uppercase tracking-[0.16em] text-[var(--cyan)]">
          {c.insight.tag} · insight {c.idx + 1}/{INSIGHTS.length}
        </p>
        <div className="mt-1 min-h-[40px]">
          <InsightText insight={c.insight} typed={c.typed} stage={c.stage} className="text-[0.76rem] leading-[1.55] text-gl-foreground/90" />
        </div>
      </div>
      <div className="relative w-[250px] shrink-0">
        <ActionRow insight={c.insight} show={c.stage === "holding"} />
        <div className="mt-2 flex justify-end">
          <Dots idx={c.idx} />
        </div>
      </div>
    </div>
  );
}

export function VoiceBriefing({ c, approve, ask }: { c: Cyc; approve?: ApproveState; ask?: AskState }) {
  const text = insightText(c.insight);
  const speaking = c.stage === "typing";
  return (
    <div className="relative overflow-hidden rounded-xl border border-gl-gold/30 bg-[linear-gradient(160deg,oklch(0.24_0.05_70/40%),oklch(0.16_0.03_264/70%))] p-4">
      <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-[radial-gradient(circle,oklch(0.77_0.155_66/22%),transparent_70%)]" />
      <div className="relative flex items-center gap-3">
        <GeniusShaderOrb state={c.stage} size={64} tone="gold" />
        <div className="flex-1">
          <p className="text-[0.74rem] text-gl-foreground">Executive Briefing · voice</p>
          <div className="mt-1 flex items-center gap-2">
            <Waveform active={speaking} />
            <span className="font-gl-mono text-[0.54rem] text-gl-muted-foreground">{speaking ? "Speaking" : c.stage === "thinking" ? "Preparing" : "Paused"} · 0:{String(12 + c.idx * 11).padStart(2, "0")} / 0:58</span>
          </div>
        </div>
        <span className="rounded-full border border-gl-gold/40 px-2.5 py-1 font-gl-mono text-[0.54rem] uppercase tracking-[0.12em] text-gl-gold">Listen</span>
      </div>
      {ask ? <AskBox ask={{ ...ask, placeholder: "Ask by voice or type…" }} tone="gold" className="relative mt-3" /> : null}
      <p className="relative mt-3 font-gl-mono text-[0.52rem] uppercase tracking-[0.16em] text-gl-gold">Transcript · {c.insight.tag}</p>
      <p className="relative mt-1 min-h-[66px] text-[0.76rem] leading-[1.6]">
        {c.stage === "thinking" ? (
          <span className="text-gl-muted-foreground">…</span>
        ) : (
          <>
            <span className="text-gl-foreground">{renderSegments(c.insight.segments, c.typed)}</span>
            <span className="text-gl-foreground/25">{text.slice(c.typed)}</span>
          </>
        )}
      </p>
      <div className="relative mt-2">
        <ActionRow insight={c.insight} show={c.stage === "holding"} compact approve={approve} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

export function BriefDashboard({ variant }: { variant: Variant }) {
  const { ref, ...c } = useInsightCycle();
  const glass = variant === "glass";
  const shell = glass
    ? "relative overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(160deg,oklch(0.24_0.045_258/80%),oklch(0.15_0.03_264/85%))] shadow-[var(--shadow-elevated)] backdrop-blur-2xl"
    : variant === "voice"
      ? "glass-panel relative overflow-hidden rounded-[1.15rem] p-0 shadow-[var(--shadow-elevated)] ring-1 ring-inset ring-gl-gold/15"
      : "glass-panel relative overflow-hidden rounded-[1.15rem] p-0 shadow-[var(--shadow-elevated)]";

  let body: ReactNode;
  if (variant === "rail") {
    body = (
      <div className="flex min-h-[640px]">
        <Sidebar narrow />
        <GeniusRail c={c} />
        <div className="min-w-0 flex-1">
          <Topbar stage={c.stage} />
          <div className="space-y-3 p-4">
            <Kpis focus={c.focus} glass={false} />
            <Chart focus={c.focus} glass={false} />
            <Units focus={c.focus} glass={false} />
          </div>
        </div>
      </div>
    );
  } else if (variant === "strip") {
    body = (
      <div className="flex min-h-[640px]">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <Topbar stage={c.stage} orb />
          <div className="space-y-3 p-4">
            <BriefingStrip c={c} />
            <Kpis focus={c.focus} glass={false} big />
            <div className="grid grid-cols-[1.45fr_1fr] gap-3">
              <Chart focus={c.focus} glass={false} anomalies />
              <Units focus={c.focus} glass={false} />
            </div>
          </div>
        </div>
      </div>
    );
  } else if (variant === "glass") {
    body = (
      <div className="relative flex min-h-[640px]">
        <Sidebar />
        <div className="relative min-w-0 flex-1">
          <Topbar stage={c.stage} orb />
          <div className="relative space-y-3.5 p-5">
            <Chart focus={c.focus} glass />
            <Kpis focus={c.focus} glass />
            <div className="grid grid-cols-[1fr_1.15fr] gap-3.5">
              <GlassChecklist c={c} />
              <Units focus={c.focus} glass />
            </div>
            <FloatingGuide c={c} />
          </div>
        </div>
      </div>
    );
  } else {
    // refined + voice share the v24 arrangement
    body = (
      <div className="flex min-h-[640px]">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <Topbar stage={c.stage} orb={variant === "voice"} shader={variant === "voice"} />
          <div className="space-y-3.5 p-5">
            <Chart focus={c.focus} glass={false} />
            <Kpis focus={c.focus} glass={false} />
            <div className="grid grid-cols-[1.15fr_1fr] gap-3.5">
              {variant === "voice" ? <VoiceBriefing c={c} /> : <BriefingCard c={c} glass={false} />}
              <Units focus={c.focus} glass={false} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={shell} style={{ width: DASH_W }}>
      {body}
    </div>
  );
}
