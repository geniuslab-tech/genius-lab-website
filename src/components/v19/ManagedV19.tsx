import { Check } from "@phosphor-icons/react/dist/ssr";
import { SectionHead, rd } from "./ui";

const STEPS = [
  { name: "Design", body: "We map your systems, data and decisions, and design the target architecture." },
  { name: "Build", body: "We connect, engineer, model and deploy every layer, on the Genius Portal." },
  { name: "Run", body: "We host, monitor and support it, with clear service levels." },
  { name: "Improve", body: "We keep extending metrics, dashboards and agents as the business changes." },
];

const INCLUDED = ["Implementation", "Hosting", "Monitoring", "Security", "Support", "Continuous improvement"];

export function ManagedV19() {
  return (
    <section id="managed" className="relative scroll-mt-16 border-t border-[color:var(--line)] py-24 sm:py-32" aria-labelledby="v19-managed-title">
      <div className="v19-wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead n="06" id="v19-managed-title" kicker="Managed service" title="Fully managed by Genius Lab." className="lg:col-span-7" />
          <p className="v19-rv v19-lead lg:col-span-5" style={rd(120)}>
            You don&rsquo;t need to hire a data team, stitch tools together or maintain infrastructure. We implement
            everything, hand it over ready to use, and keep it running.
          </p>
        </div>

        <ol className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-8">
          <li className="v19-rv pointer-events-none absolute inset-x-0 top-[1.1rem] hidden h-px lg:block" aria-hidden="true">
            <span className="block h-full w-full bg-[linear-gradient(90deg,var(--acc),rgb(var(--acc-rgb)/0.35)_70%,transparent)]" />
          </li>
          {STEPS.map((s, i) => (
            <li key={s.name} className="v19-rv relative" style={rd(i * 110)}>
              <span
                className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border font-mono text-[0.75rem] ${
                  i === 0 ? "border-[color:var(--acc)] bg-[color:var(--acc)] text-[#05070f]" : "border-[color:var(--line-3)] bg-[color:var(--g1)] text-white"
                }`}
              >
                0{i + 1}
              </span>
              <p className="v19-h3 mt-6 text-[1.25rem]">We {s.name.toLowerCase()} it.</p>
              <p className="mt-2 max-w-[30ch] leading-[1.65] text-[color:var(--tx-2)]">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="v19-rv v19-panel mt-16 p-6 sm:p-8 lg:mt-20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="v19-label text-[color:var(--tx-3)]">Included in every engagement</p>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 lg:flex lg:gap-8" aria-label="Included">
              {INCLUDED.map((x) => (
                <li key={x} className="flex items-center gap-2.5 text-[0.9375rem]">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgb(var(--acc-rgb)/0.16)] text-[color:var(--acc-2)]" aria-hidden="true">
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
