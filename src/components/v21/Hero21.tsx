import type { CSSProperties } from "react";
import { PortalPreview21 } from "./PortalPreview21";
import { TERRAIN21, T_H, T_W } from "./terrain21";
import { Btn, Eyebrow, Illustrative, Lines } from "./ui";
import { wrap } from "./shared";

/** Placeholder client marks, to be replaced with approved logos. */
const LOGOS = ["Northpeak", "Caldera", "Helios", "Stratum", "Orbis", "Vanta Group", "Meridian"];

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero21() {
  return (
    <section id="top" className="relative pt-[4.25rem]" aria-labelledby="v21-hero-title">
      <div className={`${wrap} pb-10 pt-14 sm:pt-20 lg:pt-24`}>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow className="v21-intro">Data, analytics and AI · Genius Portal</Eyebrow>
            <Lines
              as="h1"
              id="v21-hero-title"
              intro
              delay={80}
              lines={["Transform Business", "Complexity into", <em key="e">Strategic Advantage</em>]}
              className="v21-display mt-6 text-[clamp(2.6rem,6.6vw,5.4rem)] leading-[1]"
            />
          </div>
          <div className="lg:col-span-5 lg:pb-2">
            <p className="v21-intro text-[1.1875rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--ink)]" style={d(260)}>
              A fully managed intelligence and execution layer for your entire business.
            </p>
            <p className="v21-intro v21-lead mt-4" style={d(320)}>
              We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the software you already rely on.
            </p>
            <div className="v21-intro mt-8 flex flex-wrap gap-3" style={d(400)}>
              <Btn href="#contact" arrow>
                Book a demo
              </Btn>
              <Btn href="#film" tone="line">
                See Genius Lab in action
              </Btn>
            </div>
          </div>
        </div>
      </div>

      {/* The product, set on fine contour lines. */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${T_W} ${T_H}`}
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute inset-x-0 top-0 h-[78%] w-full [mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_60%,transparent)]"
          aria-hidden="true"
          fill="none"
        >
          {TERRAIN21.map((t, i) => (
            <path key={i} d={t.d} stroke={t.index ? "#cdbfa9" : "#ddd3c3"} strokeWidth={t.index ? 1.1 : 0.8} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        <div className={`${wrap} relative`}>
          <div className="v21-intro mx-auto max-w-[1120px] pt-6 sm:pt-10" style={d(520)} data-rv-now>
            <PortalPreview21 />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1">
              <Illustrative>Genius Portal · illustrative preview, sample data</Illustrative>
              <p className="text-[0.8125rem] text-[var(--ink-3)]">Our own platform, run by our specialists.</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${wrap} pb-16 pt-14 sm:pb-24`}>
        <div className="flex flex-col gap-5 border-t border-[var(--rule)] pt-8 md:flex-row md:items-center md:gap-10">
          <p className="v21-label shrink-0">
            Trusted by operators and investors <span className="font-medium normal-case tracking-normal">(placeholder marks)</span>
          </p>
          <div className="v21-marquee-mask min-w-0 flex-1">
            <ul className="v21-marquee" aria-label="Client logos, placeholders">
              {[...LOGOS, ...LOGOS].map((l, i) => (
                <li key={i} aria-hidden={i >= LOGOS.length || undefined} className="v21-serif whitespace-nowrap pr-14 text-[1.25rem] italic text-[#6f6a5e]">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
