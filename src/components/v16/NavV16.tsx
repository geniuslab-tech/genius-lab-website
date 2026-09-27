"use client";

import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/v2/ui";
import { Button } from "./ui";

const LINKS = [
  { label: "Platform", href: "#layers" },
  { label: "Second Brain", href: "#brain" },
  { label: "AI Agents", href: "#agents" },
  { label: "Genius Portal", href: "#portal" },
  { label: "Solutions", href: "#segments" },
];

export function NavV16() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-300 ${
          scrolled || open ? "bg-[rgb(6_8_24/0.92)] shadow-[0_1px_0_var(--line)]" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8">
          <a href="#top" aria-label="Genius Lab, home" className="block shrink-0">
            <BrandLogo tone="white" className="h-[17px] w-auto" />
          </a>
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-[0.875rem] text-[color:var(--tx-2)] transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <Button href="#contact" size="sm" className="hidden sm:inline-flex">
              Book a demo
            </Button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="v16-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[6px] text-white shadow-[inset_0_0_0_1px_var(--line-2)] lg:hidden"
            >
              {open ? <X size={18} /> : <List size={18} />}
            </button>
          </div>
        </div>
      </header>

      <div
        id="v16-menu"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-0 z-30 bg-[color:var(--g1)] pt-16 transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <ul className="px-5 pt-6 sm:px-8">
          {LINKS.map((l, i) => (
            <li key={l.href} className="border-b border-[color:var(--line)]">
              <a href={l.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-5">
                <span className="v16-label text-[color:var(--ice)]">0{i + 1}</span>
                <span className="v16-display text-[1.625rem]">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="px-5 pt-8 sm:px-8">
          <Button href="#contact" onClick={() => setOpen(false)}>
            Book a demo
          </Button>
        </div>
      </div>
    </>
  );
}
