import type { CSSProperties } from "react";

/** Page container shared by every section. Plain values, safe to use from server components. */
export const wrap = "mx-auto w-full max-w-[1240px] px-4 sm:px-8";

/** CSS custom property helper for reveal delays. */
export const rd = (ms: number) => ({ "--rd": `${ms}ms` }) as CSSProperties;
