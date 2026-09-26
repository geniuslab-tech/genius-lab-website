"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Check } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { AgentOrb, type OrbState } from "@/components/v2/AgentOrb";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { Intro } from "./ui";

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

type Msg = { who: "you" | "agent"; text: string; reads?: string[] };
type Phase = "typing" | "sending" | "thinking" | "speaking" | "done";

const STATES: { id: OrbState; label: string }[] = [
  { id: "idle", label: "Idle" },
  { id: "thinking", label: "Thinking" },
  { id: "speaking", label: "Speaking" },
];

const GREETING = "Hi, I’m your Genius agent. Ask me anything about the business, and I’ll show you what I read to answer.";

export function AgentsV6() {
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
          setThread((t) => [...t, { who: "agent", text: S.a, reads: S.reads }]);
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
  const shownThread: Msg[] = reduce ? [{ who: "you", text: SCRIPT[0].q }, { who: "agent", text: SCRIPT[0].a, reads: SCRIPT[0].reads }] : thread;
  const inputText = reduce ? "" : phase === "typing" ? S.q.slice(0, typed) : phase === "sending" ? S.q : "";
  const traceDone = reduce || phase === "speaking" || phase === "done" ? S.reads.length : phase === "thinking" ? read : 0;

  const agentBubble = "max-w-[88%] rounded-[12px] rounded-tl-[4px] border border-rule6 bg-frost px-4 py-3 text-[0.9375rem] leading-[1.6] text-steel";

  return (
    <section ref={root} id="agents" className="scroll-mt-[4.5rem] bg-frost py-24 sm:py-32" aria-labelledby="v6-agents-title">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Intro id="v6-agents-title" label="AI Agents" title="AI Agents that know your business." className="lg:col-span-7" />
          <p data-reveal="up" className="text-pretty max-w-[52ch] text-[1.0625rem] leading-[1.7] text-steel-2 lg:col-span-5">
            Built on the Second Brain, Genius agents answer executive questions end to end, reading the systems, tables and
            metrics behind every number.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:mt-16 lg:grid-cols-12">
          {/* The agent and its trace. */}
          <div data-reveal="up" className="relative flex flex-col overflow-hidden rounded-[14px] bg-abyss text-white lg:col-span-5">
            <div className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgb(77_141_255/0.35),transparent)]" aria-hidden="true" />
            <div className="relative flex items-center justify-between border-b border-white/[0.07] px-5 py-3">
              <span className="text-[0.8125rem] font-semibold">Genius agent</span>
              <span className="v6-label text-white/35">Finance workspace</span>
            </div>
            <div className="relative grid flex-1 place-items-center py-10">
              <AgentOrb state={orbState} size={compact ? 190 : 220} />
            </div>
            <ol className="relative grid grid-cols-3 border-t border-white/[0.07]" aria-label="Agent state">
              {STATES.map((st) => (
                <li
                  key={st.id}
                  aria-current={orbState === st.id ? "step" : undefined}
                  className={`v6-label flex h-11 items-center justify-center gap-2 transition-colors duration-300 [&:not(:last-child)]:border-r [&:not(:last-child)]:border-white/[0.07] ${
                    orbState === st.id ? "bg-white/[0.06] text-ember" : "text-white/40"
                  }`}
                >
                  {st.label}
                </li>
              ))}
            </ol>
            <div className="relative border-t border-white/[0.07] p-5">
              <p className="v6-label text-white/35">What the agent reads</p>
              <ol className="mt-3 space-y-2">
                {S.reads.map((r, i) => {
                  const done = i < traceDone;
                  const now = phase === "thinking" && i === read && !reduce;
                  return (
                    <li key={r} className={`flex items-center gap-3 font-mono text-[0.75rem] transition-colors ${done ? "text-white/80" : now ? "text-ember" : "text-white/30"}`}>
                      <span className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${done ? "bg-sky text-white" : now ? "border border-ember" : "border border-white/20"}`} aria-hidden="true">
                        {done && <Check size={9} weight="bold" />}
                      </span>
                      {r}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* The conversation. */}
          <div data-reveal="up" data-delay="90" className="flex flex-col overflow-hidden rounded-[14px] border border-rule6 bg-white shadow-[0_24px_60px_-40px_rgb(11_19_36/0.35)] lg:col-span-7">
            <div className="flex items-center justify-between gap-4 border-b border-rule6 px-5 py-3">
              <span className="text-[0.8125rem] font-semibold text-steel">Ask Genius</span>
              <span className="flex items-center gap-2 text-[0.75rem] text-steel-2">
                <span className={`h-1.5 w-1.5 rounded-full ${orbState === "idle" ? "bg-emerald-500" : "animate-pulse bg-ember"}`} aria-hidden="true" />
                {orbState === "thinking" ? "Thinking" : orbState === "speaking" ? "Answering" : "Online"}
              </span>
            </div>

            <div ref={threadRef} className="flex min-h-[22rem] flex-1 flex-col justify-end gap-3 overflow-y-auto px-5 py-6 [scrollbar-width:none] lg:max-h-[30rem]" aria-live="polite">
              {shownThread.map((m, i) =>
                m.who === "you" ? (
                  <div key={i} className="ml-auto max-w-[80%] rounded-[12px] rounded-tr-[4px] bg-steel px-4 py-3 text-[0.9375rem] leading-[1.6] text-white">
                    {m.text}
                  </div>
                ) : (
                  <div key={i} className={agentBubble}>
                    {m.text}
                    {m.reads && (
                      <span className="mt-3 flex flex-wrap gap-1.5 border-t border-rule6 pt-3">
                        {m.reads.map((r) => (
                          <span key={r} className="rounded-[4px] bg-white px-2 py-0.5 font-mono text-[0.6875rem] text-steel-2 ring-1 ring-rule6">
                            {r.replace(/^Reading /, "")}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                ),
              )}
              {phase === "thinking" && !reduce && (
                <div className={agentBubble}>
                  <span className="flex gap-1 py-1" aria-hidden="true">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-ember" style={{ animationDelay: `${d * 140}ms` }} />
                    ))}
                  </span>
                  <span className="mt-1 block font-mono text-[0.75rem] text-steel-2">{S.reads[Math.min(read, S.reads.length - 1)]}</span>
                </div>
              )}
              {phase === "speaking" && !reduce && <div className={agentBubble}>{words.slice(0, spoken).join(" ")}</div>}
            </div>

            <div className="border-t border-rule6 p-3">
              <div className="flex h-12 items-center gap-3 rounded-[8px] border border-rule6 bg-frost pl-4 pr-1.5">
                <span className={`min-w-0 flex-1 truncate text-[0.9375rem] ${inputText ? "text-steel" : "text-steel-3"}`}>
                  {inputText || "Message the Genius agent"}
                  {phase === "typing" && !reduce && <span className="ml-px inline-block h-4 w-px translate-y-0.5 animate-pulse bg-steel" aria-hidden="true" />}
                </span>
                <span
                  className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] transition-[background-color,transform] duration-200 ${
                    phase === "sending" ? "scale-90 bg-ember text-[#1a1205]" : inputText ? "bg-ember text-[#1a1205]" : "bg-rule6 text-steel-3"
                  }`}
                  aria-hidden="true"
                >
                  <ArrowUp size={15} weight="bold" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <p className="v6-label mt-4 text-steel-3">Illustrative conversation</p>
      </div>
    </section>
  );
}
