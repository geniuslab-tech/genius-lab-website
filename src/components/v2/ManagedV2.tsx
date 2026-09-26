import { h2Class } from "./ui";

const STEPS = [
  { name: "Design", body: "We map your systems, data and decisions, and design the target architecture." },
  { name: "Build", body: "We connect, engineer, model and deploy every layer, on the Genius Portal." },
  { name: "Run", body: "We host, monitor and support it, with clear service levels." },
  { name: "Improve", body: "We keep extending metrics, dashboards and agents as the business changes." },
];

const INCLUDED = ["Implementation", "Hosting", "Monitoring", "Security", "Support", "Continuous improvement"];

/**
 * The managed-service loop: four stages on a ring that never stops turning, around a seal
 * that says the work arrives finished. The client sees the result, not the machinery.
 */
function ManagedLoop() {
  const C = 240;
  const R = 172;
  const nodes = STEPS.map((s, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 2;
    return { ...s, x: Math.round((C + Math.cos(a) * R) * 100) / 100, y: Math.round((C + Math.sin(a) * R) * 100) / 100 };
  });
  return (
    <svg viewBox="0 0 480 480" className="h-auto w-full" role="img" aria-label="A continuous loop of design, build, run and improve, managed by Genius Lab, around a seal marking delivery.">
      <defs>
        <linearGradient id="loop-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5577ff" stopOpacity="0" />
          <stop offset="1" stopColor="#5577ff" stopOpacity="1" />
        </linearGradient>
        <radialGradient id="seal-light">
          <stop offset="0" stopColor="#5577ff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#5577ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={C} cy={C} r="150" fill="url(#seal-light)" />
      <circle cx={C} cy={C} r={R} fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="18" />
      <circle cx={C} cy={C} r={R} fill="none" stroke="white" strokeOpacity="0.35" strokeDasharray="2 7" />
      {/* The sweep: work always in motion, handled by Genius Lab. */}
      <g className="origin-center motion-safe:animate-[spin_9s_linear_infinite] [transform-box:view-box]">
        <path d={`M${C},${C - R} A${R},${R} 0 0 1 ${C + R},${C}`} fill="none" stroke="url(#loop-sweep)" strokeWidth="18" strokeLinecap="round" />
        <circle cx={C + R} cy={C} r="6" fill="white" />
      </g>
      {nodes.map((n) => (
        <g key={n.name}>
          <circle cx={n.x} cy={n.y} r="26" fill="var(--color-navy)" stroke="white" strokeOpacity="0.7" strokeWidth="1.5" />
          <text x={n.x} y={n.y + 4.5} textAnchor="middle" className="fill-white text-[12.5px] font-semibold">
            {n.name}
          </text>
        </g>
      ))}
      {/* The seal: delivered, ready to use. */}
      <circle cx={C} cy={C} r="92" fill="white" />
      <circle cx={C} cy={C} r="78" fill="none" stroke="var(--color-navy)" strokeOpacity="0.25" strokeDasharray="3 5" />
      <path d={`M${C - 30},${C - 6} L${C - 8},${C + 16} L${C + 32},${C - 26}`} fill="none" stroke="var(--color-signal-ink)" strokeWidth="9" strokeLinecap="square" />
      <text x={C} y={C + 52} textAnchor="middle" className="type-mono fill-navy/70 text-[11px]">
        DELIVERED READY
      </text>
    </svg>
  );
}

export function ManagedV2() {
  return (
    <section id="managed" data-ground="dark" className="relative isolate scroll-mt-16 overflow-hidden bg-navy py-24 text-white [clip-path:polygon(0_0,calc(100%-48px)_0,100%_48px,100%_100%,0_100%)] sm:py-32 lg:py-40 lg:[clip-path:polygon(0_0,calc(100%-120px)_0,100%_120px,100%_100%,0_100%)]" aria-labelledby="v2-managed-title">
      <div className="pointer-events-none absolute right-[-10%] top-1/2 -z-10 h-[70vw] w-[70vw] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(85_119_255/0.3),transparent)] lg:h-[50vw] lg:w-[50vw]" aria-hidden="true" />
      <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <h2 id="v2-managed-title" data-reveal="up" className={`${h2Class} max-w-[13ch]`}>
            Fully managed by Genius Lab.
          </h2>
          <p data-reveal="up" data-delay="100" className="mt-8 max-w-[52ch] text-lg leading-relaxed text-white/70">
            You don&rsquo;t need to hire a data team, stitch tools together or maintain infrastructure. We implement
            everything, hand it over ready to use, and keep it running.
          </p>

          <ol className="mt-10 grid gap-x-8 sm:grid-cols-2">
            {STEPS.map((s, i) => (
              <li key={s.name} className="border-t border-white/15 py-5">
                <div className="flex items-baseline gap-3">
                  <span className="type-mono text-[0.75rem] text-signal">0{i + 1}</span>
                  <span className="type-wide text-lg font-medium">We {s.name.toLowerCase()} it.</span>
                </div>
                <p className="mt-2 leading-relaxed text-white/65">{s.body}</p>
              </li>
            ))}
          </ol>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Included">
            {INCLUDED.map((x) => (
              <li key={x} className="inline-flex h-8 items-center gap-2 bg-white/[0.08] px-3 text-[0.8125rem] text-white/85">
                <span className="h-1.5 w-1.5 bg-signal [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]" aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal="up" data-delay="120" className="mx-auto w-full max-w-[520px] lg:col-span-6 lg:max-w-none">
          <ManagedLoop />
        </div>
      </div>
    </section>
  );
}
