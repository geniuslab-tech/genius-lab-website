"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { SectionTag, h2v4 } from "./ui";

const AXES = [
  { name: "Data", role: "The facts", body: "Every system connected and reconciled into one set of trusted records." },
  { name: "Analytics", role: "The meaning", body: "Metrics and rules defined once, on the business objects themselves." },
  { name: "AI", role: "The reasoning", body: "Agents that read the model, answer questions and act on what they find." },
  { name: "People", role: "The judgement", body: "Owners, roles and decisions: who is accountable, who approves, who acts." },
  { name: "Business Context", role: "The why", body: "Strategy, processes and rules of the business that give every number its purpose." },
];

const CYCLE_MS = 3600;
const C = 300;
const RING = 200;
const round = (v: number) => Math.round(v * 10) / 10;
const NODES = AXES.map((a, i) => {
  const ang = -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length;
  const cos = Math.cos(ang);
  return {
    ...a,
    x: round(C + cos * RING),
    y: round(C + Math.sin(ang) * RING),
    lx: round(C + cos * 262),
    ly: round(C + Math.sin(ang) * 262),
    anchor: (Math.abs(cos) < 0.2 ? "middle" : cos > 0 ? "start" : "end") as "start" | "middle" | "end",
  };
});
// Every axis is linked to every other: the pentagram of the shared model.
const LINKS: [number, number][] = [];
for (let a = 0; a < NODES.length; a++) for (let b = a + 1; b < NODES.length; b++) LINKS.push([a, b]);

function Graph({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  return (
    <svg viewBox="-110 10 820 600" className="h-auto w-full" role="img" aria-label="Data, Analytics, AI, People and Business Context linked to each other and to Data Ontology Intelligence at the centre.">
      <defs>
        <radialGradient id="v4-onto-core">
          <stop offset="0" stopColor="#5577ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#5577ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={C} cy={C} r="190" fill="url(#v4-onto-core)" />
      {[70, 130, RING].map((r) => (
        <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="white" strokeOpacity="0.07" strokeDasharray={r === RING ? "2 6" : undefined} />
      ))}
      {LINKS.map(([a, b]) => {
        const on = a === active || b === active;
        return (
          <line
            key={`${a}-${b}`}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke={on ? "#6ee7ff" : "white"}
            strokeOpacity={on ? 0.55 : 0.1}
            style={{ transition: "stroke 400ms, stroke-opacity 400ms" }}
          />
        );
      })}
      {NODES.map((n, i) => (
        <line
          key={n.name}
          x1={C}
          y1={C}
          x2={n.x}
          y2={n.y}
          stroke={i === active ? "#6ee7ff" : "#5577ff"}
          strokeOpacity={i === active ? 1 : 0.45}
          strokeWidth={i === active ? 1.8 : 1}
          strokeDasharray="3 5"
          className="motion-safe:animate-[dash-flow_1.2s_linear_infinite]"
          style={{ transition: "stroke 400ms" }}
        />
      ))}
      <g className="origin-center motion-safe:animate-[spin_30s_linear_infinite] [transform-box:fill-box]">
        <circle cx={C} cy={C} r="56" fill="none" stroke="#6ee7ff" strokeOpacity="0.6" strokeDasharray="1 7" strokeWidth="2" />
      </g>
      <rect x={C - 34} y={C - 34} width="68" height="68" transform={`rotate(45 ${C} ${C})`} fill="#05060e" stroke="#6ee7ff" strokeWidth="1.5" />
      <rect x={C - 12} y={C - 12} width="24" height="24" transform={`rotate(45 ${C} ${C})`} fill="#6ee7ff" />

      {NODES.map((n, i) => {
        const on = i === active;
        return (
          <g key={n.name} className="cursor-pointer" onPointerEnter={(e) => e.pointerType === "mouse" && onPick(i)} onClick={() => onPick(i)}>
            <circle cx={n.x} cy={n.y} r="36" fill="transparent" />
            <circle cx={n.x} cy={n.y} r={on ? 26 : 20} fill="#05060e" stroke={on ? "#6ee7ff" : "white"} strokeOpacity={on ? 1 : 0.35} strokeWidth="1.5" style={{ transition: "r 400ms, stroke 400ms" }} />
            <circle cx={n.x} cy={n.y} r={on ? 7 : 4} fill={on ? "#6ee7ff" : "white"} fillOpacity={on ? 1 : 0.6} style={{ transition: "r 400ms" }} />
            <text x={n.lx} y={n.ly - 6 - (n.name.includes(" ") ? 22 : 0)} textAnchor={n.anchor} className={`text-[20px] font-semibold ${on ? "fill-white" : "fill-white/60"}`} style={{ transition: "fill 400ms" }}>
              {n.name.split(" ").map((w, k) => (
                <tspan key={w} x={n.lx} dy={k ? 22 : 0}>
                  {w}
                </tspan>
              ))}
            </text>
            <text x={n.lx} y={n.ly + 16} textAnchor={n.anchor} className={`type-mono text-[12px] uppercase ${on ? "fill-cyan" : "fill-white/30"}`} style={{ transition: "fill 400ms" }}>
              {n.role}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function OntologyV4() {
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
    <section ref={root} id="ontology" className="relative scroll-mt-16 py-24 sm:py-32" aria-labelledby="v4-ontology-title">
      <div className="shell grid items-center gap-12 lg:grid-cols-12">
        <div data-reveal="up" className="order-2 mx-auto w-full max-w-[560px] lg:order-1 lg:col-span-6 lg:max-w-none">
          <Graph active={active} onPick={pick} />
        </div>

        <div className="order-1 lg:order-2 lg:col-span-6">
          <SectionTag n="06">Ontology</SectionTag>
          <h2 id="v4-ontology-title" data-reveal="up" className={`${h2v4} mt-8 max-w-[14ch]`}>
            Data Ontology Intelligence.
          </h2>
          <p data-reveal="up" data-delay="100" className="text-pretty mt-8 max-w-[54ch] text-lg leading-relaxed text-white/75 sm:text-xl sm:leading-relaxed">
            We are not only a data, analytics or AI company. We work where data, analytics, AI, people and business
            context meet.
          </p>
          <p data-reveal="up" data-delay="160" className="text-pretty mt-5 max-w-[54ch] leading-relaxed text-white/55">
            An ontology is a living model of your business: its objects, such as customers, orders, products and
            suppliers, the relationships between them, and the rules that give them meaning. Every axis works on that
            same model, so they move in harmony instead of in hand-offs.
          </p>

          <ol className="mt-10 border-t border-line" aria-label="The five axes">
            {AXES.map((a, i) => {
              const on = i === active;
              return (
                <li key={a.name} className="relative border-b border-line">
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    onPointerEnter={(e) => e.pointerType === "mouse" && pick(i)}
                    aria-expanded={on}
                    className="type-mono grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-3 py-3.5 text-left text-[0.875rem]"
                  >
                    <span className={on ? "text-cyan" : "text-white/30"}>0{i + 1}</span>
                    <span>
                      <span className={`block uppercase tracking-[0.06em] ${on ? "text-white" : "text-white/55"}`}>{a.name}</span>
                      <span className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)] ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                        <span className="overflow-hidden">
                          <span className="block pt-2 font-sans text-[0.9375rem] leading-relaxed text-white/60">{a.body}</span>
                        </span>
                      </span>
                    </span>
                    <span className={`text-[0.75rem] uppercase ${on ? "text-cyan" : "text-white/30"}`}>{a.role}</span>
                  </button>
                  {on && !reduce && !touched && (
                    <span key={`timer-${active}`} className="absolute inset-x-0 -bottom-px block h-px origin-left animate-[topic-timer_3600ms_linear_forwards] bg-cyan" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
