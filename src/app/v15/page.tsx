import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./v15.css";
import { NavV15 } from "@/components/v15/NavV15";
import { HeroV15 } from "@/components/v15/HeroV15";
import { ProblemV15 } from "@/components/v15/ProblemV15";
import { GalleryV15 } from "@/components/v15/GalleryV15";
import { BrainV15 } from "@/components/v15/BrainV15";
import { AgentsV15 } from "@/components/v15/AgentsV15";
import { OntologyV15 } from "@/components/v15/OntologyV15";
import { PortalV15 } from "@/components/v15/PortalV15";
import { ManagedV15 } from "@/components/v15/ManagedV15";
import { SegmentsV15 } from "@/components/v15/SegmentsV15";
import { ActionV15 } from "@/components/v15/ActionV15";
import { VoicesV15 } from "@/components/v15/VoicesV15";
import { CtaV15 } from "@/components/v15/CtaV15";
import { FooterV15 } from "@/components/v15/FooterV15";
import { RevealV15 } from "@/components/v15/RevealV15";
import { CursorV15 } from "@/components/v15/CursorV15";

const serif = Cormorant_Garamond({
  variable: "--font-lx-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Jost({ variable: "--font-lx-sans", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Transform business complexity into strategic advantage",
  description:
    "We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the software you already rely on.",
};

export const viewport: Viewport = {
  themeColor: "#0c0b0a",
};

export default function HomeV15() {
  return (
    <div className={`v15 ${serif.variable} ${sans.variable}`}>
      <style>{`html{background:#0c0b0a;scrollbar-color:#3a352e #0c0b0a}body{background:#0c0b0a}@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}`}</style>
      <a href="#main" className="lx-skip">
        Skip to content
      </a>
      <NavV15 />
      <main id="main">
        <HeroV15 />
        <ProblemV15 />
        <GalleryV15 />
        <BrainV15 />
        <AgentsV15 />
        <OntologyV15 />
        <PortalV15 />
        <ManagedV15 />
        <SegmentsV15 />
        <ActionV15 />
        <VoicesV15 />
        <CtaV15 />
      </main>
      <FooterV15 />
      <RevealV15 />
      <CursorV15 />
    </div>
  );
}
