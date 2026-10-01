"use client";

import { useEffect, useRef, useState } from "react";
import { Cursor, useScene, type CursorTarget } from "@/components/hero-demo/engine";
import { Screen } from "@/components/hero-demo/frame";
import { renderSegments, segText, type Segment } from "@/components/hero-demo/screens";
import {
  BriefingCard,
  Chart,
  DASH_W,
  GeniusRail,
  Kpis,
  Sidebar,
  Topbar,
  Units,
  VoiceBriefing,
  type ApproveState,
  type Cyc,
  type Variant,
} from "./Dashboard";
import type { Focus, Insight } from "./insights";
import { GeniusShaderOrb, Waveform } from "./Orb";

/*
 * Storyboard — "From one number to a board update"
 *  1. Ask       The CFO clicks May on the performance chart.
 *  2. Explain   Genius thinks, then writes why May moved and what to do about it.
 *  3. Approve   The CFO approves the recommended actions.
 *  4. Agents    The cursor opens Agents: the orb takes centre stage and reports what every agent did.
 *  5. Board     Genius drafts the board update; the CFO approves and sends it. Seven emails go out.
 */
export const BRIEF_CUES = {
  start: 0,
  enter: 700,
  pressChart: 2000,
  selected: 2250,
  think: 2700,
  write: 3900,
  proposal: 8700,
  toApprove: 9400,
  pressA: 10500,
  approved: 10750,
  toAgents: 11800,
  pressNav: 12800,
  agents: 13050,
  aThink: 13400,
  ins1: 14200,
  ins2: 14800,
  ins3: 15400,
  ins4: 16000,
  summary: 16500,
  ready: 19800,
  toSend: 20400,
  pressSend: 21400,
  sending: 21650,
  e1: 22300,
  e2: 22750,
  e3: 23200,
  e4: 23650,
  e5: 24100,
  e6: 24550,
  e7: 25000,
  open1: 25600,
  open2: 26200,
  toast: 26500,
  exit: 29800,
} as const;
export const BRIEF_LOOP = 31800;
const H = 850;

const IDLE: Insight = {
  focus: "revenue",
  tag: "Ready",
  segments: [{ t: "Good morning, Elena. Click any number on the dashboard and I'll explain what moved, why, and what to do about it." }],
  sources: ["14 entities live"],
  action: { title: "Ask about any number", impact: "Click a chart point or a KPI", cta: "Ask" },
};

const CHART: Insight = {
  focus: "margin",
  tag: "May · week 2",
  segments: [
    { t: "May revenue hit " },
    { t: "$127.4M, +6.2%", tone: "data" },
    { t: " as EMEA added three distributors — but gross margin " },
    { t: "slipped 0.4pp", tone: "gold" },
    { t: " because Retail discounted " },
    { t: "1,284 long-tail SKUs", tone: "strong" },
    { t: ". Hold a price floor and lift the Q4 forecast by $18M." },
  ],
  sources: ["ERP · May close", "Invoice lines · 412k", "Competitor index"],
  action: { title: "Hold price floor · lift Q4 forecast", impact: "+120bp margin · +$18M forecast", cta: "Approve" },
};

const AGENT_INSIGHTS = [
  { agent: "Cash Chase", head: "$18.4M collected overnight", sub: "DSO −6.2 days · 4,200 invoices", tone: "success" },
  { agent: "Price Guard", head: "1,284 SKUs held at floor", sub: "+120bp margin · live", tone: "data" },
  { agent: "Replenish", head: "412 purchase orders raised", sub: "Stock cover +4.1 days · 14 sites", tone: "data" },
  { agent: "Supply Sentinel", head: "Tier-1 risk mitigated", sub: "$22.6M revenue protected · 3 plants", tone: "gold" },
] as const;

const SUMMARY: Segment[] = [
  { t: "Overnight your agents recovered " },
  { t: "$18.4M of cash", tone: "data" },
  { t: ", protected " },
  { t: "120bp of margin", tone: "data" },
  { t: " and de-risked " },
  { t: "$22.6M of revenue", tone: "gold" },
  { t: ". I've drafted the Q3 board update with these results and this morning's approvals." },
];

const BOARD = [
  ["MH", "Margaret Hale", "Chair"],
  ["JR", "James Ruiz", "Audit Committee"],
  ["AL", "Aiko Lin", "Independent director"],
  ["SK", "Samuel Kerr", "Investor director"],
  ["TP", "Teresa Park", "Independent director"],
  ["DW", "David Wu", "Chief Executive"],
  ["NB", "Nadia Bose", "Company Secretary"],
] as const;

/** Characters revealed while `play` runs; full once `done`. Restarts with `k`. */
function useTyped(text: string, play: boolean, done: boolean, cps: number, k: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!play || done) return;
    let i = 0;
    let t = 0;
    const tick = () => {
      i = Math.min(text.length, i + 1);
      setN(i);
      if (i >= text.length) return;
      const ch = text[i - 1];
      t = window.setTimeout(tick, (1000 / cps) * (ch === "." || ch === "," || ch === "—" ? 4 : 1));
    };
    t = window.setTimeout(tick, 1000 / cps);
    return () => window.clearTimeout(t);
  }, [play, done, text, cps, k]);
  return done ? text.length : play ? n : 0;
}

type Scene = ReturnType<typeof useScene<typeof BRIEF_CUES>>["scene"];

function AgentsPage({ s, gold, width, summaryTyped }: { s: Scene; gold: boolean; width: number; summaryTyped: number }) {
  const cx = width / 2;
  const thinking = s.between("aThink", "ins1");
  const speaking = s.between("summary", "ready");
  const orbState = thinking ? "thinking" : speaking ? "typing" : "holding";
  const shown = (["ins1", "ins2", "ins3", "ins4"] as const).filter((k) => s.past(k)).length;
  const sending = s.past("sending");
  const sent = (["e1", "e2", "e3", "e4", "e5", "e6", "e7"] as const).filter((k) => s.past(k)).length;
  const opened = s.past("open2") ? 3 : s.past("open1") ? 1 : 0;
  const cards = [
    { x: cx - 480, y: 120 },
    { x: cx + 180, y: 120 },
    { x: cx - 480, y: 250 },
    { x: cx + 180, y: 250 },
  ];
  const accent = gold ? "var(--gold)" : "var(--cyan)";

  return (
    <div className="relative h-full w-full">
      {/* stage glow */}
      <div className="pointer-events-none absolute left-1/2 top-[90px] h-[420px] w-[620px] -translate-x-1/2 rounded-full blur-3xl" style={{ background: `radial-gradient(ellipse at center, color-mix(in oklab, ${gold ? "var(--gold)" : "var(--data)"} 22%, transparent), transparent 70%)` }} />
      {/* links from the orb to each insight */}
      <svg className="pointer-events-none absolute inset-0" width={width} height={H - 58} aria-hidden="true">
        {cards.map((c, i) => {
          const tx = i % 2 === 0 ? c.x + 300 : c.x;
          const ty = c.y + 40;
          return (
            <path
              key={i}
              d={`M ${cx} 240 C ${(cx + tx) / 2} 240, ${(cx + tx) / 2} ${ty}, ${tx} ${ty}`}
              fill="none"
              stroke={accent}
              strokeWidth="1.2"
              strokeDasharray="1"
              pathLength={1}
              strokeDashoffset={i < shown ? 0 : 1}
              style={{ transition: "stroke-dashoffset .7s cubic-bezier(.22,1,.36,1)", opacity: sending ? 0.15 : 0.6 }}
            />
          );
        })}
      </svg>

      {/* the orb, centre stage */}
      <div className="absolute flex flex-col items-center" style={{ left: cx - 120, top: 120, width: 240 }}>
        <GeniusShaderOrb state={orbState} size={176} tone={gold ? "gold" : "blue"} />
        <p className="mt-4 font-gl-display text-[1rem] text-gl-foreground">Genius · Agents</p>
        <p key={orbState} className="gfocus-tag text-[0.62rem] text-gl-muted-foreground">
          {thinking ? "Reading what every agent did overnight…" : speaking ? "Briefing you…" : "4 agents · 41 tasks · all governed"}
        </p>
        {gold ? <Waveform active={speaking} className="mt-2" /> : null}
      </div>

      {/* insight cards */}
      {AGENT_INSIGHTS.map((a, i) => (
        <div
          key={a.agent}
          className="absolute w-[300px] rounded-xl border border-gl-border/70 bg-[linear-gradient(160deg,oklch(0.22_0.04_262/85%),oklch(0.16_0.03_264/85%))] p-3.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ left: cards[i]!.x, top: cards[i]!.y, opacity: i < shown ? (sending ? 0.25 : 1) : 0, transform: i < shown ? "none" : `translateX(${i % 2 === 0 ? 16 : -16}px)` }}
        >
          <p className="font-gl-mono text-[0.52rem] uppercase tracking-[0.16em]" style={{ color: a.tone === "gold" ? "var(--gold)" : a.tone === "success" ? "var(--success)" : "var(--data)" }}>
            {a.agent} agent
          </p>
          <p className="mt-1 text-[0.8rem] text-gl-foreground">{a.head}</p>
          <p className="font-gl-mono text-[0.56rem] text-gl-muted-foreground">{a.sub}</p>
        </div>
      ))}

      {/* summary */}
      <div className="absolute rounded-xl border border-gl-border/60 bg-gl-background/40 px-5 py-3.5 transition-opacity duration-500" style={{ left: cx - 320, top: 410, width: 640, opacity: s.past("summary") ? (sending ? 0.3 : 1) : 0 }}>
        <p className="min-h-[46px] text-[0.8rem] leading-[1.6] text-gl-foreground/90">
          {renderSegments(SUMMARY, summaryTyped)}
          {summaryTyped > 0 && summaryTyped < segText(SUMMARY).length ? <span className="gcaret" /> : null}
        </p>
      </div>

      {/* board pack */}
      <div
        className="absolute flex items-center gap-4 rounded-xl border bg-[linear-gradient(160deg,oklch(0.24_0.05_70/30%),oklch(0.16_0.03_264/80%))] px-5 py-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ left: cx - 320, top: 530, width: 640, borderColor: "oklch(0.77 0.155 66 / 40%)", opacity: s.past("ready") ? (sending ? 0.3 : 1) : 0, transform: s.past("ready") ? "none" : "translateY(12px)" }}
      >
        <span className="grid h-14 w-11 shrink-0 place-items-center rounded-md border border-gl-foreground/15 bg-[oklch(0.97_0.004_250)] font-gl-mono text-[0.5rem] font-medium text-[oklch(0.45_0.15_25)]">PDF</span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.82rem] text-gl-foreground">Q3 Board Update — cash recovered, margin protected</p>
          <p className="font-gl-mono text-[0.56rem] text-gl-muted-foreground">12 pages · 36 figures, all sourced · drafted by Genius · reviewed by Elena Costa</p>
          <div className="mt-2 flex -space-x-1.5">
            {BOARD.map(([i]) => (
              <span key={i} className="grid h-6 w-6 place-items-center rounded-full border-2 border-[oklch(0.17_0.03_262)] bg-gl-foreground/12 text-[0.45rem] font-semibold text-gl-foreground">
                {i}
              </span>
            ))}
          </div>
        </div>
        <span
          data-cursor="send"
          className={`shrink-0 rounded-md px-3.5 py-2 text-[0.7rem] font-medium transition-all duration-200 ${sending ? "bg-[var(--success)] text-gl-background" : "bg-gl-gold text-gl-background"} ${s.between("toSend", "sending") ? "brightness-110 shadow-[0_0_0_4px_oklch(0.77_0.155_66/22%)]" : ""} ${s.between("pressSend", "sending") ? "scale-95" : ""}`}
        >
          {sending ? "✓ Approved & sent" : "Approve & send to board"}
        </span>
      </div>

      {/* outbox: the report goes out to seven board members */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${sending ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <div className="absolute inset-0 bg-[oklch(0.1_0.03_264/55%)] backdrop-blur-[2px]" />
        <div
          className="absolute overflow-hidden rounded-2xl border border-gl-border bg-[oklch(0.17_0.032_262/97%)] shadow-[0_40px_100px_-30px_rgb(0_0_0/0.85)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ left: cx - 340, top: 110, width: 680, transform: sending ? "none" : "translateY(24px) scale(0.97)" }}
        >
          <div className="flex items-center gap-3 border-b border-gl-border/70 px-5 py-3.5">
            <GeniusShaderOrb state={sent < 7 ? "typing" : "holding"} size={30} tone={gold ? "gold" : "blue"} />
            <div className="flex-1">
              <p className="text-[0.78rem] text-gl-foreground">Sending the Q3 board update</p>
              <p className="font-gl-mono text-[0.56rem] text-gl-muted-foreground">From elena.costa@meridian.com · via Genius · encrypted · watermarked</p>
            </div>
            <span className="font-gl-mono text-[0.62rem] tabular-nums text-gl-foreground">{sent}/7</span>
          </div>
          <div className="space-y-1 border-b border-gl-border/60 px-5 py-3 text-[0.66rem]">
            <p>
              <span className="text-gl-muted-foreground">To </span>
              <span className="text-gl-foreground">Board of Directors (7)</span>
            </p>
            <p>
              <span className="text-gl-muted-foreground">Subject </span>
              <span className="text-gl-foreground">Q3 Board Update — $18.4M cash recovered, margin protected</span>
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span key={String(sending)} className="brief-fly flex items-center gap-2 rounded-md border border-gl-border bg-gl-background/50 px-2 py-1">
                <span className="grid h-5 w-4 place-items-center rounded-sm bg-[oklch(0.97_0.004_250)] font-gl-mono text-[0.38rem] font-medium text-[oklch(0.45_0.15_25)]">PDF</span>
                <span className="text-[0.6rem] text-gl-foreground/85">Q3-Board-Update.pdf · 2.4 MB</span>
              </span>
            </div>
          </div>
          <div className="px-5 py-2">
            {BOARD.map(([i, n, r], k) => {
              const st = k < sent ? (k < opened ? "Opened" : "Delivered") : k === sent && sent < 7 ? "Sending" : "Queued";
              return (
                <div key={i} className="flex items-center gap-3 border-b border-gl-border/40 py-[7px] last:border-0">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gl-foreground/10 text-[0.45rem] font-semibold text-gl-foreground">{i}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.66rem] text-gl-foreground">{n}</p>
                    <p className="text-[0.54rem] text-gl-muted-foreground">{r}</p>
                  </div>
                  <span className="relative h-3 w-16 overflow-hidden" aria-hidden="true">
                    <span className={`absolute top-1/2 h-px w-full -translate-y-1/2 ${k < sent ? "bg-[var(--success)]/40" : "bg-gl-foreground/10"}`} />
                    {k === sent && sent < 7 ? <span className="brief-env absolute top-0 text-[0.6rem] leading-3">✉</span> : null}
                  </span>
                  <span
                    key={st}
                    className={`gfocus-tag w-[68px] rounded-full px-2 py-0.5 text-center font-gl-mono text-[0.5rem] uppercase tracking-[0.1em] ${
                      st === "Opened" ? "bg-[oklch(0.78_0.13_168/16%)] text-[var(--success)]" : st === "Delivered" ? "bg-gl-data/12 text-gl-data" : st === "Sending" ? "bg-gl-gold/12 text-gl-gold" : "bg-gl-foreground/6 text-gl-muted-foreground"
                    }`}
                  >
                    {st}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* toast */}
      <div
        className={`absolute bottom-6 left-6 w-[300px] rounded-xl border border-[oklch(0.78_0.13_168/35%)] bg-[oklch(0.17_0.03_262/97%)] p-3.5 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.7)] transition-all duration-700 ${s.between("toast", "exit") ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <p className="text-[0.72rem] text-gl-foreground">✓ Board update delivered to 7 directors</p>
        <p className="mt-0.5 text-[0.62rem] text-gl-muted-foreground">From one chart point to a board update in 26 seconds · every figure sourced</p>
      </div>
    </div>
  );
}

/** The v39 / v40 / v43 dashboards, driven by a scripted user. */
export function ScriptedBrief({ variant }: { variant: Variant }) {
  const { ref, scene: s } = useScene(BRIEF_CUES, BRIEF_LOOP, "proposal");
  const stageRef = useRef<HTMLDivElement>(null);
  const gold = variant === "voice";
  const rail = variant === "rail";
  const page: "brief" | "agents" = s.past("agents") ? "agents" : "brief";

  const chartText = segText(CHART.segments);
  const typedChart = useTyped(chartText, s.between("write", "proposal"), s.past("proposal"), 44, s.loop);
  const summaryTyped = useTyped(segText(SUMMARY), s.between("summary", "ready"), s.past("ready"), 72, s.loop);

  const selected = s.past("selected");
  const insight = selected ? CHART : IDLE;
  const stage = !selected ? "holding" : !s.past("write") ? "thinking" : !s.past("proposal") ? "typing" : "holding";
  const c: Cyc = {
    idx: selected ? 1 : 0,
    stage,
    typed: selected ? typedChart : segText(IDLE.segments).length,
    insight,
    focus: (selected ? "margin" : "none") as Focus,
  };
  const approve: ApproveState = { hover: s.between("toApprove", "approved"), pressed: s.between("pressA", "approved"), done: s.past("approved") };

  // cursor path
  const off = { x: DASH_W + 60, y: H - 40 };
  const contentX = rail ? 64 : 208;
  const contentW = DASH_W - contentX;
  let target: CursorTarget = off;
  let pointer = false;
  if (s.between("enter", "think")) {
    target = "chart-point";
    pointer = true;
  } else if (s.between("think", "toApprove")) target = { x: rail ? 300 : 620, y: rail ? 330 : 560 };
  else if (s.between("toApprove", "toAgents")) {
    target = "approve";
    pointer = true;
  } else if (s.between("toAgents", "agents")) {
    target = "nav-agents";
    pointer = true;
  } else if (s.between("agents", "toSend")) target = { x: contentX + contentW / 2 + 60, y: 480 };
  else if (s.between("toSend", "sending")) {
    target = "send";
    pointer = true;
  } else if (s.between("sending", "exit")) target = { x: contentX + contentW / 2 + 380, y: 640 };
  if (s.index < 0 || !s.past("enter") || s.past("exit")) target = off;
  const pressed = s.between("pressChart", "selected") || s.between("pressA", "approved") || s.between("pressNav", "agents") || s.between("pressSend", "sending");

  const shell = gold
    ? "glass-panel relative overflow-hidden rounded-[1.15rem] p-0 shadow-[var(--shadow-elevated)] ring-1 ring-inset ring-gl-gold/15"
    : "glass-panel relative overflow-hidden rounded-[1.15rem] p-0 shadow-[var(--shadow-elevated)]";

  return (
    <div ref={ref} style={{ width: DASH_W }}>
      <div ref={stageRef} className={shell} style={{ width: DASH_W, height: H }}>
        <div className="flex h-full">
          <Sidebar narrow={rail} active={page === "agents" ? "Agents" : "Executive Briefing"} hover={s.between("toAgents", "agents") ? "Agents" : undefined} />
          <div className="relative min-w-0 flex-1">
            <Screen show={page === "brief"} className="!p-0">
              <div className="flex h-full">
                {rail ? <GeniusRail c={c} approve={approve} /> : null}
                <div className="min-w-0 flex-1">
                  <Topbar stage={c.stage} orb={gold} shader={gold} />
                  {rail ? (
                    <div key={s.loop} className="space-y-3 p-4">
                      <Kpis focus={c.focus} glass={false} />
                      <Chart focus={c.focus} glass={false} selected={selected} />
                      <Units focus={c.focus} glass={false} />
                    </div>
                  ) : (
                    <div key={s.loop} className="space-y-3.5 p-5">
                      <Chart focus={c.focus} glass={false} selected={selected} />
                      <Kpis focus={c.focus} glass={false} />
                      <div className="grid grid-cols-[1.15fr_1fr] gap-3.5">
                        {gold ? <VoiceBriefing c={c} approve={approve} /> : <BriefingCard c={c} glass={false} approve={approve} />}
                        <Units focus={c.focus} glass={false} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Screen>
            <Screen show={page === "agents"} className="!p-0">
              <div className="flex h-full flex-col">
                <Topbar stage={c.stage} orb={gold} shader={gold} />
                <div className="relative min-h-0 flex-1">
                  <AgentsPage key={s.loop} s={s} gold={gold} width={contentW} summaryTyped={summaryTyped} />
                </div>
              </div>
            </Screen>
          </div>
        </div>
        <Cursor rootRef={stageRef} target={target} pointer={pointer} pressed={pressed} />
      </div>
    </div>
  );
}
