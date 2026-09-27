"use client";

import { useCallback, useEffect, useRef } from "react";
import { ChartLineUp, FlowArrow, Lightning, Plugs, Robot, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { BrandLogo } from "@/components/v2/ui";
import { smooth, useReduced, useScrollProgress } from "./hooks";
import { SectionHead } from "./ui";
import { Tilt } from "./Tilt";

const MODULES = [
  { Icon: Plugs, name: "Connectors", body: "Ready integrations for ERP, CRM, finance, files and APIs." },
  { Icon: FlowArrow, name: "Data Transformation", body: "Pipelines that clean, model and unify data, tested like software." },
  { Icon: ChartLineUp, name: "Analytics", body: "Dashboards, drill-downs and forecasts on one shared model." },
  { Icon: ShieldCheck, name: "Governance", body: "Definitions, lineage, access and audit trails in one place." },
  { Icon: Lightning, name: "Automation", body: "Alerts, workflows and scheduled actions across your systems." },
  { Icon: Robot, name: "AI Agents", body: "Agents that read the Second Brain and answer or act." },
];

const SYSTEMS = ["ERP", "CRM", "Warehouse", "BI tools", "Sheets", "Cloud apps"];

/** Illustrative preview values only. */
const KPIS = [
  { k: "Revenue", v: "$48.2M", d: "+6.1%" },
  { k: "Gross margin", v: "41.7%", d: "+0.8 pt" },
  { k: "Cash", v: "$9.4M", d: "-2.3%" },
];
const SERIES = [22, 26, 24, 31, 29, 35, 38, 36, 42, 45, 43, 50];
const SERIES_B = [18, 20, 21, 23, 25, 24, 27, 30, 31, 33, 36, 38];

function path(s: number[], w: number, h: number) {
  const max = 56;
  return s.map((v, i) => `${i ? "L" : "M"}${((i / (s.length - 1)) * w).toFixed(1)} ${(h - (v / max) * h).toFixed(1)}`).join(" ");
}

type TiltState = { sx: number; sy: number; px: number; py: number };
function applyTilt(el: HTMLElement | null, t: TiltState) {
  if (!el) return;
  el.style.setProperty("--prx", `${(t.sx - t.py * 5).toFixed(2)}deg`);
  el.style.setProperty("--pry", `${(t.sy + t.px * 7).toFixed(2)}deg`);
}

function PortalWindow() {
  return (
    <div className="overflow-hidden rounded-[14px] border border-[color:var(--line-2)] bg-[#080b22] shadow-[0_80px_120px_-60px_rgb(0_0_0/0.9),0_0_0_1px_rgb(143_220_255/0.06)]">
      <div className="flex items-center justify-between gap-4 border-b border-[color:var(--line)] px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </span>
          <BrandLogo tone="white" className="h-[10px] w-auto opacity-80" />
          <span className="v16-label hidden text-[color:var(--tx-3)] sm:inline">Portal</span>
        </div>
        <span className="v16-label rounded-[4px] border border-[rgb(255_178_107/0.4)] px-2 py-0.5 text-[color:var(--warm)]">Illustrative preview</span>
      </div>
      <div className="grid grid-cols-[auto_1fr]">
        <ul className="hidden w-48 space-y-0.5 border-r border-[color:var(--line)] p-3 sm:block" aria-hidden="true">
          {MODULES.map(({ Icon, name }, i) => (
            <li key={name} className={`flex items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-[0.8125rem] ${i === 2 ? "bg-[rgb(143_220_255/0.1)] text-white" : "text-[color:var(--tx-3)]"}`}>
              <Icon size={15} />
              {name}
            </li>
          ))}
        </ul>
        <div className="min-w-0 p-4 sm:p-5" aria-hidden="true">
          <div className="v16-pop-1 grid grid-cols-3 gap-2">
            {KPIS.map((k) => (
              <div key={k.k} className="rounded-[8px] border border-[color:var(--line)] bg-[rgb(23_28_82/0.45)] p-2.5 sm:p-3">
                <p className="v16-label truncate text-[0.5625rem] text-[color:var(--tx-3)]">{k.k}</p>
                <p className="v16-display mt-1.5 text-[0.9375rem] sm:text-[1.25rem]">{k.v}</p>
                <p className={`v16-mono text-[0.625rem] ${k.d.startsWith("-") ? "text-[color:var(--warm)]" : "text-[color:var(--ice)]"}`}>{k.d}</p>
              </div>
            ))}
          </div>
          <div className="v16-pop-1 mt-2 rounded-[8px] border border-[color:var(--line)] bg-[rgb(23_28_82/0.3)] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[0.75rem] font-medium">Revenue vs plan</p>
              <p className="v16-label text-[0.5625rem] text-[color:var(--tx-3)]">12 months</p>
            </div>
            <svg viewBox="0 0 300 90" className="mt-2 h-auto w-full" preserveAspectRatio="none">
              {[0, 1, 2].map((g) => (
                <line key={g} x1="0" x2="300" y1={15 + g * 30} y2={15 + g * 30} stroke="rgb(143 220 255 / 0.08)" />
              ))}
              <path d={`${path(SERIES, 300, 90)} L300 90 L0 90 Z`} fill="rgb(143 220 255 / 0.08)" />
              <path d={path(SERIES_B, 300, 90)} fill="none" stroke="rgb(214 222 255 / 0.3)" strokeDasharray="3 3" />
              <path d={path(SERIES, 300, 90)} fill="none" stroke="#8fdcff" strokeWidth="1.6" />
            </svg>
          </div>
          <div className="v16-pop-2 mt-2 flex items-center gap-3 rounded-[8px] border border-[rgb(143_220_255/0.35)] bg-[#0c1236] px-3 py-2.5 shadow-[0_20px_40px_-20px_rgb(143_220_255/0.35)]">
            <Robot size={16} className="shrink-0 text-[color:var(--ice)]" />
            <p className="min-w-0 truncate text-[0.8125rem] text-[color:var(--tx-2)]">Ask: which region drove the margin change?</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PortalV16() {
  const reduce = useReduced();
  const sec = useRef<HTMLElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const tilt = useRef<TiltState>({ sx: 16, sy: -14, px: 0, py: 0 });


  // Scrolling through settles the window from a steep angle toward the reader.
  const onProgress = useCallback((p: number) => {
    const k = smooth(0.1, 0.5, p);
    tilt.current.sx = 24 - k * 18;
    tilt.current.sy = -18 + k * 12;
    applyTilt(win.current, tilt.current);
  }, []);
  useScrollProgress(sec, onProgress, !reduce, "through");

  useEffect(() => {
    if (reduce) return;
    const el = win.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        tilt.current.px = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
        tilt.current.py = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
        el.dataset.live = "";
        applyTilt(el, tilt.current);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduce]);

  return (
    <section ref={sec} id="portal" className="relative isolate scroll-mt-16 overflow-hidden py-24 sm:py-32" aria-labelledby="v16-portal-title">
      <div className="absolute inset-x-0 top-[30%] -z-10 h-[70%] origin-top [transform:perspective(700px)_rotateX(60deg)] v16-grid-floor opacity-60" aria-hidden="true" />
      <div className="v16-wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead n="04" id="v16-portal-title" kicker="Genius Portal" title="Expertise and technology, working as one." className="lg:col-span-7" />
          <p className="v16-lead max-w-[52ch] lg:col-span-5">
            Our specialists build on the Genius Portal, our own platform. Everything a client needs to connect, govern and
            run intelligence lives in one place.
          </p>
        </div>

        <div className="v16-portal-stage mx-auto mt-14 max-w-[980px] lg:mt-20">
          <div ref={win} className="v16-portal">
            <PortalWindow />
          </div>
          <p className="sr-only">An illustrative preview of the Genius Portal: analytics module with revenue, margin and cash tiles, a revenue chart and an agent prompt.</p>
          <div className="mx-auto mt-2 h-10 w-[80%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(143_220_255/0.22),transparent)] blur-xl" aria-hidden="true" />
        </div>

        <ol className="mt-16 grid gap-3 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3" aria-label="Inside the Genius Portal">
          {MODULES.map(({ Icon, name, body }, i) => (
            <Tilt as="li" key={name} className="v16-panel p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <Icon size={22} className="text-[color:var(--ice)]" aria-hidden="true" />
                <span className="v16-label text-[color:var(--tx-3)]">0{i + 1}</span>
              </div>
              <h3 className="v16-display mt-8 text-[1.25rem]">{name}</h3>
              <p className="mt-2 leading-[1.65] text-[color:var(--tx-2)]">{body}</p>
            </Tilt>
          ))}
        </ol>

        <div className="v16-panel mt-4 grid gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <p className="v16-label text-[color:var(--ice)]">Integrations</p>
            <p className="v16-display mt-3 text-[clamp(1.375rem,2.2vw,1.75rem)]">Keep the technology that already runs the business.</p>
          </div>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:col-span-8" aria-label="ERP, CRM, data warehouse, BI tools, spreadsheets and cloud apps all connect into Genius Lab.">
            {SYSTEMS.map((s) => (
              <li key={s} className="flex items-center justify-between gap-3 rounded-[8px] border border-[color:var(--line)] px-4 py-3">
                <span className="text-[0.9375rem]">{s}</span>
                <span className="v16-mono flex items-center gap-1.5 text-[0.625rem] uppercase tracking-[0.12em] text-[color:var(--ice)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--ice)]" aria-hidden="true" />
                  Connected
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
