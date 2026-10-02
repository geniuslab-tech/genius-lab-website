"use client";

import { useRef, type ReactNode } from "react";
import { Cursor, useScene, type CursorTarget } from "@/components/hero-demo/engine";
import { Screen } from "@/components/hero-demo/frame";
import { renderSegments, segText, type Segment } from "@/components/hero-demo/screens";
import { AskBox, BriefingCard, Chart, DASH_W, Kpis, Sidebar, Topbar, Units, type ApproveState, type AskState, type Cyc } from "./Dashboard";
import type { Focus } from "./insights";
import { GeniusShaderOrb } from "./Orb";
import { IDLE, Outbox, useTyped } from "./ScriptedBrief";
import { CASH as CASH_ANSWER, Q1, TEAM } from "./ScriptedBriefTeam";

/** the cash answer, with View more instead of Approve: approval happens in the details pop-up */
const CASH = { ...CASH_ANSWER, action: { ...CASH_ANSWER.action, cta: "View more" } };

/*
 * Storyboard (v39.3) — "A marketplace of executive agents"
 *  1. Select    The CFO clicks the Revenue card, then the Free cash flow card.
 *  2. Ask       She asks why cash lags revenue; Genius answers. View more opens the analysis
 *               behind it — bridge, inventory, DSO, aging — where she approves.
 *  3. Agents    Five executive agents sit side by side, three over two, each with a note
 *               it left for her — some flagged.
 *  4. CFO chat  She opens the CFO agent: a private chat with its orb in the centre and
 *               its insights on either side. She picks a flagged insight and asks about it.
 *  5. Execs     The CFO agent answers with a month-end plan; she approves and it goes to the
 *               executive team.
 *  6. Follow up  An org chart shows who owns each move. She opens the blocked plant manager,
 *               sees why, and asks the agent to email her — the email is drafted and sent.
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
  toMore: 17300,
  pressMore: 18400,
  details: 18650,
  d1: 19000,
  d2: 19300,
  d3: 19600,
  d4: 19900,
  toApprove: 23900,
  pressA: 25000,
  approved: 25250,
  closeDetails: 26700,
  toAgents: 27400,
  pressNav: 28400,
  agents: 28650,
  n1: 29000,
  n2: 29250,
  n3: 29500,
  n4: 29750,
  n5: 30000,
  toCfo: 31100,
  pressCfo: 32000,
  modal: 32250,
  i1: 32600,
  i2: 32850,
  i3: 33100,
  i4: 33350,
  toAlert: 34100,
  pressAlert: 35000,
  picked: 35250,
  explain: 35500,
  x1: 35800,
  x2: 36250,
  x3: 36700,
  toChat: 37800,
  pressChat: 38600,
  type2: 38850,
  toSend2: 42100,
  pressSend2: 42900,
  asked2: 43150,
  aThink: 43300,
  reply: 44100,
  plan: 47500,
  toSend: 48300,
  pressSend: 49300,
  sending: 49550,
  e1: 50200,
  e2: 50650,
  e3: 51100,
  e4: 51550,
  e5: 52000,
  e6: 52450,
  e7: 52900,
  open1: 53500,
  open2: 54100,
  toast: 54400,
  followShow: 54700,
  toFollow: 55500,
  pressFollow: 56400,
  org: 56650,
  o1: 56900,
  o2: 57050,
  o3: 57200,
  o4: 57350,
  o5: 57500,
  o6: 57650,
  o7: 57800,
  toLena: 59000,
  pressLena: 59900,
  lena: 60150,
  l1: 60500,
  l2: 60850,
  l3: 61200,
  toAsk3: 63000,
  pressAsk3: 63800,
  type3: 64050,
  toSend3: 67200,
  pressSend3: 68000,
  asked3: 68250,
  mThink: 68400,
  mail: 69400,
  mailSent: 71400,
  toast2: 71700,
  exit: 75500,
} as const;
const LOOP = 77500;
const H = 900;

const Q2 = "What measures can I put in place to hit the cash target before month-end close?";

/** three over two, like a marketplace shelf */
const ORDER = ["ceo", "cfo", "coo", "chro", "cco"] as const;
const NOTES: Record<string, { text: string; alert?: "high" | "med" }> = {
  ceo: { text: "Month-end close is in 9 days — I want the cash plan before then.", alert: "med" },
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
  { t: "Month-end close is in " },
  { t: "9 days", tone: "strong" },
  { t: ". Three moves recover " },
  { t: "$3.4M of the $4.2M", tone: "gold" },
  { t: " before it, and the COO, CCO and CHRO have signed off their part. Approve and I'll send the plan to the executive team with owners and deadlines." },
];

/** why the red alert fired, shown when it is opened */
const EXPLAIN = [
  { t: "The gap widened $0.8M this week as Southeast stock kept building.", v: "−$4.2M" },
  { t: "Southeast inventory is 18% over plan — $8.8M sitting across 3 sites.", v: "+18%" },
  { t: "11 EMEA accounts are over 60 days; DSO has slipped from 41 to 47.", v: "47 days" },
] as const;

/** who receives the month-end plan */
const EXECS = [
  ["MH", "Marcus Hale", "Chief Operating Officer"],
  ["PR", "Priya Rao", "Chief Commercial Officer"],
  ["DO", "Daniel Okafor", "Chief People Officer"],
  ["SL", "Sarah Lin", "Chief Executive Officer"],
  ["TB", "Tom Becker", "VP Supply Chain"],
  ["AR", "Ana Ruiz", "Group Controller"],
  ["JO", "James Ortiz", "Group Treasurer"],
] as const;
const PLAN = [
  { from: "COO", t: "Release $1.4M of Southeast inventory", v: "+$1.4M", by: "by day 5" },
  { from: "CCO", t: "Chase 11 EMEA accounts over 60 days", v: "+$1.1M", by: "by day 7" },
  { from: "CHRO", t: "Pause 14 non-critical backfills", v: "+$0.9M", by: "by day 9" },
] as const;

type Scene = ReturnType<typeof useScene<typeof CUES>>["scene"];

const Q3 = "Email Lena the release instructions and ask for a status update by tomorrow.";

/** the follow-up org chart: who owns the month-end plan, and who is stuck */
type Person = { id: string; i: string; n: string; r: string; status: "ok" | "progress" | "blocked"; note: string; x: number; y: number; parent?: string };
const ORG: Person[] = [
  { id: "ceo", i: "SL", n: "Sarah Lin", r: "Chief Executive Officer", status: "ok", note: "Plan acknowledged", x: 300, y: 74 },
  { id: "coo", i: "MH", n: "Marcus Hale", r: "Chief Operating Officer", status: "progress", note: "Owns the stock release", x: 170, y: 196, parent: "ceo" },
  { id: "cco", i: "PR", n: "Priya Rao", r: "Chief Commercial Officer", status: "progress", note: "Owns collections", x: 440, y: 196, parent: "ceo" },
  { id: "gm", i: "RM", n: "Ray Mendez", r: "GM, Industrial Southeast", status: "progress", note: "Instructions received", x: 84, y: 318, parent: "coo" },
  { id: "vp", i: "TB", n: "Tom Becker", r: "VP Supply Chain", status: "ok", note: "Carriers booked", x: 256, y: 318, parent: "coo" },
  { id: "ar", i: "ID", n: "Ines Duarte", r: "EMEA Collections Lead", status: "progress", note: "6 of 11 called", x: 440, y: 318, parent: "cco" },
  { id: "lena", i: "LO", n: "Lena Ortiz", r: "Plant Manager, Atlanta DC", status: "blocked", note: "Release not started", x: 84, y: 440, parent: "gm" },
];
const LENA_FACTS = [
  { t: "Release of $1.4M Southeast stock has not started", v: "0%" },
  { t: "Pick-wave approval has been pending since Tuesday", v: "3 days" },
  { t: "Plan deadline is day 5 of close", v: "in 2 days" },
] as const;
const MAIL_BODY = "Lena — please release the 1,920 slow-moving pallets at Atlanta DC to the EMEA distributors this week. Pick waves are approved as of now. Could you send me a status update by tomorrow?";
const exec = (id: string) => TEAM.find((t) => t.id === id)!;

function AlertIcon({ level }: { level: "high" | "med" }) {
  return (
    <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full text-[0.55rem] font-bold ${level === "high" ? "bg-[oklch(0.65_0.2_25)] text-white" : "bg-gl-gold text-gl-background"}`} aria-label="alert">
      !
    </span>
  );
}

const STATUS: Record<Person["status"], { label: string; cls: string }> = {
  ok: { label: "On track", cls: "bg-[oklch(0.78_0.13_168/14%)] text-[var(--success)]" },
  progress: { label: "In progress", cls: "bg-gl-data/12 text-gl-data" },
  blocked: { label: "Blocked", cls: "bg-[oklch(0.65_0.2_25/16%)] text-[oklch(0.75_0.17_25)]" },
};

function OrgChart({ s, width, ask, mailTyped }: { s: Scene; width: number; ask: AskState; mailTyped: number }) {
  const open = s.past("org");
  const shownN = (["o1", "o2", "o3", "o4", "o5", "o6", "o7"] as const).filter((k) => s.past(k)).length;
  const picked = s.past("lena");
  const thinking = s.between("mThink", "mail");
  const sentMail = s.past("mailSent");
  const cx = width / 2;
  const W = 164;
  const Hn = 82;
  const byId = (id: string) => ORG.find((o) => o.id === id)!;

  return (
    <div className={`absolute inset-0 z-30 transition-opacity duration-500 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}>
      <div className="absolute inset-0 bg-[oklch(0.1_0.03_264/62%)] backdrop-blur-[3px]" />
      <div
        className="absolute overflow-hidden rounded-[22px] border border-gl-border bg-[linear-gradient(170deg,oklch(0.2_0.04_262/98%),oklch(0.14_0.03_264/98%))] shadow-[0_50px_120px_-30px_rgb(0_0_0/0.85)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ left: cx - 460, top: 24, width: 920, height: 790, transform: open ? "none" : "translateY(20px) scale(0.97)" }}
      >
        <div className="flex items-center gap-3 border-b border-gl-border/60 px-6 py-3.5">
          <GeniusShaderOrb state={thinking ? "thinking" : "holding"} size={26} tint={exec("coo").tint} />
          <div className="flex-1">
            <p className="text-[0.82rem] text-gl-foreground">Follow-up · month-end cash plan</p>
            <p className="text-[0.58rem] text-gl-muted-foreground">Who owns each move · live status from the COO agent · 9 days to close</p>
          </div>
          <span className="flex items-center gap-3 font-gl-mono text-[0.5rem] uppercase tracking-[0.12em] text-gl-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" /> On track</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-gl-data" /> In progress</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.65_0.2_25)]" /> Blocked</span>
          </span>
        </div>

        {/* the chart */}
        <div className="absolute" style={{ left: 24, top: 62, width: 560, height: 560 }}>
          <svg className="pointer-events-none absolute inset-0" width={560} height={560} aria-hidden="true">
            {ORG.filter((o) => o.parent).map((o, k) => {
              const pa = byId(o.parent!);
              const x1 = pa.x;
              const y1 = pa.y + Hn / 2;
              const x2 = o.x;
              const y2 = o.y - Hn / 2;
              const my = Math.round((y1 + y2) / 2);
              const lit = picked && (o.id === "lena" || o.id === "gm" || o.id === "coo");
              return (
                <path
                  key={o.id}
                  d={`M ${x1} ${y1} L ${x1} ${my} L ${x2} ${my} L ${x2} ${y2}`}
                  fill="none"
                  stroke={lit ? "oklch(0.75 0.17 25)" : "oklch(1 0 0 / 16%)"}
                  strokeWidth={lit ? 1.6 : 1}
                  style={{ opacity: k + 1 < shownN ? 1 : 0, transition: "opacity .4s, stroke .4s" }}
                />
              );
            })}
          </svg>
          {ORG.map((o, k) => {
            const isLena = o.id === "lena";
            const sel = isLena && picked;
            const hover = isLena && s.between("toLena", "lena");
            const st = STATUS[o.status];
            return (
              <div
                key={o.id}
                data-cursor={`person-${o.id}`}
                className="absolute rounded-xl border px-2.5 py-2 transition-all duration-500"
                style={{
                  left: o.x - W / 2,
                  top: o.y - Hn / 2,
                  width: W,
                  height: Hn,
                  opacity: k < shownN ? (picked && !sel && !["gm", "coo"].includes(o.id) ? 0.5 : 1) : 0,
                  transform: k < shownN ? (isLena && s.between("pressLena", "lena") ? "scale(0.97)" : "none") : "translateY(8px)",
                  borderColor: sel ? "oklch(0.65 0.2 25 / 70%)" : o.status === "blocked" ? "oklch(0.65 0.2 25 / 40%)" : hover ? "oklch(1 0 0 / 30%)" : "oklch(1 0 0 / 10%)",
                  background: sel ? "oklch(0.65 0.2 25 / 10%)" : "oklch(1 0 0 / 3%)",
                  boxShadow: sel ? "0 0 0 3px oklch(0.65 0.2 25 / 15%)" : "none",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.48rem] font-semibold text-gl-foreground ring-1 ring-white/10 ${o.status === "blocked" ? "bg-[oklch(0.45_0.12_25)]" : "bg-gradient-to-br from-[oklch(0.45_0.08_260)] to-[oklch(0.3_0.05_262)]"}`}>{o.i}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.64rem] leading-tight text-gl-foreground">{o.n}</span>
                    <span className="block truncate text-[0.5rem] leading-tight text-gl-muted-foreground">{o.r}</span>
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-1">
                  <span className={`shrink-0 whitespace-nowrap rounded-full px-1.5 py-0.5 font-gl-mono text-[0.42rem] uppercase tracking-[0.08em] ${st.cls}`}>{o.status === "blocked" ? "⚠ " : ""}{st.label}</span>
                  <span className="min-w-0 truncate text-[0.46rem] text-gl-muted-foreground">{o.note}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* the selected person: what is happening, and the request to the agent */}
        <div
          className="absolute rounded-2xl border border-gl-border/70 bg-gl-background/40 p-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ left: 600, top: 70, width: 296, height: 700, opacity: picked ? 1 : 0, transform: picked ? "none" : "translateX(14px)" }}
        >
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[oklch(0.45_0.12_25)] text-[0.6rem] font-semibold text-gl-foreground ring-1 ring-white/10">LO</span>
            <div>
              <p className="text-[0.8rem] text-gl-foreground">Lena Ortiz</p>
              <p className="text-[0.56rem] text-gl-muted-foreground">Plant Manager, Atlanta DC · reports to Ray Mendez</p>
            </div>
          </div>
          <p className="mt-3 font-gl-mono text-[0.5rem] uppercase tracking-[0.16em] text-[oklch(0.72_0.18_25)]">⚠ What is happening</p>
          <div className="mt-1.5 space-y-1.5">
            {LENA_FACTS.map((f, i) => (
              <div
                key={f.t}
                className="flex items-start justify-between gap-2 rounded-lg bg-gl-foreground/[0.03] px-2.5 py-1.5 text-[0.6rem] leading-snug transition-all duration-500"
                style={{ opacity: s.past((["l1", "l2", "l3"] as const)[i]!) ? 1 : 0, transform: s.past((["l1", "l2", "l3"] as const)[i]!) ? "none" : "translateY(4px)" }}
              >
                <span className="text-gl-foreground/90">{f.t}</span>
                <span className="shrink-0 font-gl-mono text-[oklch(0.75_0.17_25)]">{f.v}</span>
              </div>
            ))}
          </div>
          <div className="mt-2.5 rounded-lg border border-gl-border/60 px-2.5 py-2 transition-opacity duration-500" style={{ opacity: s.past("l3") ? 1 : 0 }}>
            <p className="font-gl-mono text-[0.48rem] uppercase tracking-[0.14em] text-gl-muted-foreground">Stock release progress</p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gl-foreground/10">
              <div className="h-full w-[4%] rounded-full bg-[oklch(0.65_0.2_25)]" />
            </div>
            <p className="mt-1 text-[0.52rem] text-gl-muted-foreground">COO agent suggests: send Lena the release instructions and unblock the pick waves.</p>
          </div>

          <div className="mt-3">{ask.sent ? <AskBox ask={ask} /> : <AskBox ask={ask} cid="mail" tone="gold" />}</div>

          <div className={`mt-2.5 flex items-center gap-2 text-[0.6rem] text-gl-muted-foreground transition-opacity duration-500 ${s.past("mThink") ? "opacity-100" : "opacity-0"}`}>
            <GeniusShaderOrb state={thinking ? "thinking" : sentMail ? "holding" : "typing"} size={20} tint={exec("coo").tint} />
            {thinking ? "Drafting the email…" : sentMail ? "Sent. I'll chase Lena tomorrow at 09:00 if there's no reply." : "Here is the draft — sending now."}
          </div>

          {/* the email */}
          <div className={`mt-2 rounded-xl border bg-[oklch(0.17_0.03_262/90%)] p-3 transition-all duration-700 ${s.past("mail") ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"} ${sentMail ? "border-[oklch(0.78_0.13_168/45%)]" : "border-gl-border"}`}>
            <div className="flex items-center justify-between">
              <span className="font-gl-mono text-[0.48rem] uppercase tracking-[0.14em] text-gl-muted-foreground">Email</span>
              <span className={`rounded-full px-1.5 py-0.5 font-gl-mono text-[0.44rem] uppercase tracking-[0.1em] ${sentMail ? "bg-[oklch(0.78_0.13_168/16%)] text-[var(--success)]" : "bg-gl-gold/12 text-gl-gold"}`}>{sentMail ? "Sent ✓" : "Sending…"}</span>
            </div>
            <p className="mt-1.5 text-[0.56rem]"><span className="text-gl-muted-foreground">To </span><span className="text-gl-foreground">lena.ortiz@meridian.com</span></p>
            <p className="text-[0.56rem]"><span className="text-gl-muted-foreground">Cc </span><span className="text-gl-foreground">Ray Mendez</span></p>
            <p className="text-[0.56rem]"><span className="text-gl-muted-foreground">Subject </span><span className="text-gl-foreground">Atlanta DC stock release — needed this week</span></p>
            <p className="mt-1.5 min-h-[56px] text-[0.58rem] leading-snug text-gl-foreground/85">
              {MAIL_BODY.slice(0, mailTyped)}
              {mailTyped > 0 && mailTyped < MAIL_BODY.length ? <span className="gcaret" /> : null}
            </p>
          </div>
        </div>
      </div>

      {/* toast */}
      <div
        className={`absolute bottom-6 left-6 w-[300px] rounded-xl border border-[oklch(0.78_0.13_168/35%)] bg-[oklch(0.17_0.03_262/97%)] p-3.5 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.7)] transition-all duration-700 ${s.between("toast2", "exit") ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <p className="text-[0.72rem] text-gl-foreground">✓ Email sent to Lena Ortiz</p>
        <p className="mt-0.5 text-[0.62rem] text-gl-muted-foreground">COO agent will follow up tomorrow at 09:00 · Ray Mendez copied</p>
      </div>
    </div>
  );
}

function MarketPage({ s, width, ask, replyTyped, ask3, mailTyped }: { s: Scene; width: number; ask: AskState; replyTyped: number; ask3: AskState; mailTyped: number }) {
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
          style={{ left: cx - 450, top: 16, width: 900, height: 810, transform: open ? "none" : "translateY(20px) scale(0.97)" }}
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
          <div className="absolute" style={{ left: 110, top: 300, width: 680 }}>
            <div className={`mb-1.5 flex items-center gap-2 transition-opacity duration-500 ${picked ? "opacity-100" : "opacity-0"}`}>
              <span className="font-gl-mono text-[0.5rem] uppercase tracking-[0.14em] text-gl-muted-foreground">About</span>
              <span className="flex items-center gap-1.5 rounded-full border border-[oklch(0.65_0.2_25/45%)] bg-[oklch(0.65_0.2_25/10%)] px-2 py-0.5 text-[0.58rem] text-gl-foreground">
                <AlertIcon level="high" /> FCF $4.2M behind budget
              </span>
            </div>
            <div className={`mb-2 rounded-xl border border-[oklch(0.65_0.2_25/40%)] bg-[oklch(0.65_0.2_25/6%)] px-4 py-2 transition-all duration-500 ${s.past("explain") ? "opacity-100" : "opacity-0"}`}>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-gl-mono text-[0.52rem] uppercase tracking-[0.16em] text-[oklch(0.72_0.18_25)]">What is happening</span>
                <span className="flex items-center gap-2 font-gl-mono text-[0.52rem] uppercase tracking-[0.12em] text-gl-foreground/80">
                  Month-end close in 9 days
                  <span className="relative h-1 w-20 overflow-hidden rounded-full bg-gl-foreground/10">
                    <span className="absolute inset-y-0 left-0 w-[70%] rounded-full bg-[oklch(0.65_0.2_25)]" />
                  </span>
                </span>
              </div>
              {EXPLAIN.map((e, i) => (
                <div
                  key={e.t}
                  className="flex items-center justify-between gap-3 py-px text-[0.62rem] transition-all duration-500"
                  style={{ opacity: s.past((["x1", "x2", "x3"] as const)[i]!) ? 1 : 0, transform: s.past((["x1", "x2", "x3"] as const)[i]!) ? "none" : "translateY(4px)" }}
                >
                  <span className="flex items-center gap-2 text-gl-foreground/90">
                    <span className="h-1 w-1 rounded-full bg-[oklch(0.72_0.18_25)]" />
                    {e.t}
                  </span>
                  <span className="font-gl-mono text-[0.6rem] text-[oklch(0.72_0.18_25)]">{e.v}</span>
                </div>
              ))}
            </div>
            <AskBox ask={ask} cid="chat" tone="gold" />
            <div className={`mt-2 flex items-start gap-2.5 transition-opacity duration-500 ${s.past("aThink") ? "opacity-100" : "opacity-0"}`}>
              <GeniusShaderOrb state={thinking ? "thinking" : writing ? "typing" : "holding"} size={26} tint={exec("cfo").tint} />
              <p className="min-h-[34px] flex-1 text-[0.68rem] leading-[1.45] text-gl-foreground/90">
                {thinking ? <span className="text-gl-muted-foreground">Checking with the COO, CCO and CHRO…</span> : renderSegments(REPLY, replyTyped)}
                {writing && replyTyped < segText(REPLY).length ? <span className="gcaret" /> : null}
              </p>
            </div>
            <div className={`mt-2 rounded-xl border border-gl-gold/35 bg-gl-gold/[0.05] px-3.5 py-2.5 transition-all duration-700 ${s.past("plan") ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-gl-mono text-[0.52rem] uppercase tracking-[0.16em] text-gl-gold">Month-end cash plan · needs your approval</span>
                <span className="font-gl-mono text-[0.6rem] text-[var(--success)]">+$3.4M cash</span>
              </div>
              {PLAN.map((m) => (
                <div key={m.t} className="flex items-center justify-between border-t border-gl-border/40 py-1 text-[0.62rem]">
                  <span className="flex items-center gap-2 text-gl-foreground">
                    <span className="w-10 font-gl-mono text-[0.5rem]" style={{ color: TEAM.find((t) => t.role === m.from)!.color }}>
                      {m.from}
                    </span>
                    {m.t}
                    <span className="font-gl-mono text-[0.52rem] text-gl-muted-foreground">· {m.by}</span>
                  </span>
                  <span className="font-gl-mono text-[var(--success)]">{m.v}</span>
                </div>
              ))}
              <p className="mb-1 mt-1.5 font-gl-mono text-[0.48rem] uppercase tracking-[0.16em] text-gl-muted-foreground">Sending to the executive team</p>
              <div className="grid grid-cols-4 gap-x-2 gap-y-1">
                {EXECS.map(([i, n, r]) => (
                  <div key={i} className="flex min-w-0 items-center gap-2">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.45_0.08_260)] to-[oklch(0.3_0.05_262)] text-[0.42rem] font-semibold text-gl-foreground ring-1 ring-white/10">
                      {i}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[0.56rem] leading-tight text-gl-foreground">{n}</span>
                      <span className="block truncate text-[0.46rem] leading-tight text-gl-muted-foreground">{r}</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[0.56rem] text-gl-muted-foreground">Owners and deadlines attached · every figure sourced</span>
                <span
                  data-cursor="send"
                  className={`rounded-md px-3 py-1 text-[0.64rem] font-medium transition-all duration-200 ${sending ? "bg-[var(--success)] text-gl-background" : "bg-gl-gold text-gl-background"} ${s.between("toSend", "sending") ? "brightness-110 shadow-[0_0_0_4px_oklch(0.77_0.155_66/22%)]" : ""} ${s.between("pressSend", "sending") ? "scale-95" : ""}`}
                >
                  {sending ? "✓ Approved & sent" : "Approve plan & send to executives"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Outbox
        sending={sending && !s.past("org")}
        sent={sent}
        opened={opened}
        toast={s.between("toast", "org")}
        followUp={{ show: s.past("followShow"), hover: s.between("toFollow", "org"), pressed: s.between("pressFollow", "org") }}
        gold
        cx={cx}
        top={150}
        subject="Month-end cash plan — $3.4M recovered before close"
        heading="Sending the month-end cash plan"
        toLabel="Executive team"
        attachment="Month-end-cash-plan.pdf · 1.1 MB"
        recipients={EXECS}
        toastTitle="✓ Month-end plan delivered to 7 executives"
        toastBody="Plan sent to 7 executives · 9 days before month-end close"
      />
      <OrgChart s={s} width={width} ask={ask3} mailTyped={mailTyped} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* "View more": the analysis behind the cash answer                    */
/* ------------------------------------------------------------------ */

const BRIDGE = [
  { k: "Budget", v: 100.6, kind: "total" },
  { k: "Inventory", v: -3.1, kind: "neg" },
  { k: "Receivables", v: -1.6, kind: "neg" },
  { k: "Capex", v: 0.5, kind: "pos" },
  { k: "Actual", v: 96.4, kind: "total" },
] as const;
const SITES = [
  { k: "Atlanta DC", v: 4.1, d: "+22%" },
  { k: "Charlotte", v: 2.8, d: "+17%" },
  { k: "Jacksonville", v: 1.9, d: "+12%" },
];
const DSO = [41, 41, 42, 42, 43, 44, 45, 45, 46, 47];
const AGING = [
  { k: "Rhein Logistik GmbH", v: "$310k", d: "74 days" },
  { k: "Nordhavn A/S", v: "$240k", d: "68 days" },
  { k: "Iberia Supply SL", v: "$190k", d: "63 days" },
];

/** the three ways to act on the analysis; the second is the one the user takes */
const NEXT_STEPS = [
  { icon: "▦", t: "Schedule a meeting with the Southeast manager", sub: "Align the details · Ray Mendez, GM · 30 min" },
  { icon: "➤", t: "Send instructions directly to the manager", sub: "Release stock + chase receivables · with owners" },
  { icon: "◎", t: "Assign an agent to follow up with the manager", sub: "COO agent checks progress daily until close" },
] as const;

function Tile({ show, delay = 0, className = "", children }: { show: boolean; delay?: number; className?: string; children: ReactNode }) {
  return (
    <div
      className={`rounded-xl border border-gl-border/70 bg-gl-background/40 p-3.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
      style={{ opacity: show ? 1 : 0, transform: show ? "none" : "translateY(10px)", transitionDelay: show ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

function BriefDetails({ s, width }: { s: Scene; width: number }) {
  const open = s.between("details", "closeDetails");
  const d = (k: "d1" | "d2" | "d3" | "d4") => s.past(k);
  const approved = s.past("approved");
  const cx = width / 2;
  // waterfall geometry
  const lo = 94.5;
  const hi = 101.2;
  const bh = 92;
  const y = (v: number) => bh - ((v - lo) / (hi - lo)) * bh;
  const spans: [number, number][] = [];
  let run = 100.6;
  for (const b of BRIDGE) {
    if (b.kind === "total") spans.push([y(b.v), bh]);
    else {
      const next = run + b.v;
      spans.push([y(Math.max(run, next)), y(Math.min(run, next))]);
      run = next;
    }
  }
  const dsoPts = DSO.map((v, i) => [(i / (DSO.length - 1)) * 300, 50 - ((v - 40) / 8) * 44] as const);
  const dsoPath = dsoPts.map(([x, yy], i) => `${i ? "L" : "M"} ${Math.round(x)} ${Math.round(yy)}`).join(" ");

  return (
    <div className={`absolute inset-0 z-20 transition-opacity duration-500 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}>
      <div className="absolute inset-0 bg-[oklch(0.1_0.03_264/62%)] backdrop-blur-[3px]" />
      <div
        className="absolute overflow-hidden rounded-[22px] border border-gl-border bg-[linear-gradient(170deg,oklch(0.2_0.04_262/98%),oklch(0.14_0.03_264/98%))] shadow-[0_50px_120px_-30px_rgb(0_0_0/0.85)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ left: cx - 440, top: 40, width: 880, transform: open ? "none" : "translateY(20px) scale(0.97)" }}
      >
        <div className="flex items-center gap-3 border-b border-gl-border/60 px-6 py-3.5">
          <GeniusShaderOrb state={open && !s.past("d4") ? "typing" : "holding"} size={28} />
          <div className="flex-1">
            <p className="text-[0.84rem] text-gl-foreground">Why free cash flow lags revenue</p>
            <p className="text-[0.58rem] text-gl-muted-foreground">Genius analysis · 14 entities · WMS, AR ledger, Budget FY26 v3</p>
          </div>
          <span className="grid h-7 w-7 place-items-center rounded-md border border-gl-border text-[0.7rem] text-gl-muted-foreground">✕</span>
        </div>

        <div className="space-y-3 p-5">
          {/* headline numbers */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { k: "Revenue vs budget", v: "+6.4%", tone: "text-gl-data", sub: "$1.42B · ahead of plan" },
              { k: "Free cash flow vs budget", v: "−$4.2M", tone: "text-gl-gold", sub: "$96.4M · attention" },
              { k: "Cash conversion", v: "68%", tone: "text-gl-gold", sub: "−9pp vs last quarter" },
            ].map((m, i) => (
              <Tile key={m.k} show={d("d1")} delay={i * 90}>
                <p className="text-[0.54rem] uppercase tracking-[0.12em] text-gl-muted-foreground">{m.k}</p>
                <p className={`mt-1 font-gl-display text-[1.25rem] tracking-tight ${m.tone}`}>{m.v}</p>
                <p className="text-[0.56rem] text-gl-muted-foreground">{m.sub}</p>
              </Tile>
            ))}
          </div>

          <div className="grid grid-cols-[1.2fr_1fr] gap-3">
            {/* FCF bridge */}
            <Tile show={d("d2")}>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[0.68rem] text-gl-foreground">Free cash flow bridge · QTD</p>
                <span className="font-gl-mono text-[0.52rem] text-gl-muted-foreground">$M</span>
              </div>
              <div className="flex items-end gap-3">
                {BRIDGE.map((b, i) => {
                  const [y0, y1] = spans[i]!;
                  const color = b.kind === "total" ? "bg-gl-data/75" : b.kind === "neg" ? "bg-gl-gold" : "bg-[var(--success)]";
                  return (
                    <div key={b.k} className="flex flex-1 flex-col items-center gap-1">
                      <span className={`font-gl-mono text-[0.52rem] ${b.kind === "neg" ? "text-gl-gold" : b.kind === "pos" ? "text-[var(--success)]" : "text-gl-foreground"}`}>
                        {b.kind === "total" ? `${b.v}M` : `${b.v > 0 ? "+" : "−"}${Math.abs(b.v)}`}
                      </span>
                      <div className="relative w-full" style={{ height: bh }}>
                        <div
                          className={`absolute inset-x-0 origin-bottom rounded-[3px] transition-transform duration-700 ${color}`}
                          style={{ top: y0, height: Math.max(3, y1 - y0), transform: d("d2") ? "scaleY(1)" : "scaleY(0)", transitionDelay: `${i * 110}ms` }}
                        />
                      </div>
                      <span className="text-[0.52rem] text-gl-muted-foreground">{b.k}</span>
                    </div>
                  );
                })}
              </div>
            </Tile>
            {/* inventory by site */}
            <Tile show={d("d2")} delay={120}>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[0.68rem] text-gl-foreground">Southeast inventory by site</p>
                <span className="font-gl-mono text-[0.52rem] text-gl-gold">+18% vs plan</span>
              </div>
              <div className="space-y-2.5 pt-1">
                {SITES.map((st, i) => (
                  <div key={st.k}>
                    <div className="flex justify-between text-[0.6rem]">
                      <span className="text-gl-foreground/85">{st.k}</span>
                      <span className="font-gl-mono text-gl-muted-foreground">
                        ${st.v}M <span className="text-gl-gold">{st.d}</span>
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gl-foreground/8">
                      <div className="h-full origin-left rounded-full bg-gl-gold transition-transform duration-700" style={{ width: `${(st.v / 4.5) * 100}%`, transform: d("d2") ? "scaleX(1)" : "scaleX(0)", transitionDelay: `${200 + i * 120}ms` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Tile>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* DSO trend */}
            <Tile show={d("d3")}>
              <div className="mb-1 flex items-center justify-between">
                <p className="text-[0.68rem] text-gl-foreground">EMEA days sales outstanding</p>
                <span className="font-gl-mono text-[0.56rem] text-gl-gold">41 → 47 days</span>
              </div>
              <svg viewBox="0 0 300 56" className="block h-[56px] w-full" aria-hidden="true">
                <line x1="0" x2="300" y1="45" y2="45" stroke="var(--border)" strokeDasharray="2 4" />
                <path d={dsoPath} fill="none" stroke="var(--gold)" strokeWidth="2" pathLength={1} strokeDasharray="1" strokeDashoffset={d("d3") ? 0 : 1} style={{ transition: "stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)" }} />
                <circle cx="300" cy={Math.round(dsoPts[dsoPts.length - 1]![1])} r="3.5" fill="var(--gold)" />
              </svg>
              <p className="text-[0.56rem] text-gl-muted-foreground">Target 41 days · slipping since week 4</p>
            </Tile>
            {/* receivables aging */}
            <Tile show={d("d3")} delay={120}>
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-[0.68rem] text-gl-foreground">Receivables over 60 days</p>
                <span className="font-gl-mono text-[0.56rem] text-gl-gold">11 accounts · $1.1M</span>
              </div>
              {AGING.map((a) => (
                <div key={a.k} className="flex items-center justify-between border-t border-gl-border/40 py-1.5 text-[0.6rem]">
                  <span className="text-gl-foreground/85">{a.k}</span>
                  <span className="font-gl-mono text-gl-muted-foreground">
                    {a.v} · <span className="text-gl-gold">{a.d}</span>
                  </span>
                </div>
              ))}
            </Tile>
          </div>

          {/* actions + approve */}
          <Tile show={d("d4")} className={approved ? "border-[oklch(0.78_0.13_168/40%)]" : "border-gl-gold/35"}>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-gl-mono text-[0.52rem] uppercase tracking-[0.16em] text-gl-gold">Recommended actions · Southeast</span>
              <span className="font-gl-mono text-[0.62rem] text-[var(--success)]">+$2.5M cash this quarter</span>
            </div>
            {[
              { t: "Release $1.4M of slow Southeast inventory to EMEA distributors", v: "+$1.4M", o: "COO agent" },
              { t: "Chase the 11 EMEA accounts over 60 days", v: "+$1.1M", o: "CCO agent" },
            ].map((a) => (
              <div key={a.t} className="flex items-center justify-between border-t border-gl-border/40 py-1.5 text-[0.64rem]">
                <span className="text-gl-foreground">
                  {a.t} <span className="font-gl-mono text-[0.5rem] text-gl-muted-foreground">· {a.o}</span>
                </span>
                <span className="font-gl-mono text-[var(--success)]">{a.v}</span>
              </div>
            ))}
            <p className="mb-1.5 mt-2.5 font-gl-mono text-[0.5rem] uppercase tracking-[0.16em] text-gl-muted-foreground">How do you want to act?</p>
            <div className="grid grid-cols-3 gap-2">
              {NEXT_STEPS.map((a, i) => {
                const pick = i === 1;
                const done = pick && approved;
                const hover = pick && s.between("toApprove", "approved") && !approved;
                return (
                  <span
                    key={a.t}
                    data-cursor={pick ? "approve-modal" : undefined}
                    className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 transition-all duration-200 ${
                      done
                        ? "border-[oklch(0.78_0.13_168/55%)] bg-[oklch(0.78_0.13_168/12%)]"
                        : hover
                          ? "border-gl-gold/70 bg-gl-gold/[0.12] shadow-[0_0_0_4px_oklch(0.77_0.155_66/16%)]"
                          : approved
                            ? "border-gl-border/50 opacity-50"
                            : "border-gl-border bg-gl-foreground/[0.03]"
                    } ${pick && s.between("pressA", "approved") ? "scale-[0.97]" : ""}`}
                  >
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[0.8rem] ${done ? "bg-[var(--success)] text-gl-background" : "bg-gl-gold/15 text-gl-gold"}`}>{done ? "✓" : a.icon}</span>
                    <span className="min-w-0">
                      <span className="block text-[0.64rem] font-medium leading-snug text-gl-foreground">{done ? "Instructions sent" : a.t}</span>
                      <span className="mt-0.5 block text-[0.52rem] leading-snug text-gl-muted-foreground">{done ? "To Ray Mendez · GM, Industrial Southeast" : a.sub}</span>
                    </span>
                  </span>
                );
              })}
            </div>
          </Tile>
        </div>
      </div>
    </div>
  );
}

/** v39.3 — v39.2 with a longer read of the analysis and three ways to act on it. */
export function ScriptedBriefMarketV393() {
  const { ref, scene: s } = useScene(CUES, LOOP, "proposal");
  const stageRef = useRef<HTMLDivElement>(null);
  const page: "brief" | "agents" = s.past("agents") ? "agents" : "brief";

  const typedCash = useTyped(segText(CASH.segments), s.between("write", "proposal"), s.past("proposal"), 52, s.loop);
  const replyTyped = useTyped(segText(REPLY), s.between("reply", "plan"), s.past("plan"), 60, s.loop);
  const q3 = useTyped(Q3, s.between("type3", "toSend3"), s.past("toSend3"), 30, s.loop);
  const mailTyped = useTyped(MAIL_BODY, s.between("mail", "mailSent"), s.past("mailSent"), 110, s.loop);
  const ask3: AskState = { text: Q3, typed: q3, focused: s.between("pressAsk3", "asked3"), sent: s.past("asked3"), hoverSend: s.between("toSend3", "asked3"), pressSend: s.between("pressSend3", "asked3"), placeholder: "Ask the COO agent…" };
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
  const approve: ApproveState = { hover: s.between("toMore", "details"), pressed: s.between("pressMore", "details"), done: s.past("approved"), doneLabel: "✓ Instructions sent" };

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
  } else if (s.between("think", "toMore")) target = { x: 620, y: 560 };
  else if (s.between("toMore", "details")) {
    target = "approve";
    pointer = true;
  } else if (s.between("details", "toApprove")) target = { x: contentX + contentW / 2 + 120, y: 520 };
  else if (s.between("toApprove", "closeDetails")) {
    target = "approve-modal";
    pointer = true;
  } else if (s.between("closeDetails", "toAgents")) target = { x: 500, y: 600 }; else if (s.between("toAgents", "agents")) {
    target = "nav-agents";
    pointer = true;
  } else if (s.between("agents", "toCfo")) target = { x: contentX + contentW / 2 + 60, y: 520 };
  else if (s.between("toCfo", "modal")) {
    target = "agent-cfo";
    pointer = true;
  } else if (s.between("modal", "toAlert")) target = { x: contentX + contentW / 2 + 40, y: 360 };
  else if (s.between("toAlert", "explain")) {
    target = "ins-fcf";
    pointer = true;
  } else if (s.between("explain", "toChat")) target = { x: contentX + contentW / 2 + 260, y: 420 };
  else if (s.between("toChat", "toSend2")) {
    target = "chat-input";
    pointer = true;
  } else if (s.between("toSend2", "aThink")) {
    target = "chat-send";
    pointer = true;
  } else if (s.between("aThink", "toSend")) target = { x: contentX + contentW / 2 + 380, y: 560 };
  else if (s.between("toSend", "sending")) {
    target = "send";
    pointer = true;
  } else if (s.between("sending", "toFollow")) target = { x: contentX + contentW / 2 + 400, y: 720 };
  else if (s.between("toFollow", "org")) {
    target = "follow-up";
    pointer = true;
  } else if (s.between("org", "toLena")) target = { x: contentX + contentW / 2 - 120, y: 560 };
  else if (s.between("toLena", "lena")) {
    target = "person-lena";
    pointer = true;
  } else if (s.between("lena", "toAsk3")) target = { x: contentX + contentW / 2 - 60, y: 560 };
  else if (s.between("toAsk3", "toSend3")) {
    target = "mail-input";
    pointer = true;
  } else if (s.between("toSend3", "mThink")) {
    target = "mail-send";
    pointer = true;
  } else if (s.between("mThink", "exit")) target = { x: contentX + contentW / 2 + 120, y: 640 };
  if (s.index < 0 || !s.past("enter") || s.past("exit")) target = off;
  const pressed =
    s.between("press1", "sel1") ||
    s.between("press2", "sel2") ||
    s.between("pressAsk", "type1") ||
    s.between("pressSend1", "asked") ||
    s.between("pressMore", "details") ||
    s.between("pressA", "approved") ||
    s.between("pressNav", "agents") ||
    s.between("pressCfo", "modal") ||
    s.between("pressAlert", "picked") ||
    s.between("pressChat", "type2") ||
    s.between("pressSend2", "asked2") ||
    s.between("pressSend", "sending") ||
    s.between("pressFollow", "org") ||
    s.between("pressLena", "lena") ||
    s.between("pressAsk3", "type3") ||
    s.between("pressSend3", "asked3");

  return (
    <div ref={ref} style={{ width: DASH_W }}>
      <div ref={stageRef} className="glass-panel relative overflow-hidden rounded-[1.15rem] p-0 shadow-[var(--shadow-elevated)]" style={{ width: DASH_W, height: H }}>
        <div className="flex h-full">
          <Sidebar atom active={page === "agents" ? "Agents" : "Executive Briefing"} hover={s.between("toAgents", "agents") ? "Agents" : undefined} />
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
              <BriefDetails s={s} width={contentW} />
            </Screen>
            <Screen show={page === "agents"} className="!p-0">
              <div className="flex h-full flex-col">
                <Topbar stage={c.stage} />
                <div className="relative min-h-0 flex-1">
                  <MarketPage key={s.loop} s={s} width={contentW} ask={ask2} replyTyped={replyTyped} ask3={ask3} mailTyped={mailTyped} />
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
