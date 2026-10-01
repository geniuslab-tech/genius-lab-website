"use client";

import { CARDS, CARD_H, CARD_W } from "./StageCards";
import { FitCanvas, HowSection, STAGES, clamp, keyframes, mix, phase, r2, stageAt } from "./shared";

const VW = 1200;
const VH = 800;
const SPINE_X = 600;
const STEP = 520;
const TOP = 140;
const nodeY = (i: number) => TOP + i * STEP + CARD_H / 2;
const H = nodeY(5) + 400;

/**
 * V34 — one luminous spine. Data falls down a single line; every stage hangs
 * off it, lights when the signal arrives, and the last stage loops back up
 * to the first so the system reads as a closed circuit.
 */
function Spine({ p }: { p: number }) {
  const { i: active, t } = stageAt(p);
  // signal head travels node to node, easing at each stop
  const head = keyframes(p, [
    ...STAGES.flatMap((_, i) => [
      { at: i / 6 + 0.02, v: nodeY(i) },
      { at: (i + 1) / 6 - 0.03, v: nodeY(i) },
    ]),
  ]);
  const finale = phase(p, 0.94, 0.995);
  const cy = mix(head, H / 2 - 60, finale);
  const s = mix(1, VH / (H + 200), finale);
  const loop = phase(p, 0.9, 0.98);

  return (
    <div
      className="absolute left-0 top-0 origin-top-left"
      style={{ width: VW, height: H, transform: `translate(${r2(VW / 2 - SPINE_X * s)}px, ${r2(VH / 2 - cy * s)}px) scale(${r2(s * 1000) / 1000})` }}
    >
      <svg className="absolute inset-0 overflow-visible" width={VW} height={H} aria-hidden="true">
        <defs>
          <linearGradient id="spineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--data)" />
            <stop offset="0.6" stopColor="var(--cyan)" />
            <stop offset="1" stopColor="var(--gold)" />
          </linearGradient>
        </defs>
        {/* rail */}
        <line x1={SPINE_X} x2={SPINE_X} y1={nodeY(0) - 120} y2={nodeY(5)} stroke="oklch(1 0 0 / 7%)" strokeWidth="2" />
        {/* lit portion */}
        <line x1={SPINE_X} x2={SPINE_X} y1={nodeY(0) - 120} y2={head} stroke="url(#spineGrad)" strokeWidth="3" />
        <line x1={SPINE_X} x2={SPINE_X} y1={nodeY(0) - 120} y2={head} stroke="var(--cyan)" strokeWidth="14" strokeOpacity="0.1" />
        {/* falling packets */}
        {[0, 1, 2, 3].map((k) => (
          <circle key={k} r="3.5" fill="var(--cyan)">
            <animateMotion dur="2.4s" begin={`${k * 0.6}s`} repeatCount="indefinite" path={`M ${SPINE_X} ${nodeY(0) - 120} L ${SPINE_X} ${r2(head)}`} />
          </circle>
        ))}
        {/* signal head */}
        <circle cx={SPINE_X} cy={head} r="7" fill="var(--gold)" />
        <circle cx={SPINE_X} cy={head} r="18" fill="var(--gold)" opacity="0.18" />

        {/* branches + nodes */}
        {STAGES.map((st, i) => {
          const lit = i < active || (i === active && t > 0.04);
          const left = i % 2 === 0;
          const x2 = left ? SPINE_X - 70 : SPINE_X + 70;
          return (
            <g key={st.index}>
              <line x1={SPINE_X} x2={x2} y1={nodeY(i)} y2={nodeY(i)} stroke={lit ? (i >= 4 ? "var(--gold)" : "var(--data)") : "oklch(1 0 0 / 12%)"} strokeWidth="1.5" />
              <circle cx={SPINE_X} cy={nodeY(i)} r="9" fill="oklch(0.15 0.03 264)" stroke={lit ? (i >= 4 ? "var(--gold)" : "var(--data)") : "oklch(1 0 0 / 20%)"} strokeWidth="2" />
              <text x={left ? SPINE_X + 22 : SPINE_X - 22} y={nodeY(i) + 4} textAnchor={left ? "start" : "end"} className="font-gl-mono" fontSize="11" letterSpacing="3" fill={lit ? "var(--foreground)" : "var(--muted-foreground)"} fillOpacity={lit ? 0.9 : 0.4}>
                {st.index} · {st.title.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* the loop: results written back to the systems of record */}
        <path
          d={`M ${SPINE_X} ${nodeY(5)} C ${SPINE_X} ${nodeY(5) + 260}, ${VW + 40} ${nodeY(5) + 200}, ${VW + 40} ${H / 2} S ${SPINE_X + 200} ${nodeY(0) - 300}, ${SPINE_X} ${nodeY(0) - 120}`}
          fill="none"
          stroke="var(--success)"
          strokeWidth="3"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - loop}
          opacity={0.9}
        />
      </svg>

      {STAGES.map((st, i) => {
        const Card = CARDS[i]!;
        const left = i % 2 === 0;
        const local = i < active ? 1 : i === active ? t : 0;
        const near = 1 - clamp(Math.abs(active + t - 0.5 - i) - 0.6);
        return (
          <div
            key={st.index}
            className="absolute"
            style={{
              left: left ? SPINE_X - 70 - CARD_W : SPINE_X + 70,
              top: nodeY(i) - CARD_H / 2,
              width: CARD_W,
              height: CARD_H,
              opacity: mix(0.28, 1, Math.max(near, finale)),
              transform: `scale(${r2(mix(0.94, 1, near))})`,
              filter: near > 0.5 || finale > 0.5 ? "none" : "saturate(0.6)",
            }}
          >
            <Card t={i === active ? phase(local, 0, 0.85) : local} />
          </div>
        );
      })}
    </div>
  );
}

export function V34Spine() {
  return (
    <HowSection
      heightVh={720}
      accent="gold"
      visual={(p) => (
        <FitCanvas w={VW} h={VH}>
          <Spine p={p} />
        </FitCanvas>
      )}
    />
  );
}
