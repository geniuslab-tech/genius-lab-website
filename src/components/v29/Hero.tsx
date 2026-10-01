"use client";

import { useCallback, useState } from "react";
import { INTEGRATION_CHAPTERS, IntegrationDemo, type IntegrationChapter } from "@/components/hero-demo/IntegrationDemo";
import { DemoColumn, HeroCopy, HeroGrid, LogoMarquee, SpotlightBackdrop, StepRail } from "@/components/hero-demo/HeroParts";

/** v29: the hero with a scripted M&A integration demo. */
export function Hero() {
  const [chapter, setChapter] = useState<IntegrationChapter>("close");
  const onChapter = useCallback((c: IntegrationChapter) => setChapter(c), []);
  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <SpotlightBackdrop tint="blue" />
      <HeroGrid
        copy={<HeroCopy after={<LogoMarquee />} />}
        demo={
          <DemoColumn caption={<StepRail steps={INTEGRATION_CHAPTERS} active={chapter} label="M&A integration · live demo" />}>
            <IntegrationDemo onChapter={onChapter} />
          </DemoColumn>
        }
      />
      <div className="h-16 lg:h-20" />
    </section>
  );
}
