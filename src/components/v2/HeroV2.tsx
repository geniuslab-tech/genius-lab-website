import { InsightField } from "./InsightField";
import { CutButton } from "./ui";

/** Version 1's hero composition, carrying Version 2's copy and the agent-read terrain. */
export function HeroV2() {
  return (
    <section className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden" aria-labelledby="v2-hero-title">
      <InsightField className="absolute inset-0 -z-10 h-full w-full [mask-image:linear-gradient(to_bottom,transparent_0,#000_120px)]" />

      <div className="shell flex flex-1 flex-col justify-end pb-10 pt-[calc(var(--nav-h)+2rem)] sm:pb-14 lg:pb-20">
        <h1
          id="v2-hero-title"
          className="type-display max-w-[19ch] text-[clamp(2.25rem,4.6vw,4.4rem)] text-navy [font-variation-settings:'wdth'_112]"
        >
          <span className="intro block">Transform Business Complexity</span>
          <span className="intro block [--d:90ms]">into Strategic Advantage</span>
        </h1>

        <div className="mt-8 flex flex-col gap-8 sm:mt-10 lg:flex-row lg:items-center lg:gap-16">
          <p className="intro text-pretty max-w-[44ch] text-[1.0625rem] leading-relaxed text-navy/70 [--d:220ms] sm:text-lg">
            We connect your systems and unify your data to deliver clear insights and orchestrate execution, building
            on the software you already rely on.
          </p>
          <div className="intro flex flex-wrap items-center gap-x-8 gap-y-4 [--d:320ms]">
            <CutButton href="#contact" tone="navy" size="lg">
              Talk to us
            </CutButton>
            <a
              href="#layers"
              className="text-[0.9375rem] font-medium text-navy underline decoration-navy/30 underline-offset-[6px] transition-colors hover:decoration-signal-ink"
            >
              See how it works
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
