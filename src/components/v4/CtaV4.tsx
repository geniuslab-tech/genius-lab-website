import { TechButton } from "./ui";

/** The close: a lit console panel on the page grid, echoing the hero's horizon. */
export function CtaV4() {
  return (
    <section id="contact" className="relative scroll-mt-16 py-24 sm:py-32" aria-labelledby="v4-cta-title">
      <div className="shell">
        <div className="relative isolate overflow-hidden border border-line [clip-path:polygon(0_0,calc(100%-40px)_0,100%_40px,100%_100%,40px_100%,0_calc(100%-40px))]">
          <div className="v4-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_50%_100%,#000,transparent_75%)]" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-[80%] bg-[radial-gradient(ellipse_at_50%_100%,rgb(85_119_255/0.45),transparent_65%)]" aria-hidden="true" />
          <div className="absolute inset-x-[10%] bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-cyan to-transparent" aria-hidden="true" />

          <div className="flex flex-col items-center px-6 py-24 text-center sm:py-32 lg:py-40">
            <p className="type-mono text-[0.8125rem] text-white/45" aria-hidden="true">
              <span className="text-cyan">$</span> genius connect --your-business
              <span className="v4-caret ml-1 inline-block h-3.5 w-2 translate-y-0.5 bg-cyan" />
            </p>
            <h2
              id="v4-cta-title"
              data-reveal="up"
              className="type-display mt-8 max-w-[18ch] text-[clamp(2.5rem,5.8vw,5.75rem)] leading-[0.98] text-white [font-variation-settings:'wdth'_118]"
            >
              Turn your business knowledge into intelligent systems.
            </h2>
            <p data-reveal="up" data-delay="100" className="mt-8 max-w-[52ch] text-lg leading-relaxed text-white/65">
              Tell us where your systems and data stand today. We&rsquo;ll show you how Genius Lab turns them into one
              intelligence and execution layer, fully managed.
            </p>
            <div data-reveal="up" data-delay="180" className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <TechButton href="#" tone="light" size="lg">
                Talk to us
              </TechButton>
              <TechButton href="#action" tone="ghost" size="lg">
                Watch it in action
              </TechButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
