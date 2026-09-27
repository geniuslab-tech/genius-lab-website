"use client";

import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/v2/ui";
import { Btn } from "./ui";
import { wrap } from "./shared";

const LINKS = [
  { label: "Platform", href: "#capabilities" },
  { label: "Second Brain", href: "#brain" },
  { label: "Genius Portal", href: "#portal" },
  { label: "How we work", href: "#engage" },
  { label: "Solutions", href: "#segments" },
];

export function Nav21() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    const t = window.setTimeout(on, 0);
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", on);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500 ${
        scrolled || open ? "bg-[#f4f1ec]/95 shadow-[0_1px_0_var(--rule)]" : "bg-transparent"
      }`}
    >
      <div className={`${wrap} flex h-[4.25rem] items-center justify-between gap-6`}>
        <a href="#top" aria-label="Genius Lab, home" className="block shrink-0">
          <BrandLogo tone="navy" className="h-[17px] w-auto" />
        </a>
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-[0.9rem] font-medium text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Btn href="#film" tone="line" size="sm" className="hidden sm:inline-flex">
            Watch the film
          </Btn>
          <Btn href="#contact" size="sm">
            Book a demo
          </Btn>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="v21-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-[var(--ink)] shadow-[inset_0_0_0_1px_var(--rule)] lg:hidden"
          >
            {open ? <X size={18} aria-hidden="true" /> : <List size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <div
        id="v21-menu"
        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        inert={!open}
      >
        <div className="overflow-hidden">
          <ul className={`${wrap} pb-6`}>
            {LINKS.map((l) => (
              <li key={l.label} className="border-t border-[var(--rule)]">
                <a href={l.href} onClick={() => setOpen(false)} className="v21-serif block py-4 text-[1.5rem] text-[var(--ink)]">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
