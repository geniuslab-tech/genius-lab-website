import type { CSSProperties } from "react";
import { ArrowUpRight, ChartLineUp, Coins, Graph, Robot, SquaresFour, TreeStructure } from "@phosphor-icons/react/dist/ssr";
import { hexPoints } from "@/lib/hex";
import { Illustrative, r1 } from "./ui";

/* Illustrative data only. */
const NAV = [
  { Icon: SquaresFour, name: "Overview", on: true },
  { Icon: ChartLineUp, name: "Revenue" },
  { Icon: Coins, name: "Cash" },
  { Icon: TreeStructure, name: "Entities" },
  { Icon: Graph, name: "Second Brain" },
  { Icon: Robot, name: "Agents" },
];

const KPIS = [
  { k: "Revenue", v: "$1.42B", d: "+6.4%", up: true },
  { k: "EBITDA margin", v: "15.9%", d: "−2.3pp", up: false },
  { k: "Free cash flow", v: "$96.4M", d: "+$3.1M", up: true },
];

const REV = [96, 97, 95, 98, 99, 98, 101, 103, 102, 105, 104, 107, 109, 108, 111, 113, 116, 118, 121, 124, 123, 127, 129, 131];
const CW = 560;
const CH = 150;
const px = (i: number) => r1(8 + (i / (REV.length - 1)) * (CW - 16));
const py = (v: number) => r1(CH - 18 - ((v - 90) / (135 - 90)) * (CH - 36));
const LINE = REV.map((v, i) => `${i ? "L" : "M"}${px(i)} ${py(v)}`).join("");
const AREA = `${LINE}L${px(REV.length - 1)} ${CH - 18}L${px(0)} ${CH - 18}Z`;
const BARS = [42, 55, 48, 61, 58, 70, 66, 74];

/** The Genius Portal as the hero's product card. Everything on it is illustrative. */
export function ConsoleV22() {
  return (
    <div className="chb [--bd:#c9cfdd] [--c:26px]">
      <div className="chi bg-white text-[var(--ink)]">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--rule)] py-3 pl-8 pr-4 sm:pl-10">
          <div className="flex min-w-0 items-center gap-3">
            <span className="v22-wide truncate text-[0.875rem]">Genius Portal</span>
            <span className="hidden h-3 w-px bg-[var(--rule-2)] sm:block" aria-hidden="true" />
            <span className="hidden truncate text-[0.8125rem] text-[var(--ink-3)] sm:block">Executive overview · Q3</span>
          </div>
          <Illustrative>Illustrative data</Illustrative>
        </div>

        <div className="grid md:grid-cols-[168px_1fr]">
          <ul className="hidden border-r border-[var(--rule)] py-3 md:block" aria-label="Portal sections (illustrative)">
            {NAV.map(({ Icon, name, on }) => (
              <li key={name} className={`relative flex items-center gap-2.5 px-5 py-2 text-[0.8125rem] ${on ? "font-semibold text-[var(--navy)]" : "text-[var(--ink-3)]"}`}>
                {on && <span className="absolute inset-y-1 left-0 w-[3px] bg-[var(--signal)]" aria-hidden="true" />}
                <Icon size={15} aria-hidden="true" />
                {name}
              </li>
            ))}
          </ul>

          <div className="min-w-0 p-4 sm:p-5">
            <dl className="grid grid-cols-3 gap-2">
              {KPIS.map((k) => (
                <div key={k.k} className="ch bg-[var(--paper)] px-3 py-3 [--c:10px] sm:px-4">
                  <dt className="truncate text-[0.6875rem] text-[var(--ink-3)] sm:text-[0.75rem]">{k.k}</dt>
                  <dd className="mt-1">
                    <span className="v22-wide block text-[1rem] sm:text-[1.3rem]">{k.v}</span>
                    <span className={`v22-mono text-[0.6875rem] ${k.up ? "text-[#0f7a5f]" : "text-[#b4232f]"}`}>{k.d}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_150px]">
              <figure className="border border-[var(--rule)] p-3">
                <figcaption className="flex items-center justify-between text-[0.75rem] text-[var(--ink-3)]">
                  <span>Weekly revenue, $M</span>
                  <span className="v22-mono">Jan–Jun</span>
                </figcaption>
                <svg viewBox={`0 0 ${CW} ${CH}`} className="mt-2 h-auto w-full" aria-hidden="true">
                  {[0, 1, 2, 3].map((g) => (
                    <line key={g} x1="0" x2={CW} y1={18 + g * 38} y2={18 + g * 38} stroke="#e6e9f1" />
                  ))}
                  <path d={AREA} fill="#5577ff" fillOpacity="0.08" />
                  <path d={LINE} pathLength={1} fill="none" stroke="#2f4fe0" strokeWidth="2.25" strokeLinejoin="round" className="v22-drawin" style={{ "--d": "200ms" } as CSSProperties} />
                  <circle cx={px(REV.length - 1)} cy={py(REV[REV.length - 1])} r="4" fill="#fff" stroke="#2f4fe0" strokeWidth="2" />
                </svg>
              </figure>
              <figure className="hidden border border-[var(--rule)] p-3 lg:block">
                <figcaption className="text-[0.75rem] text-[var(--ink-3)]">Entities on plan</figcaption>
                <svg viewBox="0 0 120 84" className="mt-3 h-auto w-full" aria-hidden="true">
                  {BARS.map((b, i) => (
                    <rect key={i} x={i * 15} y={84 - b} width="10" height={b} fill={i === BARS.length - 1 ? "#5577ff" : "#c9d2ff"} className="v22-growin" style={{ "--i": i } as CSSProperties} />
                  ))}
                </svg>
              </figure>
            </div>

            <div className="ch mt-3 flex items-start gap-3 bg-[var(--navy)] p-3 text-white [--c:10px] sm:items-center sm:px-4">
              <svg width="22" height="24" viewBox="0 0 22 24" className="mt-0.5 shrink-0 sm:mt-0" aria-hidden="true">
                <polygon points={hexPoints(11, 12, 10.5)} fill="#5577ff" />
                <polygon points={hexPoints(11, 12, 4)} fill="#fff" className="v22-blink" />
              </svg>
              <p className="min-w-0 flex-1 text-[0.8125rem] leading-snug text-white/85">
                <span className="font-semibold text-white">Genius agent:</span> margin fell 2.3pp, mostly freight after the July carrier change.
              </p>
              <span className="hidden items-center gap-1 text-[0.75rem] font-semibold text-[var(--signal-lt)] sm:inline-flex">
                Trace <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
