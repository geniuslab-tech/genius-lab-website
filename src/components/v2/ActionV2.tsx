"use client";

import { useState } from "react";
import { Play, X } from "@phosphor-icons/react";
import { contourAt, contourGenerator, contourPath, hillsAt } from "@/lib/terrain";
import { h2Class } from "./ui";

const CHAPTERS = [
  { t: "00:00", name: "Connecting the systems" },
  { t: "00:48", name: "Building the Second Brain" },
  { t: "01:32", name: "Agents at work" },
];

/** The cover is drawn from the hero's terrain, so the film opens where the page did. */
const COVER = (() => {
  const cols = 160;
  const rows = 90;
  const hills = [
    { x: 0.7, y: 0.45, h: 1, r: 0.2 },
    { x: 0.42, y: 0.72, h: 0.45, r: 0.16 },
    { x: 0.88, y: 0.2, h: 0.35, r: 0.12 },
    { x: 0.2, y: 0.3, h: 0.25, r: 0.18 },
  ];
  const values = new Float64Array(cols * rows);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) values[j * cols + i] = hillsAt(hills, i / cols, j / rows, cols / rows);
  const gen = contourGenerator().size([cols, rows]);
  return Array.from({ length: 12 }, (_, k) => contourPath(contourAt(gen, values, 0.06 + k * 0.075), 10));
})();

export function ActionV2() {
  const [open, setOpen] = useState(false);
  return (
    <section id="action" className="relative scroll-mt-16 py-24 text-navy sm:py-32 lg:py-40" aria-labelledby="v2-action-title">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 id="v2-action-title" data-reveal="up" className={`${h2Class} max-w-[14ch]`}>
            Genius Lab in action.
          </h2>
          <p data-reveal="up" data-delay="100" className="max-w-[40ch] text-lg leading-relaxed text-navy/70">
            Two minutes from scattered systems to an agent answering a CFO&rsquo;s question.
          </p>
        </div>

        <div data-reveal="up" data-delay="120" className="mt-12 lg:mt-16">
          <div className="group relative aspect-[16/9] overflow-hidden bg-navy text-white shadow-[0_50px_100px_-50px_rgb(16_20_64/0.8)] [clip-path:polygon(0_0,calc(100%-28px)_0,100%_28px,100%_100%,0_100%)]">
            {/* Cover. */}
            <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]" aria-hidden="true">
              <defs>
                <radialGradient id="cover-light" cx="0.7" cy="0.45" r="0.6">
                  <stop offset="0" stopColor="#5577ff" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#101440" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="1600" height="900" fill="url(#cover-light)" />
              {COVER.map((d, i) => (
                <path key={i} d={d} fill="none" stroke={i === 9 ? "#8fa4ff" : "white"} strokeOpacity={i === 9 ? 0.9 : 0.1 + i * 0.03} strokeWidth={i === 9 ? 2 : 1} />
              ))}
              <g transform="translate(1120 405)">
                <circle r="10" fill="#5577ff" />
                <circle r="22" fill="none" stroke="#5577ff" strokeOpacity="0.5" />
                <g transform="translate(34 -86)">
                  <rect width="250" height="84" fill="white" />
                  <text x="18" y="26" className="fill-signal-ink text-[14px] font-semibold">AI AGENT</text>
                  <text x="18" y="58" className="fill-navy text-[26px] font-semibold">38.4% margin</text>
                  <text x="18" y="76" className="fill-navy/60 text-[13px]">+1.2 pts vs last quarter</text>
                </g>
              </g>
            </svg>
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_10_37/0.85),transparent_55%)]" aria-hidden="true" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 sm:p-10">
              <div>
                <p className="type-display text-[clamp(1.5rem,3vw,2.75rem)] leading-[1.05] [font-variation-settings:'wdth'_112]">From complexity to clarity</p>
                <p className="type-mono mt-2 text-[0.75rem] text-white/60">Genius Lab, product film, 2:14</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Play video: Genius Lab in action"
              className="press absolute left-1/2 top-1/2 inline-flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/15 text-white shadow-[0_20px_50px_-10px_rgb(0_0_0/0.5),inset_0_1px_0_rgb(255_255_255/0.5)] backdrop-blur-md transition-[background-color,transform] duration-300 hover:scale-105 hover:bg-white/25 sm:h-24 sm:w-24"
            >
              <span className="absolute inset-0 rounded-full border border-white/30 motion-safe:animate-ping" aria-hidden="true" />
              <Play size={30} weight="fill" className="translate-x-0.5" />
            </button>

            {open && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-navy-950/90 text-center backdrop-blur-sm" role="dialog" aria-label="Video placeholder">
                <p className="type-wide text-xl font-medium">The product film is coming soon.</p>
                <p className="max-w-[40ch] text-white/65">This frame is a placeholder for the Genius Lab video.</p>
                <button type="button" onClick={() => setOpen(false)} className="press mt-2 inline-flex h-10 items-center gap-2 border border-white/30 px-4 text-[0.875rem] hover:border-white">
                  <X size={14} /> Close
                </button>
              </div>
            )}
          </div>

          <ol className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-3">
            {CHAPTERS.map((c) => (
              <li key={c.t} className="flex items-baseline gap-3 border-t border-navy/12 pt-3">
                <span className="type-mono text-[0.75rem] text-signal-ink">{c.t}</span>
                <span className="text-[0.9375rem]">{c.name}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
