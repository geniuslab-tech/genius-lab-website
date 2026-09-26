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

const NAVY = "16,20,64";
const NAVY3 = "104,110,155";
const ACCENT = "47,79,224";

/** Field inks per ground. The insight card stays white in both, so its text keeps the navy inks. */
const TONES = {
  light: { ink: NAVY, label: "62,68,120", muted: NAVY3, halo: RGB.paper, accent: ACCENT },
  dark: { ink: "255,255,255", label: "200,208,245", muted: "164,168,207", halo: "16,20,64", accent: "143,164,255" },
} as const;

/** Illustrative insights the agent surfaces, one per rise in the terrain. */
const INSIGHTS = [
  { metric: "Gross Margin %", value: "38.4%", note: "+1.2 pts vs last quarter" },
  { metric: "Orders Delivered", value: "12,480", note: "96.1% on time, +2.3 pts" },
  { metric: "Cash Conversion", value: "41 days", note: "3 days faster than Q2" },
  { metric: "Churn Risk", value: "2.1%", note: "3 accounts need a call" },
];

type Point = { bx: number; by: number; phase: number; x: number; y: number; e: number };

const THRESHOLD_COUNT = 13;

/**
 * The Version 2 hero field: Version 1's survey terrain, read by an AI agent. One continuous surface that reads, from the text side outward:
 * raw survey points (data) -> a triangulated network (connection) -> contour lines
 * resolving to a summit (intelligence). The pointer raises a spring-damped hill.
 */
export function InsightField({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const T = TONES[tone];
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

    function rises() {
      const m = Math.min(w, h);
      return [
        { x: summit.x, y: summit.y, r: m * (mobile ? 0.3 : 0.26) },
        { x: summit.x + (mobile ? -0.2 : 0) * m, y: summit.y + m * 0.36, r: m * 0.2 },
        { x: summit.x + m * 0.3, y: summit.y - m * 0.36, r: m * 0.16 },
        { x: summit.x + m * (mobile ? 0.22 : 0.3), y: summit.y + m * (mobile ? 0.3 : 0.08), r: m * 0.13 },
      ];
    }

    // The agent visits each visible rise in turn.
    const agent = { x: { x: 0, v: 0 }, y: { x: 0, v: 0 }, seeded: false, at: 0, since: 0, card: { x: 0, v: 0 } };
    const DWELL = 3.6;

    function elevation(x: number, y: number, t: number) {
      const m = Math.min(w, h);
      // Main summit and two shoulders.
      const dx = x - summit.x;
      const dy = y - summit.y;
      const r1 = m * (mobile ? 0.3 : 0.26);
      let v = 1.0 * Math.exp(-(dx * dx + dy * dy) / (2 * r1 * r1));
      const sx2 = summit.x + (mobile ? -0.2 : 0) * m;
      const sy2 = summit.y + m * 0.36;
      const r2 = m * 0.2;
      v += 0.46 * Math.exp(-((x - sx2) ** 2 + (y - sy2) ** 2) / (2 * r2 * r2));
      const sx3 = summit.x + m * 0.3;
      const sy3 = summit.y - m * 0.36;
      v += 0.34 * Math.exp(-((x - sx3) ** 2 + (y - sy3) ** 2) / (2 * (m * 0.16) ** 2));
      const sx4 = summit.x + m * (mobile ? 0.22 : 0.3);
      const sy4 = summit.y + m * (mobile ? 0.3 : 0.08);
      v += 0.3 * Math.exp(-((x - sx4) ** 2 + (y - sy4) ** 2) / (2 * (m * 0.13) ** 2));
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
        c.strokeStyle = rgba(T.ink, index ? 0.62 : 0.34);
        c.lineWidth = index ? 1.15 : 0.8;
        c.stroke();
      });
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
        c.strokeStyle = rgba(T.ink, 0.1 + bi * 0.09);
        c.lineWidth = 0.75;
        c.stroke();
      });

      // 4. Points, fading as the field resolves into contours.
      const pointIntro = smoothstep(0, 0.35, intro);
      c.fillStyle = rgba(T.ink, 1);
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

      // 5. The AI agent reads the terrain: each rise is a metric, each visit an insight.
      const all = rises();
      const visible = all
        .map((r, k) => ({ ...r, k }))
        .filter((r) => r.x > 40 && r.x < w - 40 && r.y > 90 && r.y < h - 60 && (mobile ? r.y < h * 0.46 : r.x > w * 0.62));
      if (!visible.length) return;
      const ready = smoothstep(0.55, 1, intro);
      agent.since += dt;
      if (agent.since > DWELL) {
        agent.since = 0;
        agent.at = (agent.at + 1) % visible.length;
      }
      const cur = visible[agent.at % visible.length];
      if (!agent.seeded) {
        agent.x.x = cur.x;
        agent.y.x = cur.y;
        agent.seeded = true;
      }
      springStep(agent.x, cur.x, dt, 26, 9);
      springStep(agent.y, cur.y, dt, 26, 9);
      const arrived = Math.hypot(agent.x.x - cur.x, agent.y.x - cur.y) < 14 ? 1 : 0;
      springStep(agent.card, arrived * ready, dt, 90, 16);

      c.globalAlpha = ready;
      // The visited rise is outlined in the accent, clipped to that rise.
      c.save();
      c.beginPath();
      c.arc(cur.x, cur.y, cur.r * 0.9, 0, Math.PI * 2);
      c.clip();
      const lv = values[clamp(Math.round(cur.y / cell) + 1, 0, rows - 1) * cols + clamp(Math.round(cur.x / cell) + 1, 0, cols - 1)] - 0.12;
      c.beginPath();
      traceContour(c, contourAt(gen, values, lv), cell, cell);
      c.strokeStyle = rgba(T.accent, 0.9 * agent.card.x);
      c.lineWidth = 1.8;
      c.stroke();
      c.restore();

      // Every rise carries its metric name.
      c.font = `500 10px ${mono}`;
      visible.forEach((r) => {
        const on = r === cur;
        c.fillStyle = rgba(on ? T.accent : T.ink, on ? 1 : 0.7);
        c.beginPath();
        c.arc(r.x, r.y, on ? 4 : 3, 0, Math.PI * 2);
        c.fill();
        if (!on || agent.card.x < 0.5) {
          c.strokeStyle = rgba(T.halo, 1);
          c.lineWidth = 4;
          c.lineJoin = "round";
          c.strokeText(INSIGHTS[r.k].metric.toUpperCase(), r.x + 9, r.y + 3.5);
          c.fillStyle = rgba(T.label, 0.9);
          c.fillText(INSIGHTS[r.k].metric.toUpperCase(), r.x + 9, r.y + 3.5);
        }
      });

      // The agent: a live point with a breathing ring.
      const ax = agent.x.x;
      const ay = agent.y.x;
      const breathe = 10 + Math.sin(t * 3) * 2.5;
      c.strokeStyle = rgba(T.accent, 0.45);
      c.lineWidth = 1.2;
      c.beginPath();
      c.arc(ax, ay, breathe, 0, Math.PI * 2);
      c.stroke();
      c.fillStyle = rgba(T.accent, 1);
      c.beginPath();
      c.arc(ax, ay, 5.5, 0, Math.PI * 2);
      c.fill();

      // The insight card.
      const k = agent.card.x;
      if (k > 0.02) {
        const ins = INSIGHTS[cur.k];
        const cw = mobile ? 176 : 214;
        const ch = mobile ? 76 : 84;
        let cx = cur.x + 22;
        let cy = cur.y - ch - 18;
        if (cx + cw > w - 12) cx = cur.x - cw - 22;
        if (cy < 84) cy = cur.y + 18;
        cy += (1 - k) * 8;
        c.globalAlpha = ready * k;
        c.fillStyle = "rgba(255,255,255,0.97)";
        c.strokeStyle = rgba(NAVY, 0.16);
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(cx, cy);
        c.lineTo(cx + cw - 10, cy);
        c.lineTo(cx + cw, cy + 10);
        c.lineTo(cx + cw, cy + ch);
        c.lineTo(cx, cy + ch);
        c.closePath();
        c.fill();
        c.stroke();
        c.fillStyle = rgba(ACCENT, 1);
        c.save();
        c.translate(cx + 16, cy + 17);
        c.rotate(Math.PI / 4);
        c.fillRect(-3, -3, 6, 6);
        c.restore();
        c.font = `600 10px ${mono}`;
        c.fillText(mobile ? ins.metric.toUpperCase() : "AI AGENT", cx + 26, cy + 20.5);
        if (!mobile) {
          c.fillStyle = rgba(NAVY3, 1);
          c.textAlign = "right";
          c.fillText(ins.metric.toUpperCase(), cx + cw - 14, cy + 20.5);
          c.textAlign = "left";
        }
        c.fillStyle = rgba(NAVY, 1);
        c.font = `600 ${mobile ? 18 : 22}px ${mono}`;
        c.fillText(ins.value, cx + 14, cy + (mobile ? 47 : 52));
        c.fillStyle = rgba(ACCENT, 1);
        c.font = `500 ${mobile ? 10 : 11}px ${mono}`;
        c.fillText(ins.note, cx + 14, cy + ch - 12);
        // Leader from the rise to the card.
        c.strokeStyle = rgba(T.ink, 0.3);
        c.beginPath();
        c.moveTo(cur.x, cur.y);
        c.lineTo(cx + (cx > cur.x ? 0 : cw), cy + (cy < cur.y ? ch : 0));
        c.stroke();
      }
      c.globalAlpha = ready * 0.8;
      c.fillStyle = rgba(T.muted, 1);
      c.font = `500 10px ${mono}`;
      c.textAlign = "right";
      c.fillText("Illustrative insights", w - 16, h - 16);
      c.textAlign = "left";
      c.globalAlpha = 1;
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
  }, [tone]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
