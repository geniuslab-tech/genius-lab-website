"use client";

import { LAYERS, STEP_MS, layerButton, useLayerCycle } from "./shared";

function DataViz() {
  const src = ["ERP", "CRM", "FIN", "MES", "WMS", "HRIS", "XLS", "+"];
  return (
    <div className="flex h-full items-center gap-5">
      <div className="grid grid-cols-2 gap-1.5">
        {src.map((s, i) => (
          <span key={s} className="band-in rounded-md border border-gl-data/40 bg-gl-data/10 px-2 py-1 text-center font-gl-mono text-[0.55rem] text-gl-data" style={{ animationDelay: `${i * 60}ms` }}>
            {s}
          </span>
        ))}
      </div>
      <svg viewBox="0 0 160 120" className="h-[120px] w-[160px]" aria-hidden="true">
        {[10, 38, 66, 94].map((y, i) => (
          <path key={y} d={`M0 ${y} C 70 ${y}, 80 60, 150 60`} fill="none" stroke="var(--data)" strokeOpacity="0.5" strokeWidth="1" className="band-draw" style={{ animationDelay: `${200 + i * 90}ms` }} />
        ))}
        <circle cx="150" cy="60" r="6" fill="var(--cyan)" className="band-in" style={{ animationDelay: "600ms" }} />
      </svg>
      <div className="band-in" style={{ animationDelay: "700ms" }}>
        <p className="font-gl-mono text-[0.55rem] uppercase tracking-[0.16em] text-gl-muted-foreground">Trusted foundation</p>
        <p className="font-gl-display text-[1.6rem] tracking-tight text-gl-foreground">2.4M records</p>
        <p className="text-[0.7rem] text-gl-muted-foreground">harmonised · 14 entities · synced 2 min ago</p>
      </div>
    </div>
  );
}

function ContextViz() {
  const items = [
    ["Call transcript", "“Southeast distributors are pushing back on lead times…”"],
    ["Email · Ops", "“Plant 3 will be down for maintenance next week.”"],
    ["Direct input", "“Prioritise margin over volume in Q4.”"],
  ];
  return (
    <div className="flex h-full items-center gap-3">
      {items.map(([k, v], i) => (
        <div key={k} className="band-in w-[15rem] rounded-xl border border-[oklch(0.85_0.11_205/30%)] bg-[oklch(0.85_0.11_205/6%)] p-3" style={{ animationDelay: `${i * 160}ms` }}>
          <p className="font-gl-mono text-[0.52rem] uppercase tracking-[0.14em] text-[var(--cyan)]">{k}</p>
          <p className="mt-1.5 text-[0.74rem] leading-snug text-gl-foreground/85">{v}</p>
        </div>
      ))}
    </div>
  );
}

function GovViz() {
  const rows = [
    ["Finance data", "CFO office · Board"],
    ["HR data", "HR only · masked for AI"],
    ["Agent actions", "Propose · act with approval"],
  ];
  return (
    <div className="flex h-full items-center gap-6">
      <div className="space-y-2">
        {rows.map(([k, v], i) => (
          <div key={k} className="band-in flex w-[22rem] items-center justify-between rounded-lg border border-gl-border/70 bg-gl-background/40 px-3 py-2" style={{ animationDelay: `${i * 120}ms` }}>
            <div>
              <p className="text-[0.74rem] text-gl-foreground">{k}</p>
              <p className="font-gl-mono text-[0.55rem] text-gl-muted-foreground">{v}</p>
            </div>
            <span className="relative inline-flex h-[18px] w-8 items-center rounded-full bg-gl-data/80">
              <span className="band-toggle absolute h-3.5 w-3.5 rounded-full bg-white" style={{ animationDelay: `${300 + i * 120}ms` }} />
            </span>
          </div>
        ))}
      </div>
      <div className="band-in text-center" style={{ animationDelay: "500ms" }}>
        <svg viewBox="0 0 40 46" className="mx-auto h-12 w-12 text-gl-data" aria-hidden="true">
          <path d="M20 3 36 9v12c0 11-7 18-16 22C11 39 4 32 4 21V9Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
          <path d="m13 23 5 5 9-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="band-draw" style={{ animationDelay: "700ms" }} />
        </svg>
        <p className="mt-2 font-gl-mono text-[0.55rem] uppercase tracking-[0.14em] text-gl-muted-foreground">Human oversight on</p>
      </div>
    </div>
  );
}

function IntelViz() {
  return (
    <div className="flex h-full items-center gap-6">
      <div className="w-[17rem] rounded-xl border border-gl-border/70 bg-gl-background/40 p-3">
        <p className="font-gl-mono text-[0.52rem] uppercase tracking-[0.14em] text-gl-muted-foreground">Gross margin · Southeast</p>
        <svg viewBox="0 0 240 70" className="mt-1 h-[70px] w-full" aria-hidden="true">
          <path d="M0 18 C 30 16, 50 20, 80 19 S 120 24, 140 34 S 190 52, 240 56" fill="none" stroke="var(--gold)" strokeWidth="2" className="band-draw" />
          <circle cx="140" cy="34" r="4" fill="var(--gold)" className="band-in" style={{ animationDelay: "800ms" }} />
        </svg>
      </div>
      <div className="band-in max-w-[22rem]" style={{ animationDelay: "500ms" }}>
        <p className="font-gl-mono text-[0.55rem] uppercase tracking-[0.16em] text-[var(--cyan)]">AI insight · why it happened</p>
        <p className="mt-1.5 text-[0.95rem] leading-snug text-gl-foreground">
          Margin fell 2.6pp because reps discount <span className="text-gl-gold">1,284 long-tail SKUs</span> by hand. A price floor recovers 120bp.
        </p>
      </div>
    </div>
  );
}

function ExecViz() {
  const steps = ["Insight", "Decision", "Approval", "Write-back", "Done"];
  return (
    <div className="flex h-full items-center">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="band-in flex flex-col items-center gap-2" style={{ animationDelay: `${i * 220}ms` }}>
            <span className={`grid h-10 w-10 place-items-center rounded-full border ${i === steps.length - 1 ? "border-gl-gold bg-gl-gold text-gl-background" : "border-gl-gold/50 bg-gl-gold/10 text-gl-gold"}`}>
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
                <path d="m3.5 8.4 2.9 2.9 6.1-6.6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="font-gl-mono text-[0.58rem] uppercase tracking-[0.12em] text-gl-foreground/75">{s}</span>
          </div>
          {i < steps.length - 1 ? (
            <span className="mx-3 mb-6 block h-px w-14 overflow-hidden bg-gl-gold/20">
              <span className="band-fill block h-px bg-gl-gold" style={{ animationDelay: `${i * 220 + 120}ms` }} />
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

const VIZ = [DataViz, ContextViz, GovViz, IntelViz, ExecViz];

/**
 * Living bands. The stack as full-width strata: the active band opens to show
 * that layer actually working — sources converging, context arriving, policies
 * switching on, an insight forming, an action completing.
 */
export function V6Bands() {
  const { ref, active, select, running, held } = useLayerCycle();
  return (
    <div ref={ref} className="md:pl-16 lg:pl-32">
      <div className="flex flex-col-reverse gap-2">
        {LAYERS.map((layer, i) => {
          const on = i === active;
          const Viz = VIZ[i]!;
          const gold = layer.accent === "gold";
          return (
            <div
              key={layer.number}
              {...layerButton(i, select, `Show ${layer.name}`)}
              className={`relative cursor-pointer overflow-hidden rounded-2xl border outline-none transition-[border-color,background-color] duration-700 ${
                on ? (gold ? "border-gl-gold/45 bg-gl-gold/[0.05]" : "border-gl-data/40 bg-gl-data/[0.05]") : "border-gl-foreground/[0.08] hover:border-gl-foreground/15"
              }`}
            >
              {on ? (
                <span className="absolute inset-x-0 top-0 h-[2px] overflow-hidden bg-gl-foreground/5">
                  <span
                    key={active}
                    className={`absolute inset-y-0 left-0 ${gold ? "bg-gl-gold" : "bg-gl-data"} ${running && !held ? "layers-progress" : "w-full"}`}
                    style={{ animationDuration: `${STEP_MS}ms` }}
                  />
                </span>
              ) : null}
              <div className="flex items-center gap-6 px-6 py-4">
                <span className={`font-gl-mono text-[0.75rem] tracking-[0.18em] ${on ? (gold ? "text-gl-gold" : "text-gl-data") : "text-gl-foreground/35"}`}>{layer.number}</span>
                <span className={`font-gl-display text-[1.25rem] tracking-[-0.01em] ${on ? "text-gl-foreground" : "text-gl-foreground/60"}`}>{layer.name}</span>
                <span className="h-px flex-1 bg-gl-foreground/[0.07]" />
                <span className={`hidden font-gl-mono text-[0.58rem] uppercase tracking-[0.1em] transition-opacity duration-500 md:block ${on ? "opacity-0" : "text-gl-foreground/35"}`}>
                  {layer.details.slice(0, 3).join(" · ")}
                </span>
              </div>
              <div className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="grid grid-cols-1 items-center gap-6 px-6 pb-6 pt-1 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-10">
                    <p className="font-gl-display text-[1.05rem] leading-[1.5] text-gl-foreground/80">{layer.summary}</p>
                    <div key={on ? `on-${i}` : `off-${i}`} className="h-[150px] min-w-0 overflow-hidden">
                      {on ? <Viz /> : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
