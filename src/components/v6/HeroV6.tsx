import { ConsoleV6 } from "./ConsoleV6";
import { Button } from "./ui";

/** Placeholder client marks, to be replaced with approved logos. */
const LOGOS = ["Vanta Group", "Helios", "Caldera", "Orbis", "Stratum", "Northpeak"];

export function HeroV6() {
  return (
    <section
      className="relative isolate overflow-hidden bg-abyss pt-[4.5rem] text-white"
      aria-labelledby="v6-hero-title"
    >
      {/* Ground: deep navy with a lit edge on the product side. */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_18%_30%,#0f2748_0%,transparent_70%),radial-gradient(ellipse_60%_70%_at_85%_60%,#0c2a5a_0%,transparent_65%)]" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1.2px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="relative z-10 pb-12 pt-16 sm:pt-20 lg:max-w-[540px] lg:pb-24 lg:pt-24 xl:max-w-[580px]">
          <p className="intro v6-label text-white/60 [--d:0ms]">One partner. One platform. One source of truth.</p>
          <h1 id="v6-hero-title" className="intro v6-display mt-6 text-[clamp(2.5rem,4.4vw,3.75rem)] [--d:80ms]">
            Transform Business Complexity into Strategic Advantage
          </h1>
          <p className="intro mt-8 text-[1.1875rem] font-semibold leading-snug tracking-[-0.01em] [--d:160ms]">
            A fully managed intelligence and execution layer for your entire business.
          </p>
          <p className="intro text-pretty mt-4 text-[1.0625rem] leading-[1.7] text-white/65 [--d:220ms]">
            We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on
            the software you already rely on.
          </p>
          <div className="intro mt-10 flex flex-wrap gap-3 [--d:300ms]">
            <Button href="#action" size="lg">
              See Genius Lab in action
            </Button>
            <Button href="#contact" tone="outline-dark" size="lg">
              Book a demo
            </Button>
          </div>

          <div className="intro mt-16 [--d:420ms]">
            <p className="v6-label text-white/40">Trusted by operators, manufacturers and value creation teams</p>
            <div className="mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_80%,transparent)]">
              <ul className="v6-logos flex w-max gap-14" aria-label="Client logos (placeholders)">
                {[...LOGOS, ...LOGOS].map((l, i) => (
                  <li key={i} aria-hidden={i >= LOGOS.length || undefined} className="whitespace-nowrap font-mono text-[0.8125rem] uppercase tracking-[0.3em] text-white/40">
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* The product, bleeding off the right edge. */}
        <div className="intro relative -mx-5 h-[430px] overflow-hidden pl-5 sm:-mx-8 sm:h-[560px] sm:pl-8 lg:absolute lg:inset-y-0 lg:left-[calc(540px+5rem)] lg:mx-0 lg:h-auto lg:overflow-visible lg:pl-0 lg:pt-10 xl:left-[calc(580px+6rem)] [--d:200ms]">
          <div className="origin-top-left scale-[0.62] sm:scale-[0.8] lg:scale-100">
            <ConsoleV6 />
          </div>
          <div className="pointer-events-none absolute -bottom-24 left-0 hidden h-48 w-[1100px] rounded-[50%] bg-[radial-gradient(closest-side,rgb(77_141_255/0.45),transparent)] blur-2xl lg:block" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
