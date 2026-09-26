"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Status } from "./ui";

/* ---- Illustrative data ---- */
const NAV = [
  { name: "Revenue", on: true },
  { name: "Margin & Cost" },
  { name: "Cash & Working Capital" },
  { name: "Entities" },
  { name: "Decisions", count: 3 },
  { name: "Automations", count: 6 },
  { name: "Agents", count: 4 },
  { name: "Board Reports" },
];

const KPIS = [
  { k: "Revenue", v: "$1.42B", d: "+6.4% vs prior quarter", s: "ok" as const, st: "Ahead of plan", spark: [3, 3.2, 3.1, 3.6, 3.5, 4, 4.3] },
  { k: "EBITDA", v: "$284M", d: "+1.2pp vs prior quarter", s: "ok" as const, st: "Ahead of plan", spark: [3, 3.4, 3.8, 3.6, 3.9, 3.7, 3.8] },
  { k: "Gross margin", v: "38.6%", d: "+0.8pp vs prior quarter", s: "track" as const, st: "On track", spark: [3, 3.1, 3.3, 3.2, 3.6, 3.7, 3.7] },
  { k: "Free cash flow", v: "$96.4M", d: "-$4.2M vs prior quarter", s: "warn" as const, st: "Attention required", spark: [4, 4.3, 4.1, 4.2, 3.9, 3.6, 3.3] },
];

const UNITS = [
  { n: "Industrial – North", r: "$482.6M", p: "+8.1%", warn: false, spark: [2, 2.4, 2.3, 2.9, 3.1, 3.5] },
  { n: "Industrial – Southeast", r: "$311.4M", p: "-2.4%", warn: true, spark: [3, 3.3, 3.4, 3.2, 3.0, 2.8] },
  { n: "Distribution – EMEA", r: "$268.9M", p: "+11.3%", warn: false, spark: [2, 2.8, 2.4, 2.6, 3.2, 3.6] },
  { n: "Retail – Direct", r: "$214.7M", p: "+4.7%", warn: false, spark: [2.4, 2.6, 2.7, 2.9, 3.0, 3.2] },
];

// Weekly revenue ($M) and gross margin (%), January to June.
const REV = [96, 97, 95, 97, 99, 98, 100, 103, 102, 104, 103, 106, 108, 107, 110, 112, 115, 117, 121, 124, 123, 126, 127, 129, 131, 134];
const GM = [36.9, 36.8, 36.6, 36.5, 36.7, 36.6, 36.8, 36.9, 36.8, 37.0, 37.1, 37.0, 37.2, 37.4, 37.3, 37.5, 37.6, 37.8, 37.9, 38.2, 38.1, 38.3, 38.4, 38.5, 38.6, 38.8];
const CW = 760;
const CH = 196;
const PX = 44;
const PT = 14;
const PB = 30;
const cx = (i: number) => PX + (i / (REV.length - 1)) * (CW - PX * 2);
const ry = (v: number) => PT + (1 - (v - 88) / (152 - 88)) * (CH - PT - PB);
const gy = (v: number) => PT + (1 - (v - 36.2) / (39.6 - 36.2)) * (CH - PT - PB);

/** Catmull-Rom through the points, as cubic Béziers. */
const smooth = (pts: [number, number][]) => {
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
};
const REV_PATH = smooth(REV.map((v, i) => [cx(i), ry(v)]));
const GM_PATH = smooth(GM.map((v, i) => [cx(i), gy(v)]));
const AREA = `${REV_PATH}L${cx(REV.length - 1)},${CH - PB}L${cx(0)},${CH - PB}Z`;
const HOT = 19; // May, week 2

const spark = (s: number[], w = 56, h = 16) => {
  const min = Math.min(...s);
  const max = Math.max(...s);
  return smooth(s.map((v, i) => [(i / (s.length - 1)) * w, h - ((v - min) / (max - min || 1)) * h]));
};

const EASE = [0.16, 1, 0.3, 1] as const;

/** The Genius Portal as the hero's product shot. Everything on it is illustrative. */
export function ConsoleV6() {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const area = `v6-area-${uid}`;
  const lineId = `v6-line-${uid}`;
  const glow = `v6-glow-${uid}`;
  const rise = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: EASE, delay } };

  return (
    <div className="grid w-[1180px] grid-cols-[200px_1fr] overflow-hidden rounded-[14px] border border-white/10 bg-[#0a1424]/95 text-white shadow-[0_60px_120px_-30px_rgb(0_0_0/0.8),0_0_0_1px_rgb(77_141_255/0.08)]">
      {/* Sidebar. */}
      <aside className="flex flex-col justify-between border-r border-white/[0.07] bg-[#08101d] px-3 py-4" aria-hidden="true">
        <ul className="space-y-0.5">
          {NAV.map((n) => (
            <li key={n.name} className={`flex items-center justify-between rounded-[6px] px-2.5 py-2 text-[0.75rem] ${n.on ? "bg-white/[0.06] text-white" : "text-white/55"}`}>
              <span className="flex items-center gap-2.5">
                <span className={`h-1 w-1 rounded-full ${n.on ? "bg-sky" : "bg-white/30"}`} />
                {n.name}
              </span>
              {n.count && <span className="rounded-[3px] bg-ember/15 px-1.5 font-mono text-[0.625rem] text-ember">{n.count}</span>}
            </li>
          ))}
        </ul>
        <div className="rounded-[8px] border border-white/[0.08] bg-white/[0.02] p-3">
          <p className="text-[0.75rem] font-semibold">Meridian Holdings</p>
          <p className="mt-0.5 text-[0.625rem] text-white/45">14 entities · governed</p>
        </div>
      </aside>

      <div className="min-w-0 space-y-3 p-4">
        {/* Revenue and margin. */}
        <motion.div {...rise(0.3)} className="relative rounded-[10px] border border-white/[0.07] bg-white/[0.015] px-2 pt-2">
          <svg viewBox={`0 0 ${CW} ${CH}`} className="h-auto w-full" role="img" aria-label="Illustrative chart: weekly revenue rising from about $96M to $134M between January and June, with gross margin rising from 36.9% to 38.8%.">
            <defs>
              <linearGradient id={area} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#4d8dff" stopOpacity="0.28" />
                <stop offset="1" stopColor="#4d8dff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={lineId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#2f6fe6" />
                <stop offset="1" stopColor="#7fb0ff" />
              </linearGradient>
              <filter id={glow} x="-5%" y="-30%" width="110%" height="160%">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {[90, 106, 128, 150].map((v) => (
              <g key={v}>
                <line x1={PX} x2={CW - PX} y1={ry(v)} y2={ry(v)} stroke="white" strokeOpacity="0.05" />
                <text x={PX - 8} y={ry(v) + 3} textAnchor="end" className="fill-sky/80 font-mono text-[9px]">
                  ${v}M
                </text>
              </g>
            ))}
            {[36.5, 37.5, 38.5, 39.5].map((v) => (
              <text key={v} x={CW - PX + 8} y={gy(v) + 3} className="fill-ember/80 font-mono text-[9px]">
                {v}%
              </text>
            ))}
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => (
              <text key={m} x={PX + (i / 5) * (CW - PX * 2)} y={CH - 10} textAnchor="middle" className="fill-white/35 font-mono text-[9px] uppercase">
                {m}
              </text>
            ))}
            <motion.path d={AREA} fill={`url(#${area})`} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1 }} />
            <motion.path d={REV_PATH} fill="none" stroke={`url(#${lineId})`} strokeWidth="2" filter={`url(#${glow})`} initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 1.8, ease: EASE }} />
            <motion.path d={GM_PATH} fill="none" stroke="#f29a1f" strokeWidth="1.8" filter={`url(#${glow})`} initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 1.8, ease: EASE }} />
            <motion.g initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 0.6 }}>
              <line x1={cx(HOT)} x2={cx(HOT)} y1={PT} y2={CH - PB} stroke="white" strokeOpacity="0.25" strokeDasharray="2 3" />
              <circle cx={cx(HOT)} cy={gy(GM[HOT])} r="9" fill="#f29a1f" fillOpacity="0.2" className="origin-center motion-safe:animate-ping [transform-box:fill-box]" />
              <circle cx={cx(HOT)} cy={gy(GM[HOT])} r="4" fill="#f29a1f" />
              <circle cx={cx(HOT)} cy={ry(REV[HOT])} r="3.5" fill="#0a1424" stroke="#7fb0ff" strokeWidth="1.5" />
            </motion.g>
          </svg>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, duration: 0.6, ease: EASE }}
            className="absolute right-[26%] top-2 w-[172px] rounded-[6px] border border-white/10 bg-[#050b18]/95 p-2.5 font-mono text-[0.625rem] shadow-[0_12px_30px_-10px_rgb(0_0_0/0.8)]"
            aria-hidden="true"
          >
            <p className="text-white/45">May · week 2</p>
            <p className="mt-1.5 flex justify-between text-white/60">
              Revenue <span className="text-sky">$127.4M</span>
            </p>
            <p className="flex justify-between text-white/60">
              Gross margin <span className="text-ember">38.2%</span>
            </p>
            <p className="flex justify-between text-white/60">
              vs prior <span className="text-white">+6.2% · +0.4pp</span>
            </p>
          </motion.div>
        </motion.div>

        {/* KPIs. */}
        <div className="grid grid-cols-4 gap-3">
          {KPIS.map((k, i) => (
            <motion.div key={k.k} {...rise(0.5 + i * 0.08)} className="rounded-[10px] border border-white/[0.07] bg-white/[0.015] p-3.5">
              <p className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-white/45">{k.k}</p>
              <div className="mt-2 flex items-end justify-between gap-2">
                <p className="text-[1.375rem] font-semibold leading-none tracking-[-0.02em]">{k.v}</p>
                <svg viewBox="0 0 56 16" className="h-4 w-14 overflow-visible" aria-hidden="true">
                  <path d={spark(k.spark)} fill="none" stroke={k.s === "warn" ? "#f29a1f" : "#4d8dff"} strokeWidth="1.5" />
                </svg>
              </div>
              <p className={`mt-2 text-[0.6875rem] ${k.s === "warn" ? "text-ember" : "text-sky"}`}>{k.d}</p>
              <div className="mt-2.5">
                <Status tone={k.s}>{k.st}</Status>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-[1.2fr_1fr] gap-3">
          {/* The agent's briefing. */}
          <motion.div {...rise(0.9)} className="rounded-[10px] border border-sky/30 bg-sky/[0.04] p-3.5 shadow-[0_0_40px_-20px_rgb(77_141_255/0.6)]">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-[0.75rem] font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-sky" aria-hidden="true" /> Executive Briefing
              </p>
              <p className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-white/40">Today · 06:12</p>
            </div>
            <p className="mt-2.5 text-[0.6875rem] leading-[1.6] text-white/75">
              The quarter is <span className="text-sky">ahead of plan</span>. Revenue is <span className="text-sky">6.4% above forecast</span> and EBITDA is up{" "}
              <span className="text-sky">1.2 points</span>, carried by North and EMEA.
            </p>
            <p className="mt-2 text-[0.6875rem] leading-[1.6] text-white/75">
              The one real risk is cash: <span className="text-ember">Southeast inventory</span> is tying up working capital as demand slows, leaving free cash flow{" "}
              <span className="text-ember">$4.2M behind plan</span>.
            </p>
            <p className="mt-2 text-[0.6875rem] leading-[1.6] text-white/75">My recommendation: approve the inventory release first, then review pricing before the board pack goes out Thursday.</p>
            <p className="mt-3 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-white/40">Recommended actions</p>
            <ul className="mt-2 space-y-1.5">
              {[
                { a: "Release $1.4M of Southeast inventory", i: "Cash flow +$1.4M · closes the gap to plan", b: "Approve" },
                { a: "Hold price floor on 1,284 SKUs", i: "Margin +120bp · $8.6M annualised", b: "Review" },
              ].map((r) => (
                <li key={r.a} className="flex items-center justify-between gap-3 rounded-[6px] border border-white/[0.08] bg-[#050b18]/60 px-3 py-2">
                  <span>
                    <span className="block text-[0.6875rem] text-white">{r.a}</span>
                    <span className="block text-[0.625rem] text-ember/90">{r.i}</span>
                  </span>
                  <span className="rounded-[4px] border border-ember/50 px-2 py-0.5 text-[0.625rem] text-ember">{r.b}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Business units. */}
          <motion.div {...rise(1)} className="rounded-[10px] border border-white/[0.07] bg-white/[0.015] p-3.5">
            <p className="text-[0.75rem] font-semibold">Performance by business unit</p>
            <div className="mt-3 grid grid-cols-[1fr_4.5rem_3.5rem_3.5rem] gap-2 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-white/35">
              <span>Business unit</span>
              <span className="text-right">Revenue</span>
              <span className="text-right">vs plan</span>
              <span className="text-right">Trend</span>
            </div>
            <ul className="mt-1">
              {UNITS.map((u) => (
                <li key={u.n} className="grid grid-cols-[1fr_4.5rem_3.5rem_3.5rem] items-center gap-2 border-b border-white/[0.05] py-2.5 text-[0.6875rem] last:border-b-0">
                  <span className="flex items-center gap-2 text-white/85">
                    <span className={`h-1.5 w-1.5 rounded-full ${u.warn ? "bg-ember" : "bg-sky"}`} aria-hidden="true" />
                    {u.n}
                  </span>
                  <span className="text-right font-mono text-white/70">{u.r}</span>
                  <span className={`text-right font-mono ${u.warn ? "text-ember" : "text-sky"}`}>{u.p}</span>
                  <svg viewBox="0 0 56 16" className="ml-auto h-4 w-12 overflow-visible" aria-hidden="true">
                    <path d={spark(u.spark)} fill="none" stroke={u.warn ? "#f29a1f" : "#4d8dff"} strokeWidth="1.3" />
                  </svg>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-4 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-white/40">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sky" /> Healthy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ember" /> Attention
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff5d6c]" /> Critical
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
