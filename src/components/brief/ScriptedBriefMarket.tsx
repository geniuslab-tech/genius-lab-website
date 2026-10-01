"use client";

import { useRef } from "react";
import { Cursor, useScene, type CursorTarget } from "@/components/hero-demo/engine";
import { Screen } from "@/components/hero-demo/frame";
import { renderSegments, segText, type Segment } from "@/components/hero-demo/screens";
import { AskBox, BriefingCard, Chart, DASH_W, Kpis, Sidebar, Topbar, Units, type ApproveState, type AskState, type Cyc } from "./Dashboard";
import type { Focus } from "./insights";
import { GeniusShaderOrb } from "./Orb";
import { IDLE, Outbox, useTyped } from "./ScriptedBrief";
import { CASH, Q1, TEAM } from "./ScriptedBriefTeam";

/*
 * Storyboard (v39.2) — "A marketplace of executive agents"
 *  1. Select    The CFO clicks the Revenue card, then the Free cash flow card.
 *  2. Ask       She asks why cash lags revenue; Genius answers; she approves.
 *  3. Agents    Five executive agents sit side by side, three over two, each with a note
 *               it left for her — some flagged.
 *  4. CFO chat  She opens the CFO agent: a private chat with its orb in the centre and
 *               its insights on either side. She picks a flagged insight and asks about it.
 *  5. Board     The CFO agent answers with a plan and asks for approval; she approves and
 *               the board update goes out.
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
  n1: 21200,
  n2: 21450,
  n3: 21700,
  n4: 21950,
  n5: 22200,
  toCfo: 23300,
  pressCfo: 24200,
  modal: 24450,
  i1: 24800,
  i2: 25050,
  i3: 25300,
  i4: 25550,
  toAlert: 26300,
  pressAlert: 27200,
  picked: 27450,
  toChat: 27900,
  pressChat: 28700,
  type2: 28950,
  toSend2: 31500,
  pressSend2: 32300,
  asked2: 32550,
  aThink: 32700,
  reply: 33500,
  plan: 36900,
  toSend: 37700,
  pressSend: 38700,
  sending: 38950,
  e1: 39600,
  e2: 40050,
  e3: 40500,
  e4: 40950,
  e5: 41400,
  e6: 41850,
  e7: 42300,
  open1: 42900,
  open2: 43500,
  toast: 43800,
  exit: 47300,
} as const;
const LOOP = 49300;
const H = 900;

const Q2 = "How do we close the $4.2M gap before the board meeting?";

/** three over two, like a marketplace shelf */
const ORDER = ["ceo", "cfo", "coo", "chro", "cco"] as const;
const NOTES: Record<string, { text: string; alert?: "high" | "med" }> = {
  ceo: { text: "Board pack is due Thursday — I need the cash plan in it.", alert: "med" },
  cfo: { text: "Free cash flow is $4.2M behind budget. I have a recovery plan ready.", alert: "high" },
  coo: { text: "Southeast inventory is up 18%. A release proposal is drafted." },
  chro: { text: "14 backfills could pause in Q4 without touching critical roles." },
  cco: { text: "11 EMEA accounts are over 60 days. Collections plan is ready.", alert: "med" },
};

const CFO_INSIGHTS = [
  { id: "ins-fcf", side: "left", title: "FCF $4.2M behind budget", sub: "Gap widened $0.8M this week", alert: true },
  { id: "ins-cov", side: "left", title: "Covenant headroom 1.9x", sub: "Holding above the 1.5x minimum", alert: false },
  { id: "ins-dso", side: "right", title: "EMEA DSO up 6 days", sub: "11 accounts over 60 days", alert: true },
  { id: "ins-fx", side: "right", title: "EUR hedge renewal Friday", sub: "+$310k vs spot if renewed now", alert: false },
] as const;

const REPLY: Segment[] = [
  { t: "Three moves close " },
  { t: "$3.4M of the $4.2M", tone: "gold" },
  { t: " this quarter, and the COO, CCO and CHRO have each signed off their part. The rest closes with " },
  { t: "Q4 collections", tone: "strong" },
  { t: ". Approve the plan and I'll send the board update with it." },
];
const PLAN = [
  { from: "COO", t: "Release $1.4M of Southeast inventory", v: "+$1.4M" },
  { from: "CCO", t: "Chase 11 EMEA accounts over 60 days", v: "+$1.1M" },
  { from: "CHRO", t: "Pause 14 non-critical Q4 backfills", v: "+$0.9M" },
] as const;

type Scene = ReturnType<typeof useScene<typeof CUES>>["scene"];
const exec = (id: string) => TEAM.find((t) => t.id === id)!;

function AlertIcon({ level }: { level: "high" | "med" }) {
  return (
    <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full text-[0.55rem] font-bold ${level === "high" ? "bg-[oklch(0.65_0.2_25)] text-white" : "bg-gl-gold text-gl-background"}`} aria-label="alert">
      !
    </span>
  );
}

function MarketPage({ s, width, ask, replyTyped }: { s: Scene; width: number; ask: AskState; replyTyped: number }) {
  const cx = width / 2;
  const notes = (["n1", "n2", "n3", "n4", "n5"] as const).filter((k) => s.past(k)).length;
  const open = s.past("modal");
  const insights = (["i1", "i2", "i3", "i4"] as const).filter((k) => s.past(k)).length;
  const picked = s.past("picked");
  const thinking = s.between("aThink", "reply");
  const writing = s.between("reply", "plan");
  const sending = s.past("sending");
  const sent = (["e1", "e2", "e3", "e4", "e5", "e6", "e7"] as const).filter((k) => s.past(k)).length;
  const opened = s.past("open2") ? 3 : s.past("open1") ? 1 : 0;
  const CARD_W = 290;
  const GAP = 22;
  const rowX = (n: number) => cx - (n * CARD_W + (n - 1) * GAP) / 2;

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-0 right-0 top-[64px] text-center">
        <p className="font-gl-display text-[1.05rem] text-gl-foreground">Your executive agents</p>
        <p className="text-[0.62rem] text-gl-muted-foreground">5 agents online · 41 tasks overnight · 3 notes need you</p>
      </div>

      {/* the shelf: 3 over 2 */}
      {ORDER.map((id, k) => {
        const e = exec(id);
        const row = k < 3 ? 0 : 1;
        const col = row === 0 ? k : k - 3;
        const left = rowX(row === 0 ? 3 : 2) + col * (CARD_W + GAP);
        const top = 150 + row * 268;
        const note = NOTES[id]!;
        const isCfo = id === "cfo";
        const hot = isCfo && s.between("toCfo", "modal");
        return (
          <div
            key={id}
            data-cursor={`agent-${id}`}
            className={`absolute rounded-2xl border bg-[linear-gradient(170deg,oklch(0.22_0.04_262/88%),oklch(0.15_0.03_264/90%))] p-4 transition-all duration-300 ${hot ? "scale-[1.02]" : ""}`}
            style={{ left, top, width: CARD_W, borderColor: hot ? e.color : "oklch(1 0 0 / 9%)", boxShadow: hot ? `0 0 0 3px color-mix(in oklab, ${e.color} 25%, transparent), 0 30px 60px -30px ${e.color}` : "none" }}
          >
            <div className="flex items-center gap-3">
              <GeniusShaderOrb state={open ? "holding" : "typing"} size={64} tint={e.tint} />
              <div className="min-w-0 flex-1">
                <p className="font-gl-display text-[0.98rem] tracking-tight" style={{ color: e.color }}>
                  {e.role} agent
                </p>
                <p className="text-[0.6rem] text-gl-muted-foreground">{e.scope}</p>
                <p className="mt-1 flex items-center gap-1.5 font-gl-mono text-[0.5rem] uppercase tracking-[0.12em] text-gl-muted-foreground/80">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--success)]" /> Online · {[9, 12, 8, 5, 7][k]} tasks
                </p>
              </div>
            </div>
            {/* note left for the user */}
            <div
              className={`mt-3 rounded-xl border px-3 py-2.5 transition-all duration-500 ${
                note.alert === "high" ? "border-[oklch(0.65_0.2_25/45%)] bg-[oklch(0.65_0.2_25/8%)]" : note.alert ? "border-gl-gold/40 bg-gl-gold/[0.07]" : "border-gl-border/60 bg-gl-background/40"
              }`}
              style={{ opacity: k < notes ? 1 : 0, transform: k < notes ? "none" : "translateY(6px)" }}
            >
              <div className="mb-1 flex items-center gap-1.5">
                {note.alert ? <AlertIcon level={note.alert} /> : <span className="h-1.5 w-1.5 rounded-full" style={{ background: e.color }} />}
                <span className="font-gl-mono text-[0.48rem] uppercase tracking-[0.14em] text-gl-muted-foreground">Note for Elena</span>
              </div>
              <p className="min-h-[2.8em] text-[0.66rem] leading-snug text-gl-foreground/90">{note.text}</p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[0.56rem] text-gl-muted-foreground">Last active 06:{String(10 + k * 7).padStart(2, "0")}</span>
              <span className="rounded-md border border-gl-foreground/15 px-2 py-1 text-[0.58rem] text-gl-foreground/85">Open chat →</span>
            </div>
          </div>
        );
      })}

      {/* the private chat with the CFO agent */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <div className="absolute inset-0 bg-[oklch(0.1_0.03_264/62%)] backdrop-blur-[3px]" />
        <div
          className="absolute overflow-hidden rounded-[22px] border border-gl-gold/30 bg-[linear-gradient(170deg,oklch(0.2_0.04_262/98%),oklch(0.14_0.03_264/98%))] shadow-[0_50px_120px_-30px_rgb(0_0_0/0.85)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ left: cx - 450, top: 40, width: 900, height: 740, transform: open ? "none" : "translateY(20px) scale(0.97)" }}
        >
          <div className="flex items-center gap-3 border-b border-gl-border/60 px-6 py-3.5">
            <GeniusShaderOrb state="holding" size={26} tint={exec("cfo").tint} />
            <div className="flex-1">
              <p className="text-[0.8rem] text-gl-foreground">CFO agent</p>
              <p className="text-[0.58rem] text-gl-muted-foreground">Private chat · cash, capital & reporting · sees all 14 entities</p>
            </div>
            <span className="grid h-7 w-7 place-items-center rounded-md border border-gl-border text-[0.7rem] text-gl-muted-foreground">✕</span>
          </div>

          {/* orb in the centre, insights on either side */}
          <div className="pointer-events-none absolute left-1/2 top-[64px] h-[300px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.8_0.14_75/18%),transparent_70%)] blur-2xl" />
          <div className="absolute flex flex-col items-center" style={{ left: 450 - 90, top: 82, width: 180 }}>
            <GeniusShaderOrb state={thinking ? "thinking" : writing ? "typing" : "holding"} size={150} tint={exec("cfo").tint} />
            <p className="mt-3 font-gl-display text-[0.92rem] text-gl-gold">CFO agent</p>
            <p className="text-[0.56rem] text-gl-muted-foreground">{thinking ? "Checking with the COO, CCO, CHRO…" : writing ? "Answering…" : "4 insights for you"}</p>
          </div>
          {CFO_INSIGHTS.map((ins, k) => {
            const isPick = ins.id === "ins-fcf";
            const sel = isPick && picked;
            const hover = isPick && s.between("toAlert", "picked");
            const left = ins.side === "left" ? 34 : 900 - 34 - 270;
            const top = 86 + (k % 2) * 108;
            return (
              <div
                key={ins.id}
                data-cursor={ins.id}
                className="absolute rounded-xl border px-3.5 py-3 transition-all duration-500"
                style={{
                  left,
                  top,
                  width: 270,
                  opacity: k < insights ? (picked && !isPick ? 0.45 : 1) : 0,
                  transform: k < insights ? (s.between("pressAlert", "picked") && isPick ? "scale(0.98)" : "none") : `translateX(${ins.side === "left" ? -12 : 12}px)`,
                  borderColor: sel ? "oklch(0.65 0.2 25 / 70%)" : ins.alert ? "oklch(0.77 0.155 66 / 35%)" : "oklch(1 0 0 / 9%)",
                  background: sel ? "oklch(0.65 0.2 25 / 10%)" : hover ? "oklch(1 0 0 / 5%)" : "oklch(1 0 0 / 2.5%)",
                  boxShadow: sel ? "0 0 0 3px oklch(0.65 0.2 25 / 15%)" : "none",
                }}
              >
                <div className="flex items-center gap-2">
                  {ins.alert ? <AlertIcon level={k === 0 ? "high" : "med"} /> : <span className="h-1.5 w-1.5 rounded-full bg-gl-data" />}
                  <p className="text-[0.74rem] text-gl-foreground">{ins.title}</p>
                </div>
                <p className="mt-1 font-gl-mono text-[0.54rem] text-gl-muted-foreground">{ins.sub}</p>
              </div>
            );
          })}

          {/* conversation */}
          <div className="absolute" style={{ left: 120, top: 330, width: 660 }}>
            <div className={`mb-2 flex items-center gap-2 transition-opacity duration-500 ${picked ? "opacity-100" : "opacity-0"}`}>
              <span className="font-gl-mono text-[0.5rem] uppercase tracking-[0.14em] text-gl-muted-foreground">About</span>
              <span className="flex items-center gap-1.5 rounded-full border border-[oklch(0.65_0.2_25/45%)] bg-[oklch(0.65_0.2_25/10%)] px-2 py-0.5 text-[0.58rem] text-gl-foreground">
                <AlertIcon level="high" /> FCF $4.2M behind budget
              </span>
            </div>
            <AskBox ask={ask} cid="chat" tone="gold" />
            <div className={`mt-3 flex items-start gap-2.5 transition-opacity duration-500 ${s.past("aThink") ? "opacity-100" : "opacity-0"}`}>
              <GeniusShaderOrb state={thinking ? "thinking" : writing ? "typing" : "holding"} size={26} tint={exec("cfo").tint} />
              <p className="min-h-[40px] flex-1 text-[0.76rem] leading-[1.55] text-gl-foreground/90">
                {thinking ? <span className="text-gl-muted-foreground">Checking with the COO, CCO and CHRO…</span> : renderSegments(REPLY, replyTyped)}
                {writing && replyTyped < segText(REPLY).length ? <span className="gcaret" /> : null}
              </p>
            </div>
            <div className={`mt-3 rounded-xl border border-gl-gold/35 bg-gl-gold/[0.05] p-3.5 transition-all duration-700 ${s.past("plan") ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-gl-mono text-[0.52rem] uppercase tracking-[0.16em] text-gl-gold">Recovery plan · needs your approval</span>
                <span className="font-gl-mono text-[0.6rem] text-[var(--success)]">+$3.4M cash</span>
              </div>
              {PLAN.map((m) => (
                <div key={m.t} className="flex items-center justify-between border-t border-gl-border/40 py-1.5 text-[0.66rem]">
                  <span className="flex items-center gap-2 text-gl-foreground">
                    <span className="w-10 font-gl-mono text-[0.5rem]" style={{ color: TEAM.find((t) => t.role === m.from)!.color }}>
                      {m.from}
                    </span>
                    {m.t}
                  </span>
                  <span className="font-gl-mono text-[var(--success)]">{m.v}</span>
                </div>
              ))}
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[0.58rem] text-gl-muted-foreground">Board update drafted · 12 pages · every figure sourced</span>
                <span
                  data-cursor="send"
                  className={`rounded-md px-3 py-1.5 text-[0.66rem] font-medium transition-all duration-200 ${sending ? "bg-[var(--success)] text-gl-background" : "bg-gl-gold text-gl-background"} ${s.between("toSend", "sending") ? "brightness-110 shadow-[0_0_0_4px_oklch(0.77_0.155_66/22%)]" : ""} ${s.between("pressSend", "sending") ? "scale-95" : ""}`}
                >
                  {sending ? "✓ Approved & sent" : "Approve plan & send to board"}
                </span>
              </div>
            </div>
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
        subject="Q3 cash plan — $3.4M of the $4.2M gap closed"
        toastBody="One flagged insight to a board-approved plan · every figure sourced"
      />
    </div>
  );
}

/** v39.2 — v39.1 with the agents laid out as a marketplace and a private CFO chat. */
export function ScriptedBriefMarket() {
  const { ref, scene: s } = useScene(CUES, LOOP, "proposal");
  const stageRef = useRef<HTMLDivElement>(null);
  const page: "brief" | "agents" = s.past("agents") ? "agents" : "brief";

  const typedCash = useTyped(segText(CASH.segments), s.between("write", "proposal"), s.past("proposal"), 52, s.loop);
  const replyTyped = useTyped(segText(REPLY), s.between("reply", "plan"), s.past("plan"), 60, s.loop);
  const q1 = useTyped(Q1, s.between("type1", "toSend1"), s.past("toSend1"), 26, s.loop);
  const q2 = useTyped(Q2, s.between("type2", "toSend2"), s.past("toSend2"), 30, s.loop);
  const ask1: AskState = { text: Q1, typed: q1, focused: s.between("pressAsk", "asked"), sent: s.past("asked"), hoverSend: s.between("toSend1", "asked"), pressSend: s.between("pressSend1", "asked") };
  const ask2: AskState = { text: Q2, typed: q2, focused: s.between("pressChat", "asked2"), sent: s.past("asked2"), hoverSend: s.between("toSend2", "asked2"), pressSend: s.between("pressSend2", "asked2"), placeholder: "Ask the CFO agent…" };

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
  } else if (s.between("agents", "toCfo")) target = { x: contentX + contentW / 2 + 60, y: 520 };
  else if (s.between("toCfo", "modal")) {
    target = "agent-cfo";
    pointer = true;
  } else if (s.between("modal", "toAlert")) target = { x: contentX + contentW / 2 + 40, y: 360 };
  else if (s.between("toAlert", "toChat")) {
    target = "ins-fcf";
    pointer = true;
  } else if (s.between("toChat", "toSend2")) {
    target = "chat-input";
    pointer = true;
  } else if (s.between("toSend2", "aThink")) {
    target = "chat-send";
    pointer = true;
  } else if (s.between("aThink", "toSend")) target = { x: contentX + contentW / 2 + 380, y: 560 };
  else if (s.between("toSend", "sending")) {
    target = "send";
    pointer = true;
  } else if (s.between("sending", "exit")) target = { x: contentX + contentW / 2 + 400, y: 720 };
  if (s.index < 0 || !s.past("enter") || s.past("exit")) target = off;
  const pressed =
    s.between("press1", "sel1") ||
    s.between("press2", "sel2") ||
    s.between("pressAsk", "type1") ||
    s.between("pressSend1", "asked") ||
    s.between("pressA", "approved") ||
    s.between("pressNav", "agents") ||
    s.between("pressCfo", "modal") ||
    s.between("pressAlert", "picked") ||
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
                  <MarketPage key={s.loop} s={s} width={contentW} ask={ask2} replyTyped={replyTyped} />
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
