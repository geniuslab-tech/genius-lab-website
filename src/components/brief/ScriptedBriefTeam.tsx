"use client";

import { useRef } from "react";
import { Cursor, useScene, type CursorTarget } from "@/components/hero-demo/engine";
import { Screen } from "@/components/hero-demo/frame";
import { renderSegments, segText, type Segment } from "@/components/hero-demo/screens";
import { AskBox, BriefingCard, Chart, DASH_W, Kpis, Sidebar, Topbar, Units, type ApproveState, type AskState, type Cyc } from "./Dashboard";
import type { Focus, Insight } from "./insights";
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

const Q1 = "Revenue is ahead — so why is free cash flow $4.2M behind budget?";
const Q2 = "What did the team work out overnight — and what needs my approval?";

const CASH: Insight = {
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

type Exec = { id: string; role: string; scope: string; tint: string; color: string; angle: number };
const TEAM: Exec[] = [
  { id: "ceo", role: "CEO", scope: "Strategy & priorities", tint: "#c9b8ff", color: "oklch(0.75 0.13 295)", angle: -90 },
  { id: "coo", role: "COO", scope: "Operations & supply", tint: "#a0e7ff", color: "oklch(0.85 0.11 205)", angle: -18 },
  { id: "cco", role: "CCO", scope: "Customers & revenue", tint: "#b8ffcf", color: "oklch(0.82 0.14 155)", angle: 54 },
  { id: "chro", role: "CHRO", scope: "People & workforce", tint: "#ffb8d9", color: "oklch(0.78 0.13 350)", angle: 126 },
  { id: "cfo", role: "CFO", scope: "Cash, capital & reporting", tint: "#ffd9a0", color: "oklch(0.8 0.14 75)", angle: 198 },
];
/** who talks to whom: the pentagon plus the CFO's lines to everyone */
const LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 0],
  [4, 1],
  [4, 2],
  [0, 3],
];
const CHATTER = [
  { link: 5, text: "Inventory −$1.4M?", delay: 0 },
  { link: 6, text: "11 accounts > 60d", delay: 1.4 },
  { link: 2, text: "Pause 14 backfills", delay: 2.8 },
  { link: 4, text: "Board wants cash plan", delay: 4.2 },
];

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

const orbPos = (e: Exec, cx: number) => {
  const a = (e.angle * Math.PI) / 180;
  return { x: Math.round(cx + Math.cos(a) * 330), y: Math.round(206 + Math.sin(a) * 128) };
};

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
  const link = (i: number) => {
    const [a, b] = LINKS[i]!;
    const p = pos[a]!;
    const q = pos[b]!;
    const mx = (p.x + q.x) / 2 + (cx - (p.x + q.x) / 2) * 0.25;
    const my = (p.y + q.y) / 2 + (206 - (p.y + q.y) / 2) * 0.25;
    return { d: `M ${p.x} ${p.y} Q ${Math.round(mx)} ${Math.round(my)} ${q.x} ${q.y}`, back: `M ${q.x} ${q.y} Q ${Math.round(mx)} ${Math.round(my)} ${p.x} ${p.y}`, mx, my, a, b };
  };

  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute left-1/2 top-[40px] h-[360px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.6_0.17_270/16%),transparent_70%)] blur-2xl" />

      {/* signals between the agents */}
      <svg className="pointer-events-none absolute inset-0" width={width} height={H - 58} aria-hidden="true">
        {LINKS.map((_, i) => {
          const l = link(i);
          const cfoLink = l.a === 4 || l.b === 4;
          const lit = !focused || cfoLink;
          const ca = TEAM[l.a]!.color;
          const cb = TEAM[l.b]!.color;
          return (
            <g key={i} style={{ opacity: lit ? 1 : 0.25, transition: "opacity .6s" }}>
              <path d={l.d} fill="none" stroke="oklch(1 0 0 / 12%)" strokeWidth={focused && cfoLink ? 1.6 : 1} strokeDasharray="3 5" />
              <circle r="3" fill={ca}>
                <animateMotion dur={`${2.2 + (i % 3) * 0.5}s`} begin={`${i * 0.35}s`} repeatCount="indefinite" path={l.d} />
              </circle>
              <circle r="2.4" fill={cb} opacity="0.85">
                <animateMotion dur={`${2.6 + (i % 2) * 0.6}s`} begin={`${0.8 + i * 0.3}s`} repeatCount="indefinite" path={l.back} />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* what they are saying to each other */}
      {CHATTER.map((c) => {
        const l = link(c.link);
        return (
          <span
            key={c.text}
            className="team-chatter absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/12 bg-[oklch(0.2_0.04_262/92%)] px-2 py-0.5 font-gl-mono text-[0.5rem] text-gl-foreground/80"
            style={{ left: Math.round(l.mx), top: Math.round(l.my), animationDelay: `${c.delay}s`, opacity: focused ? 0 : undefined }}
          >
            {c.text}
          </span>
        );
      })}

      {/* the five executive agents */}
      {TEAM.map((e, i) => {
        const p = pos[i]!;
        const isCfo = e.id === "cfo";
        const dim = focused && !isCfo;
        const hot = isCfo && (s.between("toCfo", "cfo") || focused);
        const st = isCfo && thinking ? "thinking" : isCfo && writing ? "typing" : focused && !isCfo ? "holding" : "typing";
        return (
          <div
            key={e.id}
            data-cursor={`orb-${e.id}`}
            className="absolute flex w-[150px] flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ left: p.x - 75, top: p.y - 44, opacity: dim ? 0.4 : 1, transform: `scale(${isCfo && focused ? 1.12 : dim ? 0.9 : 1})` }}
          >
            <span className="relative">
              {hot ? <span className="absolute -inset-3 rounded-full border border-[oklch(0.8_0.14_75/60%)] shadow-[0_0_30px_-4px_oklch(0.8_0.14_75/60%)]" /> : null}
              <GeniusShaderOrb state={st} size={88} tint={e.tint} />
            </span>
            <p className="mt-2 font-gl-display text-[0.9rem] tracking-tight" style={{ color: e.color }}>
              {e.role} agent
            </p>
            <p className="text-[0.56rem] text-gl-muted-foreground">{e.scope}</p>
          </div>
        );
      })}

      {/* conversation with the CFO agent */}
      <div className="absolute transition-opacity duration-500" style={{ left: cx - 320, top: 398, width: 640, opacity: focused ? 1 : 0 }}>
        <p className="mb-1.5 font-gl-mono text-[0.52rem] uppercase tracking-[0.16em] text-gl-gold">Talking to · CFO agent</p>
        <AskBox ask={ask} cid="chat" tone="gold" />
      </div>
      <div className="absolute flex items-start gap-2.5 transition-opacity duration-500" style={{ left: cx - 320, top: 476, width: 640, opacity: s.past("aThink") ? 1 : 0 }}>
        <GeniusShaderOrb state={thinking ? "thinking" : writing ? "typing" : "holding"} size={26} tint={TEAM[4]!.tint} />
        <p className="min-h-[36px] flex-1 text-[0.74rem] leading-[1.55] text-gl-foreground/90">
          {thinking ? <span className="text-gl-muted-foreground">CFO agent is checking with the COO, CCO and CHRO…</span> : renderSegments(REPLY, replyTyped)}
          {writing && replyTyped < segText(REPLY).length ? <span className="gcaret" /> : null}
        </p>
      </div>
      {MOVES.map((m, i) => (
        <div
          key={m.title}
          className="absolute rounded-xl border border-gl-border/70 bg-[linear-gradient(160deg,oklch(0.22_0.04_262/85%),oklch(0.16_0.03_264/85%))] px-3.5 py-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ left: cx - 320 + (i % 2) * 330, top: 530 + Math.floor(i / 2) * 84, width: 310, opacity: i < shown ? (sending ? 0.3 : 1) : 0, transform: i < shown ? "none" : "translateY(10px)" }}
        >
          <div className="flex items-center justify-between">
            <span className="font-gl-mono text-[0.5rem] uppercase tracking-[0.16em]" style={{ color: TEAM.find((t) => t.role === m.from)!.color }}>
              From {m.from} agent
            </span>
            <span className="rounded-full border border-gl-gold/35 px-1.5 py-0.5 font-gl-mono text-[0.44rem] uppercase tracking-[0.12em] text-gl-gold">{sending ? "✓ approved" : "for approval"}</span>
          </div>
          <p className="mt-1 text-[0.72rem] text-gl-foreground">{m.title}</p>
          <p className="font-gl-mono text-[0.54rem] text-gl-muted-foreground">{m.impact}</p>
        </div>
      ))}

      {/* approve everything and send */}
      <div
        className="absolute flex items-center gap-3 rounded-xl border border-gl-gold/40 bg-[linear-gradient(160deg,oklch(0.24_0.05_70/30%),oklch(0.16_0.03_264/80%))] px-4 py-3 transition-all duration-700"
        style={{ left: cx - 320, top: 708, width: 640, opacity: s.past("ready") ? (sending ? 0.3 : 1) : 0, transform: s.past("ready") ? "none" : "translateY(10px)" }}
      >
        <span className="grid h-11 w-9 shrink-0 place-items-center rounded-md bg-[oklch(0.97_0.004_250)] font-gl-mono text-[0.45rem] font-medium text-[oklch(0.45_0.15_25)]">PDF</span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.74rem] text-gl-foreground">Q3 cash plan — 4 moves, $3.4M recovered</p>
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

      <Outbox
        sending={sending}
        sent={sent}
        opened={opened}
        toast={s.between("toast", "exit")}
        gold
        cx={cx}
        top={130}
        subject="Q3 cash plan — $3.4M recovered across 4 moves"
        toastBody="Five agents, one plan · approved and sent to the board"
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
  } else if (s.between("agents", "toCfo")) target = { x: contentX + contentW / 2 + 40, y: 380 };
  else if (s.between("toCfo", "toChat")) {
    target = "orb-cfo";
    pointer = true;
  } else if (s.between("toChat", "toSend2")) {
    target = "chat-input";
    pointer = true;
  } else if (s.between("toSend2", "aThink")) {
    target = "chat-send";
    pointer = true;
  } else if (s.between("aThink", "toSend")) target = { x: contentX + contentW / 2 + 360, y: 640 };
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
