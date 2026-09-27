import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { ComponentProps, CSSProperties, ReactNode } from "react";

/** Primary is a lit pill of near-white; ghost is a hairline that runs a beam on hover. */
export function Button({
  tone = "primary",
  size = "md",
  arrow = true,
  className = "",
  children,
  ...rest
}: ComponentProps<"a"> & { tone?: "primary" | "ghost"; size?: "md" | "sm"; arrow?: boolean }) {
  return (
    <a {...rest} className={`v19-btn v19-btn-${tone} ${size === "sm" ? "v19-btn-sm" : ""} ${tone === "ghost" ? "v19-beam" : ""} ${className}`}>
      <span>{children}</span>
      {arrow && <ArrowRight size={14} weight="bold" aria-hidden="true" />}
    </a>
  );
}

/** Section kicker: index, hairline and name, in mono. */
export function Kicker({ n, children, warm = false }: { n?: string; children: ReactNode; warm?: boolean }) {
  return (
    <p className="v19-label flex items-center gap-3 text-[color:var(--tx-3)]">
      {n && <span className={warm ? "text-[color:var(--warm)]" : "text-[color:var(--acc-2)]"}>{n}</span>}
      <span className={`h-px w-6 ${warm ? "bg-[color:var(--warm)]" : "bg-[color:var(--acc)]"}`} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export function SectionHead({
  n,
  kicker,
  title,
  lead,
  id,
  warm,
  center = false,
  className = "",
}: {
  n?: string;
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  id: string;
  warm?: boolean;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={`${center ? "flex flex-col items-center text-center" : ""} ${className}`}>
      <div className="v19-rv">
        <Kicker n={n} warm={warm}>
          {kicker}
        </Kicker>
      </div>
      <h2 id={id} className="v19-rv v19-h2 mt-6 max-w-[20ch]" style={{ "--rd": "60ms" } as CSSProperties}>
        {title}
      </h2>
      {lead && (
        <p className="v19-rv v19-lead mt-6 max-w-[56ch]" style={{ "--rd": "120ms" } as CSSProperties}>
          {lead}
        </p>
      )}
    </div>
  );
}

/** Flat hexagon outline, the approved brand motif. */
export function HexMark({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M7 3h10l5 9-5 9H7l-5-9z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

/** Small label for anything that is a demonstration, not a fact. */
export function Illustrative({ children = "Illustrative", className = "" }: { children?: ReactNode; className?: string }) {
  return <span className={`v19-label rounded-[4px] border border-[color:var(--line-2)] px-1.5 py-0.5 text-[0.625rem] text-[color:var(--tx-3)] ${className}`}>{children}</span>;
}

/** A status dot with an optional live pulse. */
export function Dot({ tone = "acc", live = false }: { tone?: "acc" | "warm" | "ok" | "dim"; live?: boolean }) {
  return <span className={`v19-dot v19-dot-${tone} ${live ? "v19-dot-live" : ""}`} aria-hidden="true" />;
}

/** Per-element delay for staggered reveals. */
export const rd = (ms: number) => ({ "--rd": `${ms}ms` }) as CSSProperties;
