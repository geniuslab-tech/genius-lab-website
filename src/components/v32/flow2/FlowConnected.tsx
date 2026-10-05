"use client";

import { useEffect, useRef, useState } from "react";
import { STEPS } from "../auto/data";
import { ACTS, BEATS, WH, WW, cameraBox, cl, ph } from "./geometry";
import { World } from "./World";

/** 0→1 across the section's scroll track, updated once per frame */
function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setP(total <= 0 ? 0 : cl(-r.top / total));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return { ref, p };
}

function useSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1440, h: 900 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, size };
}

/** the copy column's width on desktop; the camera frames everything to its right */
const COPY_W = (w: number) => Math.min(420, Math.max(320, w * 0.27));
const NAV_H = 64;

/**
 * v32 · Connected. The first section, reworked as one continuous horizontal
 * pipeline: every act is linked to the next by live beams, the camera frames
 * each act whole beside the copy (never under it), the Genius orb reads the
 * dashboard and writes the brief, and the closing shot pulls back to show the
 * whole loop, write-back included.
 */
export function FlowConnected() {
  const { ref, p } = useScrollProgress();
  const { ref: stageRef, size } = useSize();
  const [desktop, setDesktop] = useState(true);
  const [motion, setMotion] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => {
      setDesktop(mq.matches);
      setMotion(!rm.matches);
    };
    on();
    mq.addEventListener("change", on);
    rm.addEventListener("change", on);
    return () => {
      mq.removeEventListener("change", on);
      rm.removeEventListener("change", on);
    };
  }, []);

  // ?connected=<0..1> pins the scroll position, for review and screenshots
  const [pinned, setPinned] = useState<number | null>(null);
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("connected");
    if (v === null) return;
    const id = window.setTimeout(() => {
      setPinned(cl(Number(v)));
      ref.current?.scrollIntoView();
    }, 0);
    return () => window.clearTimeout(id);
  }, [ref]);

  const prog = pinned ?? (desktop ? p : 0.99);
  let active = 0;
  BEATS.forEach((b, i) => {
    if (prog >= b) active = i;
  });

  /* camera: fit the current box into the free area beside the copy */
  /* for the closing panorama the copy steps aside and the camera takes the full width */
  const wide = desktop ? ph(prog, 0.9, 0.955) : 0;
  const copyFull = desktop ? COPY_W(size.w) + 24 : 0;
  const copy = copyFull * (1 - wide);
  const area = { x: copy + 24, y: desktop ? NAV_H + 28 : 16, w: size.w - copy - 56, h: size.h - (desktop ? NAV_H + 28 : 16) - (desktop ? 92 : 16) };
  const [x0, y0, x1, y1] = cameraBox(prog);
  const z = Math.min(1.25, area.w / (x1 - x0), area.h / (y1 - y0));
  const tx = area.x + area.w / 2 - ((x0 + x1) / 2) * z;
  const ty = area.y + area.h / 2 - ((y0 + y1) / 2) * z;
  const camX = (x0 + x1) / 2 / WW;

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (BEATS[i]! + 0.012) * total, behavior: "smooth" });
  };

  return (
    <section id="connected" className="relative border-b border-gl-border">
      <div ref={ref} className="relative h-[1500vh] max-lg:h-auto">
        <div className="sticky top-0 h-screen overflow-hidden max-lg:static max-lg:h-auto">
          {/* the stage */}
          <div ref={stageRef} className="absolute inset-0 max-lg:relative max-lg:aspect-[5/4]">
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_70%_60%_at_65%_50%,oklch(0.7_0.17_252/9%),transparent_70%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(oklch(0.7_0.17_252/6%)_1px,transparent_1px),linear-gradient(90deg,oklch(0.7_0.17_252/6%)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_75%_70%_at_60%_50%,black,transparent)]" />
            <div className="absolute left-0 top-0 origin-top-left will-change-transform" style={{ transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${z.toFixed(4)})`, width: WW, height: WH }}>
              <World p={prog} motion={motion} />
            </div>
            {/* acts leaving to the left fade behind the copy instead of being cut */}
            <div className="pointer-events-none absolute inset-y-0 left-0 max-lg:hidden" style={{ width: copy + 80 * (1 - wide), background: "linear-gradient(90deg, var(--background) 0%, var(--background) 78%, transparent 100%)" }} />
          </div>

          {/* copy */}
          <div className="relative flex h-full items-center max-lg:h-auto">
            <div className="w-full px-6 py-16 lg:pl-10 lg:pr-0" style={desktop ? { width: copyFull, opacity: 1 - wide, transform: `translateX(${(-40 * wide).toFixed(1)}px)`, pointerEvents: wide > 0.5 ? "none" : undefined } : undefined}>
              <p className="eyebrow mb-4">How it works · Connected</p>
              <h2 className="font-gl-display text-3xl leading-[1.12] tracking-tight text-gradient-light sm:text-[2.1rem]">Turn everything your business knows into intelligent action.</h2>

              <ol className="mt-10 border-l border-gl-border">
                {STEPS.map((st, i) => {
                  const on = desktop ? i === active : true;
                  const done = i < active;
                  const next = BEATS[i + 1] ?? 1;
                  const fill = desktop ? cl((prog - BEATS[i]!) / (next - BEATS[i]!)) : 0;
                  return (
                    <li key={st.title} className="relative">
                      <span className="absolute -left-px top-0 h-full w-px origin-top bg-gl-data transition-[transform,opacity] duration-500" style={{ transform: `scaleY(${on || done ? 1 : 0})`, opacity: on ? 1 : 0.35 }} />
                      <button type="button" onClick={() => jump(i)} className="group block w-full py-2.5 pl-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gl-data/60" aria-current={on && desktop ? "step" : undefined}>
                        <span className="flex items-baseline gap-3">
                          <span className={`font-gl-mono text-[0.65rem] tracking-[0.2em] transition-colors duration-500 ${on ? "text-gl-data" : "text-gl-muted-foreground/60"}`}>{st.index}</span>
                          <span className={`font-gl-display text-[1.05rem] tracking-tight transition-colors duration-500 ${on ? "text-gl-foreground" : "text-gl-muted-foreground group-hover:text-gl-foreground/80"}`}>{st.title}</span>
                        </span>
                        <span className="grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ gridTemplateRows: on ? "1fr" : "0fr", opacity: on ? 1 : 0 }}>
                          <span className="overflow-hidden">
                            <span className="block pt-2 font-gl-display text-[0.95rem] text-gl-gold/90">{st.lede}</span>
                            <span className="block pt-1.5 text-[0.86rem] leading-relaxed text-gl-muted-foreground">{st.body}</span>
                            {desktop ? (
                              <span className="relative mt-3 block h-[2px] w-full overflow-hidden rounded-full bg-gl-border">
                                <span className="absolute inset-0 origin-left rounded-full bg-[linear-gradient(90deg,var(--data),var(--cyan))]" style={{ transform: `scaleX(${fill.toFixed(3)})` }} />
                              </span>
                            ) : null}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* minimap: the whole pipeline, and where the camera is on it */}
          {desktop ? (
            <div className="absolute bottom-7" style={{ left: area.x, width: area.w }}>
              <div className="relative h-10">
                <span className="absolute inset-x-0 top-[9px] h-px bg-gl-border" />
                <span className="absolute left-0 top-[9px] h-px origin-left bg-[linear-gradient(90deg,var(--data),var(--cyan))]" style={{ width: "100%", transform: `scaleX(${cl(camX).toFixed(3)})` }} />
                {ACTS.map((a, i) => {
                  const cx = (a.x + a.w / 2) / WW;
                  const lit = i <= active;
                  return (
                    <button key={a.label} type="button" onClick={() => jump(i)} className="absolute top-0 -translate-x-1/2 text-center focus-visible:outline-none" style={{ left: `${cx * 100}%` }} aria-label={`Go to ${STEPS[i]!.title}`}>
                      <span className={`mx-auto block h-[19px] w-[19px] rounded-full border-2 transition-colors duration-500 ${lit ? "border-gl-data bg-gl-data/25" : "border-gl-border bg-gl-background"}`} />
                      <span className={`mt-1.5 block whitespace-nowrap font-gl-mono text-[0.58rem] uppercase tracking-[0.16em] transition-colors duration-500 ${i === active ? "text-gl-foreground" : "text-gl-muted-foreground/60"}`}>{STEPS[i]!.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
