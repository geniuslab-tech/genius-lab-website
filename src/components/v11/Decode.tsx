"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReduced } from "./hooks";

const GLYPHS = "#%&*+=<>/\\_-01ABCDEFGHJKLMNPRSTUVXYZ";

/**
 * A heading that decodes from noise into its words, left to right, the first time it is seen.
 * The real text is always in the DOM for assistive tech; the animated copy is aria-hidden.
 */
export function Decode({
  text,
  as = "h2",
  id,
  className,
  duration = 820,
  boot = true,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  className?: string;
  duration?: number;
  boot?: boolean;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { threshold: 0.2 });
  const reduce = useReduced();
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const start = performance.now();
    const n = text.length;
    const tick = (now: number) => {
      const t = now - start;
      let out = "";
      let done = true;
      for (let i = 0; i < n; i++) {
        const ch = text[i];
        const at = 120 + (i / n) * duration * 0.8;
        if (ch === " " || t >= at) out += ch;
        else {
          done = false;
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setShown(out);
      if (!done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, text, duration]);

  const Tag = as;
  return (
    <Tag ref={ref} id={id} className={className} data-boot={boot ? "" : undefined}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{reduce ? text : shown}</span>
    </Tag>
  );
}
