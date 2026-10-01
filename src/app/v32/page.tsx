import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Sora } from "next/font/google";
import "../v24/v24.css";
import { Nav } from "@/components/v24/Hero";
import { FlowUnified } from "@/components/v32/FlowUnified";

const display = Sora({ variable: "--font-v24-display", subsets: ["latin"], display: "swap" });
const sans = Manrope({ variable: "--font-v24-sans", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-v24-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Turn everything your business knows into intelligent action",
  description:
    "From fragmented systems to governed action: one scroll through how Genius Lab harmonizes every entity, briefs the executive team and closes the loop with AI agents.",
  robots: { index: false },
};

export const viewport: Viewport = {
  themeColor: "#0b1024",
};

/** Only the "How it works" cinematic from genius-core-platform, ported as-is. */
export default function HomeV32() {
  return (
    <div className={`v24 ${display.variable} ${sans.variable} ${mono.variable}`}>
      <style>{`html,body{background:oklch(0.145 0.032 264)}`}</style>
      <Nav variant="light" />
      <main className="pt-16">
        <FlowUnified />
      </main>
    </div>
  );
}
