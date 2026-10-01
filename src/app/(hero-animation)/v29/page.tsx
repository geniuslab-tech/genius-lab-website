import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Sora } from "next/font/google";
import "@/app/(hero-animation)/v24/v24.css";
import { Nav } from "@/components/v24/Hero";
import { Hero } from "@/components/v29/Hero";

const display = Sora({ variable: "--font-v24-display", subsets: ["latin"], display: "swap" });
const sans = Manrope({ variable: "--font-v24-sans", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-v24-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Integrate an acquisition in days",
  description:
    "Watch Genius connect a newly acquired company, map its chart of accounts and run the first group consolidation.",
  robots: { index: false },
};

export const viewport: Viewport = {
  themeColor: "#0b1024",
};

export default function HomeV29() {
  return (
    <div className={`v24 ${display.variable} ${sans.variable} ${mono.variable}`}>
      <style>{`html,body{background:oklch(0.145 0.032 264)}`}</style>
      <Nav variant="light" />
      <main>
        <Hero />
      </main>
    </div>
  );
}
