"use client";

import { useEffect, useRef } from "react";
import { Cursor, ScaledStage, Tween, Typewriter, fmt, useScene, type CursorTarget } from "./engine";
import { AgentOrb, Card, Check, DemoButton, DemoFrame, Label, STAGE_H, STAGE_W, Screen, Spinner, SystemChip, Toast } from "./frame";
import { KpiCard, type Kpi } from "./screens";

/*
 * Storyboard — "An acquisition consolidated in days, not months"
 *  1. Close        Entities is open. A deal closed yesterday: Atlas Components, Stuttgart. The user clicks Integrate.
 *  2. Connect      ERP, payroll, banks and CRM connect one by one; millions of records stream in.
 *  3. Map          Genius maps 1,212 of 1,240 German GL accounts to the group chart. The user accepts its 28 suggestions.
 *  4. Consolidate  First consolidation runs: FX translation, intercompany eliminations, group statements.
 *  5. Report       Back on Entities: 15 entities live, group revenue updated, day 3 after close.
 */
export const INTEGRATION_CUES = {
  start: 0,
  enter: 600,
  press: 1800,
  toInt: 2050,
  c1: 2700,
  c2: 3300,
  c3: 3900,
  c4: 4500,
  map: 5000,
  mapped: 7700,
  toAccept: 8500,
  pressAccept: 9500,
  accepted: 9750,
  showRun: 10200,
  toRun: 10700,
  pressRun: 11700,
  run: 11950,
  k1: 12600,
  k2: 13400,
  k3: 14200,
  k4: 15000,
  toView: 15700,
  pressView: 16600,
  back: 16850,
  toast: 17500,
  exit: 23600,
} as const;
export const INTEGRATION_LOOP = 25600;

export type IntegrationChapter = "close" | "connect" | "map" | "consolidate" | "report";
export const INTEGRATION_CHAPTERS: { key: IntegrationChapter; title: string }[] = [
  { key: "close", title: "Deal closed" },
  { key: "connect", title: "Connect" },
  { key: "map", title: "Map accounts" },
  { key: "consolidate", title: "Consolidate" },
  { key: "report", title: "Report" },
];

const ENTITIES = [
  ["Meridian Holdings", "US", "NetSuite"],
  ["Industrial North", "US", "SAP S/4"],
  ["Industrial Southeast", "US", "SAP S/4"],
  ["Distribution EMEA", "NL", "Dynamics"],
  ["Retail Direct", "US", "Shopify"],
  ["Services Global", "UK", "Sage"],
  ["Meridian Canada", "CA", "NetSuite"],
  ["Meridian México", "MX", "SAP B1"],
  ["Precision Parts", "US", "Epicor"],
  ["Nordic Supply", "SE", "Visma"],
  ["Iberia Logistics", "ES", "SAP B1"],
  ["Pacific Sourcing", "SG", "Xero"],
  ["Meridian Capital", "US", "NetSuite"],
  ["Coastal Fabrication", "US", "QuickBooks"],
] as const;

const CONNECTIONS = [
  { code: "SAP", name: "SAP ECC 6.0", detail: "GL · AP · AR · fixed assets", records: 2.41 },
  { code: "PAY", name: "ADP Payroll DE", detail: "412 employees · 3 cost centers", records: 0.06 },
  { code: "BNK", name: "Bank feeds", detail: "Commerzbank · Deutsche Bank · 9 accounts", records: 0.18 },
  { code: "CRM", name: "Salesforce", detail: "Pipeline · 1,920 customers", records: 0.34 },
];

const ROWS: { src: string; dst: string; conf: number; review?: boolean }[] = [
  { src: "4400 Umsatzerlöse Inland", dst: "4000 · Revenue — domestic", conf: 99 },
  { src: "4120 Erlöse EU-Lieferungen", dst: "4010 · Revenue — intra-EU", conf: 98 },
  { src: "5400 Wareneingang 19% VSt", dst: "5000 · COGS — materials", conf: 97 },
  { src: "6300 Sonstige betr. Aufwendungen", dst: "6900 · Other operating expense", conf: 71, review: true },
  { src: "1590 Durchlaufende Posten", dst: "1890 · Clearing accounts", conf: 64, review: true },
  { src: "7310 Zinsaufwand Gesellschafter", dst: "7100 · Interest — related party", conf: 68, review: true },
  { src: "1200 Bank Commerzbank", dst: "1010 · Cash — operating", conf: 99 },
  { src: "1400 Forderungen aus L+L", dst: "1200 · Trade receivables", conf: 99 },
  { src: "3300 Verbindlichkeiten aus L+L", dst: "2000 · Trade payables", conf: 98 },
  { src: "6000 Löhne und Gehälter", dst: "6100 · Salaries & wages", conf: 97 },
];

const CONSOLIDATION = [
  ["FX translation", "EUR → USD at 1.0842 · closing & average"],
  ["Intercompany eliminations", "214 transactions matched · $0 unexplained"],
  ["Purchase price allocation", "Goodwill $41.2M · intangibles $18.6M"],
  ["Group statements", "P&L, balance sheet, cash flow · 15 entities"],
];

function EntitiesScreen({ integrated, hover, pressed }: { integrated: boolean; hover: boolean; pressed: boolean }) {
  const kpis: Kpi[] = [
    { label: "Entities live", value: integrated ? 15 : 14, format: fmt.int, delta: integrated ? "+1 · Atlas Components" : "1 pending integration", status: integrated ? "recovering" : "attention", spark: [3, 3, 4, 4, 5, 5, 6], tone: integrated ? "success" : "gold", flash: integrated },
    { label: "Group revenue · LTM", value: integrated ? 1.51 : 1.42, format: fmt.moneyB, delta: integrated ? "+$94M from Atlas" : "+6.4% vs budget", status: "ahead", spark: [3, 4, 4, 5, 5, 6, 7], tone: "data" },
    { label: "Close cycle", value: 4, format: (n) => `${n.toFixed(1)} days`, delta: "−6.5 days vs FY24", status: "ahead", spark: [7, 6, 6, 5, 4, 4, 3], tone: "data" },
    { label: "Intercompany matched", value: integrated ? 99.6 : 99.2, format: fmt.pct1, delta: "auto-reconciled", status: "track", spark: [5, 5, 6, 6, 6, 7, 7], tone: "data" },
  ];
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid grid-cols-4 gap-3">
        {kpis.map((k) => (
          <KpiCard key={k.label} k={k} />
        ))}
      </div>
      <Card
        className={`relative flex items-center justify-between overflow-hidden p-4 transition-colors duration-700 ${
          integrated ? "border-[oklch(0.78_0.13_168/45%)] bg-[oklch(0.78_0.13_168/6%)]" : "border-gl-gold/40 bg-gl-gold/[0.06]"
        }`}
      >
        <div className="flex items-center gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gl-foreground/[0.06] font-gl-display text-[0.9rem] font-semibold text-gl-foreground">AC</span>
          <div>
            <p className={`font-gl-mono text-[0.56rem] uppercase tracking-[0.16em] ${integrated ? "text-[var(--success)]" : "text-gl-gold"}`}>
              {integrated ? "Integrated · day 3 after close" : "Deal closed yesterday · ready to integrate"}
            </p>
            <p className="mt-1 font-gl-display text-[1rem] tracking-tight text-gl-foreground">Atlas Components GmbH · Stuttgart</p>
            <p className="text-[0.62rem] text-gl-muted-foreground">€210M revenue · 412 employees · SAP ECC 6.0 · German GAAP (HGB)</p>
          </div>
        </div>
        {integrated ? (
          <span className="demo-pop flex items-center gap-2 text-[0.7rem] text-[var(--success)]">
            <Check className="h-4 w-4" /> Live in group reporting
          </span>
        ) : (
          <DemoButton id="integrate" hover={hover} pressed={pressed} className="px-4 py-2 text-[0.72rem]">
            Integrate Atlas →
          </DemoButton>
        )}
      </Card>
      <Card className="min-h-0 flex-1 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[0.72rem] text-gl-foreground">Group structure</p>
          <span className="font-gl-mono text-[0.56rem] text-gl-muted-foreground/60">{integrated ? 15 : 14} entities · 9 systems · 6 currencies</span>
        </div>
        <div className="grid grid-cols-5 gap-2.5">
          {ENTITIES.map(([n, c, sys]) => (
            <div key={n} className="rounded-lg border border-gl-border/60 bg-gl-background/40 px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="font-gl-mono text-[0.54rem] text-gl-muted-foreground">{c}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              </div>
              <p className="mt-1 truncate text-[0.66rem] text-gl-foreground">{n}</p>
              <p className="font-gl-mono text-[0.52rem] text-gl-muted-foreground/70">{sys}</p>
            </div>
          ))}
          <div
            className={`rounded-lg border px-3 py-2.5 transition-all duration-700 ${
              integrated
                ? "demo-pop border-[oklch(0.78_0.13_168/55%)] bg-[oklch(0.78_0.13_168/8%)] shadow-[0_0_30px_-8px_oklch(0.78_0.13_168/50%)]"
                : "border-dashed border-gl-border/80"
            }`}
          >
            {integrated ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-gl-mono text-[0.54rem] text-gl-muted-foreground">DE</span>
                  <span className="rounded bg-[oklch(0.78_0.13_168/16%)] px-1 font-gl-mono text-[0.48rem] text-[var(--success)]">NEW</span>
                </div>
                <p className="mt-1 truncate text-[0.66rem] text-gl-foreground">Atlas Components</p>
                <p className="font-gl-mono text-[0.52rem] text-gl-muted-foreground/70">SAP ECC</p>
              </>
            ) : (
              <p className="grid h-full place-items-center text-[0.6rem] text-gl-muted-foreground/60">+ Atlas Components</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function IntegrationScreen({
  connected,
  mapping,
  mappedAll,
  accepted,
  acceptHover,
  acceptPressed,
  showRun,
  runHover,
  runPressed,
  running,
  steps,
  viewHover,
  viewPressed,
  loopKey,
}: {
  connected: number;
  mapping: boolean;
  mappedAll: boolean;
  accepted: boolean;
  acceptHover: boolean;
  acceptPressed: boolean;
  showRun: boolean;
  runHover: boolean;
  runPressed: boolean;
  running: boolean;
  steps: number;
  viewHover: boolean;
  viewPressed: boolean;
  loopKey: number;
}) {
  const stage = steps >= 4 ? 4 : running ? 3 : mapping ? 2 : 1;
  const mapped = accepted ? 1240 : mappedAll ? 1212 : mapping ? 640 : 0;
  return (
    <div className="flex h-full flex-col gap-3">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-gl-mono text-[0.56rem] uppercase tracking-[0.14em] text-gl-muted-foreground/70">Integration INT-0042 · day 3 after close</span>
            <p className="mt-1 font-gl-display text-[1.02rem] tracking-tight text-gl-foreground">Integrating Atlas Components GmbH</p>
          </div>
          <ol className="flex items-center gap-2">
            {["Connect", "Map", "Consolidate", "Live"].map((t, i) => {
              const done = i + 1 < stage || (i === 3 && steps >= 4);
              const on = i + 1 === stage && !done;
              return (
                <li key={t} className="flex items-center gap-2">
                  <span
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6rem] transition-all duration-500 ${
                      done
                        ? "border-[oklch(0.78_0.13_168/45%)] text-[var(--success)]"
                        : on
                          ? "border-gl-data/60 bg-gl-data/10 text-gl-foreground"
                          : "border-gl-border text-gl-muted-foreground/60"
                    }`}
                  >
                    {done ? <Check className="h-3 w-3" /> : on ? <Spinner className="h-2 w-2 text-gl-data" /> : <span className="font-gl-mono text-[0.52rem]">{i + 1}</span>}
                    {t}
                  </span>
                  {i < 3 ? <span className="h-px w-4 bg-gl-border" /> : null}
                </li>
              );
            })}
          </ol>
        </div>
      </Card>

      <div className="grid min-h-0 flex-1 grid-cols-[330px_1fr] gap-3">
        <Card className="flex flex-col p-4">
          <p className="mb-2 text-[0.72rem] text-gl-foreground">Systems connected</p>
          <div className="space-y-1">
            {CONNECTIONS.map((c, i) => {
              const state = i < connected ? "done" : i === connected ? "running" : "queued";
              return (
                <div key={c.code} className={`flex items-center gap-3 py-2 transition-opacity duration-500 ${state === "queued" ? "opacity-45" : ""}`}>
                  <SystemChip code={c.code} tone={state === "done" ? "success" : state === "running" ? "data" : "muted"} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.68rem] text-gl-foreground">{c.name}</p>
                    <p className="truncate font-gl-mono text-[0.54rem] text-gl-muted-foreground/70">{c.detail}</p>
                  </div>
                  <span className="text-right font-gl-mono text-[0.56rem]">
                    {state === "done" ? (
                      <span className="text-[var(--success)]">{c.records >= 1 ? `${c.records.toFixed(1)}M` : `${Math.round(c.records * 1000)}k`}</span>
                    ) : state === "running" ? (
                      <Spinner className="h-2.5 w-2.5 text-gl-data" />
                    ) : (
                      <span className="text-gl-muted-foreground/60">—</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 rounded-lg border border-gl-border/60 bg-gl-background/40 p-3">
            <Label>Records ingested</Label>
            <p className="mt-1 font-gl-display text-[1.3rem] tabular-nums tracking-tight text-gl-foreground">
              <Tween value={[0, 2.41, 2.47, 2.65, 2.99][connected]!} format={(n) => `${n.toFixed(2)}M`} duration={600} />
            </p>
            <p className="text-[0.58rem] text-gl-muted-foreground">7 years of history · read-only · no migration</p>
          </div>

          <div className={`mt-auto space-y-1.5 transition-all duration-500 ${showRun ? "opacity-100" : "translate-y-2 opacity-0"}`}>
            {running || steps > 0 ? (
              CONSOLIDATION.map(([t, d], i) => (
                <div key={t} className={`flex items-start gap-2 transition-opacity duration-500 ${i <= steps ? "opacity-100" : "opacity-40"}`}>
                  <span className="mt-0.5">
                    {i < steps ? <Check className="h-3 w-3 text-[var(--success)]" /> : i === steps ? <Spinner className="h-2.5 w-2.5 text-gl-data" /> : <span className="block h-3 w-3" />}
                  </span>
                  <div>
                    <p className="text-[0.64rem] text-gl-foreground">{t}</p>
                    <p className="font-gl-mono text-[0.52rem] text-gl-muted-foreground/70">{d}</p>
                  </div>
                </div>
              ))
            ) : (
              <DemoButton id="run-consolidation" tone="data" hover={runHover} pressed={runPressed} className="w-full py-2">
                Run first consolidation
              </DemoButton>
            )}
          </div>
        </Card>

        <Card className="flex min-h-0 flex-col p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.72rem] text-gl-foreground">Chart of accounts mapping</p>
              <p className="text-[0.58rem] text-gl-muted-foreground/65">Atlas HGB chart → Meridian group chart</p>
            </div>
            <div className="text-right">
              <p className="font-gl-display text-[1.1rem] tabular-nums tracking-tight text-gl-foreground">
                <Tween value={mapped} format={fmt.int} duration={mapping && !mappedAll ? 2400 : 700} />
                <span className="text-[0.75rem] text-gl-muted-foreground"> / 1,240</span>
              </p>
              <p className="font-gl-mono text-[0.54rem] text-gl-muted-foreground">{accepted ? "100% mapped · reviewed" : mappedAll ? "97.7% automatic" : "mapping…"}</p>
            </div>
          </div>

          <div className={`mt-3 flex items-start gap-2.5 rounded-lg border border-gl-border/60 bg-gl-background/40 p-2.5 transition-opacity duration-500 ${mapping ? "opacity-100" : "opacity-0"}`}>
            <AgentOrb state={accepted ? "done" : mappedAll ? "waiting" : "writing"} size={24} />
            <p className="text-[0.66rem] leading-relaxed text-gl-foreground/90">
              <Typewriter
                key={loopKey}
                text="Mapped 1,212 of 1,240 accounts using patterns from 41 prior integrations. 28 need a judgement call — my suggestions are highlighted."
                play={mapping && !mappedAll}
                done={mappedAll}
                cps={58}
              />
            </p>
          </div>

          <div className="mt-3 grid grid-cols-[1fr_1fr_86px] border-b border-gl-border/70 pb-1.5 text-[0.54rem] uppercase tracking-[0.1em] text-gl-muted-foreground/60">
            <span>Atlas account (HGB)</span>
            <span>Group account</span>
            <span className="text-right">Confidence</span>
          </div>
          <div>
            {ROWS.map((r, i) => {
              const show = mapping && (mappedAll || i < 3 || i > 6);
              const flagged = r.review && mappedAll && !accepted;
              return (
                <div
                  key={r.src}
                  className={`grid grid-cols-[1fr_1fr_86px] items-center border-b border-gl-border/40 py-[8px] text-[0.64rem] transition-all duration-500 ${show ? "opacity-100" : "opacity-0"} ${
                    flagged ? "bg-gl-gold/[0.07]" : accepted && r.review ? "bg-[oklch(0.78_0.13_168/6%)]" : ""
                  }`}
                  style={{ transitionDelay: show ? `${i * 70}ms` : "0ms" }}
                >
                  <span className="truncate pr-3 font-gl-mono text-[0.6rem] text-gl-muted-foreground">{r.src}</span>
                  <span className="truncate pr-3 text-gl-foreground">
                    {flagged ? <span className="mr-1.5 rounded bg-gl-gold/15 px-1 text-[0.52rem] text-gl-gold">SUGGESTED</span> : null}
                    {r.dst}
                  </span>
                  <span className="flex items-center justify-end gap-1.5">
                    <span className="h-1 w-10 overflow-hidden rounded-full bg-gl-foreground/10">
                      <span
                        className={`block h-full rounded-full ${accepted && r.review ? "bg-[var(--success)]" : r.conf > 90 ? "bg-gl-data" : "bg-gl-gold"}`}
                        style={{ width: `${accepted && r.review ? 100 : r.conf}%` }}
                      />
                    </span>
                    <span className="w-7 text-right font-gl-mono text-[0.56rem] text-gl-muted-foreground">{accepted && r.review ? "✓" : `${r.conf}%`}</span>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="text-[0.6rem] text-gl-muted-foreground">
              {accepted ? "Mapping locked · reviewer Elena Costa · versioned" : "28 accounts to review · 3 shown"}
            </span>
            {steps >= 4 ? (
              <DemoButton id="open-group" tone="data" hover={viewHover} pressed={viewPressed}>
                Open group view →
              </DemoButton>
            ) : accepted ? (
              <DemoButton id="accept" tone="success">
                <Check className="h-3 w-3" /> 28 suggestions accepted
              </DemoButton>
            ) : (
              <DemoButton id="accept" hover={acceptHover} pressed={acceptPressed} className={mappedAll ? "" : "opacity-40"}>
                Accept all 28 suggestions
              </DemoButton>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function IntegrationDemo({ onChapter }: { onChapter?: (c: IntegrationChapter) => void }) {
  const { ref, scene: s } = useScene(INTEGRATION_CUES, INTEGRATION_LOOP, "mapped");
  const stageRef = useRef<HTMLDivElement>(null);
  const page: "entities" | "int" = s.between("toInt", "back") ? "int" : "entities";
  const integrated = s.past("back");

  const chapter: IntegrationChapter = !s.past("press")
    ? "close"
    : !s.past("map")
      ? "connect"
      : !s.past("toRun")
        ? "map"
        : !s.past("back")
          ? "consolidate"
          : "report";
  useEffect(() => onChapter?.(chapter), [chapter, onChapter]);

  const connected = s.past("c4") ? 4 : s.past("c3") ? 3 : s.past("c2") ? 2 : s.past("c1") ? 1 : 0;
  const steps = s.past("k4") ? 4 : s.past("k3") ? 3 : s.past("k2") ? 2 : s.past("k1") ? 1 : 0;

  const off = { x: STAGE_W + 60, y: STAGE_H - 40 };
  let target: CursorTarget = off;
  let pointer = false;
  if (s.between("enter", "toInt")) {
    target = "integrate";
    pointer = true;
  } else if (s.between("toInt", "toAccept")) target = { x: 860, y: 420 };
  else if (s.between("toAccept", "toRun")) {
    target = "accept";
    pointer = true;
  } else if (s.between("toRun", "run")) {
    target = "run-consolidation";
    pointer = true;
  } else if (s.between("run", "toView")) target = { x: 640, y: 560 };
  else if (s.between("toView", "back")) {
    target = "open-group";
    pointer = true;
  } else if (s.between("back", "exit")) target = { x: 1000, y: 640 };
  if (s.index < 0 || !s.past("enter")) target = off;

  const pressed = s.between("press", "toInt") || s.between("pressAccept", "accepted") || s.between("pressRun", "run") || s.between("pressView", "back");

  return (
    <div ref={ref}>
      <ScaledStage width={STAGE_W} height={STAGE_H}>
        <div ref={stageRef} className="relative h-full w-full">
          <DemoFrame
            active="entities"
            title={page === "int" ? "Integration · Atlas Components" : "Entities"}
            subtitle={page === "int" ? "Connectors · chart of accounts consolidator · orchestrated by Genius Agent" : `Meridian Holdings · ${integrated ? 15 : 14} entities · group structure`}
          >
            <Screen show={page === "entities"}>
              <EntitiesScreen key={s.loop} integrated={integrated} hover={s.past("enter")} pressed={s.between("press", "toInt")} />
            </Screen>
            <Screen show={page === "int"}>
              <IntegrationScreen
                key={s.loop}
                loopKey={s.loop}
                connected={connected}
                mapping={s.past("map")}
                mappedAll={s.past("mapped")}
                accepted={s.past("accepted")}
                acceptHover={s.past("toAccept")}
                acceptPressed={s.between("pressAccept", "accepted")}
                showRun={s.past("showRun")}
                runHover={s.past("toRun")}
                runPressed={s.between("pressRun", "run")}
                running={s.past("run")}
                steps={steps}
                viewHover={s.past("toView")}
                viewPressed={s.between("pressView", "back")}
              />
            </Screen>
            <Toast
              className="bottom-7 right-7"
              show={s.between("toast", "exit")}
              title="Atlas consolidated in 3 days"
              body="1,240 accounts mapped · 214 intercompany eliminations · group reporting live"
            />
          </DemoFrame>
          <Cursor rootRef={stageRef} target={target} pointer={pointer} pressed={pressed} />
        </div>
      </ScaledStage>
    </div>
  );
}
