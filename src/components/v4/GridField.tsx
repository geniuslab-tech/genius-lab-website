"use client";

import { useEffect, useRef } from "react";
import { mulberry32, springStep } from "@/lib/terrain";

/**
 * The Version 4 hero ground: a data plane receding to a lit horizon. The plane streams
 * toward the viewer, packets run along its rails, and data columns rise from it and fade.
 * The pointer tilts the vanishing point.
 */
export function GridField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rand = mulberry32(4040);

    let w = 0;
    let h = 0;
    let dpr = 1;
    let horizon = 0;
    let focal = 0;
    const CAM = 1.6;
    const SPACING = 1;
    const RAILS = 22;
    const FAR = 36;

    const tilt = { x: 0, v: 0 };
    const lift = { x: 0, v: 0 };
    const pointer = { x: 0, y: 0 };

    type Packet = { rail: number; z: number; speed: number; cyan: boolean };
    type Column = { rail: number; z: number; h: number; life: number };
    const packets: Packet[] = [];
    const columns: Column[] = [];

    const layout = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      horizon = h * (w < 768 ? 0.62 : 0.6);
      focal = (h - horizon) / (CAM / 0.9);
    };

    const vx = () => w / 2 + tilt.x * w * 0.08;
    const hz = () => horizon + lift.x * 18;
    const X = (x: number, z: number) => vx() + (x * focal) / z;
    const Y = (z: number) => hz() + (CAM * focal) / z;
    const fade = (z: number) => Math.max(0, Math.min(1, 1 - z / FAR)) ** 1.4;

    let t = 0;
    let last = performance.now();
    let raf = 0;
    let running = false;

    const draw = (dt: number) => {
      const c = ctx;
      springStep(tilt, pointer.x, dt, 20, 9);
      springStep(lift, pointer.y, dt, 20, 9);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, w, h);
      const H = hz();
      const V = vx();

      // Horizon light: the intelligence the plane runs toward.
      const glow = c.createRadialGradient(V, H, 0, V, H, Math.max(w, h) * 0.55);
      glow.addColorStop(0, "rgba(85,119,255,0.42)");
      glow.addColorStop(0.35, "rgba(85,119,255,0.1)");
      glow.addColorStop(1, "rgba(85,119,255,0)");
      c.fillStyle = glow;
      c.fillRect(0, 0, w, h);
      c.fillStyle = "rgba(160,180,255,0.9)";
      c.fillRect(0, H - 0.5, w, 1);
      const core = c.createRadialGradient(V, H, 0, V, H, 140);
      core.addColorStop(0, "rgba(220,230,255,0.55)");
      core.addColorStop(1, "rgba(220,230,255,0)");
      c.fillStyle = core;
      c.fillRect(V - 160, H - 160, 320, 320);

      // Rails: lines running to the vanishing point.
      const zNear = 0.9;
      c.lineWidth = 1;
      for (let i = -RAILS; i <= RAILS; i++) {
        const x = i * SPACING;
        const g = c.createLinearGradient(0, Y(zNear), 0, H);
        g.addColorStop(0, `rgba(150,170,255,${i === 0 ? 0.5 : 0.22})`);
        g.addColorStop(1, "rgba(150,170,255,0)");
        c.strokeStyle = g;
        c.beginPath();
        c.moveTo(X(x, zNear), Y(zNear));
        c.lineTo(X(x, FAR), Y(FAR));
        c.stroke();
      }
      // Cross lines stream toward the viewer.
      const offset = (t * 1.4) % SPACING;
      for (let z = SPACING - offset + zNear; z < FAR; z += SPACING) {
        const a = fade(z) * 0.3;
        if (a < 0.01) continue;
        c.strokeStyle = `rgba(150,170,255,${a})`;
        c.beginPath();
        const y = Y(z);
        c.moveTo(0, y);
        c.lineTo(w, y);
        c.stroke();
      }

      if (!reduce) {
        if (packets.length < 18 && rand() < dt * 6) {
          packets.push({ rail: Math.round((rand() * 2 - 1) * RAILS * 0.7), z: FAR, speed: 5 + rand() * 7, cyan: rand() < 0.3 });
        }
        if (columns.length < 9 && rand() < dt * 1.6) {
          const railIdx = Math.round((rand() * 2 - 1) * RAILS * 0.8);
          if (Math.abs(railIdx) > 2) columns.push({ rail: railIdx, z: 6 + rand() * 18, h: 0.6 + rand() * 2.4, life: 0 });
        }
      }

      // Data columns rise, hold, and fade while travelling with the plane.
      for (let i = columns.length - 1; i >= 0; i--) {
        const col = columns[i];
        col.life += dt / 5;
        col.z -= dt * 1.4;
        if (col.life >= 1 || col.z < zNear + 0.3) {
          columns.splice(i, 1);
          continue;
        }
        const grow = Math.min(1, col.life * 5);
        const alpha = Math.min(1, (1 - col.life) * 3) * fade(col.z);
        const x0 = X(col.rail * SPACING, col.z);
        const x1 = X((col.rail + 1) * SPACING, col.z);
        const base = Y(col.z);
        const top = hz() + ((CAM - col.h * grow) * focal) / col.z;
        const g = c.createLinearGradient(0, base, 0, top);
        g.addColorStop(0, `rgba(85,119,255,${0.05 * alpha})`);
        g.addColorStop(1, `rgba(110,231,255,${0.4 * alpha})`);
        c.fillStyle = g;
        c.fillRect(x0 + 1, top, x1 - x0 - 2, base - top);
        c.fillStyle = `rgba(200,245,255,${0.9 * alpha})`;
        c.fillRect(x0 + 1, top, x1 - x0 - 2, 1.5);
      }

      // Packets: bright heads with trails, running in toward the viewer.
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.z -= dt * p.speed;
        if (p.z < zNear + 0.05) {
          packets.splice(i, 1);
          continue;
        }
        const tail = Math.min(FAR, p.z + 3.5);
        const x = p.rail * SPACING;
        const col = p.cyan ? "110,231,255" : "170,190,255";
        const g = c.createLinearGradient(X(x, p.z), Y(p.z), X(x, tail), Y(tail));
        g.addColorStop(0, `rgba(${col},${0.95 * fade(p.z) + 0.05})`);
        g.addColorStop(1, `rgba(${col},0)`);
        c.strokeStyle = g;
        c.lineWidth = 1.6;
        c.beginPath();
        c.moveTo(X(x, p.z), Y(p.z));
        c.lineTo(X(x, tail), Y(tail));
        c.stroke();
        c.fillStyle = `rgba(${col},1)`;
        c.beginPath();
        c.arc(X(x, p.z), Y(p.z), Math.max(0.8, 6 / p.z), 0, Math.PI * 2);
        c.fill();
      }

      // Ground fades into the page at the bottom edge.
      const floor = c.createLinearGradient(0, h * 0.82, 0, h);
      floor.addColorStop(0, "rgba(5,6,14,0)");
      floor.addColorStop(1, "rgba(5,6,14,1)");
      c.fillStyle = floor;
      c.fillRect(0, h * 0.82, w, h * 0.18);
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduce) t += dt;
      draw(dt);
      if (running) raf = requestAnimationFrame(frame);
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

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    layout();
    draw(0);
    const ro = new ResizeObserver(() => {
      layout();
      draw(0);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop()));
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
