import { GridField } from "./GridField";
import { Pulse, TechButton } from "./ui";

/** The same illustrative insights the V2/V3 agent surfaces, read out as a console strip. */
const READOUTS = [
  { metric: "Gross Margin %", value: "38.4%", note: "+1.2 pts vs last quarter", s: [4, 3.8, 4.1, 4.3, 4.2, 4.6, 4.8] },
  { metric: "Orders Delivered", value: "12,480", note: "96.1% on time, +2.3 pts", s: [3, 3.4, 3.2, 3.9, 4.1, 4.0, 4.6] },
  { metric: "Cash Conversion", value: "41 days", note: "3 days faster than Q2", s: [5, 4.8, 4.6, 4.6, 4.3, 4.1, 3.9] },
  { metric: "Churn Risk", value: "2.1%", note: "3 accounts need a call", s: [2, 2.4, 2.2, 2.9, 2.6, 3.1, 3.4] },
];

const spark = (s: number[]) => {
  const min = Math.min(...s);
  const max = Math.max(...s);
  return s.map((v, i) => `${i ? "L" : "M"}${((i / (s.length - 1)) * 64).toFixed(1)},${(18 - ((v - min) / (max - min || 1)) * 16).toFixed(1)}`).join("");
};

export function HeroV4() {
  return (
    <section className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden" aria-labelledby="v4-hero-title">
      <GridField className="absolute inset-0 -z-10 h-full w-full" />

      <div className="shell flex flex-1 flex-col items-center pt-[calc(var(--nav-h)+3rem)] text-center sm:pt-[calc(var(--nav-h)+4rem)] lg:pt-[calc(var(--nav-h)+3rem)]">
        <p className="intro v4-label inline-flex items-center gap-3 border border-line bg-void/60 px-3 py-2 text-white/70 backdrop-blur">
          <Pulse />
          Genius Lab <span className="text-white/25">{"//"}</span> Intelligence &amp; execution layer
        </p>

        <h1
          id="v4-hero-title"
          className="type-display mt-7 max-w-[16ch] text-[clamp(2.5rem,4.6vw,5rem)] leading-[0.96] lg:max-w-none text-white [font-variation-settings:'wdth'_120]"
        >
          <span className="intro block [--d:60ms]">Transform Business Complexity</span>
          <span className="intro block text-[#9fb4ff] [--d:140ms]">
            into Strategic Advantage
          </span>
        </h1>

        <p className="intro text-pretty mt-7 max-w-[56ch] text-[1.0625rem] leading-relaxed text-white/65 [--d:240ms] sm:text-lg">
          We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on
          the software you already rely on.
        </p>

        <div className="intro mt-9 flex flex-wrap items-center justify-center gap-3 [--d:320ms]">
          <TechButton href="#contact" size="lg">
            Talk to us
          </TechButton>
          <TechButton href="#layers" tone="ghost" size="lg">
            See how it works
          </TechButton>
        </div>
      </div>

      {/* Live readouts over the data plane. */}
      <div className="shell intro relative pb-8 [--d:480ms] sm:pb-10">
        <div className="mb-3 flex items-center justify-between">
          <span className="v4-label text-[0.6875rem] text-white/40">Agent readouts</span>
          <span className="v4-label text-[0.6875rem] text-white/30">Illustrative insights</span>
        </div>
        <ul className="grid grid-cols-2 border-l border-t border-line bg-void/55 backdrop-blur-md lg:grid-cols-4">
          {READOUTS.map((r, i) => (
            <li key={r.metric} className="border-b border-r border-line p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="v4-label truncate text-[0.6875rem] text-white/50">{r.metric}</span>
                <span className="v4-label text-[0.625rem] text-white/25">CH-0{i + 1}</span>
              </div>
              <div className="mt-3 flex items-end justify-between gap-3">
                <span className="type-mono text-[clamp(1.25rem,2.2vw,1.75rem)] leading-none text-white">{r.value}</span>
                <svg viewBox="0 0 64 20" className="hidden h-5 w-16 overflow-visible sm:block" aria-hidden="true">
                  <path d={spark(r.s)} fill="none" stroke={i === 3 ? "#6ee7ff" : "#5577ff"} strokeWidth="1.5" />
                </svg>
              </div>
              <p className="type-mono mt-2 truncate text-[0.75rem] text-[#9fb4ff]">{r.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
