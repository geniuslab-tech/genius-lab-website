import { NodeField } from "./NodeField";
import { Button, HexMark } from "./ui";

/** Hub labels on the hero graph: the systems, models and outputs the Second Brain connects. */
const HUBS = [
  { label: "erp.orders" },
  { label: "crm.accounts" },
  { label: "finance.gl_entries" },
  { label: "ops.events" },
  { label: "bi.dashboards" },
  { label: "metrics.revenue" },
  { label: "ai.agents" },
  { label: "decision" },
];
const HERO_ACTIVE: number[] = [];

/** Placeholder client marks, to be replaced with approved logos. */
const LOGOS = ["Vanta Group", "Helios", "Caldera", "Orbis", "Stratum", "Northpeak"];

export function HeroV16() {
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden" aria-labelledby="v16-hero-title">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_55%_65%_at_72%_48%,#111a55_0%,transparent_70%),radial-gradient(ellipse_60%_50%_at_10%_0%,#0d1238_0%,transparent_70%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-20 h-[45%] [transform:perspective(600px)_rotateX(62deg)] origin-bottom opacity-70 v16-grid-floor" aria-hidden="true" />
      <div className="absolute inset-0 -z-10">
        <NodeField variant="hero" hubs={HUBS} active={HERO_ACTIVE} warmHub={7} />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(6_8_24/0.85),rgb(6_8_24/0.35)_45%,transparent_70%)] max-lg:bg-[linear-gradient(180deg,rgb(6_8_24/0.6),rgb(6_8_24/0.2)_60%,transparent)]" aria-hidden="true" />

      <div className="v16-wrap relative w-full flex-1 pb-[48svh] pt-32 lg:flex lg:items-center lg:pb-24 lg:pt-28">
        <div className="max-w-[640px]">
          <p className="v16-rise v16-label flex items-center gap-3 text-[color:var(--tx-2)] [--d:0ms]">
            <HexMark size={14} className="text-[color:var(--ice)]" />
            One partner. One platform. One source of truth.
          </p>
          <h1 id="v16-hero-title" className="v16-rise v16-display mt-7 text-[clamp(2.5rem,5.6vw,4.75rem)] [--d:90ms]">
            Transform Business Complexity into <span className="text-[color:var(--ice)]">Strategic Advantage</span>
          </h1>
          <p className="v16-rise mt-8 max-w-[34ch] text-[1.1875rem] font-medium leading-snug [--d:180ms]">
            A fully managed intelligence and execution layer for your entire business.
          </p>
          <p className="v16-rise v16-lead mt-4 max-w-[52ch] [--d:240ms]">
            We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on
            the software you already rely on.
          </p>
          <div className="v16-rise mt-10 flex flex-wrap gap-3 [--d:320ms]">
            <Button href="#action">See Genius Lab in action</Button>
            <Button href="#contact" tone="ghost">
              Book a demo
            </Button>
          </div>
        </div>
      </div>

      <div className="relative border-t border-[color:var(--line)] bg-[rgb(6_8_24/0.6)]">
        <div className="v16-wrap flex flex-col gap-4 py-5 md:flex-row md:items-center md:gap-10">
          <p className="v16-label shrink-0 text-[color:var(--tx-3)]">Client logos · placeholders</p>
          <div className="min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_88%,transparent)]">
            <ul className="v16-marquee flex w-max gap-14" aria-label="Client logos (placeholders)">
              {[...LOGOS, ...LOGOS].map((l, i) => (
                <li key={i} aria-hidden={i >= LOGOS.length || undefined} className="v16-mono whitespace-nowrap text-[0.8125rem] uppercase tracking-[0.28em] text-[color:var(--tx-3)]">
                  {l}
                </li>
              ))}
            </ul>
          </div>
          <p className="v16-label hidden shrink-0 text-[color:var(--tx-3)] xl:block">Graph · illustrative</p>
        </div>
      </div>
    </section>
  );
}
