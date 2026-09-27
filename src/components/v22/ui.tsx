import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { hexPoints } from "@/lib/hex";

type Tone = "signal" | "navy" | "white" | "line-dark" | "line-light";

const tones: Record<Tone, string> = {
  signal: "bg-[var(--signal-ink)] text-white hover:bg-[#2442c4]",
  navy: "bg-[var(--navy)] text-white hover:bg-[var(--navy-7)]",
  white: "bg-white text-[var(--navy)] hover:bg-[var(--paper-2)]",
  "line-dark": "chb [--bd:rgb(255_255_255/0.3)] text-white hover:[--bd:rgb(255_255_255/0.75)]",
  "line-light": "chb [--bd:var(--rule-2)] text-[var(--navy)] hover:[--bd:var(--navy)]",
};

/** Primary control, cut on two corners like the wordmark. */
export function ChButton({
  tone = "signal",
  size = "md",
  children,
  className = "",
  ...rest
}: ComponentProps<"a"> & { tone?: Tone; size?: "sm" | "md" | "lg" }) {
  const sizing = { sm: "h-10 gap-3 pl-4 pr-3.5 text-[0.875rem]", md: "h-12 gap-4 pl-5 pr-4 text-[0.9375rem]", lg: "h-14 gap-5 pl-6 pr-5 text-base" }[size];
  const outlined = tone === "line-dark" || tone === "line-light";
  const inner = (
    <>
      <span>{children}</span>
      <ArrowRight size={15} weight="bold" aria-hidden="true" className="v22-arrow" />
    </>
  );
  if (outlined) {
    return (
      <a {...rest} className={`v22-btn group inline-flex shrink-0 font-semibold [--c:10px] ${tones[tone]} ${className}`}>
        <span className={`chi inline-flex w-full items-center justify-between whitespace-nowrap ${tone === "line-dark" ? "bg-[var(--navy)]" : "bg-white"} ${sizing}`}>{inner}</span>
      </a>
    );
  }
  return (
    <a {...rest} className={`v22-btn ch [--c:10px] group inline-flex shrink-0 items-center justify-between whitespace-nowrap font-semibold ${sizing} ${tones[tone]} ${className}`}>
      {inner}
    </a>
  );
}

/** Section index: a chamfered tick, the number, the name. */
export function Kicker({ n, children, dark = false }: { n: string; children: ReactNode; dark?: boolean }) {
  return (
    <p className={`v22-label flex items-center gap-3 ${dark ? "text-white/60" : "text-[var(--ink-3)]"}`}>
      <span className="ch h-3 w-5 bg-[var(--signal)] [--c:4px]" aria-hidden="true" />
      <span className={dark ? "text-[var(--signal-lt)]" : "text-[var(--signal-ink)]"}>{n}</span>
      <span className={`h-px w-6 ${dark ? "bg-white/25" : "bg-[var(--rule-2)]"}`} aria-hidden="true" />
      {children}
    </p>
  );
}

export const h2Class = "v22-display text-[clamp(2.1rem,4.4vw,4rem)]";

export function SectionHead({
  n,
  label,
  title,
  lead,
  id,
  dark = false,
  className = "",
  titleClass = "max-w-[16ch]",
}: {
  n: string;
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  id: string;
  dark?: boolean;
  className?: string;
  titleClass?: string;
}) {
  return (
    <div className={className}>
      <Kicker n={n} dark={dark}>
        {label}
      </Kicker>
      <h2 id={id} data-v22r="up" className={`${h2Class} mt-6 ${titleClass} ${dark ? "text-white" : "text-[var(--ink)]"}`}>
        {title}
      </h2>
      {lead && (
        <p data-v22r="up" style={{ "--rd": "100ms" } as CSSProperties} className={`text-pretty mt-6 max-w-[54ch] text-[1.0625rem] leading-[1.7] ${dark ? "text-white/70" : "text-[var(--ink-2)]"}`}>
          {lead}
        </p>
      )}
    </div>
  );
}

/** Tag for anything illustrative: figures, conversations, previews. */
export function Illustrative({ dark = false, children = "Illustrative" }: { dark?: boolean; children?: ReactNode }) {
  return (
    <span className={`v22-label inline-flex items-center gap-2 ${dark ? "text-white/55" : "text-[var(--ink-3)]"}`}>
      <svg width="9" height="10" viewBox="0 0 9 10" aria-hidden="true">
        <polygon points={hexPoints(4.5, 5, 4.4)} fill="none" stroke="currentColor" />
      </svg>
      {children}
    </span>
  );
}

/** Deterministic pseudo-random numbers, identical on server and client. */
export function seeded(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export const r1 = (v: number) => Math.round(v * 10) / 10;

/**
 * A connector routed on the hex grid's angles: one horizontal or vertical leg, then a
 * 30-degree leg into the target.
 */
export function hexRoute(sx: number, sy: number, ex: number, ey: number) {
  const dx = ex - sx;
  const dy = ey - sy;
  const h = Math.abs(dy) * Math.sqrt(3);
  if (h <= Math.abs(dx)) {
    const mx = ex - Math.sign(dx) * h;
    return `M${r1(sx)} ${r1(sy)}H${r1(mx)}L${r1(ex)} ${r1(ey)}`;
  }
  const my = ey - Math.sign(dy) * (Math.abs(dx) / Math.sqrt(3));
  return `M${r1(sx)} ${r1(sy)}V${r1(my)}L${r1(ex)} ${r1(ey)}`;
}

/** Chamfered rectangle as SVG points (top-left and bottom-right cut). */
export function chRect(x: number, y: number, w: number, h: number, c: number) {
  return [
    [x + c, y],
    [x + w, y],
    [x + w, y + h - c],
    [x + w - c, y + h],
    [x, y + h],
    [x, y + c],
  ]
    .map(([a, b]) => `${r1(a)},${r1(b)}`)
    .join(" ");
}
