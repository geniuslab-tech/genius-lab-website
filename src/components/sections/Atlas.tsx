"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { createNoise2D } from "simplex-noise";
import { clamp, contourAt, contourGenerator, mulberry32, springStep, traceContour } from "@/lib/terrain";
import { RGB, rgba } from "@/lib/palette";

const REGIONS = [
  { name: "Northern", x: 0.24, y: 0.28 },
  { name: "Coastal", x: 0.12, y: 0.7 },
  { name: "Central", x: 0.5, y: 0.5 },
  { name: "Metro", x: 0.76, y: 0.34 },
  { name: "Southern", x: 0.66, y: 0.8 },
];

const METRICS = [
  { id: "revenue", label: "Revenue", unit: "index", values: [0.52, 0.34, 0.66, 0.95, 0.41] },
  { id: "demand", label: "Demand", unit: "forecast", values: [0.78, 0.46, 0.38, 0.6, 0.9] },
  { id: "risk", label: "Churn risk", unit: "probability", values: [0.3, 0.86, 0.48, 0.22, 0.58] },
];

const COLS_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export function Atlas() {
  const [metric, setMetric] = useState(0);
  const [changed, setChanged] = useState<string[]>([]);
  const prevRank = useRef<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const cellRef = useRef<HTMLSpanElement>(null);
  const targetRef = useRef(METRICS[0].values);
  const reduce = useReducedMotion();

  const ranked = useMemo(
    () =>
      REGIONS.map((r, i) => ({ ...r, v: METRICS[metric].values[i] })).sort((a, b) => b.v - a.v),
    [metric],
  );

  useEffect(() => {
    const names = ranked.map((r) => r.name);
    if (prevRank.current.length) {
      setChanged(names.filter((n, i) => prevRank.current[i] !== n));
    }
    prevRank.current = names;
    targetRef.current = METRICS[metric].values;
  }, [ranked, metric]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const noise = createNoise2D(mulberry32(7));
    const gen = contourGenerator();
    const mono = getComputedStyle(document.body).getPropertyValue("--font-geist-mono") || "monospace";
    const heights = REGIONS.map((_, i) => ({ x: targetRef.current[i], v: 0 }));
    const hover = { x: { x: 0, v: 0 }, y: { x: 0, v: 0 }, on: { x: 0, v: 0 }, tx: 0, ty: 0, inside: false };

    let w = 0, h = 0, dpr = 1, cols = 0, rows = 0;
    const cell = 7;
    let values = new Float64Array(0);
    let detail = new Float64Array(0);

    const layout = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cols = Math.ceil(w / cell) + 1;
      rows = Math.ceil(h / cell) + 1;
      values = new Float64Array(cols * rows);
      detail = new Float64Array(cols * rows);
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++)
          detail[j * cols + i] = 0.09 * noise((i * cell) / 180, (j * cell) / 180) + 0.04 * noise((i * cell) / 60, (j * cell) / 60);
    };

    const field = (x: number, y: number) => {
      let v = 0;
      const m = Math.min(w, h);
      REGIONS.forEach((r, k) => {
        const dx = x - r.x * w;
        const dy = y - r.y * h;
        const rad = m * 0.24;
        v += heights[k].x * Math.exp(-(dx * dx + dy * dy) / (2 * rad * rad));
      });
      return v;
    };

    let raf = 0;
    let last = performance.now();
    let settled = 0;

    const draw = (dt: number) => {
      let moving = false;
      heights.forEach((hgt, k) => {
        if (reduce) hgt.x = targetRef.current[k];
        else springStep(hgt, targetRef.current[k], dt, 70, 14);
        if (Math.abs(hgt.x - targetRef.current[k]) > 0.001 || Math.abs(hgt.v) > 0.001) moving = true;
      });
      springStep(hover.x, hover.tx, dt, 260, 30);
      springStep(hover.y, hover.ty, dt, 260, 30);
      springStep(hover.on, hover.inside ? 1 : 0, dt, 200, 26);
      if (Math.abs(hover.on.x - (hover.inside ? 1 : 0)) > 0.002 || Math.abs(hover.x.x - hover.tx) > 0.3) moving = true;

      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) values[j * cols + i] = field(i * cell, j * cell) + detail[j * cols + i];

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      gen.size([cols, rows]);
      ctx.lineJoin = "round";
      for (let k = 0; k < 14; k++) {
        const lv = -0.05 + k * 0.075;
        const index = k % 4 === 0;
        ctx.beginPath();
        traceContour(ctx, contourAt(gen, values, lv), cell);
        ctx.strokeStyle = rgba(RGB.onSurvey, index ? 0.72 : 0.32);
        ctx.lineWidth = index ? 1.2 : 0.8;
        ctx.stroke();
      }
      // Highest ground in solid paper: the read.
      let peak = -Infinity;
      for (let i = 0; i < values.length; i++) if (values[i] > peak) peak = values[i];
      ctx.beginPath();
      traceContour(ctx, contourAt(gen, values, peak - 0.07), cell);
      ctx.fillStyle = rgba(RGB.onSurvey, 0.14);
      ctx.fill();
      ctx.strokeStyle = rgba(RGB.onSurvey, 1);
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = `500 11px ${mono}`;
      REGIONS.forEach((r, k) => {
        const x = r.x * w;
        const y = r.y * h;
        ctx.fillStyle = rgba(RGB.onSurvey, 1);
        ctx.fillRect(x - 3.5, y - 3.5, 7, 7);
        const label = r.name.toUpperCase();
        const flip = x + 10 + ctx.measureText(label).width > w - 8;
        ctx.textAlign = flip ? "right" : "left";
        const lx = flip ? x - 10 : x + 10;
        ctx.strokeStyle = rgba(RGB.survey, 1);
        ctx.lineWidth = 5;
        ctx.strokeText(label, lx, y - 6);
        ctx.fillText(label, lx, y - 6);
        ctx.fillStyle = rgba(RGB.onSurvey2, 1);
        ctx.strokeText(heights[k].x.toFixed(2), lx, y + 8);
        ctx.fillText(heights[k].x.toFixed(2), lx, y + 8);
        ctx.textAlign = "left";
      });

      if (hover.on.x > 0.01) {
        const hx = hover.x.x;
        const hy = hover.y.x;
        ctx.globalAlpha = hover.on.x;
        ctx.strokeStyle = rgba(RGB.onSurvey, 0.6);
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(hx, 0);
        ctx.lineTo(hx, h);
        ctx.moveTo(0, hy);
        ctx.lineTo(w, hy);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = rgba(RGB.onSurvey, 1);
        ctx.strokeRect(hx - 6, hy - 6, 12, 12);
        ctx.globalAlpha = 1;
        const v = field(hx, hy);
        if (readoutRef.current) readoutRef.current.textContent = clamp(v, 0, 9).toFixed(3);
        if (cellRef.current)
          cellRef.current.textContent = `${COLS_LABELS[clamp(Math.floor((hx / w) * 8), 0, 7)]}${clamp(Math.floor((hy / h) * 5), 0, 4) + 1}`;
      }
      return moving;
    };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      const moving = draw(dt);
      settled = moving ? 0 : settled + 1;
      if (settled < 4) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const kick = () => {
      if (raf) return;
      settled = 0;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      hover.tx = e.clientX - r.left;
      hover.ty = e.clientY - r.top;
      if (!hover.inside) {
        hover.x.x = hover.tx;
        hover.y.x = hover.ty;
      }
      hover.inside = true;
      kick();
    };
    const onLeave = () => {
      hover.inside = false;
      kick();
    };

    layout();
    draw(0);
    kick();
    const ro = new ResizeObserver(() => {
      layout();
      draw(0);
    });
    ro.observe(canvas);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    document.fonts?.ready.then(() => draw(0));
    (canvas as HTMLCanvasElement & { kick?: () => void }).kick = kick;

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  useEffect(() => {
    (canvasRef.current as (HTMLCanvasElement & { kick?: () => void }) | null)?.kick?.();
  }, [metric]);

  return (
    <section
      id="atlas"
      className="relative scroll-mt-16 bg-survey py-24 text-on-survey selection:bg-on-survey selection:text-survey sm:py-32 lg:py-40"
      aria-labelledby="atlas-title"
    >
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12">
          <h2 id="atlas-title" data-reveal="up" className="type-display text-[clamp(2.5rem,6vw,5.75rem)] lg:col-span-8">
            Intelligence, mapped.
          </h2>
        </div>
        <p data-reveal="up" data-delay="100" className="mt-6 max-w-[54ch] text-lg leading-relaxed text-on-survey-2">
          Text text text. The Atlas turns a whole business into one surface you can read at a glance. Switch the
          measure and the terrain re-forms. Hover to take a reading.
        </p>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <div className="relative">
              {/* Graticule: column letters and row numbers, like a map sheet edge. */}
              <div className="type-mono mb-2 grid grid-cols-8 text-[0.75rem] text-on-survey-2" aria-hidden="true">
                {COLS_LABELS.map((c) => (
                  <span key={c} className="border-l border-on-survey/30 pl-2">
                    {c}
                  </span>
                ))}
              </div>
              <div className="relative border border-on-survey/40">
                <canvas
                  ref={canvasRef}
                  className="block aspect-[16/11] w-full cursor-crosshair touch-pan-y"
                  role="img"
                  aria-label={`Contour map of illustrative ${METRICS[metric].label.toLowerCase()} across five regions. Highest: ${ranked[0].name}.`}
                />
              </div>
              <div className="type-mono mt-3 flex flex-wrap justify-between gap-2 text-[0.75rem] text-on-survey-2">
                <span>Contour interval 0.075</span>
                <span>Illustrative data</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:col-span-4">
            <div role="tablist" aria-label="Measure" className="grid grid-cols-3 border border-on-survey/40">
              {METRICS.map((m, i) => (
                <button
                  key={m.id}
                  role="tab"
                  aria-selected={metric === i}
                  onClick={() => setMetric(i)}
                  className={`press h-12 text-[0.9375rem] font-medium ${
                    metric === i ? "bg-on-survey text-survey-deep" : "text-on-survey hover:bg-on-survey/10"
                  } ${i ? "border-l border-on-survey/40" : ""}`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="mt-10 flex items-baseline justify-between border-b border-on-survey/40 pb-3">
              <span className="text-[0.9375rem] font-medium">Regions ranked</span>
              <span className="type-mono text-[0.75rem] text-on-survey-2">{METRICS[metric].unit}</span>
            </div>
            <ol>
              {ranked.map((r, i) => {
                const moved = changed.includes(r.name);
                return (
                  <motion.li
                    layout={!reduce}
                    transition={{ type: "spring", duration: 0.6, bounce: 0.12 }}
                    key={r.name}
                    className={`flex items-center justify-between border-b border-on-survey/25 px-2 py-3.5 transition-colors duration-500 ${
                      moved ? "bg-on-survey/12" : ""
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <span className="type-mono w-5 text-[0.8125rem] text-on-survey-2">{i + 1}</span>
                      <span className="text-[1.0625rem]">{r.name}</span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="h-[3px] bg-on-survey transition-[width] duration-700 ease-[var(--ease-out-expo)]" style={{ width: `${r.v * 64}px` }} aria-hidden="true" />
                      <span className="type-mono w-10 text-right text-[0.875rem]">{r.v.toFixed(2)}</span>
                    </span>
                  </motion.li>
                );
              })}
            </ol>

            <div className="mt-auto grid grid-cols-2 gap-px pt-10">
              <div className="border-t border-on-survey/40 pt-3">
                <div className="type-mono text-[0.75rem] text-on-survey-2">Sheet cell</div>
                <span ref={cellRef} className="type-mono mt-1 block text-2xl">
                  D3
                </span>
              </div>
              <div className="border-t border-on-survey/40 pt-3">
                <div className="type-mono text-[0.75rem] text-on-survey-2">Reading</div>
                <span ref={readoutRef} className="type-mono mt-1 block text-2xl">
                  0.000
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
