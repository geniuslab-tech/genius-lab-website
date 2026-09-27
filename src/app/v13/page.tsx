import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Schibsted_Grotesk } from "next/font/google";
import { SplitStage } from "@/components/v13/SplitStage";
import {
  ActionCh,
  AgentsCh,
  BrainCh,
  ContactCh,
  FooterV13,
  HeroCh,
  LayersCh,
  OntologyCh,
  PlatformCh,
  ProblemCh,
  SolutionsCh,
} from "@/components/v13/Chapters";
import "./v13.css";

const display = Schibsted_Grotesk({ variable: "--font-v13-display", subsets: ["latin"], weight: ["600", "800"], display: "swap" });
const text = IBM_Plex_Sans({ variable: "--font-v13-text", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
const mono = IBM_Plex_Mono({ variable: "--font-v13-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Transform business complexity into strategic advantage",
  description:
    "A fully managed intelligence and execution layer for your entire business. We connect your systems and unify your data to deliver clear insights and orchestrate execution.",
};

export const viewport: Viewport = {
  themeColor: "#0b0e32",
};

export default function HomeV13() {
  return (
    <div className={`v13 ${display.variable} ${text.variable} ${mono.variable}`}>
      <style>{`html{background:#0b0e32;scrollbar-color:#3a3f78 #0b0e32}body{background:#0b0e32}`}</style>
      <SplitStage>
        <HeroCh />
        <ProblemCh />
        <LayersCh />
        <BrainCh />
        <AgentsCh />
        <OntologyCh />
        <PlatformCh />
        <SolutionsCh />
        <ActionCh />
        <ContactCh />
      </SplitStage>
      <FooterV13 />
    </div>
  );
}
