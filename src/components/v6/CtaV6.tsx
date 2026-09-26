import { Button } from "./ui";

/** The close echoes the hero: the same deep ground, the same two actions. */
export function CtaV6() {
  return (
    <section id="contact" className="relative isolate scroll-mt-[4.5rem] overflow-hidden bg-abyss py-24 text-white sm:py-32" aria-labelledby="v6-cta-title">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_85%_100%,#0c2a5a_0%,transparent_70%),radial-gradient(ellipse_40%_50%_at_10%_0%,#0f2748_0%,transparent_70%)]" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1.2px)] [background-size:22px_22px] [mask-image:linear-gradient(to_top,#000,transparent_80%)]" aria-hidden="true" />
      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="v6-label text-white/55">One partner. One platform. One source of truth.</p>
          <h2 id="v6-cta-title" data-reveal="up" className="v6-display mt-6 max-w-[18ch] text-[clamp(2.5rem,5vw,4.5rem)]">
            Turn your business knowledge into intelligent systems.
          </h2>
          <p data-reveal="up" data-delay="100" className="text-pretty mt-8 max-w-[56ch] text-[1.125rem] leading-[1.7] text-white/65">
            Tell us where your systems and data stand today. We&rsquo;ll show you how Genius Lab turns them into one
            intelligence and execution layer, fully managed.
          </p>
        </div>
        <div data-reveal="up" data-delay="180" className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
          <Button href="#" size="lg">
            Talk to us
          </Button>
          <Button href="#action" tone="outline-dark" size="lg">
            Watch it in action
          </Button>
        </div>
      </div>
    </section>
  );
}
