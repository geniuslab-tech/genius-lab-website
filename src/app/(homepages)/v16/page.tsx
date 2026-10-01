import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Outfit, Sora } from "next/font/google";
import "./v16.css";
import { NavV16 } from "@/components/v16/NavV16";
import { HeroV16 } from "@/components/v16/HeroV16";
import { ProblemV16 } from "@/components/v16/ProblemV16";
import { LayersV16 } from "@/components/v16/LayersV16";
import { BrainV16 } from "@/components/v16/BrainV16";
import { FlyThroughV16 } from "@/components/v16/FlyThroughV16";
import { AgentsV16 } from "@/components/v16/AgentsV16";
import { PortalV16 } from "@/components/v16/PortalV16";
import { OntologyV16 } from "@/components/v16/OntologyV16";
import { ManagedV16 } from "@/components/v16/ManagedV16";
import { SegmentsV16 } from "@/components/v16/SegmentsV16";
import { ActionV16 } from "@/components/v16/ActionV16";
import { VoicesV16 } from "@/components/v16/VoicesV16";
import { CtaV16 } from "@/components/v16/CtaV16";
import { FooterV16 } from "@/components/v16/FooterV16";

const sora = Sora({ variable: "--font-v16-display", subsets: ["latin"], display: "swap" });
const outfit = Outfit({ variable: "--font-v16-body", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-v16-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Transform business complexity into strategic advantage",
  description:
    "We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the software you already rely on.",
};

export const viewport: Viewport = {
  themeColor: "#060818",
};

export default function HomeV16() {
  return (
    <div className={`v16 ${sora.variable} ${outfit.variable} ${mono.variable}`}>
      <style>{`html{background:#060818;scrollbar-color:#27306a #060818}body{background:#060818}`}</style>
      <NavV16 />
      <main>
        <HeroV16 />
        <ProblemV16 />
        <LayersV16 />
        <BrainV16 />
        <FlyThroughV16 />
        <AgentsV16 />
        <PortalV16 />
        <OntologyV16 />
        <ManagedV16 />
        <SegmentsV16 />
        <ActionV16 />
        <VoicesV16 />
        <CtaV16 />
      </main>
      <FooterV16 />
    </div>
  );
}
