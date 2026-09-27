import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";
import "./v12.css";
import { NavV12 } from "@/components/v12/NavV12";
import { HeroV12 } from "@/components/v12/HeroV12";
import { ProblemV12 } from "@/components/v12/ProblemV12";
import { PlatformV12 } from "@/components/v12/PlatformV12";
import { BrainV12 } from "@/components/v12/BrainV12";
import { PortalV12 } from "@/components/v12/PortalV12";
import { OntologyV12 } from "@/components/v12/OntologyV12";
import { ManagedV12 } from "@/components/v12/ManagedV12";
import { SegmentsV12 } from "@/components/v12/SegmentsV12";
import { ActionV12, CtaV12, FooterV12 } from "@/components/v12/ClosingV12";
import { RevealV12 } from "@/components/v12/ui";

const onest = Onest({ variable: "--font-onest", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Transform business complexity into strategic advantage",
  description:
    "A fully managed intelligence and execution layer for your entire business. We connect your systems and unify your data to deliver clear insights and orchestrate execution.",
};

export const viewport: Viewport = {
  themeColor: "#f2f3f6",
};

export default function HomeV12() {
  return (
    <div className={`v12 ${onest.variable} min-h-screen antialiased`}>
      <style>{`html{background:#f2f3f6;scrollbar-color:#c4c8d6 #f2f3f6}body{background:#f2f3f6}`}</style>
      <NavV12 />
      <main>
        <HeroV12 />
        <ProblemV12 />
        <PlatformV12 />
        <BrainV12 />
        <PortalV12 />
        <OntologyV12 />
        <ManagedV12 />
        <SegmentsV12 />
        <ActionV12 />
        <CtaV12 />
      </main>
      <FooterV12 />
      <RevealV12 />
    </div>
  );
}
