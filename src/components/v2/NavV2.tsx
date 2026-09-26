"use client";

import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { BrandLogo, CutButton } from "./ui";
import { VersionSwitch } from "@/components/ui/VersionSwitch";

const LINKS = [
  { label: "Capabilities", href: "#layers" },
  { label: "Second Brain", href: "#brain" },
  { label: "Genius Portal", href: "#portal" },
  { label: "Clients", href: "#clients" },
];

/**
 * Header for Version 2. It reads the ground beneath it: sections marked
 * data-ground="dark" switch it to the white logo on navy.
 */
export function NavV2({ version = 2 }: { version?: 2 | 3 }) {
  const [dark, setDark] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const darks = Array.from(document.querySelectorAll("[data-ground='dark']"));
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setDark(visible.size > 0);
      },
      // A thin band where the header sits.
      { rootMargin: "0px 0px -94% 0px" },
    );
    darks.forEach((el) => io.observe(el));

    const top = document.getElementById("v2-top");
    const io2 = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting));
    if (top) io2.observe(top);
    return () => {
      io.disconnect();
      io2.disconnect();
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

  const onLight = !dark && !open;
  const ground = open
    ? "bg-navy-950"
    : !onLight
      ? solid
        ? "bg-navy-950/95 shadow-[0_1px_0_rgb(255_255_255/0.08)]"
        : "bg-transparent"
      : solid
        ? "bg-paper/95 shadow-[0_1px_0_rgb(16_20_64/0.1)]"
        : "bg-transparent";

  return (
    <>
      <div id="v2-top" className="pointer-events-none absolute top-0 h-6 w-full" aria-hidden="true" />
      <header className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-300 ${ground}`}>
        <div className="shell flex h-[var(--nav-h)] items-center justify-between gap-6">
          <a href="#" aria-label="Genius Lab, home" className="relative block h-[18px] w-[150px] shrink-0">
            <span className={`absolute inset-0 transition-opacity duration-300 ${onLight ? "opacity-0" : "opacity-100"}`}>
              <BrandLogo tone="white" className="h-[18px] w-auto" />
            </span>
            <span className={`absolute inset-0 transition-opacity duration-300 ${onLight ? "opacity-100" : "opacity-0"}`} aria-hidden={!onLight}>
              <BrandLogo tone="navy" className="h-[18px] w-auto" />
            </span>
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className={`text-[0.9375rem] transition-colors duration-200 ${
                      onLight ? "text-navy/70 hover:text-navy" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <VersionSwitch current={version} tone={onLight ? "light" : "dark"} />
            <span className="hidden sm:block">
              <CutButton href="#contact" tone={onLight ? "navy" : "white"}>
                Talk to us
              </CutButton>
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="v2-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={`press inline-flex h-11 w-11 items-center justify-center lg:hidden ${
                onLight ? "text-navy shadow-[inset_0_0_0_1px_rgb(16_20_64/0.25)]" : "text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.25)]"
              }`}
            >
              {open ? <X size={20} /> : <List size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div
        id="v2-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-30 bg-navy-950 pt-[var(--nav-h)] text-white transition-[clip-path] duration-500 ease-[var(--ease-out-expo)] lg:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <ul className="shell flex flex-col pt-6">
          {LINKS.map((l, i) => (
            <li key={l.label} className="border-b border-white/10">
              <a
                href={l.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className={`type-display block py-5 text-[2rem] [font-variation-settings:'wdth'_112] transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] ${
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="shell mt-8">
          <CutButton href="#contact" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className="w-full">
            Talk to us
          </CutButton>
        </div>
      </div>
    </>
  );
}
