import { INCLUDED, STEPS } from "./data";
import { Dot, Pane, SECTION, SectionHead, WRAP } from "./ui";

export function Managed() {
  return (
    <section id="managed" tabIndex={-1} className={SECTION} aria-labelledby="v11-managed-title">
      <div className={WRAP}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <SectionHead index="07" cmd="genius service status" id="v11-managed-title" title="Fully managed by Genius Lab." className="lg:col-span-7" />
          <p data-boot="" className="max-w-[56ch] text-pretty text-[15.5px] leading-[1.75] text-(--fg-2) lg:col-span-5">
            You don&rsquo;t need to hire a data team, stitch tools together or maintain infrastructure. We implement everything, hand it
            over ready to use, and keep it running.
          </p>
        </div>

        <Pane title="lifecycle.service" meta="managed by genius lab" className="mt-12" bodyClass="v11-term text-[13.5px]">
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4" aria-label="The engagement lifecycle">
            {STEPS.map((s, i) => (
              <li
                key={s.name}
                className="relative border-(--rule) p-5 max-lg:[&:nth-child(-n+2)]:border-b max-sm:border-b max-sm:last:border-b-0 sm:max-lg:odd:border-r lg:[&:not(:last-child)]:border-r sm:p-6"
              >
                <p className="flex items-center gap-2.5 text-[12.5px] text-(--fg-3)">
                  <Dot tone={i === 0 ? "amber" : "ice"} />
                  {s.name.toLowerCase()}.service
                  <span className="ml-auto text-(--fg-3)">0{i + 1}</span>
                </p>
                <h3 className="v11-display mt-6 text-[1.35rem] text-(--fg)">We {s.name.toLowerCase()} it.</h3>
                <p className="mt-2 max-w-[34ch] leading-[1.65] text-(--fg-2)">{s.body}</p>
                {i < STEPS.length - 1 && (
                  <span className="absolute -right-[0.55rem] top-6 z-10 hidden bg-(--bg-2) px-0.5 text-(--fg-3) lg:block" aria-hidden="true">
                    &gt;
                  </span>
                )}
              </li>
            ))}
          </ol>
          <div className="flex flex-col gap-4 border-t border-(--rule) bg-(--bg-3) px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-[12.5px] text-(--fg-3)"># included in every engagement</p>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3 lg:flex lg:gap-6" aria-label="Included">
              {INCLUDED.map((x) => (
                <li key={x} className="text-(--fg)">
                  <span className="text-(--amber)" aria-hidden="true">
                    [x]{" "}
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </Pane>
      </div>
    </section>
  );
}
