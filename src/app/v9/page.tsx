import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Instrument_Sans } from "next/font/google";
import { RevealController } from "@/components/ui/Reveal";
import { NavV9 } from "@/components/v9/NavV9";
import { HeroV9 } from "@/components/v9/HeroV9";
import { ProblemV9 } from "@/components/v9/ProblemV9";
import { LayersBrainV9 } from "@/components/v9/LayersBrainV9";
import { AgentsV9 } from "@/components/v9/AgentsV9";
import { OntologyV9 } from "@/components/v9/OntologyV9";
import { PortalV9 } from "@/components/v9/PortalV9";
import { ManagedV9, SegmentsV9 } from "@/components/v9/ManagedV9";
import { ActionV9 } from "@/components/v9/ActionV9";
import { CtaV9 } from "@/components/v9/CtaV9";
import { FooterV9 } from "@/components/v9/FooterV9";
import "./v9.css";

const display = Big_Shoulders({ variable: "--font-v9-display", subsets: ["latin"], weight: ["700", "800"], display: "swap" });
const text = Instrument_Sans({ variable: "--font-v9-text", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Transform business complexity into strategic advantage",
  description:
    "A fully managed intelligence and execution layer for your entire business. We connect your systems and unify your data to deliver clear insights and orchestrate execution.",
};

export const viewport: Viewport = {
  themeColor: "#020309",
};

export default function HomeV9() {
  return (
    <div className={`v9 ${display.variable} ${text.variable} min-h-screen`}>
      <style>{`html{background:#020309;scrollbar-color:#2a2f5e #020309}body{background:#020309}`}</style>
      <NavV9 />
      <main id="main">
        <HeroV9 />
        <ProblemV9 />
        <LayersBrainV9 />
        <AgentsV9 />
        <OntologyV9 />
        <PortalV9 />
        <ManagedV9 />
        <SegmentsV9 />
        <ActionV9 />
        <CtaV9 />
      </main>
      <FooterV9 />
      <div className="v9-vignette" aria-hidden="true" />
      <div className="v9-grain" aria-hidden="true" />
      <RevealController />
    </div>
  );
}
