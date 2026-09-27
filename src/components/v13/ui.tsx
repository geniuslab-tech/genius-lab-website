import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { ComponentProps, ReactNode } from "react";
import { CHAPTERS, pad2 } from "./data";
import { MobileVisual } from "./MobileVisual";

/**
 * Chamfered action. Colours come from the surrounding theme, so the same button inverts with
 * its chapter: solid is ink on paper in light chapters and paper on ink in dark ones.
 */
export function Btn({
  tone = "solid",
  children,
  className = "",
  ...rest
}: ComponentProps<"a"> & { tone?: "solid" | "line" }) {
  return (
    <a {...rest} className={`v13-btn ${tone === "solid" ? "v13-btn-solid" : "v13-btn-line"} group ${className}`}>
      <span>{children}</span>
      <ArrowRight size={16} weight="bold" aria-hidden="true" className="v13-btn-arrow" />
    </a>
  );
}

export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`v13-label ${className}`}>{children}</p>;
}

export const h2Class = "v13-display text-[clamp(2.25rem,5.2cqw,4rem)]";

/**
 * One chapter of the scrolling column. From the second chapter on, the top edge is cut on the
 * diagonal and overlaps the chapter above, so scrolling sweeps the new theme in on a slant.
 */
export function Chapter({
  index,
  labelledBy,
  children,
  visualAfter = false,
}: {
  index: number;
  labelledBy: string;
  children: ReactNode;
  visualAfter?: boolean;
}) {
  const ch = CHAPTERS[index];
  const mobileHead = (
    <div className={`lg:hidden ${visualAfter ? "mt-16" : "mb-12"}`} aria-hidden="true">
      <div className="v13-label flex items-baseline justify-between gap-4">
        <span>
          <span className="v13-accent">{pad2(index + 1)}</span> / {pad2(CHAPTERS.length)} · {ch.title}
        </span>
        <span className="text-right">{ch.caption}</span>
      </div>
      <MobileVisual state={index} />
    </div>
  );
  return (
    <section
      id={ch.id}
      data-v13-chapter={index}
      data-theme={ch.theme}
      aria-labelledby={labelledBy}
      className={`v13-ch ${index === 0 ? "v13-ch-first" : ""} ${index === CHAPTERS.length - 1 ? "v13-ch-last" : ""}`}
      style={{ zIndex: index + 1 }}
    >
      {index > 0 && (
        <svg className="v13-seam" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <line x1="0" y1="0" x2="100" y2="100" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      {!visualAfter && mobileHead}
      <div className="v13-ch-body">{children}</div>
      {visualAfter && mobileHead}
    </section>
  );
}
