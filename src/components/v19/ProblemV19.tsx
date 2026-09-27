"use client";

import { useCallback, useRef, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { lerp, mulberry32, r1, smooth, useReduced, useScrollProgress } from "./hooks";
import { Kicker, rd } from "./ui";

const SYSTEMS = ["ERP", "CRM", "Ledger", "Payroll", "Warehouse", "Spreadsheets", "E-commerce", "Support desk", "BI tool", "Planning"];

/** Illustrative growth of what a company has to hold together, founding to enterprise. */
const COUNTS = [
  { label: "Systems", from: 3, to: 46 },
  { label: "Reports", from: 8, to: 940 },
  { label: "Manual handoffs", from: 2, to: 210 },
  { label: "People in a decision", from: 2, to: 19 },
];

const VW = 640;
const VH = 540;
const HUB = { x: 320, y: 270 };
const NW = 112;
const NH = 34;

// Scattered start positions (seeded) and orderly end positions on an ellipse around the hub.
const rand = mulberry32(19);
const NODES = SYSTEMS.map((name, i) => {
  const a = -Math.PI / 2 + (i / SYSTEMS.length) * Math.PI * 2;
  const col = i % 4;
  const row = Math.floor(i / 4);
  return {
    name,
    sx: r1(Math.min(580, Math.max(62, 80 + col * 160 + (rand() - 0.5) * 90))),
    sy: r1(Math.min(505, Math.max(30, 70 + row * 180 + (rand() - 0.5) * 110))),
    ex: r1(HUB.x + Math.cos(a) * 240),
    ey: r1(HUB.y + Math.sin(a) * 200),
  };
});
// Fragile manual links between neighbours: the people holding it together.
const MANUAL: [number, number, string?][] = [
  [0, 5, "CSV export"],
  [1, 5],
  [2, 3],
  [4, 0],
  [6, 1, "copy & paste"],
  [7, 1],
  [8, 5, "monthly pull"],
  [9, 2],
  [3, 9],
];

type Pos = { x: number; y: number };

export function ProblemV19() {
  const reduce = useReduced();
  const track = useRef<HTMLDivElement>(null);
  const nodeEls = useRef<(SVGGElement | null)[]>([]);
  const hubLines = useRef<(SVGLineElement | null)[]>([]);
  const manualEls = useRef<(SVGGElement | null)[]>([]);
  const hub = useRef<SVGGElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<0 | 1>(0);
  const [linked, setLinked] = useState(false);

  const draw = useCallback((p: number) => {
    const pos: Pos[] = NODES.map((n, i) => {
      const m = smooth(0.14 + i * 0.02, 0.56 + i * 0.02, p);
      return { x: lerp(n.sx, n.ex, m), y: lerp(n.sy, n.ey, m) };
    });
    let done = 0;
    NODES.forEach((_, i) => {
      const { x, y } = pos[i];
      nodeEls.current[i]?.setAttribute("transform", `translate(${(x - NW / 2).toFixed(1)} ${(y - NH / 2).toFixed(1)})`);
      const d = smooth(0.4 + i * 0.03, 0.56 + i * 0.03, p);
      if (d > 0.98) done++;
      const l = hubLines.current[i];
      if (l) {
        l.setAttribute("x2", x.toFixed(1));
        l.setAttribute("y2", y.toFixed(1));
        l.style.strokeDashoffset = (1 - d).toFixed(3);
      }
      nodeEls.current[i]?.setAttribute("data-on", d > 0.98 ? "1" : "0");
    });
    const fade = 1 - smooth(0.2, 0.46, p);
    MANUAL.forEach(([a, b], k) => {
      const g = manualEls.current[k];
      if (!g) return;
      g.style.opacity = fade.toFixed(3);
      const ln = g.firstElementChild as SVGLineElement | null;
      ln?.setAttribute("x1", pos[a].x.toFixed(1));
      ln?.setAttribute("y1", pos[a].y.toFixed(1));
      ln?.setAttribute("x2", pos[b].x.toFixed(1));
      ln?.setAttribute("y2", pos[b].y.toFixed(1));
      const t = g.lastElementChild as SVGTextElement | null;
      if (t && t.tagName === "text") {
        t.setAttribute("x", ((pos[a].x + pos[b].x) / 2).toFixed(1));
        t.setAttribute("y", ((pos[a].y + pos[b].y) / 2 - 6).toFixed(1));
      }
    });
    const h = smooth(0.3, 0.5, p);
    if (hub.current) {
      hub.current.style.opacity = h.toFixed(3);
      hub.current.setAttribute("transform", `translate(${HUB.x} ${HUB.y}) scale(${(0.7 + 0.3 * h).toFixed(3)})`);
    }
    if (counter.current) counter.current.textContent = String(done).padStart(2, "0");
    setPhase(p > 0.5 ? 1 : 0);
    setLinked(done === NODES.length);
  }, []);

  useScrollProgress(track, draw, !reduce);

  const initial = reduce ? 1 : 0;
  const start = (n: (typeof NODES)[number]) => (reduce ? { x: n.ex, y: n.ey } : { x: n.sx, y: n.sy });

  const map = (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="v19-map h-full max-h-[62svh] w-full lg:max-h-[78svh]" role="img" aria-label="Ten business systems, first scattered and linked by manual handoffs, then each connected cleanly to one shared Genius Lab layer.">
      <defs>
        <radialGradient id="v19-hubglow">
          <stop offset="0" stopColor="#5b8cff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#5b8cff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={HUB.x} cy={HUB.y} rx="240" ry="200" fill="none" stroke="rgb(150 170 255 / 0.08)" strokeDasharray="2 6" />

      {MANUAL.map(([a, b, label], k) => {
        const A = start(NODES[a]);
        const B = start(NODES[b]);
        return (
          <g key={k} ref={(el) => void (manualEls.current[k] = el)} style={{ opacity: reduce ? 0 : 1 }}>
            <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="rgb(222 228 247 / 0.28)" strokeWidth="1" strokeDasharray="3 5" />
            {label && (
              <text x={r1((A.x + B.x) / 2)} y={r1((A.y + B.y) / 2 - 6)} textAnchor="middle" className="v19-mono" fontSize="10" fill="rgb(222 228 247 / 0.5)">
                {label}
              </text>
            )}
          </g>
        );
      })}

      {NODES.map((n, i) => {
        const P = start(n);
        return (
          <line
            key={n.name}
            ref={(el) => void (hubLines.current[i] = el)}
            x1={HUB.x}
            y1={HUB.y}
            x2={P.x}
            y2={P.y}
            pathLength={1}
            stroke="#5b8cff"
            strokeOpacity="0.65"
            strokeWidth="1.25"
            strokeDasharray="1 1"
            style={{ strokeDashoffset: 1 - initial }}
          />
        );
      })}

      <g ref={hub} transform={`translate(${HUB.x} ${HUB.y}) scale(${0.7 + 0.3 * initial})`} style={{ opacity: initial }}>
        <circle r="120" fill="url(#v19-hubglow)" />
        <path d="M-34 -58h68l34 58-34 58h-68l-34-58z" fill="#0c1233" stroke="#5b8cff" strokeWidth="1.5" />
        <text y="-4" textAnchor="middle" fontSize="15" fontWeight="600" fill="#eef1fa">
          Genius Lab
        </text>
        <text y="16" textAnchor="middle" className="v19-mono" fontSize="9.5" letterSpacing="1.4" fill="#a9c3ff">
          ONE LAYER
        </text>
      </g>

      {NODES.map((n, i) => {
        const P = start(n);
        return (
          <g key={n.name} ref={(el) => void (nodeEls.current[i] = el)} transform={`translate(${r1(P.x - NW / 2)} ${r1(P.y - NH / 2)})`} data-on={reduce ? "1" : "0"} className="group">
            <rect width={NW} height={NH} rx="8" fill="#0b0f24" stroke="rgb(150 170 255 / 0.22)" className="transition-[stroke] duration-500 group-data-[on='1']:stroke-[#5b8cff]" />
            <circle cx="15" cy={NH / 2} r="3" className="fill-[rgb(222_228_247/0.3)] transition-[fill] duration-500 group-data-[on='1']:fill-[#5b8cff]" />
            <text x="26" y={NH / 2 + 4} fontSize="12" fill="#eef1fa">
              {n.name}
            </text>
          </g>
        );
      })}
    </svg>
  );

  const copyA = (
    <>
      <h2 id="v19-problem-title" className="v19-h2">
        Complexity Is the Cost of Growth.
      </h2>
      <p className="v19-lead mt-5 max-w-[46ch] max-sm:text-[0.9375rem]">
        Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding
        everything together. Leadership loses visibility, execution slows down, and the business pays the price.
      </p>
    </>
  );
  const copyB = (
    <>
      <h2 className="v19-h2">Solve the Right Problem.</h2>
      <p className="v19-lead mt-5 max-w-[48ch] max-sm:text-[0.9375rem]">
        When the business becomes fragmented, replacing systems can feel like the natural next step. Sometimes it is.
        But often the problem can be solved without the cost, operational load and disruption risk of a system
        transition. Building on what already works reduces complexity and unlocks more value from your systems and
        people.
      </p>
    </>
  );

  const counts = (
    <div className="v19-wrap pb-24 sm:pb-32">
      <dl className="grid grid-cols-2 border-y border-[color:var(--line)] lg:grid-cols-4">
        {COUNTS.map((c, i) => (
          <div
            key={c.label}
            className="v19-rv flex flex-col border-[color:var(--line)] px-1 py-8 sm:px-6 max-lg:odd:border-r max-lg:[&:nth-child(-n+2)]:border-b lg:[&:not(:last-child)]:border-r"
            style={rd(i * 80)}
          >
            <dt className="v19-label order-2 mt-3 text-[color:var(--tx-3)]">{c.label}</dt>
            <dd className="order-1 flex items-baseline gap-3">
              <span className="v19-mono text-[0.9375rem] text-[color:var(--tx-3)]">{c.from}</span>
              <ArrowRight size={13} className="text-[color:var(--tx-3)]" aria-hidden="true" />
              <span className="v19-h1 text-[clamp(2rem,3.6vw,3rem)] tabular-nums">{c.to.toLocaleString("en-US")}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="v19-label mt-4 text-[color:var(--tx-3)]">What growth adds, founding to enterprise · illustrative</p>
    </div>
  );

  if (reduce) {
    return (
      <section className="relative pt-24 sm:pt-32" aria-labelledby="v19-problem-title">
        <div className="v19-wrap grid items-center gap-12 pb-16 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-5">
            <Kicker n="00">The problem</Kicker>
            <div>{copyA}</div>
            <div>{copyB}</div>
          </div>
          <div className="lg:col-span-7">{map}</div>
        </div>
        {counts}
      </section>
    );
  }

  return (
    <section className="relative" aria-labelledby="v19-problem-title">
      <div ref={track} className="relative h-[260svh]">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden pt-16">
          <div className="v19-wrap grid h-full w-full grid-rows-[auto_1fr] items-center gap-4 py-6 lg:grid-cols-12 lg:grid-rows-1 lg:gap-10">
            <div className="lg:col-span-5">
              <div className="flex items-center justify-between gap-4">
                <Kicker n="00">The problem</Kicker>
                <p className="v19-label text-[color:var(--tx-3)]" aria-hidden="true">
                  <span ref={counter} className={linked ? "text-[color:var(--acc-2)]" : "text-white"}>
                    00
                  </span>{" "}
                  / {NODES.length} connected
                </p>
              </div>
              <div className="relative mt-6 grid">
                <div className={`col-start-1 row-start-1 transition-[opacity,filter,transform] duration-700 ease-[var(--ease)] ${phase === 0 ? "opacity-100" : "pointer-events-none -translate-y-3 opacity-0 blur-[6px]"}`}>
                  {copyA}
                </div>
                <div className={`col-start-1 row-start-1 transition-[opacity,filter,transform] duration-700 ease-[var(--ease)] ${phase === 1 ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0 blur-[6px]"}`}>
                  {copyB}
                </div>
              </div>
            </div>
            <div className="flex h-full min-h-0 items-center justify-center lg:col-span-7">{map}</div>
          </div>
        </div>
      </div>
      {counts}
    </section>
  );
}
