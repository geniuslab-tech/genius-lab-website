import type { ReactNode } from "react";
import { Check } from "@phosphor-icons/react/dist/ssr";

/** Mini interfaces printed on each layer of the stack. All values are illustrative. */

function Face({ n, name, warm, children }: { n: string; name: string; warm?: boolean; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col p-5">
      <div className="flex items-center justify-between">
        <p className={`v19-label text-[0.625rem] ${warm ? "text-[color:var(--warm)]" : "text-[color:var(--acc-2)]"}`}>{n}</p>
        <p className="text-[0.8125rem] font-medium text-white">{name}</p>
      </div>
      <div className="mt-4 min-h-0 flex-1">{children}</div>
    </div>
  );
}

export function FaceData() {
  const src = ["erp.orders", "crm.accounts", "finance.gl"];
  const rows = [
    { t: "orders", r: "1.2M rows" },
    { t: "customers", r: "48K rows" },
    { t: "gl_entries", r: "6.7M rows" },
  ];
  return (
    <Face n="Layer 01" name="Data Engineering">
      <div className="grid h-full grid-cols-[1fr_28px_1.25fr] items-center">
        <ul className="space-y-2">
          {src.map((s) => (
            <li key={s} className="v19-mono truncate rounded-[6px] border border-[color:var(--line-2)] bg-white/[0.03] px-2 py-1.5 text-[0.625rem] text-[color:var(--tx-2)]">
              {s}
            </li>
          ))}
        </ul>
        <svg viewBox="0 0 28 100" className="h-[110px] w-full" preserveAspectRatio="none">
          {[16, 50, 84].map((y) => (
            <path key={y} d={`M0 ${y} C14 ${y} 14 50 28 50`} fill="none" stroke="#5b8cff" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        <div className="rounded-[8px] border border-[rgb(var(--acc-rgb)/0.45)] bg-[rgb(var(--acc-rgb)/0.08)] p-2.5">
          <p className="text-[0.6875rem] font-medium text-white">Unified model</p>
          <ul className="mt-2 space-y-1.5">
            {rows.map((r) => (
              <li key={r.t} className="flex items-center gap-2 text-[0.625rem]">
                <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[color:var(--acc)] text-[#05070f]">
                  <Check size={8} weight="bold" />
                </span>
                <span className="v19-mono text-[color:var(--tx-2)]">{r.t}</span>
                <span className="v19-mono ml-auto text-[color:var(--tx-3)]">{r.r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Face>
  );
}

const A = [30, 34, 33, 38, 41, 40, 45];
const F = [45, 48, 52];
const pts = (s: number[], from: number) => s.map((v, i) => `${(((i + from) / 9) * 260).toFixed(1)},${(90 - ((v - 26) / 30) * 86).toFixed(1)}`).join(" ");

export function FaceAnalytics() {
  const drivers = [
    { k: "Freight", v: 72 },
    { k: "Discounts", v: 48 },
    { k: "Mix", v: 22 },
  ];
  return (
    <Face n="Layer 02" name="Analytics">
      <div className="grid h-full grid-cols-[1.5fr_1fr] gap-4">
        <div className="flex flex-col">
          <p className="text-[0.625rem] text-[color:var(--tx-3)]">Gross margin, forecast</p>
          <svg viewBox="0 0 260 92" className="mt-2 w-full flex-1 overflow-visible">
            <polyline points={pts(A, 0)} fill="none" stroke="#5b8cff" strokeWidth="2" />
            <polyline points={pts(F, 6)} fill="none" stroke="#a9c3ff" strokeWidth="1.6" strokeDasharray="3 4" />
            <line x1="173" x2="173" y1="0" y2="92" stroke="rgb(150 170 255 / 0.2)" strokeDasharray="2 3" />
          </svg>
        </div>
        <div>
          <p className="text-[0.625rem] text-[color:var(--tx-3)]">Drivers</p>
          <ul className="mt-2 space-y-2.5">
            {drivers.map((d) => (
              <li key={d.k}>
                <div className="flex justify-between text-[0.625rem] text-[color:var(--tx-2)]">
                  <span>{d.k}</span>
                  <span className="v19-mono">{d.v}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-[color:var(--acc)]" style={{ width: `${d.v}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Face>
  );
}

export function FaceBI() {
  const kpis = [
    { k: "Revenue", v: "$48.2M" },
    { k: "Margin", v: "41.7%" },
    { k: "Cash", v: "$9.4M" },
  ];
  const bars = [62, 80, 54, 90, 70, 46];
  return (
    <Face n="Layer 03" name="Business Intelligence">
      <div className="grid grid-cols-3 gap-2">
        {kpis.map((k) => (
          <div key={k.k} className="rounded-[8px] border border-[color:var(--line-2)] bg-white/[0.03] p-2">
            <p className="text-[0.5625rem] text-[color:var(--tx-3)]">{k.k}</p>
            <p className="mt-0.5 text-[0.9375rem] font-semibold tracking-[-0.02em] text-white">{k.v}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex h-[92px] items-end gap-2 rounded-[8px] border border-[color:var(--line)] p-2.5">
        {bars.map((b, i) => (
          <div key={i} className={`flex-1 rounded-t-[3px] ${i === 3 ? "bg-[color:var(--acc)]" : "bg-[rgb(var(--acc-rgb)/0.3)]"}`} style={{ height: `${b}%` }} />
        ))}
      </div>
      <p className="v19-mono mt-2 text-[0.5625rem] text-[color:var(--tx-3)]">One definition of revenue, every entity</p>
    </Face>
  );
}

export function FaceAI() {
  return (
    <Face n="Layer 04" name="Artificial Intelligence">
      <div className="ml-auto max-w-[80%] rounded-[10px] rounded-tr-[3px] bg-white/[0.08] px-3 py-2 text-[0.6875rem] text-white">Why did EBITDA margin drop in Q3?</div>
      <div className="mt-2.5 max-w-[92%] rounded-[10px] rounded-tl-[3px] border border-[rgb(var(--acc-rgb)/0.4)] bg-[rgb(var(--acc-rgb)/0.08)] px-3 py-2 text-[0.6875rem] leading-[1.5] text-[color:var(--tx-2)]">
        Freight rose 14% after the July carrier change, and Northeast discounting added $1.1M.
        <span className="mt-2 flex gap-1.5">
          {["gl_entries", "orders", "deals"].map((c) => (
            <span key={c} className="v19-mono rounded-[3px] bg-white/[0.06] px-1.5 py-0.5 text-[0.5625rem] text-[color:var(--tx-3)]">
              {c}
            </span>
          ))}
        </span>
      </div>
      <p className="v19-mono mt-3 flex items-center gap-2 text-[0.5625rem] text-[color:var(--tx-3)]">
        <span className="v19-dot v19-dot-acc" /> Second Brain · 3 tables read
      </p>
    </Face>
  );
}

export function FaceOutcome() {
  return (
    <Face n="Outcome" name="Better business decisions" warm>
      <div className="rounded-[10px] border border-[rgb(var(--warm-rgb)/0.45)] bg-[rgb(var(--warm-rgb)/0.07)] p-3.5">
        <p className="text-[0.6875rem] text-[#ffe2bd]">Recommended decision</p>
        <p className="mt-1 text-[1rem] font-semibold tracking-[-0.02em] text-white">Renegotiate freight, cap regional discounts</p>
        <div className="mt-3 flex items-center justify-between text-[0.625rem] text-[color:var(--tx-2)]">
          <span>Impact ~1.8 pts · owner COO</span>
          <span className="rounded-full bg-[color:var(--warm)] px-2.5 py-1 font-medium text-[#1a1205]">Approve</span>
        </div>
      </div>
    </Face>
  );
}

export const FACES = [FaceData, FaceAnalytics, FaceBI, FaceAI];
