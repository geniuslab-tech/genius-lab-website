"use client";

import { useState } from "react";
import { GuillocheLayers } from "./ornaments";
import { Kicker, ROMAN, d, r1 } from "./ui";

const HUBS = ["Systems", "Tables", "Metrics", "Dashboards", "Processes", "Customers", "Operations", "Finance"];

const TOPICS = [
  {
    name: "Semantic Context",
    short: "Semantic",
    body: "What every number means. Shared definitions for metrics, tables and dashboards, so revenue means the same thing in every report.",
    hubs: [1, 2, 3],
    angle: -150,
  },
  {
    name: "Business Context",
    short: "Business",
    body: "How the company actually works. Customers, operations and finance, and the relationships that connect them.",
    hubs: [5, 6, 7],
    angle: -30,
  },
  {
    name: "Event Context",
    short: "Event",
    body: "What is happening right now. Transactions, process steps and system events, captured as they occur.",
    hubs: [0, 4],
    angle: 90,
  },
];

const C = 260;
const GOLD = "#d8c29d";
const rad = (deg: number) => (deg * Math.PI) / 180;

const TICKS = Array.from({ length: 60 }, (_, i) => {
  const a = rad(i * 6);
  const major = i % 5 === 0;
  const r0 = major ? 229 : 236;
  return { x1: r1(C + Math.cos(a) * r0), y1: r1(C + Math.sin(a) * r0), x2: r1(C + Math.cos(a) * 244), y2: r1(C + Math.sin(a) * 244), major };
});

const SUBDIALS = TOPICS.map((t) => ({
  x: r1(C + Math.cos(rad(t.angle)) * 132),
  y: r1(C + Math.sin(rad(t.angle)) * 132),
  ticks: Array.from({ length: 12 }, (_, i) => {
    const a = rad(i * 30);
    return { dx1: r1(Math.cos(a) * 38), dy1: r1(Math.sin(a) * 38), dx2: r1(Math.cos(a) * 42), dy2: r1(Math.sin(a) * 42) };
  }),
}));

/** The dial's static face: minute track, three complications and the hands. */
function DialFace({ active }: { active: number }) {
  const handDeg = TOPICS[active].angle + 90;
  return (
    <svg viewBox="0 0 520 520" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <circle cx={C} cy={C} r="250" fill="none" stroke={GOLD} strokeOpacity="0.45" strokeWidth="0.8" />
      <circle cx={C} cy={C} r="226" fill="none" stroke={GOLD} strokeOpacity="0.2" strokeWidth="0.5" />
      {TICKS.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={GOLD} strokeOpacity={t.major ? 0.7 : 0.3} strokeWidth={t.major ? 1 : 0.5} />
      ))}
      {SUBDIALS.map((s, i) => {
        const on = i === active;
        return (
          <g key={i} style={{ transition: "opacity 1200ms" }} opacity={on ? 1 : 0.55}>
            <circle cx={s.x} cy={s.y} r="46" fill="#0c0b0a" fillOpacity="0.92" stroke={GOLD} strokeOpacity={on ? 0.85 : 0.35} strokeWidth="0.8" />
            <circle cx={s.x} cy={s.y} r="34" fill="none" stroke={GOLD} strokeOpacity="0.18" strokeWidth="0.5" />
            {s.ticks.map((t, k) => (
              <line key={k} x1={s.x + t.dx1} y1={s.y + t.dy1} x2={s.x + t.dx2} y2={s.y + t.dy2} stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.5" />
            ))}
            <text x={s.x} y={s.y - 2} textAnchor="middle" fill="#ede7dc" fontSize="8.5" letterSpacing="2.4" style={{ fontFamily: "var(--font-lx-sans)", textTransform: "uppercase" }}>
              {TOPICS[i].short}
            </text>
            <text x={s.x} y={s.y + 16} textAnchor="middle" fill={GOLD} fontSize="12" style={{ fontFamily: "var(--font-lx-serif)" }}>
              {ROMAN[i]}
            </text>
          </g>
        );
      })}
      <g style={{ transform: `rotate(${handDeg}deg)`, transformOrigin: `${C}px ${C}px`, transition: "transform 2200ms cubic-bezier(0.19,1,0.22,1)" }}>
        <path d={`M${C},${C + 26} L${C - 3},${C} L${C},${C - 92} L${C + 3},${C} Z`} fill={GOLD} fillOpacity="0.9" />
        <line x1={C} x2={C} y1={C - 92} y2={C - 84} stroke="#0c0b0a" strokeWidth="1" />
      </g>
      <circle cx={C} cy={C} r="9" fill="#0c0b0a" stroke={GOLD} strokeWidth="0.8" />
      <circle cx={C} cy={C} r="3" fill={GOLD} />
    </svg>
  );
}

export function BrainV15() {
  const [active, setActive] = useState(0);
  const topic = TOPICS[active];

  return (
    <section id="brain" className="relative isolate scroll-mt-20 overflow-hidden bg-[#0c0b0a] py-32 sm:py-48" aria-labelledby="v15-brain-title">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-10">
        <div className="mx-auto flex max-w-[820px] flex-col items-center text-center">
          <Kicker>The Second Brain</Kicker>
          <h2 id="v15-brain-title" data-lx="settle" style={d(150)} className="lx-display mt-10 text-[clamp(2.6rem,6vw,5.5rem)]">
            A Second Brain for <em className="lx-gold">your business.</em>
          </h2>
          <p data-lx="fade" style={d(350)} className="lx-body mt-10 max-w-[56ch]">
            The intelligence layer holds the full context of the company: its systems, tables, metrics, dashboards, processes,
            customers, operations and finances. AI Agents work on top of it, end to end.
          </p>
        </div>

        <div className="mt-24 grid items-center gap-16 sm:mt-32 lg:grid-cols-12 lg:gap-12">
          <div data-lx="fade" style={d(200)} className="relative mx-auto aspect-square w-full max-w-[560px] lg:col-span-7">
            <GuillocheLayers />
            <DialFace active={active} />
            <p className="sr-only">
              The Second Brain drawn as an engraved dial with three complications: semantic, business and event context.
              Selected now: {topic.name}, covering {topic.hubs.map((h) => HUBS[h]).join(", ")}.
            </p>
          </div>

          <ol className="lg:col-span-5" aria-label="Context held in the Second Brain">
            {TOPICS.map((t, i) => {
              const on = i === active;
              return (
                <li key={t.name} className="border-t border-[#d8c29d]/15 last:border-b">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                    aria-expanded={on}
                    className="flex w-full flex-col py-7 text-left"
                  >
                    <span className="flex items-baseline gap-6">
                      <span className="lx-num w-8 text-[1.1rem]">{ROMAN[i]}</span>
                      <span className={`lx-display text-[clamp(1.7rem,2.4vw,2.2rem)] transition-colors duration-700 ${on ? "text-[#ede7dc]" : "text-[#ede7dc]/55"}`}>
                        {t.name}
                      </span>
                    </span>
                    <span className={`grid pl-14 transition-[grid-template-rows,opacity,filter] duration-[1100ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${on ? "grid-rows-[1fr] opacity-100 blur-0" : "grid-rows-[0fr] opacity-0 blur-[4px]"}`}>
                      <span className="overflow-hidden">
                        <span className="lx-body block pt-4 text-[1rem]">{t.body}</span>
                        <span className="lx-caps lx-gold mt-5 block text-[0.625rem]">{t.hubs.map((h) => HUBS[h]).join("  ·  ")}</span>
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
