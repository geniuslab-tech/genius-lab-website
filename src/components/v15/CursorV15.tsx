"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const INTERACTIVE = "a, button, [role='button'], [data-cursor]";

/**
 * A champagne ring that trails the pointer and opens over anything interactive.
 * CSS keeps it hidden unless the pointer is fine and motion is welcome; the native
 * cursor stays, so nothing is lost for anyone.
 */
export function CursorV15() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 260, damping: 32, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 32, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!fine.matches) return;
    const el = ref.current;
    if (!el) return;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      el.removeAttribute("data-hidden");
      const t = e.target instanceof Element ? e.target.closest(INTERACTIVE) : null;
      if (t) el.setAttribute("data-hover", "");
      else el.removeAttribute("data-hover");
    };
    const down = () => el.setAttribute("data-down", "");
    const up = () => el.removeAttribute("data-down");
    const leave = () => el.setAttribute("data-hidden", "");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  return (
    <motion.div ref={ref} className="lx-cursor" data-hidden="" style={{ x: sx, y: sy }} aria-hidden="true">
      <div className="lx-cursor-ring" />
    </motion.div>
  );
}
