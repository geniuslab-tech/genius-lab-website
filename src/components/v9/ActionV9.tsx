"use client";

import { useState } from "react";
import { Play, X } from "@phosphor-icons/react";
import { Slate } from "./shared";

const CHAPTERS = [
  { t: "00:00", name: "Connecting the systems" },
  { t: "00:48", name: "Building the Second Brain" },
  { t: "01:32", name: "Agents at work" },
];

/** SC 10: the product film, shown as a placeholder screen in scope. */
export function ActionV9() {
  const [open, setOpen] = useState(false);
  return (
    <section id="action" data-scene="SC 10 · Product film" className="scroll-mt-12 bg-(--v9-ink) py-24 sm:py-32" aria-labelledby="v9-action-title">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Slate sc="10">Product film</Slate>
            <h2 id="v9-action-title" className="v9-display mt-5 text-[clamp(2.4rem,6vw,5.5rem)]">
              Genius Lab in action.
            </h2>
          </div>
          <p className="max-w-[44ch] leading-[1.7] text-(--v9-fog) lg:col-span-5">
            Two minutes from scattered systems to an agent answering a CFO&rsquo;s question.
          </p>
        </div>

        <div className="mt-12 bg-black px-0 py-[4%] sm:py-[3%]">
          <div className="group relative aspect-[2.39/1] min-h-[13rem] overflow-hidden bg-(--v9-navy)">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_70%_40%,#1a1f5c_0%,transparent_70%)]" aria-hidden="true" />
            <div className="v9-corners absolute inset-4 opacity-70 sm:inset-6" aria-hidden="true" />
            <div className="absolute left-5 top-5 flex items-center gap-2 sm:left-8 sm:top-8">
              <span className="v9-blink h-1.5 w-1.5 rounded-full bg-[#ff5a4f]" aria-hidden="true" />
              <span className="v9-tc text-(--v9-fog)">Genius Lab · product film · 2:14</span>
            </div>
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8">
              <p className="v9-display text-[clamp(1.6rem,4vw,3.5rem)]">From complexity to clarity</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Play video: Genius Lab in action"
              className="absolute left-1/2 top-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-(--v9-ice) text-(--v9-ice) transition-[background-color,color,transform] duration-300 hover:bg-(--v9-ice) hover:text-(--v9-ink) active:scale-95 sm:h-24 sm:w-24"
            >
              <Play size={28} weight="fill" className="translate-x-0.5" />
            </button>
            {open && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-(--v9-ink)/95 p-6 text-center" role="dialog" aria-label="Video placeholder">
                <p className="text-[1.125rem] font-semibold">The product film is coming soon.</p>
                <p className="max-w-[40ch] text-(--v9-fog)">This frame is a placeholder for the Genius Lab video.</p>
                <button type="button" onClick={() => setOpen(false)} className="v9-tc mt-2 inline-flex h-10 items-center gap-2 border border-white/30 px-4 hover:border-white">
                  <X size={14} aria-hidden="true" /> Close
                </button>
              </div>
            )}
          </div>
        </div>

        <ol className="mt-4 grid gap-2 sm:grid-cols-3">
          {CHAPTERS.map((c) => (
            <li key={c.t} className="flex items-center gap-4 border border-(--v9-rule) px-5 py-4">
              <span className="v9-tc text-(--v9-ice)">{c.t}</span>
              <span className="font-semibold">{c.name}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
