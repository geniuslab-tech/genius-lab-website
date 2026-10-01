import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Sora } from "next/font/google";
import "../v24/v24.css";
import { Nav } from "@/components/v24/Hero";
import { BriefHero } from "@/components/brief/BriefHero";

const display = Sora({ variable: "--font-v24-display", subsets: ["latin"], display: "swap" });
const sans = Manrope({ variable: "--font-v24-sans", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-v24-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Transform business complexity into strategic advantage",
  description:
    "A fully managed intelligence and execution layer for your entire business. Genius reads every entity and briefs you on what matters.",
  robots: { index: false },
};

export const viewport: Viewport = {
  themeColor: "#0b1024",
};

/** v39: the v24 hero with the Briefing refined dashboard. */
export default function HomeV39() {
  return (
    <div className={`v24 ${display.variable} ${sans.variable} ${mono.variable}`}>
      <style>{`html,body{background:oklch(0.145 0.032 264)}`}</style>
      <Nav variant="light" />
      <main>
        <BriefHero variant="refined" tint="blue" />
      </main>
    </div>
  );
}
