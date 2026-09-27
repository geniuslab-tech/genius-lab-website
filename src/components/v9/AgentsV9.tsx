"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "@phosphor-icons/react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { Slate, timecode, usePin, useStill } from "./shared";

type Frame =
  | { kind: "agent"; text: string }
  | { kind: "you"; text: string }
  | { kind: "reads"; lines: string[] }
  | { kind: "answer"; text: string; sources: string[] }
  | { kind: "end" };

/** Illustrative conversations with the Genius agent. Figures are illustrative. */
const FRAMES: Frame[] = [
  { kind: "agent", text: "Hi, I’m your Genius agent. Ask me anything about the business, and I’ll show you what I read to answer." },
  { kind: "you", text: "Why did our EBITDA margin drop in Q3, and what should we do about it?" },
  { kind: "reads", lines: ["Reading finance.gl_entries", "Comparing Q2 and Q3 cost centres", "Tracing freight and discount drivers"] },
  {
    kind: "answer",
    text: "EBITDA margin fell from 18.2% to 15.9%. Two drivers explain most of it: freight costs rose 14% after the July carrier change, and Northeast discounting added $1.1M in promotional spend. Renegotiating freight and capping regional discounts recovers about 1.8 points next quarter.",
    sources: ["finance.gl_entries", "cost_centres", "freight_invoices"],
  },
  { kind: "you", text: "What will our cash position look like over the next 90 days?" },
  { kind: "reads", lines: ["Reading ar.invoices and ap.schedule", "Applying payment behaviour by customer", "Projecting weekly balances"] },
  {
    kind: "answer",
    text: "Cash stays above the $4M floor, with a low of $4.6M in week 7 when the annual insurance premium and two supplier payments land together. Collecting the three overdue enterprise invoices early lifts that low point to $5.9M.",
    sources: ["ar.invoices", "ap.schedule", "bank.balances"],
  },
  { kind: "end" },
];

const SPEAKER: Record<Frame["kind"], string> = {
  agent: "Genius agent",
  you: "You · CFO",
  reads: "Agent · reading",
  answer: "Genius agent · answer",
  end: "End of sequence",
};

function FrameCard({ f, i }: { f: Frame; i: number }) {
  return (
    <li className="flex w-[min(80vw,27rem)] shrink-0 flex-col" aria-label={`Frame ${i + 1} of ${FRAMES.length}`}>
      <div className="v9-sprockets" aria-hidden="true" />
      <div className={`relative flex h-[clamp(17rem,44svh,24rem)] flex-col border-x border-white/10 p-5 sm:p-6 ${f.kind === "answer" ? "bg-(--v9-navy)" : f.kind === "end" ? "bg-(--v9-ice) text-(--v9-ink)" : "bg-(--v9-ink-2)"}`}>
        <div className={`v9-tc flex items-center justify-between gap-3 ${f.kind === "end" ? "text-(--v9-ink)/70" : "text-(--v9-dim)"}`}>
          <span>
            FR {String(i + 1).padStart(2, "0")} · {SPEAKER[f.kind]}
          </span>
          <span>{timecode(1200 + i * 187)}</span>
        </div>

        <div className="mt-auto">
          {f.kind === "agent" && <p className="text-[1.0625rem] leading-[1.55] text-(--v9-fog)">{f.text}</p>}
          {f.kind === "you" && <p className="v9-display text-[clamp(1.75rem,4vw,2.5rem)] text-white">&ldquo;{f.text}&rdquo;</p>}
          {f.kind === "reads" && (
            <ol className="space-y-3">
              {f.lines.map((l) => (
                <li key={l} className="flex items-center gap-3 font-mono text-[0.8125rem] text-white">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--v9-ice) text-(--v9-ink)" aria-hidden="true">
                    <Check size={11} weight="bold" />
                  </span>
                  {l}
                </li>
              ))}
            </ol>
          )}
          {f.kind === "answer" && (
            <>
              <p className="text-[0.9375rem] leading-[1.6] text-white sm:text-[1rem]">{f.text}</p>
              <p className="mt-4 flex flex-wrap gap-1.5">
                {f.sources.map((s) => (
                  <span key={s} className="border border-(--v9-ice)/40 px-2 py-0.5 font-mono text-[0.6875rem] text-(--v9-ice)">
                    {s}
                  </span>
                ))}
              </p>
            </>
          )}
          {f.kind === "end" && (
            <>
              <p className="v9-display text-[clamp(2rem,4.4vw,3rem)]">Every answer shows what it read.</p>
              <p className="mt-3 text-[0.9375rem] leading-[1.6]">Built on the Second Brain, so the agent reasons over your own definitions.</p>
            </>
          )}
        </div>
      </div>
      <div className="v9-sprockets" aria-hidden="true" />
    </li>
  );
}

function Intro() {
  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-7">
        <Slate sc="05">AI Agents</Slate>
        <h2 id="v9-agents-title" className="v9-display mt-5 text-[clamp(2.1rem,min(5.4vw,9svh),5rem)]">
          AI Agents that know your business.
        </h2>
      </div>
      <div className="lg:col-span-5">
        <p className="text-pretty max-w-[52ch] text-[0.9375rem] leading-[1.6] text-(--v9-fog) sm:text-[1.0625rem]">
          Built on the Second Brain, Genius agents answer executive questions end to end, reading the systems, tables and
          metrics behind every number.
        </p>
        <p className="v9-tc mt-3 text-(--v9-dim)">Illustrative conversation</p>
      </div>
    </div>
  );
}

export function AgentsV9() {
  const still = useStill();
  const ref = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const p = usePin(ref);
  const dist = useMotionValue(0);
  const [height, setHeight] = useState<string>("360svh");
  const x = useTransform(() => -p.get() * dist.get());

  useEffect(() => {
    if (still) return;
    const measure = () => {
      const t = track.current;
      const f = frame.current;
      if (!t || !f) return;
      const d = Math.max(0, t.scrollWidth - f.clientWidth);
      dist.set(d);
      setHeight(`calc(100svh + ${Math.round(d * 1.15)}px)`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    if (frame.current) ro.observe(frame.current);
    return () => ro.disconnect();
  }, [still, dist]);

  if (still) {
    return (
      <section id="agents" data-scene="SC 05 · AI Agents" className="scroll-mt-12 bg-(--v9-ink) py-24" aria-labelledby="v9-agents-title">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <Intro />
        </div>
        <div className="mt-12 overflow-x-auto px-4 pb-4 sm:px-8" tabIndex={0} role="region" aria-label="Illustrative conversation, scroll sideways">
          <ol className="flex w-max gap-3">
            {FRAMES.map((f, i) => (
              <FrameCard key={i} f={f} i={i} />
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="agents" data-scene="SC 05 · AI Agents" className="relative scroll-mt-0 bg-(--v9-ink)" style={{ height }} aria-labelledby="v9-agents-title">
      <div ref={frame} className="sticky top-0 flex h-svh flex-col overflow-hidden pb-12 pt-16 sm:pb-14 sm:pt-20">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8">
          <Intro />
        </div>
        <div className="mt-auto">
          <motion.ol ref={track} className="flex w-max gap-3 px-4 will-change-transform sm:px-8" style={{ x }}>
            {FRAMES.map((f, i) => (
              <FrameCard key={i} f={f} i={i} />
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
