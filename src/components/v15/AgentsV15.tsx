"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Kicker, ROMAN, d } from "./ui";

/** Illustrative exchanges with the Genius agent. Figures are examples, not client results. */
const SCRIPT = [
  {
    q: "Why did our EBITDA margin drop in Q3, and what should we do about it?",
    reads: ["finance.gl_entries", "Q2 and Q3 cost centres", "Freight and discount drivers"],
    a: "EBITDA margin fell from 18.2% to 15.9%. Two drivers explain most of it: freight costs rose 14% after the July carrier change, and Northeast discounting added $1.1M in promotional spend. Renegotiating freight and capping regional discounts recovers about 1.8 points next quarter.",
  },
  {
    q: "What will our cash position look like over the next 90 days?",
    reads: ["ar.invoices and ap.schedule", "Payment behaviour by customer", "Projected weekly balances"],
    a: "Cash stays above the $4M floor, with a low of $4.6M in week 7 when the annual insurance premium and two supplier payments land together. Collecting the three overdue enterprise invoices early lifts that low point to $5.9M.",
  },
];

const EASE = [0.19, 1, 0.22, 1] as const;

export function AgentsV15() {
  const reduce = useReducedMotion();
  const [turn, setTurn] = useState(0);
  const S = SCRIPT[turn];

  const enter = reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(10px)", y: 12 };
  const shown = { opacity: 1, filter: "blur(0px)", y: 0 };

  return (
    <section id="agents" className="relative scroll-mt-20 bg-[#0a0e1f] py-32 sm:py-48" aria-labelledby="v15-agents-title">
      <div className="mx-auto grid max-w-[1320px] gap-20 px-5 sm:px-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-40">
            <Kicker>AI Agents</Kicker>
            <h2 id="v15-agents-title" data-lx="settle" style={d(150)} className="lx-display mt-10 text-[clamp(2.5rem,4.6vw,4.25rem)]">
              AI Agents that <em className="lx-gold">know your business.</em>
            </h2>
            <p data-lx="fade" style={d(350)} className="lx-body mt-8 max-w-[40ch]">
              Built on the Second Brain, Genius agents answer executive questions end to end, reading the systems, tables and
              metrics behind every number.
            </p>

            <div data-lx="fade" style={d(500)} className="mt-12 flex items-center gap-2" role="group" aria-label="Choose an illustrative exchange">
              {SCRIPT.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTurn(i)}
                  aria-pressed={turn === i}
                  className={`lx-serif flex h-12 w-12 items-center justify-center border text-[1.1rem] transition-colors duration-700 ${
                    turn === i ? "border-[#d8c29d]/70 text-[#d8c29d]" : "border-[#d8c29d]/15 text-[#ede7dc]/60 hover:border-[#d8c29d]/40"
                  }`}
                >
                  {ROMAN[i]}
                  <span className="sr-only"> exchange</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div data-lx="fade" className="border-t border-[#d8c29d]/25 pt-8">
            <p className="lx-caps flex justify-between gap-6 text-[#ede7dc]/70">
              <span>Illustrative exchange</span>
              <span className="lx-gold">
                {ROMAN[turn]} of {ROMAN[SCRIPT.length - 1]}
              </span>
            </p>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={turn} initial={enter} animate={shown} exit={enter} transition={{ duration: reduce ? 0.2 : 1.1, ease: EASE }} aria-live="polite">
                <p className="lx-caps mt-14 text-[#ede7dc]/60">The executive asks</p>
                <blockquote className="lx-serif mt-5 text-[clamp(1.75rem,3.2vw,2.75rem)] font-light italic leading-[1.22]">
                  &ldquo;{S.q}&rdquo;
                </blockquote>

                <p className="lx-caps mt-16 text-[#ede7dc]/60">What the agent read</p>
                <ol className="mt-5 grid gap-px sm:grid-cols-3">
                  {S.reads.map((r, i) => (
                    <li key={r} className="flex items-baseline gap-4 border-t border-[#d8c29d]/15 py-4 sm:pr-4">
                      <span className="lx-num text-[1rem]">{ROMAN[i]}</span>
                      <span className="text-[0.9375rem] leading-snug text-[#ede7dc]/85">{r}</span>
                    </li>
                  ))}
                </ol>

                <p className="lx-caps mt-14 text-[#ede7dc]/60">The agent answers</p>
                <p className="lx-serif mt-5 text-[clamp(1.3rem,1.9vw,1.6rem)] leading-[1.55] text-[#ede7dc]">{S.a}</p>
              </motion.div>
            </AnimatePresence>

            <p className="lx-caps mt-14 border-t border-[#d8c29d]/15 pt-6 text-[#ede7dc]/60">
              Illustrative conversation &middot; figures are examples
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
