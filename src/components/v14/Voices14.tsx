import { Head, Section } from "./ui";

/**
 * No client quotes exist yet, so this section shows empty, labelled slots rather than
 * invented testimonials. Each slot names the kind of voice it is reserved for.
 */
const SLOTS = [
  "Chief Financial Officer",
  "Operating Partner",
  "Chief Operating Officer",
  "Head of M&A integration",
  "VP Finance",
  "Chief Executive Officer",
];

export function Voices14() {
  return (
    <Section id="clients" n="10" label="Clients" titleId="v14-voices-title">
      <Head
        id="v14-voices-title"
        title="What our clients say."
        lead="These slots are reserved for approved client quotes. We publish nothing here until a client has signed it off."
      />
      <ul className="grid grid-cols-1 gap-[2px] bg-black sm:grid-cols-2 xl:grid-cols-3" aria-label="Reserved testimonial slots">
        {SLOTS.map((s, i) => (
          <li key={s} className="flex min-h-[12rem] flex-col justify-between bg-white px-4 py-5 sm:px-6">
            <span className="flex items-start justify-between">
              <span className="v14-display text-[5rem] leading-[0.7] text-[#1f3bff]" aria-hidden="true">
                &ldquo;
              </span>
              <span className="v14-mono">Slot {String(i + 1).padStart(2, "0")}</span>
            </span>
            <span>
              <span className="block border-b-2 border-dashed border-black pb-3 font-mono text-[0.875rem] text-[#555]">
                Approved quote pending
              </span>
              <span className="v14-mono mt-3 block">Reserved · {s}</span>
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
