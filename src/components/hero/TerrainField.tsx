"use client";

import { useEffect, useRef } from "react";
import { Delaunay } from "d3-delaunay";
import { createNoise3D } from "simplex-noise";
import {
  clamp,
  contourAt,
  contourGenerator,
  mulberry32,
  smoothstep,
  springStep,
  traceContour,
} from "@/lib/terrain";
import { RGB, rgba } from "@/lib/palette";

type Point = { bx: number; by: number; phase: number; x: number; y: number; e: number };

const THRESHOLD_COUNT = 13;

/**
 * The hero survey field. One continuous surface that reads, from the text side outward:
 * raw survey points (data) -> a triangulated network (connection) -> contour lines
 * resolving to a summit (intelligence). The pointer raises a spring-damped hill.
 */
export function TerrainField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rand = mulberry32(20260925);
    const noise3 = createNoise3D(rand);
    const gen = contourGenerator();
    const mono = getComputedStyle(document.body).getPropertyValue("--font-geist-mono") || "monospace";

    let w = 0;
    let h = 0;
    let dpr = 1;
    let cell = 9;
    let cols = 0;
    let rows = 0;
    let values = new Float64Array(0);
    let points: Point[] = [];
    let mobile = false;
    // Orientation of the data -> intelligence axis.
    let ax = 0.82;
    let by = 0.18;
    let summit = { x: 0, y: 0 };

    const pointer = { x: 0, y: 0, inside: false };
    const px = { x: 0, v: 0 };
    const py = { x: 0, v: 0 };
    const amp = { x: 0, v: 0 };
    const marker = { x: { x: 0, v: 0 }, y: { x: 0, v: 0 }, val: { x: 0, v: 0 } };
    let markerSeeded = false;

    const s = (x: number, y: number) => ax * (x / w) + by * (1 - y / h);
    // Quiet ground where the headline and copy sit, so the network never runs through the type.
    const quiet = (x: number, y: number) =>
      mobile
        ? smoothstep(0.42 * h, 0.52 * h, y)
        : smoothstep(0.5 * h, 0.58 * h, y) * (1 - smoothstep(0.7 * w, 0.8 * w, x));

    function layout() {
      const rect = canvas!.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      mobile = w < 768;
      ax = mobile ? 0.28 : 0.82;
      by = mobile ? 0.72 : 0.18;
      cell = mobile ? 8 : 9;
      cols = Math.ceil(w / cell) + 2;
      rows = Math.ceil(h / cell) + 2;
      values = new Float64Array(cols * rows);
      summit = mobile ? { x: w * 0.64, y: h * 0.2 } : { x: w * 0.77, y: h * 0.42 };

      // Survey points: jittered grid so coverage reads as a sampled field, not random noise.
      const target = clamp(Math.round((w * h) / (mobile ? 3600 : 5600)), 80, 280);
      const aspect = w / h;
      const gy = Math.round(Math.sqrt(target / aspect));
      const gx = Math.round(target / gy);
      points = [];
      for (let j = 0; j < gy; j++) {
        for (let i = 0; i < gx; i++) {
          const bx = ((i + 0.5 + (rand() - 0.5) * 0.9) / gx) * w;
          const byy = ((j + 0.5 + (rand() - 0.5) * 0.9) / gy) * h;
          points.push({ bx, by: byy, phase: rand() * 10, x: bx, y: byy, e: 0 });
        }
      }
    }

    function elevation(x: number, y: number, t: number) {
      const m = Math.min(w, h);
      // Main summit and two shoulders.
      const dx = x - summit.x;
      const dy = y - summit.y;
      const r1 = m * (mobile ? 0.3 : 0.26);
      let v = 1.0 * Math.exp(-(dx * dx + dy * dy) / (2 * r1 * r1));
      const sx2 = summit.x - m * 0.42;
      const sy2 = summit.y + m * 0.34;
      const r2 = m * 0.2;
      v += 0.46 * Math.exp(-((x - sx2) ** 2 + (y - sy2) ** 2) / (2 * r2 * r2));
      const sx3 = summit.x + m * 0.3;
      const sy3 = summit.y - m * 0.36;
      v += 0.34 * Math.exp(-((x - sx3) ** 2 + (y - sy3) ** 2) / (2 * (m * 0.16) ** 2));
      // Drifting terrain detail.
      const f = 1 / (m * 0.42);
      v += 0.22 * noise3(x * f, y * f, t * 0.05);
      v += 0.08 * noise3(x * f * 2.3 + 11, y * f * 2.3, t * 0.08);
      // Pointer hill.
      if (amp.x > 0.002) {
        const pr = mobile ? 80 : 115;
        const pdx = x - px.x;
        const pdy = y - py.x;
        v += amp.x * Math.exp(-(pdx * pdx + pdy * pdy) / (2 * pr * pr));
      }
      return v;
    }

    function gradientFor(s0: number, s1: number) {
      const g = Math.hypot(ax / w, by / h);
      const dxu = ax / w / g;
      const dyu = -by / h / g;
      const cx = w / 2;
      const cy = h / 2;
      const sc = ax / 2 + by / 2;
      const d0 = (s0 - sc) / g;
      const d1 = (s1 - sc) / g;
      return ctx!.createLinearGradient(cx + dxu * d0, cy + dyu * d0, cx + dxu * d1, cy + dyu * d1);
    }

    let t = 0;
    let intro = reduce ? 1 : 0;
    let last = performance.now();
    let raf = 0;
    let running = false;

    function frame(now: number) {
      const dtRaw = (now - last) / 1000;
      if (running && dtRaw < 1 / 50) {
        raf = requestAnimationFrame(frame);
        return;
      }
      last = now;
      const dt = Math.min(dtRaw, 1 / 20);
      if (!reduce) {
        t += dt;
        intro = Math.min(1, intro + dt / 2.4);
      }
      draw(dt);
      if (running) raf = requestAnimationFrame(frame);
    }

    function draw(dt: number) {
      const c = ctx!;
      // Springs: pointer position and hill height carry mass, never jump.
      springStep(px, pointer.x, dt, 90, 16);
      springStep(py, pointer.y, dt, 90, 16);
      springStep(amp, pointer.inside ? 0.62 : 0, dt, 40, 11);

      for (let j = 0; j < rows; j++) {
        const y = (j - 1) * cell;
        for (let i = 0; i < cols; i++) {
          values[j * cols + i] = elevation((i - 1) * cell, y, t);
        }
      }

      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, w, h);

      const introEase = 1 - Math.pow(1 - intro, 4);

      // 1. Contours, masked so they only exist on the intelligence side.
      gen.size([cols, rows]).thresholds([]);
      const levels: number[] = [];
      for (let k = 0; k < THRESHOLD_COUNT; k++) levels.push(-0.25 + k * 0.105);
      c.lineJoin = "round";
      levels.forEach((lv, k) => {
        const contour = contourAt(gen, values, lv);
        const index = k % 4 === 3;
        c.beginPath();
        traceContour(c, contour, cell, cell);
        c.strokeStyle = rgba(RGB.ink, index ? 0.62 : 0.34);
        c.lineWidth = index ? 1.15 : 0.8;
        c.stroke();
      });
      // The index contour of the summit: the read.
      const peakLevel = levels[levels.length - 2];
      const peakContour = contourAt(gen, values, peakLevel);
      c.beginPath();
      traceContour(c, peakContour, cell, cell);
      c.strokeStyle = rgba(RGB.survey, 1);
      c.lineWidth = 1.8;
      c.stroke();

      const m0 = 0.4 + (1 - introEase) * 0.7;
      const grad = gradientFor(m0, m0 + 0.3);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,1)");
      c.globalCompositeOperation = "destination-in";
      c.fillStyle = grad;
      c.fillRect(0, 0, w, h);
      c.globalCompositeOperation = "source-over";

      // 2. Points drift across their sample cell and carry their elevation.
      for (const p of points) {
        p.x = p.bx + noise3(p.bx * 0.004, p.by * 0.004, t * 0.12 + p.phase) * 7;
        p.y = p.by + noise3(p.by * 0.004 + 40, p.bx * 0.004, t * 0.12 + p.phase) * 7;
        const gi = clamp(Math.round(p.x / cell) + 1, 0, cols - 1);
        const gj = clamp(Math.round(p.y / cell) + 1, 0, rows - 1);
        p.e = values[gj * cols + gi];
      }

      // 3. Network: edges strongest in the connection band, and wherever the pointer attends.
      const delaunay = Delaunay.from(points, (p) => p.x, (p) => p.y);
      const { triangles, halfedges } = delaunay;
      const buckets: number[][] = [[], [], [], [], []];
      const maxLen = Math.sqrt((w * h) / points.length) * 1.9;
      const meshIntro = smoothstep(0.15, 0.75, intro);
      const pr = mobile ? 110 : 170;
      for (let e = 0; e < triangles.length; e++) {
        if (e < halfedges[e]) continue;
        const a = points[triangles[e]];
        const b = points[triangles[e % 3 === 2 ? e - 2 : e + 1]];
        const len = Math.hypot(a.x - b.x, a.y - b.y);
        if (len > maxLen) continue;
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const sv = s(mx, my);
        const band =
          Math.exp(-((sv - 0.5) ** 2) / (2 * 0.1 ** 2)) *
          (mobile ? 1 : 1 - smoothstep(0.6 * w, 0.7 * w, mx)) *
          smoothstep(70, 140, my);
        const near = amp.x > 0.01 ? Math.exp(-((mx - px.x) ** 2 + (my - py.x) ** 2) / (2 * pr * pr)) * (amp.x / 0.62) : 0;
        const alpha = clamp(band * meshIntro * (1 - 0.82 * quiet(mx, my)) + near * 0.9) * (1 - len / maxLen) ** 0.5;
        const bi = Math.min(4, Math.floor(alpha * 5));
        if (bi <= 0) continue;
        buckets[bi].push(a.x, a.y, b.x, b.y);
      }
      buckets.forEach((seg, bi) => {
        if (!seg.length) return;
        c.beginPath();
        for (let i = 0; i < seg.length; i += 4) {
          c.moveTo(seg[i], seg[i + 1]);
          c.lineTo(seg[i + 2], seg[i + 3]);
        }
        c.strokeStyle = rgba(RGB.ink, 0.1 + bi * 0.09);
        c.lineWidth = 0.75;
        c.stroke();
      });

      // 4. Points, fading as the field resolves into contours.
      const pointIntro = smoothstep(0, 0.35, intro);
      c.fillStyle = rgba(RGB.ink, 1);
      for (const p of points) {
        const sv = s(p.x, p.y);
        const a = (1 - smoothstep(0.52, 0.78, sv)) * 0.85 * pointIntro;
        if (a < 0.03) continue;
        const r = 1 + clamp(p.e, 0, 1.4) * 1.35;
        c.globalAlpha = a;
        c.beginPath();
        c.rect(p.x - r / 2, p.y - r / 2, r, r);
        c.fill();
      }
      c.globalAlpha = 1;

      // 5. Summit marker: find the highest ground on the intelligence side.
      let best = -Infinity;
      let bi = 0;
      let bj = 0;
      for (let j = 2; j < rows - 2; j += 2) {
        for (let i = 2; i < cols - 2; i += 2) {
          const x = (i - 1) * cell;
          const y = (j - 1) * cell;
          if (s(x, y) < 0.62) continue;
          const v = values[j * cols + i];
          if (v > best) {
            best = v;
            bi = i;
            bj = j;
          }
        }
      }
      const tx = (bi - 1) * cell;
      const ty = (bj - 1) * cell;
      if (!markerSeeded) {
        marker.x.x = tx;
        marker.y.x = ty;
        markerSeeded = true;
      }
      springStep(marker.x, tx, dt, 60, 14);
      springStep(marker.y, ty, dt, 60, 14);
      springStep(marker.val, best * introEase, dt, 50, 13);

      const mk = smoothstep(0.55, 1, intro);
      if (mk > 0) {
        const mx = marker.x.x;
        const my = marker.y.x;
        c.globalAlpha = mk;
        c.strokeStyle = rgba(RGB.survey, 1);
        c.lineWidth = 1.4;
        c.beginPath();
        c.moveTo(mx, my - 7);
        c.lineTo(mx + 6, my + 4);
        c.lineTo(mx - 6, my + 4);
        c.closePath();
        c.stroke();
        // Leader line to the reading.
        const lx = mobile ? mx - 150 : mx + 96;
        const ly = my - (mobile ? 96 : 84);
        c.strokeStyle = rgba(RGB.ink, 0.55);
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(mx + (mobile ? -8 : 8), my - 8);
        c.lineTo(lx + (mobile ? 76 : 0), ly + 12);
        c.lineTo(lx + (mobile ? 0 : 76), ly + 12);
        c.stroke();
        c.fillStyle = rgba(RGB.ink, 0.62);
        c.font = `500 10px ${mono}`;
        const reading = (marker.val.x / 1.2).toFixed(3);
        c.strokeStyle = rgba(RGB.paper, 1);
        c.lineWidth = 5;
        c.lineJoin = "round";
        c.strokeText("PEAK SIGNAL", lx, ly - 4);
        c.fillText("PEAK SIGNAL", lx, ly - 4);
        c.fillStyle = rgba(RGB.survey, 1);
        c.font = `600 13px ${mono}`;
        c.strokeText(reading, lx, ly + 7);
        c.fillText(reading, lx, ly + 7);
        c.globalAlpha = 1;
      }

      // 6. Zone annotations, like a survey sheet's legend written on the ground.
      if (!mobile) {
        const la = smoothstep(0.35, 0.8, intro);
        c.globalAlpha = la;
        c.font = `500 10px ${mono}`;
        c.fillStyle = rgba(RGB.ink2, 1);
        annotate(c, w * 0.07, h * 0.24, "RAW DATA", "sampled points");
        annotate(c, w * 0.4, h * 0.24, "CONNECTION", "triangulated network");
        annotate(c, w * 0.86, h * 0.16, "INTELLIGENCE", "resolved contours");
        c.globalAlpha = 1;
      }
    }

    function annotate(c: CanvasRenderingContext2D, x: number, y: number, a: string, b: string) {
      c.strokeStyle = rgba(RGB.ink, 0.5);
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(x, y - 12);
      c.lineTo(x, y + 18);
      c.stroke();
      c.fillStyle = rgba(RGB.ink, 0.8);
      c.fillText(a, x + 8, y);
      c.fillStyle = rgba(RGB.ink3, 1);
      c.fillText(b, x + 8, y + 14);
    }

    layout();
    pointer.x = summit.x;
    pointer.y = summit.y;
    px.x = summit.x;
    py.x = summit.y;

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointer.inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height && e.pointerType !== "touch";
      if (pointer.inside) {
        pointer.x = x;
        pointer.y = y;
      }
    };
    const onLeave = () => {
      pointer.inside = false;
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const ro = new ResizeObserver(() => {
      layout();
      draw(0);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !document.hidden) start();
      else stop();
    });
    io.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    draw(0);
    // Fonts arrive after first paint; redraw so canvas labels use the real face.
    document.fonts?.ready.then(() => draw(0));

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
