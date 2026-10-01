"use client";

import { AGENTS, BRIEF, ENTITIES, FitCanvas, HUB_LAYERS, HowSection, KPIS, SOURCES, clamp, keyframes, mix, phase, r2 } from "./shared";

/* world coordinates */
const VW = 1200;
const VH = 800;
const W = 3100;

const SRC = { x: 60, chipX: 150, chipW: 66, chipGap: 8, rowY: (i: number) => 96 + i * 104, rowH: 76 };
const ENT = { x: 640, w: 330, h: 150, y: (i: number) => 64 + i * 172 };
const HUB = { x: 1160, y: 60, w: 360, h: 690 };
const LANE_Y = [86, 214, 330, 446];
const LANE_H = 96;
const SEM = { y: 578, h: 140 };
const DASH = { x: 1900, y: 140, w: 660, h: 520 };
const BRF = { x: 1924, y: 432, w: 300, h: 210 };
const AG = { x: 2700, y: (i: number) => 134 + i * 108, w: 360, h: 86 };

const chipCenter = (sys: string) => {
  for (let i = 0; i < SOURCES.length; i++) {
    const k = (SOURCES[i]!.systems as readonly string[]).indexOf(sys);
    if (k >= 0) return { x: SRC.chipX + k * (SRC.chipW + SRC.chipGap) + SRC.chipW, y: SRC.rowY(i) + SRC.rowH / 2 };
  }
  return { x: 0, y: 0 };
};
const curve = (x1: number, y1: number, x2: number, y2: number, bend = 0.5) => {
  const dx = (x2 - x1) * bend;
  return `M ${r2(x1)} ${r2(y1)} C ${r2(x1 + dx)} ${r2(y1)}, ${r2(x2 - dx)} ${r2(y2)}, ${r2(x2)} ${r2(y2)}`;
};

/** A drawn connector with packets that flow once it is fully drawn. */
function Pipe({ d, draw, color = "var(--data)", width = 1.4, packets = 2, dur = 2.6, glow = false }: { d: string; draw: number; color?: string; width?: number; packets?: number; dur?: number; glow?: boolean }) {
  return (
    <g>
      {glow ? <path d={d} fill="none" stroke={color} strokeWidth={width * 5} strokeOpacity={0.12 * draw} /> : null}
      <path d={d} fill="none" stroke={color} strokeOpacity={0.18 + 0.5 * draw} strokeWidth={width} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
      {draw > 0.98
        ? Array.from({ length: packets }, (_, k) => (
            <circle key={k} r={width + 1.4} fill={color}>
              <animateMotion dur={`${dur}s`} begin={`${(k * dur) / packets}s`} repeatCount="indefinite" path={d} />
            </circle>
          ))
        : null}
    </g>
  );
}

function World({ p }: { p: number }) {
  const cx = keyframes(p, [
    { at: 0, v: 470 }, { at: 0.12, v: 470 }, { at: 0.2, v: 800 }, { at: 0.3, v: 800 }, { at: 0.38, v: 1340 }, { at: 0.48, v: 1450 },
    { at: 0.56, v: 2230 }, { at: 0.64, v: 2230 }, { at: 0.71, v: BRF.x + BRF.w / 2 }, { at: 0.8, v: BRF.x + BRF.w / 2 },
    { at: 0.88, v: 2680 }, { at: 0.93, v: 2680 }, { at: 0.99, v: W / 2 },
  ]);
  const cy = keyframes(p, [
    { at: 0, v: 420 }, { at: 0.64, v: 400 }, { at: 0.71, v: BRF.y + BRF.h / 2 }, { at: 0.8, v: BRF.y + BRF.h / 2 }, { at: 0.88, v: 420 }, { at: 0.99, v: 405 },
  ]);
  const s = keyframes(p, [
    { at: 0, v: 1.2 }, { at: 0.12, v: 1.2 }, { at: 0.2, v: 1 }, { at: 0.3, v: 1 }, { at: 0.38, v: 1.05 }, { at: 0.48, v: 1.05 },
    { at: 0.56, v: 1.12 }, { at: 0.64, v: 1.12 }, { at: 0.71, v: 2.6 }, { at: 0.8, v: 2.6 }, { at: 0.88, v: 1.05 }, { at: 0.93, v: 1.05 }, { at: 0.99, v: 0.37 },
  ]);

  const entLinks = phase(p, 0.13, 0.25);
  const entCards = phase(p, 0.14, 0.24);
  const hubLinks = phase(p, 0.29, 0.37);
  const layer = (k: number) => phase(p, 0.34 + k * 0.035, 0.37 + k * 0.035);
  const sem = phase(p, 0.47, 0.5);
  const capIdx = p >= 0.34 && p < 0.5 ? Math.min(3, Math.floor(((p - 0.34) / 0.16) * 4)) : -1;
  const dashPipe = phase(p, 0.5, 0.56);
  const dash = phase(p, 0.53, 0.63);
  const brief = phase(p, 0.71, 0.8);
  const agPipe = phase(p, 0.8, 0.86);
  const ag = (i: number) => phase(p, 0.84 + i * 0.012, 0.88 + i * 0.012);
  const loop = phase(p, 0.92, 0.985);
  const finale = phase(p, 0.93, 0.99);

  const focus = (a: number, b: number) => (p >= a && p < b ? 1 : mix(0.38, 1, finale));
  const fSrc = focus(0, 0.3);
  const fEnt = focus(0.13, 0.4);
  const fHub = focus(0.29, 0.58);
  const fDash = focus(0.5, 0.86);
  const fAg = focus(0.8, 1.01);

  const briefChars = BRIEF.reduce((a, b) => a + b.t.length, 0);
  const typed = Math.round(brief * briefChars);
  const starts = BRIEF.map((_, i) => BRIEF.slice(0, i).reduce((a, b) => a + b.t.length, 0));

  const loopPath = `M ${AG.x + AG.w} ${AG.y(0) + 20} C ${AG.x + AG.w + 160} ${AG.y(0) - 140}, ${AG.x + AG.w - 200} -40, ${W / 2} -30 S ${SRC.x + 120} -20, ${SRC.x + 160} ${SRC.rowY(0) - 6}`;

  return (
    <div
      className="absolute left-0 top-0 origin-top-left"
      style={{ width: W, height: VH, transform: `translate(${r2(VW / 2 - cx * s)}px, ${r2(VH / 2 - cy * s)}px) scale(${r2(s * 1000) / 1000})` }}
    >
      {/* connectors */}
      <svg className="absolute inset-0 overflow-visible" width={W} height={VH} aria-hidden="true">
        {ENTITIES.flatMap((e, i) =>
          e.stack.map((sys, k) => {
            const a = chipCenter(sys);
            return <Pipe key={`${e.name}-${sys}`} d={curve(a.x, a.y, ENT.x, ENT.y(i) + 40 + k * 22)} draw={entLinks} packets={1} dur={3 + k * 0.4} width={1} />;
          }),
        )}
        {ENTITIES.map((e, i) => (
          <Pipe key={`h-${e.name}`} d={curve(ENT.x + ENT.w, ENT.y(i) + ENT.h / 2, HUB.x, LANE_Y[0]! + 26 + i * 14)} draw={hubLinks} packets={2} />
        ))}
        <Pipe d={curve(HUB.x + HUB.w, SEM.y + SEM.h / 2, DASH.x, DASH.y + 120)} draw={dashPipe} color="var(--gold)" width={2} packets={3} glow />
        {AGENTS.map((a, i) => (
          <Pipe key={a.name} d={curve(BRF.x + BRF.w, BRF.y + BRF.h / 2, AG.x, AG.y(i) + AG.h / 2)} draw={agPipe} color="var(--gold)" width={1.4} packets={1} dur={2.2 + i * 0.3} />
        ))}
        <Pipe d={loopPath} draw={loop} color="var(--success)" width={2.4} packets={4} dur={5} glow />
      </svg>

      {/* 01 sources */}
      <div className="absolute" style={{ left: SRC.x, top: SRC.rowY(0) - 44, opacity: fSrc }}>
        <p className="font-gl-mono text-[0.7rem] uppercase tracking-[0.2em] text-gl-muted-foreground">Systems of record</p>
      </div>
      {SOURCES.map((row, i) => (
        <div
          key={row.cat}
          className="absolute flex items-center rounded-2xl border border-gl-foreground/10 bg-[oklch(0.19_0.035_262/85%)] pl-4"
          style={{ left: SRC.x, top: SRC.rowY(i), width: SRC.chipX - SRC.x + 4 * (SRC.chipW + SRC.chipGap) + 8, height: SRC.rowH, opacity: fSrc }}
        >
          <span className="w-[74px] font-gl-mono text-[0.68rem] tracking-[0.16em] text-gl-data">{row.cat}</span>
          <div className="flex gap-2">
            {row.systems.map((sys) => {
              const used = ENTITIES.some((e) => (e.stack as readonly string[]).includes(sys));
              return (
                <span
                  key={sys}
                  className="grid h-[52px] place-items-center rounded-xl border text-center text-[0.62rem] leading-tight transition-colors"
                  style={{
                    width: SRC.chipW,
                    borderColor: used && entLinks > 0.5 ? "oklch(0.7 0.17 252 / 55%)" : "oklch(1 0 0 / 9%)",
                    background: used && entLinks > 0.5 ? "oklch(0.7 0.17 252 / 12%)" : "oklch(1 0 0 / 3%)",
                    color: "oklch(0.92 0.01 250 / 85%)",
                  }}
                >
                  {sys}
                </span>
              );
            })}
          </div>
        </div>
      ))}

      {/* 02 entities */}
      {ENTITIES.map((e, i) => (
        <div
          key={e.name}
          className="absolute rounded-2xl border border-gl-foreground/12 bg-[oklch(0.2_0.04_262/92%)] p-4 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)]"
          style={{ left: ENT.x, top: ENT.y(i), width: ENT.w, height: ENT.h, opacity: entCards * fEnt, transform: `translateX(${r2((1 - entCards) * -30)}px)` }}
        >
          <div className="flex items-center justify-between">
            <p className="font-gl-display text-[1rem] text-gl-foreground">{e.name}</p>
            <p className="font-gl-mono text-[0.8rem] text-gl-gold">{e.metric}</p>
          </div>
          <p className="font-gl-mono text-[0.6rem] tracking-[0.12em] text-gl-muted-foreground">{e.region}</p>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {e.stack.map((sys) => (
              <span key={sys} className="rounded-md bg-gl-foreground/[0.05] px-2 py-1 text-[0.62rem] text-gl-foreground/75">
                {sys}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* 03 hub */}
      <div
        className="absolute overflow-hidden rounded-[26px] border bg-[linear-gradient(180deg,oklch(0.2_0.045_262/95%),oklch(0.15_0.035_264/95%))]"
        style={{
          left: HUB.x,
          top: HUB.y,
          width: HUB.w,
          height: HUB.h,
          opacity: mix(0.25, 1, hubLinks) * fHub,
          borderColor: `color-mix(in oklab, var(--data) ${Math.round(30 + hubLinks * 30)}%, transparent)`,
          boxShadow: `0 0 ${Math.round(80 * sem)}px -20px var(--gold)`,
        }}
      >
        <p className="absolute left-5 top-4 font-gl-mono text-[0.6rem] uppercase tracking-[0.2em] text-gl-data">Genius Lab data hub</p>
        {HUB_LAYERS.map((l, k) => {
          const f = layer(k);
          return (
            <div
              key={l.tag}
              className="absolute left-5 right-5 overflow-hidden rounded-xl border"
              style={{ top: LANE_Y[k]! - HUB.y + 40, height: LANE_H, borderColor: `color-mix(in oklab, ${l.color} ${Math.round(15 + f * 45)}%, transparent)`, opacity: mix(0.2, 1, f) }}
            >
              <div className="absolute inset-y-0 left-0" style={{ width: `${f * 100}%`, background: `linear-gradient(90deg, color-mix(in oklab, ${l.color} 6%, transparent), color-mix(in oklab, ${l.color} 22%, transparent))` }} />
              <div className="relative flex h-full flex-col justify-center px-4">
                <span className="font-gl-mono text-[0.66rem] tracking-[0.2em]" style={{ color: l.color }}>
                  {l.tag}
                </span>
                <span className="mt-1 text-[0.78rem] text-gl-foreground/85">{l.title}</span>
              </div>
              {/* records settling into the lane */}
              <div className="absolute bottom-2.5 right-4 flex gap-1">
                {Array.from({ length: 8 }, (_, d) => (
                  <span key={d} className="h-1.5 w-3 rounded-sm" style={{ background: l.color, opacity: clamp(f * 8 - d) * 0.8 }} />
                ))}
              </div>
            </div>
          );
        })}
        <div
          className="absolute inset-x-5 grid place-items-center rounded-xl border text-center"
          style={{
            top: SEM.y - HUB.y,
            height: SEM.h - 20,
            borderColor: `color-mix(in oklab, var(--gold) ${Math.round(20 + sem * 60)}%, transparent)`,
            background: `radial-gradient(ellipse at center, color-mix(in oklab, var(--gold) ${Math.round(sem * 22)}%, transparent), transparent 75%)`,
          }}
        >
          <div>
            <p className="font-gl-mono text-[0.66rem] uppercase tracking-[0.22em] text-gl-gold" style={{ opacity: mix(0.3, 1, sem) }}>
              Semantic layer
            </p>
            <p className="mt-1 text-[0.74rem] text-gl-foreground/80" style={{ opacity: sem }}>
              One KPI dictionary · lineage · rules
            </p>
          </div>
        </div>
      </div>
      {/* hub captions */}
      {HUB_LAYERS.map((l, k) => (
        <div
          key={l.tag}
          className="absolute w-[300px]"
          style={{ left: HUB.x + HUB.w + 60, top: LANE_Y[k]! + 40, opacity: capIdx === k ? 1 : 0, transform: `translateX(${capIdx === k ? 0 : 12}px)`, transition: "opacity .5s, transform .5s" }}
        >
          <span className="absolute -left-[60px] top-4 h-px w-[52px]" style={{ background: l.color }} />
          <p className="font-gl-mono text-[0.62rem] tracking-[0.2em]" style={{ color: l.color }}>
            {l.tag}
          </p>
          <p className="mt-1 font-gl-display text-[1.05rem] text-gl-foreground">{l.title}</p>
          <p className="mt-1 text-[0.74rem] leading-relaxed text-gl-muted-foreground">{l.body}</p>
        </div>
      ))}

      {/* 04 dashboard */}
      <div
        className="absolute overflow-hidden rounded-[22px] border border-gl-foreground/12 bg-[oklch(0.17_0.032_262/96%)] shadow-[0_60px_120px_-50px_oklch(0.4_0.18_258/70%)]"
        style={{ left: DASH.x, top: DASH.y, width: DASH.w, height: DASH.h, opacity: mix(0.15, 1, dash) * fDash, transform: `translateY(${r2((1 - dash) * 30)}px)` }}
      >
        <div className="flex items-center justify-between border-b border-gl-foreground/10 px-5 py-3">
          <p className="font-gl-display text-[0.9rem] text-gl-foreground">Executive Operating System</p>
          <p className="font-gl-mono text-[0.58rem] uppercase tracking-[0.14em] text-gl-muted-foreground">4 entities · governed</p>
        </div>
        <div className="grid grid-cols-4 gap-2.5 p-4">
          {KPIS.map((k, i) => (
            <div key={k.k} className="rounded-xl border border-gl-foreground/10 bg-gl-background/40 p-3">
              <p className="text-[0.56rem] uppercase tracking-[0.1em] text-gl-muted-foreground">{k.k}</p>
              <p className="mt-1 font-gl-display text-[1.15rem] tabular-nums text-gl-foreground">{k.f(k.v * phase(p, 0.54 + i * 0.01, 0.6 + i * 0.01))}</p>
              <p className={`text-[0.58rem] ${i === 3 ? "text-gl-gold" : "text-gl-data"}`}>{k.d}</p>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 620 120" className="absolute left-4 right-4 top-[150px] h-[120px] w-[calc(100%-2rem)]" aria-hidden="true">
          <path
            d="M0 96 C 60 90, 90 84, 140 80 S 220 60, 280 62 S 380 40, 440 36 S 560 18, 620 12"
            fill="none"
            stroke="var(--data)"
            strokeWidth="2.2"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - dash}
          />
        </svg>
        {/* briefing card inside the dashboard (the camera zooms into it) */}
        <div
          className="absolute rounded-xl border bg-gl-background/50 p-4"
          style={{ left: BRF.x - DASH.x, top: BRF.y - DASH.y, width: BRF.w, height: BRF.h, borderColor: `color-mix(in oklab, var(--gold) ${Math.round(18 + brief * 50)}%, transparent)` }}
        >
          <p className="font-gl-mono text-[0.48rem] uppercase tracking-[0.18em] text-gl-gold">Morning briefing · 06:12</p>
          <div className="mt-2 space-y-1.5">
            {BRIEF.map((b, i) => {
              const shown = b.t.slice(0, clamp(typed - starts[i]!, 0, b.t.length));
              return (
                <p key={b.t} className="min-h-[2.5em] text-[0.52rem] leading-[1.4] text-gl-foreground/90">
                  <span className="mr-1.5 inline-block h-1 w-1 rounded-full align-middle" style={{ background: b.tone === "gold" ? "var(--gold)" : "var(--data)" }} />
                  {shown}
                </p>
              );
            })}
          </div>
        </div>
        <div className="absolute right-4 top-[432px] w-[300px] space-y-1.5">
          {["Revenue by entity", "Margin bridge", "Cash conversion"].map((t, i) => (
            <div key={t} className="flex items-center justify-between rounded-lg border border-gl-foreground/10 bg-gl-background/40 px-3 py-2">
              <span className="text-[0.6rem] text-gl-foreground/80">{t}</span>
              <span className="h-1 w-20 overflow-hidden rounded-full bg-gl-foreground/10">
                <span className="block h-full bg-gl-data" style={{ width: `${(0.5 + i * 0.15) * dash * 100}%` }} />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 06 agents */}
      {AGENTS.map((a, i) => (
        <div
          key={a.name}
          className="absolute flex items-center gap-3 rounded-2xl border bg-[oklch(0.19_0.04_262/94%)] px-4"
          style={{
            left: AG.x,
            top: AG.y(i),
            width: AG.w,
            height: AG.h,
            opacity: mix(0.1, 1, ag(i)) * fAg,
            transform: `translateX(${r2((1 - ag(i)) * 24)}px)`,
            borderColor: ag(i) > 0.95 ? "oklch(0.77 0.155 66 / 45%)" : "oklch(1 0 0 / 10%)",
          }}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gl-gold/12 font-gl-mono text-[0.6rem] text-gl-gold">AI</span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.8rem] text-gl-foreground">{a.name}</p>
            <p className="truncate font-gl-mono text-[0.56rem] text-gl-muted-foreground">{a.scope}</p>
          </div>
          <div className="text-right">
            <p className="font-gl-mono text-[0.62rem] text-gl-foreground/85">{a.out}</p>
            <p className="font-gl-mono text-[0.58rem] text-[var(--success)]">{a.gain}</p>
          </div>
        </div>
      ))}

      {/* finale label */}
      <div className="absolute text-center" style={{ left: W / 2 - 400, top: -150, width: 800, opacity: finale }}>
        <p className="font-gl-mono text-[1.6rem] uppercase tracking-[0.3em] text-[var(--success)]">Written back · the loop is closed</p>
      </div>
    </div>
  );
}

/** V33 — the original journey, rebuilt so every step is physically connected to the next. */
export function V33Journey() {
  return (
    <HowSection
      heightVh={700}
      visual={(p) => (
        <FitCanvas w={VW} h={VH}>
          <World p={p} />
        </FitCanvas>
      )}
    />
  );
}
