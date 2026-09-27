"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { useReducedMotion } from "motion/react";
import { Check } from "@phosphor-icons/react";
import { SectionHead, useInView } from "./ui";

const EXPERTISE = [
  ["Data engineering", "Integration, pipelines, modeling, quality"],
  ["Analytics", "Performance, drivers, forecasts"],
  ["Business intelligence", "Dashboards, KPIs, self-service"],
  ["Artificial intelligence", "Second Brain, agents, automation"],
];

const MODULES = ["Connectors", "Data transformation", "Governance", "Analytics", "Automation", "AI Agents"];

const PHASES = [
  {
    id: "assess",
    name: "Assess",
    team: "We map your systems, data and decisions, and the questions leadership needs answered.",
    portal: "A Genius Portal workspace is opened for the engagement, with every system inventoried.",
    get: "A target architecture and a prioritized roadmap.",
  },
  {
    id: "connect",
    name: "Connect",
    team: "We connect the software you already rely on, without ripping anything out.",
    portal: "Connectors and pipelines ingest, clean and test the data on every run.",
    get: "One governed, reliable data foundation.",
  },
  {
    id: "build",
    name: "Build",
    team: "We model the business, define the metrics and build the dashboards and agents.",
    portal: "The data model, dashboards and Genius agents are deployed on the Portal.",
    get: "Executive dashboards and a working Second Brain.",
  },
  {
    id: "run",
    name: "Run",
    team: "We host, monitor and support it, and keep extending it as the business changes.",
    portal: "Monitoring, security, alerts and automations run continuously.",
    get: "A fully managed intelligence and execution layer.",
  },
];

const INCLUDED = ["Implementation", "Hosting", "Monitoring", "Security", "Support", "Continuous improvement"];
const CYCLE = 5000;

export function ServicesV18() {
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!inView || reduce || touched) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % PHASES.length), CYCLE);
    return () => clearTimeout(t);
  }, [inView, reduce, touched, active]);

  const pick = (i: number) => {
    setTouched(true);
    setActive(i);
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let n = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % PHASES.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + PHASES.length) % PHASES.length;
    if (n < 0) return;
    e.preventDefault();
    pick(n);
    document.getElementById(`v18-phase-${n}`)?.focus();
  };
  const P = PHASES[active];

  return (
    <section id="services" className="v18-band on-navy scroll-mt-16 py-24 sm:py-32" aria-labelledby="v18-services-title">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        <SectionHead
          navy
          id="v18-services-title"
          index="05"
          label="Services and technology"
          title="A services team and a product, in one engagement."
          lead="Genius Lab is a technology and data services company that also builds its own technology. Specialists bring the expertise; the Genius Portal carries the work. You never buy one without the other."
        />

        {/* The two halves of the company, joined. */}
        <div className="mt-14 grid gap-4 lg:mt-16 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <div data-rv="" className="rounded-[16px] bg-white/[0.05] p-6 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.1)] sm:p-8">
            <p className="v18-label text-(--sky)">Services · our specialists</p>
            <p className="mt-3 text-[1.375rem] font-bold tracking-[-0.02em]">Expertise across the four layers.</p>
            <dl className="mt-6 grid gap-px overflow-hidden rounded-[10px] bg-white/10">
              {EXPERTISE.map(([k, v]) => (
                <div key={k} className="grid gap-1 bg-(--navy) px-4 py-3 sm:grid-cols-[11rem_1fr] sm:items-baseline sm:gap-4">
                  <dt className="font-semibold">{k}</dt>
                  <dd className="text-[0.875rem] text-white/65">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex items-center justify-center py-1 lg:px-2" aria-hidden="true">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-(--ember) text-[1.25rem] font-bold text-[#1a1205]">+</span>
          </div>
          <div data-rv="" style={{ ["--rd" as string]: "90ms" }} className="rounded-[16px] bg-white p-6 text-(--ink) sm:p-8">
            <p className="v18-label text-(--sky-ink)">Technology · Genius Portal</p>
            <p className="mt-3 text-[1.375rem] font-bold tracking-[-0.02em]">Our own platform, built for this work.</p>
            <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label="Genius Portal modules">
              {MODULES.map((m, i) => (
                <li key={m} className="flex items-center gap-2 rounded-[8px] bg-(--grey) px-3 py-2.5 text-[0.875rem] font-semibold shadow-[inset_0_0_0_1px_var(--rule)]">
                  <span className="v18-mono text-[0.625rem] text-(--ink-3)">0{i + 1}</span>
                  {m}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.875rem] leading-[1.6] text-(--ink-2)">Supports clients, projects, analytics, intelligence and AI initiatives, on top of the software a client already runs.</p>
          </div>
        </div>

        {/* Engagement timeline. */}
        <div ref={ref} className="mt-20 lg:mt-24" data-rv="">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h3 className="text-[1.5rem] font-bold tracking-[-0.02em]">How an engagement runs</h3>
            <p className="v18-label text-white/55">Assess · Connect · Build · Run</p>
          </div>

          <div role="tablist" aria-label="Engagement phases" className="relative mt-8 grid grid-cols-4">
            <span className="absolute left-0 top-[1.125rem] h-px w-3/4 bg-white/15" aria-hidden="true" />
            <span
              className="absolute left-0 top-[1.125rem] h-px bg-(--ember) transition-[width] duration-700 ease-[var(--out)]"
              style={{ width: `${active * 25}%` }}
              aria-hidden="true"
            />
            {PHASES.map((ph, i) => {
              const on = i === active;
              const past = i < active;
              return (
                <button
                  key={ph.id}
                  id={`v18-phase-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="v18-phase-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => pick(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className="relative flex flex-col items-start gap-3 pr-2 text-left"
                >
                  <span
                    className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full font-mono text-[0.75rem] transition-[background-color,color,box-shadow] duration-500 ${
                      on ? "bg-(--ember) text-[#1a1205] shadow-[0_0_0_6px_rgb(242_154_31/0.18)]" : past ? "bg-white text-(--navy)" : "bg-(--navy) text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.3)]"
                    }`}
                  >
                    {past ? <Check size={13} weight="bold" aria-hidden="true" /> : `0${i + 1}`}
                  </span>
                  <span className={`text-[1rem] font-bold sm:text-[1.25rem] ${on ? "text-white" : "text-white/65"}`}>{ph.name}</span>
                  {on && !reduce && !touched && inView && (
                    <span key={`t-${active}`} className="v18-timer absolute -bottom-2 left-0 h-[2px] w-12 bg-(--ember)" style={{ ["--dur" as string]: `${CYCLE}ms` }} aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>

          <div id="v18-phase-panel" role="tabpanel" aria-labelledby={`v18-phase-${active}`} className="mt-10 grid gap-px overflow-hidden rounded-[16px] bg-white/10 md:grid-cols-3">
            {[
              ["Our team", P.team],
              ["Genius Portal", P.portal],
              ["You get", P.get],
            ].map(([k, v], i) => (
              <div key={`${active}-${k}`} className={`v18-screen-in p-6 sm:p-7 ${i === 2 ? "bg-white text-(--ink)" : "bg-(--navy-2)"}`} style={{ animationDelay: `${i * 80}ms` }}>
                <p className={`v18-label ${i === 2 ? "text-(--ember-ink)" : "text-white/55"}`}>{k}</p>
                <p className={`text-pretty mt-3 leading-[1.65] ${i === 2 ? "text-[1.125rem] font-bold tracking-[-0.01em]" : "text-white/80"}`}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fully managed. */}
        <div data-rv="" className="mt-16 grid gap-8 border-t border-white/15 pt-10 lg:mt-20 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <p className="text-[1.5rem] font-bold tracking-[-0.02em]">Fully managed by Genius Lab.</p>
            <p className="text-pretty mt-3 max-w-[46ch] leading-[1.7] text-white/70">
              You don&rsquo;t need to hire a data team, stitch tools together or maintain infrastructure. We implement everything, hand it over ready to use, and keep it running.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-3 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:col-span-7 lg:pt-2" aria-label="Included in every engagement">
            {INCLUDED.map((x) => (
              <li key={x} className="flex items-center gap-3 font-semibold">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--ember)/15 text-(--ember)" aria-hidden="true">
                  <Check size={12} weight="bold" />
                </span>
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
