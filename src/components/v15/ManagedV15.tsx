import { Kicker, ROMAN, d } from "./ui";

const STEPS = [
  { name: "design", body: "We map your systems, data and decisions, and design the target architecture." },
  { name: "build", body: "We connect, engineer, model and deploy every layer, on the Genius Portal." },
  { name: "run", body: "We host, monitor and support it, with clear service levels." },
  { name: "improve", body: "We keep extending metrics, dashboards and agents as the business changes." },
];

const INCLUDED = ["Implementation", "Hosting", "Monitoring", "Security", "Support", "Continuous improvement"];

export function ManagedV15() {
  return (
    <section id="managed" className="relative scroll-mt-20 bg-[#0a0e1f] py-32 sm:py-48" aria-labelledby="v15-managed-title">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-10">
        <div className="mx-auto flex max-w-[820px] flex-col items-center text-center">
          <Kicker>Managed service</Kicker>
          <h2 id="v15-managed-title" data-lx="settle" style={d(150)} className="lx-display mt-10 text-[clamp(2.6rem,6vw,5.5rem)]">
            Fully managed <em className="lx-gold">by Genius Lab.</em>
          </h2>
          <p data-lx="fade" style={d(350)} className="lx-body mt-10 max-w-[54ch]">
            You don&rsquo;t need to hire a data team, stitch tools together or maintain infrastructure. We implement everything,
            hand it over ready to use, and keep it running.
          </p>
        </div>

        <ol className="mx-auto mt-24 max-w-[1080px] sm:mt-32">
          {STEPS.map((s, i) => (
            <li key={s.name} className="grid gap-4 border-t border-[#d8c29d]/15 py-10 last:border-b md:grid-cols-12 md:items-baseline md:gap-8">
              <span data-lx="fade" style={d(0)} className="lx-num text-[1.1rem] md:col-span-1">
                {ROMAN[i]}
              </span>
              <p data-lx="settle" style={d(100)} className="lx-display text-[clamp(2.1rem,4.2vw,3.75rem)] italic md:col-span-6">
                We {s.name} it.
              </p>
              <p data-lx="fade" style={d(260)} className="lx-body text-[1rem] md:col-span-5">
                {s.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-24 flex flex-col items-center text-center">
          <p className="lx-caps text-[#ede7dc]/70">Included in every engagement</p>
          <ul className="mt-8 flex max-w-[900px] flex-wrap justify-center gap-x-3 gap-y-4" aria-label="Included">
            {INCLUDED.map((x, i) => (
              <li key={x} data-lx="fade" style={d(i * 110)} className="lx-caps flex items-center gap-3 text-[#d8c29d]">
                {i > 0 && <span className="h-1 w-1 rotate-45 bg-[#d8c29d]/60" aria-hidden="true" />}
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
