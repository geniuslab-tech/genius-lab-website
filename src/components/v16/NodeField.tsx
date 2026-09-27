"use client";

import { useEffect, useRef } from "react";
import { mulberry32, useReduced } from "./hooks";

type Hub = { label: string };

type Props = {
  variant: "hero" | "brain";
  hubs: Hub[];
  /** Hub indices lit up right now. */
  active?: number[];
  /** Hub index drawn in the warm counterpoint colour. */
  warmHub?: number;
  className?: string;
};

type P3 = { x: number; y: number; z: number };

const ICE = "143,220,255";
const WARM = "255,178,107";

/** Points spread evenly over a sphere. */
function fibonacciSphere(n: number): P3[] {
  const pts: P3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r });
  }
  return pts;
}

/** Each point wired to its nearest neighbours. */
function nearestEdges(pts: P3[], k: number) {
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  for (let i = 0; i < pts.length; i++) {
    const d: [number, number][] = [];
    for (let j = 0; j < pts.length; j++) {
      if (i === j) continue;
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const dz = pts[i].z - pts[j].z;
      d.push([dx * dx + dy * dy + dz * dz, j]);
    }
    d.sort((a, b) => a[0] - b[0]);
    for (let m = 0; m < k; m++) {
      const j = d[m][1];
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([Math.min(i, j), Math.max(i, j)]);
      }
    }
  }
  return edges;
}

function hexPath(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

/**
 * A slowly rotating sphere of connected data nodes, drawn in 2D canvas with a hand-rolled
 * perspective projection. Hubs are hexagons. It leans toward the cursor and pauses offscreen.
 */
export function NodeField({ variant, hubs, active = [], warmHub, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef<number[]>(active);
  const redrawRef = useRef<(() => void) | null>(null);
  const reduce = useReduced();

  useEffect(() => {
    activeRef.current = active;
    redrawRef.current?.();
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const hero = variant === "hero";
    const N = hero ? 230 : 170;
    const pts = fibonacciSphere(N);
    const edges = nearestEdges(pts, 3);
    const adj: number[][] = pts.map(() => []);
    edges.forEach(([a, b], i) => {
      adj[a].push(i);
      adj[b].push(i);
    });
    const hubIdx = hubs.map((_, i) => Math.round(((i + 0.5) / hubs.length) * (N - 1)));
    const hubSet = new Map(hubIdx.map((p, i) => [p, i]));

    const rand = mulberry32(hero ? 1604 : 2711);
    const dust = Array.from({ length: hero ? 90 : 40 }, () => ({
      x: rand() * 2 - 1,
      y: rand() * 2 - 1,
      d: 0.2 + rand() * 0.8,
    }));
    const pulses = Array.from({ length: hero ? 16 : 9 }, () => ({
      e: Math.floor(rand() * edges.length),
      t: rand(),
      dir: rand() > 0.5 ? 1 : -1,
      v: 0.006 + rand() * 0.01,
    }));

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, w < 700 ? 1.5 : 1.75);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
    };
    resize();
    const mono = getComputedStyle(canvas).getPropertyValue("--font-v16-mono").trim() || "monospace";

    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      ptr.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ptr.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };

    const proj = pts.map(() => ({ x: 0, y: 0, z: 0, s: 1 }));
    let yaw = 0.6;

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const wide = w >= 900;
      const cx = hero ? (wide ? w * 0.7 : w * 0.5) : w * 0.5;
      const cy = hero ? (wide ? h * 0.5 : h * 0.79) : h * 0.5;
      const R = hero ? (wide ? Math.min(w * 0.26, h * 0.4) : Math.min(w * 0.4, h * 0.16)) : Math.min(w, h) * 0.34;
      const pitch = 0.32 + ptr.y * 0.22;
      const yw = yaw + ptr.x * 0.35;
      const ox = ptr.x * (hero ? 18 : 8);
      const oy = ptr.y * (hero ? 12 : 6);
      const cyw = Math.cos(yw);
      const syw = Math.sin(yw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const D = 3.2;

      // Far dust, moving against the cursor for parallax.
      for (const p of dust) {
        const x = w / 2 + p.x * w * 0.55 - ptr.x * 30 * p.d;
        const y = h / 2 + p.y * h * 0.55 - ptr.y * 20 * p.d;
        ctx.fillStyle = `rgba(${ICE},${0.08 + p.d * 0.22})`;
        ctx.fillRect(x, y, p.d * 1.6, p.d * 1.6);
      }

      // Orbit ring around the sphere.
      ctx.save();
      ctx.translate(cx + ox, cy + oy);
      ctx.scale(1, 0.26 + ptr.y * 0.08);
      ctx.beginPath();
      ctx.arc(0, 0, R * 1.42, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${ICE},0.14)`;
      ctx.setLineDash([2, 7]);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      for (let i = 0; i < N; i++) {
        const p = pts[i];
        const x1 = p.x * cyw + p.z * syw;
        const z1 = -p.x * syw + p.z * cyw;
        const y2 = p.y * cp - z1 * sp;
        const z2 = p.y * sp + z1 * cp;
        const s = D / (D - z2);
        const q = proj[i];
        q.x = cx + ox + x1 * R * s;
        q.y = cy + oy + y2 * R * s;
        q.z = z2;
        q.s = s;
      }

      ctx.lineWidth = 1;
      for (const [a, b] of edges) {
        const za = (proj[a].z + proj[b].z) / 2;
        const alpha = 0.03 + ((za + 1) / 2) ** 2 * 0.3;
        ctx.strokeStyle = `rgba(${ICE},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(proj[a].x, proj[a].y);
        ctx.lineTo(proj[b].x, proj[b].y);
        ctx.stroke();
      }

      const act = activeRef.current;
      const litHubs = new Set(act.map((i) => hubIdx[i]));

      // Core glow and spokes to lit hubs.
      if (!hero || act.length) {
        const g = ctx.createRadialGradient(cx + ox, cy + oy, 0, cx + ox, cy + oy, R * 0.55);
        g.addColorStop(0, `rgba(${ICE},0.22)`);
        g.addColorStop(1, `rgba(${ICE},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(cx + ox - R, cy + oy - R, R * 2, R * 2);
        for (const hi of litHubs) {
          const q = proj[hi];
          ctx.strokeStyle = `rgba(${ICE},${0.2 + ((q.z + 1) / 2) * 0.45})`;
          ctx.setLineDash([3, 4]);
          ctx.beginPath();
          ctx.moveTo(cx + ox, cy + oy);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      for (let i = 0; i < N; i++) {
        const q = proj[i];
        const depth = (q.z + 1) / 2;
        if (hubSet.has(i)) continue;
        ctx.fillStyle = `rgba(${ICE},${(0.15 + depth * 0.75).toFixed(3)})`;
        const r = (0.6 + depth * 1.4) * q.s;
        ctx.fillRect(q.x - r / 2, q.y - r / 2, r, r);
      }

      // Pulses travelling the graph.
      for (const pl of pulses) {
        const [a, b] = edges[pl.e];
        const from = pl.dir > 0 ? proj[a] : proj[b];
        const to = pl.dir > 0 ? proj[b] : proj[a];
        const x = from.x + (to.x - from.x) * pl.t;
        const y = from.y + (to.y - from.y) * pl.t;
        const depth = (from.z + to.z + 2) / 4;
        ctx.fillStyle = `rgba(212,243,255,${(0.2 + depth * 0.8).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.2 + depth * 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Hubs as hexagons, with labels when lit or facing us.
      ctx.font = `500 ${hero ? 10 : 10.5}px ${mono}, monospace`;
      ctx.textBaseline = "middle";
      hubIdx.forEach((pi, hi) => {
        const q = proj[pi];
        const depth = (q.z + 1) / 2;
        const lit = litHubs.has(pi);
        const warm = hi === warmHub;
        const col = warm ? WARM : ICE;
        const r = (hero ? 5.5 : 6.5) * q.s;
        if (lit || warm) {
          const g = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, r * 4);
          g.addColorStop(0, `rgba(${col},${0.35 * depth + 0.1})`);
          g.addColorStop(1, `rgba(${col},0)`);
          ctx.fillStyle = g;
          ctx.fillRect(q.x - r * 4, q.y - r * 4, r * 8, r * 8);
        }
        hexPath(ctx, q.x, q.y, r);
        ctx.fillStyle = lit ? `rgba(${col},${0.5 + depth * 0.5})` : `rgba(6,8,24,0.9)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${col},${0.3 + depth * 0.7})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        const showLabel = lit || (!hero && depth > 0.55) || (hero && depth > 0.72 && wide);
        if (showLabel) {
          const la = lit ? 0.95 : (depth - 0.5) * 1.4;
          ctx.fillStyle = warm ? `rgba(${WARM},${la})` : `rgba(214,236,255,${la.toFixed(3)})`;
          ctx.fillText(hubs[hi].label, q.x + r + 7, q.y);
        }
      });
    };
    redrawRef.current = draw;

    let raf = 0;
    let running = false;
    let last = 0;
    const tick = (now: number) => {
      const dt = Math.min(50, now - (last || now));
      last = now;
      yaw += dt * (hero ? 0.00009 : 0.00012);
      ptr.x += (ptr.tx - ptr.x) * 0.05;
      ptr.y += (ptr.ty - ptr.y) * 0.05;
      for (const pl of pulses) {
        pl.t += pl.v * (dt / 16);
        if (pl.t >= 1) {
          const [a, b] = edges[pl.e];
          const end = pl.dir > 0 ? b : a;
          const next = adj[end][Math.floor(rand() * adj[end].length)];
          pl.e = next;
          pl.dir = edges[next][0] === end ? 1 : -1;
          pl.t = 0;
        }
      }
      draw();
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    let visible = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !document.hidden) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden || !visible ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    if (!reduce) window.addEventListener("pointermove", onPointer, { passive: true });
    draw();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointer);
      redrawRef.current = null;
    };
  }, [variant, hubs, warmHub, reduce]);

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} aria-hidden="true" />;
}
