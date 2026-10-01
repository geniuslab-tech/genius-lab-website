"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";

/* ------------------------------------------------------------------ */
/* Scene clock                                                         */
/* ------------------------------------------------------------------ */

export type Cues = Record<string, number>;

export type Scene<C extends Cues> = {
  /** Index of the last cue the clock has passed (-1 before the first). */
  index: number;
  /** Increments every time the script loops, so components can remount. */
  loop: number;
  /** True once the named cue has been reached in the current loop. */
  past: (name: keyof C) => boolean;
  /** True while the clock sits between two cues: [from, to). */
  between: (from: keyof C, to: keyof C) => boolean;
  /** The name of the current cue. */
  current: keyof C | null;
};

/**
 * Drives a scripted demo. Cues are named timestamps (ms) inside one loop.
 * The clock only re-renders when a cue is crossed, pauses while off-screen
 * or in a hidden tab, and freezes on `staticCue` for reduced-motion users.
 */
export function useScene<C extends Cues>(cues: C, loopMs: number, staticCue: keyof C) {
  const ref = useRef<HTMLDivElement>(null);
  const order = useMemo(() => Object.entries(cues).sort((a, b) => a[1] - b[1]), [cues]);
  const staticIndex = order.findIndex(([n]) => n === staticCue);
  const [state, setState] = useState({ index: staticIndex, loop: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // ?scene=<ms> freezes the script at that moment, for review and screenshots.
    const pinned = Number(new URLSearchParams(window.location.search).get("scene"));
    if (pinned > 0) {
      let i = -1;
      for (let k = 0; k < order.length; k++) if (pinned % loopMs >= order[k]![1]) i = k;
      const id = window.setTimeout(() => setState({ index: i, loop: 0 }), 0);
      return () => window.clearTimeout(id);
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let elapsed = 0;
    let last = 0;
    let running = false;
    let visible = false;
    let curIndex = -2;
    let curLoop = 0;

    const tick = (now: number) => {
      elapsed += Math.min(now - last, 100);
      last = now;
      const loop = Math.floor(elapsed / loopMs);
      const t = elapsed % loopMs;
      let i = -1;
      for (let k = 0; k < order.length; k++) if (t >= order[k]![1]) i = k;
      if (i !== curIndex || loop !== curLoop) {
        curIndex = i;
        curLoop = loop;
        setState({ index: i, loop });
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => (visible && !document.hidden ? start() : stop());
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
        sync();
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [order, loopMs]);

  const scene = useMemo<Scene<C>>(() => {
    const pos = (name: keyof C) => order.findIndex(([n]) => n === name);
    return {
      index: state.index,
      loop: state.loop,
      past: (name) => state.index >= pos(name),
      between: (from, to) => state.index >= pos(from) && state.index < pos(to),
      current: state.index >= 0 ? (order[state.index]![0] as keyof C) : null,
    };
  }, [state, order]);

  return { ref, scene };
}

/* ------------------------------------------------------------------ */
/* Stage: fixed design size, scaled to its container                   */
/* ------------------------------------------------------------------ */

export function useFitScale(designWidth: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / designWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [designWidth]);
  return { ref, scale };
}

export function ScaledStage({
  width,
  height,
  className = "",
  children,
}: {
  width: number;
  height: number;
  className?: string;
  children: ReactNode;
}) {
  const { ref, scale } = useFitScale(width);
  return (
    <div ref={ref} className={`relative w-full ${className}`} style={{ aspectRatio: `${width} / ${height}` }}>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width, height, transform: scale ? `scale(${scale})` : undefined, opacity: scale ? 1 : 0 }}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cursor                                                              */
/* ------------------------------------------------------------------ */

export type CursorTarget = string | { x: number; y: number };

/** Position of `el` inside `root`, in untransformed layout pixels. */
function offsetWithin(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight, found: node === root };
}

/**
 * A simulated user pointer. Targets are `[data-cursor="name"]` elements inside
 * `rootRef`, resolved after layout so the cursor lands on real UI. X and Y use
 * different easing curves, which bends each move into a natural hand arc.
 */
export function Cursor({
  rootRef,
  target,
  pressed = false,
  pointer = false,
  moveMs = 950,
  anchor = [0.5, 0.55],
}: {
  rootRef: RefObject<HTMLElement | null>;
  target: CursorTarget;
  pressed?: boolean;
  pointer?: boolean;
  moveMs?: number;
  anchor?: [number, number];
}) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [clicks, setClicks] = useState(0);
  const wasPressed = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const resolve = () => {
      if (typeof target !== "string") return setPos(target);
      const el = root.querySelector<HTMLElement>(`[data-cursor="${target}"]`);
      if (!el) return;
      const o = offsetWithin(el, root);
      if (o.found) setPos({ x: o.x + o.w * anchor[0], y: o.y + o.h * anchor[1] });
    };
    // Resolve after the target's own enter transition has started laying out.
    const id = window.setTimeout(resolve, 30);
    return () => window.clearTimeout(id);
  }, [target, rootRef, anchor]);

  useEffect(() => {
    if (pressed && !wasPressed.current) setClicks((c) => c + 1);
    wasPressed.current = pressed;
  }, [pressed]);

  if (!pos) return null;
  const tx = `transform ${moveMs}ms cubic-bezier(0.45, 0.05, 0.25, 1)`;
  const ty = `transform ${moveMs}ms cubic-bezier(0.25, 0.7, 0.3, 1)`;

  return (
    <div className="pointer-events-none absolute left-0 top-0 z-[60]" aria-hidden="true">
      <div style={{ transform: `translateX(${pos.x}px)`, transition: tx }}>
        <div style={{ transform: `translateY(${pos.y}px)`, transition: ty }}>
          <div className="relative">
            {clicks > 0 ? <span key={clicks} className="demo-click-ring" /> : null}
            <div
              className="relative transition-transform duration-150 ease-out"
              style={{ transform: pressed ? "scale(0.84)" : "scale(1)" }}
            >
              {pointer ? <PointerHand /> : <Arrow />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="26" height="30" viewBox="0 0 26 30" className="-translate-x-[3px] -translate-y-[2px] drop-shadow-[0_6px_10px_rgb(0_0_0/0.45)]">
      <path
        d="M3 2.5 L3 24 L8.6 18.8 L12.4 27.2 L16.3 25.4 L12.6 17.2 L20.4 17.2 Z"
        fill="#fff"
        stroke="#0b1024"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PointerHand() {
  return (
    <svg width="28" height="30" viewBox="0 0 28 30" className="-translate-x-[9px] -translate-y-[2px] drop-shadow-[0_6px_10px_rgb(0_0_0/0.45)]">
      <path
        d="M10.2 2.6c1.3 0 2.3 1 2.3 2.3v7.4l.9-.2c1.2-.3 2.3.4 2.6 1.5l.1.4.5-.1c1.2-.2 2.3.5 2.6 1.6l.1.3.4-.1c1.3-.2 2.5.7 2.6 2v4.6c0 4.1-3.3 7.4-7.4 7.4h-1.6c-2.4 0-4.6-1.1-6-3L3.4 21c-.7-1-.5-2.4.5-3.1.9-.6 2.1-.5 2.9.2l1.1 1.1V4.9c0-1.3 1-2.3 2.3-2.3Z"
        fill="#fff"
        stroke="#0b1024"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Typewriter                                                          */
/* ------------------------------------------------------------------ */

/**
 * Streams `text` character by character while `play` is true, pausing a beat
 * on punctuation the way a model streams tokens. Shows it whole once `done`.
 */
export function Typewriter({
  text,
  play,
  done = false,
  cps = 42,
  caret = true,
  className = "",
  renderText,
}: {
  text: string;
  play: boolean;
  done?: boolean;
  cps?: number;
  caret?: boolean;
  className?: string;
  renderText?: (visible: string) => ReactNode;
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!play || done) return;
    let i = 0;
    let timer = 0;
    const step = () => {
      i = Math.min(text.length, i + 1 + (i % 7 === 3 ? 1 : 0));
      setN(i);
      if (i >= text.length) return;
      const ch = text[i - 1];
      const pause = ch === "." || ch === "," || ch === "—" ? 5 : 1;
      timer = window.setTimeout(step, (1000 / cps) * pause);
    };
    timer = window.setTimeout(step, 1000 / cps);
    return () => window.clearTimeout(timer);
  }, [play, done, text, cps]);

  const shown = done ? text : play ? text.slice(0, n) : "";
  const typing = play && !done && n < text.length;
  return (
    <span className={className}>
      {renderText ? renderText(shown) : shown}
      {caret && typing ? <span className="demo-caret" /> : null}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Animated number                                                     */
/* ------------------------------------------------------------------ */

/** Tweens from the previously shown value to `value` whenever it changes. */
export function Tween({
  value,
  format,
  duration = 1100,
  from,
}: {
  value: number;
  format: (n: number) => string;
  duration?: number;
  /** Optional start value used on mount (e.g. 0 for a count-up). */
  from?: number;
}) {
  const [shown, setShown] = useState(from ?? value);
  const shownRef = useRef(from ?? value);

  useEffect(() => {
    const start = shownRef.current;
    if (start === value) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      const v = start + (value - start) * e;
      shownRef.current = v;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{format(shown)}</>;
}

/** Returns `value`, eased toward over `duration` ms whenever it changes. */
export function useTweened(value: number, duration = 1100) {
  const [shown, setShown] = useState(value);
  const shownRef = useRef(value);
  useEffect(() => {
    const start = shownRef.current;
    if (start === value) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      const v = start + (value - start) * e;
      shownRef.current = v;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return shown;
}

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

/** Smooth monotone-ish cubic path through points. */
export function smoothPath(pts: readonly (readonly [number, number])[]) {
  const r = (n: number) => Math.round(n * 100) / 100;
  let d = `M ${r(pts[0]![0])} ${r(pts[0]![1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1]!;
    const [x, y] = pts[i]!;
    const cx = r((px + x) / 2);
    d += ` C ${cx} ${r(py)}, ${cx} ${r(y)}, ${r(x)} ${r(y)}`;
  }
  return d;
}

export const fmt = {
  money1: (n: number) => `$${n.toFixed(1)}M`,
  moneyB: (n: number) => `$${n.toFixed(2)}B`,
  money0: (n: number) => `$${Math.round(n)}M`,
  pct1: (n: number) => `${n.toFixed(1)}%`,
  int: (n: number) => Math.round(n).toLocaleString("en-US"),
  signedMoney1: (n: number) => `${n < 0 ? "−" : "+"}$${Math.abs(n).toFixed(1)}M`,
};
