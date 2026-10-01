"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const VERSIONS = [
  { v: 1, name: "Survey atlas", tone: "Light" },
  { v: 2, name: "Navy brand", tone: "Mixed" },
  { v: 3, name: "Navy hero", tone: "Mixed" },
  { v: 4, name: "Dark console", tone: "Dark" },
  { v: 5, name: "Apple premium", tone: "Light" },
  { v: 6, name: "Enterprise console", tone: "Mixed" },
  { v: 7, name: "Layer studies", tone: "Dark" },
  { v: 8, name: "Editorial", tone: "Light" },
  { v: 9, name: "Cinematic", tone: "Dark" },
  { v: 10, name: "Boardroom", tone: "Light" },
  { v: 11, name: "Terminal", tone: "Dark" },
  { v: 12, name: "Product bento", tone: "Light" },
  { v: 13, name: "Split inversion", tone: "Mixed" },
  { v: 14, name: "Brutalist", tone: "Light" },
  { v: 15, name: "Luxe", tone: "Dark" },
  { v: 16, name: "Spatial 3D", tone: "Dark" },
  { v: 17, name: "Organic", tone: "Light" },
  { v: 18, name: "Navy platform", tone: "Mixed" },
  { v: 19, name: "Midnight product", tone: "Dark" },
  { v: 20, name: "Clarity split", tone: "Mixed" },
  { v: 21, name: "Warm enterprise", tone: "Light" },
  { v: 22, name: "Chamfer", tone: "Mixed" },
  { v: 23, name: "Aurora console", tone: "Mixed" },
  { v: 24, name: "Core hero", tone: "Dark" },
  { v: 25, name: "Approve & execute", tone: "Dark" },
  { v: 26, name: "Margin recovery", tone: "Dark" },
  { v: 27, name: "Ask Genius", tone: "Dark" },
  { v: 28, name: "Premium film", tone: "Dark" },
  { v: 29, name: "M&A integration", tone: "Dark" },
  { v: 30, name: "Decision inbox", tone: "Dark" },
  { v: 31, name: "Scenario premium", tone: "Dark" },
  { v: 32, name: "How it works cinematic", tone: "Dark" },
  { v: 33, name: "How · connected journey", tone: "Dark" },
  { v: 34, name: "How · vertical spine", tone: "Dark" },
  { v: 35, name: "How · orbital core", tone: "Dark" },
  { v: 36, name: "How · bento assembly", tone: "Dark" },
  { v: 37, name: "How · morph", tone: "Dark" },
  { v: 38, name: "How · depth fly-through", tone: "Dark" },
  { v: 39, name: "Briefing refined", tone: "Dark" },
  { v: 40, name: "Genius rail", tone: "Dark" },
  { v: 41, name: "Glass guide", tone: "Dark" },
  { v: 42, name: "Briefing strip", tone: "Dark" },
  { v: 43, name: "Voice briefing", tone: "Dark" },
];

/** The versions grouped the way the app folders are: app/(homepages), app/(hero-animation), app/(flow). */
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const byNumber = new Map(VERSIONS.map((x) => [x.v, x]));
const GROUPS = [
  { name: "HOMEPAGES", versions: range(1, 23) },
  { name: "HERO ANIMATION", versions: [...range(24, 31), ...range(39, 43)] },
  { name: "FLOW", versions: range(32, 38) },
].map((g) => ({ ...g, items: g.versions.flatMap((v) => byNumber.get(v) ?? []) }));
/** Versions in folder order, so previous / next stay inside the same group. */
const ORDERED = GROUPS.flatMap((g) => g.items);

const href = (v: number) => (v === 1 ? "/" : `/v${v}`);

/** A retractable tab on the right edge that holds every homepage version, on every page. */
export function VersionDock() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const current = pathname === "/" ? 1 : Number(pathname.match(/^\/v(\d+)/)?.[1] ?? 0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const idx = ORDERED.findIndex((x) => x.v === current);
  const prev = idx > 0 ? ORDERED[idx - 1] : null;
  const next = idx >= 0 && idx < ORDERED.length - 1 ? ORDERED[idx + 1] : null;

  return (
    <div
      ref={panelRef}
      className={`fixed right-0 top-1/2 z-[9999] flex -translate-y-1/2 items-center font-[system-ui,sans-serif] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        open ? "translate-x-0" : "translate-x-[272px]"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="version-dock"
        aria-label={open ? "Close version list" : "Open version list"}
        className="flex h-28 w-9 flex-col items-center justify-center gap-2 rounded-l-[10px] border border-r-0 border-white/15 bg-[#0c0e14]/90 text-white shadow-[0_8px_30px_-8px_rgb(0_0_0/0.5)] backdrop-blur-md transition-colors hover:bg-[#161a24]"
      >
        <span className="text-[10px] font-semibold tabular-nums tracking-[0.08em] text-white/60">V{current || "–"}</span>
        <svg viewBox="0 0 16 16" className={`h-3.5 w-3.5 transition-transform duration-500 ${open ? "rotate-180" : ""}`} aria-hidden="true">
          <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-white/45 [writing-mode:vertical-rl]">Versions</span>
      </button>

      <nav
        id="version-dock"
        aria-label="Homepage versions"
        inert={!open}
        className="flex max-h-[86vh] w-[272px] flex-col border border-r-0 border-white/15 bg-[#0c0e14]/95 text-white shadow-[0_20px_60px_-20px_rgb(0_0_0/0.7)] backdrop-blur-xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">Versions</p>
          <span className="text-[11px] tabular-nums text-white/35">{VERSIONS.length}</span>
        </div>
        <div className="overflow-y-auto overscroll-contain p-1.5">
          {GROUPS.map((g) => (
            <section key={g.name} aria-label={g.name} className="mb-1.5 last:mb-0">
              <p className="sticky top-0 z-10 flex items-center justify-between bg-[#0c0e14] px-2.5 pb-1.5 pt-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                <span className="flex items-center gap-2">
                  <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
                    <path d="M1.5 4.5a1 1 0 0 1 1-1h3.6l1.4 1.5h6a1 1 0 0 1 1 1v6.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                  {g.name}
                </span>
                <span className="tabular-nums text-white/30">{g.items.length}</span>
              </p>
              <ul>
                {g.items.map((x) => {
                  const on = x.v === current;
                  return (
                    <li key={x.v}>
                      <a
                        href={href(x.v)}
                        aria-current={on ? "page" : undefined}
                        className={`flex items-center gap-3 rounded-[6px] px-2.5 py-2 transition-colors ${on ? "bg-white text-[#0c0e14]" : "text-white/80 hover:bg-white/[0.07] hover:text-white"}`}
                      >
                        <span className={`w-8 text-[12px] font-semibold tabular-nums ${on ? "" : "text-white/45"}`}>V{x.v}</span>
                        <span className="flex-1 text-[13px] font-medium">{x.name}</span>
                        <span className={`text-[10px] uppercase tracking-[0.1em] ${on ? "text-black/45" : "text-white/30"}`}>{x.tone}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/10">
          {[prev, next].map((x, k) =>
            x ? (
              <a key={k} href={href(x.v)} className={`bg-[#0c0e14] px-4 py-2.5 text-[12px] text-white/60 hover:text-white ${k ? "text-right" : ""}`}>
                {k ? `V${x.v} →` : `← V${x.v}`}
              </a>
            ) : (
              <span key={k} className="bg-[#0c0e14]" />
            ),
          )}
        </div>
      </nav>
    </div>
  );
}
