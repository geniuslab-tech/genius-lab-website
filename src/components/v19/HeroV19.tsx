"use client";

import { useCallback, useEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import { PortalWindowV19 } from "./PortalWindowV19";
import { clamp01, useReduced, useScrollProgress } from "./hooks";
import { Button, HexMark } from "./ui";

const WORDS = [
  ...["Transform", "Business", "Complexity", "into"].map((w) => ({ w, lit: false })),
  ...["Strategic", "Advantage"].map((w) => ({ w, lit: true })),
];

/** Placeholder client marks, to be replaced with approved logos. */
const LOGOS = ["Vanta Group", "Helios", "Caldera", "Orbis", "Stratum", "Northpeak", "Meridian"];

const DESIGN_W = 1120;

export function HeroV19() {
  const reduce = useReduced();
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const state = useRef({ scroll: 0, px: 0, py: 0 });
  const frame = useRef(0);

  const apply = useCallback(() => {
    const el = win.current;
    if (!el) return;
    const { scroll, px, py } = state.current;
    // Scrolling lifts the window toward the reader; the cursor adds a small lean.
    el.style.setProperty("--rx", `${(22 - scroll * 18 - py * 4).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * 6).toFixed(2)}deg`);
  }, []);

  const onScroll = useCallback(
    (p: number) => {
      state.current.scroll = clamp01(p * 1.6);
      apply();
    },
    [apply],
  );
  useScrollProgress(section, onScroll, !reduce, "through");

  // Fit the 1120px design to the stage width.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const s = Math.min(1, e.contentRect.width / DESIGN_W);
      el.style.setProperty("--s", s.toFixed(4));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType === "touch") return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const s = section.current;
      const w = win.current;
      if (!s || !w) return;
      const sr = s.getBoundingClientRect();
      s.style.setProperty("--hx", `${(clientX - sr.left).toFixed(0)}px`);
      s.style.setProperty("--hy", `${(clientY - sr.top).toFixed(0)}px`);
      const wr = w.getBoundingClientRect();
      const lx = (clientX - wr.left) / wr.width;
      const ly = (clientY - wr.top) / wr.height;
      w.style.setProperty("--lx", `${(lx * 100).toFixed(1)}%`);
      w.style.setProperty("--ly", `${(ly * 100).toFixed(1)}%`);
      state.current.px = Math.max(-1, Math.min(1, (clientX - sr.left) / sr.width - 0.5)) * 2;
      state.current.py = Math.max(-1, Math.min(1, (clientY - sr.top) / sr.height - 0.5)) * 2;
      w.dataset.live = "";
      apply();
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    state.current.px = 0;
    state.current.py = 0;
    if (win.current) delete win.current.dataset.live;
    apply();
  };

  return (
    <section
      ref={section}
      id="top"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative isolate overflow-hidden pt-16 [--hx:50%] [--hy:30%]"
      aria-labelledby="v19-hero-title"
    >
      {/* Ground: midnight navy, a hairline grid, a sweep of light across it and a lamp that follows the cursor. */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,#101844_0%,transparent_70%)]" aria-hidden="true" />
      <div className="v19-grid -z-10" aria-hidden="true" />
      <div className="v19-sweep -z-10" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(600px_circle_at_var(--hx)_var(--hy),rgb(var(--acc-rgb)/0.1),transparent_65%)] max-md:hidden"
        aria-hidden="true"
      />

      <div className="v19-wrap relative flex flex-col items-center pt-16 text-center sm:pt-24">
        <a
          href="#brain"
          className="v19-in v19-beam relative inline-flex items-center gap-2.5 rounded-full border border-[color:var(--line-2)] bg-white/[0.02] py-1.5 pl-2 pr-3.5 text-[0.8125rem] text-[color:var(--tx-2)] transition-colors hover:text-white"
          style={{ "--d": "0ms" } as CSSProperties}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgb(var(--acc-rgb)/0.15)] px-2 py-0.5 text-[0.75rem] text-[color:var(--acc-3)]">
            <HexMark size={11} />
            Second Brain
          </span>
          One partner. One platform. One source of truth.
        </a>

        <h1 id="v19-hero-title" className="v19-h1 mt-8 max-w-[15ch] text-[clamp(2.6rem,7vw,5.75rem)]">
          {WORDS.map(({ w, lit }, i) => (
            <span key={w}>
              <span className={`v19-in inline-block ${lit ? "v19-lit" : ""}`} style={{ "--d": `${80 + i * 70}ms` } as CSSProperties}>
                {w}
              </span>
              {i < WORDS.length - 1 && " "}
            </span>
          ))}
        </h1>

        <p className="v19-in v19-lead mt-7 max-w-[54ch] text-[1.0625rem] sm:text-[1.1875rem]" style={{ "--d": "560ms" } as CSSProperties}>
          We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the
          software you already rely on.
        </p>

        <div className="v19-in mt-9 flex flex-wrap justify-center gap-3" style={{ "--d": "660ms" } as CSSProperties}>
          <Button href="#portal">See the Genius Portal</Button>
          <Button href="#contact" tone="ghost">
            Book a demo
          </Button>
        </div>
      </div>

      {/* The product, in depth. */}
      <div className="v19-wrap relative mt-16 sm:mt-20">
        <div ref={stage} className="v19-hstage v19-in" style={{ "--d": "420ms" } as CSSProperties} aria-hidden="true">
          <div className="pointer-events-none absolute inset-x-[10%] top-[30%] h-[60%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(var(--acc-rgb)/0.35),transparent)] blur-3xl" />
          <div className="v19-hscale">
            <div ref={win} className="v19-hwin">
              <PortalWindowV19 />
            </div>
          </div>
        </div>
        <p className="sr-only">
          An illustrative preview of the Genius Portal: an executive overview with revenue, margin and cash, a revenue
          chart against plan, live source systems, and a Genius agent explaining why EBITDA margin moved.
        </p>
        {/* Fade the lower edge of the window into the ground. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-[linear-gradient(to_bottom,transparent,var(--g1))]" aria-hidden="true" />
      </div>

      {/* Placeholder client logos. */}
      <div className="relative border-t border-[color:var(--line)]">
        <div className="v19-wrap flex flex-col gap-4 py-7 md:flex-row md:items-center md:gap-10">
          <p className="v19-label shrink-0 text-[color:var(--tx-3)]">Client logos · placeholders</p>
          <div className="min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_90%,transparent)]">
            <ul className="v19-marquee flex w-max items-center gap-16" aria-label="Client logos (placeholders)">
              {[...LOGOS, ...LOGOS].map((l, i) => (
                <li key={i} aria-hidden={i >= LOGOS.length || undefined} className="flex items-center gap-2.5 whitespace-nowrap text-[1.0625rem] font-semibold tracking-[-0.02em] text-white/40">
                  <span className={`inline-block h-3.5 w-3.5 ${["rounded-full", "rounded-[3px]", "v19-hex", "rotate-45 rounded-[2px]"][i % 4]} border-[1.5px] border-current`} aria-hidden="true" />
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
