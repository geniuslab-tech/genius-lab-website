"use client";

import { Shdr01 } from "@/components/ui/shdr-01";
import type { OrbState } from "@/components/ui/orbkit-core";

/**
 * Reusable Genius agent orb, built on OrbKit's SHDR-01. The three states map to the
 * agent's lifecycle: idle (waiting), thinking (reasoning over the Second Brain) and
 * speaking (answering).
 */
export function AgentOrb({
  state,
  size = 300,
  className = "",
  label = "Genius agent",
}: {
  state: OrbState;
  size?: number;
  className?: string;
  label?: string;
}) {
  return <Shdr01 state={state} size={size} className={className} ariaLabel={`${label}, ${state}`} />;
}

export type { OrbState };
