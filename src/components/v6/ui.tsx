import type { ComponentProps, ReactNode } from "react";

export const h2v6 = "v6-display text-[clamp(2.25rem,4.2vw,3.75rem)]";

type Tone = "ember" | "outline-dark" | "outline-light" | "steel";

const tones: Record<Tone, string> = {
  ember: "bg-ember text-[#1a1205] hover:bg-[#ffab3a] shadow-[0_10px_30px_-12px_rgb(242_154_31/0.7)]",
  "outline-dark": "text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.28)] hover:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.7)] hover:bg-white/[0.04]",
  "outline-light": "text-steel bg-white shadow-[inset_0_0_0_1px_var(--color-rule6)] hover:shadow-[inset_0_0_0_1px_var(--color-steel-3)]",
  steel: "bg-steel text-white hover:bg-abyss-4",
};

/** Controls: small radius, medium weight, one accent. */
export function Button({ tone = "ember", size = "md", className = "", ...rest }: ComponentProps<"a"> & { tone?: Tone; size?: "sm" | "md" | "lg" }) {
  const sizing = { sm: "h-9 px-4 text-[0.875rem]", md: "h-11 px-5 text-[0.9375rem]", lg: "h-14 px-6 text-base" }[size];
  return (
    <a
      {...rest}
      className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[6px] font-semibold tracking-[-0.01em] transition-[background-color,box-shadow,transform] duration-200 active:scale-[0.98] ${sizing} ${tones[tone]} ${className}`}
    />
  );
}

/** Section opener: a short coloured rule, a mono label, the headline and its lead. */
export function Intro({
  label,
  title,
  lead,
  id,
  dark = false,
  accent = "sky",
  className = "",
}: {
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  id: string;
  dark?: boolean;
  accent?: "sky" | "ember";
  className?: string;
}) {
  return (
    <div className={className}>
      <span className={`block h-[2px] w-10 ${accent === "ember" ? "bg-ember" : "bg-sky"}`} aria-hidden="true" />
      <p className={`v6-label mt-5 ${dark ? "text-white/50" : "text-steel-3"}`}>{label}</p>
      <h2 id={id} data-reveal="up" className={`${h2v6} mt-4 max-w-[18ch] ${dark ? "text-white" : "text-steel"}`}>
        {title}
      </h2>
      {lead && (
        <p data-reveal="up" data-delay="100" className={`text-pretty mt-6 max-w-[56ch] text-[1.0625rem] leading-[1.7] ${dark ? "text-white/65" : "text-steel-2"}`}>
          {lead}
        </p>
      )}
    </div>
  );
}

/** Status chip used across the console surfaces. */
export function Status({ tone, children }: { tone: "ok" | "track" | "warn"; children: ReactNode }) {
  const c = {
    ok: "text-sky border-sky/40 bg-sky/10",
    track: "text-white/60 border-white/15 bg-white/[0.04]",
    warn: "text-ember border-ember/50 bg-ember/10",
  }[tone];
  return (
    <span className={`inline-flex h-5 items-center gap-1.5 rounded-[3px] border px-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.12em] ${c}`}>
      <span className="h-1 w-1 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  );
}
