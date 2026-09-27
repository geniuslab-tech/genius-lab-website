"use client";

import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/v2/ui";
import { Button } from "./ui";

const LINKS = [
  { label: "Platform", href: "#layers" },
  { label: "Second Brain", href: "#brain" },
  { label: "Agents", href: "#agents" },
  { label: "Genius Portal", href: "#portal" },
  { label: "Solutions", href: "#segments" },
];

/** Transparent over the hero; a solid midnight bar with a hairline once the page moves. */
export function NavV19() {
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
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-500 ${
          scrolled || open ? "bg-[rgb(5_7_15/0.92)] shadow-[0_1px_0_var(--line)]" : "bg-transparent"
        }`}
      >
        <div className="v19-wrap flex h-16 items-center justify-between gap-6">
          <a href="#top" aria-label="Genius Lab, home" className="block shrink-0">
            <BrandLogo tone="white" className="h-[15px] w-auto" />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="rounded-full px-3.5 py-2 text-[0.875rem] text-[color:var(--tx-2)] transition-colors duration-200 hover:bg-white/[0.04] hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a href="#contact" className="hidden px-3 text-[0.875rem] text-[color:var(--tx-2)] transition-colors hover:text-white xl:block">
              Contact
            </a>
            <Button href="#contact" size="sm" className="max-[380px]:hidden">
              Book a demo
            </Button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="v19-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white shadow-[inset_0_0_0_1px_var(--line-2)] lg:hidden"
            >
              {open ? <X size={16} /> : <List size={16} />}
            </button>
          </div>
        </div>
      </header>

      <div
        id="v19-menu"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-0 z-30 bg-[color:var(--g1)] pt-16 transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <ul className="v19-wrap pt-6">
          {LINKS.map((l) => (
            <li key={l.label} className="border-b border-[color:var(--line)]">
              <a href={l.href} onClick={() => setOpen(false)} className="v19-h3 block py-4 text-[1.5rem]">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="v19-wrap flex flex-col gap-3 pt-8">
          <Button href="#contact" onClick={() => setOpen(false)} className="self-start">
            Book a demo
          </Button>
        </div>
      </div>
    </>
  );
}
