"use client";

import "./brief.css";

export type OrbState = "thinking" | "typing" | "holding";

/**
 * The agent's presence. A glass sphere over a slowly turning aurora: it spins
 * faster and shimmers while thinking, ripples while it writes, and settles to
 * a soft breath while it waits on you.
 */
export function GeniusOrb({ state, size = 40, tone = "blue" }: { state: OrbState; size?: number; tone?: "blue" | "gold" }) {
  return (
    <span className={`gorb gorb-${state} gorb-${tone}`} style={{ width: size, height: size }} aria-hidden="true">
      <span className="gorb-halo" />
      {state === "typing" ? (
        <>
          <span className="gorb-ring" />
          <span className="gorb-ring gorb-ring-2" />
        </>
      ) : null}
      <span className="gorb-aurora" />
      <span className="gorb-glass" />
      <span className="gorb-spec" />
    </span>
  );
}

/** Live voice waveform shown beside the orb while it speaks. */
export function Waveform({ active, bars = 18, className = "" }: { active: boolean; bars?: number; className?: string }) {
  return (
    <span className={`gwave ${active ? "gwave-on" : ""} ${className}`} aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => (
        <span key={i} style={{ animationDelay: `${(i * 97) % 700}ms`, height: `${30 + ((i * 37) % 70)}%` }} />
      ))}
    </span>
  );
}

export function stageLabel(stage: OrbState, area: string) {
  return stage === "thinking" ? `Reading 14 entities · ${area.toLowerCase()}…` : stage === "typing" ? "Writing insight…" : "Insight ready";
}
