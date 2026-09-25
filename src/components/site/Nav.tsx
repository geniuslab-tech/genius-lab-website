"use client";

import { useEffect, useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { Wordmark } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { VersionSwitch } from "@/components/ui/VersionSwitch";

export const NAV_LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Atlas", href: "#atlas" },
  { label: "Method", href: "#method" },
  { label: "Company", href: "#" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    io.observe(el);
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
      <div ref={sentinel} className="pointer-events-none absolute top-0 h-4 w-full" aria-hidden="true" />
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-300 ${
          scrolled || open ? "bg-paper shadow-[0_1px_0_var(--color-rule)]" : "bg-transparent"
        }`}
      >
        <nav className="shell flex h-[var(--nav-h)] items-center justify-between gap-8" aria-label="Primary">
          <Wordmark />
          <ul className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="relative text-[0.9375rem] text-ink-2 transition-colors hover:text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-survey after:transition-transform after:duration-300 after:ease-[var(--ease-out-strong)] hover:after:scale-x-100"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <VersionSwitch current={1} />
            <span className="hidden sm:block">
              <Button href="#contact">Talk to us</Button>
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="press inline-flex h-12 w-12 items-center justify-center border border-rule-strong lg:hidden"
            >
              {open ? <X size={20} /> : <List size={20} />}
            </button>
          </div>
        </nav>
      </header>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-30 bg-paper pt-[var(--nav-h)] transition-[clip-path] duration-500 ease-[var(--ease-out-expo)] lg:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
        aria-hidden={!open}
      >
        <ul className="shell flex flex-col border-t border-rule pt-4">
          {NAV_LINKS.map((l, i) => (
            <li key={l.label} className="border-b border-rule">
              <a
                href={l.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className={`type-display flex items-baseline justify-between py-5 text-[2.25rem] transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] ${
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
          <Button href="#contact" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className="w-full">
            Talk to us
          </Button>
        </div>
      </div>
    </>
  );
}
