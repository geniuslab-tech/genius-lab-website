import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Sora } from "next/font/google";
import "../v24/v24.css";
import { Nav } from "@/components/v24/Hero";
import { V36Bento } from "@/components/how/V36Bento";

const display = Sora({ variable: "--font-v24-display", subsets: ["latin"], display: "swap" });
const sans = Manrope({ variable: "--font-v24-sans", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-v24-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | How it works — Bento assembly",
  description: "Turn everything your business knows into intelligent action: from fragmented systems to governed AI agents, in one scroll.",
  robots: { index: false },
};

export const viewport: Viewport = {
  themeColor: "#0b1024",
};

/** v36: the How it works cinematic, Bento assembly direction. */
export default function HomeV36() {
  return (
    <div className={`v24 ${display.variable} ${sans.variable} ${mono.variable}`}>
      <style>{`html,body{background:oklch(0.145 0.032 264)}`}</style>
      <Nav variant="light" />
      <main className="pt-16">
        <V36Bento />
      </main>
    </div>
  );
}
