"use client";

import { useEffect, useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/v2/ui";
import { MagButton } from "./Interactive";

const LINKS = [
  { label: "Platform", href: "#layers" },
  { label: "Second Brain", href: "#brain" },
  { label: "Genius Portal", href: "#portal" },
  { label: "Solutions", href: "#segments" },
  { label: "In action", href: "#action" },
];

/** Reads the tone of whatever sits under a given y: the innermost `[data-v23-tone]` wins. */
export function toneAt(y: number) {
  let tone = "dark";
  for (const el of document.querySelectorAll<HTMLElement>("[data-v23-tone]")) {
    const r = el.getBoundingClientRect();
    if (r.top <= y && r.bottom > y) tone = el.dataset.v23Tone ?? tone;
  }
  return tone;
}

/** The bar follows the page: light on dark over the aurora, dark on light once the page has brightened. */
export function Nav() {
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const t = toneAt(32);
      if (el.dataset.tone !== t) el.dataset.tone = t;
      el.dataset.scrolled = window.scrollY > 8 ? "1" : "0";
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    // Scroll-driven sections change tone without scrolling past a boundary; a slow poll catches it.
    const poll = window.setInterval(measure, 700);
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      window.clearInterval(poll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header ref={bar} className="v23-nav" data-tone="dark" data-scrolled="0">
      <div className="v23-wrap flex h-16 items-center gap-6">
        <a href="#top" aria-label="Genius Lab, home" className="relative block h-[16px] w-[131px] shrink-0">
          <span className="v23-nav-logo-w absolute inset-0">
            <BrandLogo tone="white" className="h-[16px] w-auto" />
          </span>
          <span className="v23-nav-logo-n absolute inset-0">
            <BrandLogo tone="navy" className="h-[16px] w-auto" />
          </span>
        </a>
        <nav aria-label="Primary" className="ml-6 hidden lg:block">
          <ul className="flex items-center gap-7">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-[0.875rem] text-(--tx-2) transition-colors hover:text-(--tx)">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <a href="#contact" className="hidden px-3 text-[0.875rem] text-(--tx-2) transition-colors hover:text-(--tx) md:inline">
            Contact sales
          </a>
          <MagButton href="#contact" size="sm" className="hidden sm:inline-flex">
            Book a demo
          </MagButton>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="v23-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-(--line-2) text-(--tx) lg:hidden"
          >
            {open ? <X size={17} aria-hidden="true" /> : <List size={17} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <div id="v23-menu" className={`v23-menu lg:hidden ${open ? "is-open" : ""}`} inert={!open}>
        <ul className="v23-wrap grid gap-1 py-4">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a href={l.href} onClick={() => setOpen(false)} className="block border-b border-(--line) py-3.5 text-[1.125rem] font-medium">
                {l.label}
              </a>
            </li>
          ))}
          <li className="pt-5">
            <MagButton href="#contact" onClick={() => setOpen(false)}>
              Book a demo
            </MagButton>
          </li>
        </ul>
      </div>
    </header>
  );
}
