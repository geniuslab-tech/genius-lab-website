import type { CSSProperties } from "react";
import { BrandLogo } from "@/components/v2/ui";
import { axialToPixel, hexPoints, hexRing } from "@/lib/hex";
import { ChButton, r1 } from "./ui";

const CELLS = [[0, 0] as [number, number], ...hexRing(1), ...hexRing(2)].map(([q, r], i) => {
  const p = axialToPixel(q, r, 28);
  return { x: r1(170 + p.x), y: r1(160 + p.y), i, ring: i === 0 ? 0 : i < 7 ? 1 : 2 };
});

/** The close: one chamfered navy block on the paper ground. */
export function CtaV22() {
  return (
    <section id="contact" className="scroll-mt-[var(--nav)] bg-[var(--paper)] py-20 sm:py-28" aria-labelledby="v22-cta-title">
      <div className="v22-shell">
        <div data-v22r="wipe" className="ch v22-hexfield relative overflow-hidden bg-[var(--navy)] text-white [--c:clamp(32px,6vw,88px)]">
          <div className="grid gap-10 px-6 py-16 sm:px-12 sm:py-20 lg:grid-cols-12 lg:items-center lg:px-16 lg:py-24">
            <div className="lg:col-span-7">
              <p className="v22-label flex items-center gap-3 text-white/60">
                <span className="h-px w-8 bg-[var(--trace)]" aria-hidden="true" />
                One partner. One platform. One source of truth.
              </p>
              <h2 id="v22-cta-title" className="v22-display mt-7 max-w-[17ch] text-[clamp(2.2rem,4.6vw,4.2rem)]">
                Turn your business knowledge into intelligent systems
              </h2>
              <p className="text-pretty mt-7 max-w-[54ch] text-[1.0625rem] leading-[1.7] text-white/70">
                Tell us where your systems and data stand today. We&rsquo;ll show you how Genius Lab turns them into one
                intelligence and execution layer, fully managed.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ChButton href="#" tone="white" size="lg">
                  Talk to us
                </ChButton>
                <ChButton href="#layers" tone="line-dark" size="lg">
                  Explore the platform
                </ChButton>
              </div>
            </div>
            <div className="hidden lg:col-span-5 lg:block">
              <svg viewBox="0 0 340 320" className="ml-auto h-auto w-full max-w-[360px]" aria-hidden="true">
                {CELLS.map((c) => (
                  <polygon
                    key={c.i}
                    points={hexPoints(c.x, c.y, 25)}
                    fill={c.ring === 0 ? "#ffffff" : c.ring === 1 ? "#5577ff" : "transparent"}
                    fillOpacity={c.ring === 1 ? 0.75 : 1}
                    stroke="#9aaeff"
                    strokeOpacity={c.ring === 2 ? 0.35 : 0.7}
                    className="v22-seq"
                    style={{ "--i": c.i } as CSSProperties}
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const COLUMNS = [
  { title: "Capabilities", links: [["Data Engineering", "#layers"], ["Analytics", "#layers"], ["Business Intelligence", "#layers"], ["Artificial Intelligence", "#layers"]] },
  { title: "Genius", links: [["Second Brain", "#brain"], ["AI Agents", "#agents"], ["Genius Portal", "#portal"]] },
  { title: "Company", links: [["Services", "#services"], ["Solutions", "#segments"], ["Contact", "#contact"]] },
];

export function FooterV22() {
  return (
    <footer className="bg-[var(--navy-95)] text-white">
      <div className="v22-shell grid gap-12 pb-12 pt-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <BrandLogo tone="white" className="h-5 w-auto" />
          <p className="mt-5 max-w-[36ch] leading-[1.7] text-white/60">Connected systems, unified data and intelligence for the decisions that matter.</p>
        </div>
        {COLUMNS.map((c, i) => (
          <nav key={c.title} aria-label={c.title} className={`md:col-span-2 ${i === 0 ? "md:col-start-7" : ""}`}>
            <h2 className="v22-label text-white/50">{c.title}</h2>
            <ul className="mt-5 space-y-3">
              {c.links.map(([l, h]) => (
                <li key={l}>
                  <a href={h} className="text-[0.9375rem] text-white/75 transition-colors hover:text-white">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="v22-shell flex flex-col gap-3 border-t border-white/10 py-6 text-[0.8125rem] text-white/55 sm:flex-row sm:justify-between">
        <span>&copy; 2026 Genius Lab Technology. Figures, previews and client marks shown are illustrative.</span>
        <span className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
        </span>
      </div>
    </footer>
  );
}
