"use client";

import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/v2/ui";
import { VersionSwitch } from "@/components/ui/VersionSwitch";
import { Pulse, TechButton } from "./ui";

const LINKS = [
  { label: "Capabilities", href: "#layers" },
  { label: "Second Brain", href: "#brain" },
  { label: "Genius Portal", href: "#portal" },
  { label: "Clients", href: "#clients" },
];

/** Version 4 header: a console bar that hardens into a blurred panel once the page moves. */
export function NavV4() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const top = document.getElementById("v4-top");
    if (!top) return;
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting));
    io.observe(top);
    return () => io.disconnect();
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
      <div id="v4-top" className="pointer-events-none absolute top-0 h-6 w-full" aria-hidden="true" />
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color] duration-300 ${
          solid || open ? "border-line bg-void/80 backdrop-blur-xl" : "border-transparent bg-transparent"
        }`}
      >
        <div className="shell flex h-[var(--nav-h)] items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <a href="#" aria-label="Genius Lab, home" className="block shrink-0">
              <BrandLogo tone="white" className="h-[17px] w-auto" />
            </a>
            <span className="v4-label hidden items-center gap-2 border-l border-line pl-6 text-[0.6875rem] text-white/45 xl:flex">
              <Pulse />
              All systems operational
            </span>
          </div>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {LINKS.map((l, i) => (
                <li key={l.label}>
                  <a href={l.href} className="v4-label group flex h-9 items-center gap-2 px-3 text-white/60 transition-colors hover:text-white">
                    <span className="text-white/25 transition-colors group-hover:text-cyan">0{i + 1}</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <VersionSwitch current={4} tone="dark" />
            <span className="hidden sm:block">
              <TechButton href="#contact">Talk to us</TechButton>
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="v4-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="press inline-flex h-11 w-11 items-center justify-center text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.2)] lg:hidden"
            >
              {open ? <X size={20} /> : <List size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div
        id="v4-menu"
        aria-hidden={!open}
        className={`v4-grid fixed inset-0 z-30 bg-void pt-[var(--nav-h)] text-white transition-[clip-path] duration-500 ease-[var(--ease-out-expo)] lg:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <ul className="shell flex flex-col pt-6">
          {LINKS.map((l, i) => (
            <li key={l.label} className="border-b border-line">
              <a
                href={l.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className={`flex items-baseline gap-4 py-5 transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
                style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              >
                <span className="v4-label text-cyan">0{i + 1}</span>
                <span className="type-display text-[2rem] [font-variation-settings:'wdth'_112]">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="shell mt-8">
          <TechButton href="#contact" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} size="lg" className="w-full">
            Talk to us
          </TechButton>
        </div>
      </div>
    </>
  );
}
