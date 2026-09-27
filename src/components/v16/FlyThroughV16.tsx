"use client";

import { useCallback, useEffect, useRef } from "react";
import { mulberry32, smooth, useReduced, useScrollProgress } from "./hooks";
import { Kicker } from "./ui";

/** The story in one line: complexity, connection, understanding, visibility, intelligence, decisions. */
const STAGES = [
  { word: "Complexity", line: "Systems, teams and processes pulling apart." },
  { word: "Connection", line: "Every system joined. Nothing ripped out." },
  { word: "Understanding", line: "Organized data explains what is happening, and why." },
  { word: "Visibility", line: "One set of numbers, for everyone, at the same time." },
  { word: "Intelligence", line: "Context and reasoning, held in a Second Brain." },
  { word: "Decisions", line: "Agents that answer, and act." },
];

const D = 720;
const TRAVEL = (STAGES.length - 1) * D + 260;

const rand = mulberry32(8812);
const MOTES = Array.from({ length: 42 }, () => ({
  x: (rand() * 2 - 1) * 70,
  y: (rand() * 2 - 1) * 55,
  z: -rand() * (TRAVEL + D * 2),
  s: 1 + Math.round(rand() * 2),
}));

function Gate({ warm }: { warm: boolean }) {
  return (
    <svg viewBox="0 0 200 174" className="absolute left-1/2 top-1/2 w-[min(118vw,1120px)] -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
      <path
        d="M50 2h100l48 85-48 85H50L2 87z"
        fill="none"
        stroke={warm ? "rgb(255 178 107 / 0.55)" : "rgb(143 220 255 / 0.32)"}
        strokeWidth="0.4"
      />
      <path d="M56 12h88l43 75-43 75H56L13 87z" fill="none" stroke={warm ? "rgb(255 178 107 / 0.2)" : "rgb(143 220 255 / 0.12)"} strokeWidth="0.25" strokeDasharray="1 2" />
    </svg>
  );
}

export function FlyThroughV16() {
  const reduce = useReduced();
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const planes = useRef<(HTMLDivElement | null)[]>([]);
  const motes = useRef<(HTMLSpanElement | null)[]>([]);
  const bar = useRef<HTMLSpanElement>(null);

  const onProgress = useCallback((p: number) => {
    const cam = smooth(0.04, 0.96, p) * TRAVEL;
    planes.current.forEach((el, i) => {
      if (!el) return;
      const z = -i * D + cam;
      const o = z > 0 ? 1 - smooth(0, 300, z) : smooth(-3.4 * D, -0.5 * D, z);
      el.style.opacity = o.toFixed(3);
      el.style.visibility = o < 0.01 ? "hidden" : "visible";
      el.style.transform = `translate3d(-50%,-50%,${z.toFixed(1)}px) rotateZ(${(i % 2 ? 1 : -1) * 4 * (1 - o)}deg)`;
    });
    motes.current.forEach((el, i) => {
      if (!el) return;
      const m = MOTES[i];
      const z = m.z + cam;
      const o = z > 200 ? 0 : smooth(-2600, -400, z);
      el.style.opacity = (o * 0.8).toFixed(3);
      el.style.transform = `translate3d(${m.x}vw,${m.y}vh,${z.toFixed(1)}px)`;
    });
    if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(4)})`;
  }, []);
  useScrollProgress(track, onProgress, !reduce);

  // The camera leans toward the cursor.
  useEffect(() => {
    if (reduce) return;
    const el = stage.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = 50 + (e.clientX / window.innerWidth - 0.5) * 16;
        const y = 50 + (e.clientY / window.innerHeight - 0.5) * 12;
        el.style.perspectiveOrigin = `${x}% ${y}%`;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduce]);

  if (reduce) {
    return (
      <section className="border-y border-[color:var(--line)] py-20" aria-labelledby="v16-fly-title">
        <div className="v16-wrap">
          <Kicker>The path</Kicker>
          <h2 id="v16-fly-title" className="v16-h2 mt-6">
            From complexity to decisions.
          </h2>
          <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STAGES.map((s, i) => (
              <li key={s.word} className="v16-panel p-5">
                <span className={`v16-label ${i === STAGES.length - 1 ? "text-[color:var(--warm)]" : "text-[color:var(--ice)]"}`}>0{i + 1}</span>
                <p className="v16-display mt-3 text-[1.5rem]">{s.word}</p>
                <p className="mt-1 text-[color:var(--tx-2)]">{s.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="v16-fly-title">
      <div ref={track} className="relative h-[320svh]">
        <div ref={stage} className="v16-fly-stage sticky top-0 h-[100svh] overflow-hidden bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,#0d1446_0%,var(--g0)_75%)]">
          <div className="v16-fly-world">
            {MOTES.map((m, i) => (
              <span
                key={i}
                ref={(el) => {
                  motes.current[i] = el;
                }}
                className="absolute left-1/2 top-1/2 rounded-full bg-[color:var(--ice-2)] opacity-0"
                style={{ width: m.s, height: m.s }}
                aria-hidden="true"
              />
            ))}
            <ol className="absolute inset-0 [transform-style:preserve-3d]">
              {STAGES.map((s, i) => {
                const warm = i === STAGES.length - 1;
                return (
                  <li key={s.word} className="absolute inset-0 [transform-style:preserve-3d]">
                    <div
                      ref={(el) => {
                        planes.current[i] = el;
                      }}
                      className="v16-fly-plane text-center opacity-0"
                    >
                      <Gate warm={warm} />
                      <p className={`v16-label relative ${warm ? "text-[color:var(--warm)]" : "text-[color:var(--ice)]"}`}>
                        0{i + 1} / 0{STAGES.length}
                      </p>
                      <p className="v16-display relative mt-4 text-[clamp(2.75rem,10vw,8.5rem)] leading-none">{s.word}</p>
                      <p className="relative mx-auto mt-5 max-w-[34ch] text-[clamp(1rem,1.6vw,1.25rem)] text-[color:var(--tx-2)]">{s.line}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-16 z-10">
            <div className="v16-wrap flex items-start justify-between gap-6 pt-6">
              <div>
                <Kicker>The path</Kicker>
                <h2 id="v16-fly-title" className="v16-display mt-3 text-[1.125rem] text-[color:var(--tx-2)]">
                  From complexity to decisions.
                </h2>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-8 z-10">
            <div className="v16-wrap">
              <span className="block h-px w-full bg-[color:var(--line)]" aria-hidden="true">
                <span ref={bar} className="block h-px w-full origin-left scale-x-0 bg-[color:var(--ice)]" />
              </span>
              <p className="v16-label mt-3 text-[color:var(--tx-3)]">Scroll to move forward</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
