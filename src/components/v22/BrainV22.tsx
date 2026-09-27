"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import { axialToPixel, hexPoints, hexRing } from "@/lib/hex";
import { SectionHead, r1 } from "./ui";

const C = { x: 300, y: 270 };
const S = 46;

type Cell = { id: string; x: number; y: number; ring: 1 | 2 };
const RING1 = ["Systems", "Tables", "Metrics", "Dashboards", "Processes", "Customers"];
const RING2 = ["Operations", "", "Finance", "", "Events", "", "Definitions", "", "Relationships", "", "Owners", ""];

const CELLS: Cell[] = [
  ...hexRing(1).map(([q, r], i) => ({ id: RING1[i], ring: 1 as const, ...axialToPixel(q, r, S) })),
  ...hexRing(2).map(([q, r], i) => ({ id: RING2[i] || `blank-${i}`, ring: 2 as const, ...axialToPixel(q, r, S) })),
].map((c) => ({ ...c, x: r1(C.x + c.x), y: r1(C.y + c.y) }));

const TOPICS = [
  {
    name: "Semantic Context",
    body: "What every number means. Shared definitions for metrics, tables and dashboards, so revenue means the same thing in every report.",
    cells: ["Metrics", "Tables", "Dashboards", "Definitions"],
  },
  {
    name: "Business Context",
    body: "How the company actually works. Customers, operations and finance, and the relationships that connect them.",
    cells: ["Customers", "Operations", "Finance", "Relationships", "Owners"],
  },
  {
    name: "Event Context",
    body: "What is happening right now. Transactions, process steps and system events, captured as they occur.",
    cells: ["Systems", "Processes", "Events"],
  },
];

const CYCLE = 5200;

function Cluster({ lit }: { lit: string[] }) {
  return (
    <svg viewBox="0 0 600 540" className="h-auto w-full" aria-hidden="true">
      {CELLS.map((c) => {
        const k = lit.indexOf(c.id);
        return (
          <path
            key={`l-${c.id}`}
            d={`M${C.x} ${C.y}L${c.x} ${c.y}`}
            pathLength={1}
            stroke="#2fd4b8"
            strokeWidth="1.5"
            strokeDasharray="1"
            className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-700 motion-safe:ease-[var(--ease-io)]"
            style={{ strokeDashoffset: k >= 0 ? 0 : 1, transitionDelay: k >= 0 ? `${k * 110}ms` : "0ms" }}
          />
        );
      })}
      {CELLS.map((c, i) => {
        const k = lit.indexOf(c.id);
        const on = k >= 0;
        const blank = c.id.startsWith("blank");
        return (
          <g key={c.id} className="v22-seq" style={{ "--i": i } as CSSProperties}>
            <polygon
              points={hexPoints(c.x, c.y, S - 3)}
              fill={on ? "#5577ff" : blank ? "transparent" : "#171c52"}
              stroke={on ? "#9aaeff" : "#ffffff"}
              strokeOpacity={on ? 0.9 : blank ? 0.1 : 0.2}
              className="motion-safe:transition-[fill,stroke-opacity] motion-safe:duration-500"
              style={{ transitionDelay: on ? `${k * 110 + 150}ms` : "0ms" }}
            />
            {!blank && (
              <text x={c.x} y={c.y + 4} textAnchor="middle" fontSize={c.id.length > 10 ? 9 : 11} fill="#fff" fillOpacity={on ? 1 : 0.62} className="v22-mono">
                {c.id}
              </text>
            )}
          </g>
        );
      })}
      <polygon points={hexPoints(C.x, C.y, S - 3)} fill="#ffffff" />
      <text x={C.x} y={C.y - 3} textAnchor="middle" fontSize="12" fontWeight="600" fill="#101440" className="v22-wide">
        Second
      </text>
      <text x={C.x} y={C.y + 12} textAnchor="middle" fontSize="12" fontWeight="600" fill="#101440" className="v22-wide">
        Brain
      </text>
    </svg>
  );
}

export function BrainV22() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [touched, setTouched] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reduce || touched) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % TOPICS.length), CYCLE);
    return () => clearTimeout(t);
  }, [inView, reduce, touched, active]);

  const topic = TOPICS[active];

  return (
    <section id="brain" className="scroll-mt-[var(--nav)] bg-[linear-gradient(var(--paper)_50%,#fff_50%)]" aria-labelledby="v22-brain-title">
      <div ref={root} data-v22r="band" className="v22-band v22-hexfield relative bg-[var(--navy)] py-24 text-white sm:py-32">
        <div className="v22-shell grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionHead
              dark
              n="03"
              label="Second Brain"
              id="v22-brain-title"
              title="A Second Brain for your business"
              lead="The intelligence layer holds the full context of the company: its systems, tables, metrics, dashboards, processes, customers, operations and finances. AI Agents work on top of it, end to end."
            />

            <ul className="mt-10 space-y-2" aria-label="Context held in the Second Brain">
              {TOPICS.map((t, i) => {
                const on = i === active;
                return (
                  <li key={t.name}>
                    <button
                      type="button"
                      aria-expanded={on}
                      onClick={() => {
                        setTouched(true);
                        setActive(i);
                      }}
                      className={`chb relative block w-full text-left [--c:14px] ${on ? "[--bd:#5577ff]" : "[--bd:rgb(255_255_255/0.14)] hover:[--bd:rgb(255_255_255/0.35)]"}`}
                    >
                      <span className={`chi block px-5 py-4 ${on ? "bg-[var(--navy-8)]" : "bg-[var(--navy)]"}`}>
                        <span className="flex items-center justify-between gap-4">
                          <span className={`v22-wide text-[1.0625rem] ${on ? "text-white" : "text-white/70"}`}>{t.name}</span>
                          <span className="v22-mono text-[0.75rem] text-white/45">0{i + 1}</span>
                        </span>
                        <span className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease)] ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                          <span className="overflow-hidden">
                            <span className="block pt-2 leading-[1.65] text-white/70">{t.body}</span>
                          </span>
                        </span>
                        {on && !reduce && !touched && (
                          <span key={`t-${active}`} className="v22-timer absolute inset-x-0 bottom-0 block h-[2px] bg-[var(--trace)]" style={{ "--t": `${CYCLE}ms` } as CSSProperties} aria-hidden="true" />
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div data-v22r="up" className="mx-auto max-w-[620px]">
              <Cluster lit={topic.cells} />
              <p className="sr-only" aria-live="polite">
                Highlighted in the Second Brain: {topic.name}, covering {topic.cells.join(", ")}.
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.8125rem] text-white/60">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 bg-[var(--signal)]" aria-hidden="true" /> In context for {topic.name.toLowerCase()}
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-px w-5 bg-[var(--trace)]" aria-hidden="true" /> Relationship
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
