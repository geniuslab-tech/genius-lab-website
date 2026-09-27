"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { r1 } from "./geo";
import { Rise, SectionHead, SPRING, useReduced, type Tint } from "./ui";

const AXES: { name: string; role: string; body: string; tint: Tint }[] = [
  { name: "Data", role: "The facts", body: "Every system connected and reconciled into one set of trusted records.", tint: "sky" },
  { name: "Analytics", role: "The meaning", body: "Metrics and rules defined once, on the business objects themselves.", tint: "sage" },
  { name: "AI", role: "The reasoning", body: "Agents that read the model, answer questions and act on what they find.", tint: "ochre" },
  { name: "People", role: "The judgement", body: "Owners, roles and decisions: who is accountable, who approves, who acts.", tint: "terra" },
  {
    name: "Business Context",
    role: "The why",
    body: "Strategy, processes and rules of the business that give every number its purpose.",
    tint: "sky",
  },
];

const C = 250;
const PETALS = AXES.map((a, i) => {
  const ang = -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length;
  return {
    ...a,
    x: r1(C + Math.cos(ang) * 88),
    y: r1(C + Math.sin(ang) * 88),
    lx: r1(C + Math.cos(ang) * 168),
    ly: r1(C + Math.sin(ang) * 168),
  };
});

const CYCLE_MS = 3800;

/** Five overlapping circles, flat tints multiplied where they meet; the shared model sits in the overlap. */
function Flower({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  return (
    <svg
      viewBox="0 0 500 500"
      className="mx-auto h-auto w-full max-w-[32rem]"
      role="img"
      aria-label="Data, Analytics, AI, People and Business Context drawn as five overlapping circles. Where they all meet sits the ontology, the shared model."
    >
      {PETALS.map((p, i) => (
        <motion.circle
          key={p.name}
          cx={p.x}
          cy={p.y}
          r={112}
          fill={`var(--${p.tint}-mid)`}
          fillOpacity={i === active ? 0.85 : 0.45}
          stroke="var(--ink)"
          strokeWidth={i === active ? 2 : 0.8}
          style={{ mixBlendMode: "multiply", transition: "fill-opacity 400ms, stroke-width 400ms", cursor: "pointer" }}
          initial={{ scale: 0.4, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...SPRING, delay: 0.1 + i * 0.1 }}
          onPointerEnter={(e) => e.pointerType === "mouse" && onPick(i)}
          onClick={() => onPick(i)}
        />
      ))}
      <circle cx={C} cy={C} r={50} fill="var(--ink)" />
      <text x={C} y={C - 2} textAnchor="middle" fill="var(--cream)" fontSize="17" className="v17-hand">
        Ontology
      </text>
      <text x={C} y={C + 17} textAnchor="middle" fill="var(--cream)" fontSize="11" opacity={0.8}>
        shared model
      </text>
      {PETALS.map((p, i) => (
        <text
          key={p.name}
          x={p.lx}
          y={p.ly + 6}
          textAnchor="middle"
          fill="var(--ink)"
          fontSize="19"
          fontWeight={i === active ? 700 : 500}
          pointerEvents="none"
        >
          {p.name === "Business Context" ? "Context" : p.name}
        </text>
      ))}
    </svg>
  );
}

export function Ontology17() {
  const reduce = useReduced();
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
    <section ref={root} id="ontology" className="scroll-mt-20 py-24 sm:py-32" aria-labelledby="v17-ontology-title">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-6">
            <SectionHead
              id="v17-ontology-title"
              label="Our approach"
              tint="ochre"
              title={
                <>
                  Data Ontology <em>Intelligence</em>.
                </>
              }
              lead="We are not only a data, analytics or AI company. We work where data, analytics, AI, people and business context meet."
            />
            <Rise delay={0.12}>
              <p className="mt-5 max-w-[56ch] text-pretty leading-[1.7] text-[var(--ink-2)]">
                An ontology is a living model of your business: its objects, such as customers, orders, products and suppliers, the
                relationships between them, and the rules that give them meaning. Every axis works on that same model, so they move
                in harmony instead of in hand-offs.
              </p>
            </Rise>
          </div>
          <div className="lg:col-span-6">
            <Flower active={active} onPick={pick} />
          </div>
        </div>

        <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label="The five axes">
          {AXES.map((a, i) => {
            const on = i === active;
            return (
              <li key={a.name}>
                <motion.button
                  type="button"
                  onClick={() => pick(i)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && pick(i)}
                  aria-pressed={on}
                  animate={{ y: on ? -4 : 0 }}
                  transition={SPRING}
                  className={`flex h-full w-full flex-col items-start rounded-[1.5rem] p-5 text-left transition-[background-color,box-shadow] duration-300 ${
                    on ? `v17-tint-${a.tint} shadow-[inset_0_0_0_1.5px_var(--ink)]` : "bg-[var(--paper)] shadow-[inset_0_0_0_1px_var(--rule)]"
                  }`}
                >
                  <span className="v17-hand text-[1rem] text-[var(--ink-2)]">{a.role}</span>
                  <span className="v17-display mt-1 text-[1.5rem]">{a.name}</span>
                  <span className="mt-2 text-[0.9375rem] leading-[1.55] text-[var(--ink-2)]">{a.body}</span>
                </motion.button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
