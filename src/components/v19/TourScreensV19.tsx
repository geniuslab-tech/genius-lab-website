import type { ReactNode } from "react";
import { ArrowRight, Check, Lightning, Warning } from "@phosphor-icons/react/dist/ssr";

/** Screens for the Genius Portal tour. Illustrative previews only; no real client data. */

function Head({ title, meta, children }: { title: string; meta: string; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="v19-label text-[0.625rem] text-[color:var(--tx-3)]">{meta}</p>
        <p className="v19-h3 mt-1 text-[1.125rem] sm:text-[1.25rem]">{title}</p>
      </div>
      {children}
    </div>
  );
}

const cell = "rounded-[10px] border border-[color:var(--line)] bg-[color:var(--g3)]";

export function ScreenConnectors() {
  const rows = [
    { s: "NetSuite ERP", k: "ERP", t: "orders, invoices, items", n: "1.2M", at: "12s ago", ok: true },
    { s: "Salesforce", k: "CRM", t: "accounts, deals, contacts", n: "310K", at: "40s ago", ok: true },
    { s: "General ledger", k: "Finance", t: "gl_entries, budgets", n: "6.7M", at: "1m ago", ok: true },
    { s: "Snowflake", k: "Warehouse", t: "ops.events", n: "22M", at: "8s ago", ok: true },
    { s: "Shared drive", k: "Sheets", t: "forecast_v7.xlsx", n: "14 tabs", at: "schema changed", ok: false },
  ];
  return (
    <div>
      <Head title="Connected systems" meta="Connectors · 5 of 46 shown">
        <span className="rounded-full border border-[color:var(--line-2)] px-3 py-1 text-[0.75rem] text-[color:var(--tx-2)]">+ Add source</span>
      </Head>
      <div className={`${cell} mt-4 overflow-hidden`}>
        <div className="v19-label hidden grid-cols-[1.3fr_1.6fr_0.7fr_0.9fr] gap-4 border-b border-[color:var(--line)] px-4 py-2.5 text-[0.625rem] text-[color:var(--tx-3)] sm:grid">
          <span>Source</span>
          <span>Tables</span>
          <span>Rows</span>
          <span>Last sync</span>
        </div>
        <ul>
          {rows.map((r) => (
            <li key={r.s} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b border-[color:var(--line)] px-4 py-3 last:border-0 sm:grid-cols-[1.3fr_1.6fr_0.7fr_0.9fr] sm:items-center">
              <span className="flex items-center gap-2.5 text-[0.875rem] text-white">
                <span className={`v19-dot ${r.ok ? "v19-dot-acc" : "v19-dot-warm"}`} />
                {r.s}
                <span className="v19-mono rounded-[4px] bg-white/[0.05] px-1.5 text-[0.625rem] text-[color:var(--tx-3)]">{r.k}</span>
              </span>
              <span className="v19-mono truncate text-[0.75rem] text-[color:var(--tx-3)] max-sm:order-3 max-sm:col-span-2">{r.t}</span>
              <span className="v19-mono text-[0.75rem] text-[color:var(--tx-2)] max-sm:hidden">{r.n}</span>
              <span className={`v19-mono text-right text-[0.75rem] sm:text-left ${r.ok ? "text-[color:var(--tx-3)]" : "text-[color:var(--warm)]"}`}>{r.at}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ScreenPipelines() {
  const nodes = [
    { x: 8, y: 18, l: "erp.orders" },
    { x: 8, y: 50, l: "crm.deals" },
    { x: 8, y: 82, l: "finance.gl" },
    { x: 42, y: 34, l: "stg_orders" },
    { x: 42, y: 70, l: "stg_revenue" },
    { x: 76, y: 50, l: "metrics.revenue" },
  ];
  const links = [
    [0, 3],
    [1, 3],
    [1, 4],
    [2, 4],
    [3, 5],
    [4, 5],
  ];
  const tests = [
    { t: "unique order_id", ok: true },
    { t: "revenue reconciles to ledger", ok: true },
    { t: "no future-dated invoices", ok: true },
    { t: "currency present", ok: true },
  ];
  return (
    <div>
      <Head title="metrics.revenue lineage" meta="Pipelines · run #4,812 · 2m 14s" />
      <div className="mt-4 grid gap-3 md:grid-cols-[1.6fr_1fr]">
        <div className={`${cell} relative h-[240px] overflow-hidden sm:h-[280px]`}>
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true">
            {links.map(([a, b]) => (
              <path
                key={`${a}-${b}`}
                d={`M${nodes[a].x + 16} ${nodes[a].y} C${nodes[a].x + 26} ${nodes[a].y} ${nodes[b].x - 8} ${nodes[b].y} ${nodes[b].x} ${nodes[b].y}`}
                fill="none"
                stroke="#5b8cff"
                strokeOpacity="0.55"
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
          {nodes.map((n, i) => (
            <span
              key={n.l}
              className={`v19-mono absolute -translate-y-1/2 truncate rounded-[6px] border px-2 py-1 text-[0.625rem] sm:text-[0.6875rem] ${
                i === 5 ? "border-[rgb(var(--acc-rgb)/0.6)] bg-[rgb(var(--acc-rgb)/0.15)] text-white" : "border-[color:var(--line-2)] bg-[#0a0e24] text-[color:var(--tx-2)]"
              }`}
              style={{ left: `${n.x}%`, top: `${n.y}%`, maxWidth: "22%" }}
            >
              {n.l}
            </span>
          ))}
        </div>
        <div className={`${cell} p-4`}>
          <p className="text-[0.8125rem] font-medium">Tests</p>
          <ul className="mt-3 space-y-2.5">
            {tests.map((t) => (
              <li key={t.t} className="flex items-center gap-2.5 text-[0.8125rem] text-[color:var(--tx-2)]">
                <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color:var(--acc)] text-[#05070f]">
                  <Check size={9} weight="bold" />
                </span>
                {t.t}
              </li>
            ))}
          </ul>
          <p className="v19-mono mt-5 text-[0.6875rem] text-[color:var(--tx-3)]">4 of 4 passed · deployed to production</p>
        </div>
      </div>
    </div>
  );
}

const SERIES = [38, 41, 40, 44, 43, 47, 49, 48, 52, 55, 54, 58];
const pts = (s: number[]) => s.map((v, i) => `${((i / (s.length - 1)) * 100).toFixed(1)},${(100 - ((v - 34) / 28) * 100).toFixed(1)}`).join(" ");

export function ScreenAnalytics() {
  const rows = [
    { e: "North America", v: "$21.4M", d: "+8.2%" },
    { e: "Europe", v: "$14.9M", d: "+4.1%" },
    { e: "Northeast region", v: "$6.2M", d: "−3.4%", warm: true },
    { e: "APAC", v: "$5.7M", d: "+11.0%" },
  ];
  return (
    <div>
      <Head title="Revenue by region" meta="Analytics · QTD · all entities">
        <span className="v19-mono text-[0.75rem] text-[color:var(--tx-3)]">Drill: region → account</span>
      </Head>
      <div className="mt-4 grid gap-3 md:grid-cols-[1.5fr_1fr]">
        <div className={`${cell} p-4`}>
          <div className="flex items-baseline justify-between">
            <p className="v19-h3 text-[1.75rem] tabular-nums">$48.2M</p>
            <p className="v19-mono text-[0.75rem] text-[color:var(--acc-2)]">+6.1% vs plan</p>
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-3 h-[150px] w-full sm:h-[190px]" aria-hidden="true">
            <polyline points={`0,100 ${pts(SERIES)} 100,100`} fill="rgb(91 140 255 / 0.14)" stroke="none" />
            <polyline points={pts(SERIES)} fill="none" stroke="#5b8cff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <ul className={`${cell} divide-y divide-[color:var(--line)]`}>
          {rows.map((r) => (
            <li key={r.e} className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="text-[0.875rem] text-white">{r.e}</span>
              <span className="flex items-baseline gap-3">
                <span className="v19-mono text-[0.8125rem] text-[color:var(--tx-2)]">{r.v}</span>
                <span className={`v19-mono w-14 text-right text-[0.75rem] ${r.warm ? "text-[color:var(--warm)]" : "text-[color:var(--acc-2)]"}`}>{r.d}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ScreenGovernance() {
  return (
    <div>
      <Head title="Metric definition: Revenue" meta="Governance · certified" />
      <div className="mt-4 grid gap-3 md:grid-cols-[1.4fr_1fr]">
        <div className={`${cell} p-4`}>
          <p className="v19-mono rounded-[8px] bg-[#060816] p-3 text-[0.75rem] leading-[1.7] text-[color:var(--tx-2)]">
            <span className="text-[color:var(--acc-2)]">metric</span> revenue <span className="text-white/30">=</span>
            <br />
            &nbsp;&nbsp;sum(gl_entries.amount)
            <br />
            &nbsp;&nbsp;<span className="text-[color:var(--acc-2)]">where</span> account.type = &apos;income&apos;
            <br />
            &nbsp;&nbsp;<span className="text-[color:var(--acc-2)]">net of</span> returns, intercompany
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-[0.8125rem]">
            {[
              ["Owner", "Group finance"],
              ["Used in", "31 dashboards"],
              ["Version", "v3 · approved"],
              ["Reviewed", "Every quarter"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[color:var(--tx-3)]">{k}</dt>
                <dd className="text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={`${cell} p-4`}>
          <p className="text-[0.8125rem] font-medium">Access</p>
          <ul className="mt-3 space-y-2.5 text-[0.8125rem]">
            {[
              ["Executive team", "View"],
              ["Finance", "Edit"],
              ["Regional leads", "Own region"],
              ["Agents", "Read, cite"],
            ].map(([k, v]) => (
              <li key={k} className="flex items-center justify-between gap-3">
                <span className="text-[color:var(--tx-2)]">{k}</span>
                <span className="v19-mono rounded-[4px] border border-[color:var(--line-2)] px-1.5 text-[0.6875rem] text-[color:var(--tx-2)]">{v}</span>
              </li>
            ))}
          </ul>
          <p className="v19-mono mt-5 text-[0.6875rem] text-[color:var(--tx-3)]">Audit trail · 214 events this month</p>
        </div>
      </div>
    </div>
  );
}

export function ScreenAutomation() {
  const flows = [
    { when: "Cash forecast drops below $4.0M", then: "Alert treasury and the CFO", on: true },
    { when: "An order misses its carrier scan", then: "Open a ticket for the ops lead", on: true },
    { when: "Month-end close starts", then: "Run reconciliations, post a status", on: true },
    { when: "A new entity is acquired", then: "Map its ledger to group definitions", on: false },
  ];
  return (
    <div>
      <Head title="Workflows" meta="Automation · 12 active" />
      <ul className="mt-4 space-y-2">
        {flows.map((f) => (
          <li key={f.when} className={`${cell} flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4`}>
            <span className="flex min-w-0 flex-1 items-center gap-2.5 text-[0.875rem] text-white">
              <Lightning size={14} className="shrink-0 text-[color:var(--acc-2)]" aria-hidden="true" />
              <span className="text-[color:var(--tx-3)]">When</span> {f.when}
            </span>
            <ArrowRight size={13} className="hidden shrink-0 text-[color:var(--tx-3)] sm:block" aria-hidden="true" />
            <span className="min-w-0 flex-1 text-[0.875rem] text-[color:var(--tx-2)]">{f.then}</span>
            <span className={`relative h-5 w-9 shrink-0 rounded-full ${f.on ? "bg-[color:var(--acc)]" : "bg-white/10"}`}>
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${f.on ? "left-[18px]" : "left-0.5"}`} />
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex items-center gap-2 rounded-[10px] border border-[rgb(var(--warm-rgb)/0.4)] bg-[rgb(var(--warm-rgb)/0.06)] px-4 py-2.5 text-[0.8125rem] text-[#ffe2bd]">
        <Warning size={14} className="text-[color:var(--warm)]" aria-hidden="true" />
        Triggered 09:42 · Cash forecast week 7 at $4.6M, approaching floor
      </p>
    </div>
  );
}

export function ScreenAgents() {
  return (
    <div>
      <Head title="Ask Genius" meta="AI Agents · finance workspace" />
      <div className="mt-4 space-y-3">
        <div className="ml-auto max-w-[80%] rounded-[12px] rounded-tr-[4px] bg-white/[0.08] px-4 py-2.5 text-[0.875rem] text-white">
          What will our cash position look like over the next 90 days?
        </div>
        <div className={`${cell} max-w-[92%] rounded-tl-[4px] px-4 py-3`}>
          <p className="text-[0.875rem] leading-[1.6] text-[color:var(--tx)]">
            Cash stays above the $4M floor, with a low of $4.6M in week 7 when the annual insurance premium and two supplier
            payments land together. Collecting the three overdue enterprise invoices early lifts that low point to $5.9M.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[color:var(--line)] pt-3">
            {["ar.invoices", "ap.schedule", "treasury.balances"].map((c) => (
              <span key={c} className="v19-mono rounded-[4px] bg-white/[0.05] px-1.5 py-0.5 text-[0.6875rem] text-[color:var(--tx-3)]">
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="flex h-11 items-center gap-3 rounded-full border border-[color:var(--line-2)] bg-[#060816] pl-4 pr-1.5 text-[0.875rem] text-[color:var(--tx-3)]">
          <span className="flex-1 truncate">Ask a follow-up</span>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--acc-3)] text-[#060a1c]">
            <ArrowRight size={13} weight="bold" aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  );
}
