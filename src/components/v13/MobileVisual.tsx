"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { Morph } from "./Morph";

/** Below the split layout, each chapter carries its own visual, which assembles on arrival. */
export function MobileVisual({ state }: { state: number }) {
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const ref = useRef<HTMLDivElement>(null);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || arrived) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setArrived(true);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [arrived]);

  return (
    <div ref={ref} className="mx-auto mt-6 aspect-square w-full max-w-[380px]">
      <Morph state={arrived || reduce ? state : 0} still={reduce} />
    </div>
  );
}
