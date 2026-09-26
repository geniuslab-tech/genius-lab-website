"use client";

import { useState } from "react";
import { Play, X } from "@phosphor-icons/react";
import { AgentOrb } from "@/components/v2/AgentOrb";
import { Heading } from "./ui";

const CHAPTERS = [
  { t: "00:00", name: "Connecting the systems" },
  { t: "00:48", name: "Building the Second Brain" },
  { t: "01:32", name: "Agents at work" },
];

export function ActionV5() {
  const [open, setOpen] = useState(false);
  return (
    <section id="action" className="scroll-mt-12 bg-white py-28 sm:py-40" aria-labelledby="v5-action-title">
      <div className="mx-auto max-w-[1080px] px-5">
        <Heading
          id="v5-action-title"
          eyebrow="Watch the film"
          title="Genius Lab in action."
          lead={<>Two minutes from scattered systems to an agent answering a CFO&rsquo;s question.</>}
        />

        <div data-reveal="up" className="group relative mt-16 aspect-[16/9] overflow-hidden rounded-[28px] bg-black sm:mt-20">
          {/* Cover. */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_45%,#1b3d8f_0%,#0a1330_45%,#000_80%)] transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]" aria-hidden="true" />
          <div className="absolute inset-0 grid place-items-center opacity-90" aria-hidden="true">
            <AgentOrb state="idle" size={220} className="max-sm:scale-75" label="Genius agent in the film cover" />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-24 sm:p-10 sm:pt-32">
            <p className="v5-display text-[clamp(1.5rem,3vw,2.5rem)] text-white">From complexity to clarity</p>
            <p className="mt-1 text-[0.875rem] text-white/60">Genius Lab, product film, 2:14</p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Play video: Genius Lab in action"
            className="absolute bottom-6 right-6 inline-flex h-14 items-center gap-2.5 rounded-full bg-white/90 pl-5 pr-6 text-[1.0625rem] font-medium text-graphite shadow-[0_10px_30px_-10px_rgb(0_0_0/0.5)] backdrop-blur-xl transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97] sm:bottom-10 sm:right-10"
          >
            <Play size={18} weight="fill" aria-hidden="true" />
            Play
          </button>

          {open && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/85 text-center text-white backdrop-blur-md" role="dialog" aria-label="Video placeholder">
              <p className="text-[1.3125rem] font-semibold tracking-[-0.015em]">The product film is coming soon.</p>
              <p className="max-w-[40ch] text-white/65">This frame is a placeholder for the Genius Lab video.</p>
              <button type="button" onClick={() => setOpen(false)} className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-white/15 px-5 text-[0.9375rem] hover:bg-white/25">
                <X size={14} aria-hidden="true" /> Close
              </button>
            </div>
          )}
        </div>

        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {CHAPTERS.map((c) => (
            <li key={c.t} className="text-center">
              <p className="text-[0.875rem] tabular-nums text-graphite-3">{c.t}</p>
              <p className="mt-1 text-[1.0625rem] font-semibold tracking-[-0.01em] text-graphite">{c.name}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
