"use client";

import { useEffect, useRef, useState } from "react";
import type { Segment } from "@/components/hero-demo/screens";

export type Focus = "revenue" | "cash" | "margin" | "units";

export type Insight = {
  focus: Focus;
  tag: string;
  segments: Segment[];
  sources: string[];
  action: { title: string; impact: string; cta: string };
};

/** What the agent says about the dashboard, one insight per area it points at. */
export const INSIGHTS: Insight[] = [
  {
    focus: "revenue",
    tag: "Performance",
    segments: [
      { t: "Revenue is " },
      { t: "6.4% above budget", tone: "data" },
      { t: " at $1.42B, carried by " },
      { t: "Industrial North and EMEA", tone: "strong" },
      { t: ". I'd raise the Q4 forecast by $18M." },
    ],
    sources: ["ERP · 14 entities", "Budget FY26 v3"],
    action: { title: "Raise Q4 forecast by $18M", impact: "Forecast accuracy ±1.2%", cta: "Review" },
  },
  {
    focus: "cash",
    tag: "Cash",
    segments: [
      { t: "Free cash flow is " },
      { t: "$4.2M behind budget", tone: "gold" },
      { t: ". Southeast inventory is up 18% while demand softened 9% — releasing " },
      { t: "$1.4M of slow stock", tone: "strong" },
      { t: " closes a third of the gap." },
    ],
    sources: ["WMS · 3 sites", "Demand forecast"],
    action: { title: "Release $1.4M of Southeast inventory", impact: "Cash +$1.4M this quarter", cta: "Approve" },
  },
  {
    focus: "margin",
    tag: "Margin",
    segments: [
      { t: "Gross margin is holding at 38.6%, but discounting on " },
      { t: "1,284 long-tail SKUs", tone: "gold" },
      { t: " is leaking " },
      { t: "120bp", tone: "data" },
      { t: " in Retail. A price floor recovers it with no volume risk." },
    ],
    sources: ["Invoice lines · 412k", "Competitor index"],
    action: { title: "Hold a price floor on 1,284 SKUs", impact: "+120bp · $8.6M annualised", cta: "Approve" },
  },
  {
    focus: "units",
    tag: "Operations",
    segments: [
      { t: "Industrial Southeast is " },
      { t: "2.4% behind plan", tone: "gold" },
      { t: ". A Tier-1 supplier has slipped deliveries at three plants — " },
      { t: "$22.6M of revenue", tone: "strong" },
      { t: " is exposed." },
    ],
    sources: ["Supplier OTIF", "MES · 3 plants"],
    action: { title: "Dual-source the Tier-1 supplier", impact: "Protects $22.6M of revenue", cta: "Execute" },
  },
];

export const insightText = (i: Insight) => i.segments.map((s) => s.t).join("");

export type CycleStage = "thinking" | "typing" | "holding";

/**
 * Cycles the agent through its insights while the dashboard is on screen:
 * think (scan the data), type the insight, hold it, move on. Reduced motion
 * shows the first insight in full and stays there.
 */
export function useInsightCycle({ thinkMs = 1300, cps = 52, holdMs = 5200 } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [stage, setStage] = useState<CycleStage>("holding");
  const [typed, setTyped] = useState(insightText(INSIGHTS[0]!).length);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // ?insight=2 pins that insight in full, for review and screenshots.
    const pinned = new URLSearchParams(window.location.search).get("insight");
    if (pinned !== null) {
      const i = Math.abs(Number(pinned)) % INSIGHTS.length;
      const id = window.setTimeout(() => {
        setIdx(i);
        setTyped(insightText(INSIGHTS[i]!).length);
        setStage("holding");
      }, 0);
      return () => window.clearTimeout(id);
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => setRunning(!!e?.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    const text = insightText(INSIGHTS[idx]!);
    later(() => {
      setStage("thinking");
      setTyped(0);
    }, 0);
    later(() => setStage("typing"), thinkMs);
    let n = 0;
    const step = 1000 / cps;
    for (let k = 1; k <= text.length; k++) {
      const ch = text[k - 2];
      n += ch === "." || ch === "," || ch === "—" ? step * 4 : step;
      later(() => setTyped(k), thinkMs + n);
    }
    later(() => setStage("holding"), thinkMs + n + 50);
    later(() => setIdx((i) => (i + 1) % INSIGHTS.length), thinkMs + n + holdMs);
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [idx, running, thinkMs, cps, holdMs]);

  return { ref, idx, stage, typed, insight: INSIGHTS[idx]!, focus: INSIGHTS[idx]!.focus };
}
