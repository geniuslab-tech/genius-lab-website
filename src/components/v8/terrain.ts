import { createNoise2D } from "simplex-noise";
import type { ContourMultiPolygon } from "d3-contour";
import { contourAt, contourGenerator, hillsAt, mulberry32, type Hill } from "@/lib/terrain";

/**
 * The cover engraving: contour terrain computed once at module load from a fixed seed,
 * so the server and the client produce byte-identical paths.
 */
const GW = 110;
const GH = 70;
export const TERRAIN_W = 880;
export const TERRAIN_H = 560;
const S = TERRAIN_W / (GW - 1);

const HILLS: Hill[] = [
  { x: 0.28, y: 0.42, h: 1.0, r: 0.16 },
  { x: 0.62, y: 0.3, h: 0.75, r: 0.12 },
  { x: 0.72, y: 0.7, h: 0.9, r: 0.15 },
  { x: 0.12, y: 0.82, h: 0.45, r: 0.1 },
  { x: 0.92, y: 0.18, h: 0.4, r: 0.09 },
];

/** Compact path: integer coordinates, points closer than MIN_STEP dropped, relative moves. */
const MIN_STEP = 3.2;
function compactPath(contour: ContourMultiPolygon, sx: number) {
  let d = "";
  for (const polygon of contour.coordinates) {
    for (const ring of polygon) {
      if (ring.length < 4) continue;
      let px = Math.round(ring[0][0] * sx);
      let py = Math.round(ring[0][1] * sx);
      let seg = `M${px} ${py}`;
      let n = 0;
      for (let i = 1; i < ring.length; i++) {
        const x = Math.round(ring[i][0] * sx);
        const y = Math.round(ring[i][1] * sx);
        if (Math.hypot(x - px, y - py) < MIN_STEP && i < ring.length - 1) continue;
        const dx = x - px;
        const dy = y - py;
        seg += `l${dx}${dy < 0 ? "" : " "}${dy}`;
        px = x;
        py = y;
        n++;
      }
      if (n > 2) d += seg + "z";
    }
  }
  return d;
}

function build() {
  const noise = createNoise2D(mulberry32(8));
  const values = new Float64Array(GW * GH);
  let min = Infinity;
  let max = -Infinity;
  for (let j = 0; j < GH; j++) {
    for (let i = 0; i < GW; i++) {
      const x = i / (GW - 1);
      const y = j / (GH - 1);
      let v = hillsAt(HILLS, x, y, GW / GH);
      v += 0.16 * noise(x * 3.1, y * 2.2) + 0.07 * noise(x * 7.3 + 11, y * 5.1 - 4) + 0.03 * noise(x * 15 + 3, y * 12);
      values[j * GW + i] = v;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  const gen = contourGenerator().size([GW, GH]);
  const LEVELS = 22;
  const out: { d: string; index: boolean }[] = [];
  for (let k = 1; k <= LEVELS; k++) {
    const level = min + ((max - min) * k) / (LEVELS + 1);
    const d = compactPath(contourAt(gen, values, level), S);
    if (d) out.push({ d, index: k % 5 === 0 });
  }
  return out;
}

export const TERRAIN = build();
