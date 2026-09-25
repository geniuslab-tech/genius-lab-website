import { contourAt, contourGenerator, contourPath, hillsAt, mulberry32 } from "@/lib/terrain";
import { Button } from "@/components/ui/Button";

/** Contour rings computed once on the server: the action sits at the summit. */
function rings() {
  const cols = 160;
  const rows = 90;
  const rand = mulberry32(31);
  const hills = [
    { x: 0.8, y: 0.74, h: 1, r: 0.17 },
    { x: 0.56, y: 0.5, h: 0.42, r: 0.16 },
    { x: 0.3, y: 0.3, h: 0.3, r: 0.2 },
    ...Array.from({ length: 9 }, () => ({ x: rand(), y: rand(), h: (rand() - 0.45) * 0.3, r: 0.06 + rand() * 0.1 })),
  ];
  const values = new Float64Array(cols * rows);
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) values[j * cols + i] = hillsAt(hills, i / cols, j / rows, cols / rows);
  const gen = contourGenerator().size([cols, rows]);
  return Array.from({ length: 14 }, (_, k) => contourPath(contourAt(gen, values, 0.04 + k * 0.07), 10));
}

export function Cta() {
  const paths = rings();
  return (
    <section id="contact" className="relative isolate scroll-mt-16 overflow-hidden border-t border-rule py-28 sm:py-36 lg:py-44" aria-labelledby="cta-title">
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 -z-10 h-full w-full"
        aria-hidden="true"
      >
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={i === paths.length - 2 ? "var(--color-survey)" : "var(--color-ink)"}
            strokeOpacity={i === paths.length - 2 ? 1 : 0.14 + i * 0.02}
            strokeWidth={i === paths.length - 2 ? 1.8 : 1}
          />
        ))}
      </svg>

      <h2 id="cta-title" className="type-display whitespace-nowrap text-[clamp(3.5rem,13vw,13rem)] leading-[0.9] [font-variation-settings:'wdth'_125]">
        <span data-reveal className="block pl-[var(--gutter)]">
          Let&rsquo;s map
        </span>
        <span data-reveal data-delay="120" className="block pl-[30vw]">
          your data.
        </span>
      </h2>

      <div className="shell mt-14 flex flex-col gap-8 sm:mt-20 md:flex-row md:items-center md:justify-between">
        <p className="max-w-[40ch] text-lg leading-relaxed text-ink-2">
          Text text text. Tell us where your data lives and what you need to know. We&rsquo;ll come back with a
          survey plan.
        </p>
        <Button href="#" size="lg" variant="survey">
          Talk to us
        </Button>
      </div>
    </section>
  );
}
