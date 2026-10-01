"use client";

import type { CSSProperties, ReactNode } from "react";

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};
const phase = (p: number, start: number, end: number) => smooth((p - start) / (end - start));

function stageStyle(opacity: number, offset = 0): CSSProperties {
  return {
    opacity,
    transform: `translate3d(${offset}px, 0, 0) scale(${0.985 + opacity * 0.015})`,
    filter: `blur(${(1 - opacity) * 8}px)`,
    pointerEvents: opacity > 0.75 ? "auto" : "none",
  };
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-[linear-gradient(145deg,oklch(0.26_0.05_258/.9),oklch(0.16_0.035_258/.94))] shadow-[0_24px_80px_oklch(0.12_0.04_258/.42)] ${className}`}
    >
      {children}
    </div>
  );
}

function Label({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "gold" | "silver" }) {
  const toneClass = tone === "gold" ? "text-gl-gold" : tone === "silver" ? "text-slate-200" : "text-gl-data";
  return <p className={`font-gl-mono text-[10px] tracking-[0.2em] ${toneClass}`}>{children}</p>;
}

const systemGroups = [
  ["ERP", "SAP", "NetSuite", "Epicor"],
  ["CRM", "Salesforce", "HubSpot"],
  ["OPS", "MES", "WMS", "HRIS"],
];

const memoryNodes = ["Decisions", "Customers", "People", "Processes", "Projects", "Suppliers", "Policies"];
const marketSignals = ["Competitors", "Industry news", "Commodity indexes", "Supplier risk", "Regulation"];

function ConnectorLines({ progress, gold = false }: { progress: number; gold?: boolean }) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 1000 700" preserveAspectRatio="none">
      {[170, 350, 530].map((y, index) => (
        <g key={y} opacity={progress}>
          <path
            d={`M 130 ${y} C 330 ${y}, 330 350, 500 350 C 670 350, 670 ${y}, 870 ${y}`}
            fill="none"
            stroke={gold ? "var(--gold)" : "var(--data)"}
            strokeOpacity={0.18 + index * 0.04}
            strokeWidth="2"
            pathLength="1"
            strokeDasharray={`${progress} 1`}
          />
          <circle r="4" fill={gold ? "var(--gold)" : "var(--data)"} opacity={0.75}>
            <animateMotion
              dur={`${3.4 + index * 0.45}s`}
              begin={`${index * 0.5}s`}
              repeatCount="indefinite"
              path={`M 130 ${y} C 330 ${y}, 330 350, 500 350 C 670 350, 670 ${y}, 870 ${y}`}
            />
          </circle>
        </g>
      ))}
    </svg>
  );
}

function ConnectStage({ progress }: { progress: number }) {
  const reveal = phase(progress, 0.01, 0.08);
  const entities = phase(progress, 0.08, 0.16);
  return (
    <div className="absolute inset-y-[11%] left-[43%] right-[4%]">
      <Label>THREE SIGNALS · ONE OPERATING CONTEXT</Label>
      <div className="mt-5 grid grid-cols-3 gap-4">
        <Panel className="min-h-[24rem] p-5">
          <Label>OPERATIONAL DATA</Label>
          <p className="mt-2 text-lg font-medium text-gl-foreground">What the business records</p>
          <div className="mt-5 space-y-3">
            {systemGroups.map(([name, ...items], index) => (
              <div
                key={name}
                className="rounded-lg border border-gl-data/20 bg-gl-data/[0.045] p-3 transition-all duration-500"
                style={{ opacity: phase(reveal, index * 0.15, 0.55 + index * 0.15) }}
              >
                <span className="text-[10px] tracking-[0.18em] text-gl-data">{name}</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {items.map((item) => <span key={item} className="rounded border border-white/10 bg-white/[0.05] px-2 py-1 text-[10px] text-slate-300">{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="min-h-[24rem] p-5">
          <Label tone="gold">BUSINESS MEMORY</Label>
          <p className="mt-2 text-lg font-medium text-gl-foreground">What the organization knows</p>
          <div className="relative mt-5 h-[13.5rem] overflow-hidden rounded-lg border border-gl-gold/15 bg-gl-gold/[0.025]">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 260 210">
              {memoryNodes.slice(1).map((_, index) => {
                const angle = (Math.PI * 2 * index) / 6;
                const x = 130 + Math.cos(angle) * 83;
                const y = 105 + Math.sin(angle) * 68;
                return <line key={index} x1="130" y1="105" x2={x} y2={y} stroke="var(--gold)" strokeOpacity={0.2 + reveal * 0.3} />;
              })}
              {memoryNodes.map((node, index) => {
                const angle = index === 0 ? 0 : (Math.PI * 2 * (index - 1)) / 6;
                const x = index === 0 ? 130 : 130 + Math.cos(angle) * 83;
                const y = index === 0 ? 105 : 105 + Math.sin(angle) * 68;
                return (
                  <g key={node} opacity={phase(reveal, index * 0.07, 0.45 + index * 0.07)}>
                    <circle cx={x} cy={y} r={index === 0 ? 18 : 10} fill="var(--background)" stroke="var(--gold)" strokeOpacity={index === 0 ? 0.8 : 0.45} />
                    <text x={x} y={y + (index === 0 ? 32 : 24)} textAnchor="middle" fill="oklch(0.82 0.02 250)" fontSize="8">{node}</text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Email", "Teams", "Calls", "Docs", "Interviews"].map((item) => <span key={item} className="rounded-full border border-gl-gold/15 px-2 py-1 text-[9px] text-gl-gold/80">{item}</span>)}
          </div>
        </Panel>

        <Panel className="min-h-[24rem] p-5">
          <Label>EXTERNAL INTELLIGENCE</Label>
          <p className="mt-2 text-lg font-medium text-gl-foreground">What is changing around it</p>
          <div className="mt-5 space-y-2.5">
            {marketSignals.map((signal, index) => (
              <div key={signal} className="flex items-center gap-3 rounded-lg border border-gl-data/15 bg-gl-data/[0.035] px-3 py-3" style={{ opacity: phase(reveal, index * 0.09, 0.5 + index * 0.09) }}>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gl-data opacity-30" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gl-data/80" />
                </span>
                <span className="text-xs text-slate-300">{signal}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[10px] leading-relaxed text-gl-muted-foreground">Continuously monitored, qualified, and connected to internal exposure.</p>
        </Panel>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2" style={{ opacity: entities }}>
        {["Northwind Mfg", "Atlas Retail", "Meridian Services", "Kestrel Industrial"].map((entity) => (
          <div key={entity} className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-center text-[10px] tracking-wide text-slate-400">{entity}</div>
        ))}
      </div>
    </div>
  );
}

function UnifyStage({ progress }: { progress: number }) {
  const local = clamp((progress - 0.16) / 0.42);
  const streams = phase(local, 0.02, 0.2);
  const foundation = phase(local, 0.12, 0.36);
  const memory = phase(local, 0.3, 0.58);
  const external = phase(local, 0.5, 0.74);
  const converge = phase(local, 0.72, 0.94);
  return (
    <div className="absolute inset-y-[9%] left-[42%] right-[3.5%]">
      <div className="grid grid-cols-3 gap-3" style={{ opacity: streams }}>
        {["SYSTEMS OF RECORD", "ORGANIZATIONAL CONTEXT", "EXTERNAL SIGNALS"].map((item, index) => (
          <div key={item} className={`rounded-lg border px-4 py-3 text-center font-gl-mono text-[9px] tracking-[0.18em] ${index === 1 ? "border-gl-gold/25 bg-gl-gold/[0.04] text-gl-gold" : "border-gl-data/20 bg-gl-data/[0.04] text-gl-data"}`}>{item}</div>
        ))}
      </div>
      <div className="relative mt-4 grid min-h-[31rem] grid-cols-[1.08fr_.92fr_.92fr] gap-4">
        <Panel className="p-5" >
          <div style={{ opacity: foundation }}>
            <Label>MANAGED DATA FOUNDATION</Label>
            <p className="mt-2 text-base font-medium">Operational truth</p>
            <div className="mt-5 space-y-3">
              {[
                ["BRONZE", "Source data preserved", "border-amber-600/25 bg-amber-500/[0.06] text-amber-400"],
                ["SILVER", "Cleaned and reconciled", "border-slate-300/20 bg-slate-100/[0.05] text-slate-200"],
                ["GOLD", "Business-ready metrics", "border-gl-gold/25 bg-gl-gold/[0.07] text-gl-gold"],
                ["SEMANTIC", "Shared KPIs and business rules", "border-gl-gold/35 bg-gl-gold/[0.1] text-gl-gold"],
              ].map(([name, detail, style], index) => (
                <div key={name} className={`rounded-lg border px-4 py-3 ${style}`} style={{ opacity: phase(foundation, index * 0.08, 0.56 + index * 0.08), transform: `translateX(${(1 - phase(foundation, index * 0.08, 0.56 + index * 0.08)) * -10}px)` }}>
                  <p className="font-gl-mono text-[9px] tracking-[0.18em]">{name}</p>
                  <p className="mt-1 text-[11px] text-slate-300">{detail}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[10px] leading-relaxed text-gl-muted-foreground">Built, governed, monitored, and continuously operated by Genius Lab.</p>
          </div>
        </Panel>

        <Panel className="p-5">
          <div style={{ opacity: memory }}>
            <Label tone="gold">BUSINESS MEMORY</Label>
            <p className="mt-2 text-base font-medium">Connected context</p>
            <div className="relative mt-5 h-[15rem]">
              <svg className="h-full w-full" viewBox="0 0 260 240">
                {Array.from({ length: 9 }).map((_, index) => {
                  const angle = (Math.PI * 2 * index) / 9;
                  const x = 130 + Math.cos(angle) * (index % 2 ? 92 : 72);
                  const y = 120 + Math.sin(angle) * (index % 2 ? 84 : 64);
                  return (
                    <g key={index} opacity={phase(memory, index * 0.035, 0.45 + index * 0.035)}>
                      <line x1="130" y1="120" x2={x} y2={y} stroke="var(--gold)" strokeOpacity="0.26" />
                      <circle cx={x} cy={y} r={index % 3 === 0 ? 10 : 7} fill="var(--background)" stroke="var(--gold)" strokeOpacity="0.62" />
                    </g>
                  );
                })}
                <circle cx="130" cy="120" r="24" fill="oklch(0.22 0.04 258)" stroke="var(--gold)" strokeOpacity="0.8" />
                <text x="130" y="117" textAnchor="middle" fill="var(--gold)" fontSize="8">BUSINESS</text>
                <text x="130" y="130" textAnchor="middle" fill="var(--gold)" fontSize="8">MEMORY</text>
              </svg>
            </div>
            <div className="rounded-md border border-gl-gold/20 bg-gl-gold/[0.05] px-3 py-2 text-[10px] text-slate-300">AI identifies gaps and asks the right people.</div>
          </div>
        </Panel>

        <Panel className="p-5">
          <div style={{ opacity: external }}>
            <Label>EXTERNAL INTELLIGENCE</Label>
            <p className="mt-2 text-base font-medium">Relevant market signals</p>
            <div className="mt-5 space-y-3">
              {[
                ["STEEL INDEX", "−6.8%", "Input costs easing"],
                ["SEGMENT DEMAND", "−11%", "Two-quarter slowdown"],
                ["COMPETITOR PRICING", "3 alerts", "Discounting detected"],
                ["SUPPLIER RISK", "Elevated", "Tier-1 delay signal"],
              ].map(([name, value, note], index) => (
                <div key={name} className="rounded-lg border border-gl-data/15 bg-gl-data/[0.035] p-3" style={{ opacity: phase(external, index * 0.07, 0.55 + index * 0.07) }}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-gl-mono text-[8px] tracking-[0.13em] text-gl-data">{name}</span>
                    <span className="text-[10px] text-gl-gold">{value}</span>
                  </div>
                  <p className="mt-1 text-[10px] text-gl-muted-foreground">{note}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[9px] text-gl-muted-foreground">Sources · dates · confidence · relevance</p>
          </div>
        </Panel>
        <ConnectorLines progress={converge} gold />
      </div>
      <div className="relative -mt-12 mx-auto w-[54%] rounded-xl border border-gl-gold/35 bg-[linear-gradient(90deg,oklch(0.22_0.045_258/.96),oklch(0.27_0.06_258/.96))] px-5 py-4 text-center shadow-[0_0_45px_oklch(0.74_0.13_75/.12)]" style={{ opacity: converge, transform: `translateY(${(1 - converge) * 16}px)` }}>
        <Label tone="gold">GENIUS INTELLIGENCE LAYER</Label>
        <p className="mt-1 text-xs text-slate-300">Operational truth · organizational context · external foresight</p>
      </div>
    </div>
  );
}

function UnderstandStage({ progress }: { progress: number }) {
  const local = clamp((progress - 0.52) / 0.3);
  const evidence = phase(local, 0.05, 0.3);
  const question = phase(local, 0.28, 0.5);
  const synthesis = phase(local, 0.48, 0.74);
  const recommendation = phase(local, 0.7, 0.94);
  return (
    <div className="absolute inset-y-[11%] left-[44%] right-[5%]">
      <Panel className="h-full p-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <Label tone="gold">EXECUTIVE INTELLIGENCE · IN FOCUS</Label>
            <p className="mt-2 text-xl font-medium">Southeast working-capital risk</p>
          </div>
          <div className="rounded-full border border-gl-data/20 bg-gl-data/[0.05] px-3 py-1.5 text-[9px] tracking-wide text-gl-data">LIVE · TRACEABLE</div>
        </div>
        <div className="mt-5 grid h-[calc(100%-5rem)] grid-cols-[.9fr_1.1fr] gap-5">
          <div className="space-y-3" style={{ opacity: evidence }}>
            {[
              ["INTERNAL FACT", "Inventory +18% · order velocity −11%", "ERP · WMS · CRM"],
              ["ORGANIZATIONAL CONTEXT", "Customer expansion delayed two quarters", "Call transcript · account notes"],
              ["EXTERNAL SIGNAL", "Demand weakening · competitors discounting", "Industry index · 4 verified sources"],
            ].map(([tag, body, source], index) => (
              <div key={tag} className={`rounded-lg border p-4 ${index === 1 ? "border-gl-gold/20 bg-gl-gold/[0.035]" : "border-gl-data/15 bg-gl-data/[0.03]"}`}>
                <p className={`font-gl-mono text-[9px] tracking-[0.16em] ${index === 1 ? "text-gl-gold" : "text-gl-data"}`}>{tag}</p>
                <p className="mt-2 text-sm text-slate-200">{body}</p>
                <p className="mt-2 text-[9px] text-gl-muted-foreground">{source}</p>
              </div>
            ))}
            <div className="rounded-lg border border-gl-gold/25 bg-gl-gold/[0.05] p-4" style={{ opacity: question }}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-gl-mono text-[9px] tracking-[0.16em] text-gl-gold">CONTEXT GAP DETECTED</p>
                <span className="text-[9px] text-gl-muted-foreground">Asked · VP Sales</span>
              </div>
              <p className="mt-2 text-xs text-slate-200">Has the customer confirmed a revised launch date?</p>
              <p className="mt-2 rounded border border-white/10 bg-white/[0.035] px-3 py-2 text-[10px] text-slate-400">No confirmed date. Earliest restart is Q1.</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-gl-gold/25 bg-gl-gold/[0.04] p-5" style={{ opacity: synthesis, transform: `translateY(${(1 - synthesis) * 12}px)` }}>
              <Label tone="gold">GENIUS LAB SYNTHESIS</Label>
              <p className="mt-3 text-lg leading-snug text-gl-foreground">$4.2M in working capital is at risk, and current internal and market signals indicate the slowdown will continue for at least two quarters.</p>
              <div className="mt-4 flex flex-wrap gap-2 text-[9px] text-gl-muted-foreground">
                <span className="rounded-full border border-white/10 px-2 py-1">3 internal systems</span>
                <span className="rounded-full border border-white/10 px-2 py-1">2 conversations</span>
                <span className="rounded-full border border-white/10 px-2 py-1">4 external sources</span>
              </div>
            </div>
            <div className="flex-1 rounded-xl border border-gl-data/20 bg-gl-data/[0.035] p-5" style={{ opacity: recommendation, transform: `translateY(${(1 - recommendation) * 12}px)` }}>
              <Label>RECOMMENDED ACTION</Label>
              <p className="mt-3 text-xl font-medium text-gl-foreground">Release $1.4M of Southeast inventory now.</p>
              <p className="mt-3 text-xs leading-relaxed text-gl-muted-foreground">Protect the price floor on high-margin SKUs and review the remaining exposure in 30 days.</p>
              <div className="mt-5 flex gap-2">
                <span className="rounded-md border border-gl-gold/30 bg-gl-gold/[0.1] px-4 py-2 text-[10px] text-gl-gold">Approve</span>
                <span className="rounded-md border border-white/10 px-4 py-2 text-[10px] text-slate-400">Review evidence</span>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function ExecuteStage({ progress }: { progress: number }) {
  const local = clamp((progress - 0.76) / 0.24);
  const approve = phase(local, 0.02, 0.22);
  const actions = phase(local, 0.2, 0.55);
  const outcomes = phase(local, 0.52, 0.78);
  const learn = phase(local, 0.76, 0.98);
  const actionCards = [
    ["INVENTORY WORKFLOW", "Regional plan created", "Owner · Southeast Ops"],
    ["PRICE GUARD", "1,284 SKUs protected", "Margin floor · active"],
    ["ERP WRITE-BACK", "Release authorized", "Audit trail · complete"],
  ];
  return (
    <div className="absolute inset-y-[12%] left-[43%] right-[3.5%]">
      <div className="grid h-full grid-cols-[.78fr_1.1fr] gap-5">
        <div className="flex flex-col justify-center">
          <Panel className="p-5" >
            <Label tone="gold">APPROVED DECISION</Label>
            <p className="mt-3 text-xl font-medium">Release $1.4M of Southeast inventory</p>
            <p className="mt-3 text-xs leading-relaxed text-gl-muted-foreground">Human-approved · governed policy · source evidence retained</p>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full rounded-full bg-gl-gold" style={{ width: `${approve * 100}%` }} />
            </div>
          </Panel>
          <div className="mt-4 rounded-lg border border-gl-gold/20 bg-gl-gold/[0.035] p-4" style={{ opacity: learn }}>
            <Label tone="gold">BUSINESS MEMORY UPDATED</Label>
            <p className="mt-2 text-xs text-slate-300">Decision, reasoning, owner, and outcome preserved for future intelligence.</p>
          </div>
        </div>
        <div className="relative flex flex-col justify-center gap-3">
          <ConnectorLines progress={actions} />
          {actionCards.map(([name, result, detail], index) => (
            <Panel key={name} className="relative z-10 ml-auto w-[78%] p-4" >
              <div style={{ opacity: phase(actions, index * 0.12, 0.58 + index * 0.12), transform: `translateX(${(1 - phase(actions, index * 0.12, 0.58 + index * 0.12)) * 18}px)` }}>
                <div className="flex items-center justify-between gap-3">
                  <Label>{name}</Label>
                  <span className="rounded-full border border-gl-data/20 bg-gl-data/[0.05] px-2 py-1 text-[8px] text-gl-data">ACTIVE</span>
                </div>
                <p className="mt-2 text-sm text-slate-200">{result}</p>
                <p className="mt-1 text-[10px] text-gl-muted-foreground">{detail}</p>
              </div>
            </Panel>
          ))}
          <div className="relative z-10 ml-auto mt-2 w-[78%] rounded-lg border border-gl-gold/25 bg-gl-gold/[0.04] px-4 py-3" style={{ opacity: outcomes }}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label tone="gold">OUTCOME MONITORED</Label>
                <p className="mt-1 text-xs text-slate-300">Working-capital exposure reduced</p>
              </div>
              <p className="text-lg font-medium text-gl-gold">+$1.4M</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 left-[22%] right-[4%] h-px bg-gradient-to-r from-transparent via-gl-gold/60 to-transparent" style={{ opacity: learn }} />
      <p className="absolute -bottom-9 left-[36%] font-gl-mono text-[9px] tracking-[0.18em] text-gl-gold" style={{ opacity: learn }}>ACT · MEASURE · LEARN · IMPROVE</p>
    </div>
  );
}

export function LifecycleScene({ p }: { p: number; vw: number }) {
  const connectOpacity = 1 - phase(p, 0.16, 0.23);
  const unifyOpacity = phase(p, 0.16, 0.23) * (1 - phase(p, 0.51, 0.58));
  const understandOpacity = phase(p, 0.51, 0.58) * (1 - phase(p, 0.76, 0.83));
  const executeOpacity = phase(p, 0.76, 0.83);

  return (
    <div className="relative h-full w-full overflow-hidden bg-gl-background">
      <div className="absolute inset-0 opacity-80 [background-image:linear-gradient(color-mix(in_oklab,var(--data)_18%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--data)_18%,transparent)_1px,transparent_1px)] [background-size:112px_112px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_48%,oklch(0.35_0.09_258/.14),transparent_44%)]" />
      <div className="absolute inset-0 transition-all duration-300" style={stageStyle(connectOpacity, (1 - connectOpacity) * -20)}><ConnectStage progress={p} /></div>
      <div className="absolute inset-0 transition-all duration-300" style={stageStyle(unifyOpacity, (1 - unifyOpacity) * 18)}><UnifyStage progress={p} /></div>
      <div className="absolute inset-0 transition-all duration-300" style={stageStyle(understandOpacity, (1 - understandOpacity) * 18)}><UnderstandStage progress={p} /></div>
      <div className="absolute inset-0 transition-all duration-300" style={stageStyle(executeOpacity, (1 - executeOpacity) * 18)}><ExecuteStage progress={p} /></div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_82%_78%_at_60%_50%,transparent_52%,var(--background)_100%)] opacity-70" />
    </div>
  );
}
