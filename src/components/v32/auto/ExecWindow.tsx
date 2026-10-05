"use client";

import type { ReactNode } from "react";
import { Tween, smoothPath } from "@/components/hero-demo/engine";
import { renderSegments, segText } from "@/components/hero-demo/screens";
import { AskBox, type AskState } from "@/components/brief/Dashboard";
import { GeniusShaderOrb } from "@/components/brief/Orb";
import type { Clock } from "./clock";
import { BRIDGE, BRIEF, DRIVERS, ENTITIES, GM, KPIS, MOVES, REV, WIN, logoUrl, type CUES } from "./data";

type S = Clock<typeof CUES>;
const SPRING = "cubic-bezier(0.16, 1, 0.3, 1)";

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function Widget({ show, src, className = "", children, cid, selected = false, pressed = false }: { show: boolean; src: string; className?: string; children: ReactNode; cid?: string; selected?: boolean; pressed?: boolean }) {
  return (
    <div
      data-cursor={cid}
      className={`relative rounded-[14px] border p-3.5 ${className}`}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? (pressed ? "scale(0.975)" : "none") : "translateY(14px) scale(0.98)",
        borderColor: selected ? "oklch(0.85 0.11 205 / 65%)" : "oklch(1 0 0 / 9%)",
        background: "linear-gradient(170deg, oklch(0.22 0.035 262 / 85%), oklch(0.17 0.03 262 / 80%))",
        boxShadow: selected ? "0 0 0 1px oklch(0.85 0.11 205 / 35%), 0 0 40px -10px oklch(0.85 0.11 205 / 60%)" : "inset 0 1px 0 oklch(1 0 0 / 5%)",
        transition: `opacity 700ms ease, transform ${pressed ? 150 : 900}ms ${SPRING}, border-color 500ms, box-shadow 500ms`,
      }}
    >
      {show ? (
        <span className="fa-up absolute -top-2 right-3 z-10 flex items-center gap-1 rounded-full border border-[oklch(0.8_0.15_75/45%)] bg-[oklch(0.2_0.04_70)] px-2 py-[1px] font-gl-mono text-[8px] tracking-[0.08em] text-[oklch(0.86_0.13_78)]" style={{ animationDelay: "350ms" }}>
          <span className="h-1 w-1 rounded-full bg-[oklch(0.86_0.13_78)]" />
          {selected ? "Selected" : src}
        </span>
      ) : null}
      {children}
    </div>
  );
}

const PX = (i: number) => 34 + (i / (REV.length - 1)) * 410;
const RY = (v: number) => 132 - ((v - 90) / (142 - 90)) * 116;
const GY = (v: number) => 132 - ((v - 35.6) / (39.4 - 35.6)) * 116;

function PerfChart({ show }: { show: boolean }) {
  const rev = smoothPath(REV.map((v, i) => [PX(i), RY(v)] as const));
  const gm = smoothPath(GM.map((v, i) => [PX(i), GY(v)] as const));
  return (
    <svg viewBox="0 0 460 150" className="block w-full" aria-hidden="true">
      <defs>
        <linearGradient id="faRevArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--data)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--data)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[100, 120, 140].map((t) => (
        <g key={t}>
          <line x1="34" x2="444" y1={RY(t)} y2={RY(t)} stroke="oklch(1 0 0 / 6%)" />
          <text x="28" y={RY(t) + 3} textAnchor="end" fontSize="8" className="font-gl-mono" fill="var(--muted-foreground)">
            ${t}M
          </text>
        </g>
      ))}
      <path d={`${rev} L 444 132 L 34 132 Z`} fill="url(#faRevArea)" style={{ opacity: show ? 1 : 0, transition: "opacity 900ms ease 900ms" }} />
      <path d={gm} fill="none" stroke="var(--gold)" strokeWidth="1.5" pathLength={1} strokeDasharray="1" style={{ strokeDashoffset: show ? 0 : 1, transition: "stroke-dashoffset 1600ms cubic-bezier(0.45,0,0.2,1) 500ms" }} />
      <path d={rev} fill="none" stroke="var(--data)" strokeWidth="2" pathLength={1} strokeDasharray="1" style={{ strokeDashoffset: show ? 0 : 1, transition: "stroke-dashoffset 1600ms cubic-bezier(0.45,0,0.2,1) 200ms", filter: "drop-shadow(0 0 6px oklch(0.7 0.17 252 / 60%))" }} />
      <circle cx={PX(11)} cy={RY(REV[11]!)} r="3.5" fill="var(--data)" style={{ opacity: show ? 1 : 0, transition: "opacity 400ms ease 1700ms" }} />
      {["JAN", "MAR", "MAY", "JUL", "SEP", "NOV"].map((m, i) => (
        <text key={m} x={PX(i * 2)} y="146" textAnchor="middle" fontSize="7.5" className="font-gl-mono" fill="var(--muted-foreground)" opacity="0.7">
          {m}
        </text>
      ))}
    </svg>
  );
}

function Bridge({ show }: { show: boolean }) {
  const y = (v: number) => 120 - ((v - 93) / (101.5 - 93)) * 104;
  /* running total before each bar: totals reset it, deltas move it */
  const before = BRIDGE.map((_, i) => BRIDGE.slice(0, i).reduce((acc, b) => (b.kind === "total" ? b.v : acc + b.v), 0));
  const bars = BRIDGE.map((b, i) => {
    if (b.kind === "total") return { ...b, top: y(b.v), bot: y(93) };
    const from = before[i]!;
    const to = from + b.v;
    return { ...b, top: y(Math.max(from, to)), bot: y(Math.min(from, to)) };
  });
  return (
    <svg viewBox="0 0 290 150" className="block w-full" aria-hidden="true">
      {bars.map((b, i) => {
        const x = 14 + i * 56;
        const fill = b.kind === "total" ? (i === 0 ? "oklch(0.7 0.17 252 / 55%)" : "var(--data)") : b.kind === "neg" ? "var(--gold)" : "var(--success)";
        return (
          <g key={b.k}>
            <rect
              x={x}
              y={b.top}
              width="36"
              height={Math.max(2, b.bot - b.top)}
              rx="3"
              fill={fill}
              style={{ transformBox: "fill-box", transformOrigin: b.kind === "neg" ? "top" : "bottom", transform: show ? "scaleY(1)" : "scaleY(0)", transition: `transform 800ms ${SPRING} ${300 + i * 160}ms` }}
            />
            <text x={x + 18} y={b.top - 5} textAnchor="middle" fontSize="8.5" className="font-gl-mono" fill={b.kind === "total" ? "var(--foreground)" : fill} style={{ opacity: show ? 1 : 0, transition: `opacity 400ms ease ${700 + i * 160}ms` }}>
              {b.kind === "total" ? `$${b.v}M` : `${b.v > 0 ? "+" : "−"}${Math.abs(b.v)}`}
            </text>
            <text x={x + 18} y="138" textAnchor="middle" fontSize="7.2" fill="var(--muted-foreground)">
              {b.k}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 04 Decide — the dashboard builds itself from gold                   */
/* ------------------------------------------------------------------ */

function Dashboard({ s }: { s: S }) {
  const dim = s.past("s5");
  const sel = s.past("kpiSel");
  return (
    <div className="absolute inset-0 p-4" style={{ opacity: dim ? 0.32 : 1, transform: dim ? "scale(0.985)" : "none", filter: dim ? "saturate(0.7)" : "none", transition: `opacity 700ms, transform 900ms ${SPRING}, filter 700ms` }}>
      <div className="grid grid-cols-4 gap-3">
        {KPIS.map((k, i) => (
          <div key={k.key} style={{ transitionDelay: `${i * 90}ms` }}>
            <Widget show={s.past("w1")} src={k.src} cid={`kpi-${k.key}`} selected={k.key === "fcf" && sel} pressed={k.key === "fcf" && s.between("pressKpi", "kpiSel")}>
              <p className="font-gl-mono text-[9px] uppercase tracking-[0.14em] text-gl-muted-foreground">{k.label}</p>
              <p className="mt-1.5 font-gl-display text-[22px] tabular-nums tracking-tight text-gl-foreground">{s.past("w1") ? <Tween value={k.value} from={0} format={k.fmt} duration={1500} /> : "—"}</p>
              <p className={`mt-1 text-[10.5px] ${k.tone === "gold" ? "text-gl-gold" : "text-gl-data"}`}>{k.delta}</p>
            </Widget>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-[1.55fr_1fr] gap-3">
        <Widget show={s.past("w2")} src="gold.fct_revenue · gold.fct_margin">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-[12px] text-gl-foreground">Revenue and gross margin · FY26</p>
            <span className="flex gap-3 text-[9.5px] text-gl-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-gl-data" />Revenue</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-gl-gold" />Margin</span>
            </span>
          </div>
          <PerfChart show={s.past("w2")} />
        </Widget>
        <Widget show={s.past("w3")} src="gold.fct_cash">
          <p className="mb-1 text-[12px] text-gl-foreground">Free cash flow bridge · QTD</p>
          <Bridge show={s.past("w3")} />
        </Widget>
      </div>
      <div className="mt-3 grid grid-cols-[1.55fr_1fr] gap-3">
        <Widget show={s.past("w4")} src="gold.dim_entity">
          <p className="mb-2 text-[12px] text-gl-foreground">Entities · harmonized to USD</p>
          <div className="grid grid-cols-[1fr_76px_54px_96px] border-b border-white/[0.07] pb-1 font-gl-mono text-[8.5px] uppercase tracking-[0.12em] text-gl-muted-foreground/80">
            <span>Entity</span>
            <span className="text-right">Revenue</span>
            <span className="text-right">vs plan</span>
            <span className="pl-3">Share</span>
          </div>
          {ENTITIES.map((e, i) => {
            const v = parseFloat(e.usd.replace(/[$M]/g, ""));
            const neg = e.plan.startsWith("−");
            return (
              <div key={e.name} className="grid grid-cols-[1fr_76px_54px_96px] items-center border-b border-white/[0.05] py-[7px] text-[11px]">
                <span className="flex items-center gap-2 text-gl-foreground/90">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: e.hue }} />
                  {e.name}
                </span>
                <span className="text-right font-gl-mono text-gl-foreground/80">{e.usd}</span>
                <span className={`text-right font-gl-mono ${neg ? "text-gl-gold" : "text-gl-data"}`}>{e.plan}</span>
                <span className="pl-3">
                  <span className="block h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <span className="block h-full origin-left rounded-full" style={{ width: `${(v / 460) * 100}%`, transform: `scaleX(${s.past("w4") ? 1 : 0})`, background: e.hue, transition: `transform 1000ms ${SPRING} ${400 + i * 120}ms` }} />
                  </span>
                </span>
              </div>
            );
          })}
          <div className="flex items-center justify-between pt-2 text-[11px]">
            <span className="text-gl-muted-foreground">Group · one definition</span>
            <span className="font-gl-display text-[14px] text-[oklch(0.86_0.13_78)]">$1.42B</span>
          </div>
        </Widget>
        <Widget show={s.past("w5")} src="lineage">
          <p className="mb-2.5 text-[12px] text-gl-foreground">Every number traces back</p>
          {[
            ["Free cash flow", "KPI", "oklch(0.86 0.13 78)"],
            ["gold.fct_cash", "GOLD", "oklch(0.8 0.15 75)"],
            ["silver.cash_movements", "SILVER", "oklch(0.88 0.02 254)"],
            ["bronze.gl_entries", "BRONZE", "oklch(0.72 0.11 62)"],
            ["SAP · NetSuite · Dynamics · Epicor", "RAW", "oklch(0.75 0.015 250)"],
          ].map(([t, tag, c], i) => (
            <div key={t} className="relative flex items-center gap-2.5 pb-[9px] pl-1" style={{ opacity: s.past("w5") ? 1 : 0, transform: s.past("w5") ? "none" : "translateX(-6px)", transition: `all 500ms ${SPRING} ${300 + i * 110}ms` }}>
              {i < 4 ? <span className="absolute left-[7px] top-[11px] h-[20px] w-px bg-white/15" /> : null}
              <span className="relative h-2 w-2 shrink-0 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
              <span className="min-w-0 flex-1 truncate font-gl-mono text-[10px] text-gl-foreground/85">{t}</span>
              <span className="font-gl-mono text-[8px] tracking-[0.14em]" style={{ color: c }}>
                {tag}
              </span>
            </div>
          ))}
        </Widget>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 05 Brief — Genius answers the CFO                                   */
/* ------------------------------------------------------------------ */

function BriefDrawer({ s, ask, typed }: { s: S; ask: AskState; typed: number }) {
  const open = s.between("s5", "s6");
  const thinking = s.between("think", "write");
  const writing = s.between("write", "facts");
  const len = segText(BRIEF).length;
  const orb = !s.past("asked") ? "holding" : thinking ? "thinking" : writing ? "typing" : "holding";
  return (
    <div
      className="absolute bottom-3 right-3 top-3 w-[400px] overflow-hidden rounded-[18px] border border-white/[0.12] bg-[linear-gradient(170deg,oklch(0.24_0.05_258/98%),oklch(0.16_0.035_264/98%))] p-5 shadow-[-30px_0_80px_-30px_rgb(0_0_0/0.85)]"
      style={{ transform: open ? "none" : "translateX(440px)", opacity: open ? 1 : 0, transition: `transform 900ms ${SPRING}, opacity 500ms` }}
    >
      <span className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,oklch(0.7_0.17_252/26%),transparent)]" />
      <div className="relative flex items-center gap-3">
        {s.past("s5") && !s.past("s6") ? <GeniusShaderOrb state={orb} size={50} /> : <span className="h-[50px] w-[50px]" />}
        <div className="flex-1">
          <p className="font-gl-display text-[14px] text-gl-foreground">Genius · Executive brief</p>
          <p key={orb} className="gfocus-tag text-[10.5px] text-gl-muted-foreground">
            {thinking ? "Reading gold.fct_cash · 48M rows · 3 sources…" : writing ? "Writing the brief…" : s.past("facts") ? "Brief ready · 96% confidence" : "Reading the gold layer"}
          </p>
        </div>
        <span className="font-gl-mono text-[9px] tracking-[0.12em] text-gl-muted-foreground/70">06:12</span>
      </div>

      <div className="relative mt-4 flex items-center gap-2 rounded-lg border border-[oklch(0.85_0.11_205/30%)] bg-[oklch(0.85_0.11_205/7%)] px-2.5 py-1.5">
        <span className="font-gl-mono text-[8.5px] uppercase tracking-[0.14em] text-[var(--cyan)]">Context</span>
        <span className="text-[11px] text-gl-foreground/90">Free cash flow · Q3 · −$4.2M vs budget</span>
      </div>

      <div className="relative mt-3">
        <AskBox ask={ask} cid="brief" />
      </div>

      <div className="relative mt-3 min-h-[86px]">
        {thinking ? (
          <div className="space-y-2 pt-1">
            <span className="gshimmer block h-2.5 w-[94%] rounded" />
            <span className="gshimmer block h-2.5 w-[82%] rounded" />
            <span className="gshimmer block h-2.5 w-[64%] rounded" />
          </div>
        ) : s.past("write") ? (
          <p className="text-[12.5px] leading-[1.65] text-gl-foreground/90">
            {renderSegments(BRIEF, typed)}
            {typed < len ? <span className="gcaret" /> : null}
          </p>
        ) : null}
      </div>

      <div className="relative mt-3 space-y-2">
        <p className="font-gl-mono text-[8.5px] uppercase tracking-[0.16em] text-gl-muted-foreground transition-opacity duration-500" style={{ opacity: s.past("facts") ? 1 : 0 }}>
          What moved the cash
        </p>
        {DRIVERS.map((d, i) => (
          <div key={d.k} className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2" style={{ opacity: s.past("facts") ? 1 : 0, transform: s.past("facts") ? "none" : "translateY(6px)", transition: `all 600ms ${SPRING} ${i * 140}ms` }}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gl-foreground/90">{d.k}</span>
              <span className="font-gl-mono" style={{ color: d.tone === "gold" ? "var(--gold)" : "var(--success)" }}>
                {d.v}
              </span>
            </div>
            <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <span className="block h-full origin-left rounded-full" style={{ width: `${d.w * 100}%`, transform: `scaleX(${s.past("facts") ? 1 : 0})`, background: d.tone === "gold" ? "var(--gold)" : "var(--success)", transition: `transform 900ms ${SPRING} ${200 + i * 140}ms` }} />
            </span>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-5 bottom-5" style={{ opacity: s.past("facts") ? 1 : 0, transform: s.past("facts") ? "none" : "translateY(8px)", transition: `all 600ms ${SPRING} 500ms` }}>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {["gold.fct_cash", "WMS · 3 sites", "AR ledger · 4.2k invoices"].map((t) => (
            <span key={t} className="rounded border border-white/10 px-1.5 py-0.5 font-gl-mono text-[8.5px] text-gl-muted-foreground">
              {t}
            </span>
          ))}
        </div>
        <span
          data-cursor="to-act"
          className={`flex items-center justify-between rounded-xl bg-gl-gold px-4 py-2.5 text-[12px] font-medium text-gl-background transition-all duration-200 ${s.between("toAct", "s6") ? "shadow-[0_0_0_5px_oklch(0.77_0.155_66/22%)] brightness-110" : ""} ${s.between("pressAct", "s6") ? "scale-[0.97]" : ""}`}
        >
          Build the action plan with the agents
          <span>→</span>
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 06 Act — agents propose, the CFO approves                           */
/* ------------------------------------------------------------------ */

const OK = ["ok1", "ok2", "ok3"] as const;
const TO = ["toA1", "toA2", "toA3"] as const;
const PRESS = ["pressA1", "pressA2", "pressA3"] as const;
const CARDS = ["c1", "c2", "c3"] as const;

function ActPage({ s }: { s: S }) {
  const shown = s.past("s6");
  const approved = OK.map((k) => s.past(k));
  const recovered = MOVES.reduce((sum, m, i) => sum + (approved[i] ? m.value : 0), 0);
  return (
    <div className="absolute inset-0 p-4" style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(14px)", transition: `opacity 700ms ease 200ms, transform 900ms ${SPRING} 200ms` }}>
      {/* header */}
      <div className="flex items-center justify-between rounded-[16px] border border-white/[0.08] bg-[linear-gradient(100deg,oklch(0.8_0.15_75/8%),oklch(1_0_0/2%))] px-4 py-3">
        <div className="flex items-center gap-3">
          {shown ? <GeniusShaderOrb state={s.past("ok3") ? "holding" : "typing"} size={44} tone="gold" /> : <span className="h-11 w-11" />}
          <div>
            <p className="font-gl-display text-[16px] tracking-tight text-gl-foreground">Action plan · close the cash gap before month-end</p>
            <p className="text-[11px] text-gl-muted-foreground">Genius and three executive agents worked it out from the brief · 9 days to close</p>
          </div>
        </div>
        <div className="w-[230px]">
          <div className="flex items-baseline justify-between">
            <span className="font-gl-mono text-[8.5px] uppercase tracking-[0.16em] text-gl-muted-foreground">Cash recovered</span>
            <span className="font-gl-display text-[17px] tabular-nums text-[var(--success)]">
              <Tween value={recovered} format={(n) => `$${n.toFixed(1)}M`} duration={900} />
              <span className="text-[11px] text-gl-muted-foreground"> / $4.2M</span>
            </span>
          </div>
          <div className="relative mt-1.5 flex h-2 gap-[2px] overflow-hidden rounded-full bg-white/[0.06]">
            {MOVES.map((m, i) => (
              <span key={m.agent} className="h-full origin-left rounded-full" style={{ width: `${(m.value / 4.2) * 100}%`, transform: `scaleX(${approved[i] ? 1 : 0})`, background: m.color, transition: `transform 900ms ${SPRING}` }} />
            ))}
          </div>
          <p className="mt-1 text-right font-gl-mono text-[8.5px] text-gl-muted-foreground">{Math.round((recovered / 4.2) * 100)}% of the gap covered</p>
        </div>
      </div>

      {/* the three moves */}
      <div className="mt-3.5 grid grid-cols-3 gap-3">
        {MOVES.map((m, i) => {
          const ok = approved[i];
          const hover = s.between(TO[i]!, OK[i]!);
          const press = s.between(PRESS[i]!, OK[i]!);
          const show = s.past(CARDS[i]!);
          return (
            <div
              key={m.agent}
              className="relative flex h-[478px] flex-col overflow-hidden rounded-[16px] border p-4"
              style={{
                opacity: show ? 1 : 0,
                transform: show ? "none" : "translateY(16px)",
                borderColor: ok ? "oklch(0.78 0.13 168 / 45%)" : hover ? `color-mix(in oklab, ${m.color} 55%, transparent)` : "oklch(1 0 0 / 9%)",
                background: "linear-gradient(175deg, oklch(0.23 0.04 260 / 92%), oklch(0.16 0.03 264 / 92%))",
                boxShadow: ok ? "0 0 40px -14px oklch(0.78 0.13 168 / 55%)" : "none",
                transition: `opacity 700ms ease, transform 900ms ${SPRING}, border-color 500ms, box-shadow 500ms`,
              }}
            >
              <span className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-30 blur-2xl" style={{ background: m.color }} />
              <div className="relative flex items-center gap-2.5">
                {show ? <GeniusShaderOrb state={ok ? "holding" : "thinking"} size={38} tint={m.tint} /> : <span className="h-[38px] w-[38px]" />}
                <div className="flex-1">
                  <p className="text-[12.5px] text-gl-foreground">{m.agent}</p>
                  <p className="text-[10px] text-gl-muted-foreground">{m.scope}</p>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 font-gl-mono text-[8.5px] uppercase tracking-[0.12em]"
                  style={{ background: ok ? "oklch(0.78 0.13 168 / 15%)" : "oklch(0.77 0.155 66 / 13%)", color: ok ? "var(--success)" : "var(--gold)" }}
                >
                  {ok ? "Executing" : "Proposed"}
                </span>
              </div>

              <p className="relative mt-4 min-h-[38px] text-[13.5px] leading-snug text-gl-foreground">{m.title}</p>
              <p className="relative mt-3 font-gl-display text-[28px] tabular-nums leading-none text-[var(--success)]">+${m.value.toFixed(1)}M</p>
              <p className="relative mt-1 text-[10px] text-gl-muted-foreground">cash before month-end close</p>

              <div className="relative mt-3 space-y-1 border-t border-white/[0.07] pt-2.5 text-[10.5px]">
                <p className="flex justify-between"><span className="text-gl-muted-foreground">Owner</span><span className="text-gl-foreground/90">{m.owner}</span></p>
                <p className="flex justify-between"><span className="text-gl-muted-foreground">Deadline</span><span className="text-gl-foreground/90">{m.due}</span></p>
              </div>

              <div className="relative mt-3 space-y-1.5">
                {m.steps.map((t, k) => (
                  <p key={t} className="flex items-center gap-2 text-[10.5px]">
                    <span
                      className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border text-[7px]"
                      style={{
                        borderColor: ok ? "var(--success)" : "oklch(1 0 0 / 20%)",
                        background: ok ? "var(--success)" : "transparent",
                        color: "var(--background)",
                        transition: `all 300ms ease ${ok ? 600 + k * 650 : 0}ms`,
                      }}
                    >
                      ✓
                    </span>
                    <span className="text-gl-foreground/80">{t}</span>
                  </p>
                ))}
              </div>

              <div className="relative mt-3 flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5">
                <span className="grid h-5 w-5 place-items-center rounded-[5px] bg-white/[0.92] p-[2px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoUrl(m.system.domain)} alt="" width={14} height={14} className="h-3.5 w-3.5 object-contain" />
                </span>
                <span className="flex-1 text-[10px] text-gl-muted-foreground">
                  Writes back to <span className="text-gl-foreground/85">{m.system.name}</span>
                </span>
                <span className="font-gl-mono text-[8.5px] transition-colors duration-500" style={{ color: ok && s.past("writeback") ? "var(--success)" : "var(--muted-foreground)" }}>
                  {ok && s.past("writeback") ? "✓ synced" : ok ? "queued" : "—"}
                </span>
              </div>

              <div className="relative mt-auto">
                <div className="mb-2.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">{ok ? <span className="fa-run block h-full rounded-full bg-[var(--success)]" /> : null}</div>
                <span
                  data-cursor={`approve-${i}`}
                  className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-[12px] font-medium transition-all duration-200"
                  style={{
                    background: ok ? "oklch(0.78 0.13 168 / 16%)" : "var(--gold)",
                    color: ok ? "var(--success)" : "var(--background)",
                    boxShadow: hover && !ok ? "0 0 0 5px oklch(0.77 0.155 66 / 20%)" : "none",
                    transform: press ? "scale(0.96)" : "none",
                    filter: hover && !ok ? "brightness(1.1)" : "none",
                  }}
                >
                  {ok ? "✓ Approved by Elena" : "Approve"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The window                                                          */
/* ------------------------------------------------------------------ */

export function ExecWindow({ s, ask, typed }: { s: S; ask: AskState; typed: number }) {
  const shown = s.past("s4");
  const page = s.past("s6") ? "act" : s.past("s5") ? "brief" : "dash";
  const tabs = [
    ["dash", "Dashboards"],
    ["brief", "Brief"],
    ["act", "Action plan"],
  ] as const;
  return (
    <div
      className="absolute overflow-hidden rounded-[20px] border border-white/[0.11] bg-[linear-gradient(170deg,oklch(0.2_0.035_262/97%),oklch(0.145_0.03_264/97%))] shadow-[0_60px_140px_-50px_rgb(0_0_0/0.95),inset_0_1px_0_oklch(1_0_0/7%)]"
      style={{
        left: WIN.x,
        top: WIN.y,
        width: WIN.w,
        height: WIN.h,
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateX(40px) scale(0.97)",
        transition: `opacity 800ms ease 600ms, transform 1100ms ${SPRING} 600ms`,
      }}
    >
      <div className="flex h-11 items-center justify-between border-b border-white/[0.07] px-4">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-2.5 w-2.5 rounded-full bg-white/[0.12]" />
            ))}
          </span>
          <span className="text-[12px] text-gl-foreground">Executive Operating System</span>
          <span className="text-[11px] text-gl-muted-foreground">· Meridian Holdings · FY26 Q3</span>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-white/[0.04] p-0.5">
          {tabs.map(([k, label]) => (
            <span key={k} className={`rounded-md px-2.5 py-1 text-[10.5px] transition-colors duration-500 ${page === k ? "bg-white/[0.1] text-gl-foreground" : "text-gl-muted-foreground"}`}>
              {label}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-md border border-[oklch(0.8_0.15_75/30%)] px-2 py-1 font-gl-mono text-[8.5px] uppercase tracking-[0.14em] text-[oklch(0.86_0.13_78)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.86_0.13_78)]" /> Live · from gold
          </span>
          <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.75_0.12_70)] to-[oklch(0.55_0.14_40)] text-[8.5px] font-semibold text-[oklch(0.15_0.03_264)]">EC</span>
        </div>
      </div>
      <div className="relative" style={{ height: WIN.h - 44 }}>
        <div className="absolute inset-0" style={{ opacity: page === "act" ? 0 : 1, transition: "opacity 600ms" }}>
          <Dashboard s={s} />
          <BriefDrawer s={s} ask={ask} typed={typed} />
        </div>
        <ActPage s={s} />
        <div
          className="absolute bottom-4 left-1/2 flex items-center gap-2.5 whitespace-nowrap rounded-full border border-[oklch(0.78_0.13_168/40%)] bg-[oklch(0.19_0.04_200/96%)] px-4 py-2 text-[11.5px] text-gl-foreground shadow-[0_20px_50px_-20px_rgb(0_0_0/0.8)]"
          style={{ opacity: s.past("toast") ? 1 : 0, transform: `translate(-50%, ${s.past("toast") ? 0 : 12}px)`, transition: `all 700ms ${SPRING}` }}
        >
          <span className="grid h-4 w-4 place-items-center rounded-full bg-[var(--success)] text-[9px] text-gl-background">✓</span>
          Plan approved · 3 agents executing · 7 owners notified · written back to SAP, Salesforce and Workday
        </div>
      </div>
    </div>
  );
}
