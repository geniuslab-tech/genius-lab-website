"use client";

import { useEffect, useRef, useState } from "react";
import { r1, useInView, useReduced } from "./hooks";
import { SectionHead, rd } from "./ui";

const AXES = [
  { name: "Data", role: "The facts", body: "Every system connected and reconciled into one set of trusted records." },
  { name: "Analytics", role: "The meaning", body: "Metrics and rules defined once, on the business objects themselves." },
  { name: "AI", role: "The reasoning", body: "Agents that read the model, answer questions and act on what they find." },
  { name: "People", role: "The judgement", body: "Owners, roles and decisions: who is accountable, who approves, who acts." },
  { name: "Business Context", role: "The why", body: "Strategy, processes and rules of the business that give every number its purpose." },
];

/** Objects in the living model, orbiting the centre. */
const OBJECTS = ["customers", "orders", "products", "suppliers", "invoices", "contracts"];

const CYCLE_MS = 3800;
const C = 240;
const RING = 176;
const NODES = AXES.map((a, i) => {
  const ang = -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length;
  return { ...a, x: r1(C + Math.cos(ang) * RING), y: r1(C + Math.sin(ang) * RING) };
});
const ORBIT = OBJECTS.map((o, i) => {
  const ang = (i * 2 * Math.PI) / OBJECTS.length + 0.3;
  return { o, x: r1(C + Math.cos(ang) * 98), y: r1(C + Math.sin(ang) * 98) };
});

export function OntologyV19() {
  const reduce = useReduced();
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, "-25% 0px");
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
    <section ref={root} id="ontology" className="relative isolate scroll-mt-16 overflow-hidden border-t border-[color:var(--line)] py-24 sm:py-32" aria-labelledby="v19-ontology-title">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_45%_60%_at_78%_45%,#0d1640_0%,transparent_70%)]" aria-hidden="true" />
      <div className="v19-wrap">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <SectionHead
              n="05"
              id="v19-ontology-title"
              kicker="Our approach"
              title="Data Ontology Intelligence."
              lead="We are not only a data, analytics or AI company. We work where data, analytics, AI, people and business context meet."
            />
            <p className="v19-rv mt-5 max-w-[56ch] leading-[1.75] text-[color:var(--tx-2)]" style={rd(180)}>
              An ontology is a living model of your business: its objects, such as customers, orders, products and
              suppliers, the relationships between them, and the rules that give them meaning. Every axis works on that
              same model, so they move in harmony instead of in hand-offs.
            </p>
          </div>

          <div className="v19-rv mx-auto w-full max-w-[480px] lg:col-span-6" style={rd(120)}>
            <svg viewBox="0 0 480 480" className="h-auto w-full overflow-visible" role="img" aria-label="Data, Analytics, AI, People and Business Context, each connected to one shared ontology at the centre.">
              <defs>
                <radialGradient id="v19-onto">
                  <stop offset="0" stopColor="#5b8cff" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#5b8cff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx={C} cy={C} r="150" fill="url(#v19-onto)" />
              <circle cx={C} cy={C} r={RING} fill="none" stroke="rgb(150 170 255 / 0.12)" strokeDasharray="2 6" />
              {NODES.map((n, i) => (
                <line
                  key={n.name}
                  x1={C}
                  y1={C}
                  x2={n.x}
                  y2={n.y}
                  stroke={i === active ? "#5b8cff" : "rgb(150 170 255 / 0.3)"}
                  strokeWidth={i === active ? 1.8 : 1}
                  strokeDasharray={i === active ? undefined : "2 5"}
                  style={{ transition: "stroke 400ms" }}
                />
              ))}
              <g className="v19-orbit">
                <circle cx={C} cy={C} r="98" fill="none" stroke="rgb(91 140 255 / 0.35)" />
                {ORBIT.map((o) => (
                  <g key={o.o}>
                    <circle cx={o.x} cy={o.y} r="3" fill="#a9c3ff" />
                    <text x={o.x} y={o.y - 8} textAnchor="middle" fontSize="9.5" className="v19-mono" fill="rgb(222 228 247 / 0.55)">
                      {o.o}
                    </text>
                  </g>
                ))}
              </g>
              <path d={`M${C - 30} ${C - 52}h60l30 52-30 52h-60l-30-52z`} fill="#0b1133" stroke="#5b8cff" strokeWidth="1.5" />
              <text x={C} y={C - 2} textAnchor="middle" fontSize="13" fontWeight="600" fill="#eef1fa">
                Ontology
              </text>
              <text x={C} y={C + 14} textAnchor="middle" fontSize="8.5" letterSpacing="1.2" className="v19-mono" fill="#a9c3ff">
                SHARED MODEL
              </text>
              {NODES.map((n, i) => {
                const on = i === active;
                return (
                  <g key={n.name} className="cursor-pointer" onPointerEnter={(e) => e.pointerType === "mouse" && pick(i)} onClick={() => pick(i)}>
                    {on && <circle cx={n.x} cy={n.y} r="44" fill="#5b8cff" fillOpacity="0.12" />}
                    <circle cx={n.x} cy={n.y} r="34" fill={on ? "#101a4a" : "#0b0f24"} stroke={on ? "#5b8cff" : "rgb(150 170 255 / 0.3)"} strokeWidth="1.5" style={{ transition: "fill 400ms, stroke 400ms" }} />
                    <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill={on ? "#ffffff" : "#eef1fa"} style={{ transition: "fill 400ms" }}>
                      {n.name === "Business Context" ? "Context" : n.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <ol className="mt-14 grid border-y border-[color:var(--line)] sm:grid-cols-2 lg:grid-cols-5" aria-label="The five axes">
          {AXES.map((a, i) => {
            const on = i === active;
            return (
              <li key={a.name} className="v19-rv border-[color:var(--line)] max-lg:border-b max-lg:last:border-b-0 sm:max-lg:odd:border-r lg:[&:not(:last-child)]:border-r" style={rd(i * 60)}>
                <button
                  type="button"
                  onClick={() => pick(i)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && pick(i)}
                  aria-pressed={on}
                  className="relative flex h-full w-full flex-col items-start px-1 py-6 text-left sm:px-5"
                >
                  <span className={`absolute inset-x-0 top-[-1px] h-px origin-left transition-transform duration-700 ease-[var(--ease)] ${on ? "scale-x-100" : "scale-x-0"} bg-[color:var(--acc)]`} aria-hidden="true" />
                  <span className={`v19-label transition-colors ${on ? "text-[color:var(--acc-2)]" : "text-[color:var(--tx-3)]"}`}>{a.role}</span>
                  <span className="mt-3 text-[1.125rem] font-semibold tracking-[-0.02em] text-white">{a.name}</span>
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
