"use client";

import { useState } from "react";
import { Play, X } from "@phosphor-icons/react";
import { SectionHead } from "./ui";
import { Tilt } from "./Tilt";

const CHAPTERS = [
  { t: "00:00", name: "Connecting the systems" },
  { t: "00:48", name: "Building the Second Brain" },
  { t: "01:32", name: "Agents at work" },
];

/** The film's first frame: layered hexagon planes receding into depth. */
function Cover() {
  return (
    <div className="absolute inset-0 [perspective:700px]" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          viewBox="0 0 200 174"
          className="absolute left-1/2 top-1/2 w-[90%] max-w-[900px]"
          style={{ transform: `translate(-50%,-50%) translateZ(${-i * 260}px)`, opacity: 1 - i * 0.18 }}
        >
          <path d="M50 2h100l48 85-48 85H50L2 87z" fill="none" stroke={i === 4 ? "rgb(255 178 107 / 0.6)" : "rgb(143 220 255 / 0.35)"} strokeWidth="0.35" />
        </svg>
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(4_5_15/0.95),rgb(4_5_15/0.3)_60%,rgb(4_5_15/0.15))]" />
    </div>
  );
}

export function ActionV16() {
  const [open, setOpen] = useState(false);
  return (
    <section id="action" className="scroll-mt-16 py-24 sm:py-32" aria-labelledby="v16-action-title">
      <div className="v16-wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead n="08" id="v16-action-title" kicker="Product film" title="Genius Lab in action." className="lg:col-span-7" />
          <p className="v16-lead max-w-[44ch] lg:col-span-5">Two minutes from scattered systems to an agent answering a CFO&rsquo;s question.</p>
        </div>

        <Tilt className="relative mt-14 aspect-[4/3] overflow-hidden rounded-[16px] border border-[color:var(--line-2)] bg-[radial-gradient(ellipse_at_50%_45%,#111a55,var(--g0)_70%)] sm:aspect-[16/9] lg:mt-16" max={4}>
          <Cover />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Play video: Genius Lab in action"
            className="absolute left-1/2 top-1/2 z-10 inline-flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[color:var(--ice-2)] text-[color:var(--g1)] shadow-[0_0_60px_-6px_rgb(143_220_255/0.7)] transition-transform duration-300 hover:scale-105 active:scale-95 sm:h-24 sm:w-24"
          >
            <Play size={28} weight="fill" className="translate-x-0.5" />
          </button>
          <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-10">
            <p className="v16-display text-[clamp(1.375rem,3vw,2.5rem)]">From complexity to clarity</p>
            <p className="v16-label mt-2 text-[color:var(--tx-3)]">Genius Lab, product film, 2:14</p>
          </div>
          {open && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[rgb(4_5_15/0.94)] px-6 text-center" role="dialog" aria-label="Video placeholder">
              <p className="text-[1.25rem] font-medium">The product film is coming soon.</p>
              <p className="max-w-[40ch] text-[color:var(--tx-2)]">This frame is a placeholder for the Genius Lab video.</p>
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex h-10 items-center gap-2 rounded-[6px] px-4 text-[0.875rem] shadow-[inset_0_0_0_1px_var(--line-2)] hover:shadow-[inset_0_0_0_1px_var(--ice)]"
              >
                <X size={14} aria-hidden="true" /> Close
              </button>
            </div>
          )}
        </Tilt>

        <ol className="mt-4 grid gap-3 sm:grid-cols-3">
          {CHAPTERS.map((c) => (
            <li key={c.t} className="flex items-center gap-4 rounded-[10px] border border-[color:var(--line)] px-5 py-4">
              <span className="v16-mono text-[0.8125rem] text-[color:var(--ice)]">{c.t}</span>
              <span className="font-medium">{c.name}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
