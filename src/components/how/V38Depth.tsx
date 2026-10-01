"use client";

import { CARDS, CARD_H, CARD_W } from "./StageCards";
import { FitCanvas, HowSection, STAGES, clamp, keyframes, mix, phase, r2, stageAt } from "./shared";

const VW = 1200;
const VH = 800;
const GAP = 1100; // depth between planes
const SCALE = 1.3;
const PW = CARD_W * SCALE;
const PH = CARD_H * SCALE;
const OFFSET = [
  { x: 0, y: 0 },
  { x: 60, y: -30 },
  { x: -50, y: 20 },
  { x: 40, y: 30 },
  { x: -40, y: -20 },
  { x: 0, y: 0 },
];

const STARS = Array.from({ length: 70 }, (_, i) => {
  const a = Math.sin(i * 91.7) * 43758.5453;
  const b = Math.sin(i * 47.3) * 12345.678;
  const c = Math.sin(i * 13.1) * 9876.543;
  return { x: r2((a - Math.floor(a) - 0.5) * 2200), y: r2((b - Math.floor(b) - 0.5) * 1400), z: r2((c - Math.floor(c)) * GAP * 6) };
});

/**
 * V38 — fly through the system. Each stage is a pane of glass suspended in
 * depth; scrolling moves the camera forward through them along rails that
 * join every pane to the next, so you travel the data's path yourself.
 */
function Depth({ p }: { p: number }) {
  const { i: active } = stageAt(p);
  // camera dwells on each pane, then glides to the next
  const cam = keyframes(p, STAGES.flatMap((_, i) => [{ at: i / 6 + 0.04, v: i * GAP }, { at: (i + 1) / 6 - 0.02, v: i * GAP }]));
  const finale = phase(p, 0.92, 0.99);

  return (
    <div className="absolute inset-0 [perspective:1100px] [perspective-origin:50%_50%]">
      <div className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]" style={{ transform: `translateZ(${r2(cam - 260)}px)` }}>
        {/* stars streaming past */}
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute h-[3px] w-[3px] rounded-full bg-[var(--cyan)]"
            style={{ transform: `translate3d(${s.x}px, ${s.y}px, ${-s.z}px)`, opacity: 0.5 }}
          />
        ))}
        {/* rails joining pane corners through depth */}
        {[0, 1, 2, 3, 4].map((i) =>
          [
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
          ].map(([sx, sy], k) => {
            const a = OFFSET[i]!;
            const lit = phase(p, (i + 1) / 6 - 0.05, (i + 1) / 6 + 0.02);
            return (
              <span
                key={`${i}-${k}`}
                className="absolute h-px origin-left"
                style={{
                  width: GAP,
                  transform: `translate3d(${r2(a.x + (sx! * PW) / 2)}px, ${r2(a.y + (sy! * PH) / 2)}px, ${-i * GAP}px) rotateY(90deg)`,
                  background: `linear-gradient(90deg, ${finale > 0.5 ? "var(--success)" : i >= 3 ? "var(--gold)" : "var(--data)"}, transparent)`,
                  opacity: mix(0.12, 0.85, Math.max(lit, finale)),
                }}
              />
            );
          }),
        )}
        {/* panes */}
        {STAGES.map((st, i) => {
          const Card = CARDS[i]!;
          const z = -i * GAP;
          const rel = z + cam; // 0 when the camera rests on this pane
          const passed = clamp(rel / 500);
          const far = clamp(-rel / (GAP * 2.5));
          const opacity = (1 - passed) * mix(1, 0.25, far);
          const local = i < active ? 1 : i === active ? clamp(stageAt(p).t / 0.8) : 0;
          return (
            <div
              key={st.index}
              className="absolute"
              style={{
                width: PW,
                height: PH,
                left: -PW / 2,
                top: -PH / 2,
                transform: `translate3d(${OFFSET[i]!.x}px, ${OFFSET[i]!.y}px, ${z}px)`,
                opacity: r2(opacity),
                filter: i === active || finale > 0.5 ? "none" : `blur(${r2(Math.min(4, far * 6))}px)`,
              }}
            >
              <div className="h-full w-full origin-top-left" style={{ transform: `scale(${SCALE})`, width: CARD_W, height: CARD_H }}>
                <Card t={finale > 0.5 ? 1 : local} />
              </div>
              <span
                className="absolute -top-9 left-1 font-gl-mono text-[0.75rem] uppercase tracking-[0.24em]"
                style={{ color: i >= 3 ? "var(--gold)" : "var(--data)" }}
              >
                {st.index} · {st.title}
              </span>
            </div>
          );
        })}
      </div>
      <p
        className="pointer-events-none absolute inset-x-0 bottom-10 text-center font-gl-mono text-[0.8rem] uppercase tracking-[0.3em] text-[var(--success)]"
        style={{ opacity: finale }}
      >
        Six layers · one path · written back to every system
      </p>
    </div>
  );
}

export function V38Depth() {
  return (
    <HowSection
      heightVh={720}
      accent="gold"
      visual={(p) => (
        <FitCanvas w={VW} h={VH}>
          <Depth p={p} />
        </FitCanvas>
      )}
    />
  );
}
