import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Inter_Tight } from "next/font/google";
import "./v14.css";
import { Nav14 } from "@/components/v14/Nav14";
import { Hero14 } from "@/components/v14/Hero14";
import { Marquee14 } from "@/components/v14/Marquee14";
import { Problem14 } from "@/components/v14/Problem14";
import { Layers14 } from "@/components/v14/Layers14";
import { Brain14 } from "@/components/v14/Brain14";
import { Agents14 } from "@/components/v14/Agents14";
import { Ontology14 } from "@/components/v14/Ontology14";
import { Portal14 } from "@/components/v14/Portal14";
import { Managed14 } from "@/components/v14/Managed14";
import { Segments14 } from "@/components/v14/Segments14";
import { Action14 } from "@/components/v14/Action14";
import { Voices14 } from "@/components/v14/Voices14";
import { Cta14 } from "@/components/v14/Cta14";
import { Footer14 } from "@/components/v14/Footer14";
import { Reveal14 } from "@/components/v14/Reveal14";

const display = Bricolage_Grotesque({ variable: "--font-v14-display", subsets: ["latin"], axes: ["opsz", "wdth"], display: "swap" });
const body = Inter_Tight({ variable: "--font-v14-body", subsets: ["latin"], display: "swap" });
const mono = IBM_Plex_Mono({ variable: "--font-v14-mono", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Transform business complexity into strategic advantage",
  description:
    "A fully managed intelligence and execution layer for your entire business. We connect your systems and unify your data to deliver clear insights and orchestrate execution.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

/** Placeholder client marks, to be replaced with approved logos. */
const MARKS = ["Vanta Group", "Helios", "Caldera", "Orbis", "Stratum", "Northpeak"];

export default function HomeV14() {
  return (
    <div className={`v14 ${display.variable} ${body.variable} ${mono.variable} selection:bg-[#1f3bff] selection:text-white`}>
      <style>{`html{background:#fff;scrollbar-color:#000 #fff}body{background:#fff}`}</style>
      <Nav14 />
      <main>
        <Hero14 />
        <Marquee14 label="Client marks · placeholders" items={MARKS} seconds={32} />
        <Problem14 />
        <Marquee14 tone="u" reverse items={["Connect", "Never rip and replace", "Build on what you already run", "Remove the glue"]} seconds={36} />
        <Layers14 />
        <Marquee14
          items={["Data Engineering", "Analytics", "Business Intelligence", "Artificial Intelligence", "Better decisions"]}
          seconds={44}
        />
        <Brain14 />
        <Agents14 />
        <Ontology14 />
        <Portal14 />
        <Managed14 />
        <Segments14 />
        <Action14 />
        <Voices14 />
        <Marquee14 tone="u" reverse items={["One partner", "One platform", "One source of truth"]} seconds={28} />
        <Cta14 />
      </main>
      <Footer14 />
      <Reveal14 />
    </div>
  );
}
