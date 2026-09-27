"use client";

import { motion } from "motion/react";
import { DrawPath, Rise, SectionHead, SOFT } from "./ui";

const STEPS = [
  { name: "Design", body: "We map your systems, data and decisions, and design the target architecture." },
  { name: "Build", body: "We connect, engineer, model and deploy every layer, on the Genius Portal." },
  { name: "Run", body: "We host, monitor and support it, with clear service levels." },
  { name: "Improve", body: "We keep extending metrics, dashboards and agents as the business changes." },
];

const INCLUDED = ["Implementation", "Hosting", "Monitoring", "Security", "Support", "Continuous improvement"];

export function Managed17() {
  return (
    <section id="managed" className="scroll-mt-20 py-12 sm:py-16" aria-labelledby="v17-managed-title">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
        <div className="v17-panel bg-[var(--sage-tint)] px-5 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <SectionHead
              id="v17-managed-title"
              label="Managed service"
              tint="sage"
              title={
                <>
                  Fully managed by <em>Genius Lab</em>.
                </>
              }
              className="lg:col-span-7"
            />
            <Rise className="lg:col-span-5">
              <p className="max-w-[46ch] text-pretty text-[1.0625rem] leading-[1.7] text-[var(--ink-2)]">
                You don&rsquo;t need to hire a data team, stitch tools together or maintain infrastructure. We implement everything,
                hand it over ready to use, and keep it running.
              </p>
            </Rise>
          </div>

          {/* The lifecycle: four steps joined by one looping pen line. */}
          <div className="relative mt-14 lg:mt-20">
            <svg
              viewBox="0 0 1000 120"
              preserveAspectRatio="none"
              className="absolute inset-x-0 top-5 hidden h-[7.5rem] w-full lg:block"
              aria-hidden="true"
              fill="none"
            >
              <DrawPath
                d="M60 20 C 160 -4, 240 44, 310 20 S 470 -4, 560 20 S 720 44, 810 20 C 900 0, 980 30, 960 80 C 940 118, 520 124, 90 100 C 40 96, 30 60, 52 34"
                stroke="var(--sage-ink)"
                width={2}
                nonScaling
                duration={2.4}
              />
            </svg>
            <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {STEPS.map((s, i) => (
                <motion.li
                  key={s.name}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ ...SOFT, delay: 0.2 + i * 0.25 }}
                >
                  <span className="relative z-[1] flex size-10 items-center justify-center rounded-full bg-[var(--ink)] text-[0.875rem] font-semibold text-[var(--cream)] shadow-[0_0_0_5px_var(--sage-tint)]">
                    0{i + 1}
                  </span>
                  <p className="v17-display mt-5 text-[1.75rem] lg:mt-16">We {s.name.toLowerCase()} it.</p>
                  <p className="mt-2 max-w-[30ch] leading-[1.6] text-[var(--ink-2)]">{s.body}</p>
                </motion.li>
              ))}
            </ol>
            <p className="v17-hand mt-8 text-[1.0625rem] text-[var(--sage-ink)] lg:absolute lg:-bottom-10 lg:left-[42%] lg:mt-0 lg:rotate-[-2deg]">
              and round again, as the business changes
            </p>
          </div>

          <Rise className="mt-16 lg:mt-24">
            <div className="flex flex-col gap-4 rounded-[1.75rem] bg-[var(--paper)] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
              <p className="shrink-0 text-[0.875rem] font-semibold text-[var(--ink)]">Included in every engagement</p>
              <ul className="flex flex-wrap gap-2" aria-label="Included">
                {INCLUDED.map((x) => (
                  <li key={x} className="rounded-full bg-[var(--sage-tint)] px-3.5 py-1.5 text-[0.875rem] font-medium text-[var(--ink)]">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}
