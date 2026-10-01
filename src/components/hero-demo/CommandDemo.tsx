"use client";

import { useEffect, useRef } from "react";
import { Cursor, ScaledStage, Typewriter, fmt, smoothPath, useScene, type CursorTarget } from "./engine";
import { AgentOrb, Card, Check, DemoButton, DemoFrame, Label, STAGE_H, STAGE_W, Screen, Spark, Sparkle, Spinner, Toast } from "./frame";
import { PerformanceScreen, renderSegments, segText, type Kpi, type Segment } from "./screens";

/*
 * Storyboard — "Ask a question, leave with a decision and a board update"
 *  1. Ask       The user opens Ask Genius (⌘K) and types: "Why is free cash flow behind budget?"
 *  2. Answer    Genius streams the answer and builds the cash bridge from 14 entities.
 *  3. Decide    It proposes two actions. The user ticks the second and approves both.
 *  4. Brief     Board Reports opens; the update writes itself section by section, with sources.
 *  5. Send      The user sends it to the board. Read receipts start arriving.
 */
export const COMMAND_CUES = {
  start: 0,
  enter: 600,
  askPress: 1700,
  open: 1950,
  type: 2400,
  enterKey: 4400,
  think: 4700,
  answer: 5600,
  actions: 9600,
  toCheck: 10300,
  checkPress: 11100,
  checked: 11300,
  toApprove: 11900,
  approvePress: 12900,
  approved: 13150,
  toBoard: 14200,
  sec1: 14800,
  sec2: 15700,
  sec3: 16600,
  sec4: 17500,
  toSend: 18500,
  sendPress: 19400,
  sending: 19650,
  sent: 20900,
  read1: 21700,
  read2: 22500,
  exit: 25200,
} as const;
export const COMMAND_LOOP = 27000;

export type CommandChapter = "ask" | "answer" | "decide" | "brief" | "send";
export const COMMAND_CHAPTERS: { key: CommandChapter; title: string }[] = [
  { key: "ask", title: "Ask" },
  { key: "answer", title: "Answer" },
  { key: "decide", title: "Decide" },
  { key: "brief", title: "Brief the board" },
  { key: "send", title: "Send" },
];

const QUERY = "Why is free cash flow behind budget?";

const ANSWER: Segment[] = [
  { t: "Free cash flow is " },
  { t: "$4.2M behind budget", tone: "gold" },
  { t: ". Two drivers explain 90% of it: " },
  { t: "Southeast inventory", tone: "strong" },
  { t: " (−$3.1M) and " },
  { t: "slower EMEA collections", tone: "strong" },
  { t: " (−$1.6M), partly offset by capex timing. Both are recoverable this quarter." },
];

const BRIDGE = [
  { k: "Budget", v: 100.6, kind: "total" },
  { k: "Inventory", v: -3.1, kind: "neg" },
  { k: "Receivables", v: -1.6, kind: "neg" },
  { k: "Capex", v: 0.5, kind: "pos" },
  { k: "Actual", v: 96.4, kind: "total" },
] as const;

function Bridge({ grow, compact = false }: { grow: boolean; compact?: boolean }) {
  const lo = 94.5;
  const hi = 101.2;
  const h = compact ? 84 : 104;
  const y = (v: number) => h - ((v - lo) / (hi - lo)) * h;
  const spans: [number, number][] = [];
  let run = 100.6;
  for (const b of BRIDGE) {
    if (b.kind === "total") spans.push([y(b.v), h]);
    else {
      const next = run + b.v;
      spans.push([y(Math.max(run, next)), y(Math.min(run, next))]);
      run = next;
    }
  }
  return (
    <div className="flex items-end gap-3">
      {BRIDGE.map((b, i) => {
        const [y0, y1] = spans[i]!;
        const color = b.kind === "total" ? "bg-gl-data/75" : b.kind === "neg" ? "bg-gl-gold" : "bg-[var(--success)]";
        return (
          <div key={b.k} className="flex flex-1 flex-col items-center gap-1">
            <span className={`font-gl-mono text-[0.54rem] transition-opacity duration-500 ${grow ? "opacity-100" : "opacity-0"} ${b.kind === "neg" ? "text-gl-gold" : b.kind === "pos" ? "text-[var(--success)]" : "text-gl-foreground"}`} style={{ transitionDelay: `${i * 140 + 300}ms` }}>
              {b.kind === "total" ? fmt.money1(b.v) : `${b.v > 0 ? "+" : "−"}${Math.abs(b.v).toFixed(1)}`}
            </span>
            <div className="relative w-full" style={{ height: h }}>
              <div
                className={`demo-grow-y absolute inset-x-0 rounded-[3px] ${color}`}
                style={{ top: y0, height: Math.max(3, y1 - y0), transform: grow ? "scaleY(1)" : "scaleY(0)", transitionDelay: `${i * 140}ms` }}
              />
            </div>
            <span className="text-[0.54rem] text-gl-muted-foreground">{b.k}</span>
          </div>
        );
      })}
    </div>
  );
}

function Checkbox({ on }: { on: boolean }) {
  return (
    <span
      className={`grid h-4 w-4 shrink-0 place-items-center rounded-[4px] border transition-all duration-200 ${on ? "border-gl-gold bg-gl-gold text-gl-background" : "border-gl-border bg-transparent"}`}
    >
      {on ? <Check className="h-3 w-3" /> : null}
    </span>
  );
}

function Palette({
  open,
  typing,
  typed,
  enterKey,
  thinking,
  answering,
  answered,
  actions,
  check2,
  hoverCheck,
  approveHover,
  approvePressed,
  approved,
  loopKey,
}: {
  open: boolean;
  typing: boolean;
  typed: boolean;
  enterKey: boolean;
  thinking: boolean;
  answering: boolean;
  answered: boolean;
  actions: boolean;
  check2: boolean;
  hoverCheck: boolean;
  approveHover: boolean;
  approvePressed: boolean;
  approved: boolean;
  loopKey: number;
}) {
  return (
    <div className={`absolute inset-0 z-30 transition-opacity duration-500 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}>
      <div className="absolute inset-0 bg-[oklch(0.1_0.03_264/62%)] backdrop-blur-[3px]" />
      <div
        className={`absolute left-[calc(50%-340px)] top-[64px] w-[680px] overflow-hidden rounded-2xl border border-gl-border bg-[oklch(0.16_0.03_262/97%)] shadow-[0_40px_120px_-30px_rgb(0_0_0/0.85),0_0_0_1px_oklch(0.77_0.155_66/14%)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-y-0 scale-100" : "translate-y-3 scale-[0.97]"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-gl-border/80 px-5 py-4">
          <Sparkle className="h-4 w-4 text-gl-gold" />
          <span className="flex-1 text-[0.95rem] text-gl-foreground">
            {typing || typed ? (
              <Typewriter key={loopKey} text={QUERY} play={typing} done={typed} cps={26} />
            ) : (
              <span className="text-gl-muted-foreground/60">Ask anything about your business…</span>
            )}
          </span>
          <span
            className={`rounded-md border px-1.5 py-0.5 font-gl-mono text-[0.6rem] transition-all duration-200 ${
              enterKey ? "scale-90 border-gl-gold bg-gl-gold/20 text-gl-gold" : "border-gl-border text-gl-muted-foreground"
            }`}
          >
            ↵
          </span>
        </div>

        <div className={`px-5 transition-all duration-500 ${thinking || answering || answered ? "max-h-[600px] py-4 opacity-100" : "max-h-0 py-0 opacity-0"}`}>
          <div className="flex items-center gap-2.5">
            <AgentOrb state={thinking ? "thinking" : answering ? "writing" : approved ? "done" : "waiting"} size={26} />
            <p className="text-[0.66rem] text-gl-muted-foreground">
              {thinking ? (
                <span className="inline-flex items-center gap-1.5">
                  <Spinner className="h-2 w-2 text-gl-data" /> Reading 14 entities · 2,418 cash records…
                </span>
              ) : approved ? (
                "2 actions approved · drafting the board update"
              ) : (
                "Genius Agent · answered in 3.1s from governed data"
              )}
            </p>
          </div>
          <div className="mt-3 min-h-[60px] text-[0.78rem] leading-[1.6] text-gl-foreground/90">
            <Typewriter
              key={loopKey}
              text={segText(ANSWER)}
              play={answering}
              done={answered}
              cps={62}
              renderText={(v) => renderSegments(ANSWER, v.length)}
            />
          </div>
          <div className={`mt-3 rounded-xl border border-gl-border/70 bg-gl-background/40 p-3.5 transition-opacity duration-500 ${answering || answered ? "opacity-100" : "opacity-0"}`}>
            <div className="mb-2 flex items-center justify-between">
              <Label>Free cash flow bridge · QTD</Label>
              <span className="font-gl-mono text-[0.54rem] text-gl-muted-foreground/60">$M</span>
            </div>
            <Bridge grow={answering || answered} />
          </div>

          <div className={`mt-3 space-y-2 transition-all duration-500 ${actions ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
            <Label>Recommended actions</Label>
            {[
              { on: true, t: "Release $1.4M of Southeast inventory to EMEA", m: "+$1.4M cash · 94% confidence" },
              { on: check2, t: "Accelerate EMEA collections — 11 accounts > 60 days", m: "+$1.1M cash · 89% confidence", id: "check-2", hover: hoverCheck },
            ].map((a) => (
              <div
                key={a.t}
                data-cursor={a.id}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors duration-200 ${
                  a.on ? "border-gl-gold/40 bg-gl-gold/[0.06]" : a.hover ? "border-gl-border bg-gl-foreground/[0.04]" : "border-gl-border/70"
                }`}
              >
                <Checkbox on={a.on} />
                <div className="flex-1">
                  <p className="text-[0.7rem] text-gl-foreground">{a.t}</p>
                  <p className="font-gl-mono text-[0.56rem] text-gl-muted-foreground">{a.m}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-1.5">
              <span className="font-gl-mono text-[0.56rem] text-gl-muted-foreground/70">Sources · ERP, AR ledger, WMS · 14 entities</span>
              {approved ? (
                <DemoButton id="approve-all" tone="success">
                  <Check className="h-3 w-3" /> Approved
                </DemoButton>
              ) : (
                <DemoButton id="approve-all" hover={approveHover} pressed={approvePressed}>
                  Approve {check2 ? "2 actions" : "1 action"} & brief the board
                </DemoButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BoardScreen({
  sections,
  sendHover,
  sendPressed,
  sending,
  sent,
  reads,
}: {
  sections: number;
  sendHover: boolean;
  sendPressed: boolean;
  sending: boolean;
  sent: boolean;
  reads: number;
}) {
  const vis = (i: number) => `transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${sections > i ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`;
  const members = ["MH", "JR", "AL", "SK", "TP", "DW", "NB"];
  return (
    <div className="grid h-full grid-cols-[1fr_300px] gap-3">
      <div className="relative overflow-hidden rounded-xl bg-[oklch(0.975_0.004_250)] p-6 text-[oklch(0.22_0.02_258)] shadow-[0_30px_80px_-40px_rgb(0_0_0/0.8)]">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-gl-mono text-[0.54rem] uppercase tracking-[0.18em] text-[oklch(0.5_0.015_254)]">Meridian Holdings · Board of Directors</p>
            <p className="mt-1.5 font-gl-display text-[1.25rem] tracking-tight">Q3 Cash Position — Board Update</p>
            <p className="mt-1 text-[0.6rem] text-[oklch(0.5_0.015_254)]">Prepared by Genius Agent for Elena Costa, CFO · 14:04 · governed data, 14 entities</p>
          </div>
          <span className="rounded-md bg-[oklch(0.55_0.18_253/10%)] px-2 py-1 font-gl-mono text-[0.54rem] text-[oklch(0.5_0.18_253)]">DRAFT v1</span>
        </div>
        <div className="mt-5 h-px bg-[oklch(0.24_0.02_258/12%)]" />

        <div className={`mt-4 ${vis(0)}`}>
          <p className="font-gl-mono text-[0.54rem] uppercase tracking-[0.16em] text-[oklch(0.62_0.15_62)]">01 · Summary</p>
          <p className="mt-1.5 text-[0.7rem] leading-[1.65]">
            Free cash flow closed the period <b>$4.2M behind budget</b>, driven by Southeast inventory build and slower EMEA collections. Management has
            approved two actions expected to recover <b>$2.5M within the quarter</b>.
          </p>
        </div>

        <div className={`mt-4 grid grid-cols-[1fr_1fr] gap-5 ${vis(1)}`}>
          <div>
            <p className="font-gl-mono text-[0.54rem] uppercase tracking-[0.16em] text-[oklch(0.62_0.15_62)]">02 · Cash bridge</p>
            <div className="mt-2 rounded-lg bg-[oklch(0.16_0.03_262)] p-3">
              <Bridge grow={sections > 1} compact />
            </div>
          </div>
          <div className={vis(2)}>
            <p className="font-gl-mono text-[0.54rem] uppercase tracking-[0.16em] text-[oklch(0.62_0.15_62)]">03 · Decisions taken</p>
            <div className="mt-2 space-y-2">
              {[
                ["Release Southeast inventory", "+$1.4M", "Ops · Fri"],
                ["Accelerate EMEA collections", "+$1.1M", "AR · 30 days"],
              ].map(([t, v, o]) => (
                <div key={t} className="flex items-center justify-between rounded-md border border-[oklch(0.24_0.02_258/12%)] px-2.5 py-2">
                  <div>
                    <p className="text-[0.64rem] font-medium">{t}</p>
                    <p className="text-[0.56rem] text-[oklch(0.5_0.015_254)]">Owner {o} · approved 14:02</p>
                  </div>
                  <span className="font-gl-mono text-[0.66rem] text-[oklch(0.5_0.13_165)]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`mt-4 ${vis(3)}`}>
          <p className="font-gl-mono text-[0.54rem] uppercase tracking-[0.16em] text-[oklch(0.62_0.15_62)]">04 · Watch list</p>
          <div className="mt-1.5 flex gap-2">
            {["Covenant headroom 2.1x", "DSO 47 → 41 days", "Inventory days 61 → 54"].map((w) => (
              <span key={w} className="rounded border border-[oklch(0.24_0.02_258/14%)] px-2 py-1 text-[0.58rem]">
                {w}
              </span>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-[oklch(0.24_0.02_258/12%)] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[0.62rem] font-medium">Cash forecast · next 13 weeks</p>
              <p className="font-gl-mono text-[0.56rem] text-[oklch(0.5_0.13_165)]">+$2.5M recovered by week 9</p>
            </div>
            <svg viewBox="0 0 560 70" className="mt-2 block h-[70px] w-full" aria-hidden="true">
              <line x1="0" x2="560" y1="34" y2="34" stroke="oklch(0.24 0.02 258 / 25%)" strokeDasharray="3 4" />
              <text x="4" y="30" fontSize="8" fill="oklch(0.5 0.015 254)" className="font-gl-mono">BUDGET</text>
              <path d={smoothPath([[0, 52], [60, 50], [120, 53], [180, 49], [240, 44], [300, 40], [360, 36], [420, 33], [480, 30], [560, 27]])} fill="none" stroke="oklch(0.5 0.13 165)" strokeWidth="2" />
              <path d={smoothPath([[0, 52], [60, 50], [120, 53], [180, 54], [240, 55], [300, 56], [360, 56], [420, 57], [480, 57], [560, 58]])} fill="none" stroke="oklch(0.62 0.15 62)" strokeWidth="1.4" strokeDasharray="4 4" />
            </svg>
            <div className="mt-1 flex gap-4 text-[0.54rem] text-[oklch(0.5_0.015_254)]">
              <span className="flex items-center gap-1.5"><span className="h-[2px] w-3 bg-[oklch(0.5_0.13_165)]" /> With approved actions</span>
              <span className="flex items-center gap-1.5"><span className="h-[2px] w-3 bg-[oklch(0.62_0.15_62)]" /> Without</span>
            </div>
          </div>
        </div>

        {sections > 0 && sections < 4 ? (
          <div className="absolute bottom-5 left-6 flex items-center gap-2 text-[0.6rem] text-[oklch(0.5_0.18_253)]">
            <Spinner className="h-2.5 w-2.5" /> Genius is writing section {sections + 1} of 4…
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <Card className="p-3.5">
          <Label>Distribution</Label>
          <p className="mt-1.5 text-[0.7rem] text-gl-foreground">Board of Directors · 7 members</p>
          <div className="mt-3 flex -space-x-1.5">
            {members.map((m, i) => (
              <span
                key={m}
                className={`relative grid h-7 w-7 place-items-center rounded-full border-2 border-[oklch(0.17_0.028_262)] text-[0.52rem] font-semibold transition-colors duration-500 ${
                  sent && i < reads ? "bg-[var(--success)] text-gl-background" : "bg-gl-foreground/12 text-gl-foreground"
                }`}
              >
                {m}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[0.6rem] text-gl-muted-foreground">
            {sent ? `${reads} of 7 opened` : "Secure link · watermarked PDF"}
          </p>
        </Card>
        <Card className="p-3.5">
          <Label>Every number is traceable</Label>
          <div className="mt-2 space-y-1.5 text-[0.62rem]">
            {[
              ["Figures", "36 · all sourced"],
              ["Source records", "2,418"],
              ["Reviewed by", "Elena Costa"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-gl-muted-foreground">{k}</span>
                <span className="text-gl-foreground">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Spark values={[2, 3, 3, 4, 5, 5, 6]} />
            <span className="text-[0.58rem] text-gl-muted-foreground">Board pack 4 hrs → 2 min</span>
          </div>
        </Card>
        <div className={`mt-auto transition-all duration-500 ${sections >= 4 ? "opacity-100" : "translate-y-2 opacity-0"}`}>
          {sent ? (
            <DemoButton id="send" tone="success" className="w-full py-2.5">
              <Check className="h-3 w-3" /> Sent to the board · 14:06
            </DemoButton>
          ) : (
            <DemoButton id="send" hover={sendHover} pressed={sendPressed} className="w-full py-2.5">
              {sending ? (
                <>
                  <Spinner className="h-2.5 w-2.5" /> Sending…
                </>
              ) : (
                "Send to the board"
              )}
            </DemoButton>
          )}
        </div>
      </div>
    </div>
  );
}

function CashWatch() {
  return (
    <Card className="flex h-full flex-col p-4">
      <div className="flex items-center justify-between">
        <p className="text-[0.72rem] text-gl-foreground">Cash & working capital</p>
        <span className="font-gl-mono text-[0.56rem] text-gl-muted-foreground/60">QTD</span>
      </div>
      <div className="mt-3 flex flex-1 flex-col justify-around">
        {[
          { k: "Receivables (DSO)", v: "47 days", d: "+6 vs plan", t: "gold" as const, s: [3, 3, 4, 4, 5, 6, 6] },
          { k: "Inventory days", v: "61 days", d: "+7 vs plan", t: "gold" as const, s: [3, 4, 4, 5, 6, 6, 7] },
          { k: "Payables (DPO)", v: "38 days", d: "on plan", t: "data" as const, s: [5, 5, 5, 5, 5, 5, 5] },
          { k: "Covenant headroom", v: "2.1x", d: "min 1.5x", t: "data" as const, s: [6, 6, 5, 5, 5, 4, 4] },
          { k: "Cash on hand", v: "$212M", d: "14 entities", t: "data" as const, s: [5, 6, 6, 5, 6, 6, 7] },
        ].map((r) => (
          <div key={r.k} className="flex items-center justify-between border-b border-gl-border/40 pb-2.5">
            <div>
              <p className="text-[0.62rem] text-gl-muted-foreground">{r.k}</p>
              <p className="font-gl-display text-[0.95rem] tracking-tight text-gl-foreground">{r.v}</p>
            </div>
            <div className="text-right">
              <Spark values={r.s} tone={r.t} w={64} h={18} />
              <p className={`text-[0.56rem] ${r.t === "gold" ? "text-gl-gold" : "text-gl-muted-foreground"}`}>{r.d}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

const KPIS: Kpi[] = [
  { label: "Revenue", value: 1.42, format: fmt.moneyB, delta: "+6.4% vs budget", status: "ahead", spark: [3, 4, 4, 5, 5, 6, 7], tone: "data" },
  { label: "EBITDA", value: 284, format: fmt.money0, delta: "+1.2pp vs budget", status: "ahead", spark: [4, 4, 5, 5, 6, 6, 7], tone: "data" },
  { label: "Gross margin", value: 38.6, format: fmt.pct1, delta: "+0.8pp vs budget", status: "track", spark: [5, 5, 5, 6, 6, 6, 7], tone: "data" },
  { label: "Free cash flow", value: 96.4, format: fmt.money1, delta: "−$4.2M vs budget", status: "attention", spark: [7, 6, 6, 5, 5, 4, 4], tone: "gold" },
];

export function CommandDemo({ onChapter }: { onChapter?: (c: CommandChapter) => void }) {
  const { ref, scene: s } = useScene(COMMAND_CUES, COMMAND_LOOP, "actions");
  const stageRef = useRef<HTMLDivElement>(null);
  const page: "perf" | "board" = s.past("toBoard") ? "board" : "perf";
  const open = s.between("open", "toBoard");

  const chapter: CommandChapter = !s.past("think")
    ? "ask"
    : !s.past("actions")
      ? "answer"
      : !s.past("toBoard")
        ? "decide"
        : !s.past("toSend")
          ? "brief"
          : "send";
  useEffect(() => onChapter?.(chapter), [chapter, onChapter]);

  let target: CursorTarget = { x: STAGE_W + 60, y: STAGE_H - 40 };
  let pointer = false;
  let anchor: [number, number] = [0.5, 0.55];
  if (s.between("enter", "open")) {
    target = "ask";
    pointer = true;
  } else if (s.between("open", "toCheck")) target = { x: 940, y: 300 };
  else if (s.between("toCheck", "toApprove")) {
    target = "check-2";
    anchor = [0.06, 0.5];
    pointer = true;
  } else if (s.between("toApprove", "toBoard")) {
    target = "approve-all";
    pointer = true;
  } else if (s.between("toBoard", "toSend")) target = { x: 720, y: 460 };
  else if (s.between("toSend", "exit")) {
    target = "send";
    pointer = true;
  }
  if (s.index < 0 || !s.past("enter") || s.past("exit")) target = { x: STAGE_W + 60, y: STAGE_H - 40 };

  const pressed = s.between("askPress", "open") || s.between("checkPress", "checked") || s.between("approvePress", "approved") || s.between("sendPress", "sending");
  const sections = s.past("sec4") ? 4 : s.past("sec3") ? 3 : s.past("sec2") ? 2 : s.past("sec1") ? 1 : 0;
  const reads = s.past("read2") ? 5 : s.past("read1") ? 2 : 0;

  return (
    <div ref={ref}>
      <ScaledStage width={STAGE_W} height={STAGE_H}>
        <div ref={stageRef} className="relative h-full w-full">
          <DemoFrame
            active={page === "board" ? "board" : "performance"}
            title={page === "board" ? "Board Reports" : "Executive Operating System"}
            subtitle={page === "board" ? "Q3 cash position · drafted by Genius Agent" : "Meridian Holdings · FY26 Q3 · 14 entities live"}
            askActive={s.between("enter", "toBoard")}
            badges={{ decisions: s.past("approved") ? "1" : "3" }}
            overlay={
              <Palette
                loopKey={s.loop}
                open={open}
                typing={s.between("type", "enterKey")}
                typed={s.past("enterKey")}
                enterKey={s.between("enterKey", "think")}
                thinking={s.between("think", "answer")}
                answering={s.between("answer", "actions")}
                answered={s.past("actions")}
                actions={s.past("actions")}
                check2={s.past("checked")}
                hoverCheck={s.between("toCheck", "checked")}
                approveHover={s.past("toApprove")}
                approvePressed={s.between("approvePress", "approved")}
                approved={s.past("approved")}
              />
            }
          >
            <Screen show={page === "perf"}>
              <PerformanceScreen key={s.loop} kpis={KPIS} countUp draw hover={false} side={<CashWatch />} />
            </Screen>
            <Screen show={page === "board"}>
              <BoardScreen
                key={s.loop}
                sections={sections}
                sendHover={s.past("toSend")}
                sendPressed={s.between("sendPress", "sending")}
                sending={s.between("sending", "sent")}
                sent={s.past("sent")}
                reads={reads}
              />
            </Screen>
            <Toast
              className="right-[330px] top-5"
              show={s.past("sent") && !s.past("exit")}
              title="Board update sent"
              body="Question to board-ready decision in 19 seconds · every figure sourced"
            />
          </DemoFrame>
          <Cursor rootRef={stageRef} target={target} pointer={pointer} pressed={pressed} anchor={anchor} />
        </div>
      </ScaledStage>
    </div>
  );
}
