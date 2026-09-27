"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useInView, useReduced } from "./hooks";
import { HexMark, SectionHead } from "./ui";

/** Illustrative agents. Every question and answer here is a demonstration, not client data. */
const AGENTS = [
  {
    name: "Finance agent",
    domain: "Margin, P&L and cost drivers",
    reads: ["finance.gl_entries", "cost_centres", "freight.invoices"],
    q: "Why did our EBITDA margin drop in Q3, and what should we do about it?",
    a: "EBITDA margin fell from 18.2% to 15.9%. Two drivers explain most of it: freight costs rose 14% after the July carrier change, and Northeast discounting added $1.1M in promotional spend. Renegotiating freight and capping regional discounts recovers about 1.8 points next quarter.",
  },
  {
    name: "Cash agent",
    domain: "Liquidity and working capital",
    reads: ["ar.invoices", "ap.schedule", "bank.balances"],
    q: "What will our cash position look like over the next 90 days?",
    a: "Cash stays above the $4M floor, with a low of $4.6M in week 7 when the annual insurance premium and two supplier payments land together. Collecting the three overdue enterprise invoices early lifts that low point to $5.9M.",
  },
  {
    name: "Operations agent",
    domain: "Throughput, schedules and capacity",
    reads: ["ops.work_orders", "mes.events", "maintenance.log"],
    q: "Which lines are behind schedule this week, and why?",
    a: "Two lines are behind plan, and both are waiting on the same component delivery. Re-sequencing the next three orders onto the line that has stock keeps most of the week on schedule.",
  },
  {
    name: "Customer agent",
    domain: "Accounts, retention and service",
    reads: ["crm.accounts", "support.tickets", "billing.usage"],
    q: "Which accounts are showing signs of churn this quarter?",
    a: "A small group of accounts combine falling usage with rising support tickets. Most of them share one unresolved product issue, so fixing it is the highest-value retention action.",
  },
  {
    name: "Supply agent",
    domain: "Suppliers, stock and exposure",
    reads: ["erp.purchase_orders", "supplier.master", "inventory.levels"],
    q: "Where are we exposed to a single supplier?",
    a: "Three product families depend on one supplier with no approved alternative. The agent lists the parts, the stock cover for each, and the suppliers already qualified for similar parts.",
  },
  {
    name: "Portfolio agent",
    domain: "Value creation across companies",
    reads: ["portfolio.kpis", "vcp.initiatives", "board.targets"],
    q: "How is each portfolio company tracking against its value creation plan?",
    a: "Each company is compared with its plan on the same definitions. The agent flags the initiatives that are slipping and shows which metrics moved and why.",
  },
  {
    name: "Board agent",
    domain: "Board packs and commentary",
    reads: ["metrics.kpi_catalog", "bi.dashboards", "finance.forecast"],
    q: "Draft the commentary for this month’s board pack.",
    a: "A first draft built from the approved numbers, with every statement linked to the metric and dashboard it came from, ready for the CFO to edit.",
  },
  {
    name: "Data quality agent",
    domain: "Definitions, lineage and trust",
    reads: ["catalog.definitions", "lineage.graph", "tests.results"],
    q: "Which dashboards use a revenue definition that differs from finance?",
    a: "The agent traces every revenue field through the lineage graph and lists the dashboards that calculate it differently, with the owner of each.",
  },
];

const N = AGENTS.length;
const STEP = 360 / N;

function AgentCard({ a, i, on }: { a: (typeof AGENTS)[number]; i: number; on: boolean }) {
  return (
    <div
      className={`v16-panel flex h-full flex-col p-5 transition-[border-color,box-shadow] duration-500 ${on ? "border-[rgb(143_220_255/0.6)] shadow-[0_0_60px_-18px_rgb(143_220_255/0.55)]" : ""}`}
    >
      <div className="flex items-center justify-between">
        <span className={`v16-hex inline-flex h-9 w-10 items-center justify-center ${on ? "bg-[color:var(--ice)] text-[color:var(--g1)]" : "bg-[rgb(143_220_255/0.1)] text-[color:var(--ice)]"}`}>
          <HexMark size={14} />
        </span>
        <span className="v16-label text-[color:var(--tx-3)]">A-0{i + 1}</span>
      </div>
      <p className="v16-display mt-6 text-[1.1875rem]">{a.name}</p>
      <p className="mt-1 text-[0.875rem] leading-snug text-[color:var(--tx-2)]">{a.domain}</p>
      <ul className="mt-auto space-y-1 border-t border-[color:var(--line)] pt-4">
        {a.reads.map((r) => (
          <li key={r} className="v16-mono truncate text-[0.6875rem] text-[color:var(--tx-3)]">
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AgentsV16() {
  const reduce = useReduced();
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(root, "100px");
  const [active, setActive] = useState(0);
  const motion = useRef({ rot: 0, target: 0, dragging: false, moved: false, startX: 0, startTarget: 0 });

  // Frame loop: ease the ring toward its target, dim cards that face away.
  useEffect(() => {
    if (reduce || !inView) return;
    const m = motion.current;
    let raf = 0;
    let lastActive = -1;
    const tick = () => {
      m.rot += (m.target - m.rot) * 0.1;
      const el = ring.current;
      const st = stage.current;
      if (el && st) {
        const cw = st.offsetWidth < 640 ? 188 : 232;
        const r = Math.round(cw / 2 / Math.tan(Math.PI / N) + (cw < 200 ? 26 : 44));
        el.style.transform = `translateZ(${-r}px) rotateY(${-m.rot}deg)`;
        cards.current.forEach((c, i) => {
          if (!c) return;
          c.style.setProperty("--cw", `${cw}px`);
          c.style.transform = `rotateY(${i * STEP}deg) translateZ(${r}px)`;
          const cos = Math.cos(((i * STEP - m.rot) * Math.PI) / 180);
          c.style.opacity = (0.18 + 0.82 * Math.max(0, cos) ** 1.5).toFixed(3);
        });
      }
      const idx = (((Math.round(m.rot / STEP) % N) + N) % N) as number;
      if (idx !== lastActive) {
        lastActive = idx;
        setActive(idx);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, inView]);

  // Scrolling past the section turns the ring, then it settles on the nearest agent.
  useEffect(() => {
    if (reduce || !inView) return;
    const m = motion.current;
    let lastY = window.scrollY;
    let settle: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      if (m.dragging) return;
      m.target += dy * 0.05;
      clearTimeout(settle);
      settle = setTimeout(() => {
        m.target = Math.round(m.target / STEP) * STEP;
      }, 160);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduce, inView]);

  const go = (delta: number) => {
    const m = motion.current;
    m.target = Math.round(m.target / STEP) * STEP + delta * STEP;
  };
  const goTo = (i: number) => {
    const m = motion.current;
    const cur = Math.round(m.target / STEP);
    const base = ((cur % N) + N) % N;
    let d = i - base;
    if (d > N / 2) d -= N;
    if (d < -N / 2) d += N;
    m.target = (cur + d) * STEP;
  };

  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    const m = motion.current;
    m.dragging = true;
    m.moved = false;
    m.startX = e.clientX;
    m.startTarget = m.target;
    stage.current?.setAttribute("data-drag", "");
  };
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const m = motion.current;
    if (!m.dragging) return;
    const dx = e.clientX - m.startX;
    if (Math.abs(dx) > 5 && !m.moved) {
      m.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (m.moved) m.target = m.startTarget - dx * 0.28;
  };
  const onUp = () => {
    const m = motion.current;
    if (!m.dragging) return;
    m.dragging = false;
    m.target = Math.round(m.target / STEP) * STEP;
    stage.current?.removeAttribute("data-drag");
  };

  const A = AGENTS[active];

  return (
    <section ref={root} id="agents" className="relative scroll-mt-16 overflow-hidden py-24 sm:py-32" aria-labelledby="v16-agents-title">
      <div className="v16-wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead n="03" id="v16-agents-title" kicker="AI Agents" title="AI Agents that know your business." className="lg:col-span-7" />
          <p className="v16-lead max-w-[52ch] lg:col-span-5">
            Built on the Second Brain, Genius agents answer executive questions end to end, reading the systems, tables and
            metrics behind every number.
          </p>
        </div>
      </div>

      {reduce ? (
        <div className="v16-wrap mt-14">
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {AGENTS.map((a, i) => (
              <li key={a.name}>
                <button type="button" onClick={() => setActive(i)} aria-pressed={i === active} className="block h-full w-full text-left">
                  <AgentCard a={a} i={i} on={i === active} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="relative mt-12 lg:mt-16">
          <div
            ref={stage}
            className="v16-ring-stage relative mx-auto h-[300px] max-w-[1400px] overflow-hidden sm:h-[330px]"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onPointerLeave={onUp}
          >
            <div ref={ring} className="v16-ring top-6">
              {AGENTS.map((a, i) => (
                <button
                  key={a.name}
                  type="button"
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  className="v16-ring-card h-[250px] text-left sm:h-[270px]"
                  style={{ "--cw": "232px" } as CSSProperties}
                  aria-label={`${a.name}: ${a.domain}`}
                  aria-pressed={i === active}
                  onClick={() => {
                    if (!motion.current.moved) goTo(i);
                  }}
                >
                  <AgentCard a={a} i={i} on={i === active} />
                </button>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-[12%] bg-[linear-gradient(90deg,var(--g1),transparent)]" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[12%] bg-[linear-gradient(270deg,var(--g1),transparent)]" aria-hidden="true" />
          </div>
          <div className="v16-wrap mt-4 flex items-center justify-between gap-4">
            <p className="v16-label text-[color:var(--tx-3)]">Drag, scroll or use the arrows</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => go(-1)} aria-label="Previous agent" className="inline-flex h-10 w-10 items-center justify-center rounded-[6px] shadow-[inset_0_0_0_1px_var(--line-2)] transition-shadow hover:shadow-[inset_0_0_0_1px_rgb(143_220_255/0.6)]">
                <CaretLeft size={16} />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next agent" className="inline-flex h-10 w-10 items-center justify-center rounded-[6px] shadow-[inset_0_0_0_1px_var(--line-2)] transition-shadow hover:shadow-[inset_0_0_0_1px_rgb(143_220_255/0.6)]">
                <CaretRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* The agent in front: its question, what it read, its answer. */}
      <div className="v16-wrap mt-10">
        <div className="v16-panel grid gap-8 p-6 sm:p-8 lg:grid-cols-12" aria-live="polite">
          <div className="lg:col-span-4">
            <p className="v16-label text-[color:var(--ice)]">A-0{active + 1} · {A.name}</p>
            <p className="mt-4 text-[1.125rem] font-medium leading-snug">&ldquo;{A.q}&rdquo;</p>
            <p className="v16-label mt-6 text-[color:var(--tx-3)]">What the agent reads</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {A.reads.map((r) => (
                <li key={r} className="v16-mono rounded-[4px] bg-[rgb(143_220_255/0.08)] px-2 py-0.5 text-[0.6875rem] text-[color:var(--ice)]">
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-[color:var(--line)] lg:col-span-8 lg:border-l lg:pl-8">
            <p className="v16-label text-[color:var(--tx-3)]">Answer</p>
            <p className="mt-4 text-[1.0625rem] leading-[1.7] text-[color:var(--tx-2)]">{A.a}</p>
          </div>
        </div>
        <p className="v16-label mt-4 text-[color:var(--tx-3)]">Illustrative agents, questions and answers</p>
      </div>
    </section>
  );
}
