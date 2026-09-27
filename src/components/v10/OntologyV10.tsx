"use client";

import { useState } from "react";
import { Chapter, Exhibit } from "./ui";

const AXES = [
  { name: "Data", role: "The facts", body: "Every system connected and reconciled into one set of trusted records." },
  { name: "Analytics", role: "The meaning", body: "Metrics and rules defined once, on the business objects themselves." },
  { name: "AI", role: "The reasoning", body: "Agents that read the model, answer questions and act on what they find." },
  { name: "People", role: "The judgement", body: "Owners, roles and decisions: who is accountable, who approves, who acts." },
  { name: "Business Context", role: "The why", body: "Strategy, processes and rules of the business that give every number its purpose." },
];

const CX = 300;
const CY = 232;
const RING = 150;
const LABEL = 172;
const r1 = (v: number) => Math.round(v * 10) / 10;
const NODES = AXES.map((a, i) => {
  const ang = -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length;
  const cos = Math.cos(ang);
  const sin = Math.sin(ang);
  return {
    ...a,
    x: r1(CX + cos * RING),
    y: r1(CY + sin * RING),
    lx: r1(CX + cos * LABEL),
    ly: r1(CY + sin * LABEL + (sin > 0.5 ? 14 : sin < -0.5 ? -6 : 4)),
    anchor: (Math.abs(cos) < 0.2 ? "middle" : cos > 0 ? "start" : "end") as "middle" | "start" | "end",
  };
});

/** Five axes on one ring, each wired to the shared model at the centre. */
function Model({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  return (
    <svg viewBox="0 0 600 464" className="h-auto w-full" role="img" aria-label="Data, Analytics, AI, People and Business Context, each connected to one shared ontology at the centre.">
      <circle cx={CX} cy={CY} r={RING} fill="none" stroke="#d6cfbe" strokeWidth="1" className="draw-path" pathLength={1} style={{ ["--i" as string]: 0 }} />
      {NODES.map((n, i) => (
        <line
          key={`l-${n.name}`}
          x1={CX}
          y1={CY}
          x2={n.x}
          y2={n.y}
          pathLength={1}
          className="draw-path"
          stroke={i === active ? "#7a5d32" : "#101440"}
          strokeWidth={i === active ? 2 : 1}
          style={{ ["--i" as string]: i + 1, transition: "stroke 300ms, stroke-width 300ms, stroke-dashoffset 1300ms cubic-bezier(0.2,0.7,0.1,1) calc(var(--i) * 140ms + 200ms)" }}
        />
      ))}
      <circle cx={CX} cy={CY} r="62" fill="#101440" />
      <text x={CX} y={CY - 4} textAnchor="middle" fill="#ffffff" style={{ font: "400 17px var(--font-v10-serif), Georgia, serif" }}>
        Ontology
      </text>
      <text x={CX} y={CY + 16} textAnchor="middle" fill="#c4a26a" style={{ font: "500 9px var(--font-v10-sans), sans-serif", letterSpacing: "0.14em" }}>
        SHARED MODEL
      </text>
      {NODES.map((n, i) => {
        const on = i === active;
        return (
          <g key={n.name} className="cursor-pointer" onClick={() => onPick(i)} onPointerEnter={(e) => e.pointerType === "mouse" && onPick(i)}>
            <circle cx={n.x} cy={n.y} r="22" fill="transparent" />
            <rect
              x={r1(n.x - 7)}
              y={r1(n.y - 7)}
              width="14"
              height="14"
              fill={on ? "#7a5d32" : "#f6f3ea"}
              stroke={on ? "#7a5d32" : "#101440"}
              strokeWidth="1.5"
              style={{ transition: "fill 300ms, stroke 300ms" }}
            />
            <text
              x={n.lx}
              y={n.ly}
              textAnchor={n.anchor}
              fill={on ? "#7a5d32" : "#101440"}
              style={{ font: "500 15px var(--font-v10-sans), sans-serif", transition: "fill 300ms" }}
            >
              {n.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function OntologyV10() {
  const [active, setActive] = useState(0);
  const a = AXES[active];

  return (
    <Chapter
      id="ontology"
      n="04"
      label="Our approach"
      title="Data Ontology Intelligence."
      lead="We are not only a data, analytics or AI company. We work where data, analytics, AI, people and business context meet."
      note={<>An ontology names the objects of a business, the relationships between them and the rules that give them meaning.</>}
    >
      <p data-reveal="up" className="text-pretty mt-8 max-w-[64ch] text-[1.0625rem] leading-[1.75] text-[color:var(--slate)]">
        An ontology is a living model of your business: its objects, such as customers, orders, products and suppliers, the
        relationships between them, and the rules that give them meaning. Every axis works on that same model, so they move
        in harmony instead of in hand-offs.
      </p>

      <Exhibit
        n={5}
        className="mt-14"
        title="Five axes, one shared model of the business"
        source="Genius Lab. Schematic. Select an axis to read its role."
      >
        <div className="grid items-center gap-10 lg:grid-cols-10 lg:gap-6">
          <div className="mx-auto w-full max-w-[560px] lg:col-span-6">
            <Model active={active} onPick={setActive} />
          </div>

          <div className="lg:col-span-4">
            <ol className="border-t border-[color:var(--rule)]" aria-label="The five axes">
              {AXES.map((x, i) => {
                const on = i === active;
                return (
                  <li key={x.name} className="border-b border-[color:var(--rule)]">
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-pressed={on}
                      className="grid w-full grid-cols-[2rem_1fr_auto] items-baseline gap-2 py-3 text-left"
                    >
                      <span className={`tnum text-[0.8125rem] ${on ? "text-[color:var(--brass)]" : "text-[color:var(--slate-2)]"}`}>0{i + 1}</span>
                      <span className={`serif text-[1.25rem] ${on ? "text-[color:var(--ink)]" : "text-[color:var(--slate)]"}`}>{x.name}</span>
                      <span className="caps text-[color:var(--slate)]">{x.role}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 min-h-[7.5rem] border-l-2 border-[color:var(--brass)] pl-5" aria-live="polite">
              <p className="caps text-[color:var(--brass)]">{a.role}</p>
              <p key={a.name} className="enter mt-2 text-[1.0625rem] leading-[1.65] text-[color:var(--ink)] [--d:-120ms]">
                {a.body}
              </p>
            </div>
          </div>
        </div>
      </Exhibit>
    </Chapter>
  );
}
