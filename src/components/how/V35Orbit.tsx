"use client";

import { BriefCard, CARD_H, CARD_W, DashCard } from "./StageCards";
import { AGENTS, ENTITIES, FitCanvas, HUB_LAYERS, HowSection, SOURCES, mix, phase, r2 } from "./shared";

const VW = 1200;
const VH = 800;
const CX = 600;
const CY = 400;

type Chip = { sys: string; cat: string; ring: number; angle: number; entity: number; slot: number };

// every system, placed on one of three orbits, and assigned to an entity cluster
const CHIPS: Chip[] = (() => {
  const all = SOURCES.flatMap((r) => r.systems.map((sys) => ({ sys, cat: r.cat })));
  const counts = [0, 0, 0, 0];
  const owner = (sys: string) => ENTITIES.findIndex((e) => (e.stack as readonly string[]).includes(sys));
  const chips = all.map((c, k) => {
    let entity = owner(c.sys);
    if (entity < 0) entity = counts.indexOf(Math.min(...counts));
    const slot = counts[entity]!++;
    return { ...c, ring: k % 3, angle: (k * 137.5) % 360, entity, slot };
  });
  return chips;
})();

const RINGS = [190, 280, 370];
const CLUSTERS = [
  { x: 270, y: 220 },
  { x: 930, y: 220 },
  { x: 270, y: 590 },
  { x: 930, y: 590 },
];

const orbitPos = (c: Chip, spin: number) => {
  const a = ((c.angle + spin * (c.ring % 2 ? -1 : 1)) * Math.PI) / 180;
  const r = RINGS[c.ring]!;
  return { x: CX + Math.cos(a) * r * 1.35, y: CY + Math.sin(a) * r * 0.62 };
};
const clusterPos = (c: Chip) => {
  const cl = CLUSTERS[c.entity]!;
  const col = c.slot % 3;
  const row = Math.floor(c.slot / 3);
  return { x: cl.x - 84 + col * 84, y: cl.y + 10 + row * 40 };
};

function Orbit({ p }: { p: number }) {
  const spin = p * 140;
  const toCluster = phase(p, 0.1, 0.2);
  const toCore = phase(p, 0.3, 0.4);
  const backOut = phase(p, 0.88, 0.97);
  const rings = HUB_LAYERS.map((_, k) => phase(p, 0.36 + k * 0.03, 0.39 + k * 0.03));
  const sem = phase(p, 0.46, 0.5);
  const dashIn = phase(p, 0.5, 0.58);
  const dashSide = phase(p, 0.67, 0.73);
  const briefIn = phase(p, 0.69, 0.75);
  const merge = phase(p, 0.83, 0.88);
  const agents = AGENTS.map((_, i) => phase(p, 0.86 + i * 0.012, 0.9 + i * 0.012));
  const loop = phase(p, 0.92, 0.99);
  const coreR = mix(34, 60, toCore) + 14 * merge;

  return (
    <div className="absolute inset-0">
      <svg className="absolute inset-0 overflow-visible" width={VW} height={VH} aria-hidden="true">
        <defs>
          <radialGradient id="coreGlow">
            <stop offset="0" stopColor="var(--gold)" stopOpacity="0.9" />
            <stop offset="0.35" stopColor="var(--data)" stopOpacity="0.45" />
            <stop offset="1" stopColor="var(--data)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* orbits */}
        {RINGS.map((r) => (
          <ellipse key={r} cx={CX} cy={CY} rx={r * 1.35} ry={r * 0.62} fill="none" stroke="oklch(1 0 0 / 8%)" strokeDasharray="3 7" opacity={mix(1, 0.3, toCluster) + backOut * 0.7} />
        ))}
        {/* entity → core feeds */}
        {CLUSTERS.map((c, i) => (
          <path
            key={i}
            d={`M ${c.x} ${c.y + 30} Q ${(c.x + CX) / 2} ${(c.y + CY) / 2 - 60}, ${CX} ${CY}`}
            fill="none"
            stroke="var(--data)"
            strokeWidth="1.5"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - phase(p, 0.24, 0.32)}
            opacity={(1 - toCore) * 0.8}
          />
        ))}
        {/* hub rings around the core */}
        {HUB_LAYERS.map((l, k) => (
          <g key={l.tag} opacity={rings[k]! * (1 - dashIn * 0.75)}>
            <circle cx={CX} cy={CY} r={r2(mix(40, 90 + k * 52, rings[k]!))} fill="none" stroke={l.color} strokeWidth="1.6" strokeOpacity="0.85" />
            <text x={CX} y={r2(CY - mix(40, 90 + k * 52, rings[k]!) - 6)} textAnchor="middle" className="font-gl-mono" fontSize="10" letterSpacing="2" fill={l.color}>
              {l.tag}
            </text>
          </g>
        ))}
        <circle cx={CX} cy={CY} r={r2(coreR * 3)} fill="url(#coreGlow)" opacity={0.5 + sem * 0.5} />
        {/* agent beams */}
        {AGENTS.map((a, i) => {
          const ang = (-90 + i * 72) * (Math.PI / 180);
          const ax = CX + Math.cos(ang) * 400;
          const ay = CY + Math.sin(ang) * 270;
          return (
            <g key={a.name}>
              <line x1={CX} y1={CY} x2={r2(mix(CX, ax, agents[i]!))} y2={r2(mix(CY, ay, agents[i]!))} stroke="var(--gold)" strokeWidth="1.6" opacity={agents[i]} />
              {agents[i]! > 0.98 ? (
                <circle r="3" fill="var(--gold)">
                  <animateMotion dur="1.8s" repeatCount="indefinite" path={`M ${CX} ${CY} L ${r2(ax)} ${r2(ay)}`} />
                </circle>
              ) : null}
            </g>
          );
        })}
        {/* write-back arcs to the systems on the outer orbit */}
        {AGENTS.flatMap((ag, i) => {
          const ang = (-90 + i * 72) * (Math.PI / 180);
          const from = { x: CX + Math.cos(ang) * 400, y: CY + Math.sin(ang) * 270 };
          const nearest = CHIPS.map((c) => ({ c, pos: orbitPos(c, spin) }))
            .filter(({ c }) => c.ring === 2)
            .sort((a, b) => Math.hypot(a.pos.x - from.x, a.pos.y - from.y) - Math.hypot(b.pos.x - from.x, b.pos.y - from.y))
            .slice(0, 2);
          return nearest.map(({ c, pos: to }) => (
            <path
              key={`${ag.name}-${c.sys}`}
              d={`M ${r2(from.x)} ${r2(from.y)} Q ${r2((from.x + to.x) / 2 + 40)} ${r2((from.y + to.y) / 2 - 40)}, ${r2(to.x)} ${r2(to.y)}`}
              fill="none"
              stroke="var(--success)"
              strokeWidth="1.2"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - loop}
              opacity={0.7}
            />
          ));
        })}
      </svg>

      {/* entity labels */}
      {ENTITIES.map((e, i) => {
        const c = CLUSTERS[i]!;
        const o = toCluster * (1 - toCore);
        return (
          <div key={e.name} className="absolute w-[270px] -translate-x-1/2 rounded-2xl border border-gl-foreground/12 bg-[oklch(0.19_0.04_262/80%)]" style={{ left: c.x, top: c.y - 52, height: 150, opacity: o }}>
            <div className="flex items-center justify-between px-4 pt-3">
              <span className="text-[0.78rem] text-gl-foreground">{e.name}</span>
              <span className="font-gl-mono text-[0.7rem] text-gl-gold">{e.metric}</span>
            </div>
          </div>
        );
      })}

      {/* chips — the same objects through every stage */}
      {CHIPS.map((c) => {
        const o = orbitPos(c, spin);
        const k = clusterPos(c);
        let x = mix(o.x, k.x, toCluster);
        let y = mix(o.y, k.y, toCluster);
        x = mix(x, CX, toCore);
        y = mix(y, CY, toCore);
        x = mix(x, o.x, backOut);
        y = mix(y, o.y, backOut);
        const scale = mix(1, 0.2, toCore) * (1 - backOut) + backOut * 0.9;
        const opacity = Math.max(1 - toCore, backOut * 0.55);
        return (
          <span
            key={c.sys}
            className="absolute grid h-[30px] w-[76px] place-items-center rounded-lg border border-gl-data/30 bg-[oklch(0.2_0.05_258/90%)] text-[0.6rem] text-gl-foreground/85 shadow-[0_6px_20px_-8px_rgb(0_0_0/0.7)]"
            style={{ transform: `translate(${r2(x - 38)}px, ${r2(y - 15)}px) scale(${r2(scale)})`, opacity: r2(opacity) }}
          >
            {c.sys}
          </span>
        );
      })}

      {/* the core */}
      <div
        className="absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gl-gold/50 bg-[radial-gradient(circle,oklch(0.3_0.08_70),oklch(0.16_0.04_262))] shadow-[0_0_60px_-10px_var(--gold)]"
        style={{ left: CX, top: CY, width: coreR * 2, height: coreR * 2, opacity: 1 - dashIn * (1 - merge) }}
      >
        <span className="font-gl-mono text-[0.55rem] uppercase tracking-[0.16em] text-gl-gold">Genius</span>
      </div>

      {/* dashboard rises out of the core */}
      <div
        className="absolute"
        style={{
          left: mix(CX, 380, dashSide) - CARD_W / 2,
          top: CY - CARD_H / 2,
          width: CARD_W,
          height: CARD_H,
          opacity: dashIn * (1 - merge),
          transform: `scale(${r2(mix(0.15, 1, dashIn) * mix(1, 0.82, dashSide) * mix(1, 0.1, merge))})`,
        }}
      >
        <DashCard t={phase(p, 0.52, 0.64)} />
      </div>
      <div
        className="absolute"
        style={{
          left: mix(CX, 860, briefIn) - CARD_W / 2,
          top: CY - CARD_H / 2,
          width: CARD_W,
          height: CARD_H,
          opacity: briefIn * (1 - merge),
          transform: `scale(${r2(mix(0.6, 0.82, briefIn) * mix(1, 0.1, merge))})`,
        }}
      >
        <BriefCard t={phase(p, 0.73, 0.82)} />
      </div>

      {/* agents on the outer ring */}
      {AGENTS.map((a, i) => {
        const ang = (-90 + i * 72) * (Math.PI / 180);
        const ax = CX + Math.cos(ang) * 400;
        const ay = CY + Math.sin(ang) * 270;
        return (
          <div
            key={a.name}
            className="absolute w-[200px] rounded-xl border border-gl-gold/40 bg-[oklch(0.2_0.045_262/95%)] px-3 py-2"
            style={{ left: r2(ax - 100), top: r2(ay - 30), opacity: agents[i], transform: `scale(${r2(mix(0.6, 1, agents[i]!))})` }}
          >
            <p className="text-[0.72rem] text-gl-foreground">{a.name}</p>
            <div className="flex justify-between font-gl-mono text-[0.56rem]">
              <span className="text-gl-muted-foreground">{a.out}</span>
              <span className="text-[var(--success)]">{a.gain}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** V35 — the same 24 systems travel through the whole story around one core. */
export function V35Orbit() {
  return (
    <HowSection
      heightVh={680}
      visual={(p) => (
        <FitCanvas w={VW} h={VH}>
          <Orbit p={p} />
        </FitCanvas>
      )}
    />
  );
}
