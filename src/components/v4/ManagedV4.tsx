import { Check } from "@phosphor-icons/react/dist/ssr";
import { Frame, SectionTag, h2v4 } from "./ui";

const STEPS = [
  { name: "Design", body: "We map your systems, data and decisions, and design the target architecture." },
  { name: "Build", body: "We connect, engineer, model and deploy every layer, on the Genius Portal." },
  { name: "Run", body: "We host, monitor and support it, with clear service levels." },
  { name: "Improve", body: "We keep extending metrics, dashboards and agents as the business changes." },
];

const INCLUDED = ["Implementation", "Hosting", "Monitoring", "Security", "Support", "Continuous improvement"];

/** The managed service as a pipeline that loops: improve feeds straight back into design. */
export function ManagedV4() {
  return (
    <section id="managed" className="relative scroll-mt-16 py-24 sm:py-32" aria-labelledby="v4-managed-title">
      <div className="shell">
        <SectionTag n="07">Managed service</SectionTag>
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 id="v4-managed-title" data-reveal="up" className={`${h2v4} max-w-[13ch] lg:col-span-7`}>
            Fully managed by Genius Lab.
          </h2>
          <p data-reveal="up" data-delay="100" className="max-w-[50ch] text-lg leading-relaxed text-white/60 lg:col-span-5">
            You don&rsquo;t need to hire a data team, stitch tools together or maintain infrastructure. We implement
            everything, hand it over ready to use, and keep it running.
          </p>
        </div>

        <Frame className="mt-14 bg-void-2/70 lg:mt-20">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <span className="v4-label text-[0.6875rem] text-white/50">service.lifecycle</span>
            <span className="v4-label flex items-center gap-2 text-[0.6875rem] text-white/40">
              <span className="inline-block motion-safe:animate-[spin_3s_linear_infinite]" aria-hidden="true">
                ↻
              </span>
              Continuous loop
            </span>
          </div>

          <ol className="relative grid sm:grid-cols-2 lg:grid-cols-4">
            {/* The pipeline rail across the four stages. */}
            <span className="absolute left-0 right-0 top-[3.25rem] hidden h-px overflow-hidden bg-white/10 lg:block" aria-hidden="true">
              <span className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-cyan to-transparent motion-safe:animate-[v4-flow_3.2s_linear_infinite]" />
            </span>
            {STEPS.map((s, i) => (
              <li key={s.name} className="relative border-line p-6 sm:p-8 max-lg:[&:not(:last-child)]:border-b lg:[&:not(:last-child)]:border-r sm:max-lg:odd:border-r">
                <div className="flex items-center gap-4">
                  <span className="relative z-10 inline-flex h-11 w-11 items-center justify-center border border-cyan/50 bg-void font-mono text-[0.8125rem] text-cyan">0{i + 1}</span>
                  <span className="v4-label text-white/35">{s.name}</span>
                </div>
                <p className="type-wide mt-8 text-xl font-medium text-white">We {s.name.toLowerCase()} it.</p>
                <p className="mt-2 leading-relaxed text-white/55">{s.body}</p>
              </li>
            ))}
          </ol>

          {/* Return path: improvement feeds the next design. */}
          <div className="hidden px-8 pb-6 lg:block" aria-hidden="true">
            <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="h-10 w-full">
              <path d="M875,0 V24 H125 V0" fill="none" stroke="#6ee7ff" strokeOpacity="0.45" strokeDasharray="3 5" className="motion-safe:animate-[dash-flow_1.2s_linear_infinite]" vectorEffect="non-scaling-stroke" />
              <path d="M119,8 L125,0 L131,8" fill="none" stroke="#6ee7ff" strokeOpacity="0.8" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>

          <div className="border-t border-line p-6 sm:p-8">
            <p className="v4-label text-[0.6875rem] text-white/35">Included</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-6" aria-label="Included">
              {INCLUDED.map((x) => (
                <li key={x} className="type-mono flex items-center gap-2.5 text-[0.8125rem] text-white/80">
                  <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center bg-cyan/15 text-cyan" aria-hidden="true">
                    <Check size={10} weight="bold" />
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </Frame>
      </div>
    </section>
  );
}
