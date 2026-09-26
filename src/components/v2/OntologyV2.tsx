"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { h2Class } from "./ui";

/** The five axes that meet in the ontology. */
const AXES = [
  { name: "Data", role: "The facts", body: "Every system connected and reconciled into one set of trusted records." },
  { name: "Analytics", role: "The meaning", body: "Metrics and rules defined once, on the business objects themselves." },
  { name: "AI", role: "The reasoning", body: "Agents that read the model, answer questions and act on what they find." },
  { name: "People", role: "The judgement", body: "Owners, roles and decisions: who is accountable, who approves, who acts." },
  { name: "Business Context", role: "The why", body: "Strategy, processes and rules of the business that give every number its purpose." },
];

const CYCLE_MS = 3600;
const C = 260;
const ORBIT = 92;
const R = 118;

const round = (v: number) => Math.round(v * 10) / 10;
const CIRCLES = AXES.map((a, i) => {
  const ang = -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length;
  return {
    ...a,
    x: round(C + Math.cos(ang) * ORBIT),
    y: round(C + Math.sin(ang) * ORBIT),
    lx: round(C + Math.cos(ang) * 222),
    ly: round(C + Math.sin(ang) * 222),
    anchor: Math.abs(Math.cos(ang)) < 0.2 ? "middle" : Math.cos(ang) > 0 ? "start" : "end",
  };
});

/** Five overlapping axes; the ontology is the space all five share. */
function Flower({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  return (
    <svg viewBox="-110 -10 740 540" className="h-auto w-full" role="img" aria-label="Data, Analytics, AI, People and Business Context overlap. Data Ontology Intelligence sits where all five meet.">
      <defs>
        <radialGradient id="onto-core">
          <stop offset="0" stopColor="#2f4fe0" stopOpacity="0.3" />
          <stop offset="1" stopColor="#2f4fe0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={C} cy={C} r="150" fill="url(#onto-core)" />
      {CIRCLES.map((c, i) => {
        const on = i === active;
        return (
          <g key={c.name} className="cursor-pointer" onPointerEnter={(e) => e.pointerType === "mouse" && onPick(i)} onClick={() => onPick(i)}>
            <circle
              cx={c.x}
              cy={c.y}
              r={R}
              fill={on ? "#2f4fe0" : "#101440"}
              fillOpacity={on ? 0.1 : 0.035}
              stroke={on ? "#2f4fe0" : "#101440"}
              strokeOpacity={on ? 0.95 : 0.3}
              strokeWidth={on ? 2 : 1.2}
              style={{ transition: "fill 400ms, fill-opacity 400ms, stroke 400ms, stroke-opacity 400ms" }}
            />
            <text
              x={c.lx}
              y={c.ly + 5}
              textAnchor={c.anchor as "start" | "middle" | "end"}
              className={`text-[21px] font-semibold ${on ? "fill-signal-ink" : "fill-navy"}`}
              style={{ transition: "fill 400ms" }}
            >
              {c.name.split(" ").map((w, k, all) => (
                <tspan key={w} x={c.lx} dy={k === 0 ? (all.length > 1 ? -11 : 0) : 25}>
                  {w}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
      {/* The ontology at the centre. */}
      <g className="origin-center motion-safe:animate-[spin_24s_linear_infinite] [transform-box:fill-box]">
        <circle cx={C} cy={C} r="44" fill="none" stroke="#2f4fe0" strokeDasharray="3 6" />
      </g>
      {CIRCLES.map((c, i) => (
        <line
          key={c.name}
          x1={C}
          y1={C}
          x2={round(C + (c.x - C) * 0.42)}
          y2={round(C + (c.y - C) * 0.42)}
          stroke={i === active ? "#2f4fe0" : "#101440"}
          strokeOpacity={i === active ? 0.9 : 0.25}
          strokeWidth="1.4"
          style={{ transition: "stroke 400ms" }}
        />
      ))}
      <circle cx={C} cy={C} r="28" fill="#101440" />
      <circle cx={C} cy={C} r="8" fill="white" />
    </svg>
  );
}

export function OntologyV2() {
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

  // The axes take turns until the reader picks one.
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
    <section ref={root} id="ontology" className="relative scroll-mt-16 py-24 text-navy sm:py-32 lg:py-40" aria-labelledby="v2-ontology-title">
      <div className="shell grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <h2 id="v2-ontology-title" data-reveal="up" className={`${h2Class} max-w-[14ch]`}>
            Data Ontology Intelligence.
          </h2>
          <p data-reveal="up" data-delay="100" className="text-pretty mt-8 max-w-[56ch] text-lg leading-relaxed text-navy/75 sm:text-xl sm:leading-relaxed">
            We are not only a data, analytics or AI company. We work where data, analytics, AI, people and business
            context meet.
          </p>
          <p data-reveal="up" data-delay="160" className="text-pretty mt-5 max-w-[56ch] leading-relaxed text-navy/65">
            An ontology is a living model of your business: its objects, such as customers, orders, products and
            suppliers, the relationships between them, and the rules that give them meaning. Every axis works on that
            same model, so they move in harmony instead of in hand-offs.
          </p>

          <ol className="mt-10 border-t border-navy/12" aria-label="The five axes">
            {AXES.map((a, i) => {
              const on = i === active;
              return (
                <li key={a.name} className="relative border-b border-navy/12">
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    onPointerEnter={(e) => e.pointerType === "mouse" && pick(i)}
                    aria-expanded={on}
                    className="group grid w-full grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-3 py-4 text-left"
                  >
                    <span className={`type-mono text-[0.8125rem] transition-colors ${on ? "text-signal-ink" : "text-navy/40"}`}>0{i + 1}</span>
                    <span>
                      <span className={`type-wide block text-[1.1875rem] font-medium transition-colors ${on ? "text-navy" : "text-navy/60 group-hover:text-navy"}`}>
                        {a.name}
                      </span>
                      <span
                        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)] ${
                          on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <span className="overflow-hidden">
                          <span className="block pt-1.5 leading-relaxed text-navy/65">{a.body}</span>
                        </span>
                      </span>
                    </span>
                    <span className={`type-mono text-[0.75rem] transition-colors ${on ? "text-signal-ink" : "text-navy/40"}`}>{a.role}</span>
                  </button>
                  {on && !reduce && !touched && (
                    <span
                      key={`timer-${active}`}
                      className="absolute inset-x-0 -bottom-px block h-px origin-left animate-[topic-timer_3600ms_linear_forwards] bg-signal-ink"
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div data-reveal="up" data-delay="120" className="mx-auto w-full max-w-[520px] lg:col-span-6 lg:max-w-none">
          <Flower active={active} onPick={pick} />
        </div>
      </div>
    </section>
  );
}
