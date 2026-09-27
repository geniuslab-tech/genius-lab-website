import type { ReactNode } from "react";
import { InView } from "./InView";

type Tone = "paper" | "navy";

/**
 * A report chapter on the 12-column grid. Columns 1-2 are the margin: the
 * chapter number, its running head and any marginalia, held in place while the
 * chapter scrolls past. Columns 3-12 carry the argument.
 */
export function Chapter({
  id,
  n,
  label,
  title,
  lead,
  note,
  tone = "paper",
  children,
}: {
  id: string;
  n: string;
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  note?: ReactNode;
  tone?: Tone;
  children?: ReactNode;
}) {
  const navy = tone === "navy";
  return (
    <section
      id={id}
      data-chapter={n}
      aria-labelledby={`v10-${id}-title`}
      className={`scroll-mt-16 ${navy ? "on-navy bg-[#101440] text-white" : "border-t border-[color:var(--rule)]"}`}
    >
      <div className="wrap grid grid-cols-12 gap-x-6 py-20 sm:py-28">
        <aside className="col-span-12 mb-10 lg:col-span-2 lg:mb-0" aria-label={`Chapter ${n}`}>
          <div className="lg:sticky lg:top-24">
            <div className={`flex items-baseline gap-3 border-t pt-3 lg:block ${navy ? "border-white/40" : "border-[color:var(--ink)]"}`}>
              <p className={`serif tnum text-[1.75rem] leading-none lg:text-[2.5rem] ${navy ? "text-white" : "text-[color:var(--ink)]"}`}>{n}</p>
              <p className={`caps lg:mt-3 ${navy ? "text-white/70" : "text-[color:var(--slate)]"}`}>{label}</p>
            </div>
            {note && (
              <div className={`mt-8 hidden max-w-[22ch] text-[0.8125rem] leading-[1.6] lg:block ${navy ? "text-white/60" : "text-[color:var(--slate)]"}`}>
                {note}
              </div>
            )}
          </div>
        </aside>

        <div className="col-span-12 min-w-0 lg:col-span-10">
          <header className="grid gap-6 lg:grid-cols-10 lg:gap-6">
            <h2
              id={`v10-${id}-title`}
              data-reveal="up"
              className={`serif text-balance text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.06] lg:col-span-6 ${navy ? "text-white" : "text-[color:var(--ink)]"}`}
            >
              {title}
            </h2>
            {lead && (
              <div
                data-reveal="up"
                data-delay="90"
                className={`text-pretty text-[1.0625rem] leading-[1.7] lg:col-span-4 lg:self-end ${navy ? "text-white/75" : "text-[color:var(--slate)]"}`}
              >
                {lead}
              </div>
            )}
          </header>
          {note && (
            <div className={`mt-6 border-l-2 pl-4 text-[0.875rem] leading-[1.6] lg:hidden ${navy ? "border-white/30 text-white/65" : "border-[color:var(--rule)] text-[color:var(--slate)]"}`}>
              {note}
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}

/** A consulting-style exhibit: numbered caption above, source note below. */
export function Exhibit({
  n,
  title,
  source,
  tone = "paper",
  className = "",
  children,
}: {
  n: number;
  title: ReactNode;
  source: ReactNode;
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  const navy = tone === "navy";
  return (
    <InView as="figure" className={`min-w-0 ${className}`} threshold={0.15}>
      <figcaption className={`mb-8 flex flex-col gap-1 border-t pt-3 sm:flex-row sm:items-baseline sm:gap-4 ${navy ? "border-white/35" : "border-[color:var(--ink)]"}`}>
        <span className={`caps shrink-0 ${navy ? "text-[color:var(--brass-2)]" : "text-[color:var(--brass)]"}`}>Exhibit {n}</span>
        <span className={`text-[0.9375rem] font-medium leading-snug ${navy ? "text-white" : "text-[color:var(--ink)]"}`}>{title}</span>
      </figcaption>
      {children}
      <p className={`mt-6 text-[0.75rem] leading-[1.55] ${navy ? "text-white/55" : "text-[color:var(--slate)]"}`}>
        <span className="font-medium">Source:</span> {source}
      </p>
    </InView>
  );
}

/** The one button style: squared, navy, quietly precise. */
export function Btn({
  href,
  children,
  tone = "navy",
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: "navy" | "paper" | "outline" | "outline-light";
  className?: string;
}) {
  const tones = {
    navy: "bg-[#101440] text-white hover:bg-[#1f2566]",
    paper: "bg-[#f6f3ea] text-[#101440] hover:bg-white",
    outline: "text-[#101440] shadow-[inset_0_0_0_1px_#101440] hover:bg-[#101440] hover:text-white",
    "outline-light": "text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.5)] hover:shadow-[inset_0_0_0_1px_#fff]",
  } as const;
  return (
    <a
      href={href}
      className={`inline-flex h-12 items-center justify-center gap-3 px-6 text-[0.9375rem] font-medium tracking-[0.005em] transition-[background-color,color,box-shadow] duration-200 ${tones[tone]} ${className}`}
    >
      {children}
    </a>
  );
}
