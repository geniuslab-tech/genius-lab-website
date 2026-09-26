"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Heading } from "./ui";

const AXES = [
  { name: "Data", role: "The facts", body: "Every system connected and reconciled into one set of trusted records.", color: "#0071e3" },
  { name: "Analytics", role: "The meaning", body: "Metrics and rules defined once, on the business objects themselves.", color: "#30b0c7" },
  { name: "AI", role: "The reasoning", body: "Agents that read the model, answer questions and act on what they find.", color: "#5e5ce6" },
  { name: "People", role: "The judgement", body: "Owners, roles and decisions: who is accountable, who approves, who acts.", color: "#bf5af2" },
  { name: "Business Context", role: "The why", body: "Strategy, processes and rules of the business that give every number its purpose.", color: "#34c759" },
];

const CYCLE_MS = 3600;
const C = 250;
const ORBIT = 78;
const R = 120;
const round = (v: number) => Math.round(v * 10) / 10;
const CIRCLES = AXES.map((a, i) => {
  const ang = -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length;
  return { ...a, x: round(C + Math.cos(ang) * ORBIT), y: round(C + Math.sin(ang) * ORBIT) };
});

/** Five soft, overlapping fields of colour; the ontology is where all five meet. */
function Petals({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  return (
    <svg viewBox="0 0 500 500" className="h-auto w-full" role="img" aria-label="Data, Analytics, AI, People and Business Context overlap. Data Ontology Intelligence sits where all five meet.">
      <defs>
        {CIRCLES.map((c, i) => (
          <radialGradient key={c.name} id={`v5-petal-${i}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={c.color} stopOpacity="0.55" />
            <stop offset="1" stopColor={c.color} stopOpacity="0.12" />
          </radialGradient>
        ))}
      </defs>
      <g style={{ mixBlendMode: "multiply" }}>
        {CIRCLES.map((c, i) => (
          <circle
            key={c.name}
            cx={c.x}
            cy={c.y}
            r={R}
            fill={`url(#v5-petal-${i})`}
            className="cursor-pointer"
            style={{ opacity: i === active ? 1 : 0.45, transition: "opacity 500ms cubic-bezier(0.23,1,0.32,1)" }}
            onPointerEnter={(e) => e.pointerType === "mouse" && onPick(i)}
            onClick={() => onPick(i)}
          />
        ))}
      </g>
      <circle cx={C} cy={C} r="46" fill="white" style={{ filter: "drop-shadow(0 10px 24px rgb(0 0 0 / 0.14))" }} />
      <text x={C} y={C - 4} textAnchor="middle" className="fill-graphite text-[13px] font-semibold">
        Ontology
      </text>
      <text x={C} y={C + 13} textAnchor="middle" className="fill-graphite-2 text-[10.5px]">
        one shared model
      </text>
    </svg>
  );
}

export function OntologyV5() {
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
    <section ref={root} id="ontology" className="scroll-mt-12 bg-mist py-28 sm:py-40" aria-labelledby="v5-ontology-title">
      <div className="mx-auto max-w-[1080px] px-5">
        <Heading
          id="v5-ontology-title"
          eyebrow="Our approach"
          title="Data Ontology Intelligence."
          lead="We are not only a data, analytics or AI company. We work where data, analytics, AI, people and business context meet."
        />
        <p data-reveal="up" data-delay="160" className="v5-body text-pretty mx-auto mt-6 max-w-[46ch] text-center text-[1.0625rem] text-graphite-2">
          An ontology is a living model of your business: its objects, such as customers, orders, products and suppliers,
          the relationships between them, and the rules that give them meaning. Every axis works on that same model, so
          they move in harmony instead of in hand-offs.
        </p>

        <div data-reveal="up" className="mt-16 grid items-center gap-8 rounded-[28px] bg-white p-6 sm:mt-20 sm:p-12 lg:grid-cols-2 lg:gap-14">
          <div className="mx-auto w-full max-w-[440px]">
            <Petals active={active} onPick={pick} />
          </div>
          <ol aria-label="The five axes">
            {AXES.map((a, i) => {
              const on = i === active;
              return (
                <li key={a.name} className="border-b border-hairline last:border-b-0">
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    onPointerEnter={(e) => e.pointerType === "mouse" && pick(i)}
                    aria-expanded={on}
                    className="flex w-full items-start gap-4 py-4 text-left"
                  >
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full transition-transform duration-300" style={{ background: a.color, transform: on ? "scale(1.4)" : "scale(1)" }} aria-hidden="true" />
                    <span className="flex-1">
                      <span className="flex items-baseline justify-between gap-4">
                        <span className={`text-[1.3125rem] font-semibold tracking-[-0.015em] transition-colors ${on ? "text-graphite" : "text-graphite-3"}`}>{a.name}</span>
                        <span className={`text-[0.875rem] transition-colors ${on ? "text-graphite-2" : "text-graphite-3"}`}>{a.role}</span>
                      </span>
                      <span className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)] ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                        <span className="overflow-hidden">
                          <span className="v5-body block pt-2 text-[1.0625rem] text-graphite-2">{a.body}</span>
                        </span>
                      </span>
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
