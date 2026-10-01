"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import "./how.css";

/* ------------------------------------------------------------------ */
/* Story                                                               */
/* ------------------------------------------------------------------ */

export const STAGES = [
  {
    index: "01",
    title: "Fragmented",
    lede: "Dozens of systems of record.",
    body: "ERP, CRM, MES, HRIS, retail and cloud platforms — each with its own model, its own cadence, its own truth.",
  },
  {
    index: "02",
    title: "Entities",
    lede: "And every entity runs a different stack.",
    body: "Business units acquired over a decade never converged. Ask for group revenue and four teams return four numbers.",
  },
  {
    index: "03",
    title: "Harmonized",
    lede: "One hub. One definition.",
    body: "Every entity lands raw into the Genius Lab hub — structured, cleansed, merged and defined once in the semantic layer.",
  },
  {
    index: "04",
    title: "Decide",
    lede: "One surface the board trusts.",
    body: "Governed KPIs plot straight into the executive operating system — no reconciliation, no spreadsheet detour, no debate.",
  },
  {
    index: "05",
    title: "Brief",
    lede: "The morning briefing, written for you.",
    body: "Genius reads the governed numbers overnight and returns a plain-language brief: what moved, what is at risk, and the priorities to act on today.",
  },
  {
    index: "06",
    title: "Act",
    lede: "Agents that close the loop.",
    body: "AI agents read the same definitions, take governed action, and write results back into the systems of record.",
  },
] as const;

export const HUB_LAYERS = [
  { tag: "RAW", title: "Seamless Data Extraction", body: "Capture data exactly as it exists across every ERP, CRM, MES, WMS, HRIS, API and operational system.", color: "oklch(0.88 0.012 250)" },
  { tag: "BRONZE", title: "Customized Data Architecture", body: "Standardize and organize data into a scalable enterprise foundation while preserving source integrity.", color: "oklch(0.72 0.11 62)" },
  { tag: "SILVER", title: "Deterministic Data Harmonization", body: "Clean, validate, reconcile and enrich data using governed business rules to create a trusted semantic layer.", color: "oklch(0.84 0.02 254)" },
  { tag: "GOLD", title: "Executive Intelligence Layer", body: "Dashboards, consolidated reporting, AI insights, workflow automation and business-ready data products.", color: "oklch(0.8 0.14 75)" },
] as const;

export const SOURCES = [
  { cat: "ERP", systems: ["SAP", "NetSuite", "Epicor", "Dynamics"] },
  { cat: "CRM", systems: ["Salesforce", "HubSpot", "Zoho", "Zendesk"] },
  { cat: "MES", systems: ["Plex", "Ignition", "Rockwell", "Siemens"] },
  { cat: "HRIS", systems: ["Workday", "ADP", "Sage", "Gusto"] },
  { cat: "RETAIL", systems: ["Shopify", "Square", "Manhattan", "Stripe"] },
  { cat: "CLOUD", systems: ["AWS", "Azure", "Snowflake", "Slack"] },
] as const;

export const ENTITIES = [
  { name: "Northwind Mfg", region: "EMEA · EUR", metric: "€412.8M", stack: ["SAP", "Salesforce", "Plex", "Workday"] },
  { name: "Atlas Retail", region: "AMER · USD", metric: "$438.1M", stack: ["NetSuite", "Shopify", "Square", "ADP"] },
  { name: "Meridian Services", region: "APAC · SGD", metric: "S$401.5M", stack: ["Dynamics", "Zoho", "Zendesk", "Sage"] },
  { name: "Kestrel Industrial", region: "LATAM · BRL", metric: "R$429.6M", stack: ["Epicor", "HubSpot", "Ignition", "Gusto"] },
] as const;

export const KPIS = [
  { k: "Group revenue", v: 1.68, f: (n: number) => `$${n.toFixed(2)}B`, d: "+6.4% vs budget" },
  { k: "EBITDA", v: 312, f: (n: number) => `$${Math.round(n)}M`, d: "+1.2pp" },
  { k: "Gross margin", v: 38.6, f: (n: number) => `${n.toFixed(1)}%`, d: "+0.8pp" },
  { k: "Free cash flow", v: 96.4, f: (n: number) => `$${n.toFixed(1)}M`, d: "−$4.2M" },
] as const;

export const BRIEF = [
  { tone: "data", t: "Revenue is 6.4% ahead of budget, carried by Northwind and Atlas." },
  { tone: "gold", t: "Risk: Kestrel inventory is up 18% while demand softened 9%." },
  { tone: "fg", t: "Priority today: release $1.4M of slow stock and hold the price floor." },
] as const;

export const AGENTS = [
  { name: "Replenish", scope: "Stock cover · 14 sites", out: "412 POs raised", gain: "+4.1d cover" },
  { name: "Price Guard", scope: "Margin floor · live", out: "1,284 SKUs held", gain: "+120bp" },
  { name: "Cash Chase", scope: "DSO · 4.2k invoices", out: "$18.4M collected", gain: "−6.2d DSO" },
  { name: "Close Copilot", scope: "Group consolidation", out: "4 entities closed", gain: "−3d close" },
  { name: "Supply Sentinel", scope: "Tier-1 supplier risk", out: "38 alerts routed", gain: "9 mitigations" },
] as const;

/* ------------------------------------------------------------------ */
/* Math                                                                */
/* ------------------------------------------------------------------ */

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smooth = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};
/** 0 → 1 as p moves from a to b, eased. */
export const phase = (p: number, a: number, b: number) => smooth((p - a) / (b - a));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const r2 = (n: number) => Math.round(n * 100) / 100;

/** Which stage a progress value falls in, and how far through it. */
export function stageAt(p: number, n = STAGES.length) {
  const x = clamp(p) * n;
  const i = Math.min(n - 1, Math.floor(x));
  return { i, t: clamp(x - i) };
}

/** Piecewise interpolation over keyframes [{at, ...values}] for a scalar key. */
export function keyframes(p: number, frames: { at: number; v: number }[]) {
  if (p <= frames[0]!.at) return frames[0]!.v;
  for (let k = 1; k < frames.length; k++) {
    const a = frames[k - 1]!;
    const b = frames[k]!;
    if (p <= b.at) return mix(a.v, b.v, smooth((p - a.at) / (b.at - a.at)));
  }
  return frames[frames.length - 1]!.v;
}

/* ------------------------------------------------------------------ */
/* Scroll progress through a sticky section                            */
/* ------------------------------------------------------------------ */

export function useStickyProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    // ?p=0.42 pins the cinematic at that progress, for review and screenshots.
    const pinned = new URLSearchParams(window.location.search).get("p");
    if (pinned !== null) {
      const id = window.setTimeout(() => setP(clamp(Number(pinned))), 0);
      return () => window.clearTimeout(id);
    }
    let frame = 0;
    const read = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      setP(total <= 0 ? 0 : clamp(-rect.top / total));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return { ref, p };
}

/** Fixed design-size canvas scaled to fit its box (contain). */
export function FitCanvas({ w, h, children, className = "" }: { w: number; h: number; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setS(Math.min(el.clientWidth / w, el.clientHeight / h));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h]);
  return (
    <div ref={ref} className={`relative h-full w-full overflow-hidden ${className}`}>
      <div
        className="absolute left-1/2 top-1/2"
        style={{ width: w, height: h, transform: `translate(-50%, -50%) scale(${s ?? 0})`, opacity: s ? 1 : 0 }}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section shell: sticky stage + narrated copy                         */
/* ------------------------------------------------------------------ */

/**
 * A tall section whose stage sticks to the viewport while you scroll through
 * it. The left column narrates the six stages; the visual fills the rest.
 * `layout="overlay"` lets the visual run full-bleed behind the copy.
 */
export function HowSection({
  heightVh = 640,
  layout = "split",
  accent = "data",
  visual,
  hubCaption = true,
  className = "",
}: {
  heightVh?: number;
  layout?: "split" | "overlay";
  accent?: "data" | "gold";
  visual: (p: number) => ReactNode;
  hubCaption?: boolean;
  className?: string;
}) {
  const { ref, p } = useStickyProgress();
  const { i: active } = stageAt(p);
  const s = STAGES[active]!;
  // during "Harmonized", name the hub layer currently forming
  const hubIdx = active === 2 ? Math.min(3, Math.floor(stageAt(p).t * 4)) : -1;
  const accentText = accent === "gold" ? "text-gl-gold" : "text-gl-data";
  const accentBg = accent === "gold" ? "var(--gold)" : "var(--data)";

  return (
    <section className={`relative ${className}`}>
      <div ref={ref} style={{ height: `${heightVh}vh` }}>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div className={`absolute inset-0 ${layout === "split" ? "lg:left-[36%]" : ""}`}>{visual(p)}</div>
          {layout === "overlay" ? (
            <div className="pointer-events-none absolute inset-y-0 left-0 w-[46%] bg-[linear-gradient(90deg,var(--background)_45%,color-mix(in_oklab,var(--background)_70%,transparent)_75%,transparent)] max-lg:hidden" />
          ) : null}
          <div className="pointer-events-none relative flex h-full items-end pb-10 lg:items-center lg:pb-0">
            <div className="mx-auto w-full max-w-[112rem] px-6 lg:px-10">
              <div className="pointer-events-auto max-w-[25rem] rounded-2xl bg-[color-mix(in_oklab,var(--background)_80%,transparent)] p-5 backdrop-blur-md lg:bg-transparent lg:p-0 lg:backdrop-blur-none md:ml-16 lg:ml-20">
                <p className="font-gl-mono text-[0.68rem] uppercase tracking-[0.22em] text-gl-muted-foreground">How it works</p>
                <h2 className="mt-4 font-gl-display text-[1.7rem] leading-[1.12] tracking-[-0.02em] text-gl-foreground sm:text-[2.1rem]">
                  Turn everything your business knows into intelligent action.
                </h2>
                <div className="relative mt-8 min-h-[12.5rem] lg:mt-12">
                  <div key={s.index} className="how-fade">
                    <p className={`font-gl-mono text-[0.66rem] tracking-[0.24em] ${accentText}`}>
                      {s.index} <span className="text-gl-foreground/25">/ 06</span>
                    </p>
                    <h3 className="mt-3 font-gl-display text-[1.6rem] tracking-[-0.02em] text-gl-foreground">{s.title}</h3>
                    <p className="mt-2 font-gl-display text-[1rem] text-gl-gold/90">{s.lede}</p>
                    <p className="mt-3 text-[0.9rem] leading-relaxed text-gl-muted-foreground max-lg:hidden">{s.body}</p>
                    {hubCaption && hubIdx >= 0 ? (
                      <p key={hubIdx} className="how-fade mt-4 flex items-center gap-2 font-gl-mono text-[0.6rem] uppercase tracking-[0.16em]" style={{ color: HUB_LAYERS[hubIdx]!.color }}>
                        <span className="h-px w-6" style={{ background: HUB_LAYERS[hubIdx]!.color }} />
                        {HUB_LAYERS[hubIdx]!.tag} · {HUB_LAYERS[hubIdx]!.title}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="mt-6 flex gap-1.5" aria-hidden="true">
                  {STAGES.map((st, k) => (
                    <span key={st.index} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-gl-foreground/10">
                      <span
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ width: `${clamp(p * 6 - k) * 100}%`, background: accentBg }}
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
