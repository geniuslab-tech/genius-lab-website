"use client";

import type { CSSProperties } from "react";
import { smoothPath } from "@/components/hero-demo/engine";
import { renderSegments, segText } from "@/components/hero-demo/screens";
import { GeniusShaderOrb } from "@/components/brief/Orb";
import { BRIEF, BRONZE_ROWS, CATEGORIES, DRIVERS, ENTITIES, GM, GOLD_KPIS, LAYERS, MOVES, QUESTION, RAW_CHIPS, REV, SILVER_ROWS, logoUrl } from "../auto/data";
import { BrainSphere } from "@/components/v2/BrainSphere";
import { ACTS, AG, BAND_H, BR, BRAIN, CTX, DOCK, DASH, DM, ENT, ORB, ORG, PEOPLE, PERSON, SEND_BTN, SYS, WH, WW, agY, bandTop, cl, ctxY, dockIn, dockY, entY, hcurve, mix, old, ph, r2, rowY, slotC, tileC, tileX } from "./geometry";

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

function Logo({ domain, size = 22 }: { domain: string; size?: number }) {
  return (
    <span className="grid shrink-0 place-items-center rounded-[7px] bg-white/[0.93]" style={{ width: size + 8, height: size + 8 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logoUrl(domain)} alt="" width={size} height={size} className="object-contain" style={{ width: size, height: size }} loading="lazy" />
    </span>
  );
}

/** A connector: soft glow, a crisp core, and packets riding it once it is live. */
function Beam({ d, color, o, packets = true, dur = 2.4, begin = 0, w = 1.4, draw }: { d: string; color: string; o: number; packets?: boolean; dur?: number; begin?: number; w?: number; draw?: number }) {
  if (o <= 0.01) return null;
  const drawn = draw === undefined ? undefined : { strokeDasharray: 1, strokeDashoffset: 1 - draw };
  return (
    <g opacity={o}>
      <path d={d} fill="none" stroke={color} strokeOpacity="0.22" strokeWidth={w * 4} strokeLinecap="round" pathLength={1} style={{ filter: "url(#fcGlow)", ...drawn }} />
      <path d={d} fill="none" stroke={color} strokeOpacity="0.85" strokeWidth={w} strokeLinecap="round" pathLength={1} style={drawn} />
      {packets && (draw === undefined || draw > 0.98) ? (
        <>
          <circle r={w * 2.2} fill={color} style={{ filter: "url(#fcGlow)" }}>
            <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={d} />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.88;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
          </circle>
          <circle r={w * 1.3} fill="oklch(0.98 0.01 250)">
            <animateMotion dur={`${dur}s`} begin={`${begin + dur / 2}s`} repeatCount="indefinite" path={d} />
            <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.1;0.88;1" dur={`${dur}s`} begin={`${begin + dur / 2}s`} repeatCount="indefinite" />
          </circle>
        </>
      ) : null}
    </g>
  );
}

/** a world-positioned box that fades and rises in with t */
function Node({ x, y, w, h, t, className = "", style, children }: { x: number; y: number; w: number; h?: number; t: number; className?: string; style?: CSSProperties; children: React.ReactNode }) {
  if (t <= 0.001) return null;
  return (
    <div className={`absolute ${className}`} style={{ left: x, top: y, width: w, height: h, opacity: t, transform: `translateY(${r2((1 - t) * 18)}px)`, ...style }}>
      {children}
    </div>
  );
}

const panel = "rounded-[20px] border border-white/[0.11] bg-[linear-gradient(170deg,oklch(0.24_0.045_260/96%),oklch(0.16_0.03_264/96%))] shadow-[0_40px_100px_-40px_rgb(0_0_0/0.9),inset_0_1px_0_oklch(1_0_0/7%)]";
const mono = "font-gl-mono uppercase";

const GOLD = "oklch(0.82 0.14 78)";
const DATA = "oklch(0.7 0.17 252)";
const OK = "oklch(0.78 0.13 168)";
const CONTEXT = "oklch(0.78 0.13 295)";

/* ------------------------------------------------------------------ */
/* The world                                                           */
/* ------------------------------------------------------------------ */

export function World({ p: P, motion = true, zoom = 1 }: { p: number; motion?: boolean; zoom?: number }) {
  /* the first six beats run on the compressed clock of the Connected section */
  const p = old(P);
  /* beats */
  const sys = ph(p, 0, 0.05);
  const clash = ph(p, 0.04, 0.07) * (1 - ph(p, 0.12, 0.15));
  const ent = ph(p, 0.11, 0.15);
  const claims = ph(p, 0.17, 0.2);
  const unrec = ph(p, 0.2, 0.23);
  const ask = ph(p, 0.15, 0.18) * (1 - ph(p, 0.27, 0.3));
  const intake = ph(p, 0.27, 0.31);
  const dm = ph(p, 0.27, 0.31);
  const L = [ph(p, 0.31, 0.33), ph(p, 0.335, 0.355), ph(p, 0.36, 0.38), ph(p, 0.385, 0.405)];
  const agreed = ph(p, 0.41, 0.43);
  const goldOut = ph(p, 0.45, 0.49);
  const dash = ph(p, 0.46, 0.5);
  const kpis = ph(p, 0.49, 0.52);
  const chart = ph(p, 0.51, 0.56);
  const bridge = ph(p, 0.53, 0.57);
  const table = ph(p, 0.55, 0.59);
  const fcf = ph(p, 0.58, 0.61);
  const toOrb = ph(p, 0.61, 0.64);
  const orb = ph(p, 0.6, 0.64);
  const brief = ph(p, 0.63, 0.66);
  const qTyped = Math.round(QUESTION.length * cl((p - 0.64) / 0.025));
  const aLen = segText(BRIEF).length;
  const aTyped = Math.round(aLen * cl((p - 0.668) / 0.06));
  const drivers = ph(p, 0.72, 0.75);
  const toAgents = ph(p, 0.75, 0.78);
  const cards = [0, 1, 2].map((i) => ph(p, 0.765 + i * 0.012, 0.795 + i * 0.012));
  const approved = [0, 1, 2].map((i) => p >= 0.815 + i * 0.025);
  const recovered = MOVES.reduce((s, m, i) => s + (approved[i] ? m.value : 0), 0);
  const writeback = ph(P, 0.925, 0.975);
  const tuned = P >= 0.885;
  const panorama = P >= 0.94;
  const orbState = p < 0.665 ? "thinking" : p < 0.73 ? "typing" : "holding";

  /* systems that belong to an entity, and where they land */
  const homes = ENTITIES.flatMap((e, i) =>
    e.domains.map((d, k) => {
      const ci = CATEGORIES.findIndex((c) => c.systems.some((s) => s.domain === d));
      const ri = CATEGORIES[ci]!.systems.findIndex((s) => s.domain === d);
      return { d, i, k, ci, ri, order: i * 4 + k };
    }),
  );
  const fly = (order: number) => ph(p, 0.135 + order * 0.0035, 0.19 + order * 0.0035);

  return (
    <div className="relative" style={{ width: WW, height: WH }}>
      {/* act labels */}
      {ACTS.map((a, i) => {
        const on = [sys, ent, dm, dash, orb, cards[0]!, ph(P, 0.635, 0.66), ph(P, 0.785, 0.815)][i]!;
        return (
          <div key={a.label} className="absolute flex items-center gap-2.5" style={{ left: a.x, top: 34, opacity: on }}>
            <span className={`${mono} text-[13px] tracking-[0.22em] text-gl-data`}>{a.n}</span>
            <span className="h-px w-6 bg-gl-data/40" />
            <span className={`${mono} text-[13px] tracking-[0.22em] text-gl-muted-foreground`}>{a.label}</span>
          </div>
        );
      })}

      {/* ---------------- beams (under the nodes) ---------------- */}
      <svg className="pointer-events-none absolute inset-0" width={WW} height={WH} aria-hidden="true">
        <defs>
          <filter id="fcGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* systems → entities: each landed system keeps a lineage line to its row */}
        {homes.map((h, n) => {
          const t = fly(h.order);
          const y1 = rowY(h.ci) + SYS.rowH / 2 + (h.ri - 2) * 9;
          const s = slotC(h.i, h.k);
          return <Beam key={h.d} d={hcurve(SYS.w + 2, y1, ENT.x - 2, s.y)} color={ENTITIES[h.i]!.hue} o={ph(t, 0.85, 1) * 0.75} w={1} dur={2.6 + (n % 4) * 0.3} begin={n * 0.17} packets={motion} />;
        })}

        {/* entities → raw */}
        {ENTITIES.map((e, i) => (
          <Beam key={e.name} d={hcurve(ENT.x + ENT.w + 2, entY(i) + ENT.h / 2, DM.x - 2, bandTop(0) + 40 + i * 24)} color={e.hue} o={intake} w={1.5} dur={2.2 + i * 0.2} begin={i * 0.3} packets={motion} />
        ))}

        {/* raw → bronze → silver → gold */}
        {[0, 1, 2].map((i) => (
          <Beam key={i} d={`M ${DM.x + 54} ${bandTop(i) + BAND_H} L ${DM.x + 54} ${bandTop(i + 1)}`} color={LAYERS[i + 1]!.accent} o={L[i + 1]!} w={1.6} dur={0.9} begin={i * 0.2} packets={motion} />
        ))}

        {/* gold → dashboard */}
        {[0, 1, 2, 3].map((i) => (
          <Beam key={i} d={hcurve(DM.x + DM.w + 2, bandTop(3) + 46 + i * 20, DASH.x - 2, DASH.y + 120 + i * 140)} color={GOLD} o={goldOut} w={1.4} dur={2 + i * 0.25} begin={i * 0.3} packets={motion} />
        ))}

        {/* dashboard → orb (the free cash flow card it reads, and the whole surface) */}
        <Beam d={hcurve(DASH.x + DASH.w + 2, DASH.y + 108, ORB.x - ORB.size / 2 - 6, ORB.y - 30)} color="oklch(0.85 0.11 205)" o={toOrb} w={1.6} dur={1.8} packets={motion} />
        <Beam d={hcurve(DASH.x + DASH.w + 2, DASH.y + 420, ORB.x - ORB.size / 2 - 6, ORB.y + 30)} color={DATA} o={toOrb} w={1.2} dur={2.2} begin={0.6} packets={motion} />
        {/* orb → brief */}
        <Beam d={hcurve(ORB.x + ORB.size / 2 + 6, ORB.y, BR.x - 2, ORB.y)} color="oklch(0.85 0.11 205)" o={brief} w={1.8} dur={1.4} packets={motion} />
        {/* brief → agents */}
        {MOVES.map((m, i) => (
          <Beam key={m.agent} d={hcurve(BR.x + BR.w + 2, BR.y + 380 + i * 50, AG.x - 2, agY(i) + AG.h / 2)} color={m.color} o={toAgents} w={1.4} dur={2 + i * 0.3} begin={i * 0.35} packets={motion} />
        ))}

        {/* the approved plan → the org chart */}
        <Beam d={hcurve(AG.x + AG.w + 2, agY(1) + AG.h / 2, ORG.x - 2, ORG.y + SEND_BTN.y - 120)} color={GOLD} o={ph(P, 0.632, 0.655)} w={1.8} dur={1.6} packets={motion} />

        {/* the four docked orbs → the Second Brain */}
        {DOCKED.map((d, k) => {
          const e = dockIn(k);
          return <Beam key={d.label} d={hcurve(DOCK.x + DOCK.size / 2 + 8, dockY(k), e.x, e.y)} color={d.c} o={1} w={1.6} draw={ph(P, 0.815 + k * 0.008, 0.84 + k * 0.008)} dur={1.6 + k * 0.25} begin={k * 0.3} packets={motion} />;
        })}

        {/* Second Brain → its three kinds of context */}
        {[0, 1, 2].map((i) => (
          <Beam key={i} d={hcurve(BRAIN.x + BRAIN.size / 2 - 40, BRAIN.y - 70 + i * 70, CTX.x - 2, ctxY(i) + CTX.h / 2)} color={CTX_COLORS[i]!} o={ph(P, 0.835 + i * 0.015, 0.85 + i * 0.015)} w={1.5} dur={1.8 + i * 0.3} begin={i * 0.4} packets={motion} />
        ))}

        {/* write-back: under the whole pipeline, back to the systems of record */}
        {(() => {
          const x0 = AG.x + AG.w / 2;
          const y0 = agY(2) + AG.h + 4;
          const yb = 950;
          const x1 = SYS.w / 2;
          const y1 = rowY(5) + SYS.rowH + 4;
          const d = `M ${x0} ${y0} C ${x0} ${yb}, ${x0 - 60} ${yb}, ${x0 - 200} ${yb} L ${x1 + 200} ${yb} C ${x1 + 60} ${yb}, ${x1} ${yb}, ${x1} ${y1}`;
          return (
            <g>
              <Beam d={d} color={OK} o={writeback > 0 ? 1 : 0} w={1.6} draw={writeback} dur={7} packets={motion} />
              <text x={WW / 2} y={yb - 14} textAnchor="middle" className="font-gl-mono" fontSize="13" letterSpacing="4" fill={OK} opacity={ph(writeback, 0.6, 1)}>
                WRITE-BACK TO SYSTEMS OF RECORD · ONE CONTINUOUS LOOP
              </text>
            </g>
          );
        })()}
      </svg>

      {/* ---------------- 01 systems of record ---------------- */}
      {CATEGORIES.map((c, i) => (
        <Node key={c.label} x={SYS.x} y={rowY(i)} w={SYS.w} h={SYS.rowH} t={ph(p, i * 0.007, 0.035 + i * 0.007)}>
          <div className="relative h-full rounded-[22px] border border-gl-data/40 bg-[linear-gradient(100deg,oklch(0.3_0.06_258/85%),oklch(0.22_0.045_260/80%))]">
            <span className={`${mono} absolute left-6 top-1/2 -translate-y-1/2 text-[15px] tracking-[0.18em] text-gl-data`}>{c.label}</span>
            <span className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full border border-gl-data/60 bg-[oklch(0.2_0.04_260)]" />
          </div>
        </Node>
      ))}
      {CATEGORIES.map((c, i) =>
        c.systems.map((s, k) => {
          const home = homes.find((h) => h.d === s.domain);
          const t = home ? fly(home.order) : 0;
          const o = ph(p, 0.01 + (i * 5 + k) * 0.0012, 0.04 + (i * 5 + k) * 0.0012);
          const c0 = tileC(i, k);
          /* picked systems leave a ghost behind and fly to their entity on a bowed curve */
          const ghost = home && t > 0;
          const tile = (
            <span className="grid place-items-center rounded-[14px] border border-white/25 bg-white/[0.13]" style={{ width: SYS.tile, height: SYS.tile }}>
              <Logo domain={s.domain} size={24} />
            </span>
          );
          return (
            <div key={s.domain}>
              <div className="absolute" style={{ left: tileX(k), top: rowY(i) + (SYS.rowH - SYS.tile) / 2, opacity: o * (ghost ? 0.22 : 1) }}>
                {tile}
              </div>
              {home && t > 0 && t < 1
                ? (() => {
                    const e = slotC(home.i, home.k);
                    const dx = e.x - c0.x;
                    const dy = e.y - c0.y;
                    const len = Math.hypot(dx, dy) || 1;
                    const bow = (k % 2 ? 1 : -1) * (90 + k * 26);
                    const cx = (c0.x + e.x) / 2 + (-dy / len) * bow;
                    const cy = (c0.y + e.y) / 2 + (dx / len) * bow;
                    const it = 1 - t;
                    const x = it * it * c0.x + 2 * it * t * cx + t * t * e.x;
                    const y = it * it * c0.y + 2 * it * t * cy + t * t * e.y;
                    const sc = mix(1, ENT.slot / SYS.tile, t);
                    return (
                      <div className="absolute z-20" style={{ left: 0, top: 0, transform: `translate(${r2(x - SYS.tile / 2)}px, ${r2(y - SYS.tile / 2)}px) scale(${r2(sc)}) rotate(${r2(it * (k % 2 ? 160 : -160))}deg)` }}>
                        {tile}
                      </div>
                    );
                  })()
                : null}
            </div>
          );
        }),
      )}
      {/* what disagrees */}
      {[
        { x: 430, y: rowY(0) - 26, t: "Revenue · $1.39B", red: true },
        { x: 300, y: rowY(1) - 26, t: "Customer ID ≠ Account ID", red: false },
        { x: 440, y: rowY(3) - 26, t: "3 versions of headcount", red: false },
        { x: 380, y: rowY(4) - 26, t: "Revenue · $1.45B", red: true },
        { x: 300, y: rowY(5) - 26, t: "EUR · BRL · SGD · USD", red: false },
      ].map((c, n) => (
        <Node key={c.t} x={c.x} y={c.y} w={300} t={clash * ph(p, 0.04 + n * 0.006, 0.06 + n * 0.006)} className="z-10">
          <span
            className={`${mono} inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 text-[11px] tracking-[0.08em]`}
            style={{ borderColor: c.red ? "oklch(0.65 0.2 25 / 60%)" : "oklch(0.77 0.155 66 / 55%)", background: c.red ? "oklch(0.24 0.07 25 / 95%)" : "oklch(0.24 0.05 66 / 95%)", color: c.red ? "oklch(0.84 0.11 25)" : "var(--gold)" }}
          >
            <span className="grid h-3.5 w-3.5 place-items-center rounded-full text-[9px] font-bold text-gl-background" style={{ background: c.red ? "oklch(0.65 0.2 25)" : "var(--gold)" }}>
              !
            </span>
            {c.t}
          </span>
        </Node>
      ))}

      {/* ---------------- 02 entities ---------------- */}
      <Node x={ENT.x} y={entY(3) + ENT.h + 22} w={ENT.w} t={ask}>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[oklch(0.22_0.04_262/96%)] py-2 pl-2 pr-4">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.75_0.12_70)] to-[oklch(0.55_0.14_40)] text-[11px] font-semibold text-[oklch(0.15_0.03_264)]">EC</span>
          <span className="text-[14px] text-gl-foreground">CFO: &ldquo;What was group revenue in Q3?&rdquo;</span>
        </div>
      </Node>
      {ENTITIES.map((e, i) => (
        <Node key={e.name} x={ENT.x} y={entY(i)} w={ENT.w} h={ENT.h} t={ph(p, 0.11 + i * 0.01, 0.15 + i * 0.01)}>
          <div
            className="relative h-full overflow-hidden rounded-[18px] border bg-[linear-gradient(165deg,oklch(0.25_0.04_260/96%),oklch(0.17_0.03_262/96%))] px-6 py-4"
            style={{ borderColor: agreed > 0.5 ? "oklch(0.8 0.15 75 / 50%)" : unrec > 0.5 ? "oklch(0.65 0.2 25 / 45%)" : "oklch(1 0 0 / 11%)" }}
          >
            <span className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full opacity-35 blur-2xl" style={{ background: e.hue }} />
            <div className="relative flex items-baseline justify-between">
              <span className="flex items-center gap-2 font-gl-display text-[17px] tracking-tight text-gl-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: e.hue, boxShadow: `0 0 10px ${e.hue}` }} />
                {e.name}
              </span>
              <span className={`${mono} text-[10.5px] tracking-[0.16em] text-gl-muted-foreground`}>{e.region}</span>
            </div>
            {/* slots the systems land in */}
            <div className="absolute flex gap-[14px]" style={{ left: 24, top: 62 }}>
              {e.domains.map((d) => {
                const h = homes.find((x) => x.d === d)!;
                const landed = ph(fly(h.order), 0.94, 1);
                return (
                  <span key={d} className="grid place-items-center rounded-[12px] border border-dashed border-white/15" style={{ width: ENT.slot, height: ENT.slot }}>
                    <span style={{ opacity: landed }}>
                      <Logo domain={d} size={20} />
                    </span>
                  </span>
                );
              })}
            </div>
            <div className="absolute bottom-4 left-6">
              <p className={`${mono} text-[9.5px] tracking-[0.16em] text-gl-muted-foreground`}>Q3 · local close</p>
              <p className="font-gl-display text-[20px] tabular-nums text-gl-foreground">{e.local}</p>
            </div>
            <div
              className="absolute bottom-4 right-5 rounded-xl border px-3 py-1.5 text-right"
              style={{
                opacity: claims,
                borderColor: agreed > 0.5 ? "oklch(0.8 0.15 75 / 45%)" : unrec > 0.5 ? "oklch(0.65 0.2 25 / 45%)" : "oklch(1 0 0 / 10%)",
                background: agreed > 0.5 ? "oklch(0.8 0.15 75 / 10%)" : unrec > 0.5 ? "oklch(0.65 0.2 25 / 10%)" : "transparent",
              }}
            >
              <p className={`${mono} text-[9px] tracking-[0.14em]`} style={{ color: agreed > 0.5 ? GOLD : unrec > 0.5 ? "oklch(0.8 0.13 25)" : "var(--muted-foreground)" }}>
                {agreed > 0.5 ? "✓ Group · reconciled" : unrec > 0.5 ? "Group · unreconciled" : "Group revenue"}
              </p>
              <p className="font-gl-display text-[19px] tabular-nums" style={{ color: agreed > 0.5 ? GOLD : "var(--foreground)" }}>
                {agreed > 0.5 ? "$1.42B" : e.claim}
              </p>
            </div>
          </div>
        </Node>
      ))}

      {/* ---------------- 03 Data Manager ---------------- */}
      <Node x={DM.x} y={DM.y} w={DM.w} h={DM.h} t={dm}>
        <div className={`relative h-full overflow-hidden ${panel}`}>
          <span className="pointer-events-none absolute -top-24 left-1/4 h-52 w-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.7_0.17_252/24%),transparent)] blur-xl" />
          <div className="relative flex h-[70px] items-center justify-between border-b border-white/[0.07] px-5">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/atomo.png" alt="" className="h-9 w-9 object-contain drop-shadow-[0_0_10px_oklch(0.7_0.17_252/55%)]" />
              <div>
                <p className="font-gl-display text-[17px] tracking-tight text-gl-foreground">Genius Lab Data Manager</p>
                <p className={`${mono} text-[9.5px] tracking-[0.14em] text-gl-muted-foreground`}>4 entities · 16 sources · medallion</p>
              </div>
            </div>
            <div className="text-right">
              {agreed > 0.5 ? (
                <span className="inline-flex items-center gap-2 rounded-xl border border-[oklch(0.8_0.15_75/50%)] bg-[oklch(0.8_0.15_75/12%)] px-3 py-1.5">
                  <span className={`${mono} text-[9px] tracking-[0.14em]`} style={{ color: GOLD }}>Group revenue</span>
                  <span className="font-gl-display text-[18px] tabular-nums" style={{ color: GOLD }}>$1.42B</span>
                </span>
              ) : (
                <>
                  <p className={`${mono} text-[9px] tracking-[0.16em] text-gl-muted-foreground`}>Data quality</p>
                  <p className="font-gl-display text-[20px] tabular-nums text-gl-foreground">
                    {L[0]! <= 0 ? "—" : (L[3]! > 0 ? mix(96, 99.8, L[3]!) : L[2]! > 0 ? mix(78, 96, L[2]!) : L[1]! > 0 ? mix(41, 78, L[1]!) : 41 * L[0]!).toFixed(1) + "%"}
                  </p>
                </>
              )}
            </div>
          </div>
          {LAYERS.map((l, i) => {
            const on = L[i]!;
            const done = i < 3 ? L[i + 1]! > 0.5 : agreed > 0.5;
            const running = on > 0.5 && !done;
            return (
              <div
                key={l.key}
                className="absolute left-4 right-4 rounded-[16px] border"
                style={{
                  top: bandTop(i) - DM.y,
                  height: BAND_H,
                  borderColor: running ? `color-mix(in oklab, ${l.accent} 65%, transparent)` : on > 0.5 ? `color-mix(in oklab, ${l.accent} 32%, transparent)` : "oklch(1 0 0 / 7%)",
                  background: `linear-gradient(90deg, color-mix(in oklab, ${l.accent} ${r2(9 * on)}%, transparent), oklch(1 0 0 / 2%))`,
                  boxShadow: running ? `0 0 44px -10px color-mix(in oklab, ${l.accent} 55%, transparent)` : "none",
                }}
              >
                <span className="absolute bottom-4 left-0 top-4 w-[3px] rounded-r-full" style={{ background: l.accent, opacity: 0.15 + 0.8 * on }} />
                <div className="absolute left-6 top-4 w-[220px]" style={{ opacity: 0.4 + 0.6 * on }}>
                  <p className={`${mono} text-[11px] tracking-[0.26em]`} style={{ color: l.accent }}>
                    {l.tag}
                  </p>
                  <p className="mt-1 font-gl-display text-[16px] leading-tight tracking-tight text-gl-foreground">{l.title}</p>
                  <p className="mt-1 text-[11.5px] leading-snug text-gl-muted-foreground">{l.note}</p>
                  <p className="mt-2 flex items-center gap-2">
                    <span className={`${mono} rounded-full px-2 py-0.5 text-[9px] tracking-[0.14em]`} style={{ background: done ? `color-mix(in oklab, ${l.accent} 16%, transparent)` : running ? "oklch(0.7 0.17 252 / 16%)" : "oklch(1 0 0 / 5%)", color: done ? l.accent : running ? DATA : "var(--muted-foreground)" }}>
                      {done ? "✓ Complete" : running ? "● Processing" : "Queued"}
                    </span>
                    <span className="font-gl-mono text-[10px] text-gl-muted-foreground">
                      {l.key === "gold" ? `${Math.round(l.rows * on)} KPIs` : `${(l.rows * on).toFixed(1)}M rows`}
                    </span>
                  </p>
                </div>
                <div className="absolute bottom-3 right-4 top-3 w-[316px] overflow-hidden" style={{ opacity: 0.15 + 0.85 * on }}>
                  <LayerViz i={i} on={on} />
                </div>
              </div>
            );
          })}
        </div>
      </Node>

      {/* ---------------- 04 executive operating system ---------------- */}
      <Node x={DASH.x} y={DASH.y} w={DASH.w} h={DASH.h} t={dash}>
        <div className={`relative h-full overflow-hidden ${panel}`}>
          <div className="flex h-12 items-center justify-between border-b border-white/[0.07] px-5">
            <div className="flex items-center gap-3">
              <span className="flex gap-1.5">{[0, 1, 2].map((i) => <span key={i} className="h-2.5 w-2.5 rounded-full bg-white/[0.12]" />)}</span>
              <span className="text-[14px] text-gl-foreground">Executive Operating System</span>
              <span className="text-[12px] text-gl-muted-foreground">· Meridian Holdings · FY26 Q3</span>
            </div>
            <span className={`${mono} flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[9.5px] tracking-[0.14em]`} style={{ borderColor: "oklch(0.8 0.15 75 / 35%)", color: GOLD }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} /> Live · from gold
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3 p-4 pb-0">
            {GOLD_KPIS.map((k, i) => {
              const t = ph(kpis, i * 0.15, 0.55 + i * 0.15);
              const sel = i === 1 && fcf > 0.5;
              const num = parseFloat(k.v.replace(/[^0-9.]/g, ""));
              const val = k.v.replace(/[0-9.]+/, (num * t).toFixed(k.v.includes(".") ? (k.v.split(".")[1]!.replace(/[^0-9]/g, "").length) : 0));
              return (
                <div
                  key={k.k}
                  className="relative rounded-[14px] border p-3.5"
                  style={{
                    opacity: t,
                    transform: `translateY(${r2((1 - t) * 10)}px)`,
                    borderColor: sel ? "oklch(0.85 0.11 205 / 70%)" : "oklch(1 0 0 / 9%)",
                    boxShadow: sel ? "0 0 0 1px oklch(0.85 0.11 205 / 35%), 0 0 40px -10px oklch(0.85 0.11 205 / 60%)" : "none",
                    background: "linear-gradient(170deg, oklch(0.22 0.035 262 / 85%), oklch(0.17 0.03 262 / 80%))",
                  }}
                >
                  {sel ? <span className={`${mono} absolute -top-2.5 right-3 rounded-full border border-[oklch(0.85_0.11_205/55%)] bg-[oklch(0.18_0.04_250)] px-2 py-[1px] text-[8.5px] tracking-[0.12em] text-[var(--cyan)]`}>Genius is reading</span> : null}
                  <p className={`${mono} text-[10px] tracking-[0.14em] text-gl-muted-foreground`}>{k.k}</p>
                  <p className="mt-1.5 font-gl-display text-[26px] tabular-nums tracking-tight text-gl-foreground">{val}</p>
                  <p className={`mt-0.5 text-[11.5px] ${i === 1 ? "text-gl-gold" : "text-gl-data"}`}>{["+6.4% vs budget", "−$4.2M vs budget", "+0.8pp vs budget", "+1.2pp vs budget"][i]}</p>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-[1.5fr_1fr] gap-3 p-4">
            <div className="rounded-[14px] border border-white/[0.09] bg-white/[0.02] p-4" style={{ opacity: ph(chart, 0, 0.3) }}>
              <p className="mb-2 text-[13px] text-gl-foreground">Revenue and gross margin · FY26</p>
              <MiniChart t={chart} />
            </div>
            <div className="rounded-[14px] border border-white/[0.09] bg-white/[0.02] p-4" style={{ opacity: ph(bridge, 0, 0.3) }}>
              <p className="mb-2 text-[13px] text-gl-foreground">Free cash flow bridge · QTD</p>
              <MiniBridge t={bridge} />
            </div>
          </div>
          <div className="mx-4 rounded-[14px] border border-white/[0.09] bg-white/[0.02] px-4 py-3" style={{ opacity: table }}>
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-gl-foreground">Entities · harmonized to USD</p>
              <p className="font-gl-display text-[15px]" style={{ color: GOLD }}>Group $1.42B</p>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-3">
              {ENTITIES.map((e, i) => (
                <div key={e.name} className="rounded-lg bg-white/[0.03] px-3 py-2">
                  <p className="flex items-center gap-1.5 truncate text-[11.5px] text-gl-foreground/90">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: e.hue }} />
                    {e.name}
                  </p>
                  <p className="mt-0.5 flex justify-between font-gl-mono text-[11px]">
                    <span className="text-gl-foreground/80">{e.usd}</span>
                    <span className={e.plan.startsWith("−") ? "text-gl-gold" : "text-gl-data"}>{e.plan}</span>
                  </p>
                  <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <span className="block h-full origin-left rounded-full" style={{ background: e.hue, width: `${(parseFloat(e.usd.replace(/[$M]/g, "")) / 460) * 100}%`, transform: `scaleX(${r2(ph(table, 0.2 + i * 0.1, 0.8 + i * 0.05))})` }} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Node>

      {/* ---------------- 05 Genius orb + brief ---------------- */}
      {orb > 0.001 ? (
        <div className="absolute" style={{ left: ORB.x - ORB.size / 2, top: ORB.y - ORB.size / 2, width: ORB.size, height: ORB.size, opacity: orb, transform: `scale(${r2(mix(0.8, 1, orb))})` }}>
          <span className="pointer-events-none absolute -inset-16 rounded-full bg-[radial-gradient(closest-side,oklch(0.7_0.17_252/35%),transparent)] blur-xl" />
          {motion && !panorama ? <GeniusShaderOrb state={tuned ? "holding" : orbState} size={ORB.size} /> : <span className="gorb gorb-blue absolute inset-0" style={{ width: ORB.size, height: ORB.size }}><span className="gorb-halo" /><span className="gorb-aurora" /><span className="gorb-glass" /><span className="gorb-spec" /></span>}
          <div className="absolute left-1/2 top-full mt-6 w-[260px] -translate-x-1/2 text-center">
            <p className="font-gl-display text-[18px] text-gl-foreground">Genius</p>
            <p className="text-[12px] text-gl-muted-foreground">{tuned ? <span style={{ color: CONTEXT }}>◉ In sync with the Second Brain</span> : orbState === "thinking" ? "Reading gold.fct_cash · 48M rows…" : orbState === "typing" ? "Writing the brief…" : "Brief ready · 96% confidence"}</p>
          </div>
        </div>
      ) : null}
      <Node x={BR.x} y={BR.y} w={BR.w} h={BR.h} t={brief}>
        <div className={`relative h-full overflow-hidden p-6 ${panel}`}>
          <span className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,oklch(0.7_0.17_252/24%),transparent)]" />
          <div className="relative flex items-center justify-between">
            <p className="font-gl-display text-[17px] text-gl-foreground">Executive brief</p>
            <span className={`${mono} text-[10px] tracking-[0.14em] text-gl-muted-foreground`}>Today · 06:12</span>
          </div>
          <div className="relative mt-4 flex justify-end">
            <div className="max-w-[88%] rounded-2xl rounded-br-sm bg-white/[0.08] px-3.5 py-2.5 text-[13px] leading-snug text-gl-foreground">
              <span className={`${mono} mb-0.5 block text-[9px] tracking-[0.14em] text-gl-muted-foreground`}>Elena · CFO</span>
              {QUESTION.slice(0, qTyped)}
              {qTyped > 0 && qTyped < QUESTION.length ? <span className="gcaret" /> : null}
            </div>
          </div>
          <div className="relative mt-4 min-h-[110px] text-[14px] leading-[1.65] text-gl-foreground/90">
            {aTyped > 0 ? (
              <>
                {renderSegments(BRIEF, aTyped)}
                {aTyped < aLen ? <span className="gcaret" /> : null}
              </>
            ) : qTyped >= QUESTION.length ? (
              <div className="space-y-2 pt-1">
                <span className="gshimmer block h-2.5 w-[94%] rounded" />
                <span className="gshimmer block h-2.5 w-[80%] rounded" />
                <span className="gshimmer block h-2.5 w-[62%] rounded" />
              </div>
            ) : null}
          </div>
          <div className="relative mt-3 space-y-2" style={{ opacity: drivers }}>
            <p className={`${mono} text-[9.5px] tracking-[0.16em] text-gl-muted-foreground`}>What moved the cash</p>
            {DRIVERS.map((d, i) => (
              <div key={d.k} className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-gl-foreground/90">{d.k}</span>
                  <span className="font-gl-mono" style={{ color: d.tone === "gold" ? "var(--gold)" : OK }}>{d.v}</span>
                </div>
                <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <span className="block h-full origin-left rounded-full" style={{ width: `${d.w * 100}%`, transform: `scaleX(${r2(ph(drivers, i * 0.2, 0.6 + i * 0.2))})`, background: d.tone === "gold" ? "var(--gold)" : OK }} />
                </span>
              </div>
            ))}
          </div>
          <p className={`${mono} absolute bottom-5 left-6 right-6 flex items-center justify-between text-[9.5px] tracking-[0.14em]`} style={{ opacity: toAgents, color: GOLD }}>
            <span>3 moves · $3.4M · sent to the agents</span>
            <span>→</span>
          </p>
        </div>
      </Node>

      {/* ---------------- 06 agents ---------------- */}
      <Node x={AG.x} y={150} w={AG.w} t={cards[0]!}>
        <div className="flex items-baseline justify-between">
          <span className={`${mono} text-[10px] tracking-[0.16em]`} style={{ color: approved[2] ? OK : "var(--muted-foreground)" }}>{approved[2] ? "✓ Plan approved · cash recovered" : "Cash recovered"}</span>
          <span className="font-gl-display text-[20px] tabular-nums" style={{ color: OK }}>
            ${recovered.toFixed(1)}M <span className="text-[12px] text-gl-muted-foreground">/ $4.2M</span>
          </span>
        </div>
        <div className="mt-2 flex h-2 gap-[2px] overflow-hidden rounded-full bg-white/[0.06]">
          {MOVES.map((m, i) => (
            <span key={m.agent} className="h-full origin-left rounded-full transition-transform duration-700" style={{ width: `${(m.value / 4.2) * 100}%`, background: m.color, transform: `scaleX(${approved[i] ? 1 : 0})` }} />
          ))}
        </div>
      </Node>
      {MOVES.map((m, i) => {
        const ok = approved[i]!;
        return (
          <Node key={m.agent} x={AG.x} y={agY(i)} w={AG.w} h={AG.h} t={cards[i]!}>
            <div
              className="relative h-full overflow-hidden rounded-[18px] border bg-[linear-gradient(170deg,oklch(0.24_0.04_260/96%),oklch(0.16_0.03_264/96%))] p-4"
              style={{ borderColor: ok ? "oklch(0.78 0.13 168 / 50%)" : "oklch(1 0 0 / 10%)", boxShadow: ok ? "0 0 44px -14px oklch(0.78 0.13 168 / 55%)" : "none", transition: "border-color 500ms, box-shadow 500ms" }}
            >
              <span className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-30 blur-2xl" style={{ background: m.color }} />
              <div className="relative flex items-center gap-3">
                {motion && cards[i]! > 0.3 && !panorama ? <GeniusShaderOrb state={ok ? "holding" : "thinking"} size={40} tint={m.tint} /> : <span className="h-10 w-10 rounded-full" style={{ background: `radial-gradient(circle at 35% 30%, white, ${m.color} 45%, oklch(0.2 0.04 262) 80%)` }} />}
                <div className="flex-1">
                  <p className="flex items-center gap-2 text-[14px] text-gl-foreground">
                    {m.agent}
                    {tuned ? (
                      <span className={`${mono} rounded-full border px-1.5 py-[1px] text-[8.5px] tracking-[0.12em]`} style={{ borderColor: "oklch(0.75 0.13 295 / 50%)", color: CONTEXT, background: "oklch(0.75 0.13 295 / 10%)" }}>
                        ◉ Tuned · business context
                      </span>
                    ) : null}
                  </p>
                  <p className="text-[11px] text-gl-muted-foreground">{m.owner} · {m.due}</p>
                </div>
                <span className="font-gl-display text-[22px] tabular-nums" style={{ color: OK }}>+${m.value.toFixed(1)}M</span>
              </div>
              <p className="relative mt-3 text-[13.5px] leading-snug text-gl-foreground">{m.title}</p>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="flex items-center gap-2 text-[11px] text-gl-muted-foreground">
                  <Logo domain={m.system.domain} size={13} />
                  {ok && writeback > 0.5 ? <span style={{ color: OK }}>✓ Written to {m.system.name}</span> : <>Writes to {m.system.name}</>}
                </span>
                <span
                  className="rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors duration-300"
                  style={{ background: ok ? "oklch(0.78 0.13 168 / 16%)" : "var(--gold)", color: ok ? OK : "var(--background)" }}
                >
                  {ok ? "✓ Approved by Elena" : "Approve"}
                </span>
              </div>
            </div>
          </Node>
        );
      })}

      <OrgPanel P={P} />
      <SecondBrain P={P} motion={motion} zoom={zoom} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 06 · the approved plan goes to the people who own it                */
/* ------------------------------------------------------------------ */

const PICKS = PEOPLE.filter((x) => x.pick !== undefined).sort((a, b) => a.pick! - b.pick!);
const pickAt = (k: number) => 0.682 + k * 0.009;
const SEND_AT = 0.73;
const flyAt = (k: number) => [0.738 + k * 0.004, 0.752 + k * 0.004] as const;

function OrgPanel({ P }: { P: number }) {
  const t = ph(P, 0.635, 0.66);
  if (t <= 0.001) return null;
  const picked = PICKS.filter((x) => P >= pickAt(x.pick!));
  const sending = P >= SEND_AT;
  const sentAll = P >= flyAt(PICKS.length - 1)[1];
  const byId = (id: string) => PEOPLE.find((x) => x.id === id)!;

  /* a simulated pointer: it visits each person, then the send button */
  const stops = [...PICKS.map((x) => ({ x: x.x + 30, y: x.y + 14 })), { x: SEND_BTN.x + SEND_BTN.w / 2 + 20, y: SEND_BTN.y + SEND_BTN.h / 2 + 6 }];
  const times = [...PICKS.map((x) => pickAt(x.pick!)), SEND_AT];
  let cur = { x: 300, y: 520 };
  for (let k = 0; k < stops.length; k++) {
    const t0 = k === 0 ? 0.668 : times[k - 1]!;
    const t1 = times[k]! - 0.002;
    if (P >= t0) {
      const a = k === 0 ? { x: 300, y: 520 } : stops[k - 1]!;
      const e = ph(P, t0, t1);
      cur = { x: mix(a.x, stops[k]!.x, e), y: mix(a.y, stops[k]!.y, e) };
    }
  }
  const pressed = times.some((tt) => P >= tt - 0.0025 && P < tt + 0.0015);
  const pressSend = P >= SEND_AT - 0.0025 && P < SEND_AT + 0.0015;
  const cursorOn = ph(P, 0.665, 0.672) * (1 - ph(P, 0.745, 0.755));

  return (
    <div className="absolute" style={{ left: ORG.x, top: ORG.y, width: ORG.w, height: ORG.h, opacity: t, transform: `translateY(${r2((1 - t) * 18)}px)` }}>
      <div className={`relative h-full overflow-hidden ${panel}`}>
        <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,oklch(0.8_0.15_75/16%),transparent)]" />
        <div className="relative flex h-[64px] items-center justify-between border-b border-white/[0.07] px-5">
          <div>
            <p className="font-gl-display text-[16px] tracking-tight text-gl-foreground">Send the approved plan</p>
            <p className="text-[11px] text-gl-muted-foreground">Pick who receives it · owners suggested by the agents</p>
          </div>
          <span className={`${mono} rounded-full px-2.5 py-1 text-[9.5px] tracking-[0.14em]`} style={{ background: "oklch(0.78 0.13 168 / 14%)", color: OK }}>
            ✓ Plan approved by Elena
          </span>
        </div>

        {/* the report */}
        <div className="absolute rounded-[14px] border border-[oklch(0.8_0.15_75/35%)] bg-[linear-gradient(170deg,oklch(0.27_0.05_80/30%),oklch(0.18_0.03_262/90%))] p-4" style={{ left: 22, top: 84, width: 214, height: 260 }}>
          <p className={`${mono} text-[9px] tracking-[0.16em]`} style={{ color: GOLD }}>
            Report · PDF · 6 pages
          </p>
          <p className="mt-1.5 font-gl-display text-[15px] leading-tight text-gl-foreground">Month-end cash plan</p>
          <p className="mt-1 text-[11px] text-gl-muted-foreground">3 moves · $3.4M of the $4.2M gap</p>
          <div className="mt-3 space-y-1.5">
            {MOVES.map((m) => (
              <div key={m.agent} className="flex items-center justify-between rounded-md bg-white/[0.04] px-2 py-1.5 text-[10.5px]">
                <span className="flex items-center gap-1.5 text-gl-foreground/85">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.color }} />
                  {m.agent.replace(" agent", "")}
                </span>
                <span className="font-gl-mono" style={{ color: OK }}>
                  +${m.value.toFixed(1)}M
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] leading-snug text-gl-muted-foreground">Owners, deadlines and the cash bridge, generated from gold.</p>
        </div>

        {/* send */}
        <div
          className="absolute flex items-center justify-center gap-2 rounded-xl text-[13px] font-medium"
          style={{
            left: SEND_BTN.x,
            top: SEND_BTN.y,
            width: SEND_BTN.w,
            height: SEND_BTN.h,
            background: sentAll ? "oklch(0.78 0.13 168 / 16%)" : picked.length ? "var(--gold)" : "oklch(1 0 0 / 8%)",
            color: sentAll ? OK : picked.length ? "var(--background)" : "var(--muted-foreground)",
            transform: pressSend ? "scale(0.96)" : "none",
            boxShadow: P >= pickAt(PICKS.length - 1) && !sending ? "0 0 0 5px oklch(0.77 0.155 66 / 20%)" : "none",
          }}
        >
          {sentAll ? `✓ Sent to ${PICKS.length} people` : sending ? "Sending…" : picked.length ? `Send report to ${picked.length}` : "Select recipients"}
        </div>

        {/* recipients */}
        <div className="absolute" style={{ left: 22, top: 418, width: 214 }}>
          <p className={`${mono} mb-2 text-[9px] tracking-[0.16em] text-gl-muted-foreground`}>Recipients</p>
          <div className="space-y-1.5">
            {PICKS.map((x, k) => {
              const on = P >= pickAt(x.pick!);
              const got = P >= flyAt(k)[1];
              return (
                <div key={x.id} className="flex items-center justify-between rounded-md bg-white/[0.035] px-2 py-1.5 text-[10.5px]" style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(4px)", transition: "opacity 300ms, transform 300ms" }}>
                  <span className="truncate text-gl-foreground/90">{x.n}</span>
                  <span className="font-gl-mono text-[9.5px]" style={{ color: got ? OK : sending ? GOLD : "var(--muted-foreground)" }}>
                    {got ? "✓ delivered" : sending ? "sending" : "selected"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* org chart */}
        <svg className="pointer-events-none absolute inset-0" width={ORG.w} height={ORG.h} aria-hidden="true">
          {PEOPLE.filter((x) => x.parent).map((x) => {
            const pa = byId(x.parent!);
            const y1 = pa.y + PERSON.h / 2;
            const y2 = x.y - PERSON.h / 2;
            const my = (y1 + y2) / 2;
            return <path key={x.id} d={`M ${pa.x} ${y1} L ${pa.x} ${my} L ${x.x} ${my} L ${x.x} ${y2}`} fill="none" stroke="oklch(1 0 0 / 16%)" />;
          })}
        </svg>
        {PEOPLE.map((x) => {
          const sel = x.pick !== undefined && P >= pickAt(x.pick);
          const got = x.pick !== undefined && P >= flyAt(x.pick)[1];
          return (
            <div
              key={x.id}
              className="absolute rounded-xl border px-2.5 py-2"
              style={{
                left: x.x - PERSON.w / 2,
                top: x.y - PERSON.h / 2,
                width: PERSON.w,
                height: PERSON.h,
                borderColor: got ? "oklch(0.78 0.13 168 / 55%)" : sel ? "oklch(0.8 0.15 75 / 60%)" : "oklch(1 0 0 / 10%)",
                background: got ? "oklch(0.78 0.13 168 / 8%)" : sel ? "oklch(0.8 0.15 75 / 9%)" : "oklch(0.2 0.035 262)",
                boxShadow: sel && !got ? "0 0 0 3px oklch(0.8 0.15 75 / 12%)" : "none",
              }}
            >
              <div className="flex items-center gap-2 pr-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.45_0.08_260)] to-[oklch(0.3_0.05_262)] text-[9px] font-semibold text-gl-foreground ring-1 ring-white/10">{x.i}</span>
                <span className="min-w-0">
                  <span className="block truncate text-[11px] leading-tight text-gl-foreground">{x.n}</span>
                  <span className="block truncate text-[9px] leading-tight text-gl-muted-foreground">{x.r}</span>
                </span>
              </div>
              <span className="absolute right-2 top-2 grid h-3.5 w-3.5 place-items-center rounded-[4px] border text-[8px]" style={{ borderColor: got ? OK : sel ? GOLD : "oklch(1 0 0 / 25%)", background: got ? OK : sel ? GOLD : "transparent", color: "var(--background)" }}>
                {sel ? "✓" : ""}
              </span>
              <span className={`${mono} absolute bottom-1.5 left-2.5 text-[8px] tracking-[0.1em]`} style={{ color: OK, opacity: got ? 1 : 0 }}>
                ✓ Report delivered
              </span>
            </div>
          );
        })}

        {/* envelopes travelling to each recipient */}
        <svg className="pointer-events-none absolute inset-0 z-10" width={ORG.w} height={ORG.h} aria-hidden="true">
          {PICKS.map((x, k) => {
            const [a, b] = flyAt(k);
            const e = ph(P, a, b);
            if (e <= 0 || e >= 1) return null;
            const sx = SEND_BTN.x + SEND_BTN.w;
            const sy = SEND_BTN.y + SEND_BTN.h / 2;
            const cx = mix(sx, x.x, 0.5);
            const cy = Math.min(sy, x.y) - 70;
            const it = 1 - e;
            const px = it * it * sx + 2 * it * e * cx + e * e * x.x;
            const py = it * it * sy + 2 * it * e * cy + e * e * x.y;
            return (
              <g key={x.id} transform={`translate(${r2(px)} ${r2(py)})`}>
                <circle r="17" fill="oklch(0.8 0.15 75 / 18%)" />
                <rect x="-10" y="-7" width="20" height="14" rx="2.5" fill="oklch(0.86 0.13 78)" />
                <path d="M -10 -6 L 0 2 L 10 -6" fill="none" stroke="oklch(0.2 0.04 262)" strokeWidth="1.4" />
              </g>
            );
          })}
        </svg>

        {/* the pointer */}
        <div className="pointer-events-none absolute left-0 top-0 z-20" style={{ transform: `translate(${r2(cur.x)}px, ${r2(cur.y)}px) scale(${pressed ? 0.85 : 1})`, opacity: cursorOn }}>
          <svg width="26" height="30" viewBox="0 0 26 30" className="-translate-x-[3px] -translate-y-[2px] drop-shadow-[0_6px_10px_rgb(0_0_0/0.45)]" aria-hidden="true">
            <path d="M3 2.5 L3 24 L8.6 18.8 L12.4 27.2 L16.3 25.4 L12.6 17.2 L20.4 17.2 Z" fill="#fff" stroke="#0b1024" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </div>

        {/* delivered */}
        <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full border border-[oklch(0.78_0.13_168/40%)] bg-[oklch(0.19_0.04_200/96%)] px-3.5 py-2 text-[11.5px] text-gl-foreground" style={{ opacity: ph(P, 0.758, 0.768) }}>
          <span className="grid h-4 w-4 place-items-center rounded-full bg-[var(--success)] text-[9px] text-gl-background">✓</span>
          Report sent to {PICKS.length} executives · read receipts on
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 07 · the Second Brain behind every answer                           */
/* ------------------------------------------------------------------ */

const CTX_COLORS = ["oklch(0.85 0.11 205)", "oklch(0.78 0.13 295)", "oklch(0.8 0.15 75)"];
const CONTEXTS = [
  {
    tag: "Semantic context",
    title: "What every number means",
    items: [
      ["Revenue", "1 definition · 14 entities"],
      ["Free cash flow", "gold.fct_cash · 16 sources"],
      ["Entity mapping", "4 charts of accounts → 1"],
    ],
  },
  {
    tag: "Business context",
    title: "How Meridian runs",
    items: [
      ["Month-end close", "in 9 days · owned by the CFO"],
      ["Covenant", "net leverage below 1.5x"],
      ["Policy", "6 critical roles protected"],
    ],
  },
  {
    tag: "Events context",
    title: "What is happening now",
    items: [
      ["Supplier slip", "Tier-1 · 3 plants · since Tue"],
      ["EUR hedge", "renewal due Friday"],
      ["Atlanta DC", "pick-wave approval pending"],
    ],
  },
] as const;
/** the orbs docked beside the Second Brain */
const DOCKED: { label: string; c: string; tint?: string }[] = [{ label: "Genius", c: CONTEXT }, ...MOVES.map((m) => ({ label: m.agent, c: m.color, tint: m.tint }))];

/** brain hubs lit per context (Systems, Tables, Metrics, Dashboards, Processes, Customers, Operations, Finance) */
const CTX_HUBS = [[1, 2, 3], [4, 6, 7], [0, 5]];

function SecondBrain({ P, motion, zoom }: { P: number; motion: boolean; zoom: number }) {
  const panorama = P >= 0.94;
  const t = ph(P, 0.785, 0.815);
  if (t <= 0.001) return null;
  const lit = CONTEXTS.map((_, i) => P >= 0.845 + i * 0.015);
  const visited = CTX_HUBS.flatMap((h, i) => (lit[i] ? h : []));
  return (
    <>
      <div className="absolute" style={{ left: BRAIN.x - BRAIN.size / 2, top: BRAIN.y - BRAIN.size / 2, width: BRAIN.size, height: BRAIN.size, opacity: t, transform: `scale(${r2(mix(0.9, 1, t))})` }}>
        <span className="pointer-events-none absolute -inset-20 rounded-full bg-[radial-gradient(closest-side,oklch(0.6_0.17_280/22%),transparent)] blur-2xl" />
        {motion ? (
          /* the sphere measures itself on screen; counter the camera so its canvas stays crisp and true to size at every zoom */
          <div className="absolute left-0 top-0 origin-top-left" style={{ width: BRAIN.size * zoom, height: BRAIN.size * zoom, transform: `scale(${r2(1 / zoom)})` }}>
            <BrainSphere tone="dark" clean={zoom < 0.55} state={{ visited, step: 1 }} />
          </div>
        ) : (
          <span className="absolute inset-[12%] rounded-full border border-[oklch(0.75_0.13_295/40%)] bg-[radial-gradient(circle_at_40%_35%,oklch(0.5_0.1_280/40%),transparent_70%)]" />
        )}
        <div className="absolute left-1/2 top-full mt-3 w-[340px] -translate-x-1/2 text-center">
          <p className="font-gl-display text-[20px] text-gl-foreground">Second Brain</p>
          <p className={`${mono} text-[10px] tracking-[0.16em] text-gl-muted-foreground`}>14 entities · 2.4M records · 3 contexts · governed</p>
        </div>
      </div>

      {/* the same intelligence that briefs and acts, docked on the brain */}
      {DOCKED.map((d, k) => {
        const on = ph(P, 0.8 + k * 0.008, 0.825 + k * 0.008);
        const synced = P >= 0.875 + k * 0.006;
        return (
          <div key={d.label} className="absolute" style={{ left: DOCK.x - DOCK.size / 2, top: dockY(k) - DOCK.size / 2, width: DOCK.size, height: DOCK.size, opacity: on, transform: `translateX(${r2((1 - on) * -16)}px)` }}>
            <span className="pointer-events-none absolute -inset-5 rounded-full blur-xl" style={{ background: `radial-gradient(closest-side, color-mix(in oklab, ${d.c} 30%, transparent), transparent)` }} />
            {motion && !panorama && on > 0.2 ? (
              <GeniusShaderOrb state={synced ? "holding" : "thinking"} size={DOCK.size} {...(d.tint ? { tint: d.tint } : {})} />
            ) : (
              <span className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle at 35% 30%, white, ${d.c} 45%, oklch(0.2 0.04 262) 80%)` }} />
            )}
            <div className="absolute right-full top-1/2 mr-4 -translate-y-1/2 whitespace-nowrap text-right">
              <p className="text-[14px] text-gl-foreground">{d.label}</p>
              <p className={`${mono} text-[9.5px] tracking-[0.12em]`} style={{ color: synced ? d.c : "var(--muted-foreground)" }}>
                {synced ? (k === 0 ? "◉ in sync" : "◉ tuned to context") : "connecting…"}
              </p>
            </div>
          </div>
        );
      })}

      {CONTEXTS.map((c, i) => {
        const on = ph(P, 0.838 + i * 0.015, 0.858 + i * 0.015);
        if (on <= 0.001) return null;
        const col = CTX_COLORS[i]!;
        return (
          <div key={c.tag} className="absolute" style={{ left: CTX.x, top: ctxY(i), width: CTX.w, height: CTX.h, opacity: on, transform: `translateX(${r2((1 - on) * 18)}px)` }}>
            <div className="relative h-full overflow-hidden rounded-[18px] border bg-[linear-gradient(165deg,oklch(0.24_0.045_262/96%),oklch(0.16_0.03_264/96%))] p-4" style={{ borderColor: `color-mix(in oklab, ${col} 40%, transparent)`, boxShadow: lit[i] ? `0 0 44px -16px ${col}` : "none" }}>
              <span className="absolute bottom-4 left-0 top-4 w-[3px] rounded-r-full" style={{ background: col }} />
              <div className="flex items-baseline justify-between">
                <p className={`${mono} text-[11px] tracking-[0.2em]`} style={{ color: col }}>
                  {c.tag}
                </p>
                <p className="text-[11px] text-gl-muted-foreground">{c.title}</p>
              </div>
              <div className="mt-3 space-y-1.5">
                {c.items.map(([k, v], n) => (
                  <div key={k} className="flex items-center justify-between rounded-lg bg-white/[0.035] px-3 py-2 text-[11.5px]" style={{ opacity: ph(on, 0.3 + n * 0.2, 0.7 + n * 0.1) }}>
                    <span className="text-gl-foreground/90">{k}</span>
                    <span className="font-gl-mono text-[10px] text-gl-muted-foreground">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}


/* ------------------------------------------------------------------ */
/* Small charts and layer visuals                                      */
/* ------------------------------------------------------------------ */

function MiniChart({ t }: { t: number }) {
  const X = (i: number) => 34 + (i / (REV.length - 1)) * 520;
  const RY = (v: number) => 150 - ((v - 90) / (142 - 90)) * 130;
  const GY = (v: number) => 150 - ((v - 35.6) / (39.4 - 35.6)) * 130;
  const rev = smoothPath(REV.map((v, i) => [X(i), RY(v)] as const));
  const gm = smoothPath(GM.map((v, i) => [X(i), GY(v)] as const));
  return (
    <svg viewBox="0 0 570 168" className="block w-full" aria-hidden="true">
      <defs>
        <linearGradient id="fcArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--data)" stopOpacity="0.32" />
          <stop offset="1" stopColor="var(--data)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[100, 120, 140].map((v) => (
        <g key={v}>
          <line x1="34" x2="554" y1={RY(v)} y2={RY(v)} stroke="oklch(1 0 0 / 6%)" />
          <text x="28" y={RY(v) + 3} textAnchor="end" fontSize="9" className="font-gl-mono" fill="var(--muted-foreground)">${v}M</text>
        </g>
      ))}
      <path d={`${rev} L 554 150 L 34 150 Z`} fill="url(#fcArea)" opacity={ph(t, 0.6, 1)} />
      <path d={gm} fill="none" stroke="var(--gold)" strokeWidth="1.6" pathLength={1} strokeDasharray="1" strokeDashoffset={r2(1 - ph(t, 0.15, 1))} />
      <path d={rev} fill="none" stroke="var(--data)" strokeWidth="2.2" pathLength={1} strokeDasharray="1" strokeDashoffset={r2(1 - ph(t, 0, 0.85))} />
      {["JAN", "MAR", "MAY", "JUL", "SEP", "NOV"].map((m, i) => (
        <text key={m} x={X(i * 2)} y="165" textAnchor="middle" fontSize="8.5" className="font-gl-mono" fill="var(--muted-foreground)" opacity="0.7">{m}</text>
      ))}
    </svg>
  );
}

function MiniBridge({ t }: { t: number }) {
  const bars = [
    { k: "Budget", from: 93, to: 100.6, c: "oklch(0.7 0.17 252 / 55%)", l: "$100.6M" },
    { k: "Inventory", from: 98, to: 100.6, c: "var(--gold)", l: "−2.6" },
    { k: "Receivables", from: 96.1, to: 98, c: "var(--gold)", l: "−1.9" },
    { k: "Capex", from: 96.1, to: 96.4, c: OK, l: "+0.3" },
    { k: "Actual", from: 93, to: 96.4, c: "var(--data)", l: "$96.4M" },
  ];
  const y = (v: number) => 128 - ((v - 93) / (101.5 - 93)) * 110;
  return (
    <svg viewBox="0 0 330 168" className="block w-full" aria-hidden="true">
      {bars.map((b, i) => {
        const s = ph(t, i * 0.12, 0.5 + i * 0.12);
        const top = y(b.to);
        const h = Math.max(2, y(b.from) - top);
        return (
          <g key={b.k}>
            <rect x={14 + i * 64} y={r2(top + h * (1 - s))} width="40" height={r2(h * s)} rx="3" fill={b.c} />
            <text x={34 + i * 64} y={top - 6} textAnchor="middle" fontSize="10" className="font-gl-mono" fill="var(--foreground)" opacity={s}>{b.l}</text>
            <text x={34 + i * 64} y="148" textAnchor="middle" fontSize="9" fill="var(--muted-foreground)">{b.k}</text>
          </g>
        );
      })}
    </svg>
  );
}

function LayerViz({ i, on }: { i: number; on: number }) {
  if (i === 0)
    return (
      <div className="flex h-full flex-col justify-center gap-1.5">
        {RAW_CHIPS.map((row, r) => (
          <div key={r} className="flex gap-1.5 whitespace-nowrap" style={{ transform: `translateX(${r2(-40 * on + (r % 2) * 14)}px)` }}>
            {row.slice(0, 6).map((c, k) => (
              <span key={k} className="rounded-[5px] border px-1.5 py-[1px] font-gl-mono text-[10px]" style={{ borderColor: `color-mix(in oklab, ${ENTITIES[r]!.hue} 35%, transparent)`, color: `color-mix(in oklab, ${ENTITIES[r]!.hue} 75%, white)` }}>
                {c}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  if (i === 3)
    return (
      <div className="grid h-full grid-cols-2 content-center gap-2">
        {GOLD_KPIS.map((k) => (
          <div key={k.k} className="rounded-[10px] border border-[oklch(0.8_0.15_75/35%)] bg-[oklch(0.8_0.15_75/9%)] px-2.5 py-1.5">
            <p className="text-[10.5px] text-gl-foreground/80">{k.k}</p>
            <p className="font-gl-display text-[16px] tabular-nums" style={{ color: GOLD }}>{k.v}</p>
          </div>
        ))}
      </div>
    );
  const rows = i === 1 ? BRONZE_ROWS : SILVER_ROWS;
  const accent = LAYERS[i]!.accent;
  return (
    <div className="flex h-full flex-col justify-center font-gl-mono text-[10.5px]">
      {rows.map((r, n) => (
        <div key={n} className="grid grid-cols-[34px_86px_74px_36px] gap-2 border-b border-white/[0.05] py-[5px] text-gl-foreground/85">
          <span>{r[0]}</span>
          <span>{r[1]}</span>
          <span className="text-right tabular-nums">{r[2]}</span>
          <span style={{ color: accent }}>{r[3]}</span>
        </div>
      ))}
      {i === 2 ? <p className="mt-1.5 text-[9.5px] text-gl-muted-foreground">FX → USD · 4 charts of accounts → 1 · 18.2M dupes out</p> : null}
    </div>
  );
}

