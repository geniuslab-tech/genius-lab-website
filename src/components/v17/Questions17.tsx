"use client";

import { motion } from "motion/react";
import { Rise, SectionHead, SPRING, type Tint } from "./ui";

/**
 * In place of testimonials (none are approved yet), the questions leadership teams
 * typically bring to a first conversation. Unattributed and paraphrased.
 */
const QUESTIONS: { q: string; who: string; tint: Tint; rot: number }[] = [
  { q: "Why do the board pack and the operating numbers never quite agree?", who: "Finance leadership", tint: "terra", rot: -2 },
  { q: "Can we see every portfolio company in one view without replacing their systems?", who: "Investment teams", tint: "sky", rot: 1.5 },
  { q: "How much of our analysts' week goes into reconciling reports?", who: "Operations leadership", tint: "ochre", rot: -1 },
  { q: "What would we need to know on day one of an integration?", who: "M&A teams", tint: "sage", rot: 2 },
  { q: "If I ask an AI about margin, will it mean our margin?", who: "Chief executives", tint: "terra", rot: -1.5 },
  { q: "Who keeps all of this running once it is built?", who: "Technology leadership", tint: "sky", rot: 1 },
];

export function Questions17() {
  return (
    <section id="clients" className="scroll-mt-20 py-24 sm:py-32" aria-labelledby="v17-questions-title">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <SectionHead
            id="v17-questions-title"
            label="Clients"
            tint="terra"
            title={
              <>
                Where most conversations <em>begin</em>.
              </>
            }
            className="lg:col-span-8"
          />
          <p className="text-[0.875rem] leading-relaxed text-[var(--ink-3)] lg:col-span-4 lg:text-right">
            Typical questions from leadership teams, paraphrased. Approved client stories will appear here.
          </p>
        </div>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {QUESTIONS.map((x, i) => (
            <li key={x.q}>
              <Rise delay={(i % 3) * 0.07}>
                <motion.figure
                  initial={{ rotate: 0 }}
                  whileInView={{ rotate: x.rot }}
                  viewport={{ once: true, amount: 0.5 }}
                  whileHover={{ rotate: 0, y: -6 }}
                  transition={SPRING}
                  className={`v17-tint-${x.tint} flex h-full min-h-[14rem] flex-col justify-between rounded-[1.75rem] p-7 shadow-[0_18px_30px_-26px_rgb(16_20_64/0.6)]`}
                >
                  <blockquote className="v17-display text-[1.5rem] leading-[1.2]">{x.q}</blockquote>
                  <figcaption className="mt-6 text-[0.875rem] font-semibold text-[var(--ink-2)]">{x.who}</figcaption>
                </motion.figure>
              </Rise>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
