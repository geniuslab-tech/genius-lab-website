import type { CSSProperties } from "react";
import { ConsoleV22 } from "./ConsoleV22";
import { HexLattice } from "./HexLattice";
import { ChButton } from "./ui";

/** Placeholder client marks, to be replaced with approved logos. */
const MARKS = ["Northpeak", "Caldera", "Stratum", "Helios", "Orbis"];

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function HeroV22() {
  return (
    <section id="top" className="relative isolate pb-6 sm:pb-10" aria-labelledby="v22-hero-title">
      {/* Navy ground with one large chamfer cut into the white page. The console sits across it. */}
      <div id="v22-ground" className="v22-ground v22-hexfield absolute inset-x-0 top-0 bottom-[150px] -z-10 bg-[var(--navy)] sm:bottom-[190px] lg:bottom-[210px]" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(16_20_64/0.2),rgb(16_20_64/0.9)_75%)]" />
        <span className="absolute bottom-0 left-0 h-[3px] w-[38%] bg-[var(--signal)]" />
      </div>

      <div className="v22-shell grid gap-10 pt-[calc(var(--nav)+3rem)] sm:pt-[calc(var(--nav)+4rem)] lg:grid-cols-12 lg:gap-8 lg:pt-[calc(var(--nav)+5rem)]">
        <div className="text-white lg:col-span-6 lg:pb-[240px] xl:col-span-5">
          <p className="v22-in v22-label flex items-center gap-3 text-white/60" style={d(0)}>
            <span className="h-px w-8 bg-[var(--trace)]" aria-hidden="true" />
            Data, analytics, BI and AI · fully managed
          </p>
          <h1 id="v22-hero-title" className="v22-display mt-7 text-[clamp(2.4rem,5.2vw,4.6rem)]">
            <span className="v22-in block" style={d(60)}>
              Transform Business Complexity
            </span>
            <span className="v22-in block text-[var(--signal-lt)]" style={d(140)}>
              into Strategic Advantage
            </span>
          </h1>
          <p className="v22-in text-pretty mt-8 max-w-[46ch] text-[1.0625rem] leading-[1.7] text-white/75 sm:text-[1.125rem]" style={d(240)}>
            We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on
            the software you already rely on.
          </p>
          <div className="v22-in mt-10 flex flex-wrap items-center gap-3" style={d(320)}>
            <ChButton href="#contact" tone="white" size="lg">
              Talk to us
            </ChButton>
            <ChButton href="#layers" tone="line-dark" size="lg">
              See how it works
            </ChButton>
          </div>

          <div className="v22-in mt-14 hidden lg:block" style={d(440)}>
            <p className="v22-label text-white/50">Placeholder client marks</p>
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3" aria-label="Client marks (placeholders)">
              {MARKS.map((m) => (
                <li key={m} className="v22-wide text-[0.9375rem] uppercase tracking-[0.08em] text-white/45">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative lg:col-span-6 xl:col-span-7">
          <HexLattice className="relative h-auto w-full xl:ml-[4%] xl:w-[96%]" />
          <div className="relative -mt-[24%] [filter:drop-shadow(0_36px_40px_rgb(7_10_37/0.32))] lg:ml-[6%]">
            <div className="v22-open ch [--c:26px]" style={d(500)}>
              <ConsoleV22 />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
