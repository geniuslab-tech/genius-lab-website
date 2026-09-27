"use client";

import { useEffect, useRef, useState } from "react";
import { Head, Label, Section, delay } from "./ui";

type Cell = { t: string; k: "sys" | "glue" };
const S = (t: string): Cell => ({ t, k: "sys" });
const G = (t: string): Cell => ({ t, k: "glue" });

/** What a growing company runs, and the manual glue people add to hold it together. Illustrative. */
const WALL: Cell[] = [
  S("ERP"), G("Export_final_v7.xlsx"), S("CRM"), S("General ledger"), G("Copy-paste reconcile"), S("Payroll"),
  G("Email approvals"), S("Warehouse mgmt"), G("Manual re-keying"), S("E-commerce"), S("Point of sale"), G("Shadow spreadsheet"),
  S("HRIS"), G("Month-end scramble"), S("Billing"), G("Who owns this number?"), S("Procurement"), S("Data warehouse"),
  G("Three versions of revenue"), S("BI tool"), G("Weekly report rebuild"), S("Ticketing"), G("Macro nobody maintains"), S("Marketing automation"),
  S("Budgeting"), G("Late-night VLOOKUP"), S("Treasury"), G("Forwarded PDF invoices"), S("MES"), G("Chat thread approvals"),
  S("Contracts DB"), G("Hand-built board pack"), S("Expense tool"), G("Tribal knowledge"), S("Cloud apps"), G("CSV dump, Mondays"),
];

/** Glue is struck first, one cell at a time; then the systems it stood between light up. */
const DELAYS = (() => {
  let g = 0;
  let k = 0;
  return WALL.map((c) => (c.k === "glue" ? g++ * 70 : 1300 + k++ * 35));
})();

/** Illustrative growth of what a company has to hold together, founding to enterprise. */
const COUNTS = [
  { label: "Systems", from: 3, to: 46 },
  { label: "Reports", from: 8, to: 940 },
  { label: "Manual handoffs", from: 2, to: 210 },
  { label: "People in a decision", from: 2, to: 19 },
];

export function Problem14() {
  const [struck, setStruck] = useState(false);
  const [touched, setTouched] = useState(false);
  const wall = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wall.current;
    if (!el || touched) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          t = setTimeout(() => setStruck(true), 700);
          io.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (t) clearTimeout(t);
    };
  }, [touched]);

  return (
    <Section id="problem" n="01" label="The problem" titleId="v14-problem-title">
      <Head
        id="v14-problem-title"
        title="Complexity Is the Cost of Growth."
        lead="Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding everything together. Leadership loses visibility, execution slows down, and the business pays the price."
      />

      {/* The wall */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-black px-4 py-3 sm:px-6">
        <ul className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Legend">
          <li className="v14-mono flex items-center gap-2">
            <span className="inline-block h-3 w-3 border-2 border-black bg-black" aria-hidden="true" /> System you already run
          </li>
          <li className="v14-mono flex items-center gap-2">
            <span className="inline-block h-[3px] w-5 bg-[#1f3bff]" aria-hidden="true" /> Manual glue
          </li>
        </ul>
        <button
          type="button"
          aria-pressed={struck}
          onClick={() => {
            setTouched(true);
            setStruck((s) => !s);
          }}
          className="v14-btn v14-btn--w min-h-10 text-[0.75rem]"
        >
          <span>{struck ? "Show the glue again" : "Strike out the glue"}</span>
          <span className="v14-arrow" aria-hidden="true">
            &rarr;
          </span>
        </button>
      </div>

      <div ref={wall} data-struck={struck ? "" : undefined}>
        <ul
          className="grid grid-cols-2 gap-[2px] bg-black sm:grid-cols-4 lg:grid-cols-6"
          aria-label={struck ? "Systems kept, manual glue removed" : "Systems and the manual glue between them"}
        >
          {WALL.map((c, i) => {
            const d = DELAYS[i];
            return (
              <li
                key={c.t}
                style={delay(d)}
                className={`flex min-h-[5.25rem] flex-col justify-between gap-3 bg-white p-3 ${c.k === "glue" ? "v14-glue" : "v14-sys"}`}
              >
                <span className="v14-mono text-[0.625rem] opacity-70">{String(i + 1).padStart(2, "0")}</span>
                <span className={`text-[0.9375rem] font-semibold leading-tight tracking-[-0.01em] ${c.k === "glue" ? "font-mono text-[0.8125rem] font-normal tracking-normal" : ""}`}>
                  <span className={c.k === "glue" ? "v14-glue-t" : undefined}>{c.t}</span>
                  {c.k === "glue" && struck ? <span className="sr-only"> (removed)</span> : null}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="v14-mono border-b-2 border-t-2 border-black px-4 py-2 text-[#555] sm:px-6">
        Illustrative. Keep the systems; remove the glue.
      </p>

      {/* The turn */}
      <div className="grid border-b-2 border-black lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="flex items-center border-black px-4 py-8 sm:px-6 max-lg:border-b-2 lg:border-r-2">
          <p data-r="" className="text-pretty max-w-[28ch] text-[1.25rem] font-semibold leading-[1.35] tracking-[-0.01em]">
            When the business becomes fragmented, replacing systems can feel like the natural next step.
          </p>
        </div>
        <div className="px-4 py-8 sm:px-6">
          <h3 data-r="" className="v14-head text-[clamp(2.25rem,4.6vw,4.75rem)] text-[#1f3bff]">
            Solve the Right Problem.
          </h3>
          <p data-r="" style={delay(100)} className="text-pretty mt-5 max-w-[60ch] text-[1.0625rem] leading-[1.6]">
            Sometimes replacement is necessary. But often, the problem can be solved without the cost, operational load,
            and disruption risk of a system transition. Building on what already works reduces complexity, expands
            capabilities, and unlocks more value from your systems and people.
          </p>
        </div>
      </div>

      {/* What growth adds */}
      <dl className="grid grid-cols-2 gap-[2px] bg-black lg:grid-cols-4">
        {COUNTS.map((c, i) => (
          <div key={c.label} className="v14-inv flex flex-col bg-white px-4 py-6 sm:px-6">
            <dt className="v14-mono order-2 mt-3">{c.label}</dt>
            <dd data-r="up" style={delay(i * 90)} className="order-1 flex items-baseline gap-3">
              <span className="v14-mono v14-soft text-[0.875rem] text-[#555]">{c.from} &rarr;</span>
              <span className="v14-display text-[clamp(3rem,6vw,6rem)]">{c.to.toLocaleString("en-US")}</span>
            </dd>
          </div>
        ))}
      </dl>
      <Label className="border-t-2 border-black px-4 py-2 text-[#555] sm:px-6">Founding to enterprise · illustrative figures</Label>
    </Section>
  );
}
