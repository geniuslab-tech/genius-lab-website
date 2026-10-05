"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type Cues = Record<string, number>;

export type Clock<C extends Cues> = {
  /** Index of the last cue passed (-1 before the first). */
  index: number;
  /** Increments every loop, and on every seek, so the world can remount fresh. */
  epoch: number;
  /** Loop position (ms) when the current cue was crossed. */
  at: number;
  past: (name: keyof C) => boolean;
  between: (from: keyof C, to: keyof C) => boolean;
};

/**
 * The hero's scene clock (see hero-demo/engine useScene) with seek and pause:
 * re-renders only when a cue is crossed, pauses off-screen or in a hidden tab,
 * and holds still for reduced-motion users until they pick a step.
 */
export function useLoopClock<C extends Cues>(cues: C, loopMs: number, staticCue: keyof C) {
  const ref = useRef<HTMLDivElement>(null);
  const order = useMemo(() => Object.entries(cues).sort((a, b) => a[1] - b[1]), [cues]);
  const indexAt = useCallback(
    (t: number) => {
      let i = -1;
      for (let k = 0; k < order.length; k++) if (t >= order[k]![1]) i = k;
      return i;
    },
    [order],
  );

  const [state, setState] = useState<{ index: number; epoch: number; at: number }>(() => ({ index: indexAt(cues[staticCue]!), epoch: 0, at: cues[staticCue]! }));
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [animated, setAnimated] = useState(true);

  const elapsed = useRef(0);
  const cur = useRef({ index: -2, loop: 0, epoch: 0 });
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // ?flow=<ms> freezes the script at that moment, for review and screenshots.
    const pinned = Number(new URLSearchParams(window.location.search).get("flow"));
    if (pinned > 0) {
      const id = window.setTimeout(() => {
        setAnimated(false);
        setState({ index: indexAt(pinned % loopMs), epoch: 0, at: pinned % loopMs });
      }, 0);
      return () => window.clearTimeout(id);
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => setAnimated(false), 0);
      return () => window.clearTimeout(id);
    }

    // start from the top of the loop, not the still frame used for SSR
    cur.current = { index: indexAt(0), loop: 0, epoch: 1 };
    const boot = window.setTimeout(() => setState({ index: indexAt(0), epoch: 1, at: 0 }), 0);

    let raf = 0;
    let last = 0;
    let live = false;
    let visible = false;

    const tick = (now: number) => {
      if (!pausedRef.current) elapsed.current += Math.min(now - last, 100);
      last = now;
      const loop = Math.floor(elapsed.current / loopMs);
      const t = elapsed.current % loopMs;
      const i = indexAt(t);
      if (i !== cur.current.index || loop !== cur.current.loop) {
        const epoch = loop !== cur.current.loop ? cur.current.epoch + 1 : cur.current.epoch;
        cur.current = { index: i, loop, epoch };
        setState({ index: i, epoch, at: t });
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (live) return;
      live = true;
      setRunning(true);
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      live = false;
      setRunning(false);
      cancelAnimationFrame(raf);
    };
    const sync = () => (visible && !document.hidden ? start() : stop());
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
        sync();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.clearTimeout(boot);
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [indexAt, loopMs]);

  /** Jump to a moment in the loop; the world remounts there and plays on. */
  const seek = useCallback(
    (ms: number) => {
      const loop = Math.floor(elapsed.current / loopMs);
      elapsed.current = loop * loopMs + ms;
      const i = indexAt(ms);
      const epoch = cur.current.epoch + 1;
      cur.current = { index: i, loop, epoch };
      setState({ index: i, epoch, at: ms });
    },
    [indexAt, loopMs],
  );

  const togglePause = useCallback(() => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  }, []);

  const clock = useMemo<Clock<C>>(() => {
    const pos = (name: keyof C) => order.findIndex(([n]) => n === name);
    return {
      index: state.index,
      epoch: state.epoch,
      at: state.at,
      past: (name) => state.index >= pos(name),
      between: (from, to) => state.index >= pos(from) && state.index < pos(to),
    };
  }, [state, order]);

  return { ref, clock, seek, running: running && !paused, paused, togglePause, animated };
}
