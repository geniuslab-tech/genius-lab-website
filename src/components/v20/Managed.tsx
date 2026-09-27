import { Check } from "@phosphor-icons/react/dist/ssr";
import { Heading, R } from "./ui";

const STEPS = [
  { name: "Design", body: "We map your systems, data and decisions, and design the target architecture." },
  { name: "Build", body: "We connect, engineer, model and deploy every layer, on the Genius Portal." },
  { name: "Run", body: "We host, monitor and support it, with clear service levels." },
  { name: "Improve", body: "We keep extending metrics, dashboards and agents as the business changes." },
];

const INCLUDED = ["Implementation", "Hosting", "Monitoring", "Security", "Support", "Continuous improvement"];

export function Managed() {
  return (
    <section id="managed" data-tone="navy" className="v20-sec py-28 sm:py-40" aria-labelledby="v20-managed-title">
      <div className="mx-auto max-w-[1120px] px-5">
        <Heading
          id="v20-managed-title"
          eyebrow="Managed service"
          title="Fully managed by Genius Lab."
          width="14ch"
          lead={
            <>
              You don&rsquo;t need to hire a data team, stitch tools together or maintain infrastructure. We implement
              everything, hand it over ready to use, and keep it running.
            </>
          }
        />

        <ol className="mt-20 grid gap-y-12 sm:grid-cols-2 sm:gap-x-10 lg:mt-24 lg:grid-cols-4 lg:gap-x-8">
          {STEPS.map((s, i) => (
            <R as="li" key={s.name} delay={i * 110} className="border-t-2 border-[var(--rule)] pt-6">
              <span className="block -mt-[calc(1.5rem+2px)] mb-6 h-[2px] w-12 bg-[var(--acc)]" aria-hidden="true" />
              <p className="v20-fg3 v20-num text-[0.875rem] font-medium">0{i + 1}</p>
              <h3 className="v20-display v20-h4 mt-2">We {s.name.toLowerCase()} it.</h3>
              <p className="v20-fg2 mt-3 max-w-[30ch] text-[0.9375rem] leading-[1.65]">{s.body}</p>
            </R>
          ))}
        </ol>

        <R className="v20-card mt-20 px-7 py-9 sm:px-12 sm:py-12 lg:mt-24">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <p className="v20-display max-w-[16ch] text-[1.625rem] tracking-[-0.03em]">Included in every engagement.</p>
            <ul className="grid grid-cols-1 gap-x-10 gap-y-3 min-[420px]:grid-cols-2 sm:grid-cols-3" aria-label="Included">
              {INCLUDED.map((x) => (
                <li key={x} className="flex items-center gap-2.5 text-[0.9375rem] font-medium">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--acc-soft)] text-[var(--acc)]" aria-hidden="true">
                    <Check size={11} weight="bold" />
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </R>
      </div>
    </section>
  );
}
