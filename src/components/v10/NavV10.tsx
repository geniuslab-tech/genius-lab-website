"use client";

import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/v2/ui";
import { CHAPTERS } from "./chapters";

/**
 * A running head, as in a printed report: the brand, the chapter being read,
 * and a hairline that fills as the reader moves through the document.
 */
export function NavV10() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const bar = useRef<HTMLSpanElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(4)})`;
      const line = window.innerHeight * 0.35;
      let idx = -1;
      CHAPTERS.forEach((c, i) => {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= line) idx = i;
      });
      setActive(idx);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const current = active >= 0 ? CHAPTERS[active] : null;

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[color:var(--rule)] bg-[#f6f3ea]">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <a href="#top" aria-label="Genius Lab, back to the cover" className="block shrink-0">
          <BrandLogo tone="navy" className="h-[15px] w-auto sm:h-[17px]" />
        </a>

        <p className="hidden min-w-0 flex-1 items-baseline justify-center gap-3 text-[0.8125rem] text-[color:var(--slate)] md:flex" aria-live="polite">
          {current ? (
            <>
              <span className="tnum font-medium text-[color:var(--ink)]">
                {current.n}
                <span className="text-[color:var(--slate-2)]"> / {CHAPTERS.length}</span>
              </span>
              <span className="truncate">{current.label}</span>
            </>
          ) : (
            <span>Briefing for leadership teams</span>
          )}
        </p>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            ref={toggle}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="v10-contents"
            className="inline-flex h-10 items-center gap-2 px-3 text-[0.875rem] font-medium text-[color:var(--ink)] shadow-[inset_0_0_0_1px_var(--rule)] transition-shadow hover:shadow-[inset_0_0_0_1px_var(--ink)]"
          >
            <span aria-hidden="true" className="flex w-3.5 flex-col gap-[3px]">
              <span className={`h-px bg-current transition-transform duration-300 ${open ? "translate-y-[4px] rotate-45" : ""}`} />
              <span className={`h-px bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
              <span className={`h-px bg-current transition-transform duration-300 ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
            </span>
            Contents
          </button>
          <a
            href="#contact"
            className="hidden h-10 items-center bg-[#101440] px-4 text-[0.875rem] font-medium text-white transition-colors hover:bg-[#1f2566] sm:inline-flex"
          >
            Book a briefing
          </a>
        </div>
      </div>

      {/* Reading progress. */}
      <span className="absolute inset-x-0 -bottom-px block h-[2px] bg-transparent" aria-hidden="true">
        <span ref={bar} className="block h-full origin-left bg-[#101440]" style={{ transform: "scaleX(0)" }} />
      </span>

      <nav
        id="v10-contents"
        aria-label="Contents"
        hidden={!open}
        className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-[color:var(--rule)] bg-[#f6f3ea] shadow-[0_24px_40px_-30px_rgb(16_20_64/0.45)]"
      >
        <div className="wrap grid grid-cols-12 gap-x-6 py-8 sm:py-10">
          <p className="caps col-span-12 mb-6 text-[color:var(--slate)] lg:col-span-2 lg:mb-0">Contents</p>
          <ol className="col-span-12 grid gap-x-10 sm:grid-cols-2 lg:col-span-10">
            {CHAPTERS.map((c, i) => (
              <li key={c.id} className="border-b border-[color:var(--rule-2)]">
                <a
                  href={`#${c.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={i === active ? "location" : undefined}
                  className="group flex items-baseline gap-4 py-3.5"
                >
                  <span className={`tnum w-6 text-[0.8125rem] ${i === active ? "text-[color:var(--brass)]" : "text-[color:var(--slate-2)]"}`}>{c.n}</span>
                  <span className={`serif text-[1.25rem] text-[color:var(--ink)] ${i === active ? "underline decoration-1 underline-offset-4" : "group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4"}`}>
                    {c.label}
                  </span>
                </a>
              </li>
            ))}
          </ol>
          <a href="#contact" onClick={() => setOpen(false)} className="col-span-12 mt-8 inline-flex h-12 items-center justify-center bg-[#101440] px-6 text-[0.9375rem] font-medium text-white sm:hidden">
            Book a briefing
          </a>
        </div>
      </nav>
    </header>
  );
}
