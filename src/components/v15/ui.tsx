import type { CSSProperties, ComponentProps, ReactNode } from "react";

/** Transition delay for a [data-lx] reveal. */
export const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** Round a number for SVG attributes, so server and client strings agree. */
export const r1 = (v: number) => Math.round(v * 10) / 10;

export function Kicker({ n, children, className = "" }: { n?: string; children: ReactNode; className?: string }) {
  return (
    <p data-lx="fade" className={`lx-caps lx-gold flex items-center gap-4 ${className}`}>
      {n && <span className="lx-num text-[0.95rem] tracking-[0.08em]">{n}</span>}
      {n && <span className="lx-hair w-8" aria-hidden="true" />}
      <span>{children}</span>
    </p>
  );
}

export function LxButton({ children, className = "", ...rest }: ComponentProps<"a">) {
  return (
    <a {...rest} className={`lx-btn ${className}`}>
      {children}
    </a>
  );
}

export function LxLink({ children, className = "", ...rest }: ComponentProps<"a">) {
  return (
    <a {...rest} className={`lx-link ${className}`}>
      {children}
      <span aria-hidden="true" className="lx-serif text-[1rem] tracking-normal">
        &rarr;
      </span>
    </a>
  );
}

export const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
