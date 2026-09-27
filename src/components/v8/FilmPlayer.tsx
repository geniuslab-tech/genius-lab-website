"use client";

import { useEffect, useRef, useState } from "react";

/** Play control and the "coming soon" placeholder that replaces the film until it exists. */
export function FilmPlayer() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open) closeRef.current?.focus();
    else if (wasOpen.current) playRef.current?.focus();
    wasOpen.current = open;
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        ref={playRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Play the film: Genius Lab in action"
        className="group absolute left-1/2 top-1/2 inline-flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[color:var(--ink)] text-[color:var(--paper)] transition-[background-color,transform] duration-300 hover:scale-[1.04] hover:bg-[color:var(--red)] active:scale-95 sm:h-28 sm:w-28"
      >
        <span className="absolute inset-[-10px] rounded-full border border-[color:var(--ink)]/40 transition-[inset] duration-500 group-hover:inset-[-16px]" aria-hidden="true" />
        <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 sm:h-9 sm:w-9" aria-hidden="true">
          <path d="M6 4 L20 12 L6 20 Z" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="v8-film-dialog"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[color:var(--paper)]/95 p-6 text-center"
        >
          <p id="v8-film-dialog" className="f-display text-[clamp(1.75rem,3vw,2.5rem)] leading-none">
            The product film is <span className="italic text-[color:var(--red)]">coming soon.</span>
          </p>
          <p className="f-text max-w-[40ch] text-[1.0625rem] text-[color:var(--ink-2)]">This frame is a placeholder for the Genius Lab video.</p>
          <button ref={closeRef} type="button" onClick={() => setOpen(false)} className="btn-line mt-2">
            Close
          </button>
        </div>
      )}
    </>
  );
}
