"use client";

import { useEffect, useRef, type ComponentProps, type PointerEvent as RPointerEvent, type ReactNode } from "react";
import { ArrowRight } from "@phosphor-icons/react";

/**
 * Chamfered action that leans toward the pointer. The pull is small (at most 7px) and eases back
 * on leave; touch and reduced motion get a plain button.
 */
export function MagButton({
  tone = "primary",
  size = "md",
  arrow = true,
  className = "",
  children,
  ...rest
}: ComponentProps<"a"> & { tone?: "primary" | "ghost" | "navy"; size?: "md" | "lg" | "sm"; arrow?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const onMove = (e: RPointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    el.style.setProperty("--mx", `${(x * 7).toFixed(2)}px`);
    el.style.setProperty("--my", `${(y * 5).toFixed(2)}px`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--mx", "0px");
    ref.current?.style.setProperty("--my", "0px");
  };
  return (
    <a
      ref={ref}
      {...rest}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`v23-btn v23-btn-${tone} v23-btn-${size} ${className}`}
    >
      <span className="v23-btn-in">
        <span>{children}</span>
        {arrow && <ArrowRight size={15} weight="bold" aria-hidden="true" />}
      </span>
    </a>
  );
}

/**
 * Cursor spotlight for every `.v23-spot` card inside. One delegated listener writes the pointer
 * position into the hovered card, which paints a soft light under it.
 */
export function SpotlightGroup({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let raf = 0;
    let last: PointerEvent | null = null;
    const paint = () => {
      raf = 0;
      if (!last) return;
      const card = (last.target as Element | null)?.closest?.<HTMLElement>(".v23-spot");
      if (!card || !root.contains(card)) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--sx", `${Math.round(last.clientX - r.left)}px`);
      card.style.setProperty("--sy", `${Math.round(last.clientY - r.top)}px`);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = e;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    root.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      root.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Staggered spring reveals. Hidden states only exist once this has run and marked the page ready,
 * and anything already on screen is shown first, so nothing flickers. A sweep on a plain timer
 * shows whatever an observer missed (background tabs throttle observers and frames), and a final
 * timeout shows everything if the observer never reported.
 */
export function RevealController() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".v23");
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-v23-rv]"));
    const show = (el: HTMLElement) => el.classList.add("is-in");
    const vh = window.innerHeight;
    for (const el of els) if (el.getBoundingClientRect().top < vh * 0.94) show(el);
    root.dataset.rvReady = "1";

    let alive = false;
    const io = new IntersectionObserver(
      (entries) => {
        alive = true;
        for (const e of entries) {
          if (e.isIntersecting || e.boundingClientRect.top < 0) {
            show(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    for (const el of els) if (!el.classList.contains("is-in")) io.observe(el);

    const sweep = window.setInterval(() => {
      const h = window.innerHeight;
      for (const el of els) if (!el.classList.contains("is-in") && el.getBoundingClientRect().top < h) show(el);
    }, 900);
    const onVis = () => {
      if (document.visibilityState === "visible") return;
      els.forEach(show);
    };
    document.addEventListener("visibilitychange", onVis);
    // If the observer never reported at all, stop waiting for it.
    const safety = window.setTimeout(() => !alive && els.forEach(show), 3500);
    return () => {
      io.disconnect();
      window.clearInterval(sweep);
      window.clearTimeout(safety);
      document.removeEventListener("visibilitychange", onVis);
      delete root.dataset.rvReady;
    };
  }, []);
  return null;
}
