import { InsightField } from "@/components/v2/InsightField";
import { CutButton } from "@/components/v2/ui";

/** Version 2's hero on the closing section's navy ground, with the bottom-right corner cut. */
export function HeroV3() {
  return (
    <section
      data-ground="dark"
      className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden bg-navy text-white [clip-path:polygon(0_0,100%_0,100%_calc(100%-48px),calc(100%-48px)_100%,0_100%)] lg:[clip-path:polygon(0_0,100%_0,100%_calc(100%-120px),calc(100%-120px)_100%,0_100%)]"
      aria-labelledby="v3-hero-title"
    >
      <svg viewBox="0 0 1800 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 -z-20 h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id="hero-v3-light" cx="0.78" cy="0.42" r="0.55">
            <stop offset="0" stopColor="#5577ff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#101440" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1800" height="900" fill="url(#hero-v3-light)" />
      </svg>
      <InsightField tone="dark" className="absolute inset-0 -z-10 h-full w-full [mask-image:linear-gradient(to_bottom,transparent_0,#000_120px)]" />

      <div className="shell flex flex-1 flex-col justify-end pb-10 pt-[calc(var(--nav-h)+2rem)] sm:pb-14 lg:pb-20">
        <h1
          id="v3-hero-title"
          className="type-display max-w-[19ch] text-[clamp(2.25rem,4.6vw,4.4rem)] text-white [font-variation-settings:'wdth'_112]"
        >
          <span className="intro block">Transform Business Complexity</span>
          <span className="intro block [--d:90ms]">into Strategic Advantage</span>
        </h1>

        <div className="mt-8 flex flex-col gap-8 sm:mt-10 lg:flex-row lg:items-center lg:gap-16">
          <p className="intro text-pretty max-w-[44ch] text-[1.0625rem] leading-relaxed text-white/70 [--d:220ms] sm:text-lg">
            We connect your systems and unify your data to deliver clear insights and orchestrate execution, building
            on the software you already rely on.
          </p>
          <div className="intro flex flex-wrap items-center gap-x-8 gap-y-4 [--d:320ms]">
            <CutButton href="#contact" tone="white" size="lg">
              Talk to us
            </CutButton>
            <a
              href="#layers"
              className="text-[0.9375rem] font-medium text-white/80 underline decoration-white/30 underline-offset-[6px] transition-colors hover:text-white"
            >
              See how it works
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
