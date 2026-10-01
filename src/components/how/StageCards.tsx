"use client";

import { AGENTS, BRIEF, ENTITIES, HUB_LAYERS, KPIS, SOURCES, clamp, mix, phase, r2 } from "./shared";

/*
 * One self-contained visual per stage, each driven by `t` (0 → 1 through that
 * stage, 1 once it has passed). Fixed 520 × 330 so any layout can place them.
 */

export const CARD_W = 520;
export const CARD_H = 330;

const cardBase = "relative h-full w-full overflow-hidden rounded-[20px] border bg-[linear-gradient(160deg,oklch(0.22_0.04_262/92%),oklch(0.14_0.03_264/94%))]";

function Head({ n, title, sub, tone = "data" }: { n: string; title: string; sub: string; tone?: "data" | "gold" }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <p className={`font-gl-mono text-[0.6rem] tracking-[0.2em] ${tone === "gold" ? "text-gl-gold" : "text-gl-data"}`}>{n}</p>
        <p className="mt-1 font-gl-display text-[1.05rem] tracking-[-0.01em] text-gl-foreground">{title}</p>
      </div>
      <p className="font-gl-mono text-[0.56rem] uppercase tracking-[0.14em] text-gl-muted-foreground/70">{sub}</p>
    </div>
  );
}

export function SourcesCard({ t }: { t: number }) {
  return (
    <div className={`${cardBase} border-gl-foreground/10 p-5`}>
      <Head n="01" title="Fragmented systems" sub="6 categories · 24 systems" />
      <div className="mt-4 space-y-2">
        {SOURCES.map((row, i) => (
          <div key={row.cat} className="flex items-center gap-2" style={{ opacity: phase(t, i * 0.06, 0.25 + i * 0.06) }}>
            <span className="w-14 font-gl-mono text-[0.55rem] tracking-[0.14em] text-gl-muted-foreground">{row.cat}</span>
            {row.systems.map((s, k) => {
              const jitter = (1 - phase(t, 0.5, 1)) * ((i * 7 + k * 13) % 9 - 4);
              return (
                <span
                  key={s}
                  className="flex-1 truncate rounded-md border border-gl-foreground/10 bg-gl-foreground/[0.04] px-2 py-1 text-center text-[0.6rem] text-gl-foreground/75"
                  style={{ transform: `translateY(${r2(jitter)}px)` }}
                >
                  {s}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function EntitiesCard({ t }: { t: number }) {
  return (
    <div className={`${cardBase} border-gl-foreground/10 p-5`}>
      <Head n="02" title="Four entities, four stacks" sub="4 currencies · 4 truths" />
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {ENTITIES.map((e, i) => (
          <div
            key={e.name}
            className="rounded-xl border border-gl-foreground/10 bg-gl-background/40 p-3"
            style={{ opacity: phase(t, i * 0.12, 0.3 + i * 0.12), transform: `translateY(${r2((1 - phase(t, i * 0.12, 0.3 + i * 0.12)) * 10)}px)` }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[0.7rem] text-gl-foreground">{e.name}</p>
              <p className="font-gl-mono text-[0.6rem] text-gl-gold">{e.metric}</p>
            </div>
            <p className="font-gl-mono text-[0.52rem] text-gl-muted-foreground/70">{e.region}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {e.stack.map((s) => (
                <span key={s} className="rounded bg-gl-foreground/[0.06] px-1.5 py-0.5 text-[0.52rem] text-gl-foreground/70">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HubCard({ t }: { t: number }) {
  return (
    <div className={`${cardBase} border-gl-data/30 p-5`}>
      <Head n="03" title="Genius Lab data hub" sub="One definition" />
      <div className="mt-4 space-y-2">
        {HUB_LAYERS.map((l, i) => {
          const f = phase(t, i * 0.2, 0.2 + i * 0.2);
          return (
            <div key={l.tag} className="relative overflow-hidden rounded-lg border border-gl-foreground/10 bg-gl-background/40 px-3 py-2">
              <div className="absolute inset-y-0 left-0" style={{ width: `${f * 100}%`, background: `linear-gradient(90deg, transparent, color-mix(in oklab, ${l.color} 22%, transparent))` }} />
              <div className="relative flex items-center justify-between">
                <span className="font-gl-mono text-[0.58rem] tracking-[0.18em]" style={{ color: l.color }}>
                  {l.tag}
                </span>
                <span className="text-[0.62rem] text-gl-foreground/80">{l.title}</span>
              </div>
            </div>
          );
        })}
        <div
          className="rounded-lg border px-3 py-2.5 text-center"
          style={{
            borderColor: `color-mix(in oklab, var(--gold) ${Math.round(phase(t, 0.8, 1) * 70)}%, transparent)`,
            boxShadow: `0 0 ${Math.round(phase(t, 0.8, 1) * 30)}px -6px var(--gold)`,
          }}
        >
          <span className="font-gl-mono text-[0.58rem] uppercase tracking-[0.2em] text-gl-gold">Semantic layer · one KPI dictionary</span>
        </div>
      </div>
    </div>
  );
}

export function DashCard({ t }: { t: number }) {
  const draw = phase(t, 0.1, 0.8);
  const pts = [62, 58, 60, 52, 48, 50, 42, 38, 34, 30, 26, 22].map((y, i) => [12 + i * 40, y] as const);
  let d = `M ${pts[0]![0]} ${pts[0]![1]}`;
  for (let i = 1; i < pts.length; i++) d += ` L ${pts[i]![0]} ${pts[i]![1]}`;
  return (
    <div className={`${cardBase} border-gl-foreground/10 p-5`}>
      <Head n="04" title="Executive operating system" sub="Governed KPIs" />
      <div className="mt-4 grid grid-cols-4 gap-2">
        {KPIS.map((k, i) => (
          <div key={k.k} className="rounded-lg border border-gl-foreground/10 bg-gl-background/40 p-2.5">
            <p className="text-[0.5rem] uppercase tracking-[0.1em] text-gl-muted-foreground/80">{k.k}</p>
            <p className="mt-1 font-gl-display text-[0.92rem] tabular-nums text-gl-foreground">{k.f(k.v * phase(t, i * 0.08, 0.4 + i * 0.08))}</p>
            <p className={`text-[0.5rem] ${i === 3 ? "text-gl-gold" : "text-gl-data"}`}>{k.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg border border-gl-foreground/10 bg-gl-background/40 p-3">
        <svg viewBox="0 0 470 80" className="block h-[96px] w-full" aria-hidden="true">
          <defs>
            <linearGradient id="dashFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--data)" stopOpacity="0.35" />
              <stop offset="1" stopColor="var(--data)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[20, 40, 60].map((y) => (
            <line key={y} x1="0" x2="470" y1={y} y2={y} stroke="var(--border)" strokeDasharray="2 5" />
          ))}
          <path d={`${d} L 452 80 L 12 80 Z`} fill="url(#dashFill)" opacity={draw} />
          <path d={d} fill="none" stroke="var(--data)" strokeWidth="2" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
        </svg>
      </div>
    </div>
  );
}

export function BriefCard({ t }: { t: number }) {
  const total = BRIEF.reduce((a, b) => a + b.t.length, 0);
  const typed = Math.round(phase(t, 0.05, 0.9) * total);
  const starts = BRIEF.map((_, i) => BRIEF.slice(0, i).reduce((a, b) => a + b.t.length, 0));
  return (
    <div className={`${cardBase} border-gl-gold/30 p-5`}>
      <Head n="05" title="Morning briefing" sub="Written 06:12 · for Elena" tone="gold" />
      <div className="mt-4 space-y-3">
        {BRIEF.map((b, i) => {
          const shown = b.t.slice(0, clamp(typed - starts[i]!, 0, b.t.length));
          const color = b.tone === "data" ? "var(--data)" : b.tone === "gold" ? "var(--gold)" : "var(--foreground)";
          return (
            <div key={b.t} className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color, opacity: shown ? 1 : 0.2 }} />
              <p className="min-h-[2.6em] text-[0.82rem] leading-[1.45] text-gl-foreground/90">
                {shown}
                {shown && shown.length < b.t.length ? <span className="how-caret" /> : null}
              </p>
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between" style={{ opacity: phase(t, 0.85, 1) }}>
        <span className="font-gl-mono text-[0.55rem] uppercase tracking-[0.14em] text-gl-muted-foreground">3 priorities · sourced from 14 entities</span>
        <span className="rounded-md bg-gl-gold px-2.5 py-1 text-[0.6rem] font-medium text-gl-background">Act on priorities</span>
      </div>
    </div>
  );
}

export function AgentsCard({ t }: { t: number }) {
  return (
    <div className={`${cardBase} border-gl-gold/30 p-5`}>
      <Head n="06" title="Agents close the loop" sub="Governed · written back" tone="gold" />
      <div className="mt-3.5 space-y-1.5">
        {AGENTS.map((a, i) => {
          const f = phase(t, i * 0.12, 0.3 + i * 0.12);
          return (
            <div key={a.name} className="flex items-center gap-3 rounded-lg border border-gl-foreground/10 bg-gl-background/40 px-3 py-[7px]" style={{ opacity: mix(0.25, 1, f) }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: f > 0.95 ? "var(--success)" : "var(--gold)", boxShadow: f > 0.95 ? "0 0 8px var(--success)" : "none" }} />
              <span className="w-28 text-[0.68rem] text-gl-foreground">{a.name}</span>
              <span className="flex-1 truncate font-gl-mono text-[0.52rem] text-gl-muted-foreground/80">{a.scope}</span>
              <span className="font-gl-mono text-[0.58rem] text-gl-foreground/80">{a.out}</span>
              <span className="w-16 text-right font-gl-mono text-[0.56rem] text-[var(--success)]">{a.gain}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const CARDS = [SourcesCard, EntitiesCard, HubCard, DashCard, BriefCard, AgentsCard];
