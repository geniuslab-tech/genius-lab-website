import type { Metadata, Viewport } from "next";
import { NavV4 } from "@/components/v4/NavV4";
import { HeroV4 } from "@/components/v4/HeroV4";
import { ProblemV4 } from "@/components/v4/ProblemV4";
import { LayersV4 } from "@/components/v4/LayersV4";
import { BrainV4 } from "@/components/v4/BrainV4";
import { AgentsV4 } from "@/components/v4/AgentsV4";
import { PortalV4 } from "@/components/v4/PortalV4";
import { OntologyV4 } from "@/components/v4/OntologyV4";
import { ManagedV4 } from "@/components/v4/ManagedV4";
import { SegmentsV4 } from "@/components/v4/SegmentsV4";
import { ActionV4 } from "@/components/v4/ActionV4";
import { VoicesV4 } from "@/components/v4/VoicesV4";
import { CtaV4 } from "@/components/v4/CtaV4";
import { FooterV4 } from "@/components/v4/FooterV4";
import { RevealController } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Genius Lab | Transform business complexity into strategic advantage",
  description:
    "We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the software you already rely on.",
};

export const viewport: Viewport = {
  themeColor: "#05060e",
};

export default function HomeV4() {
  return (
    <div className="v4-grid bg-void text-white selection:bg-cyan selection:text-void">
      <style>{`html{background:var(--color-void);color-scheme:dark;scrollbar-color:var(--color-void-4) var(--color-void)}body{background:var(--color-void)}:focus-visible{outline-color:var(--color-cyan)}`}</style>
      <NavV4 />
      <main>
        <HeroV4 />
        <ProblemV4 />
        <LayersV4 />
        <BrainV4 />
        <AgentsV4 />
        <PortalV4 />
        <OntologyV4 />
        <ManagedV4 />
        <SegmentsV4 />
        <ActionV4 />
        <VoicesV4 />
        <CtaV4 />
      </main>
      <FooterV4 />
      <RevealController />
    </div>
  );
}
