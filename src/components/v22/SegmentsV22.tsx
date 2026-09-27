"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check } from "@phosphor-icons/react";
import { axialToPixel, hexPoints } from "@/lib/hex";
import { SectionHead, r1 } from "./ui";

type Node = { q: number; r: number; hub?: boolean; warn?: boolean };

const SEGMENTS: { name: string; body: string; outcomes: string[]; caption: string; nodes: Node[] }[] = [
  {
    name: "Investment Firms",
    body: "One live view across every portfolio company, with value creation tracked against the plan.",
    outcomes: ["Portfolio monitoring", "Value creation plans", "Board-ready reporting"],
    caption: "Portfolio companies into one live view",
    nodes: [{ q: 0, r: 0, hub: true }, { q: -3, r: 0 }, { q: 3, r: 0 }, { q: 0, r: -2 }, { q: 0, r: 2 }, { q: -2, r: 2 }, { q: 2, r: -2 }],
  },
  {
    name: "M&A Teams",
    body: "Diligence on real data, then integration that connects two companies' systems from day one.",
    outcomes: ["Data-driven diligence", "Day-one integration", "Synergy tracking"],
    caption: "Two companies, one model from day one",
    nodes: [{ q: 0, r: 0, hub: true }, { q: -3, r: 0 }, { q: -3, r: 1 }, { q: -2, r: -1 }, { q: 3, r: 0 }, { q: 2, r: 1 }, { q: 3, r: -1 }],
  },
  {
    name: "Multi-Entity Companies",
    body: "Every entity, currency and ledger consolidated into one trusted group picture.",
    outcomes: ["Automated consolidation", "Entity comparisons", "Group-wide KPIs"],
    caption: "Entities and ledgers consolidated",
    nodes: [{ q: 0, r: -1, hub: true }, { q: -3, r: 2 }, { q: -1, r: 2 }, { q: 1, r: 2 }, { q: 3, r: 1 }, { q: -2, r: 0 }, { q: 2, r: -1 }],
  },
  {
    name: "Operating Companies",
    body: "Daily operations run on shared numbers, with agents that flag what needs attention.",
    outcomes: ["Operational dashboards", "Forecasting", "Proactive alerts"],
    caption: "Shared numbers, flags where attention is needed",
    nodes: [{ q: 0, r: 0, hub: true }, { q: 1, r: 0 }, { q: -1, r: 0 }, { q: 0, r: 1 }, { q: 0, r: -1, warn: true }, { q: 1, r: -1 }, { q: -1, r: 1 }],
  },
];

const CX = 240;
const CY = 150;
const SZ = 30;
const at = (n: Node) => {
  const p = axialToPixel(n.q, n.r, SZ);
  return { x: r1(CX + p.x), y: r1(CY + p.y) };
};

function Diagram({ nodes, reduce }: { nodes: Node[]; reduce: boolean }) {
  const hub = at(nodes[0]);
  const t = (i: number) => (reduce ? { duration: 0 } : { duration: 0.9, ease: [0.77, 0, 0.175, 1] as const, delay: i * 0.04 });
  return (
    <svg viewBox="0 0 480 300" className="h-auto w-full" aria-hidden="true">
      {nodes.slice(1).map((n, i) => {
        const p = at(n);
        return <motion.line key={`l${i}`} initial={false} animate={{ x1: hub.x, y1: hub.y, x2: p.x, y2: p.y }} transition={t(i)} stroke="#5577ff" strokeOpacity="0.5" />;
      })}
      {nodes.map((n, i) => {
        const p = at(n);
        return (
          <motion.g key={i} initial={false} animate={{ x: p.x, y: p.y }} transition={t(i)}>
            <polygon
              points={hexPoints(0, 0, n.hub ? SZ + 6 : SZ - 3)}
              fill={n.hub ? "#101440" : n.warn ? "#fff4e5" : "#ffffff"}
              stroke={n.hub ? "#101440" : n.warn ? "#c26d00" : "#5577ff"}
              strokeWidth="1.5"
            />
            {n.hub ? <polygon points={hexPoints(0, 0, 10)} fill="#5577ff" /> : <polygon points={hexPoints(0, 0, 4)} fill={n.warn ? "#c26d00" : "#2fd4b8"} />}
          </motion.g>
        );
      })}
    </svg>
  );
}

export function SegmentsV22() {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const S = SEGMENTS[active];

  const onKey = (e: KeyboardEvent) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + SEGMENTS.length) % SEGMENTS.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="segments" className="scroll-mt-[var(--nav)] bg-white py-24 sm:py-32" aria-labelledby="v22-segments-title">
      <div className="v22-shell">
        <SectionHead n="08" label="Solutions" id="v22-segments-title" title="Value creation for every stage of growth" titleClass="max-w-[18ch]" />

        <div role="tablist" aria-label="Who we work with" onKeyDown={onKey} className="mt-12 grid grid-cols-2 gap-1.5 lg:mt-14 lg:grid-cols-4">
          {SEGMENTS.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.name}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`v22-seg-${i}`}
                aria-selected={on}
                aria-controls="v22-seg-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                className={`ch-tr relative flex h-full items-center gap-3 px-4 py-4 text-left transition-colors duration-300 [--c:16px] sm:px-5 ${
                  on ? "bg-[var(--navy)] text-white" : "bg-[var(--paper)] text-[var(--ink-2)] hover:bg-[var(--paper-2)] hover:text-[var(--navy)]"
                }`}
              >
                <span className={`v22-mono text-[0.75rem] ${on ? "text-[var(--signal-lt)]" : "text-[var(--signal-ink)]"}`}>0{i + 1}</span>
                <span className="v22-wide text-[0.9375rem] sm:text-[1rem]">{s.name}</span>
                {on && <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[var(--signal)]" aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        <div id="v22-seg-panel" role="tabpanel" aria-labelledby={`v22-seg-${active}`} className="chb mt-1.5 [--bd:var(--rule)] [--c:30px]">
          <div className="chi grid gap-8 bg-[var(--paper)] p-7 sm:p-10 lg:grid-cols-12 lg:items-center">
            <div key={active} className="v22-swap lg:col-span-6">
              <h3 className="v22-display text-[clamp(1.9rem,3.2vw,2.75rem)]">{S.name}</h3>
              <p className="text-pretty mt-4 max-w-[46ch] text-[1.0625rem] leading-[1.7] text-[var(--ink-2)]">{S.body}</p>
              <ul className="mt-8 space-y-3">
                {S.outcomes.map((o) => (
                  <li key={o} className="flex items-center gap-3 font-medium">
                    <span className="ch inline-flex h-5 w-5 shrink-0 items-center justify-center bg-[var(--signal-ink)] text-white [--c:5px]" aria-hidden="true">
                      <Check size={11} weight="bold" />
                    </span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            <figure className="lg:col-span-6">
              <div className="ch bg-white p-4 [--c:20px]">
                <Diagram nodes={S.nodes} reduce={reduce} />
              </div>
              <figcaption className="v22-mono mt-3 text-[0.75rem] text-[var(--ink-3)]">{S.caption}</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
