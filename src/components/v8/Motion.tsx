"use client";

import { useEffect } from "react";

/**
 * One controller for the whole issue:
 * - groups headline words into rendered lines (for the line-by-line mask),
 * - marks [data-v8] blocks as in view,
 * - tracks the current chapter in the table of contents,
 * - writes reading progress to --v8-p on the page root.
 */
export function V8Motion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".v8");
    if (!root) return;

    // 1. Line grouping. Re-run on resize until each headline has been revealed.
    const heads = Array.from(root.querySelectorAll<HTMLElement>('[data-v8="lines"]'));
    const group = () => {
      for (const h of heads) {
        if (h.dataset.in) continue;
        const words = Array.from(h.querySelectorAll<HTMLElement>(".w"));
        let line = -1;
        let top = -Infinity;
        for (const w of words) {
          const t = w.offsetTop;
          if (t > top + 4) {
            line += 1;
            top = t;
          }
          w.firstElementChild?.setAttribute("style", `--l:${line}`);
        }
      }
    };
    group();
    // Fonts swap in after first paint and can re-wrap lines.
    document.fonts?.ready.then(group).catch(() => {});
    window.addEventListener("resize", group);

    // 2. Reveals. Clipped blocks are observed through their parent.
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-v8]"));
    const byTarget = new Map<Element, HTMLElement[]>();
    for (const el of els) {
      const kind = el.dataset.v8;
      const target = kind === "turn" || kind === "rule" || kind === "vrule" ? (el.parentElement ?? el) : el;
      byTarget.set(target, [...(byTarget.get(target) ?? []), el]);
    }
    const show = (el: HTMLElement) => {
      el.dataset.in = "1";
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting && e.boundingClientRect.top > 0) continue;
          for (const el of byTarget.get(e.target) ?? []) show(el);
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );
    byTarget.forEach((_, t) => io.observe(t));
    const sweep = window.setInterval(() => {
      for (const el of els) if (!el.dataset.in && el.getBoundingClientRect().top < window.innerHeight * 0.95) show(el);
    }, 1400);

    // 3. Current chapter in the contents strip.
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>(".toc-link"));
    const strip = root.querySelector<HTMLElement>(".toc-strip");
    const chapters = Array.from(root.querySelectorAll<HTMLElement>("[data-chapter]"));
    const setActive = (id: string | null) => {
      for (const a of links) {
        const on = a.getAttribute("href") === `#${id}`;
        if (on) {
          a.setAttribute("aria-current", "true");
          if (strip && strip.scrollWidth > strip.clientWidth) {
            strip.scrollTo({ left: a.offsetLeft - strip.clientWidth / 2 + a.clientWidth / 2, behavior: "smooth" });
          }
        } else a.removeAttribute("aria-current");
      }
    };
    const chapterIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.chapter ?? null);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const c of chapters) chapterIo.observe(c);

    // 4. Reading progress.
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        root.style.setProperty("--v8-p", p.toFixed(4));
        if (window.scrollY < window.innerHeight * 0.4) setActive(null);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      chapterIo.disconnect();
      window.clearInterval(sweep);
      window.removeEventListener("resize", group);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
