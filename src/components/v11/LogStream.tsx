"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView, useReduced } from "./hooks";

/** Reveals its children one line at a time, the first time it is seen. Shows everything at once with reduced motion. */
export function LogStream({ lines, step = 260, className = "" }: { lines: ReactNode[]; step?: number; className?: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { threshold: 0.3 });
  const reduce = useReduced();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || reduce || n >= lines.length) return;
    const id = setTimeout(() => setN((x) => x + 1), n === 0 ? 350 : step);
    return () => clearTimeout(id);
  }, [inView, reduce, n, lines.length, step]);

  const shown = reduce ? lines.length : n;

  return (
    <ol ref={ref} className={className}>
      {lines.map((l, i) => (
        <li key={i} className={`transition-opacity duration-150 ${i < shown ? "opacity-100" : "opacity-0"}`}>
          {l}
        </li>
      ))}
    </ol>
  );
}
