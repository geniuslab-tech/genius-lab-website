import type { CSSProperties } from "react";
import { LOGOS } from "./data";
import { Decode } from "./Decode";
import { Shell } from "./Shell";
import { WRAP } from "./ui";

const BOOT = ["data-engineering", "analytics", "business-intelligence", "artificial-intelligence", "ready"];

export function Hero() {
  return (
    <section id="top" tabIndex={-1} className="relative overflow-hidden pb-20 pt-12 sm:pb-28 sm:pt-16 lg:pt-20" aria-labelledby="v11-hero-title">
      {/* A faint grid of character cells behind the fold. */}
      <div
        className="pointer-events-none absolute inset-0 -z-0 opacity-60 [background-image:linear-gradient(rgb(236_229_215/0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(236_229_215/0.035)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_80%_70%_at_30%_30%,#000,transparent_75%)]"
        aria-hidden="true"
      />
      <div className={`${WRAP} relative grid gap-12 lg:grid-cols-12 lg:gap-10`}>
        <div className="lg:col-span-6 lg:pt-4">
          <p className="v11-term v11-tick flex flex-wrap gap-x-2 text-[12px] text-(--fg-3)" aria-label="Boot sequence: four layers mounted, ready.">
            <span style={{ "--i": 0 } as CSSProperties} aria-hidden="true">
              boot
            </span>
            {BOOT.map((b, i) => (
              <span key={b} style={{ "--i": i + 1 } as CSSProperties} className={b === "ready" ? "text-(--amber)" : ""} aria-hidden="true">
                <span className="text-(--fg-3)">&raquo;</span> {b}
              </span>
            ))}
          </p>

          <p className="v11-intro v11-label mt-8 text-(--amber-2)" style={{ "--d": "80ms" } as CSSProperties}>
            {"// One partner. One platform. One source of truth."}
          </p>
          <Decode
            as="h1"
            boot={false}
            id="v11-hero-title"
            duration={1100}
            text="Transform Business Complexity into Strategic Advantage"
            className="v11-display mt-5 text-[clamp(2.1rem,5vw,3.9rem)] text-(--fg)"
          />
          <p className="v11-intro mt-8 max-w-[52ch] text-[17px] font-semibold leading-snug text-(--fg)" style={{ "--d": "200ms" } as CSSProperties}>
            A fully managed intelligence and execution layer for your entire business.
          </p>
          <p className="v11-intro mt-4 max-w-[56ch] text-pretty text-[15.5px] leading-[1.75] text-(--fg-2)" style={{ "--d": "260ms" } as CSSProperties}>
            We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the software you
            already rely on.
          </p>
          <div className="v11-intro mt-9 flex flex-wrap gap-3" style={{ "--d": "340ms" } as CSSProperties}>
            <a href="#action" className="v11-btn">
              See Genius Lab in action <span aria-hidden="true">&rarr;</span>
            </a>
            <a href="#contact" className="v11-btn v11-btn-ghost">
              Book a demo
            </a>
          </div>

          <div className="v11-intro mt-14 border-t border-(--rule) pt-5" style={{ "--d": "440ms" } as CSSProperties}>
            <p className="v11-term text-[12px] text-(--fg-3)">
              <span className="text-(--amber)">$</span> cat clients.txt <span className="text-(--fg-3)"># placeholder marks</span>
            </p>
            <p className="mt-1 text-[12.5px] text-(--fg-2)">Trusted by operators, manufacturers and value creation teams</p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2" aria-label="Client logos (placeholders)">
              {LOGOS.map((l) => (
                <li key={l} className="v11-label text-[11.5px] tracking-[0.22em] text-(--fg-3)">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-6">
          <Shell />
        </div>
      </div>
    </section>
  );
}
