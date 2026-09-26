import { Check } from "@phosphor-icons/react/dist/ssr";
import { Intro } from "./ui";

const STEPS = [
  { name: "Design", body: "We map your systems, data and decisions, and design the target architecture." },
  { name: "Build", body: "We connect, engineer, model and deploy every layer, on the Genius Portal." },
  { name: "Run", body: "We host, monitor and support it, with clear service levels." },
  { name: "Improve", body: "We keep extending metrics, dashboards and agents as the business changes." },
];

const INCLUDED = ["Implementation", "Hosting", "Monitoring", "Security", "Support", "Continuous improvement"];

export function ManagedV6() {
  return (
    <section id="managed" className="relative isolate scroll-mt-[4.5rem] overflow-hidden bg-abyss py-24 text-white sm:py-32" aria-labelledby="v6-managed-title">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_60%_at_15%_20%,#0f2748_0%,transparent_70%)]" aria-hidden="true" />
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Intro dark accent="ember" id="v6-managed-title" label="Managed service" title="Fully managed by Genius Lab." className="lg:col-span-7" />
          <p data-reveal="up" className="text-pretty max-w-[52ch] text-[1.0625rem] leading-[1.7] text-white/65 lg:col-span-5">
            You don&rsquo;t need to hire a data team, stitch tools together or maintain infrastructure. We implement
            everything, hand it over ready to use, and keep it running.
          </p>
        </div>

        {/* The lifecycle, as a timeline. */}
        <ol className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-8">
          <span className="absolute left-0 right-0 top-[1.1rem] hidden h-px bg-gradient-to-r from-ember via-sky to-sky/10 lg:block" aria-hidden="true" />
          {STEPS.map((s, i) => (
            <li key={s.name} data-reveal="up" data-delay={String(i * 80)} className="relative">
              <span className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border font-mono text-[0.75rem] ${i === 0 ? "border-ember bg-ember text-[#1a1205]" : "border-white/25 bg-abyss text-white"}`}>
                0{i + 1}
              </span>
              <p className="mt-6 text-[1.25rem] font-bold tracking-[-0.015em]">We {s.name.toLowerCase()} it.</p>
              <p className="mt-2 max-w-[30ch] leading-[1.65] text-white/60">{s.body}</p>
            </li>
          ))}
        </ol>

        <div data-reveal="up" className="mt-16 rounded-[14px] border border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:mt-20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="v6-label text-white/45">Included in every engagement</p>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 lg:flex lg:gap-8" aria-label="Included">
              {INCLUDED.map((x) => (
                <li key={x} className="flex items-center gap-2.5 text-[0.9375rem] font-medium">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember/15 text-ember" aria-hidden="true">
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
