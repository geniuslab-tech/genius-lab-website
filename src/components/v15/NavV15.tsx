"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/v2/ui";
import { ROMAN } from "./ui";

const LINKS = [
  { label: "The Collection", href: "#layers" },
  { label: "Second Brain", href: "#brain" },
  { label: "Genius Portal", href: "#portal" },
  { label: "Solutions", href: "#segments" },
];

/** A quiet bar: transparent over the hero, a warm-black ground with one hairline once the page moves. */
export function NavV15() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${
          scrolled && !open ? "bg-[#0c0b0a]/95 shadow-[0_1px_0_rgb(216_194_157/0.14)]" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-10 lg:px-14">
          <a href="#" aria-label="Genius Lab, home" className="relative z-10 block shrink-0">
            <BrandLogo tone="white" className="h-[14px] w-auto sm:h-[15px]" />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-11">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="lx-caps text-[#ede7dc]/75 transition-colors duration-700 hover:text-[#ede7dc]">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-8">
            <a href="#contact" className="lx-link hidden sm:inline-flex">
              Enquire
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="v15-menu"
              className="lx-caps flex h-11 items-center gap-3 text-[#ede7dc] lg:hidden"
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span className="relative block h-2 w-6" aria-hidden="true">
                <span className={`absolute left-0 top-0 h-px w-6 bg-[#d8c29d] transition-transform duration-700 ${open ? "translate-y-1 rotate-[20deg]" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-px w-6 bg-[#d8c29d] transition-transform duration-700 ${open ? "-translate-y-[3px] -rotate-[20deg]" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="v15-menu"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-0 z-40 bg-[#0c0b0a] pt-28 transition-[clip-path] duration-[1100ms] ease-[cubic-bezier(0.77,0,0.18,1)] lg:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <ul className="px-5 sm:px-10">
          {LINKS.map((l, i) => (
            <li key={l.label} className="border-b border-[#d8c29d]/15">
              <a href={l.href} onClick={() => setOpen(false)} className="flex items-baseline gap-5 py-5">
                <span className="lx-num w-8 text-[0.95rem]">{ROMAN[i]}</span>
                <span className="lx-display text-[2.1rem]">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="px-5 pt-10 sm:px-10">
          <a href="#contact" onClick={() => setOpen(false)} className="lx-btn">
            Enquire
          </a>
        </div>
      </div>
    </>
  );
}
