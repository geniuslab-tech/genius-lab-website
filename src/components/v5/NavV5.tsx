"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/v2/ui";
import { VersionSwitch } from "@/components/ui/VersionSwitch";
import { Pill } from "./ui";

const LINKS = [
  { label: "Capabilities", href: "#layers" },
  { label: "Second Brain", href: "#brain" },
  { label: "Genius Portal", href: "#portal" },
  { label: "Clients", href: "#clients" },
];

/** A thin translucent bar that content scrolls beneath, like Apple's global nav. */
export function NavV5() {
  const [open, setOpen] = useState(false);

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
      <header className="fixed inset-x-0 top-0 z-40 bg-snow/80 backdrop-blur-xl backdrop-saturate-[1.8] supports-[not(backdrop-filter:blur(1px))]:bg-snow">
        <div className="mx-auto flex h-[3.25rem] max-w-[1080px] items-center justify-between gap-6 px-5">
          <a href="#" aria-label="Genius Lab, home" className="block shrink-0">
            <BrandLogo tone="navy" className="h-[14px] w-auto" />
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-[0.8125rem] tracking-[-0.01em] text-graphite/80 transition-colors hover:text-graphite">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <VersionSwitch current={5} tone="soft" className="hidden sm:inline-flex" />
            <Pill href="#contact" className="!h-8 !px-3.5 !text-[0.8125rem]">
              Talk to us
            </Pill>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="v5-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative -mr-2 inline-flex h-10 w-10 items-center justify-center md:hidden"
            >
              <span className={`absolute h-[1.5px] w-[18px] bg-graphite transition-transform duration-300 ease-[var(--ease-out-strong)] ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
              <span className={`absolute h-[1.5px] w-[18px] bg-graphite transition-transform duration-300 ease-[var(--ease-out-strong)] ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="v5-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-30 bg-snow pt-[3.25rem] transition-opacity duration-300 md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <ul className="px-10 pt-8">
          {LINKS.map((l, i) => (
            <li key={l.label}>
              <a
                href={l.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className={`v5-display block py-2 text-[1.75rem] text-graphite transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] ${open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
                style={{ transitionDelay: open ? `${60 + i * 40}ms` : "0ms" }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="px-10 pt-8">
          <VersionSwitch current={5} tone="soft" />
        </div>
      </div>
    </>
  );
}
