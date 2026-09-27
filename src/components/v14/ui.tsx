import type { ComponentProps, CSSProperties, ReactNode } from "react";

export const U = "#1f3bff";

type BtnTone = "u" | "w" | "k";

/** Square control with a hard offset shadow. Pressing it moves it into its own shadow. */
export function Btn({ tone = "u", children, className = "", ...rest }: ComponentProps<"a"> & { tone?: BtnTone }) {
  return (
    <a {...rest} className={`v14-btn v14-btn--${tone} ${className}`}>
      <span>{children}</span>
      <span className="v14-arrow" aria-hidden="true">
        &rarr;
      </span>
    </a>
  );
}

/**
 * Splits text into per-letter spans for the stepped hover shift and the rising reveal.
 * Screen readers get the plain string once.
 */
export function Split({ text, className = "", start = 0 }: { text: string; className?: string; start?: number }) {
  let i = start;
  const words = text.split(" ");
  return (
    <span className={`v14-split ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, wi) => (
          <span key={wi}>
            <span className="v14-word">
              {Array.from(w).map((c, ci) => (
                <span key={ci} className="v14-ch" style={{ "--i": i++ } as CSSProperties}>
                  {c}
                </span>
              ))}
            </span>
            {wi < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Raw mono label. */
export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`v14-mono ${className}`}>{children}</p>;
}

/**
 * Every section is a table: a narrow index column with an oversized sticky number,
 * and a content column. 2px black rules separate them.
 */
export function Section({
  id,
  n,
  label,
  titleId,
  blue = false,
  children,
}: {
  id: string;
  n: string;
  label: string;
  titleId: string;
  blue?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={`scroll-mt-14 border-b-2 border-black ${blue ? "v14-blue bg-[#1f3bff] text-white" : "bg-white text-black"}`}
    >
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]">
        <div className="border-black max-lg:border-b-2 lg:border-r-2">
          <div className="flex items-end justify-between gap-4 px-4 py-4 sm:px-6 lg:sticky lg:top-14 lg:flex-col lg:items-start lg:py-6">
            <Label className={blue ? "text-white" : "text-black"}>
              <span className="mr-2 inline-block h-2.5 w-2.5 bg-current align-[-1px]" aria-hidden="true" />
              {label}
            </Label>
            <span
              aria-hidden="true"
              className={`v14-display block text-[clamp(4.5rem,13vw,15rem)] leading-[0.76] ${blue ? "text-white" : "text-[#1f3bff]"}`}
            >
              {n}
            </span>
          </div>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

/** Section title row: big condensed headline, optional lead in a side cell. */
export function Head({
  id,
  title,
  lead,
  blue = false,
}: {
  id: string;
  title: ReactNode;
  lead?: ReactNode;
  blue?: boolean;
}) {
  return (
    <div className="grid border-b-2 border-black xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
      <h2 id={id} data-r="" className="v14-head px-4 pb-8 pt-6 text-[clamp(2.75rem,6.6vw,7.25rem)] sm:px-6 sm:pt-8">
        {title}
      </h2>
      {lead ? (
        <div className="flex items-end border-black px-4 pb-8 sm:px-6 max-xl:pt-0 xl:border-l-2 xl:pt-8">
          <p data-r="" style={{ "--d": "120ms" } as CSSProperties} className={`text-pretty max-w-[46ch] text-[1.0625rem] leading-[1.6] ${blue ? "text-white" : "text-black"}`}>
            {lead}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
