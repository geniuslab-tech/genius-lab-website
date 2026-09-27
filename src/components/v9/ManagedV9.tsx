"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Slate, useStill } from "./shared";

const STEPS = [
  { name: "Design", body: "We map your systems, data and decisions, and design the target architecture." },
  { name: "Build", body: "We connect, engineer, model and deploy every layer, on the Genius Portal." },
  { name: "Run", body: "We host, monitor and support it, with clear service levels." },
  { name: "Improve", body: "We keep extending metrics, dashboards and agents as the business changes." },
];

const INCLUDED = ["Implementation", "Hosting", "Monitoring", "Security", "Support", "Continuous improvement"];

const SEGMENTS = [
  { name: "Investment Firms", body: "One live view across every portfolio company, with value creation tracked against the plan.", outcomes: ["Portfolio monitoring", "Value creation plans", "Board-ready reporting"] },
  { name: "M&A Teams", body: "Diligence on real data, then integration that connects two companies' systems from day one.", outcomes: ["Data-driven diligence", "Day-one integration", "Synergy tracking"] },
  { name: "Multi-Entity Companies", body: "Every entity, currency and ledger consolidated into one trusted group picture.", outcomes: ["Automated consolidation", "Entity comparisons", "Group-wide KPIs"] },
  { name: "Operating Companies", body: "Daily operations run on shared numbers, with agents that flag what needs attention.", outcomes: ["Operational dashboards", "Forecasting", "Proactive alerts"] },
];

/** SC 08: the service lifecycle, its timeline drawn by the scroll. */
export function ManagedV9() {
  const still = useStill();
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="managed" data-scene="SC 08 · Fully managed" className="scroll-mt-12 bg-(--v9-navy-2) py-24 sm:py-32" aria-labelledby="v9-managed-title">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Slate sc="08">Managed service</Slate>
            <h2 id="v9-managed-title" className="v9-display mt-5 text-[clamp(2.4rem,6vw,5.5rem)]">
              Fully managed by Genius Lab.
            </h2>
          </div>
          <p className="text-pretty max-w-[52ch] leading-[1.7] text-(--v9-fog) lg:col-span-5">
            You don&rsquo;t need to hire a data team, stitch tools together or maintain infrastructure. We implement
            everything, hand it over ready to use, and keep it running.
          </p>
        </div>

        <ol ref={ref} className="relative mt-16 grid gap-10 pl-8 sm:grid-cols-2 sm:pl-0 lg:grid-cols-4 lg:gap-8">
          <span className="absolute bottom-0 left-[0.55rem] top-0 w-px bg-white/12 sm:hidden" aria-hidden="true">
            <motion.span className="absolute inset-0 origin-top bg-(--v9-ice)" style={still ? undefined : { scaleY: draw }} />
          </span>
          <span className="absolute left-0 right-0 top-[0.55rem] hidden h-px bg-white/12 lg:block" aria-hidden="true">
            <motion.span className="absolute inset-0 origin-left bg-(--v9-ice)" style={still ? undefined : { scaleX: draw }} />
          </span>
          {STEPS.map((s, i) => (
            <li key={s.name} className="relative">
              <span className="absolute -left-8 top-0 h-[1.1rem] w-[1.1rem] rounded-full border border-(--v9-ice) bg-(--v9-navy-2) sm:static sm:block" aria-hidden="true" />
              <p className="v9-tc mt-0 text-(--v9-dim) sm:mt-6">Step 0{i + 1}</p>
              <p className="v9-display mt-2 text-[2.25rem]">We {s.name.toLowerCase()} it.</p>
              <p className="mt-2 max-w-[32ch] leading-[1.65] text-(--v9-fog)">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 flex flex-col gap-5 border-y border-(--v9-rule) py-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="v9-tc text-(--v9-dim)">Included in every engagement</p>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3 lg:flex lg:gap-8" aria-label="Included">
            {INCLUDED.map((x) => (
              <li key={x} className="flex items-center gap-2.5 text-[0.9375rem] font-medium">
                <span className="h-1.5 w-1.5 bg-(--v9-ice)" aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** SC 09: who it is for, as a cast list. */
export function SegmentsV9() {
  return (
    <section id="segments" data-scene="SC 09 · The cast" className="scroll-mt-12 bg-(--v9-ink) py-24 sm:py-32" aria-labelledby="v9-segments-title">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <Slate sc="09">Solutions</Slate>
        <h2 id="v9-segments-title" className="v9-display mt-5 max-w-[18ch] text-[clamp(2.4rem,6vw,5.5rem)]">
          Value creation for every stage of growth.
        </h2>
        <ul className="mt-14 border-b border-(--v9-rule)">
          {SEGMENTS.map((s, i) => (
            <li key={s.name} data-reveal="up" className="group grid gap-4 border-t border-(--v9-rule) py-8 md:grid-cols-12 md:gap-8">
              <span className="v9-tc text-(--v9-dim) md:col-span-1">0{i + 1}</span>
              <h3 className="v9-display text-[clamp(2rem,4vw,3.5rem)] transition-colors duration-300 group-hover:text-(--v9-ice) md:col-span-5">{s.name}</h3>
              <p className="max-w-[44ch] leading-[1.65] text-(--v9-fog) md:col-span-3">{s.body}</p>
              <ul className="space-y-1.5 text-[0.9375rem] md:col-span-3">
                {s.outcomes.map((o) => (
                  <li key={o} className="flex items-center gap-2.5">
                    <span className="h-px w-3 bg-(--v9-ice)" aria-hidden="true" />
                    {o}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
