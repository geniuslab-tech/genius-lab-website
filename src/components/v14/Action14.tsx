"use client";

import { useEffect, useRef, useState } from "react";
import { Head, Section } from "./ui";

const CHAPTERS = [
  { t: "00:00", name: "Connecting the systems" },
  { t: "00:48", name: "Building the Second Brain" },
  { t: "01:32", name: "Agents at work" },
];

export function Action14() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    playRef.current?.focus();
  };

  return (
    <Section id="action" n="09" label="Product film" titleId="v14-action-title">
      <Head
        id="v14-action-title"
        title="Genius Lab in action."
        lead={<>Two minutes from scattered systems to an agent answering a CFO&rsquo;s question.</>}
      />

      <div className="relative aspect-[4/3] overflow-hidden bg-black text-white sm:aspect-[16/9]">
        <p className="v14-mono absolute left-4 top-4 sm:left-6">Frame 0001 · placeholder</p>
        <p className="v14-mono absolute right-4 top-4 sm:right-6">2:14</p>
        <p aria-hidden="true" className="v14-display absolute inset-x-4 bottom-4 text-[clamp(2.75rem,9vw,9.5rem)] sm:inset-x-6 sm:bottom-6">
          From complexity
          <br />
          <span className="text-[#1f3bff]">to clarity</span>
        </p>
        <button
          ref={playRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Play video: Genius Lab in action"
          className="v14-btn v14-btn--u v14-btn--onk absolute right-4 top-1/2 -translate-y-1/2 sm:right-6"
        >
          <span className="v14-display text-[2.5rem] normal-case tracking-[-0.03em] sm:text-[3.5rem]">Play</span>
          <span className="text-[1.5rem]" aria-hidden="true">
            &#9654;
          </span>
        </button>

        {open ? (
          <div role="dialog" aria-modal="true" aria-label="Video placeholder" className="absolute inset-0 z-10 flex flex-col items-start justify-center gap-4 bg-[#1f3bff] px-6 text-white sm:px-12">
            <p className="v14-mono">Status: not yet published</p>
            <p className="v14-head text-[clamp(2rem,5vw,4.5rem)]">The product film is coming soon.</p>
            <p className="max-w-[40ch]">This frame is a placeholder for the Genius Lab video.</p>
            <button ref={closeRef} type="button" onClick={close} className="v14-btn v14-btn--w mt-2">
              <span>Close</span>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        ) : null}
      </div>

      <ol className="grid gap-[2px] border-t-2 border-black bg-black sm:grid-cols-3" aria-label="Chapters">
        {CHAPTERS.map((c) => (
          <li key={c.t} className="v14-inv flex items-baseline gap-4 bg-white px-4 py-4 sm:px-6">
            <span className="v14-mono">{c.t}</span>
            <span className="font-semibold">{c.name}</span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
