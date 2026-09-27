import type { CSSProperties, ElementType, ReactNode } from "react";

/**
 * Headline set for the line-by-line mask reveal. Wrap italic runs in *asterisks*.
 * Words are split on the server; the motion controller groups them into rendered lines.
 */
export function Lines({
  text,
  as: Tag = "span",
  id,
  className = "",
  delay = 0,
  italicClass = "italic",
}: {
  text: string;
  as?: ElementType;
  id?: string;
  className?: string;
  delay?: number;
  italicClass?: string;
}) {
  const words = text
    .split("*")
    .flatMap((run, r) => run.split(/\s+/).filter(Boolean).map((word) => ({ word, italic: r % 2 === 1 })));
  return (
    <Tag id={id} data-v8="lines" className={className} style={{ "--d": `${delay}ms` } as CSSProperties}>
      {words.map(({ word, italic }, k) => (
        <span key={k}>
          <span className="w">
            <span className={`wi ${italic ? italicClass : ""}`}>{word}</span>
          </span>{" "}
        </span>
      ))}
    </Tag>
  );
}

/** A drawn hairline rule. */
export function Rule({ className = "", ink = false, delay = 0 }: { className?: string; ink?: boolean; delay?: number }) {
  return (
    <div
      aria-hidden="true"
      data-v8="rule"
      className={`${ink ? "hair-ink" : "hair"} ${className}`}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    />
  );
}

/** Fade-up wrapper. */
export function Up({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
}) {
  return (
    <Tag data-v8="up" className={className} style={{ "--d": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}

/**
 * Chapter opener: running head, roman numeral, kicker and headline, uncovered like a turned page.
 */
export function Opener({
  numeral,
  kicker,
  title,
  titleId,
  folio,
  dark = false,
  children,
}: {
  numeral: string;
  kicker: string;
  title: string;
  titleId: string;
  folio: string;
  dark?: boolean;
  children?: ReactNode;
}) {
  const muted = dark ? "text-[color:var(--paper)]/60" : "text-[color:var(--ink-3)]";
  return (
    <header className="relative">
      <div className={`flex items-baseline justify-between gap-6 ${muted}`}>
        <p className="label">
          <span className="text-[color:var(--red)]">Chapter {numeral}</span>
          <span aria-hidden="true"> &nbsp;/&nbsp; </span>
          {kicker}
        </p>
        <p className="label hidden sm:block" aria-hidden="true">
          The Intelligence Issue &nbsp;·&nbsp; p. {folio}
        </p>
      </div>
      <Rule ink={!dark} className={`mt-3 ${dark ? "!bg-[color:var(--paper)]/40" : ""}`} />
      <div data-v8="turn" className="grid gap-x-8 gap-y-4 pt-8 md:grid-cols-12 md:pt-10">
        <p
          aria-hidden="true"
          className={`f-display text-[clamp(5rem,13vw,11rem)] leading-[0.78] md:col-span-3 ${dark ? "text-[color:var(--paper)]/25" : "text-[color:var(--paper-3)]"}`}
        >
          {numeral}
        </p>
        <div className="md:col-span-9">
          <Lines
            as="h2"
            id={titleId}
            text={title}
            className="f-display text-balance text-[clamp(2.6rem,6.4vw,5.75rem)]"
            italicClass={`italic ${dark ? "text-[color:var(--paper)]" : "text-[color:var(--red)]"}`}
          />
          {children}
        </div>
      </div>
    </header>
  );
}

/** Figure caption in the magazine convention: bold figure label, then the caption. */
export function Caption({ fig, children, className = "" }: { fig: string; children: ReactNode; className?: string }) {
  return (
    <figcaption className={`smallcaps mt-3 flex gap-3 leading-[1.5] text-[color:var(--ink-3)] ${className}`}>
      <span className="shrink-0 font-bold text-[color:var(--ink)]">{fig}</span>
      <span>{children}</span>
    </figcaption>
  );
}

export const shell = "mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-10";
