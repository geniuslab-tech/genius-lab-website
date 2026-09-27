export type Theme = "dark" | "light";

/**
 * The story in ten chapters. Themes alternate so every chapter boundary is an inversion:
 * complexity (navy) resolving into clarity (paper), ending on paper.
 */
export const CHAPTERS: { id: string; title: string; caption: string; theme: Theme }[] = [
  { id: "top", title: "Complexity", caption: "Scattered systems", theme: "dark" },
  { id: "problem", title: "Cost of growth", caption: "Tangled handoffs", theme: "light" },
  { id: "layers", title: "Four layers", caption: "Each builds on the last", theme: "dark" },
  { id: "brain", title: "Second Brain", caption: "A network of context", theme: "light" },
  { id: "agents", title: "AI Agents", caption: "Agents in orbit", theme: "dark" },
  { id: "ontology", title: "Ontology", caption: "One shared model", theme: "light" },
  { id: "platform", title: "Genius Portal", caption: "One platform", theme: "dark" },
  { id: "solutions", title: "Solutions", caption: "Four starting points", theme: "light" },
  { id: "action", title: "In action", caption: "From noise to signal", theme: "dark" },
  { id: "contact", title: "Clarity", caption: "One source of truth", theme: "light" },
];

/**
 * Slope of the diagonal seam between chapters: it drops 12px for every 100px of width.
 * The CSS uses the same ratio (`--drop: 12cqw` across the content column), so the seam drawn by
 * the scrolling sections and the seam computed for the sticky panel and header line up exactly.
 */
export const SLOPE = 0.12;
export const SLOPE_ANGLE = Math.atan(SLOPE);

export const pad2 = (n: number) => String(n).padStart(2, "0");
