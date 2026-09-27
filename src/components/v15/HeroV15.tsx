import { TerrainPlate } from "./ornaments";
import { LxButton, LxLink, d } from "./ui";

/** The opening: an engraved contour plate, one line of display type, a great deal of air. */
export function HeroV15() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#0c0b0a]" aria-labelledby="v15-hero-title">
      <div className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_55%,#000_30%,transparent_85%)]">
        <TerrainPlate />
      </div>
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-[linear-gradient(to_top,#0c0b0a,transparent)]" aria-hidden="true" />

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-5 pb-24 pt-32 text-center sm:px-10">
        <p data-lx="fade" style={d(200)} className="lx-caps lx-gold">
          Genius Lab Technology
        </p>
        <h1
          id="v15-hero-title"
          data-lx="settle"
          style={d(420)}
          className="lx-display mt-10 max-w-[15ch] text-[clamp(2.75rem,7.4vw,7.25rem)] [--lx-track:-0.018em]"
        >
          Transform Business Complexity into <em className="lx-gold">Strategic Advantage</em>
        </h1>
        <span data-lx="line" style={d(1100)} className="lx-hair mt-12 w-16 bg-[#d8c29d]/60" aria-hidden="true" />
        <p data-lx="fade" style={d(1300)} className="lx-serif mt-10 max-w-[34ch] text-[clamp(1.25rem,2vw,1.6rem)] italic leading-[1.45] text-[#ede7dc]/90">
          A fully managed intelligence and execution layer for your entire business.
        </p>
        <p data-lx="fade" style={d(1500)} className="lx-body mt-6 max-w-[52ch]">
          We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the
          software you already rely on.
        </p>
        <div data-lx="fade" style={d(1750)} className="mt-14 flex flex-col items-center gap-7 sm:flex-row sm:gap-10">
          <LxButton href="#action">See Genius Lab in action</LxButton>
          <LxLink href="#contact">Book a demo</LxLink>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] items-end justify-between gap-6 px-5 pb-8 sm:px-10 lg:px-14">
        <p data-lx="fade" style={d(2100)} className="lx-caps hidden text-[#ede7dc]/70 md:block">
          One partner &middot; One platform &middot; One source of truth
        </p>
        <a href="#problem" data-lx="fade" style={d(2300)} className="flex flex-col items-center gap-3 max-md:mx-auto">
          <span className="lx-caps text-[#ede7dc]/70">Scroll</span>
          <span className="relative block h-12 w-px overflow-hidden bg-[#d8c29d]/15" aria-hidden="true">
            <span className="lx-drop absolute inset-0 bg-[#d8c29d]" />
          </span>
        </a>
        <p data-lx="fade" style={d(2100)} className="lx-caps hidden text-right text-[#ede7dc]/70 md:block">
          Terrain read by the agent
        </p>
      </div>
    </section>
  );
}
