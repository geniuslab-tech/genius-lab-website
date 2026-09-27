"use client";

import { useState } from "react";
import { axialToPixel, hexPoints, hexRing } from "@/lib/hex";
import { Kicker, ROMAN, d, r1 } from "./ui";

const AXES = [
  { name: "Data", short: "Data", role: "The facts", body: "Every system connected and reconciled into one set of trusted records." },
  { name: "Analytics", short: "Analytics", role: "The meaning", body: "Metrics and rules defined once, on the business objects themselves." },
  { name: "AI", short: "AI", role: "The reasoning", body: "Agents that read the model, answer questions and act on what they find." },
  { name: "People", short: "People", role: "The judgement", body: "Owners, roles and decisions: who is accountable, who approves, who acts." },
  { name: "Business Context", short: "Context", role: "The why", body: "Strategy, processes and rules of the business that give every number its purpose." },
];

const SIZE = 34;
const CX = 210;
const CY = 200;
const GOLD = "#d8c29d";

/** A fine honeycomb, three rings deep. */
const LATTICE = [0, 1, 2, 3].flatMap((n) =>
  hexRing(n).map(([q, r]) => {
    const p = axialToPixel(q, r, SIZE);
    return { key: `${q},${r}`, pts: hexPoints(CX + p.x, CY + p.y, SIZE - 1.5), ring: n };
  }),
);

/** The five axes sit on the second ring, spaced as evenly as twelve cells allow. */
const RING2 = hexRing(2);
const SLOTS = [9, 0, 2, 5, 7];
const PLACED = AXES.map((a, i) => {
  const [q, r] = RING2[SLOTS[i]];
  const p = axialToPixel(q, r, SIZE);
  return { ...a, x: r1(CX + p.x), y: r1(CY + p.y) };
});

function Lattice({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  return (
    <svg viewBox="0 0 420 400" className="h-auto w-full" role="img" aria-label="Data, Analytics, AI, People and Business Context, each joined to one shared ontology at the centre of a hexagon lattice.">
      {LATTICE.map((c) => (
        <polygon key={c.key} points={c.pts} fill="none" stroke={GOLD} strokeOpacity={c.ring === 3 ? 0.07 : 0.13} strokeWidth="0.6" />
      ))}
      {PLACED.map((n, i) => (
        <line
          key={n.name}
          x1={CX}
          y1={CY}
          x2={n.x}
          y2={n.y}
          stroke={GOLD}
          strokeOpacity={i === active ? 0.9 : 0.28}
          strokeWidth={i === active ? 1 : 0.6}
          strokeDasharray={i === active ? undefined : "1 4"}
          style={{ transition: "stroke-opacity 1200ms" }}
        />
      ))}
      <polygon points={hexPoints(CX, CY, SIZE - 1.5)} fill="#0c0b0a" stroke={GOLD} strokeOpacity="0.9" strokeWidth="0.9" />
      <polygon points={hexPoints(CX, CY, SIZE - 7)} fill="none" stroke={GOLD} strokeOpacity="0.3" strokeWidth="0.5" />
      <text x={CX} y={CY + 3} textAnchor="middle" fill={GOLD} fontSize="7" letterSpacing="2" style={{ fontFamily: "var(--font-lx-sans)", textTransform: "uppercase" }}>
        Ontology
      </text>
      {PLACED.map((n, i) => {
        const on = i === active;
        return (
          <g key={n.name} className="cursor-pointer" onPointerEnter={(e) => e.pointerType === "mouse" && onPick(i)} onClick={() => onPick(i)}>
            <polygon
              points={hexPoints(n.x, n.y, SIZE - 1.5)}
              fill={on ? "#161410" : "#0c0b0a"}
              stroke={GOLD}
              strokeOpacity={on ? 0.9 : 0.35}
              strokeWidth="0.8"
              style={{ transition: "stroke-opacity 1200ms, fill 1200ms" }}
            />
            <text x={n.x} y={n.y + 3} textAnchor="middle" fill={on ? "#ede7dc" : "#a9a296"} fontSize="7" letterSpacing="1.6" style={{ fontFamily: "var(--font-lx-sans)", textTransform: "uppercase", transition: "fill 1200ms" }}>
              {n.short}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function OntologyV15() {
  const [active, setActive] = useState(0);
  const a = AXES[active];

  return (
    <section id="ontology" className="relative scroll-mt-20 bg-[#0c0b0a] py-32 sm:py-48" aria-labelledby="v15-ontology-title">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-10">
        <div className="grid items-center gap-20 lg:grid-cols-12 lg:gap-12">
          <div data-lx="fade" className="mx-auto w-full max-w-[520px] lg:order-2 lg:col-span-6 lg:col-start-7">
            <Lattice active={active} onPick={setActive} />
          </div>

          <div className="lg:order-1 lg:col-span-5">
            <Kicker>Our approach</Kicker>
            <h2 id="v15-ontology-title" data-lx="settle" style={d(150)} className="lx-display mt-10 text-[clamp(2.5rem,5vw,4.5rem)]">
              Data Ontology <em className="lx-gold">Intelligence.</em>
            </h2>
            <p data-lx="fade" style={d(320)} className="lx-serif mt-10 max-w-[38ch] text-[1.35rem] italic leading-[1.5] text-[#ede7dc]/90">
              We are not only a data, analytics or AI company. We work where data, analytics, AI, people and business context
              meet.
            </p>
            <p data-lx="fade" style={d(460)} className="lx-body mt-6 max-w-[52ch]">
              An ontology is a living model of your business: its objects, such as customers, orders, products and suppliers,
              the relationships between them, and the rules that give them meaning. Every axis works on that same model, so they
              move in harmony instead of in hand-offs.
            </p>
          </div>
        </div>

        <div className="mt-24 grid gap-10 border-t border-[#d8c29d]/15 pt-10 lg:grid-cols-12">
          <ol className="flex flex-wrap gap-x-8 gap-y-4 lg:col-span-7" aria-label="The five axes">
            {AXES.map((x, i) => (
              <li key={x.name}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                  aria-pressed={i === active}
                  className="group flex items-baseline gap-3 py-1"
                >
                  <span className="lx-num text-[0.95rem]">{ROMAN[i]}</span>
                  <span className={`lx-display text-[1.6rem] transition-colors duration-700 ${i === active ? "text-[#ede7dc]" : "text-[#ede7dc]/50 group-hover:text-[#ede7dc]/80"}`}>{x.name}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="lg:col-span-5" aria-live="polite">
            <p className="lx-caps lx-gold">{a.role}</p>
            <p key={a.name} className="lx-body mt-3 animate-[lx-rise_1.4s_cubic-bezier(0.19,1,0.22,1)_1] motion-reduce:animate-none">
              {a.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
