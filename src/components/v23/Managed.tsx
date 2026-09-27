import { Check } from "@phosphor-icons/react/dist/ssr";
import { SectionHead, rd } from "./ui";

const STEPS = [
  { name: "Design", body: "We map your systems, data and decisions, and design the target architecture." },
  { name: "Build", body: "We connect, engineer, model and deploy every layer, on the Genius Portal." },
  { name: "Run", body: "We host, monitor and support it, with clear service levels." },
  { name: "Improve", body: "We keep extending metrics, dashboards and agents as the business changes." },
];
const INCLUDED = ["Implementation", "Hosting", "Monitoring", "Security", "Support", "Continuous improvement"];

export function Managed() {
  return (
    <section id="managed" className="bg-[#f4f7fb] py-24 sm:py-32" data-v23-tone="light" data-v23-chapter="Managed service" aria-labelledby="v23-managed-title">
      <div className="v23-wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead n="06" id="v23-managed-title" kicker="Managed service" title="Fully managed by Genius Lab." className="lg:col-span-7" />
          <p data-v23-rv style={rd(120)} className="max-w-[50ch] text-pretty text-[1.0625rem] leading-[1.7] text-(--tx-2) lg:col-span-5">
            You don&rsquo;t need to hire a data team, stitch tools together or maintain infrastructure. We implement everything, hand it over ready to use, and keep it running.
          </p>
        </div>

        <div data-v23-rv className="v23-timeline relative mt-16">
          <span className="v23-timeline-rail" aria-hidden="true">
            <span />
          </span>
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {STEPS.map((s, i) => (
              <li key={s.name} className="v23-timeline-step relative pl-8 lg:pl-0 lg:pt-10" style={rd(200 + i * 140)}>
                <span className="v23-timeline-dot" aria-hidden="true" />
                <span className="v23-mono text-[0.75rem] text-(--tx-3)">0{i + 1}</span>
                <p className="mt-2 text-[1.375rem] font-semibold tracking-[-0.02em]">We {s.name.toLowerCase()} it.</p>
                <p className="mt-2 max-w-[34ch] text-[0.9375rem] leading-[1.65] text-(--tx-2)">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div data-v23-rv className="mt-16 flex flex-col gap-5 rounded-[16px] border border-(--line-2) bg-white p-6 sm:p-7 lg:flex-row lg:items-center lg:gap-10">
          <p className="v23-label shrink-0 text-(--tx-3)">Included in every engagement</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Included">
            {INCLUDED.map((x) => (
              <li key={x} className="flex items-center gap-2 text-[0.9375rem] font-medium">
                <Check size={13} weight="bold" className="text-(--accent)" aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
