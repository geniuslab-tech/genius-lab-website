"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { AgentOrb, type OrbState } from "@/components/v2/AgentOrb";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { Frame, SectionTag, h2v4 } from "./ui";

/** Illustrative conversations with the Genius agent. */
const SCRIPT = [
  {
    q: "Why did our EBITDA margin drop in Q3, and what should we do about it?",
    reads: ["Reading finance.gl_entries", "Comparing Q2 and Q3 cost centres", "Tracing freight and discount drivers"],
    a: "EBITDA margin fell from 18.2% to 15.9%. Two drivers explain most of it: freight costs rose 14% after the July carrier change, and Northeast discounting added $1.1M in promotional spend. Renegotiating freight and capping regional discounts recovers about 1.8 points next quarter.",
  },
  {
    q: "What will our cash position look like over the next 90 days?",
    reads: ["Reading ar.invoices and ap.schedule", "Applying payment behaviour by customer", "Projecting weekly balances"],
    a: "Cash stays above the $4M floor, with a low of $4.6M in week 7 when the annual insurance premium and two supplier payments land together. Collecting the three overdue enterprise invoices early lifts that low point to $5.9M.",
  },
];

type Msg = { who: "you" | "agent"; text: string };
type Phase = "typing" | "sending" | "thinking" | "speaking" | "done";

const STATES: { id: OrbState; label: string }[] = [
  { id: "idle", label: "Idle" },
  { id: "thinking", label: "Thinking" },
  { id: "speaking", label: "Speaking" },
];

const GREETING = "Hi, I’m your Genius agent. Ask me anything about the business, and I’ll show you what I read to answer.";

export function AgentsV4() {
  const reduce = useReducedMotion();
  const compact = useMediaQuery("(max-width: 639px)");
  const root = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [typed, setTyped] = useState(0);
  const [spoken, setSpoken] = useState(0);
  const [read, setRead] = useState(0);
  const [thread, setThread] = useState<Msg[]>([{ who: "agent", text: GREETING }]);
  const threadRef = useRef<HTMLDivElement>(null);

  const S = SCRIPT[turn % SCRIPT.length];
  const words = S.a.split(" ");

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reduce) return;
    let id: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (typed < S.q.length) id = setTimeout(() => setTyped((n) => n + 1), 30 + Math.random() * 36);
      else id = setTimeout(() => setPhase("sending"), 450);
    } else if (phase === "sending") {
      id = setTimeout(() => {
        setThread((t) => [...t.slice(-1), { who: "you", text: S.q }]);
        setTyped(0);
        setRead(0);
        setPhase("thinking");
      }, 250);
    } else if (phase === "thinking") {
      if (read < S.reads.length) id = setTimeout(() => setRead((n) => n + 1), 850);
      else
        id = setTimeout(() => {
          setSpoken(0);
          setPhase("speaking");
        }, 500);
    } else if (phase === "speaking") {
      if (spoken < words.length) id = setTimeout(() => setSpoken((n) => n + 1), 55);
      else
        id = setTimeout(() => {
          setThread((t) => [...t, { who: "agent", text: S.a }]);
          setSpoken(0);
          setPhase("done");
        }, 300);
    } else {
      id = setTimeout(() => {
        setTurn((n) => n + 1);
        setPhase("typing");
      }, 5200);
    }
    return () => clearTimeout(id);
  }, [inView, reduce, phase, typed, read, spoken, S, words.length]);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [thread, spoken, read, reduce]);

  const orbState: OrbState = reduce ? "idle" : phase === "thinking" ? "thinking" : phase === "speaking" ? "speaking" : "idle";
  const shownThread: Msg[] = reduce ? [{ who: "you", text: SCRIPT[0].q }, { who: "agent", text: SCRIPT[0].a }] : thread;
  const inputText = reduce ? "" : phase === "typing" ? S.q.slice(0, typed) : phase === "sending" ? S.q : "";
  // The trace keeps the last completed reads visible after the answer lands.
  const traceDone = reduce || phase === "speaking" || phase === "done" ? S.reads.length : phase === "thinking" ? read : 0;

  return (
    <section ref={root} id="agents" className="relative scroll-mt-16 py-24 sm:py-32" aria-labelledby="v4-agents-title">
      <div className="shell">
        <SectionTag n="04">AI Agents</SectionTag>
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 id="v4-agents-title" data-reveal="up" className={`${h2v4} max-w-[16ch] lg:col-span-7`}>
            AI Agents that know your business.
          </h2>
          <p data-reveal="up" data-delay="100" className="max-w-[50ch] text-lg leading-relaxed text-white/60 lg:col-span-5">
            Built on the Second Brain, Genius agents answer executive questions end to end, reading the systems, tables
            and metrics behind every number.
          </p>
        </div>

        <div className="mt-14 grid gap-3 lg:mt-20 lg:grid-cols-12">
          {/* Agent core and execution trace. */}
          <Frame className="flex flex-col bg-void-2/70 lg:col-span-5">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <span className="v4-label text-[0.6875rem] text-white/50">agent.core</span>
              <span className="v4-label text-[0.6875rem] text-white/30">Finance workspace</span>
            </div>
            <div className="relative grid flex-1 place-items-center overflow-hidden py-10">
              <div className="v4-dots absolute inset-0 [mask-image:radial-gradient(closest-side,#000,transparent)]" aria-hidden="true" />
              <div className="absolute h-[70%] w-[70%] rounded-full border border-dashed border-white/10 motion-safe:animate-[spin_40s_linear_infinite]" aria-hidden="true" />
              <AgentOrb state={orbState} size={compact ? 200 : 240} className="relative" />
            </div>
            <ol className="grid grid-cols-3 border-t border-line" aria-label="Agent state">
              {STATES.map((st) => (
                <li
                  key={st.id}
                  aria-current={orbState === st.id ? "step" : undefined}
                  className={`v4-label flex h-11 items-center justify-center gap-2 text-[0.6875rem] transition-colors duration-300 [&:not(:last-child)]:border-r [&:not(:last-child)]:border-line ${
                    orbState === st.id ? "bg-cyan/10 text-cyan" : "text-white/40"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rotate-45 ${orbState === st.id ? "bg-cyan" : "bg-white/20"}`} aria-hidden="true" />
                  {st.label}
                </li>
              ))}
            </ol>
            <div className="border-t border-line p-4">
              <p className="v4-label text-[0.6875rem] text-white/35">Execution trace</p>
              <ol className="mt-3 space-y-2">
                {S.reads.map((r, i) => {
                  const done = i < traceDone;
                  const now = phase === "thinking" && i === read && !reduce;
                  return (
                    <li key={r} className={`type-mono flex items-center gap-3 text-[0.75rem] transition-colors ${done ? "text-white/75" : now ? "text-cyan" : "text-white/25"}`}>
                      <span className="w-8 shrink-0 text-white/25">{done ? "[ok]" : now ? "[..]" : "[  ]"}</span>
                      {r}
                    </li>
                  );
                })}
              </ol>
            </div>
          </Frame>

          {/* The conversation, as a terminal session. */}
          <Frame className="flex flex-col bg-void-2/70 lg:col-span-7">
            <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5">
              <span className="flex items-center gap-2" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              </span>
              <span className="v4-label text-[0.6875rem] text-white/50">genius-agent — session</span>
              <span className="v4-label flex items-center gap-2 text-[0.6875rem] text-white/50">
                <span className={`h-1.5 w-1.5 rounded-full ${orbState === "idle" ? "bg-emerald-400" : "animate-pulse bg-cyan"}`} />
                {orbState === "thinking" ? "Thinking" : orbState === "speaking" ? "Answering" : "Online"}
              </span>
            </div>

            <div
              ref={threadRef}
              className="type-mono flex min-h-[20rem] flex-1 flex-col justify-end gap-5 overflow-y-auto px-5 py-6 text-[0.875rem] leading-relaxed [scrollbar-width:none] lg:max-h-[30rem]"
              aria-live="polite"
            >
              {shownThread.map((m, i) =>
                m.who === "you" ? (
                  <div key={i}>
                    <span className="text-[0.6875rem] uppercase tracking-[0.08em] text-white/35">you</span>
                    <p className="mt-1 text-white">
                      <span className="mr-2 text-cyan">&gt;</span>
                      {m.text}
                    </p>
                  </div>
                ) : (
                  <div key={i} className="border-l-2 border-signal pl-4">
                    <span className="text-[0.6875rem] uppercase tracking-[0.08em] text-[#9fb4ff]">genius</span>
                    <p className="mt-1 text-white/80">{m.text}</p>
                  </div>
                ),
              )}
              {phase === "thinking" && !reduce && (
                <div className="border-l-2 border-cyan/50 pl-4 text-white/50">
                  <span className="text-[0.6875rem] uppercase tracking-[0.08em] text-cyan">genius</span>
                  <p className="mt-1">
                    {S.reads[Math.min(read, S.reads.length - 1)]}
                    <span className="v4-caret ml-1 inline-block h-3.5 w-2 translate-y-0.5 bg-cyan" aria-hidden="true" />
                  </p>
                </div>
              )}
              {phase === "speaking" && !reduce && (
                <div className="border-l-2 border-signal pl-4">
                  <span className="text-[0.6875rem] uppercase tracking-[0.08em] text-[#9fb4ff]">genius</span>
                  <p className="mt-1 text-white/80">
                    {words.slice(0, spoken).join(" ")}
                    <span className="v4-caret ml-1 inline-block h-3.5 w-2 translate-y-0.5 bg-[#9fb4ff]" aria-hidden="true" />
                  </p>
                </div>
              )}
            </div>

            <div className="flex h-14 items-center gap-3 border-t border-line px-5">
              <span className="type-mono text-cyan" aria-hidden="true">
                &gt;
              </span>
              <span className={`type-mono min-w-0 flex-1 truncate text-[0.875rem] ${inputText ? "text-white" : "text-white/30"}`}>
                {inputText || "Message the Genius agent"}
                {phase === "typing" && !reduce && <span className="v4-caret ml-px inline-block h-4 w-2 translate-y-0.5 bg-white" aria-hidden="true" />}
              </span>
              <span className={`v4-label hidden text-[0.6875rem] sm:block ${phase === "sending" ? "text-cyan" : "text-white/30"}`}>⏎ Enter</span>
            </div>
          </Frame>
        </div>
        <p className="v4-label mt-4 text-right text-[0.6875rem] text-white/30">Illustrative conversation</p>
      </div>
    </section>
  );
}
