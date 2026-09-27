"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check } from "@phosphor-icons/react";

/** Illustrative conversations with the Genius agent. Figures are examples, not client data. */
const SCRIPT = [
  {
    short: "Margin",
    q: "Why did our EBITDA margin drop in Q3, and what should we do about it?",
    reads: ["finance.gl_entries", "Q2 vs Q3 cost centres", "Freight and discount drivers"],
    a: "EBITDA margin fell from 18.2% to 15.9%. Two drivers explain most of it: freight costs rose 14% after the July carrier change, and Northeast discounting added $1.1M in promotional spend. Renegotiating freight and capping regional discounts recovers about 1.8 points next quarter.",
  },
  {
    short: "Cash",
    q: "What will our cash position look like over the next 90 days?",
    reads: ["ar.invoices and ap.schedule", "Payment behaviour by customer", "Weekly balance projection"],
    a: "Cash stays above the $4M floor, with a low of $4.6M in week 7 when the annual insurance premium and two supplier payments land together. Collecting the three overdue enterprise invoices early lifts that low point to $5.9M.",
  },
];

export function AgentDemo() {
  const [i, setI] = useState(0);
  const s = SCRIPT[i];
  return (
    <figure className="v13-rule mt-14 border-t">
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <span className="v13-label">Ask Genius · finance workspace</span>
        <div className="flex gap-2" role="group" aria-label="Example questions">
          {SCRIPT.map((x, k) => (
            <button key={x.short} type="button" aria-pressed={k === i} onClick={() => setI(k)} className={`v13-chip ${k === i ? "is-on" : ""}`}>
              {x.short}
            </button>
          ))}
        </div>
      </div>

      <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} aria-live="polite">
        <p className="v13-label v13-muted">You asked</p>
        <p className="mt-3 text-[clamp(1.25rem,2.6cqw,1.625rem)] font-medium leading-[1.35] tracking-[-0.01em]">{s.q}</p>

        <p className="v13-label v13-muted mt-10">What the agent read</p>
        <ol className="mt-4 grid gap-2">
          {s.reads.map((r, k) => (
            <motion.li
              key={r}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + k * 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 font-mono text-[0.8125rem]"
            >
              <span className="v13-tick" aria-hidden="true">
                <Check size={10} weight="bold" />
              </span>
              {r}
            </motion.li>
          ))}
        </ol>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.45, ease: [0.22, 1, 0.36, 1] }}
          className="v13-answer mt-10 text-[1.0625rem] leading-[1.75]"
        >
          {s.a}
        </motion.p>
      </motion.div>
      <figcaption className="v13-label v13-muted mt-6">Illustrative conversation · figures are examples</figcaption>
    </figure>
  );
}
