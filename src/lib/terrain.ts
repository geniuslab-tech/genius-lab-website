import { contours as d3Contours } from "d3-contour";
import type { ContourMultiPolygon } from "d3-contour";

export type Hill = { x: number; y: number; h: number; r: number };

/** Elevation at a normalized point from a set of gaussian hills. */
export function hillsAt(hills: Hill[], x: number, y: number, aspect = 1) {
  let v = 0;
  for (const hill of hills) {
    const dx = (x - hill.x) * aspect;
    const dy = y - hill.y;
    v += hill.h * Math.exp(-(dx * dx + dy * dy) / (2 * hill.r * hill.r));
  }
  return v;
}

export const contourGenerator = () => d3Contours();

export function thresholds(min: number, max: number, count: number) {
  const out: number[] = [];
  for (let i = 1; i <= count; i++) out.push(min + ((max - min) * i) / (count + 1));
  return out;
}

/**
 * Trace a d3 contour multipolygon onto a canvas context.
 * Grid coordinates are scaled by `cell` into CSS pixels.
 */
export function traceContour(
  ctx: CanvasRenderingContext2D,
  contour: ContourMultiPolygon,
  cell: number,
  offset = 0,
) {
  for (const polygon of contour.coordinates) {
    for (const ring of polygon) {
      if (ring.length < 3) continue;
      ctx.moveTo(ring[0][0] * cell - offset, ring[0][1] * cell - offset);
      for (let i = 1; i < ring.length; i++) {
        ctx.lineTo(ring[i][0] * cell - offset, ring[i][1] * cell - offset);
      }
    }
  }
}

/** Contour multipolygon as an SVG path string. */
export function contourPath(contour: ContourMultiPolygon, sx: number, sy = sx) {
  let d = "";
  for (const polygon of contour.coordinates) {
    for (const ring of polygon) {
      if (ring.length < 3) continue;
      d += `M${(ring[0][0] * sx).toFixed(1)},${(ring[0][1] * sy).toFixed(1)}`;
      for (let i = 1; i < ring.length; i++) {
        d += `L${(ring[i][0] * sx).toFixed(1)},${(ring[i][1] * sy).toFixed(1)}`;
      }
      d += "Z";
    }
  }
  return d;
}

/** Deterministic PRNG so server and client agree on authored point sets. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Critically damped-ish spring step, used for every readout and pointer response. */
export function springStep(
  state: { x: number; v: number },
  target: number,
  dt: number,
  stiffness = 120,
  damping = 20,
) {
  const force = (target - state.x) * stiffness - state.v * damping;
  state.v += force * dt;
  state.x += state.v * dt;
  return state.x;
}

export function readCssVar(name: string, el: Element = document.documentElement) {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

/** d3-contour accepts any array-like at runtime; its types only admit number[]. */
export function contourAt(
  gen: ReturnType<typeof d3Contours>,
  values: ArrayLike<number>,
  level: number,
) {
  return gen.contour(values as unknown as number[], level);
}
