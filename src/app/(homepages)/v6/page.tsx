import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { NavV6 } from "@/components/v6/NavV6";
import { HeroV6 } from "@/components/v6/HeroV6";
import { ProblemV6 } from "@/components/v6/ProblemV6";
import { LayersV6 } from "@/components/v6/LayersV6";
import { BrainV6 } from "@/components/v6/BrainV6";
import { AgentsV6 } from "@/components/v6/AgentsV6";
import { PortalV6 } from "@/components/v6/PortalV6";
import { OntologyV6 } from "@/components/v6/OntologyV6";
import { ManagedV6 } from "@/components/v6/ManagedV6";
import { SegmentsV6 } from "@/components/v6/SegmentsV6";
import { ActionV6 } from "@/components/v6/ActionV6";
import { VoicesV6 } from "@/components/v6/VoicesV6";
import { CtaV6 } from "@/components/v6/CtaV6";
import { FooterV6 } from "@/components/v6/FooterV6";
import { RevealController } from "@/components/ui/Reveal";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Transform business complexity into strategic advantage",
  description:
    "A fully managed intelligence and execution layer for your entire business. We connect your systems and unify your data to deliver clear insights and orchestrate execution.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function HomeV6() {
  return (
    <div className={`v6 ${manrope.variable} bg-white text-steel selection:bg-ember/30`}>
      <style>{`html{background:#fff;scrollbar-color:#c7d0dd #fff}body{background:#fff}:focus-visible{outline-color:var(--color-sky-ink)}`}</style>
      <NavV6 />
      <main>
        <HeroV6 />
        <ProblemV6 />
        <LayersV6 />
        <BrainV6 />
        <AgentsV6 />
        <PortalV6 />
        <OntologyV6 />
        <ManagedV6 />
        <SegmentsV6 />
        <ActionV6 />
        <VoicesV6 />
        <CtaV6 />
      </main>
      <FooterV6 />
      <RevealController />
    </div>
  );
}
