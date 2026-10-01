"use client";

import type { ReactNode } from "react";
import "./demo.css";
import { smoothPath } from "./engine";

/** Every demo renders at this design size and is scaled to its column. */
export const STAGE_W = 1250;
export const STAGE_H = 780;

export type NavKey =
  | "briefing"
  | "performance"
  | "margin"
  | "cash"
  | "entities"
  | "decisions"
  | "automations"
  | "agents"
  | "board";

const NAV: { key: NavKey; label: string; badge?: string }[] = [
  { key: "briefing", label: "Executive Briefing" },
  { key: "performance", label: "Performance" },
  { key: "margin", label: "Margin & Cost" },
  { key: "cash", label: "Cash & Working Capital" },
  { key: "entities", label: "Entities" },
  { key: "decisions", label: "Decisions", badge: "3" },
  { key: "automations", label: "Automations", badge: "6" },
  { key: "agents", label: "Agents", badge: "4" },
  { key: "board", label: "Board Reports" },
];

/** App chrome: sidebar, top bar and a content slot. */
export function DemoFrame({
  active,
  title,
  subtitle,
  badges = {},
  askActive = false,
  live = true,
  children,
  overlay,
}: {
  active: NavKey;
  title: string;
  subtitle: string;
  badges?: Partial<Record<NavKey, string>>;
  askActive?: boolean;
  live?: boolean;
  children: ReactNode;
  overlay?: ReactNode;
}) {
  return (
    <div className="glass-panel demo-shell relative flex h-full w-full overflow-hidden rounded-[18px]">
      <aside className="relative z-10 flex w-[212px] shrink-0 flex-col border-r border-gl-border/70 bg-gl-navy/80 p-4">
        <div className="mb-7 flex items-center gap-2.5 px-1.5 pt-1.5">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[7px] bg-gl-data/15">
            <span className="h-1.5 w-1.5 rounded-full bg-gl-data" />
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/genius-lab-logo-white.svg" alt="Genius Lab" className="h-[0.72rem] w-auto" />
        </div>
        <p className="mb-2 px-2.5 font-gl-mono text-[0.55rem] uppercase tracking-[0.18em] text-gl-muted-foreground/50">
          Workspace
        </p>
        <nav className="relative flex flex-1 flex-col gap-0.5">
          {NAV.map((n) => {
            const on = n.key === active;
            const badge = badges[n.key] ?? n.badge;
            return (
              <span
                key={n.key}
                data-cursor={`nav-${n.key}`}
                className={`flex items-center justify-between rounded-md px-2.5 py-[7px] text-[0.72rem] transition-all duration-500 ${
                  on
                    ? "bg-gl-data/14 text-gl-foreground ring-1 ring-inset ring-gl-data/30"
                    : "text-gl-muted-foreground/75"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`h-1 w-1 rounded-full transition-colors duration-500 ${on ? "bg-gl-data shadow-[0_0_8px_var(--data)]" : "bg-gl-muted-foreground/35"}`}
                  />
                  {n.label}
                </span>
                {badge ? (
                  <span
                    key={badge}
                    className="demo-pop rounded bg-gl-gold/15 px-1.5 text-[0.6rem] tabular-nums text-gl-gold"
                  >
                    {badge}
                  </span>
                ) : null}
              </span>
            );
          })}
        </nav>
        <div className="mt-6 rounded-lg border border-gl-border/70 bg-gl-background/40 p-2.5">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.75_0.12_70)] to-[oklch(0.55_0.14_40)] text-[0.55rem] font-semibold text-[oklch(0.15_0.03_264)]">
              EC
            </span>
            <div>
              <p className="text-[0.66rem] leading-tight text-gl-foreground">Elena Costa</p>
              <p className="text-[0.58rem] text-gl-muted-foreground/70">CFO · Meridian Holdings</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex h-[58px] shrink-0 items-center justify-between border-b border-gl-border/70 px-5">
          <div key={title} className="demo-fade-up">
            <p className="font-gl-display text-[0.88rem] tracking-tight text-gl-foreground">{title}</p>
            <p className="text-[0.64rem] text-gl-muted-foreground/70">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            {live ? (
              <span className="flex items-center gap-1.5 rounded-md border border-gl-border/70 px-2.5 py-1.5 font-gl-mono text-[0.58rem] uppercase tracking-[0.14em] text-gl-muted-foreground">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[var(--success)] opacity-60" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                </span>
                Live · 14 entities
              </span>
            ) : null}
            <span className="rounded-md border border-gl-border/70 px-2.5 py-1.5 text-[0.64rem] text-gl-muted-foreground">
              Quarter to date
            </span>
            <span
              data-cursor="ask"
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.66rem] font-medium transition-all duration-300 ${
                askActive
                  ? "bg-gl-gold text-gl-background shadow-[0_0_0_4px_oklch(0.77_0.155_66/22%)]"
                  : "bg-gl-gold text-gl-background"
              }`}
            >
              <Sparkle className="h-3 w-3" />
              Ask Genius
              <span className="rounded bg-[oklch(0.15_0.03_264/18%)] px-1 font-gl-mono text-[0.55rem]">⌘K</span>
            </span>
          </div>
        </header>
        <div className="relative min-h-0 flex-1">{children}</div>
      </div>
      {overlay}
    </div>
  );
}

/** Screen container that cross-fades pages in and out. */
export function Screen({ show, children, className = "" }: { show: boolean; children: ReactNode; className?: string }) {
  return (
    <div
      aria-hidden={!show}
      className={`absolute inset-0 p-[18px] transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        show ? "translate-y-0 opacity-100 blur-0" : "pointer-events-none translate-y-3 opacity-0 blur-[2px]"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function Card({ children, className = "", ...rest }: { children: ReactNode; className?: string; [k: `data-${string}`]: string }) {
  return (
    <div {...rest} className={`rounded-xl border border-gl-border/70 bg-gl-background/35 ${className}`}>
      {children}
    </div>
  );
}

export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[0.6rem] uppercase tracking-[0.12em] text-gl-muted-foreground/70 ${className}`}>{children}</p>;
}

export type Status = "ahead" | "track" | "attention" | "recovering";

export function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, [string, string, string]> = {
    ahead: ["Ahead of plan", "border-gl-data/40 bg-gl-data/10 text-gl-data", "bg-gl-data"],
    track: ["On track", "border-[oklch(0.78_0.13_168/40%)] bg-[oklch(0.78_0.13_168/10%)] text-[var(--success)]", "bg-[var(--success)]"],
    attention: ["Attention required", "border-gl-gold/40 bg-gl-gold/10 text-gl-gold", "bg-gl-gold"],
    recovering: ["Back on plan", "border-[oklch(0.78_0.13_168/40%)] bg-[oklch(0.78_0.13_168/10%)] text-[var(--success)]", "bg-[var(--success)]"],
  };
  const [copy, tone, dot] = map[status];
  return (
    <span
      key={status}
      className={`demo-pop inline-flex items-center gap-1.5 rounded-md border px-1.5 py-[2px] text-[0.54rem] uppercase tracking-[0.1em] ${tone}`}
    >
      <span className={`h-1 w-1 animate-pulse rounded-full ${dot}`} />
      {copy}
    </span>
  );
}

/** Tiny trend line. */
export function Spark({ values, tone = "data", w = 70, h = 22 }: { values: number[]; tone?: "data" | "gold" | "success"; w?: number; h?: number }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, 3 + (1 - (v - min) / (max - min || 1)) * (h - 6)] as const);
  const color = tone === "data" ? "var(--data)" : tone === "gold" ? "var(--gold)" : "var(--success)";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
      <path d={smoothPath(pts)} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M8 1.5 9.4 6.6 14.5 8 9.4 9.4 8 14.5 6.6 9.4 1.5 8 6.6 6.6Z" fill="currentColor" />
    </svg>
  );
}

export function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="m3.5 8.4 2.9 2.9 6.1-6.6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Spinner({ className = "" }: { className?: string }) {
  return <span className={`inline-block animate-spin rounded-full border-[1.5px] border-current border-r-transparent ${className}`} />;
}

/**
 * The agent's presence: a softly rotating orb. It breathes while thinking,
 * pulses while writing and settles once it is waiting on a person.
 */
export function AgentOrb({ state, size = 30 }: { state: "idle" | "thinking" | "writing" | "waiting" | "done"; size?: number }) {
  return (
    <span className="relative inline-grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <span
        className={`absolute inset-0 rounded-full demo-orb ${state === "thinking" || state === "writing" ? "demo-orb-active" : ""}`}
      />
      {state === "writing" || state === "thinking" ? (
        <span className="absolute -inset-1.5 rounded-full border border-gl-data/30 demo-orb-halo" />
      ) : null}
      <span className="relative grid place-items-center rounded-full bg-[oklch(0.16_0.03_264)]" style={{ width: size - 8, height: size - 8 }}>
        {state === "done" ? (
          <Check className="h-3 w-3 text-[var(--success)]" />
        ) : (
          <Sparkle className={`h-3 w-3 ${state === "waiting" ? "text-gl-gold" : "text-gl-data"}`} />
        )}
      </span>
    </span>
  );
}

/** A button the simulated cursor can hover and press. */
export function DemoButton({
  id,
  children,
  tone = "gold",
  hover = false,
  pressed = false,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  tone?: "gold" | "ghost" | "data" | "success";
  hover?: boolean;
  pressed?: boolean;
  className?: string;
}) {
  const tones = {
    gold: "bg-gl-gold text-gl-background",
    data: "bg-gl-data text-gl-background",
    success: "bg-[var(--success)] text-gl-background",
    ghost: "border border-gl-border text-gl-foreground",
  };
  return (
    <span
      data-cursor={id}
      className={`relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-md px-3 py-1.5 text-[0.66rem] font-medium transition-all duration-200 ${tones[tone]} ${
        hover ? "brightness-110 shadow-[0_0_0_4px_oklch(0.77_0.155_66/20%),0_8px_24px_-8px_oklch(0.77_0.155_66/60%)]" : ""
      } ${pressed ? "scale-[0.96]" : ""} ${className}`}
    >
      {children}
    </span>
  );
}

/** Bottom-right notification. */
export function Toast({ show, title, body, className = "bottom-5 right-5" }: { show: boolean; title: string; body: string; className?: string }) {
  return (
    <div
      className={`absolute ${className} z-40 w-[290px] rounded-xl border border-[oklch(0.78_0.13_168/35%)] bg-[oklch(0.17_0.03_262/96%)] p-3.5 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.7)] backdrop-blur transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[oklch(0.78_0.13_168/16%)] text-[var(--success)]">
          <Check className="h-3 w-3" />
        </span>
        <div>
          <p className="text-[0.7rem] font-medium text-gl-foreground">{title}</p>
          <p className="mt-0.5 text-[0.62rem] leading-snug text-gl-muted-foreground">{body}</p>
        </div>
      </div>
    </div>
  );
}

/** Chip for a connected system. */
export function SystemChip({ code, tone = "data" }: { code: string; tone?: "data" | "gold" | "success" | "muted" }) {
  const map = {
    data: "bg-gl-data/12 text-gl-data",
    gold: "bg-gl-gold/12 text-gl-gold",
    success: "bg-[oklch(0.78_0.13_168/12%)] text-[var(--success)]",
    muted: "bg-gl-foreground/6 text-gl-muted-foreground",
  };
  return (
    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-md font-gl-mono text-[0.5rem] font-medium tracking-wide ${map[tone]}`}>
      {code}
    </span>
  );
}
