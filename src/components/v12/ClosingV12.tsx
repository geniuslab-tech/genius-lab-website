"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, X } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/v2/ui";
import { Magnetic, SectionHead, Tile, TileHead } from "./ui";

const CHAPTERS = [
  { t: "00:00", name: "Connecting the systems" },
  { t: "00:48", name: "Building the Second Brain" },
  { t: "01:32", name: "Agents at work" },
];

export function ActionV12() {
  const [open, setOpen] = useState(false);
  const [chapter, setChapter] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <section id="action" className="scroll-mt-24 py-20 sm:py-28" aria-labelledby="v12-action-title">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <SectionHead
          id="v12-action-title"
          index="08"
          label="Product film"
          title="Genius Lab in action."
          lead={<>Two minutes from scattered systems to an agent answering a CFO&rsquo;s question.</>}
        />
        <div className="mt-12 grid gap-3 sm:gap-4 lg:grid-cols-12">
          <Tile dark className="relative overflow-hidden lg:col-span-8">
            <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
              {/* Poster: a quiet grid and the three chapters as a timeline. */}
              <div
                className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgb(255_255_255/0.06)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:40px_40px]"
                aria-hidden="true"
              />
              <div className="absolute inset-x-5 top-5 flex items-center justify-between sm:inset-x-7 sm:top-7">
                <BrandLogo tone="white" className="h-[13px] w-auto" />
                <span className="v12-mono text-[0.75rem] text-white/50">2:14</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Play video: Genius Lab in action"
                className="group absolute left-1/2 top-1/2 inline-flex h-18 w-18 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-(--lime) text-(--ink) transition-transform duration-500 ease-[var(--spring)] hover:scale-110 active:scale-95 sm:h-22 sm:w-22"
              >
                <Play size={26} weight="fill" className="translate-x-0.5" aria-hidden="true" />
              </button>
              <div className="absolute inset-x-5 bottom-5 sm:inset-x-7 sm:bottom-7">
                <p className="text-[clamp(1.25rem,2.6vw,2rem)] font-semibold tracking-[-0.035em] text-white">From complexity to clarity</p>
                <div className="mt-4 grid grid-cols-3 gap-1.5" aria-hidden="true">
                  {CHAPTERS.map((c, i) => (
                    <span key={c.t} className="h-1 overflow-hidden rounded-full bg-white/15">
                      <span className={`block h-full rounded-full bg-(--lime) transition-[width] duration-700 ease-[var(--out)] ${i <= chapter ? "w-full" : "w-0"}`} />
                    </span>
                  ))}
                </div>
              </div>

              {open && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-(--ink)/95 p-6 text-center text-white" role="dialog" aria-modal="true" aria-label="Video placeholder">
                  <p className="text-[1.25rem] font-semibold tracking-[-0.02em]">The product film is coming soon.</p>
                  <p className="max-w-[40ch] text-white/60">This frame is a placeholder for the Genius Lab video.</p>
                  <button ref={closeRef} type="button" onClick={() => setOpen(false)} className="v12-btn v12-btn-outline-dark mt-3 !h-10">
                    <X size={14} weight="bold" aria-hidden="true" />
                    Close
                  </button>
                </div>
              )}
            </div>
          </Tile>

          <Tile delay={80} className="p-5 sm:p-6 lg:col-span-4">
            <TileHead label="Chapters" right={<span className="v12-mono text-[0.6875rem] text-(--ink-3)">Genius Lab · product film</span>} />
            <ol className="mt-5 grid gap-1.5">
              {CHAPTERS.map((c, i) => (
                <li key={c.t}>
                  <button
                    type="button"
                    aria-pressed={chapter === i}
                    onClick={() => setChapter(i)}
                    className={`flex w-full items-center gap-4 rounded-[12px] px-3.5 py-3.5 text-left transition-colors duration-300 ${chapter === i ? "bg-(--ink) text-white" : "bg-(--ground) hover:bg-(--ground-2)"}`}
                  >
                    <span className={`v12-mono text-[0.75rem] ${chapter === i ? "text-(--lime)" : "text-(--ink-3)"}`}>{c.t}</span>
                    <span className="text-[0.9375rem] font-medium">{c.name}</span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-[0.8125rem] leading-[1.55] text-(--ink-3)">The film is in production. Chapters show what it will cover.</p>
          </Tile>
        </div>
      </div>
    </section>
  );
}

export function CtaV12() {
  return (
    <section id="contact" className="scroll-mt-24 pb-16 pt-8 sm:pb-24" aria-labelledby="v12-cta-title">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <Tile dark className="overflow-hidden p-7 sm:p-12 lg:p-16">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-50 [background-image:linear-gradient(rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.05)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_left,#000,transparent_70%)]"
            aria-hidden="true"
          />
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="v12-label text-white/50">One partner. One platform. One source of truth.</p>
              <h2 id="v12-cta-title" className="v12-display mt-6 max-w-[18ch] text-[clamp(2.25rem,5vw,4.25rem)] text-white">
                Turn your business knowledge into <span className="text-(--lime)">intelligent systems.</span>
              </h2>
              <p className="text-pretty mt-6 max-w-[56ch] text-[1.0625rem] leading-[1.65] text-white/65">
                Tell us where your systems and data stand today. We&rsquo;ll show you how Genius Lab turns them into one intelligence and execution layer, fully managed.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <Magnetic>
                <a href="#" className="v12-btn v12-btn-lime group !h-14 !px-6 !text-base">
                  Talk to us
                  <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#action" className="v12-btn v12-btn-outline-dark !h-14 !px-6 !text-base">
                  Watch it in action
                </a>
              </Magnetic>
            </div>
          </div>
        </Tile>
      </div>
    </section>
  );
}

const COLUMNS = [
  { title: "Capabilities", links: ["Data Engineering", "Analytics", "Business Intelligence", "Artificial Intelligence"] },
  { title: "Genius", links: ["Second Brain", "AI Agents", "Genius Portal"] },
  { title: "Company", links: ["About", "Careers", "Contact"] },
];

export function FooterV12() {
  return (
    <footer className="border-t border-(--rule) bg-white">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 pb-10 pt-14 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <BrandLogo tone="navy" className="h-[17px] w-auto" />
          <p className="mt-5 max-w-[34ch] leading-[1.65] text-(--ink-2)">Connected systems, unified data and intelligence for the decisions that matter.</p>
        </div>
        {COLUMNS.map((c, i) => (
          <nav key={c.title} aria-label={c.title} className={`md:col-span-2 ${i === 0 ? "md:col-start-7" : ""}`}>
            <h2 className="v12-label text-(--ink-3)">{c.title}</h2>
            <ul className="mt-5 space-y-3">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[0.9375rem] text-(--ink-2) transition-colors hover:text-(--ink)">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto flex max-w-[1320px] flex-col gap-3 border-t border-(--rule) px-4 py-6 text-[0.8125rem] text-(--ink-3) sm:flex-row sm:justify-between sm:px-6">
        <span>&copy; 2026 Genius Lab Technology. Figures, dashboards and client marks shown are illustrative.</span>
        <span className="flex gap-6">
          <a href="#" className="hover:text-(--ink)">
            Privacy
          </a>
          <a href="#" className="hover:text-(--ink)">
            Terms
          </a>
        </span>
      </div>
    </footer>
  );
}
