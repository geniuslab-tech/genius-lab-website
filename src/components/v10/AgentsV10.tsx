"use client";

import { useState } from "react";
import { Chapter, Exhibit } from "./ui";

/** Illustrative conversations with a Genius agent. Figures are not client data. */
const EXAMPLES = [
  {
    tab: "Margin",
    q: "Why did our EBITDA margin drop in Q3, and what should we do about it?",
    reads: ["Reading finance.gl_entries", "Comparing Q2 and Q3 cost centres", "Tracing freight and discount drivers"],
    a: "EBITDA margin fell from 18.2% to 15.9%. Two drivers explain most of it: freight costs rose 14% after the July carrier change, and Northeast discounting added $1.1M in promotional spend. Renegotiating freight and capping regional discounts recovers about 1.8 points next quarter.",
  },
  {
    tab: "Cash",
    q: "What will our cash position look like over the next 90 days?",
    reads: ["Reading ar.invoices and ap.schedule", "Applying payment behaviour by customer", "Projecting weekly balances"],
    a: "Cash stays above the $4M floor, with a low of $4.6M in week 7 when the annual insurance premium and two supplier payments land together. Collecting the three overdue enterprise invoices early lifts that low point to $5.9M.",
  },
];

const STEPS = [
  { t: "Executive question", s: "asked in plain language" },
  { t: "Agent reads", s: "the Second Brain" },
  { t: "Evidence sufficient?", s: "if not, it reads further" },
  { t: "Answer", s: "with its sources" },
  { t: "Leadership decides", s: "people stay accountable" },
  { t: "Agent orchestrates", s: "execution across systems" },
];

const BOX = { w: 150, h: 72, y: 80 };
const BOXES = [
  { x: 0, i: 0 },
  { x: 190, i: 1 },
  { x: 580, i: 3 },
  { x: 760, i: 4 },
  { x: 940, i: 5 },
];
const EDGES = [
  { d: "M150 116 H184", tip: 190, i: 0 },
  { d: "M340 116 H374", tip: 380, i: 1 },
  { d: "M530 116 H574", tip: 580, i: 2 },
  { d: "M730 116 H754", tip: 760, i: 3 },
  { d: "M910 116 H934", tip: 940, i: 4 },
];

const TXT = { font: "500 15px var(--font-v10-sans), sans-serif" } as const;
const SUB = { font: "400 12px var(--font-v10-sans), sans-serif" } as const;
const NUM = { font: "500 11px var(--font-v10-sans), sans-serif", letterSpacing: "0.14em" } as const;

function Flow() {
  return (
    <svg viewBox="0 0 1100 300" className="flow h-auto w-full" role="img" aria-labelledby="v10-flow-desc">
      <desc id="v10-flow-desc">
        An executive question goes to the agent, which reads the Second Brain. If the evidence is not sufficient, the agent
        reads further or asks the data owner, then checks again. If it is, the agent answers with its sources, leadership
        decides, and the agent orchestrates execution across systems.
      </desc>

      {EDGES.map((e) => (
        <g key={e.d}>
          <path d={e.d} pathLength={1} className="draw-path" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1.25" fill="none" style={{ ["--i" as string]: e.i }} />
          <path d={`M${e.tip - 7} 110 L${e.tip} 116 L${e.tip - 7} 122 Z`} fill="#ffffff" fillOpacity="0.8" className="fade-in" style={{ ["--i" as string]: e.i + 1 }} />
        </g>
      ))}
      <text x="552" y="104" textAnchor="middle" fill="#c4a26a" style={NUM} className="fade-in">
        YES
      </text>

      {/* The loop back: not enough evidence yet. */}
      <path d="M455 174 V252 H265 V160" pathLength={1} className="draw-path" stroke="#c4a26a" strokeWidth="1.25" fill="none" style={{ ["--i" as string]: 3 }} />
      <path d="M259 160 L265 152 L271 160 Z" fill="#c4a26a" className="fade-in" style={{ ["--i" as string]: 5 }} />
      <text x="470" y="200" fill="#c4a26a" style={NUM} className="fade-in">
        NO
      </text>
      <text x="360" y="278" textAnchor="middle" fill="#ffffff" fillOpacity="0.7" style={SUB} className="fade-in">
        The agent reads further, or asks the data owner
      </text>

      {BOXES.map((b) => (
        <g key={b.x} className="fade-in" style={{ ["--i" as string]: b.i }}>
          <text x={b.x} y={BOX.y - 14} fill="#c4a26a" style={NUM}>
            {`STEP ${b.i + 1}`}
          </text>
          <rect x={b.x + 0.5} y={BOX.y} width={BOX.w - 1} height={BOX.h} fill={b.i === 4 ? "#f6f3ea" : "#1a1f55"} stroke="#ffffff" strokeOpacity={b.i === 4 ? 0 : 0.45} />
          <text x={b.x + BOX.w / 2} y={BOX.y + 32} textAnchor="middle" fill={b.i === 4 ? "#101440" : "#ffffff"} style={TXT}>
            {STEPS[b.i].t}
          </text>
          <text x={b.x + BOX.w / 2} y={BOX.y + 52} textAnchor="middle" fill={b.i === 4 ? "#555b73" : "#ffffff"} fillOpacity={b.i === 4 ? 1 : 0.65} style={SUB}>
            {STEPS[b.i].s}
          </text>
        </g>
      ))}

      {/* Decision point. */}
      <g className="fade-in" style={{ ["--i" as string]: 2 }}>
        <text x="380" y={BOX.y - 14} fill="#c4a26a" style={NUM}>
          STEP 3
        </text>
        <path d="M455 58 L530 116 L455 174 L380 116 Z" fill="#101440" stroke="#c4a26a" strokeWidth="1.25" />
        <text x="455" y="112" textAnchor="middle" fill="#ffffff" style={TXT}>
          Evidence
        </text>
        <text x="455" y="131" textAnchor="middle" fill="#ffffff" style={TXT}>
          sufficient?
        </text>
      </g>
    </svg>
  );
}

export function AgentsV10() {
  const [ex, setEx] = useState(0);
  const E = EXAMPLES[ex];

  return (
    <Chapter
      id="agents"
      n="05"
      label="AI Agents"
      tone="navy"
      title="AI Agents that know your business."
      lead="Built on the Second Brain, Genius agents answer executive questions end to end, reading the systems, tables and metrics behind every number."
      note={<>Agents answer and act. Decisions remain with leadership; the agent shows what it read to reach each answer.</>}
    >
      <Exhibit
        n={6}
        tone="navy"
        className="mt-14 sm:mt-16"
        title="How a question becomes a decision"
        source="Genius Lab. Decision flow, simplified."
      >
        <div className="hidden md:block">
          <Flow />
        </div>
        <ol className="md:hidden" aria-label="How a question becomes a decision">
          {STEPS.map((s, i) => (
            <li key={s.t} className="row-in relative grid grid-cols-[2.25rem_1fr] gap-3 pb-6 last:pb-0" style={{ ["--i" as string]: i }}>
              {i < STEPS.length - 1 && <span className="absolute left-[0.6rem] top-7 bottom-1 w-px bg-white/30" aria-hidden="true" />}
              <span className={`tnum relative inline-flex h-5 w-5 items-center justify-center text-[0.6875rem] font-medium ${i === 2 ? "rotate-45 border border-[color:var(--brass-2)]" : "border border-white/50"}`}>
                <span className={i === 2 ? "-rotate-45" : ""}>{i + 1}</span>
              </span>
              <span>
                <span className="block text-[1rem] font-medium text-white">{s.t}</span>
                <span className="block text-[0.875rem] text-white/65">
                  {s.s}
                  {i === 2 && ": if not, the agent reads further or asks the data owner, then checks again"}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </Exhibit>

      <div className="mt-16 border-t border-white/25 pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="caps text-[color:var(--brass-2)]">Worked example · illustrative</p>
          <div className="flex gap-2" role="group" aria-label="Choose an example">
            {EXAMPLES.map((x, i) => (
              <button
                key={x.tab}
                type="button"
                onClick={() => setEx(i)}
                aria-pressed={i === ex}
                className={`h-9 px-4 text-[0.875rem] font-medium transition-colors ${i === ex ? "bg-[#f6f3ea] text-[#101440]" : "text-white/75 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.35)] hover:text-white"}`}
              >
                {x.tab}
              </button>
            ))}
          </div>
        </div>

        <div key={ex} className="mt-8 grid gap-10 lg:grid-cols-10 lg:gap-6">
          <div className="enter lg:col-span-4 [--d:-120ms]">
            <p className="caps text-white/55">The question</p>
            <p className="serif mt-3 text-[clamp(1.375rem,2.2vw,1.75rem)] italic leading-[1.35] text-white">&ldquo;{E.q}&rdquo;</p>
            <p className="caps mt-8 text-white/55">What the agent read</p>
            <ol className="mt-3">
              {E.reads.map((r, i) => (
                <li key={r} className="grid grid-cols-[1.75rem_1fr] border-b border-white/15 py-2.5 text-[0.9375rem] text-white/85">
                  <span className="tnum text-[color:var(--brass-2)]">{i + 1}</span>
                  <span className="font-mono text-[0.8125rem] leading-[1.7]">{r}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="enter lg:col-span-6 [--d:-40ms]">
            <p className="caps text-white/55">The answer</p>
            <p className="mt-3 border-l-2 border-[color:var(--brass-2)] pl-5 text-[1.125rem] leading-[1.7] text-white">{E.a}</p>
            <p className="mt-5 text-[0.75rem] text-white/55">Illustrative example. Figures are not client data.</p>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
