/* ------------------------------------------------------------------ *
 * v32 · Connected — one horizontal world, left to right:
 *   systems → entities → Data Manager → executive OS → Genius orb + brief → agents
 * and a write-back loop that runs underneath, from the agents back to the systems.
 * Every act is a box the camera frames whole, so nothing is ever cropped.
 * ------------------------------------------------------------------ */

export const WW = 5000;
export const WH = 1000;

export const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const sm = (t: number) => {
  const x = cl(t);
  return x * x * (3 - 2 * x);
};
/** eased 0→1 as p moves from a to b */
export const ph = (p: number, a: number, b: number) => sm((p - a) / (b - a));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const r2 = (n: number) => Math.round(n * 100) / 100;

/* 01 systems of record */
export const SYS = { x: 0, w: 600, rowH: 88, tile: 52 };
export const rowY = (i: number) => 190 + i * 106;
export const tileX = (k: number) => 118 + k * 92;
export const tileC = (i: number, k: number) => ({ x: tileX(k) + SYS.tile / 2, y: rowY(i) + SYS.rowH / 2 });

/* 02 entities */
export const ENT = { x: 860, w: 400, h: 190, slot: 44 };
export const entY = (i: number) => 102 + i * 204;
export const slotC = (i: number, k: number) => ({ x: ENT.x + 24 + k * 58 + ENT.slot / 2, y: entY(i) + 62 + ENT.slot / 2 });

/* 03 Data Manager */
export const DM = { x: 1480, y: 120, w: 620, h: 760 };
export const BAND_H = 150;
export const bandTop = (i: number) => DM.y + 86 + i * 164;

/* 04 executive operating system */
export const DASH = { x: 2280, y: 200, w: 1060, h: 600 };

/* 05 Genius orb + brief */
export const ORB = { x: 3590, y: 500, size: 190 };
export const BR = { x: 3800, y: 200, w: 500, h: 600 };

/* 06 agents */
export const AG = { x: 4500, w: 440, h: 172 };
export const agY = (i: number) => 236 + i * 190;

/** where each act sits, for the act labels and the minimap */
export const ACTS = [
  { x: SYS.x, w: SYS.w, label: "Systems of record" },
  { x: ENT.x, w: ENT.w, label: "Business units" },
  { x: DM.x, w: DM.w, label: "Genius Lab Data Manager" },
  { x: DASH.x, w: DASH.w, label: "Executive operating system" },
  { x: ORB.x - ORB.size / 2, w: BR.x + BR.w - (ORB.x - ORB.size / 2), label: "Genius brief" },
  { x: AG.x, w: AG.w, label: "AI agents" },
];

/** scroll beats where each copy step begins */
export const BEATS = [0, 0.12, 0.26, 0.46, 0.61, 0.76];

/** camera keyframes: the world box to frame whole at each moment */
type Box = [number, number, number, number];
export const CAMERA: { at: number; box: Box }[] = [
  { at: 0, box: [-40, 110, 660, 890] },
  { at: 0.09, box: [-40, 110, 660, 890] },
  { at: 0.17, box: [-30, 60, 1300, 980] },
  { at: 0.25, box: [-30, 60, 1300, 980] },
  { at: 0.31, box: [830, 90, 2130, 910] },
  { at: 0.36, box: [1440, 100, 2140, 900] },
  { at: 0.43, box: [1440, 100, 2140, 900] },
  { at: 0.49, box: [1440, 120, 3370, 880] },
  { at: 0.53, box: [2240, 140, 3380, 860] },
  { at: 0.6, box: [2240, 140, 3380, 860] },
  { at: 0.66, box: [2880, 160, 4330, 840] },
  { at: 0.71, box: [3460, 170, 4330, 830] },
  { at: 0.75, box: [3460, 170, 4330, 830] },
  { at: 0.8, box: [3760, 130, 4980, 870] },
  { at: 0.87, box: [4440, 130, 4980, 870] },
  { at: 0.9, box: [4440, 130, 4980, 870] },
  { at: 0.96, box: [-80, 0, 5060, 1000] },
  { at: 1, box: [-80, 0, 5060, 1000] },
];

export function cameraBox(p: number): Box {
  for (let i = 0; i < CAMERA.length - 1; i++) {
    const a = CAMERA[i]!;
    const b = CAMERA[i + 1]!;
    if (p <= b.at) {
      const t = sm((p - a.at) / (b.at - a.at || 1));
      return [mix(a.box[0], b.box[0], t), mix(a.box[1], b.box[1], t), mix(a.box[2], b.box[2], t), mix(a.box[3], b.box[3], t)];
    }
  }
  return CAMERA[CAMERA.length - 1]!.box;
}

/** S-curve between two points, leaving and entering horizontally */
export const hcurve = (x1: number, y1: number, x2: number, y2: number) => {
  const mx = (x1 + x2) / 2;
  return `M ${r2(x1)} ${r2(y1)} C ${r2(mx)} ${r2(y1)}, ${r2(mx)} ${r2(y2)}, ${r2(x2)} ${r2(y2)}`;
};
