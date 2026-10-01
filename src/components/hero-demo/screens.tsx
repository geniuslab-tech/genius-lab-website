"use client";

import type { ReactNode } from "react";
import { Tween, Typewriter, smoothPath } from "./engine";
import {
  AgentOrb,
  Card,
  Check,
  DemoButton,
  Label,
  Spark,
  Spinner,
  StatusPill,
  SystemChip,
  type Status,
} from "./frame";

/* ------------------------------------------------------------------ */
/* Rich streamed text                                                  */
/* ------------------------------------------------------------------ */

export type Segment = { t: string; tone?: "data" | "gold" | "strong" };

export const segText = (segs: Segment[]) => segs.map((s) => s.t).join("");

/** Renders the first `n` characters of a list of styled segments. */
export function renderSegments(segs: Segment[], n: number): ReactNode {
  const out: ReactNode[] = [];
  let left = n;
  segs.forEach((s, i) => {
    if (left <= 0) return;
    const piece = s.t.slice(0, left);
    left -= s.t.length;
    const cls =
      s.tone === "data" ? "text-gl-data" : s.tone === "gold" ? "text-gl-gold" : s.tone === "strong" ? "text-gl-foreground font-medium" : "";
    out.push(
      <span key={i} className={cls}>
        {piece}
      </span>,
    );
  });
  return out;
}

/* ------------------------------------------------------------------ */
/* Performance screen                                                  */
/* ------------------------------------------------------------------ */

export type Kpi = {
  label: string;
  value: number;
  format: (n: number) => string;
  delta: string;
  status: Status;
  spark: number[];
  tone: "data" | "gold" | "success";
  flash?: boolean;
  id?: string;
};

export function KpiCard({ k, countFrom }: { k: Kpi; countFrom?: number }) {
  return (
    <Card
      className={`relative overflow-hidden p-3.5 transition-[box-shadow,border-color] duration-700 ${
        k.flash ? "border-[oklch(0.78_0.13_168/55%)] shadow-[0_0_0_3px_oklch(0.78_0.13_168/14%),0_0_40px_-10px_oklch(0.78_0.13_168/50%)]" : ""
      }`}
      {...(k.id ? { "data-cursor": k.id } : {})}
    >
      <Label>{k.label}</Label>
      <p className="mt-1.5 font-gl-display text-[1.32rem] tabular-nums tracking-tight text-gl-foreground">
        <Tween value={k.value} format={k.format} from={countFrom} duration={1400} />
      </p>
      <div className="mt-1.5 flex items-center justify-between">
        <span
          key={k.delta}
          className={`demo-fade-up text-[0.6rem] ${k.tone === "gold" ? "text-gl-gold" : k.tone === "success" ? "text-[var(--success)]" : "text-gl-data"}`}
        >
          {k.delta}
        </span>
        <Spark values={k.spark} tone={k.tone} />
      </div>
      <div className="mt-2">
        <StatusPill status={k.status} />
      </div>
    </Card>
  );
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP"];
const REV = [96, 99, 101, 99, 104, 108, 112, 110, 116, 121, 119, 125, 127.4, 131, 134];
const GM = [36.4, 36.5, 36.6, 36.3, 36.8, 37, 37.2, 37.1, 37.5, 37.8, 37.7, 38, 38.2, 38.4, 38.6];
const CH = { x0: 36, x1: 548, y0: 14, y1: 172 };

function plot(values: number[], min: number, max: number) {
  return values.map(
    (v, i) => [CH.x0 + (i / (values.length - 1)) * (CH.x1 - CH.x0), CH.y1 - ((v - min) / (max - min)) * (CH.y1 - CH.y0)] as const,
  );
}

/** Dual-axis revenue / margin chart that draws itself and shows a hover tooltip. */
export function PerformanceChart({ draw, hover, title = "Business performance — revenue and gross margin" }: { draw: boolean; hover: boolean; title?: string }) {
  const rev = plot(REV, 88, 140);
  const gm = plot(GM, 35.2, 41.5);
  const hi = 12;
  const rp = rev[hi]!;
  const revLine = smoothPath(rev);
  const gmLine = smoothPath(gm);
  return (
    <Card className="light-sweep h-full p-4">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-[0.72rem] text-gl-foreground">{title}</p>
          <p className="text-[0.58rem] text-gl-muted-foreground/65">Consolidated · 14 entities · weekly</p>
        </div>
        <div className="flex items-center gap-3 text-[0.58rem] text-gl-muted-foreground/80">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-gl-data" /> Revenue ($M)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-gl-gold" /> Gross margin %
          </span>
        </div>
      </div>
      <div className="relative">
        <svg viewBox="0 0 560 196" className="block h-[196px] w-full" aria-hidden="true">
          <defs>
            <linearGradient id="demoRevFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--data)" stopOpacity="0.32" />
              <stop offset="100%" stopColor="var(--data)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((i) => {
            const y = CH.y0 + (i / 3) * (CH.y1 - CH.y0);
            return (
              <g key={i}>
                <line x1={CH.x0} x2={CH.x1} y1={y} y2={y} stroke="var(--border)" strokeDasharray="2 5" />
                <text x={4} y={y + 3} className="font-gl-mono" fontSize="8" fill="var(--data)" opacity="0.8">
                  ${Math.round(140 - (i / 3) * 52)}M
                </text>
              </g>
            );
          })}
          <path
            d={`${revLine} L ${CH.x1} ${CH.y1} L ${CH.x0} ${CH.y1} Z`}
            fill="url(#demoRevFill)"
            style={{ opacity: draw ? 1 : 0, transition: "opacity 1.2s ease 0.8s" }}
          />
          <path
            d={revLine}
            fill="none"
            stroke="var(--data)"
            strokeWidth="2"
            pathLength={100}
            strokeDasharray="100"
            strokeDashoffset={draw ? 0 : 100}
            style={{ transition: draw ? "stroke-dashoffset 2s cubic-bezier(0.16,1,0.3,1)" : "none" }}
          />
          <path
            d={gmLine}
            fill="none"
            stroke="var(--gold)"
            strokeWidth="1.6"
            strokeDasharray={draw ? "none" : "0 1000"}
            pathLength={100}
            strokeDashoffset={0}
            style={{ opacity: draw ? 0.9 : 0, transition: "opacity 1s ease 0.6s" }}
          />
          {MONTHS.map((m, i) => (
            <text
              key={m}
              x={CH.x0 + (i / (MONTHS.length - 1)) * (CH.x1 - CH.x0)}
              y={190}
              textAnchor="middle"
              className="font-gl-mono"
              fontSize="8"
              fill="var(--muted-foreground)"
              opacity="0.7"
            >
              {m}
            </text>
          ))}
          <line
            x1={rp[0]}
            x2={rp[0]}
            y1={CH.y0}
            y2={CH.y1}
            stroke="var(--muted-foreground)"
            strokeDasharray="3 3"
            style={{ opacity: hover ? 0.6 : 0, transition: "opacity .3s" }}
          />
          <circle cx={rp[0]} cy={rp[1]} r={hover ? 4 : 0} fill="var(--data)" style={{ transition: "r .3s" }} />
          <circle cx={rp[0]} cy={rp[1]} r={hover ? 10 : 0} fill="var(--data)" opacity="0.18" style={{ transition: "r .3s" }} />
        </svg>
        {/* HTML anchor so the cursor can find the data point */}
        <span
          data-cursor="chart-point"
          className="absolute h-2 w-2"
          style={{ left: `${(rp[0] / 560) * 100}%`, top: `${(rp[1] / 196) * 100}%`, transform: "translate(-50%,-50%)" }}
        />
        <div
          className="absolute w-[150px] rounded-lg border border-gl-border bg-[oklch(0.13_0.03_264/95%)] p-2.5 shadow-xl transition-all duration-300"
          style={{
            left: `${(rp[0] / 560) * 100}%`,
            top: `${(rp[1] / 196) * 100}%`,
            transform: `translate(-110%, -105%) ${hover ? "scale(1)" : "scale(0.94)"}`,
            opacity: hover ? 1 : 0,
          }}
        >
          <p className="font-gl-mono text-[0.52rem] uppercase tracking-[0.12em] text-gl-muted-foreground/70">Aug · week 2</p>
          <div className="mt-1 flex justify-between text-[0.6rem]">
            <span className="text-gl-muted-foreground">Revenue</span>
            <span className="font-gl-mono text-gl-data">$127.4M</span>
          </div>
          <div className="flex justify-between text-[0.6rem]">
            <span className="text-gl-muted-foreground">Gross margin</span>
            <span className="font-gl-mono text-gl-gold">38.2%</span>
          </div>
          <div className="flex justify-between text-[0.6rem]">
            <span className="text-gl-muted-foreground">vs budget</span>
            <span className="font-gl-mono text-gl-foreground">+6.2%</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

const UNITS = [
  { name: "Industrial — North", rev: "$482.6M", plan: "+8.1%", tone: "data" as const, s: [3, 4, 4, 5, 6, 6, 7] },
  { name: "Industrial — Southeast", rev: "$311.4M", plan: "−2.4%", tone: "gold" as const, s: [6, 6, 5, 5, 4, 4, 3] },
  { name: "Distribution — EMEA", rev: "$268.9M", plan: "+11.3%", tone: "data" as const, s: [2, 3, 4, 4, 5, 6, 7] },
  { name: "Retail — Direct", rev: "$214.7M", plan: "+4.7%", tone: "data" as const, s: [4, 4, 5, 5, 5, 6, 6] },
];

export function UnitTable({ highlight }: { highlight?: number }) {
  return (
    <Card className="h-full p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[0.72rem] text-gl-foreground">Performance by business unit</p>
        <span className="font-gl-mono text-[0.56rem] text-gl-muted-foreground/60">QTD · vs budget</span>
      </div>
      <div className="grid grid-cols-[1fr_80px_60px_80px] border-b border-gl-border/70 pb-1.5 text-[0.54rem] uppercase tracking-[0.1em] text-gl-muted-foreground/60">
        <span>Business unit</span>
        <span className="text-right">Revenue</span>
        <span className="text-right">vs plan</span>
        <span className="text-right">Trend</span>
      </div>
      {UNITS.map((u, i) => (
        <div
          key={u.name}
          className={`grid grid-cols-[1fr_80px_60px_80px] items-center border-b border-gl-border/40 py-[9px] text-[0.66rem] transition-colors duration-500 ${
            highlight === i ? "bg-gl-gold/8" : ""
          }`}
        >
          <span className="flex items-center gap-2 text-gl-foreground">
            <span className={`h-1.5 w-1.5 rounded-full ${u.tone === "gold" ? "bg-gl-gold" : "bg-gl-data"}`} />
            {u.name}
          </span>
          <span className="text-right font-gl-mono text-gl-muted-foreground">{u.rev}</span>
          <span className={`text-right font-gl-mono ${u.tone === "gold" ? "text-gl-gold" : "text-gl-data"}`}>{u.plan}</span>
          <span className="flex justify-end">
            <Spark values={u.s} tone={u.tone} w={64} h={18} />
          </span>
        </div>
      ))}
    </Card>
  );
}

export function PerformanceScreen({
  kpis,
  draw,
  hover,
  side,
  countUp,
  highlightRow,
}: {
  kpis: Kpi[];
  draw: boolean;
  hover: boolean;
  side: ReactNode;
  countUp: boolean;
  highlightRow?: number;
}) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid grid-cols-4 gap-3">
        {kpis.map((k) => (
          <KpiCard key={k.label} k={k} countFrom={countUp ? 0 : undefined} />
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[1fr_392px] gap-3">
        <div className="flex min-h-0 flex-col gap-3">
          <div className="h-[268px]">
            <PerformanceChart draw={draw} hover={hover} />
          </div>
          <div className="min-h-0 flex-1">
            <UnitTable highlight={highlightRow} />
          </div>
        </div>
        <div className="min-h-0">{side}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Agent briefing panel                                                */
/* ------------------------------------------------------------------ */

export type AgentPhase = "idle" | "thinking" | "writing" | "waiting" | "approved" | "done";

export type Proposal = {
  title: string;
  metrics: { label: string; value: string; tone?: "data" | "gold" | "success" }[];
  policy: string;
};

const phaseCopy: Record<AgentPhase, string> = {
  idle: "Monitoring 14 entities",
  thinking: "Analysing 2.4M transactions…",
  writing: "Writing recommendation…",
  waiting: "Waiting for your approval",
  approved: "Executing across 4 systems",
  done: "Executed · logged to audit trail",
};

export function AgentBriefing({
  phase,
  context,
  insightLabel,
  message,
  evidence,
  proposal,
  approveHover,
  approvePressed,
  approvedBy = "Approved by Elena Costa · 14:02 · audit #A-90412",
  loopKey,
}: {
  phase: AgentPhase;
  context: string;
  insightLabel: string;
  message: Segment[];
  evidence: string[];
  proposal: Proposal;
  approveHover: boolean;
  approvePressed: boolean;
  approvedBy?: string;
  loopKey: number;
}) {
  const writing = phase === "writing";
  const written = phase === "waiting" || phase === "approved" || phase === "done";
  const showProposal = written;
  const approved = phase === "approved" || phase === "done";
  const orbState = phase === "approved" ? "writing" : phase === "done" ? "done" : phase === "idle" ? "idle" : phase;
  return (
    <Card className="relative flex h-full flex-col overflow-hidden p-4" data-cursor="briefing">
      <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,oklch(0.7_0.17_252/18%),transparent_70%)]" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <AgentOrb state={orbState} />
          <div>
            <p className="text-[0.74rem] font-medium text-gl-foreground">Genius Agent</p>
            <p key={phase} className="demo-fade-up flex items-center gap-1.5 text-[0.6rem] text-gl-muted-foreground">
              {phase === "thinking" || phase === "approved" ? <Spinner className="h-2 w-2 text-gl-data" /> : null}
              {phaseCopy[phase]}
            </p>
          </div>
        </div>
        <span className="font-gl-mono text-[0.56rem] uppercase tracking-[0.14em] text-gl-muted-foreground/60">Briefing · 14:01</span>
      </div>

      <p className="relative mt-3.5 text-[0.66rem] leading-relaxed text-gl-muted-foreground">{context}</p>

      <div className="relative mt-3 flex items-center gap-2">
        <span className="h-px flex-1 bg-gl-border" />
        <span className="font-gl-mono text-[0.54rem] uppercase tracking-[0.16em] text-gl-gold">{insightLabel}</span>
        <span className="h-px flex-1 bg-gl-border" />
      </div>

      <div className="relative mt-3 min-h-[86px] text-[0.72rem] leading-[1.6] text-gl-foreground/90">
        {phase === "thinking" ? (
          <div className="space-y-2 pt-1">
            <span className="demo-shimmer block h-2 w-[92%] rounded" />
            <span className="demo-shimmer block h-2 w-[78%] rounded [animation-delay:.15s]" />
            <span className="demo-shimmer block h-2 w-[64%] rounded [animation-delay:.3s]" />
          </div>
        ) : (
          <Typewriter
            key={loopKey}
            text={segText(message)}
            play={writing}
            done={written}
            cps={58}
            renderText={(v) => renderSegments(message, v.length)}
          />
        )}
      </div>

      <div className={`relative mt-2 flex flex-wrap gap-1.5 transition-all duration-500 ${written ? "opacity-100" : "opacity-0"}`}>
        {evidence.map((e, i) => (
          <span
            key={e}
            className="rounded border border-gl-border/80 bg-gl-background/40 px-1.5 py-0.5 font-gl-mono text-[0.52rem] text-gl-muted-foreground"
            style={{ transitionDelay: `${i * 90}ms` }}
          >
            {e}
          </span>
        ))}
      </div>

      <div
        className={`relative mt-auto rounded-xl border p-3.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          showProposal ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        } ${approved ? "border-[oklch(0.78_0.13_168/40%)] bg-[oklch(0.78_0.13_168/6%)]" : "border-gl-gold/35 bg-gl-gold/[0.06]"}`}
      >
        <div className="flex items-center justify-between">
          <span className="font-gl-mono text-[0.54rem] uppercase tracking-[0.14em] text-gl-gold">Recommended action</span>
          <span className="font-gl-mono text-[0.54rem] text-gl-muted-foreground/70">{proposal.policy}</span>
        </div>
        <p className="mt-1.5 text-[0.76rem] font-medium text-gl-foreground">{proposal.title}</p>
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {proposal.metrics.map((m) => (
            <div key={m.label} className="rounded-md bg-gl-background/50 px-2 py-1.5">
              <p className="text-[0.52rem] uppercase tracking-[0.1em] text-gl-muted-foreground/70">{m.label}</p>
              <p
                className={`font-gl-mono text-[0.7rem] ${m.tone === "gold" ? "text-gl-gold" : m.tone === "success" ? "text-[var(--success)]" : m.tone === "data" ? "text-gl-data" : "text-gl-foreground"}`}
              >
                {m.value}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          {approved ? (
            <span key="ok" className="demo-fade-up text-[0.6rem] text-[var(--success)]">
              {approvedBy}
            </span>
          ) : (
            <span className="text-[0.6rem] text-gl-muted-foreground">Requires your approval</span>
          )}
          <div className="flex items-center gap-2">
            {!approved ? <DemoButton tone="ghost">Review</DemoButton> : null}
            {approved ? (
              <DemoButton id="approve" tone="success">
                <Check className="h-3 w-3" /> Approved
              </DemoButton>
            ) : (
              <DemoButton id="approve" hover={approveHover} pressed={approvePressed}>
                Approve
              </DemoButton>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Execution screen                                                    */
/* ------------------------------------------------------------------ */

export type ExecStep = { code: string; system: string; title: string; detail: string; time: string; log: string };

export function ExecutionScreen({
  decisionId,
  decisionTitle,
  steps,
  done,
  impact,
  elapsed,
  ctaHover,
  ctaPressed,
  ctaLabel = "View impact in Performance",
  watch = [
    ["EMEA sell-through", "alert < 80%"],
    ["Southeast service level", "alert < 97%"],
    ["Cash receipts", "daily"],
  ],
}: {
  decisionId: string;
  decisionTitle: string;
  steps: ExecStep[];
  /** number of completed steps */
  done: number;
  impact: ReactNode;
  elapsed: number;
  ctaHover: boolean;
  ctaPressed: boolean;
  ctaLabel?: string;
  watch?: [string, string][];
}) {
  const complete = done >= steps.length;
  return (
    <div className="flex h-full flex-col gap-3">
      <Card className="relative overflow-hidden p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-gl-mono text-[0.56rem] uppercase tracking-[0.14em] text-gl-muted-foreground/70">Decision {decisionId}</span>
              <span
                key={complete ? "c" : "e"}
                className={`demo-pop inline-flex items-center gap-1.5 rounded-md border px-1.5 py-[2px] text-[0.54rem] uppercase tracking-[0.1em] ${
                  complete
                    ? "border-[oklch(0.78_0.13_168/40%)] bg-[oklch(0.78_0.13_168/10%)] text-[var(--success)]"
                    : "border-gl-data/40 bg-gl-data/10 text-gl-data"
                }`}
              >
                {complete ? <Check className="h-2.5 w-2.5" /> : <Spinner className="h-2 w-2" />}
                {complete ? "Completed" : "Executing"}
              </span>
            </div>
            <p className="mt-1.5 font-gl-display text-[1.02rem] tracking-tight text-gl-foreground">{decisionTitle}</p>
            <p className="mt-0.5 text-[0.62rem] text-gl-muted-foreground">Approved by Elena Costa (CFO) · orchestrated by Genius Agent</p>
          </div>
          <div className="text-right">
            <Label>Approval → execution</Label>
            <p className="mt-1 font-gl-display text-[1.4rem] tabular-nums tracking-tight text-gl-foreground">
              <Tween value={elapsed} format={(n) => `${Math.round(n)}s`} duration={900} />
            </p>
          </div>
        </div>
        <div className="mt-3.5 h-1 overflow-hidden rounded-full bg-gl-foreground/8">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--data)] to-[var(--success)] transition-[width] duration-700 ease-out"
            style={{ width: `${(done / steps.length) * 100}%` }}
          />
        </div>
      </Card>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_380px] gap-3">
        <Card className="flex min-h-0 flex-col p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[0.72rem] text-gl-foreground">Execution plan</p>
            <span className="font-gl-mono text-[0.56rem] text-gl-muted-foreground/60">
              {Math.min(done, steps.length)}/{steps.length} steps
            </span>
          </div>
          <div className="relative flex flex-col">
            <span className="absolute bottom-6 left-[13px] top-6 w-px bg-gl-border" />
            {steps.map((s, i) => {
              const state = i < done ? "done" : i === done ? "running" : "queued";
              return (
                <div
                  key={s.title}
                  className={`relative flex items-center gap-3 rounded-lg px-0 py-[12px] transition-all duration-500 ${state === "queued" ? "opacity-45" : "opacity-100"}`}
                >
                  <SystemChip code={s.code} tone={state === "done" ? "success" : state === "running" ? "data" : "muted"} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.7rem] text-gl-foreground">
                      <span className="text-gl-muted-foreground">{s.system} · </span>
                      {s.title}
                    </p>
                    <p className="truncate font-gl-mono text-[0.56rem] text-gl-muted-foreground/70">{s.detail}</p>
                  </div>
                  <span className="w-[70px] text-right font-gl-mono text-[0.58rem]">
                    {state === "done" ? (
                      <span key="d" className="demo-pop inline-flex items-center gap-1 text-[var(--success)]">
                        <Check className="h-3 w-3" />
                        {s.time}
                      </span>
                    ) : state === "running" ? (
                      <span className="inline-flex items-center gap-1.5 text-gl-data">
                        <Spinner className="h-2.5 w-2.5" /> running
                      </span>
                    ) : (
                      <span className="text-gl-muted-foreground/60">queued</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-auto rounded-lg border border-gl-border/60 bg-[oklch(0.11_0.025_264/80%)] p-2.5 font-gl-mono text-[0.56rem] leading-[1.7]">
            {steps.slice(0, Math.min(done + 1, steps.length)).map((s, i) => (
              <p key={s.log} className="demo-fade-up truncate">
                <span className="text-gl-muted-foreground/50">14:02:{String(4 + i * 7).padStart(2, "0")}</span>{" "}
                <span className={i < done ? "text-[var(--success)]" : "text-gl-data"}>{i < done ? "ok " : "→  "}</span>
                <span className="text-gl-muted-foreground">{s.log}</span>
              </p>
            ))}
          </div>
        </Card>

        <div className="flex min-h-0 flex-col gap-3">
          {impact}
          <Card className="p-3.5">
            <Label>Governance</Label>
            <div className="mt-2 space-y-1.5 text-[0.62rem]">
              {[
                ["Approver", "Elena Costa · CFO"],
                ["Policy", "Within delegated authority"],
                ["Rollback", "Available for 72h"],
                ["Audit", "Every action signed & logged"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gl-muted-foreground">{k}</span>
                  <span className="text-gl-foreground">{v}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-3.5">
            <Label>Genius keeps watching</Label>
            <div className="mt-2 space-y-1.5 text-[0.62rem]">
              {watch.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-gl-foreground">
                    <span className="h-1 w-1 rounded-full bg-gl-data" />
                    {k}
                  </span>
                  <span className="font-gl-mono text-[0.56rem] text-gl-muted-foreground">{v}</span>
                </div>
              ))}
            </div>
          </Card>
          <div className={`mt-auto flex justify-end transition-all duration-500 ${complete ? "opacity-100" : "translate-y-2 opacity-0"}`}>
            <DemoButton id="view-impact" tone="data" hover={ctaHover} pressed={ctaPressed} className="w-full py-2">
              {ctaLabel} →
            </DemoButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Before → after bar comparison used in impact cards. */
export function ImpactCard({
  label,
  before,
  after,
  showAfter,
  format,
  note,
  scaleMax,
}: {
  label: string;
  before: number;
  after: number;
  showAfter: boolean;
  format: (n: number) => string;
  note: string;
  scaleMax: number;
}) {
  const v = showAfter ? after : before;
  return (
    <Card className="relative overflow-hidden p-3.5">
      <Label>{label}</Label>
      <p className={`mt-1.5 font-gl-display text-[1.5rem] tabular-nums tracking-tight transition-colors duration-700 ${showAfter ? "text-[var(--success)]" : "text-gl-gold"}`}>
        <Tween value={v} format={format} duration={1500} />
      </p>
      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-gl-foreground/8">
        <div
          className={`h-full rounded-full transition-[width,background-color] duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${showAfter ? "bg-[var(--success)]" : "bg-gl-gold"}`}
          style={{ width: `${(Math.abs(v) / scaleMax) * 100}%` }}
        />
      </div>
      <p className="mt-2 text-[0.6rem] text-gl-muted-foreground">{note}</p>
    </Card>
  );
}
