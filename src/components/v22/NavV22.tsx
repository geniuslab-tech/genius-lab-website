"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/v2/ui";
import { ChButton } from "./ui";

const LINKS = [
  { label: "Platform", id: "layers" },
  { label: "Second Brain", id: "brain" },
  { label: "Agents", id: "agents" },
  { label: "Genius Portal", id: "portal" },
  { label: "Services", id: "services" },
  { label: "Solutions", id: "segments" },
];

type Mode = "top" | "dark" | "light";

/**
 * Transparent over the navy hero, solid navy while the hero is under it, white after.
 * A chamfered plate slides beneath the section in view, and follows the pointer on hover.
 */
export function NavV22() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("top");
  const [active, setActive] = useState(-1);
  const [hover, setHover] = useState(-1);
  const [plate, setPlate] = useState<{ x: number; w: number } | null>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const y = window.scrollY;
      const ground = document.getElementById("v22-ground");
      const gb = ground ? ground.getBoundingClientRect().bottom : 0;
      setMode(y < 12 ? "top" : gb > 80 ? "dark" : "light");
      const line = window.innerHeight * 0.38;
      let a = -1;
      LINKS.forEach((l, i) => {
        const el = document.getElementById(l.id);
        if (el && el.getBoundingClientRect().top <= line) a = i;
      });
      const last = document.getElementById("contact");
      if (last && last.getBoundingClientRect().top <= line) a = -1;
      setActive(a);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const target = hover >= 0 ? hover : active;

  const place = useCallback(() => {
    const el = target >= 0 ? linkRefs.current[target] : null;
    setPlate(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
  }, [target]);

  useEffect(() => {
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [place]);

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

  const light = mode === "light" && !open;
  const bar =
    mode === "top" || open
      ? "bg-transparent"
      : mode === "dark"
        ? "bg-[var(--navy)] shadow-[0_1px_0_rgb(255_255_255/0.08)]"
        : "bg-white shadow-[0_1px_0_var(--rule),0_10px_30px_-20px_rgb(16_20_64/0.35)]";

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-300 ${bar}`}>
        <div className="v22-shell flex h-[var(--nav)] items-center justify-between gap-6">
          <a href="#top" aria-label="Genius Lab, home" className="relative z-10 block shrink-0">
            <BrandLogo tone={light ? "navy" : "white"} className="h-[17px] w-auto sm:h-[19px]" />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="relative flex items-center" onPointerLeave={() => setHover(-1)}>
              <li aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0">
                <span
                  className={`ch absolute top-1/2 block h-9 -translate-y-1/2 transition-[transform,width,opacity,background-color] duration-500 ease-[var(--ease)] [--c:8px] ${
                    light ? "bg-[var(--signal-soft)]" : "bg-white/[0.1]"
                  } ${plate ? "opacity-100" : "opacity-0"}`}
                  style={{ width: plate?.w ?? 0, transform: `translate(${plate?.x ?? 0}px, -50%)` }}
                />
                <span
                  className="absolute top-[calc(50%+17px)] block h-[2px] bg-[var(--signal)] transition-[transform,width,opacity] duration-500 ease-[var(--ease)]"
                  style={{ width: plate ? Math.max(plate.w - 32, 0) : 0, transform: `translateX(${(plate?.x ?? 0) + 16}px)`, opacity: plate && hover < 0 ? 1 : 0 }}
                />
              </li>
              {LINKS.map((l, i) => (
                <li key={l.id}>
                  <a
                    ref={(el) => {
                      linkRefs.current[i] = el;
                    }}
                    href={`#${l.id}`}
                    onPointerEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(-1)}
                    aria-current={active === i ? "location" : undefined}
                    className={`relative block px-4 py-2.5 text-[0.875rem] font-medium transition-colors duration-200 ${
                      light ? (target === i ? "text-[var(--navy)]" : "text-[var(--ink-2)]") : target === i ? "text-white" : "text-white/70"
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-2">
            <ChButton href="#contact" size="sm" tone={light ? "navy" : "white"} className="hidden sm:inline-flex">
              Talk to us
            </ChButton>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="v22-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={`chb inline-flex h-10 w-10 [--c:8px] lg:hidden ${light ? "[--bd:var(--rule-2)]" : "[--bd:rgb(255_255_255/0.3)]"}`}
            >
              <span className={`chi inline-flex h-full w-full items-center justify-center ${light ? "bg-white text-[var(--navy)]" : "bg-[var(--navy)] text-white"}`}>
                {open ? <X size={18} /> : <List size={18} />}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="v22-menu"
        aria-hidden={!open}
        inert={!open}
        className={`v22-hexfield fixed inset-0 z-30 bg-[var(--navy)] pt-[var(--nav)] text-white transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <ul className="v22-shell pt-6">
          {LINKS.map((l, i) => (
            <li key={l.id} className="border-b border-white/10">
              <a href={`#${l.id}`} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-4">
                <span className="v22-mono text-[0.75rem] text-[var(--signal-lt)]">0{i + 1}</span>
                <span className="v22-display text-[1.625rem]">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="v22-shell pt-8">
          <ChButton href="#contact" tone="white" onClick={() => setOpen(false)}>
            Talk to us
          </ChButton>
        </div>
      </div>
    </>
  );
}
