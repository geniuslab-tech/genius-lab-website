import { h2Class } from "./ui";

/** Each audience gets its own picture of value, drawn in the page's line language. */
function PortfolioArt() {
  // Portfolio companies as a heat grid: one standout, one lagging.
  const cells = Array.from({ length: 24 }, (_, i) => ((i * 47) % 13) / 13);
  return (
    <svg viewBox="0 0 240 120" className="h-full w-full" aria-hidden="true">
      {cells.map((v, i) => {
        const x = 16 + (i % 8) * 27;
        const y = 14 + Math.floor(i / 8) * 32;
        const hot = i === 10;
        const low = i === 21;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width="22"
            height="26"
            fill={hot ? "var(--color-signal-ink)" : low ? "none" : "var(--color-navy)"}
            fillOpacity={hot ? 1 : 0.12 + v * 0.55}
            stroke={low ? "var(--color-signal-ink)" : "none"}
            strokeDasharray={low ? "3 3" : undefined}
          />
        );
      })}
    </svg>
  );
}

function MergeArt() {
  const a = [[40, 30], [22, 62], [52, 92], [70, 56]];
  const b = [[200, 34], [218, 66], [186, 94], [168, 58]];
  return (
    <svg viewBox="0 0 240 120" className="h-full w-full" aria-hidden="true">
      {[a, b].map((set, k) =>
        set.map(([x, y], i) => (
          <line key={`${k}-${i}`} x1={x} y1={y} x2={set[(i + 1) % set.length][0]} y2={set[(i + 1) % set.length][1]} stroke="var(--color-navy)" strokeOpacity="0.35" />
        )),
      )}
      {a.map(([x, y], i) => (
        <path key={i} d={`M${x},${y} C120,${y} 120,${b[i][1]} ${b[i][0]},${b[i][1]}`} fill="none" stroke="var(--color-signal-ink)" strokeOpacity="0.55" strokeDasharray="3 4" className="motion-safe:animate-[dash-flow_1.6s_linear_infinite]" />
      ))}
      {[...a, ...b].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={i < 4 ? "var(--color-navy)" : "var(--color-paper)"} stroke="var(--color-navy)" strokeWidth="1.5" />
      ))}
      <rect x="104" y="48" width="32" height="24" fill="var(--color-signal-ink)" />
      <path d="M112,60 L118,66 L128,54" fill="none" stroke="white" strokeWidth="2.5" />
    </svg>
  );
}

function ConsolidateArt() {
  const leaves = [30, 90, 150, 210];
  return (
    <svg viewBox="0 0 240 120" className="h-full w-full" aria-hidden="true">
      {leaves.map((x, i) => (
        <path key={x} d={`M${x},96 C${x},64 120,64 120,34`} fill="none" stroke={i === 2 ? "var(--color-signal-ink)" : "var(--color-navy)"} strokeOpacity={i === 2 ? 0.9 : 0.35} strokeWidth="1.5" />
      ))}
      {leaves.map((x, i) => (
        <g key={`n${x}`}>
          <rect x={x - 16} y="96" width="32" height="16" fill="var(--color-paper)" stroke="var(--color-navy)" strokeWidth="1.2" />
          <text x={x} y="107.5" textAnchor="middle" className="type-mono fill-navy/70 text-[8px]">
            E{i + 1}
          </text>
        </g>
      ))}
      <rect x="92" y="10" width="56" height="26" fill="var(--color-navy)" />
      <text x="120" y="27" textAnchor="middle" className="type-mono fill-white text-[9px]">
        GROUP
      </text>
    </svg>
  );
}

function OperateArt() {
  const pts = [70, 64, 66, 58, 60, 52, 50, 44, 46, 38, 34];
  const d = pts.map((y, i) => `${i ? "L" : "M"}${16 + i * 21},${y + 20}`).join("");
  return (
    <svg viewBox="0 0 240 120" className="h-full w-full" aria-hidden="true">
      <rect x="16" y="44" width="210" height="22" fill="var(--color-signal-ink)" fillOpacity="0.08" />
      <line x1="16" x2="226" y1="55" y2="55" stroke="var(--color-signal-ink)" strokeOpacity="0.5" strokeDasharray="4 4" />
      <path d={d} fill="none" stroke="var(--color-navy)" strokeWidth="2" />
      <circle cx={16 + 10 * 21} cy={34 + 20} r="5" fill="var(--color-signal-ink)" />
      <circle cx={16 + 10 * 21} cy={34 + 20} r="10" fill="none" stroke="var(--color-signal-ink)" strokeOpacity="0.4" className="motion-safe:animate-ping [transform-box:fill-box] origin-center" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1={16 + i * 42} x2={16 + i * 42} y1="104" y2="108" stroke="var(--color-navy)" strokeOpacity="0.35" />
      ))}
    </svg>
  );
}

const SEGMENTS = [
  {
    name: "Investment Firms",
    body: "One live view across every portfolio company, with value creation tracked against the plan.",
    outcomes: ["Portfolio monitoring", "Value creation plans", "Board-ready reporting"],
    Art: PortfolioArt,
  },
  {
    name: "M&A Teams",
    body: "Diligence on real data, then integration that connects two companies' systems from day one.",
    outcomes: ["Data-driven diligence", "Day-one integration", "Synergy tracking"],
    Art: MergeArt,
  },
  {
    name: "Multi-Entity Companies",
    body: "Every entity, currency and ledger consolidated into one trusted group picture.",
    outcomes: ["Automated consolidation", "Entity comparisons", "Group-wide KPIs"],
    Art: ConsolidateArt,
  },
  {
    name: "Operating Companies",
    body: "Daily operations run on shared numbers, with agents that flag what needs attention.",
    outcomes: ["Operational dashboards", "Forecasting", "Proactive alerts"],
    Art: OperateArt,
  },
];

export function SegmentsV2() {
  return (
    <section id="segments" className="relative scroll-mt-16 py-24 text-navy sm:py-32 lg:py-40" aria-labelledby="v2-segments-title">
      <div className="shell">
        <h2 id="v2-segments-title" data-reveal="up" className={`${h2Class} max-w-[18ch]`}>
          Value creation for every stage of growth.
        </h2>

        <ul data-reveal="up" className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {SEGMENTS.map(({ name, body, outcomes, Art }, i) => (
            <li
              key={name}
              className="group relative flex flex-col bg-white p-6 shadow-[0_24px_50px_-40px_rgb(16_20_64/0.5)] ring-1 ring-navy/10 transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] [clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,0_100%)] hover:-translate-y-1 hover:shadow-[0_36px_60px_-38px_rgb(16_20_64/0.6)]"
            >
              <span className="type-mono text-[0.75rem] text-navy/40">0{i + 1}</span>
              <div className="mt-4 aspect-[2/1] bg-paper p-2 transition-colors duration-500 group-hover:bg-signal-ink/[0.06]">
                <Art />
              </div>
              <h3 className="type-wide mt-6 text-xl font-medium">{name}</h3>
              <p className="mt-2 leading-relaxed text-navy/65">{body}</p>
              <ul className="mt-5 space-y-2 border-t border-navy/10 pt-4 text-[0.9375rem]">
                {outcomes.map((o) => (
                  <li key={o} className="flex items-center gap-2.5">
                    <span className="h-1.5 w-1.5 bg-signal-ink" aria-hidden="true" />
                    {o}
                  </li>
                ))}
              </ul>
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-signal-ink transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
