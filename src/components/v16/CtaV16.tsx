import { Button } from "./ui";

export function CtaV16() {
  return (
    <section id="contact" className="relative isolate scroll-mt-16 overflow-hidden py-28 sm:py-36" aria-labelledby="v16-cta-title">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_70%_at_80%_100%,#121b5c_0%,transparent_70%)]" aria-hidden="true" />
      <div className="v16-grid-floor absolute inset-x-0 bottom-0 -z-10 h-[60%] origin-bottom [transform:perspective(600px)_rotateX(62deg)]" aria-hidden="true" />
      <div className="v16-wrap grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="v16-label text-[color:var(--tx-3)]">One partner. One platform. One source of truth.</p>
          <h2 id="v16-cta-title" className="v16-display mt-6 max-w-[18ch] text-[clamp(2.5rem,5.4vw,4.75rem)]">
            Turn your business knowledge into <span className="text-[color:var(--ice)]">intelligent systems.</span>
          </h2>
          <p className="v16-lead mt-8 max-w-[56ch]">
            Tell us where your systems and data stand today. We&rsquo;ll show you how Genius Lab turns them into one
            intelligence and execution layer, fully managed.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
          <Button href="#">Talk to us</Button>
          <Button href="#action" tone="ghost">
            Watch it in action
          </Button>
        </div>
      </div>
    </section>
  );
}
