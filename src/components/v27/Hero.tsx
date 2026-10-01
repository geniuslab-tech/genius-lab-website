"use client";

import { useCallback, useState } from "react";
import { COMMAND_CHAPTERS, CommandDemo, type CommandChapter } from "@/components/hero-demo/CommandDemo";
import { DemoColumn, HeroCopy, HeroGrid, LogoMarquee, SpotlightBackdrop, StepRail } from "@/components/hero-demo/HeroParts";

/** v27: the hero with a scripted Ask Genius demo — question, answer, decision, board update. */
export function Hero() {
  const [chapter, setChapter] = useState<CommandChapter>("ask");
  const onChapter = useCallback((c: CommandChapter) => setChapter(c), []);
  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <SpotlightBackdrop tint="violet" />
      <HeroGrid
        copy={<HeroCopy after={<LogoMarquee />} />}
        demo={
          <DemoColumn caption={<StepRail steps={COMMAND_CHAPTERS} active={chapter} label="Ask Genius · live demo" />}>
            <CommandDemo onChapter={onChapter} />
          </DemoColumn>
        }
      />
      <div className="h-16 lg:h-20" />
    </section>
  );
}
