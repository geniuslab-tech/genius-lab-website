"use client";

import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/v2/ui";
import { Pill, type Tone } from "./ui";

const LINKS = [
  { label: "Platform", href: "#story" },
  { label: "Our approach", href: "#approach" },
  { label: "Genius Portal", href: "#portal" },
  { label: "Managed", href: "#managed" },
  { label: "Solutions", href: "#solutions" },
];

/**
 * A thin translucent bar. It reads the tone of whatever section sits beneath it and
 * cross-fades between a light and a dark material, so it never fights the page.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [tone, setTone] = useState<Tone>("white");
  const toneRef = useRef<Tone>("white");

  useEffect(() => {
    const read = () => {
      const probe = 26;
      const secs = document.querySelectorAll<HTMLElement>(".v20 main > section[data-tone], .v20 footer[data-tone]");
      let t: Tone = "white";
      for (const s of secs) {
        const r = s.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) t = (s.dataset.tone as Tone) ?? "white";
      }
      if (t !== toneRef.current) {
        toneRef.current = t;
        setTone(t);
      }
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    // The story section changes tone while you scroll it; re-read when it does.
    const mo = new MutationObserver(read);
    document.querySelectorAll(".v20 [data-v20-live-tone]").forEach((el) => mo.observe(el, { attributes: true, attributeFilter: ["data-tone"] }));
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
      mo.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const dark = tone === "black" || tone === "navy";
  const headerTone: Tone = open ? "white" : dark ? "navy" : "white";

  return (
    <header className="v20-header" data-tone={headerTone}>
      <div className="mx-auto flex h-[3.25rem] max-w-[1120px] items-center justify-between gap-6 px-5">
        <a href="#top" aria-label="Genius Lab, home" className="block shrink-0">
          <span className="v20-logo-navy">
            <BrandLogo tone="navy" className="h-[14px] w-auto" />
          </span>
          <span className="v20-logo-white">
            <BrandLogo tone="white" className="h-[14px] w-auto" />
          </span>
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="v20-navlink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Pill href="#contact" size="sm">
            Talk to us
          </Pill>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="v20-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative -mr-2 inline-flex h-10 w-10 items-center justify-center md:hidden"
          >
            <span
              className="absolute h-[1.5px] w-[18px] bg-[var(--fg)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: open ? "rotate(45deg)" : "translateY(-4px)" }}
            />
            <span
              className="absolute h-[1.5px] w-[18px] bg-[var(--fg)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: open ? "rotate(-45deg)" : "translateY(4px)" }}
            />
          </button>
        </div>
      </div>

      <div id="v20-menu" data-open={open} className="v20-menu border-t border-[var(--rule)] bg-white md:hidden">
        <ul className="px-6 pb-8 pt-4">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className="v20-display block py-2.5 text-[1.625rem] text-[var(--fg)]">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
