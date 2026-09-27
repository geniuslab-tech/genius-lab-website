import { SectionHead, rd } from "./ui";

/**
 * Placeholder slots for client testimonials. The wording shows the kind of outcome a quote
 * would speak to; it is not attributed to anyone and must be replaced with approved quotes.
 */
const SLOTS = [
  { q: "The board pack and the operating numbers finally come from the same place.", role: "CFO · multi-entity group" },
  { q: "They didn't sell us another tool. They built on what we already had, and they run it.", role: "COO · operating company" },
  { q: "We ask the agent now, instead of chasing spreadsheets across portfolio companies.", role: "Operating partner · investment firm" },
];

export function VoicesV19() {
  return (
    <section id="clients" className="relative scroll-mt-16 border-t border-[color:var(--line)] py-24 sm:py-32" aria-labelledby="v19-voices-title">
      <div className="v19-wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHead n="08" id="v19-voices-title" kicker="Clients" title="What our clients say." />
          <p className="v19-label text-[color:var(--tx-3)]">Placeholders · awaiting approved client quotes</p>
        </div>
        <ul className="mt-12 grid gap-3 lg:mt-16 lg:grid-cols-3">
          {SLOTS.map((s, i) => (
            <li key={s.role} className="v19-rv" style={rd(i * 80)}>
              <figure className="flex h-full flex-col justify-between rounded-[14px] border border-dashed border-[color:var(--line-3)] p-6 sm:p-7">
                <blockquote className="text-[1.125rem] leading-[1.5] tracking-[-0.01em] text-[color:var(--tx)]">&ldquo;{s.q}&rdquo;</blockquote>
                <figcaption className="mt-8 flex items-center justify-between gap-3 border-t border-[color:var(--line)] pt-4">
                  <span className="text-[0.875rem] text-[color:var(--tx-2)]">{s.role}</span>
                  <span className="v19-label rounded-[4px] border border-[color:var(--line-2)] px-1.5 py-0.5 text-[0.5625rem] text-[color:var(--tx-3)]">Placeholder</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
