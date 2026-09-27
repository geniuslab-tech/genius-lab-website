"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Caption, Opener, Rule, Up, shell } from "./type";

const AXES = [
  { name: "Data", role: "The facts", body: "Every system connected and reconciled into one set of trusted records." },
  { name: "Analytics", role: "The meaning", body: "Metrics and rules defined once, on the business objects themselves." },
  { name: "AI", role: "The reasoning", body: "Agents that read the model, answer questions and act on what they find." },
  { name: "People", role: "The judgement", body: "Owners, roles and decisions: who is accountable, who approves, who acts." },
  { name: "Business Context", role: "The why", body: "Strategy, processes and rules of the business that give every number its purpose." },
];

const C = 250;
const R = 170;
const round = (v: number) => Math.round(v * 10) / 10;
const pt = (i: number, rad: number) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length;
  return { x: round(C + Math.cos(a) * rad), y: round(C + Math.sin(a) * rad) };
};
const ring = (rad: number) => AXES.map((_, i) => pt(i, rad)).map((p) => `${p.x},${p.y}`).join(" ");
const NODES = AXES.map((a, i) => ({ ...a, ...pt(i, R), lx: pt(i, R + 30).x, ly: pt(i, R + 30).y }));
const CYCLE_MS = 3800;

function Pentagon({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  return (
    <svg viewBox="-110 -10 720 520" className="plate block h-auto w-full" aria-hidden="true">
      {[1, 0.75, 0.5].map((k) => (
        <polygon key={k} points={ring(R * k)} fill="none" stroke={k === 1 ? "var(--ink)" : "var(--rule)"} strokeWidth={k === 1 ? 1 : 0.8} />
      ))}
      {NODES.map((n, i) => (
        <line key={n.name} x1={C} y1={C} x2={n.x} y2={n.y} className="g-edge" stroke={i === active ? "var(--red)" : "var(--ink)"} strokeOpacity={i === active ? 1 : 0.3} strokeWidth={i === active ? 2 : 0.8} />
      ))}
      <circle cx={C} cy={C} r={54} fill="var(--ink)" />
      <text x={C} y={C + 2} textAnchor="middle" fontSize="24" fontStyle="italic" className="serif" fill="var(--paper)">
        Ontology
      </text>
      <text x={C} y={C + 20} textAnchor="middle" fontSize="8.5" letterSpacing="1.6" fontWeight="600" fill="var(--paper)" fillOpacity="0.6">
        SHARED MODEL
      </text>
      {NODES.map((n, i) => {
        const on = i === active;
        const anchor = Math.abs(n.lx - C) < 10 ? "middle" : n.lx > C ? "start" : "end";
        return (
          <g key={n.name} className="g-node cursor-pointer" onClick={() => onPick(i)} onPointerEnter={(e) => e.pointerType === "mouse" && onPick(i)}>
            <circle cx={n.x} cy={n.y} r={on ? 9 : 6} fill={on ? "var(--red)" : "var(--paper)"} stroke={on ? "var(--red)" : "var(--ink)"} strokeWidth={1.3} />
            <text x={n.lx} y={n.ly - (i === 0 ? 8 : 0)} textAnchor={anchor} fontSize="22" className="serif" fill="var(--ink)">
              {n.name}
            </text>
            <text x={n.lx} y={n.ly + 14 - (i === 0 ? 8 : 0)} textAnchor={anchor} fontSize="10.5" fill={on ? "var(--red)" : "var(--ink-3)"} fontStyle="italic" style={{ transition: "fill 400ms" }}>
              {n.role}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Ontology() {
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
    <section ref={root} id="ontology" data-chapter="ontology" className="scroll-mt-[var(--head-h)] border-t border-[color:var(--rule)] bg-[color:var(--paper-2)]/60 py-20 sm:py-28" aria-labelledby="v8-ontology-title">
      <div className={shell}>
        <Opener numeral="VI" kicker="Our approach" title="Data Ontology *Intelligence.*" titleId="v8-ontology-title" folio="44">
          <Up delay={250}>
            <p className="f-text mt-8 max-w-[50ch] text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.4]">
              We are not only a data, analytics or AI company. We work where data, analytics, AI, people and business context
              meet.
            </p>
          </Up>
        </Opener>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Rule />
            <Up className="body-copy mt-6">
              <p className="dropcap">
                An ontology is a living model of your business: its objects, such as customers, orders, products and suppliers,
                the relationships between them, and the rules that give them meaning. Every axis works on that same model, so
                they move in harmony instead of in hand-offs.
              </p>
            </Up>

            <ol className="mt-10 border-t border-[color:var(--ink)]" aria-label="The five axes">
              {AXES.map((a, i) => {
                const on = i === active;
                return (
                  <li key={a.name} className="border-b border-[color:var(--rule)]">
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => pick(i)}
                      onPointerEnter={(e) => e.pointerType === "mouse" && pick(i)}
                      className="grid w-full grid-cols-[2rem_1fr] gap-x-3 py-4 text-left sm:grid-cols-[2rem_11rem_1fr]"
                    >
                      <span className={`smallcaps pt-1.5 ${on ? "text-[color:var(--red)]" : "text-[color:var(--ink-3)]"}`}>0{i + 1}</span>
                      <span>
                        <span className={`f-display block text-[1.625rem] leading-none transition-colors ${on ? "text-[color:var(--ink)]" : "text-[color:var(--ink-3)]"}`}>{a.name}</span>
                        <span className="f-text mt-1 block text-[0.9375rem] italic text-[color:var(--ink-3)]">{a.role}</span>
                      </span>
                      <span className={`body-copy col-start-2 mt-2 !text-[1rem] transition-colors sm:col-start-auto sm:mt-0 ${on ? "" : "!text-[color:var(--ink-3)]"}`}>{a.body}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <figure className="lg:col-span-6">
            <div className="mx-auto max-w-[620px] py-6">
              <Pentagon active={active} onPick={pick} />
            </div>
            <p className="sr-only" aria-live="polite">
              {AXES[active].name}, {AXES[active].role}: {AXES[active].body}
            </p>
            <Caption fig="Fig. 4">
              Five axes on one ring, each wired to the shared model at the centre. Data, Analytics, AI, People and Business
              Context work on the same ontology.
            </Caption>
          </figure>
        </div>
      </div>
    </section>
  );
}
