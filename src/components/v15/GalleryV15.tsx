"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { EmblemAI, EmblemAnalytics, EmblemDecision, EmblemFoundation, EmblemIntelligence } from "./emblems";
import { Kicker, d } from "./ui";

type Piece = { n: string; name: string; role: string; body: string; gives: string[]; Emblem: ComponentType };

const LAYERS: Piece[] = [
  {
    n: "01",
    name: "Data Engineering",
    role: "The foundation.",
    body: "We connect your systems and engineer their data into one governed, reliable foundation: integration, pipelines, modeling and quality.",
    gives: ["Connected systems", "A unified data platform", "Trusted, tested pipelines"],
    Emblem: EmblemFoundation,
  },
  {
    n: "02",
    name: "Analytics",
    role: "Organized data becomes understanding.",
    body: "Analysis and modeling explain what is happening, why it is happening and what is likely to happen next.",
    gives: ["Performance analysis", "Forecasts and drivers", "Customer and operational insight"],
    Emblem: EmblemAnalytics,
  },
  {
    n: "03",
    name: "Business Intelligence",
    role: "Understanding becomes visible.",
    body: "One set of definitions behind every dashboard and report, so leadership sees the same numbers, at the same time.",
    gives: ["Executive dashboards", "Shared metrics and KPIs", "Self-service reporting"],
    Emblem: EmblemIntelligence,
  },
  {
    n: "04",
    name: "Artificial Intelligence",
    role: "Visibility gains context and reasoning.",
    body: "AI learns your business context and becomes its Second Brain. AI Agents reason across systems, tables, metrics and processes to answer and act.",
    gives: ["Second Brain", "AI Agents", "Orchestrated execution"],
    Emblem: EmblemAI,
  },
];

const OUTCOME: Piece = {
  n: "—",
  name: "Better business decisions",
  role: "The outcome.",
  body: "Each layer builds on the one beneath it. Together they give executives clear insight, full visibility and the confidence to act.",
  gives: [],
  Emblem: EmblemDecision,
};

const TITLE = (
  <>
    One intelligence and execution layer across your <em className="lx-gold">business.</em>
  </>
);
const LEAD = "Not four products. Every layer is built on the one beneath it, and the top of the stack is a better decision.";

/** One collection piece: a mounted plate, revealed by a vertical curtain, then its caption. */
function Plate({ piece, outcome = false }: { piece: Piece; outcome?: boolean }) {
  const { n, name, role, body, gives, Emblem } = piece;
  return (
    <article className="flex h-full flex-col">
      <div className="relative border border-[#d8c29d]/25 p-[7px]">
        <div data-lx="curtain" className={`relative h-[clamp(150px,26vh,270px)] overflow-hidden border border-[#d8c29d]/10 ${outcome ? "bg-[#12110f]" : "bg-[#0a0e1f]"}`}>
          <div className="lx-curtain-inner absolute inset-0 p-5">
            <Emblem />
          </div>
          <span className="lx-caps absolute left-4 top-3 text-[#ede7dc]/70">{outcome ? "The outcome" : `Plate N° ${n}`}</span>
        </div>
      </div>
      <div className="mt-8 flex items-baseline gap-4">
        {!outcome && <span className="lx-num text-[1.25rem]">{n}</span>}
        <h3 className="lx-display text-[clamp(1.85rem,2.3vw,2.5rem)]">{name}</h3>
      </div>
      <p className="lx-serif mt-2 text-[1.2rem] italic text-[#ede7dc]/85">{role}</p>
      <p className="lx-body mt-4 text-[0.98rem] leading-[1.75]">{body}</p>
      {gives.length > 0 && (
        <ul className="mt-6 border-t border-[#d8c29d]/15">
          {gives.map((g) => (
            <li key={g} className="lx-caps border-b border-[#d8c29d]/15 py-2.5 text-[0.625rem] text-[#ede7dc]/80">
              {g}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

/** Desktop: the collection slides past horizontally while the page scrolls vertically. */
function ScrollGallery() {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [dist, setDist] = useState(0);
  const [plate, setPlate] = useState(0);
  const distMV = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const raw = useTransform(() => -scrollYProgress.get() * distMV.get());
  const x = useSpring(raw, { stiffness: 70, damping: 24, mass: 0.9 });
  const bar = useSpring(scrollYProgress, { stiffness: 70, damping: 24 });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const v = Math.max(0, el.scrollWidth - window.innerWidth);
      distMV.set(v);
      setDist(v);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [distMV]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(LAYERS.length, Math.max(1, Math.round(v * LAYERS.length + 0.5)));
    setPlate((p) => (p === next ? p : next));
  });

  return (
    <div ref={outer} className="relative" style={{ height: `calc(100svh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className="flex flex-1 items-center">
          <motion.ol ref={track} style={{ x }} className="flex w-max items-center gap-[6vw] pl-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))] pr-[12vw] pt-16" aria-label="The four layers, foundation first">
            <li className="w-[min(34vw,480px)] shrink-0">
              <Kicker>The Collection &middot; Four connected layers</Kicker>
              <h2 id="v15-layers-title" data-lx="settle" style={d(120)} className="lx-display mt-10 text-[clamp(2.5rem,4.2vw,4.25rem)]">
                {TITLE}
              </h2>
              <p data-lx="fade" style={d(320)} className="lx-body mt-8 max-w-[40ch]">
                {LEAD}
              </p>
              <p data-lx="fade" style={d(520)} className="lx-caps mt-12 flex items-center gap-4 text-[#ede7dc]/70">
                <span className="lx-hair w-10 bg-[#d8c29d]/60" aria-hidden="true" />
                Continue to view the collection
              </p>
            </li>
            {LAYERS.map((p) => (
              <li key={p.n} className="w-[clamp(300px,27vw,410px)] shrink-0">
                <Plate piece={p} />
              </li>
            ))}
            <li className="w-[clamp(300px,27vw,410px)] shrink-0">
              <Plate piece={OUTCOME} outcome />
            </li>
          </motion.ol>
        </div>
        <div className="mx-auto flex w-full max-w-[1320px] items-center gap-6 px-10 pb-9" aria-hidden="true">
          <span className="lx-num w-16 text-[1rem]">0{plate}</span>
          <span className="relative block h-px flex-1 bg-[#d8c29d]/15">
            <motion.span className="absolute inset-0 origin-left bg-[#d8c29d]/70" style={{ scaleX: bar }} />
          </span>
          <span className="lx-num w-16 text-right text-[1rem]">04</span>
        </div>
      </div>
    </div>
  );
}

/** Touch screens and reduced motion: the same collection on a native, swipeable rail. */
function RailGallery() {
  return (
    <div className="py-32 sm:py-40">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-10">
        <Kicker>The Collection &middot; Four connected layers</Kicker>
        <h2 id="v15-layers-title" data-lx="settle" style={d(120)} className="lx-display mt-10 max-w-[18ch] text-[clamp(2.4rem,6vw,4rem)]">
          {TITLE}
        </h2>
        <p data-lx="fade" style={d(320)} className="lx-body mt-8 max-w-[44ch]">
          {LEAD}
        </p>
      </div>
      <ol className="lx-rail mt-16 flex gap-6 overflow-x-auto px-5 pb-4 sm:px-10" aria-label="The four layers, foundation first">
        {LAYERS.map((p) => (
          <li key={p.n} className="w-[80vw] max-w-[380px] shrink-0">
            <Plate piece={p} />
          </li>
        ))}
        <li className="w-[80vw] max-w-[380px] shrink-0">
          <Plate piece={OUTCOME} outcome />
        </li>
        <li className="w-px shrink-0" aria-hidden="true" />
      </ol>
      <p className="lx-caps mt-8 px-5 text-[#ede7dc]/60 sm:px-10">Swipe to view the collection</p>
    </div>
  );
}

export function GalleryV15() {
  const scrub = useMediaQuery("(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)");
  return (
    <section id="layers" className="relative scroll-mt-20 bg-[#0a0e1f]" aria-labelledby="v15-layers-title">
      {scrub ? <ScrollGallery /> : <RailGallery />}
    </section>
  );
}
