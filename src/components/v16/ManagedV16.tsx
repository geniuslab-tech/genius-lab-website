import { Check } from "@phosphor-icons/react/dist/ssr";
import { SectionHead } from "./ui";
import { Tilt } from "./Tilt";

const STEPS = [
  { name: "Design", body: "We map your systems, data and decisions, and design the target architecture." },
  { name: "Build", body: "We connect, engineer, model and deploy every layer, on the Genius Portal." },
  { name: "Run", body: "We host, monitor and support it, with clear service levels." },
  { name: "Improve", body: "We keep extending metrics, dashboards and agents as the business changes." },
];

const INCLUDED = ["Implementation", "Hosting", "Monitoring", "Security", "Support", "Continuous improvement"];

export function ManagedV16() {
  return (
    <section id="managed" className="relative isolate scroll-mt-16 overflow-hidden border-t border-[color:var(--line)] bg-[color:var(--g0)] py-24 sm:py-32" aria-labelledby="v16-managed-title">
      <div className="v16-wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead n="06" id="v16-managed-title" kicker="Managed service" title="Fully managed by Genius Lab." className="lg:col-span-7" />
          <p className="v16-lead max-w-[52ch] lg:col-span-5">
            You don&rsquo;t need to hire a data team, stitch tools together or maintain infrastructure. We implement
            everything, hand it over ready to use, and keep it running.
          </p>
        </div>

        <ol className="mt-16 grid gap-3 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Tilt as="li" key={s.name} className="v16-panel p-6 sm:p-7">
              <div className="flex items-center gap-4">
                <span className={`v16-hex v16-mono inline-flex h-9 w-10 shrink-0 items-center justify-center text-[0.75rem] ${i === 0 ? "bg-[color:var(--ice)] text-[color:var(--g1)]" : "bg-[rgb(143_220_255/0.1)] text-[color:var(--ice)]"}`}>
                  0{i + 1}
                </span>
                <span className="h-px flex-1 bg-[linear-gradient(90deg,var(--line-2),transparent)]" aria-hidden="true" />
              </div>
              <p className="v16-display mt-8 text-[1.3125rem]">We {s.name.toLowerCase()} it.</p>
              <p className="mt-2 leading-[1.65] text-[color:var(--tx-2)]">{s.body}</p>
            </Tilt>
          ))}
        </ol>

        <div className="mt-4 flex flex-col gap-6 rounded-[14px] border border-[color:var(--line)] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="v16-label text-[color:var(--tx-3)]">Included in every engagement</p>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 lg:flex lg:gap-8" aria-label="Included">
            {INCLUDED.map((x) => (
              <li key={x} className="flex items-center gap-2.5 text-[0.9375rem]">
                <Check size={13} weight="bold" className="shrink-0 text-[color:var(--ice)]" aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
