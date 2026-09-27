"use client";

import { useEffect, useRef, useState } from "react";
import { SCRIPTS } from "./data";
import { useInView, useReduced } from "./hooks";
import { Dot, Pane, SECTION, SectionHead, Tag, WRAP } from "./ui";

type Phase = "typing" | "reading" | "answering" | "done";

const SPIN = ["|", "/", "-", "\\"];

export function Agents() {
  const reduce = useReduced();
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { once: false, threshold: 0.25 });
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [typed, setTyped] = useState(0);
  const [read, setRead] = useState(0);
  const [words, setWords] = useState(0);
  const [spin, setSpin] = useState(0);
  const [pinned, setPinned] = useState(false);

  const S = SCRIPTS[turn];
  const answer = S.a.split(" ");

  useEffect(() => {
    if (!inView || reduce) return;
    let id: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (typed < S.q.length) id = setTimeout(() => setTyped((n) => n + 1), 22);
      else id = setTimeout(() => setPhase("reading"), 380);
    } else if (phase === "reading") {
      if (read < S.reads.length) id = setTimeout(() => setRead((n) => n + 1), 820);
      else id = setTimeout(() => setPhase("answering"), 300);
    } else if (phase === "answering") {
      if (words < answer.length) id = setTimeout(() => setWords((n) => n + 1), 45);
      else id = setTimeout(() => setPhase("done"), 200);
    } else if (!pinned) {
      id = setTimeout(() => {
        setTurn((t) => (t + 1) % SCRIPTS.length);
        setTyped(0);
        setRead(0);
        setWords(0);
        setPhase("typing");
      }, 7000);
    }
    return () => clearTimeout(id!);
  }, [inView, reduce, phase, typed, read, words, answer.length, S, pinned]);

  useEffect(() => {
    if (reduce || phase !== "reading") return;
    const id = setInterval(() => setSpin((s) => (s + 1) % SPIN.length), 110);
    return () => clearInterval(id);
  }, [phase, reduce]);

  const choose = (i: number) => {
    setPinned(true);
    setTurn(i);
    setTyped(0);
    setRead(0);
    setWords(0);
    setPhase("typing");
  };

  const full = reduce;
  const q = full ? S.q : S.q.slice(0, typed);
  const readsDone = full ? S.reads.length : phase === "typing" ? 0 : phase === "reading" ? read : S.reads.length;
  const shownWords = full ? answer.length : phase === "answering" ? words : phase === "done" ? answer.length : 0;
  const state = full ? "idle" : phase === "reading" ? "reading" : phase === "answering" ? "answering" : phase === "typing" ? "listening" : "idle";

  return (
    <section ref={root} id="agents" tabIndex={-1} className={SECTION} aria-labelledby="v11-agents-title">
      <div className={WRAP}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <SectionHead index="04" cmd="genius agents --attach finance" id="v11-agents-title" title="AI Agents that know your business." className="lg:col-span-7" />
          <p data-boot="" className="max-w-[56ch] text-pretty text-[15.5px] leading-[1.75] text-(--fg-2) lg:col-span-5">
            Built on the Second Brain, Genius agents answer executive questions end to end, reading the systems, tables and metrics behind
            every number.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <Pane
            title="agent@finance — session"
            meta={<Tag>illustrative conversation</Tag>}
            className="min-w-0 lg:col-span-8"
            bodyClass="v11-term min-h-[23rem] px-4 py-5 text-[13px] leading-[1.75] sm:px-6 sm:text-[13.5px]"
          >
            <div aria-live="polite" aria-busy={!full && phase !== "done"}>
              <p className="whitespace-pre-wrap break-words">
                <span className="text-(--ice)">cfo</span>
                <span className="text-(--amber)"> &gt; </span>
                <span className="text-(--fg)">{q}</span>
                {!full && phase === "typing" && <span className="v11-cursor" aria-hidden="true" />}
              </p>
              <ol className="mt-3 space-y-0.5" aria-label="What the agent reads">
                {S.reads.map((r, i) => {
                  const done = i < readsDone;
                  const now = !full && phase === "reading" && i === read;
                  if (!done && !now) return null;
                  return (
                    <li key={r} className="grid grid-cols-[1.6rem_1fr_auto] gap-x-2">
                      <span className={done ? "text-(--ice)" : "text-(--amber)"} aria-hidden="true">
                        {done ? "ok" : SPIN[spin]}
                      </span>
                      <span className={done ? "text-(--fg-2)" : "text-(--amber)"}>reading {r}</span>
                    </li>
                  );
                })}
              </ol>
              {shownWords > 0 && (
                <div className="mt-4 border-l-2 border-(--amber-2) pl-4">
                  <p className="text-[12px] text-(--fg-3)">agent</p>
                  <p className="mt-1 max-w-[70ch] text-pretty text-(--fg)">
                    {answer.slice(0, shownWords).join(" ")}
                    {!full && phase === "answering" && <span className="v11-cursor" aria-hidden="true" />}
                  </p>
                  {(full || phase === "done") && (
                    <p className="mt-3 text-[12px] text-(--fg-3)">
                      sources: {S.reads.join(" · ")} <span className="text-(--fg-3)">&middot; figures illustrative</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </Pane>

          <div className="grid gap-4 lg:col-span-4">
            <Pane title="agent.status" bodyClass="v11-term p-4 text-[13px] sm:p-5">
              <ul className="space-y-2" aria-label="Agent state">
                {(["listening", "reading", "answering", "idle"] as const).map((s) => (
                  <li key={s} aria-current={state === s ? "step" : undefined} className={`flex items-center gap-3 ${state === s ? "text-(--fg)" : "text-(--fg-3)"}`}>
                    <Dot tone={state === s ? (s === "reading" ? "ice" : "amber") : "dim"} pulse={state === s && s !== "idle"} />
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-(--rule) pt-4 text-[12px] leading-[1.7] text-(--fg-3)">
                Every answer shows what the agent read to reach it: the systems, tables and metrics behind the number.
              </p>
            </Pane>
            <Pane title="questions" bodyClass="v11-term p-2 text-[13px]">
              <ul>
                {SCRIPTS.map((s, i) => (
                  <li key={s.q}>
                    <button
                      type="button"
                      aria-pressed={turn === i}
                      onClick={() => choose(i)}
                      className={`w-full px-3 py-2.5 text-left leading-[1.55] transition-colors ${
                        turn === i ? "bg-(--amber-soft) text-(--fg)" : "text-(--fg-2) hover:bg-(--bg-3) hover:text-(--fg)"
                      }`}
                    >
                      <span className="text-(--amber)" aria-hidden="true">
                        {i + 1}.{" "}
                      </span>
                      {s.q}
                    </button>
                  </li>
                ))}
              </ul>
            </Pane>
          </div>
        </div>
      </div>
    </section>
  );
}
