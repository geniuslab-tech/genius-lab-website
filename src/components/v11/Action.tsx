"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { EVENTS } from "./data";
import { Pane, SECTION, SectionHead, Tag, WRAP } from "./ui";

const CHAPTERS = [
  { t: "00:00", name: "Connecting the systems" },
  { t: "00:48", name: "Building the Second Brain" },
  { t: "01:32", name: "Agents at work" },
];

/** A faint character field as the film's cover frame. Deterministic, so server and client agree. */
const FIELD = Array.from({ length: 9 }, (_, r) =>
  Array.from({ length: 64 }, (_, c) => {
    const v = (Math.sin(r * 1.7 + c * 0.35) + Math.cos(c * 0.21 - r * 0.9)) * 0.5;
    return v > 0.55 ? "▓" : v > 0.2 ? "▒" : v > -0.2 ? "░" : " ";
  }).join(""),
);

export function Action() {
  const [open, setOpen] = useState(false);
  const play = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onFilm = () => setOpen(true);
    window.addEventListener(EVENTS.film, onFilm);
    return () => window.removeEventListener(EVENTS.film, onFilm);
  }, []);

  useEffect(() => {
    if (open) close.current?.focus();
  }, [open]);

  const shut = () => {
    setOpen(false);
    requestAnimationFrame(() => play.current?.focus());
  };

  return (
    <section id="action" tabIndex={-1} className={SECTION} aria-labelledby="v11-action-title">
      <div className={WRAP}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <SectionHead index="09" cmd="genius play film.mp4" id="v11-action-title" title="Genius Lab in action." className="lg:col-span-7" />
          <p data-boot="" className="max-w-[48ch] text-[15.5px] leading-[1.75] text-(--fg-2) lg:col-span-5">
            Two minutes from scattered systems to an agent answering a CFO&rsquo;s question.
          </p>
        </div>

        <Pane title="film.mp4" meta={<Tag>placeholder</Tag>} className="mt-12" bodyClass="">
          <div className="v11-cq relative aspect-[4/3] overflow-hidden bg-(--bg) sm:aspect-[16/9]">
            <div
              className="v11-ascii absolute inset-0 flex flex-col justify-center text-(--amber) opacity-[0.13]"
              style={{ "--cols": 64, "--max": "40px", lineHeight: 1.05 } as CSSProperties}
              aria-hidden="true"
            >
              {FIELD.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--bg)_5%,transparent_70%)]" aria-hidden="true" />

            <button
              ref={play}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Play video: Genius Lab in action"
              className="group absolute left-1/2 top-[42%] flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 border border-(--amber) bg-(--bg)/80 px-5 py-3.5 text-(--amber) backdrop-blur transition-colors hover:bg-(--amber) hover:text-[#1a1206]"
            >
              <span className="v11-term text-[15px]" aria-hidden="true">
                [ &gt; play ]
              </span>
            </button>

            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5 sm:p-8">
              <div>
                <p className="v11-display text-[clamp(1.3rem,3vw,2.25rem)] text-(--fg)">From complexity to clarity</p>
                <p className="v11-term mt-1 text-[12px] text-(--fg-3)">Genius Lab, product film &middot; frame is a placeholder</p>
              </div>
            </div>

            {open && (
              <div
                role="dialog"
                aria-modal="false"
                aria-labelledby="v11-film-msg"
                onKeyDown={(e) => e.key === "Escape" && shut()}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-(--bg)/92 px-6 text-center backdrop-blur-sm"
              >
                <p className="v11-term text-[12.5px] text-(--fg-3)">
                  <span className="text-(--warn)">404</span> film.mp4
                </p>
                <p id="v11-film-msg" className="v11-display text-[1.35rem] text-(--fg)">
                  The product film is coming soon.
                </p>
                <p className="max-w-[44ch] text-(--fg-2)">This frame is a placeholder for the Genius Lab video.</p>
                <button ref={close} type="button" onClick={shut} className="v11-btn v11-btn-ghost mt-3">
                  close <kbd>esc</kbd>
                </button>
              </div>
            )}
          </div>
          <ol className="v11-term grid border-t border-(--rule) text-[13px] sm:grid-cols-3" aria-label="Chapters">
            {CHAPTERS.map((c, i) => (
              <li key={c.t} className="flex items-center gap-4 border-(--rule) px-5 py-4 max-sm:[&:not(:last-child)]:border-b sm:[&:not(:last-child)]:border-r">
                <span className={i === 0 ? "text-(--amber)" : "text-(--ice)"}>{c.t}</span>
                <span className="text-(--fg)">{c.name}</span>
              </li>
            ))}
          </ol>
        </Pane>
      </div>
    </section>
  );
}
