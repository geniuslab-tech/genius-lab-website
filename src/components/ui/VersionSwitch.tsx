/** Two-state switch between the compared homepage versions. Rendered in both headers. */
export function VersionSwitch({
  current,
  tone = "light",
  className = "",
}: {
  current: 1 | 2;
  tone?: "light" | "dark";
  className?: string;
}) {
  const frame = tone === "dark" ? "border-white/25" : "border-rule-strong bg-paper";
  const idle = tone === "dark" ? "text-white/65 hover:text-white" : "text-ink-2 hover:text-ink";
  const on = tone === "dark" ? "bg-white text-navy" : "bg-ink text-paper";
  return (
    <nav aria-label="Homepage version" className={`inline-flex h-9 border ${frame} ${className}`}>
      {([1, 2] as const).map((v) => (
        <a
          key={v}
          href={v === 1 ? "/" : "/v2"}
          aria-current={current === v ? "page" : undefined}
          className={`type-mono inline-flex w-11 items-center justify-center text-[0.75rem] transition-colors duration-200 ${
            current === v ? on : idle
          }`}
        >
          V{v}
        </a>
      ))}
    </nav>
  );
}
