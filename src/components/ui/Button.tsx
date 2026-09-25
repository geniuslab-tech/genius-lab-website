import { ArrowUpRight, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { ComponentProps } from "react";

type Variant = "primary" | "survey" | "ghost" | "inverse";

const styles: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-survey",
  survey: "bg-survey text-on-survey hover:bg-ink",
  inverse: "bg-on-survey text-survey-deep hover:bg-paper hover:text-ink",
  ghost: "text-ink border border-rule-strong hover:border-ink",
};

/** Square survey-ink button. The arrow slides on hover to confirm direction of travel. */
export function Button({
  variant = "primary",
  children,
  className = "",
  external = false,
  size = "md",
  ...rest
}: ComponentProps<"a"> & { variant?: Variant; external?: boolean; size?: "md" | "lg" }) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  const sizing = size === "lg" ? "h-16 px-7 text-[1.0625rem] gap-5" : "h-12 px-5 text-[0.9375rem] gap-4";
  return (
    <a
      {...rest}
      className={`press group inline-flex shrink-0 items-center justify-between whitespace-nowrap font-medium ${sizing} ${styles[variant]} ${className}`}
    >
      <span>{children}</span>
      <span className="relative inline-flex h-4 w-4 overflow-hidden" aria-hidden="true">
        <Icon
          size={16}
          weight="bold"
          className="absolute inset-0 transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-4"
        />
        <Icon
          size={16}
          weight="bold"
          className="absolute inset-0 -translate-x-4 transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-0"
        />
      </span>
    </a>
  );
}

export function TextLink({ children, className = "", ...rest }: ComponentProps<"a">) {
  return (
    <a
      {...rest}
      className={`group inline-flex items-center gap-2 font-medium underline decoration-rule-strong decoration-1 underline-offset-[6px] transition-colors hover:decoration-survey ${className}`}
    >
      {children}
      <ArrowRight
        size={14}
        weight="bold"
        aria-hidden="true"
        className="transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-1"
      />
    </a>
  );
}
