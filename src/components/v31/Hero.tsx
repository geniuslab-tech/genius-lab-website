"use client";

import { PremiumHero } from "@/components/hero-demo/PremiumHero";
import { SCENARIO_CHAPTERS, SCENARIO_SPANS, ScenarioDemo } from "@/components/hero-demo/ScenarioDemo";

const PROOF = [
  { k: "Live", v: "every scenario recomputed across 14 entities" },
  { k: "3", v: "levers priced on your own data" },
  { k: "1.9x", v: "covenant headroom restored" },
  { k: "Auto", v: "contingency fires the day the risk lands" },
];

/** v31 — premium. The CFO stress-tests the plan by hand, and Genius prices the way out. */
export function Hero() {
  return (
    <PremiumHero
      chapters={SCENARIO_CHAPTERS}
      spans={SCENARIO_SPANS}
      initial="levers"
      proof={PROOF}
      narrationLabel="Stress-test the plan before the market does"
      renderDemo={(onChapter) => <ScenarioDemo cinematic onChapter={onChapter} />}
    />
  );
}
