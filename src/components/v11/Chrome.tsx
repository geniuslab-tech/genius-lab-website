"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/v2/ui";
import { EVENTS, EXTRA_SECTIONS, SECTIONS, jumpTo } from "./data";
import { useActiveSection, useModKey, useReduced } from "./hooks";

const IDS = ["top", ...SECTIONS.map((s) => s.id), ...EXTRA_SECTIONS.map((s) => s.id)] as const;
const PATHS: Record<string, string> = Object.fromEntries([
  ["top", ""],
  ...SECTIONS.map((s) => [s.id, s.path]),
  ...EXTRA_SECTIONS.map((s) => [s.id, s.path]),
]);

const NAV = [
  { id: "layers", label: "platform" },
  { id: "brain", label: "second-brain" },
  { id: "agents", label: "agents" },
  { id: "portal", label: "portal" },
  { id: "segments", label: "solutions" },
];

const openPalette = () => window.dispatchEvent(new CustomEvent(EVENTS.palette));

/** Top bar: the logo, a prompt-style breadcrumb, primary links, the palette and the one call to action. */
export function TopBar() {
  const mod = useModKey();
  const active = useActiveSection(IDS);
  const path = PATHS[active] ?? "";

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-(--rule) bg-(--bg)/92 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <a href="#top" aria-label="Genius Lab, home" className="block shrink-0 py-2">
            <BrandLogo tone="white" className="h-[13px] w-auto" />
          </a>
          <span className="v11-term hidden min-w-0 truncate text-[12.5px] text-(--fg-3) md:block" aria-hidden="true">
            <span className="text-(--fg-2)">~/genius-lab</span>
            {path && <span className="text-(--amber)">/{path}</span>}
          </span>
        </div>

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-1 text-[13px]">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  aria-current={active === n.id ? "location" : undefined}
                  className={`block px-2.5 py-1.5 transition-colors hover:text-(--fg) ${active === n.id ? "text-(--amber)" : "text-(--fg-2)"}`}
                >
                  {n.label}/
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={openPalette}
            aria-haspopup="dialog"
            aria-keyshortcuts="Control+K Meta+K"
            className="flex h-9 items-center gap-3 border border-(--rule-2) px-3 text-[13px] text-(--fg-2) transition-colors hover:border-(--fg-3) hover:text-(--fg)"
          >
            <span className="sm:hidden">menu</span>
            <span className="hidden sm:inline">commands</span>
            <kbd className="hidden sm:inline-flex">{mod === "Ctrl" ? "Ctrl K" : "⌘K"}</kbd>
          </button>
          <a href="#contact" className="v11-btn hidden !min-h-9 !px-3 text-[13px] sm:inline-flex">
            Book a demo
          </a>
        </div>
      </div>
    </header>
  );
}

/** Bottom status bar: mode, path, section shortcuts and scroll position. Also owns the number-key shortcuts. */
export function StatusBar() {
  const mod = useModKey();
  const reduce = useReduced();
  const active = useActiveSection(IDS);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setPct(max > 0 ? Math.round((window.scrollY / max) * 100) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      if (document.querySelector(".v11 dialog[open]")) return;
      const s = SECTIONS.find((x) => x.key === e.key);
      if (s) {
        e.preventDefault();
        jumpTo(s.id, reduce);
      } else if (e.key === "g") {
        jumpTo("top", reduce);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reduce]);

  const path = PATHS[active] ?? "";

  return (
    <div className="v11-term fixed inset-x-0 bottom-0 z-40 border-t border-(--rule-2) bg-(--bg-3) text-[12px]">
      <div className="mx-auto flex h-9 max-w-[1440px] items-stretch justify-between">
        <div className="flex min-w-0 items-stretch">
          <span className="flex items-center bg-(--amber) px-3 font-semibold tracking-[0.06em] text-[#1a1206]">NORMAL</span>
          <span className="flex min-w-0 items-center truncate px-3 text-(--fg-2)" aria-live="off">
            ~/genius-lab{path && <span className="text-(--fg)">/{path}</span>}
          </span>
        </div>

        <nav aria-label="Section shortcuts" className="hidden min-w-0 items-center 2xl:flex">
          <ul className="flex items-center gap-3 text-(--fg-3)">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-keyshortcuts={s.key}
                  className={`flex items-center gap-1.5 transition-colors hover:text-(--fg) ${active === s.id ? "text-(--amber)" : ""}`}
                >
                  <span className={active === s.id ? "text-(--amber)" : "text-(--fg-2)"}>{s.key}</span>
                  {s.path}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-stretch">
          <span className="hidden items-center gap-2 px-3 text-(--fg-3) lg:flex 2xl:hidden">
            <kbd>1</kbd>&ndash;<kbd>0</kbd> sections
          </span>
          <button
            type="button"
            onClick={openPalette}
            aria-haspopup="dialog"
            className="flex items-center gap-2 border-l border-(--rule-2) px-3 text-(--fg-2) transition-colors hover:bg-(--bg-4) hover:text-(--fg)"
          >
            <span className="hidden sm:inline">{mod === "Ctrl" ? "Ctrl+K" : "⌘K"}</span> commands
          </button>
          <span className="flex w-[4.5rem] items-center justify-end border-l border-(--rule-2) px-3 tabular-nums text-(--fg-3)" aria-hidden="true">
            {pct}%
          </span>
        </div>
      </div>
    </div>
  );
}
