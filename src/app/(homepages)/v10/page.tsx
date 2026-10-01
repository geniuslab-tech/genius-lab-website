import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Newsreader } from "next/font/google";
import { NavV10 } from "@/components/v10/NavV10";
import { HeroV10 } from "@/components/v10/HeroV10";
import { ProblemV10 } from "@/components/v10/ProblemV10";
import { LayersV10 } from "@/components/v10/LayersV10";
import { BrainV10 } from "@/components/v10/BrainV10";
import { OntologyV10 } from "@/components/v10/OntologyV10";
import { AgentsV10 } from "@/components/v10/AgentsV10";
import { PortalV10 } from "@/components/v10/PortalV10";
import { DifferenceV10 } from "@/components/v10/DifferenceV10";
import { ManagedV10 } from "@/components/v10/ManagedV10";
import { SegmentsV10 } from "@/components/v10/SegmentsV10";
import { ActionV10 } from "@/components/v10/ActionV10";
import { CloseV10 } from "@/components/v10/CloseV10";
import { RevealController } from "@/components/ui/Reveal";
import "./v10.css";

const serif = Newsreader({
  variable: "--font-v10-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const sans = IBM_Plex_Sans({
  variable: "--font-v10-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Genius Lab | A briefing for leadership teams",
  description:
    "A fully managed intelligence and execution layer for your entire business. We connect your systems and unify your data to deliver clear insights and orchestrate execution.",
};

export const viewport: Viewport = {
  themeColor: "#f6f3ea",
};

export default function HomeV10() {
  return (
    <div className={`v10 ${serif.variable} ${sans.variable}`}>
      <style>{`html{background:#f6f3ea;scrollbar-color:#c9c1ad #f6f3ea;scroll-padding-top:4rem}body{background:#f6f3ea}`}</style>
      <NavV10 />
      <main>
        <HeroV10 />
        <ProblemV10 />
        <LayersV10 />
        <BrainV10 />
        <OntologyV10 />
        <AgentsV10 />
        <PortalV10 />
        <DifferenceV10 />
        <ManagedV10 />
        <SegmentsV10 />
        <ActionV10 />
      </main>
      <CloseV10 />
      <RevealController />
    </div>
  );
}
