"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReduced } from "./hooks";
import { SectionHead } from "./ui";
import { Tilt } from "./Tilt";

const AXES = [
  { name: "Data", role: "The facts", body: "Every system connected and reconciled into one set of trusted records." },
  { name: "Analytics", role: "The meaning", body: "Metrics and rules defined once, on the business objects themselves." },
  { name: "AI", role: "The reasoning", body: "Agents that read the model, answer questions and act on what they find." },
  { name: "People", role: "The judgement", body: "Owners, roles and decisions: who is accountable, who approves, who acts." },
  { name: "Business Context", role: "The why", body: "Strategy, processes and rules of the business that give every number its purpose." },
];

const CYCLE_MS = 3600;
const C = 240;
const RING = 168;
const round = (v: number) => Math.round(v * 10) / 10;
const NODES = AXES.map((a, i) => {
  const ang = -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length;
  return { ...a, x: round(C + Math.cos(ang) * RING), y: round(C + Math.sin(ang) * RING) };
});
const hex = (r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    return `${round(C + Math.cos(a) * r)},${round(C + Math.sin(a) * r)}`;
  }).join(" ");

function Model({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  return (
    <svg viewBox="0 0 480 480" className="h-auto w-full" role="img" aria-label="Data, Analytics, AI, People and Business Context, each connected to Data Ontology Intelligence at the centre.">
      <polygon points={NODES.map((n) => `${n.x},${n.y}`).join(" ")} fill="none" stroke="rgb(143 220 255 / 0.14)" strokeDasharray="2 6" />
      {NODES.map((n, i) => (
        <line
          key={n.name}
          x1={C}
          y1={C}
          x2={n.x}
          y2={n.y}
          stroke={i === active ? "#8fdcff" : "rgb(143 220 255 / 0.2)"}
          strokeWidth={i === active ? 1.6 : 1}
          strokeDasharray={i === active ? undefined : "2 4"}
          style={{ transition: "stroke 400ms" }}
        />
      ))}
      <polygon points={hex(80)} fill="rgb(143 220 255 / 0.04)" stroke="rgb(143 220 255 / 0.2)" />
      <polygon points={hex(56)} fill="#0b0f30" stroke="rgb(255 178 107 / 0.6)" />
      <text x={C} y={C - 2} textAnchor="middle" fill="#eef2ff" fontSize="12" fontWeight="600">
        Ontology
      </text>
      <text x={C} y={C + 14} textAnchor="middle" fill="rgb(214 222 255 / 0.5)" fontSize="8" letterSpacing="1.5">
        SHARED MODEL
      </text>
      {NODES.map((n, i) => {
        const on = i === active;
        return (
          <g key={n.name} className="cursor-pointer" onPointerEnter={(e) => e.pointerType === "mouse" && onPick(i)} onClick={() => onPick(i)}>
            <circle cx={n.x} cy={n.y} r="36" fill={on ? "#8fdcff" : "#0b0f30"} stroke={on ? "#d4f3ff" : "rgb(143 220 255 / 0.3)"} strokeWidth="1.2" style={{ transition: "fill 400ms, stroke 400ms" }} />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill={on ? "#060818" : "#eef2ff"} style={{ transition: "fill 400ms" }}>
              {n.name === "Business Context" ? "Context" : n.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function OntologyV16() {
  const reduce = useReduced();
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);

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
    <section ref={root} id="ontology" className="scroll-mt-16 border-t border-[color:var(--line)] py-24 sm:py-32" aria-labelledby="v16-ontology-title">
      <div className="v16-wrap">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <SectionHead
              n="05"
              warm
              id="v16-ontology-title"
              kicker="Our approach"
              title="Data Ontology Intelligence."
              lead="We are not only a data, analytics or AI company. We work where data, analytics, AI, people and business context meet."
            />
            <p className="mt-5 max-w-[56ch] leading-[1.75] text-[color:var(--tx-2)]">
              An ontology is a living model of your business: its objects, such as customers, orders, products and
              suppliers, the relationships between them, and the rules that give them meaning. Every axis works on that
              same model, so they move in harmony instead of in hand-offs.
            </p>
          </div>
          <Tilt className="relative mx-auto w-full max-w-[460px] rounded-full lg:col-span-6" max={10}>
            <Model active={active} onPick={pick} />
          </Tilt>
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
                  className={`flex h-full w-full flex-col items-start rounded-[12px] border p-5 text-left transition-[border-color,background-color] duration-300 ${on ? "border-[rgb(143_220_255/0.5)] bg-[rgb(143_220_255/0.05)]" : "border-[color:var(--line)] hover:border-[color:var(--line-2)]"}`}
                >
                  <span className={`v16-label ${on ? "text-[color:var(--ice)]" : "text-[color:var(--tx-3)]"}`}>{a.role}</span>
                  <span className="v16-display mt-3 text-[1.125rem]">{a.name}</span>
                  <span className="mt-2 text-[0.9375rem] leading-[1.6] text-[color:var(--tx-2)]">{a.body}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
