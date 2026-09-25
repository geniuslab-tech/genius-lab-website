/** Hexagon geometry shared by every Version 2 diagram. */

export type Pt = { x: number; y: number };

/** Vertices of a hexagon. Pointy-top by default; flat-top rotates by 30 degrees. */
export function hexVertices(cx: number, cy: number, r: number, flat = false, sy = 1): Pt[] {
  const start = flat ? 0 : -90;
  return Array.from({ length: 6 }, (_, i) => {
    const a = ((start + i * 60) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) * sy };
  });
}

export function hexPoints(cx: number, cy: number, r: number, flat = false, sy = 1) {
  return hexVertices(cx, cy, r, flat, sy)
    .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");
}

export function hexPath(cx: number, cy: number, r: number, flat = false, sy = 1) {
  const v = hexVertices(cx, cy, r, flat, sy);
  return `M${v.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join("L")}Z`;
}

/** Axial (q, r) to pixel for a pointy-top honeycomb of cell radius `size`. */
export function axialToPixel(q: number, r: number, size: number): Pt {
  return { x: size * Math.sqrt(3) * (q + r / 2), y: size * 1.5 * r };
}

/** All axial coordinates on ring `n` around the origin, walking clockwise from the east. */
export function hexRing(n: number): [number, number][] {
  if (n === 0) return [[0, 0]];
  const dirs: [number, number][] = [
    [1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1],
  ];
  const out: [number, number][] = [];
  let q = -n;
  let r = n;
  for (let side = 0; side < 6; side++) {
    for (let step = 0; step < n; step++) {
      out.push([q, r]);
      q += dirs[side][0];
      r += dirs[side][1];
    }
  }
  return out;
}

/** Honeycomb cell centres covering a rectangle, pointy-top. */
export function honeycomb(width: number, height: number, size: number): Pt[] {
  const dx = size * Math.sqrt(3);
  const dy = size * 1.5;
  const pts: Pt[] = [];
  for (let row = -1; row * dy < height + dy; row++) {
    for (let col = -1; col * dx < width + dx; col++) {
      pts.push({ x: col * dx + (row % 2 ? dx / 2 : 0), y: row * dy });
    }
  }
  return pts;
}

export const ease = {
  outExpo: (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  inOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};
