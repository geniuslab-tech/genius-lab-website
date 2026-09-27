import type { Metadata, Viewport } from "next";
import { Figtree, Inter_Tight } from "next/font/google";
import { Nav } from "@/components/v20/Nav";
import { Hero } from "@/components/v20/Hero";
import { Problem } from "@/components/v20/Problem";
import { Story } from "@/components/v20/Story";
import { Manifesto } from "@/components/v20/Manifesto";
import { Gallery } from "@/components/v20/Gallery";
import { Managed } from "@/components/v20/Managed";
import { Solutions } from "@/components/v20/Solutions";
import { Film } from "@/components/v20/Film";
import { Cta, Footer, Voices } from "@/components/v20/Closing";
import { RevealController } from "@/components/v20/Reveal";
import "./v20.css";

const display = Inter_Tight({ variable: "--font-v20-display", subsets: ["latin"], weight: ["500", "600", "700"], display: "swap" });
const text = Figtree({ variable: "--font-v20-text", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Transform business complexity into strategic advantage",
  description:
    "We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the software you already rely on.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function HomeV20() {
  return (
    <div data-tone="white" className={`v20 ${display.variable} ${text.variable} bg-white text-[#0c0e24]`}>
      <style>{`html{background:#fff;scrollbar-color:#c7c7cc #fff}body{background:#fff}`}</style>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Story />
        <Manifesto />
        <Gallery />
        <Managed />
        <Solutions />
        <Film />
        <Voices />
        <Cta />
      </main>
      <Footer />
      <RevealController />
    </div>
  );
}
