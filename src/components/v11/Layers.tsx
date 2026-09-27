"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { LAYERS, OUTCOME } from "./data";
import { useInView, useReduced } from "./hooks";
import { Pane, SECTION, SectionHead, WRAP } from "./ui";

type Seg = { t: string; box?: number; conn?: number };

const pad = (s: string, w: number) => (s.length >= w ? s.slice(0, w) : s + " ".repeat(w - s.length));
const OUT = 4;

/** Horizontal pipeline: four boxes, connectors, then the outcome box. 115 columns. */
function wideRows(): Seg[][] {
  const W = 18;
  const OW = 13;
  const inner = (i: number) => {
    const l = LAYERS[i];
    return [` ${l.n}`, ` ${l.l1}`, ` ${l.l2}`, ` ${l.short}`];
  };
  const outInner = [" outcome", " BETTER", " BUSINESS", " DECISIONS"];
  const rows: Seg[][] = [];
  for (let r = 0; r < 6; r++) {
    const row: Seg[] = [];
    for (let i = 0; i < 4; i++) {
      const t = r === 0 ? `┌${"─".repeat(W)}┐` : r === 5 ? `└${"─".repeat(W)}┘` : `│${pad(inner(i)[r - 1], W)}│`;
      row.push({ t, box: i });
      row.push(r === 3 ? { t: " ──> ", conn: i } : { t: "     " });
    }
    const ot = r === 0 ? `╔${"═".repeat(OW)}╗` : r === 5 ? `╚${"═".repeat(OW)}╝` : `║${pad(outInner[r - 1], OW)}║`;
    row.push({ t: ot, box: OUT });
    rows.push(row);
  }
  return rows;
}

/** Vertical pipeline for narrow screens. 32 columns. */
function tallRows(): Seg[][] {
  const W = 30;
  const rows: Seg[][] = [];
  LAYERS.forEach((l, i) => {
    rows.push([{ t: `┌${"─".repeat(W)}┐`, box: i }]);
    rows.push([{ t: `│${pad(` ${l.n}  ${l.name.toUpperCase()}`, W)}│`, box: i }]);
    rows.push([{ t: `│${pad(`     ${l.short}`, W)}│`, box: i }]);
    rows.push([{ t: `└${"─".repeat(W)}┘`, box: i }]);
    rows.push([{ t: `${" ".repeat(15)}│`, conn: i }]);
    rows.push([{ t: `${" ".repeat(15)}v`, conn: i }]);
  });
  rows.push([{ t: `╔${"═".repeat(W)}╗`, box: OUT }]);
  rows.push([{ t: `║${pad("   BETTER BUSINESS DECISIONS", W)}║`, box: OUT }]);
  rows.push([{ t: `╚${"═".repeat(W)}╝`, box: OUT }]);
  return rows;
}

const WIDE = wideRows();
const TALL = tallRows();

function Diagram({ rows, active, cols, onPick }: { rows: Seg[][]; active: number; cols: number; onPick: (i: number) => void }) {
  return (
    <div className="v11-ascii select-none" style={{ "--cols": cols, "--max": "15px" } as CSSProperties} aria-hidden="true">
      {rows.map((row, r) => (
        <div key={r}>
          {row.map((s, k) => {
            let c = "text-(--fg-3)";
            if (s.box !== undefined) {
              if (s.box === active) c = "text-(--amber) v11-glow";
              else if (s.box === OUT) c = active === OUT ? "text-(--amber) v11-glow" : "text-(--fg-2)";
              else if (s.box < active) c = "text-(--fg)";
              else c = "text-(--fg-2)";
            } else if (s.conn !== undefined) {
              c = s.conn < active ? (s.conn === active - 1 ? "text-(--amber) v11-flow" : "text-(--ice)") : "text-(--fg-3)";
            }
            return (
              <span
                key={k}
                className={`${c} ${s.box !== undefined ? "cursor-pointer" : ""} transition-colors duration-300`}
                onClick={s.box !== undefined ? () => onPick(s.box!) : undefined}
              >
                {s.t}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const CYCLE = 4200;

export function Layers() {
  const reduce = useReduced();
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { once: false, threshold: 0.25 });
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!inView || reduce || touched) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % 5), CYCLE);
    return () => clearTimeout(id);
  }, [inView, reduce, touched, active]);

  const pick = (i: number) => {
    setTouched(true);
    setActive(i);
  };

  const onTabKey = (e: KeyboardEvent, i: number) => {
    let n = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % 5;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i + 4) % 5;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = 4;
    if (n < 0) return;
    e.preventDefault();
    pick(n);
    document.getElementById(`v11-layer-tab-${n}`)?.focus();
  };

  const L = active < 4 ? LAYERS[active] : null;
  const tabs = [...LAYERS.map((l) => ({ label: `${l.n}_${l.slug}.md` })), { label: "outcome.md" }];

  return (
    <section ref={root} id="layers" tabIndex={-1} className={SECTION} aria-labelledby="v11-layers-title">
      <div className={WRAP}>
        <SectionHead
          index="02"
          cmd="genius layers --describe"
          id="v11-layers-title"
          title="One intelligence and execution layer across your business."
          lead="Not four products. Every layer is built on the one beneath it, and the top of the stack is a better decision."
        />

        <Pane title="pipeline" meta="foundation first" className="mt-12" bodyClass="v11-cq px-4 py-6 sm:px-6 sm:py-8">
          <div className="hidden lg:block">
            <Diagram rows={WIDE} active={active} cols={115} onPick={pick} />
          </div>
          <div className="mx-auto max-w-[460px] lg:hidden">
            <Diagram rows={TALL} active={active} cols={32} onPick={pick} />
          </div>
          <p className="sr-only">
            The four layers as a pipeline: 01 Data Engineering, the foundation, feeds 02 Analytics, understanding, which feeds 03 Business
            Intelligence, visibility, which feeds 04 Artificial Intelligence, reasoning. Together they lead to better business decisions.
          </p>
        </Pane>

        <div className="mt-4 grid border border-(--rule-2) bg-(--bg-2) lg:grid-cols-[17rem_1fr]">
          <div role="tablist" aria-label="Layers" aria-orientation="vertical" className="v11-term flex overflow-x-auto border-b border-(--rule) lg:flex-col lg:border-b-0 lg:border-r">
            {tabs.map((t, i) => {
              const on = i === active;
              return (
                <button
                  key={t.label}
                  id={`v11-layer-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="v11-layer-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => pick(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={`shrink-0 whitespace-nowrap border-l-2 px-4 py-3 text-left text-[12.5px] transition-colors max-lg:border-b-2 max-lg:border-l-0 ${
                    on ? "border-(--amber) bg-(--amber-soft) text-(--fg)" : "border-transparent text-(--fg-2) hover:text-(--fg)"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div id="v11-layer-panel" role="tabpanel" aria-labelledby={`v11-layer-tab-${active}`} className="min-w-0 p-5 sm:p-8">
            {L ? (
              <div key={active} className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="v11-label text-(--amber-2)">Layer {L.n}</p>
                  <h3 className="v11-display mt-3 text-[clamp(1.5rem,2.6vw,2rem)] text-(--fg)">{L.name}</h3>
                  <p className="mt-2 font-semibold text-(--amber)">{L.role}</p>
                  <p className="mt-4 max-w-[58ch] text-pretty leading-[1.75] text-(--fg-2)">{L.body}</p>
                </div>
                <div className="v11-term self-start border-(--rule) text-[13px] md:border-l md:pl-6">
                  <p className="text-(--fg-3)"># delivers</p>
                  <ul className="mt-2 space-y-1.5">
                    {L.gives.map((g) => (
                      <li key={g} className="text-(--fg)">
                        <span className="text-(--ice)" aria-hidden="true">
                          +{" "}
                        </span>
                        {g}
                      </li>
                    ))}
                  </ul>
                  {active < 3 && (
                    <p className="mt-4 text-(--fg-3)">
                      <span aria-hidden="true">└── </span>feeds {LAYERS[active + 1].n} {LAYERS[active + 1].name.toLowerCase()}
                    </p>
                  )}
                  {active === 3 && (
                    <p className="mt-4 text-(--fg-3)">
                      <span aria-hidden="true">└── </span>leads to better business decisions
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div key="out">
                <p className="v11-label text-(--amber-2)">The outcome</p>
                <h3 className="v11-display v11-glow mt-3 text-[clamp(1.5rem,2.8vw,2.25rem)] text-(--amber)">{OUTCOME.name}</h3>
                <p className="mt-4 max-w-[62ch] text-pretty leading-[1.75] text-(--fg-2)">{OUTCOME.body}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
