"use client";

const actions = [
  {
    title: "Release $1.4M of Southeast inventory",
    meta: "Cash flow +$1.4M · confidence 92% · owner: COO",
    cta: "Approve",
  },
  {
    title: "Hold price floor on 1,284 SKUs",
    meta: "Margin +120bp · $8.6M annualised · owner: CRO",
    cta: "Review",
  },
  {
    title: "Dual-source Tier-1 supplier — 3 plants",
    meta: "Protects $22.6M of at-risk revenue · owner: Supply Chain",
    cta: "Execute",
  },
  {
    title: "Sign off group close — 4 entities reconciled",
    meta: "Close cycle −3 days · board pack ready Thursday · owner: CFO",
    cta: "Approve",
  },
];

/**
 * The Executive Briefing surface, lifted out of the dashboard so the
 * cinematic can hold on it as its own act.
 */
export function ExecutiveBriefing() {
  return (
    <div className="rounded-2xl border border-gl-data/25 bg-charcoal/60 p-7 ring-1 ring-inset ring-gl-data/10 backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <p className="flex items-center gap-2.5 font-gl-display text-[1.05rem] tracking-tight">
          <span className="h-2 w-2 rounded-full bg-gl-data" />
          Executive Briefing
        </p>
        <span className="font-gl-mono text-[0.62rem] uppercase tracking-[0.16em] text-gl-muted-foreground/60">
          Today · 06:12 · generated for the CEO
        </span>
      </div>

      <div className="space-y-3 text-[0.95rem] leading-relaxed text-gl-foreground/88">
        <p>
          The quarter is <span className="text-gl-data">ahead of plan</span>. Revenue is tracking{" "}
          <span className="text-gl-data">6.4% above forecast</span> and EBITDA improved{" "}
          <span className="text-gl-data">1.2 points</span>, carried by Industrial North and EMEA
          distribution.
        </p>
        <p className="text-gl-muted-foreground">
          The one real risk is cash. <span className="text-gl-gold">Southeast inventory</span> is tying
          up working capital as demand slows, leaving free cash flow{" "}
          <span className="text-gl-gold">$4.2M behind plan</span> — and a Tier-1 supplier is slipping
          on deliveries to three plants, putting{" "}
          <span className="text-gl-gold">$22.6M of revenue</span> at risk.
        </p>
        <p className="text-gl-muted-foreground">
          The opportunity is pricing: holding the floor in Retail Direct is worth{" "}
          <span className="text-gl-data">120bp of margin</span>. Overnight I reconciled four entities,
          found <span className="text-gl-gold">$1.4M in inventory optimisation</span> and completed{" "}
          <span className="text-gl-foreground/90">327 workflows</span>.
        </p>
        <p>
          My recommendation: approve the inventory release today, then review pricing before the
          board pack goes out Thursday.
        </p>
      </div>

      <p className="mt-7 mb-3 text-[0.62rem] uppercase tracking-[0.18em] text-gl-muted-foreground/60">
        Recommended actions
      </p>
      <ul className="space-y-2.5">
        {actions.map((p) => (
          <li
            key={p.title}
            className="flex items-center justify-between gap-4 rounded-xl border border-gl-border/60 bg-gl-navy/50 px-4 py-3"
          >
            <span className="min-w-0">
              <span className="block truncate text-[0.85rem] text-gl-foreground/90">{p.title}</span>
              <span className="block truncate text-[0.7rem] text-gl-muted-foreground/70">{p.meta}</span>
            </span>
            <span className="shrink-0 rounded-lg border border-gl-gold/40 bg-gl-gold/10 px-3 py-1 text-[0.7rem] text-gl-gold">
              {p.cta}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
