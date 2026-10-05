"use client";

import type { Clock } from "./clock";
import { CARD, CATEGORIES, CLASHES, COMPACT, ENTITIES, SLOT, TILE, cardX, logoUrl, slotPos, wallPos, type CUES } from "./data";

type S = Clock<typeof CUES>;

const EASE_X = "cubic-bezier(0.45, 0.05, 0.25, 1)";
const EASE_Y = "cubic-bezier(0.25, 0.7, 0.3, 1)";
const SPRING = "cubic-bezier(0.16, 1, 0.3, 1)";

/** which entity (and which slot) a system belongs to, if any */
const home = new Map<string, { i: number; k: number }>();
ENTITIES.forEach((e, i) => e.domains.forEach((d, k) => home.set(d, { i, k })));

function Logo({ domain, size }: { domain: string; size: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={logoUrl(domain)} alt="" width={size} height={size} className="block shrink-0 rounded-[6px] object-contain" style={{ width: size, height: size }} loading="lazy" />;
}

/**
 * 01 → 02. Thirty system tiles on a loose wall. When the entities appear, the
 * sixteen that belong to one fly into its card along a hand-drawn arc (x and y
 * ease differently), and the rest fall away.
 */
export function SystemsWall({ s }: { s: S }) {
  const shown = s.past("s1");
  const flying = s.past("s2");
  const landed = s.past("s2Land");
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* category labels */}
      {CATEGORIES.map((c, ci) => (
        <div
          key={c.label}
          className="absolute transition-all duration-700"
          style={{ left: 125 + ci * 190, top: 150, opacity: shown && !flying ? 1 : 0, transform: `translate(-50%, ${shown && !flying ? 0 : 8}px)`, transitionDelay: shown && !flying ? `${ci * 70}ms` : "0ms" }}
        >
          <span className="flex items-center gap-2 rounded-full border border-gl-data/30 bg-gl-data/[0.08] px-3 py-1 font-gl-mono text-[10px] tracking-[0.22em] text-gl-data">
            <span className="h-1 w-1 rounded-full bg-gl-data" />
            {c.label}
          </span>
        </div>
      ))}

      {/* broken links between systems that should agree */}
      <svg className="absolute inset-0 transition-opacity duration-700" width="100%" height="100%" style={{ opacity: s.past("s1Chips") && !flying ? 1 : 0 }} aria-hidden="true">
        {[
          [0, 0, 1, 0],
          [1, 1, 2, 2],
          [3, 0, 4, 1],
          [4, 3, 5, 2],
          [0, 3, 1, 4],
          [2, 4, 3, 3],
        ].map(([c1, r1, c2, r2], n) => {
          const a = wallPos(c1!, r1!);
          const b = wallPos(c2!, r2!);
          const x1 = a.x + TILE.w / 2;
          const x2 = b.x - TILE.w / 2;
          const mx = (x1 + x2) / 2;
          const my = (a.y + b.y) / 2;
          return (
            <g key={n}>
              <path d={`M ${x1} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${x2} ${b.y}`} fill="none" stroke="oklch(0.7 0.17 25)" strokeOpacity="0.45" strokeWidth="1.2" strokeDasharray="4 6" />
              <circle cx={mx} cy={my} r="7" fill="oklch(0.17 0.04 262)" stroke="oklch(0.7 0.17 25 / 70%)" />
              <path d={`M ${mx - 2.6} ${my - 2.6} L ${mx + 2.6} ${my + 2.6} M ${mx + 2.6} ${my - 2.6} L ${mx - 2.6} ${my + 2.6}`} stroke="oklch(0.75 0.17 25)" strokeWidth="1.3" />
            </g>
          );
        })}
      </svg>

      {/* the tiles */}
      {CATEGORIES.map((c, ci) =>
        c.systems.map((sys, ri) => {
          const w = wallPos(ci, ri);
          const h = home.get(sys.domain);
          const slot = h ? slotPos(h.i, h.k) : null;
          const go = flying && slot;
          const x = go ? slot.x : w.x;
          const y = go ? slot.y : w.y;
          const order = h ? h.i * 4 + h.k : 0;
          const delay = flying ? order * 55 : 0;
          const hidden = !shown || (flying && !slot) || landed;
          return (
            <div
              key={sys.domain}
              className="absolute left-0 top-0"
              style={{ transform: `translateX(${x}px)`, transition: `transform 1250ms ${EASE_X} ${delay}ms` }}
            >
              <div style={{ transform: `translateY(${y}px)`, transition: `transform 1250ms ${EASE_Y} ${delay}ms` }}>
                <div
                  className="-translate-x-1/2 -translate-y-1/2"
                  style={{
                    opacity: hidden ? 0 : 1,
                    transition: `opacity ${landed ? 200 : 600}ms ease ${!shown ? 0 : flying ? (slot ? 0 : (ci * 5 + ri) * 12) : (ci * 5 + ri) * 28}ms`,
                  }}
                >
                  <div className={flying ? "" : "fa-float"} style={{ animationDelay: `${-w.float * 5}s` }}>
                    {/* the tile morphs into a slot with clip-path and transforms only — no layout animation */}
                    <div
                      className="relative"
                      style={{
                        width: TILE.w,
                        height: TILE.h,
                        transform: flying && !slot ? "scale(0.7)" : "none",
                        transition: `transform 700ms ${SPRING}`,
                      }}
                    >
                      <span
                        className="absolute inset-0 rounded-[14px] border border-white/[0.11] bg-[linear-gradient(160deg,oklch(0.27_0.04_260/92%),oklch(0.2_0.035_262/92%))] shadow-[0_10px_30px_-14px_oklch(0_0_0/70%)] backdrop-blur-sm"
                        style={{
                          clipPath: go ? `inset(${(TILE.h - SLOT) / 2}px ${(TILE.w - SLOT) / 2}px round 14px)` : "inset(0px 0px round 14px)",
                          opacity: go ? 0.55 : 1,
                          transition: `clip-path 900ms ${SPRING} ${delay + 250}ms, opacity 600ms ease ${delay + 250}ms`,
                        }}
                      />
                      <span
                        className="absolute rounded-[14px] border border-white/[0.22] bg-white/10"
                        style={{ left: (TILE.w - SLOT) / 2, top: (TILE.h - SLOT) / 2, width: SLOT, height: SLOT, opacity: go ? 1 : 0, transition: `opacity 500ms ease ${delay + 600}ms` }}
                      />
                      <span
                        className="absolute left-3 top-1/2 grid -mt-[15px] place-items-center rounded-[8px] bg-white/[0.92] p-[3px]"
                        style={{ width: 30, height: 30, transform: go ? `translateX(${TILE.w / 2 - 12 - 15}px)` : "none", transition: `transform 900ms ${SPRING} ${delay + 250}ms` }}
                      >
                        <Logo domain={sys.domain} size={22} />
                      </span>
                      <span className="absolute left-[52px] right-3 top-1/2 min-w-0 -translate-y-1/2 transition-opacity duration-300" style={{ opacity: go ? 0 : 1 }}>
                        <span className="block truncate text-[12px] leading-tight text-gl-foreground">{sys.name}</span>
                        <span className="block truncate font-gl-mono text-[9.5px] leading-tight tracking-[0.04em] text-gl-muted-foreground">{sys.cadence}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }),
      )}

      {/* conflicts */}
      {s.between("s1Chips", "s2")
        ? CLASHES.map((c, n) => (
            <span
              key={c.t}
              className="fa-clash absolute flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-gl-mono text-[10px] tracking-[0.04em]"
              style={
                {
                  left: c.x,
                  top: c.y,
                  animationDelay: `${n * 260}ms, ${600 + n * 260}ms`,
                  "--fa-ring": c.tone === "red" ? "oklch(0.65 0.2 25 / 40%)" : "oklch(0.77 0.155 66 / 35%)",
                  borderColor: c.tone === "red" ? "oklch(0.65 0.2 25 / 55%)" : "oklch(0.77 0.155 66 / 50%)",
                  background: c.tone === "red" ? "oklch(0.25 0.07 25 / 92%)" : "oklch(0.25 0.05 66 / 92%)",
                  color: c.tone === "red" ? "oklch(0.82 0.12 25)" : "var(--gold)",
                } as React.CSSProperties
              }
            >
              <span className="grid h-3 w-3 place-items-center rounded-full text-[8px] font-bold" style={{ background: c.tone === "red" ? "oklch(0.65 0.2 25)" : "var(--gold)", color: "var(--background)" }}>
                !
              </span>
              {c.t}
            </span>
          ))
        : null}
    </div>
  );
}

/**
 * 02 → 03. Four business units. Each runs its own stack and, asked for group
 * revenue, reports its own number. In step 03 they fold into a column and
 * stream into the Data Manager; once gold is reached every card agrees.
 */
export function EntityCards({ s }: { s: S }) {
  const shown = s.past("s2");
  const landed = s.past("s2Land");
  const compact = s.past("s3");
  const gone = s.past("s4");
  const answered = s.past("s2Ans");
  const clash = s.past("s2Clash");
  const agreed = s.past("s3Done");
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* the board's question */}
      <div
        className="absolute left-1/2 top-[116px] flex items-center gap-3 rounded-2xl border border-white/10 bg-[linear-gradient(160deg,oklch(0.26_0.04_262/95%),oklch(0.19_0.035_262/95%))] py-2.5 pl-2.5 pr-5 shadow-[0_20px_50px_-24px_rgb(0_0_0/0.8)] transition-all duration-700"
        style={{ opacity: s.past("s2Ask") && !compact ? 1 : 0, transform: `translate(-50%, ${s.past("s2Ask") && !compact ? 0 : 10}px)`, transitionTimingFunction: SPRING }}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.75_0.12_70)] to-[oklch(0.55_0.14_40)] text-[10px] font-semibold text-[oklch(0.15_0.03_264)]">EC</span>
        <span>
          <span className="block font-gl-mono text-[9px] uppercase tracking-[0.16em] text-gl-muted-foreground">CFO · to the four finance teams</span>
          <span className="block text-[14px] text-gl-foreground">&ldquo;What was group revenue in Q3?&rdquo;</span>
        </span>
      </div>

      {ENTITIES.map((e, i) => {
        const x = compact ? COMPACT.x : cardX(i);
        const y = compact ? COMPACT.y(i) : CARD.y;
        const sc = compact ? COMPACT.s : 1;
        return (
          <div
            key={e.name}
            className="absolute left-0 top-0 origin-top-left"
            style={{
              transform: `translate(${x}px, ${y + (shown ? 0 : 16)}px) scale(${sc})`,
              opacity: shown && !gone ? 1 : 0,
              transition: `transform 1100ms ${SPRING} ${compact ? i * 90 : i * 80}ms, opacity 700ms ease ${gone ? i * 60 : i * 80}ms`,
            }}
          >
            <div
              className="relative overflow-hidden rounded-[18px] border bg-[linear-gradient(165deg,oklch(0.25_0.04_260/96%),oklch(0.17_0.03_262/96%))] p-6 shadow-[0_30px_70px_-34px_rgb(0_0_0/0.9)]"
              style={{
                width: CARD.w,
                height: CARD.h,
                padding: 24,
                borderColor: agreed ? "oklch(0.8 0.15 75 / 45%)" : clash ? "oklch(0.65 0.2 25 / 40%)" : "oklch(1 0 0 / 10%)",
                transition: "border-color 700ms",
              }}
            >
              <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-2xl" style={{ background: e.hue }} />
              <div className="relative flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: e.hue, boxShadow: `0 0 10px ${e.hue}` }} />
                <span className="font-gl-display text-[15px] tracking-tight text-gl-foreground">{e.name}</span>
              </div>
              <p className="relative mt-1 pl-4 font-gl-mono text-[9.5px] tracking-[0.18em] text-gl-muted-foreground">{e.region}</p>

              <div className="absolute left-6 top-[98px] grid w-[126px] grid-cols-2 gap-[14px]">
                {e.domains.map((d, k) => (
                  <span
                    key={d}
                    className="grid place-items-center rounded-[14px] border border-white/20 bg-white/10"
                    style={{ width: SLOT, height: SLOT, opacity: landed ? 1 : 0, transition: `opacity 220ms ease ${k * 40}ms` }}
                  >
                    <span className="grid h-[30px] w-[30px] place-items-center rounded-[8px] bg-white/[0.92] p-[3px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logoUrl(d)} alt="" width={22} height={22} className="h-[22px] w-[22px] object-contain" />
                    </span>
                  </span>
                ))}
              </div>
              <div className="absolute right-6 top-[100px] w-[78px] text-right transition-opacity duration-500" style={{ opacity: landed ? 1 : 0 }}>
                <p className="font-gl-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-gl-muted-foreground">own chart of accounts</p>
                <p className="mt-2 font-gl-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-gl-muted-foreground">own close calendar</p>
              </div>

              <div className="absolute inset-x-6 top-[238px] border-t border-white/[0.08] pt-3">
                <p className="font-gl-mono text-[9px] uppercase tracking-[0.18em] text-gl-muted-foreground">Q3 revenue · local close</p>
                <p className="mt-1 font-gl-display text-[22px] tabular-nums tracking-tight text-gl-foreground">{e.local}</p>
              </div>

              <div className="absolute inset-x-6 top-[302px] flex items-center justify-between rounded-xl border px-3 py-2 transition-all duration-500" style={{
                opacity: answered ? 1 : 0,
                transform: answered ? "none" : "translateY(6px)",
                borderColor: agreed ? "oklch(0.8 0.15 75 / 45%)" : clash ? "oklch(0.65 0.2 25 / 45%)" : "oklch(1 0 0 / 10%)",
                background: agreed ? "oklch(0.8 0.15 75 / 10%)" : clash ? "oklch(0.65 0.2 25 / 10%)" : "oklch(1 0 0 / 3%)",
              }}>
                <span>
                  <span className="block font-gl-mono text-[8.5px] uppercase tracking-[0.14em] text-gl-muted-foreground">Group revenue</span>
                  <span className="block font-gl-display text-[17px] tabular-nums" style={{ color: agreed ? "var(--gold)" : "var(--foreground)" }}>{agreed ? "$1.42B" : e.claim}</span>
                </span>
                <span
                  className="rounded-full px-2 py-0.5 font-gl-mono text-[8.5px] tracking-[0.12em]"
                  style={{
                    opacity: clash ? 1 : 0,
                    background: agreed ? "oklch(0.8 0.15 75 / 16%)" : "oklch(0.65 0.2 25 / 18%)",
                    color: agreed ? "var(--gold)" : "oklch(0.8 0.14 25)",
                    transition: "opacity 400ms",
                  }}
                >
                  {agreed ? "✓ RECONCILED" : "UNRECONCILED"}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* the spread between the four answers */}
      <div
        className="absolute left-1/2 top-[604px] flex items-center whitespace-nowrap gap-5 rounded-2xl border border-[oklch(0.65_0.2_25/35%)] bg-[oklch(0.2_0.05_25/55%)] px-6 py-3 backdrop-blur transition-all duration-700"
        style={{ opacity: clash && !compact ? 1 : 0, transform: `translate(-50%, ${clash && !compact ? 0 : 10}px)`, transitionTimingFunction: SPRING }}
      >
        {[
          ["4", "answers"],
          ["$90M", "spread"],
          ["11 days", "to close the books"],
          ["0", "shared definitions"],
        ].map(([v, k], n) => (
          <span key={k} className="flex items-baseline gap-2">
            {n > 0 ? <span className="mr-3 h-4 w-px self-center bg-white/15" /> : null}
            <span className="font-gl-display text-[18px] text-[oklch(0.85_0.1_25)]">{v}</span>
            <span className="font-gl-mono text-[9.5px] uppercase tracking-[0.16em] text-gl-muted-foreground">{k}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
