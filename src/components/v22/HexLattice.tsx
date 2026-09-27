import type { CSSProperties } from "react";
import { axialToPixel, hexPoints } from "@/lib/hex";
import { chRect, hexRoute, r1, seeded } from "./ui";

const W = 720;
const H = 540;
const S = 24;
const C = { x: 430, y: 206 };
const SQ3 = Math.sqrt(3);

type Cell = { key: string; x: number; y: number; d: number; i: number; dx: number; dy: number; rot: number; o: number };

const rand = seeded(22);
const CLUSTER: Cell[] = [];
const FIELD: Cell[] = [];

for (let r = -11; r <= 11; r++) {
  for (let q = -16; q <= 16; q++) {
    const p = axialToPixel(q, r, S);
    const x = C.x + p.x;
    const y = C.y + p.y;
    if (x < -S || x > W + S || y < -S || y > H + S) continue;
    const d = (Math.abs(q) + Math.abs(r) + Math.abs(q + r)) / 2;
    const roll = rand();
    if (d <= 2) {
      const len = Math.hypot(p.x, p.y) || 1;
      const push = 60 + rand() * 110;
      CLUSTER.push({
        key: `${q},${r}`,
        x: r1(x),
        y: r1(y),
        d,
        i: CLUSTER.length,
        dx: r1(d === 0 ? 0 : (p.x / len) * push),
        dy: r1(d === 0 ? -40 : (p.y / len) * push),
        rot: Math.round(rand() * 80 - 40),
        o: 0,
      });
    } else if (roll < Math.max(0, 1 - d / 12) * 0.95) {
      FIELD.push({ key: `${q},${r}`, x: r1(x), y: r1(y), d, i: FIELD.length, dx: 0, dy: 0, rot: 0, o: r1(Math.max(0.05, 0.22 - d * 0.017)) });
    }
  }
}
// Assemble from the outside in, so the lattice seems to gather.
CLUSTER.sort((a, b) => b.d - a.d || a.i - b.i).forEach((c, i) => (c.i = i));

/** Systems the business already runs, wired into the cluster along hex angles. */
const SYSTEMS = [
  { name: "ERP", x: 64, y: 66 },
  { name: "CRM", x: 54, y: 206 },
  { name: "Finance", x: 104, y: 336 },
  { name: "Warehouse", x: 640, y: 54 },
  { name: "Sheets", x: 672, y: 190 },
  { name: "Cloud apps", x: 640, y: 330 },
].map((s, i) => {
  const w = s.name.length * 8.4 + 34;
  const left = s.x < C.x;
  const ax = left ? s.x + w / 2 : s.x - w / 2;
  const ang = Math.atan2(s.y - C.y, s.x - C.x);
  const R = 2 * S * SQ3 + S * 0.9;
  const tx = C.x + Math.cos(ang) * R;
  const ty = C.y + Math.sin(ang) * R * 0.92;
  return { ...s, w: Math.round(w), i, path: hexRoute(ax, s.y, tx, ty), tx: r1(tx), ty: r1(ty) };
});

const BASE = [1, 0.62, 0.34];

/** The hero lattice: scattered cells gather into one intelligence layer, and the systems wire in. */
export function HexLattice({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label="Business systems such as ERP, CRM, finance, warehouse, spreadsheets and cloud apps, connected along a hexagon lattice into one intelligence layer.">
      <g aria-hidden="true">
        {FIELD.map((c) => (
          <polygon key={c.key} points={hexPoints(c.x, c.y, S - 2.5)} fill="none" stroke="#fff" strokeOpacity={c.o} />
        ))}
      </g>

      {/* Region outline, drawn once the cells have gathered. */}
      <polygon
        points={hexPoints(C.x, C.y, 2 * S * SQ3 + S * 1.25, true)}
        pathLength={1}
        fill="none"
        stroke="#9aaeff"
        strokeOpacity="0.5"
        className="v22-drawin"
        style={{ "--d": "300ms" } as CSSProperties}
        aria-hidden="true"
      />

      <g className="max-sm:hidden" aria-hidden="true">
        {SYSTEMS.map((s) => (
          <g key={s.name}>
            <path d={s.path} pathLength={1} fill="none" stroke="#fff" strokeOpacity="0.28" className="v22-drawin" style={{ "--d": `${s.i * 110}ms` } as CSSProperties} />
            <path d={s.path} pathLength={1} fill="none" stroke="#2fd4b8" strokeWidth="2" strokeLinecap="round" className="v22-flow" strokeDasharray="0 1" style={{ "--d": `${s.i * 380}ms` } as CSSProperties} />
            <circle cx={s.tx} cy={s.ty} r="2.5" fill="#2fd4b8" />
            <g className="v22-in" style={{ "--d": `${900 + s.i * 90}ms` } as CSSProperties}>
              <polygon points={chRect(s.x - s.w / 2, s.y - 15, s.w, 30, 7)} fill="#171c52" stroke="#fff" strokeOpacity="0.22" />
              <circle cx={r1(s.x - s.w / 2 + 13)} cy={s.y} r="3" fill="#2fd4b8" />
              <text x={r1(s.x - s.w / 2 + 23)} y={s.y + 4.5} fill="#fff" fillOpacity="0.85" fontSize="13" className="v22-mono">
                {s.name}
              </text>
            </g>
          </g>
        ))}
      </g>

      <g aria-hidden="true">
        {CLUSTER.map((c) => (
          <g key={c.key} className="v22-asm" style={{ "--i": c.i, "--dx": `${c.dx}px`, "--dy": `${c.dy}px`, "--rot": `${c.rot}deg` } as CSSProperties}>
            <polygon
              points={hexPoints(c.x, c.y, S - 2.5)}
              fill={c.d === 0 ? "#ffffff" : "#5577ff"}
              fillOpacity={BASE[c.d]}
              stroke={c.d === 0 ? "none" : "#9aaeff"}
              strokeOpacity="0.55"
              className={c.d > 0 ? "v22-pulse" : undefined}
              style={{ "--base": BASE[c.d], "--p": r1((c.i * 1.7) % 7) } as CSSProperties}
            />
          </g>
        ))}
        <polygon points={hexPoints(C.x, C.y, 9)} fill="#101440" className="v22-asm" style={{ "--i": CLUSTER.length } as CSSProperties} />
      </g>

      <g className="v22-in" style={{ "--d": "1500ms" } as CSSProperties} aria-hidden="true">
        <line x1={C.x} y1={C.y + 104} x2={C.x} y2={C.y + 122} stroke="#9aaeff" strokeOpacity="0.6" />
        <text x={C.x} y={C.y + 140} textAnchor="middle" fill="#fff" fillOpacity="0.7" fontSize="12" letterSpacing="1.6" className="v22-mono">
          INTELLIGENCE LAYER
        </text>
      </g>
    </svg>
  );
}
