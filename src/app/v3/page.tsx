import type { Metadata, Viewport } from "next";
import { NavV2 } from "@/components/v2/NavV2";
import { HeroV3 } from "@/components/v3/HeroV3";
import { ProblemV2 } from "@/components/v2/ProblemV2";
import { LayersV2 } from "@/components/v2/LayersV2";
import { BrainV2 } from "@/components/v2/BrainV2";
import { AgentsV2 } from "@/components/v2/AgentsV2";
import { PortalV2 } from "@/components/v2/PortalV2";
import { OntologyV2 } from "@/components/v2/OntologyV2";
import { ManagedV2 } from "@/components/v2/ManagedV2";
import { SegmentsV2 } from "@/components/v2/SegmentsV2";
import { ActionV2 } from "@/components/v2/ActionV2";
import { VoicesV2 } from "@/components/v2/VoicesV2";
import { CtaV2 } from "@/components/v2/CtaV2";
import { FooterV2 } from "@/components/v2/FooterV2";
import { RevealController } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Genius Lab | Transform business complexity into strategic advantage",
  description:
    "We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the software you already rely on.",
};

export const viewport: Viewport = {
  themeColor: "#101440",
};

export default function HomeV3() {
  return (
    <div className="bg-paper text-navy selection:bg-signal selection:text-white">
      <style>{`html{background:var(--color-paper);scrollbar-color:var(--color-navy-300) var(--color-paper)}:focus-visible{outline-color:var(--color-signal)}`}</style>
      <NavV2 version={3} />
      <main>
        <HeroV3 />
        <ProblemV2 />
        <LayersV2 />
        <BrainV2 />
        <AgentsV2 />
        <PortalV2 />
        <OntologyV2 />
        <ManagedV2 />
        <SegmentsV2 />
        <ActionV2 />
        <VoicesV2 />
        <CtaV2 />
      </main>
      <FooterV2 />
      <RevealController />
    </div>
  );
}
