import type { CSSProperties } from "react";

/** A ticker band between sections. The second copy is decorative and hidden from assistive tech. */
export function Marquee14({
  items,
  tone = "k",
  reverse = false,
  seconds = 40,
  label,
}: {
  items: string[];
  tone?: "k" | "u" | "w";
  reverse?: boolean;
  seconds?: number;
  label?: string;
}) {
  const ground = tone === "k" ? "bg-black text-white" : tone === "u" ? "bg-[#1f3bff] text-white" : "bg-white text-black";
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <li key={i} className="flex items-center">
          <span className="v14-head whitespace-nowrap px-5 text-[clamp(1.75rem,3.6vw,3.25rem)] leading-none">{t}</span>
          <span className="inline-block h-3 w-3 bg-current" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`flex overflow-hidden border-b-2 border-black ${ground}`}>
      {label ? (
        <p className="v14-mono relative z-10 flex shrink-0 items-center gap-2 border-r-2 border-current bg-inherit px-4 py-3 max-sm:hidden">
          <span className="v14-blink inline-block h-2 w-2 bg-current" aria-hidden="true" />
          {label}
        </p>
      ) : null}
      <div className="min-w-0 flex-1 overflow-hidden py-4">
        <div className="v14-marquee" data-reverse={reverse ? "" : undefined} style={{ "--dur": `${seconds}s` } as CSSProperties}>
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  );
}
