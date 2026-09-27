"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/v2/ui";
import { PillLink, SPRING } from "./ui";

const LINKS = [
  { label: "Platform", href: "#layers" },
  { label: "Second Brain", href: "#brain" },
  { label: "Genius Portal", href: "#portal" },
  { label: "Solutions", href: "#segments" },
  { label: "Approach", href: "#ontology" },
];

export function Nav17() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    const id = requestAnimationFrame(onScroll);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 bg-[var(--cream)] transition-shadow duration-300 ${
        scrolled || open ? "shadow-[0_1px_0_var(--rule)]" : ""
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-8">
        <a href="#top" aria-label="Genius Lab, home" className="shrink-0 rounded-md">
          <BrandLogo tone="navy" className="h-[15px] w-auto sm:h-[17px]" />
        </a>
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="rounded-full px-3.5 py-2 text-[0.9375rem] font-medium text-[var(--ink-2)] transition-colors hover:bg-[var(--cream-2)] hover:text-[var(--ink)]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <PillLink href="#action" tone="outline" className="hidden min-h-[2.5rem] px-4 text-[0.9rem] sm:inline-flex">
            Watch demo
          </PillLink>
          <PillLink href="#contact" className="min-h-[2.5rem] px-4 text-[0.9rem]">
            Book a demo
          </PillLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="v17-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-10 items-center justify-center rounded-full text-[var(--ink)] hover:bg-[var(--cream-2)] lg:hidden"
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            id="v17-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={SPRING}
            className="absolute inset-x-3 top-[4.75rem] rounded-[1.75rem] border border-[var(--rule)] bg-[var(--paper)] p-3 shadow-[0_24px_40px_-24px_rgb(16_20_64/0.35)] lg:hidden"
          >
            <ul>
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="v17-serif block rounded-2xl px-4 py-3 text-[1.35rem] text-[var(--ink)] hover:bg-[var(--cream-2)]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-2 px-1 pb-1 sm:hidden">
              <PillLink href="#action" tone="outline" onClick={() => setOpen(false)} className="w-full">
                Watch demo
              </PillLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
