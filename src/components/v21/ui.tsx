"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { rd } from "./shared";


/**
 * Arms the page's reveal-on-scroll. Everything is visible until this runs; once armed,
 * [data-rv] elements start hidden and are shown by one IntersectionObserver. A sweep and
 * a watchdog make sure nothing stays hidden if observers or frames are paused.
 */
export function RevealController() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".v21");
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-rv]"));
    const show = (el: HTMLElement) => el.setAttribute("data-in", "");
    const showAll = () => els.forEach(show);
    if (reduce || document.visibilityState === "hidden") {
      showAll();
      return;
    }
    // Anything already on screen stays visible, so nothing flickers on load. The hero's
    // charts ([data-rv-now]) are the exception: they are armed, then drawn right away.
    const vh = window.innerHeight;
    const now: HTMLElement[] = [];
    for (const el of els) {
      if (el.closest("[data-rv-now]")) now.push(el);
      else if (el.getBoundingClientRect().top < vh * 0.92) show(el);
    }
    root.setAttribute("data-armed", "");
    const kick = window.setTimeout(() => now.forEach(show), 120);

    let heard = false;
    const io = new IntersectionObserver(
      (entries) => {
        heard = true;
        for (const e of entries) {
          if (e.isIntersecting || e.boundingClientRect.top < 0) {
            show(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );
    els.forEach((el) => !el.hasAttribute("data-in") && io.observe(el));

    const sweep = window.setInterval(() => {
      const h = window.innerHeight;
      for (const el of els) if (!el.hasAttribute("data-in") && el.getBoundingClientRect().top < h) show(el);
    }, 900);
    // Watchdog: if the observer never reports, reveal everything.
    const watchdog = window.setTimeout(() => !heard && showAll(), 2500);
    const onHide = () => document.visibilityState === "hidden" && showAll();
    document.addEventListener("visibilitychange", onHide);
    return () => {
      io.disconnect();
      window.clearInterval(sweep);
      window.clearTimeout(watchdog);
      window.clearTimeout(kick);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);
  return null;
}

/** Tracks whether an element is on screen, to start and stop mini-UI timers. */
export function useInView<T extends Element>(threshold = 0.3) {
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

/** Reduced motion, read after mount so server and client markup match. */
export function useReducedMotion21() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduce(mq.matches);
    const t = window.setTimeout(on, 0);
    mq.addEventListener("change", on);
    return () => {
      window.clearTimeout(t);
      mq.removeEventListener("change", on);
    };
  }, []);
  return reduce;
}

/** A headline that rises in line by line. Each string in `lines` is one line on wide screens. */
export function Lines({
  lines,
  as: Tag = "h2",
  id,
  className = "",
  intro = false,
  delay = 0,
}: {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  className?: string;
  intro?: boolean;
  delay?: number;
}) {
  return (
    <Tag
      id={id}
      data-rv={intro ? undefined : "lines"}
      className={`${intro ? "v21-intro-lines" : ""} ${className}`}
      style={{ ...rd(delay), "--d": `${delay}ms` } as CSSProperties}
    >
      {lines.map((l, i) => (
        <span key={i} className="v21-line">
          <span style={{ "--i": i } as CSSProperties}>{l}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Section label with its node on the page line. */
export function Eyebrow({ children, className = "", dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <p className={`v21-eyebrow v21-label ${dark ? "text-[#c9c3d6]!" : ""} ${className}`}>
      <span data-node className="v21-node" aria-hidden="true" />
      {children}
    </p>
  );
}

export function SectionHead({
  label,
  lines,
  lead,
  id,
  className = "",
  leadClass = "",
}: {
  label: string;
  lines: ReactNode[];
  lead?: ReactNode;
  id: string;
  className?: string;
  leadClass?: string;
}) {
  return (
    <div className={className}>
      <Eyebrow>{label}</Eyebrow>
      <Lines id={id} lines={lines} className="v21-display mt-5 text-[clamp(2.1rem,4.6vw,3.6rem)]" />
      {lead && (
        <p data-rv="up" style={rd(120)} className={`v21-lead mt-6 max-w-[56ch] ${leadClass}`}>
          {lead}
        </p>
      )}
    </div>
  );
}

export function Btn({
  href,
  children,
  tone = "ink",
  size = "md",
  arrow = false,
  className = "",
  onClick,
  tabIndex,
}: {
  href: string;
  children: ReactNode;
  tone?: "ink" | "line" | "cream" | "ghost-dark";
  size?: "sm" | "md";
  arrow?: boolean;
  className?: string;
  onClick?: () => void;
  tabIndex?: number;
}) {
  return (
    <a href={href} onClick={onClick} tabIndex={tabIndex} className={`v21-btn v21-btn-${tone} ${size === "sm" ? "v21-btn-sm" : ""} ${className}`}>
      {children}
      {arrow && <ArrowRight size={15} weight="bold" className="v21-arrow" aria-hidden="true" />}
    </a>
  );
}

/** Small caption that marks figures and previews as illustrative. */
export function Illustrative({ children = "Illustrative preview · sample data", className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <p className={`v21-tag ${className}`}>
      <span className="h-[5px] w-[5px] rounded-full bg-[var(--terra)]" aria-hidden="true" />
      {children}
    </p>
  );
}
