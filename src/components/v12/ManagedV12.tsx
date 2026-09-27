"use client";

import { useEffect, useState } from "react";
import { Check } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { Illustrative, SectionHead, Tile, TileHead, useInView } from "./ui";

const STEPS = [
  { name: "Design", body: "We map your systems, data and decisions, and design the target architecture." },
  { name: "Build", body: "We connect, engineer, model and deploy every layer, on the Genius Portal." },
  { name: "Run", body: "We host, monitor and support it, with clear service levels." },
  { name: "Improve", body: "We keep extending metrics, dashboards and agents as the business changes." },
];

const INCLUDED = ["Implementation", "Hosting", "Monitoring", "Security", "Support", "Continuous improvement"];

/** Illustrative health bars: deterministic pattern, one amber day resolved. */
const HEALTH = Array.from({ length: 42 }, (_, i) => (i === 17 ? "warn" : "ok"));

function Lifecycle() {
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const [step, setStep] = useState(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!inView || reduce || touched) return;
    const id = setTimeout(() => setStep((s) => (s + 1) % STEPS.length), 3200);
    return () => clearTimeout(id);
  }, [inView, reduce, touched, step]);

  const s = STEPS[step];
  return (
    <div ref={ref}>
      <TileHead dark label="The engagement" />
      <ol className="relative mt-6 grid grid-cols-4 gap-1.5" aria-label="Engagement lifecycle">
        {STEPS.map((x, i) => {
          const on = i === step;
          const past = i < step;
          return (
            <li key={x.name}>
              <button
                type="button"
                aria-current={on ? "step" : undefined}
                onClick={() => {
                  setTouched(true);
                  setStep(i);
                }}
                className={`w-full rounded-[12px] px-2 py-3 text-left transition-colors duration-300 sm:px-3 ${on ? "bg-(--lime) text-(--ink)" : past ? "bg-white/[0.1] text-white" : "bg-white/[0.05] text-white/60 hover:text-white"}`}
              >
                <span className="v12-mono block text-[0.6875rem] opacity-70">0{i + 1}</span>
                <span className="mt-1 block truncate text-[0.875rem] font-semibold sm:text-[0.9375rem]">{x.name}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
        <div className="h-full rounded-full bg-(--lime) transition-[width] duration-700 ease-[var(--spring)]" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </div>
      <div key={s.name} className="v12-intro mt-6 [--d:0ms]" aria-live="polite">
        <p className="text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-tight tracking-[-0.035em] text-white">We {s.name.toLowerCase()} it.</p>
        <p className="mt-2 max-w-[44ch] leading-[1.6] text-white/65">{s.body}</p>
      </div>
    </div>
  );
}

export function ManagedV12() {
  return (
    <section id="managed" className="scroll-mt-24 py-20 sm:py-28" aria-labelledby="v12-managed-title">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <SectionHead
          id="v12-managed-title"
          index="06"
          label="Managed service"
          title="Fully managed by Genius Lab."
          lead={<>You don&rsquo;t need to hire a data team, stitch tools together or maintain infrastructure. We implement everything, hand it over ready to use, and keep it running.</>}
        />
        <div className="mt-12 grid gap-3 sm:gap-4 lg:grid-cols-12">
          <Tile dark className="p-5 sm:p-7 lg:col-span-7 lg:row-span-2">
            <Lifecycle />
          </Tile>

          <Tile delay={80} className="p-5 sm:p-6 lg:col-span-5">
            <TileHead
              label="Service health · 6 weeks"
              right={
                <span className="v12-chip bg-(--lime) text-(--ink)">
                  <span className="v12-live" aria-hidden="true" />
                  Monitored
                </span>
              }
            />
            <div className="mt-5 flex h-10 items-stretch gap-[3px]" role="img" aria-label="Illustrative service health: forty-two days, all healthy except one resolved warning.">
              {HEALTH.map((h, i) => (
                <span key={i} className={`flex-1 rounded-[2px] ${h === "warn" ? "bg-(--coral)" : "bg-(--lime)"} transition-transform duration-300 hover:scale-y-110`} />
              ))}
            </div>
            <p className="mt-3 flex items-center justify-between text-[0.75rem] text-(--ink-3)">
              <span>Hosting, monitoring and support, handled</span>
              <Illustrative />
            </p>
          </Tile>

          <Tile delay={140} className="p-5 sm:p-6 lg:col-span-5">
            <TileHead label="Included in every engagement" />
            <ul className="mt-5 grid grid-cols-1 gap-1.5 min-[420px]:grid-cols-2" aria-label="Included">
              {INCLUDED.map((x) => (
                <li key={x} className="v12-well flex items-center gap-2.5 px-3 py-2.5 text-[0.875rem] font-medium">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--ink) text-(--lime)" aria-hidden="true">
                    <Check size={11} weight="bold" />
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </Tile>
        </div>
      </div>
    </section>
  );
}
