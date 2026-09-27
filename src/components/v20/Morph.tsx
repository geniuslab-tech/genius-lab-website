"use client";

import { AnimatePresence, motion } from "motion/react";
import { C, ORBITS, PLATE_Y, PLATES, RING_R, SCATTER_HUBS, SHAPES, STACK_CX, SYSTEMS, polar, rd, ringDeg } from "./shapes";

const LAYERS = ["01 Data Engineering", "02 Analytics", "03 Business Intelligence", "04 Artificial Intelligence"];
const CONTEXT = [
  { t: "Semantic", x: 118, y: 92 },
  { t: "Business", x: 486, y: 150 },
  { t: "Event", x: 300, y: 548 },
];

/** Scaffolding for each step, drawn under the nodes: labels, plates, rings. */
function Deco({ state, still }: { state: number; still: boolean }) {
  switch (state) {
    case 0:
      return (
        <g>
          {SCATTER_HUBS.map(([x, y], i) => (
            <text key={SYSTEMS[i]} x={x} y={y + 30} textAnchor="middle" className="m-label">
              {SYSTEMS[i]}
            </text>
          ))}
        </g>
      );
    case 1:
      return (
        <g>
          <circle cx={C} cy={C} r={RING_R} className="m-ring" />
          {SYSTEMS.map((s, k) => {
            const [x, y] = polar(RING_R - 38, ringDeg(k));
            return (
              <text key={s} x={x} y={rd(y + 4)} textAnchor="middle" className="m-label">
                {s}
              </text>
            );
          })}
          <text x={C} y={C + 40} textAnchor="middle" className="m-label m-label-strong">
            One layer
          </text>
        </g>
      );
    case 2:
      return (
        <g>
          {PLATES.map((p, i) => (
            <polygon key={i} points={p} className={i === 3 ? "m-plate m-plate-top" : "m-plate"} />
          ))}
          {PLATE_Y.map((base, i) => (
            <text key={i} x={STACK_CX + 150} y={rd(base + 74)} className="m-label">
              {LAYERS[i]}
            </text>
          ))}
        </g>
      );
    case 3:
      return (
        <g>
          <ellipse cx={C} cy={C} rx={268} ry={220} className="m-ring" />
          {CONTEXT.map((c) => (
            <text key={c.t} x={c.x} y={c.y} textAnchor="middle" className="m-label">
              {c.t} context
            </text>
          ))}
        </g>
      );
    case 4:
      return (
        <g>
          {ORBITS.map((r, i) => (
            <g key={r} className={still ? undefined : i % 2 ? "m-spin m-spin-rev" : "m-spin"} style={{ animationDuration: `${48 + i * 22}s` }}>
              <circle cx={C} cy={C} r={r} className="m-ring" />
              <circle cx={rd(C + r)} cy={C} r={3} className="m-sat" />
            </g>
          ))}
          <text x={C} y={C + 46} textAnchor="middle" className="m-label m-label-strong">
            Genius agent
          </text>
        </g>
      );
    default:
      return null;
  }
}

/**
 * The single story visual. The same 24 nodes glide between arrangements on soft springs
 * (transform and opacity only); edges and labels for each arrangement fade in once the
 * nodes have mostly arrived.
 */
export function Morph({ state, still, className = "" }: { state: number; still: boolean; className?: string }) {
  const shape = SHAPES[state];
  return (
    <svg viewBox="0 0 600 600" className={`block h-full w-full overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <AnimatePresence initial={false}>
        <motion.g
          key={state}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: still ? { duration: 0 } : { duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, transition: { duration: still ? 0 : 0.25 } }}
        >
          <Deco state={state} still={still} />
          {shape.edges.map(([a, b]) => {
            const p = shape.nodes[a];
            const q = shape.nodes[b];
            return <line key={`${a}-${b}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} className={a === 0 && state !== 3 ? "m-edge m-edge-core" : "m-edge"} />;
          })}
        </motion.g>
      </AnimatePresence>
      {shape.nodes.map((n, i) => (
        <motion.g
          key={i}
          initial={false}
          animate={{ x: n.x, y: n.y, scale: Math.round(n.r * 100) / 1000, opacity: n.o }}
          transition={still ? { duration: 0 } : { type: "spring", stiffness: 48, damping: 14, mass: 1, delay: (i % 8) * 0.025 }}
        >
          <circle r={10} className="m-node" />
          <motion.circle r={10} className="m-hot" initial={false} animate={{ opacity: n.hot ? 1 : 0 }} transition={{ duration: still ? 0 : 0.6 }} />
        </motion.g>
      ))}
    </svg>
  );
}
