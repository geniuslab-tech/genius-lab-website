"use client";

import { useEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { h2v5 } from "./ui";

/**
 * Placeholder testimonials. They are illustrative only and must be replaced with real,
 * approved client quotes before launch.
 */
const VOICES = [
  {
    q: "For the first time, the board pack and the operating numbers come from the same place. Month-end close went from twelve days to five.",
    name: "Helena Marques",
    role: "CFO, multi-entity manufacturing group",
  },
  {
    q: "We connected nine portfolio companies in a quarter. Now I ask the agent instead of chasing spreadsheets.",
    name: "Daniel Okafor",
    role: "Operating Partner, private equity firm",
  },
  {
    q: "They didn't sell us another tool. They built on what we already had and ran it for us.",
    name: "Priya Raman",
    role: "COO, specialty retailer",
  },
  {
    q: "Integration planning used to be guesswork. Genius Lab gave us a single view of both companies before day one.",
    name: "Marcus Lindqvist",
    role: "Head of M&A integration, services group",
  },
  {
    q: "Our analysts spend their time on decisions now, not on reconciling reports.",
    name: "Sofia Albuquerque",
    role: "VP Finance, logistics company",
  },
  {
    q: "The Second Brain understands our definitions. When it says margin, it means our margin.",
    name: "Thomas Reyes",
    role: "CEO, distribution business",
  },
];

export function VoicesV5() {
  const [feature, ...rest] = VOICES;
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
    <section id="clients" className="scroll-mt-12 overflow-x-clip bg-mist py-28 sm:py-40" aria-labelledby="v5-voices-title">
      <div className="mx-auto max-w-[1080px] px-5">
        <div className="text-center">
          <p data-reveal="up" className="v5-eyebrow text-[1.1875rem] text-graphite-2">
            Clients
          </p>
          <h2 id="v5-voices-title" data-reveal="up" data-delay="60" className={`${h2v5} mt-3 text-graphite`}>
            What our clients say.
          </h2>
        </div>

        {/* The featured voice. */}
        <figure data-reveal="up" className="mx-auto mt-16 max-w-[900px] text-center sm:mt-20">
          <blockquote className="v5-display text-[clamp(1.625rem,3.4vw,2.75rem)] leading-[1.18] text-graphite">&ldquo;{feature.q}&rdquo;</blockquote>
          <figcaption className="mt-8">
            <span className="block text-[1.0625rem] font-semibold text-graphite">{feature.name}</span>
            <span className="block text-[0.9375rem] text-graphite-2">{feature.role}</span>
          </figcaption>
        </figure>
      </div>

      <ul ref={rail} aria-label="More client voices" className="v5-rail mt-20 flex gap-5 overflow-x-auto pb-4 pl-[max(1.25rem,calc((100vw_-_1080px)/2_+_1.25rem))] scroll-pl-[max(1.25rem,calc((100vw_-_1080px)/2_+_1.25rem))] pr-5">
        {rest.map((v) => (
          <li key={v.name} className="flex w-[19rem] shrink-0 snap-start flex-col justify-between rounded-[28px] bg-white p-8 shadow-[0_2px_12px_rgb(0_0_0/0.04)] sm:w-[22rem]">
            <blockquote className="v5-body text-[1.1875rem] font-medium text-graphite">&ldquo;{v.q}&rdquo;</blockquote>
            <p className="mt-8">
              <span className="block text-[0.9375rem] font-semibold text-graphite">{v.name}</span>
              <span className="block text-[0.875rem] text-graphite-2">{v.role}</span>
            </p>
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-6 flex max-w-[1080px] items-center justify-between gap-3 px-5">
        <p className="text-[0.75rem] text-graphite-3">Illustrative testimonials, placeholders for approved quotes.</p>
        <div className="flex gap-3">
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
      </div>
    </section>
  );
}
