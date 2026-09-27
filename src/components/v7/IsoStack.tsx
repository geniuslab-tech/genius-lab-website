"use client";

import { useState } from "react";
import { LAYERS, TOP_DOWN, isTop, tagLine } from "./data";

const W = 1000;
const H = 660;
const CX = 300;
const A = 230; // half width of a plate
const B = 115; // half depth (2:1 isometric)
const T = 16; // plate thickness
const GAP = 80;
const BASE = 500;
const LABEL_X = 600;

const cy = (i: number) => BASE - i * GAP;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/** Study 01: five glass plates exploded upward in isometric, each wired to its label. */
export function IsoStack() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div>
      <div className="overflow-hidden md:overflow-visible">
      <div className="relative mx-auto aspect-[1000/660] w-[165%] max-w-none md:w-full md:max-w-[1100px]">
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="iso-top" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#4d8dff" stopOpacity="0.2" />
              <stop offset="1" stopColor="#4d8dff" stopOpacity="0.03" />
            </linearGradient>
            <linearGradient id="iso-top-on" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#6ea3ff" stopOpacity="0.42" />
              <stop offset="1" stopColor="#4d8dff" stopOpacity="0.08" />
            </linearGradient>
            <radialGradient id="iso-glow">
              <stop offset="0" stopColor="#4d8dff" stopOpacity="0.28" />
              <stop offset="1" stopColor="#4d8dff" stopOpacity="0" />
            </radialGradient>
          </defs>

          <ellipse cx={CX} cy={cy(2)} rx="360" ry="260" fill="url(#iso-glow)" />

          {/* Signals rise on the left, action leaves at the top. */}
          <g className="hidden md:block" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="2.5">
            <line x1="36" y1={cy(0) + 60} x2="36" y2={cy(4) - 60} stroke="rgb(255 255 255 / 0.14)" />
            <path d={`M30 ${cy(4) - 50} L36 ${cy(4) - 62} L42 ${cy(4) - 50}`} fill="none" stroke="rgb(255 255 255 / 0.3)" />
            <text x="20" y={cy(0) + 60} transform={`rotate(-90 20 ${cy(0) + 60})`} fill="rgb(255 255 255 / 0.35)">BUSINESS SIGNALS</text>
            <text x="20" y={cy(4) - 40} transform={`rotate(-90 20 ${cy(4) - 40})`} textAnchor="end" fill="#f29a1f">BUSINESS ACTION</text>
          </g>

          {LAYERS.map((l, i) => {
            const y = cy(i);
            const on = active === i;
            const top = isTop(l);
            const edge = top ? "#f29a1f" : on ? "#8db6ff" : "rgb(125 170 255 / 0.45)";
            return (
              <g
                key={l.n}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                style={{ transition: "transform 500ms var(--ease-out-strong)", transform: on ? "translateY(-8px)" : "none" }}
              >
                <polygon points={`${CX - A},${y} ${CX},${y + B} ${CX},${y + B + T} ${CX - A},${y + T}`} fill="#0a1628" stroke={edge} strokeOpacity="0.5" />
                <polygon points={`${CX},${y + B} ${CX + A},${y} ${CX + A},${y + T} ${CX},${y + B + T}`} fill="#0f1f38" stroke={edge} strokeOpacity="0.5" />
                <polygon
                  points={`${CX},${y - B} ${CX + A},${y} ${CX},${y + B} ${CX - A},${y}`}
                  fill={on ? "url(#iso-top-on)" : "url(#iso-top)"}
                  stroke={edge}
                  strokeWidth={top || on ? 1.4 : 1}
                />
                <text x={CX - A + 58} y={y + 4} fontFamily="var(--font-mono)" fontSize="12" fill={top ? "#f29a1f" : "#4d8dff"}>
                  {l.n}
                </text>
                <line
                  x1={CX + A}
                  y1={y}
                  x2={LABEL_X - 16}
                  y2={y}
                  stroke={on || top ? edge : "rgb(255 255 255 / 0.16)"}
                  strokeDasharray="2 5"
                  className="hidden md:block"
                />
                <circle cx={LABEL_X - 16} cy={y} r="2.5" fill={on || top ? edge : "rgb(255 255 255 / 0.3)"} className="hidden md:block" />
              </g>
            );
          })}

          {/* The spine: one governed system, foundation to execution. */}
          <line x1={CX} y1={cy(0)} x2={CX} y2={cy(4)} stroke="#4d8dff" strokeOpacity="0.7" />
          <circle cx={CX} cy={cy(4)} r="5" fill="#f29a1f" />
          <circle cx={CX} cy={cy(4)} r="12" fill="none" stroke="#f29a1f" strokeOpacity="0.4" className="v7-breathe" />
        </svg>

        <ol className="absolute inset-0 hidden md:block" aria-label="Layers, top first">
          {TOP_DOWN.map((l) => {
            const i = Number(l.n) - 1;
            const on = active === i;
            return (
              <li
                key={l.n}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="absolute -translate-y-1/2 pr-4"
                style={{ left: pct(LABEL_X, W), top: pct(cy(i), H), width: pct(W - LABEL_X, W) }}
              >
                <p className={`text-[clamp(1rem,1.6vw,1.25rem)] font-semibold tracking-[-0.01em] transition-colors ${on || isTop(l) ? "text-white" : "text-white/75"}`}>
                  <span className={`v6-label mr-3 text-[0.625rem] ${isTop(l) ? "text-ember" : "text-sky"}`}>{l.n}</span>
                  {l.name}
                </p>
                <p className="v6-label mt-1.5 text-[0.5625rem] text-white/40">{tagLine(l)}</p>
              </li>
            );
          })}
        </ol>
      </div>
      </div>

      <ol className="mt-8 grid gap-px border border-white/[0.07] bg-white/[0.07] md:hidden" aria-label="Layers, top first">
        {TOP_DOWN.map((l) => (
          <li key={l.n} className="bg-abyss px-4 py-3.5">
            <p className="font-semibold text-white">
              <span className={`v6-label mr-3 text-[0.625rem] ${isTop(l) ? "text-ember" : "text-sky"}`}>{l.n}</span>
              {l.name}
            </p>
            <p className="v6-label mt-1 text-[0.5625rem] text-white/40">{tagLine(l)}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
