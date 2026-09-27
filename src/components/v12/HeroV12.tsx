"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, MagnifyingGlass } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { Illustrative, Magnetic, Ticker, Tile, TileHead, useInView } from "./ui";

/** Illustrative weekly revenue series, $M. Deterministic so server and client agree. */
const SERIES = [11.2, 11.6, 11.4, 11.9, 12.3, 12.1, 12.6, 12.9, 12.7, 13.2, 13.5, 13.4, 13.8, 14.1, 13.9, 14.4, 14.6, 14.9];
const WINDOW = 12;

const SYSTEMS = [
  { name: "ERP", obj: "erp.orders" },
  { name: "CRM", obj: "crm.accounts" },
  { name: "Finance", obj: "gl.entries" },
  { name: "Warehouse", obj: "wh.stock" },
  { name: "Sheets", obj: "fp&a.plan" },
  { name: "Cloud apps", obj: "hr.people" },
];

const QUESTIONS = [
  "Why did EBITDA margin drop in Q3?",
  "Which customers are paying late this month?",
  "What will cash look like in 90 days?",
  "Where is freight cost rising fastest?",
];

/** Placeholder client marks, to be replaced with approved logos. */
const LOGOS = ["Vanta Group", "Helios", "Caldera", "Orbis", "Stratum", "Northpeak"];

function LiveKpi() {
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setT((x) => (x + 1) % (SERIES.length - WINDOW + 1)), 2200);
    return () => clearInterval(id);
  }, [inView, reduce]);

  const win = SERIES.slice(t, t + WINDOW);
  const now = win[win.length - 1];
  const prev = win[win.length - 2];
  const delta = ((now - prev) / prev) * 100;
  const max = 15.2;
  const min = 10.4;

  return (
    <div ref={ref} className="flex h-full flex-col">
      <TileHead
        label="Group revenue · week"
        right={
          <span className="v12-chip bg-(--lime) text-(--ink)">
            <span className="v12-live" aria-hidden="true" />
            Live
          </span>
        }
      />
      <p className="mt-6 flex items-baseline gap-3" aria-live="off">
        <span className="text-[clamp(2.75rem,5vw,4rem)] font-semibold leading-none tracking-[-0.045em]">
          <Ticker value={now} decimals={1} prefix="$" suffix="M" />
        </span>
        <span className={`v12-mono text-[0.8125rem] ${delta >= 0 ? "text-(--blue)" : "text-(--coral)"}`}>
          {delta >= 0 ? "+" : ""}
          {delta.toFixed(1)}%
        </span>
      </p>
      <p className="mt-2 text-[0.875rem] text-(--ink-2)">One definition of revenue, reconciled across ERP, CRM and finance.</p>

      <div className="mt-auto pt-8">
        <div className="flex h-[132px] items-end gap-[5px]" role="img" aria-label="Illustrative bar chart of weekly revenue, rising gently over twelve weeks.">
          {win.map((v, i) => {
            const h = Math.round(((v - min) / (max - min)) * 100);
            const last = i === win.length - 1;
            return (
              <span
                key={i}
                className={`flex-1 rounded-[4px] transition-[height] duration-700 ease-[var(--spring)] ${last ? "bg-(--blue)" : "bg-(--ground-2)"}`}
                style={{ height: `${h}%` }}
              />
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-(--rule) pt-4">
          <span className="flex flex-wrap gap-1.5">
            {["ERP", "CRM", "GL"].map((s) => (
              <span key={s} className="v12-chip bg-(--ground) text-(--ink-2)">
                {s}
              </span>
            ))}
          </span>
          <Illustrative />
        </div>
      </div>
    </div>
  );
}

function SystemsTile() {
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const [k, setK] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setK((x) => x + 1), 1400);
    return () => clearInterval(id);
  }, [inView, reduce]);
  const syncing = k % SYSTEMS.length;

  return (
    <div ref={ref} className="flex h-full flex-col">
      <TileHead label="Systems connected" right={<span className="v12-mono text-[0.75rem] text-(--ink-2)">6 / 6</span>} />
      <ul className="mt-5 grid gap-1.5">
        {SYSTEMS.map((s, i) => {
          const on = !reduce && inView && i === syncing;
          return (
            <li key={s.name} className="flex items-center justify-between gap-3 rounded-[10px] px-2.5 py-1.5 transition-colors duration-300 hover:bg-(--ground)">
              <span className="flex min-w-0 items-center gap-2.5">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${on ? "bg-(--blue)" : "bg-(--lime-ink)/60"}`} aria-hidden="true" />
                <span className="text-[0.875rem] font-medium">{s.name}</span>
                <span className="v12-mono truncate text-[0.6875rem] text-(--ink-3)">{s.obj}</span>
              </span>
              <span className={`v12-mono shrink-0 text-[0.6875rem] ${on ? "text-(--blue)" : "text-(--ink-3)"}`}>{on ? "syncing" : "in sync"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function AskTile() {
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const [q, setQ] = useState(0);
  const [n, setN] = useState(QUESTIONS[0].length);

  useEffect(() => {
    if (!inView || reduce) return;
    const full = QUESTIONS[q].length;
    const id = setTimeout(
      () => {
        if (n < full) setN(n + 1);
        else {
          setQ((q + 1) % QUESTIONS.length);
          setN(0);
        }
      },
      n < full ? 38 : 2600,
    );
    return () => clearTimeout(id);
  }, [inView, reduce, q, n]);

  return (
    <div ref={ref} className="flex h-full flex-col">
      <TileHead label="Ask the Second Brain" />
      <a
        href="#brain"
        className="group mt-5 flex min-h-[3.25rem] items-start gap-2.5 rounded-[14px] bg-(--ground) px-3.5 py-3 shadow-[inset_0_0_0_1px_var(--rule)] transition-shadow hover:shadow-[inset_0_0_0_1px_var(--blue)]"
      >
        <MagnifyingGlass size={16} className="mt-0.5 shrink-0 text-(--ink-3)" aria-hidden="true" />
        <span className="text-[0.9375rem] leading-snug">
          <span className="sr-only">Example question: {QUESTIONS[q]}. See how the Second Brain answers.</span>
          <span aria-hidden="true">
            {QUESTIONS[q].slice(0, n)}
            <span className="v12-caret" />
          </span>
        </span>
      </a>
      <p className="mt-auto flex items-center justify-between pt-5 text-[0.8125rem] text-(--ink-2)">
        <span>Plain-language questions, answered from your data.</span>
        <ArrowUpRight size={16} className="shrink-0 text-(--blue)" aria-hidden="true" />
      </p>
    </div>
  );
}

export function HeroV12() {
  return (
    <section id="top" className="relative pt-28 sm:pt-32" aria-labelledby="v12-hero-title">
      {/* Fine engineering grid under the headline, faded out before the tiles. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[640px] opacity-70 [background-image:linear-gradient(var(--rule)_1px,transparent_1px),linear-gradient(90deg,var(--rule)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,#000_10%,transparent_85%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="v12-intro inline-flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-1.5 pr-3.5 text-[0.8125rem] font-medium text-(--ink-2) shadow-[0_0_0_1px_var(--rule)] [--d:0ms]">
              <span className="v12-chip h-6 bg-(--ink) text-white">Genius Lab</span>
              One partner. One platform. One source of truth.
            </p>
            <h1 id="v12-hero-title" className="v12-display v12-intro mt-7 max-w-[15ch] text-[clamp(2.6rem,6.4vw,5.75rem)] [--d:80ms]">
              Transform Business Complexity into <span className="text-(--blue)">Strategic Advantage</span>
            </h1>
          </div>
          <div className="v12-intro lg:col-span-4 lg:pb-2 [--d:180ms]">
            <p className="text-[1.125rem] font-semibold leading-snug tracking-[-0.015em]">A fully managed intelligence and execution layer for your entire business.</p>
            <p className="text-pretty mt-3 text-[1.0625rem] leading-[1.6] text-(--ink-2)">
              We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the software you already rely on.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Magnetic>
                <a href="#contact" className="v12-btn v12-btn-primary group">
                  Book a demo
                  <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#action" className="v12-btn v12-btn-ghost">
                  See it in action
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-3 sm:gap-4 md:grid-cols-6 lg:mt-16 lg:grid-cols-12">
          <Tile className="p-5 sm:p-6 md:col-span-6 lg:col-span-5 lg:row-span-2 lg:min-h-[420px]">
            <LiveKpi />
          </Tile>
          <Tile delay={70} className="p-5 sm:p-6 md:col-span-3 lg:col-span-4">
            <SystemsTile />
          </Tile>
          <Tile delay={140} className="p-5 sm:p-6 md:col-span-3 lg:col-span-3">
            <AskTile />
          </Tile>
          <Tile delay={200} className="flex flex-col justify-center gap-4 overflow-hidden px-5 py-5 sm:px-6 md:col-span-6 lg:col-span-7">
            <TileHead label="Trusted by operators, manufacturers and value creation teams" right={<Illustrative>Placeholders</Illustrative>} />
            <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
              <ul className="v12-marquee flex w-max gap-12" aria-label="Client logos (placeholders)">
                {[...LOGOS, ...LOGOS].map((l, i) => (
                  <li key={i} aria-hidden={i >= LOGOS.length || undefined} className="whitespace-nowrap text-[1.0625rem] font-semibold tracking-[-0.02em] text-(--ink-3)">
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </Tile>
        </div>
      </div>
    </section>
  );
}
