import { Delaunay } from "d3-delaunay";

/**
 * Version 20 story visual: one set of 24 nodes, re-arranged for each step of the story.
 * Everything is computed once at module load from seeded values and rounded to 0.1, so
 * server and client produce identical markup.
 */
export const N = 24;
export const C = 300;

export type MNode = { x: number; y: number; r: number; o: number; hot?: boolean };
export type Shape = { nodes: MNode[]; edges: [number, number][] };

export const rd = (v: number) => Math.round(v * 10) / 10;
const rad = (deg: number) => (deg * Math.PI) / 180;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const node = (x: number, y: number, r: number, o = 1, hot = false): MNode => ({ x: rd(x), y: rd(y), r: rd(r), o: rd(o), hot });
export const polar = (radius: number, deg: number, cx = C, cy = C) =>
  [rd(cx + Math.cos(rad(deg)) * radius), rd(cy + Math.sin(rad(deg)) * radius)] as const;

/** The six systems a growing company typically runs. Nodes 1 to 6 carry them. */
export const SYSTEMS = ["ERP", "CRM", "Finance", "Warehouse", "Sheets", "Cloud apps"];

/* Where each system sits while it is still on its own: spread out, no relation to the others. */
export const SCATTER_HUBS: (readonly [number, number])[] = [
  [138, 132],
  [452, 104],
  [506, 338],
  [300, 470],
  [92, 380],
  [262, 262],
];

/* 0. Scattered: six systems and their data, each on its own island, nothing connected. */
function scatter(): Shape {
  const r = rng(7);
  const nodes: MNode[] = [node(344, 196, 3, 0.35)];
  SCATTER_HUBS.forEach(([x, y]) => nodes.push(node(x, y, 8, 0.9)));
  while (nodes.length < N) {
    const hub = SCATTER_HUBS[(nodes.length - 7) % 6];
    const [x, y] = polar(34 + r() * 46, r() * 360, hub[0], hub[1]);
    nodes.push(node(x, y, 2.5 + r() * 2.5, 0.3 + r() * 0.35));
  }
  return { nodes, edges: [] };
}

/* 1. Connected: the same systems, kept, and wired into one layer at the centre. */
export const RING_R = 168;
export const ringDeg = (k: number) => -90 + k * 60;
function connected(): Shape {
  const nodes: MNode[] = [node(C, C, 15, 1, true)];
  const edges: [number, number][] = [];
  for (let k = 0; k < 6; k++) {
    const [x, y] = polar(RING_R, ringDeg(k));
    nodes.push(node(x, y, 9, 1));
    edges.push([0, 1 + k]);
  }
  // Seventeen satellites: three per system, two systems get two.
  let k = 0;
  while (nodes.length < N) {
    const hub = k % 6;
    const slot = Math.floor(k / 6);
    const [x, y] = polar(RING_R + 58, ringDeg(hub) + (slot - 1) * 13);
    edges.push([1 + hub, nodes.length]);
    nodes.push(node(x, y, 3.5, 0.7));
    k++;
  }
  return { nodes, edges };
}

/* 2. Stack: four isometric plates, six nodes each, foundation at the bottom. */
export const PLATE_Y = [462, 360, 258, 156];
export const STACK_CX = 256;
const iso = (u: number, v: number, base: number) => [STACK_CX + (u - v) * 0.9, base + (u + v) * 0.42] as const;
export const PLATES = PLATE_Y.map((base) =>
  [iso(-125, -75, base), iso(125, -75, base), iso(125, 75, base), iso(-125, 75, base)].map(([x, y]) => `${rd(x)},${rd(y)}`).join(" "),
);
function stack(): Shape {
  const nodes: MNode[] = [];
  const edges: [number, number][] = [];
  PLATE_Y.forEach((base, L) => {
    for (let gy = 0; gy < 2; gy++)
      for (let gx = 0; gx < 3; gx++) {
        const [x, y] = iso((gx - 1) * 80, (gy - 0.5) * 80, base);
        nodes.push(node(x, y, gx === 1 ? 7 : 5, 1, L === 3 && gx === 1));
      }
  });
  // Rotate the indices so the core node (0) lands on the top plate.
  const order = [19, ...Array.from({ length: N }, (_, i) => i).filter((i) => i !== 19)];
  const at = new Map(order.map((src, dst) => [src, dst]));
  const out = order.map((src) => nodes[src]);
  PLATE_Y.forEach((_, L) => {
    const o = L * 6;
    const pairs: [number, number][] = [
      [o, o + 1],
      [o + 1, o + 2],
      [o + 3, o + 4],
      [o + 4, o + 5],
      [o, o + 3],
      [o + 1, o + 4],
      [o + 2, o + 5],
    ];
    if (L < 3) pairs.push([o + 1, o + 7], [o + 4, o + 10]);
    pairs.forEach(([a, b]) => edges.push([at.get(a)!, at.get(b)!]));
  });
  return { nodes: out, edges };
}

/* 3. Brain: a dense, triangulated network of context. */
function brain(): Shape {
  const r = rng(53);
  const pts: [number, number][] = Array.from({ length: N }, (_, i) => {
    const rr = Math.sqrt((i + 0.5) / N);
    const th = i * 2.39996323;
    return [rd(C + Math.cos(th) * rr * 222 + (r() - 0.5) * 20), rd(C + Math.sin(th) * rr * 176 + (r() - 0.5) * 20)];
  });
  const nodes = pts.map(([x, y], i) => node(x, y, i === 0 ? 12 : i % 5 === 0 ? 8 : 4 + (i % 3), 1, i === 0 || i % 5 === 0));
  const d = Delaunay.from(pts);
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  for (let t = 0; t < d.triangles.length; t += 3) {
    const tri = [d.triangles[t], d.triangles[t + 1], d.triangles[t + 2]];
    for (let k = 0; k < 3; k++) {
      const a = Math.min(tri[k], tri[(k + 1) % 3]);
      const b = Math.max(tri[k], tri[(k + 1) % 3]);
      const key = `${a}-${b}`;
      if (seen.has(key)) continue;
      seen.add(key);
      if (Math.hypot(pts[a][0] - pts[b][0], pts[a][1] - pts[b][1]) < 140) edges.push([a, b]);
    }
  }
  return { nodes, edges };
}

/* 4. Agents: the agent at the centre, the business in orbit around it. */
export const ORBITS = [96, 166, 236];
function agents(): Shape {
  const nodes: MNode[] = [node(C, C, 18, 1, true)];
  const counts = [5, 8, 10];
  const start: number[] = [];
  counts.forEach((c, ring) => {
    start.push(nodes.length);
    for (let j = 0; j < c; j++) {
      const [x, y] = polar(ORBITS[ring], -90 + (j * 360) / c + ring * 17);
      nodes.push(node(x, y, ring === 0 ? 8 : ring === 1 ? 5.5 : 4, ring === 2 ? 0.6 : 1, ring === 0));
    }
  });
  const edges: [number, number][] = [];
  for (let j = 0; j < 5; j++) edges.push([0, start[0] + j]);
  for (let j = 0; j < 8; j++) edges.push([start[0] + Math.floor((j * 5) / 8), start[1] + j]);
  return { nodes, edges };
}

export const SHAPES: Shape[] = [scatter(), connected(), stack(), brain(), agents()];
