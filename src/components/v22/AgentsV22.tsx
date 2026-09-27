"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUp } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { axialToPixel, hexPoints, hexRing } from "@/lib/hex";
import { Illustrative, SectionHead, r1 } from "./ui";

/** Illustrative conversations with the Genius agent. */
const SCRIPT = [
  {
    q: "Why did our EBITDA margin drop in Q3, and what should we do about it?",
    reads: ["finance.gl_entries", "Q2 vs Q3 cost centres", "freight and discount drivers"],
    a: "EBITDA margin fell from 18.2% to 15.9%. Two drivers explain most of it: freight costs rose 14% after the July carrier change, and Northeast discounting added $1.1M in promotional spend. Renegotiating freight and capping regional discounts recovers about 1.8 points next quarter.",
  },
  {
    q: "What will our cash position look like over the next 90 days?",
    reads: ["ar.invoices and ap.schedule", "payment behaviour by customer", "weekly balance projection"],
    a: "Cash stays above the $4M floor, with a low of $4.6M in week 7 when the annual insurance premium and two supplier payments land together. Collecting the three overdue enterprise invoices early lifts that low point to $5.9M.",
  },
];

type Phase = "typing" | "thinking" | "speaking" | "done";

const GLYPH = [[0, 0] as [number, number], ...hexRing(1)].map(([q, r]) => {
  const p = axialToPixel(q, r, 15);
  return { x: r1(60 + p.x), y: r1(56 + p.y) };
});

/** The agent's mark: a seven-cell cluster that fills as it reads. */
function Glyph({ lit, speaking }: { lit: number; speaking: boolean }) {
  return (
    <svg viewBox="0 0 120 112" className="h-24 w-24 shrink-0" aria-hidden="true">
      {GLYPH.map((c, i) => {
        const on = i === 0 || (i <= lit * 2 && lit > 0) || speaking;
        return (
          <polygon
            key={i}
            points={hexPoints(c.x, c.y, 13)}
            fill={i === 0 ? "#ffffff" : on ? "#5577ff" : "transparent"}
            stroke="#9aaeff"
            strokeOpacity={on ? 0.9 : 0.35}
            className={`motion-safe:transition-[fill] motion-safe:duration-500 ${speaking && i > 0 ? "v22-pulse" : ""}`}
            style={{ "--base": 1, "--p": r1(i * 0.12 - 2.4) } as CSSProperties}
          />
        );
      })}
    </svg>
  );
}

export function AgentsV22() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [typed, setTyped] = useState(0);
  const [read, setRead] = useState(0);
  const [spoken, setSpoken] = useState(0);

  const S = SCRIPT[turn % SCRIPT.length];
  const words = S.a.split(" ");

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reduce) return;
    let id: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      id = typed < S.q.length ? setTimeout(() => setTyped((n) => n + 1), 34) : setTimeout(() => setPhase("thinking"), 500);
    } else if (phase === "thinking") {
      id = read < S.reads.length ? setTimeout(() => setRead((n) => n + 1), 900) : setTimeout(() => setPhase("speaking"), 400);
    } else if (phase === "speaking") {
      id = spoken < words.length ? setTimeout(() => setSpoken((n) => n + 1), 55) : setTimeout(() => setPhase("done"), 200);
    } else {
      id = setTimeout(() => {
        setTyped(0);
        setRead(0);
        setSpoken(0);
        setTurn((n) => n + 1);
        setPhase("typing");
      }, 6000);
    }
    return () => clearTimeout(id);
  }, [inView, reduce, phase, typed, read, spoken, S, words.length]);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [phase, spoken, reduce]);

  // Reduced motion: the finished first exchange, no typing.
  const still = !!reduce;
  const ph: Phase = still ? "done" : phase;
  const readN = still || ph === "speaking" || ph === "done" ? S.reads.length : ph === "thinking" ? read : 0;
  const asked = ph !== "typing";
  const answer = ph === "done" ? S.a : ph === "speaking" ? words.slice(0, spoken).join(" ") : "";
  const state = ph === "thinking" ? 1 : ph === "speaking" ? 2 : 0;
  const STATES = ["Idle", "Reading", "Answering"];

  return (
    <section ref={root} id="agents" className="scroll-mt-[var(--nav)] bg-white py-24 sm:py-32" aria-labelledby="v22-agents-title">
      <div className="v22-shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead n="04" label="AI Agents" id="v22-agents-title" title="AI Agents that know your business" className="lg:col-span-7" titleClass="max-w-[15ch]" />
          <p data-v22r="up" className="text-pretty max-w-[48ch] text-[1.0625rem] leading-[1.7] text-[var(--ink-2)] lg:col-span-5">
            Built on the Second Brain, Genius agents answer executive questions end to end, reading the systems, tables and
            metrics behind every number, and showing their work.
          </p>
        </div>

        <div className="mt-14 grid gap-3 lg:mt-16 lg:grid-cols-12">
          {/* Conversation */}
          <div data-v22r="wipe" className="chb [--bd:var(--rule-2)] [--c:28px] lg:col-span-7">
            <div className="chi flex flex-col bg-white">
              <div className="flex items-center justify-between gap-4 border-b border-[var(--rule)] py-3.5 pl-9 pr-5">
                <span className="v22-wide text-[0.9375rem]">Ask Genius</span>
                <span className="flex items-center gap-2 text-[0.8125rem] text-[var(--ink-2)]">
                  <span className={`h-2 w-2 ${state === 0 ? "bg-[#0f9d77]" : "v22-blink bg-[var(--signal)]"}`} aria-hidden="true" />
                  {STATES[state]}
                </span>
              </div>

              <div ref={threadRef} className="flex h-[26rem] flex-col justify-end gap-3 overflow-y-auto px-5 py-6 [scrollbar-width:none] sm:px-7" aria-hidden="true">
                <div className="ch max-w-[88%] bg-[var(--paper)] px-4 py-3 text-[0.9375rem] leading-[1.6] [--c:10px]">
                  Hi, I&rsquo;m your Genius agent. Ask me anything about the business, and I&rsquo;ll show you what I read to answer.
                </div>
                {asked && <div className="ch ml-auto max-w-[82%] bg-[var(--navy)] px-4 py-3 text-[0.9375rem] leading-[1.6] text-white [--c:10px]">{S.q}</div>}
                {ph === "thinking" && (
                  <div className="ch v22-mono max-w-[88%] bg-[var(--paper)] px-4 py-3 text-[0.8125rem] text-[var(--ink-2)] [--c:10px]">
                    Reading {S.reads[Math.min(read, S.reads.length - 1)]}
                    <span className="v22-blink">…</span>
                  </div>
                )}
                {answer && (
                  <div className="ch max-w-[88%] bg-[var(--paper)] px-4 py-3 text-[0.9375rem] leading-[1.6] [--c:10px]">
                    {answer}
                    {ph === "done" && (
                      <span className="mt-3 flex flex-wrap gap-1.5 border-t border-[var(--rule-2)] pt-3">
                        {S.reads.map((r) => (
                          <span key={r} className="v22-mono bg-white px-2 py-0.5 text-[0.6875rem] text-[var(--ink-2)] ring-1 ring-[var(--rule)]">
                            {r}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-[var(--rule)] p-3 pb-4 pr-8">
                <div className="flex h-12 items-center gap-3 bg-[var(--paper)] pl-4 pr-1.5">
                  <span className={`min-w-0 flex-1 truncate text-[0.9375rem] ${ph === "typing" && typed ? "text-[var(--ink)]" : "text-[var(--ink-3)]"}`} aria-hidden="true">
                    {ph === "typing" && typed ? S.q.slice(0, typed) : "Message the Genius agent"}
                  </span>
                  <span className={`ch inline-flex h-9 w-9 items-center justify-center [--c:7px] ${ph === "typing" && typed ? "bg-[var(--signal-ink)] text-white" : "bg-[var(--rule)] text-[var(--ink-3)]"}`} aria-hidden="true">
                    <ArrowUp size={15} weight="bold" />
                  </span>
                </div>
              </div>

              <div className="sr-only">
                <p>Illustrative conversation.</p>
                {SCRIPT.map((s) => (
                  <p key={s.q}>
                    Question: {s.q} Answer: {s.a} Sources read: {s.reads.join(", ")}.
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Trace */}
          <div data-v22r="wipe" style={{ "--rd": "120ms" } as CSSProperties} className="ch v22-hexfield flex flex-col bg-[var(--navy)] text-white [--c:28px] lg:col-span-5">
            <div className="flex items-center gap-5 border-b border-white/10 px-6 py-6 sm:px-8">
              <Glyph lit={readN} speaking={ph === "speaking"} />
              <div>
                <p className="v22-wide text-[1.0625rem]">Genius agent</p>
                <p className="mt-1 text-[0.875rem] text-white/60">Finance workspace · reads the Second Brain</p>
              </div>
            </div>

            <ol className="grid grid-cols-3 border-b border-white/10" aria-label="Agent state">
              {STATES.map((s, i) => (
                <li key={s} aria-current={state === i ? "step" : undefined} className={`v22-label relative flex h-11 items-center justify-center transition-colors duration-300 [&:not(:last-child)]:border-r [&:not(:last-child)]:border-white/10 ${state === i ? "text-white" : "text-white/45"}`}>
                  {state === i && <span className="absolute inset-x-4 bottom-0 h-[2px] bg-[var(--trace)]" aria-hidden="true" />}
                  {s}
                </li>
              ))}
            </ol>

            <div className="flex-1 px-6 py-6 sm:px-8">
              <p className="v22-label text-white/50">What the agent reads</p>
              <ol className="relative mt-5 space-y-4">
                <span className="absolute bottom-2 left-[7px] top-2 w-px bg-white/15" aria-hidden="true" />
                {S.reads.map((r, i) => {
                  const done = i < readN;
                  const now = ph === "thinking" && i === read;
                  return (
                    <li key={r} className={`relative flex items-center gap-4 text-[0.875rem] transition-colors duration-300 ${done ? "text-white" : now ? "text-[var(--signal-lt)]" : "text-white/40"}`}>
                      <svg width="15" height="16" viewBox="0 0 15 16" className="relative shrink-0" aria-hidden="true">
                        <polygon points={hexPoints(7.5, 8, 7)} fill={done ? "#2fd4b8" : "#101440"} stroke={done ? "#2fd4b8" : now ? "#9aaeff" : "rgb(255 255 255 / 0.3)"} />
                      </svg>
                      <span className="v22-mono">{r}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className="px-6 pb-7 sm:px-8">
              <Illustrative dark>Illustrative conversation and figures</Illustrative>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
