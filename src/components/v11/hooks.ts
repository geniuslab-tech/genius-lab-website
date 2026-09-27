"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";

export function useReduced() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True once the element has entered the viewport (or while it is in view, when once is false). */
export function useInView(ref: RefObject<Element | null>, { once = true, threshold = 0.25 } = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, threshold]);
  return inView;
}

const noop = () => () => {};

/** "⌘" on Apple platforms, "Ctrl" elsewhere. "Ctrl" on the server and during hydration. */
export function useModKey() {
  return useSyncExternalStore(
    noop,
    () => (/Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent) ? "⌘" : "Ctrl"),
    () => "Ctrl",
  );
}

/** The id of the section currently under the upper third of the viewport. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>("top");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-30% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}
