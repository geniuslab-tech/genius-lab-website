"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import { hexPoints } from "@/lib/hex";
import { SectionHead, r1 } from "./ui";

const AXES = [
  { name: "Data", role: "The facts", body: "Every system connected and reconciled into one set of trusted records." },
  { name: "Analytics", role: "The meaning", body: "Metrics and rules defined once, on the business objects themselves." },
  { name: "AI", role: "The reasoning", body: "Agents that read the model, answer questions and act on what they find." },
  { name: "People", role: "The judgement", body: "Owners, roles and decisions: who is accountable, who approves, who acts." },
  { name: "Business Context", role: "The why", body: "Strategy, processes and rules of the business that give every number its purpose." },
];

const CYCLE = 3800;
const C = 240;
const RING = 168;
const NODES = AXES.map((a, i) => {
  const ang = -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length;
  return { ...a, x: r1(C + Math.cos(ang) * RING), y: r1(C + Math.sin(ang) * RING) };
});

/** Five axes, each a hexagon wired into the shared model at the centre. */
function Model({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  return (
    <svg viewBox="0 0 480 480" className="h-auto w-full" role="img" aria-label="Data, Analytics, AI, People and Business Context, each connected to the ontology at the centre.">
      <polygon points={hexPoints(C, C, RING + 4, true)} fill="none" stroke="#dce0ea" strokeDasharray="3 6" />
      {NODES.map((n, i) => (
        <g key={`l-${n.name}`}>
          <path d={`M${C} ${C}L${n.x} ${n.y}`} pathLength={1} fill="none" stroke="#c3c9d9" className="v22-draw" style={{ "--d": `${i * 120}ms` } as CSSProperties} />
          <path
            d={`M${C} ${C}L${n.x} ${n.y}`}
            pathLength={1}
            fill="none"
            stroke="#5577ff"
            strokeWidth="2.5"
            strokeDasharray="1"
            className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-700 motion-safe:ease-[var(--ease-io)]"
            style={{ strokeDashoffset: i === active ? 0 : 1 }}
          />
        </g>
      ))}
      <polygon points={hexPoints(C, C, 70)} fill="#101440" />
      <polygon points={hexPoints(C, C, 56)} fill="none" stroke="#9aaeff" strokeOpacity="0.5" />
      <text x={C} y={C - 2} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600" className="v22-wide">
        Ontology
      </text>
      <text x={C} y={C + 15} textAnchor="middle" fill="#9aaeff" fontSize="9" letterSpacing="1.4" className="v22-mono">
        SHARED MODEL
      </text>
      {NODES.map((n, i) => {
        const on = i === active;
        return (
          <g key={n.name} className="v22-seq cursor-pointer" style={{ "--i": i } as CSSProperties} onClick={() => onPick(i)}>
            <polygon
              points={hexPoints(n.x, n.y, 42)}
              fill={on ? "#5577ff" : "#ffffff"}
              stroke={on ? "#2f4fe0" : "#c3c9d9"}
              strokeWidth="1.5"
              className="motion-safe:transition-[fill,stroke] motion-safe:duration-500"
            />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="12" fontWeight="600" fill={on ? "#fff" : "#101440"} className="v22-wide">
              {n.name === "Business Context" ? "Context" : n.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function OntologyV22() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [touched, setTouched] = useState(false);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reduce || touched) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % AXES.length), CYCLE);
    return () => clearTimeout(t);
  }, [inView, reduce, touched, active]);

  const pick = (i: number) => {
    setTouched(true);
    setActive(i);
  };

  return (
    <section ref={root} id="ontology" className="scroll-mt-[var(--nav)] bg-white py-24 sm:py-32" aria-labelledby="v22-ontology-title">
      <div className="v22-shell">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <SectionHead
              n="06"
              label="Our approach"
              id="v22-ontology-title"
              title="Data Ontology Intelligence"
              lead="We are not only a data, analytics or AI company. We work where data, analytics, AI, people and business context meet."
            />
            <p data-v22r="up" style={{ "--rd": "160ms" } as CSSProperties} className="text-pretty mt-5 max-w-[56ch] leading-[1.75] text-[var(--ink-2)]">
              An ontology is a living model of your business: its objects, such as customers, orders, products and
              suppliers, the relationships between them, and the rules that give them meaning. Every axis works on that
              same model, so they move in harmony instead of in hand-offs.
            </p>
          </div>
          <div data-v22r="up" className="mx-auto w-full max-w-[460px] lg:col-span-6">
            <Model active={active} onPick={pick} />
          </div>
        </div>

        <ol className="mt-14 grid gap-2 sm:grid-cols-2 lg:grid-cols-5" aria-label="The five axes">
          {AXES.map((a, i) => {
            const on = i === active;
            return (
              <li key={a.name} data-v22r="wipe" className="ch [--c:16px]" style={{ "--rd": `${i * 80}ms` } as CSSProperties}>
                <button
                  type="button"
                  onClick={() => pick(i)}
                  aria-pressed={on}
                  className={`chb relative block h-full w-full text-left [--c:16px] ${on ? "[--bd:var(--signal)]" : "[--bd:var(--rule)] hover:[--bd:var(--rule-2)]"}`}
                >
                  <span className={`chi flex h-full flex-col p-5 ${on ? "bg-[var(--signal-soft)]" : "bg-[var(--paper)]"}`}>
                    <span className={`v22-label ${on ? "text-[var(--signal-ink)]" : "text-[var(--ink-3)]"}`}>{a.role}</span>
                    <span className="v22-wide mt-3 text-[1.0625rem]">{a.name}</span>
                    <span className="mt-2 text-[0.9375rem] leading-[1.6] text-[var(--ink-2)]">{a.body}</span>
                    {on && !reduce && !touched && (
                      <span key={`t-${active}`} className="v22-timer absolute inset-x-0 bottom-0 block h-[2px] bg-[var(--signal)]" style={{ "--t": `${CYCLE}ms` } as CSSProperties} aria-hidden="true" />
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
