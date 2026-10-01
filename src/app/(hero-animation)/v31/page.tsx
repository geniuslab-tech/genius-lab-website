import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Sora } from "next/font/google";
import "@/app/(hero-animation)/v24/v24.css";
import { Nav } from "@/components/v24/Hero";
import { Hero } from "@/components/v31/Hero";

const display = Sora({ variable: "--font-v24-display", subsets: ["latin"], display: "swap" });
const sans = Manrope({ variable: "--font-v24-sans", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-v24-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Stress-test the plan",
  description:
    "Watch a CFO drag a tariff shock into the plan, see the covenant breach and arm a priced contingency.",
  robots: { index: false },
};

export const viewport: Viewport = {
  themeColor: "#070a18",
};

export default function HomeV31() {
  return (
    <div className={`v24 v28 ${display.variable} ${sans.variable} ${mono.variable}`}>
      <style>{`html,body{background:oklch(0.12 0.028 266)}`}</style>
      <Nav variant="light" />
      <main>
        <Hero />
      </main>
    </div>
  );
}
