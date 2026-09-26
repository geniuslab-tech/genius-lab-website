"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Intro } from "./ui";

const AXES = [
  { name: "Data", role: "The facts", body: "Every system connected and reconciled into one set of trusted records." },
  { name: "Analytics", role: "The meaning", body: "Metrics and rules defined once, on the business objects themselves." },
  { name: "AI", role: "The reasoning", body: "Agents that read the model, answer questions and act on what they find." },
  { name: "People", role: "The judgement", body: "Owners, roles and decisions: who is accountable, who approves, who acts." },
  { name: "Business Context", role: "The why", body: "Strategy, processes and rules of the business that give every number its purpose." },
];

const CYCLE_MS = 3600;
const C = 240;
const RING = 170;
const round = (v: number) => Math.round(v * 10) / 10;
const NODES = AXES.map((a, i) => {
  const ang = -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length;
  return { ...a, x: round(C + Math.cos(ang) * RING), y: round(C + Math.sin(ang) * RING) };
});

/** The five axes on one ring, each wired to the shared model at the centre. */
function Model({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  return (
    <svg viewBox="0 0 480 480" className="h-auto w-full" role="img" aria-label="Data, Analytics, AI, People and Business Context, each connected to Data Ontology Intelligence at the centre.">
      <circle cx={C} cy={C} r={RING} fill="none" stroke="#e3e8ef" strokeDasharray="3 6" />
      <circle cx={C} cy={C} r="96" fill="#f5f7fb" />
      {NODES.map((n, i) => (
        <line
          key={n.name}
          x1={C}
          y1={C}
          x2={n.x}
          y2={n.y}
          stroke={i === active ? "#f29a1f" : "#c7d0dd"}
          strokeWidth={i === active ? 2 : 1.2}
          strokeDasharray={i === active ? undefined : "2 4"}
          style={{ transition: "stroke 400ms" }}
        />
      ))}
      <g className="origin-center motion-safe:animate-[spin_30s_linear_infinite] [transform-box:fill-box]">
        <circle cx={C} cy={C} r="62" fill="none" stroke="#4d8dff" strokeOpacity="0.5" strokeDasharray="1 6" strokeWidth="2" />
      </g>
      <circle cx={C} cy={C} r="48" fill="#050b18" />
      <text x={C} y={C - 3} textAnchor="middle" className="fill-white text-[11px] font-bold">
        Ontology
      </text>
      <text x={C} y={C + 12} textAnchor="middle" className="fill-white/50 font-mono text-[8px] uppercase tracking-[0.12em]">
        shared model
      </text>
      {NODES.map((n, i) => {
        const on = i === active;
        return (
          <g key={n.name} className="cursor-pointer" onPointerEnter={(e) => e.pointerType === "mouse" && onPick(i)} onClick={() => onPick(i)}>
            <circle cx={n.x} cy={n.y} r="34" fill={on ? "#050b18" : "white"} stroke={on ? "#f29a1f" : "#e3e8ef"} strokeWidth="1.5" style={{ transition: "fill 400ms, stroke 400ms" }} />
            <text x={n.x} y={n.y + 4} textAnchor="middle" className={`text-[11px] font-bold ${on ? "fill-white" : "fill-steel"}`} style={{ transition: "fill 400ms" }}>
              {n.name === "Business Context" ? "Context" : n.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function OntologyV6() {
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
    const t = setTimeout(() => setActive((a) => (a + 1) % AXES.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [inView, reduce, touched, active]);

  const pick = (i: number) => {
    setTouched(true);
    setActive(i);
  };

  return (
    <section ref={root} id="ontology" className="scroll-mt-[4.5rem] bg-frost py-24 sm:py-32" aria-labelledby="v6-ontology-title">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <Intro
              id="v6-ontology-title"
              accent="ember"
              label="Our approach"
              title="Data Ontology Intelligence."
              lead="We are not only a data, analytics or AI company. We work where data, analytics, AI, people and business context meet."
            />
            <p data-reveal="up" data-delay="160" className="text-pretty mt-5 max-w-[56ch] leading-[1.75] text-steel-2">
              An ontology is a living model of your business: its objects, such as customers, orders, products and
              suppliers, the relationships between them, and the rules that give them meaning. Every axis works on that
              same model, so they move in harmony instead of in hand-offs.
            </p>
          </div>
          <div data-reveal="up" className="mx-auto w-full max-w-[460px] lg:col-span-6">
            <Model active={active} onPick={pick} />
          </div>
        </div>

        <ol className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label="The five axes">
          {AXES.map((a, i) => {
            const on = i === active;
            return (
              <li key={a.name}>
                <button
                  type="button"
                  onClick={() => pick(i)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && pick(i)}
                  aria-pressed={on}
                  className={`relative flex h-full w-full flex-col items-start overflow-hidden rounded-[12px] border p-5 text-left transition-[border-color,background-color,box-shadow] duration-300 ${
                    on ? "border-ember/50 bg-white shadow-[0_20px_40px_-28px_rgb(194_109_0/0.5)]" : "border-rule6 bg-white/60 hover:bg-white"
                  }`}
                >
                  <span className={`v6-label ${on ? "text-ember-ink" : "text-steel-3"}`}>{a.role}</span>
                  <span className="mt-3 text-[1.125rem] font-bold tracking-[-0.015em] text-steel">{a.name}</span>
                  <span className="mt-2 text-[0.9375rem] leading-[1.6] text-steel-2">{a.body}</span>
                  {on && !reduce && !touched && (
                    <span key={`timer-${active}`} className="absolute inset-x-0 bottom-0 block h-[2px] origin-left animate-[topic-timer_3600ms_linear_forwards] bg-ember" aria-hidden="true" />
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
