import { SEGMENTS } from "./data";
import { Pane, SECTION, SectionHead, WRAP } from "./ui";

export function Segments() {
  return (
    <section id="segments" tabIndex={-1} className={SECTION} aria-labelledby="v11-segments-title">
      <div className={WRAP}>
        <SectionHead index="08" cmd="genius profiles --list" id="v11-segments-title" title="Value creation for every stage of growth." />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SEGMENTS.map((s, i) => (
            <li key={s.slug} className="flex">
              <Pane
                as="article"
                title={`profiles/${s.slug}`}
                delay={i * 80}
                className="flex w-full flex-col transition-colors hover:border-(--amber-2)"
                bodyClass="flex flex-1 flex-col p-5 sm:p-6"
              >
                <h3 className="v11-display text-[1.3rem] text-(--fg)">{s.name}</h3>
                <p className="mt-3 text-pretty leading-[1.7] text-(--fg-2)">{s.body}</p>
                <ul className="v11-term mt-auto space-y-1 border-t border-(--rule) pt-4 text-[13px] text-(--fg)">
                  {s.outcomes.map((o) => (
                    <li key={o}>
                      <span className={i % 2 ? "text-(--ice)" : "text-(--amber)"} aria-hidden="true">
                        +{" "}
                      </span>
                      {o}
                    </li>
                  ))}
                </ul>
              </Pane>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
