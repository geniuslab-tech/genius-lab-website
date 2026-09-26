/** Switch between the compared homepage versions. Rendered in every header. */
export function VersionSwitch({
  current,
  tone = "light",
  className = "",
}: {
  current: 1 | 2 | 3 | 4 | 5 | 6;
  tone?: "light" | "dark" | "soft";
  className?: string;
}) {
  const soft = tone === "soft";
  const frame = soft ? "rounded-full bg-black/[0.05] p-0.5" : tone === "dark" ? "border border-white/25" : "border border-rule-strong bg-paper";
  const idle = soft ? "text-graphite-2 hover:text-graphite" : tone === "dark" ? "text-white/65 hover:text-white" : "text-ink-2 hover:text-ink";
  const on = soft ? "bg-white text-graphite shadow-[0_1px_3px_rgb(0_0_0/0.12)]" : tone === "dark" ? "bg-white text-navy" : "bg-ink text-paper";
  const item = soft ? "w-9 rounded-full text-[0.75rem] font-medium" : "type-mono w-11 text-[0.75rem]";
  return (
    <nav aria-label="Homepage version" className={`inline-flex ${soft ? "h-8" : "h-9"} ${frame} ${className}`}>
      {([1, 2, 3, 4, 5, 6] as const).map((v) => (
        <a
          key={v}
          href={v === 1 ? "/" : `/v${v}`}
          aria-current={current === v ? "page" : undefined}
          className={`inline-flex items-center justify-center transition-colors duration-200 ${item} ${current === v ? on : idle}`}
        >
          V{v}
        </a>
      ))}
    </nav>
  );
}
