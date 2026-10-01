"use client";

import { useRef } from "react";
import { Cursor, useScene, type CursorTarget } from "@/components/hero-demo/engine";
import { Screen } from "@/components/hero-demo/frame";
import { renderSegments, segText, type Segment } from "@/components/hero-demo/screens";
import { AskBox, BriefingCard, Chart, DASH_W, Kpis, Sidebar, Topbar, Units, type ApproveState, type AskState, type Cyc } from "./Dashboard";
import type { Focus, Insight } from "./insights";
import { BrainSphere } from "@/components/v2/BrainSphere";
import { GeniusShaderOrb } from "./Orb";
import { BOARD, IDLE, Outbox, useTyped } from "./ScriptedBrief";

/*
 * Storyboard (v39.1) — "Cash, asked of an executive team of agents"
 *  1. Select    The CFO clicks the Revenue card, then the Free cash flow card.
 *  2. Ask       She types: "Revenue is ahead — so why is free cash flow $4.2M behind budget?"
 *  3. Answer    Genius explains where the cash is stuck and recommends releasing it. She approves.
 *  4. Team      On Agents, five executive agents (CFO, COO, CHRO, CCO, CEO) are signalling to
 *               each other. She clicks the CFO agent to talk to it.
 *  5. Board     She asks what needs her approval; the CFO agent returns the moves its peers
 *               prepared. She approves them all and the board update goes out.
 */
const CUES = {
  start: 0,
  enter: 700,
  press1: 1800,
  sel1: 2050,
  toCash: 2500,
  press2: 3400,
  sel2: 3650,
  toAsk: 4100,
  pressAsk: 5000,
  type1: 5250,
  toSend1: 8500,
  pressSend1: 9300,
  asked: 9550,
  think: 9700,
  write: 10900,
  proposal: 16600,
  toApprove: 17300,
  pressA: 18400,
  approved: 18650,
  toAgents: 19600,
  pressNav: 20600,
  agents: 20850,
  toCfo: 22600,
  pressCfo: 23500,
  cfo: 23750,
  toChat: 24300,
  pressChat: 25100,
  type2: 25350,
  toSend2: 28300,
  pressSend2: 29100,
  asked2: 29350,
  aThink: 29500,
  reply: 30300,
  ins1: 32200,
  ins2: 32700,
  ins3: 33200,
  ins4: 33700,
  ready: 34300,
  toSend: 34900,
  pressSend: 35900,
  sending: 36150,
  e1: 36800,
  e2: 37250,
  e3: 37700,
  e4: 38150,
  e5: 38600,
  e6: 39050,
  e7: 39500,
  open1: 40100,
  open2: 40700,
  toast: 41000,
  exit: 44500,
} as const;
const LOOP = 46500;
const H = 900;

export const Q1 = "Revenue is ahead — so why is free cash flow $4.2M behind budget?";
const Q2 = "What did the team work out overnight — and what needs my approval?";

export const CASH: Insight = {
  focus: "cash",
  tag: "Cash · revenue vs FCF",
  segments: [
    { t: "Revenue is " },
    { t: "6.4% ahead", tone: "data" },
    { t: ", but free cash flow is " },
    { t: "$4.2M behind budget", tone: "gold" },
    { t: ". The cash is stuck in " },
    { t: "Southeast inventory (+18%)", tone: "strong" },
    { t: " and " },
    { t: "slower EMEA collections", tone: "strong" },
    { t: ". Releasing slow stock and chasing 11 overdue accounts recovers $2.5M this quarter." },
  ],
  sources: ["WMS · 3 sites", "AR ledger · 4,200 invoices", "Budget FY26 v3"],
  action: { title: "Release $1.4M inventory · chase $1.1M receivables", impact: "Cash +$2.5M this quarter", cta: "Approve" },
};

export type Exec = { id: string; role: string; scope: string; tint: string; color: string; angle: number };
export const TEAM: Exec[] = [
  { id: "ceo", role: "CEO", scope: "Strategy & priorities", tint: "#c9b8ff", color: "oklch(0.75 0.13 295)", angle: -90 },
  { id: "coo", role: "COO", scope: "Operations & supply", tint: "#a0e7ff", color: "oklch(0.85 0.11 205)", angle: -18 },
  { id: "cco", role: "CCO", scope: "Customers & revenue", tint: "#b8ffcf", color: "oklch(0.82 0.14 155)", angle: 54 },
  { id: "chro", role: "CHRO", scope: "People & workforce", tint: "#ffb8d9", color: "oklch(0.78 0.13 350)", angle: 126 },
  { id: "cfo", role: "CFO", scope: "Cash, capital & reporting", tint: "#ffd9a0", color: "oklch(0.8 0.14 75)", angle: 198 },
];
/** where each agent sits around the Second Brain (x offset from centre, y) */
const SEATS: Record<string, { dx: number; y: number }> = {
  ceo: { dx: 0, y: 96 },
  cfo: { dx: -365, y: 262 },
  coo: { dx: 365, y: 262 },
  chro: { dx: -290, y: 610 },
  cco: { dx: 290, y: 610 },
};
const BRAIN = { y: 420, size: 400 };
/** Second Brain hubs (Systems, Tables, Metrics, Dashboards, Processes, Customers, Operations, Finance) */
const HUBS_IDLE = [0, 2, 4];
const HUBS_CFO = [7, 6, 5];
const TASKS: Record<string, number> = { ceo: 7, cfo: 12, coo: 9, chro: 5, cco: 8 };

const REPLY: Segment[] = [
  { t: "I worked this through with the " },
  { t: "COO, CCO and CHRO", tone: "strong" },
  { t: " overnight. Four moves recover " },
  { t: "$3.4M of cash", tone: "gold" },
  { t: " this quarter — they need your approval:" },
];

const MOVES = [
  { from: "COO", title: "Release $1.4M of Southeast inventory", impact: "Cash +$1.4M · 3 sites" },
  { from: "CCO", title: "Chase 11 EMEA accounts over 60 days", impact: "Cash +$1.1M · DSO −6 days" },
  { from: "CHRO", title: "Pause 14 non-critical backfills in Q4", impact: "Opex −$0.9M · no critical roles" },
  { from: "CEO", title: "Brief the board on the cash plan", impact: "Q3 update drafted · 12 pages" },
] as const;

type Scene = ReturnType<typeof useScene<typeof CUES>>["scene"];

const orbPos = (e: Exec, cx: number) => ({ x: Math.round(cx + SEATS[e.id]!.dx), y: SEATS[e.id]!.y });

function TeamPage({ s, width, ask, replyTyped }: { s: Scene; width: number; ask: AskState; replyTyped: number }) {
  const cx = width / 2;
  const focused = s.past("cfo");
  const pos = TEAM.map((e) => orbPos(e, cx));
  const thinking = s.between("aThink", "reply");
  const writing = s.between("reply", "ins1");
  const shown = (["ins1", "ins2", "ins3", "ins4"] as const).filter((k) => s.past(k)).length;
  const sending = s.past("sending");
  const sent = (["e1", "e2", "e3", "e4", "e5", "e6", "e7"] as const).filter((k) => s.past(k)).length;
  const opened = s.past("open2") ? 3 : s.past("open1") ? 1 : 0;
  const cfo = TEAM.find((t) => t.id === "cfo")!;

  /** a spoke from an agent to the edge of the Second Brain */
  const spoke = (i: number) => {
    const o = pos[i]!;
    const dx = cx - o.x;
    const dy = BRAIN.y - o.y;
    const len = Math.hypot(dx, dy);
    const r = BRAIN.size * 0.36;
    const ex = Math.round(cx - (dx / len) * r);
    const ey = Math.round(BRAIN.y - (dy / len) * r);
    const sx = Math.round(o.x + (dx / len) * 64);
    const sy = Math.round(o.y + (dy / len) * 64);
    return { inward: `M ${sx} ${sy} L ${ex} ${ey}`, outward: `M ${ex} ${ey} L ${sx} ${sy}` };
  };

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-6 top-5">
        <p className="font-gl-display text-[0.95rem] text-gl-foreground">Executive agents</p>
        <p className="text-[0.6rem] text-gl-muted-foreground">5 agents · reading one Second Brain · 41 tasks overnight</p>
      </div>
      <div className="pointer-events-none absolute rounded-full blur-3xl" style={{ left: cx - 340, top: BRAIN.y - 300, width: 680, height: 600, background: "radial-gradient(ellipse at center, oklch(0.6 0.17 262 / 16%), transparent 70%)" }} />

      {/* the Second Brain at the centre of everything */}
      <div className="absolute" style={{ left: cx - BRAIN.size / 2, top: BRAIN.y - BRAIN.size / 2, width: BRAIN.size, height: BRAIN.size }}>
        <BrainSphere tone="dark" clean state={{ visited: focused ? HUBS_CFO : HUBS_IDLE, step: 1 }} />
      </div>
      <div className="absolute -translate-x-1/2 text-center" style={{ left: cx, top: BRAIN.y + BRAIN.size / 2 - 6 }}>
        <p className="font-gl-display text-[0.86rem] text-gl-foreground">Second Brain</p>
        <p className="font-gl-mono text-[0.5rem] uppercase tracking-[0.18em] text-gl-muted-foreground/80">14 entities · 2.4M records · governed</p>
      </div>

      {/* every agent reads from and writes back to it */}
      <svg className="pointer-events-none absolute inset-0" width={width} height={H - 58} aria-hidden="true">
        {TEAM.map((e, i) => {
          const sp = spoke(i);
          const isCfo = e.id === "cfo";
          return (
            <g key={e.id} style={{ opacity: !focused || isCfo ? 1 : 0.2, transition: "opacity .6s" }}>
              <path d={sp.inward} fill="none" stroke={e.color} strokeOpacity="0.28" strokeWidth="1" strokeDasharray="2 6" />
              <circle r="2.6" fill={e.color}>
                <animateMotion dur={`${2 + (i % 3) * 0.4}s`} begin={`${i * 0.3}s`} repeatCount="indefinite" path={sp.inward} />
              </circle>
              <circle r="2" fill="var(--cyan)" opacity="0.75">
                <animateMotion dur={`${2.4 + (i % 2) * 0.5}s`} begin={`${1 + i * 0.25}s`} repeatCount="indefinite" path={sp.outward} />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* the five executive agents */}
      {TEAM.map((e, i) => {
        const o = pos[i]!;
        const isCfo = e.id === "cfo";
        const hot = isCfo && s.between("toCfo", "cfo");
        return (
          <div
            key={e.id}
            data-cursor={`orb-${e.id}`}
            className="absolute flex w-[180px] flex-col items-center transition-all duration-300"
            style={{ left: o.x - 90, top: o.y - 56, transform: hot ? "scale(1.05)" : "none" }}
          >
            <span className="relative">
              {hot ? <span className="absolute -inset-3 rounded-full border shadow-[0_0_30px_-4px_currentColor]" style={{ borderColor: e.color, color: e.color }} /> : null}
              <GeniusShaderOrb state="typing" size={104} tint={e.tint} />
            </span>
            <p className="mt-2.5 font-gl-display text-[0.98rem] tracking-tight" style={{ color: e.color }}>
              {e.role} agent
            </p>
            <p className="text-[0.6rem] text-gl-muted-foreground">{e.scope}</p>
            <p className="mt-1 flex items-center gap-1.5 font-gl-mono text-[0.48rem] uppercase tracking-[0.12em] text-gl-muted-foreground/80">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--success)]" /> Online · {TASKS[e.id]} tasks
            </p>
          </div>
        );
      })}

      {/* a private chat with the chosen agent: every next interaction happens here */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${focused ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <div className="absolute inset-0 bg-[oklch(0.1_0.03_264/62%)] backdrop-blur-[3px]" />
        <div
          className="absolute overflow-hidden rounded-[22px] border bg-[linear-gradient(170deg,oklch(0.2_0.04_262/98%),oklch(0.14_0.03_264/98%))] shadow-[0_50px_120px_-30px_rgb(0_0_0/0.85)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ left: cx - 410, top: 28, width: 820, height: 786, borderColor: "oklch(0.8 0.14 75 / 35%)", transform: focused ? "none" : "translateY(20px) scale(0.97)" }}
        >
          <div className="flex items-center gap-3 border-b border-gl-border/60 px-6 py-3.5">
            <GeniusShaderOrb state="holding" size={26} tint={cfo.tint} />
            <div className="flex-1">
              <p className="text-[0.8rem] text-gl-foreground">CFO agent</p>
              <p className="text-[0.58rem] text-gl-muted-foreground">Private chat · {cfo.scope.toLowerCase()} · reads the Second Brain</p>
            </div>
            <span className="grid h-7 w-7 place-items-center rounded-md border border-gl-border text-[0.7rem] text-gl-muted-foreground">✕</span>
          </div>
          <div className="pointer-events-none absolute left-1/2 top-[56px] h-[220px] w-[380px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.8_0.14_75/16%),transparent_70%)] blur-2xl" />
          <div className="absolute flex flex-col items-center" style={{ left: 410 - 100, top: 70, width: 200 }}>
            <GeniusShaderOrb state={thinking ? "thinking" : writing ? "typing" : "holding"} size={112} tint={cfo.tint} />
            <p className="mt-2.5 font-gl-display text-[0.92rem]" style={{ color: cfo.color }}>
              CFO agent
            </p>
            <p className="text-[0.56rem] text-gl-muted-foreground">{thinking ? "Checking with the COO, CCO and CHRO…" : writing ? "Answering…" : "Ready when you are"}</p>
          </div>

          {/* conversation */}
          <div className="absolute" style={{ left: 60, top: 248, width: 700 }}>
            {ask.sent ? <AskBox ask={ask} /> : null}
            <div className={`mt-2.5 flex items-start gap-2.5 transition-opacity duration-500 ${s.past("aThink") ? "opacity-100" : "opacity-0"}`}>
              <GeniusShaderOrb state={thinking ? "thinking" : writing ? "typing" : "holding"} size={26} tint={cfo.tint} />
              <p className="min-h-[34px] flex-1 text-[0.72rem] leading-[1.5] text-gl-foreground/90">
                {thinking ? <span className="text-gl-muted-foreground">Checking with the COO, CCO and CHRO…</span> : renderSegments(REPLY, replyTyped)}
                {writing && replyTyped < segText(REPLY).length ? <span className="gcaret" /> : null}
              </p>
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-2.5">
              {MOVES.map((m, i) => (
                <div
                  key={m.title}
                  className="rounded-xl border border-gl-border/70 bg-[linear-gradient(160deg,oklch(0.22_0.04_262/85%),oklch(0.16_0.03_264/85%))] px-3.5 py-2.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ opacity: i < shown ? (sending ? 0.5 : 1) : 0, transform: i < shown ? "none" : "translateY(8px)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-gl-mono text-[0.5rem] uppercase tracking-[0.16em]" style={{ color: TEAM.find((t) => t.role === m.from)!.color }}>
                      From {m.from} agent
                    </span>
                    <span className="rounded-full border border-gl-gold/35 px-1.5 py-0.5 font-gl-mono text-[0.44rem] uppercase tracking-[0.12em] text-gl-gold">{sending ? "✓ approved" : "for approval"}</span>
                  </div>
                  <p className="mt-1 text-[0.7rem] text-gl-foreground">{m.title}</p>
                  <p className="font-gl-mono text-[0.52rem] text-gl-muted-foreground">{m.impact}</p>
                </div>
              ))}
            </div>
            <div
              className="mt-2.5 flex items-center gap-3 rounded-xl border border-gl-gold/40 bg-[linear-gradient(160deg,oklch(0.24_0.05_70/30%),oklch(0.16_0.03_264/80%))] px-4 py-2.5 transition-all duration-700"
              style={{ opacity: s.past("ready") ? 1 : 0, transform: s.past("ready") ? "none" : "translateY(8px)" }}
            >
              <span className="grid h-10 w-8 shrink-0 place-items-center rounded-md bg-[oklch(0.97_0.004_250)] font-gl-mono text-[0.42rem] font-medium text-[oklch(0.45_0.15_25)]">PDF</span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.72rem] text-gl-foreground">Q3 cash plan — 4 moves, $3.4M recovered</p>
                <div className="mt-1 flex -space-x-1.5">
                  {BOARD.map(([i]) => (
                    <span key={i} className="grid h-5 w-5 place-items-center rounded-full border-2 border-[oklch(0.17_0.03_262)] bg-gl-foreground/12 text-[0.4rem] font-semibold text-gl-foreground">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
              <span
                data-cursor="send"
                className={`shrink-0 rounded-md px-3 py-1.5 text-[0.66rem] font-medium transition-all duration-200 ${sending ? "bg-[var(--success)] text-gl-background" : "bg-gl-gold text-gl-background"} ${s.between("toSend", "sending") ? "brightness-110 shadow-[0_0_0_4px_oklch(0.77_0.155_66/22%)]" : ""} ${s.between("pressSend", "sending") ? "scale-95" : ""}`}
              >
                {sending ? "✓ Approved & sent" : "Approve all & send to board"}
              </span>
            </div>
          </div>

          {/* chat input, pinned to the bottom like any chat */}
          <div className="absolute" style={{ left: 60, bottom: 26, width: 700 }}>
            <AskBox ask={ask.sent ? { ...ask, sent: false, typed: 0, focused: false } : ask} cid="chat" tone="gold" />
          </div>
        </div>
      </div>

      <Outbox
        sending={sending}
        sent={sent}
        opened={opened}
        toast={s.between("toast", "exit")}
        gold
        cx={cx}
        top={150}
        subject="Q3 cash plan — $3.4M recovered across 4 moves"
        toastBody="One chat with the CFO agent · approved and sent to the board"
      />
    </div>
  );
}

/** v39.1 — the v39 dashboard with KPI-card selection and an executive team of agents. */
export function ScriptedBriefTeam() {
  const { ref, scene: s } = useScene(CUES, LOOP, "proposal");
  const stageRef = useRef<HTMLDivElement>(null);
  const page: "brief" | "agents" = s.past("agents") ? "agents" : "brief";

  const typedCash = useTyped(segText(CASH.segments), s.between("write", "proposal"), s.past("proposal"), 52, s.loop);
  const replyTyped = useTyped(segText(REPLY), s.between("reply", "ins1"), s.past("ins1"), 60, s.loop);
  const q1 = useTyped(Q1, s.between("type1", "toSend1"), s.past("toSend1"), 26, s.loop);
  const q2 = useTyped(Q2, s.between("type2", "toSend2"), s.past("toSend2"), 30, s.loop);
  const ask1: AskState = { text: Q1, typed: q1, focused: s.between("pressAsk", "asked"), sent: s.past("asked"), hoverSend: s.between("toSend1", "asked"), pressSend: s.between("pressSend1", "asked") };
  const ask2: AskState = { text: Q2, typed: q2, focused: s.between("pressChat", "asked2"), sent: s.past("asked2"), hoverSend: s.between("toSend2", "asked2"), pressSend: s.between("pressSend2", "asked2"), placeholder: "Message the CFO agent…" };

  const asked = s.past("asked");
  const stage = !asked ? "holding" : !s.past("write") ? "thinking" : !s.past("proposal") ? "typing" : "holding";
  const c: Cyc = {
    idx: asked ? 1 : 0,
    stage,
    typed: asked ? typedCash : segText(IDLE.segments).length,
    insight: asked ? CASH : IDLE,
    focus: (asked ? "cash" : "none") as Focus,
  };
  const selected = [...(s.past("sel1") ? ["revenue"] : []), ...(s.past("sel2") ? ["cash"] : [])];
  const approve: ApproveState = { hover: s.between("toApprove", "approved"), pressed: s.between("pressA", "approved"), done: s.past("approved") };

  const contentX = 208;
  const contentW = DASH_W - contentX;
  const off = { x: DASH_W + 60, y: H - 40 };
  let target: CursorTarget = off;
  let pointer = false;
  if (s.between("enter", "toCash")) {
    target = "kpi-revenue";
    pointer = true;
  } else if (s.between("toCash", "toAsk")) {
    target = "kpi-cash";
    pointer = true;
  } else if (s.between("toAsk", "toSend1")) {
    target = "ask-input";
    pointer = true;
  } else if (s.between("toSend1", "think")) {
    target = "ask-send";
    pointer = true;
  } else if (s.between("think", "toApprove")) target = { x: 620, y: 560 };
  else if (s.between("toApprove", "toAgents")) {
    target = "approve";
    pointer = true;
  } else if (s.between("toAgents", "agents")) {
    target = "nav-agents";
    pointer = true;
  } else if (s.between("agents", "toCfo")) target = { x: contentX + contentW / 2 + 150, y: 520 };
  else if (s.between("toCfo", "toChat")) {
    target = "orb-cfo";
    pointer = true;
  } else if (s.between("toChat", "toSend2")) {
    target = "chat-input";
    pointer = true;
  } else if (s.between("toSend2", "aThink")) {
    target = "chat-send";
    pointer = true;
  } else if (s.between("aThink", "toSend")) target = { x: contentX + contentW / 2 + 300, y: 300 };
  else if (s.between("toSend", "sending")) {
    target = "send";
    pointer = true;
  } else if (s.between("sending", "exit")) target = { x: contentX + contentW / 2 + 380, y: 700 };
  if (s.index < 0 || !s.past("enter") || s.past("exit")) target = off;
  const pressed =
    s.between("press1", "sel1") ||
    s.between("press2", "sel2") ||
    s.between("pressAsk", "type1") ||
    s.between("pressSend1", "asked") ||
    s.between("pressA", "approved") ||
    s.between("pressNav", "agents") ||
    s.between("pressCfo", "cfo") ||
    s.between("pressChat", "type2") ||
    s.between("pressSend2", "asked2") ||
    s.between("pressSend", "sending");

  return (
    <div ref={ref} style={{ width: DASH_W }}>
      <div ref={stageRef} className="glass-panel relative overflow-hidden rounded-[1.15rem] p-0 shadow-[var(--shadow-elevated)]" style={{ width: DASH_W, height: H }}>
        <div className="flex h-full">
          <Sidebar active={page === "agents" ? "Agents" : "Executive Briefing"} hover={s.between("toAgents", "agents") ? "Agents" : undefined} />
          <div className="relative min-w-0 flex-1">
            <Screen show={page === "brief"} className="!p-0">
              <Topbar stage={c.stage} />
              <div key={s.loop} className="space-y-3.5 p-5">
                <Chart focus={c.focus} glass={false} />
                <Kpis focus={c.focus} glass={false} selected={selected} pressed={s.between("press1", "sel1") ? "revenue" : s.between("press2", "sel2") ? "cash" : undefined} />
                <div className="grid grid-cols-[1.15fr_1fr] gap-3.5">
                  <BriefingCard c={c} glass={false} approve={approve} ask={ask1} />
                  <Units focus={c.focus} glass={false} />
                </div>
              </div>
            </Screen>
            <Screen show={page === "agents"} className="!p-0">
              <div className="flex h-full flex-col">
                <Topbar stage={c.stage} />
                <div className="relative min-h-0 flex-1">
                  <TeamPage key={s.loop} s={s} width={contentW} ask={ask2} replyTyped={replyTyped} />
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
