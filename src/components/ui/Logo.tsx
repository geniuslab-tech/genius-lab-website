/** Genius Lab mark: three nested contour rings climbing to an off-centre summit point. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" className={className}>
      <ellipse cx="14" cy="14.5" rx="12.5" ry="11.5" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="15.6" cy="12.6" rx="8" ry="7.2" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="17" cy="11" rx="3.6" ry="3.2" className="fill-survey" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <a href="#" className={`inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap ${className}`} aria-label="Genius Lab Technology, home">
      <LogoMark className="h-7 w-7" />
      <span className="type-wide text-[1.0625rem] font-semibold leading-none">
        Genius Lab
      </span>
    </a>
  );
}
