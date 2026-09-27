import type { CSSProperties } from "react";
import { Opener, Up, shell } from "./type";

const STEPS = [
  { name: "Design", body: "We map your systems, data and decisions, and design the target architecture." },
  { name: "Build", body: "We connect, engineer, model and deploy every layer, on the Genius Portal." },
  { name: "Run", body: "We host, monitor and support it, with clear service levels." },
  { name: "Improve", body: "We keep extending metrics, dashboards and agents as the business changes." },
];

const INCLUDED = ["Implementation", "Hosting", "Monitoring", "Security", "Support", "Continuous improvement"];

/** The inverted spread: ink ground, paper type, like a full-bleed black page in a magazine. */
export function Managed() {
  return (
    <section
      id="managed"
      data-chapter="managed"
      className="scroll-mt-[var(--head-h)] bg-[color:var(--ink)] py-20 text-[color:var(--paper)] sm:py-28"
      aria-labelledby="v8-managed-title"
    >
      <div className={shell}>
        <Opener dark numeral="VII" kicker="Managed service" title="Fully managed by *Genius Lab.*" titleId="v8-managed-title" folio="52">
          <Up delay={250}>
            <p className="f-text mt-8 max-w-[52ch] text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.4] text-[color:var(--paper)]/85">
              You don&rsquo;t need to hire a data team, stitch tools together or maintain infrastructure. We implement
              everything, hand it over ready to use, and keep it running.
            </p>
          </Up>
        </Opener>

        {/* The lifecycle as a ruled timeline; the rule draws in, then each stage sets. */}
        <div className="relative mt-16 lg:mt-24">
          <div
            data-v8="rule"
            aria-hidden="true"
            className="absolute left-0 right-0 top-[1.05rem] hidden h-px bg-[color:var(--paper)]/45 lg:block"
          />
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {STEPS.map((s, i) => (
              <li key={s.name} className="relative">
                <Up delay={300 + i * 110}>
                  <span
                    className={`relative inline-flex h-[2.1rem] min-w-[2.1rem] items-center justify-center px-2 text-[0.75rem] font-bold tabular-nums ${
                      i === 0 ? "bg-[color:var(--red)] text-[color:var(--paper)]" : "bg-[color:var(--ink)] text-[color:var(--paper)] ring-1 ring-[color:var(--paper)]/45"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <p className="f-display mt-7 text-[clamp(2.25rem,3.4vw,3rem)] leading-none">
                    We <span className="italic">{s.name.toLowerCase()}</span> it.
                  </p>
                  <p className="f-text mt-3 max-w-[30ch] text-[1.0625rem] leading-[1.55] text-[color:var(--paper)]/70">{s.body}</p>
                </Up>
              </li>
            ))}
          </ol>
        </div>

        {/* Colophon box: what every engagement includes. */}
        <Up className="mt-16 border border-[color:var(--paper)]/35 p-6 sm:p-8 lg:mt-24">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-baseline">
            <p className="label text-[color:var(--paper)]/60 lg:col-span-3">Included in every engagement</p>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 lg:col-span-9 lg:flex lg:flex-wrap lg:justify-between" aria-label="Included">
              {INCLUDED.map((x, i) => (
                <li key={x} className="f-display text-[1.5rem] leading-none" style={{ "--d": `${i * 50}ms` } as CSSProperties}>
                  <span className="mr-2 text-[color:var(--red)]" aria-hidden="true">
                    &sect;
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </Up>
      </div>
    </section>
  );
}
