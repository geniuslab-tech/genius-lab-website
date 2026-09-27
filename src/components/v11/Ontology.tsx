"use client";

import { useEffect, useRef, useState } from "react";
import { AXES } from "./data";
import { useInView, useReduced } from "./hooks";
import { Pane, SECTION, SectionHead, WRAP } from "./ui";

const OBJECTS = ["customers", "orders", "products", "suppliers"];
const CYCLE = 3800;

export function Ontology() {
  const reduce = useReduced();
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { once: false, threshold: 0.3 });
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!inView || reduce || touched) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % AXES.length), CYCLE);
    return () => clearTimeout(id);
  }, [inView, reduce, touched, active]);

  const pick = (i: number) => {
    setTouched(true);
    setActive(i);
  };
  const a = AXES[active];

  return (
    <section ref={root} id="ontology" tabIndex={-1} className={SECTION} aria-labelledby="v11-ontology-title">
      <div className={`${WRAP} grid gap-12 lg:grid-cols-12 lg:gap-10`}>
        <div className="lg:col-span-5">
          <SectionHead
            index="05"
            cmd="genius ontology --tree"
            id="v11-ontology-title"
            title="Data Ontology Intelligence."
            lead="We are not only a data, analytics or AI company. We work where data, analytics, AI, people and business context meet."
          />
          <p data-boot="" className="mt-5 max-w-[60ch] text-pretty text-[15.5px] leading-[1.75] text-(--fg-2)">
            An ontology is a living model of your business: its objects, such as customers, orders, products and suppliers, the
            relationships between them, and the rules that give them meaning. Every axis works on that same model, so they move in harmony
            instead of in hand-offs.
          </p>
        </div>

        <div className="min-w-0 lg:col-span-7 lg:pt-10">
          <Pane title="~/ontology" meta="shared model" bodyClass="v11-term grid text-[13.5px] md:grid-cols-[1fr_1fr]">
            <div className="border-(--rule) px-3 py-4 max-md:border-b md:border-r sm:px-4">
              <p className="px-2 text-(--amber)">
                ontology/ <span className="text-(--fg-3)"># one model</span>
              </p>
              <ul className="mt-1" aria-label="The five axes of the ontology">
                {AXES.map((x, i) => {
                  const on = i === active;
                  const last = i === AXES.length - 1;
                  return (
                    <li key={x.slug}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => pick(i)}
                        onPointerEnter={(e) => e.pointerType === "mouse" && pick(i)}
                        className={`flex w-full items-baseline gap-2 px-2 py-1 text-left transition-colors ${on ? "bg-(--amber-soft) text-(--amber)" : "text-(--fg-2) hover:text-(--fg)"}`}
                      >
                        <span className="text-(--fg-3)" aria-hidden="true">
                          {last ? "└──" : "├──"}
                        </span>
                        <span className="min-w-0 flex-1">{x.slug}/</span>
                        <span className={`text-[12px] ${on ? "text-(--amber-2)" : "text-(--fg-3)"}`}>{x.role}</span>
                      </button>
                      {i === 0 && (
                        <p className="flex gap-2 px-2 py-0.5 text-[12.5px] text-(--fg-3)">
                          <span aria-hidden="true">│   └──</span>
                          <span className="min-w-0">{OBJECTS.join(" · ")}</span>
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex flex-col px-5 py-4" aria-live="polite">
              <p className="text-[12.5px] text-(--fg-3)">
                <span className="text-(--amber)">$</span> cat ontology/{a.slug}/README
              </p>
              <p key={active} className="v11-display mt-4 text-[1.5rem] text-(--fg)">
                {a.name}
              </p>
              <p className="mt-1 text-(--amber)">{a.role}</p>
              <p className="mt-3 text-pretty leading-[1.7] text-(--fg-2)">{a.body}</p>
              <p className="mt-auto pt-6 text-[12px] text-(--fg-3)">
                reads and writes: <span className="text-(--ice)">ontology/</span> &middot; the same objects, relationships and rules
              </p>
            </div>
          </Pane>
        </div>
      </div>
    </section>
  );
}
