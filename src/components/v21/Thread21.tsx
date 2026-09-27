"use client";

import { useEffect, useRef, useState } from "react";

type Pt = { x: number; y: number };
const r1 = (v: number) => Math.round(v * 10) / 10;

/** Orthogonal path through the nodes, with soft rounded corners where it steps sideways. */
function buildPath(pts: Pt[]) {
  const R = 18;
  let d = `M${r1(pts[0].x)} ${r1(pts[0].y)}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const dx = b.x - a.x;
    if (Math.abs(dx) < 2) {
      d += ` L${r1(b.x)} ${r1(b.y)}`;
      continue;
    }
    const mid = a.y + (b.y - a.y) * 0.5;
    const r = Math.min(R, Math.abs(dx) / 2, (b.y - a.y) / 4);
    const s = Math.sign(dx);
    d += ` L${r1(a.x)} ${r1(mid - r)} Q${r1(a.x)} ${r1(mid)} ${r1(a.x + s * r)} ${r1(mid)}`;
    d += ` L${r1(b.x - s * r)} ${r1(mid)} Q${r1(b.x)} ${r1(mid)} ${r1(b.x)} ${r1(mid + r)}`;
    d += ` L${r1(b.x)} ${r1(b.y)}`;
  }
  return d;
}

/**
 * One thin line that runs down the gutter and passes through the node beside every
 * section label. It draws itself as the reader scrolls: the tip always sits a little
 * below the middle of the screen, and each node lights as the line reaches it.
 */
export function Thread21() {
  const box = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const tip = useRef<SVGCircleElement>(null);
  const [geo, setGeo] = useState<{ w: number; h: number; d: string } | null>(null);
  const lut = useRef<{ total: number; ys: number[]; step: number; nodes: { el: HTMLElement; y: number }[] }>({ total: 0, ys: [], step: 1, nodes: [] });

  // Measure the nodes and lay the path through them.
  useEffect(() => {
    const el = box.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    let raf = 0;
    const measure = () => {
      const hb = host.getBoundingClientRect();
      const nodes = Array.from(host.querySelectorAll<HTMLElement>("[data-node]"))
        .map((n) => ({ el: n, b: n.getBoundingClientRect() }))
        .filter((n) => n.b.width > 0)
        .map((n) => ({ el: n.el, x: n.b.left + n.b.width / 2 - hb.left, y: n.b.top + n.b.height / 2 - hb.top }))
        .sort((a, b) => a.y - b.y);
      if (nodes.length < 2 || hb.width < 1280) {
        setGeo(null);
        return;
      }
      const pts: Pt[] = [{ x: nodes[0].x, y: Math.max(0, nodes[0].y - 120) }, ...nodes.map((n) => ({ x: n.x, y: n.y }))];
      setGeo({ w: Math.round(hb.width), h: Math.round(host.scrollHeight), d: buildPath(pts) });
      lut.current.nodes = nodes.map((n) => ({ el: n.el, y: n.y }));
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    const ro = new ResizeObserver(schedule);
    ro.observe(host);
    schedule();
    let alive = true;
    document.fonts?.ready.then(() => alive && measure());
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  // Build a length-to-height table, then follow the scroll.
  useEffect(() => {
    const p = line.current;
    const host = box.current?.parentElement;
    if (!geo || !p || !host) return;
    const total = p.getTotalLength();
    const N = 400;
    const ys: number[] = [];
    for (let i = 0; i <= N; i++) ys.push(p.getPointAtLength((total * i) / N).y);
    lut.current.total = total;
    lut.current.ys = ys;
    lut.current.step = total / N;
    p.style.strokeDasharray = `${total} ${total}`;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const { ys: table, step, nodes } = lut.current;
      const top = host.getBoundingClientRect().top;
      const target = reduce ? Infinity : window.innerHeight * 0.62 - top;
      // Binary search the first sample below the target height.
      let lo = 0;
      let hi = table.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (table[mid] < target) lo = mid + 1;
        else hi = mid;
      }
      const len = Math.min(total, lo * step);
      p.style.strokeDashoffset = `${total - len}`;
      const pt = p.getPointAtLength(len);
      if (tip.current) {
        tip.current.setAttribute("cx", String(r1(pt.x)));
        tip.current.setAttribute("cy", String(r1(pt.y)));
        tip.current.style.opacity = len > 4 && len < total - 1 ? "1" : "0";
      }
      for (const n of nodes) {
        if (n.y <= target) n.el.setAttribute("data-lit", "");
        else n.el.removeAttribute("data-lit");
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [geo]);

  return (
    <div ref={box} className="pointer-events-none absolute inset-0 z-[2] hidden overflow-hidden xl:block" aria-hidden="true">
      {geo && (
        <svg width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} className="absolute left-0 top-0" fill="none">
          <path d={geo.d} stroke="var(--rule)" strokeWidth={1} />
          <path ref={line} d={geo.d} stroke="var(--terra)" strokeWidth={1.25} strokeLinecap="round" />
          <circle ref={tip} r={3} fill="var(--terra)" style={{ opacity: 0 }} />
        </svg>
      )}
    </div>
  );
}
