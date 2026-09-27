"use client";

import { useId, useSyncExternalStore } from "react";
import { createNoise2D } from "simplex-noise";
import { contourGenerator, contourPath, hillsAt, mulberry32, thresholds, contourAt } from "@/lib/terrain";

/** True only after hydration, so engine-sensitive geometry never has to match the server. */
export function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const f1 = (v: number) => v.toFixed(1);

/** A closed polar curve r(theta) as an SVG path. */
function polar(cx: number, cy: number, samples: number, r: (t: number) => number) {
  let dStr = "";
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * Math.PI * 2;
    const rr = r(t);
    dStr += `${i ? "L" : "M"}${f1(cx + Math.cos(t) * rr)},${f1(cy + Math.sin(t) * rr)}`;
  }
  return dStr + "Z";
}

type Band = { base: number; amp: number; lobes: number; copies: number; samples: number; mod?: number };

function band(c: number, b: Band) {
  const out: string[] = [];
  for (let k = 0; k < b.copies; k++) {
    const phase = (k / b.copies) * Math.PI * 2;
    out.push(
      polar(c, c, b.samples, (t) => b.base + b.amp * Math.sin(b.lobes * t + phase) * (b.mod ? 1 + b.mod * Math.sin(3 * t) : 1)),
    );
  }
  return out.join("");
}

/** Engine-turned rings, computed once per mount. */
function guillocheRings(c: number) {
  return {
    outer: band(c, { base: 214, amp: 9, lobes: 36, copies: 12, samples: 432 }),
    rosette: band(c, { base: 112, amp: 30, lobes: 18, copies: 14, samples: 360, mod: 0.12 }),
    inner: band(c, { base: 52, amp: 12, lobes: 12, copies: 10, samples: 240 }),
  };
}

let ringsCache: ReturnType<typeof guillocheRings> | null = null;

/**
 * The engraved dial. Two HTML layers rotate in opposite directions, each composited on
 * its own, so the hundreds of hairlines never repaint.
 */
export function GuillocheLayers({ opacity = 1, className = "" }: { opacity?: number; className?: string }) {
  const mounted = useMounted();
  if (!mounted) return null;
  ringsCache ??= guillocheRings(260);
  const rings = ringsCache;
  const stroke = "#d8c29d";
  return (
    <div className={`absolute inset-0 ${className}`} style={{ opacity }} aria-hidden="true">
      <div className="lx-layer lx-spin absolute inset-0">
        <svg viewBox="0 0 520 520" className="h-full w-full">
          <path d={rings.outer} fill="none" stroke={stroke} strokeOpacity="0.32" strokeWidth="0.5" />
          <path d={rings.inner} fill="none" stroke={stroke} strokeOpacity="0.3" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="lx-layer lx-spin-rev absolute inset-0">
        <svg viewBox="0 0 520 520" className="h-full w-full">
          <path d={rings.rosette} fill="none" stroke={stroke} strokeOpacity="0.26" strokeWidth="0.5" />
        </svg>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- terrain */

const TW = 112;
const TH = 64;

function terrainPaths() {
  const rand = mulberry32(1507);
  const noise = createNoise2D(rand);
  const hills = [
    { x: 0.22, y: 0.62, h: 1.0, r: 0.16 },
    { x: 0.5, y: 0.38, h: 0.7, r: 0.2 },
    { x: 0.8, y: 0.66, h: 0.9, r: 0.14 },
    { x: 0.66, y: 0.2, h: 0.45, r: 0.12 },
    { x: 0.1, y: 0.18, h: 0.4, r: 0.1 },
  ];
  const values = new Float64Array(TW * TH);
  let min = Infinity;
  let max = -Infinity;
  for (let j = 0; j < TH; j++) {
    for (let i = 0; i < TW; i++) {
      const x = i / (TW - 1);
      const y = j / (TH - 1);
      const v =
        hillsAt(hills, x, y, TW / TH) + 0.16 * noise(x * 3.2, y * 3.2) + 0.06 * noise(x * 8, y * 8);
      values[j * TW + i] = v;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  const gen = contourGenerator().size([TW, TH]);
  const levels = thresholds(min, max, 16);
  const sx = 1200 / (TW - 1);
  const sy = 680 / (TH - 1);
  return levels.map((lv, i) => ({ d: contourPath(contourAt(gen, values, lv), sx, sy), index: i % 4 === 3 }));
}

let terrainCache: ReturnType<typeof terrainPaths> | null = null;

/**
 * An engraved contour plate, the hero terrain from Version 1 rendered as fine gold
 * hairlines. A slow reading band crosses it, as if the agent were studying the ground.
 */
export function TerrainPlate() {
  const mounted = useMounted();
  const id = useId().replace(/:/g, "");
  if (!mounted) return <div className="lx-plate absolute inset-0" aria-hidden="true" />;
  terrainCache ??= terrainPaths();
  const paths = terrainCache;
  return (
    <div className="lx-plate absolute inset-0" data-ready="" aria-hidden="true">
      <svg viewBox="0 0 1200 680" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <defs>
          <g id={`${id}-t`}>
            {paths.map((p, i) => (
              <path key={i} d={p.d} fill="none" strokeWidth={p.index ? 0.9 : 0.5} vectorEffect="non-scaling-stroke" />
            ))}
          </g>
          <linearGradient id={`${id}-band`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="680">
            <rect className="lx-scan" x="0" y="0" width="360" height="680" fill={`url(#${id}-band)`} />
          </mask>
        </defs>
        <use href={`#${id}-t`} stroke="#d8c29d" strokeOpacity="0.16" />
        <use href={`#${id}-t`} stroke="#d8c29d" strokeOpacity="0.62" mask={`url(#${id}-m)`} />
      </svg>
    </div>
  );
}
