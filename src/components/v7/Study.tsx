import type { ReactNode } from "react";

/** One framed study: hairline box on a faint grid, a numbered label, a headline and the idea behind the layout. */
export function Study({
  n,
  name,
  title,
  idea,
  children,
}: {
  n: string;
  name: string;
  title: ReactNode;
  idea: string;
  children: ReactNode;
}) {
  const id = `v7-study-${n}`;
  return (
    <section id={`study-${n}`} aria-labelledby={id} className="scroll-mt-20 px-4 sm:px-8">
      <div className="relative mx-auto max-w-[1320px] overflow-hidden border border-white/[0.07] bg-abyss px-5 py-14 sm:px-12 sm:py-20">
        <div className="v7-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -left-48 -top-48 h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgb(77_141_255/0.13),transparent)]"
          aria-hidden="true"
        />
        <header className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="v6-label">
              <span className="text-sky">{n}</span>
              <span className="ml-3 text-white/50">{name}</span>
            </p>
            <h2 id={id} data-reveal="up" className="v6-display mt-5 max-w-[20ch] text-[clamp(1.875rem,3.4vw,3rem)] text-white">
              {title}
            </h2>
          </div>
          <p className="max-w-[40ch] text-[0.9375rem] leading-[1.65] text-white/50 md:text-right">{idea}</p>
        </header>
        <div className="relative mt-12 border-t border-white/[0.07] pt-12 sm:mt-14 sm:pt-14">{children}</div>
      </div>
    </section>
  );
}

/** Mono caption for the three zones the reference names above the stack. */
export function Zone({ children, accent = false, className = "" }: { children: ReactNode; accent?: boolean; className?: string }) {
  return <p className={`v6-label text-[0.625rem] ${accent ? "text-sky" : "text-white/35"} ${className}`}>{children}</p>;
}
