"use client";

import { useEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight, ChartLineUp, FlowArrow, Lightning, Plugs, Robot, ShieldCheck } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/v2/ui";
import { Heading } from "./ui";

const MODULES = [
  { Icon: Plugs, name: "Connectors", body: "Ready integrations for ERP, CRM, finance, files and APIs.", tint: "from-[#e8f1ff] to-[#f5f5f7]" },
  { Icon: FlowArrow, name: "Data Transformation", body: "Pipelines that clean, model and unify data, tested like software.", tint: "from-[#eef0ff] to-[#f5f5f7]" },
  { Icon: ChartLineUp, name: "Analytics", body: "Dashboards, drill-downs and forecasts on one shared model.", tint: "from-[#e9f7f3] to-[#f5f5f7]" },
  { Icon: ShieldCheck, name: "Governance", body: "Definitions, lineage, access and audit trails in one place.", tint: "from-[#f3eefe] to-[#f5f5f7]" },
  { Icon: Lightning, name: "Automation", body: "Alerts, workflows and scheduled actions across your systems.", tint: "from-[#fff4e6] to-[#f5f5f7]" },
  { Icon: Robot, name: "AI Agents", body: "Agents that read the Second Brain and answer or act.", tint: "from-[#e6f4ff] to-[#f5f5f7]" },
];

const SYSTEMS = ["ERP", "CRM", "Warehouse", "BI tools", "Sheets", "Cloud apps"];

export function PortalV5() {
  const rail = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const update = () => setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const page = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section id="portal" className="scroll-mt-12 overflow-x-clip bg-white py-28 sm:py-40" aria-labelledby="v5-portal-title">
      <div className="mx-auto max-w-[1080px] px-5">
        <Heading
          id="v5-portal-title"
          eyebrow="Genius Portal"
          title="Expertise and technology, working as one."
          lead="Our specialists build on the Genius Portal, our own platform. Everything a client needs to connect, govern and run intelligence lives in one place."
        />
      </div>

      {/* Gallery: starts on the content column, runs to the screen edge. */}
      <ul
        ref={rail}
        aria-label="Inside the Genius Portal"
        className="v5-rail mt-16 flex gap-5 overflow-x-auto pb-4 pl-[max(1.25rem,calc((100vw_-_1080px)/2_+_1.25rem))] scroll-pl-[max(1.25rem,calc((100vw_-_1080px)/2_+_1.25rem))] pr-5 sm:mt-20"
      >
        {MODULES.map(({ Icon, name, body, tint }) => (
          <li key={name} className={`flex h-[26rem] w-[18.5rem] shrink-0 snap-start flex-col justify-between rounded-[28px] bg-gradient-to-b p-8 sm:w-[21rem] ${tint}`}>
            <div>
              <h3 className="v5-display text-[1.75rem] text-graphite">{name}</h3>
              <p className="v5-body mt-3 text-[1.0625rem] text-graphite-2">{body}</p>
            </div>
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-[20px] bg-white text-azure shadow-[0_8px_24px_-8px_rgb(0_0_0/0.12)]">
              <Icon size={30} weight="regular" aria-hidden="true" />
            </span>
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-6 flex max-w-[1080px] justify-end gap-3 px-5">
        {[
          { dir: -1 as const, Icon: CaretLeft, label: "Previous", off: edge.start },
          { dir: 1 as const, Icon: CaretRight, label: "Next", off: edge.end },
        ].map(({ dir, Icon, label, off }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            disabled={off}
            onClick={() => page(dir)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#e8e8ed] text-graphite transition-[background-color,opacity,transform] duration-200 hover:bg-[#dcdce1] active:scale-95 disabled:opacity-40"
          >
            <Icon size={16} weight="bold" aria-hidden="true" />
          </button>
        ))}
      </div>

      {/* Building on the software the client already runs. */}
      <div className="mx-auto mt-28 max-w-[1080px] px-5 text-center">
        <h3 data-reveal="up" className="v5-display mx-auto max-w-[20ch] text-[clamp(1.75rem,3.2vw,2.75rem)] text-graphite">
          Keep the technology that already runs the business.
        </h3>
        <div data-reveal="up" data-delay="100" className="mx-auto mt-12 max-w-[760px]">
          <ul className="flex flex-wrap justify-center gap-3 pb-4" aria-label="Systems that connect into Genius Lab">
            {SYSTEMS.map((s) => (
              <li key={s} className="rounded-full bg-mist px-5 py-2.5 text-[0.9375rem] text-graphite">
                {s}
              </li>
            ))}
          </ul>
          <span className="mx-auto block h-12 w-px bg-gradient-to-b from-hairline to-graphite/40" aria-hidden="true" />
          <div className="mx-auto inline-flex items-center gap-3 rounded-[20px] bg-graphite px-6 py-4 shadow-[0_20px_40px_-20px_rgb(0_0_0/0.4)]">
            <BrandLogo tone="white" className="h-[14px] w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
