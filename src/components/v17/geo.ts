/**
 * Small geometry helpers for the hand-drawn look of Version 17.
 * Everything is deterministic and rounded to one decimal so server and client
 * render identical SVG strings.
 */

export type Pt = [number, number];

export const r1 = (v: number) => Math.round(v * 10) / 10;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** A smooth Catmull-Rom curve through the points, as cubic Bezier segments. */
export function smoothPath(pts: Pt[], closed = false, tension = 1): string {
  const n = pts.length;
  if (n < 2) return "";
  const at = (i: number): Pt => {
    if (closed) return pts[((i % n) + n) % n];
    return pts[Math.max(0, Math.min(n - 1, i))];
  };
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension;
    d += ` C${r1(c1x)} ${r1(c1y)} ${r1(c2x)} ${r1(c2y)} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return closed ? `${d} Z` : d;
}

/** An irregular, pebble-like closed shape. */
export function blobPath(cx: number, cy: number, rx: number, ry: number, seed: number, wobble = 0.07, n = 10): string {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + wobble * Math.sin(seed * 1.7 + i * 2.3) + wobble * 0.6 * Math.cos(seed * 0.9 + i * 1.1);
    // Flatten the underside a little, the way a resting stone sits.
    const flat = Math.sin(a) > 0 ? 0.9 : 1;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k * flat]);
  }
  return smoothPath(pts, true);
}

/** A slightly bowed line between two points, like a pen stroke. */
export function handCurve(a: Pt, b: Pt, bend: number): string {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / len) * bend;
  const cy = my + (dx / len) * bend;
  return `M${r1(a[0])} ${r1(a[1])} Q${r1(cx)} ${r1(cy)} ${r1(b[0])} ${r1(b[1])}`;
}
