import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Newsreader, Schibsted_Grotesk } from "next/font/google";
import { Masthead } from "@/components/v8/Masthead";
import { Cover } from "@/components/v8/Cover";
import { Complexity } from "@/components/v8/Complexity";
import { Layers } from "@/components/v8/Layers";
import { Brain } from "@/components/v8/Brain";
import { Agents } from "@/components/v8/Agents";
import { Portal } from "@/components/v8/Portal";
import { Ontology } from "@/components/v8/Ontology";
import { Managed } from "@/components/v8/Managed";
import { Segments } from "@/components/v8/Segments";
import { Film } from "@/components/v8/Film";
import { Voices } from "@/components/v8/Voices";
import { Reply } from "@/components/v8/Reply";
import { Colophon } from "@/components/v8/Colophon";
import { V8Motion } from "@/components/v8/Motion";
import "./v8.css";

const display = Instrument_Serif({ variable: "--v8-display", weight: "400", style: ["normal", "italic"], subsets: ["latin"], display: "swap" });
const text = Newsreader({ variable: "--v8-text", style: ["normal", "italic"], axes: ["opsz"], subsets: ["latin"], display: "swap" });
const sans = Schibsted_Grotesk({ variable: "--v8-sans", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Transform business complexity into strategic advantage",
  description:
    "A fully managed intelligence and execution layer for your entire business. We connect your systems and unify your data to deliver clear insights and orchestrate execution.",
};

export const viewport: Viewport = {
  themeColor: "#f3efe6",
};

export default function HomeV8() {
  return (
    <div className={`v8 ${display.variable} ${text.variable} ${sans.variable}`}>
      <style>{`html{background:#f3efe6;scrollbar-color:#b9b09c #f3efe6;scroll-behavior:smooth}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}body{background:#f3efe6}`}</style>
      <Masthead />
      <main id="v8-main">
        <Cover />
        <Complexity />
        <Layers />
        <Brain />
        <Agents />
        <Portal />
        <Ontology />
        <Managed />
        <Segments />
        <Film />
        <Voices />
        <Reply />
      </main>
      <Colophon />
      <V8Motion />
    </div>
  );
}
