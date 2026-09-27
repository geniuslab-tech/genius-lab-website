"use client";

import { useCallback, useEffect, useRef } from "react";
import { mixHex, smooth, useMedia, usePinProgress } from "./hooks";

/** Pinning needs room for the stack and a full layer of copy; shorter screens get stacked bands. */
const LAYERS_QUERY = "(prefers-reduced-motion: no-preference) and (min-height: 640px)";
import { SectionHead } from "./ui";

const LAYERS = [
  {
    n: "01",
    name: "Data Engineering",
    role: "The foundation.",
    body: "We connect your systems and engineer their data into one governed, reliable foundation: integration, pipelines, modeling and quality.",
    gives: ["Connected systems", "A unified data platform", "Trusted, tested pipelines"],
  },
  {
    n: "02",
    name: "Analytics",
    role: "Organized data becomes understanding.",
    body: "Analysis and modeling explain what is happening, why it is happening and what is likely to happen next.",
    gives: ["Performance analysis", "Forecasts and drivers", "Customer and operational insight"],
  },
  {
    n: "03",
    name: "Business Intelligence",
    role: "Understanding becomes visible.",
    body: "One set of definitions behind every dashboard and report, so leadership sees the same numbers, at the same time.",
    gives: ["Executive dashboards", "Shared metrics and KPIs", "Self-service reporting"],
  },
  {
    n: "04",
    name: "Artificial Intelligence",
    role: "Visibility gains context and reasoning.",
    body: "AI learns your business context and becomes its Second Brain. AI Agents reason across systems, tables, metrics and processes to answer and act.",
    gives: ["Second Brain", "AI Agents", "Orchestrated execution"],
  },
];

/**
 * The page brightens one step per layer. Each layer's own text colour is set for its own step, and
 * the switch from light-on-dark to dark-on-light happens between layers 02 and 03, while the copy
 * is crossfading, so no text ever sits on a mid-tone ground.
 */
const STEPS = ["#0a1030", "#1b2863", "#cddbef", "#eef3fa", "#ffffff"];
const TONES = ["dark", "dark", "light", "light"] as const;
const W = 0.2;

function groundAt(s: number) {
  for (let b = 1; b <= 3; b++) {
    if (s >= b - W && s <= b + W) return mixHex(STEPS[b - 1], STEPS[b], smooth(b - W, b + W, s));
  }
  if (s > 3.62) return mixHex(STEPS[3], STEPS[4], smooth(3.62, 3.98, s));
  return STEPS[Math.min(3, Math.floor(s))];
}

export function Layers() {
  // False through hydration, so the pinned version switches on after mount, far below the fold.
  const live = useMedia(LAYERS_QUERY);
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const plates = useRef<(HTMLDivElement | null)[]>([]);
  const ticks = useRef<(HTMLSpanElement | null)[]>([]);
  const crown = useRef<HTMLDivElement>(null);

  const onProgress = useCallback((p: number) => {
    const s = p * 4;
    const st = stage.current;
    if (st) {
      st.style.backgroundColor = groundAt(s);
      const tone = s >= 2 ? "light" : "dark";
      if (st.dataset.tone !== tone) {
        st.dataset.tone = tone;
        st.dataset.v23Tone = tone;
      }
    }
    const cur = Math.min(3, Math.floor(s));
    items.current.forEach((el, i) => {
      if (!el) return;
      const inn = i === 0 ? 1 : smooth(i, i + 0.16, s);
      const out = i === 3 ? 1 : 1 - smooth(i + 1 - 0.16, i + 1, s);
      el.style.opacity = (inn * out).toFixed(3);
      el.style.transform = `translate3d(0,${((1 - inn) * 32 - (1 - out) * 32).toFixed(1)}px,0)`;
      el.style.pointerEvents = i === cur ? "auto" : "none";
    });
    plates.current.forEach((el, j) => {
      if (!el) return;
      const settle = j === 0 ? 1 : smooth(j - 0.4, j + 0.04, s);
      el.style.opacity = (0.08 + 0.92 * settle).toFixed(3);
      el.style.transform = `translate3d(0,0,${(j * 46 + (1 - settle) * 170).toFixed(1)}px)`;
      el.classList.toggle("is-on", j === cur);
    });
    ticks.current.forEach((el, j) => el?.classList.toggle("is-on", j <= cur));
    if (crown.current) crown.current.style.opacity = smooth(3.35, 3.7, s).toFixed(3);
  }, []);
  usePinProgress(track, onProgress, live);

  // Leaving the pinned mode (reduced motion switched on, or a short window) restores the bands.
  useEffect(() => {
    if (live) return;
    const st = stage.current;
    if (st) {
      st.style.backgroundColor = "";
      st.dataset.tone = "dark";
      st.dataset.v23Tone = "dark";
    }
    items.current.forEach((el) => el?.removeAttribute("style"));
  }, [live]);

  return (
    <section id="layers" className="v23-layers scroll-mt-16" data-v23-chapter="Four layers" aria-labelledby="v23-layers-title">
      <div className="bg-[#0a1030] pb-16 pt-24 sm:pt-32" data-tone="dark" data-v23-tone="dark">
        <div className="v23-wrap">
          <SectionHead
            n="02"
            id="v23-layers-title"
            kicker="Platform"
            title={<>One intelligence and execution layer across your&nbsp;business.</>}
            lead="Not four products. Every layer is built on the one beneath it, and each one brings more light to the business. The top of the stack is a better decision."
          />
        </div>
      </div>

      <div ref={track} className="v23-layers-track" data-live={live ? "1" : "0"}>
        <div ref={stage} className="v23-layers-stage" data-tone="dark" data-v23-tone="dark">
          <div className="v23-wrap v23-layers-grid">
            <div className="v23-stack-wrap" aria-hidden="true">
              <div className="v23-stack">
                {LAYERS.map((l, j) => (
                  <div
                    key={l.n}
                    ref={(el) => {
                      plates.current[j] = el;
                    }}
                    className="v23-plate"
                    style={{ transform: `translate3d(0,0,${j * 46}px)` }}
                  >
                    <span className="v23-mono">{l.n}</span>
                    <span>{l.name}</span>
                  </div>
                ))}
              </div>
              <div ref={crown} className="v23-crown v23-label" style={{ opacity: 0 }}>
                Better decisions
              </div>
            </div>

            <ol className="v23-layers-list" aria-label="Layers, foundation first">
              {LAYERS.map((l, i) => (
                <li
                  key={l.n}
                  ref={(el) => {
                    items.current[i] = el;
                  }}
                  className={`v23-layer v23-layer-${i}`}
                  data-tone={TONES[i]}
                  data-v23-tone={live ? undefined : TONES[i]}
                >
                  <div className="v23-layer-in">
                    <p className="v23-label flex items-center gap-3 text-(--tx-3)">
                      <span className="text-(--accent)">Layer {l.n}</span>
                      <span className="h-px w-8 bg-(--line-2)" aria-hidden="true" />
                      <span>of 04</span>
                    </p>
                    <h3 className="v23-display mt-5 text-[clamp(2rem,4.4vw,3.5rem)]">{l.name}</h3>
                    <p className="mt-3 text-[1.1875rem] font-semibold tracking-[-0.01em]">{l.role}</p>
                    <p className="mt-4 max-w-[48ch] text-pretty text-[1rem] leading-[1.7] text-(--tx-2)">{l.body}</p>
                    <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${l.name} delivers`}>
                      {l.gives.map((g) => (
                        <li key={g} className="v23-chip">
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>

            <div className="v23-ticks" aria-hidden="true">
              {LAYERS.map((l, j) => (
                <span
                  key={l.n}
                  ref={(el) => {
                    ticks.current[j] = el;
                  }}
                  className={j === 0 ? "is-on" : ""}
                >
                  <i />
                  {l.n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
