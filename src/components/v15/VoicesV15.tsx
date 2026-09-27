"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Kicker, ROMAN, d } from "./ui";

/**
 * Placeholder quotes, attributed by role only. They are illustrative and must be replaced
 * with real, approved client words before launch.
 */
const VOICES = [
  { q: "They didn't sell us another tool. They built on what we already had and ran it for us.", role: "Chief Operating Officer, specialty retail" },
  { q: "Our analysts spend their time on decisions now, not on reconciling reports.", role: "VP Finance, logistics" },
  { q: "The Second Brain understands our definitions. When it says margin, it means our margin.", role: "Chief Executive, distribution" },
];

/** Placeholder client marks, to be replaced with approved logos. */
const MARKS = ["Vanta Group", "Helios", "Caldera", "Orbis", "Stratum", "Northpeak"];

const EASE = [0.19, 1, 0.22, 1] as const;

export function VoicesV15() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const v = VOICES[i];
  const hidden = reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(12px)" };

  return (
    <section id="clients" className="relative scroll-mt-20 bg-[#11100e] py-32 sm:py-48" aria-labelledby="v15-voices-title">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center px-5 text-center sm:px-10">
        <Kicker>In their words</Kicker>
        <h2 id="v15-voices-title" className="sr-only">
          What clients say
        </h2>
        <p className="lx-caps mt-6 text-[#ede7dc]/60">Illustrative placeholders &middot; to be replaced with approved client quotes</p>

        <div className="mt-16 min-h-[15rem] sm:min-h-[13rem]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure key={i} initial={hidden} animate={{ opacity: 1, filter: "blur(0px)" }} exit={hidden} transition={{ duration: reduce ? 0.2 : 1.2, ease: EASE }}>
              <blockquote className="lx-display text-[clamp(1.9rem,4vw,3.4rem)] italic leading-[1.18]">&ldquo;{v.q}&rdquo;</blockquote>
              <figcaption className="lx-caps lx-gold mt-10">{v.role}</figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-14 flex items-center gap-2" role="group" aria-label="Choose a quote">
          {VOICES.map((_, k) => (
            <button
              key={k}
              type="button"
              onClick={() => setI(k)}
              aria-pressed={k === i}
              className={`lx-serif flex h-12 w-12 items-center justify-center border text-[1.05rem] transition-colors duration-700 ${
                k === i ? "border-[#d8c29d]/70 text-[#d8c29d]" : "border-[#d8c29d]/15 text-[#ede7dc]/60 hover:border-[#d8c29d]/40"
              }`}
            >
              {ROMAN[k]}
              <span className="sr-only"> quote</span>
            </button>
          ))}
        </div>

        <div className="mt-32 w-full">
          <span data-lx="line" className="lx-hair" aria-hidden="true" />
          <ul className="grid grid-cols-2 gap-y-8 py-10 sm:grid-cols-3 lg:grid-cols-6" aria-label="Client logos (placeholders)">
            {MARKS.map((m, k) => (
              <li key={m} data-lx="fade" style={d(k * 120)} className="lx-serif text-[1.2rem] tracking-[0.12em] text-[#ede7dc]/55">
                {m}
              </li>
            ))}
          </ul>
          <p className="lx-caps text-[#ede7dc]/60">Client marks shown are placeholders</p>
        </div>
      </div>
    </section>
  );
}
