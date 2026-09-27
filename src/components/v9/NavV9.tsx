"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { BrandLogo } from "@/components/v2/ui";
import { timecode } from "./shared";

const LINKS = [
  { href: "#layers", label: "The stack" },
  { href: "#brain", label: "Second Brain" },
  { href: "#agents", label: "Agents" },
  { href: "#portal", label: "Portal" },
  { href: "#action", label: "Film" },
];

/** Running time of the whole reel, in frames at 24fps (4 min 12 s). */
const REEL_FRAMES = 252 * 24;

/**
 * The letterbox: a black bar above carrying the logo and the reel's running timecode,
 * and a thin bar below naming the scene in the viewfinder.
 */
export function NavV9() {
  const { scrollYProgress } = useScroll();
  const tc = useRef<HTMLSpanElement>(null);
  const [scene, setScene] = useState("SC 01 · Int. the business");

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (tc.current) tc.current.textContent = timecode(Math.round(v * REEL_FRAMES));
  });

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".v9 [data-scene]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setScene((e.target as HTMLElement).dataset.scene ?? "");
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <a
        href="#main"
        className="v9-tc fixed left-3 top-3 z-[70] -translate-y-20 bg-(--v9-ice) px-3 py-2 text-(--v9-ink) focus:translate-y-0"
      >
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-(--v9-rule) bg-(--v9-ink)">
        <div className="mx-auto flex h-12 max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-8">
          <a href="#top" className="shrink-0" aria-label="Genius Lab, back to the top">
            <BrandLogo tone="white" className="h-[12px] w-auto sm:h-[13px]" />
          </a>
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="v9-tc text-(--v9-fog) transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-5">
            <span className="v9-tc hidden items-center gap-2 text-(--v9-dim) sm:flex" aria-hidden="true">
              <span className="v9-blink h-1.5 w-1.5 rounded-full bg-[#ff5a4f]" />
              <span ref={tc} className="text-(--v9-fog)">
                00:00:00:00
              </span>
            </span>
            <a href="#contact" className="v9-tc inline-flex h-8 items-center bg-(--v9-ice) px-3 font-semibold text-(--v9-ink) transition-colors hover:bg-white">
              Talk to us
            </a>
          </div>
        </div>
      </header>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-(--v9-rule) bg-(--v9-ink)" aria-hidden="true">
        <div className="mx-auto flex h-8 max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-8">
          <span key={scene} className="v9-tc v9-swap truncate text-(--v9-fog)">
            {scene}
          </span>
          <span className="flex items-center gap-3">
            <span className="v9-tc hidden text-(--v9-dim) sm:inline">Reel 01</span>
            <span className="relative block h-px w-20 bg-white/15 sm:w-32">
              <motion.span className="absolute inset-0 origin-left bg-(--v9-ice)" style={{ scaleX: scrollYProgress }} />
            </span>
          </span>
        </div>
      </div>
    </>
  );
}
