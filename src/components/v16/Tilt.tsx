"use client";

import { useRef, type ComponentProps, type ElementType, type PointerEvent } from "react";

type Props<T extends ElementType> = { as?: T; max?: number; className?: string } & Omit<ComponentProps<T>, "as">;

/**
 * A surface that tilts toward the cursor, with a specular highlight that follows it.
 * Mouse and pen only; touch and reduced motion get a still card (see v16.css).
 */
export function Tilt<T extends ElementType = "div">({ as, max = 7, className = "", children, ...rest }: Props<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const frame = useRef(0);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const x = (clientX - r.left) / r.width;
      const y = (clientY - r.top) / r.height;
      el.dataset.live = "";
      el.style.setProperty("--ry", `${((x - 0.5) * 2 * max).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${((0.5 - y) * 2 * max).toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      el.style.setProperty("--glow", "1");
    });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    delete el.dataset.live;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--glow", "0");
  };

  return (
    <Tag ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`v16-tilt ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
