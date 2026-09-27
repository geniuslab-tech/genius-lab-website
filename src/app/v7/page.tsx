import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { BrandLogo } from "@/components/v2/ui";
import { VersionSwitch } from "@/components/ui/VersionSwitch";
import { RevealController } from "@/components/ui/Reveal";
import { Study } from "@/components/v7/Study";
import { IsoStack } from "@/components/v7/IsoStack";
import { Orbit } from "@/components/v7/Orbit";
import { Pipeline } from "@/components/v7/Pipeline";
import { Staircase } from "@/components/v7/Staircase";
import { Panels } from "@/components/v7/Panels";
import { Blueprint } from "@/components/v7/Blueprint";
import { Spine } from "@/components/v7/Spine";
import { Console } from "@/components/v7/Console";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Operating layer studies",
  description: "Eight ways to draw one intelligence and execution layer across your business.",
};

export const viewport: Viewport = {
  themeColor: "#050b18",
};

const STUDIES = [
  { n: "01", name: "Isometric stack", title: <>Five layers, one governed system.</>, idea: "The reference pyramid lifted into space: glass plates exploded upward, wired to their labels, threaded by one spine.", Body: IsoStack },
  { n: "02", name: "Orbit", title: <>Everything protects and feeds the&nbsp;core.</>, idea: "Concentric rings instead of floors. Data is the outer shell, execution the core the rest exists to serve.", Body: Orbit },
  { n: "03", name: "Pipeline", title: <>From business signal to business&nbsp;action.</>, idea: "The stack turned on its side and read left to right, with the reference's three zones as the pipeline's ends.", Body: Pipeline },
  { n: "04", name: "Staircase", title: <>Every layer is a step up in&nbsp;value.</>, idea: "Ascending steps make the order obvious: each layer is only possible because of the one beneath it.", Body: Staircase },
  { n: "05", name: "Expanding panels", title: <>Open any layer. See what it&nbsp;holds.</>, idea: "Five columns share one row; the one you point at opens with its detail while the rest step back.", Body: Panels },
  { n: "06", name: "Blueprint", title: <>Governance is a boundary, not a&nbsp;floor.</>, idea: "An architecture drawing: real systems at the base, context above, and a policy boundary around what thinks and acts.", Body: Blueprint },
  { n: "07", name: "Spine", title: <>One spine, from foundation to&nbsp;execution.</>, idea: "A single vertical line carries a pulse from the signals below to the action above, each layer branching off it.", Body: Spine },
  { n: "08", name: "Live console", title: <>The layer, running in&nbsp;production.</>, idea: "The stack as the operations console that runs it: every layer a live row with its throughput and state.", Body: Console },
];

export default function HomeV7() {
  return (
    <div className={`v6 ${manrope.variable} min-h-screen bg-[#03070f] text-white selection:bg-sky/40`}>
      <style>{`html{background:#03070f;scrollbar-color:#1c2a44 #03070f}body{background:#03070f}:focus-visible{outline-color:var(--color-sky)}`}</style>

      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#03070f]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 px-5 sm:px-8">
          <a href="#" aria-label="Genius Lab, home" className="block shrink-0">
            <BrandLogo tone="white" className="h-[17px] w-auto" />
          </a>
          <nav aria-label="Studies" className="hidden xl:block">
            <ul className="flex items-center">
              {STUDIES.map((s) => (
                <li key={s.n}>
                  <a href={`#study-${s.n}`} className="v6-label whitespace-nowrap rounded-[4px] px-2 py-1.5 text-[0.5625rem] text-white/45 transition-colors hover:bg-white/[0.05] hover:text-white">
                    {s.n} {s.name.split(" ").pop()}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <VersionSwitch current={7} tone="dark" className="overflow-x-auto" />
        </div>
      </header>

      <main className="pb-24">
        <div className="mx-auto max-w-[1320px] px-5 pb-14 pt-20 sm:px-8 sm:pt-28">
          <p className="v6-label text-[0.6875rem]">
            <span className="text-sky">V7</span>
            <span className="ml-3 text-white/50">One layer across your business · 8 studies</span>
          </p>
          <h1 className="v6-display mt-6 max-w-[20ch] text-[clamp(2.5rem,5.4vw,4.75rem)] text-white">
            Eight ways to draw the operating&nbsp;layer.
          </h1>
          <p className="mt-6 max-w-[58ch] text-[1.0625rem] leading-[1.7] text-white/55">
            The same five layers as the reference, data foundation to execution, drawn eight different ways. Each study is a candidate for the platform section.
          </p>
        </div>

        <div className="space-y-8 sm:space-y-12">
          {STUDIES.map(({ Body, ...s }) => (
            <Study key={s.n} {...s}>
              <Body />
            </Study>
          ))}
        </div>
      </main>
      <RevealController />
    </div>
  );
}
