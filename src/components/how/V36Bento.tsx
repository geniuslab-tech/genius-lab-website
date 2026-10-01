"use client";

import { CARDS, CARD_H, CARD_W } from "./StageCards";
import { FitCanvas, HowSection, STAGES, clamp, keyframes, mix, phase, r2, stageAt } from "./shared";

const GAP = 64;
const VW = CARD_W * 3 + GAP * 2 + 160;
const VH = CARD_H * 2 + GAP + 200;
const OX = 80;
const OY = 100;
/** snake order so the path never jumps: 01 02 03 on top, 06 05 04 below */
const CELL = [
  { c: 0, r: 0 },
  { c: 1, r: 0 },
  { c: 2, r: 0 },
  { c: 2, r: 1 },
  { c: 1, r: 1 },
  { c: 0, r: 1 },
];
const cellXY = (i: number) => ({ x: OX + CELL[i]!.c * (CARD_W + GAP), y: OY + CELL[i]!.r * (CARD_H + GAP) });
const centre = (i: number) => {
  const { x, y } = cellXY(i);
  return { x: x + CARD_W / 2, y: y + CARD_H / 2 };
};

/** connector between consecutive tiles, edge to edge */
function link(i: number) {
  const a = cellXY(i);
  const b = cellXY(i + 1);
  if (CELL[i]!.r === CELL[i + 1]!.r) {
    const dir = CELL[i + 1]!.c > CELL[i]!.c ? 1 : -1;
    const x1 = dir > 0 ? a.x + CARD_W : a.x;
    const x2 = dir > 0 ? b.x : b.x + CARD_W;
    const y = a.y + CARD_H / 2;
    return `M ${x1} ${y} L ${x2} ${y}`;
  }
  const x = a.x + CARD_W / 2;
  return `M ${x} ${a.y + CARD_H} L ${x} ${b.y}`;
}
const LOOP = (() => {
  const a = cellXY(5);
  const b = cellXY(0);
  return `M ${a.x} ${a.y + CARD_H / 2} C ${a.x - 70} ${a.y + CARD_H / 2}, ${b.x - 70} ${b.y + CARD_H / 2}, ${b.x} ${b.y + CARD_H / 2}`;
})();

/**
 * V36 — the operating system assembles itself as a map. Each stage is a tile;
 * the camera moves tile to tile along a snake path, the connector lights as
 * data passes, and the final pull-back shows the whole loop at once.
 */
function Bento({ p }: { p: number }) {
  const { i: active, t } = stageAt(p);
  const finale = phase(p, 0.93, 0.99);
  const frames = (key: "x" | "y") =>
    STAGES.flatMap((_, i) => [
      { at: i / 6 + 0.035, v: centre(i)[key] },
      { at: (i + 1) / 6 - 0.025, v: centre(i)[key] },
    ]);
  const cx = mix(keyframes(p, frames("x")), VW / 2, finale);
  const cy = mix(keyframes(p, frames("y")), VH / 2, finale);
  const s = mix(1.42, 1, finale);

  return (
    <div
      className="absolute left-0 top-0 origin-top-left"
      style={{ width: VW, height: VH, transform: `translate(${r2(VW / 2 - cx * s)}px, ${r2(VH / 2 - cy * s)}px) scale(${r2(s * 1000) / 1000})` }}
    >
      <svg className="absolute inset-0 overflow-visible" width={VW} height={VH} aria-hidden="true">
        {STAGES.slice(0, 5).map((_, i) => {
          const draw = phase(p, (i + 1) / 6 - 0.04, (i + 1) / 6 + 0.02);
          const color = i >= 3 ? "var(--gold)" : "var(--data)";
          const d = link(i);
          return (
            <g key={i}>
              <path d={d} stroke="oklch(1 0 0 / 8%)" strokeWidth="2" fill="none" />
              <path d={d} stroke={color} strokeWidth="2.4" fill="none" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
              <path d={d} stroke={color} strokeWidth="12" strokeOpacity={0.12 * draw} fill="none" />
              {draw > 0.98
                ? [0, 1].map((k) => (
                    <circle key={k} r="4" fill={color}>
                      <animateMotion dur="1.6s" begin={`${k * 0.8}s`} repeatCount="indefinite" path={d} />
                    </circle>
                  ))
                : null}
            </g>
          );
        })}
        <path d={LOOP} stroke="var(--success)" strokeWidth="2.6" fill="none" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - phase(p, 0.9, 0.97)} />
        {phase(p, 0.9, 0.97) > 0.98 ? (
          <circle r="4" fill="var(--success)">
            <animateMotion dur="2.2s" repeatCount="indefinite" path={LOOP} />
          </circle>
        ) : null}
      </svg>
      {STAGES.map((st, i) => {
        const Card = CARDS[i]!;
        const { x, y } = cellXY(i);
        const lit = i <= active || finale > 0.5;
        const on = i === active && finale < 0.5;
        const local = i < active ? 1 : i === active ? clamp(t / 0.85) : 0;
        return (
          <div
            key={st.index}
            className="absolute rounded-[22px] transition-[box-shadow] duration-500"
            style={{
              left: x,
              top: y,
              width: CARD_W,
              height: CARD_H,
              opacity: lit ? 1 : 0.32,
              boxShadow: on ? `0 0 0 1px ${i >= 3 ? "oklch(0.77 0.155 66 / 55%)" : "oklch(0.7 0.17 252 / 55%)"}, 0 40px 90px -30px ${i >= 3 ? "oklch(0.77 0.155 66 / 45%)" : "oklch(0.6 0.19 255 / 55%)"}` : "none",
            }}
          >
            <Card t={finale > 0.5 ? 1 : local} />
          </div>
        );
      })}
    </div>
  );
}

export function V36Bento() {
  return (
    <HowSection
      heightVh={700}
      visual={(p) => (
        <FitCanvas w={VW} h={VH}>
          <Bento p={p} />
        </FitCanvas>
      )}
    />
  );
}
