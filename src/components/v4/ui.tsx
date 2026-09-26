import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { ComponentProps, ReactNode } from "react";

/** Section headline for Version 4: expanded Archivo, tight, white. */
export const h2v4 = "type-display text-[clamp(2.25rem,4.6vw,4.5rem)] leading-[0.98] text-white [font-variation-settings:'wdth'_118]";

/** Console-style section index: `[03] // SECOND BRAIN`, with a live tick. */
export function SectionTag({ n, children, className = "" }: { n: string; children: ReactNode; className?: string }) {
  return (
    <p className={`v4-label flex items-center gap-3 text-white/55 ${className}`}>
      <span className="text-cyan">[{n}]</span>
      <span className="text-white/25">{"//"}</span>
      <span>{children}</span>
      <span className="h-px w-12 bg-gradient-to-r from-white/30 to-transparent" aria-hidden="true" />
    </p>
  );
}

/** Hairline frame with registration marks on each corner, like a viewfinder. */
export function Frame({ children, className = "", as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "figure" | "li" }) {
  return (
    <Tag className={`relative border border-line ${className}`}>
      {["-left-px -top-px border-l border-t", "-right-px -top-px border-r border-t", "-bottom-px -left-px border-b border-l", "-bottom-px -right-px border-b border-r"].map((c) => (
        <span key={c} className={`pointer-events-none absolute h-3 w-3 border-white/60 ${c}`} aria-hidden="true" />
      ))}
      {children}
    </Tag>
  );
}

type Tone = "primary" | "ghost" | "light";

const tones: Record<Tone, string> = {
  primary: "bg-signal text-white hover:bg-[#6d8bff] shadow-[0_0_40px_-8px_rgb(85_119_255/0.8)]",
  light: "bg-white text-void hover:bg-cyan",
  ghost: "text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.22)] hover:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.7)] hover:bg-white/[0.04]",
};

/** Primary control: mono label, two chamfered corners. */
export function TechButton({ tone = "primary", size = "md", children, className = "", ...rest }: ComponentProps<"a"> & { tone?: Tone; size?: "md" | "lg" }) {
  const sizing = size === "lg" ? "h-14 pl-6 pr-5 gap-6 text-[0.8125rem]" : "h-10 pl-4 pr-3.5 gap-4 text-[0.75rem]";
  return (
    <a
      {...rest}
      className={`press group inline-flex shrink-0 items-center justify-between whitespace-nowrap font-mono uppercase tracking-[0.08em] [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)] ${sizing} ${tones[tone]} ${className}`}
    >
      <span>{children}</span>
      <ArrowRight size={14} weight="bold" aria-hidden="true" className="transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-1" />
    </a>
  );
}

/** A small status light. */
export function Pulse({ className = "bg-cyan" }: { className?: string }) {
  return (
    <span className="relative inline-flex h-2 w-2" aria-hidden="true">
      <span className={`absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping ${className}`} />
      <span className={`relative h-2 w-2 rounded-full ${className}`} />
    </span>
  );
}
