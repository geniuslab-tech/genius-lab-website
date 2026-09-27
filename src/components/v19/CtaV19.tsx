import { Button, HexMark, rd } from "./ui";

/** The close: one lit panel on the grid, the same two actions as the hero. */
export function CtaV19() {
  return (
    <section id="contact" className="relative scroll-mt-16 py-24 sm:py-32" aria-labelledby="v19-cta-title">
      <div className="v19-wrap">
        <div className="v19-conic relative overflow-hidden rounded-[24px] bg-[color:var(--g2)] px-6 py-16 text-center sm:px-12 sm:py-24">
          <div className="v19-grid [mask-image:radial-gradient(ellipse_70%_80%_at_50%_100%,#000_20%,transparent_75%)]" aria-hidden="true" />
          <div className="v19-sweep [mask-image:linear-gradient(105deg,transparent_42%,#000_50%,transparent_58%),radial-gradient(ellipse_70%_80%_at_50%_100%,#000_20%,transparent_75%)]" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-0 bottom-[-40%] mx-auto h-[80%] w-[80%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(var(--acc-rgb)/0.3),transparent)] blur-2xl" aria-hidden="true" />

          <div className="relative flex flex-col items-center">
            <p className="v19-rv v19-label flex items-center gap-2.5 text-[color:var(--tx-3)]">
              <HexMark size={13} className="text-[color:var(--acc-2)]" />
              One partner. One platform. One source of truth.
            </p>
            <h2 id="v19-cta-title" className="v19-rv v19-h2 mt-6 max-w-[18ch] text-[clamp(2.25rem,5vw,4rem)]" style={rd(60)}>
              Turn your business knowledge into intelligent systems.
            </h2>
            <p className="v19-rv v19-lead mt-6 max-w-[54ch]" style={rd(120)}>
              Tell us where your systems and data stand today. We&rsquo;ll show you how Genius Lab turns them into one
              intelligence and execution layer, fully managed.
            </p>
            <div className="v19-rv mt-10 flex flex-wrap justify-center gap-3" style={rd(180)}>
              <Button href="#">Talk to us</Button>
              <Button href="#portal" tone="ghost">
                Tour the Genius Portal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
