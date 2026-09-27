"use client";

import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/v2/ui";
import { Magnetic } from "./ui";

const LINKS = [
  { href: "#platform", label: "Platform" },
  { href: "#brain", label: "Second Brain" },
  { href: "#portal", label: "Genius Portal" },
  { href: "#managed", label: "Managed" },
  { href: "#solutions", label: "Solutions" },
];

/** A full-width bar at the top of the page that tightens into a floating pill once you scroll. */
export function NavV12() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setCompact(window.scrollY > 48);
    const r = requestAnimationFrame(on);
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      cancelAnimationFrame(r);
      window.removeEventListener("scroll", on);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-4">
      <div
        className={`mx-auto flex items-center justify-between gap-4 transition-[max-width,margin,padding,border-radius,background-color,box-shadow] duration-[600ms] ease-[var(--out)] ${
          compact
            ? "mt-3 max-w-[820px] rounded-full bg-white/90 py-2 pl-5 pr-2 shadow-[0_0_0_1px_var(--rule),0_12px_32px_-16px_rgb(16_20_64/0.35)] backdrop-blur-md"
            : "mt-0 max-w-[1320px] rounded-none bg-transparent py-5 pl-2 pr-2 sm:pl-4 sm:pr-4"
        }`}
      >
        <a href="#top" aria-label="Genius Lab, home" className="shrink-0">
          <BrandLogo tone="navy" className={`w-auto transition-[height] duration-500 ${compact ? "h-[14px]" : "h-[17px]"}`} />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`block rounded-full px-3 text-[0.875rem] font-medium text-(--ink-2) transition-colors hover:bg-(--ground) hover:text-(--ink) ${compact ? "py-1.5" : "py-2"}`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Magnetic className="hidden sm:inline-flex">
            <a href="#contact" className={`v12-btn v12-btn-primary ${compact ? "!h-9 !px-4 !text-[0.875rem]" : "!h-10"}`}>
              Book a demo
            </a>
          </Magnetic>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="v12-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-(--ink) shadow-[inset_0_0_0_1px_var(--rule-2)] lg:hidden"
          >
            {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="v12-menu" className="mx-auto mt-2 max-w-[820px] rounded-[20px] bg-white p-3 shadow-[0_0_0_1px_var(--rule),0_20px_40px_-20px_rgb(16_20_64/0.35)] lg:hidden">
          <ul className="grid">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block rounded-[12px] px-4 py-3 text-[1rem] font-medium text-(--ink) hover:bg-(--ground)">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" onClick={() => setOpen(false)} className="v12-btn v12-btn-primary mt-2 w-full sm:hidden">
            Book a demo
          </a>
        </div>
      )}
    </header>
  );
}
