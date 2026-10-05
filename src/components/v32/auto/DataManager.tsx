"use client";

import { Tween } from "@/components/hero-demo/engine";
import type { Clock } from "./clock";
import { BAND, BRONZE_ROWS, CARD, COMPACT, DM, ENTITIES, GOLD_KPIS, LAYERS, NODE, RAW_CHIPS, SILVER_ROWS, WIN, bandY, type CUES } from "./data";

type S = Clock<typeof CUES>;
const SPRING = "cubic-bezier(0.16, 1, 0.3, 1)";
const LAYER_CUES = ["raw", "bronze", "silver", "gold", "s3Done"] as const;

type BandState = "queued" | "running" | "done";
const bandState = (s: S, i: number): BandState => (s.past(LAYER_CUES[i + 1]!) ? "done" : s.past(LAYER_CUES[i]!) ? "running" : "queued");

/** A glowing data packet riding an SVG path. */
function Packet({ d, color, dur, begin = 0, r = 2.8 }: { d: string; color: string; dur: number; begin?: number; r?: number }) {
  return (
    <circle r={r} fill={color} style={{ filter: "url(#faGlow)" }}>
      <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={d} />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.85;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
    </circle>
  );
}

export function GlowDefs() {
  return (
    <defs>
      <filter id="faGlow" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="3.2" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="faSilver" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="oklch(0.9 0.015 250)" stopOpacity="0.2" />
        <stop offset="1" stopColor="oklch(0.95 0.01 250)" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="faGold" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="oklch(0.8 0.15 75)" stopOpacity="0.35" />
        <stop offset="1" stopColor="oklch(0.85 0.14 75)" stopOpacity="0.95" />
      </linearGradient>
    </defs>
  );
}

/** entity column → raw layer, and gold node → executive window */
export function Flows({ s }: { s: S }) {
  const intake = s.between("s3", "s4");
  const out = s.past("w1");
  const back = s.past("writeback");
  const curve = (x1: number, y1: number, x2: number, y2: number) => {
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  };
  const cardH = CARD.h * COMPACT.s;
  return (
    <svg className="pointer-events-none absolute inset-0" width="100%" height="100%" aria-hidden="true">
      <GlowDefs />
      <g style={{ opacity: intake && s.past("raw") ? 1 : 0, transition: "opacity 700ms" }}>
        {ENTITIES.map((e, i) => {
          const d = curve(COMPACT.x + CARD.w * COMPACT.s + 4, COMPACT.y(i) + cardH / 2, DM.x - 2, DM.y + bandY(0) + 34 + i * 24);
          return (
            <g key={e.name}>
              <path d={d} fill="none" stroke={e.hue} strokeOpacity="0.22" strokeWidth="5" style={{ filter: "url(#faGlow)" }} />
              <path d={d} fill="none" stroke={e.hue} strokeOpacity="0.8" strokeWidth="1.3" />
              {intake ? (
                <>
                  <Packet d={d} color={e.hue} dur={2.1 + i * 0.2} begin={i * 0.3} r={3} />
                  <Packet d={d} color="oklch(0.97 0.01 250)" dur={2.1 + i * 0.2} begin={i * 0.3 + 1.05} r={2} />
                </>
              ) : null}
            </g>
          );
        })}
      </g>

      <g style={{ opacity: out ? 1 : 0, transition: "opacity 900ms" }}>
        {[0, 1, 2, 3].map((i) => {
          const d = curve(NODE.x + NODE.w, NODE.y + 120 + i * 48, WIN.x - 2, WIN.y + 120 + i * 150);
          return (
            <g key={i}>
              <path d={d} fill="none" stroke="url(#faGold)" strokeOpacity="0.3" strokeWidth="5" style={{ filter: "url(#faGlow)" }} />
              <path d={d} fill="none" stroke="url(#faGold)" strokeWidth="1.3" />
              {out ? <Packet d={d} color="oklch(0.86 0.14 80)" dur={1.9 + i * 0.25} begin={i * 0.35} /> : null}
            </g>
          );
        })}
      </g>

      {/* write-back: actions return to the systems of record through the Data Manager */}
      {(() => {
        const d = `M ${WIN.x + 120} ${WIN.y + WIN.h + 2} C ${WIN.x + 120} ${WIN.y + WIN.h + 26}, ${NODE.x + NODE.w / 2} ${WIN.y + WIN.h + 26}, ${NODE.x + NODE.w / 2} ${NODE.y + NODE.h + 2}`;
        return (
          <g style={{ opacity: back ? 1 : 0, transition: "opacity 800ms" }}>
            <path d={d} fill="none" stroke="var(--success)" strokeOpacity="0.7" strokeWidth="1.3" strokeDasharray="5 7">
              <animate attributeName="stroke-dashoffset" values="0;24" dur="1.2s" repeatCount="indefinite" />
            </path>
            {back ? <Packet d={d} color="var(--success)" dur={1.8} /> : null}
          </g>
        );
      })()}
    </svg>
  );
}

function StatePill({ st, accent }: { st: BandState; accent: string }) {
  if (st === "done")
    return (
      <span className="flex items-center gap-1.5 rounded-full px-2 py-0.5 font-gl-mono text-[9px] uppercase tracking-[0.14em]" style={{ background: `color-mix(in oklab, ${accent} 16%, transparent)`, color: accent }}>
        ✓ Complete
      </span>
    );
  if (st === "running")
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-gl-data/15 px-2 py-0.5 font-gl-mono text-[9px] uppercase tracking-[0.14em] text-gl-data">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gl-data" /> Processing
      </span>
    );
  return <span className="rounded-full bg-white/[0.05] px-2 py-0.5 font-gl-mono text-[9px] uppercase tracking-[0.14em] text-gl-muted-foreground/70">Queued</span>;
}

function Table({ rows, accent, struck }: { rows: readonly (readonly string[])[]; accent: string; struck?: boolean }) {
  const cols = "grid-cols-[44px_88px_82px_44px_1fr]";
  return (
    <div className="font-gl-mono text-[10px]">
      <div className={`grid ${cols} gap-2 border-b border-white/[0.07] pb-1 text-[8.5px] uppercase tracking-[0.14em] text-gl-muted-foreground/70`}>
        <span>ent</span>
        <span>account</span>
        <span className="text-right">amount</span>
        <span>ccy</span>
        <span>date</span>
      </div>
      {rows.map((r, n) => (
        <div key={n} className={`grid ${cols} gap-2 py-[3px] text-gl-foreground/85`}>
          {r.map((c, k) => (
            <span key={k} className={k === 2 ? "text-right tabular-nums" : ""} style={k === 3 && accent ? { color: accent } : undefined}>
              {c}
            </span>
          ))}
        </div>
      ))}
      {struck ? (
        <div className={`grid ${cols} gap-2 py-[3px] text-gl-muted-foreground/50 line-through`}>
          <span>ATL</span>
          <span>revenue</span>
          <span className="text-right">1,204.00</span>
          <span>USD</span>
          <span>duplicate</span>
        </div>
      ) : null}
    </div>
  );
}

function BandViz({ i, st }: { i: number; st: BandState }) {
  const on = st !== "queued";
  if (i === 0)
    return (
      <div className="flex h-full flex-col justify-center gap-[7px] overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        {RAW_CHIPS.map((row, r) => (
          <div key={r} className={on ? "fa-marquee flex w-max gap-1.5" : "flex w-max gap-1.5"} style={{ animationDuration: `${12 + r * 2.5}s`, animationDirection: r % 2 ? "reverse" : "normal" }}>
            {[...row, ...row].map((c, k) => (
              <span
                key={k}
                className="whitespace-nowrap rounded-[5px] border px-1.5 py-[2px] font-gl-mono text-[9px]"
                style={{ borderColor: `color-mix(in oklab, ${ENTITIES[r]!.hue} 35%, transparent)`, color: `color-mix(in oklab, ${ENTITIES[r]!.hue} 75%, white)`, background: `color-mix(in oklab, ${ENTITIES[r]!.hue} 8%, transparent)`, marginTop: (k * 7 + r * 3) % 5 }}
              >
                {c}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  if (i === 1) return <div className="flex h-full items-center"><div className="w-full"><Table rows={BRONZE_ROWS} accent="oklch(0.72 0.11 62)" /></div></div>;
  if (i === 2)
    return (
      <div className="flex h-full flex-col justify-center gap-2">
        <Table rows={SILVER_ROWS} accent="oklch(0.88 0.02 254)" struck />
        <div className="flex gap-1.5">
          {["FX → USD", "4 charts of accounts → 1", "18.2M duplicates removed"].map((t) => (
            <span key={t} className="rounded-full border border-white/15 bg-white/[0.04] px-2 py-[2px] font-gl-mono text-[8.5px] text-gl-foreground/80">
              {t}
            </span>
          ))}
        </div>
      </div>
    );
  return (
    <div className="grid h-full grid-cols-2 content-center gap-2">
      {GOLD_KPIS.map((k, n) => (
        <div
          key={k.k}
          className="flex items-center justify-between rounded-[10px] border border-[oklch(0.8_0.15_75/35%)] bg-[oklch(0.8_0.15_75/9%)] px-3 py-2 transition-all duration-500"
          style={{ opacity: on ? 1 : 0.35, transform: on ? "none" : "translateY(4px)", transitionDelay: on ? `${n * 120}ms` : "0ms" }}
        >
          <span>
            <span className="block text-[10.5px] text-gl-foreground/85">{k.k}</span>
            <span className="block font-gl-mono text-[8px] uppercase tracking-[0.12em] text-[oklch(0.8_0.15_75/80%)]">✓ one definition</span>
          </span>
          <span className="font-gl-display text-[16px] tabular-nums text-[oklch(0.86_0.14_78)]">{k.v}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * 03. The Genius Lab Data Manager: four medallion layers light up in turn as
 * the entities stream in. Data quality climbs with each layer; at gold, group
 * revenue is one number. In step 04 the panel folds into the gold node.
 */
export function DataManager({ s }: { s: S }) {
  const shown = s.past("s3");
  const folded = s.past("s4");
  const lit = LAYER_CUES.slice(0, 4).filter((c) => s.past(c)).length;
  const quality = lit === 0 ? 0 : LAYERS[lit - 1]!.quality;
  const done = s.past("s3Done");
  return (
    <div
      className="absolute left-0 top-0 origin-left"
      style={{
        width: DM.w,
        height: DM.h,
        transform: folded ? `translate(${NODE.x}px, ${NODE.y + NODE.h / 2 - DM.h * 0.22}px) scale(0.24)` : `translate(${DM.x + (shown ? 0 : 40)}px, ${DM.y}px)`,
        opacity: shown && !folded ? 1 : 0,
        transition: `transform 1100ms ${SPRING}, opacity ${folded ? 700 : 900}ms ease ${shown && !folded ? 200 : 0}ms`,
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[22px] border border-white/[0.11] bg-[linear-gradient(170deg,oklch(0.23_0.045_260/97%),oklch(0.15_0.03_264/97%))] shadow-[0_50px_120px_-40px_rgb(0_0_0/0.9),inset_0_1px_0_oklch(1_0_0/7%)]">
        <span className="pointer-events-none absolute -top-24 left-1/3 h-56 w-[60%] rounded-full bg-[radial-gradient(closest-side,oklch(0.7_0.17_252/22%),transparent)] blur-xl" />

        {/* header */}
        <div className="relative flex h-[64px] items-center justify-between border-b border-white/[0.07] px-5">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/atomo.png" alt="" className="h-8 w-8 object-contain drop-shadow-[0_0_10px_oklch(0.7_0.17_252/55%)]" />
            <div>
              <p className="font-gl-display text-[15px] tracking-tight text-gl-foreground">Genius Lab Data Manager</p>
              <p className="font-gl-mono text-[9.5px] tracking-[0.08em] text-gl-muted-foreground">4 entities · 16 sources · medallion pipeline</p>
            </div>
          </div>
          <div className="relative h-9 min-w-[300px]">
            <div className="absolute inset-0 flex items-center justify-end gap-5 transition-all duration-500" style={{ opacity: done ? 0 : 1, transform: done ? "translateY(-6px)" : "none" }}>
              <span className="text-right">
                <span className="block font-gl-mono text-[8.5px] uppercase tracking-[0.16em] text-gl-muted-foreground">Data quality</span>
                <span className="block font-gl-display text-[18px] tabular-nums text-gl-foreground">
                  <Tween value={quality} format={(n) => `${n.toFixed(1)}%`} duration={1200} />
                </span>
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-[oklch(0.78_0.13_168/35%)] bg-[oklch(0.78_0.13_168/10%)] px-2.5 py-1 font-gl-mono text-[9px] uppercase tracking-[0.14em] text-[var(--success)]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--success)]" /> Pipeline live
              </span>
            </div>
            <div className="absolute inset-0 flex items-center justify-end transition-all duration-700" style={{ opacity: done ? 1 : 0, transform: done ? "none" : "translateY(6px)" }}>
              <span className="fa-sheen flex items-center gap-3 rounded-xl border border-[oklch(0.8_0.15_75/50%)] bg-[oklch(0.8_0.15_75/12%)] px-3.5 py-1.5">
                <span className="font-gl-mono text-[9px] uppercase tracking-[0.14em] text-[oklch(0.86_0.12_78)]">Group revenue · one number</span>
                <span className="font-gl-display text-[18px] tabular-nums text-[oklch(0.88_0.13_80)]">$1.42B</span>
              </span>
            </div>
          </div>
        </div>

        {/* medallion layers */}
        {LAYERS.map((l, i) => {
          const st = bandState(s, i);
          const on = st !== "queued";
          return (
            <div key={l.key}>
              <div
                className="absolute left-4 right-4 rounded-[16px] border transition-all duration-700"
                style={{
                  top: bandY(i),
                  height: BAND.h,
                  borderColor: st === "running" ? `color-mix(in oklab, ${l.accent} 60%, transparent)` : st === "done" ? `color-mix(in oklab, ${l.accent} 30%, transparent)` : "oklch(1 0 0 / 7%)",
                  background: on ? `linear-gradient(90deg, color-mix(in oklab, ${l.accent} 9%, transparent), oklch(1 0 0 / 2%))` : "oklch(1 0 0 / 1.5%)",
                  boxShadow: st === "running" ? `0 0 0 1px color-mix(in oklab, ${l.accent} 20%, transparent), 0 0 40px -10px color-mix(in oklab, ${l.accent} 45%, transparent)` : "none",
                }}
              >
                <span className="absolute bottom-4 left-0 top-4 w-[3px] rounded-r-full transition-opacity duration-500" style={{ background: l.accent, opacity: on ? 0.9 : 0.15 }} />
                {/* label */}
                <div className="absolute left-6 top-5 w-[200px] transition-opacity duration-500" style={{ opacity: on ? 1 : 0.45 }}>
                  <p className="font-gl-mono text-[10px] tracking-[0.26em]" style={{ color: l.accent }}>
                    {l.tag}
                  </p>
                  <p className="mt-1.5 font-gl-display text-[15px] leading-tight tracking-tight text-gl-foreground">{l.title}</p>
                  <p className="mt-1 text-[11px] leading-snug text-gl-muted-foreground">{l.note}</p>
                </div>
                {/* viz */}
                <div className="absolute bottom-3 left-[234px] top-3 w-[392px] transition-opacity duration-700" style={{ opacity: on ? 1 : 0.22 }}>
                  <BandViz i={i} st={st} />
                </div>
                {/* metrics */}
                <div className="absolute right-5 top-5 flex w-[140px] flex-col items-end gap-2 text-right">
                  <StatePill st={st} accent={l.accent} />
                  <span className="mt-1 font-gl-display text-[20px] tabular-nums leading-none text-gl-foreground transition-opacity duration-500" style={{ opacity: on ? 1 : 0.3 }}>
                    {on ? <Tween value={l.rows} from={0} format={(n) => (l.key === "gold" ? `${Math.round(n)}` : n.toFixed(1))} duration={1300} /> : "—"}
                    <span className="text-[10px] text-gl-muted-foreground">{l.key === "gold" ? "" : "M"}</span>
                  </span>
                  <span className="font-gl-mono text-[8.5px] leading-snug tracking-[0.06em] text-gl-muted-foreground">{l.rowsLabel.replace(/^M /, "").replace(/^ /, "")}</span>
                  <span className="mt-0.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <span className="block h-full rounded-full transition-[width] duration-[1200ms]" style={{ width: on ? `${l.quality}%` : "0%", background: l.accent }} />
                  </span>
                </div>
              </div>
              {/* a record dropping to the next layer */}
              {i < 3 ? (
                <span className="absolute left-[120px] flex h-3 w-px justify-center" style={{ top: bandY(i) + BAND.h }}>
                  {s.past(LAYER_CUES[i + 1]!) && !s.past("s4") ? <span className="fa-drop absolute h-1.5 w-1.5 rounded-full" style={{ background: LAYERS[i + 1]!.accent, boxShadow: `0 0 8px ${LAYERS[i + 1]!.accent}` }} /> : null}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** 04–06. The Data Manager, folded to its gold layer: the source every dashboard reads. */
export function GoldNode({ s }: { s: S }) {
  const shown = s.past("s4");
  const back = s.past("writeback");
  return (
    <div
      className="absolute rounded-[18px] border bg-[linear-gradient(170deg,oklch(0.24_0.045_258/97%),oklch(0.16_0.03_264/97%))] p-4 shadow-[0_40px_90px_-40px_rgb(0_0_0/0.9)]"
      style={{
        left: NODE.x,
        top: NODE.y,
        width: NODE.w,
        height: NODE.h,
        borderColor: back ? "oklch(0.78 0.13 168 / 45%)" : "oklch(0.8 0.15 75 / 38%)",
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "scale(0.94)",
        transition: `opacity 700ms ease 450ms, transform 900ms ${SPRING} 450ms, border-color 700ms`,
      }}
    >
      <span className="pointer-events-none absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-[oklch(0.85_0.14_78)] to-transparent" />
      <div className="flex items-center gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/atomo.png" alt="" className="h-7 w-7 object-contain drop-shadow-[0_0_8px_oklch(0.7_0.17_252/50%)]" />
        <div>
          <p className="text-[12.5px] leading-tight text-gl-foreground">Data Manager</p>
          <p className="font-gl-mono text-[8.5px] tracking-[0.12em] text-gl-muted-foreground">GOLD · GOVERNED</p>
        </div>
      </div>
      <div className="mt-3 flex gap-1">
        {LAYERS.map((l) => (
          <span key={l.key} className="h-1 flex-1 rounded-full" style={{ background: l.accent, opacity: l.key === "gold" ? 1 : 0.45 }} />
        ))}
      </div>
      <div className="mt-3 space-y-1.5">
        {GOLD_KPIS.map((k) => (
          <div key={k.k} className="flex items-center justify-between rounded-lg border border-[oklch(0.8_0.15_75/22%)] bg-[oklch(0.8_0.15_75/6%)] px-2.5 py-[7px]">
            <span className="text-[10.5px] text-gl-foreground/85">{k.k}</span>
            <span className="font-gl-mono text-[10.5px] text-[oklch(0.86_0.13_78)]">{k.v}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 border-t border-white/[0.07] pt-2.5 font-gl-mono text-[8.5px] leading-[1.7] tracking-[0.06em] text-gl-muted-foreground">
        <p>LINEAGE · 16 sources → 4 KPIs</p>
        <p>REFRESHED · today 06:00</p>
        <p>QUALITY · 99.8%</p>
      </div>
      <div
        className="mt-2.5 rounded-lg border px-2.5 py-1.5 font-gl-mono text-[8.5px] uppercase tracking-[0.12em] transition-all duration-700"
        style={{ opacity: back ? 1 : 0, borderColor: "oklch(0.78 0.13 168 / 40%)", color: "var(--success)", background: "oklch(0.78 0.13 168 / 8%)" }}
      >
        ↺ Writing back · SAP · Salesforce · Workday
      </div>
    </div>
  );
}
