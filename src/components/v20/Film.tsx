"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Play, X } from "@phosphor-icons/react/dist/ssr";
import { Morph } from "./Morph";
import { Heading, Note, R } from "./ui";

const CHAPTERS = [
  { t: "00:00", name: "Connecting the systems" },
  { t: "00:48", name: "Building the Second Brain" },
  { t: "01:32", name: "Agents at work" },
];

/** The product film, framed as a large rounded screen that settles into place as it arrives. */
export function Film() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "center center"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.6 });
  const scale = useTransform(p, [0, 1], [0.92, 1]);

  return (
    <section id="action" data-tone="white" className="v20-sec py-28 sm:py-40" aria-labelledby="v20-action-title">
      <div className="mx-auto max-w-[1120px] px-5">
        <Heading
          id="v20-action-title"
          eyebrow="Product film"
          title="Genius Lab in action."
          width="13ch"
          lead={<>Two minutes from scattered systems to an agent answering a CFO&rsquo;s question.</>}
        />

        <motion.div ref={frame} style={reduce ? undefined : { scale }} className="mt-16 sm:mt-20">
          <div data-tone="black" className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-black text-[#f5f5f7] sm:aspect-[16/9]">
            <div className="absolute inset-y-0 right-[-8%] w-[80%] opacity-70 sm:right-0 sm:w-[56%]" aria-hidden="true">
              <Morph state={3} still />
            </div>
            <div className="absolute inset-0 flex flex-col justify-between p-7 sm:p-12">
              <p className="text-[0.875rem] font-medium text-[#f5f5f7]/70">Genius Lab · product film · 2:14</p>
              <div className="flex items-end justify-between gap-6">
                <p className="v20-display max-w-[12ch] text-[clamp(2rem,4.6vw,3.75rem)]">From complexity to clarity.</p>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-label="Play video: Genius Lab in action"
                  className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#f5f5f7] text-black transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 active:scale-95 sm:h-20 sm:w-20"
                >
                  <Play size={26} weight="fill" className="translate-x-0.5" />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {open && (
                <motion.div
                  role="dialog"
                  aria-label="Video placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.4 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/90 p-6 text-center"
                >
                  <p className="v20-display text-[1.5rem]">The product film is coming soon.</p>
                  <p className="max-w-[40ch] text-[#f5f5f7]/70">This frame is a placeholder for the Genius Lab video.</p>
                  <button
                    type="button"
                    autoFocus
                    onClick={() => setOpen(false)}
                    className="v20-pill v20-pill-sm mt-2 !bg-transparent !text-[#f5f5f7] shadow-[inset_0_0_0_1px_rgb(245_245_247/0.4)]"
                  >
                    <X size={13} aria-hidden="true" /> Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <ol className="mt-6 grid gap-3 sm:grid-cols-3">
          {CHAPTERS.map((c, i) => (
            <R as="li" key={c.t} delay={i * 80} className="v20-card flex items-center gap-4 px-6 py-5">
              <span className="v20-acc v20-num text-[0.875rem] font-semibold">{c.t}</span>
              <span className="v20-fg font-medium">{c.name}</span>
            </R>
          ))}
        </ol>
        <Note className="mt-5">Chapter times are provisional.</Note>
      </div>
    </section>
  );
}
