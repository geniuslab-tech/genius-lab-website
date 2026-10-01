"use client";

import { useCallback, useState } from "react";
import { ApproveDemo, CHAPTERS, CHAPTER_SPANS, type Chapter } from "@/components/hero-demo/ApproveDemo";
import { Reveal } from "@/components/v24/Reveal";

const LOGOS = ["NORTHWIND", "AXIOM", "MERIDIAN", "VANTA GROUP", "HELIOS", "CALDERA", "ORBIS", "STRATUM"];

const PROOF = [
  { k: "38s", v: "from approval to execution" },
  { k: "5", v: "systems orchestrated, no new software" },
  { k: "100%", v: "of actions signed and audited" },
  { k: "$1.4M", v: "cash released in one decision" },
];

/**
 * v28 — premium. The same story as v25, directed like a product film: the
 * camera pushes in on the action, the device sits on a lit stage, and the
 * copy narrates each chapter in sync with the interface.
 */
export function Hero() {
  const [state, setState] = useState<{ chapter: Chapter; loop: number }>({ chapter: "recommend", loop: -1 });
  const onChapter = useCallback((chapter: Chapter, loop: number) => setState({ chapter, loop }), []);
  const activeIdx = CHAPTERS.findIndex((c) => c.key === state.chapter);

  return (
    <section id="top" className="v28-stage relative isolate overflow-hidden pt-16">
      {/* lit stage */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="v28-aurora absolute -right-[20%] -top-[30%] h-[85rem] w-[85rem] rounded-full" />
        <div className="absolute -left-40 top-24 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,oklch(0.77_0.155_66/9%),transparent_65%)] blur-2xl" />
        <div className="v28-grid absolute inset-0" />
        <div className="v28-grain absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent to-[var(--background)]" />
      </div>

      <div className="relative mx-auto grid max-w-[118rem] grid-cols-[minmax(0,1fr)] gap-14 px-6 pb-10 pt-16 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:gap-12 lg:px-10 lg:pt-14 xl:grid-cols-[minmax(0,39rem)_minmax(0,1fr)] 2xl:gap-16">
        <Reveal className="min-w-0 self-center">
          <p className="flex items-center gap-3 font-gl-mono text-[0.66rem] uppercase tracking-[0.26em] text-gl-muted-foreground">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--gold)]" />
            One partner. One platform. One source of truth.
          </p>
          <h1 className="v28-title mt-7 font-gl-display text-[2.2rem] font-semibold leading-[1.06] tracking-[-0.035em] sm:text-[2.5rem] lg:text-[2.05rem] xl:whitespace-nowrap xl:text-[2.5rem]">
            <span className="block">Transform Business Complexity</span>
            <span className="v28-title-accent">into Strategic Advantage</span>
          </h1>
          <p className="mt-7 max-w-[34rem] text-[1.04rem] leading-relaxed text-gl-muted-foreground">
            <span className="font-medium text-gl-foreground">A fully managed intelligence and execution layer for your entire business.</span> We connect
            your systems and unify your data to deliver clear insights and orchestrate execution, building on the software you already rely on.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#demo" className="v28-cta group relative rounded-lg px-6 py-3.5 text-sm font-medium text-[oklch(0.16_0.03_264)]">
              See Genius Lab in action
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </a>
            <a
              href="#cta"
              className="rounded-lg border border-gl-foreground/15 bg-gl-foreground/[0.03] px-6 py-3.5 text-sm text-gl-foreground backdrop-blur transition-colors duration-500 hover:border-gl-foreground/30"
            >
              Book a demo
            </a>
          </div>

          {/* narrated chapters, in sync with the interface */}
          <div className="mt-12 hidden lg:block">
            <p className="mb-4 flex items-center gap-2 font-gl-mono text-[0.6rem] uppercase tracking-[0.22em] text-gl-muted-foreground/70">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-[var(--gold)] opacity-60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
              </span>
              Watch one decision, end to end
            </p>
            <ol className="relative space-y-1">
              {CHAPTERS.map((c, i) => {
                const on = i === activeIdx;
                const past = i < activeIdx;
                const [a, b] = CHAPTER_SPANS[c.key];
                return (
                  <li key={c.key} className={`relative rounded-lg py-2 pl-12 pr-3 transition-colors duration-500 ${on ? "bg-gl-foreground/[0.035]" : ""}`}>
                    <span
                      className={`absolute left-3 top-2.5 font-gl-mono text-[0.62rem] tabular-nums transition-colors duration-500 ${on ? "text-[var(--gold)]" : past ? "text-gl-data" : "text-gl-muted-foreground/45"}`}
                    >
                      0{i + 1}
                    </span>
                    <p className={`text-[0.86rem] transition-colors duration-500 ${on ? "text-gl-foreground" : past ? "text-gl-muted-foreground" : "text-gl-muted-foreground/55"}`}>
                      {c.title}
                    </p>
                    <div className={`grid transition-all duration-500 ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <p className="overflow-hidden text-[0.78rem] leading-snug text-gl-muted-foreground">{c.body}</p>
                    </div>
                    <span className="absolute bottom-0 left-12 right-3 h-px bg-gl-foreground/[0.06]">
                      {on && state.loop >= 0 ? (
                        <span
                          key={`${c.key}-${state.loop}`}
                          className="v28-progress absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--data)] to-[var(--gold)]"
                          style={{ animationDuration: `${b - a}ms` }}
                        />
                      ) : past ? (
                        <span className="absolute inset-0 bg-gl-data/40" />
                      ) : null}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </Reveal>

        <Reveal className="relative min-w-0 self-center" delay={150}>
          <div id="demo" className="v28-device-wrap relative">
            <div className="v28-floor pointer-events-none absolute -bottom-16 left-[6%] right-[6%] h-28" aria-hidden="true" />
            <div className="v28-device relative rounded-[22px] p-[7px]">
              <div className="mb-[6px] flex items-center justify-between px-3 pt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-gl-foreground/15" />
                  <span className="h-2 w-2 rounded-full bg-gl-foreground/15" />
                  <span className="h-2 w-2 rounded-full bg-gl-foreground/15" />
                </div>
                <span className="font-gl-mono text-[0.58rem] tracking-[0.12em] text-gl-muted-foreground/70">app.geniuslab.tech / meridian</span>
                <span className="flex items-center gap-1.5 font-gl-mono text-[0.56rem] uppercase tracking-[0.16em] text-[var(--gold)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" /> Live demo
                </span>
              </div>
              <ApproveDemo cinematic onChapter={onChapter} />
            </div>
          </div>
          {/* mobile chapter caption */}
          <p className="mt-6 text-center text-[0.82rem] text-gl-muted-foreground lg:hidden">
            <span className="text-[var(--gold)]">0{activeIdx + 1} · {CHAPTERS[activeIdx]?.title}</span> — {CHAPTERS[activeIdx]?.body}
          </p>
        </Reveal>
      </div>

      {/* proof strip */}
      <div className="relative mx-auto max-w-[118rem] px-6 pb-16 lg:px-10">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-gl-foreground/[0.07] bg-gl-foreground/[0.07] md:grid-cols-4">
          {PROOF.map((p) => (
            <div key={p.k} className="bg-[oklch(0.13_0.03_264/92%)] px-5 py-5 backdrop-blur">
              <p className="font-gl-display text-[1.6rem] font-semibold tracking-tight text-gl-foreground">{p.k}</p>
              <p className="mt-1 text-[0.78rem] text-gl-muted-foreground">{p.v}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-10 gap-y-4">
          <p className="text-[0.62rem] uppercase tracking-[0.3em] text-gl-muted-foreground/60">Trusted by operators, manufacturers and value creation teams</p>
          <div className="flex flex-wrap items-center gap-x-9 gap-y-3">
            {LOGOS.map((l) => (
              <span key={l} className="font-gl-display text-[0.72rem] tracking-[0.24em] text-gl-muted-foreground/45">
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
