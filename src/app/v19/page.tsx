import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./v19.css";
import { NavV19 } from "@/components/v19/NavV19";
import { HeroV19 } from "@/components/v19/HeroV19";
import { ProblemV19 } from "@/components/v19/ProblemV19";
import { LayersV19 } from "@/components/v19/LayersV19";
import { BrainV19 } from "@/components/v19/BrainV19";
import { AgentsV19 } from "@/components/v19/AgentsV19";
import { TourV19 } from "@/components/v19/TourV19";
import { OntologyV19 } from "@/components/v19/OntologyV19";
import { ManagedV19 } from "@/components/v19/ManagedV19";
import { SegmentsV19 } from "@/components/v19/SegmentsV19";
import { VoicesV19 } from "@/components/v19/VoicesV19";
import { CtaV19 } from "@/components/v19/CtaV19";
import { FooterV19 } from "@/components/v19/FooterV19";
import { RevealV19 } from "@/components/v19/Reveal";

const sans = Geist({ variable: "--font-v19-sans", subsets: ["latin"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-v19-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Transform business complexity into strategic advantage",
  description:
    "We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the software you already rely on.",
};

export const viewport: Viewport = {
  themeColor: "#05070f",
};

export default function HomeV19() {
  return (
    <div className={`v19 ${sans.variable} ${mono.variable}`}>
      <style>{`html{background:#05070f;color-scheme:dark;scrollbar-color:#222a55 #05070f}body{background:#05070f}`}</style>
      <NavV19 />
      <main>
        <HeroV19 />
        <ProblemV19 />
        <LayersV19 />
        <BrainV19 />
        <AgentsV19 />
        <TourV19 />
        <OntologyV19 />
        <ManagedV19 />
        <SegmentsV19 />
        <VoicesV19 />
        <CtaV19 />
      </main>
      <FooterV19 />
      <RevealV19 />
    </div>
  );
}
