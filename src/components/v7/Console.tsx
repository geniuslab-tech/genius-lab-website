"use client";

import { useEffect, useState } from "react";
import { Status } from "@/components/v6/ui";
import { TOP_DOWN, isTop } from "./data";

type Row = { series: number[]; rate: number; latency: number };

const UNITS: Record<string, string> = {
  "05": "actions / min",
  "04": "insights / min",
  "03": "checks / min",
  "02": "events / min",
  "01": "records / min",
};
const BASE: Record<string, number> = { "05": 184, "04": 612, "03": 4210, "02": 1380, "01": 28400 };
const LATENCY: Record<string, number> = { "05": 420, "04": 180, "03": 12, "02": 64, "01": 38 };

// Deterministic start so the server and client render the same first frame.
const seed = (n: string) =>
  Array.from({ length: 24 }, (_, k) => 0.55 + 0.25 * Math.sin(k * 0.7 + Number(n)) + 0.12 * Math.cos(k * 1.9 + Number(n) * 2));

const initial = (): Record<string, Row> =>
  Object.fromEntries(TOP_DOWN.map((l) => [l.n, { series: seed(l.n), rate: BASE[l.n], latency: LATENCY[l.n] }]));

function Spark({ series, top }: { series: number[]; top: boolean }) {
  const pts = series.map((v, k) => `${((k / (series.length - 1)) * 120).toFixed(1)},${(28 - v * 24).toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 120 30" className="h-7 w-full" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={`0,30 ${pts} 120,30`} fill={top ? "rgb(242 154 31 / 0.12)" : "rgb(77 141 255 / 0.12)"} stroke="none" />
      <polyline points={pts} fill="none" stroke={top ? "#f29a1f" : "#4d8dff"} strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Study 08: the stack as the operations console that runs it, every layer a live row. */
export function Console() {
  const [rows, setRows] = useState(initial);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setTick((t) => t + 1);
      setRows((prev) =>
        Object.fromEntries(
          Object.entries(prev).map(([n, r]) => {
            const last = r.series[r.series.length - 1];
            const next = Math.min(0.98, Math.max(0.12, last + (Math.random() - 0.5) * 0.22));
            return [
              n,
              {
                series: [...r.series.slice(1), next],
                rate: Math.round(BASE[n] * (0.85 + next * 0.3)),
                latency: Math.round(LATENCY[n] * (0.9 + Math.random() * 0.2)),
              },
            ];
          }),
        ),
      );
    }, 1600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="overflow-hidden rounded-[10px] border border-white/[0.09] bg-abyss-2/80 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.8)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="v6-label text-[0.625rem] text-white/70">genius-lab / operating-layer</span>
          <span className="hidden text-white/15 sm:inline">|</span>
          <span className="v6-label hidden text-[0.5625rem] text-white/35 sm:inline">prod · eu-west</span>
        </div>
        <div className="flex items-center gap-3">
          <Status tone="ok">All layers healthy</Status>
          <span className="v6-label text-[0.5625rem] tabular-nums text-white/35">t+{String(tick).padStart(4, "0")}</span>
        </div>
      </div>

      <div className="hidden grid-cols-[3rem_1.4fr_1.3fr_1fr_0.7fr_7rem] gap-4 border-b border-white/[0.07] px-5 py-2.5 lg:grid" aria-hidden="true">
        {["#", "Layer", "Components", "Throughput", "p95", "State"].map((h) => (
          <span key={h} className="v6-label text-[0.5rem] text-white/30">
            {h}
          </span>
        ))}
      </div>

      <ol aria-label="Layers, top first">
        {TOP_DOWN.map((l) => {
          const r = rows[l.n];
          const top = isTop(l);
          return (
            <li
              key={l.n}
              className={`relative grid grid-cols-[2.25rem_1fr_auto] items-center gap-x-4 gap-y-3 border-b border-white/[0.06] px-4 py-4 last:border-b-0 sm:px-5 lg:grid-cols-[3rem_1.4fr_1.3fr_1fr_0.7fr_7rem] ${
                top ? "bg-gradient-to-r from-ember/[0.07] to-transparent" : ""
              }`}
            >
              <span className={`absolute inset-y-0 left-0 w-[2px] ${top ? "bg-ember" : "bg-sky/40"}`} aria-hidden="true" />
              <span className={`v6-label text-[0.625rem] ${top ? "text-ember" : "text-sky"}`}>{l.n}</span>
              <span className="font-semibold tracking-[-0.01em] text-white">{l.name}</span>
              <span className="justify-self-end lg:order-last lg:justify-self-start">
                <Status tone={top ? "warn" : "ok"}>{top ? "Acting" : "Synced"}</Status>
              </span>
              <span className="v6-label col-span-3 text-[0.5625rem] text-white/40 lg:col-span-1">{l.tags.join(" · ")}</span>
              <span className="col-span-2 flex items-center gap-3 lg:col-span-1">
                <span className="w-24 shrink-0 lg:w-auto lg:flex-1">
                  <Spark series={r.series} top={top} />
                </span>
                <span className="whitespace-nowrap font-mono text-[0.75rem] tabular-nums text-white/80 lg:hidden">
                  {r.rate.toLocaleString("en-US")} <span className="text-white/35">{UNITS[l.n]}</span>
                </span>
              </span>
              <span className="hidden font-mono text-[0.75rem] tabular-nums text-white/70 lg:block">
                {r.latency} ms
                <span className="mt-0.5 block text-[0.5625rem] text-white/30">{r.rate.toLocaleString("en-US")}/m</span>
              </span>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] bg-abyss/60 px-4 py-3 sm:px-5">
        <span className="v6-label text-[0.5625rem] text-white/30">One governed system from foundation to execution</span>
        <span className="v6-label flex items-center gap-2 text-[0.5625rem] text-sky">
          <span className="v7-breathe h-1.5 w-1.5 rounded-full bg-sky" aria-hidden="true" />
          Live
        </span>
      </div>
    </div>
  );
}
