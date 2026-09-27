"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion, type Variants } from "motion/react";
import { BrandLogo } from "@/components/v2/ui";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { CHAPTERS, SLOPE, SLOPE_ANGLE, pad2 } from "./data";
import { Morph } from "./Morph";

const NAV = [
  { label: "Platform", href: "#layers" },
  { label: "Second Brain", href: "#brain" },
  { label: "Agents", href: "#agents" },
  { label: "Genius Portal", href: "#platform" },
  { label: "Solutions", href: "#solutions" },
];

const HIDDEN = "inset(0 0 100% 0)";
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IN: [number, number, number, number] = [0.7, 0, 0.84, 0];

/* ---------- Slot-machine pieces ---------- */

/** One digit on a vertical reel. The reel travels to the new digit instead of swapping it. */
function Reel({ digit }: { digit: number }) {
  return (
    <span className="v13-reel">
      <span className="v13-reel-strip" style={{ transform: `translate3d(0, ${-digit * 10}%, 0)` }}>
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n}>{n}</span>
        ))}
      </span>
    </span>
  );
}

const flap: Variants = {
  enter: { y: "105%" },
  center: (i: number) => ({ y: "0%", transition: { duration: 0.75, ease: EASE, delay: 0.1 + i * 0.07 } }),
  exit: (i: number) => ({ y: "-105%", transition: { duration: 0.45, ease: EASE_IN, delay: i * 0.04 } }),
};

/** Words roll up out of their slots while the next line rolls in beneath them. */
function RollText({ text, still, className = "" }: { text: string; still: boolean; className?: string }) {
  if (still) return <span className={`block ${className}`}>{text}</span>;
  return (
    <span className={`grid ${className}`}>
      <AnimatePresence initial={false}>
        <motion.span key={text} className="v13-roll-line" initial="enter" animate="center" exit="exit">
          {text.split(" ").map((w, i) => (
            <span key={i} className="v13-roll-mask">
              <motion.span className="inline-block" custom={i} variants={flap}>
                {w}
              </motion.span>
            </span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ---------- Faces: each surface is drawn twice, once per theme ---------- */

function PanelFace({ active, still }: { active: number; still: boolean }) {
  const ch = CHAPTERS[active];
  const n = pad2(active + 1);
  return (
    <div className="v13-face flex flex-col pt-16">
      <div className="flex min-h-0 flex-1 flex-col px-[clamp(1.75rem,3.2vw,3.5rem)] pb-[clamp(1.25rem,3vh,2.5rem)] pt-[clamp(1.25rem,4vh,3rem)]">
        <div className="flex items-start justify-between gap-6">
          <p className="v13-slot" aria-label={`Chapter ${n} of ${CHAPTERS.length}`}>
            <span className="v13-accent flex">
              <Reel digit={Number(n[0])} />
              <Reel digit={Number(n[1])} />
            </span>
            <span className="v13-slot-total">/{pad2(CHAPTERS.length)}</span>
          </p>
          <p className="v13-label pt-2 text-right">
            <RollText text={ch.caption} still={still} className="justify-items-end" />
          </p>
        </div>

        <p className="v13-panel-title mt-[clamp(0.5rem,2vh,1.25rem)]">
          <RollText text={ch.title} still={still} />
        </p>

        <div className="mt-[clamp(1rem,3vh,2rem)] grid min-h-0 flex-1 grid-cols-[auto_minmax(0,1fr)] gap-[clamp(1rem,2vw,2.5rem)]">
          <nav aria-label="Chapters" className="self-end">
            <ol className="space-y-[0.4rem]">
              {CHAPTERS.map((c, i) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} aria-current={i === active ? "step" : undefined} className={`v13-index ${i === active ? "is-on" : ""}`}>
                    <span className="v13-index-bar" aria-hidden="true" />
                    <span className="tabular-nums">{pad2(i + 1)}</span>
                    <span className="hidden xl:inline">{c.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="relative min-h-0">
            <Morph state={active} still={still} className="absolute inset-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

function HeaderFace() {
  return (
    <div className="v13-face">
      <div className="flex h-16 items-center justify-between gap-6 px-5 sm:px-8 lg:px-[clamp(1.75rem,3.2vw,3.5rem)]">
        <a href="#top" aria-label="Genius Lab, home" className="block shrink-0">
          <span className="v13-logo-white">
            <BrandLogo tone="white" className="h-[16px] w-auto sm:h-[18px]" />
          </span>
          <span className="v13-logo-navy">
            <BrandLogo tone="navy" className="h-[16px] w-auto sm:h-[18px]" />
          </span>
        </a>
        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-8">
            {NAV.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="v13-navlink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#contact" className="v13-btn v13-btn-solid v13-btn-sm">
          Book a demo
        </a>
      </div>
    </div>
  );
}

/* ---------- Stage ---------- */

/**
 * Split layout: a sticky panel on the left, the chapters scrolling on the right. Each chapter
 * boundary is a diagonal seam. The panel and the header are each rendered twice, once per theme,
 * and the upper copy is clipped by the exact line the seam currently occupies on screen, so the
 * inversion sweeps across both halves in one continuous slant.
 */
export function SplitStage({ children }: { children: ReactNode }) {
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [active, setActive] = useState(0);

  const col = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const panelBase = useRef<HTMLDivElement>(null);
  const panelOver = useRef<HTMLDivElement>(null);
  const panelSeam = useRef<HTMLSpanElement>(null);
  const headBase = useRef<HTMLDivElement>(null);
  const headOver = useRef<HTMLDivElement>(null);
  const headSeam = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = col.current;
    if (!root) return;
    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-v13-chapter]"));
    const themes = sections.map((s) => s.dataset.theme ?? "dark");
    let raf = 0;
    let shown = -1;

    const theme = (el: HTMLElement | null, t: string) => {
      if (el && el.dataset.theme !== t) el.dataset.theme = t;
    };
    const clip = (el: HTMLElement | null, v: string) => {
      if (el) el.style.clipPath = v;
    };
    const seam = (el: HTMLElement | null, y: number | null) => {
      if (!el) return;
      el.style.opacity = y === null ? "0" : "1";
      if (y !== null) el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) rotate(${SLOPE_ANGLE}rad)`;
    };

    const frame = () => {
      raf = 0;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const rects = sections.map((s) => s.getBoundingClientRect());
      const lineAt = (k: number, x: number) => rects[k].top + (x - rects[k].left) * SLOPE;

      // The chapter whose seam has fully cleared the top of the screen owns the base copies.
      let upper = 0;
      for (let k = 1; k < sections.length; k++) {
        if (lineAt(k, W) <= 0) upper = k;
        else break;
      }
      // The chapter whose seam has passed the reading line owns the title and the visual.
      let now = 0;
      for (let k = 1; k < sections.length; k++) {
        if (rects[k].top <= H * 0.45) now = k;
        else break;
      }
      if (now !== shown) {
        shown = now;
        setActive(now);
      }

      const next = upper + 1 < sections.length ? upper + 1 : -1;
      theme(headBase.current, themes[upper]);
      theme(panelBase.current, themes[upper]);
      if (next < 0) {
        clip(headOver.current, HIDDEN);
        clip(panelOver.current, HIDDEN);
        seam(headSeam.current, null);
        seam(panelSeam.current, null);
        return;
      }
      theme(headOver.current, themes[next]);
      theme(panelOver.current, themes[next]);

      if (reduce) {
        // No sweep: the theme flips in one step when the chapter takes over.
        const on = rects[next].top <= H * 0.45 ? "none" : HIDDEN;
        clip(headOver.current, on);
        clip(panelOver.current, on);
        seam(headSeam.current, null);
        seam(panelSeam.current, null);
        return;
      }

      const y0 = lineAt(next, 0);
      clip(headOver.current, `polygon(0 ${y0.toFixed(1)}px, 100% ${lineAt(next, W).toFixed(1)}px, 100% 100%, 0 100%)`);
      seam(headSeam.current, y0);

      const p = panel.current?.getBoundingClientRect();
      if (p && p.width > 0) {
        const py0 = y0 - p.top;
        const pyR = lineAt(next, p.right) - p.top;
        clip(panelOver.current, `polygon(0 ${py0.toFixed(1)}px, 100% ${pyR.toFixed(1)}px, 100% 100%, 0 100%)`);
        seam(panelSeam.current, py0);
      }
    };

    const request = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    request();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [reduce]);

  return (
    <MotionConfig reducedMotion="user">
      <header className="v13-header">
        <div ref={headBase} data-theme="dark" className="v13-layer">
          <HeaderFace />
        </div>
        <div ref={headOver} data-theme="light" className="v13-layer" style={{ clipPath: HIDDEN }} inert>
          <HeaderFace />
        </div>
        <span ref={headSeam} className="v13-seam-line" aria-hidden="true" />
      </header>

      <div className="v13-split">
        <div ref={panel} className="v13-panel">
          <div ref={panelBase} data-theme="dark" className="v13-layer">
            <PanelFace active={active} still={reduce} />
          </div>
          <div ref={panelOver} data-theme="light" className="v13-layer" style={{ clipPath: HIDDEN }} inert>
            <PanelFace active={active} still={reduce} />
          </div>
          <span ref={panelSeam} className="v13-seam-line" aria-hidden="true" />
        </div>
        <div ref={col} className="v13-col">
          {children}
        </div>
      </div>
    </MotionConfig>
  );
}
