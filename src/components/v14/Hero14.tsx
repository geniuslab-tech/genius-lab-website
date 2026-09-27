import { Crosshair14 } from "./Crosshair14";
import { Btn, Label, Split, delay } from "./ui";

const line = "v14-line text-[15vw] lg:text-[11vw]";

/** A mono ruler drawn with an SVG pattern: minor tick every 8px, major every 32px. */
function Ruler() {
  return (
    <svg className="block h-full w-full" aria-hidden="true">
      <defs>
        <pattern id="v14-ruler" width="32" height="32" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="2" height="14" fill="#000" />
          <rect x="8" y="0" width="1" height="6" fill="#000" />
          <rect x="16" y="0" width="1" height="9" fill="#000" />
          <rect x="24" y="0" width="1" height="6" fill="#000" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#v14-ruler)" />
    </svg>
  );
}

export function Hero14() {
  return (
    <section id="top" aria-labelledby="v14-hero-title" className="relative overflow-hidden border-b-2 border-black bg-white">
      <Crosshair14 />

      <div className="flex h-9 items-stretch border-b-2 border-black">
        <p className="v14-mono flex shrink-0 items-center border-r-2 border-black px-4 sm:px-6">Index 00</p>
        <p className="v14-mono hidden shrink-0 items-center border-r-2 border-black px-4 md:flex">Genius Lab Technology</p>
        <div className="min-w-0 flex-1 overflow-hidden">
          <Ruler />
        </div>
        <p className="v14-mono hidden shrink-0 items-center border-l-2 border-black px-4 sm:flex">Data &rarr; Decisions</p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,27rem)]">
        <h1 id="v14-hero-title" className="v14-display px-4 pb-6 pt-5 sm:px-6 lg:pb-8">
          <span className="sr-only">Transform Business Complexity into Strategic Advantage</span>
          <span aria-hidden="true" className="block">
            <span data-r="chars" className={line}>
              <Split text="Transform" />
            </span>
            <span data-r="chars" style={delay(120)} className={`${line} pl-[9vw] lg:pl-[7vw]`}>
              <Split text="Business" />
            </span>
            <span data-r="chars" style={delay(240)} className={line}>
              <Split text="Complexity" />
            </span>
            <span data-r="chars" style={delay(360)} className={line}>
              <span className="flex items-center gap-[0.14em]">
                <span className="inline-block bg-black px-[0.16em] pb-[0.14em] pt-[0.04em] text-[0.4em] leading-none tracking-[-0.03em] text-white">
                  into
                </span>
                <Split text="Strategic" />
              </span>
            </span>
          </span>
        </h1>

        <div className="flex flex-col border-black max-lg:border-t-2 lg:border-l-2">
          <div className="border-b-2 border-black px-4 py-5 sm:px-6">
            <Label className="text-[#555]">[A] What we are</Label>
            <p data-r="" style={delay(300)} className="mt-3 text-[1.3125rem] font-bold leading-[1.2] tracking-[-0.02em]">
              A fully managed intelligence and execution layer for your entire business.
            </p>
          </div>
          <div className="border-b-2 border-black px-4 py-5 sm:px-6">
            <Label className="text-[#555]">[B] What we do</Label>
            <p data-r="" style={delay(380)} className="text-pretty mt-3 text-[1.0625rem] leading-[1.55]">
              We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on
              the software you already rely on.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 border-black px-4 pb-7 pt-5 sm:px-6 lg:flex-col lg:items-start">
            <Btn href="#action" tone="u">
              See Genius Lab in action
            </Btn>
            <Btn href="#contact" tone="w">
              Book a demo
            </Btn>
          </div>
          <div className="mt-auto border-t-2 border-black px-4 py-3 sm:px-6">
            <Label>One partner. One platform. One source of truth.</Label>
          </div>
        </div>
      </div>

      <div className="relative border-t-2 border-black bg-[#1f3bff] text-white">
        <p className="v14-mono absolute right-4 top-3 text-white sm:right-6">[C] The outcome</p>
        <p aria-hidden="true" className="v14-display px-4 pb-[2vw] pt-[3vw] sm:px-6">
          <span data-r="chars" style={delay(480)} className="v14-line text-[18vw] lg:text-[16vw]">
            <Split text="Advantage." />
          </span>
        </p>
      </div>
    </section>
  );
}
