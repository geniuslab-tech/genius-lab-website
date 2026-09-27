"use client";

import { useEffect, useRef, useState, type ComponentProps, type CSSProperties, type ElementType, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";

/** Tracks whether an element is on screen. Used to start and stop every mini-UI's timers. */
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

/** A bento tile: white surface, spotlight that follows the cursor, spring lift on hover. */
export function Tile({
  as,
  dark = false,
  className = "",
  delay = 0,
  children,
  ...rest
}: {
  as?: ElementType;
  dark?: boolean;
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
    <Tag
      ref={ref}
      onPointerMove={onMove}
      data-v12-rv=""
      style={{ "--rd": `${delay}ms` } as CSSProperties}
      className={`v12-tile ${dark ? "is-dark" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** A button or link that leans toward the cursor, then springs home. */
export function Magnetic({ children, strength = 0.28, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 260, damping: 18, mass: 0.6 });
  const y = useSpring(0, { stiffness: 260, damping: 18, mass: 0.6 });
  const ref = useRef<HTMLSpanElement>(null);
  return (
    <motion.span
      ref={ref}
      style={{ x, y }}
      className={`inline-flex ${className}`}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/** Counts from its previous value to the next. Renders the final value on the server. */
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
      const t = requestAnimationFrame(() => setShown(value));
      return () => cancelAnimationFrame(t);
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
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduce]);
  const text = shown.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span className={`v12-tabnum ${className}`}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}

/** Tight section opener: a coded label, the headline, an optional lead to its right. */
export function SectionHead({
  id,
  index,
  label,
  title,
  lead,
  dark = false,
}: {
  id: string;
  index: string;
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-7" data-v12-rv="">
        <p className={`v12-label flex items-center gap-3 ${dark ? "text-white/55" : "text-(--ink-3)"}`}>
          <span className={`rounded-[4px] px-1.5 py-1 ${dark ? "bg-white/10 text-white" : "bg-(--ink) text-white"}`}>{index}</span>
          {label}
        </p>
        <h2 id={id} className={`v12-h2 mt-5 max-w-[20ch] ${dark ? "text-white" : "text-(--ink)"}`}>
          {title}
        </h2>
      </div>
      {lead && (
        <p data-v12-rv="" style={{ "--rd": "90ms" } as CSSProperties} className={`text-pretty max-w-[50ch] text-[1.0625rem] leading-[1.65] lg:col-span-5 ${dark ? "text-white/65" : "text-(--ink-2)"}`}>
          {lead}
        </p>
      )}
    </div>
  );
}

/** Small tile header: coded label on the left, status or tag on the right. */
export function TileHead({ label, right, dark = false }: { label: ReactNode; right?: ReactNode; dark?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={`v12-label ${dark ? "text-white/50" : "text-(--ink-3)"}`}>{label}</span>
      {right}
    </div>
  );
}

/** The honest-evidence tag every demonstration carries. */
export function Illustrative({ dark = false, children = "Illustrative" }: { dark?: boolean; children?: ReactNode }) {
  return (
    <span className={`v12-chip ${dark ? "bg-white/10 text-white/60" : "bg-(--ground) text-(--ink-3) shadow-[inset_0_0_0_1px_var(--rule)]"}`}>
      {children}
    </span>
  );
}

/** Adds .is-in to reveal targets as they enter the viewport. */
export function RevealV12() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".v12 [data-v12-rv]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

/** A segmented radio control with a sliding thumb. Arrow keys move between options. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  dark = false,
  size = "md",
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  dark?: boolean;
  size?: "sm" | "md";
}) {
  const idx = Math.max(0, options.findIndex((o) => o.id === value));
  const n = options.length;
  const move = (e: KeyboardEvent<HTMLButtonElement>, dir: number) => {
    e.preventDefault();
    const next = (idx + dir + n) % n;
    onChange(options[next].id);
    const btns = e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button");
    btns?.[next]?.focus();
  };
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`relative grid rounded-full p-1 ${dark ? "bg-white/10" : "bg-(--ground) shadow-[inset_0_0_0_1px_var(--rule)]"}`}
      style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
    >
      <span
        className={`absolute inset-y-1 left-1 rounded-full transition-transform duration-[600ms] ease-[var(--spring)] ${dark ? "bg-white" : "bg-white shadow-[0_0_0_1px_var(--rule-2),0_2px_6px_-2px_rgb(16_20_64/0.2)]"}`}
        style={{ width: `calc((100% - 8px) / ${n})`, transform: `translateX(${idx * 100}%)` }}
        aria-hidden="true"
      />
      {options.map((o, i) => {
        const on = i === idx;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") move(e, 1);
              else if (e.key === "ArrowLeft" || e.key === "ArrowUp") move(e, -1);
            }}
            className={`relative z-10 truncate rounded-full px-2.5 font-medium transition-colors duration-300 ${size === "sm" ? "h-8 text-[0.8125rem]" : "h-10 text-[0.875rem]"} ${
              on ? "text-(--ink)" : dark ? "text-white/70 hover:text-white" : "text-(--ink-3) hover:text-(--ink)"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
