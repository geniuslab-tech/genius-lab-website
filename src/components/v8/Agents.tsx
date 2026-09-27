"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import { Opener, Rule, Up, shell } from "./type";

/** Illustrative conversations. Each answer is set in segments that close on a footnote: what the agent read. */
const SCRIPT = [
  {
    tab: "On margin",
    q: "Why did our EBITDA margin drop in Q3, and what should we do about it?",
    a: [
      "EBITDA margin fell from 18.2% to 15.9%.",
      "Two drivers explain most of it: freight costs rose 14% after the July carrier change,",
      "and Northeast discounting added $1.1M in promotional spend.",
      "Renegotiating freight and capping regional discounts recovers about 1.8 points next quarter.",
    ],
    reads: ["Read finance.gl_entries.", "Compared Q2 and Q3 cost centres.", "Traced freight and discount drivers."],
  },
  {
    tab: "On cash",
    q: "What will our cash position look like over the next 90 days?",
    a: [
      "Cash stays above the $4M floor, with a low of $4.6M in week 7,",
      "when the annual insurance premium and two supplier payments land together.",
      "Collecting the three overdue enterprise invoices early lifts that low point to $5.9M.",
      "",
    ],
    reads: ["Read ar.invoices and ap.schedule.", "Applied payment behaviour by customer.", "Projected weekly balances."],
  },
];

type Phase = "idle" | "reading" | "answering" | "done";

function Portrait({ thinking }: { thinking: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className={`block h-auto w-full max-w-[220px] ${thinking ? "ring-think" : ""}`} aria-hidden="true">
      {[92, 80, 68, 56, 44, 32, 20].map((r, i) => (
        <circle
          key={r}
          cx={100}
          cy={100}
          r={r}
          fill="none"
          stroke={i === 3 ? "var(--red)" : "var(--ink)"}
          strokeWidth={i === 3 ? 1.6 : 0.8}
          strokeDasharray={i % 2 ? "1 4" : undefined}
          style={{ "--i": i } as CSSProperties}
        />
      ))}
      <circle cx={100} cy={100} r={6} fill="var(--red)" />
    </svg>
  );
}

export function Agents() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [read, setRead] = useState(0);
  const [words, setWords] = useState(0);
  const [seen, setSeen] = useState(false);

  const S = SCRIPT[turn];
  const segWords = S.a.map((s) => s.split(" ").filter(Boolean));
  const total = segWords.reduce((n, w) => n + w.length, 0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen || reduce) return;
    let id: ReturnType<typeof setTimeout>;
    if (phase === "idle") id = setTimeout(() => setPhase("reading"), 400);
    else if (phase === "reading") {
      if (read < S.reads.length) id = setTimeout(() => setRead((n) => n + 1), 700);
      else id = setTimeout(() => setPhase("answering"), 300);
    } else if (phase === "answering") {
      if (words < total) id = setTimeout(() => setWords((n) => n + 1), 42);
      else id = setTimeout(() => setPhase("done"), 200);
    }
    return () => clearTimeout(id);
  }, [seen, reduce, phase, read, words, total, S.reads.length]);

  const pick = (i: number) => {
    if (i === turn) return;
    setTurn(i);
    setRead(0);
    setWords(0);
    setPhase("idle");
  };

  const showAll = reduce || phase === "done";
  const shownWords = showAll ? total : words;
  const shownReads = showAll || phase === "answering" ? S.reads.length : read;
  const state = showAll ? "Answered" : phase === "reading" ? "Reading" : phase === "answering" ? "Answering" : "Listening";

  const segStart = segWords.map((_, si) => segWords.slice(0, si).reduce((n, seg) => n + seg.length, 0));

  return (
    <section ref={root} id="agents" data-chapter="agents" className="scroll-mt-[var(--head-h)] border-t border-[color:var(--rule)] bg-[color:var(--paper-2)]/60 py-20 sm:py-28" aria-labelledby="v8-agents-title">
      <div className={shell}>
        <Opener numeral="IV" kicker="AI Agents" title="AI Agents that *know* your business." titleId="v8-agents-title" folio="30">
          <Up delay={250}>
            <p className="f-text mt-8 max-w-[50ch] text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.4]">
              Built on the Second Brain, Genius agents answer executive questions end to end, reading the systems, tables and
              metrics behind every number.
            </p>
          </Up>
        </Opener>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          {/* Sidebar: the interviewee, and the choice of conversation. */}
          <aside className="lg:col-span-3" aria-label="About this conversation">
            <p className="label text-[color:var(--ink-3)]">In conversation</p>
            <Rule ink className="mt-3" />
            <div className="mt-6 flex items-center gap-6 lg:block">
              <div className="w-28 shrink-0 sm:w-36 lg:w-full">
                <Portrait thinking={!reduce && (phase === "reading" || phase === "answering")} />
              </div>
              <div className="lg:mt-6">
                <p className="f-display text-[1.75rem] leading-none">The Genius agent</p>
                <p className="smallcaps mt-2 text-[color:var(--ink-3)]">Finance workspace</p>
                <p className="smallcaps mt-3 flex items-center gap-2 text-[color:var(--ink)]" aria-live="polite">
                  <span className={`h-1.5 w-1.5 rounded-full ${state === "Answered" || state === "Listening" ? "bg-[color:var(--ink)]" : "bg-[color:var(--red)]"}`} aria-hidden="true" />
                  {state}
                </p>
              </div>
            </div>
            <div className="mt-8" role="group" aria-label="Choose a conversation">
              {SCRIPT.map((s, i) => (
                <button
                  key={s.tab}
                  type="button"
                  aria-pressed={i === turn}
                  onClick={() => pick(i)}
                  className={`flex w-full items-baseline justify-between border-t border-[color:var(--rule)] py-3 text-left transition-colors last:border-b ${
                    i === turn ? "text-[color:var(--ink)]" : "text-[color:var(--ink-3)] hover:text-[color:var(--ink)]"
                  }`}
                >
                  <span className="f-display text-[1.375rem] italic">{s.tab}</span>
                  <span className={`smallcaps ${i === turn ? "text-[color:var(--red)]" : ""}`}>No. {i + 1}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* The transcript. */}
          <article className="lg:col-span-9 lg:border-l lg:border-[color:var(--rule)] lg:pl-10" aria-label={`Illustrative conversation: ${S.tab}`}>
            <div className="grid gap-x-6 gap-y-2 sm:grid-cols-[4rem_1fr]">
              <p className="f-display text-[2.5rem] leading-none text-[color:var(--red)]" aria-hidden="true">Q.</p>
              <p className="f-display text-[clamp(1.875rem,3.4vw,3rem)] leading-[1.05]">
                <span className="sr-only">Question: </span>
                {S.q}
              </p>
            </div>
            <Rule className="my-8" />
            <div className="grid gap-x-6 gap-y-2 sm:grid-cols-[4rem_1fr]">
              <p className="f-display text-[2.5rem] leading-none" aria-hidden="true">A.</p>
              <p className="f-text text-[clamp(1.25rem,1.9vw,1.5rem)] leading-[1.55] text-[color:var(--ink)]">
                <span className="sr-only">Answer: </span>
                {segWords.map((seg, si) => (
                  <span key={`${turn}-${si}`}>
                    {seg.map((word, wi) => {
                      const w = segStart[si] + wi + 1;
                      const on = w <= shownWords;
                      return (
                        <span key={w} className={`transition-opacity duration-300 ${on ? "opacity-100" : "opacity-0"}`}>
                          {word}{" "}
                        </span>
                      );
                    })}
                    {si < S.reads.length && (
                      <sup className={`-ml-1 mr-1 font-[family-name:var(--v8-sans)] text-[0.6em] font-bold text-[color:var(--red)] transition-opacity duration-300 ${si < shownReads ? "opacity-100" : "opacity-0"}`}>
                        <a href={`#v8-fn-${turn}-${si}`} aria-label={`Source ${si + 1}`} className="px-0.5">
                          {si + 1}
                        </a>
                      </sup>
                    )}{" "}
                  </span>
                ))}
              </p>
            </div>

            {/* Footnotes: what the agent read to answer. */}
            <div className="mt-12 sm:ml-[5.5rem]">
              <p className="label text-[color:var(--ink-3)]">What the agent read</p>
              <div className="hair-ink mt-3 w-16" aria-hidden="true" />
              <ol className="mt-4 space-y-2">
                {S.reads.map((r, i) => (
                  <li
                    key={r}
                    id={`v8-fn-${turn}-${i}`}
                    className={`smallcaps flex gap-3 transition-[opacity,transform] duration-500 ${i < shownReads ? "opacity-100" : "translate-y-1 opacity-25"}`}
                  >
                    <span className="w-4 font-bold text-[color:var(--red)]">{i + 1}</span>
                    <span className="font-mono text-[0.75rem] text-[color:var(--ink)]">{r}</span>
                  </li>
                ))}
              </ol>
              <p className="smallcaps mt-8 text-[color:var(--ink-3)]">
                Illustrative conversation. Figures are fictional and are not client data.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
