"use client";

import { useEffect, useRef, useState } from "react";
import { round, useInView, useReduced } from "./hooks";
import { SectionHead, rd } from "./ui";

const AXES = [
  { name: "Data", role: "The facts", body: "Every system connected and reconciled into one set of trusted records." },
  { name: "Analytics", role: "The meaning", body: "Metrics and rules defined once, on the business objects themselves." },
  { name: "AI", role: "The reasoning", body: "Agents that read the model, answer questions and act on what they find." },
  { name: "People", role: "The judgement", body: "Owners, roles and decisions: who is accountable, who approves, who acts." },
  { name: "Business Context", role: "The why", body: "Strategy, processes and rules of the business that give every number its purpose." },
];
const OBJECTS = ["Customers", "Orders", "Products", "Suppliers"];

const C = 250;
const RING = 188;
const INNER = 92;
const NODES = AXES.map((a, i) => {
  const ang = -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length;
  return { ...a, x: round(C + Math.cos(ang) * RING), y: round(C + Math.sin(ang) * RING) };
});
const OBJ = OBJECTS.map((o, i) => {
  const ang = Math.PI / 4 + (i * Math.PI) / 2;
  return { o, x: round(C + Math.cos(ang) * INNER), y: round(C + Math.sin(ang) * INNER) };
});
const hex = (r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return `${round(C + Math.cos(a) * r)},${round(C + Math.sin(a) * r)}`;
  }).join(" ");

function Model({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  return (
    <svg viewBox="0 0 500 500" className="h-auto w-full" role="img" aria-label="Data, Analytics, AI, People and Business Context, each connected to one shared ontology of customers, orders, products and suppliers at the centre.">
      <circle cx={C} cy={C} r={RING} fill="none" stroke="#d6dde8" strokeDasharray="2 6" />
      {OBJ.map((a, i) => {
        const b = OBJ[(i + 1) % OBJ.length];
        return <line key={a.o} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#c9d3e2" />;
      })}
      {NODES.map((n, i) => (
        <g key={n.name}>
          <line x1={C} y1={C} x2={n.x} y2={n.y} stroke={i === active ? "#1f4fd1" : "#cfd7e4"} strokeWidth={i === active ? 1.8 : 1} style={{ transition: "stroke 400ms" }} />
          {i === active && <line x1={n.x} y1={n.y} x2={C} y2={C} stroke="#1f4fd1" strokeWidth="2.4" strokeDasharray="4 21" className="v23-flow" />}
        </g>
      ))}
      <polygon points={hex(64)} fill="#101440" />
      <polygon points={hex(74)} fill="none" stroke="#101440" strokeOpacity="0.25" />
      <text x={C} y={C - 4} textAnchor="middle" fill="#fff" fontSize="15" fontWeight="600">
        Ontology
      </text>
      <text x={C} y={C + 14} textAnchor="middle" fill="#b9c6ff" fontSize="10.5" className="v23-mono">
        shared model
      </text>
      {OBJ.map((a) => (
        <g key={a.o}>
          <circle cx={a.x} cy={a.y} r="4" fill="#fff" stroke="#101440" strokeWidth="1.4" />
          <text x={a.x} y={a.y + (a.y > C ? 18 : -10)} textAnchor="middle" fontSize="10.5" fill="#434e6c" className="v23-mono">
            {a.o.toLowerCase()}
          </text>
        </g>
      ))}
      {NODES.map((n, i) => {
        const on = i === active;
        return (
          <g key={n.name} className="cursor-pointer" onClick={() => onPick(i)} onPointerEnter={(e) => e.pointerType === "mouse" && onPick(i)}>
            <circle cx={n.x} cy={n.y} r="38" fill={on ? "#101440" : "#fff"} stroke={on ? "#101440" : "#d6dde8"} strokeWidth="1.4" style={{ transition: "fill 400ms, stroke 400ms" }} />
            <text x={n.x} y={n.y + 4.5} textAnchor="middle" fontSize="13" fontWeight="600" fill={on ? "#fff" : "#0b1030"} style={{ transition: "fill 400ms" }}>
              {n.name === "Business Context" ? "Context" : n.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Ontology() {
  const reduce = useReduced();
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, "-20% 0px -20% 0px");
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (!inView || reduce || touched) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % AXES.length), 3600);
    return () => clearTimeout(t);
  }, [inView, reduce, touched, active]);
  const pick = (i: number) => {
    setTouched(true);
    setActive(i);
  };

  return (
    <section ref={root} id="ontology" className="bg-[#f4f7fb] py-24 sm:py-32" data-v23-tone="light" data-v23-chapter="Ontology" aria-labelledby="v23-ontology-title">
      <div className="v23-wrap">
        <div className="grid gap-10 lg:grid-cols-12">
          <SectionHead
            n="04"
            id="v23-ontology-title"
            kicker="Our approach"
            title="Data Ontology Intelligence."
            lead="We are not only a data, analytics or AI company. We work where data, analytics, AI, people and business context meet."
            className="lg:col-span-7"
          />
          <p data-v23-rv style={rd(160)} className="max-w-[48ch] self-end text-pretty text-[1rem] leading-[1.7] text-(--tx-2) lg:col-span-5">
            An ontology is a living model of your business: its objects, such as customers, orders, products and suppliers, the relationships between them, and the rules that give them meaning. Every axis works on that same model, so they move in harmony instead of in hand-offs.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-12">
          <div data-v23-rv className="mx-auto w-full max-w-[520px] lg:col-span-6">
            <Model active={active} onPick={pick} />
          </div>
          <ol className="grid border-t border-(--line-2) lg:col-span-6" aria-label="The five axes">
            {AXES.map((a, i) => {
              const on = i === active;
              return (
                <li key={a.name} data-v23-rv style={rd(i * 60)} className="border-b border-(--line-2)">
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    onPointerEnter={(e) => e.pointerType === "mouse" && pick(i)}
                    aria-pressed={on}
                    className="group grid w-full grid-cols-[3.5rem_1fr] items-baseline gap-x-4 py-5 text-left sm:grid-cols-[3.5rem_10rem_1fr]"
                  >
                    <span className={`v23-mono text-[0.75rem] transition-colors ${on ? "text-(--accent-2)" : "text-(--tx-3)"}`}>0{i + 1}</span>
                    <span className={`text-[1.125rem] font-semibold tracking-[-0.015em] transition-colors ${on ? "text-(--tx)" : "text-(--tx-2) group-hover:text-(--tx)"}`}>{a.name}</span>
                    <span className="col-start-2 mt-1 text-[0.9375rem] leading-[1.6] text-(--tx-2) sm:col-start-3 sm:mt-0">
                      <span className="v23-label mr-2 text-(--tx-3)">{a.role}</span>
                      {a.body}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
