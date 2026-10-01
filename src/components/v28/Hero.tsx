"use client";

import { ApproveDemo, CHAPTERS, CHAPTER_SPANS } from "@/components/hero-demo/ApproveDemo";
import { PremiumHero } from "@/components/hero-demo/PremiumHero";

const PROOF = [
  { k: "38s", v: "from approval to execution" },
  { k: "5", v: "systems orchestrated, no new software" },
  { k: "100%", v: "of actions signed and audited" },
  { k: "$1.4M", v: "cash released in one decision" },
];

/**
 * v28 — premium. The same story as v25, directed like a product film: the
 * camera pushes in on the action and the copy narrates each chapter.
 */
export function Hero() {
  return (
    <PremiumHero
      chapters={CHAPTERS}
      spans={CHAPTER_SPANS}
      initial="recommend"
      proof={PROOF}
      renderDemo={(onChapter) => <ApproveDemo cinematic onChapter={onChapter} />}
    />
  );
}
