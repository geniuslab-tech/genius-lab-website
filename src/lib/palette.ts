/** Canvas-side mirror of the CSS tokens in globals.css (sRGB of the oklch values). */
export const RGB = {
  paper: "241,244,246",
  paper2: "230,234,237",
  ink: "13,17,23",
  ink2: "62,67,74",
  ink3: "95,100,106",
  survey: "26,58,221",
  surveyDeep: "16,35,180",
  onSurvey: "244,246,255",
  onSurvey2: "191,209,249",
} as const;

export const rgba = (rgb: string, a: number) => `rgba(${rgb},${a})`;
