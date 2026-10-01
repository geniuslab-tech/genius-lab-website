import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./v18.css";
import { NavV18 } from "@/components/v18/NavV18";
import { HeroV18, LogosV18 } from "@/components/v18/HeroV18";
import { ProblemV18 } from "@/components/v18/ProblemV18";
import { StackV18 } from "@/components/v18/StackV18";
import { PortalV18 } from "@/components/v18/PortalV18";
import { IntelligenceV18 } from "@/components/v18/IntelligenceV18";
import { ServicesV18 } from "@/components/v18/ServicesV18";
import { SegmentsV18 } from "@/components/v18/SegmentsV18";
import { ActionV18, CtaV18, FooterV18 } from "@/components/v18/ClosingV18";
import { RevealV18 } from "@/components/v18/ui";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Transform business complexity into strategic advantage",
  description:
    "A fully managed intelligence and execution layer for your entire business. We connect your systems and unify your data to deliver clear insights and orchestrate execution.",
};

export const viewport: Viewport = {
  themeColor: "#101440",
};

export default function HomeV18() {
  return (
    <div className={`v18 ${jakarta.variable} min-h-screen antialiased`}>
      <style>{`html{background:#ffffff;scrollbar-color:#c4c9d8 #ffffff}body{background:#ffffff}`}</style>
      <NavV18 />
      <main>
        <HeroV18 />
        <LogosV18 />
        <ProblemV18 />
        <StackV18 />
        <PortalV18 />
        <IntelligenceV18 />
        <ServicesV18 />
        <SegmentsV18 />
        <ActionV18 />
        <CtaV18 />
      </main>
      <FooterV18 />
      <RevealV18 />
    </div>
  );
}
