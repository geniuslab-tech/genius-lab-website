"use client";

import { useCallback, useState } from "react";
import { ApproveDemo, CHAPTERS, type Chapter } from "@/components/hero-demo/ApproveDemo";
import { DemoColumn, HeroCopy, HeroGrid, LogoMarquee, SpotlightBackdrop, StepRail } from "@/components/hero-demo/HeroParts";

/** v25: the v24 hero, with the dashboard replaced by a scripted approve-and-execute demo. */
export function Hero() {
  const [chapter, setChapter] = useState<Chapter>("signal");
  const onChapter = useCallback((c: Chapter) => setChapter(c), []);
  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <SpotlightBackdrop />
      <HeroGrid
        copy={<HeroCopy after={<LogoMarquee />} />}
        demo={
          <DemoColumn caption={<StepRail steps={CHAPTERS} active={chapter} />}>
            <ApproveDemo onChapter={onChapter} />
          </DemoColumn>
        }
      />
      <div className="h-16 lg:h-20" />
    </section>
  );
}
