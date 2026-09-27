"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ArrowRight, CaretLeft, CaretRight, Check, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { BrandLogo } from "@/components/v2/ui";
import { Heading, Note } from "./ui";

/* ---------- Illustrative previews, one per module ---------- */

function Connectors() {
  const rows = [
    ["ERP", "Synced 2 min ago"],
    ["CRM", "Synced 4 min ago"],
    ["Finance", "Synced 1 min ago"],
    ["Warehouse", "Streaming"],
    ["Sheets", "Synced 9 min ago"],
  ];
  return (
    <div className="grid h-full items-center gap-6 sm:grid-cols-[minmax(0,1fr)_auto]">
      <ul className="space-y-2">
        {rows.map(([s, t]) => (
          <li key={s} className="v20-card-2 flex items-center justify-between gap-4 px-4 py-2.5 text-[0.875rem]">
            <span className="v20-fg font-medium">{s}</span>
            <span className="v20-fg3 flex items-center gap-2 text-[0.8125rem]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1a9d5c]" aria-hidden="true" />
              {t}
            </span>
          </li>
        ))}
      </ul>
      <div className="hidden flex-col items-center gap-3 sm:flex">
        <span className="h-px w-12 bg-[var(--rule-strong)]" />
        <span className="rounded-2xl bg-white px-5 py-4 shadow-[0_10px_30px_-18px_rgb(12_14_36/0.4)]">
          <BrandLogo tone="navy" className="h-[12px] w-auto" />
        </span>
      </div>
    </div>
  );
}

function Transform() {
  const steps = ["Raw", "Cleaned", "Modeled", "Served"];
  return (
    <div className="flex h-full flex-col justify-center gap-8">
      <ol className="flex items-center" aria-label="Pipeline stages">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 items-center last:flex-none">
            <span className={`rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium sm:px-4 ${i === 3 ? "bg-[var(--acc)] text-white" : "v20-card-2 v20-fg"}`}>{s}</span>
            {i < 3 && <span className="mx-1.5 h-px flex-1 bg-[var(--rule-strong)] sm:mx-2" aria-hidden="true" />}
          </li>
        ))}
      </ol>
      <div className="v20-card-2 grid grid-cols-3 divide-x divide-[var(--rule)] py-4 text-center">
        {[
          ["142/142", "Tests passing"],
          ["06:10", "Last run"],
          ["0", "Failed rows"],
        ].map(([v, k]) => (
          <div key={k} className="px-2">
            <p className="v20-display v20-num text-[1.5rem]">{v}</p>
            <p className="v20-fg3 text-[0.8125rem]">{k}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Analytics() {
  const bars = [38, 52, 46, 61, 58, 72, 69, 84];
  return (
    <div className="v20-card-2 flex h-full flex-col p-5">
      <div className="flex items-baseline justify-between">
        <p className="v20-fg text-[0.875rem] font-semibold">Gross margin by month</p>
        <p className="v20-acc text-[0.8125rem] font-medium">+4.2 pt</p>
      </div>
      <div className="mt-5 flex flex-1 items-end gap-2 sm:gap-3">
        {bars.map((b, i) => (
          <span key={i} className={`flex-1 rounded-t-md ${i === bars.length - 1 ? "bg-[var(--acc)]" : "bg-[var(--rule-strong)]"}`} style={{ height: `${b}%` }} />
        ))}
      </div>
    </div>
  );
}

function Governance() {
  return (
    <div className="v20-card-2 flex h-full flex-col justify-center p-5 sm:p-6">
      <p className="v20-fg3 text-[0.8125rem]">Metric definition</p>
      <p className="v20-display mt-1 text-[1.5rem]">Gross margin</p>
      <p className="v20-fg2 mt-2 font-mono text-[0.8125rem]">(revenue − cogs) / revenue</p>
      <dl className="mt-5 grid grid-cols-3 gap-3 border-t v20-rule pt-4 text-[0.8125rem]">
        <div>
          <dt className="v20-fg3">Owner</dt>
          <dd className="v20-fg font-medium">Finance</dd>
        </div>
        <div>
          <dt className="v20-fg3">Used in</dt>
          <dd className="v20-fg font-medium">14 dashboards</dd>
        </div>
        <div>
          <dt className="v20-fg3">Access</dt>
          <dd className="v20-fg font-medium">Leadership</dd>
        </div>
      </dl>
    </div>
  );
}

function Automation() {
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {[
        ["When", "Cash forecast falls below the $4M floor"],
        ["Then", "Notify the CFO with the drivers"],
        ["And", "Open a collections task in the ERP"],
      ].map(([k, v], i) => (
        <div key={k} className="v20-card-2 flex items-center gap-4 px-4 py-3.5">
          <span className={`w-12 shrink-0 text-[0.8125rem] font-semibold ${i === 0 ? "v20-acc" : "v20-fg3"}`}>{k}</span>
          <span className="v20-fg text-[0.9375rem]">{v}</span>
        </div>
      ))}
    </div>
  );
}

function Agent() {
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <p className="ml-auto max-w-[85%] rounded-[18px] rounded-br-[6px] bg-[var(--acc)] px-4 py-2.5 text-[0.9375rem] text-[#080a26]">
        What will cash look like over the next 90 days?
      </p>
      <div className="v20-card-2 max-w-[92%] rounded-[18px] rounded-bl-[6px] px-4 py-3">
        <p className="v20-fg3 flex items-center gap-1.5 text-[0.75rem]">
          <Sparkle size={12} weight="fill" className="v20-acc" aria-hidden="true" /> Read ar.invoices, ap.schedule
        </p>
        <p className="v20-fg mt-1.5 text-[0.9375rem] leading-[1.55]">
          Cash stays above the $4M floor, with a low of $4.6M in week 7. Collecting three overdue invoices early lifts it to
          $5.9M.
        </p>
      </div>
    </div>
  );
}

const MODULES: { name: string; title: string; body: string; view: ReactNode; dark?: boolean }[] = [
  { name: "Connectors", title: "Every system, connected.", body: "Ready integrations for ERP, CRM, finance, files and APIs.", view: <Connectors /> },
  { name: "Transformation", title: "Pipelines tested like software.", body: "Clean, model and unify data into one trusted foundation.", view: <Transform /> },
  { name: "Analytics", title: "One model behind every chart.", body: "Dashboards, drill-downs and forecasts on shared definitions.", view: <Analytics /> },
  { name: "Governance", title: "Defined once. Trusted everywhere.", body: "Definitions, lineage, access and audit trails in one place.", view: <Governance /> },
  { name: "Automation", title: "From insight to action.", body: "Alerts, workflows and scheduled actions across your systems.", view: <Automation /> },
  { name: "AI Agents", title: "Ask the business anything.", body: "Agents read the Second Brain, show their sources, and act.", view: <Agent />, dark: true },
];

/**
 * The Genius Portal as a horizontal gallery. A segmented control and the rail stay in sync:
 * tap a segment and the rail glides to it; swipe the rail and the segment follows.
 */
export function Gallery() {
  const reduce = useReducedMotion();
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const slides = Array.from(el.querySelectorAll<HTMLElement>("[data-slide]"));
      const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
      let best = 0;
      let dist = Infinity;
      slides.forEach((s, i) => {
        const d = Math.abs(s.offsetLeft - pad - el.scrollLeft);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      // At the end of the rail the last slide may never reach the snap line.
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) best = slides.length - 1;
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = (i: number) => {
    const el = rail.current;
    const slide = el?.querySelectorAll<HTMLElement>("[data-slide]")[i];
    if (!el || !slide) return;
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    setActive(i);
    el.scrollTo({ left: slide.offsetLeft - pad, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section id="portal" data-tone="white" className="v20-sec py-28 sm:py-40" aria-labelledby="v20-portal-title">
      <div className="px-5">
        <Heading
          id="v20-portal-title"
          eyebrow="Genius Portal"
          title="Expertise and technology, working as one."
          lead="Our specialists build on the Genius Portal, our own platform. Everything you need to connect, govern and run intelligence lives in one place."
        />
      </div>

      <div className="mt-14 flex justify-center px-5 sm:mt-16">
        <LayoutGroup id="v20-seg">
          <div className="v20-seg" role="group" aria-label="Genius Portal modules">
            {MODULES.map((m, i) => (
              <button key={m.name} type="button" className="v20-seg-btn" aria-pressed={i === active} aria-controls={`v20-slide-${i}`} onClick={() => go(i)}>
                {i === active && (
                  <motion.span
                    layoutId="v20-seg-thumb"
                    className="v20-seg-thumb"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34, mass: 0.9 }}
                  />
                )}
                <span className="relative">{m.name}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      <div ref={rail} className="v20-rail relative mt-10" aria-label="Genius Portal modules, scrollable" role="region" tabIndex={0}>
        {MODULES.map((m, i) => (
          <article
            key={m.name}
            id={`v20-slide-${i}`}
            data-slide={i}
            data-on={i === active}
            data-tone={m.dark ? "navy" : undefined}
            aria-label={`${i + 1} of ${MODULES.length}: ${m.name}`}
            className={`v20-slide v20-card flex flex-col overflow-hidden p-7 sm:p-10 ${m.dark ? "bg-[var(--bg)] text-[var(--fg)]" : ""}`}
          >
            <p className="v20-acc text-[0.9375rem] font-semibold">{m.name}</p>
            <h3 className="v20-display v20-h3 mt-2 max-w-[18ch]">{m.title}</h3>
            <p className="v20-fg2 mt-3 max-w-[40ch] text-[1.0625rem]">{m.body}</p>
            <div className="mt-8 h-[260px] sm:mt-10 sm:h-[240px]" aria-hidden="true">
              {m.view}
            </div>
          </article>
        ))}
        <span className="w-px flex-none" aria-hidden="true" />
      </div>

      <div className="mx-auto mt-4 flex max-w-[1120px] items-center justify-between gap-6 px-5">
        <Note>Module previews are illustrative. Figures are not client data.</Note>
        <div className="flex gap-3">
          <button type="button" className="v20-round" onClick={() => go(Math.max(0, active - 1))} disabled={active === 0} aria-label="Previous module">
            <CaretLeft size={16} weight="bold" />
          </button>
          <button type="button" className="v20-round" onClick={() => go(Math.min(MODULES.length - 1, active + 1))} disabled={active === MODULES.length - 1} aria-label="Next module">
            <CaretRight size={16} weight="bold" />
          </button>
        </div>
      </div>

      <IncludedStrip />
    </section>
  );
}

/** What comes with the platform, stated plainly. */
function IncludedStrip() {
  const items = ["Built on your existing software", "One governed data model", "Agents that show their sources"];
  return (
    <div className="mx-auto mt-20 max-w-[1120px] px-5">
      <ul className="flex flex-col items-center justify-center gap-x-10 gap-y-3 sm:flex-row">
        {items.map((t) => (
          <li key={t} className="v20-fg2 flex items-center gap-2 text-[0.9375rem]">
            <Check size={14} weight="bold" className="v20-acc" aria-hidden="true" />
            {t}
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center">
        <a href="#contact" className="v20-more">
          Book a walkthrough of the portal <ArrowRight size={14} weight="bold" aria-hidden="true" />
        </a>
      </p>
    </div>
  );
}
