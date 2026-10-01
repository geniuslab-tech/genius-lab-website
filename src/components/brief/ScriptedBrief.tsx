"use client";

import { useEffect, useRef, useState } from "react";
import { Cursor, useScene, type CursorTarget } from "@/components/hero-demo/engine";
import { Screen } from "@/components/hero-demo/frame";
import { renderSegments, segText, type Segment } from "@/components/hero-demo/screens";
import {
  AskBox,
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
  type AskState,
  type Cyc,
  type Variant,
} from "./Dashboard";
import type { Focus, Insight } from "./insights";
import { GeniusShaderOrb, Waveform } from "./Orb";

/*
 * Storyboard — "Ask about one number, leave with a board update"
 *  1. Ask       The CFO clicks May on the chart and types a question to the agent.
 *  2. Answer    Genius thinks, then explains why May moved and what to do about it.
 *  3. Approve   The CFO approves the recommended actions.
 *  4. Agents    On Agents, the CFO asks the orb what the agents did overnight.
 *  5. Board     Genius reports each agent's results for approval and drafts the board
 *               update; the CFO approves and sends it. Seven emails go out.
 */
export const BRIEF_CUES = {
  start: 0,
  enter: 700,
  pressChart: 2000,
  selected: 2250,
  toAsk: 2700,
  pressAsk: 3600,
  type1: 3850,
  toSend1: 5900,
  pressSend1: 6700,
  asked: 6950,
  think: 7100,
  write: 8300,
  proposal: 13800,
  toApprove: 14500,
  pressA: 15600,
  approved: 15850,
  toAgents: 16800,
  pressNav: 17800,
  agents: 18050,
  toChat: 18500,
  pressChat: 19300,
  type2: 19550,
  toSend2: 22400,
  pressSend2: 23200,
  asked2: 23450,
  aThink: 23600,
  ins1: 24400,
  ins2: 25000,
  ins3: 25600,
  ins4: 26200,
  summary: 26700,
  ready: 30000,
  toSend: 30600,
  pressSend: 31600,
  sending: 31850,
  e1: 32500,
  e2: 32950,
  e3: 33400,
  e4: 33850,
  e5: 34300,
  e6: 34750,
  e7: 35200,
  open1: 35800,
  open2: 36400,
  toast: 36700,
  exit: 40000,
} as const;
export const BRIEF_LOOP = 42000;

const Q1 = "Why did gross margin slip in May?";
const Q2 = "What did the agents do overnight — and what needs my approval?";
const H = 900;

export const IDLE: Insight = {
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

export const BOARD = [
  ["MH", "Margaret Hale", "Chair"],
  ["JR", "James Ruiz", "Audit Committee"],
  ["AL", "Aiko Lin", "Independent director"],
  ["SK", "Samuel Kerr", "Investor director"],
  ["TP", "Teresa Park", "Independent director"],
  ["DW", "David Wu", "Chief Executive"],
  ["NB", "Nadia Bose", "Company Secretary"],
] as const;

/** Characters revealed while `play` runs; full once `done`. Restarts with `k`. */
export function useTyped(text: string, play: boolean, done: boolean, cps: number, k: number) {
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

function AgentsPage({ s, gold, width, summaryTyped, ask }: { s: Scene; gold: boolean; width: number; summaryTyped: number; ask: AskState }) {
  const cx = width / 2;
  const thinking = s.between("aThink", "ins1");
  const speaking = s.between("summary", "ready");
  const orbState = thinking ? "thinking" : speaking ? "typing" : "holding";
  const shown = (["ins1", "ins2", "ins3", "ins4"] as const).filter((k) => s.past(k)).length;
  const sending = s.past("sending");
  const sent = (["e1", "e2", "e3", "e4", "e5", "e6", "e7"] as const).filter((k) => s.past(k)).length;
  const opened = s.past("open2") ? 3 : s.past("open1") ? 1 : 0;
  const cards = [
    { x: cx - 320, y: 374 },
    { x: cx + 10, y: 374 },
    { x: cx - 320, y: 464 },
    { x: cx + 10, y: 464 },
  ];

  return (
    <div className="relative h-full w-full">
      {/* stage glow */}
      <div className="pointer-events-none absolute left-1/2 top-[72px] h-[380px] w-[620px] -translate-x-1/2 rounded-full blur-3xl" style={{ background: `radial-gradient(ellipse at center, color-mix(in oklab, ${gold ? "var(--gold)" : "var(--data)"} 22%, transparent), transparent 70%)` }} />
      {/* the orb, centre stage */}
      <div className="absolute flex flex-col items-center" style={{ left: cx - 120, top: 98, width: 240 }}>
        <GeniusShaderOrb state={orbState} size={142} tone={gold ? "gold" : "blue"} />
        <p className="mt-3 font-gl-display text-[1rem] text-gl-foreground">Genius · Agents</p>
        <p key={orbState} className="gfocus-tag text-[0.62rem] text-gl-muted-foreground">
          {thinking ? "Reading what every agent did overnight…" : speaking ? "Briefing you…" : s.past("asked2") ? "4 agents · 41 tasks · all governed" : "Ask me anything about your agents"}
        </p>
        {gold ? <Waveform active={speaking} className="mt-2" /> : null}
      </div>

      {/* chat under the orb */}
      <div className="absolute" style={{ left: cx - 320, top: 308, width: 640 }}>
        <AskBox ask={ask} cid="chat" tone={gold ? "gold" : "blue"} />
      </div>

      {/* insight cards, each awaiting approval */}
      {AGENT_INSIGHTS.map((a, i) => (
        <div
          key={a.agent}
          className="absolute w-[310px] rounded-xl border border-gl-border/70 bg-[linear-gradient(160deg,oklch(0.22_0.04_262/85%),oklch(0.16_0.03_264/85%))] p-3.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ left: cards[i]!.x, top: cards[i]!.y, opacity: i < shown ? (sending ? 0.25 : 1) : 0, transform: i < shown ? "none" : "translateY(10px)" }}
        >
          <p className="font-gl-mono text-[0.52rem] uppercase tracking-[0.16em]" style={{ color: a.tone === "gold" ? "var(--gold)" : a.tone === "success" ? "var(--success)" : "var(--data)" }}>
            {a.agent} agent
          </p>
          <p className="mt-1 text-[0.8rem] text-gl-foreground">{a.head}</p>
          <p className="font-gl-mono text-[0.56rem] text-gl-muted-foreground">{a.sub}</p>
          <span className="absolute right-3 top-3 rounded-full border border-gl-gold/35 px-1.5 py-0.5 font-gl-mono text-[0.46rem] uppercase tracking-[0.12em] text-gl-gold">
            {sending ? "✓ approved" : "for approval"}
          </span>
        </div>
      ))}

      {/* summary */}
      <div className="absolute rounded-xl border border-gl-border/60 bg-gl-background/40 px-5 py-3.5 transition-opacity duration-500" style={{ left: cx - 320, top: 560, width: 640, opacity: s.past("summary") ? (sending ? 0.3 : 1) : 0 }}>
        <p className="min-h-[46px] text-[0.8rem] leading-[1.6] text-gl-foreground/90">
          {renderSegments(SUMMARY, summaryTyped)}
          {summaryTyped > 0 && summaryTyped < segText(SUMMARY).length ? <span className="gcaret" /> : null}
        </p>
      </div>

      {/* board pack */}
      <div
        className="absolute flex items-center gap-4 rounded-xl border bg-[linear-gradient(160deg,oklch(0.24_0.05_70/30%),oklch(0.16_0.03_264/80%))] px-5 py-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ left: cx - 320, top: 656, width: 640, borderColor: "oklch(0.77 0.155 66 / 40%)", opacity: s.past("ready") ? (sending ? 0.3 : 1) : 0, transform: s.past("ready") ? "none" : "translateY(12px)" }}
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
          {sending ? "✓ Approved & sent" : "Approve all & send to board"}
        </span>
      </div>

      <Outbox
        sending={sending}
        sent={sent}
        opened={opened}
        toast={s.between("toast", "exit")}
        gold={gold}
        cx={cx}
        top={132}
        toastBody="Two questions to a sent board update · every figure sourced"
      />
    </div>
  );
}

/** The board update going out: the PDF drops into the email and seven directors move from queued to opened. */
export function Outbox({
  sending,
  sent,
  opened,
  toast,
  gold,
  cx,
  top,
  toastBody,
  subject = "Q3 Board Update — $18.4M cash recovered, margin protected",
  heading = "Sending the Q3 board update",
  toLabel = "Board of Directors",
  attachment = "Q3-Board-Update.pdf · 2.4 MB",
  recipients = BOARD,
}: {
  sending: boolean;
  sent: number;
  opened: number;
  toast: boolean;
  gold: boolean;
  cx: number;
  top: number;
  toastBody: string;
  subject?: string;
  heading?: string;
  toLabel?: string;
  attachment?: string;
  recipients?: readonly (readonly [string, string, string])[];
}) {
  const total = recipients.length;
  return (
    <>
      {/* outbox: the report goes out to seven board members */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${sending ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <div className="absolute inset-0 bg-[oklch(0.1_0.03_264/55%)] backdrop-blur-[2px]" />
        <div
          className="absolute overflow-hidden rounded-2xl border border-gl-border bg-[oklch(0.17_0.032_262/97%)] shadow-[0_40px_100px_-30px_rgb(0_0_0/0.85)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ left: cx - 340, top, width: 680, transform: sending ? "none" : "translateY(24px) scale(0.97)" }}
        >
          <div className="flex items-center gap-3 border-b border-gl-border/70 px-5 py-3.5">
            <GeniusShaderOrb state={sent < total ? "typing" : "holding"} size={30} tone={gold ? "gold" : "blue"} />
            <div className="flex-1">
              <p className="text-[0.78rem] text-gl-foreground">{heading}</p>
              <p className="font-gl-mono text-[0.56rem] text-gl-muted-foreground">From elena.costa@meridian.com · via Genius · encrypted · watermarked</p>
            </div>
            <span className="font-gl-mono text-[0.62rem] tabular-nums text-gl-foreground">{sent}/{total}</span>
          </div>
          <div className="space-y-1 border-b border-gl-border/60 px-5 py-3 text-[0.66rem]">
            <p>
              <span className="text-gl-muted-foreground">To </span>
              <span className="text-gl-foreground">
                {toLabel} ({total})
              </span>
            </p>
            <p>
              <span className="text-gl-muted-foreground">Subject </span>
              <span className="text-gl-foreground">{subject}</span>
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span key={String(sending)} className="brief-fly flex items-center gap-2 rounded-md border border-gl-border bg-gl-background/50 px-2 py-1">
                <span className="grid h-5 w-4 place-items-center rounded-sm bg-[oklch(0.97_0.004_250)] font-gl-mono text-[0.38rem] font-medium text-[oklch(0.45_0.15_25)]">PDF</span>
                <span className="text-[0.6rem] text-gl-foreground/85">{attachment}</span>
              </span>
            </div>
          </div>
          <div className="px-5 py-2">
            {recipients.map(([i, n, r], k) => {
              const st = k < sent ? (k < opened ? "Opened" : "Delivered") : k === sent && sent < total ? "Sending" : "Queued";
              return (
                <div key={i} className="flex items-center gap-3 border-b border-gl-border/40 py-[7px] last:border-0">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gl-foreground/10 text-[0.45rem] font-semibold text-gl-foreground">{i}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.66rem] text-gl-foreground">{n}</p>
                    <p className="text-[0.54rem] text-gl-muted-foreground">{r}</p>
                  </div>
                  <span className="relative h-3 w-16 overflow-hidden" aria-hidden="true">
                    <span className={`absolute top-1/2 h-px w-full -translate-y-1/2 ${k < sent ? "bg-[var(--success)]/40" : "bg-gl-foreground/10"}`} />
                    {k === sent && sent < total ? <span className="brief-env absolute top-0 text-[0.6rem] leading-3">✉</span> : null}
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
        className={`absolute bottom-6 left-6 w-[300px] rounded-xl border border-[oklch(0.78_0.13_168/35%)] bg-[oklch(0.17_0.03_262/97%)] p-3.5 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.7)] transition-all duration-700 ${toast ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <p className="text-[0.72rem] text-gl-foreground">✓ Board update delivered to 7 directors</p>
        <p className="mt-0.5 text-[0.62rem] text-gl-muted-foreground">{toastBody}</p>
      </div>
    </>
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
  const q1Typed = useTyped(Q1, s.between("type1", "toSend1"), s.past("toSend1"), 22, s.loop);
  const q2Typed = useTyped(Q2, s.between("type2", "toSend2"), s.past("toSend2"), 24, s.loop);
  const ask1: AskState = {
    text: Q1,
    typed: q1Typed,
    focused: s.between("pressAsk", "asked"),
    sent: s.past("asked"),
    hoverSend: s.between("toSend1", "asked"),
    pressSend: s.between("pressSend1", "asked"),
  };
  const ask2: AskState = {
    text: Q2,
    typed: q2Typed,
    focused: s.between("pressChat", "asked2"),
    sent: s.past("asked2"),
    hoverSend: s.between("toSend2", "asked2"),
    pressSend: s.between("pressSend2", "asked2"),
    placeholder: "Ask your agents…",
  };

  const selected = s.past("selected");
  const asked = s.past("asked");
  const insight = asked ? CHART : IDLE;
  const stage = !asked ? "holding" : !s.past("write") ? "thinking" : !s.past("proposal") ? "typing" : "holding";
  const c: Cyc = {
    idx: selected ? 1 : 0,
    stage,
    typed: asked ? typedChart : segText(IDLE.segments).length,
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
  if (s.between("enter", "toAsk")) {
    target = "chart-point";
    pointer = true;
  } else if (s.between("toAsk", "toSend1")) {
    target = "ask-input";
    pointer = true;
  } else if (s.between("toSend1", "think")) {
    target = "ask-send";
    pointer = true;
  } else if (s.between("think", "toApprove")) target = { x: rail ? 300 : 620, y: rail ? 330 : 560 };
  else if (s.between("toApprove", "toAgents")) {
    target = "approve";
    pointer = true;
  } else if (s.between("toAgents", "agents")) {
    target = "nav-agents";
    pointer = true;
  } else if (s.between("toChat", "toSend2")) {
    target = "chat-input";
    pointer = true;
  } else if (s.between("toSend2", "aThink")) {
    target = "chat-send";
    pointer = true;
  } else if (s.between("agents", "toSend")) target = { x: contentX + contentW / 2 + 60, y: 612 };
  else if (s.between("toSend", "sending")) {
    target = "send";
    pointer = true;
  } else if (s.between("sending", "exit")) target = { x: contentX + contentW / 2 + 380, y: 712 };
  if (s.index < 0 || !s.past("enter") || s.past("exit")) target = off;
  const pressed = s.between("pressChart", "selected") || s.between("pressAsk", "type1") || s.between("pressSend1", "asked") || s.between("pressChat", "type2") || s.between("pressSend2", "asked2") || s.between("pressA", "approved") || s.between("pressNav", "agents") || s.between("pressSend", "sending");

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
                {rail ? <GeniusRail c={c} approve={approve} ask={ask1} /> : null}
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
                        {gold ? <VoiceBriefing c={c} approve={approve} ask={ask1} /> : <BriefingCard c={c} glass={false} approve={approve} ask={ask1} />}
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
                  <AgentsPage key={s.loop} s={s} gold={gold} width={contentW} summaryTyped={summaryTyped} ask={ask2} />
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
