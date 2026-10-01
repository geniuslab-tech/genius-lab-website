"use client";

import { AGENTS, BRIEF, ENTITIES, FitCanvas, HUB_LAYERS, HowSection, KPIS, SOURCES, clamp, mix, phase, r2, stageAt } from "./shared";

const VW = 1200;
const VH = 800;
const N = 24;

type Col = [number, number, number];
type Tile = { x: number; y: number; w: number; h: number; rot: number; c: Col; a: number };

const C = {
  data: [0.7, 0.17, 252] as Col,
  cyan: [0.85, 0.11, 205] as Col,
  gold: [0.8, 0.14, 75] as Col,
  success: [0.78, 0.13, 168] as Col,
  silver: [0.84, 0.02, 254] as Col,
  bronze: [0.72, 0.11, 62] as Col,
  raw: [0.88, 0.012, 250] as Col,
};
const CAT_HUES: Col[] = [C.data, C.cyan, [0.72, 0.15, 300], [0.75, 0.13, 30], [0.78, 0.13, 140], [0.7, 0.12, 220]];
const SYS = SOURCES.flatMap((r) => r.systems);
const jit = (i: number, s: number) => {
  const v = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
  return Math.round((v - Math.floor(v) - 0.5) * 1000) / 1000;
};

/** each system's entity (its owner's stack first, the rest shared out evenly) and slot in that cluster */
const ASSIGN = (() => {
  const counts = [0, 0, 0, 0];
  return SYS.map((sys) => {
    let e = ENTITIES.findIndex((en) => (en.stack as readonly string[]).includes(sys));
    if (e < 0) e = counts.indexOf(Math.min(...counts));
    return { e, slot: counts[e]!++ };
  });
})();

/* six formations of the same 24 tiles */
const F: Tile[][] = [
  // 01 fragmented: scattered, every category its own colour
  Array.from({ length: N }, (_, i) => {
    const row = Math.floor(i / 4);
    const k = i % 4;
    return { x: 150 + k * 230 + jit(i, 1) * 70, y: 90 + row * 104 + jit(i, 2) * 30, w: 130, h: 46, rot: jit(i, 3) * 14, c: CAT_HUES[row]!, a: 1 };
  }),
  // 02 entities: four clusters, six systems each
  Array.from({ length: N }, (_, i) => {
    const { e, slot } = ASSIGN[i]!;
    const bx = 120 + (e % 2) * 500;
    const by = 150 + Math.floor(e / 2) * 300;
    return { x: bx + (slot % 2) * 220, y: by + Math.floor(slot / 2) * 58, w: 200, h: 44, rot: 0, c: C.data, a: 0.9 };
  }),
  // 03 harmonized: four lanes inside the hub
  Array.from({ length: N }, (_, i) => {
    const lane = Math.floor(i / 6);
    const k = i % 6;
    const col = [C.raw, C.bronze, C.silver, C.gold][lane]!;
    return { x: 260 + k * 128, y: 150 + lane * 112, w: 112, h: 52, rot: 0, c: col, a: 1 };
  }),
  // 04 decide: KPI tiles, a bar chart and table rows
  Array.from({ length: N }, (_, i) => {
    if (i < 4) return { x: 120 + i * 245, y: 120, w: 225, h: 110, rot: 0, c: i === 3 ? C.gold : C.data, a: 1 };
    if (i < 16) {
      const k = i - 4;
      const hh = [90, 110, 104, 130, 150, 140, 170, 190, 182, 214, 236, 260][k]!;
      return { x: 120 + k * 52, y: 660 - hh, w: 38, h: hh, rot: 0, c: C.data, a: 0.9 };
    }
    const k = i - 16;
    return { x: 780, y: 290 + k * 46, w: 300, h: 34, rot: 0, c: C.silver, a: 0.7 };
  }),
  // 05 brief: the tiles tile together into three sentence cards
  Array.from({ length: N }, (_, i) => {
    const para = Math.floor(i / 8);
    const k = i % 8;
    return { x: 290 + (k % 4) * 168, y: 186 + para * 152 + Math.floor(k / 4) * 58, w: 166, h: 56, rot: 0, c: [C.data, C.gold, C.raw][para]!, a: 0.5 };
  }),
  // 06 act: five agents and the actions they write back
  Array.from({ length: N }, (_, i) => {
    if (i < 5) return { x: 140, y: 150 + i * 104, w: 420, h: 80, rot: 0, c: C.gold, a: 1 };
    const k = i - 5;
    const lane = k % 5;
    const step = Math.floor(k / 5);
    return { x: 640 + step * 110, y: 172 + lane * 104, w: 90, h: 36, rot: 0, c: C.success, a: 0.9 };
  }),
];

function lerpTile(a: Tile, b: Tile, t: number): Tile {
  let dh = b.c[2] - a.c[2];
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;
  return {
    x: mix(a.x, b.x, t),
    y: mix(a.y, b.y, t),
    w: mix(a.w, b.w, t),
    h: mix(a.h, b.h, t),
    rot: mix(a.rot, b.rot, t),
    c: [mix(a.c[0], b.c[0], t), mix(a.c[1], b.c[1], t), (a.c[2] + dh * t + 360) % 360],
    a: mix(a.a, b.a, t),
  };
}

/** formation index as a float: hold each formation, then morph into the next */
function formation(p: number) {
  const { i, t } = stageAt(p);
  return i < 5 ? i + phase(t, 0.62, 1) : 5;
}

const near = (ff: number, k: number) => clamp(1 - Math.abs(ff - k) * 2.2);
const oklch = (c: Col, a: number) => `oklch(${r2(c[0])} ${r2(c[1])} ${r2(c[2])} / ${r2(a)})`;

function Morph({ p }: { p: number }) {
  const ff = formation(p);
  const lo = Math.floor(ff);
  const hi = Math.min(5, lo + 1);
  // stagger: each tile leaves a touch later than the one before
  const tiles = Array.from({ length: N }, (_, i) => {
    const local = clamp((ff - lo) * 1.35 - (i / N) * 0.35);
    return lerpTile(F[lo]![i]!, F[hi]![i]!, phase(local, 0, 1));
  });
  const briefChars = BRIEF.reduce((a, b) => a + b.t.length, 0);
  const typed = Math.round(phase(p, 0.7, 0.8) * briefChars);
  const starts = BRIEF.map((_, i) => BRIEF.slice(0, i).reduce((a, b) => a + b.t.length, 0));

  return (
    <div className="absolute inset-0">
      {/* formation frames */}
      <div className="absolute rounded-[28px] border border-gl-data/30" style={{ left: 230, top: 110, width: 790, height: 470, opacity: near(ff, 2) }}>
        <p className="absolute left-6 top-4 font-gl-mono text-[0.62rem] uppercase tracking-[0.2em] text-gl-data">Genius Lab data hub</p>
      </div>
      <div className="absolute grid place-items-center rounded-2xl border border-gl-gold/60 bg-[radial-gradient(ellipse_at_center,oklch(0.77_0.155_66/18%),transparent_75%)]" style={{ left: 260, top: 610, width: 730, height: 70, opacity: near(ff, 2) * phase(p, 0.44, 0.5) }}>
        <span className="font-gl-mono text-[0.7rem] uppercase tracking-[0.22em] text-gl-gold">Semantic layer · one definition of every KPI</span>
      </div>
      {HUB_LAYERS.map((l, k) => (
        <span key={l.tag} className="absolute font-gl-mono text-[0.62rem] tracking-[0.2em]" style={{ left: 1036, top: 168 + k * 112, color: l.color, opacity: near(ff, 2) }}>
          {l.tag}
        </span>
      ))}
      {ENTITIES.map((e, i) => (
        <div key={e.name} className="absolute rounded-[22px] border border-gl-foreground/12 bg-gl-foreground/[0.025]" style={{ left: 100 + (i % 2) * 500, top: 96 + Math.floor(i / 2) * 300, width: 460, height: 250, opacity: near(ff, 1) }}>
          <div className="flex items-center justify-between px-5 pt-4">
            <span className="font-gl-display text-[1rem] text-gl-foreground">{e.name}</span>
            <span className="font-gl-mono text-[0.8rem] text-gl-gold">{e.metric}</span>
          </div>
        </div>
      ))}
      <div className="absolute rounded-[26px] border border-gl-foreground/10" style={{ left: 96, top: 90, width: 1010, height: 600, opacity: near(ff, 3) }}>
        <p className="absolute left-6 top-[-28px] font-gl-mono text-[0.62rem] uppercase tracking-[0.2em] text-gl-muted-foreground">Executive operating system</p>
      </div>
      <div className="absolute rounded-[26px] border border-gl-gold/35 bg-gl-gold/[0.03]" style={{ left: 260, top: 120, width: 732, height: 560, opacity: near(ff, 4) }}>
        <p className="absolute left-8 top-6 font-gl-mono text-[0.62rem] uppercase tracking-[0.2em] text-gl-gold">Morning briefing · 06:12</p>
      </div>

      {/* the 24 tiles */}
      {tiles.map((t, i) => (
        <div
          key={i}
          className="absolute overflow-hidden rounded-[10px] border"
          style={{
            left: 0,
            top: 0,
            width: r2(t.w),
            height: r2(t.h),
            transform: `translate(${r2(t.x)}px, ${r2(t.y)}px) rotate(${r2(t.rot)}deg)`,
            background: oklch(t.c, 0.16 * t.a),
            borderColor: oklch(t.c, 0.55 * t.a),
            boxShadow: `0 10px 30px -14px ${oklch(t.c, 0.6)}`,
          }}
        >
          <span className="grid h-full place-items-center px-2 text-center text-[0.7rem] text-gl-foreground/85" style={{ opacity: Math.max(near(ff, 0), near(ff, 1)) }}>
            {SYS[i]}
          </span>
        </div>
      ))}

      {/* content that the tiles turn into */}
      {KPIS.map((k, i) => (
        <div key={k.k} className="absolute px-4 py-3" style={{ left: 120 + i * 245, top: 120, width: 225, opacity: near(ff, 3) }}>
          <p className="text-[0.6rem] uppercase tracking-[0.12em] text-gl-muted-foreground">{k.k}</p>
          <p className="mt-1 font-gl-display text-[1.6rem] tabular-nums tracking-tight text-gl-foreground">{k.f(k.v * near(ff, 3))}</p>
          <p className={`text-[0.66rem] ${i === 3 ? "text-gl-gold" : "text-gl-data"}`}>{k.d}</p>
        </div>
      ))}
      {["Revenue by entity", "Margin bridge", "Cash conversion", "Working capital", "Headcount", "Capex", "Close status", "Risk register"].map((r, k) => (
        <span key={r} className="absolute flex items-center px-3 text-[0.68rem] text-gl-foreground/80" style={{ left: 780, top: 290 + k * 46, height: 34, opacity: near(ff, 3) }}>
          {r}
        </span>
      ))}
      <div className="absolute" style={{ left: 290, top: 186, width: 672, opacity: near(ff, 4) }}>
        {BRIEF.map((b, i) => (
          <p key={b.t} className="flex h-[114px] items-center px-7 font-gl-display text-[1.3rem] leading-snug text-gl-foreground" style={{ marginBottom: i < 2 ? 38 : 0 }}>
            <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ background: b.tone === "gold" ? "var(--gold)" : b.tone === "data" ? "var(--data)" : "var(--foreground)" }} />
            {b.t.slice(0, clamp(typed - starts[i]!, 0, b.t.length))}
          </p>
        ))}
      </div>
      {AGENTS.map((a, i) => (
        <div key={a.name} className="absolute flex items-center gap-3 px-5" style={{ left: 140, top: 150 + i * 104, width: 420, height: 80, opacity: near(ff, 5) }}>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gl-gold/15 font-gl-mono text-[0.6rem] text-gl-gold">AI</span>
          <div className="flex-1">
            <p className="text-[0.9rem] text-gl-foreground">{a.name}</p>
            <p className="font-gl-mono text-[0.6rem] text-gl-muted-foreground">{a.out}</p>
          </div>
          <span className="font-gl-mono text-[0.7rem] text-[var(--success)]">{a.gain}</span>
        </div>
      ))}
      <p className="absolute font-gl-mono text-[0.62rem] uppercase tracking-[0.2em] text-[var(--success)]" style={{ left: 640, top: 110, opacity: near(ff, 5) }}>
        Written back to the systems of record →
      </p>
    </div>
  );
}

/** V37 — one set of 24 data tiles becomes every stage of the story. */
export function V37Morph() {
  return (
    <HowSection
      heightVh={720}
      accent="gold"
      visual={(p) => (
        <FitCanvas w={VW} h={VH}>
          <Morph p={p} />
        </FitCanvas>
      )}
    />
  );
}
