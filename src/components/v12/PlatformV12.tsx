"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, Check, CircleNotch } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { Illustrative, SectionHead, Segmented, Tile, useInView } from "./ui";

function LayerHead({ n, name, role, body, gives, dark = false }: { n: string; name: string; role: string; body: string; gives: string[]; dark?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className={`v12-label ${dark ? "text-(--lime)" : "text-(--blue)"}`}>Layer {n}</span>
        <Illustrative dark={dark} />
      </div>
      <h3 className={`mt-4 text-[1.625rem] font-semibold leading-tight tracking-[-0.03em] ${dark ? "text-white" : ""}`}>{name}</h3>
      <p className={`mt-1 font-medium ${dark ? "text-white/80" : "text-(--ink)"}`}>{role}</p>
      <p className={`text-pretty mt-3 max-w-[52ch] text-[0.9375rem] leading-[1.65] ${dark ? "text-white/60" : "text-(--ink-2)"}`}>{body}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${name} delivers`}>
        {gives.map((g) => (
          <li key={g} className={`v12-chip ${dark ? "bg-white/10 text-white/80" : "bg-(--blue-soft) text-(--blue-ink)"}`}>
            {g}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- 01 Data Engineering: pipelines that run, test and publish ---------- */

const PIPES = [
  { src: "erp.orders", dst: "model.sales" },
  { src: "crm.accounts", dst: "model.customers" },
  { src: "gl.entries", dst: "model.finance" },
  { src: "wh.stock", dst: "model.inventory" },
];
const STAGES = ["Extract", "Model", "Test", "Publish"];

function Pipelines() {
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  // tick walks every pipe through every stage, one pipe at a time.
  const total = PIPES.length * STAGES.length;
  const [tick, setTick] = useState(total);
  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setTick((t) => (t >= total + 3 ? 0 : t + 1)), 520);
    return () => clearInterval(id);
  }, [inView, reduce, total]);

  return (
    <div ref={ref} className="v12-well mt-6 p-3 sm:p-4">
      <div className="hidden grid-cols-[1.2fr_repeat(4,1fr)] gap-2 px-2 pb-2 sm:grid">
        <span className="v12-label text-(--ink-3)">Pipeline</span>
        {STAGES.map((s) => (
          <span key={s} className="v12-label text-(--ink-3)">
            {s}
          </span>
        ))}
      </div>
      <ul className="grid gap-1.5">
        {PIPES.map((p, pi) => {
          const done = Math.max(0, Math.min(STAGES.length, tick - pi * STAGES.length));
          const running = done < STAGES.length && tick >= pi * STAGES.length;
          return (
            <li key={p.src} className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-[10px] bg-white px-3 py-2.5 shadow-[0_0_0_1px_var(--rule)] sm:grid-cols-[1.2fr_repeat(4,1fr)]">
              <span className="v12-mono min-w-0 truncate text-[0.75rem]">
                {p.src}
                <span className="text-(--ink-3)"> → {p.dst}</span>
              </span>
              <span className="v12-mono text-[0.6875rem] sm:hidden">
                {done === STAGES.length ? <span className="text-(--lime-ink)">published</span> : running ? <span className="text-(--blue)">{STAGES[done].toLowerCase()}</span> : <span className="text-(--ink-3)">queued</span>}
              </span>
              {STAGES.map((s, si) => {
                const ok = si < done;
                const now = running && si === done;
                return (
                  <span key={s} className="hidden items-center sm:flex">
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full transition-[background-color,transform] duration-500 ease-[var(--spring)] ${
                        ok ? "scale-100 bg-(--lime) text-(--ink)" : now ? "scale-110 bg-(--blue) text-white" : "scale-90 bg-(--ground-2) text-transparent"
                      }`}
                      aria-hidden="true"
                    >
                      {ok ? <Check size={11} weight="bold" /> : now ? <CircleNotch size={11} weight="bold" className="motion-safe:animate-spin" /> : null}
                    </span>
                  </span>
                );
              })}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 flex items-center justify-between px-1 text-[0.75rem] text-(--ink-3)">
        <span>Tested like software, on every run</span>
        <span className="v12-mono">{Math.min(tick, total)} / {total} steps</span>
      </p>
    </div>
  );
}

/* ---------- 02 Analytics: what happened, why, what next ---------- */

type Lens = "what" | "why" | "next";
const ACTUAL = [42, 44, 43, 47, 49, 48, 52, 55, 54, 58];
const FORECAST = [58, 60, 63, 65];
const DRIVERS = [
  { k: "Volume", v: 6.1 },
  { k: "Price", v: 3.4 },
  { k: "Mix", v: -1.2 },
  { k: "Freight", v: -2.3 },
];

function pts(vals: number[], x0: number, dx: number, H: number, lo: number, hi: number) {
  return vals.map((v, i) => `${(x0 + i * dx).toFixed(1)},${(H - ((v - lo) / (hi - lo)) * H).toFixed(1)}`).join(" ");
}

function AnalyticsChart() {
  const [lens, setLens] = useState<Lens>("what");
  const W = 320;
  const H = 130;
  const lo = 36;
  const hi = 68;
  const dx = W / (ACTUAL.length + FORECAST.length - 2);
  const actual = pts(ACTUAL, 0, dx, H, lo, hi);
  const fc = pts(FORECAST, (ACTUAL.length - 1) * dx, dx, H, lo, hi);
  const labels: Record<Lens, string> = {
    what: "Illustrative line chart: output rising over ten periods.",
    why: "Illustrative driver bars: volume and price add, mix and freight subtract.",
    next: "Illustrative forecast: the trend continues upward for four more periods.",
  };

  return (
    <div className="mt-6">
      <Segmented
        size="sm"
        label="Analytics lens"
        value={lens}
        onChange={setLens}
        options={[
          { id: "what", label: "What happened" },
          { id: "why", label: "Why" },
          { id: "next", label: "What next" },
        ]}
      />
      <div className="v12-well relative mt-3 h-[172px] overflow-hidden p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full overflow-visible" preserveAspectRatio="none" role="img" aria-label={labels[lens]}>
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="var(--rule-2)" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="2 4" />
          ))}
          <polyline
            points={actual}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            className="transition-opacity duration-500"
            opacity={lens === "why" ? 0.15 : 1}
          />
          <polyline
            points={fc}
            fill="none"
            stroke="var(--blue)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="4 4"
            className="transition-opacity duration-500"
            opacity={lens === "next" ? 1 : 0}
          />
        </svg>
        {/* Driver bars sit over the chart in the "why" lens. */}
        <ul className={`absolute inset-4 grid grid-cols-4 items-end gap-3 transition-opacity duration-500 ${lens === "why" ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={lens !== "why"}>
          {DRIVERS.map((d) => (
            <li key={d.k} className="flex h-full flex-col items-center justify-end gap-1.5">
              <span className={`v12-mono text-[0.6875rem] ${d.v > 0 ? "text-(--blue)" : "text-(--coral)"}`}>
                {d.v > 0 ? "+" : ""}
                {d.v.toFixed(1)}
              </span>
              <span
                className={`w-full max-w-[44px] rounded-[5px] transition-[height] duration-700 ease-[var(--spring)] ${d.v > 0 ? "bg-(--blue)" : "bg-(--coral)"}`}
                style={{ height: lens === "why" ? `${Math.round(Math.abs(d.v) * 12)}%` : "0%" }}
              />
              <span className="text-[0.6875rem] text-(--ink-2)">{d.k}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- 03 BI: one definition behind every report ---------- */

const REPORTS = ["Board pack", "Ops dashboard", "Finance report"];
const BEFORE = [14.9, 13.6, 14.2];

function OneDefinition() {
  const [mode, setMode] = useState<"before" | "after">("before");
  const after = mode === "after";
  return (
    <div className="mt-6">
      <Segmented
        size="sm"
        label="Definitions"
        value={mode}
        onChange={setMode}
        options={[
          { id: "before", label: "Before" },
          { id: "after", label: "After" },
        ]}
      />
      <ul className="mt-3 grid gap-1.5" aria-live="polite">
        {REPORTS.map((r, i) => {
          const v = after ? 14.2 : BEFORE[i];
          return (
            <li key={r} className="v12-well flex items-center justify-between gap-3 px-3.5 py-2.5">
              <span className="text-[0.875rem] font-medium">{r}</span>
              <span className="flex items-center gap-2.5">
                <span className="v12-tabnum text-[1.0625rem] font-semibold tracking-[-0.02em]">${v.toFixed(1)}M</span>
                <span className={`v12-chip transition-colors duration-300 ${after ? "bg-(--lime) text-(--ink)" : i === 2 ? "bg-(--ground-2) text-(--ink-2)" : "bg-(--coral-soft) text-(--coral)"}`}>
                  {after ? "Revenue v1" : ["Revenue*", "Rev. (ops)", "Revenue"][i]}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[0.8125rem] text-(--ink-3)">{after ? "One governed definition. Same number, same time, everywhere." : "Three reports, three answers to the same question."}</p>
    </div>
  );
}

/* ---------- 04 AI: a reasoning trace ---------- */

const TRACE = [
  { k: "Question", v: "Why is Northeast margin down?" },
  { k: "Reads", v: "finance.gl_entries, crm.deals" },
  { k: "Applies", v: "metric: gross_margin (governed)" },
  { k: "Finds", v: "Discounting up in two regions" },
  { k: "Acts", v: "Drafts a note to the regional lead" },
];

function Trace() {
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLOListElement>(0.3);
  const [step, setStep] = useState(TRACE.length);
  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setStep((s) => (s >= TRACE.length + 2 ? 0 : s + 1)), 900);
    return () => clearInterval(id);
  }, [inView, reduce]);

  return (
    <ol ref={ref} className="mt-6 grid gap-1.5" aria-label="Illustrative reasoning trace">
      {TRACE.map((t, i) => {
        const on = i < step;
        return (
          <li
            key={t.k}
            className={`grid grid-cols-[5.5rem_1fr] items-center gap-3 rounded-[10px] px-3 py-2 transition-[background-color,opacity,translate] duration-500 ease-[var(--spring)] ${
              on ? "translate-x-0 bg-white/[0.07] opacity-100" : "-translate-x-1 bg-transparent opacity-35"
            }`}
          >
            <span className={`v12-label ${i === TRACE.length - 1 && on ? "text-(--lime)" : "text-white/45"}`}>{t.k}</span>
            <span className="v12-mono truncate text-[0.75rem] text-white/85">{t.v}</span>
          </li>
        );
      })}
    </ol>
  );
}

function StackFlow() {
  const items: ReactNode[] = ["Data Engineering", "Analytics", "Business Intelligence", "Artificial Intelligence"];
  return (
    <ol className="flex flex-wrap items-center gap-1.5" aria-label="Each layer builds on the one beneath it">
      {items.map((x, i) => (
        <li key={i} className="flex items-center gap-1.5">
          <span className="v12-chip h-7 bg-white px-3 text-[0.75rem] text-(--ink) shadow-[0_0_0_1px_var(--rule)]">
            <span className="text-(--blue)">0{i + 1}</span> {x}
          </span>
          <ArrowRight size={12} className="text-(--ink-3)" aria-hidden="true" />
        </li>
      ))}
      <li>
        <span className="v12-chip h-7 bg-(--ink) px-3 text-[0.75rem] text-(--lime)">Better decisions</span>
      </li>
    </ol>
  );
}

export function PlatformV12() {
  return (
    <section id="platform" className="scroll-mt-24 py-20 sm:py-28" aria-labelledby="v12-platform-title">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <SectionHead
          id="v12-platform-title"
          index="02"
          label="Platform"
          title={<>One intelligence and execution layer across your&nbsp;business.</>}
          lead="Not four products. Every layer is built on the one beneath it, and the top of the stack is a better decision."
        />

        <div className="mt-12 grid gap-3 sm:gap-4 lg:grid-cols-12">
          <Tile className="p-6 sm:p-7 lg:col-span-7">
            <LayerHead
              n="01"
              name="Data Engineering"
              role="The foundation."
              body="We connect your systems and engineer their data into one governed, reliable foundation: integration, pipelines, modeling and quality."
              gives={["Connected systems", "A unified data platform", "Trusted, tested pipelines"]}
            />
            <Pipelines />
          </Tile>

          <Tile delay={80} className="p-6 sm:p-7 lg:col-span-5">
            <LayerHead
              n="02"
              name="Analytics"
              role="Organized data becomes understanding."
              body="Analysis and modeling explain what is happening, why it is happening and what is likely to happen next."
              gives={["Performance analysis", "Forecasts and drivers", "Customer and operational insight"]}
            />
            <AnalyticsChart />
          </Tile>

          <Tile className="p-6 sm:p-7 lg:col-span-5">
            <LayerHead
              n="03"
              name="Business Intelligence"
              role="Understanding becomes visible."
              body="One set of definitions behind every dashboard and report, so leadership sees the same numbers, at the same time."
              gives={["Executive dashboards", "Shared metrics and KPIs", "Self-service reporting"]}
            />
            <OneDefinition />
          </Tile>

          <Tile dark delay={80} className="p-6 sm:p-7 lg:col-span-7">
            <div className="grid gap-6 md:grid-cols-[1fr_1.05fr] md:gap-8">
              <LayerHead
                dark
                n="04"
                name="Artificial Intelligence"
                role="Visibility gains context and reasoning."
                body="AI learns your business context and becomes its Second Brain. AI Agents reason across systems, tables, metrics and processes to answer and act."
                gives={["Second Brain", "AI Agents", "Orchestrated execution"]}
              />
              <div className="md:pt-8">
                <Trace />
              </div>
            </div>
          </Tile>

          <Tile className="flex flex-col gap-6 p-6 sm:p-7 lg:col-span-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[46ch]">
              <p className="v12-label text-(--ink-3)">The outcome</p>
              <h3 className="mt-3 text-[clamp(1.5rem,2.6vw,2.125rem)] font-semibold leading-tight tracking-[-0.035em]">Better business decisions</h3>
              <p className="mt-2 text-[0.9375rem] leading-[1.65] text-(--ink-2)">
                Each layer builds on the one beneath it. Together they give executives clear insight, full visibility and the confidence to act.
              </p>
            </div>
            <StackFlow />
          </Tile>
        </div>
      </div>
    </section>
  );
}
