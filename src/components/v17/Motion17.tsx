"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Honours the reader's reduced-motion setting for every motion component on the page. */
export function Motion17({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
