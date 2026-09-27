import type { Metadata, Viewport } from "next";
import { Fira_Code, IBM_Plex_Mono, Martian_Mono } from "next/font/google";
import { Hero } from "@/components/v11/Hero";
import { Problem } from "@/components/v11/Problem";
import { Layers } from "@/components/v11/Layers";
import { Brain } from "@/components/v11/Brain";
import { Agents } from "@/components/v11/Agents";
import { Ontology } from "@/components/v11/Ontology";
import { Portal } from "@/components/v11/Portal";
import { Managed } from "@/components/v11/Managed";
import { Segments } from "@/components/v11/Segments";
import { Action } from "@/components/v11/Action";
import { Cta, Footer, Voices } from "@/components/v11/Closing";
import { StatusBar, TopBar } from "@/components/v11/Chrome";
import { Palette } from "@/components/v11/Palette";
import { BootController } from "@/components/v11/BootController";
import "./v11.css";

const plex = IBM_Plex_Mono({ variable: "--font-v11-mono", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
const martian = Martian_Mono({ variable: "--font-v11-display", subsets: ["latin"], axes: ["wdth"], display: "swap" });
/** Terminal face for the shell, logs and diagrams: it carries the box-drawing glyphs. */
const fira = Fira_Code({ variable: "--font-v11-term", subsets: ["latin", "symbols2"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Transform business complexity into strategic advantage",
  description:
    "A fully managed intelligence and execution layer for your entire business. We connect your systems and unify your data to deliver clear insights and orchestrate execution.",
};

export const viewport: Viewport = {
  themeColor: "#0b0a08",
};

export default function HomeV11() {
  return (
    <div className={`v11 ${plex.variable} ${martian.variable} ${fira.variable}`}>
      <style>{`html{background:#0b0a08;color-scheme:dark;scrollbar-color:#3a352c #0b0a08}body{background:#0b0a08}`}</style>
      <a
        href="#problem"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-14 focus:z-50 focus:bg-(--amber) focus:px-3 focus:py-2 focus:text-[#1a1206]"
      >
        Skip to content
      </a>
      <TopBar />
      <main>
        <Hero />
        <Problem />
        <Layers />
        <Brain />
        <Agents />
        <Ontology />
        <Portal />
        <Managed />
        <Segments />
        <Action />
        <Voices />
        <Cta />
      </main>
      <Footer />
      <StatusBar />
      <Palette />
      <div className="v11-crt" aria-hidden="true" />
      <BootController />
    </div>
  );
}
