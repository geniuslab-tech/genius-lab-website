import { Chapter, Exhibit } from "./ui";

const STEPS = [
  { name: "Design", body: "We map your systems, data and decisions, and design the target architecture." },
  { name: "Build", body: "We connect, engineer, model and deploy every layer, on the Genius Portal." },
  { name: "Run", body: "We host, monitor and support it, with clear service levels." },
  { name: "Improve", body: "We keep extending metrics, dashboards and agents as the business changes." },
];

const INCLUDED = ["Implementation", "Hosting", "Monitoring", "Security", "Support", "Continuous improvement"];

export function ManagedV10() {
  return (
    <Chapter
      id="managed"
      n="08"
      label="Operating model"
      tone="navy"
      title="Fully managed by Genius Lab."
      lead={
        <>
          You don&rsquo;t need to hire a data team, stitch tools together or maintain infrastructure. We implement
          everything, hand it over ready to use, and keep it running.
        </>
      }
      note={<>One partner accountable for every layer, from the first connection to the latest agent.</>}
    >
      <Exhibit
        n={9}
        tone="navy"
        className="mt-14 sm:mt-16"
        title="The engagement lifecycle"
        source="Genius Lab. Improvement is continuous; the cycle returns to design as the business changes."
      >
        <div className="relative">
          <span className="draw-x absolute left-0 right-0 top-[11px] hidden h-px bg-white/45 lg:block" style={{ ["--i" as string]: 0 }} aria-hidden="true" />
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((s, i) => (
              <li key={s.name} className="row-in relative" style={{ ["--i" as string]: i + 1 }}>
                <span className={`relative block h-[23px] w-[23px] border ${i === 3 ? "border-[color:var(--brass-2)] bg-[color:var(--brass-2)]" : "border-white/70 bg-[#101440]"}`} aria-hidden="true" />
                <p className="tnum caps mt-6 text-[color:var(--brass-2)]">Phase {i + 1}</p>
                <h3 className="serif mt-2 text-[1.75rem] leading-[1.1] text-white">We {s.name.toLowerCase()} it.</h3>
                <p className="mt-3 max-w-[32ch] text-[0.9375rem] leading-[1.65] text-white/70">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Exhibit>

      <div className="mt-16 grid gap-6 border-t border-white/25 pt-8 lg:grid-cols-10">
        <p className="caps text-white/60 lg:col-span-3">Included in every engagement</p>
        <ul className="grid grid-cols-1 gap-x-6 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:col-span-7" aria-label="Included in every engagement">
          {INCLUDED.map((x, i) => (
            <li key={x} data-reveal="up" data-delay={String(i * 50)} className="flex items-baseline gap-3 border-b border-white/15 py-3 text-[0.9375rem] text-white">
              <span className="tnum text-[0.75rem] text-[color:var(--brass-2)]">{String(i + 1).padStart(2, "0")}</span>
              {x}
            </li>
          ))}
        </ul>
      </div>
    </Chapter>
  );
}
