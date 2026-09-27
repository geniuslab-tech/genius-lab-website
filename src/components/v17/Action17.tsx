"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Play, X } from "@phosphor-icons/react";
import { DrawPath, SectionHead, SPRING, Sticker } from "./ui";

const CHAPTERS = [
  { t: "Chapter 1", name: "Connecting the systems" },
  { t: "Chapter 2", name: "Building the Second Brain" },
  { t: "Chapter 3", name: "Agents at work" },
];

export function Action17() {
  const [open, setOpen] = useState(false);
  return (
    <section id="action" className="scroll-mt-20 py-24 sm:py-32" aria-labelledby="v17-action-title">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead
            id="v17-action-title"
            label="Product film"
            tint="terra"
            title={
              <>
                Genius Lab <em>in action</em>.
              </>
            }
            className="lg:col-span-7"
          />
          <p className="max-w-[44ch] text-pretty text-[1.0625rem] leading-[1.7] text-[var(--ink-2)] lg:col-span-5">
            From scattered systems to an agent answering a CFO&rsquo;s question, in one short film.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <div className="v17-panel relative isolate flex aspect-[4/5] items-center justify-center overflow-hidden bg-[var(--ink)] sm:aspect-[16/10] lg:col-span-9">
            {/* Cover: three stones of cream and earth, the film's first frame. */}
            <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 -z-10 h-full w-full" aria-hidden="true">
              <circle cx="730" cy="410" r="160" fill="var(--terra)" opacity="0.9" />
              <circle cx="70" cy="40" r="120" fill="var(--sage)" opacity="0.85" />
              <circle cx="600" cy="70" r="56" fill="var(--ochre)" opacity="0.9" />
              <path d="M0 250 C 160 200, 260 320, 400 250 S 650 190, 800 260" stroke="var(--cream)" strokeOpacity="0.25" strokeWidth="2" fill="none" />
            </svg>
            <div className="relative">
              <svg viewBox="0 0 200 200" className="absolute -inset-10 h-[calc(100%+5rem)] w-[calc(100%+5rem)]" aria-hidden="true" fill="none">
                <DrawPath
                  d="M100 14 C 150 12, 188 50, 186 100 C 184 150, 146 188, 98 186 C 50 184, 14 148, 16 98 C 18 54, 52 18, 110 18"
                  stroke="var(--ochre-mid)"
                  width={2.5}
                  duration={1.3}
                />
              </svg>
              <motion.button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Play video: Genius Lab in action"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                transition={SPRING}
                className="relative flex size-24 items-center justify-center rounded-full bg-[var(--cream)] text-[var(--ink)] sm:size-28"
              >
                <Play size={34} weight="fill" className="translate-x-0.5" aria-hidden="true" />
              </motion.button>
            </div>
            <div className="absolute left-5 top-5 sm:left-8 sm:top-8">
              <Sticker tint="ochre" rotate={-4}>
                Film coming soon
              </Sticker>
            </div>
            <div className="absolute inset-x-5 bottom-5 sm:inset-x-8 sm:bottom-8">
              <p className="v17-display text-[1.6rem] text-[var(--cream)] sm:text-[2rem]">
                From complexity to <em>clarity</em>
              </p>
              <p className="mt-2 inline-block rounded-full bg-[var(--ink)] py-1 pr-3 text-[0.875rem] text-[var(--cream)]/80">Placeholder cover for the Genius Lab product film</p>
            </div>
            <AnimatePresence>
              {open && (
                <motion.div
                  role="dialog"
                  aria-modal="false"
                  aria-label="Video placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[var(--ink)] p-6 text-center text-[var(--cream)]"
                >
                  <p className="v17-display text-[1.75rem]">The product film is coming soon.</p>
                  <p className="text-[var(--cream)]/75">This frame is a placeholder for the Genius Lab video.</p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="v17-btn v17-btn-cream mt-3"
                  >
                    <X size={14} aria-hidden="true" /> Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <ol className="grid gap-3 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-1">
            {CHAPTERS.map((c, i) => (
              <li
                key={c.t}
                className={`v17-panel flex flex-col justify-between gap-6 p-6 ${["v17-tint-terra", "v17-tint-sage", "v17-tint-ochre"][i]}`}
              >
                <span className="text-[0.8125rem] font-semibold text-[var(--ink-2)]">{c.t}</span>
                <span className="v17-display text-[1.5rem] leading-[1.1]">{c.name}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
