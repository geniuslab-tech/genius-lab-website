"use client";

import { useCallback, useState } from "react";
import { INBOX_CHAPTERS, InboxDemo, type InboxChapter } from "@/components/hero-demo/InboxDemo";
import { DemoColumn, HeroCopy, HeroGrid, LogoMarquee, SpotlightBackdrop, StepRail } from "@/components/hero-demo/HeroParts";

/** v30: the hero with a scripted decision inbox demo. */
export function Hero() {
  const [chapter, setChapter] = useState<InboxChapter>("overnight");
  const onChapter = useCallback((c: InboxChapter) => setChapter(c), []);
  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <SpotlightBackdrop tint="violet" />
      <HeroGrid
        copy={<HeroCopy after={<LogoMarquee />} />}
        demo={
          <DemoColumn caption={<StepRail steps={INBOX_CHAPTERS} active={chapter} label="Decision inbox · live demo" />}>
            <InboxDemo onChapter={onChapter} />
          </DemoColumn>
        }
      />
      <div className="h-16 lg:h-20" />
    </section>
  );
}
