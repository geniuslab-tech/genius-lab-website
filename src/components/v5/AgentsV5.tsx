"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { AgentOrb, type OrbState } from "@/components/v2/AgentOrb";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { Heading } from "./ui";

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

export function AgentsV5() {
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

  const agentBubble = "max-w-[85%] rounded-[20px] rounded-bl-[6px] bg-[#e9e9eb] px-4 py-2.5 text-[0.9375rem] leading-[1.42] tracking-[-0.01em] text-graphite";

  return (
    <section ref={root} id="agents" className="scroll-mt-12 bg-mist py-28 sm:py-40" aria-labelledby="v5-agents-title">
      <div className="mx-auto max-w-[1080px] px-5">
        <Heading
          id="v5-agents-title"
          eyebrow="AI Agents"
          title="AI Agents that know your business."
          lead="Built on the Second Brain, Genius agents answer executive questions end to end, reading the systems, tables and metrics behind every number."
        />

        <div className="mt-16 grid gap-5 sm:mt-20 lg:grid-cols-[5fr_7fr]">
          {/* The agent. */}
          <div data-reveal="up" className="relative flex flex-col items-center justify-between overflow-hidden rounded-[28px] bg-black px-6 py-10 text-white">
            <div className="pointer-events-none absolute inset-x-0 top-1/4 mx-auto h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgb(0_113_227/0.35),transparent)]" aria-hidden="true" />
            <p className="relative text-[0.875rem] font-semibold text-[#a1a1a6]">Genius agent</p>
            <AgentOrb state={orbState} size={compact ? 200 : 240} className="relative my-8" />
            <ol className="relative inline-flex rounded-full bg-white/[0.1] p-1" aria-label="Agent state">
              {STATES.map((st) => (
                <li
                  key={st.id}
                  aria-current={orbState === st.id ? "step" : undefined}
                  className={`rounded-full px-4 py-1.5 text-[0.8125rem] transition-colors duration-300 ${orbState === st.id ? "bg-white text-black" : "text-white/60"}`}
                >
                  {st.label}
                </li>
              ))}
            </ol>
          </div>

          {/* The conversation. */}
          <div data-reveal="up" data-delay="90" className="flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_2px_12px_rgb(0_0_0/0.04)]">
            <div className="flex items-center justify-between gap-4 border-b border-black/[0.06] px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[conic-gradient(from_200deg,#0071e3,#7fd6ff,#c9b3ff,#0071e3)]" aria-hidden="true">
                  <span className="h-6 w-6 rounded-full bg-white/70" />
                </span>
                <span className="leading-tight">
                  <span className="block text-[0.9375rem] font-semibold text-graphite">Genius agent</span>
                  <span className="text-[0.75rem] text-graphite-2">
                    {orbState === "thinking" ? "Thinking…" : orbState === "speaking" ? "Answering…" : "Online"}
                  </span>
                </span>
              </div>
              <span className="rounded-full bg-mist px-3 py-1 text-[0.75rem] text-graphite-2">Finance workspace</span>
            </div>

            <div ref={threadRef} className="flex min-h-[20rem] flex-1 flex-col justify-end gap-2.5 overflow-y-auto px-5 py-6 [scrollbar-width:none] lg:max-h-[26rem]" aria-live="polite">
              {shownThread.map((m, i) =>
                m.who === "you" ? (
                  <div key={i} className="ml-auto max-w-[80%] rounded-[20px] rounded-br-[6px] bg-azure px-4 py-2.5 text-[0.9375rem] leading-[1.42] tracking-[-0.01em] text-white">
                    {m.text}
                  </div>
                ) : (
                  <div key={i} className={agentBubble}>
                    {m.text}
                  </div>
                ),
              )}
              {phase === "thinking" && !reduce && (
                <div className={agentBubble}>
                  <span className="flex gap-1 py-1" aria-hidden="true">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-graphite-3" style={{ animationDelay: `${d * 140}ms` }} />
                    ))}
                  </span>
                  <ol className="mt-2 space-y-1">
                    {S.reads.slice(0, read + 1).map((r, i) => (
                      <li key={r} className={`text-[0.8125rem] ${i === read ? "text-graphite" : "text-graphite-3"}`}>
                        {i < read ? "✓ " : ""}
                        {r}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {phase === "speaking" && !reduce && <div className={agentBubble}>{words.slice(0, spoken).join(" ")}</div>}
            </div>

            <div className="p-4 pt-0">
              <div className="flex h-11 items-center gap-3 rounded-full border border-black/10 pl-5 pr-1.5">
                <span className={`min-w-0 flex-1 truncate text-[0.9375rem] ${inputText ? "text-graphite" : "text-graphite-3"}`}>
                  {inputText || "Message the Genius agent"}
                  {phase === "typing" && !reduce && <span className="ml-px inline-block h-4 w-px translate-y-0.5 animate-pulse bg-azure" aria-hidden="true" />}
                </span>
                <span
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-[background-color,transform] duration-200 ${
                    phase === "sending" ? "scale-90 bg-azure text-white" : inputText ? "bg-azure text-white" : "bg-black/[0.06] text-graphite-3"
                  }`}
                  aria-hidden="true"
                >
                  <ArrowUp size={15} weight="bold" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-[0.75rem] text-graphite-3">Illustrative conversation.</p>
      </div>
    </section>
  );
}
