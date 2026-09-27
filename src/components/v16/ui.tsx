import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { ComponentProps, ReactNode } from "react";

export function Button({
  tone = "primary",
  size = "md",
  arrow = true,
  className = "",
  children,
  ...rest
}: ComponentProps<"a"> & { tone?: "primary" | "ghost"; size?: "md" | "sm"; arrow?: boolean }) {
  return (
    <a {...rest} className={`v16-btn v16-btn-${tone} ${size === "sm" ? "v16-btn-sm" : ""} ${className}`}>
      <span>{children}</span>
      {arrow && <ArrowRight size={15} weight="bold" aria-hidden="true" />}
    </a>
  );
}

/** Section kicker: a lit tick, an index and a name, in mono. */
export function Kicker({ n, children, warm = false }: { n?: string; children: ReactNode; warm?: boolean }) {
  return (
    <p className="v16-label flex items-center gap-3 text-[color:var(--tx-3)]">
      <span className={`h-px w-8 ${warm ? "bg-[color:var(--warm)]" : "bg-[color:var(--ice)]"}`} aria-hidden="true" />
      {n && <span className={warm ? "text-[color:var(--warm)]" : "text-[color:var(--ice)]"}>{n}</span>}
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
  className = "",
}: {
  n?: string;
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  id: string;
  warm?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <Kicker n={n} warm={warm}>
        {kicker}
      </Kicker>
      <h2 id={id} className="v16-h2 mt-6 max-w-[20ch]">
        {title}
      </h2>
      {lead && <p className="v16-lead mt-6 max-w-[56ch]">{lead}</p>}
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
