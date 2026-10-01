"use client";

import { useEffect, useRef } from "react";
import { Cursor, ScaledStage, Typewriter, fmt, smoothPath, useScene, useTweened, type CursorTarget } from "./engine";
import { AgentOrb, Card, Check, DemoButton, DemoFrame, Label, STAGE_H, STAGE_W, Screen, Spinner, Toast } from "./frame";
import { KpiCard, renderSegments, segText, type Kpi, type Segment } from "./screens";

/*
 * Storyboard — "Stress-test the plan before the market does"
 *  1. Stress test  The CFO drags a 12% EU tariff and a 4% demand dip into the plan. Everything recomputes live.
 *  2. Breach       Covenant headroom falls through 1.5x in Q2 FY27. The gauge turns red.
 *  3. Levers       Genius explains the exposure and proposes three levers, each priced.
 *  4. Mitigate     The CFO switches on two of them; the outlook recovers above the covenant.
 *  5. Arm          The plan is saved as a contingency that fires automatically if the tariff is announced.
 */
export const SCENARIO_CUES = {
  start: 0,
  enter: 600,
  grab: 1700,
  drag: 1900,
  release: 3300,
  toDemand: 3700,
  grab2: 4600,
  drag2: 4800,
  release2: 6000,
  breach: 6400,
  think: 7200,
  write: 8100,
  levers: 11400,
  toL1: 12000,
  press1: 12900,
  on1: 13100,
  toL2: 13500,
  press2: 14400,
  on2: 14600,
  toSave: 15700,
  pressSave: 16700,
  saved: 16950,
  toast: 17500,
  exit: 21800,
} as const;
export const SCENARIO_LOOP = 23800;

export type ScenarioChapter = "stress" | "breach" | "levers" | "mitigate" | "arm";

export const SCENARIO_CHAPTERS: { key: ScenarioChapter; title: string; body: string }[] = [
  { key: "stress", title: "Stress test", body: "Drag a 12% EU tariff and a demand dip into the plan." },
  { key: "breach", title: "Exposure", body: "Covenant headroom breaks 1.5x in Q2 FY27." },
  { key: "levers", title: "Levers", body: "Genius prices three ways to restore headroom." },
  { key: "mitigate", title: "Mitigation", body: "Two levers on. Outlook back above the covenant." },
  { key: "arm", title: "Contingency armed", body: "It fires automatically if the tariff is announced." },
];

export const SCENARIO_SPANS: Record<ScenarioChapter, [number, number]> = {
  stress: [SCENARIO_CUES.start, SCENARIO_CUES.breach],
  breach: [SCENARIO_CUES.breach, SCENARIO_CUES.write],
  levers: [SCENARIO_CUES.write, SCENARIO_CUES.toL1],
  mitigate: [SCENARIO_CUES.toL1, SCENARIO_CUES.toSave],
  arm: [SCENARIO_CUES.toSave, SCENARIO_LOOP],
};

const MESSAGE: Segment[] = [
  { t: "Under this scenario EBITDA falls " },
  { t: "$32M", tone: "gold" },
  { t: " and headroom breaks the " },
  { t: "1.5x covenant in Q2 FY27", tone: "strong" },
  { t: ". 70% of the exposure sits in 212 EU-sourced SKUs. Three levers, priced on your data:" },
];

const LEVERS = [
  { id: "lever-1", t: "Re-route 40% of EU volume via Monterrey", m: "+$9M EBITDA · 6-week ramp" },
  { id: "lever-2", t: "Pass through 3% on tariff-exposed SKUs", m: "+$11M EBITDA · elasticity −0.4" },
  { id: "lever-3", t: "Defer $15M of phase-2 capex", m: "+$15M cash · no EBITDA effect" },
];

const DRAG_MS = 1300;

function Slider({
  label,
  value,
  min,
  max,
  unit,
  marks,
  id,
  active,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: (v: number) => string;
  marks: number[];
  id: string;
  active: boolean;
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const shown = useTweened(value, DRAG_MS);
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-[0.66rem] text-gl-foreground">{label}</p>
        <span className={`font-gl-mono text-[0.7rem] tabular-nums transition-colors duration-300 ${active || value !== min ? "text-gl-gold" : "text-gl-muted-foreground"}`}>
          {unit(shown)}
        </span>
      </div>
      <div className="relative mt-3 h-4">
        <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-gl-foreground/10" />
        <div className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-gl-gold" style={{ width: `${pct(shown)}%` }} />
        {marks.map((m) => (
          <span key={m} data-cursor={`${id}-${m}`} className="absolute top-1/2 h-0 w-0" style={{ left: `${pct(m)}%` }} />
        ))}
        <span
          className={`absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gl-gold bg-[oklch(0.97_0.01_80)] transition-shadow duration-200 ${
            active ? "shadow-[0_0_0_6px_oklch(0.77_0.155_66/22%)]" : "shadow-[0_2px_8px_rgb(0_0_0/0.5)]"
          }`}
          style={{ left: `${pct(shown)}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between font-gl-mono text-[0.5rem] text-gl-muted-foreground/60">
        <span>{unit(min)}</span>
        <span>{unit(max)}</span>
      </div>
    </div>
  );
}

function Toggle({ on, id, hover }: { on: boolean; id: string; hover: boolean }) {
  return (
    <span
      data-cursor={id}
      className={`relative inline-flex h-[18px] w-8 shrink-0 items-center rounded-full transition-colors duration-300 ${on ? "bg-[var(--success)]" : hover ? "bg-gl-foreground/25" : "bg-gl-foreground/15"}`}
    >
      <span className={`absolute h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "translate-x-[15px]" : "translate-x-[2px]"}`} />
    </span>
  );
}

/* 6 quarters, $M EBITDA per quarter */
const QUARTERS = ["Q3 FY26", "Q4 FY26", "Q1 FY27", "Q2 FY27", "Q3 FY27", "Q4 FY27"];
const BASE = [71, 72, 74, 75, 77, 78];
const RAMP = [0, 0.45, 0.85, 1, 1, 1];
const FLOOR = 68.5;
const OC = { x0: 40, x1: 600, y0: 14, y1: 190, min: 62, max: 81 };
const ox = (i: number) => OC.x0 + (i / (BASE.length - 1)) * (OC.x1 - OC.x0);
const oy = (v: number) => OC.y1 - ((v - OC.min) / (OC.max - OC.min)) * (OC.y1 - OC.y0);

function OutlookChart({ drop, breach, mitigated }: { drop: number; breach: boolean; mitigated: boolean }) {
  const per = drop / 4;
  const scen = BASE.map((b, i) => [ox(i), oy(b - per * RAMP[i]!)] as const);
  const base = BASE.map((b, i) => [ox(i), oy(b)] as const);
  const breachPt = scen[3]!;
  const below = BASE[3]! - per * RAMP[3]! < FLOOR;
  const color = mitigated ? "var(--success)" : drop > 0.5 ? "var(--gold)" : "var(--data)";
  return (
    <Card className="h-full p-4">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <p className="text-[0.72rem] text-gl-foreground">EBITDA outlook — base vs scenario</p>
          <p className="text-[0.58rem] text-gl-muted-foreground/65">$M per quarter · recomputed live across 14 entities</p>
        </div>
        <div className="flex items-center gap-3 text-[0.56rem] text-gl-muted-foreground/80">
          <span className="flex items-center gap-1.5">
            <span className="h-[2px] w-3 bg-gl-muted-foreground/60" /> Base plan
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-[2px] w-3" style={{ background: color }} /> Scenario
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-[2px] w-3 bg-[oklch(0.65_0.2_25)]" /> Covenant floor
          </span>
        </div>
      </div>
      <svg viewBox="0 0 620 214" className="block h-[214px] w-full" aria-hidden="true">
        <defs>
          <linearGradient id="scenFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[64, 70, 76].map((t) => (
          <g key={t}>
            <line x1={OC.x0} x2={OC.x1} y1={oy(t)} y2={oy(t)} stroke="var(--border)" strokeDasharray="2 5" />
            <text x={4} y={oy(t) + 3} className="font-gl-mono" fontSize="8" fill="var(--muted-foreground)" opacity="0.7">
              ${t}M
            </text>
          </g>
        ))}
        <line x1={OC.x0} x2={OC.x1} y1={oy(FLOOR)} y2={oy(FLOOR)} stroke="oklch(0.65 0.2 25)" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.85" />
        <text x={OC.x1 - 2} y={oy(FLOOR) - 5} textAnchor="end" className="font-gl-mono" fontSize="7.5" fill="oklch(0.7 0.18 25)">
          COVENANT 1.5x
        </text>
        <path d={smoothPath(base)} fill="none" stroke="var(--muted-foreground)" strokeWidth="1.4" strokeDasharray="3 3" opacity="0.7" />
        <path d={`${smoothPath(scen)} L ${OC.x1} ${OC.y1} L ${OC.x0} ${OC.y1} Z`} fill="url(#scenFill)" />
        <path d={smoothPath(scen)} fill="none" stroke={color} strokeWidth="2.2" style={{ transition: "stroke .5s" }} />
        {scen.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.6" fill={color} />
        ))}
        {breach && below ? (
          <g>
            <circle cx={breachPt[0]} cy={breachPt[1]} r="4.5" fill="oklch(0.65 0.2 25)" />
            <circle cx={breachPt[0]} cy={breachPt[1]} r="11" fill="none" stroke="oklch(0.65 0.2 25)" strokeWidth="1.4" className="demo-anomaly" />
          </g>
        ) : null}
        {QUARTERS.map((q, i) => (
          <text key={q} x={ox(i)} y={208} textAnchor="middle" className="font-gl-mono" fontSize="7.5" fill="var(--muted-foreground)" opacity="0.7">
            {q}
          </text>
        ))}
      </svg>
    </Card>
  );
}

/** Rounded so server and client trig results render identical markup. */
const r2 = (n: number) => Math.round(n * 100) / 100;

function Gauge({ value }: { value: number }) {
  // 1.0x .. 2.5x mapped onto a 180° arc
  const t = Math.max(0, Math.min(1, (value - 1) / 1.5));
  const angle = Math.PI * (1 - t);
  const cx = 110;
  const cy = 104;
  const r = 82;
  const nx = r2(cx + Math.cos(angle) * (r - 14));
  const ny = r2(cy - Math.sin(angle) * (r - 14));
  const floorT = (1.5 - 1) / 1.5;
  const fa = Math.PI * (1 - floorT);
  const color = value < 1.5 ? "oklch(0.65 0.2 25)" : value < 1.8 ? "var(--gold)" : "var(--success)";
  const arc = (a0: number, a1: number) =>
    `M ${r2(cx + Math.cos(a0) * r)} ${r2(cy - Math.sin(a0) * r)} A ${r} ${r} 0 0 1 ${r2(cx + Math.cos(a1) * r)} ${r2(cy - Math.sin(a1) * r)}`;
  return (
    <svg viewBox="0 0 220 122" className="block w-full" aria-hidden="true">
      <path d={arc(Math.PI, 0)} fill="none" stroke="var(--border)" strokeWidth="10" strokeLinecap="round" />
      <path d={arc(Math.PI, fa)} fill="none" stroke="oklch(0.65 0.2 25 / 45%)" strokeWidth="10" strokeLinecap="round" />
      <path d={arc(Math.PI, angle)} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" style={{ transition: "stroke .4s" }} />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="var(--foreground)" strokeWidth="2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="5" fill="var(--foreground)" />
      <text x={r2(cx + Math.cos(fa) * (r + 12))} y={r2(cy - Math.sin(fa) * (r + 12))} textAnchor="middle" className="font-gl-mono" fontSize="8" fill="oklch(0.7 0.18 25)">
        1.5x
      </text>
    </svg>
  );
}

export function ScenarioDemo({
  cinematic = false,
  onChapter,
}: {
  cinematic?: boolean;
  onChapter?: (c: ScenarioChapter, loop: number) => void;
}) {
  const { ref, scene: s } = useScene(SCENARIO_CUES, SCENARIO_LOOP, "levers");
  const stageRef = useRef<HTMLDivElement>(null);

  const tariff = s.past("drag") ? 12 : 0;
  const demand = s.past("drag2") ? 4 : 0;
  const l1 = s.past("on1");
  const l2 = s.past("on2");
  const drop = 1.9 * tariff + 2.25 * demand - (l1 ? 9 : 0) - (l2 ? 11 : 0);
  const dropT = useTweened(drop, DRAG_MS);
  const headroom = 2.1 - 0.042 * tariff - 0.05 * demand + (l1 ? 0.22 : 0) + (l2 ? 0.28 : 0);
  const headT = useTweened(headroom, DRAG_MS);
  const fcf = 96.4 - 1.1 * tariff - 1.3 * demand + (l1 ? 6 : 0) + (l2 ? 7 : 0);
  const gm = 38.6 - 0.16 * tariff - 0.05 * demand + (l2 ? 0.9 : 0);
  const breach = s.past("breach");
  const mitigated = l1 && l2;
  const stressed = tariff > 0;

  const chapter: ScenarioChapter = !s.past("breach")
    ? "stress"
    : !s.past("write")
      ? "breach"
      : !s.past("toL1")
        ? "levers"
        : !s.past("toSave")
          ? "mitigate"
          : "arm";
  useEffect(() => onChapter?.(chapter, s.loop), [chapter, s.loop, onChapter]);

  const off = { x: STAGE_W + 60, y: STAGE_H - 40 };
  let target: CursorTarget = off;
  let pointer = false;
  let moveMs = 950;
  if (s.between("enter", "drag")) target = "tariff-0";
  else if (s.between("drag", "toDemand")) {
    target = "tariff-12";
    moveMs = DRAG_MS;
  } else if (s.between("toDemand", "drag2")) target = "demand-0";
  else if (s.between("drag2", "think")) {
    target = "demand-4";
    moveMs = DRAG_MS;
  } else if (s.between("think", "toL1")) target = { x: 760, y: 560 };
  else if (s.between("toL1", "toL2")) {
    target = "lever-1";
    pointer = true;
  } else if (s.between("toL2", "toSave")) {
    target = "lever-2";
    pointer = true;
  } else if (s.between("toSave", "exit")) {
    target = "save-plan";
    pointer = true;
  }
  if (s.index < 0 || !s.past("enter")) target = off;

  const pressed =
    s.between("grab", "release") || s.between("grab2", "release2") || s.between("press1", "on1") || s.between("press2", "on2") || s.between("pressSave", "saved");

  const ebitda = 284 - drop;
  const kpis: Kpi[] = [
    {
      label: "EBITDA · FY27 outlook",
      value: ebitda,
      format: fmt.money0,
      delta: drop > 0.5 ? `−$${Math.round(drop)}M vs plan` : "On plan",
      status: drop > 20 ? "attention" : mitigated ? "recovering" : drop > 0.5 ? "attention" : "track",
      spark: [4, 5, 5, 6, 6, 7, 7],
      tone: mitigated ? "success" : drop > 0.5 ? "gold" : "data",
    },
    {
      label: "Free cash flow",
      value: fcf,
      format: fmt.money1,
      delta: fcf < 96 ? `−$${(96.4 - fcf).toFixed(1)}M vs plan` : "On plan",
      status: fcf < 90 ? "attention" : "track",
      spark: [6, 6, 5, 5, 5, 6, 6],
      tone: fcf < 90 ? "gold" : "data",
    },
    {
      label: "Covenant headroom",
      value: headroom,
      format: (n) => `${n.toFixed(2)}x`,
      delta: headroom < 1.5 ? "Below 1.5x minimum" : "Minimum 1.5x",
      status: headroom < 1.5 ? "attention" : mitigated ? "recovering" : "track",
      spark: [6, 6, 6, 5, 5, 4, 4],
      tone: headroom < 1.5 ? "gold" : mitigated ? "success" : "data",
      flash: s.between("on2", "toSave"),
    },
    { label: "Gross margin", value: gm, format: fmt.pct1, delta: stressed ? "Tariff absorbed in COGS" : "+0.8pp vs budget", status: "track", spark: [5, 5, 6, 6, 6, 6, 7], tone: "data" },
  ];

  let cam = { scale: 1, ox: 50, oy: 50 };
  if (cinematic) {
    if (s.between("enter", "breach")) cam = { scale: 1.32, ox: 4, oy: 40 };
    else if (s.between("breach", "think")) cam = { scale: 1.16, ox: 70, oy: 30 };
    else if (s.between("think", "toast")) cam = { scale: 1.3, ox: 96, oy: 98 };
  }

  const phase = !s.past("think") ? "idle" : !s.past("write") ? "thinking" : !s.past("levers") ? "writing" : s.past("saved") ? "done" : "waiting";

  return (
    <div ref={ref}>
      <ScaledStage width={STAGE_W} height={STAGE_H}>
        <div className={`h-full w-full ${cinematic ? "overflow-hidden rounded-[18px]" : ""}`}>
          <div
            ref={stageRef}
            className="relative h-full w-full"
            style={{
              transform: `scale(${cam.scale})`,
              transformOrigin: `${cam.ox}% ${cam.oy}%`,
              transition: "transform 1.7s cubic-bezier(0.65,0,0.2,1), transform-origin 1.7s cubic-bezier(0.65,0,0.2,1)",
            }}
          >
            <DemoFrame active="cash" title="Scenario planning" subtitle="FY27 plan · scenario “EU tariff shock” · unsaved" badges={{}}>
              <Screen show>
                <div key={s.loop} className="flex h-full flex-col gap-3">
                  <div className="grid grid-cols-4 gap-3">
                    {kpis.map((k) => (
                      <KpiCard key={k.label} k={k} />
                    ))}
                  </div>
                  <div className="grid min-h-0 flex-1 grid-cols-[292px_1fr] gap-3">
                    <div className="flex min-h-0 flex-col gap-3">
                      <Card className="space-y-5 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[0.72rem] text-gl-foreground">Scenario drivers</p>
                          <span className="font-gl-mono text-[0.54rem] text-gl-muted-foreground/60">drag to stress</span>
                        </div>
                        <Slider label="Tariff on EU imports" id="tariff" value={tariff} min={0} max={15} marks={[0, 12]} unit={(v) => `${v.toFixed(0)}%`} active={s.between("grab", "release")} />
                        <Slider label="Industrial demand" id="demand" value={demand} min={0} max={10} marks={[0, 4]} unit={(v) => (v < 0.05 ? "0%" : `−${v.toFixed(1)}%`)} active={s.between("grab2", "release2")} />
                        <Slider label="EUR / USD" id="fx" value={0} min={0} max={10} marks={[]} unit={() => "1.084"} active={false} />
                      </Card>
                      <Card className={`relative flex-1 overflow-hidden p-4 transition-colors duration-500 ${breach && !mitigated ? "border-[oklch(0.65_0.2_25/50%)]" : ""}`}>
                        <Label>Covenant headroom · net debt / EBITDA</Label>
                        <div className="mt-2 px-3">
                          <Gauge value={headT} />
                        </div>
                        <p
                          className={`-mt-1 text-center font-gl-display text-[1.35rem] tabular-nums tracking-tight ${
                            headT < 1.5 ? "text-[oklch(0.72_0.18_25)]" : headT < 1.8 ? "text-gl-gold" : "text-[var(--success)]"
                          }`}
                        >
                          {headT.toFixed(2)}x
                        </p>
                        <p key={`${breach}-${mitigated}-${headroom < 1.5}`} className="demo-fade-up mt-1 text-center text-[0.6rem] text-gl-muted-foreground">
                          {mitigated
                            ? "Restored above minimum in every quarter"
                            : breach && headroom < 1.5
                              ? "Breach in Q2 FY27 under this scenario"
                              : breach
                                ? "Back above 1.5x · thin cushion"
                                : "Minimum 1.5x · tested quarterly"}
                        </p>
                      </Card>
                    </div>
                    <div className="flex min-h-0 flex-col gap-3">
                      <div className="h-[282px]">
                        <OutlookChart drop={dropT} breach={breach} mitigated={mitigated} />
                      </div>
                      <Card className="relative grid min-h-0 flex-1 grid-cols-[1fr_330px] gap-4 overflow-hidden p-4" data-cursor="agent">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2.5">
                            <AgentOrb state={phase === "waiting" ? "waiting" : phase} />
                            <div>
                              <p className="text-[0.74rem] font-medium text-gl-foreground">Genius Agent</p>
                              <p key={phase} className="demo-fade-up flex items-center gap-1.5 text-[0.6rem] text-gl-muted-foreground">
                                {phase === "thinking" ? <Spinner className="h-2 w-2 text-gl-data" /> : null}
                                {phase === "idle"
                                  ? "Watching the scenario"
                                  : phase === "thinking"
                                    ? "Tracing exposure across 38,400 SKUs…"
                                    : phase === "writing"
                                      ? "Writing…"
                                      : phase === "done"
                                        ? "Contingency plan armed"
                                        : "Choose the levers to apply"}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 text-[0.72rem] leading-[1.6] text-gl-foreground/90">
                            {phase === "thinking" ? (
                              <div className="space-y-2 pt-1">
                                <span className="demo-shimmer block h-2 w-[92%] rounded" />
                                <span className="demo-shimmer block h-2 w-[76%] rounded" />
                                <span className="demo-shimmer block h-2 w-[60%] rounded" />
                              </div>
                            ) : (
                              <Typewriter
                                key={s.loop}
                                text={segText(MESSAGE)}
                                play={s.between("write", "levers")}
                                done={s.past("levers")}
                                cps={60}
                                renderText={(v) => renderSegments(MESSAGE, v.length)}
                              />
                            )}
                          </div>
                          <div className={`mt-3 transition-all duration-500 ${s.past("levers") ? "opacity-100" : "opacity-0"}`}>
                            {s.past("saved") ? (
                              <DemoButton id="save-plan" tone="success">
                                <Check className="h-3 w-3" /> Contingency plan armed
                              </DemoButton>
                            ) : (
                              <DemoButton id="save-plan" hover={s.past("toSave")} pressed={s.between("pressSave", "saved")}>
                                Save as contingency plan · trigger at 8% tariff
                              </DemoButton>
                            )}
                          </div>
                        </div>
                        <div className={`space-y-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${s.past("levers") ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}>
                          <Label>Mitigation levers</Label>
                          {LEVERS.map((l, i) => {
                            const on = (i === 0 && l1) || (i === 1 && l2);
                            const hover = (i === 0 && s.between("toL1", "on1")) || (i === 1 && s.between("toL2", "on2"));
                            return (
                              <div
                                key={l.id}
                                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors duration-300 ${
                                  on ? "border-[oklch(0.78_0.13_168/40%)] bg-[oklch(0.78_0.13_168/7%)]" : "border-gl-border/70"
                                }`}
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="text-[0.66rem] text-gl-foreground">{l.t}</p>
                                  <p className="font-gl-mono text-[0.54rem] text-gl-muted-foreground">{l.m}</p>
                                </div>
                                <Toggle id={l.id} on={on} hover={hover} />
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </Screen>
              <Toast
                className="right-6 top-[118px]"
                show={s.between("toast", "exit")}
                title="Contingency plan armed"
                body="Fires if an EU tariff above 8% is announced · owners notified · reversible"
              />
            </DemoFrame>
            <Cursor rootRef={stageRef} target={target} pointer={pointer} pressed={pressed} moveMs={moveMs} />
          </div>
        </div>
      </ScaledStage>
    </div>
  );
}
