"use client";

import { useEffect, useRef } from "react";
import { Cursor, ScaledStage, Tween, fmt, smoothPath, useScene, type CursorTarget } from "./engine";
import { Card, Check, DemoButton, DemoFrame, Label, STAGE_H, STAGE_W, Screen, Spinner, SystemChip, Toast } from "./frame";
import { AgentBriefing, KpiCard, type AgentPhase, type Kpi, type Segment } from "./screens";

/*
 * Storyboard — "Margin leak found and fixed before the quarter closes"
 *  1. Detect     Margin & Cost is open. One business unit's margin line breaks away; an anomaly pulses.
 *  2. Diagnose   The user clicks it. Genius explains the leak: discounting on long-tail SKUs.
 *  3. Approve    It proposes a price floor on 1,284 SKUs worth $8.6M a year. The user approves.
 *  4. Roll out   Prices update across ERP, CPQ, portal and distributor feeds, with a live SKU counter.
 *  5. Protect    Back on Margin & Cost, the projected line bends up and guardrails stay armed.
 */
export const MARGIN_CUES = {
  start: 0,
  enter: 600,
  press: 1900,
  popover: 2150,
  think: 3400,
  write: 4500,
  proposal: 8900,
  toApprove: 9800,
  approvePress: 10900,
  approved: 11150,
  toRoll: 12200,
  ch1: 12900,
  ch2: 13700,
  ch3: 14500,
  ch4: 15300,
  ch5: 16100,
  projected: 16600,
  toCta: 18200,
  ctaPress: 19200,
  back: 19450,
  toast: 20000,
  exit: 23800,
} as const;
export const MARGIN_LOOP = 25500;

export type MarginChapter = "detect" | "diagnose" | "approve" | "rollout" | "protect";
export const MARGIN_CHAPTERS: { key: MarginChapter; title: string }[] = [
  { key: "detect", title: "Detect" },
  { key: "diagnose", title: "Diagnose" },
  { key: "approve", title: "Approve" },
  { key: "rollout", title: "Roll out" },
  { key: "protect", title: "Protect" },
];

const MESSAGE: Segment[] = [
  { t: "Southeast margin fell " },
  { t: "2.6pp in six weeks", tone: "gold" },
  { t: ". It is not cost — it is " },
  { t: "discounting on 1,284 long-tail SKUs", tone: "strong" },
  { t: " that reps price by hand. Competitor list prices rose 4%, so a " },
  { t: "price floor recovers 120bp", tone: "data" },
  { t: " with no measurable volume risk." },
];

const CHANNELS = [
  { code: "ERP", name: "ERP price list", detail: "PL-SE-Q3 · 1,284 lines" },
  { code: "CPQ", name: "Quote engine", detail: "418 open quotes re-floored" },
  { code: "B2B", name: "B2B portal", detail: "Customer price books" },
  { code: "EDI", name: "Distributor feeds", detail: "6 partners · EDI 832" },
  { code: "CRM", name: "Sales brief", detail: "64 reps · talk track + floor" },
];

/* 12 weeks of margin by unit */
const WEEKS = 12;
const LINES = [
  { name: "Industrial — North", tone: "data", v: [41, 41.2, 41.1, 41.4, 41.3, 41.5, 41.4, 41.6, 41.5, 41.7, 41.6, 41.8] },
  { name: "Distribution — EMEA", tone: "muted", v: [36.2, 36.4, 36.3, 36.1, 36.4, 36.5, 36.3, 36.6, 36.5, 36.4, 36.6, 36.7] },
  { name: "Industrial — Southeast", tone: "gold", v: [36.4, 36.5, 36.3, 36.4, 36.2, 35.8, 35.2, 34.9, 34.5, 34.2, 34, 33.8] },
] as const;
const PROJ = [33.8, 34.3, 34.8, 35.0];
const MC = { x0: 34, x1: 520, y0: 12, y1: 200, min: 32.5, max: 43 };
const mx = (i: number, n = WEEKS + PROJ.length - 1) => MC.x0 + (i / n) * (MC.x1 - MC.x0);
const my = (v: number) => MC.y1 - ((v - MC.min) / (MC.max - MC.min)) * (MC.y1 - MC.y0);

function MarginChart({ popover, resolved, projected }: { popover: boolean; resolved: boolean; projected: boolean }) {
  const anomalyIdx = 6;
  const ax = mx(anomalyIdx);
  const ay = my(LINES[2].v[anomalyIdx]);
  const proj = PROJ.map((v, i) => [mx(WEEKS - 1 + i), my(v)] as const);
  return (
    <Card className="relative h-full p-4">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <p className="text-[0.72rem] text-gl-foreground">Gross margin by business unit</p>
          <p className="text-[0.58rem] text-gl-muted-foreground/65">Weekly · % of net revenue · 12 weeks + 3 projected</p>
        </div>
        <div className="flex items-center gap-3 text-[0.56rem] text-gl-muted-foreground/80">
          {LINES.map((l) => (
            <span key={l.name} className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${l.tone === "gold" ? "bg-gl-gold" : l.tone === "data" ? "bg-gl-data" : "bg-gl-muted-foreground/60"}`} />
              {l.name}
            </span>
          ))}
        </div>
      </div>
      <div className="relative">
        <svg viewBox="0 0 540 214" className="block h-[214px] w-full" aria-hidden="true">
          {[34, 37, 40, 43].map((t) => (
            <g key={t}>
              <line x1={MC.x0} x2={MC.x1} y1={my(t)} y2={my(t)} stroke="var(--border)" strokeDasharray="2 5" />
              <text x={2} y={my(t) + 3} className="font-gl-mono" fontSize="8" fill="var(--muted-foreground)" opacity="0.7">
                {t}%
              </text>
            </g>
          ))}
          <rect x={mx(WEEKS - 1)} y={MC.y0} width={MC.x1 - mx(WEEKS - 1)} height={MC.y1 - MC.y0} fill="var(--data)" opacity="0.04" />
          <text x={mx(WEEKS - 1) + 6} y={MC.y0 + 10} className="font-gl-mono" fontSize="7.5" fill="var(--muted-foreground)" opacity="0.7">
            PROJECTED
          </text>
          {LINES.map((l) => (
            <path
              key={l.name}
              d={smoothPath(l.v.map((v, i) => [mx(i), my(v)] as const))}
              fill="none"
              stroke={l.tone === "gold" ? "var(--gold)" : l.tone === "data" ? "var(--data)" : "var(--muted-foreground)"}
              strokeWidth={l.tone === "gold" ? 2.2 : 1.5}
              opacity={l.tone === "muted" ? 0.55 : 0.95}
            />
          ))}
          {/* projected recovery */}
          <path
            d={smoothPath(proj)}
            fill="none"
            stroke="var(--success)"
            strokeWidth="2.2"
            strokeDasharray="4 4"
            pathLength={100}
            style={{ opacity: projected ? 1 : 0, transition: "opacity .8s ease" }}
          />
          {proj.map(([x, y], i) =>
            i === proj.length - 1 ? (
              <circle key={i} cx={x} cy={y} r={projected ? 3.5 : 0} fill="var(--success)" style={{ transition: "r .4s .4s" }} />
            ) : null,
          )}
          {/* anomaly */}
          <circle cx={ax} cy={ay} r="4" fill={resolved ? "var(--success)" : "var(--gold)"} />
          {!resolved ? <circle cx={ax} cy={ay} r="11" fill="none" stroke="var(--gold)" strokeWidth="1.4" className="demo-anomaly" /> : null}
          {["W1", "W3", "W5", "W7", "W9", "W11", "W13", "W15"].map((w, i) => (
            <text key={w} x={mx(i * 2)} y={212} textAnchor="middle" className="font-gl-mono" fontSize="7.5" fill="var(--muted-foreground)" opacity="0.6">
              {w}
            </text>
          ))}
        </svg>
        <span
          data-cursor="anomaly"
          className="absolute h-3 w-3"
          style={{ left: `${(ax / 540) * 100}%`, top: `${(ay / 214) * 100}%`, transform: "translate(-50%,-50%)" }}
        />
        <div
          className="absolute w-[196px] rounded-lg border border-gl-gold/40 bg-[oklch(0.13_0.03_264/96%)] p-2.5 shadow-xl transition-all duration-300"
          style={{
            left: `${(ax / 540) * 100}%`,
            top: `${(ay / 214) * 100}%`,
            transform: `translate(14px, -112%) ${popover ? "scale(1)" : "scale(0.94)"}`,
            opacity: popover ? 1 : 0,
          }}
        >
          <p className="font-gl-mono text-[0.52rem] uppercase tracking-[0.12em] text-gl-gold">Anomaly · week 7</p>
          <p className="mt-1 text-[0.64rem] text-gl-foreground">Southeast margin −2.6pp vs trend</p>
          <p className="mt-0.5 text-[0.58rem] text-gl-muted-foreground">$2.1M at risk this quarter · 3.9σ</p>
        </div>
      </div>
    </Card>
  );
}

const BRIDGE = [
  { k: "Budget", v: 36.4, kind: "total" },
  { k: "Price", v: -1.9, kind: "neg" },
  { k: "Mix", v: -0.4, kind: "neg" },
  { k: "Freight", v: -0.3, kind: "neg" },
  { k: "Actual", v: 33.8, kind: "total" },
] as const;

function MarginBridge({ highlight }: { highlight: boolean }) {
  const base = 33;
  const top = 36.8;
  const h = 120;
  const y = (v: number) => h - ((v - base) / (top - base)) * h;
  const spans: [number, number][] = [];
  let run = 36.4;
  for (const b of BRIDGE) {
    if (b.kind === "total") spans.push([y(b.v), h]);
    else {
      spans.push([y(run), y(run + b.v)]);
      run += b.v;
    }
  }
  return (
    <Card className="h-full p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[0.72rem] text-gl-foreground">Margin bridge — Southeast, QTD</p>
        <span className="font-gl-mono text-[0.56rem] text-gl-muted-foreground/60">pp of net revenue</span>
      </div>
      <div className="flex h-[150px] items-end gap-5 px-2">
        {BRIDGE.map((b, i) => {
          const [y0, y1] = spans[i]!;
          const isPrice = b.k === "Price";
          return (
            <div key={b.k} className="flex flex-1 flex-col items-center gap-1.5">
              <span className={`font-gl-mono text-[0.58rem] ${b.kind === "neg" ? "text-gl-gold" : "text-gl-foreground"}`}>
                {b.kind === "neg" ? b.v.toFixed(1) : `${b.v.toFixed(1)}%`}
              </span>
              <div className="relative mx-auto w-full max-w-[64px]" style={{ height: h }}>
                <div
                  className={`absolute inset-x-0 rounded-[3px] transition-all duration-500 ${
                    b.kind === "total" ? "bg-gl-data/70" : isPrice && highlight ? "bg-gl-gold shadow-[0_0_18px_-2px_var(--gold)]" : "bg-gl-gold/55"
                  }`}
                  style={{ top: y0, height: Math.max(3, y1 - y0) }}
                />
              </div>
              <span className="text-[0.58rem] text-gl-muted-foreground">{b.k}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function RolloutScreen({ done, projected, ctaHover, ctaPressed }: { done: number; projected: boolean; ctaHover: boolean; ctaPressed: boolean }) {
  const skus = [0, 312, 640, 905, 1130, 1284][done]!;
  const complete = done >= CHANNELS.length;
  return (
    <div className="flex h-full flex-col gap-3">
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-gl-mono text-[0.56rem] uppercase tracking-[0.14em] text-gl-muted-foreground/70">Automation AU-771</span>
              <span
                key={complete ? "c" : "r"}
                className={`demo-pop inline-flex items-center gap-1.5 rounded-md border px-1.5 py-[2px] text-[0.54rem] uppercase tracking-[0.1em] ${
                  complete ? "border-[oklch(0.78_0.13_168/40%)] bg-[oklch(0.78_0.13_168/10%)] text-[var(--success)]" : "border-gl-data/40 bg-gl-data/10 text-gl-data"
                }`}
              >
                {complete ? <Check className="h-2.5 w-2.5" /> : <Spinner className="h-2 w-2" />}
                {complete ? "Live" : "Rolling out"}
              </span>
            </div>
            <p className="mt-1.5 font-gl-display text-[1.02rem] tracking-tight text-gl-foreground">Price floor — Southeast long-tail SKUs</p>
            <p className="mt-0.5 text-[0.62rem] text-gl-muted-foreground">Approved by Elena Costa (CFO) · floor = cost + 22% · exceptions need VP Sales</p>
          </div>
          <div className="text-right">
            <Label>SKUs repriced</Label>
            <p className="mt-1 font-gl-display text-[1.6rem] tabular-nums tracking-tight text-gl-foreground">
              <Tween value={skus} format={fmt.int} duration={800} />
              <span className="text-[0.9rem] text-gl-muted-foreground"> / 1,284</span>
            </p>
          </div>
        </div>
      </Card>
      <div className="grid min-h-0 flex-1 grid-cols-[1fr_380px] gap-3">
        <Card className="flex flex-col p-4">
          <p className="mb-2 text-[0.72rem] text-gl-foreground">Systems updated</p>
          <div className="flex flex-1 flex-col justify-around">
            {CHANNELS.map((c, i) => {
              const state = i < done ? "done" : i === done ? "running" : "queued";
              return (
                <div key={c.code} className={`transition-opacity duration-500 ${state === "queued" ? "opacity-45" : ""}`}>
                  <div className="flex items-center gap-3">
                    <SystemChip code={c.code} tone={state === "done" ? "success" : state === "running" ? "data" : "muted"} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[0.7rem] text-gl-foreground">{c.name}</p>
                        <span className="font-gl-mono text-[0.58rem]">
                          {state === "done" ? (
                            <span key="d" className="demo-pop inline-flex items-center gap-1 text-[var(--success)]">
                              <Check className="h-3 w-3" /> synced
                            </span>
                          ) : state === "running" ? (
                            <span className="inline-flex items-center gap-1.5 text-gl-data">
                              <Spinner className="h-2.5 w-2.5" /> syncing
                            </span>
                          ) : (
                            <span className="text-gl-muted-foreground/60">queued</span>
                          )}
                        </span>
                      </div>
                      <p className="font-gl-mono text-[0.56rem] text-gl-muted-foreground/70">{c.detail}</p>
                      <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-gl-foreground/8">
                        <div
                          className={`h-full rounded-full transition-[width] ease-out ${state === "done" ? "w-full bg-[var(--success)] duration-300" : state === "running" ? "w-[70%] bg-gl-data duration-[800ms]" : "w-0"}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <div className="flex flex-col gap-3">
          <Card className="p-3.5">
            <Label>Southeast gross margin</Label>
            <p className={`mt-1.5 font-gl-display text-[1.5rem] tabular-nums tracking-tight transition-colors duration-700 ${projected ? "text-[var(--success)]" : "text-gl-gold"}`}>
              <Tween value={projected ? 35.0 : 33.8} format={fmt.pct1} duration={1500} />
              <span className="ml-2 font-gl-mono text-[0.62rem] text-gl-muted-foreground">projected Q4</span>
            </p>
            <p className="mt-1 text-[0.6rem] text-gl-muted-foreground">
              {projected ? "+120bp · $8.6M annualised · payback immediate" : "Waiting for all channels to sync…"}
            </p>
          </Card>
          <Card className="p-3.5">
            <Label>Guardrails armed</Label>
            <div className="mt-2 space-y-1.5 text-[0.62rem]">
              {[
                ["Volume drop", "alert at −3% / 2 wks"],
                ["Win rate on quotes", "alert at −5pp"],
                ["Key accounts", "excluded · 14"],
                ["Rollback", "one click · 30 days"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gl-muted-foreground">{k}</span>
                  <span className="font-gl-mono text-[0.56rem] text-gl-foreground">{v}</span>
                </div>
              ))}
            </div>
          </Card>
          <div className={`mt-auto transition-all duration-500 ${complete ? "opacity-100" : "translate-y-2 opacity-0"}`}>
            <DemoButton id="back-margin" tone="data" hover={ctaHover} pressed={ctaPressed} className="w-full py-2">
              See the margin recovery →
            </DemoButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MarginDemo({ onChapter }: { onChapter?: (c: MarginChapter) => void }) {
  const { ref, scene: s } = useScene(MARGIN_CUES, MARGIN_LOOP, "proposal");
  const stageRef = useRef<HTMLDivElement>(null);
  const page: "margin" | "roll" = s.between("toRoll", "back") ? "roll" : "margin";
  const fixed = s.past("back");

  const phase: AgentPhase = fixed
    ? "done"
    : !s.past("think")
      ? "idle"
      : !s.past("write")
        ? "thinking"
        : !s.past("proposal")
          ? "writing"
          : !s.past("approved")
            ? "waiting"
            : "approved";

  const done = s.past("ch5") ? 5 : s.past("ch4") ? 4 : s.past("ch3") ? 3 : s.past("ch2") ? 2 : s.past("ch1") ? 1 : 0;

  const chapter: MarginChapter = !s.past("press")
    ? "detect"
    : !s.past("toApprove")
      ? "diagnose"
      : !s.past("toRoll")
        ? "approve"
        : !s.past("toCta")
          ? "rollout"
          : "protect";
  useEffect(() => onChapter?.(chapter), [chapter, onChapter]);

  let target: CursorTarget = { x: STAGE_W + 60, y: STAGE_H - 40 };
  let pointer = false;
  let anchor: [number, number] = [0.5, 0.5];
  if (s.between("enter", "think")) {
    target = "anomaly";
    pointer = true;
  } else if (s.between("think", "toApprove")) {
    target = "briefing";
    anchor = [0.4, 0.42];
  } else if (s.between("toApprove", "toRoll")) {
    target = "approve";
    pointer = true;
  } else if (s.between("toRoll", "toCta")) target = { x: 640, y: 420 };
  else if (s.between("toCta", "back")) {
    target = "back-margin";
    pointer = true;
  } else if (s.between("back", "exit")) target = "anomaly";
  if (s.index < 0 || !s.past("enter")) target = { x: STAGE_W + 60, y: STAGE_H - 40 };

  const pressed = s.between("press", "popover") || s.between("approvePress", "approved") || s.between("ctaPress", "back");

  const kpis: Kpi[] = [
    {
      label: "Gross margin",
      value: fixed ? 38.9 : 38.6,
      format: fmt.pct1,
      delta: fixed ? "+0.3pp projected" : "−0.4pp vs budget",
      status: fixed ? "recovering" : "attention",
      spark: fixed ? [6, 6, 5, 4, 4, 5, 7] : [7, 7, 6, 6, 5, 5, 4],
      tone: fixed ? "success" : "gold",
      flash: s.between("back", "exit"),
    },
    { label: "Price realisation", value: fixed ? 98.6 : 97.1, format: fmt.pct1, delta: fixed ? "+1.5pp after floor" : "−1.8pp vs list", status: fixed ? "track" : "attention", spark: [6, 6, 5, 5, 4, 4, 4], tone: fixed ? "success" : "gold" },
    { label: "Discount leakage", value: fixed ? 2.9 : 6.2, format: fmt.money1, delta: fixed ? "−$3.3M run-rate" : "+$2.1M vs last qtr", status: fixed ? "track" : "attention", spark: [3, 3, 4, 5, 5, 6, 7], tone: fixed ? "success" : "gold" },
    { label: "Unit cost", value: 41.8, format: (n) => `$${n.toFixed(2)}`, delta: "−0.6% vs budget", status: "ahead", spark: [6, 6, 5, 5, 5, 4, 4], tone: "data" },
  ];

  return (
    <div ref={ref}>
      <ScaledStage width={STAGE_W} height={STAGE_H}>
        <div ref={stageRef} className="relative h-full w-full">
          <DemoFrame
            active={page === "roll" ? "automations" : "margin"}
            title={page === "roll" ? "Automation running" : "Margin & Cost"}
            subtitle={page === "roll" ? "Automations · AU-771 · orchestrated by Genius Agent" : "Meridian Holdings · FY26 Q3 · gross margin drivers"}
            badges={{ automations: s.past("approved") && !fixed ? "7" : "6" }}
          >
            <Screen show={page === "margin"}>
              <div key={s.loop} className="flex h-full flex-col gap-3">
                <div className="grid grid-cols-4 gap-3">
                  {kpis.map((k) => (
                    <KpiCard key={k.label} k={k} countFrom={0} />
                  ))}
                </div>
                <div className="grid min-h-0 flex-1 grid-cols-[1fr_392px] gap-3">
                  <div className="flex min-h-0 flex-col gap-3">
                    <div className="h-[278px]">
                      <MarginChart popover={s.between("popover", "toApprove")} resolved={fixed} projected={fixed} />
                    </div>
                    <div className="min-h-0 flex-1">
                      <MarginBridge highlight={s.between("write", "toRoll")} />
                    </div>
                  </div>
                  <AgentBriefing
                    loopKey={s.loop}
                    phase={phase}
                    context="Watching margin drivers across 14 entities, 38,400 SKUs and 2.1M invoice lines."
                    insightLabel="Root cause · Pricing"
                    message={MESSAGE}
                    evidence={["Invoice lines · 412k", "Competitor index +4%", "Elasticity −0.3"]}
                    proposal={{
                      title: "Hold a price floor on 1,284 long-tail SKUs",
                      policy: "Policy PRC-07",
                      metrics: [
                        { label: "Margin", value: "+120bp", tone: "success" },
                        { label: "Annualised", value: "$8.6M", tone: "data" },
                        { label: "Volume risk", value: "< 1%" },
                      ],
                    }}
                    approveHover={s.past("toApprove")}
                    approvePressed={s.between("approvePress", "approved")}
                    approvedBy="Approved by Elena Costa · 14:02 · AU-771"
                  />
                </div>
              </div>
            </Screen>
            <Screen show={page === "roll"}>
              <RolloutScreen
                key={s.loop}
                done={done}
                projected={s.past("projected")}
                ctaHover={s.past("toCta")}
                ctaPressed={s.between("ctaPress", "back")}
              />
            </Screen>
            <Toast
              className="bottom-7 left-7"
              show={s.between("toast", "exit")}
              title="Price floor live on 1,284 SKUs"
              body="5 systems synced in 22 seconds · +120bp projected · guardrails armed"
            />
          </DemoFrame>
          <Cursor rootRef={stageRef} target={target} pointer={pointer} pressed={pressed} anchor={anchor} />
        </div>
      </ScaledStage>
    </div>
  );
}
