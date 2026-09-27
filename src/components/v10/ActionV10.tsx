"use client";

import { useState } from "react";
import { Chapter } from "./ui";

const CHAPTERS = [
  { t: "00:00", name: "Connecting the systems" },
  { t: "00:48", name: "Building the Second Brain" },
  { t: "01:32", name: "Agents at work" },
];

export function ActionV10() {
  const [open, setOpen] = useState(false);
  return (
    <Chapter
      id="action"
      n="10"
      label="In action"
      title="Genius Lab in action."
      lead={<>Two minutes from scattered systems to an agent answering a CFO&rsquo;s question.</>}
      note={
        <>
          Client perspectives are published only with approval. None are shown in this briefing, and the client marks on
          the cover are placeholders.
        </>
      }
    >
      <div className="mt-14 grid gap-8 sm:mt-16 lg:grid-cols-10 lg:gap-6">
        <div data-reveal="up" className="lg:col-span-7">
          <div className="relative aspect-[16/10] overflow-hidden border border-[color:var(--ink)] bg-[#101440] text-white sm:aspect-[16/9]">
            {/* A quiet title card, framed like a plate in a report. */}
            <div className="absolute inset-4 border border-white/15 sm:inset-6" aria-hidden="true" />
            <div className="absolute left-6 top-6 sm:left-10 sm:top-10">
              <p className="caps text-[color:var(--brass-2)]">Product film</p>
              <p className="serif mt-3 max-w-[16ch] text-[clamp(1.5rem,3.4vw,2.75rem)] leading-[1.08]">From complexity to clarity</p>
            </div>
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 sm:bottom-10 sm:left-10 sm:right-10">
              <p className="tnum text-[0.8125rem] text-white/60">Genius Lab · 2:14</p>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Play video: Genius Lab in action"
                className="inline-flex h-12 items-center gap-3 bg-[#f6f3ea] px-5 text-[0.9375rem] font-medium text-[#101440] transition-colors hover:bg-white"
              >
                <svg viewBox="0 0 10 12" className="h-3 w-2.5" aria-hidden="true">
                  <path d="M0 0 L10 6 L0 12 Z" fill="currentColor" />
                </svg>
                Play film
              </button>
            </div>
            {open && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#101440] px-6 text-center" role="dialog" aria-label="Video placeholder">
                <p className="serif text-[1.5rem]">The product film is coming soon.</p>
                <p className="max-w-[40ch] text-[0.9375rem] text-white/70">This frame is a placeholder for the Genius Lab video.</p>
                <button type="button" onClick={() => setOpen(false)} className="mt-3 h-10 px-4 text-[0.875rem] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.5)] hover:shadow-[inset_0_0_0_1px_#fff]">
                  Close
                </button>
              </div>
            )}
          </div>
          <p className="mt-3 text-[0.75rem] text-[color:var(--slate)]">Placeholder frame. The film will be published here.</p>
        </div>

        <div className="lg:col-span-3">
          <p className="caps text-[color:var(--slate)]">Chapters</p>
          <ol className="mt-3 border-t border-[color:var(--ink)]">
            {CHAPTERS.map((c) => (
              <li key={c.t} className="grid grid-cols-[3.5rem_1fr] border-b border-[color:var(--rule)] py-4">
                <span className="tnum text-[0.875rem] text-[color:var(--brass)]">{c.t}</span>
                <span className="serif text-[1.1875rem] leading-[1.3] text-[color:var(--ink)]">{c.name}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Chapter>
  );
}
