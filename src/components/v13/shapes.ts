import { Delaunay } from "d3-delaunay";

/**
 * One set of 24 nodes, re-arranged per chapter. Everything is computed once at module load
 * from seeded values and rounded, so server and client render identical markup.
 */
export const N = 24;
export const C = 300;

export type MNode = { x: number; y: number; r: number; o: number; hot?: boolean };
export type Shape = { nodes: MNode[]; edges: [number, number][] };

const rd = (v: number) => Math.round(v * 10) / 10;
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
const polar = (radius: number, deg: number, cx = C, cy = C) => [cx + Math.cos(rad(deg)) * radius, cy + Math.sin(rad(deg)) * radius] as const;

/* 0. Scatter: unrelated systems, no connections. */
function scatter(): Shape {
  const r = rng(11);
  const nodes = Array.from({ length: N }, () => node(70 + r() * 460, 70 + r() * 460, 3 + r() * 5, 0.35 + r() * 0.55));
  return { nodes, edges: [] };
}

/* 1. Tangle: six silos wired to each other by hand. People as the glue. */
function tangle(): Shape {
  const r = rng(29);
  const nodes: MNode[] = [];
  for (let s = 0; s < 6; s++) {
    const [cx, cy] = polar(175, s * 60 + 18);
    for (let j = 0; j < 4; j++) {
      const [x, y] = polar(18 + r() * 34, r() * 360, cx, cy);
      nodes.push(node(x, y, j === 0 ? 7 : 4 + r() * 2, 0.9, j === 0 && s % 2 === 0));
    }
  }
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  while (edges.length < 32) {
    const a = Math.floor(r() * N);
    const b = Math.floor(r() * N);
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (Math.floor(a / 4) === Math.floor(b / 4) || seen.has(key)) continue;
    seen.add(key);
    edges.push([a, b]);
  }
  return { nodes, edges };
}

/* 2. Stack: four isometric plates, six nodes each, foundation at the bottom. */
export const PLATE_Y = [455, 355, 255, 155];
export const STACK_CX = 262;
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
        nodes.push(node(x, y, gx === 1 ? 7 : 5, 1, L === 3));
      }
    const o = L * 6;
    edges.push([o, o + 1], [o + 1, o + 2], [o + 3, o + 4], [o + 4, o + 5], [o, o + 3], [o + 1, o + 4], [o + 2, o + 5]);
    if (L < 3) edges.push([o + 1, o + 7], [o + 4, o + 10]);
  });
  return { nodes, edges };
}

/* 3. Brain: a dense network of context, triangulated. */
function brain(): Shape {
  const r = rng(53);
  const pts: [number, number][] = Array.from({ length: N }, (_, i) => {
    const rr = Math.sqrt((i + 0.5) / N);
    const th = i * 2.39996323;
    return [rd(C + Math.cos(th) * rr * 215 + (r() - 0.5) * 22), rd(C + Math.sin(th) * rr * 170 + (r() - 0.5) * 22)];
  });
  const nodes = pts.map(([x, y], i) => node(x, y, i % 5 === 0 ? 9 : 4 + (i % 3), 1, i % 5 === 0));
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

/* 4. Orbit: the agent at the centre, the business around it. */
export const ORBITS = [92, 162, 232];
function orbit(): Shape {
  const nodes: MNode[] = [node(C, C, 17, 1, true)];
  const counts = [5, 8, 10];
  const start: number[] = [];
  counts.forEach((c, ring) => {
    start.push(nodes.length);
    for (let j = 0; j < c; j++) {
      const [x, y] = polar(ORBITS[ring], -90 + (j * 360) / c + ring * 17);
      nodes.push(node(x, y, ring === 0 ? 8 : ring === 1 ? 5.5 : 4, ring === 2 ? 0.65 : 1, ring === 0));
    }
  });
  const edges: [number, number][] = [];
  for (let j = 0; j < 5; j++) edges.push([0, start[0] + j]);
  for (let j = 0; j < 8; j++) edges.push([start[0] + Math.floor((j * 5) / 8), start[1] + j]);
  return { nodes, edges };
}

/* 5. Ontology: five axes on one ring, all wired to the shared model at the centre. */
export const AXIS_R = 165;
export const AXIS_LABELS = ["Data", "Analytics", "AI", "People", "Context"];
const axisDeg = (k: number) => -90 + k * 72;
function ontology(): Shape {
  const nodes: MNode[] = [node(C, C, 15, 1, true)];
  for (let k = 0; k < 5; k++) {
    const [x, y] = polar(AXIS_R, axisDeg(k));
    nodes.push(node(x, y, 11, 1, true));
  }
  const perAxis = [4, 4, 4, 3, 3];
  const edges: [number, number][] = [];
  for (let k = 0; k < 5; k++) {
    edges.push([0, 1 + k], [1 + k, 1 + ((k + 1) % 5)]);
    for (let j = 0; j < perAxis[k]; j++) {
      const [x, y] = polar(j % 2 ? 250 : 232, axisDeg(k) + (j - (perAxis[k] - 1) / 2) * 15);
      edges.push([1 + k, nodes.length]);
      nodes.push(node(x, y, 4.5, 0.85));
    }
  }
  return { nodes, edges };
}

/* 6. Hexagon flower: seven cells, the approved Genius Lab motif. */
const HEX_S = 74;
function hexVerts(cx: number, cy: number) {
  return Array.from({ length: 6 }, (_, k) => polar(HEX_S, 30 + k * 60, cx, cy));
}
const HEX_CENTRES = [[C, C] as const, ...Array.from({ length: 6 }, (_, k) => polar(HEX_S * Math.sqrt(3), k * 60))];
export const HEX_CORE = hexVerts(C, C)
  .map(([x, y]) => `${rd(x)},${rd(y)}`)
  .join(" ");
function hex(): Shape {
  const keyOf = (x: number, y: number) => `${Math.round(x)}:${Math.round(y)}`;
  const index = new Map<string, number>();
  const verts: (readonly [number, number])[] = [];
  const cells = HEX_CENTRES.map(([cx, cy]) =>
    hexVerts(cx, cy).map(([x, y]) => {
      const key = keyOf(x, y);
      if (!index.has(key)) {
        index.set(key, verts.length);
        verts.push([x, y]);
      }
      return index.get(key)!;
    }),
  );
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  cells.forEach((cell) =>
    cell.forEach((a, k) => {
      const b = cell[(k + 1) % 6];
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([a, b]);
      }
    }),
  );
  const core = new Set(cells[0]);
  const nodes = verts.map(([x, y], i) => node(x, y, core.has(i) ? 7 : 5, 1, core.has(i)));
  return { nodes, edges };
}

/* 7. Segments: four clusters, one per kind of client. */
export const HUBS = [
  [180, 180],
  [420, 180],
  [180, 420],
  [420, 420],
] as const;
export const HUB_LABELS = ["Investment", "M&A", "Multi-entity", "Operating"];
function segments(): Shape {
  const nodes: MNode[] = [];
  const edges: [number, number][] = [];
  HUBS.forEach(([hx, hy], h) => {
    const o = nodes.length;
    nodes.push(node(hx, hy, 11, 1, true));
    for (let j = 0; j < 5; j++) {
      const [x, y] = polar(62, j * 72 + h * 45, hx, hy);
      nodes.push(node(x, y, 4.5, 0.85));
      edges.push([o, o + 1 + j]);
    }
  });
  edges.push([0, 6], [6, 18], [18, 12], [12, 0]);
  return { nodes, edges };
}

/* 8. Signal: noise on the left settling into a clean line on the right. */
function signal(): Shape {
  const nodes = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const amp = 150 * Math.pow(1 - t, 1.5);
    return node(60 + t * 480, C + Math.sin(i * 1.35) * amp, i === N - 1 ? 10 : 4 + t * 2.5, 0.5 + t * 0.5, i === N - 1);
  });
  const edges = Array.from({ length: N - 1 }, (_, i) => [i, i + 1] as [number, number]);
  return { nodes, edges };
}

/* 9. Order: a calm grid, one source of truth. */
function order(): Shape {
  const nodes: MNode[] = [];
  const at = new Map<string, number>();
  for (let row = 0; row < 5; row++)
    for (let col = 0; col < 5; col++) {
      if (row === 2 && col === 2) continue;
      at.set(`${row}:${col}`, nodes.length);
      nodes.push(node(C + (col - 2) * 58, C + (row - 2) * 58, 5, 1, (row === 2) !== (col === 2) && Math.abs(row - 2) + Math.abs(col - 2) === 1));
    }
  const edges: [number, number][] = [];
  at.forEach((i, key) => {
    const [row, col] = key.split(":").map(Number);
    const right = at.get(`${row}:${col + 1}`);
    const down = at.get(`${row + 1}:${col}`);
    if (right !== undefined) edges.push([i, right]);
    if (down !== undefined) edges.push([i, down]);
  });
  return { nodes, edges };
}

export const SHAPES: Shape[] = [scatter(), tangle(), stack(), brain(), orbit(), ontology(), hex(), segments(), signal(), order()];

export const round = rd;
export const polarPoint = polar;
export const axisAngle = axisDeg;
