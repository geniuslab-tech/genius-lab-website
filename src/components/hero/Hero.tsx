import { TerrainField } from "./TerrainField";
import { Button, TextLink } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden" aria-labelledby="hero-title">
      <TerrainField className="absolute inset-0 -z-10 h-full w-full [mask-image:linear-gradient(to_bottom,transparent_0,#000_120px)]" />

      <div className="shell flex flex-1 flex-col justify-end pb-10 pt-[calc(var(--nav-h)+2rem)] sm:pb-14 lg:pb-20">
        <h1
          id="hero-title"
          className="type-display text-[clamp(2.4rem,6.6vw,6rem)]"
        >
          <span className="intro block">From raw data</span>
          <span className="intro block [--d:90ms]">to intelligence.</span>
        </h1>

        <div className="mt-8 flex flex-col gap-8 sm:mt-10 lg:flex-row lg:items-center lg:gap-16">
          <p
            className="intro [--d:220ms] text-pretty max-w-[36ch] text-[1.0625rem] leading-relaxed text-ink-2 sm:text-lg"
          >
            Genius Lab engineers the pipelines, models and AI that turn scattered business data into
            decisions you can defend.
          </p>
          <div className="intro [--d:320ms] flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button href="#contact" size="lg">
              Talk to us
            </Button>
            <TextLink href="#platform" className="text-[0.9375rem]">
              See the platform
            </TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
