"use client";

import { useEffect, useRef, useState } from "react";
import { ConsoleFrame, PortalConsole, type Screen } from "./PortalConsole";
import { SectionHead, useInView } from "./ui";

const STEPS: { screen: Screen; tag: string; title: string; body: string; modules: string[] }[] = [
  {
    screen: "connect",
    tag: "Connectors",
    title: "Connect what already runs the business.",
    body: "Ready integrations for ERP, CRM, finance, files and APIs. Pipelines clean, model and unify the data, and they are tested like software on every run. Nothing is ripped out.",
    modules: ["Connectors", "Data transformation"],
  },
  {
    screen: "model",
    tag: "Data model",
    title: "One definition behind every number.",
    body: "Metrics are defined once, on the business objects themselves, with lineage, access and audit trails in one place. Revenue means the same thing in every report and every answer.",
    modules: ["Governance", "Ontology"],
  },
  {
    screen: "dashboards",
    tag: "Analytics",
    title: "Leadership sees the same numbers, at the same time.",
    body: "Dashboards, drill-downs and forecasts built on one shared model, so the board pack and the operating view come from the same place.",
    modules: ["Analytics", "Business intelligence"],
  },
  {
    screen: "agents",
    tag: "Agents",
    title: "Agents that answer, recommend and act.",
    body: "Genius agents read the Second Brain to answer executive questions, propose actions for approval, and run alerts and workflows across your systems.",
    modules: ["AI Agents", "Automation"],
  },
];

export function PortalV18() {
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLElement | null)[]>([]);
  const [liveRef, live] = useInView<HTMLDivElement>(0.2);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    steps.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (i: number) => {
    setActive(i);
    steps.current[i]?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  };

  return (
    <section id="portal" className="v18-band on-navy scroll-mt-16 py-24 sm:py-32" aria-labelledby="v18-portal-title">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        <SectionHead
          navy
          id="v18-portal-title"
          index="03"
          label="Genius Portal"
          title="Expertise and technology, working as one."
          lead="Our specialists build on the Genius Portal, our own platform. Everything a client needs to connect, govern and run intelligence lives in one place. Scroll to walk through it."
        />

        <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          {/* The console: sticky on the right on desktop, pinned under the bar on phones. */}
          <div className="sticky top-[60px] z-10 -mx-5 bg-(--navy) px-5 pb-4 pt-3 sm:-mx-8 sm:px-8 lg:order-2 lg:col-span-8 lg:mx-0 lg:self-start lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-0 lg:[top:max(88px,calc(50vh-300px))]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <ol className="flex gap-1.5" aria-label="Portal screens">
                {STEPS.map((s, i) => (
                  <li key={s.screen}>
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-current={i === active ? "step" : undefined}
                      className={`v18-label rounded-[6px] px-2.5 py-2 transition-colors duration-300 ${i === active ? "bg-white text-(--navy)" : "text-white/60 hover:text-white"}`}
                    >
                      <span className="sm:hidden">0{i + 1}</span>
                      <span className="hidden sm:inline">
                        0{i + 1} {s.tag}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
              <span className="v18-label hidden text-white/45 md:block">Illustrative preview</span>
            </div>
            <div ref={liveRef}>
              <ConsoleFrame>
                <PortalConsole screen={STEPS[active].screen} live={live} />
              </ConsoleFrame>
            </div>
          </div>

          <ol className="lg:order-1 lg:col-span-4" aria-label="Inside the Genius Portal">
            {STEPS.map((s, i) => {
              const on = i === active;
              return (
                <li
                  key={s.screen}
                  ref={(el) => {
                    steps.current[i] = el;
                  }}
                  data-step={i}
                  className="flex min-h-[46vh] flex-col justify-center py-10 lg:min-h-[78vh]"
                >
                  <div className={`border-l-2 pl-6 transition-colors duration-500 ${on ? "border-(--ember)" : "border-white/15"}`}>
                    <p className="v18-label text-(--ember)">
                      0{i + 1} · {s.tag}
                    </p>
                    <h3 className={`mt-4 text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-[1.15] tracking-[-0.025em] transition-colors duration-500 ${on ? "text-white" : "text-white/60"}`}>{s.title}</h3>
                    <p className={`text-pretty mt-4 leading-[1.7] transition-colors duration-500 ${on ? "text-white/75" : "text-white/55"}`}>{s.body}</p>
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Portal modules">
                      {s.modules.map((m) => (
                        <li key={m} className="v18-chip bg-white/10 text-white/80">
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
