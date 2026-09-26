"use client";

import { useState } from "react";
import { Play, X } from "@phosphor-icons/react";
import { ConsoleV6 } from "./ConsoleV6";
import { Intro } from "./ui";

const CHAPTERS = [
  { t: "00:00", name: "Connecting the systems" },
  { t: "00:48", name: "Building the Second Brain" },
  { t: "01:32", name: "Agents at work" },
];

export function ActionV6() {
  const [open, setOpen] = useState(false);
  return (
    <section id="action" className="scroll-mt-[4.5rem] bg-frost py-24 sm:py-32" aria-labelledby="v6-action-title">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Intro id="v6-action-title" label="Product film" title="Genius Lab in action." className="lg:col-span-7" />
          <p data-reveal="up" className="max-w-[44ch] text-[1.0625rem] leading-[1.7] text-steel-2 lg:col-span-5">
            Two minutes from scattered systems to an agent answering a CFO&rsquo;s question.
          </p>
        </div>

        <div data-reveal="up" className="mt-14 lg:mt-16">
          <div className="group relative aspect-[16/9] overflow-hidden rounded-[16px] bg-abyss shadow-[0_50px_100px_-50px_rgb(11_19_36/0.7)]">
            {/* Cover: the console, dimmed, as the film's first frame. */}
            <div className="absolute left-1/2 top-[8%] w-[1180px] origin-top -translate-x-1/2 scale-[0.32] opacity-60 transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[0.33] sm:scale-[0.55] sm:group-hover:scale-[0.56] lg:scale-[0.85] lg:group-hover:scale-[0.86]" aria-hidden="true">
              <ConsoleV6 />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(5_11_24/0.95),rgb(5_11_24/0.35)_60%,rgb(5_11_24/0.2))]" aria-hidden="true" />

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Play video: Genius Lab in action"
              className="absolute left-1/2 top-1/2 inline-flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ember text-[#1a1205] shadow-[0_20px_50px_-10px_rgb(242_154_31/0.7)] transition-transform duration-300 hover:scale-105 active:scale-95 sm:h-24 sm:w-24"
            >
              <span className="absolute inset-0 rounded-full border-2 border-ember/60 motion-safe:animate-ping" aria-hidden="true" />
              <Play size={30} weight="fill" className="translate-x-0.5" />
            </button>

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 text-white sm:p-10">
              <div>
                <p className="v6-display text-[clamp(1.5rem,3vw,2.5rem)]">From complexity to clarity</p>
                <p className="v6-label mt-2 text-white/55">Genius Lab, product film, 2:14</p>
              </div>
            </div>

            {open && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-abyss/90 text-center text-white backdrop-blur-sm" role="dialog" aria-label="Video placeholder">
                <p className="text-[1.25rem] font-bold">The product film is coming soon.</p>
                <p className="max-w-[40ch] text-white/65">This frame is a placeholder for the Genius Lab video.</p>
                <button type="button" onClick={() => setOpen(false)} className="mt-2 inline-flex h-10 items-center gap-2 rounded-[6px] border border-white/30 px-4 text-[0.875rem] hover:border-white">
                  <X size={14} aria-hidden="true" /> Close
                </button>
              </div>
            )}
          </div>

          <ol className="mt-6 grid gap-3 sm:grid-cols-3">
            {CHAPTERS.map((c, i) => (
              <li key={c.t} className="flex items-center gap-4 rounded-[10px] border border-rule6 bg-white px-5 py-4">
                <span className={`font-mono text-[0.8125rem] ${i === 0 ? "text-ember-ink" : "text-sky-ink"}`}>{c.t}</span>
                <span className="font-semibold text-steel">{c.name}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
