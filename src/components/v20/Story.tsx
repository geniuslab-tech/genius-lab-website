"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { Morph } from "./Morph";
import { SYSTEMS } from "./shapes";
import { More, Note, R, type Tone } from "./ui";

type Step = { id: string; kicker: string; caption: string; tone: Tone; title: string; body: ReactNode; extra?: ReactNode };

const LAYERS = [
  { n: "01", name: "Data Engineering", role: "The foundation. Systems connected and engineered into one governed platform." },
  { n: "02", name: "Analytics", role: "Organized data becomes understanding: what happened, why, and what comes next." },
  { n: "03", name: "Business Intelligence", role: "Understanding becomes visible, on one set of definitions for everyone." },
  { n: "04", name: "Artificial Intelligence", role: "Visibility gains context and reasoning: the Second Brain and AI Agents." },
];

const CONTEXTS = [
  { name: "Semantic context", body: "What every number means. Revenue means the same thing in every report." },
  { name: "Business context", body: "How the company works: customers, operations, finance and how they connect." },
  { name: "Event context", body: "What is happening now: transactions, process steps and system events." },
];

const STEPS: Step[] = [
  {
    id: "story-scattered",
    kicker: "Where most companies are",
    caption: "Scattered systems",
    tone: "white",
    title: "Solve the right problem.",
    body: (
      <>
        When the business becomes fragmented, replacing systems can feel like the natural next step. Sometimes replacement
        is necessary. But often, the problem can be solved without the cost, operational load, and disruption risk of a
        system transition.
      </>
    ),
  },
  {
    id: "story-connected",
    kicker: "Connect",
    caption: "Connected, not replaced",
    tone: "white",
    title: "Keep the technology that already runs the business.",
    body: (
      <>
        We connect your systems and engineer their data into one reliable foundation. Building on what already works reduces
        complexity, expands capabilities, and unlocks more value from your systems and people.
      </>
    ),
    extra: (
      <ul className="mt-8 flex flex-wrap gap-2" aria-label="Systems that connect">
        {SYSTEMS.map((s) => (
          <li key={s} className="v20-chip">
            <span className="v20-dot" aria-hidden="true" />
            {s}
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "story-layers",
    kicker: "Four connected layers",
    caption: "Each layer builds on the last",
    tone: "navy",
    title: "One intelligence and execution layer across your business.",
    body: <>Not four products. Every layer is built on the one beneath it, and the top of the stack is a better decision.</>,
    extra: (
      <ol className="mt-8 border-t v20-rule" aria-label="The four layers, foundation first">
        {LAYERS.map((l) => (
          <li key={l.n} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 border-b v20-rule py-4">
            <span className="v20-acc v20-num pt-0.5 text-[0.875rem] font-semibold">{l.n}</span>
            <span>
              <span className="v20-fg block font-semibold tracking-[-0.015em]">{l.name}</span>
              <span className="v20-fg2 mt-0.5 block text-[0.9375rem] leading-[1.55]">{l.role}</span>
            </span>
          </li>
        ))}
      </ol>
    ),
  },
  {
    id: "brain",
    kicker: "Second Brain",
    caption: "A network of business context",
    tone: "navy",
    title: "A Second Brain for your business.",
    body: (
      <>
        The intelligence layer holds the full context of the company: its systems, tables, metrics, dashboards, processes,
        customers, operations and finances.
      </>
    ),
    extra: (
      <dl className="mt-8 space-y-5">
        {CONTEXTS.map((c) => (
          <div key={c.name} className="border-l-2 border-[var(--acc)] pl-4">
            <dt className="v20-fg font-semibold tracking-[-0.015em]">{c.name}</dt>
            <dd className="v20-fg2 mt-0.5 text-[0.9375rem] leading-[1.55]">{c.body}</dd>
          </div>
        ))}
      </dl>
    ),
  },
  {
    id: "agents",
    kicker: "AI Agents",
    caption: "Agents that act on context",
    tone: "black",
    title: "AI Agents that know your business.",
    body: (
      <>
        Built on the Second Brain, Genius agents answer executive questions end to end, reading the systems, tables and metrics
        behind every number, and orchestrating what happens next.
      </>
    ),
    extra: (
      <More href="#portal" className="mt-8">
        See an agent at work
      </More>
    ),
  },
];

/** Below the split layout, each step carries its own copy of the visual, which assembles on arrival. */
function StepVisual({ state, reduce }: { state: number; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(state);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || state === 0 || document.hidden) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.8) return;
    // Start from the previous arrangement, then glide into this one when it scrolls in.
    setShown(state - 1);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(state);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    const safety = window.setTimeout(() => document.hidden && setShown(state), 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, [state, reduce]);

  return (
    <div ref={ref} className="mx-auto mb-10 aspect-square w-full max-w-[420px] lg:hidden">
      <Morph state={shown} still={reduce} />
    </div>
  );
}

/**
 * The pinned story. Steps scroll on the left; a single visual holds still on the right and
 * re-arranges itself for each one. The whole section cross-fades from daylight into navy
 * and black as the story moves from scattered systems to agents that understand them.
 */
export function Story() {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const steps = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = steps.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
    let shown = 0;
    const read = () => {
      const line = window.innerHeight * 0.52;
      let now = 0;
      items.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= line) now = i;
      });
      if (now !== shown) {
        shown = now;
        setActive(now);
      }
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  const tone = STEPS[active].tone;

  return (
    <section id="story" data-tone={tone} data-v20-live-tone="" className="v20-sec v20-story relative" aria-labelledby="v20-story-title">
      <div className="mx-auto max-w-[1120px] px-5 pt-28 sm:pt-40">
        <div className="mx-auto max-w-[52rem] text-center">
          <R as="p" className="v20-eyebrow">
            Platform
          </R>
          <R as="h2" delay={60} id="v20-story-title" className="v20-display v20-h2 mx-auto mt-3 max-w-[15ch]">
            From scattered systems to one source of truth.
          </R>
        </div>

        <div className="mt-16 lg:mt-0 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          <div ref={steps}>
            {STEPS.map((s, i) => (
              <article
                key={s.id}
                id={s.id}
                data-step={i}
                data-on={i === active}
                aria-labelledby={`${s.id}-title`}
                className="scroll-mt-16 py-14 lg:flex lg:min-h-[100svh] lg:items-center lg:py-24"
              >
                <div className="v20-step-inner w-full">
                  <StepVisual state={i} reduce={reduce} />
                  <p className="v20-fg3 text-[0.9375rem] font-medium">
                    <span className="v20-acc v20-num mr-2 font-semibold">0{i + 1}</span>
                    {s.kicker}
                  </p>
                  <h3 id={`${s.id}-title`} className="v20-display v20-h3 mt-4 max-w-[17ch]">
                    {s.title}
                  </h3>
                  <p className="v20-body mt-6 max-w-[46ch] text-[1.125rem]">{s.body}</p>
                  {s.extra}
                </div>
              </article>
            ))}
          </div>

          <div className="hidden lg:block" aria-hidden="true">
            <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center pt-8">
              <div className="aspect-square w-full max-w-[560px]">
                <Morph state={active} still={reduce} />
              </div>
              <div className="mt-6 flex w-full max-w-[420px] flex-col items-center gap-4">
                <p className="v20-fg2 text-[0.9375rem] font-medium">{STEPS[active].caption}</p>
                <div className="flex w-full gap-1.5">
                  {STEPS.map((s, i) => (
                    <span key={s.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-[var(--rule)]">
                      <span
                        className="block h-full origin-left rounded-full bg-[var(--acc)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{ transform: `scaleX(${i <= active ? 1 : 0})` }}
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Note className="pb-16 text-center lg:pb-20">Diagrams are illustrative.</Note>
      </div>
    </section>
  );
}
