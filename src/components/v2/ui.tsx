import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { ComponentProps } from "react";

type Tone = "white" | "navy" | "ghost-dark" | "ghost-light";

const tones: Record<Tone, string> = {
  white: "bg-white text-navy hover:bg-cloud-3",
  navy: "bg-navy text-white hover:bg-navy-700",
  "ghost-dark": "text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.28)] hover:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.7)]",
  "ghost-light": "text-navy shadow-[inset_0_0_0_1px_rgb(16_20_64/0.25)] hover:shadow-[inset_0_0_0_1px_rgb(16_20_64/0.7)]",
};

/**
 * Primary control. The top-right corner is cut at 45 degrees, the same chamfer the
 * Genius Lab wordmark uses on its letterforms.
 */
export function CutButton({
  tone = "white",
  size = "md",
  children,
  className = "",
  ...rest
}: ComponentProps<"a"> & { tone?: Tone; size?: "md" | "lg" }) {
  const sizing = size === "lg" ? "h-14 pl-7 pr-6 text-base gap-6" : "h-11 pl-5 pr-4 text-[0.9375rem] gap-4";
  return (
    <a
      {...rest}
      className={`press group inline-flex shrink-0 items-center justify-between whitespace-nowrap font-medium [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,0_100%)] ${sizing} ${tones[tone]} ${className}`}
    >
      <span>{children}</span>
      <ArrowRight
        size={16}
        weight="bold"
        aria-hidden="true"
        className="transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-1"
      />
    </a>
  );
}

/** Official wordmark. White on navy grounds, navy on light grounds. */
export function BrandLogo({ tone, className = "h-[18px] w-auto" }: { tone: "white" | "navy"; className?: string }) {
  return tone === "white" ? (
    <Image src="/brand/logo_white.png" alt="Genius Lab" width={1920} height={235} priority className={className} />
  ) : (
    <Image src="/brand/logo_dark_blue.png" alt="Genius Lab" width={1920} height={231} priority className={className} />
  );
}

/** Section headline sizes shared across Version 2. */
export const h2Class = "type-display text-[clamp(2.25rem,4.4vw,4.25rem)] [font-variation-settings:'wdth'_112] leading-[1.02]";
