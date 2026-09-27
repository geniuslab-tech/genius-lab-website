import { LAYERS, isTop } from "./data";
import { Zone } from "./Study";

const SIGNALS = ["ERP", "CRM", "Finance", "Email", "Meetings", "MES"];
const ACTIONS = ["Automations", "Agent tasks", "Decisions", "Alerts"];

/** Study 03: the stack laid on its side, a left-to-right pipeline from raw signals to business action. */
export function Pipeline() {
  return (
    <div className="grid gap-10 lg:grid-cols-[150px_1fr_190px] lg:gap-6">
      <div>
        <Zone>Business signals</Zone>
        <ul className="mt-5 grid grid-cols-3 gap-2 lg:grid-cols-1">
          {SIGNALS.map((s) => (
            <li key={s} className="relative flex h-9 items-center rounded-[4px] border border-white/10 bg-white/[0.02] px-3 font-mono text-[0.6875rem] tracking-[0.08em] text-white/60">
              {s}
              <span className="absolute -right-6 top-1/2 hidden h-px w-6 bg-gradient-to-r from-white/20 to-sky/60 lg:block" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Zone accent className="text-center">Genius Lab operating layer</Zone>
        <div className="relative mt-5">
          {/* The rail the work travels along. */}
          <div className="absolute inset-x-0 top-[26px] hidden h-px bg-gradient-to-r from-sky/20 via-sky/60 to-ember/70 md:block" aria-hidden="true">
            <span className="v7-run-x absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_3px_rgb(77_141_255/0.8)]" />
          </div>
          <ol className="grid gap-3 md:grid-cols-5">
            {LAYERS.map((l, i) => {
              const top = isTop(l);
              return (
                <li key={l.n} data-reveal="up" data-delay={i * 80} className="relative flex flex-col">
                  <div className="flex h-[52px] items-center justify-center">
                    <span
                      className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border font-mono text-[0.6875rem] ${
                        top ? "border-ember bg-[#1c1406] text-ember" : "border-sky/50 bg-abyss-2 text-sky"
                      }`}
                    >
                      {l.n}
                    </span>
                  </div>
                  <article
                    className={`flex min-h-[210px] flex-1 flex-col rounded-[6px] border p-4 ${
                      top ? "border-ember/40 bg-gradient-to-b from-ember/[0.10] to-transparent" : "border-white/[0.08] bg-gradient-to-b from-sky/[0.07] to-transparent"
                    }`}
                  >
                    <h3 className="text-[1.0625rem] font-semibold leading-tight tracking-[-0.01em] text-white">{l.name}</h3>
                    <ul className="mb-6 mt-4 space-y-1.5">
                      {l.tags.map((t) => (
                        <li key={t} className="v6-label text-[0.5625rem] text-white/45">
                          {t}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto h-[3px] rounded-full bg-white/[0.06]" aria-hidden="true">
                      <div className={`h-full rounded-full ${top ? "bg-ember" : "bg-sky"}`} style={{ width: `${(i + 1) * 20}%` }} />
                    </div>
                    <p className="v6-label mt-2 text-[0.5rem] text-white/30">Stage {i + 1} of 5</p>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div>
        <Zone className="lg:text-right">Business action</Zone>
        <ul className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-1">
          {ACTIONS.map((a) => (
            <li key={a} className="relative flex h-9 items-center gap-2 rounded-[4px] border border-ember/30 bg-ember/[0.06] whitespace-nowrap px-3 text-[0.8125rem] font-medium text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden="true" />
              {a}
              <span className="absolute -left-6 top-1/2 hidden h-px w-6 bg-gradient-to-r from-ember/60 to-ember/20 lg:block" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
