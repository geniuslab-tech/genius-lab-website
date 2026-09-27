"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { Slate, usePin, useStill } from "./shared";

const AXES = [
  { name: "Data", role: "The facts", body: "Every system connected and reconciled into one set of trusted records." },
  { name: "Analytics", role: "The meaning", body: "Metrics and rules defined once, on the business objects themselves." },
  { name: "AI", role: "The reasoning", body: "Agents that read the model, answer questions and act on what they find." },
  { name: "People", role: "The judgement", body: "Owners, roles and decisions: who is accountable, who approves, who acts." },
  { name: "Business Context", role: "The why", body: "Strategy, processes and rules of the business that give every number its purpose." },
];

const LEAD = "We are not only a data, analytics or AI company. We work where data, analytics, AI, people and business context meet.";
const DETAIL =
  "An ontology is a living model of your business: its objects, such as customers, orders, products and suppliers, the relationships between them, and the rules that give them meaning. Every axis works on that same model, so they move in harmony instead of in hand-offs.";

const STEP = 360 / AXES.length;

function Node({ i, rot, active }: { i: number; rot: MotionValue<number>; active: boolean }) {
  const counter = useTransform(rot, (v) => -v - i * STEP);
  const a = AXES[i];
  return (
    <div className="absolute inset-0" style={{ transform: `rotate(${i * STEP}deg)` }}>
      <motion.div
        className={`absolute left-1/2 top-0 grid h-[4.5rem] w-[4.5rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-center transition-colors duration-500 sm:h-24 sm:w-24 ${
          active ? "border-(--v9-ice) bg-(--v9-ice) text-(--v9-ink)" : "border-white/20 bg-(--v9-ink) text-white"
        }`}
        style={{ rotate: counter }}
      >
        <span className="v9-display px-1 text-[0.95rem] leading-[0.95] sm:text-[1.2rem]">{a.name === "Business Context" ? "Context" : a.name}</span>
      </motion.div>
    </div>
  );
}

function Heading() {
  return (
    <>
      <Slate sc="06">Our approach</Slate>
      <h2 id="v9-ontology-title" className="v9-display mt-5 text-[clamp(2.1rem,min(5.4vw,9svh),5rem)]">
        Data Ontology Intelligence.
      </h2>
      <p className="text-pretty mt-4 max-w-[54ch] text-[0.9375rem] leading-[1.6] text-white sm:text-[1.0625rem]">{LEAD}</p>
    </>
  );
}

export function OntologyV9() {
  const still = useStill();
  const ref = useRef<HTMLElement>(null);
  const p = usePin(ref);
  const [active, setActive] = useState(0);

  // The ring turns one axis at a time, holding each at the top.
  const rot = useTransform(p, [0, 0.14, 0.22, 0.34, 0.42, 0.54, 0.62, 0.74, 0.82, 1], [0, 0, -STEP, -STEP, -2 * STEP, -2 * STEP, -3 * STEP, -3 * STEP, -4 * STEP, -4 * STEP]);
  useMotionValueEvent(rot, "change", (v) => setActive(Math.min(AXES.length - 1, Math.max(0, Math.round(-v / STEP)))));

  if (still) {
    return (
      <section id="ontology" data-scene="SC 06 · Ontology" className="scroll-mt-12 bg-(--v9-ink) py-24" aria-labelledby="v9-ontology-title">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <Heading />
          <p className="text-pretty mt-4 max-w-[60ch] leading-[1.7] text-(--v9-fog)">{DETAIL}</p>
          <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {AXES.map((a) => (
              <li key={a.name} className="border border-white/12 p-5">
                <p className="v9-tc text-(--v9-ice)">{a.role}</p>
                <h3 className="v9-display mt-2 text-[1.75rem]">{a.name}</h3>
                <p className="mt-2 text-[0.9375rem] leading-[1.6] text-(--v9-fog)">{a.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  const a = AXES[active];
  return (
    <>
    <section ref={ref} id="ontology" data-scene="SC 06 · Ontology" className="relative h-[420svh] bg-(--v9-ink)" aria-labelledby="v9-ontology-title">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="mx-auto grid h-full max-w-[1440px] content-start gap-6 px-4 pb-12 pt-16 sm:px-8 sm:pb-14 sm:pt-20 md:grid-cols-12 md:content-center md:gap-10">
          <div className="md:col-span-6">
            <Heading />
            <p className="text-pretty mt-4 hidden max-w-[58ch] leading-[1.65] text-(--v9-fog) lg:block">{DETAIL}</p>
            <div key={a.name} className="v9-swap mt-6 border-l-2 border-(--v9-ice) pl-4" aria-live="polite">
              <p className="v9-tc text-(--v9-ice)">
                0{active + 1}/05 · {a.role}
              </p>
              <p className="v9-display mt-1 text-[1.75rem] sm:text-[2.25rem]">{a.name}</p>
              <p className="mt-1 max-w-[46ch] text-[0.9375rem] leading-[1.6] text-(--v9-fog)">{a.body}</p>
            </div>
          </div>
          <div className="md:col-span-6">
            <div className="relative mx-auto aspect-square w-[min(68vw,30svh)] md:w-[min(34vw,58svh)]">
              <motion.div className="absolute inset-0 rounded-full border border-dashed border-white/15" style={{ rotate: rot }}>
                {AXES.map((x, i) => (
                  <Node key={x.name} i={i} rot={rot} active={i === active} />
                ))}
              </motion.div>
              <div className="absolute inset-[30%] grid place-items-center rounded-full bg-(--v9-navy) text-center ring-1 ring-(--v9-ice)/40">
                <span>
                  <span className="v9-display block text-[1.1rem] sm:text-[1.5rem]">Ontology</span>
                  <span className="v9-tc block text-[0.5625rem] text-(--v9-dim)">Shared model</span>
                </span>
              </div>
              <span className="absolute left-1/2 top-[-14%] h-[10%] w-px -translate-x-1/2 bg-(--v9-ice)" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* The full description, for small screens where the frame has no room for it. */}
    <div className="bg-(--v9-ink) px-4 pb-16 sm:px-8 lg:hidden">
      <p className="text-pretty max-w-[60ch] border-l border-(--v9-rule) pl-4 leading-[1.7] text-(--v9-fog)">{DETAIL}</p>
    </div>
    </>
  );
}
