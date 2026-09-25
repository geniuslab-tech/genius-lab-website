import { contourAt, contourGenerator, contourPath, hillsAt } from "@/lib/terrain";
import { CutButton } from "./ui";

/** The close echoes the hero: the same terrain, now in light on navy. */
const TERRAIN = (() => {
  const cols = 180;
  const rows = 90;
  const hills = [
    { x: 0.82, y: 0.35, h: 1, r: 0.18 },
    { x: 0.62, y: 0.78, h: 0.5, r: 0.16 },
    { x: 0.15, y: 0.7, h: 0.35, r: 0.2 },
  ];
  const values = new Float64Array(cols * rows);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) values[j * cols + i] = hillsAt(hills, i / cols, j / rows, cols / rows);
  const gen = contourGenerator().size([cols, rows]);
  return Array.from({ length: 13 }, (_, k) => contourPath(contourAt(gen, values, 0.05 + k * 0.07), 10));
})();

export function CtaV2() {
  return (
    <section
      id="contact"
      data-ground="dark"
      className="relative isolate scroll-mt-16 overflow-hidden bg-navy text-white [clip-path:polygon(0_0,calc(100%-48px)_0,100%_48px,100%_100%,0_100%)] lg:[clip-path:polygon(0_0,calc(100%-120px)_0,100%_120px,100%_100%,0_100%)]"
      aria-labelledby="v2-cta-title"
    >
      <svg viewBox="0 0 1800 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 -z-10 h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id="cta-light" cx="0.8" cy="0.35" r="0.55">
            <stop offset="0" stopColor="#5577ff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#101440" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1800" height="900" fill="url(#cta-light)" />
        {TERRAIN.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={i === 11 ? "#8fa4ff" : "white"} strokeOpacity={i === 11 ? 0.9 : 0.06 + i * 0.022} strokeWidth={i === 11 ? 1.8 : 1} />
        ))}
      </svg>

      <div className="shell py-28 sm:py-36 lg:py-44">
        <h2
          id="v2-cta-title"
          data-reveal="up"
          className="type-display max-w-[16ch] text-[clamp(2.5rem,5.6vw,5.5rem)] leading-[1] [font-variation-settings:'wdth'_118]"
        >
          Turn your business knowledge into intelligent systems.
        </h2>
        <p data-reveal="up" data-delay="100" className="mt-8 max-w-[48ch] text-lg leading-relaxed text-white/70">
          Tell us where your systems and data stand today. We&rsquo;ll show you how Genius Lab turns them into one
          intelligence and execution layer, fully managed.
        </p>
        <div data-reveal="up" data-delay="180" className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <CutButton href="#" tone="white" size="lg">
            Talk to us
          </CutButton>
          <a href="#action" className="text-[0.9375rem] font-medium text-white/80 underline decoration-white/30 underline-offset-[6px] hover:text-white">
            Watch it in action
          </a>
        </div>
      </div>
    </section>
  );
}
