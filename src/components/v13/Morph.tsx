"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  AXIS_LABELS,
  AXIS_R,
  C,
  HEX_CORE,
  HUB_LABELS,
  HUBS,
  ORBITS,
  PLATE_Y,
  PLATES,
  SHAPES,
  STACK_CX,
  axisAngle,
  polarPoint,
  round,
} from "./shapes";

const LAYER_LABELS = ["01 Data", "02 Analytics", "03 BI", "04 AI"];

/** Chapter-specific scaffolding drawn under the nodes: plates, orbits, rings, labels. */
function Deco({ state, still }: { state: number; still: boolean }) {
  switch (state) {
    case 2:
      return (
        <g>
          {PLATES.map((p, i) => (
            <polygon key={i} points={p} className="m-plate" />
          ))}
          {PLATE_Y.map((base, i) => (
            <text key={i} x={STACK_CX + 196} y={round(base + 8)} className="m-label">
              {LAYER_LABELS[i]}
            </text>
          ))}
        </g>
      );
    case 3:
      return (
        <g>
          <ellipse cx={C} cy={C} rx={262} ry={214} className="m-ring" />
          <path d="M300 96 C 262 190, 338 300, 300 504" className="m-ring" />
        </g>
      );
    case 4:
      return (
        <g>
          {ORBITS.map((r, i) => (
            <g key={r} className={still ? undefined : i % 2 ? "m-spin-rev" : "m-spin"} style={{ animationDuration: `${40 + i * 18}s` }}>
              <circle cx={C} cy={C} r={r} className="m-ring" />
              <circle cx={round(C + r)} cy={C} r={3} className="m-sat" />
            </g>
          ))}
          <text x={C} y={C + 44} textAnchor="middle" className="m-label">
            Agent
          </text>
        </g>
      );
    case 5:
      return (
        <g>
          <circle cx={C} cy={C} r={AXIS_R} className="m-ring" />
          {AXIS_LABELS.map((l, k) => {
            const [x, y] = polarPoint(AXIS_R - 44, axisAngle(k));
            return (
              <text key={l} x={round(x)} y={round(y + 5)} textAnchor="middle" className="m-label">
                {l}
              </text>
            );
          })}
        </g>
      );
    case 6:
      return <polygon points={HEX_CORE} className="m-core" />;
    case 7:
      return (
        <g>
          <path d="M300 70 V530 M70 300 H530" className="m-ring" />
          {HUBS.map(([x, y], i) => (
            <text key={i} x={x} y={y < C ? y - 82 : y + 94} textAnchor="middle" className="m-label">
              {HUB_LABELS[i]}
            </text>
          ))}
        </g>
      );
    case 8:
      return (
        <g>
          <path d="M40 300 H560" className="m-ring" />
          {["Systems", "Second Brain", "Agents"].map((l, i) => (
            <g key={l}>
              <path d={`M${60 + i * 200} 486 V500`} className="m-tick" />
              <text x={60 + i * 200} y={526} className="m-label">
                {l}
              </text>
            </g>
          ))}
        </g>
      );
    case 9:
      return (
        <g>
          <polygon points="128,128 448,128 472,152 472,472 128,472" className="m-frame" />
          <rect x={288} y={288} width={24} height={24} className="m-core" />
        </g>
      );
    default:
      return null;
  }
}

/**
 * The morphing visual. The same 24 nodes glide between chapter arrangements (transform only);
 * edges and scaffolding for each arrangement fade in once the nodes have mostly arrived.
 */
export function Morph({ state, still, className = "" }: { state: number; still: boolean; className?: string }) {
  const shape = SHAPES[state];
  return (
    <svg viewBox="0 0 600 600" className={`block h-full w-full overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <AnimatePresence initial={false}>
        <motion.g
          key={state}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: still ? { duration: 0 } : { duration: 0.7, delay: 0.45, ease: "easeOut" } }}
          exit={{ opacity: 0, transition: { duration: still ? 0 : 0.18 } }}
        >
          <Deco state={state} still={still} />
          {shape.edges.map(([a, b]) => {
            const p = shape.nodes[a];
            const q = shape.nodes[b];
            return <line key={`${a}-${b}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} className={state === 1 ? "m-edge m-edge-tangle" : "m-edge"} />;
          })}
        </motion.g>
      </AnimatePresence>
      {shape.nodes.map((n, i) => (
        <motion.g
          key={i}
          initial={false}
          animate={{ x: n.x, y: n.y, scale: Math.round(n.r * 100) / 1000, opacity: n.o }}
          transition={still ? { duration: 0 } : { type: "spring", stiffness: 62, damping: 15, mass: 1, delay: (i % 12) * 0.018 }}
        >
          <circle r={10} className="m-node" />
          <motion.circle r={10} className="m-hot" initial={false} animate={{ opacity: n.hot ? 1 : 0 }} transition={{ duration: still ? 0 : 0.5 }} />
        </motion.g>
      ))}
    </svg>
  );
}
