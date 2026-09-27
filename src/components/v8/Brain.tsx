"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Caption, Opener, Rule, Up, shell } from "./type";

type Ctx = 0 | 1 | 2;

const TOPICS = [
  {
    name: "Semantic Context",
    pos: "n.",
    body: "What every number means. Shared definitions for metrics, tables and dashboards, so revenue means the same thing in every report.",
  },
  {
    name: "Business Context",
    pos: "n.",
    body: "How the company actually works. Customers, operations and finance, and the relationships that connect them.",
  },
  {
    name: "Event Context",
    pos: "n.",
    body: "What is happening right now. Transactions, process steps and system events, captured as they occur.",
  },
];

const C = { x: 290, y: 225 };
const NODES: { t: string; x: number; y: number; c: Ctx; anchor?: "start" | "end" }[] = [
  { t: "Metric definitions", x: 96, y: 62, c: 0 },
  { t: "Revenue", x: 262, y: 38, c: 0 },
  { t: "Gross margin", x: 420, y: 70, c: 0 },
  { t: "Dashboards", x: 520, y: 150, c: 0, anchor: "end" },
  { t: "Customers", x: 62, y: 196, c: 1 },
  { t: "Operations", x: 180, y: 142, c: 1 },
  { t: "Finance", x: 396, y: 168, c: 1 },
  { t: "Suppliers", x: 528, y: 262, c: 1, anchor: "end" },
  { t: "Orders", x: 150, y: 292, c: 1 },
  { t: "Transactions", x: 70, y: 380, c: 2 },
  { t: "Invoices", x: 262, y: 400, c: 2 },
  { t: "Process steps", x: 404, y: 336, c: 2 },
  { t: "System events", x: 506, y: 404, c: 2, anchor: "end" },
];
const PEERS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [1, 6], [2, 6], [4, 5], [4, 8], [5, 6], [6, 7], [8, 9], [8, 10], [10, 6], [11, 7], [11, 12], [9, 10], [3, 12], [5, 0],
];

const CYCLE_MS = 5200;

function Graph({ active }: { active: Ctx }) {
  return (
    <svg viewBox="0 0 580 450" className="plate block h-auto w-full" aria-hidden="true">
      {NODES.map((n, i) => {
        const on = n.c === active;
        return (
          <line
            key={`s${i}`}
            x1={C.x}
            y1={C.y}
            x2={n.x}
            y2={n.y}
            className="g-edge"
            stroke={on ? "var(--red)" : "var(--rule)"}
            strokeWidth={on ? 1.4 : 1}
            strokeDasharray={on ? undefined : "2 4"}
          />
        );
      })}
      {PEERS.map(([a, b], i) => {
        const on = NODES[a].c === active && NODES[b].c === active;
        return (
          <line
            key={`p${i}`}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            className="g-edge"
            stroke={on ? "var(--red)" : "var(--ink)"}
            strokeOpacity={on ? 1 : 0.35}
            strokeWidth={on ? 1.4 : 0.8}
          />
        );
      })}
      {NODES.map((n) => {
        const on = n.c === active;
        const anchor = n.anchor ?? "start";
        return (
          <g key={n.t} className="g-node">
            <circle cx={n.x} cy={n.y} r={on ? 5.5 : 4} fill={on ? "var(--red)" : "var(--paper)"} stroke={on ? "var(--red)" : "var(--ink)"} strokeWidth={1.2} />
            <text
              x={n.x + (anchor === "end" ? -10 : 10)}
              y={n.y + 4}
              textAnchor={anchor}
              fontSize="12"
              fontWeight={on ? 600 : 400}
              fill={on ? "var(--ink)" : "var(--ink-3)"}
              style={{ transition: "fill 400ms" }}
            >
              {n.t}
            </text>
          </g>
        );
      })}
      <rect x={C.x - 62} y={C.y - 22} width={124} height={44} fill="var(--ink)" />
      <text x={C.x} y={C.y + 8} textAnchor="middle" fill="var(--paper)" fontSize="22" className="serif" fontStyle="italic">
        Second Brain
      </text>
    </svg>
  );
}

export function Brain() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Ctx>(0);
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
    const t = setTimeout(() => setActive((a) => ((a + 1) % 3) as Ctx), CYCLE_MS);
    return () => clearTimeout(t);
  }, [inView, reduce, touched, active]);

  const nodes = NODES.filter((n) => n.c === active).map((n) => n.t);

  return (
    <section ref={root} id="brain" data-chapter="brain" className="scroll-mt-[var(--head-h)] py-20 sm:py-28" aria-labelledby="v8-brain-title">
      <div className={shell}>
        <Opener numeral="III" kicker="Second Brain" title="A *Second Brain* for your business." titleId="v8-brain-title" folio="22">
          <Up delay={250}>
            <p className="f-text mt-8 max-w-[52ch] text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.4]">
              The intelligence layer holds the full context of the company: its systems, tables, metrics, dashboards,
              processes, customers, operations and finances. AI Agents work on top of it, end to end.
            </p>
          </Up>
        </Opener>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="label text-[color:var(--ink-3)]">A short glossary of context</p>
            <Rule ink className="mt-3" />
            <ol aria-label="Context in the Second Brain">
              {TOPICS.map((t, i) => {
                const on = i === active;
                return (
                  <li key={t.name} className="border-b border-[color:var(--rule)]">
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setTouched(true);
                        setActive(i as Ctx);
                      }}
                      className="group relative block w-full py-6 text-left"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className={`f-display text-[2rem] leading-none transition-colors duration-300 ${on ? "text-[color:var(--ink)]" : "text-[color:var(--ink-3)] group-hover:text-[color:var(--ink)]"}`}>
                          {t.name}
                        </span>
                        <span className="f-text text-[1rem] italic text-[color:var(--ink-3)]">{t.pos}</span>
                        <span className={`smallcaps ml-auto transition-colors ${on ? "text-[color:var(--red)]" : "text-[color:var(--ink-3)]"}`}>0{i + 1}</span>
                      </span>
                      <span className={`body-copy mt-3 block transition-colors duration-300 ${on ? "" : "!text-[color:var(--ink-3)]"}`}>{t.body}</span>
                      <span
                        className={`absolute -bottom-px left-0 h-[2px] w-full origin-left bg-[color:var(--red)] ${
                          on && !reduce && !touched ? "animate-[v8-timer_5200ms_linear_forwards]" : on ? "" : "scale-x-0"
                        }`}
                        key={on ? `t${active}` : "off"}
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <figure className="lg:col-span-7">
            <div className="border border-[color:var(--ink)] p-3 sm:p-6">
              <div className="label flex justify-between text-[color:var(--ink-3)]">
                <span>Plate I &nbsp;·&nbsp; Knowledge graph</span>
                <span className="text-[color:var(--red)]">{TOPICS[active].name}</span>
              </div>
              <Rule className="mt-3" />
              <div className="mt-4">
                <Graph active={active} />
              </div>
              <p className="sr-only" aria-live="polite">
                Highlighted: {TOPICS[active].name}, covering {nodes.join(", ")}.
              </p>
            </div>
            <Caption fig="Fig. 3">
              The Second Brain, drawn as a graph of the business. Select a kind of context to see which parts of the company it
              holds. Schematic.
            </Caption>
          </figure>
        </div>
      </div>
    </section>
  );
}
