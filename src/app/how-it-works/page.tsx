import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Sora } from "next/font/google";
import "@/app/(hero-animation)/v24/v24.css";
import { Nav } from "@/components/v24/Hero";
import { VariantSection } from "@/components/layers/shared";
import { V1Refined } from "@/components/layers/V1Refined";
import { V2Isometric } from "@/components/layers/V2Isometric";
import { V3Glass } from "@/components/layers/V3Glass";
import { V4Column } from "@/components/layers/V4Column";
import { V5Blueprint } from "@/components/layers/V5Blueprint";
import { V6Bands } from "@/components/layers/V6Bands";
import { V7Monolith } from "@/components/layers/V7Monolith";

const display = Sora({ variable: "--font-v24-display", subsets: ["latin"], display: "swap" });
const sans = Manrope({ variable: "--font-v24-sans", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-v24-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | How it works — layer studies",
  description: "Seven studies of the five-layer operating system animation: one refined in the original style, six premium directions.",
  robots: { index: false },
};

export const viewport: Viewport = {
  themeColor: "#0b1024",
};

const VARIANTS = [
  {
    name: "Refined stack",
    note: "The v16 animation, same style. Hairline borders that follow the chamfer, a timer on the active slab, data rising through the stack, detail chips in the story.",
    C: V1Refined,
  },
  {
    name: "Isometric plates",
    note: "The stack in true 3D. Plates separate so every layer reads as its own surface; the active one lifts and lights while data rises through the core.",
    C: V2Isometric,
  },
  {
    name: "Glass panes",
    note: "Layers as panes of glass in depth, foundation at the back. The active pane slides forward with its capabilities etched on it.",
    C: V3Glass,
  },
  {
    name: "Column of light",
    note: "A beam rises from the foundation and lights every ring up to the active layer: each layer powered by the ones beneath it.",
    C: V4Column,
  },
  {
    name: "Architectural section",
    note: "The system drawn as a building. Data enters at ground level, a lift carries it to the active floor, rooms are capabilities, action leaves the roof.",
    C: V5Blueprint,
  },
  {
    name: "Living bands",
    note: "Full-width strata. The active band opens to show the layer working: sources converging, context arriving, policies switching on, an insight forming, an action completing.",
    C: V6Bands,
  },
  {
    name: "The monolith",
    note: "Five dark slabs, one tower. A gold core climbs a slit in the face and lights each slab it reaches; sources stream in below, actions leave the top.",
    C: V7Monolith,
  },
];

export default function HowItWorksStudies() {
  return (
    <div className={`v24 ${display.variable} ${sans.variable} ${mono.variable}`}>
      <style>{`html,body{background:oklch(0.145 0.032 264)}`}</style>
      <Nav variant="light" />
      <main className="relative pt-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-40 top-16 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,oklch(0.7_0.17_252/14%),transparent_70%)] blur-3xl" />
          <div className="absolute inset-x-0 top-16 h-px bg-gradient-to-r from-transparent via-[oklch(0.7_0.17_252/60%)] to-transparent" />
        </div>

        <header className="relative mx-auto max-w-[112rem] px-6 pb-16 pt-20 lg:px-10">
          <div className="md:pl-16 lg:pl-32">
            <p className="font-gl-mono text-[0.81rem] uppercase tracking-[0.18em] text-gl-muted-foreground">How it works · Executive Operating System</p>
            <h1 className="mt-6 max-w-[78rem] font-gl-display text-[2.2rem] font-medium leading-[1.1] tracking-[-0.02em] text-gl-foreground sm:text-[2.9rem]">
              <span className="block">A Fully Managed Intelligence and Execution Layer</span>
              <span className="block">Across Your Entire Business.</span>
            </h1>
            <p className="mt-6 max-w-[44rem] text-[1rem] leading-relaxed text-gl-muted-foreground">
              Seven studies of the five-layer animation from v16. Variant 01 keeps the original style, refined. Variants 02–07 keep the same story — five
              layers, one active at a time, cycling on their own and clickable — in more premium directions.
            </p>
            <nav className="mt-8 flex flex-wrap gap-2" aria-label="Variants">
              {VARIANTS.map((v, i) => (
                <a
                  key={v.name}
                  href={`#variant-${i + 1}`}
                  className="rounded-full border border-gl-foreground/12 px-3.5 py-1.5 text-[0.78rem] text-gl-foreground/75 transition-colors duration-300 hover:border-gl-foreground/30 hover:text-gl-foreground"
                >
                  <span className={`mr-2 font-gl-mono text-[0.62rem] ${i === 0 ? "text-gl-data" : "text-gl-gold"}`}>{String(i + 1).padStart(2, "0")}</span>
                  {v.name}
                </a>
              ))}
            </nav>
          </div>
        </header>

        {VARIANTS.map((v, i) => (
          <VariantSection key={v.name} n={i + 1} name={v.name} note={v.note} premium={i > 0}>
            <v.C />
          </VariantSection>
        ))}
      </main>
    </div>
  );
}
