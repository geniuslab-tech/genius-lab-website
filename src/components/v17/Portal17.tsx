"use client";

import { motion } from "motion/react";
import { BrandLogo } from "@/components/v2/ui";
import { DrawPath, Rise, SectionHead, SPRING, Sticker, type Tint } from "./ui";

const MODULES: { name: string; body: string; tint: Tint }[] = [
  { name: "Connectors", body: "Ready integrations for ERP, CRM, finance, files and APIs.", tint: "sky" },
  { name: "Data Transformation", body: "Pipelines that clean, model and unify data, tested like software.", tint: "sage" },
  { name: "Analytics", body: "Dashboards, drill-downs and forecasts on one shared model.", tint: "ochre" },
  { name: "Governance", body: "Definitions, lineage, access and audit trails in one place.", tint: "terra" },
  { name: "Automation", body: "Alerts, workflows and scheduled actions across your systems.", tint: "sky" },
  { name: "AI Agents", body: "Agents that read the Second Brain and answer or act.", tint: "sage" },
];

const SYSTEMS = ["ERP", "CRM", "Warehouse", "BI tools", "Sheets", "Cloud apps", "Finance", "Files and APIs"];

export function Portal17() {
  return (
    <section id="portal" className="scroll-mt-20 py-24 sm:py-32" aria-labelledby="v17-portal-title">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead
            id="v17-portal-title"
            label="Genius Portal"
            tint="terra"
            title={
              <>
                Expertise and technology, <em>working as one</em>.
              </>
            }
            className="lg:col-span-7"
          />
          <Rise className="lg:col-span-5">
            <p className="max-w-[48ch] text-pretty text-[1.0625rem] leading-[1.7] text-[var(--ink-2)] sm:text-[1.125rem]">
              Our specialists build on the Genius Portal, our own platform. Everything a client needs to connect, govern and run
              intelligence lives in one place.
            </p>
          </Rise>
        </div>

        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3" aria-label="Inside the Genius Portal">
          {MODULES.map((m, i) => (
            <li key={m.name} className={i % 3 === 1 ? "lg:translate-y-8" : ""}>
              <Rise delay={(i % 3) * 0.07}>
                <motion.div
                  whileHover={{ y: -8, rotate: i % 2 ? 1.2 : -1.2 }}
                  transition={SPRING}
                  className={`v17-panel v17-tint-${m.tint} relative flex min-h-[13rem] flex-col p-6 sm:p-7`}
                >
                  <span className="v17-serif text-[2.5rem] leading-none text-[var(--ink)]/35" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <h3 className="v17-display mt-auto pt-8 text-[1.75rem]">{m.name}</h3>
                  <p className="mt-2 max-w-[34ch] leading-[1.6] text-[var(--ink-2)]">{m.body}</p>
                </motion.div>
              </Rise>
            </li>
          ))}
        </ol>

        {/* Building on the software the client already runs. */}
        <Rise className="mt-20 lg:mt-28">
          <div className="v17-panel bg-[var(--paper)] p-6 shadow-[0_0_0_1px_var(--rule)] sm:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-10">
              <div className="lg:w-[20rem] lg:shrink-0">
                <p className="text-[0.8125rem] font-semibold text-[var(--ink-3)]">Integrations</p>
                <p className="v17-display mt-2 text-[clamp(1.6rem,2.6vw,2.1rem)] leading-[1.1]">
                  Keep the technology that <em>already runs</em> the business.
                </p>
              </div>
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="v17-marquee-mask min-w-0 flex-1">
                  <ul
                    className="v17-marquee gap-2.5 py-3"
                    style={{ ["--v17-marquee" as string]: "30s" }}
                    aria-label="ERP, CRM, data warehouse, BI tools, spreadsheets, cloud apps, finance, files and APIs all connect into Genius Lab."
                  >
                    {[...SYSTEMS, ...SYSTEMS].map((s, i) => (
                      <li key={i} aria-hidden={i >= SYSTEMS.length || undefined} className="shrink-0">
                        <Sticker tint={(["sky", "sage", "ochre", "terra"] as const)[i % 4]} rotate={i % 2 ? 2 : -2}>
                          {s}
                        </Sticker>
                      </li>
                    ))}
                  </ul>
                </div>
                <svg viewBox="0 0 60 30" className="hidden h-8 w-14 shrink-0 sm:block" aria-hidden="true" fill="none">
                  <DrawPath d="M2 16 C 18 8, 34 22, 50 14" width={2} />
                  <DrawPath d="M44 8 L52 14 L44 21" width={2} delay={0.9} duration={0.3} />
                </svg>
                <span className="flex h-14 shrink-0 items-center rounded-full bg-[var(--cream)] px-5 shadow-[0_0_0_1.5px_var(--ink)]">
                  <BrandLogo tone="navy" className="h-[12px] w-auto sm:h-[14px]" />
                </span>
              </div>
            </div>
          </div>
        </Rise>
      </div>
    </section>
  );
}
