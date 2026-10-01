import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./v23.css";
import { Nav } from "@/components/v23/Nav";
import { Rail } from "@/components/v23/Rail";
import { Aurora } from "@/components/v23/Aurora";
import { Hero } from "@/components/v23/Hero";
import { Problem } from "@/components/v23/Problem";
import { Layers } from "@/components/v23/Layers";
import { Brain, Decisions } from "@/components/v23/Bento";
import { Ontology } from "@/components/v23/Ontology";
import { Portal } from "@/components/v23/Portal";
import { Managed } from "@/components/v23/Managed";
import { Segments } from "@/components/v23/Segments";
import { Action } from "@/components/v23/Action";
import { Cta, Footer } from "@/components/v23/Closing";
import { RevealController } from "@/components/v23/Interactive";

const sans = Plus_Jakarta_Sans({ variable: "--font-v23-sans", subsets: ["latin"], display: "swap" });
const mono = IBM_Plex_Mono({ variable: "--font-v23-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Transform business complexity into strategic advantage",
  description:
    "We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the software you already rely on.",
};

export const viewport: Viewport = {
  themeColor: "#050817",
};

export default function HomeV23() {
  return (
    <div className={`v23 ${sans.variable} ${mono.variable}`} data-tone="dark">
      <style>{`html{background:#050817;scrollbar-color:#27306a #050817}body{background:#050817}`}</style>
      <Nav />
      <Rail />
      <main>
        {/* The dark half: the light field sits behind the hero and the problem, pinned to the viewport. */}
        <div className="relative isolate bg-[#050817]" data-tone="dark">
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <Aurora className="sticky top-0 h-[100svh]" />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[50vh] bg-gradient-to-b from-transparent to-[#0a1030]" aria-hidden="true" />
          <Hero />
          <Problem />
        </div>
        <Layers />
        <div data-tone="light">
          <Decisions />
          <Brain />
          <Ontology />
          <Portal />
          <Managed />
          <Segments />
          <Action />
          <Cta />
        </div>
      </main>
      <div data-tone="light">
        <Footer />
      </div>
      <RevealController />
    </div>
  );
}
