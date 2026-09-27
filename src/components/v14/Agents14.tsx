"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Head, Section } from "./ui";
import { useInView14 } from "./useInView14";

/** Illustrative conversations with the Genius agent. Figures are examples, not client results. */
const SCRIPT = [
  {
    q: "Why did our EBITDA margin drop in Q3, and what should we do about it?",
    reads: ["finance.gl_entries", "Q2 vs Q3 cost centres", "Freight and discount drivers"],
    a: "EBITDA margin fell from 18.2% to 15.9%. Two drivers explain most of it: freight costs rose 14% after the July carrier change, and Northeast discounting added $1.1M in promotional spend. Renegotiating freight and capping regional discounts recovers about 1.8 points next quarter.",
  },
  {
    q: "What will our cash position look like over the next 90 days?",
    reads: ["ar.invoices and ap.schedule", "Payment behaviour by customer", "Weekly balance projection"],
    a: "Cash stays above the $4M floor, with a low of $4.6M in week 7 when the annual insurance premium and two supplier payments land together. Collecting the three overdue enterprise invoices early lifts that low point to $5.9M.",
  },
];

const READ_MS = 700;
const WORD_MS = 45;
const HOLD_MS = 6500;

export function Agents14() {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView14(box, 0.35);
  const [qi, setQi] = useState(0);
  const [tick, setTick] = useState(0);
  const [touched, setTouched] = useState(false);

  const S = SCRIPT[qi];
  const words = S.a.split(" ");
  const total = S.reads.length + words.length;
  const t = reduce ? total : tick;

  useEffect(() => {
    if (!inView || reduce) return;
    if (tick < total) {
      const id = setTimeout(() => setTick((n) => n + 1), tick < S.reads.length ? READ_MS : WORD_MS);
      return () => clearTimeout(id);
    }
    if (touched) return;
    const id = setTimeout(() => {
      setQi((n) => (n + 1) % SCRIPT.length);
      setTick(0);
    }, HOLD_MS);
    return () => clearTimeout(id);
  }, [inView, reduce, tick, total, touched, S.reads.length]);

  const readsDone = Math.min(t, S.reads.length);
  const shown = Math.max(0, t - S.reads.length);
  const status = t < S.reads.length ? "Reading" : t < total ? "Answering" : "Answered";

  return (
    <Section id="agents" n="04" label="AI Agents" titleId="v14-agents-title">
      <Head
        id="v14-agents-title"
        title="AI Agents that know your business."
        lead="Built on the Second Brain, Genius agents answer executive questions end to end, reading the systems, tables and metrics behind every number."
      />

      <div ref={box} className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        {/* Question picker */}
        <div className="border-black max-lg:border-b-2 lg:border-r-2">
          <p className="v14-mono border-b-2 border-black px-4 py-3 sm:px-6">Ask Genius · pick a question</p>
          <ul>
            {SCRIPT.map((s, i) => {
              const on = i === qi;
              return (
                <li key={s.q} className="border-b-2 border-black last:border-b-0 lg:last:border-b-2">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setTouched(true);
                      setQi(i);
                      setTick(0);
                    }}
                    className={`flex w-full flex-col gap-3 px-4 py-5 text-left sm:px-6 ${on ? "bg-black text-white" : "v14-inv bg-white"}`}
                  >
                    <span className="v14-mono">Q.0{i + 1}</span>
                    <span className="text-[1.0625rem] font-semibold leading-[1.35]">{s.q}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Console */}
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center justify-between gap-4 border-b-2 border-black px-4 py-3 sm:px-6">
            <p className="v14-mono">Genius agent · Finance workspace</p>
            <p className="v14-mono flex items-center gap-2" aria-hidden="true">
              <span className={`inline-block h-2.5 w-2.5 ${status === "Answered" ? "bg-black" : "v14-blink bg-[#1f3bff]"}`} />
              {status}
            </p>
          </div>

          <div className="border-b-2 border-black px-4 py-6 sm:px-6">
            <p className="v14-mono text-[#555]">You &rsaquo;</p>
            <p className="v14-head mt-3 text-[clamp(1.75rem,3.4vw,3.25rem)]">{S.q}</p>
          </div>

          <ol className="grid gap-[2px] border-b-2 border-black bg-black sm:grid-cols-3" aria-label="What the agent reads">
            {S.reads.map((r, i) => {
              const done = i < readsDone;
              const now = !reduce && i === readsDone && t < S.reads.length;
              return (
                <li key={r} className={`flex items-start gap-3 px-4 py-3 ${done ? "bg-[#1f3bff] text-white" : now ? "bg-black text-white" : "bg-white text-[#555]"}`}>
                  <span className="v14-mono shrink-0">{done ? "[x]" : now ? "[>]" : "[ ]"}</span>
                  <span className="font-mono text-[0.8125rem] leading-[1.4]">{r}</span>
                </li>
              );
            })}
          </ol>

          <div className="min-h-[13rem] flex-1 px-4 py-6 sm:px-6">
            <p className="v14-mono text-[#555]">Genius &rsaquo;</p>
            <p className="mt-3 max-w-[62ch] text-[1.1875rem] leading-[1.55]">
              {shown > 0 ? words.slice(0, shown).join(" ") : null}
              {!reduce && t < total ? <span className="v14-caret ml-1" aria-hidden="true" /> : null}
            </p>
            <p className="sr-only" aria-live="polite">
              {t >= total ? S.a : ""}
            </p>
          </div>
          <p className="v14-mono border-t-2 border-black px-4 py-2 text-[#555] sm:px-6">Illustrative conversation · figures are examples</p>
        </div>
      </div>
    </Section>
  );
}
