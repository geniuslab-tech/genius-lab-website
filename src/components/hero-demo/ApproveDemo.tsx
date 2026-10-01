"use client";

import { useEffect, useMemo, useRef } from "react";
import { Cursor, ScaledStage, fmt, useScene, type CursorTarget } from "./engine";
import { DemoFrame, STAGE_H, STAGE_W, Screen, Toast } from "./frame";
import {
  AgentBriefing,
  ExecutionScreen,
  ImpactCard,
  PerformanceScreen,
  type AgentPhase,
  type ExecStep,
  type Kpi,
  type Segment,
} from "./screens";

/*
 * Storyboard — "From signal to executed decision in 38 seconds"
 *  1. Signal      Performance is open. KPIs count up, the chart draws, the user inspects August.
 *  2. Recommend   Genius Agent analyses the business and writes why free cash flow is behind budget.
 *  3. Approve     It proposes releasing $1.4M of slow inventory. The user clicks Approve.
 *  4. Execute     The decision runs across ERP, WMS, CRM, treasury and the board pack, step by step.
 *  5. Impact      Back in Performance, free cash flow is back on plan. Fully audited.
 */
export const APPROVE_CUES = {
  start: 0,
  enter: 500,
  hover: 1900,
  think: 3300,
  write: 4500,
  proposal: 9000,
  toApprove: 9900,
  press: 11000,
  approved: 11250,
  toExec: 12400,
  s1: 13100,
  s2: 14100,
  s3: 15100,
  s4: 16100,
  s5: 17100,
  impact: 17500,
  toCta: 18800,
  ctaPress: 19800,
  back: 20050,
  toast: 21800,
  exit: 24600,
} as const;
export const APPROVE_LOOP = 26500;

export type Chapter = "signal" | "recommend" | "approve" | "execute" | "impact";

/** Where each chapter starts and ends inside the loop, in ms. */
export const CHAPTER_SPANS: Record<Chapter, [number, number]> = {
  signal: [APPROVE_CUES.start, APPROVE_CUES.think],
  recommend: [APPROVE_CUES.think, APPROVE_CUES.toApprove],
  approve: [APPROVE_CUES.toApprove, APPROVE_CUES.toExec],
  execute: [APPROVE_CUES.toExec, APPROVE_CUES.toCta],
  impact: [APPROVE_CUES.toCta, APPROVE_LOOP],
};

export const CHAPTERS: { key: Chapter; title: string; body: string }[] = [
  { key: "signal", title: "Signal", body: "Free cash flow drifts $4.2M behind budget." },
  { key: "recommend", title: "Recommendation", body: "Genius traces it to slow Southeast inventory." },
  { key: "approve", title: "Approval", body: "One click, within your delegated authority." },
  { key: "execute", title: "Execution", body: "Five systems updated in 38 seconds." },
  { key: "impact", title: "Impact", body: "Cash back on plan. Every step audited." },
];

const MESSAGE: Segment[] = [
  { t: "Free cash flow is " },
  { t: "$4.2M behind budget", tone: "gold" },
  { t: ". The gap traces to " },
  { t: "Southeast inventory, up 18%", tone: "strong" },
  { t: " while regional demand softened 9%. Releasing " },
  { t: "$1.4M of slow-moving stock", tone: "data" },
  { t: " to EMEA distributors closes a third of the gap this quarter, with no service risk." },
];

const STEPS: ExecStep[] = [
  { code: "ERP", system: "ERP", title: "Transfer order created", detail: "TO-48211 · 1,920 pallets · Atlanta DC → Rotterdam", time: "4s", log: "erp.transfer_order.create TO-48211" },
  { code: "WMS", system: "Warehouse", title: "Pick waves scheduled", detail: "3 sites · 41 waves · ship by Thu 18:00", time: "9s", log: "wms.waves.schedule sites=3 waves=41" },
  { code: "CRM", system: "CRM", title: "Distributor offers published", detail: "12 EMEA accounts · price list PL-EMEA-Q3", time: "17s", log: "crm.offers.publish accounts=12" },
  { code: "TRS", system: "Treasury", title: "Cash forecast updated", detail: "Q3 FCF +$1.4M · covenant headroom 2.1x", time: "26s", log: "treasury.forecast.update fcf=+1.4M" },
  { code: "BRD", system: "Board pack", title: "Board note drafted", detail: "Q3 board pack · section 4 · cash", time: "38s", log: "board.pack.note.draft section=4" },
];

const kpiBase = (fcfFixed: boolean, flash: boolean): Kpi[] => [
  { label: "Revenue", value: 1.42, format: fmt.moneyB, delta: "+6.4% vs budget", status: "ahead", spark: [3, 4, 4, 5, 5, 6, 7], tone: "data" },
  { label: "EBITDA", value: 284, format: fmt.money0, delta: "+1.2pp vs budget", status: "ahead", spark: [4, 4, 5, 5, 6, 6, 7], tone: "data" },
  { label: "Gross margin", value: 38.6, format: fmt.pct1, delta: "+0.8pp vs budget", status: "track", spark: [5, 5, 5, 6, 6, 6, 7], tone: "data" },
  fcfFixed
    ? { id: "kpi-fcf", label: "Free cash flow", value: 97.8, format: fmt.money1, delta: "−$2.8M vs budget", status: "recovering", spark: [7, 6, 5, 5, 4, 5, 7], tone: "success", flash }
    : { id: "kpi-fcf", label: "Free cash flow", value: 96.4, format: fmt.money1, delta: "−$4.2M vs budget", status: "attention", spark: [7, 6, 6, 5, 5, 4, 4], tone: "gold" },
];

export function ApproveDemo({
  cinematic = false,
  onChapter,
}: {
  /** Adds camera moves that push in on the action, like a product film. */
  cinematic?: boolean;
  onChapter?: (c: Chapter, loop: number) => void;
}) {
  const { ref, scene: s } = useScene(APPROVE_CUES, APPROVE_LOOP, "proposal");
  const stageRef = useRef<HTMLDivElement>(null);

  const page: "perf" | "exec" = s.between("toExec", "back") ? "exec" : "perf";
  const fcfFixed = s.past("back");

  const phase: AgentPhase = !s.past("think")
    ? "idle"
    : !s.past("write")
      ? "thinking"
      : !s.past("proposal")
        ? "writing"
        : !s.past("approved")
          ? "waiting"
          : !s.past("s5")
            ? "approved"
            : "done";

  const done = s.past("s5") ? 5 : s.past("s4") ? 4 : s.past("s3") ? 3 : s.past("s2") ? 2 : s.past("s1") ? 1 : 0;

  const chapter: Chapter = !s.past("think")
    ? "signal"
    : !s.past("toApprove")
      ? "recommend"
      : !s.past("toExec")
        ? "approve"
        : !s.past("toCta")
          ? "execute"
          : "impact";

  useEffect(() => {
    onChapter?.(chapter, s.loop);
  }, [chapter, s.loop, onChapter]);

  let target: CursorTarget = { x: STAGE_W + 60, y: STAGE_H - 40 };
  let pointer = false;
  let anchor: [number, number] = [0.5, 0.55];
  if (s.between("enter", "think")) target = "chart-point";
  else if (s.between("think", "toApprove")) {
    target = "briefing";
    anchor = [0.42, 0.4];
  } else if (s.between("toApprove", "toExec")) {
    target = "approve";
    pointer = true;
  } else if (s.between("toExec", "toCta")) target = { x: 720, y: 360 };
  else if (s.between("toCta", "back")) {
    target = "view-impact";
    pointer = true;
  } else if (s.between("back", "exit")) target = "kpi-fcf";
  if (s.index < 0 || !s.past("enter")) target = { x: STAGE_W + 60, y: STAGE_H - 40 };

  const pressed = s.between("press", "approved") || s.between("ctaPress", "back");

  const kpis = useMemo(() => kpiBase(fcfFixed, s.between("back", "exit")), [fcfFixed, s]);

  // Camera: push in where the story is happening.
  let cam = { scale: 1, ox: 50, oy: 50 };
  if (cinematic) {
    if (s.between("hover", "think")) cam = { scale: 1.14, ox: 42, oy: 46 };
    else if (s.between("think", "toExec")) cam = { scale: 1.3, ox: 96, oy: 72 };
    else if (s.between("toExec", "impact")) cam = { scale: 1.1, ox: 64, oy: 58 };
    else if (s.between("impact", "back")) cam = { scale: 1.2, ox: 98, oy: 62 };
    else if (s.between("back", "toast")) cam = { scale: 1.18, ox: 100, oy: 4 };
  }

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
            <DemoFrame
              active={page === "exec" ? "decisions" : "performance"}
              title={page === "exec" ? "Decision in progress" : "Executive Operating System"}
              subtitle={page === "exec" ? "Decisions · D-2318 · orchestrated by Genius Agent" : "Meridian Holdings · FY26 Q3 · 14 entities live"}
              badges={{ decisions: s.past("approved") && !s.past("back") ? "1" : fcfFixed ? "2" : "3" }}
            >
              <Screen show={page === "perf"}>
                <PerformanceScreen
                  key={s.loop}
                  kpis={kpis}
                  countUp
                  draw={s.past("enter") || s.index < 0}
                  hover={s.between("hover", "think")}
                  highlightRow={s.between("proposal", "toExec") ? 1 : undefined}
                  side={
                    <AgentBriefing
                      loopKey={s.loop}
                      phase={fcfFixed ? "done" : phase}
                      context="Morning summary — revenue is 6.4% ahead of budget and EBITDA up 1.2pp, carried by North and EMEA."
                      insightLabel="New insight · Cash"
                      message={MESSAGE}
                      evidence={["ERP inventory · 14 entities", "Demand forecast −9%", "Distributor capacity 31%"]}
                      proposal={{
                        title: "Release $1.4M of Southeast inventory to EMEA",
                        policy: "Policy INV-02 · ≤ $2M",
                        metrics: [
                          { label: "Cash impact", value: "+$1.4M", tone: "success" },
                          { label: "Confidence", value: "94%", tone: "data" },
                          { label: "Reversible", value: "72h" },
                        ],
                      }}
                      approveHover={s.between("toApprove", "approved") && s.past("toApprove")}
                      approvePressed={s.between("press", "approved")}
                    />
                  }
                />
              </Screen>
              <Screen show={page === "exec"}>
                <ExecutionScreen
                  key={s.loop}
                  decisionId="D-2318"
                  decisionTitle="Release $1.4M of Southeast inventory to EMEA"
                  steps={STEPS}
                  done={done}
                  elapsed={s.past("s5") ? 38 : s.past("s4") ? 26 : s.past("s3") ? 17 : s.past("s2") ? 9 : s.past("s1") ? 4 : 0}
                  ctaHover={s.past("toCta")}
                  ctaPressed={s.between("ctaPress", "back")}
                  impact={
                    <ImpactCard
                      label="Free cash flow vs budget"
                      before={-4.2}
                      after={-2.8}
                      showAfter={s.past("s4")}
                      format={fmt.signedMoney1}
                      scaleMax={5}
                      note={s.past("s4") ? "$1.4M released · inventory days 61 → 54" : "Waiting on treasury forecast…"}
                    />
                  }
                />
              </Screen>
              <Toast
                className="bottom-7 left-7"
                show={s.between("toast", "exit")}
                title="Decision executed in 38 seconds"
                body="5 systems updated · free cash flow back on plan · audit #A-90412"
              />
            </DemoFrame>
            <Cursor rootRef={stageRef} target={target} pointer={pointer} pressed={pressed} anchor={anchor} />
          </div>
        </div>
      </ScaledStage>
    </div>
  );
}
