"use client";

import { useEffect, useRef } from "react";

const GRID = 32;
const COLS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * A crosshair that follows the pointer across its parent, snapping cell to cell on a
 * 32px grid, with a raw coordinate label. Fine pointers only.
 */
export function Crosshair14() {
  const root = useRef<HTMLDivElement>(null);
  const h = useRef<HTMLDivElement>(null);
  const v = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);
  const txt = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let px = 0;
    let py = 0;
    const paint = () => {
      raf = 0;
      const r = host.getBoundingClientRect();
      const x = Math.max(0, Math.min(r.width, px - r.left));
      const y = Math.max(0, Math.min(r.height, py - r.top));
      const sx = Math.round(x / GRID) * GRID;
      const sy = Math.round(y / GRID) * GRID;
      if (h.current) h.current.style.transform = `translate3d(0,${sy}px,0)`;
      if (v.current) v.current.style.transform = `translate3d(${sx}px,0,0)`;
      if (tag.current) {
        const flipX = sx > r.width - 220;
        const flipY = sy > r.height - 60;
        tag.current.style.transform = `translate3d(${sx + (flipX ? -12 : 12)}px,${sy + (flipY ? -12 : 12)}px,0) translate(${flipX ? "-100%" : "0"},${flipY ? "-100%" : "0"})`;
      }
      if (txt.current) {
        const col = COLS[Math.floor(sx / GRID) % 26] ?? "A";
        const row = String(Math.floor(sy / GRID)).padStart(2, "0");
        txt.current.textContent = `${col}${row} · X${String(sx).padStart(4, "0")} Y${String(sy).padStart(4, "0")}`;
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      el.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 overflow-hidden opacity-0">
      <div ref={h} className="absolute inset-x-0 top-0 h-px bg-[#1f3bff]" />
      <div ref={v} className="absolute inset-y-0 left-0 w-px bg-[#1f3bff]" />
      <div ref={tag} className="absolute left-0 top-0 flex items-center gap-2 border-2 border-black bg-white px-2 py-1">
        <span className="inline-block h-2 w-2 bg-[#1f3bff]" />
        <span ref={txt} className="v14-mono whitespace-nowrap text-[0.6875rem] text-black">
          A00 · X0000 Y0000
        </span>
      </div>
    </div>
  );
}
