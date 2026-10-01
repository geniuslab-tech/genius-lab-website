import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Source_Serif_4 } from "next/font/google";
import { Nav21 } from "@/components/v21/Nav21";
import { Hero21 } from "@/components/v21/Hero21";
import { Problem21 } from "@/components/v21/Problem21";
import { Capabilities21 } from "@/components/v21/Capabilities21";
import { Brain21 } from "@/components/v21/Brain21";
import { Ontology21 } from "@/components/v21/Ontology21";
import { Portal21 } from "@/components/v21/Portal21";
import { Engage21 } from "@/components/v21/Engage21";
import { Segments21 } from "@/components/v21/Segments21";
import { Cta21, Film21, Footer21, Voices21 } from "@/components/v21/Closing21";
import { Thread21 } from "@/components/v21/Thread21";
import { RevealController } from "@/components/v21/ui";
import "./v21.css";

const serif = Source_Serif_4({
  variable: "--font-v21-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const sans = Hanken_Grotesk({ variable: "--font-v21-sans", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Transform business complexity into strategic advantage",
  description:
    "A fully managed intelligence and execution layer for your entire business. We connect your systems and unify your data to deliver clear insights and orchestrate execution.",
};

export const viewport: Viewport = {
  themeColor: "#f4f1ec",
};

export default function HomeV21() {
  return (
    <div className={`v21 ${serif.variable} ${sans.variable} min-h-screen`}>
      <style>{`html{background:#f4f1ec;scrollbar-color:#c9bfae #f4f1ec}body{background:#f4f1ec}`}</style>
      <Nav21 />
      <main className="relative">
        <Thread21 />
        <Hero21 />
        <Problem21 />
        <Capabilities21 />
        <Brain21 />
        <Ontology21 />
        <Portal21 />
        <Engage21 />
        <Segments21 />
        <Film21 />
        <Voices21 />
        <Cta21 />
      </main>
      <Footer21 />
      <RevealController />
    </div>
  );
}
