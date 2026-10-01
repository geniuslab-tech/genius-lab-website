import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/hero/Hero";
import { Platform } from "@/components/sections/Platform";
import { Transformation } from "@/components/sections/Transformation";
import { Capabilities } from "@/components/sections/Capabilities";
import { Atlas } from "@/components/sections/Atlas";
import { Method } from "@/components/sections/Method";
import { Cta } from "@/components/sections/Cta";
import { RevealController } from "@/components/ui/Reveal";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Platform />
        <Transformation />
        <Capabilities />
        <Atlas />
        <Method />
        <Cta />
      </main>
      <Footer />
      <RevealController />
    </>
  );
}
