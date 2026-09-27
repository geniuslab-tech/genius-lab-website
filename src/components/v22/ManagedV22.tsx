import type { CSSProperties } from "react";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { SectionHead } from "./ui";

const STEPS = [
  { name: "Design", body: "We map your systems, data and decisions, and design the target architecture." },
  { name: "Build", body: "We connect, engineer, model and deploy every layer, on the Genius Portal." },
  { name: "Run", body: "We host, monitor and support it, with clear service levels." },
  { name: "Improve", body: "We keep extending metrics, dashboards and agents as the business changes." },
];

const MODEL = [
  {
    k: "Expertise",
    title: "A specialist team",
    body: "Data engineers, analysts, BI developers and AI specialists who work as one team on your business.",
  },
  {
    k: "Technology",
    title: "The Genius Portal",
    body: "Our own platform for connectors, pipelines, governance, analytics and agents, so nothing is stitched together.",
  },
];

const INCLUDED = ["Implementation", "Hosting", "Monitoring", "Security", "Support", "Continuous improvement"];

export function ManagedV22() {
  return (
    <section id="services" className="scroll-mt-[var(--nav)] bg-white" aria-labelledby="v22-managed-title">
      <div data-v22r="band" className="v22-band v22-hexfield bg-[var(--navy)] py-24 text-white sm:py-32">
        <div className="v22-shell">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <SectionHead dark n="07" label="Services" id="v22-managed-title" title="Fully managed by Genius Lab" className="lg:col-span-7" />
            <p data-v22r="up" className="text-pretty max-w-[50ch] text-[1.0625rem] leading-[1.7] text-white/70 lg:col-span-5">
              You don&rsquo;t need to hire a data team, stitch tools together or maintain infrastructure. We implement
              everything, hand it over ready to use, and keep it running.
            </p>
          </div>

          {/* Engagement model: expertise and proprietary technology, together. */}
          <div className="mt-14 grid gap-2 md:grid-cols-[1fr_auto_1fr] md:items-stretch lg:mt-16">
            {MODEL.map((m, i) => (
              <div key={m.k} className={i === 1 ? "md:col-start-3" : ""}>
                <div data-v22r="wipe" style={{ "--rd": `${i * 120}ms` } as CSSProperties} className="chb h-full [--bd:rgb(255_255_255/0.16)] [--c:22px]">
                  <div className="chi bg-[var(--navy-8)] p-7 sm:p-8">
                    <p className="v22-label text-[var(--signal-lt)]">{m.k}</p>
                    <p className="v22-wide mt-3 text-[1.375rem]">{m.title}</p>
                    <p className="mt-3 max-w-[46ch] leading-[1.7] text-white/70">{m.body}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-center py-2 md:col-start-2 md:row-start-1 md:px-2" aria-hidden="true">
              <span className="v22-num text-[1.5rem] text-[var(--trace)]">+</span>
            </div>
          </div>

          {/* Lifecycle: a drawn rail, four stations lighting in turn. */}
          <div data-v22r="up" className="relative mt-16 lg:mt-20">
            <span className="v22-rail absolute left-0 right-0 top-[1.25rem] hidden h-px bg-[var(--signal)] lg:block" aria-hidden="true" />
            <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {STEPS.map((s, i) => (
                <li key={s.name} className="relative">
                  <span
                    className={`v22-seq ch v22-num relative inline-flex h-10 w-14 items-center justify-center text-[0.875rem] [--c:9px] ${i === 0 ? "bg-[var(--signal)] text-white" : "bg-white text-[var(--navy)]"}`}
                    style={{ "--i": i * 3 } as CSSProperties}
                  >
                    0{i + 1}
                  </span>
                  <p className="v22-wide mt-6 text-[1.25rem]">We {s.name.toLowerCase()} it.</p>
                  <p className="mt-2 max-w-[30ch] leading-[1.65] text-white/65">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-16 flex flex-col gap-6 border-t border-white/12 pt-8 lg:mt-20 lg:flex-row lg:items-center lg:justify-between">
            <p className="v22-label text-white/55">Included in every engagement</p>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 lg:flex lg:gap-7" aria-label="Included">
              {INCLUDED.map((x) => (
                <li key={x} className="flex items-center gap-2.5 text-[0.9375rem] font-medium">
                  <span className="ch inline-flex h-5 w-5 shrink-0 items-center justify-center bg-[var(--trace)] text-[var(--navy)] [--c:5px]" aria-hidden="true">
                    <Check size={11} weight="bold" />
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
