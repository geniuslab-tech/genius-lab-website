import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Sora } from "next/font/google";
import "@/app/(hero-animation)/v24/v24.css";
import { Nav } from "@/components/v24/Hero";
import { Hero } from "@/components/v25/Hero";

const display = Sora({ variable: "--font-v24-display", subsets: ["latin"], display: "swap" });
const sans = Manrope({ variable: "--font-v24-sans", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-v24-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | From signal to executed decision",
  description:
    "A fully managed intelligence and execution layer for your entire business. Watch Genius turn a cash signal into an approved, executed and audited decision.",
  robots: { index: false },
};

export const viewport: Viewport = {
  themeColor: "#0b1024",
};

export default function HomeV25() {
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
