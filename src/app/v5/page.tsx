import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { NavV5 } from "@/components/v5/NavV5";
import { HeroV5 } from "@/components/v5/HeroV5";
import { ProblemV5 } from "@/components/v5/ProblemV5";
import { LayersV5 } from "@/components/v5/LayersV5";
import { BrainV5 } from "@/components/v5/BrainV5";
import { AgentsV5 } from "@/components/v5/AgentsV5";
import { PortalV5 } from "@/components/v5/PortalV5";
import { OntologyV5 } from "@/components/v5/OntologyV5";
import { ManagedV5 } from "@/components/v5/ManagedV5";
import { SegmentsV5 } from "@/components/v5/SegmentsV5";
import { ActionV5 } from "@/components/v5/ActionV5";
import { VoicesV5 } from "@/components/v5/VoicesV5";
import { CtaV5 } from "@/components/v5/CtaV5";
import { FooterV5 } from "@/components/v5/FooterV5";
import { RevealController } from "@/components/ui/Reveal";

// The system font (SF Pro on Apple devices) leads; Inter stands in everywhere else.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Transform business complexity into strategic advantage",
  description:
    "We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the software you already rely on.",
};

export const viewport: Viewport = {
  themeColor: "#fbfbfd",
};

export default function HomeV5() {
  return (
    <div className={`v5 ${inter.variable} bg-white text-graphite selection:bg-azure/25`}>
      <style>{`html{background:#fbfbfd;scrollbar-color:#c7c7cc #fbfbfd}body{background:#fbfbfd}:focus-visible{outline-color:var(--color-azure);outline-offset:2px}`}</style>
      <NavV5 />
      <main>
        <HeroV5 />
        <ProblemV5 />
        <LayersV5 />
        <BrainV5 />
        <AgentsV5 />
        <PortalV5 />
        <OntologyV5 />
        <ManagedV5 />
        <SegmentsV5 />
        <ActionV5 />
        <VoicesV5 />
        <CtaV5 />
      </main>
      <FooterV5 />
      <RevealController />
    </div>
  );
}
