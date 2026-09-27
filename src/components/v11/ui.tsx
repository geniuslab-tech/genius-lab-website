import type { CSSProperties, ReactNode } from "react";
import { Decode } from "./Decode";

/** A window: title bar with a box-drawn title, optional meta on the right, and a body. */
export function Pane({
  title,
  meta,
  children,
  className = "",
  bodyClass = "",
  boot = true,
  delay,
  as: Tag = "div",
  labelledBy,
}: {
  title: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClass?: string;
  boot?: boolean | "intro";
  delay?: number;
  as?: "div" | "article" | "figure" | "aside";
  labelledBy?: string;
}) {
  return (
    <Tag
      className={`v11-pane ${boot === "intro" ? "v11-intro" : ""} ${className}`}
      data-boot={boot === true ? "" : undefined}
      style={delay ? ({ "--d": `${delay}ms` } as CSSProperties) : undefined}
      aria-labelledby={labelledBy}
    >
      <div className="v11-pane-bar">
        <span className="v11-pane-title truncate">{title}</span>
        {meta && <span className="shrink-0 text-(--fg-3)">{meta}</span>}
      </div>
      <div className={bodyClass}>{children}</div>
    </Tag>
  );
}

/** Section opening: the command that "opens" it, the index, a decoding headline and an optional lead. */
export function SectionHead({
  index,
  cmd,
  title,
  id,
  lead,
  className = "",
}: {
  index: string;
  cmd: string;
  title: string;
  id: string;
  lead?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p data-boot="" className="v11-term flex flex-wrap items-baseline gap-x-3 text-[13px] text-(--fg-3)">
        <span className="text-(--amber-2)">[{index}]</span>
        <span>
          <span className="text-(--amber)">$</span> <span className="text-(--fg-2)">{cmd}</span>
        </span>
      </p>
      <Decode id={id} text={title} className="v11-display mt-5 max-w-[20ch] text-[clamp(1.85rem,4.2vw,3.25rem)] text-(--fg)" />
      {lead && (
        <p data-boot="" style={{ "--d": "120ms" } as CSSProperties} className="mt-6 max-w-[60ch] text-pretty text-[15.5px] leading-[1.75] text-(--fg-2)">
          {lead}
        </p>
      )}
    </div>
  );
}

/** A small uppercase tag, e.g. to label illustrative content. */
export function Tag({ children, tone = "dim" }: { children: ReactNode; tone?: "dim" | "amber" | "ice" }) {
  const c = tone === "amber" ? "border-(--amber-2) text-(--amber)" : tone === "ice" ? "border-(--ice)/40 text-(--ice)" : "border-(--rule-2) text-(--fg-2)";
  return <span className={`v11-label inline-flex items-center border px-1.5 py-0.5 text-[10.5px] ${c}`}>{children}</span>;
}

export function Dot({ tone = "amber", pulse = false }: { tone?: "amber" | "ice" | "dim" | "warn"; pulse?: boolean }) {
  const c = tone === "amber" ? "bg-(--amber)" : tone === "ice" ? "bg-(--ice)" : tone === "warn" ? "bg-(--warn)" : "bg-(--fg-3)";
  return <span className={`inline-block h-[7px] w-[7px] shrink-0 ${c} ${pulse ? "motion-safe:animate-pulse" : ""}`} aria-hidden="true" />;
}

export const WRAP = "mx-auto w-full max-w-[1280px] px-4 sm:px-8";
export const SECTION = "relative border-t border-(--rule) py-20 sm:py-28";
