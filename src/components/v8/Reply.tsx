import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Lines, Up, shell } from "./type";

/** The back page: a reply card, with a dashed cut line, instead of a banner. */
export function Reply() {
  return (
    <section id="contact" className="scroll-mt-[var(--head-h)] border-t border-[color:var(--ink)] pb-20 pt-16 sm:pb-28 sm:pt-20" aria-labelledby="v8-cta-title">
      <div className={shell}>
        <p className="label text-[color:var(--ink-3)]">Back page &nbsp;·&nbsp; p. 80</p>
        <div className="relative mt-6 border border-dashed border-[color:var(--ink)]/60 p-6 sm:p-10 lg:p-14">
          <span className="label absolute -top-2.5 left-6 bg-[color:var(--paper)] px-2 text-[color:var(--ink-3)]" aria-hidden="true">
            &#9986; Reply card
          </span>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="label text-[color:var(--red)]">One partner. One platform. One source of truth.</p>
              <Lines
                as="h2"
                id="v8-cta-title"
                text="Turn your business knowledge into *intelligent systems.*"
                className="f-display mt-5 max-w-[16ch] text-[clamp(2.75rem,6vw,5.5rem)]"
                italicClass="italic text-[color:var(--red)]"
              />
              <Up delay={200}>
                <p className="body-copy mt-8 max-w-[56ch]">
                  Tell us where your systems and data stand today. We&rsquo;ll show you how Genius Lab turns them into one
                  intelligence and execution layer, fully managed.
                </p>
              </Up>
            </div>
            <Up delay={300} className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col lg:items-stretch">
              <a href="#" className="btn-ink justify-between">
                Talk to us <ArrowRight size={15} weight="bold" className="arr" aria-hidden="true" />
              </a>
              <a href="#action" className="btn-line justify-between">
                Watch it in action <ArrowRight size={15} weight="bold" className="arr" aria-hidden="true" />
              </a>
            </Up>
          </div>
        </div>
      </div>
    </section>
  );
}
