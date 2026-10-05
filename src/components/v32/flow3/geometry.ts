/* ------------------------------------------------------------------ *
 * v32 · Context — the connected world, extended:
 *   systems → entities → Data Manager → executive OS → Genius orb + brief → agents
 *   → org chart (the approved plan goes to the people who own it) → Second Brain
 * The Second Brain is read by the same intelligence that briefs and acts: it is
 * Brain through four AI orbs docked beside it (Genius and the three agents),
 * and the write-back loop runs underneath back to the systems.
 * Every act is a box the camera frames whole, so nothing is ever cropped.
 * ------------------------------------------------------------------ */

export const WW = 7040;
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

/* 06 the approved plan goes to the org chart */
export const ORG = { x: 5160, y: 170, w: 660, h: 660 };
export type Person = { id: string; i: string; n: string; r: string; x: number; y: number; parent?: string; pick?: number };
/** org chart nodes, in panel coordinates (centres); `pick` is the order the CFO selects them */
export const PEOPLE: Person[] = [
  { id: "ceo", i: "SL", n: "Sarah Lin", r: "Chief Executive Officer", x: 450, y: 118, pick: 0 },
  { id: "coo", i: "MH", n: "Marcus Hale", r: "Chief Operating Officer", x: 314, y: 250, parent: "ceo", pick: 1 },
  { id: "cco", i: "PR", n: "Priya Rao", r: "Chief Commercial Officer", x: 450, y: 250, parent: "ceo", pick: 2 },
  { id: "chro", i: "DO", n: "Daniel Okafor", r: "Chief People Officer", x: 586, y: 250, parent: "ceo", pick: 3 },
  { id: "vp", i: "TB", n: "Tom Becker", r: "VP Supply Chain", x: 314, y: 382, parent: "coo", pick: 4 },
  { id: "ar", i: "ID", n: "Ines Duarte", r: "EMEA Collections Lead", x: 450, y: 382, parent: "cco" },
  { id: "ta", i: "KM", n: "Kai Moreno", r: "Talent Acquisition Lead", x: 586, y: 382, parent: "chro" },
];
export const PERSON = { w: 126, h: 64 };
export const SEND_BTN = { x: 22, y: 360, w: 214, h: 42 };

/* 07 Second Brain */
export const BRAIN = { x: 6300, y: 500, size: 430 };
export const CTX = { x: 6600, w: 420, h: 196 };
export const ctxY = (i: number) => 180 + i * 222;
/** the four AI orbs docked on the brain's left: Genius, then the COO, CCO and CHRO agents */
export const DOCK = { x: 5990, size: 72 };
export const dockY = (k: number) => 290 + k * 140;
/** where each docked orb's link meets the brain */
export const dockIn = (k: number) => ({ x: BRAIN.x - BRAIN.size / 2 + 34 + Math.abs(k - 1.5) * 14, y: BRAIN.y - 105 + k * 70 });

/** where each act sits, for the act labels */
export const ACTS = [
  { n: "01", x: SYS.x, w: SYS.w, label: "Systems of record" },
  { n: "02", x: ENT.x, w: ENT.w, label: "Business units" },
  { n: "03", x: DM.x, w: DM.w, label: "Genius Lab Data Manager" },
  { n: "04", x: DASH.x, w: DASH.w, label: "Executive operating system" },
  { n: "05", x: ORB.x - ORB.size / 2, w: BR.x + BR.w - (ORB.x - ORB.size / 2), label: "Genius brief" },
  { n: "06", x: AG.x, w: AG.w, label: "AI agents" },
  { n: "06", x: ORG.x, w: ORG.w, label: "Approved plan · org chart" },
  { n: "07", x: DOCK.x - 110, w: CTX.x + CTX.w - (DOCK.x - 110), label: "Second Brain" },
];
/** the minimap: one stop per copy step, at the centre of what that step shows */
export const STEP_X = [300, 1060, 1790, 2810, 4045, 5160, 6500];

/**
 * The original six beats play over the first 62% of the scroll (they are the
 * same moments as the Connected section, compressed); the plan then goes to the
 * org chart, the Second Brain lights up, and the camera pulls back on the loop.
 */
export const OLD_END = 0.62;
export const old = (p: number) => (Math.min(p, OLD_END) / OLD_END) * 0.89;
const at = (o: number) => (o / 0.89) * OLD_END;

/** scroll beats where each copy step begins */
export const BEATS = [0, at(0.12), at(0.26), at(0.46), at(0.61), at(0.76), 0.79];

/** camera keyframes: the world box to frame whole at each moment */
type Box = [number, number, number, number];
export const CAMERA: { at: number; box: Box }[] = [
  { at: 0, box: [-40, 110, 660, 890] },
  { at: at(0.09), box: [-40, 110, 660, 890] },
  { at: at(0.17), box: [-30, 60, 1300, 980] },
  { at: at(0.25), box: [-30, 60, 1300, 980] },
  { at: at(0.31), box: [830, 90, 2130, 910] },
  { at: at(0.36), box: [1440, 100, 2140, 900] },
  { at: at(0.43), box: [1440, 100, 2140, 900] },
  { at: at(0.49), box: [1440, 120, 3370, 880] },
  { at: at(0.53), box: [2240, 140, 3380, 860] },
  { at: at(0.6), box: [2240, 140, 3380, 860] },
  { at: at(0.66), box: [2880, 160, 4330, 840] },
  { at: at(0.71), box: [3460, 170, 4330, 830] },
  { at: at(0.75), box: [3460, 170, 4330, 830] },
  { at: at(0.8), box: [3760, 130, 4980, 870] },
  { at: at(0.87), box: [4440, 130, 4980, 870] },
  { at: 0.625, box: [4440, 130, 4980, 870] },
  { at: 0.65, box: [4440, 120, 5860, 880] },
  { at: 0.675, box: [5120, 140, 5860, 860] },
  { at: 0.76, box: [5120, 140, 5860, 860] },
  { at: 0.8, box: [5850, 50, 7040, 930] },
  { at: 0.905, box: [5850, 50, 7040, 930] },
  { at: 0.955, box: [-80, 0, WW + 60, 1000] },
  { at: 1, box: [-80, 0, WW + 60, 1000] },
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
