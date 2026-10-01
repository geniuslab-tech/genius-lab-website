"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import "./layers.css";

/** The five layers of the operating system, bottom (foundation) to top (execution). */
export const LAYERS = [
  {
    number: "01",
    name: "Data Foundation",
    summary: "Connect and harmonize your systems' data into a trusted data foundation.",
    details: ["ERP", "CRM", "Finance", "MES", "WMS", "HRIS", "Spreadsheets", "Other systems"],
    accent: "data",
  },
  {
    number: "02",
    name: "Business Context",
    summary: "Bring together your trusted data with the context only your people know.",
    details: ["Meeting + call transcripts", "Messages", "Email", "Documents", "Direct input"],
    accent: "cyan",
  },
  {
    number: "03",
    name: "Governance + Security",
    summary: "Set the rules for what information is included, who can access it, and how AI can act.",
    details: ["Information boundaries", "Access", "Policies", "Human oversight"],
    accent: "data",
  },
  {
    number: "04",
    name: "Intelligence",
    summary: "Combine trusted data and business context to understand what is happening, why, and what to do next.",
    details: ["Analytics + KPIs", "Operating rules", "Human context", "Business ontology", "AI insights"],
    accent: "cyan",
  },
  {
    number: "05",
    name: "Execution",
    summary: "Move from insight to decision to coordinated action across your business.",
    details: ["Workflow automation", "AI agents", "Approvals", "Write-back"],
    accent: "gold",
  },
] as const;

export type Layer = (typeof LAYERS)[number];

export const STEP_MS = 5000;

/**
 * Auto-advances through the layers while the scene is on screen. A click
 * selects a layer and holds it for 15s before the cycle resumes. Reduced
 * motion shows the full stack with Execution selected and never advances.
 */
export function useLayerCycle(count = LAYERS.length, stepMs = STEP_MS) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const [entered, setEntered] = useState(false);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => {
        setActive(count - 1);
        setEntered(true);
      }, 0);
      return () => window.clearTimeout(id);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        const on = !!e?.isIntersecting;
        setRunning(on);
        if (on) setEntered(true);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [count]);

  useEffect(() => {
    if (held) {
      const id = window.setTimeout(() => setHeld(false), 15000);
      return () => window.clearTimeout(id);
    }
    if (!running) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % count), stepMs);
    return () => window.clearTimeout(id);
  }, [active, running, held, count, stepMs]);

  const select = useCallback((i: number) => {
    setActive(i);
    setHeld(true);
  }, []);

  return { ref, active, select, entered, running, held };
}

/** Keyboard + pointer props for a clickable layer. */
export function layerButton(i: number, select: (i: number) => void, label: string) {
  return {
    role: "button" as const,
    tabIndex: 0,
    "aria-label": label,
    onClick: () => select(i),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        select(i);
      }
    },
  };
}

/** Left-hand narrative: the active layer's number, name and summary, cross-faded. */
export function Narrative({
  active,
  progressKey,
  running,
  held,
  tone = "gold",
  showDetails = false,
  className = "",
}: {
  active: number;
  progressKey?: string | number;
  running: boolean;
  held: boolean;
  tone?: "gold" | "data";
  showDetails?: boolean;
  className?: string;
}) {
  const layer = LAYERS[active] ?? LAYERS[0];
  return (
    <div className={className}>
      <div key={layer.number} className="layers-fade">
        <p className="mb-4 flex items-center gap-3 font-gl-mono text-[0.68rem] uppercase tracking-[0.22em] text-gl-foreground/40">
          Layer {layer.number} <span className="text-gl-foreground/20">/ 05</span>
        </p>
        <h4 className="font-gl-display text-[1.9rem] leading-[1.1] tracking-[-0.02em] text-gl-foreground sm:text-[2.35rem] lg:whitespace-nowrap">{layer.name}</h4>
        <p className="mt-5 max-w-[26rem] font-gl-display text-[1.05rem] leading-[1.55] text-gl-foreground/80 sm:text-[1.15rem]">{layer.summary}</p>
        {showDetails ? (
          <div className="mt-6 flex max-w-[26rem] flex-wrap gap-1.5">
            {layer.details.map((d, i) => (
              <span
                key={d}
                className="layers-chip rounded-full border border-gl-foreground/12 bg-gl-foreground/[0.03] px-2.5 py-1 font-gl-mono text-[0.6rem] uppercase tracking-[0.1em] text-gl-foreground/70"
                style={{ animationDelay: `${120 + i * 60}ms` }}
              >
                {d}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="mt-8 flex max-w-[26rem] gap-1.5" aria-hidden="true">
        {LAYERS.map((l, i) => (
          <span key={l.number} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-gl-foreground/10">
            {i < active ? <span className={`absolute inset-0 ${tone === "gold" ? "bg-gl-gold/60" : "bg-gl-data/60"}`} /> : null}
            {i === active ? (
              <span
                key={`${progressKey}-${active}`}
                className={`absolute inset-y-0 left-0 ${tone === "gold" ? "bg-gl-gold" : "bg-gl-data"} ${running && !held ? "layers-progress" : "w-full"}`}
                style={{ animationDuration: `${STEP_MS}ms` }}
              />
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Frame for one variant on the studies page. */
export function VariantSection({
  n,
  name,
  note,
  premium,
  children,
  className = "",
}: {
  n: number;
  name: string;
  note: string;
  premium?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={`variant-${n}`} className={`relative overflow-hidden border-t border-gl-foreground/[0.07] py-20 lg:py-24 ${className}`}>
      <div className="relative mx-auto max-w-[112rem] px-6 lg:px-10">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:pl-16 lg:pl-32">
          <div>
            <p className="flex items-center gap-3 font-gl-mono text-[0.66rem] uppercase tracking-[0.22em] text-gl-muted-foreground">
              <span className={premium ? "text-gl-gold" : "text-gl-data"}>Variant {String(n).padStart(2, "0")}</span>
              <span className="h-px w-8 bg-gl-foreground/15" />
              {premium ? "Premium" : "Refined · same style"}
            </p>
            <h2 className="mt-4 font-gl-display text-[2rem] font-medium leading-[1.1] tracking-[-0.02em] text-gl-foreground sm:text-[2.6rem]">{name}</h2>
          </div>
          <p className="max-w-[30rem] text-[0.92rem] leading-relaxed text-gl-muted-foreground">{note}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

/** Standard two-column layout: narrative left, visual right. */
export function SplitStage({ narrative, visual }: { narrative: ReactNode; visual: ReactNode }) {
  return (
    <div className="relative grid gap-12 lg:grid-cols-[34rem_minmax(0,1fr)] lg:items-center lg:gap-16">
      <div className="md:pl-16 lg:pl-32">{narrative}</div>
      <div className="relative min-w-0">{visual}</div>
    </div>
  );
}
