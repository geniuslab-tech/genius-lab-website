"use client";

import { useEffect, useRef, useState, type ComponentProps, type CSSProperties, type ElementType, type PointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

/** Whether an element is on screen. Every live mini-UI starts and stops its timers with this. */
export function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/** Counts from its previous value to the next. The server renders the final value. */
export function Ticker({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 900,
  className = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (reduce) {
      from.current = value;
      const t = setTimeout(() => setShown(value), 0);
      return () => clearTimeout(t);
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - k, 4);
      const v = a + (value - a) * e;
      from.current = v;
      setShown(v);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    // If frames are paused (background tab), land on the value anyway.
    const safety = setTimeout(() => {
      from.current = value;
      setShown(value);
    }, duration + 400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
    };
  }, [value, duration, reduce]);
  const text = shown.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span className={`v18-tab ${className}`}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}

/** Counts up from zero once it scrolls into view. Server and no-JS render the true number. */
export function CountUp({ to, className = "" }: { to: number; className?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.4);
  const reduce = useReducedMotion();
  const [value, setValue] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (reduce || !el || el.getBoundingClientRect().top < window.innerHeight) return;
    const t = setTimeout(() => setValue(0), 0);
    return () => clearTimeout(t);
  }, [reduce, ref]);
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setValue(to), 60);
    return () => clearTimeout(t);
  }, [inView, to]);
  return (
    <span ref={ref}>
      <Ticker value={value} duration={1400} className={className} />
    </span>
  );
}

/** A bento tile with a cursor-following edge light. */
export function Tile({
  as,
  navy = false,
  className = "",
  delay = 0,
  children,
  ...rest
}: {
  as?: ElementType;
  navy?: boolean;
  className?: string;
  delay?: number;
  children: ReactNode;
} & Omit<ComponentProps<"div">, "children">) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${Math.round(e.clientX - r.left)}px`);
    el.style.setProperty("--my", `${Math.round(e.clientY - r.top)}px`);
  };
  return (
    <Tag ref={ref} onPointerMove={onMove} data-rv="" style={{ "--rd": `${delay}ms` } as CSSProperties} className={`v18-tile ${navy ? "is-navy" : ""} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/** Section opener: mono index and label, the headline, an optional lead to the right. */
export function SectionHead({
  id,
  index,
  label,
  title,
  lead,
  navy = false,
  className = "",
}: {
  id: string;
  index: string;
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  navy?: boolean;
  className?: string;
}) {
  return (
    <div className={`grid gap-6 lg:grid-cols-12 lg:items-end ${className}`}>
      <div className="lg:col-span-7" data-rv="">
        <p className={`v18-label flex items-center gap-3 ${navy ? "text-white/60" : "text-(--ink-3)"}`}>
          <span className={navy ? "text-(--ember)" : "text-(--sky-ink)"}>{index}</span>
          <span className={`h-px w-8 ${navy ? "bg-white/25" : "bg-(--rule-2)"}`} aria-hidden="true" />
          {label}
        </p>
        <h2 id={id} className={`v18-h2 mt-5 max-w-[20ch] ${navy ? "text-white" : "text-(--ink)"}`}>
          {title}
        </h2>
      </div>
      {lead && (
        <p data-rv="" style={{ "--rd": "90ms" } as CSSProperties} className={`text-pretty max-w-[52ch] text-[1.0625rem] leading-[1.7] lg:col-span-5 ${navy ? "text-white/70" : "text-(--ink-2)"}`}>
          {lead}
        </p>
      )}
    </div>
  );
}

/** The honest-evidence tag every demonstration carries. */
export function Illustrative({ navy = false, children = "Illustrative" }: { navy?: boolean; children?: ReactNode }) {
  return <span className={`v18-chip ${navy ? "bg-white/10 text-white/70" : "bg-(--grey) text-(--ink-3) shadow-[inset_0_0_0_1px_var(--rule)]"}`}>{children}</span>;
}

/**
 * Reveal controller. Content is visible by default: the page is only "armed" (hidden start
 * states on) after anything already on screen has been marked shown, and a sweep keeps
 * revealing whatever has scrolled past, even if observer events are missed.
 */
export function RevealV18() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".v18");
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-rv]"));
    const show = (el: Element) => el.classList.add("is-in");
    const onScreen = (el: Element) => el.getBoundingClientRect().top < window.innerHeight * 0.95;
    els.forEach((el) => onScreen(el) && show(el));
    root.classList.add("v18-armed");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting || e.boundingClientRect.top < 0) {
            show(e.target);
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    els.forEach((el) => !el.classList.contains("is-in") && io.observe(el));
    const sweep = window.setInterval(() => {
      for (const el of els) if (!el.classList.contains("is-in") && onScreen(el)) show(el);
    }, 1000);
    return () => {
      io.disconnect();
      window.clearInterval(sweep);
      root.classList.remove("v18-armed");
    };
  }, []);
  return null;
}
