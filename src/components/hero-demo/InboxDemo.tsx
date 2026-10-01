"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Cursor, ScaledStage, Typewriter, useScene, type CursorTarget } from "./engine";
import { AgentOrb, Card, Check, DemoButton, DemoFrame, Label, STAGE_H, STAGE_W, Screen, Sparkle, Toast } from "./frame";

/*
 * Storyboard — "While you slept, your agents prepared three decisions"
 *  1. Overnight  The night's agent activity streams in: cash swept, banks reconciled, risks raised.
 *  2. Approve    Decision one, a currency hedge renewal, is approved in a click.
 *  3. Refine     Decision two: the CFO asks for a narrower promo pause, types it in, and the agent revises the numbers.
 *  4. Delegate   Decision three needs operations. It is delegated to the COO with a due date.
 *  5. Done       Inbox zero: three decisions in under a minute, $1.9M of impact this quarter.
 */
export const INBOX_CUES = {
  start: 0,
  l1: 300,
  l2: 650,
  l3: 1000,
  l4: 1350,
  l5: 1700,
  l6: 2050,
  enter: 2300,
  press1: 3400,
  ok1: 3650,
  open2: 4300,
  toChanges: 4800,
  pressChanges: 5800,
  comment: 6050,
  type: 6400,
  toSend: 9100,
  pressSend: 10000,
  sent: 10250,
  reply: 10700,
  revised: 12500,
  toApprove2: 13000,
  press2: 14000,
  ok2: 14250,
  open3: 14900,
  toDelegate: 15400,
  pressDelegate: 16300,
  picker: 16550,
  toPerson: 17000,
  pressPerson: 17900,
  delegated: 18150,
  zero: 19000,
  toast: 19600,
  exit: 26000,
} as const;
export const INBOX_LOOP = 28000;

export type InboxChapter = "overnight" | "approve" | "refine" | "delegate" | "done";
export const INBOX_CHAPTERS: { key: InboxChapter; title: string }[] = [
  { key: "overnight", title: "Overnight" },
  { key: "approve", title: "Approve" },
  { key: "refine", title: "Refine" },
  { key: "delegate", title: "Delegate" },
  { key: "done", title: "Inbox zero" },
];

const LOG = [
  ["02:14", "Cash", "Swept $18.2M of idle balances into money market", "+$41k / month"],
  ["03:02", "Close", "Reconciled 2,904 bank lines across 14 entities", "3 exceptions fixed"],
  ["04:40", "Pricing", "Found the Summer 20% promo cannibalising full-price sales", "decision prepared"],
  ["05:15", "Supply", "Raised Tier-1 supplier delay risk to high for 3 plants", "decision prepared"],
  ["06:01", "Treasury", "Priced renewal of the EUR hedge expiring Friday", "decision prepared"],
  ["06:30", "Briefing", "Prepared 3 decisions for Elena · $1.9M at stake", "ready"],
] as const;

const COMMENT = "Only pause it in the Southeast stores — keep EMEA running, it's still accretive.";
const REPLY = "Revised: pause scoped to 46 Southeast stores. EMEA keeps the promo. Margin impact +$260k, revenue impact −$0.4M.";

const PEOPLE = [
  { id: "person-coo", i: "MH", n: "Marcus Hale", r: "COO" },
  { id: "person-vp", i: "PR", n: "Priya Rao", r: "VP Supply Chain" },
  { id: "person-pm", i: "TO", n: "Tom Okafor", r: "Plant Director" },
];

function DecisionCard({
  n,
  agent,
  title,
  impact,
  urgency,
  open,
  status,
  children,
}: {
  n: number;
  agent: string;
  title: string;
  impact: ReactNode;
  urgency: string;
  open: boolean;
  status?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border transition-[border-color,background-color,box-shadow] duration-500 ${
        open ? "border-gl-gold/40 bg-gl-gold/[0.045] shadow-[0_20px_50px_-30px_oklch(0.77_0.155_66/50%)]" : "border-gl-border/70 bg-gl-background/35"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <span className={`grid h-6 w-6 place-items-center rounded-full font-gl-mono text-[0.56rem] ${open ? "bg-gl-gold text-gl-background" : "bg-gl-foreground/10 text-gl-muted-foreground"}`}>{n}</span>
        <div className="min-w-0 flex-1">
          <p className="font-gl-mono text-[0.52rem] uppercase tracking-[0.14em] text-gl-muted-foreground/70">
            {agent} agent · {urgency}
          </p>
          <p className="truncate text-[0.74rem] text-gl-foreground">{title}</p>
        </div>
        {status ?? <span className="font-gl-mono text-[0.62rem] text-gl-data">{impact}</span>}
      </div>
      <div className={`grid transition-[grid-template-rows] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="px-4 pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Metric({ k, v, tone }: { k: string; v: ReactNode; tone?: "data" | "gold" | "success" }) {
  return (
    <div className="rounded-md bg-gl-background/50 px-2.5 py-1.5">
      <p className="text-[0.5rem] uppercase tracking-[0.1em] text-gl-muted-foreground/70">{k}</p>
      <p className={`font-gl-mono text-[0.68rem] ${tone === "gold" ? "text-gl-gold" : tone === "success" ? "text-[var(--success)]" : tone === "data" ? "text-gl-data" : "text-gl-foreground"}`}>{v}</p>
    </div>
  );
}

const Done = ({ children }: { children: ReactNode }) => (
  <span className="demo-pop flex items-center gap-1.5 text-[0.62rem] text-[var(--success)]">
    <Check className="h-3.5 w-3.5" /> {children}
  </span>
);

export function InboxDemo({ onChapter }: { onChapter?: (c: InboxChapter) => void }) {
  const { ref, scene: s } = useScene(INBOX_CUES, INBOX_LOOP, "open2");
  const stageRef = useRef<HTMLDivElement>(null);

  const chapter: InboxChapter = !s.past("enter")
    ? "overnight"
    : !s.past("open2")
      ? "approve"
      : !s.past("open3")
        ? "refine"
        : !s.past("zero")
          ? "delegate"
          : "done";
  useEffect(() => onChapter?.(chapter), [chapter, onChapter]);

  const logs = (["l1", "l2", "l3", "l4", "l5", "l6"] as const).filter((k) => s.past(k)).length;
  const ok1 = s.past("ok1");
  const ok2 = s.past("ok2");
  const del = s.past("delegated");
  const open1 = !ok1 && s.index >= 0 && !s.past("open2");
  const open2 = s.between("open2", "ok2");
  const open3 = s.between("open3", "delegated");
  const waiting = 3 - [ok1, ok2, del].filter(Boolean).length;

  const off = { x: STAGE_W + 60, y: STAGE_H - 40 };
  let target: CursorTarget = off;
  let pointer = false;
  if (s.between("enter", "ok1")) {
    target = "approve-1";
    pointer = true;
  } else if (s.between("ok1", "toChanges")) target = { x: 900, y: 300 };
  else if (s.between("toChanges", "type")) {
    target = "changes-2";
    pointer = true;
  } else if (s.between("type", "toSend")) target = "comment-box";
  else if (s.between("toSend", "reply")) {
    target = "send-2";
    pointer = true;
  } else if (s.between("reply", "toApprove2")) target = { x: 820, y: 470 };
  else if (s.between("toApprove2", "open3")) {
    target = "approve-2";
    pointer = true;
  } else if (s.between("toDelegate", "toPerson")) {
    target = "delegate-3";
    pointer = true;
  } else if (s.between("toPerson", "zero")) {
    target = "person-coo";
    pointer = true;
  } else if (s.between("zero", "exit")) target = { x: 1010, y: 650 };
  else if (s.between("open3", "toDelegate")) target = { x: 900, y: 420 };
  if (s.index < 0 || !s.past("enter")) target = off;

  const pressed =
    s.between("press1", "ok1") ||
    s.between("pressChanges", "comment") ||
    s.between("pressSend", "sent") ||
    s.between("press2", "ok2") ||
    s.between("pressDelegate", "picker") ||
    s.between("pressPerson", "delegated");

  return (
    <div ref={ref}>
      <ScaledStage width={STAGE_W} height={STAGE_H}>
        <div ref={stageRef} className="relative h-full w-full">
          <DemoFrame
            active="decisions"
            title="Good morning, Elena"
            subtitle="Decisions · prepared overnight by 6 agents · Tuesday 07:42"
            badges={{ decisions: waiting > 0 ? String(waiting) : "", agents: "6" }}
          >
            <Screen show>
              <div key={s.loop} className="flex h-full flex-col gap-3">
                <Card className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <AgentOrb state={s.past("zero") ? "done" : "waiting"} />
                    <div>
                      <p className="font-gl-display text-[1rem] tracking-tight text-gl-foreground">
                        {s.past("zero") ? "You're all caught up." : `${waiting} decision${waiting === 1 ? "" : "s"} need you this morning`}
                      </p>
                      <p className="text-[0.62rem] text-gl-muted-foreground">Your agents handled 41 tasks overnight · 38 needed no one · 3 need your judgement</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Metric k="At stake this quarter" v="$1.9M" tone="data" />
                    <Metric k="Time spent" v={s.past("zero") ? "52 sec" : "—"} tone={s.past("zero") ? "success" : undefined} />
                  </div>
                </Card>

                <div className="grid min-h-0 flex-1 grid-cols-[340px_1fr] gap-3">
                  <Card className="flex min-h-0 flex-col p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-[0.72rem] text-gl-foreground">Overnight · agents at work</p>
                      <span className="font-gl-mono text-[0.54rem] text-gl-muted-foreground/60">00:00 → 07:42</span>
                    </div>
                    <div className="relative flex-1">
                      <span className="absolute bottom-2 left-[5px] top-2 w-px bg-gl-border" />
                      <div className="space-y-3.5">
                        {LOG.map(([t, a, txt, out], i) => (
                          <div key={t} className={`relative pl-5 transition-all duration-500 ${i < logs ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
                            <span className={`absolute left-0 top-1 h-[11px] w-[11px] rounded-full border-2 border-[oklch(0.17_0.028_262)] ${out === "ready" ? "bg-gl-gold" : out === "decision prepared" ? "bg-gl-data" : "bg-[var(--success)]"}`} />
                            <p className="font-gl-mono text-[0.54rem] text-gl-muted-foreground/70">
                              {t} · <span className="text-gl-foreground/80">{a} agent</span>
                            </p>
                            <p className="mt-0.5 text-[0.66rem] leading-snug text-gl-foreground/90">{txt}</p>
                            <p className={`font-gl-mono text-[0.54rem] ${out === "ready" ? "text-gl-gold" : out === "decision prepared" ? "text-gl-data" : "text-[var(--success)]"}`}>{out}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  <div className="relative flex min-h-0 flex-col gap-2.5">
                    <DecisionCard
                      n={1}
                      agent="Treasury"
                      urgency="expires Friday"
                      title="Renew EUR 40M hedge for 6 months at 1.0842"
                      impact="+$310k"
                      open={open1}
                      status={ok1 ? <Done>Approved · 07:43</Done> : undefined}
                    >
                      <p className="text-[0.66rem] leading-relaxed text-gl-muted-foreground">
                        Current hedge expires Friday. Renewing now locks 1.0842 versus 1.0791 spot, protecting EMEA margin through Q2.
                      </p>
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex gap-2">
                          <Metric k="Saving vs spot" v="+$310k" tone="success" />
                          <Metric k="Counterparties" v="3 banks" />
                          <Metric k="Policy" v="TRS-04 ✓" />
                        </div>
                        <div className="flex gap-2">
                          <DemoButton tone="ghost">Ask for changes</DemoButton>
                          <DemoButton id="approve-1" hover={s.past("enter")} pressed={s.between("press1", "ok1")}>
                            Approve
                          </DemoButton>
                        </div>
                      </div>
                    </DecisionCard>

                    <DecisionCard
                      n={2}
                      agent="Pricing"
                      urgency="promo runs today"
                      title={s.past("revised") ? "Pause the Summer 20% promo in Southeast stores" : "Pause the Summer 20% promo in Retail — Direct"}
                      impact={s.past("revised") ? "+$260k" : "+$420k"}
                      open={open2}
                      status={ok2 ? <Done>Approved as revised · 07:43</Done> : undefined}
                    >
                      <p className="text-[0.66rem] leading-relaxed text-gl-muted-foreground">
                        The promo is pulling forward full-price sales: 61% of redemptions are existing customers who bought at full price last month.
                      </p>
                      <div className="mt-2.5 flex gap-2">
                        <Metric key={`m${s.past("revised")}`} k="Margin impact" v={s.past("revised") ? "+$260k" : "+$420k"} tone="success" />
                        <Metric key={`r${s.past("revised")}`} k="Revenue impact" v={s.past("revised") ? "−$0.4M" : "−$0.9M"} tone="gold" />
                        <Metric k="Scope" v={s.past("revised") ? "46 stores" : "212 stores"} />
                      </div>

                      <div className={`grid transition-[grid-template-rows] duration-[450ms] ${s.past("comment") ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                        <div className="overflow-hidden">
                          <div className="mt-3 space-y-2">
                            <div data-cursor="comment-box" className="flex items-start gap-2.5 rounded-lg border border-gl-border bg-gl-background/60 p-2.5">
                              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.75_0.12_70)] to-[oklch(0.55_0.14_40)] text-[0.45rem] font-semibold text-[oklch(0.15_0.03_264)]">EC</span>
                              <p className="min-h-[18px] flex-1 text-[0.68rem] text-gl-foreground">
                                {s.past("type") ? (
                                  <Typewriter key={s.loop} text={COMMENT} play={s.between("type", "toSend")} done={s.past("toSend")} cps={34} />
                                ) : (
                                  <span className="text-gl-muted-foreground/60">Tell the agent what to change…</span>
                                )}
                              </p>
                              {s.past("sent") ? (
                                <span className="font-gl-mono text-[0.54rem] text-gl-muted-foreground">sent</span>
                              ) : (
                                <DemoButton id="send-2" tone="data" hover={s.past("toSend")} pressed={s.between("pressSend", "sent")} className="px-2.5 py-1">
                                  Send
                                </DemoButton>
                              )}
                            </div>
                            <div className={`flex items-start gap-2.5 rounded-lg bg-gl-data/[0.07] p-2.5 transition-opacity duration-500 ${s.past("reply") ? "opacity-100" : "opacity-0"}`}>
                              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gl-data/20 text-gl-data">
                                <Sparkle className="h-2.5 w-2.5" />
                              </span>
                              <p className="flex-1 text-[0.68rem] leading-relaxed text-gl-foreground/90">
                                <Typewriter key={s.loop} text={REPLY} play={s.between("reply", "revised")} done={s.past("revised")} cps={64} />
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2.5 flex justify-end gap-2">
                        <DemoButton id="changes-2" tone="ghost" hover={s.between("toChanges", "comment")} pressed={s.between("pressChanges", "comment")}>
                          Ask for changes
                        </DemoButton>
                        <DemoButton id="approve-2" hover={s.past("toApprove2")} pressed={s.between("press2", "ok2")} className={s.past("revised") ? "" : "opacity-50"}>
                          {s.past("revised") ? "Approve revised" : "Approve"}
                        </DemoButton>
                      </div>
                    </DecisionCard>

                    <DecisionCard
                      n={3}
                      agent="Supply"
                      urgency="risk: high"
                      title="Dual-source the Tier-1 bearing supplier for 3 plants"
                      impact="$22.6M at risk"
                      open={open3}
                      status={del ? <Done>Delegated to Marcus Hale · due Thu</Done> : undefined}
                    >
                      <p className="text-[0.66rem] leading-relaxed text-gl-muted-foreground">
                        Lead times slipped 9 days in 3 weeks. Two qualified alternates found in Mexico and Poland. Needs an operations owner.
                      </p>
                      <div className="relative mt-2.5 flex items-center justify-between">
                        <div className="flex gap-2">
                          <Metric k="Revenue at risk" v="$22.6M" tone="gold" />
                          <Metric k="Alternates" v="2 qualified" />
                        </div>
                        <div className="flex gap-2">
                          <DemoButton id="delegate-3" tone="ghost" hover={s.between("toDelegate", "picker")} pressed={s.between("pressDelegate", "picker")}>
                            Delegate
                          </DemoButton>
                          <DemoButton>Approve</DemoButton>
                        </div>
                      </div>
                      <div className={`grid transition-[grid-template-rows] duration-[450ms] ${s.past("picker") ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                        <div className="overflow-hidden">
                          <div className="mt-2.5 grid grid-cols-3 gap-2">
                            {PEOPLE.map((p) => {
                              const chosen = p.id === "person-coo" && s.past("pressPerson");
                              return (
                                <div
                                  key={p.id}
                                  data-cursor={p.id}
                                  className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 transition-colors duration-200 ${
                                    chosen ? "border-gl-gold bg-gl-gold/10" : p.id === "person-coo" && s.past("toPerson") ? "border-gl-border bg-gl-foreground/[0.05]" : "border-gl-border/70"
                                  }`}
                                >
                                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gl-foreground/12 text-[0.5rem] font-semibold text-gl-foreground">{p.i}</span>
                                  <div>
                                    <p className="text-[0.62rem] text-gl-foreground">{p.n}</p>
                                    <p className="text-[0.52rem] text-gl-muted-foreground">{p.r}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </DecisionCard>

                    <div className={`mt-1 rounded-xl border border-[oklch(0.78_0.13_168/35%)] bg-[oklch(0.78_0.13_168/6%)] p-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${s.past("zero") ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>This morning</Label>
                          <p className="mt-1 font-gl-display text-[1.05rem] tracking-tight text-gl-foreground">3 decisions in 52 seconds</p>
                        </div>
                        <div className="flex gap-2">
                          <Metric k="Approved" v="2" tone="success" />
                          <Metric k="Delegated" v="1" />
                          <Metric k="Impact · Q3" v="+$570k" tone="success" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Screen>
            <Toast
              className="bottom-7 left-7"
              show={s.between("toast", "exit")}
              title="Inbox zero"
              body="Agents are executing the approved decisions · Marcus notified · all logged"
            />
          </DemoFrame>
          <Cursor rootRef={stageRef} target={target} pointer={pointer} pressed={pressed} />
        </div>
      </ScaledStage>
    </div>
  );
}
