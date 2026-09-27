import { Quotes } from "@phosphor-icons/react/dist/ssr";
import { SectionHead } from "./ui";

/** No client quotes are approved yet, so the section shows labelled empty slots instead of invented ones. */
const SLOTS = ["CFO", "Operating Partner", "COO"];

export function VoicesV16() {
  return (
    <section id="clients" className="scroll-mt-16 border-t border-[color:var(--line)] py-24 sm:py-32" aria-labelledby="v16-voices-title">
      <div className="v16-wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHead n="09" id="v16-voices-title" kicker="Clients" title="What our clients say." />
          <p className="v16-label text-[color:var(--tx-3)]">Placeholders · approved quotes to come</p>
        </div>
        <ul className="mt-14 grid gap-3 md:grid-cols-3">
          {SLOTS.map((role) => (
            <li key={role} className="flex min-h-[15rem] flex-col justify-between rounded-[14px] border border-dashed border-[color:var(--line-2)] p-7">
              <Quotes size={28} weight="fill" className="text-[rgb(143_220_255/0.35)]" aria-hidden="true" />
              <div>
                <p className="text-[1.0625rem] leading-[1.6] text-[color:var(--tx-3)]">Reserved for an approved client quote.</p>
                <p className="v16-label mt-5 text-[color:var(--tx-3)]">{role} · placeholder</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
