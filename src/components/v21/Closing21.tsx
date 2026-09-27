"use client";

import { useEffect, useRef, useState } from "react";
import { Play, X } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/v2/ui";
import { TERRAIN21, T_H, T_W } from "./terrain21";
import { Btn, Eyebrow, Illustrative, Lines, SectionHead } from "./ui";
import { rd, wrap } from "./shared";

const CHAPTERS = [
  { t: "00:00", name: "Connecting the systems" },
  { t: "00:48", name: "Building the Second Brain" },
  { t: "01:32", name: "Agents at work" },
];

export function Film21() {
  const [open, setOpen] = useState(false);
  const close = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section id="film" className="relative scroll-mt-20 py-20 sm:py-28" aria-labelledby="v21-film-title">
      <div className={wrap}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead className="lg:col-span-7" label="Product film" id="v21-film-title" lines={["Genius Lab in action."]} />
          <p data-rv="up" style={rd(120)} className="v21-lead max-w-[44ch] lg:col-span-5 lg:pb-2">
            Two minutes from scattered systems to an agent answering a CFO&rsquo;s question.
          </p>
        </div>

        <div data-rv="up" className="mt-12 lg:mt-16">
          <div className="v21-frame">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[17px] bg-[var(--ink)] sm:aspect-[16/9]">
              <svg viewBox={`0 0 ${T_W} ${T_H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true" fill="none">
                {TERRAIN21.map((t, i) => (
                  <path key={i} d={t.d} stroke={t.index ? "rgb(233 163 131 / 0.45)" : "rgb(244 241 236 / 0.14)"} strokeWidth={t.index ? 1.1 : 0.8} vectorEffect="non-scaling-stroke" />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col justify-between p-6 text-[#f4f1ec] sm:p-10">
                <p className="v21-label text-[#c9c3d6]!">Genius Lab · product film · 2:14</p>
                <div className="flex items-end justify-between gap-6">
                  <p className="v21-display max-w-[14ch] text-[clamp(1.75rem,4vw,3.25rem)]">
                    From complexity to <em className="text-[#e9a383]!">clarity.</em>
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Play video: Genius Lab in action"
                    className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#f4f1ec] text-[var(--ink)] shadow-[0_18px_40px_-16px_rgb(0_0_0/0.6)] transition-transform duration-300 hover:scale-[1.04] active:scale-95 sm:h-20 sm:w-20"
                  >
                    <Play size={26} weight="fill" className="translate-x-0.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
              {open && (
                <div role="dialog" aria-modal="true" aria-label="Video placeholder" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--ink)]/95 p-6 text-center text-[#f4f1ec]">
                  <p className="v21-display text-[1.75rem]">The product film is coming soon.</p>
                  <p className="max-w-[40ch] text-[#cfcbd8]">This frame is a placeholder for the Genius Lab video.</p>
                  <button ref={close} type="button" onClick={() => setOpen(false)} className="v21-btn v21-btn-ghost-dark v21-btn-sm mt-3">
                    <X size={14} aria-hidden="true" /> Close
                  </button>
                </div>
              )}
            </div>
          </div>
          <ol className="mt-4 grid gap-2 sm:grid-cols-3">
            {CHAPTERS.map((c) => (
              <li key={c.t} className="flex items-center gap-4 rounded-[14px] bg-[var(--paper)] px-5 py-4 shadow-[0_0_0_1px_var(--rule-soft)]">
                <span className="v21-mono text-[0.8125rem] text-[var(--terra-ink)]">{c.t}</span>
                <span className="font-semibold text-[var(--ink)]">{c.name}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** Client voices are placeholders until approved quotes exist. Nothing here is a real testimonial. */
const SLOTS = ["CFO, multi-entity group", "Operating partner, investment firm", "COO, operating company"];

export function Voices21() {
  return (
    <section id="clients" className="relative scroll-mt-20 pb-20 sm:pb-28" aria-labelledby="v21-voices-title">
      <div className={wrap}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHead label="Clients" id="v21-voices-title" lines={["In our clients’ words."]} />
          <Illustrative>Placeholders · approved client quotes to follow</Illustrative>
        </div>
        <ul className="mt-10 grid gap-3 md:grid-cols-3">
          {SLOTS.map((s, i) => (
            <li key={s} data-rv="up" style={rd(i * 80)} className="flex min-h-[220px] flex-col justify-between rounded-[20px] border border-dashed border-[#c9bfae] p-6 sm:p-7">
              <p className="v21-serif text-[1.3rem] leading-[1.4] text-[var(--ink-3)]">&ldquo;An approved quote from a client will appear here.&rdquo;</p>
              <p className="mt-8 flex items-center gap-3 border-t border-[var(--rule)] pt-4">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] text-[0.75rem] font-semibold text-[var(--ink-3)]" aria-hidden="true">
                  ?
                </span>
                <span>
                  <span className="block text-[0.9375rem] font-semibold text-[var(--ink)]">Client name</span>
                  <span className="block text-[0.8125rem] text-[var(--ink-3)]">{s} · placeholder</span>
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Cta21() {
  return (
    <section id="contact" className="relative scroll-mt-20 bg-[var(--ink)] py-20 text-[#f4f1ec] sm:py-28" aria-labelledby="v21-cta-title">
      <div className={`${wrap} grid gap-10 lg:grid-cols-12 lg:items-end`}>
        <div className="lg:col-span-8">
          <Eyebrow dark>One partner. One platform. One source of truth.</Eyebrow>
          <Lines id="v21-cta-title" lines={["Turn your business knowledge", "into intelligent systems."]} className="v21-display mt-6 text-[clamp(2.2rem,5vw,4.25rem)]" />
          <p data-rv="up" style={rd(120)} className="mt-7 max-w-[56ch] text-[1.0625rem] leading-[1.7] text-[#cfcbd8] sm:text-[1.125rem]">
            Tell us where your systems and data stand today. We&rsquo;ll show you how Genius Lab turns them into one intelligence and execution layer, fully managed.
          </p>
        </div>
        <div data-rv="up" style={rd(200)} className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
          <Btn href="#" tone="cream" arrow>
            Talk to us
          </Btn>
          <Btn href="#film" tone="ghost-dark">
            Watch it in action
          </Btn>
        </div>
      </div>
    </section>
  );
}

const COLUMNS = [
  { title: "Capabilities", links: ["Data Engineering", "Analytics", "Business Intelligence", "Artificial Intelligence"] },
  { title: "Genius", links: ["Second Brain", "AI Agents", "Genius Portal"] },
  { title: "Company", links: ["About", "Careers", "Contact"] },
];

export function Footer21() {
  return (
    <footer className="border-t border-white/10 bg-[#0b0e30] text-[#f4f1ec]">
      <div className={`${wrap} grid gap-12 pb-12 pt-16 md:grid-cols-12`}>
        <div className="md:col-span-5">
          <BrandLogo tone="white" className="h-[18px] w-auto" />
          <p className="mt-5 max-w-[34ch] leading-[1.7] text-[#bdb8cc]">Connected systems, unified data and intelligence for the decisions that matter.</p>
        </div>
        {COLUMNS.map((c, i) => (
          <nav key={c.title} aria-label={c.title} className={`md:col-span-2 ${i === 0 ? "md:col-start-7" : ""}`}>
            <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[#a9a4bb]">{c.title}</h2>
            <ul className="mt-5 space-y-3">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[0.9375rem] text-[#dcd8e4] transition-colors hover:text-white">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className={`${wrap} flex flex-col gap-3 border-t border-white/10 py-6 text-[0.8125rem] text-[#a9a4bb] sm:flex-row sm:justify-between`}>
        <span>&copy; 2026 Genius Lab Technology. Figures, dashboards and client marks shown are illustrative.</span>
        <span className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
        </span>
      </div>
    </footer>
  );
}
