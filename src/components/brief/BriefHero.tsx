"use client";

import { useEffect, useRef, useState } from "react";
import { HeroCopy, HeroGrid, LogoMarquee, SpotlightBackdrop } from "@/components/hero-demo/HeroParts";
import { Reveal } from "@/components/v24/Reveal";
import { BriefDashboard, DASH_W, type Variant } from "./Dashboard";
import { ScriptedBrief } from "./ScriptedBrief";
import { ScriptedBriefMarket } from "./ScriptedBriefMarket";
import { ScriptedBriefTeam } from "./ScriptedBriefTeam";

/** Renders the fixed-width dashboard scaled to its column, bleeding past the right edge like v24. */
function ScaledDashboard({ variant, scripted, team }: { variant: Variant; scripted: boolean; team: false | "circle" | "market" }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ s: number; h: number } | null>(null);
  useEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const update = () => {
      const s = o.clientWidth / DASH_W;
      setFit({ s, h: i.offsetHeight * s });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={outer} className={`relative w-full ${scripted || team ? "" : "lg:w-[calc(100%+4rem)] xl:w-[calc(100%+6rem)]"}`} style={{ height: fit?.h }}>
      <div ref={inner} className="absolute left-0 top-0 origin-top-left" style={{ width: DASH_W, transform: fit ? `scale(${fit.s})` : undefined, opacity: fit ? 1 : 0 }}>
        {team === "market" ? <ScriptedBriefMarket /> : team ? <ScriptedBriefTeam /> : scripted ? <ScriptedBrief variant={variant} /> : <BriefDashboard variant={variant} />}
      </div>
    </div>
  );
}

/** The v24 hero: same copy and stage, with the redesigned briefing dashboard. */
export function BriefHero({
  variant,
  tint = "blue",
  scripted = false,
  team = false,
}: {
  variant: Variant;
  tint?: "blue" | "amber" | "violet";
  scripted?: boolean;
  /** v39.1 shows the agents in a circle, v39.2 as a marketplace. */
  team?: false | "circle" | "market";
}) {
  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <SpotlightBackdrop tint={tint} />
      <HeroGrid
        copy={<HeroCopy after={<LogoMarquee />} />}
        demo={
          <Reveal className="relative min-w-0" delay={150}>
            <div className="glow-breathe pointer-events-none absolute -inset-x-10 -inset-y-8 -z-10 blur-[90px] [background:radial-gradient(ellipse_at_center,oklch(0.7_0.17_252/26%),transparent_70%)]" />
            <div id="demo" className="relative rounded-[1.15rem] shadow-[var(--shadow-glow-blue)]">
              <ScaledDashboard variant={variant} scripted={scripted} team={team} />
            </div>
          </Reveal>
        }
      />
      <div className="h-16 lg:h-20" />
    </section>
  );
}
