import type { ReactNode } from "react";
import { LAYERS } from "./data";

const [FOUNDATION, CONTEXT, GOVERNANCE, INTELLIGENCE, EXECUTION] = LAYERS;

function BandLabel({ n, name, accent = "sky" }: { n: string; name: string; accent?: "sky" | "ember" }) {
  return (
    <div className="flex items-baseline gap-3 md:flex-col md:gap-1.5 md:pt-1">
      <span className={`v6-label text-[0.625rem] ${accent === "ember" ? "text-ember" : "text-sky"}`}>{n}</span>
      <span className="font-semibold tracking-[-0.01em] text-white">{name}</span>
    </div>
  );
}

function Cell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[4px] border border-white/[0.08] bg-abyss-2/70 ${className}`}>{children}</div>;
}

/** Study 06: an architecture drawing. Systems at the base, context above, and a governance boundary drawn around what thinks and acts. */
export function Blueprint() {
  return (
    <div className="space-y-3">
      {/* Governance is not a floor, it is the boundary. */}
      <div className="relative rounded-[8px] border border-dashed border-sky/40 p-3 pt-12 sm:p-4 sm:pt-12">
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-x-3 gap-y-1 sm:left-4">
          <span className="v6-label text-[0.625rem] text-sky">{GOVERNANCE.n}</span>
          <span className="text-[0.9375rem] font-semibold text-white">{GOVERNANCE.name}</span>
          <span className="v6-label text-[0.5625rem] text-white/35">{GOVERNANCE.tags.join(" · ")}</span>
        </div>
        <span className="v6-label absolute right-4 top-4 hidden text-[0.5625rem] text-sky/60 sm:block">Policy boundary</span>

        <div className="grid gap-3 md:grid-cols-5">
          <div className="relative overflow-hidden rounded-[6px] border border-ember/40 bg-gradient-to-br from-ember/[0.12] to-transparent p-5 md:col-span-2">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(closest-side,rgb(242_154_31/0.3),transparent)]" aria-hidden="true" />
            <BandLabel n={EXECUTION.n} name={EXECUTION.name} accent="ember" />
            <div className="mt-6 grid grid-cols-2 gap-2">
              {EXECUTION.tags.map((t) => (
                <div key={t} className="rounded-[4px] border border-ember/25 bg-abyss/60 p-3">
                  <span className="block h-1.5 w-1.5 rounded-full bg-ember" aria-hidden="true" />
                  <p className="mt-6 text-[0.875rem] font-medium leading-tight text-white/85">{t}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[6px] border border-sky/25 bg-gradient-to-br from-sky/[0.10] to-transparent p-5 md:col-span-3">
            <BandLabel n={INTELLIGENCE.n} name={INTELLIGENCE.name} />
            <div className="mt-6 grid grid-cols-3 gap-2">
              {INTELLIGENCE.tags.map((t, i) => (
                <div key={t} className="rounded-[4px] border border-white/[0.08] bg-abyss/60 p-3">
                  <svg viewBox="0 0 60 20" className="h-5 w-full text-sky" aria-hidden="true">
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      points={["0,16 12,12 24,14 36,7 48,9 60,3", "0,10 15,10 30,4 45,12 60,8", "0,18 20,14 30,15 40,8 50,6 60,2"][i]}
                    />
                  </svg>
                  <p className="mt-4 text-[0.8125rem] font-medium leading-tight text-white/80">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 rounded-[8px] border border-white/[0.08] bg-white/[0.015] p-3 sm:p-4 md:grid-cols-[180px_1fr]">
        <BandLabel n={CONTEXT.n} name={CONTEXT.name} />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CONTEXT.tags.map((t) => (
            <Cell key={t} className="flex h-14 items-center justify-between px-3">
              <span className="text-[0.8125rem] text-white/75">{t}</span>
              <span className="h-1 w-1 rounded-full bg-sky/70" aria-hidden="true" />
            </Cell>
          ))}
        </div>
      </div>

      <div className="grid gap-3 rounded-[8px] border border-white/[0.08] bg-white/[0.015] p-3 sm:p-4 md:grid-cols-[180px_1fr]">
        <BandLabel n={FOUNDATION.n} name={FOUNDATION.name} />
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {FOUNDATION.tags.map((t) => (
            <Cell key={t} className="flex h-14 flex-col justify-center px-3">
              <span className="font-mono text-[0.75rem] tracking-[0.08em] text-white/75">{t}</span>
              <span className="mt-1.5 flex gap-0.5" aria-hidden="true">
                {[0, 1, 2, 3].map((k) => (
                  <span key={k} className="h-[3px] w-3 rounded-full bg-sky/40" />
                ))}
              </span>
            </Cell>
          ))}
        </div>
      </div>

      <p className="v6-label pt-3 text-center text-[0.5625rem] text-white/30">Read bottom up · systems → context → governed intelligence → action</p>
    </div>
  );
}
