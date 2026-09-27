"use client";

import { useEffect, useRef, useState } from "react";
import { GuillocheLayers, TerrainPlate } from "./ornaments";
import { Kicker, ROMAN, d } from "./ui";

const CHAPTERS = [
  { t: "00:00", name: "Connecting the systems" },
  { t: "00:48", name: "Building the Second Brain" },
  { t: "01:32", name: "Agents at work" },
];

/** The product film, framed like a vitrine and unveiled by a curtain. The film itself is a placeholder. */
export function ActionV15() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section id="action" className="relative scroll-mt-20 bg-[#0c0b0a] py-32 sm:py-48" aria-labelledby="v15-action-title">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Kicker>Product film</Kicker>
            <h2 id="v15-action-title" data-lx="settle" style={d(150)} className="lx-display mt-10 text-[clamp(2.5rem,5.4vw,5rem)]">
              Genius Lab <em className="lx-gold">in action.</em>
            </h2>
          </div>
          <p data-lx="fade" style={d(300)} className="lx-body max-w-[40ch] lg:col-span-4 lg:col-start-9">
            Two minutes from scattered systems to an agent answering a CFO&rsquo;s question.
          </p>
        </div>

        <div className="mt-20 border border-[#d8c29d]/20 p-[7px]">
          <div data-lx="curtain" className="relative aspect-[4/5] overflow-hidden bg-[#0a0e1f] sm:aspect-[16/9]">
            <div className="lx-curtain-inner absolute inset-0">
              <div className="absolute inset-0 opacity-70">
                <TerrainPlate />
              </div>
              <div className="absolute left-1/2 top-1/2 aspect-square w-[min(130%,900px)] -translate-x-1/2 -translate-y-1/2">
                <GuillocheLayers opacity={0.45} />
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgb(10_14_31/0.85)_75%)]" aria-hidden="true" />
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Play video: Genius Lab in action"
              className="group absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#d8c29d]/60 transition-[border-color,transform] duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-105 hover:border-[#d8c29d] sm:h-36 sm:w-36"
            >
              <span className="absolute inset-2 rounded-full border border-[#d8c29d]/20" aria-hidden="true" />
              <span className="lx-caps pl-[0.34em] text-[#ede7dc]">Play</span>
            </button>

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-10">
              <p className="lx-display text-[clamp(1.5rem,3vw,2.5rem)] italic">From complexity to clarity</p>
              <p className="lx-caps text-[#ede7dc]/70">Genius Lab &middot; product film &middot; 2:14</p>
            </div>

            {open && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-[#0c0b0a]/95 px-6 text-center" role="dialog" aria-modal="true" aria-label="Video placeholder">
                <p className="lx-display text-[clamp(1.6rem,3vw,2.4rem)]">The product film is coming soon.</p>
                <p className="lx-body max-w-[40ch]">This frame is a placeholder for the Genius Lab video.</p>
                <button ref={closeRef} type="button" onClick={() => setOpen(false)} className="lx-btn mt-4 h-12">
                  Close
                </button>
              </div>
            )}
          </div>
        </div>

        <ol className="mt-10 grid sm:grid-cols-3">
          {CHAPTERS.map((c, i) => (
            <li key={c.t} data-lx="fade" style={d(i * 140)} className="flex items-baseline gap-5 border-t border-[#d8c29d]/15 py-5 sm:pr-6">
              <span className="lx-num text-[1rem]">{ROMAN[i]}</span>
              <span className="lx-serif text-[1.25rem]">{c.name}</span>
              <span className="lx-caps ml-auto text-[#ede7dc]/60">{c.t}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
