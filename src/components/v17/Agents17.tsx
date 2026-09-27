"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { HandArrow, SectionHead, SOFT, Sticker, useReduced } from "./ui";

/** Illustrative conversations with the Genius agent. Every figure here is an example. */
const SCRIPT = [
  {
    tab: "Margin",
    q: "Why did our EBITDA margin drop in Q3, and what should we do about it?",
    reads: ["finance.gl_entries", "Q2 and Q3 cost centres", "Freight and discount drivers"],
    a: "EBITDA margin fell from 18.2% to 15.9%. Two drivers explain most of it: freight costs rose 14% after the July carrier change, and Northeast discounting added $1.1M in promotional spend. Renegotiating freight and capping regional discounts recovers about 1.8 points next quarter.",
  },
  {
    tab: "Cash",
    q: "What will our cash position look like over the next 90 days?",
    reads: ["ar.invoices and ap.schedule", "Payment behaviour by customer", "Weekly balance projection"],
    a: "Cash stays above the $4M floor, with a low of $4.6M in week 7 when the annual insurance premium and two supplier payments land together. Collecting the three overdue enterprise invoices early lifts that low point to $5.9M.",
  },
];

function Check({ delay, play }: { delay: number; play: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className="size-5 shrink-0" aria-hidden="true" fill="none">
      <circle cx="10" cy="10" r="9" fill="var(--sage-tint)" stroke="var(--sage-ink)" strokeWidth="1.2" />
      <motion.path
        d="M5.5 10.5 L8.6 13.4 L14.5 6.8"
        stroke="var(--sage-ink)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: play ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 0.35 }}
      />
    </svg>
  );
}

export function Agents17() {
  const [turn, setTurn] = useState(0);
  const reduce = useReduced();
  const card = useRef<HTMLDivElement>(null);
  const inView = useInView(card, { once: true, amount: 0.35 });
  const S = SCRIPT[turn];
  const play = !reduce;
  const show = inView || reduce;

  return (
    <section id="agents" className="scroll-mt-20 py-24 sm:py-32" aria-labelledby="v17-agents-title">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-4 sm:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHead
            id="v17-agents-title"
            label="AI Agents"
            tint="ochre"
            title={
              <>
                AI Agents that know your <em>business</em>.
              </>
            }
            lead="Built on the Second Brain, Genius agents answer executive questions end to end, reading the systems, tables and metrics behind every number."
          />
          <div className="mt-10">
            <p className="text-[0.8125rem] font-semibold text-[var(--ink-3)]">Try a question</p>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Example questions">
              {SCRIPT.map((s, i) => (
                <button
                  key={s.tab}
                  type="button"
                  aria-pressed={i === turn}
                  onClick={() => setTurn(i)}
                  className={`rounded-full px-4 py-2.5 text-left text-[0.9375rem] font-semibold transition-colors duration-300 ${
                    i === turn ? "bg-[var(--ink)] text-[var(--cream)]" : "text-[var(--ink-2)] shadow-[inset_0_0_0_1px_var(--rule)] hover:bg-[var(--paper)]"
                  }`}
                >
                  {s.tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative lg:col-span-7">
          <div className="pointer-events-none absolute -top-14 right-4 hidden items-end gap-1 lg:flex" aria-hidden="true">
            <p className="v17-hand rotate-[3deg] text-[1.0625rem] text-[var(--ink-2)]">it shows what it read</p>
            <HandArrow className="h-12 w-16 translate-y-6 rotate-[40deg]" />
          </div>
          <div ref={card} className="v17-panel bg-[var(--ochre-tint)] p-3 sm:p-4">
            <div className="rounded-[1.6rem] bg-[var(--paper)] p-5 sm:rounded-[2.1rem] sm:p-8">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--rule)] pb-4">
                <span className="v17-serif text-[1.25rem]">Ask Genius</span>
                <span className="flex items-center gap-2 text-[0.8125rem] text-[var(--ink-3)]">
                  <span className="size-2 rounded-full bg-[var(--sage)]" aria-hidden="true" />
                  Finance workspace
                </span>
              </div>

              <div key={turn} className="mt-6 space-y-5" aria-live="polite">
                <motion.p
                  initial={play ? { opacity: 0, y: 10 } : false}
                  animate={show ? { opacity: 1, y: 0 } : undefined}
                  transition={SOFT}
                  className="ml-auto max-w-[85%] rounded-[1.4rem] rounded-br-md bg-[var(--ink)] px-5 py-3.5 text-[1rem] leading-[1.55] text-[var(--cream)]"
                >
                  {S.q}
                </motion.p>

                <div>
                  <p className="text-[0.8125rem] font-semibold text-[var(--ink-3)]">What the agent reads</p>
                  <ul className="mt-2.5 flex flex-wrap gap-2">
                    {S.reads.map((r, i) => (
                      <motion.li
                        key={r}
                        initial={play ? { opacity: 0, scale: 0.85 } : false}
                        animate={show ? { opacity: 1, scale: 1 } : undefined}
                        transition={{ ...SOFT, delay: 0.5 + i * 0.45 }}
                        className="flex items-center gap-2 rounded-full bg-[var(--sage-tint)] py-1.5 pl-1.5 pr-3.5 font-mono text-[0.8125rem] text-[var(--ink)]"
                      >
                        {show && <Check delay={0.7 + i * 0.45} play={play} />}
                        {r}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <motion.div
                  initial={play ? { opacity: 0, y: 12 } : false}
                  animate={show ? { opacity: 1, y: 0 } : undefined}
                  transition={{ ...SOFT, delay: 2.1 }}
                  className="max-w-[92%] rounded-[1.4rem] rounded-bl-md bg-[var(--cream-2)] px-5 py-4 text-[1rem] leading-[1.65] text-[var(--ink)]"
                >
                  {S.a}
                </motion.div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Sticker tint="paper" rotate={-2} className="text-[0.75rem] font-medium text-[var(--ink-2)]">
              Illustrative conversation, example figures
            </Sticker>
          </div>
        </div>
      </div>
    </section>
  );
}
