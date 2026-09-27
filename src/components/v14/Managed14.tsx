import { Head, Section, Split, delay } from "./ui";

const STEPS = [
  { name: "design", body: "We map your systems, data and decisions, and design the target architecture." },
  { name: "build", body: "We connect, engineer, model and deploy every layer, on the Genius Portal." },
  { name: "run", body: "We host, monitor and support it, with clear service levels." },
  { name: "improve", body: "We keep extending metrics, dashboards and agents as the business changes." },
];

const INCLUDED = ["Implementation", "Hosting", "Monitoring", "Security", "Support", "Continuous improvement"];

/** The one full colour field on the page. */
export function Managed14() {
  return (
    <Section id="managed" n="07" label="Managed service" titleId="v14-managed-title" blue>
      <Head
        blue
        id="v14-managed-title"
        title="Fully managed by Genius Lab."
        lead={
          <>
            You don&rsquo;t need to hire a data team, stitch tools together or maintain infrastructure. We implement
            everything, hand it over ready to use, and keep it running.
          </>
        }
      />
      <ol aria-label="How an engagement runs">
        {STEPS.map((s, i) => (
          <li
            key={s.name}
            data-r=""
            style={delay(i * 110)}
            className="v14-inv grid items-end gap-3 border-b-2 border-black px-4 py-5 sm:px-6 md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,22rem)]"
          >
            <span className="v14-mono">0{i + 1}</span>
            <p className="v14-display text-[clamp(3rem,8vw,8.5rem)]">
              <Split text={`We ${s.name} it.`} />
            </p>
            <p className="max-w-[34ch] leading-[1.55] md:pb-2">{s.body}</p>
          </li>
        ))}
      </ol>
      <p className="v14-mono px-4 py-3 sm:px-6">Included in every engagement</p>
      <ul className="grid grid-cols-2 gap-[2px] border-t-2 border-black bg-black sm:grid-cols-3 xl:grid-cols-6" aria-label="Included">
        {INCLUDED.map((x) => (
          <li key={x} className="flex min-h-20 items-end gap-2 bg-[#1f3bff] px-4 py-3 font-semibold leading-tight">
            <span className="v14-mono" aria-hidden="true">
              [x]
            </span>
            {x}
          </li>
        ))}
      </ul>
    </Section>
  );
}
