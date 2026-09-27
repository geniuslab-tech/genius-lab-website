import type { ReactNode } from "react";
import { axialToPixel, hexPoints, hexRing } from "@/lib/hex";

/*
  Engraved emblems for the four collection plates, all drawn from the hexagon lattice.
  Geometry is computed once at module load and rounded, so markup is stable.
*/

const W = 400;
const H = 260;
const CX = W / 2;
const CY = H / 2;
const GOLD = "#d8c29d";

const r2 = (v: number) => Math.round(v * 100) / 100;

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      {children}
    </svg>
  );
}

/* 01: the foundation. A honeycomb laid in courses, heavier toward the base. */
const FOUNDATION = (() => {
  const size = 17;
  const cells: { pts: string; o: number }[] = [];
  for (let row = 0; row < 6; row++) {
    const y = H - 40 - row * size * 1.5;
    const count = 9 - row;
    const width = (count - 1) * size * Math.sqrt(3);
    for (let i = 0; i < count; i++) {
      const x = CX - width / 2 + i * size * Math.sqrt(3);
      cells.push({ pts: hexPoints(x, y, size - 1.5), o: r2(0.75 - row * 0.11) });
    }
  }
  return cells;
})();

export function EmblemFoundation() {
  return (
    <Frame label="A honeycomb laid in courses like a foundation.">
      {FOUNDATION.map((c, i) => (
        <polygon key={i} points={c.pts} fill="none" stroke={GOLD} strokeOpacity={c.o} strokeWidth="0.8" />
      ))}
      <line x1="40" x2="360" y1={H - 18} y2={H - 18} stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.6" />
    </Frame>
  );
}

/* 02: analytics. A faint lattice with a line of understanding rising through it. */
const LATTICE = (() => {
  const size = 20;
  const out: string[] = [];
  for (let ring = 0; ring <= 3; ring++) {
    for (const [q, r] of hexRing(ring)) {
      const p = axialToPixel(q, r, size);
      if (Math.abs(p.x) > 170 || Math.abs(p.y) > 110) continue;
      out.push(hexPoints(CX + p.x, CY + p.y, size - 1.5));
    }
  }
  return out;
})();

const RISE = [
  [52, 206],
  [104, 184],
  [150, 192],
  [200, 142],
  [246, 128],
  [296, 82],
  [348, 58],
] as const;

export function EmblemAnalytics() {
  return (
    <Frame label="A hexagon lattice with a line rising through it.">
      {LATTICE.map((p, i) => (
        <polygon key={i} points={p} fill="none" stroke={GOLD} strokeOpacity="0.18" strokeWidth="0.7" />
      ))}
      <polyline points={RISE.map((p) => p.join(",")).join(" ")} fill="none" stroke={GOLD} strokeOpacity="0.85" strokeWidth="0.9" />
      {RISE.map(([x, y], i) => (
        <g key={i}>
          <line x1={x} x2={x} y1={y + 6} y2={H - 20} stroke={GOLD} strokeOpacity="0.2" strokeWidth="0.5" strokeDasharray="1 3" />
          <circle cx={x} cy={y} r="2.4" fill="#0a0e1f" stroke={GOLD} strokeWidth="0.8" />
        </g>
      ))}
    </Frame>
  );
}

/* 03: business intelligence. Concentric hexagons, a lens that makes it visible. */
const NESTED = [22, 40, 58, 76, 94, 112].map((r, i) => ({ pts: hexPoints(CX, CY, r, true), o: r2(0.85 - i * 0.12) }));
const SPOKES = Array.from({ length: 6 }, (_, i) => {
  const a = (i * 60 * Math.PI) / 180;
  return { x1: r2(CX + Math.cos(a) * 22), y1: r2(CY + Math.sin(a) * 22), x2: r2(CX + Math.cos(a) * 112), y2: r2(CY + Math.sin(a) * 112) };
});

export function EmblemIntelligence() {
  return (
    <Frame label="Concentric hexagons forming a lens.">
      {NESTED.map((n, i) => (
        <polygon key={i} points={n.pts} fill="none" stroke={GOLD} strokeOpacity={n.o} strokeWidth="0.8" />
      ))}
      {SPOKES.map((s, i) => (
        <line key={i} {...s} stroke={GOLD} strokeOpacity="0.3" strokeWidth="0.6" />
      ))}
      <circle cx={CX} cy={CY} r="3" fill={GOLD} />
    </Frame>
  );
}

/* 04: artificial intelligence. Six nodes on a hexagon, every one joined to every other. */
const NODES = Array.from({ length: 6 }, (_, i) => {
  const a = ((-90 + i * 60) * Math.PI) / 180;
  return { x: r2(CX + Math.cos(a) * 96), y: r2(CY + Math.sin(a) * 96) };
});
const EDGES = NODES.flatMap((a, i) => NODES.slice(i + 1).map((b) => ({ a, b })));
const ROSE = Array.from({ length: 12 }, (_, i) => {
  const a = (i * 15 * Math.PI) / 180;
  return { x: r2(Math.cos(a) * 34), y: r2(Math.sin(a) * 34) };
});

export function EmblemAI() {
  return (
    <Frame label="Six connected nodes around a rosette.">
      <polygon points={hexPoints(CX, CY, 96)} fill="none" stroke={GOLD} strokeOpacity="0.55" strokeWidth="0.8" />
      {EDGES.map(({ a, b }, i) => (
        <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={GOLD} strokeOpacity="0.2" strokeWidth="0.6" />
      ))}
      {ROSE.map((p, i) => (
        <polygon key={i} points={hexPoints(CX + p.x * 0.28, CY + p.y * 0.28, 30)} fill="none" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.5" />
      ))}
      {NODES.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r="3.5" fill="#0a0e1f" stroke={GOLD} strokeWidth="0.9" />
      ))}
    </Frame>
  );
}

/* The outcome: one hexagon, one point of decision. */
export function EmblemDecision() {
  return (
    <Frame label="A single hexagon with one point at its centre.">
      <polygon points={hexPoints(CX, CY, 92)} fill="none" stroke={GOLD} strokeOpacity="0.8" strokeWidth="0.9" />
      <polygon points={hexPoints(CX, CY, 84)} fill="none" stroke={GOLD} strokeOpacity="0.3" strokeWidth="0.5" />
      <line x1={CX} x2={CX} y1={CY - 120} y2={CY - 30} stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.6" />
      <circle cx={CX} cy={CY} r="4" fill={GOLD} />
    </Frame>
  );
}
