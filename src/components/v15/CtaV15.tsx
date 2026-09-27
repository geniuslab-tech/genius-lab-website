import { GuillocheLayers } from "./ornaments";
import { LxButton, LxLink, d } from "./ui";

/** The close: one sentence, centred on the engraved dial, and two ways forward. */
export function CtaV15() {
  return (
    <section id="contact" className="relative isolate scroll-mt-20 overflow-hidden bg-[#0c0b0a] py-40 sm:py-56" aria-labelledby="v15-cta-title">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[max(120vw,900px)] -translate-x-1/2 -translate-y-1/2 sm:w-[min(110vw,1200px)]">
        <GuillocheLayers opacity={0.28} />
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgb(12_11_10/0.9)_20%,transparent_60%)]" aria-hidden="true" />

      <div className="mx-auto flex max-w-[980px] flex-col items-center px-5 text-center sm:px-10">
        <p data-lx="fade" className="lx-caps lx-gold">
          One partner &middot; One platform &middot; One source of truth
        </p>
        <h2 id="v15-cta-title" data-lx="settle" style={d(200)} className="lx-display mt-12 text-[clamp(2.6rem,6.4vw,6rem)]">
          Turn your business knowledge into <em className="lx-gold">intelligent systems.</em>
        </h2>
        <p data-lx="fade" style={d(450)} className="lx-body mt-10 max-w-[54ch]">
          Tell us where your systems and data stand today. We&rsquo;ll show you how Genius Lab turns them into one intelligence
          and execution layer, fully managed.
        </p>
        <div data-lx="fade" style={d(650)} className="mt-14 flex flex-col items-center gap-7 sm:flex-row sm:gap-10">
          <LxButton href="#">Talk to us</LxButton>
          <LxLink href="#action">Watch it in action</LxLink>
        </div>
      </div>
    </section>
  );
}
