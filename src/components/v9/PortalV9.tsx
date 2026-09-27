"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { BrandLogo } from "@/components/v2/ui";
import { Slate, useStill } from "./shared";

const MODULES = [
  { name: "Connectors", body: "Ready integrations for ERP, CRM, finance, files and APIs." },
  { name: "Data Transformation", body: "Pipelines that clean, model and unify data, tested like software." },
  { name: "Analytics", body: "Dashboards, drill-downs and forecasts on one shared model." },
  { name: "Governance", body: "Definitions, lineage, access and audit trails in one place." },
  { name: "Automation", body: "Alerts, workflows and scheduled actions across your systems." },
  { name: "AI Agents", body: "Agents that read the Second Brain and answer or act." },
];

const SYSTEMS = ["ERP", "CRM", "Warehouse", "BI tools", "Sheets", "Cloud apps"];

/** One module, rolling in like a credit line as it crosses the lower half of the viewport. */
function Row({ m, i, still }: { m: (typeof MODULES)[number]; i: number; still: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.55"] });
  const x = useTransform(scrollYProgress, [0, 1], [i % 2 ? 90 : -90, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.15, 1]);
  return (
    <motion.li
      ref={ref}
      style={still ? undefined : { x, opacity }}
      className="group grid gap-2 border-t border-(--v9-rule) py-6 sm:grid-cols-[4rem_1fr] md:grid-cols-[4rem_1.2fr_1fr] md:items-baseline md:gap-8"
    >
      <span className="v9-tc text-(--v9-dim)">0{i + 1}</span>
      <h3 className="v9-display text-[clamp(2rem,5vw,4.25rem)] text-white transition-colors duration-300 group-hover:text-(--v9-ice)">{m.name}</h3>
      <p className="max-w-[40ch] leading-[1.6] text-(--v9-fog) sm:col-start-2 md:col-start-auto">{m.body}</p>
    </motion.li>
  );
}

export function PortalV9() {
  const still = useStill();
  const band = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: band, offset: ["start 0.9", "center 0.5"] });
  const wire = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="portal" data-scene="SC 07 · The Genius Portal" className="relative scroll-mt-12 overflow-hidden bg-(--v9-ink) py-24 sm:py-32" aria-labelledby="v9-portal-title">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Slate sc="07">The Genius Portal</Slate>
            <h2 id="v9-portal-title" className="v9-display mt-5 max-w-[16ch] text-[clamp(2.4rem,6vw,5.5rem)]">
              Expertise and technology, working as one.
            </h2>
          </div>
          <p className="text-pretty max-w-[52ch] leading-[1.7] text-(--v9-fog) lg:col-span-5">
            Our specialists build on the Genius Portal, our own platform. Everything a client needs to connect, govern and
            run intelligence lives in one place.
          </p>
        </div>

        <ol className="mt-14 border-b border-(--v9-rule)" aria-label="Inside the Genius Portal">
          {MODULES.map((m, i) => (
            <Row key={m.name} m={m} i={i} still={still} />
          ))}
        </ol>

        {/* Building on the software the client already runs. */}
        <div ref={band} className="mt-20 grid gap-10 bg-(--v9-navy) p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <p className="v9-tc text-(--v9-ice)">Integrations</p>
            <p className="v9-display mt-3 text-[clamp(1.9rem,3.2vw,2.75rem)]">Keep the technology that already runs the business.</p>
          </div>
          <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto] lg:col-span-8">
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label="ERP, CRM, data warehouse, BI tools, spreadsheets and cloud apps all connect into Genius Lab.">
              {SYSTEMS.map((s) => (
                <li key={s} className="flex items-center justify-between gap-3 border border-white/12 bg-(--v9-ink)/40 px-4 py-3">
                  <span className="text-[0.9375rem] font-medium">{s}</span>
                  <span className="v9-tc flex items-center gap-1.5 text-(--v9-ice)">
                    <span className="h-1.5 w-1.5 rounded-full bg-(--v9-ice)" aria-hidden="true" />
                    Live
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4 sm:flex-col" aria-hidden="true">
              <span className="relative block h-px w-12 bg-white/15 sm:h-12 sm:w-px">
                <motion.span className="absolute inset-0 origin-left bg-(--v9-ice) sm:hidden" style={still ? undefined : { scaleX: wire }} />
                <motion.span className="absolute inset-0 hidden origin-top bg-(--v9-ice) sm:block" style={still ? undefined : { scaleY: wire }} />
              </span>
              <span className="inline-flex items-center border border-(--v9-ice) px-5 py-4">
                <BrandLogo tone="white" className="h-[13px] w-auto" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
