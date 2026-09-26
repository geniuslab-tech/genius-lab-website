import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import type { ComponentProps, ReactNode } from "react";

/** Section headline sizes for Version 5. */
export const h2v5 = "v5-display text-[clamp(2.5rem,5.4vw,4.5rem)]";
export const leadV5 = "v5-body text-pretty text-[clamp(1.1875rem,1.6vw,1.5rem)] font-medium";

/** Primary control: a quiet pill in the accent blue. */
export function Pill({ tone = "blue", size = "md", className = "", ...rest }: ComponentProps<"a"> & { tone?: "blue" | "dark" | "light"; size?: "md" | "lg" }) {
  const tones = {
    blue: "bg-azure text-white hover:bg-[#0077ed]",
    dark: "bg-graphite text-white hover:bg-black",
    light: "bg-white text-graphite hover:bg-white/90",
  };
  const sizing = size === "lg" ? "h-12 px-6 text-[1.0625rem]" : "h-9 px-4 text-[0.875rem]";
  return (
    <a
      {...rest}
      className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full font-normal tracking-[-0.01em] transition-[background-color,transform] duration-200 active:scale-[0.97] ${sizing} ${tones[tone]} ${className}`}
    />
  );
}

/** Secondary action: text with a chevron, the way Apple writes "Learn more ›". */
export function More({ children, className = "", dark = false, ...rest }: ComponentProps<"a"> & { dark?: boolean }) {
  return (
    <a
      {...rest}
      className={`group inline-flex items-center gap-1 text-[1.0625rem] tracking-[-0.01em] hover:underline ${dark ? "text-[#2997ff]" : "text-azure-link"} ${className}`}
    >
      {children}
      <CaretRight size={14} weight="bold" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
    </a>
  );
}

/** Centered section heading: eyebrow, headline, lead. */
export function Heading({
  eyebrow,
  title,
  lead,
  id,
  dark = false,
  align = "center",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  id: string;
  dark?: boolean;
  align?: "center" | "left";
  className?: string;
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-[56rem] ${className}`}>
      {eyebrow && (
        <p data-reveal="up" className={`v5-eyebrow text-[1.1875rem] ${dark ? "text-[#a1a1a6]" : "text-graphite-2"}`}>
          {eyebrow}
        </p>
      )}
      <h2 id={id} data-reveal="up" data-delay="60" className={`${h2v5} mt-3 ${center ? "mx-auto" : ""} max-w-[18ch] ${dark ? "text-white" : "text-graphite"}`}>
        {title}
      </h2>
      {lead && (
        <p data-reveal="up" data-delay="120" className={`${leadV5} mt-6 ${center ? "mx-auto" : ""} max-w-[40ch] ${dark ? "text-[#a1a1a6]" : "text-graphite-2"}`}>
          {lead}
        </p>
      )}
    </div>
  );
}
