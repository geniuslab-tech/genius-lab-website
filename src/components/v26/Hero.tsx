"use client";

import { useCallback, useState } from "react";
import { MARGIN_CHAPTERS, MarginDemo, type MarginChapter } from "@/components/hero-demo/MarginDemo";
import { DemoColumn, HeroCopy, HeroGrid, LogoMarquee, SpotlightBackdrop, StepRail } from "@/components/hero-demo/HeroParts";

/** v26: the hero with a scripted margin-recovery demo — detect, diagnose, approve, roll out. */
export function Hero() {
  const [chapter, setChapter] = useState<MarginChapter>("detect");
  const onChapter = useCallback((c: MarginChapter) => setChapter(c), []);
  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <SpotlightBackdrop tint="amber" />
      <HeroGrid
        copy={<HeroCopy after={<LogoMarquee />} />}
        demo={
          <DemoColumn caption={<StepRail steps={MARGIN_CHAPTERS} active={chapter} label="Margin recovery · live demo" />}>
            <MarginDemo onChapter={onChapter} />
          </DemoColumn>
        }
      />
      <div className="h-16 lg:h-20" />
    </section>
  );
}
