import { createNoise2D } from "simplex-noise";
import type { ContourMultiPolygon } from "d3-contour";
import { contourAt, contourGenerator, hillsAt, mulberry32, type Hill } from "@/lib/terrain";

/**
 * The hero's contour terrain, computed once from a fixed seed so the server and the
 * client produce identical paths. Drawn as fine, even strokes behind the product.
 */
const GW = 120;
const GH = 44;
export const T_W = 1200;
export const T_H = 440;
const S = T_W / (GW - 1);

const HILLS: Hill[] = [
  { x: 0.16, y: 0.55, h: 0.9, r: 0.14 },
  { x: 0.5, y: 0.2, h: 0.55, r: 0.16 },
  { x: 0.84, y: 0.62, h: 1.0, r: 0.15 },
  { x: 0.66, y: 0.05, h: 0.4, r: 0.1 },
];

function path(contour: ContourMultiPolygon) {
  let d = "";
  for (const polygon of contour.coordinates) {
    for (const ring of polygon) {
      if (ring.length < 5) continue;
      let px = Math.round(ring[0][0] * S);
      let py = Math.round(ring[0][1] * S);
      let seg = `M${px} ${py}`;
      let n = 0;
      for (let i = 1; i < ring.length; i++) {
        const x = Math.round(ring[i][0] * S);
        const y = Math.round(ring[i][1] * S);
        if (Math.hypot(x - px, y - py) < 4 && i < ring.length - 1) continue;
        seg += `L${x} ${y}`;
        px = x;
        py = y;
        n++;
      }
      if (n > 3) d += seg + "Z";
    }
  }
  return d;
}

function build() {
  const noise = createNoise2D(mulberry32(21));
  const values = new Float64Array(GW * GH);
  let min = Infinity;
  let max = -Infinity;
  for (let j = 0; j < GH; j++) {
    for (let i = 0; i < GW; i++) {
      const x = i / (GW - 1);
      const y = j / (GH - 1);
      let v = hillsAt(HILLS, x, y, GW / GH);
      v += 0.14 * noise(x * 3.4, y * 1.6) + 0.05 * noise(x * 8 + 5, y * 4 - 2);
      values[j * GW + i] = v;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  const gen = contourGenerator().size([GW, GH]);
  const LEVELS = 14;
  const out: { d: string; index: boolean }[] = [];
  for (let k = 1; k <= LEVELS; k++) {
    const d = path(contourAt(gen, values, min + ((max - min) * k) / (LEVELS + 1)));
    if (d) out.push({ d, index: k % 4 === 0 });
  }
  return out;
}

export const TERRAIN21 = build();
