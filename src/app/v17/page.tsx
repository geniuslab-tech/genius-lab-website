import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { Nav17 } from "@/components/v17/Nav17";
import { Hero17 } from "@/components/v17/Hero17";
import { Problem17 } from "@/components/v17/Problem17";
import { Layers17 } from "@/components/v17/Layers17";
import { Brain17 } from "@/components/v17/Brain17";
import { Agents17 } from "@/components/v17/Agents17";
import { Portal17 } from "@/components/v17/Portal17";
import { Ontology17 } from "@/components/v17/Ontology17";
import { Managed17 } from "@/components/v17/Managed17";
import { Segments17 } from "@/components/v17/Segments17";
import { Action17 } from "@/components/v17/Action17";
import { Questions17 } from "@/components/v17/Questions17";
import { Cta17 } from "@/components/v17/Cta17";
import { Footer17 } from "@/components/v17/Footer17";
import { Thread17 } from "@/components/v17/Thread17";
import { Motion17 } from "@/components/v17/Motion17";
import "./v17.css";

const fraunces = Fraunces({
  variable: "--font-v17-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const dmSans = DM_Sans({ variable: "--font-v17-sans", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Genius Lab | Transform business complexity into strategic advantage",
  description:
    "A fully managed intelligence and execution layer for your entire business. We connect your systems and unify your data to deliver clear insights and orchestrate execution.",
};

export const viewport: Viewport = {
  themeColor: "#f6f0e6",
};

export default function HomeV17() {
  return (
    <div className={`v17 ${fraunces.variable} ${dmSans.variable} min-h-screen`}>
      <style>{`html{background:#f6f0e6;scrollbar-color:#c9b99c #f6f0e6}body{background:#f6f0e6}`}</style>
      <Motion17>
        <Nav17 />
        <main className="relative">
          <Thread17 />
          <Hero17 />
          <Problem17 />
          <Layers17 />
          <Brain17 />
          <Agents17 />
          <Portal17 />
          <Ontology17 />
          <Managed17 />
          <Segments17 />
          <Action17 />
          <Questions17 />
          <Cta17 />
        </main>
        <Footer17 />
      </Motion17>
    </div>
  );
}
