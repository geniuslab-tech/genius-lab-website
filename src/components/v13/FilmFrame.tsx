"use client";

import { useState } from "react";
import { Play, X } from "@phosphor-icons/react";

/** Placeholder for the product film. It opens a notice rather than pretending to play. */
export function FilmFrame() {
  const [open, setOpen] = useState(false);
  return (
    <div className="v13-film relative mt-14 aspect-[16/10] w-full overflow-hidden sm:aspect-video">
      <div className="absolute inset-0 grid grid-rows-[auto_1fr_auto] p-5 sm:p-8">
        <p className="v13-label flex justify-between gap-4">
          <span>Product film</span>
          <span>In production</span>
        </p>
        <div className="grid place-items-center">
          <button type="button" onClick={() => setOpen(true)} aria-label="Play video: Genius Lab in action" className="v13-play">
            <Play size={26} weight="fill" aria-hidden="true" />
          </button>
        </div>
        <p className="v13-display text-[clamp(1.375rem,3.4cqw,2.25rem)]">From complexity to clarity</p>
      </div>
      {open && (
        <div className="v13-film-note absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center" role="dialog" aria-label="Video placeholder">
          <p className="text-[1.25rem] font-semibold">The product film is coming soon.</p>
          <p className="v13-muted max-w-[40ch]">This frame is a placeholder for the Genius Lab video.</p>
          <button type="button" onClick={() => setOpen(false)} className="v13-chip mt-2 inline-flex items-center gap-2" autoFocus>
            <X size={13} aria-hidden="true" /> Close
          </button>
        </div>
      )}
    </div>
  );
}
