import type { CSSProperties } from "react";
import { Lines, SectionHead } from "./ui";
import { rd, wrap } from "./shared";

const STEPS = [
  { name: "Assess", body: "We map your systems, data and decisions, and design the target architecture with you.", gives: "Architecture and roadmap" },
  { name: "Connect", body: "We connect the software you already run and engineer its data into one governed foundation.", gives: "Unified, tested data" },
  { name: "Build", body: "We model the metrics, build the dashboards and teach the Second Brain and agents your business.", gives: "Dashboards, Second Brain, agents" },
  { name: "Run", body: "We host, monitor and support it with clear service levels, and keep improving it as you change.", gives: "A fully managed service" },
];

const INCLUDED = ["Implementation", "Hosting", "Monitoring", "Security", "Support", "Continuous improvement"];

const TEAM = [
  { role: "Solution architects", owns: "Target architecture, integration design, security" },
  { role: "Data engineers", owns: "Connectors, pipelines, data models and quality tests" },
  { role: "Analytics engineers", owns: "Metric definitions, forecasting and driver analysis" },
  { role: "BI developers", owns: "Executive dashboards and self-service reporting" },
  { role: "AI engineers", owns: "The Second Brain, agents and their guardrails" },
  { role: "Engagement lead", owns: "One point of contact, from first call to daily run" },
];

const dd = (ms: number) => ({ "--dd": `${ms}ms` }) as CSSProperties;

/** The engagement path: one line that draws left to right, lighting each station in turn. */
function Path() {
  return (
    <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="absolute inset-x-0 top-[13px] hidden h-[14px] w-full lg:block" aria-hidden="true" fill="none">
      <path d="M12 20 H988" stroke="var(--rule)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path d="M12 20 H988" pathLength={1} stroke="var(--terra)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="v21-draw" style={{ "--dd": "200ms" } as CSSProperties} />
    </svg>
  );
}

export function Engage21() {
  return (
    <section id="engage" className="relative scroll-mt-20 py-20 sm:py-28" aria-labelledby="v21-engage-title">
      <div className={wrap}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead className="lg:col-span-7" label="How we work" id="v21-engage-title" lines={["Fully managed", "by Genius Lab."]} />
          <p data-rv="up" style={rd(120)} className="v21-lead max-w-[50ch] lg:col-span-5 lg:pb-2">
            You don&rsquo;t need to hire a data team, stitch tools together or maintain infrastructure. We implement everything, hand it over ready to use, and keep it running.
          </p>
        </div>

        <div className="relative mt-14 lg:mt-20" data-rv="draw">
          <Path />
          <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((s, i) => (
              <li key={s.name} className="relative flex gap-4 lg:block">
                <span
                  className="v21-fade relative z-[1] inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--ground)] font-semibold text-[var(--ink)] shadow-[inset_0_0_0_1.5px_var(--ink)]"
                  style={dd(250 + i * 380)}
                >
                  <span className="v21-mono text-[0.8125rem]">{i + 1}</span>
                </span>
                <div data-rv="up" style={rd(150 + i * 120)} className="v21-card v21-lift flex-1 p-5 lg:mt-6 lg:p-6">
                  <p className="v21-display text-[1.75rem]">{s.name}</p>
                  <p className="mt-2 leading-[1.6] text-[var(--ink-2)]">{s.body}</p>
                  <p className="mt-5 border-t border-[var(--rule-soft)] pt-4 text-[0.875rem]">
                    <span className="block text-[0.75rem] font-semibold text-[var(--ink-3)]">You get</span>
                    <span className="mt-0.5 block font-semibold text-[var(--ink)]">{s.gives}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div data-rv="up" className="mt-6 flex flex-col gap-5 rounded-[20px] bg-[var(--surface)] px-6 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="v21-label shrink-0">Included in every engagement</p>
          <ul className="flex flex-wrap gap-2" aria-label="Included">
            {INCLUDED.map((x) => (
              <li key={x} className="inline-flex h-9 items-center gap-2 rounded-full bg-[var(--paper)] px-3.5 text-[0.875rem] font-medium text-[var(--ink)] shadow-[0_0_0_1px_var(--rule-soft)]">
                <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
                  <path d="M2 6.2 4.8 9 10 3" fill="none" stroke="var(--ok)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {x}
              </li>
            ))}
          </ul>
        </div>

        {/* The team and services behind every engagement. */}
        <div className="mt-20 grid gap-10 border-t border-[var(--rule)] pt-14 sm:mt-28 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="v21-label">The team</p>
            <Lines lines={["One team across data,", "analytics and AI."]} className="v21-display mt-4 text-[clamp(1.9rem,3.4vw,2.75rem)]" />
            <p data-rv="up" style={rd(100)} className="v21-lead mt-5 max-w-[44ch]">
              Specialists who have built and run these systems before, working as one team with yours. No handoffs between vendors.
            </p>
          </div>
          <dl className="lg:col-span-7">
            {TEAM.map((t, i) => (
              <div
                key={t.role}
                data-rv="up"
                style={rd(i * 60)}
                className="group grid gap-1 border-b border-[var(--rule)] py-4 first:border-t sm:grid-cols-[13rem_1fr] sm:items-baseline sm:gap-6"
              >
                <dt className="v21-serif flex items-baseline gap-3 text-[1.3rem] text-[var(--ink)]">
                  <span className="v21-mono text-[0.75rem] text-[var(--terra-ink)]">0{i + 1}</span>
                  {t.role}
                </dt>
                <dd className="text-[0.9375rem] leading-[1.6] text-[var(--ink-2)] transition-colors duration-300 group-hover:text-[var(--ink)]">{t.owns}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
