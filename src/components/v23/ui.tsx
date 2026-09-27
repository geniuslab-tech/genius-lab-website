import type { CSSProperties, ReactNode } from "react";

/** Section kicker: a short rule, an index and a name, in mono. Colours follow the surrounding tone. */
export function Kicker({ n, children }: { n?: string; children: ReactNode }) {
  return (
    <p className="v23-label flex items-center gap-3 text-(--tx-3)">
      <span className="h-px w-7 bg-(--accent)" aria-hidden="true" />
      {n && <span className="text-(--accent)">{n}</span>}
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
  className = "",
  titleClass = "max-w-[20ch]",
}: {
  n?: string;
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  id: string;
  className?: string;
  titleClass?: string;
}) {
  return (
    <div className={className}>
      <div data-v23-rv>
        <Kicker n={n}>{kicker}</Kicker>
      </div>
      <h2 id={id} data-v23-rv style={{ "--rd": "60ms" } as CSSProperties} className={`v23-h2 mt-6 ${titleClass}`}>
        {title}
      </h2>
      {lead && (
        <p data-v23-rv style={{ "--rd": "120ms" } as CSSProperties} className="v23-lead mt-6 max-w-[58ch]">
          {lead}
        </p>
      )}
    </div>
  );
}

/** Every figure, answer and dashboard on this page is a demonstration. This says so, visibly. */
export function Illustrative({ children = "Illustrative" }: { children?: ReactNode }) {
  return (
    <span className="v23-label inline-flex items-center gap-1.5 rounded-full border border-(--line-2) px-2 py-0.5 text-[0.625rem] text-(--tx-3)">
      <span className="h-1 w-1 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
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

/** Rendered stagger delay for reveal children. */
export const rd = (ms: number) => ({ "--rd": `${ms}ms` }) as CSSProperties;
