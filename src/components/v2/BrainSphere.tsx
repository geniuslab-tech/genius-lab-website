"use client";

import { useEffect, useRef } from "react";
import { mulberry32 } from "@/lib/terrain";

export const HUBS = ["Systems", "Tables", "Metrics", "Dashboards", "Processes", "Customers", "Operations", "Finance"];

type V3 = [number, number, number];
type Node = { p: V3; hub: number; size: number; isHub: boolean };

function build(count: number) {
  const rand = mulberry32(90);
  const nodes: Node[] = [];
  // Hubs spread over the sphere.
  const hubPos: V3[] = HUBS.map((_, i) => {
    const y = 1 - ((i + 0.5) / HUBS.length) * 2;
    const r = Math.sqrt(1 - y * y);
    const a = i * 2.39996;
    return [Math.cos(a) * r * 0.92, y * 0.92, Math.sin(a) * r * 0.92];
  });
  hubPos.forEach((p, i) => nodes.push({ p, hub: i, size: 6.5, isHub: true }));
  // Notes: mostly near the surface, some deeper, each belonging to its nearest hub.
  for (let i = 0; i < count; i++) {
    const y = 1 - ((i + 0.5) / count) * 2;
    const r = Math.sqrt(1 - y * y);
    const a = i * 2.39996 + rand() * 0.3;
    const depth = rand() < 0.78 ? 0.9 + rand() * 0.1 : 0.35 + rand() * 0.5;
    const p: V3 = [Math.cos(a) * r * depth, y * depth, Math.sin(a) * r * depth];
    let hub = 0;
    let bd = Infinity;
    hubPos.forEach((h, k) => {
      const d = (h[0] - p[0]) ** 2 + (h[1] - p[1]) ** 2 + (h[2] - p[2]) ** 2;
      if (d < bd) {
        bd = d;
        hub = k;
      }
    });
    nodes.push({ p, hub, size: 1.6 + rand() ** 3 * 3.6, isHub: false });
  }
  // Links: each note to its hub some of the time, and to its nearest neighbours.
  const edges: [number, number][] = [];
  const dist = (a: V3, b: V3) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
  for (let i = HUBS.length; i < nodes.length; i++) {
    if (rand() < 0.28) edges.push([i, nodes[i].hub]);
    const near: [number, number][] = [];
    for (let j = HUBS.length; j < nodes.length; j++) {
      if (j === i) continue;
      const d = dist(nodes[i].p, nodes[j].p);
      if (d < 0.05) near.push([d, j]);
    }
    near.sort((a, b) => a[0] - b[0]);
    for (const [, j] of near.slice(0, 2)) if (j > i) edges.push([i, j]);
  }
  // Hubs are linked to each other: context is connected.
  for (let a = 0; a < HUBS.length; a++) for (let b = a + 1; b < HUBS.length; b++) if (rand() < 0.35) edges.push([a, b]);
  return { nodes, edges, hubPos };
}

export type SphereState = { visited: number[]; step: number };

/**
 * The Second Brain as a knowledge graph in the shape of a sphere: notes cluster around
 * eight hubs of business context, linked like an Obsidian vault. It rotates in 3D, can
 * be dragged, fires synapses along its links, and turns to face the region an agent reads.
 */
export function BrainSphere({ state, className = "" }: { state: SphereState; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const live = useRef(state);
  useEffect(() => {
    live.current = state;
  }, [state]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rand = mulberry32(3);
    const mono = getComputedStyle(document.body).getPropertyValue("--font-geist-mono") || "monospace";
    const sans = getComputedStyle(document.body).getPropertyValue("--font-archivo") || "sans-serif";
    let w = 0, h = 0, dpr = 1;
    let model = build(520);
    let small = false;

    let yaw = 0.4;
    let pitch = -0.38;
    let yawV = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const pulses: { e: number; t: number; speed: number }[] = [];
    const lit = new Float32Array(HUBS.length);

    const layout = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const nextSmall = w < 480;
      if (nextSmall !== small) model = build(nextSmall ? 340 : 520);
      small = nextSmall;
    };

    const project = (p: V3) => {
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      const x1 = p[0] * cy + p[2] * sy;
      const z1 = -p[0] * sy + p[2] * cy;
      const y2 = p[1] * cp - z1 * sp;
      const z2 = p[1] * sp + z1 * cp;
      const d = 3.4;
      const f = (Math.min(w, h) * 0.42 * d) / (d - z2);
      return { x: w / 2 + x1 * f * 0.9, y: h / 2 + y2 * f * 0.9, z: z2, s: d / (d - z2) };
    };

    let t = 0;
    let last = performance.now();
    let raf = 0;
    let running = false;

    const draw = (dt: number) => {
      const c = ctx;
      const { visited, step } = live.current;
      void step;
      // Constant rotation about its own axis, like a planet; a drag nudges it and it settles back.
      if (!dragging) {
        yawV += ((reduce ? 0 : 0.24) - yawV) * Math.min(1, dt * 1.2);
        yaw += yawV * dt;
      }

      for (let k = 0; k < HUBS.length; k++) {
        const target = visited.includes(k) ? 1 : 0;
        lit[k] += (target - lit[k]) * Math.min(1, dt * 4);
      }

      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, w, h);

      // Soft light behind the sphere.
      const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.min(w, h) * 0.5);
      g.addColorStop(0, "rgba(85,119,255,0.16)");
      g.addColorStop(1, "rgba(85,119,255,0)");
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);

      const P = model.nodes.map((n) => project(n.p));

      // Links, back to front in two passes so the far side recedes.
      c.lineWidth = 0.7;
      for (const pass of [0, 1]) {
        c.beginPath();
        for (const [a, b] of model.edges) {
          const front = (P[a].z + P[b].z) / 2 > 0 ? 1 : 0;
          if (front !== pass) continue;
          c.moveTo(P[a].x, P[a].y);
          c.lineTo(P[b].x, P[b].y);
        }
        c.strokeStyle = pass ? "rgba(16,20,64,0.3)" : "rgba(16,20,64,0.12)";
        c.stroke();
      }
      // Links inside a region the agent has read carry the signal.
      for (let k = 0; k < HUBS.length; k++) {
        if (lit[k] < 0.02) continue;
        c.beginPath();
        for (const [a, b] of model.edges) {
          if (model.nodes[a].hub !== k || model.nodes[b].hub !== k) continue;
          c.moveTo(P[a].x, P[a].y);
          c.lineTo(P[b].x, P[b].y);
        }
        c.strokeStyle = `rgba(47,79,224,${0.55 * lit[k]})`;
        c.lineWidth = 1;
        c.stroke();
      }

      // Synapses: pulses run along the links.
      if (!reduce && pulses.length < (small ? 14 : 26) && rand() < dt * 14) {
        pulses.push({ e: Math.floor(rand() * model.edges.length), t: 0, speed: 0.8 + rand() * 1.4 });
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pl = pulses[i];
        pl.t += dt * pl.speed;
        if (pl.t >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        const [a, b] = model.edges[pl.e];
        const x = P[a].x + (P[b].x - P[a].x) * pl.t;
        const y = P[a].y + (P[b].y - P[a].y) * pl.t;
        const depth = (P[a].z + P[b].z) / 2;
        const alpha = depth > 0 ? 0.95 : 0.35;
        c.strokeStyle = `rgba(85,119,255,${alpha * 0.6})`;
        c.lineWidth = 1.3;
        c.beginPath();
        c.moveTo(P[a].x, P[a].y);
        c.lineTo(x, y);
        c.stroke();
        c.fillStyle = `rgba(85,119,255,${alpha})`;
        c.beginPath();
        c.arc(x, y, 2.4, 0, Math.PI * 2);
        c.fill();
      }

      // Nodes, far to near.
      const order = model.nodes.map((_, i) => i).sort((a, b) => P[a].z - P[b].z);
      for (const i of order) {
        const n = model.nodes[i];
        const pr = P[i];
        const depth = (pr.z + 1) / 2; // 0 back, 1 front
        const on = lit[n.hub];
        const r = n.size * pr.s * (n.isHub ? 1.2 : 1) * (small ? 0.85 : 1);
        if (n.isHub) {
          c.fillStyle = on > 0.5 ? "rgb(47,79,224)" : `rgba(16,20,64,${0.35 + depth * 0.65})`;
          c.beginPath();
          c.arc(pr.x, pr.y, r, 0, Math.PI * 2);
          c.fill();
          c.strokeStyle = on > 0.5 ? "rgba(47,79,224,0.35)" : "rgba(16,20,64,0.15)";
          c.lineWidth = 1;
          c.beginPath();
          c.arc(pr.x, pr.y, r + 5 + (on > 0.5 ? Math.sin(t * 4) * 2 : 0), 0, Math.PI * 2);
          c.stroke();
        } else {
          c.fillStyle =
            on > 0.1
              ? `rgba(47,79,224,${(0.3 + depth * 0.7) * (0.5 + on * 0.5)})`
              : `rgba(16,20,64,${0.25 + depth * 0.7})`;
          c.beginPath();
          c.arc(pr.x, pr.y, r, 0, Math.PI * 2);
          c.fill();
        }
      }

      // Hub labels, readable only on the near side.
      HUBS.forEach((name, k) => {
        const pr = P[k];
        const a = Math.max(0, Math.min(1, (pr.z + 0.25) / 0.6));
        if (a < 0.05) return;
        const on = lit[k] > 0.5;
        c.font = `${on ? 600 : 500} ${small ? 11 : 13}px ${on ? sans : mono}`;
        c.fillStyle = on ? `rgba(47,79,224,${a})` : `rgba(16,20,64,${0.75 * a})`;
        c.strokeStyle = `rgba(241,244,246,${0.9 * a})`;
        c.lineWidth = 4;
        c.lineJoin = "round";
        const flip = pr.x + 14 + c.measureText(name).width > w - 6;
        c.textAlign = flip ? "right" : "left";
        const lx = flip ? pr.x - 14 : pr.x + 14;
        c.strokeText(name, lx, pr.y + 4);
        c.fillText(name, lx, pr.y + 4);
        c.textAlign = "left";
      });
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      draw(dt);
      if (running) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      yaw += dx * 0.008;
      pitch = Math.max(-1.1, Math.min(1.1, pitch + dy * 0.006));
      yawV = dx * 0.5;
    };
    const onUp = () => {
      dragging = false;
    };

    layout();
    draw(0);
    const ro = new ResizeObserver(() => {
      layout();
      draw(0);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(canvas);
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    document.fonts?.ready.then(() => draw(0));
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`block aspect-square w-full cursor-grab touch-pan-y active:cursor-grabbing ${className}`} />;
}
