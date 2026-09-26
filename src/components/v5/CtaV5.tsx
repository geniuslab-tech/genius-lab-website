import { More, Pill } from "./ui";

/** The close, on black, with a single soft light. */
export function CtaV5() {
  return (
    <section id="contact" className="relative scroll-mt-12 overflow-hidden bg-black py-32 text-center text-white sm:py-48" aria-labelledby="v5-cta-title">
      <div className="pointer-events-none absolute left-1/2 top-full h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(0_113_227/0.45),transparent)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1080px] px-5">
        <h2 id="v5-cta-title" data-reveal="up" className="v5-display mx-auto max-w-[16ch] text-[clamp(2.75rem,6.4vw,5.5rem)]">
          Turn your business knowledge into intelligent systems.
        </h2>
        <p data-reveal="up" data-delay="100" className="v5-body text-pretty mx-auto mt-8 max-w-[40ch] text-[clamp(1.1875rem,1.6vw,1.5rem)] font-medium text-[#a1a1a6]">
          Tell us where your systems and data stand today. We&rsquo;ll show you how Genius Lab turns them into one
          intelligence and execution layer, fully managed.
        </p>
        <div data-reveal="up" data-delay="180" className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Pill href="#" size="lg">
            Talk to us
          </Pill>
          <More href="#action" dark>
            Watch it in action
          </More>
        </div>
      </div>
    </section>
  );
}
