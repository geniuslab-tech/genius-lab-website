"use client";

import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import { Console, SCATTER, scatterTransform } from "./Console";
import { LIVE_QUERY, smooth, useMedia, usePinProgress } from "./hooks";
import { MagButton } from "./Interactive";

/**
 * Hero and signature transition. The stage pins while the page scrolls; the headline steps back
 * and the Genius Portal console assembles from loose fragments flying in from depth, then rises to
 * the centre as one clean dashboard. Without motion (or on short screens) the same markup reads as
 * a normal hero with the console already assembled below it.
 */
export function Hero() {
  const live = useMedia(LIVE_QUERY);
  const track = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const fig = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const lift = useRef(0);
  const frags = useRef<HTMLElement[]>([]);
  const frame = useRef<HTMLElement | null>(null);

  // Measure how far the console must rise to sit centred once the headline has gone.
  useEffect(() => {
    if (!live) return;
    const f = fig.current;
    if (!f) return;
    frags.current = Array.from(f.querySelectorAll<HTMLElement>("[data-frag]"));
    frame.current = f.querySelector<HTMLElement>("[data-frame]");
    const measure = () => {
      const vh = window.innerHeight;
      const top = f.offsetTop;
      const h = f.offsetHeight;
      const target = Math.max(84, (vh - h) / 2 + 24);
      lift.current = Math.max(0, top - target);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(f);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [live]);

  const onProgress = useCallback((p: number) => {
    const c = copy.current;
    if (c) {
      const o = 1 - smooth(0.04, 0.34, p);
      c.style.opacity = o.toFixed(3);
      c.style.transform = `translate3d(0,${(-smooth(0, 0.4, p) * 56).toFixed(1)}px,0)`;
      c.style.visibility = o < 0.01 ? "hidden" : "visible";
    }
    const rise = smooth(0.12, 0.78, p);
    if (scene.current) scene.current.style.transform = `translate3d(0,${(-rise * lift.current).toFixed(1)}px,0)`;
    frags.current.forEach((el) => {
      const s = SCATTER.find((x) => x.f === el.dataset.frag);
      if (!s) return;
      const e = smooth(s.delay, s.delay + 0.5, p);
      const k = 1 - e;
      el.style.transform = k < 0.001 ? "none" : scatterTransform(s, k);
      el.style.opacity = (0.3 + 0.7 * e).toFixed(3);
      el.style.setProperty("--e", e.toFixed(3));
    });
    if (frame.current) frame.current.style.opacity = smooth(0.6, 0.86, p).toFixed(3);
    if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(4)})`;
    if (hint.current) hint.current.style.opacity = (1 - smooth(0.82, 0.96, p)).toFixed(3);
  }, []);
  usePinProgress(track, onProgress, live);

  // The camera leans a little toward the cursor.
  useEffect(() => {
    if (!live) return;
    const f = fig.current?.querySelector<HTMLElement>(".v23-console");
    if (!f) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = 50 + (e.clientX / window.innerWidth - 0.5) * 18;
        const y = 50 + (e.clientY / window.innerHeight - 0.5) * 14;
        f.style.perspectiveOrigin = `${x.toFixed(1)}% ${y.toFixed(1)}%`;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [live]);

  return (
    <section id="top" className="v23-hero relative" data-v23-tone="dark" data-v23-chapter="Complexity" aria-labelledby="v23-hero-title">
      <div ref={track} className="v23-hero-track">
        <div className="v23-hero-stage">
          <div ref={copy} className="v23-hero-copy v23-wrap relative z-10 will-change-transform">
            <p className="v23-intro v23-label text-(--tx-3)" style={{ "--d": "0ms" } as CSSProperties}>
              One partner. One platform. One source of truth.
            </p>
            <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
              <h1 id="v23-hero-title" className="v23-intro v23-display text-[clamp(2.4rem,5.6vw,5rem)] lg:col-span-7" style={{ "--d": "80ms" } as CSSProperties}>
                Transform Business Complexity into Strategic&nbsp;Advantage
              </h1>
              <div className="v23-intro lg:col-span-5 lg:pb-2" style={{ "--d": "180ms" } as CSSProperties}>
                <p className="text-[1.125rem] font-semibold leading-snug tracking-[-0.01em] text-(--tx)">
                  A fully managed intelligence and execution layer for your entire business.
                </p>
                <p className="mt-3 text-pretty text-[1rem] leading-[1.7] text-(--tx-2)">
                  We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the software you already rely on.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <MagButton href="#action">See Genius Lab in action</MagButton>
                  <MagButton href="#contact" tone="ghost" arrow={false}>
                    Book a demo
                  </MagButton>
                </div>
              </div>
            </div>
          </div>

          <figure ref={fig} className="v23-hero-console v23-wrap relative z-0" aria-label="Illustrative preview of the Genius Portal console">
            <div ref={scene} className="v23-intro will-change-transform" style={{ "--d": "260ms" } as CSSProperties}>
              <Console scatter />
            </div>
            <figcaption className="sr-only">
              An illustrative Genius Portal overview: revenue, margin, cash and delivery KPIs, a revenue-versus-plan chart, connected systems and a finance agent insight. All figures are illustrative.
            </figcaption>
          </figure>

          <div ref={hint} className="v23-hero-hint" aria-hidden="true">
            <div className="v23-wrap">
              <div className="flex items-center gap-4">
                <span className="v23-label text-(--tx-3)">Scroll: fragments become one console</span>
                <span className="block h-px w-24 bg-(--line-2)">
                  <span ref={bar} className="block h-px w-full origin-left scale-x-0 bg-(--accent)" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
