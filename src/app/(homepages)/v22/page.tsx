import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Unbounded } from "next/font/google";
import "./v22.css";
import { NavV22 } from "@/components/v22/NavV22";
import { HeroV22 } from "@/components/v22/HeroV22";
import { ProblemV22 } from "@/components/v22/ProblemV22";
import { LayersV22 } from "@/components/v22/LayersV22";
import { BrainV22 } from "@/components/v22/BrainV22";
import { AgentsV22 } from "@/components/v22/AgentsV22";
import { PortalV22 } from "@/components/v22/PortalV22";
import { OntologyV22 } from "@/components/v22/OntologyV22";
import { ManagedV22 } from "@/components/v22/ManagedV22";
import { SegmentsV22 } from "@/components/v22/SegmentsV22";
import { CtaV22, FooterV22 } from "@/components/v22/ClosingV22";
import { RevealV22 } from "@/components/v22/RevealV22";

const hanken = Hanken_Grotesk({ variable: "--font-hanken", subsets: ["latin"], display: "swap" });
const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Transform business complexity into strategic advantage",
  description:
    "We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the software you already rely on.",
};

export const viewport: Viewport = {
  themeColor: "#101440",
};

export default function HomeV22() {
  return (
    <div className={`v22 ${hanken.variable} ${unbounded.variable}`}>
      <style>{`html{background:#fff;scrollbar-color:#b9bfd3 #fff}body{background:#fff}`}</style>
      <NavV22 />
      <main>
        <HeroV22 />
        <ProblemV22 />
        <LayersV22 />
        <BrainV22 />
        <AgentsV22 />
        <PortalV22 />
        <OntologyV22 />
        <ManagedV22 />
        <SegmentsV22 />
        <CtaV22 />
      </main>
      <FooterV22 />
      <RevealV22 />
    </div>
  );
}
