"use client";

import { useEffect, useRef, useState } from "react";

export type Turn = { q: string; reads: string[]; a: string };
export type Phase = "ask" | "read" | "answer" | "hold";

/**
 * Plays an illustrative agent exchange: the question types in, the agent reads its sources,
 * then the answer arrives word by word. With motion reduced, or before it starts, the full
 * exchange is shown at once, so the content never depends on timers running.
 */
export function useScript(turns: Turn[], { live, reduce, auto = true, index }: { live: boolean; reduce: boolean; auto?: boolean; index?: number }) {
  const [turn, setTurn] = useState(index ?? 0);
  const [phase, setPhase] = useState<Phase>("hold");
  const [typed, setTyped] = useState(0);
  const [read, setRead] = useState(0);
  const [words, setWords] = useState(0);
  const [started, setStarted] = useState(false);

  const T = turns[turn % turns.length];
  const answerWords = T.a.split(" ");

  // An external pick restarts the exchange on that turn (not on first render).
  const lastIndex = useRef(index);
  useEffect(() => {
    if (index === undefined || index === lastIndex.current) return;
    lastIndex.current = index;
    const t = setTimeout(() => {
      setTurn(index);
      setTyped(0);
      setRead(0);
      setWords(0);
      setPhase("ask");
      setStarted(true);
    }, 0);
    return () => clearTimeout(t);
  }, [index]);

  // First time it comes into view, begin.
  useEffect(() => {
    if (!live || reduce || started) return;
    const t = setTimeout(() => {
      setStarted(true);
      setTyped(0);
      setRead(0);
      setWords(0);
      setPhase("ask");
    }, 500);
    return () => clearTimeout(t);
  }, [live, reduce, started]);

  useEffect(() => {
    if (!live || reduce || !started) return;
    let id: ReturnType<typeof setTimeout>;
    if (phase === "ask") {
      if (typed < T.q.length) id = setTimeout(() => setTyped((n) => n + 1), 24 + ((typed * 37) % 23));
      else id = setTimeout(() => setPhase("read"), 380);
    } else if (phase === "read") {
      if (read < T.reads.length) id = setTimeout(() => setRead((n) => n + 1), 720);
      else id = setTimeout(() => setPhase("answer"), 320);
    } else if (phase === "answer") {
      if (words < answerWords.length) id = setTimeout(() => setWords((n) => n + 1), 55);
      else id = setTimeout(() => setPhase("hold"), 200);
    } else if (auto) {
      id = setTimeout(() => {
        setTurn((n) => (n + 1) % turns.length);
        setTyped(0);
        setRead(0);
        setWords(0);
        setPhase("ask");
      }, 6400);
    }
    return () => clearTimeout(id);
  }, [live, reduce, started, phase, typed, read, words, T, answerWords.length, auto, turns.length]);

  const still = reduce || !started;
  return {
    turn: turn % turns.length,
    T,
    phase: still ? ("hold" as Phase) : phase,
    question: still ? T.q : T.q.slice(0, typed),
    asked: still || phase !== "ask",
    readDone: still ? T.reads.length : phase === "ask" ? 0 : read,
    answer: still || phase === "hold" ? T.a : phase === "answer" ? answerWords.slice(0, words).join(" ") : "",
    answering: !still && phase === "answer",
  };
}
