"use client";

import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/v2/ui";
import { VersionSwitch } from "@/components/ui/VersionSwitch";
import { Button } from "./ui";

const LINKS = [
  { label: "Platform", href: "#layers" },
  { label: "Second Brain", href: "#brain" },
  { label: "Genius Portal", href: "#portal" },
  { label: "Solutions", href: "#segments" },
  { label: "Clients", href: "#clients" },
];

/** A solid white bar over the dark hero, gaining a hairline once the page moves. */
export function NavV6() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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
      <header className={`fixed inset-x-0 top-0 z-40 bg-white transition-shadow duration-300 ${scrolled ? "shadow-[0_1px_0_var(--color-rule6),0_8px_24px_-16px_rgb(11_19_36/0.2)]" : ""}`}>
        <div className="mx-auto flex h-[4.5rem] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8">
          <a href="#" aria-label="Genius Lab, home" className="block shrink-0">
            <BrandLogo tone="navy" className="h-[19px] w-auto" />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-[0.875rem] font-medium text-steel-2 transition-colors hover:text-steel">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a href="#contact" className="hidden text-[0.875rem] font-medium text-steel-2 hover:text-steel xl:block">
              Contact sales
            </a>
            <Button href="#action" tone="outline-light" size="sm" className="hidden sm:inline-flex">
              Watch demo
            </Button>
            <Button href="#contact" size="sm">
              Book a demo
            </Button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="v6-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[6px] text-steel shadow-[inset_0_0_0_1px_var(--color-rule6)] lg:hidden"
            >
              {open ? <X size={18} /> : <List size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Version compare lives off the bar, so the header matches the product's own. */}
      <div className="fixed bottom-4 right-4 z-40 hidden rounded-full bg-white/90 p-1 shadow-[0_8px_30px_-8px_rgb(11_19_36/0.35)] ring-1 ring-rule6 backdrop-blur md:block">
        <VersionSwitch current={6} tone="soft" />
      </div>

      <div
        id="v6-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-30 bg-white pt-[4.5rem] transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <ul className="px-5 pt-4 sm:px-8">
          {LINKS.map((l) => (
            <li key={l.label} className="border-b border-rule6">
              <a href={l.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className="v6-display block py-4 text-[1.5rem] text-steel">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 px-5 pt-8 sm:px-8">
          <VersionSwitch current={6} tone="soft" className="self-start" />
          <Button href="#action" tone="outline-light" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
            Watch demo
          </Button>
        </div>
      </div>
    </>
  );
}
