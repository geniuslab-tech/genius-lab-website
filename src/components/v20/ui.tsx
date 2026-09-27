import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import type { ComponentProps, CSSProperties, ReactNode } from "react";

export type Tone = "white" | "mist" | "black" | "navy";

/** Primary control: a pill in the brand blue. `ghost` is a hairline pill, `invert` is ink on the ground. */
export function Pill({
  kind = "solid",
  size = "md",
  className = "",
  ...rest
}: ComponentProps<"a"> & { kind?: "solid" | "ghost" | "invert"; size?: "md" | "sm" }) {
  const k = kind === "ghost" ? "v20-pill-ghost" : kind === "invert" ? "v20-pill-invert" : "";
  return <a {...rest} className={`v20-pill ${k} ${size === "sm" ? "v20-pill-sm" : ""} ${className}`} />;
}

/** Secondary action: text with a chevron. */
export function More({ children, className = "", ...rest }: ComponentProps<"a">) {
  return (
    <a {...rest} className={`v20-more ${className}`}>
      {children}
      <CaretRight size={14} weight="bold" aria-hidden="true" />
    </a>
  );
}

/** Reveal-on-scroll hook point. Visible by default; hidden only after the page arms reveals. */
export function R({
  as: Tag = "div",
  delay = 0,
  className = "",
  style,
  children,
  id,
}: {
  as?: "div" | "p" | "li" | "h2" | "h3" | "figure";
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  id?: string;
}) {
  return (
    <Tag id={id} data-v20-r="" className={className} style={{ ...style, ["--d" as string]: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

/** Centred section heading: eyebrow, headline, lead. */
export function Heading({
  eyebrow,
  title,
  lead,
  id,
  className = "",
  width = "18ch",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  id: string;
  className?: string;
  width?: string;
}) {
  return (
    <div className={`mx-auto max-w-[60rem] text-center ${className}`}>
      {eyebrow && (
        <R as="p" className="v20-eyebrow">
          {eyebrow}
        </R>
      )}
      <R as="h2" delay={60} id={id} className="v20-display v20-h2 mx-auto mt-3" style={{ maxWidth: width }}>
        {title}
      </R>
      {lead && (
        <R as="p" delay={120} className="v20-lead mx-auto mt-6 max-w-[42ch]">
          {lead}
        </R>
      )}
    </div>
  );
}

/** Spec-page footnote. */
export function Note({ n, children, className = "" }: { n?: number; children: ReactNode; className?: string }) {
  return (
    <p className={`v20-note ${className}`}>
      {n !== undefined && <sup>{n}</sup>}
      {children}
    </p>
  );
}
