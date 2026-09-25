"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { AgentOrb, type OrbState } from "./AgentOrb";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { h2Class } from "./ui";

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

export function AgentsV2() {
  const reduce = useReducedMotion();
  const compact = useMediaQuery("(max-width: 639px)");
  const root = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [typed, setTyped] = useState(0);
  const [spoken, setSpoken] = useState(0);
  const [read, setRead] = useState(0);
  const [thread, setThread] = useState<Msg[]>([{ who: "agent", text: "Hi, I’m your Genius agent. Ask me anything about the business, and I’ll show you what I read to answer." }]);
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

  // The conversation runs as a small state machine while the section is in view.
  useEffect(() => {
    if (!inView || reduce) return;
    let id: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (typed < S.q.length) id = setTimeout(() => setTyped((n) => n + 1), 32 + Math.random() * 40);
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
      else id = setTimeout(() => {
        setSpoken(0);
        setPhase("speaking");
      }, 500);
    } else if (phase === "speaking") {
      if (spoken < words.length) id = setTimeout(() => setSpoken((n) => n + 1), 55);
      else id = setTimeout(() => {
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

  return (
    <section ref={root} id="agents" className="relative scroll-mt-16 overflow-x-clip py-24 text-navy sm:py-32 lg:py-40" aria-labelledby="v2-agents-title">
      <div className="shell">
        <div className="mx-auto max-w-[46rem] text-center">
          <h2 id="v2-agents-title" data-reveal="up" className={`${h2Class} mx-auto max-w-[16ch]`}>
            AI Agents that know your business.
          </h2>
          <p data-reveal="up" data-delay="100" className="mx-auto mt-8 max-w-[54ch] text-lg leading-relaxed text-navy/70">
            Built on the Second Brain, Genius agents answer executive questions end to end, reading the systems,
            tables and metrics behind every number.
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center lg:mt-16">
          {/* The agent. */}
          <div className="relative grid place-items-center">
            <div
              className="absolute h-[118%] w-[118%] rounded-full bg-[radial-gradient(closest-side,rgb(16_20_64/0.95),rgb(16_20_64/0.85)_62%,rgb(16_20_64/0)_100%)]"
              aria-hidden="true"
            />
            <AgentOrb state={orbState} size={compact ? 220 : 280} className="relative" />
          </div>

          <ol className="mt-6 flex gap-2" aria-label="Agent state">
            {STATES.map((st) => (
              <li
                key={st.id}
                aria-current={orbState === st.id ? "step" : undefined}
                className={`type-mono flex h-8 items-center gap-2 px-3 text-[0.75rem] transition-colors duration-300 ${
                  orbState === st.id ? "bg-navy text-white" : "text-navy/50 shadow-[inset_0_0_0_1px_rgb(16_20_64/0.18)]"
                }`}
              >
                <span className={`h-1.5 w-1.5 rotate-45 ${orbState === st.id ? "bg-signal" : "bg-navy/30"}`} aria-hidden="true" />
                {st.label}
              </li>
            ))}
          </ol>

          {/* The conversation: a frosted-glass chat window over soft colour, so the glass reads as glass. */}
          <div className="relative mt-8 w-full max-w-[46rem]">
            <div className="pointer-events-none absolute -inset-x-16 -inset-y-10 -z-10" aria-hidden="true">
              <div className="absolute left-[4%] top-[6%] h-72 w-72 rounded-full bg-signal/45 blur-3xl" />
              <div className="absolute right-[2%] top-[24%] h-80 w-80 rounded-full bg-[#7fd6ff]/45 blur-3xl" />
              <div className="absolute bottom-0 left-[35%] h-56 w-80 rounded-full bg-navy/20 blur-3xl" />
            </div>

            <div className="overflow-hidden rounded-[28px] border border-white bg-white/35 shadow-[0_40px_90px_-40px_rgb(16_20_64/0.45),inset_0_1px_0_rgb(255_255_255/0.9)] ring-1 ring-navy/10 backdrop-blur-2xl backdrop-saturate-150 supports-[not(backdrop-filter:blur(1px))]:bg-white/90">
              {/* Title bar. */}
              <div className="flex items-center justify-between gap-4 border-b border-navy/8 px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-[conic-gradient(from_200deg,#5577ff,#7fd6ff,#f0b3ff,#ffcf8a,#5577ff)]" aria-hidden="true">
                    <span className="h-5 w-5 rounded-full bg-white/60 backdrop-blur" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[0.9375rem] font-semibold text-navy">Genius agent</span>
                    <span className="flex items-center gap-1.5 text-[0.75rem] text-navy/55">
                      <span className={`h-1.5 w-1.5 rounded-full ${orbState === "idle" ? "bg-emerald-500" : "bg-signal-ink animate-pulse"}`} />
                      {orbState === "thinking" ? "Thinking" : orbState === "speaking" ? "Answering" : "Online"}
                    </span>
                  </span>
                </div>
                <span className="type-mono rounded-full border border-navy/10 bg-white/60 px-3 py-1 text-[0.6875rem] text-navy/60">Finance workspace</span>
              </div>

              {/* Thread. */}
              <div
                ref={threadRef}
                className="flex max-h-[17rem] min-h-[11rem] flex-col justify-end gap-3 overflow-y-auto px-5 py-5 [scrollbar-width:none] sm:max-h-[15rem]"
                aria-live="polite"
              >
                {shownThread.map((m, i) =>
                  m.who === "you" ? (
                    <div key={i} className="ml-auto max-w-[82%] rounded-[20px] rounded-br-md bg-navy px-4 py-2.5 text-[0.9375rem] leading-relaxed text-white shadow-[0_8px_20px_-12px_rgb(16_20_64/0.6)]">
                      {m.text}
                    </div>
                  ) : (
                    <div key={i} className="max-w-[88%] rounded-[20px] rounded-bl-md border border-white bg-white/80 px-4 py-2.5 text-[0.9375rem] leading-relaxed text-navy shadow-[0_8px_24px_-16px_rgb(16_20_64/0.35)]">
                      {m.text}
                    </div>
                  ),
                )}
                {phase === "thinking" && !reduce && (
                  <div className="max-w-[88%] rounded-[20px] rounded-bl-md border border-white bg-white/80 px-4 py-3 shadow-[0_8px_24px_-16px_rgb(16_20_64/0.35)]">
                    <span className="flex gap-1" aria-hidden="true">
                      {[0, 1, 2].map((d) => (
                        <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-signal-ink" style={{ animationDelay: `${d * 140}ms` }} />
                      ))}
                    </span>
                    <ol className="mt-2.5 flex flex-col gap-1.5">
                      {S.reads.slice(0, read + 1).map((r, i) => (
                        <li key={r} className={`type-mono flex items-center gap-2.5 text-[0.75rem] ${i === read ? "text-navy" : "text-navy/45"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${i < read ? "bg-signal-ink" : "bg-navy/25"}`} aria-hidden="true" />
                          {r}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {phase === "speaking" && !reduce && (
                  <div className="max-w-[88%] rounded-[20px] rounded-bl-md border border-white bg-white/80 px-4 py-2.5 text-[0.9375rem] leading-relaxed text-navy shadow-[0_8px_24px_-16px_rgb(16_20_64/0.35)]">
                    {words.slice(0, spoken).join(" ")}
                    <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse rounded-full bg-signal-ink" aria-hidden="true" />
                  </div>
                )}
              </div>

              {/* Composer. */}
              <div className="border-t border-navy/8 p-3">
                <div className="flex h-12 items-center gap-3 rounded-full border border-navy/10 bg-white/75 pl-5 pr-1.5 shadow-[inset_0_1px_2px_rgb(16_20_64/0.06)]">
                  <span className={`min-w-0 flex-1 truncate text-[0.9375rem] ${inputText ? "text-navy" : "text-navy/40"}`}>
                    {inputText || "Message the Genius agent"}
                    {phase === "typing" && !reduce && <span className="ml-px inline-block h-4 w-px translate-y-0.5 animate-pulse bg-navy" aria-hidden="true" />}
                  </span>
                  <span
                    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-[background-color,transform] duration-200 ${
                      phase === "sending" ? "scale-90 bg-signal-ink text-white" : inputText ? "bg-navy text-white" : "bg-navy/10 text-navy/35"
                    }`}
                    aria-hidden="true"
                  >
                    <ArrowUp size={16} weight="bold" />
                  </span>
                </div>
              </div>
            </div>
            <p className="type-mono mt-4 text-center text-[0.75rem] text-navy/45">Illustrative conversation</p>
          </div>
        </div>
      </div>
    </section>
  );
}
