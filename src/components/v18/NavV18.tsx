"use client";

import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/v2/ui";

const LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "Genius Portal", href: "#portal" },
  { label: "Intelligence", href: "#intelligence" },
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
];

/** Transparent over the navy hero; condenses into a white bar once the page moves. */
export function NavV18() {
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

  const light = scrolled && !open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500 ease-[var(--out)] ${
          light ? "bg-white/95 shadow-[0_1px_0_var(--rule),0_10px_30px_-20px_rgb(14_18_51/0.35)] backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className={`mx-auto flex max-w-[1360px] items-center justify-between gap-6 px-5 transition-[height] duration-500 ease-[var(--out)] sm:px-8 ${scrolled ? "h-[60px]" : "h-[76px]"}`}>
          <a href="#top" aria-label="Genius Lab, home" className={`relative block shrink-0 transition-transform duration-500 ease-[var(--out)] ${scrolled ? "scale-[0.92]" : ""} origin-left`}>
            <span className={`block transition-opacity duration-300 ${light ? "opacity-0" : "opacity-100"}`}>
              <BrandLogo tone="white" className="h-[18px] w-auto" />
            </span>
            <span className={`absolute inset-0 block transition-opacity duration-300 ${light ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
              <BrandLogo tone="navy" className="h-[18px] w-auto" />
            </span>
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className={`rounded-[6px] px-3 py-2 text-[0.875rem] font-semibold transition-colors ${light ? "text-(--ink-2) hover:bg-(--grey) hover:text-(--ink)" : "on-navy text-white/75 hover:bg-white/[0.06] hover:text-white"}`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
            <a href="#action" className={`v18-btn v18-btn-sm hidden sm:inline-flex ${light ? "v18-btn-ghost" : "v18-btn-ghost-dark on-navy"}`}>
              Watch demo
            </a>
            <a href="#contact" className="v18-btn v18-btn-sm v18-btn-ember">
              Book a demo
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="v18-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-[8px] lg:hidden ${light ? "text-(--ink) shadow-[inset_0_0_0_1px_var(--rule-2)]" : "on-navy text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.3)]"}`}
            >
              {open ? <X size={18} /> : <List size={18} />}
            </button>
          </div>
        </div>
      </header>

      <div
        id="v18-menu"
        inert={!open}
        className={`on-navy fixed inset-0 z-40 bg-(--navy) pt-[76px] text-white transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <ul className="px-5 pt-4 sm:px-8">
          {LINKS.map((l, i) => (
            <li key={l.label} className="border-b border-white/10">
              <a href={l.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between py-4 text-[1.5rem] font-bold tracking-[-0.02em]">
                {l.label}
                <span className="v18-label text-white/40">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="px-5 pt-8 sm:px-8">
          <a href="#action" onClick={() => setOpen(false)} className="v18-btn v18-btn-ghost-dark w-full">
            Watch demo
          </a>
        </div>
      </div>
    </>
  );
}
