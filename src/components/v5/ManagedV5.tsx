import { ArrowsClockwise, Check, Compass, Gauge, Hammer } from "@phosphor-icons/react/dist/ssr";
import { Heading } from "./ui";

const STEPS = [
  { Icon: Compass, name: "Design", body: "We map your systems, data and decisions, and design the target architecture." },
  { Icon: Hammer, name: "Build", body: "We connect, engineer, model and deploy every layer, on the Genius Portal." },
  { Icon: Gauge, name: "Run", body: "We host, monitor and support it, with clear service levels." },
  { Icon: ArrowsClockwise, name: "Improve", body: "We keep extending metrics, dashboards and agents as the business changes." },
];

const INCLUDED = ["Implementation", "Hosting", "Monitoring", "Security", "Support", "Continuous improvement"];

export function ManagedV5() {
  return (
    <section id="managed" className="scroll-mt-12 bg-white py-28 sm:py-40" aria-labelledby="v5-managed-title">
      <div className="mx-auto max-w-[1080px] px-5">
        <Heading
          id="v5-managed-title"
          eyebrow="Managed service"
          title="Fully managed by Genius Lab."
          lead={<>You don&rsquo;t need to hire a data team, stitch tools together or maintain infrastructure. We implement everything, hand it over ready to use, and keep it running.</>}
        />

        <ol className="mt-20 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ Icon, name, body }, i) => (
            <li key={name} data-reveal="up" data-delay={String(i * 80)} className="text-center">
              <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full border border-hairline text-graphite">
                <Icon size={28} weight="light" aria-hidden="true" />
              </span>
              <p className="mt-6 text-[1.3125rem] font-semibold tracking-[-0.015em] text-graphite">We {name.toLowerCase()} it.</p>
              <p className="v5-body mx-auto mt-2 max-w-[24ch] text-[1.0625rem] text-graphite-2">{body}</p>
            </li>
          ))}
        </ol>

        <div data-reveal="up" className="mt-20 rounded-[28px] bg-mist p-8 sm:p-12">
          <p className="text-center text-[1.3125rem] font-semibold tracking-[-0.015em] text-graphite">Everything included.</p>
          <ul className="mx-auto mt-8 grid max-w-[820px] grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3" aria-label="Included">
            {INCLUDED.map((x) => (
              <li key={x} className="flex items-center gap-3 text-[1.0625rem] tracking-[-0.01em] text-graphite">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-azure text-white" aria-hidden="true">
                  <Check size={13} weight="bold" />
                </span>
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
