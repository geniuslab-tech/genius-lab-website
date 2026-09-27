import { Btn, Label, Split, delay } from "./ui";

/** The close: the biggest words on the page after the hero, and the same two actions. */
export function Cta14() {
  return (
    <section id="contact" aria-labelledby="v14-cta-title" className="scroll-mt-14 border-b-2 border-black bg-white">
      <div className="flex items-center justify-between border-b-2 border-black px-4 py-3 sm:px-6">
        <Label>11 · Contact</Label>
        <Label className="max-sm:hidden">One partner. One platform. One source of truth.</Label>
      </div>
      <h2 id="v14-cta-title" className="v14-display px-4 pb-8 pt-6 text-[clamp(3rem,9.5vw,11rem)] sm:px-6">
        <span data-r="chars" className="v14-line">
          <Split text="Turn your business" />
        </span>
        <span data-r="chars" style={delay(120)} className="v14-line">
          <Split text="knowledge into" start={18} />
        </span>
        <span data-r="chars" style={delay(240)} className="v14-line text-[#1f3bff]">
          <Split text="intelligent systems." start={32} />
        </span>
      </h2>
      <div className="grid border-t-2 border-black lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <p className="text-pretty border-black px-4 py-6 text-[1.125rem] leading-[1.6] sm:px-6 max-lg:border-b-2 lg:border-r-2">
          <span className="block max-w-[56ch]">
            Tell us where your systems and data stand today. We&rsquo;ll show you how Genius Lab turns them into one
            intelligence and execution layer, fully managed.
          </span>
        </p>
        <div className="flex flex-wrap items-center gap-4 px-4 py-6 sm:px-6">
          <Btn href="#" tone="u">
            Talk to us
          </Btn>
          <Btn href="#action" tone="w">
            Watch it in action
          </Btn>
        </div>
      </div>
    </section>
  );
}
