"use client";

import { useRef, useState } from "react";
import { Cursor, ScaledStage, type CursorTarget } from "@/components/hero-demo/engine";
import type { AskState } from "@/components/brief/Dashboard";
import { useTyped } from "@/components/brief/ScriptedBrief";
import { segText } from "@/components/hero-demo/screens";
import "./auto.css";
import { useLoopClock, type Clock } from "./clock";
import { BRIEF, CUES, H, LOOP, QUESTION, STEPS, W } from "./data";
import { DataManager, Flows, GoldNode } from "./DataManager";
import { ExecWindow } from "./ExecWindow";
import { EntityCards, SystemsWall } from "./Systems";

type S = Clock<typeof CUES>;

const STATUS: string[] = [
  "30 systems of record · 6 data models · 0 shared definitions",
  "4 entities · 4 stacks · 4 versions of group revenue",
  "Genius Lab Data Manager · raw → bronze → silver → gold",
  "Executive operating system · generated from gold",
  "Genius · executive brief on demand",
  "Executive agents · human approval · write-back",
];

function stepOf(s: S) {
  let k = 0;
  STEPS.forEach((st, i) => {
    if (s.past(st.cue)) k = i;
  });
  return k;
}

/** Fills over the length of its beat; mounted fresh for every beat and seek. */
function StepBar({ ms, offset, paused }: { ms: number; offset: number; paused: boolean }) {
  const [start] = useState(offset);
  return (
    <span
      className="fa-bar absolute inset-0 rounded-full bg-[linear-gradient(90deg,var(--data),var(--cyan))]"
      style={{ animationDuration: `${ms}ms`, animationDelay: `${-start}ms`, animationPlayState: paused ? "paused" : "running" }}
    />
  );
}

/** The world: every actor of the six beats, in design pixels. */
function World({ s }: { s: S }) {
  const root = useRef<HTMLDivElement>(null);
  const step = stepOf(s);

  const q = useTyped(QUESTION, s.between("type", "toSend"), s.past("toSend"), 34, s.epoch);
  const typed = useTyped(segText(BRIEF), s.between("write", "facts"), s.past("facts"), 70, s.epoch);
  const ask: AskState = {
    text: QUESTION,
    typed: q,
    focused: s.between("pressAsk", "asked"),
    sent: s.past("asked"),
    hoverSend: s.between("toSend", "asked"),
    pressSend: s.between("pressSend", "asked"),
    placeholder: "Ask Genius about free cash flow…",
  };

  const off = { x: W + 60, y: H - 30 };
  let target: CursorTarget = off;
  let pointer = false;
  if (s.between("toKpi", "kpiSel")) [target, pointer] = ["kpi-fcf", true];
  else if (s.between("kpiSel", "toAsk")) target = { x: 720, y: 330 };
  else if (s.between("toAsk", "toSend")) [target, pointer] = ["brief-input", true];
  else if (s.between("toSend", "asked")) [target, pointer] = ["brief-send", true];
  else if (s.between("asked", "toAct")) target = { x: 650, y: 560 };
  else if (s.between("toAct", "s6")) [target, pointer] = ["to-act", true];
  else if (s.between("s6", "toA1")) target = { x: 640, y: 250 };
  else if (s.between("toA1", "toA2")) [target, pointer] = ["approve-0", true];
  else if (s.between("toA2", "toA3")) [target, pointer] = ["approve-1", true];
  else if (s.between("toA3", "writeback")) [target, pointer] = ["approve-2", true];
  else if (s.between("writeback", "exit")) target = { x: 1010, y: 610 };
  const pressed = s.between("pressKpi", "kpiSel") || s.between("pressAsk", "type") || s.between("pressSend", "asked") || s.between("pressAct", "s6") || s.between("pressA1", "ok1") || s.between("pressA2", "ok2") || s.between("pressA3", "ok3");

  return (
    <div className="h-full w-full" style={{ opacity: s.past("exit") ? 0 : 1, transition: "opacity 900ms ease" }}>
    <div ref={root} className="fa-world relative h-full w-full">
      {/* beat status line */}
      <div className="absolute left-0 right-0 top-[30px] flex justify-center transition-opacity duration-500" style={{ opacity: step >= 2 ? 0 : 1 }}>
        <span key={step} className="fa-up flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.03] px-3.5 py-1.5 font-gl-mono text-[10.5px] uppercase tracking-[0.18em] text-gl-muted-foreground backdrop-blur">
          <span className="text-gl-data">{STEPS[step]!.index}</span>
          <span className="h-3 w-px bg-white/15" />
          {STATUS[step]}
        </span>
      </div>

      <Flows s={s} />
      <SystemsWall s={s} />
      <EntityCards s={s} />
      <DataManager s={s} />
      <GoldNode s={s} />
      <ExecWindow s={s} ask={ask} typed={typed} />
      <Cursor rootRef={root} target={target} pointer={pointer} pressed={pressed} />
    </div>
    </div>
  );
}

/**
 * v32 · autoplay. The same six beats as the scroll cinematic above, played on
 * their own like the v39.3 hero: fragmented systems, entities, the Data
 * Manager's medallion layers, dashboards from gold, the brief and the agents.
 */
export function GeniusFlowAuto() {
  const { ref, clock: s, seek, running, paused, togglePause, animated } = useLoopClock(CUES, LOOP, "s3Done");
  const step = stepOf(s);
  const stepStart = CUES[STEPS[step]!.cue];
  const stepEnd = step < STEPS.length - 1 ? CUES[STEPS[step + 1]!.cue] : LOOP;

  const go = (i: number) => {
    const st = STEPS[i]!;
    // land a breath before the beat so its entrance plays
    seek(animated ? Math.max(0, CUES[st.cue] - (i === 0 ? 0 : 120)) : CUES[st.still]);
  };

  return (
    <section id="autoplay" className="relative overflow-hidden border-b border-gl-border py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_60%_50%_at_70%_40%,oklch(0.7_0.17_252/10%),transparent_70%)]" />
      <div className="relative mx-auto w-full max-w-[1520px] px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,350px)_minmax(0,1fr)] xl:gap-16">
          {/* copy + steps */}
          <div>
            <p className="eyebrow mb-4">How it works · Live</p>
            <h2 className="font-gl-display text-3xl leading-[1.12] tracking-tight text-gradient-light sm:text-[2.15rem]">From thirty systems to one governed decision.</h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-gl-muted-foreground">Watch Genius Lab turn a fragmented group into a brief and an approved plan, in about a minute.</p>

            <ol className="mt-10 border-l border-gl-border">
              {STEPS.map((st, i) => {
                const on = i === step;
                const done = i < step;
                return (
                  <li key={st.title} className="relative">
                    <span className="absolute -left-px top-0 h-full w-px origin-top transition-transform duration-700" style={{ background: "var(--data)", transform: `scaleY(${on || done ? 1 : 0})`, opacity: on ? 1 : 0.35 }} />
                    <button
                      type="button"
                      onClick={() => go(i)}
                      className="group block w-full py-3 pl-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gl-data/60"
                      aria-current={on ? "step" : undefined}
                    >
                      <span className="flex items-baseline gap-3">
                        <span className={`font-gl-mono text-[0.65rem] tracking-[0.2em] transition-colors duration-500 ${on ? "text-gl-data" : "text-gl-muted-foreground/60"}`}>{st.index}</span>
                        <span className={`font-gl-display text-[1.05rem] tracking-tight transition-colors duration-500 ${on ? "text-gl-foreground" : "text-gl-muted-foreground group-hover:text-gl-foreground/80"}`}>{st.title}</span>
                      </span>
                      <span className="grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ gridTemplateRows: on ? "1fr" : "0fr", opacity: on ? 1 : 0 }}>
                        <span className="overflow-hidden">
                          <span className="block pt-2 font-gl-display text-[0.95rem] text-gl-gold/90">{st.lede}</span>
                          <span className="block pt-1.5 text-[0.86rem] leading-relaxed text-gl-muted-foreground">{st.body}</span>
                          <span className="relative mt-3 block h-[2px] w-full overflow-hidden rounded-full bg-gl-border">
                            {on && animated ? <StepBar key={`${s.epoch}-${step}`} ms={stepEnd - stepStart} offset={Math.max(0, s.at - stepStart)} paused={!running} /> : null}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* the stage */}
          <div ref={ref} className={`relative min-w-0 ${running ? "" : "fa-paused"}`}>
            <div className="pointer-events-none absolute -inset-10 -z-10 blur-[90px] [background:radial-gradient(ellipse_at_center,oklch(0.7_0.17_252/18%),transparent_70%)]" />
            <div className="relative overflow-hidden rounded-[1.4rem] border border-white/[0.09] bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,oklch(0.22_0.05_258),oklch(0.135_0.03_264)_70%)] shadow-[0_60px_140px_-60px_rgb(0_0_0/0.95),inset_0_1px_0_oklch(1_0_0/6%)]">
              <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(oklch(0.7_0.17_252/7%)_1px,transparent_1px),linear-gradient(90deg,oklch(0.7_0.17_252/7%)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_45%,black,transparent)]" />
              <ScaledStage width={W} height={H}>
                <World key={s.epoch} s={s} />
              </ScaledStage>

              <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                {animated ? (
                  <button
                    type="button"
                    onClick={togglePause}
                    className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-[oklch(0.16_0.03_264/80%)] text-gl-muted-foreground backdrop-blur transition-colors hover:text-gl-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gl-data/60"
                    aria-label={paused ? "Play" : "Pause"}
                  >
                    {paused ? (
                      <svg width="11" height="12" viewBox="0 0 11 12" aria-hidden="true"><path d="M1 1.2v9.6c0 .5.6.8 1 .5l7.6-4.8c.4-.3.4-.8 0-1.1L2 .7C1.6.4 1 .7 1 1.2Z" fill="currentColor" /></svg>
                    ) : (
                      <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true"><rect x="0.5" y="0.5" width="3" height="11" rx="1" fill="currentColor" /><rect x="6.5" y="0.5" width="3" height="11" rx="1" fill="currentColor" /></svg>
                    )}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
