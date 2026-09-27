"use client";

import { createElement, useEffect, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Marks its element data-inview="true" the first time it scrolls into view.
 * CSS in v10.css keys every draw, count and row reveal off that attribute,
 * so the content is complete without JS or with reduced motion.
 */
export function InView({
  as = "div",
  className,
  style,
  children,
  threshold = 0.25,
  id,
}: {
  as?: "div" | "figure" | "section" | "ol" | "ul" | "table" | "tbody";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  threshold?: number;
  id?: string;
}) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting || e.boundingClientRect.top < 0) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [el, threshold]);

  return createElement(as, { ref: setEl, id, className, style, "data-inview": shown ? "true" : "false" }, children);
}
