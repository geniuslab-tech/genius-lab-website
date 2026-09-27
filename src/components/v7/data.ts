/** The five layers of the operating layer, foundation first. Every study in V7 draws this same list. */
export type Layer = {
  n: string;
  name: string;
  short: string;
  tags: string[];
  body: string;
};

export const LAYERS: Layer[] = [
  {
    n: "01",
    name: "Data foundation",
    short: "Foundation",
    tags: ["ERP", "CRM", "Finance", "MES", "WMS", "HRIS"],
    body: "Every system connected and engineered into one governed, reliable source of truth.",
  },
  {
    n: "02",
    name: "Business context",
    short: "Context",
    tags: ["Meetings", "Messages", "Email", "Decisions"],
    body: "The unstructured side of the company: what was said, agreed and decided.",
  },
  {
    n: "03",
    name: "Governance + security",
    short: "Governance",
    tags: ["Control", "Policy", "Trust"],
    body: "Access, lineage and policy applied once and enforced on every layer above.",
  },
  {
    n: "04",
    name: "Intelligence",
    short: "Intelligence",
    tags: ["Analytics", "Digital twin", "AI insights"],
    body: "Models and a live digital twin explain what is happening and what comes next.",
  },
  {
    n: "05",
    name: "Execution",
    short: "Execution",
    tags: ["Process automation", "AI agents"],
    body: "Agents and automations act on decisions, inside the rules set beneath them.",
  },
];

/** Top of the stack first, the way the reference reads. */
export const TOP_DOWN = [...LAYERS].reverse();

export const isTop = (l: Layer) => l.n === "05";

export const tagLine = (l: Layer) => l.tags.join(" · ");
