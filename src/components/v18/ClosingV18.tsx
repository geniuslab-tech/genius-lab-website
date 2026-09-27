"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Quotes, X } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/v2/ui";
import { ConsoleFrame, PortalConsole } from "./PortalConsole";
import { SectionHead } from "./ui";

const CHAPTERS = [
  { t: "00:00", name: "Connecting the systems" },
  { t: "00:48", name: "Building the Second Brain" },
  { t: "01:32", name: "Agents at work" },
];

export function ActionV18() {
  const [open, setOpen] = useState(false);
  const close = useRef<HTMLButtonElement>(null);
  const play = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section id="action" className="scroll-mt-16 bg-white py-24 sm:py-32" aria-labelledby="v18-action-title">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        <SectionHead id="v18-action-title" index="07" label="Product film" title="Genius Lab in action." lead="Two minutes from scattered systems to an agent answering a CFO's question." />

        <div className="mt-14 lg:mt-16" data-rv="">
          <div className="relative overflow-hidden rounded-[18px] bg-(--navy) shadow-[0_50px_100px_-50px_rgb(16_20_64/0.7)]">
            <div className="pointer-events-none px-[6%] pt-[5%] opacity-50" aria-hidden="true">
              <ConsoleFrame>
                <PortalConsole screen="dashboards" live={false} />
              </ConsoleFrame>
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--navy)_8%,rgb(16_20_64/0.55)_55%,rgb(16_20_64/0.25))]" aria-hidden="true" />
            <button
              ref={play}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Play video: Genius Lab in action"
              className="on-navy absolute left-1/2 top-[42%] inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-(--ember) text-[#1a1205] shadow-[0_20px_50px_-10px_rgb(242_154_31/0.7)] transition-transform duration-300 hover:scale-105 active:scale-95 sm:h-24 sm:w-24"
            >
              <Play size={28} weight="fill" className="translate-x-0.5" aria-hidden="true" />
            </button>
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-10">
              <p className="v18-display text-[clamp(1.25rem,3vw,2.5rem)]">From complexity to clarity</p>
              <p className="v18-label mt-2 text-white/60">Genius Lab product film · 2:14</p>
            </div>

            {open && (
              <div className="on-navy absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-(--navy)/95 p-6 text-center text-white" role="dialog" aria-modal="true" aria-label="Video placeholder">
                <p className="text-[1.25rem] font-bold">The product film is coming soon.</p>
                <p className="max-w-[40ch] text-white/70">This frame is a placeholder for the Genius Lab video.</p>
                <button
                  ref={close}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    play.current?.focus();
                  }}
                  className="v18-btn v18-btn-sm v18-btn-ghost-dark mt-2"
                >
                  <X size={14} aria-hidden="true" /> Close
                </button>
              </div>
            )}
          </div>

          <ol className="mt-4 grid gap-3 sm:grid-cols-3">
            {CHAPTERS.map((c, i) => (
              <li key={c.t} className="flex items-center gap-4 rounded-[12px] bg-(--grey) px-5 py-4 shadow-[inset_0_0_0_1px_var(--rule)]">
                <span className={`v18-mono text-[0.8125rem] ${i === 0 ? "text-(--ember-ink)" : "text-(--sky-ink)"}`}>{c.t}</span>
                <span className="font-semibold">{c.name}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Client voices: labelled placeholders until approved quotes exist. */}
        <div id="clients" className="mt-24 scroll-mt-24" data-rv="">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h3 className="text-[1.5rem] font-bold tracking-[-0.02em]">What our clients say</h3>
            <p className="v18-label text-(--ink-3)">Placeholders · approved client quotes will replace these</p>
          </div>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {["CFO · multi-entity group", "Operating Partner · investment firm", "COO · operating company"].map((role, i) => (
              <li key={role} className={`flex flex-col rounded-[16px] p-6 ${i === 0 ? "bg-(--navy) text-white" : "bg-(--grey) shadow-[inset_0_0_0_1px_var(--rule)]"}`}>
                <Quotes size={26} weight="fill" className={i === 0 ? "text-(--ember)" : "text-(--rule-2)"} aria-hidden="true" />
                <p className={`mt-5 text-[1rem] font-semibold leading-[1.55] ${i === 0 ? "text-white/80" : "text-(--ink-2)"}`}>Quote placeholder. An approved client statement appears here.</p>
                <span className="mt-4 grid gap-2" aria-hidden="true">
                  <span className={`h-2 w-full rounded-full ${i === 0 ? "bg-white/10" : "bg-(--grey-2)"}`} />
                  <span className={`h-2 w-2/3 rounded-full ${i === 0 ? "bg-white/10" : "bg-(--grey-2)"}`} />
                </span>
                <p className={`v18-label mt-6 border-t pt-4 ${i === 0 ? "border-white/15 text-white/60" : "border-(--rule) text-(--ink-3)"}`}>{role} · placeholder</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function CtaV18() {
  return (
    <section id="contact" className="v18-band on-navy scroll-mt-16 py-24 sm:py-32" aria-labelledby="v18-cta-title">
      <div className="mx-auto grid max-w-[1360px] gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8" data-rv="">
          <p className="v18-label flex items-center gap-3 text-white/60">
            <span className="h-px w-8 bg-(--ember)" aria-hidden="true" />
            One partner. One platform. One source of truth.
          </p>
          <h2 id="v18-cta-title" className="v18-display mt-6 max-w-[18ch] text-[clamp(2.25rem,5vw,4.25rem)]">
            Turn your business knowledge into intelligent systems.
          </h2>
          <p className="text-pretty mt-7 max-w-[56ch] text-[1.125rem] leading-[1.7] text-white/70">
            Tell us where your systems and data stand today. We&rsquo;ll show you how Genius Lab turns them into one intelligence and execution layer, fully managed.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end" data-rv="" style={{ ["--rd" as string]: "120ms" }}>
          <a href="#" className="v18-btn v18-btn-lg v18-btn-ember">
            Talk to us
          </a>
          <a href="#action" className="v18-btn v18-btn-lg v18-btn-ghost-dark">
            Watch it in action
          </a>
        </div>
      </div>
    </section>
  );
}

const COLUMNS = [
  { title: "Platform", links: ["Data Engineering", "Analytics", "Business Intelligence", "Artificial Intelligence"] },
  { title: "Genius", links: ["Second Brain", "AI Agents", "Genius Portal"] },
  { title: "Company", links: ["About", "Careers", "Contact"] },
];

export function FooterV18() {
  return (
    <footer className="on-navy border-t border-white/10 bg-(--navy-deep) text-white">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-5 pb-12 pt-16 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <BrandLogo tone="white" className="h-5 w-auto" />
          <p className="mt-5 max-w-[34ch] leading-[1.7] text-white/60">Connected systems, unified data and intelligence for the decisions that matter.</p>
        </div>
        {COLUMNS.map((c, i) => (
          <nav key={c.title} aria-label={c.title} className={`md:col-span-2 ${i === 0 ? "md:col-start-7" : ""}`}>
            <h2 className="v18-label text-white/50">{c.title}</h2>
            <ul className="mt-5 space-y-3">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[0.9375rem] text-white/75 transition-colors hover:text-white">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto flex max-w-[1360px] flex-col gap-3 border-t border-white/10 px-5 py-6 text-[0.8125rem] text-white/55 sm:flex-row sm:justify-between sm:px-8">
        <span>&copy; 2026 Genius Lab Technology. Figures, dashboards and client marks shown are illustrative.</span>
        <span className="flex gap-6">
          <a href="#" className="hover:text-white">
            Privacy
          </a>
          <a href="#" className="hover:text-white">
            Terms
          </a>
        </span>
      </div>
    </footer>
  );
}
