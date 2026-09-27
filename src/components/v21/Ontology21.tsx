"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { SectionHead, useInView, useReducedMotion21 } from "./ui";
import { rd, wrap } from "./shared";

const AXES = [
  { name: "Data", role: "The facts", body: "Every system connected and reconciled into one set of trusted records." },
  { name: "Analytics", role: "The meaning", body: "Metrics and rules defined once, on the business objects themselves." },
  { name: "AI", role: "The reasoning", body: "Agents that read the model, answer questions and act on what they find." },
  { name: "People", role: "The judgement", body: "Owners, roles and decisions: who is accountable, who approves, who acts." },
  { name: "Business Context", role: "The why", body: "Strategy, processes and rules of the business that give every number its purpose." },
];

const r1 = (v: number) => Math.round(v * 10) / 10;
const C = 200;
const R = 138;
const PTS = AXES.map((_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length;
  return { x: r1(C + Math.cos(a) * R), y: r1(C + Math.sin(a) * R) };
});
const PENTAGON = PTS.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ") + "Z";

function Model({ active }: { active: number }) {
  return (
    <svg viewBox="0 0 400 400" className="h-auto w-full max-w-[440px]" role="img" aria-label={`Data, Analytics, AI, People and Business Context, each connected to one shared model. Highlighted: ${AXES[active].name}.`} data-rv="draw" fill="none">
      <circle cx={C} cy={C} r={R + 30} stroke="#e3dccf" strokeDasharray="2 6" />
      <path d={PENTAGON} pathLength={1} stroke="#cfc6b7" strokeWidth="1" className="v21-draw" />
      {PTS.map((p, i) => (
        <path
          key={i}
          d={`M${C} ${C} L${p.x} ${p.y}`}
          pathLength={1}
          stroke={i === active ? "#b0502a" : "#cfc6b7"}
          strokeWidth={i === active ? 1.6 : 1}
          className="v21-draw"
          style={{ transition: `stroke 500ms, stroke-dashoffset 1600ms cubic-bezier(0.22,1,0.36,1) ${300 + i * 110}ms` }}
        />
      ))}
      <circle cx={C} cy={C} r="52" fill="#fcfbf8" stroke="#101440" strokeWidth="1.2" />
      <circle cx={C} cy={C} r="40" stroke="#2f55d4" strokeOpacity="0.45" strokeDasharray="1 4" />
      <text x={C} y={C - 3} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#101440">
        Ontology
      </text>
      <text x={C} y={C + 13} textAnchor="middle" fontSize="10" fill="#5f6178">
        shared model
      </text>
      {PTS.map((p, i) => {
        const on = i === active;
        return (
          <g key={i} className="v21-fade" style={{ "--dd": `${700 + i * 110}ms` } as CSSProperties}>
            <circle cx={p.x} cy={p.y} r={on ? 30 : 26} fill={on ? "#101440" : "#fcfbf8"} stroke={on ? "#101440" : "#101440"} strokeWidth="1.2" style={{ transition: "fill 500ms, r 500ms" }} />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10.5" fontWeight="600" fill={on ? "#f4f1ec" : "#101440"} style={{ transition: "fill 500ms" }}>
              {AXES[i].name === "Business Context" ? "Context" : AXES[i].name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Ontology21() {
  const reduce = useReducedMotion21();
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!inView || reduce || touched) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % AXES.length), 3800);
    return () => window.clearTimeout(t);
  }, [inView, reduce, touched, active]);

  return (
    <section id="approach" className="relative scroll-mt-20 py-20 sm:py-28" aria-labelledby="v21-onto-title">
      <div ref={ref} className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <SectionHead
            className="lg:col-span-6"
            label="Our approach"
            id="v21-onto-title"
            lines={["Data Ontology", "Intelligence."]}
            lead="We are not only a data, analytics or AI company. We work where data, analytics, AI, people and business context meet, and model them as one."
          />
          <div data-rv="up" style={rd(120)} className="flex justify-center lg:col-span-6">
            <Model active={active} />
          </div>
        </div>

        <ol className="mt-14 grid border-t border-[var(--rule)] sm:grid-cols-2 lg:grid-cols-5" aria-label="The five axes">
          {AXES.map((a, i) => {
            const on = i === active;
            return (
              <li key={a.name} data-rv="up" style={rd(i * 70)} className="border-b border-[var(--rule)] lg:border-b-0 lg:[&:not(:last-child)]:border-r">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setTouched(true);
                    setActive(i);
                  }}
                  className="relative block h-full w-full px-1 py-6 text-left sm:px-5"
                >
                  <span className={`absolute inset-x-0 top-[-1px] h-[2px] origin-left bg-[var(--terra)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "scale-x-100" : "scale-x-0"}`} aria-hidden="true" />
                  <span className="v21-mono block text-[0.75rem] text-[var(--ink-3)]">0{i + 1} · {a.role}</span>
                  <span className={`mt-2 block text-[1.125rem] font-semibold transition-colors ${on ? "text-[var(--ink)]" : "text-[var(--ink-2)]"}`}>{a.name}</span>
                  <span className="mt-2 block text-[0.9375rem] leading-[1.6] text-[var(--ink-2)]">{a.body}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
