"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { Illustrative, SectionHead, Tile } from "./ui";

type Row = { a: string; b: string; tone: "ok" | "warn" | "blue" | "mute" };

const SEGMENTS: { id: string; name: string; body: string; view: string; rows: Row[]; foot: string }[] = [
  {
    id: "investment",
    name: "Investment Firms",
    body: "One live view across every portfolio company, with value creation tracked against the plan.",
    view: "Portfolio · value creation plan",
    rows: [
      { a: "Portfolio company A", b: "on plan", tone: "ok" },
      { a: "Portfolio company B", b: "ahead", tone: "blue" },
      { a: "Portfolio company C", b: "behind", tone: "warn" },
      { a: "Portfolio company D", b: "on plan", tone: "ok" },
    ],
    foot: "Every company on the same definitions",
  },
  {
    id: "ma",
    name: "M&A Teams",
    body: "Diligence on real data, then integration that connects two companies' systems from day one.",
    view: "Integration · day one",
    rows: [
      { a: "Acquirer ERP ↔ Target ERP", b: "mapped", tone: "ok" },
      { a: "Customer lists, deduplicated", b: "merged", tone: "ok" },
      { a: "Chart of accounts", b: "in review", tone: "blue" },
      { a: "Payroll systems", b: "next", tone: "mute" },
    ],
    foot: "A single view of both companies",
  },
  {
    id: "multi",
    name: "Multi-Entity Companies",
    body: "Every entity, currency and ledger consolidated into one trusted group picture.",
    view: "Group consolidation",
    rows: [
      { a: "Entity UK · GBP ledger", b: "consolidated", tone: "ok" },
      { a: "Entity DE · EUR ledger", b: "consolidated", tone: "ok" },
      { a: "Entity US · USD ledger", b: "consolidated", tone: "ok" },
      { a: "Intercompany eliminations", b: "running", tone: "blue" },
    ],
    foot: "One trusted group picture",
  },
  {
    id: "operating",
    name: "Operating Companies",
    body: "Daily operations run on shared numbers, with agents that flag what needs attention.",
    view: "Today · flagged by agents",
    rows: [
      { a: "Late shipments, northeast region", b: "attention", tone: "warn" },
      { a: "Stock below reorder point, 3 SKUs", b: "attention", tone: "warn" },
      { a: "Daily sales vs target", b: "on track", tone: "ok" },
      { a: "Open support tickets", b: "normal", tone: "mute" },
    ],
    foot: "Shared numbers, every morning",
  },
];

const TONE: Record<Row["tone"], string> = {
  ok: "bg-(--lime) text-(--ink)",
  warn: "bg-(--coral-soft) text-(--coral)",
  blue: "bg-(--blue-soft) text-(--blue-ink)",
  mute: "bg-(--ground-2) text-(--ink-2)",
};

export function SegmentsV12() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const s = SEGMENTS[active];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const n = SEGMENTS.length;
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (active + 1) % n;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (active - 1 + n) % n;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="solutions" className="scroll-mt-24 py-20 sm:py-28" aria-labelledby="v12-segments-title">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <SectionHead id="v12-segments-title" index="07" label="Solutions" title="Value creation for every stage of growth." />
        <div className="mt-12 grid gap-3 sm:gap-4 lg:grid-cols-12">
          <Tile className="p-2 sm:p-3 lg:col-span-5">
            <div role="tablist" aria-label="Who we work with" aria-orientation="vertical" className="grid gap-1">
              {SEGMENTS.map((x, i) => {
                const on = i === active;
                return (
                  <button
                    key={x.id}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    role="tab"
                    id={`v12-seg-${x.id}`}
                    aria-selected={on}
                    aria-controls="v12-seg-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(i)}
                    onKeyDown={onKey}
                    className={`group rounded-[14px] px-4 py-4 text-left transition-colors duration-300 sm:px-5 ${on ? "bg-(--ground)" : "hover:bg-(--ground)/60"}`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className={`text-[1.125rem] font-semibold tracking-[-0.025em] sm:text-[1.25rem] ${on ? "text-(--ink)" : "text-(--ink-2)"}`}>{x.name}</span>
                      <ArrowRight
                        size={16}
                        weight="bold"
                        aria-hidden="true"
                        className={`shrink-0 transition-[transform,color] duration-500 ease-[var(--spring)] ${on ? "translate-x-0 text-(--blue)" : "-translate-x-1 text-(--ink-3) group-hover:translate-x-0"}`}
                      />
                    </span>
                    <span className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--out)] ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <span className="overflow-hidden">
                        <span className="block pt-2 text-[0.9375rem] leading-[1.6] text-(--ink-2)">{x.body}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Tile>

          <Tile delay={80} className="p-5 sm:p-7 lg:col-span-7">
            <div id="v12-seg-panel" role="tabpanel" aria-labelledby={`v12-seg-${s.id}`} className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-3">
                <span className="v12-label text-(--ink-3)">{s.view}</span>
                <Illustrative />
              </div>
              <ul key={s.id} className="mt-5 grid gap-1.5">
                {s.rows.map((r, i) => (
                  <li key={r.a} className="v12-intro v12-well flex items-center justify-between gap-3 px-4 py-3.5" style={{ animationDelay: `${i * 60}ms` }}>
                    <span className="min-w-0 truncate text-[0.9375rem] font-medium">{r.a}</span>
                    <span className={`v12-chip shrink-0 ${TONE[r.tone]}`}>{r.b}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-auto flex items-center gap-2 pt-6 text-[0.875rem] text-(--ink-2)">
                <span className="h-1.5 w-1.5 rounded-full bg-(--blue)" aria-hidden="true" />
                {s.foot}
              </p>
            </div>
          </Tile>
        </div>
      </div>
    </section>
  );
}
