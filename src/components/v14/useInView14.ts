"use client";

import { useEffect, useState, type RefObject } from "react";

/** True while the element is at least `threshold` visible. */
export function useInView14(ref: RefObject<Element | null>, threshold = 0.3) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return inView;
}
