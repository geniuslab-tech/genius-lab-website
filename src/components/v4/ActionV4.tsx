"use client";

import { useState } from "react";
import { Play, X } from "@phosphor-icons/react";
import { contourAt, contourGenerator, contourPath, hillsAt } from "@/lib/terrain";
import { SectionTag, h2v4 } from "./ui";

const CHAPTERS = [
  { t: "00:00", at: 0, name: "Connecting the systems" },
  { t: "00:48", at: 48 / 134, name: "Building the Second Brain" },
  { t: "01:32", at: 92 / 134, name: "Agents at work" },
];

const COVER = (() => {
  const cols = 160;
  const rows = 90;
  const hills = [
    { x: 0.66, y: 0.46, h: 1, r: 0.2 },
    { x: 0.4, y: 0.72, h: 0.45, r: 0.16 },
    { x: 0.88, y: 0.2, h: 0.35, r: 0.12 },
    { x: 0.2, y: 0.3, h: 0.25, r: 0.18 },
  ];
  const values = new Float64Array(cols * rows);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) values[j * cols + i] = hillsAt(hills, i / cols, j / rows, cols / rows);
  const gen = contourGenerator().size([cols, rows]);
  return Array.from({ length: 14 }, (_, k) => contourPath(contourAt(gen, values, 0.05 + k * 0.066), 10));
})();

export function ActionV4() {
  const [open, setOpen] = useState(false);
  return (
    <section id="action" className="relative scroll-mt-16 py-24 sm:py-32" aria-labelledby="v4-action-title">
      <div className="shell">
        <SectionTag n="09">Product film</SectionTag>
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 id="v4-action-title" data-reveal="up" className={`${h2v4} max-w-[14ch]`}>
            Genius Lab in action.
          </h2>
          <p data-reveal="up" data-delay="100" className="max-w-[40ch] text-lg leading-relaxed text-white/60">
            Two minutes from scattered systems to an agent answering a CFO&rsquo;s question.
          </p>
        </div>

        <div data-reveal="up" data-delay="120" className="mt-12 lg:mt-16">
          <div className="group relative aspect-[16/9] overflow-hidden border border-line bg-void-2 text-white">
            <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]" aria-hidden="true">
              <defs>
                <radialGradient id="v4-cover-light" cx="0.66" cy="0.46" r="0.6">
                  <stop offset="0" stopColor="#5577ff" stopOpacity="0.45" />
                  <stop offset="1" stopColor="#05060e" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="1600" height="900" fill="url(#v4-cover-light)" />
              {COVER.map((d, i) => (
                <path key={i} d={d} fill="none" stroke={i === 10 ? "#6ee7ff" : "#9fb4ff"} strokeOpacity={i === 10 ? 0.95 : 0.06 + i * 0.025} strokeWidth={i === 10 ? 2 : 1} />
              ))}
              <g transform="translate(1056 414)">
                <circle r="9" fill="#6ee7ff" />
                <circle r="22" fill="none" stroke="#6ee7ff" strokeOpacity="0.5" />
                <line x1="12" y1="-12" x2="40" y2="-40" stroke="#6ee7ff" strokeOpacity="0.6" />
                <g transform="translate(40 -124)">
                  <rect width="270" height="84" fill="#05060e" fillOpacity="0.85" stroke="#6ee7ff" strokeOpacity="0.5" />
                  <text x="18" y="26" className="type-mono fill-cyan text-[13px]">AI AGENT</text>
                  <text x="18" y="58" className="type-mono fill-white text-[26px]">38.4% margin</text>
                  <text x="18" y="76" className="type-mono fill-white/55 text-[12px]">+1.2 pts vs last quarter</text>
                </g>
              </g>
            </svg>
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(5_6_14/0.9),transparent_55%)]" aria-hidden="true" />
            {/* Viewfinder HUD. */}
            <div className="pointer-events-none absolute inset-4 sm:inset-6" aria-hidden="true">
              {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
                <span key={c} className={`absolute h-6 w-6 border-white/60 ${c}`} />
              ))}
              <span className="v4-label absolute left-4 top-3 flex items-center gap-2 text-[0.6875rem] text-white/70 sm:left-5">
                <span className="h-2 w-2 rounded-full bg-[#ff5a6e] motion-safe:animate-pulse" /> Rec
              </span>
              <span className="v4-label absolute right-4 top-3 text-[0.6875rem] text-white/50 sm:right-5">2:14 / 4K</span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
              <p className="type-display text-[clamp(1.5rem,3vw,2.75rem)] leading-[1.05] [font-variation-settings:'wdth'_112]">From complexity to clarity</p>
              <p className="v4-label mt-2 text-[0.6875rem] text-white/55">Genius Lab, product film, 2:14</p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Play video: Genius Lab in action"
              className="press absolute left-1/2 top-1/2 inline-flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/40 bg-void/40 text-white backdrop-blur-md transition-[background-color,border-color] duration-300 hover:border-cyan hover:bg-cyan/15 sm:h-24 sm:w-24"
            >
              <span className="absolute -inset-3 border border-white/15 motion-safe:animate-ping" aria-hidden="true" />
              <Play size={28} weight="fill" className="translate-x-0.5" />
            </button>

            {open && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-void/90 text-center backdrop-blur-sm" role="dialog" aria-label="Video placeholder">
                <p className="type-wide text-xl font-medium">The product film is coming soon.</p>
                <p className="max-w-[40ch] text-white/60">This frame is a placeholder for the Genius Lab video.</p>
                <button type="button" onClick={() => setOpen(false)} className="press v4-label mt-2 inline-flex h-10 items-center gap-2 border border-white/30 px-4 hover:border-white">
                  <X size={14} /> Close
                </button>
              </div>
            )}
          </div>

          {/* Chapters as a scrubber. */}
          <div className="relative mt-6">
            <div className="relative h-px bg-white/15" aria-hidden="true">
              {CHAPTERS.map((c) => (
                <span key={c.t} className="absolute -top-1.5 h-3 w-px bg-cyan" style={{ left: `${c.at * 100}%` }} />
              ))}
            </div>
            <ol className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-3">
              {CHAPTERS.map((c) => (
                <li key={c.t} className="flex items-baseline gap-3">
                  <span className="type-mono text-[0.75rem] text-cyan">{c.t}</span>
                  <span className="text-[0.9375rem] text-white/80">{c.name}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
