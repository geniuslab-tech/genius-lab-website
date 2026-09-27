"use client";

import type { ReactNode, RefObject } from "react";
import { useScroll } from "motion/react";
import { useMediaQuery } from "@/lib/useMediaQuery";

/** True when the viewer asked for reduced motion. False on the server and during hydration. */
export function useStill() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Scroll progress of a pinned scene: 0 when its top meets the viewport top, 1 when its end leaves. */
export function usePin(ref: RefObject<HTMLElement | null>) {
  return useScroll({ target: ref, offset: ["start start", "end end"] }).scrollYProgress;
}

/** A slate line: scene number and slug, set in the timecode face. */
export function Slate({ sc, children, className = "" }: { sc: string; children: ReactNode; className?: string }) {
  return (
    <p className={`v9-tc flex items-center gap-3 text-(--v9-dim) ${className}`}>
      <span className="text-(--v9-ice)">SC {sc}</span>
      <span className="h-px w-6 bg-white/20" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

/** Frame timecode for a given index, deterministic so server and client agree. */
export function timecode(totalFrames: number) {
  const fps = 24;
  const f = totalFrames % fps;
  const s = Math.floor(totalFrames / fps) % 60;
  const m = Math.floor(totalFrames / (fps * 60)) % 60;
  const h = Math.floor(totalFrames / (fps * 3600));
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(s)}:${p(f)}`;
}

export const round1 = (v: number) => Math.round(v * 10) / 10;
