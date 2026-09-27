/** Section index shared by the palette, the status bar shortcuts and the top bar. */
export const SECTIONS = [
  { id: "problem", key: "1", label: "Complexity", path: "problem" },
  { id: "layers", key: "2", label: "Platform", path: "platform" },
  { id: "brain", key: "3", label: "Second Brain", path: "second-brain" },
  { id: "agents", key: "4", label: "AI Agents", path: "agents" },
  { id: "ontology", key: "5", label: "Ontology", path: "ontology" },
  { id: "portal", key: "6", label: "Genius Portal", path: "portal" },
  { id: "managed", key: "7", label: "Managed service", path: "managed" },
  { id: "segments", key: "8", label: "Solutions", path: "solutions" },
  { id: "action", key: "9", label: "In action", path: "film" },
  { id: "contact", key: "0", label: "Contact", path: "contact" },
] as const;

export const EXTRA_SECTIONS = [{ id: "clients", label: "Clients", path: "clients" }] as const;

export const LAYERS = [
  {
    n: "01",
    slug: "data-engineering",
    name: "Data Engineering",
    l1: "DATA",
    l2: "ENGINEERING",
    short: "foundation",
    role: "The foundation.",
    body: "We connect your systems and engineer their data into one governed, reliable foundation: integration, pipelines, modeling and quality.",
    gives: ["Connected systems", "A unified data platform", "Trusted, tested pipelines"],
  },
  {
    n: "02",
    slug: "analytics",
    name: "Analytics",
    l1: "ANALYTICS",
    l2: "",
    short: "understanding",
    role: "Organized data becomes understanding.",
    body: "Analysis and modeling explain what is happening, why it is happening and what is likely to happen next.",
    gives: ["Performance analysis", "Forecasts and drivers", "Customer and operational insight"],
  },
  {
    n: "03",
    slug: "business-intelligence",
    name: "Business Intelligence",
    l1: "BUSINESS",
    l2: "INTELLIGENCE",
    short: "visibility",
    role: "Understanding becomes visible.",
    body: "One set of definitions behind every dashboard and report, so leadership sees the same numbers, at the same time.",
    gives: ["Executive dashboards", "Shared metrics and KPIs", "Self-service reporting"],
  },
  {
    n: "04",
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    l1: "ARTIFICIAL",
    l2: "INTELLIGENCE",
    short: "reasoning",
    role: "Visibility gains context and reasoning.",
    body: "AI learns your business context and becomes its Second Brain. AI Agents reason across systems, tables, metrics and processes to answer and act.",
    gives: ["Second Brain", "AI Agents", "Orchestrated execution"],
  },
] as const;

export const OUTCOME = {
  name: "Better business decisions",
  body: "Each layer builds on the one beneath it. Together they give executives clear insight, full visibility and the confidence to act.",
};

export const CONTEXTS = [
  {
    file: "semantic.ctx",
    name: "Semantic Context",
    tagline: "What every number means.",
    body: "Shared definitions for metrics, tables and dashboards, so revenue means the same thing in every report.",
    holds: ["systems", "tables", "metrics"],
  },
  {
    file: "business.ctx",
    name: "Business Context",
    tagline: "How the company actually works.",
    body: "Customers, operations and finance, and the relationships that connect them.",
    holds: ["customers", "operations", "finance"],
  },
  {
    file: "event.ctx",
    name: "Event Context",
    tagline: "What is happening right now.",
    body: "Transactions, process steps and system events, captured as they occur.",
    holds: ["systems", "processes"],
  },
] as const;

/** Illustrative conversations with the Genius agent. Figures are not client data. */
export const SCRIPTS = [
  {
    q: "Why did our EBITDA margin drop in Q3, and what should we do about it?",
    reads: ["finance.gl_entries", "Q2 vs Q3 cost centres", "freight and discount drivers"],
    a: "EBITDA margin fell from 18.2% to 15.9%. Two drivers explain most of it: freight costs rose 14% after the July carrier change, and Northeast discounting added $1.1M in promotional spend. Renegotiating freight and capping regional discounts recovers about 1.8 points next quarter.",
  },
  {
    q: "What will our cash position look like over the next 90 days?",
    reads: ["ar.invoices, ap.schedule", "payment behaviour by customer", "weekly balance projection"],
    a: "Cash stays above the $4M floor, with a low of $4.6M in week 7 when the annual insurance premium and two supplier payments land together. Collecting the three overdue enterprise invoices early lifts that low point to $5.9M.",
  },
] as const;

export const AXES = [
  { slug: "data", name: "Data", role: "the facts", body: "Every system connected and reconciled into one set of trusted records." },
  { slug: "analytics", name: "Analytics", role: "the meaning", body: "Metrics and rules defined once, on the business objects themselves." },
  { slug: "ai", name: "AI", role: "the reasoning", body: "Agents that read the model, answer questions and act on what they find." },
  { slug: "people", name: "People", role: "the judgement", body: "Owners, roles and decisions: who is accountable, who approves, who acts." },
  {
    slug: "business-context",
    name: "Business Context",
    role: "the why",
    body: "Strategy, processes and rules of the business that give every number its purpose.",
  },
] as const;

export const MODULES = [
  { slug: "connectors", name: "Connectors", body: "Ready integrations for ERP, CRM, finance, files and APIs." },
  { slug: "transform", name: "Data Transformation", body: "Pipelines that clean, model and unify data, tested like software." },
  { slug: "analytics", name: "Analytics", body: "Dashboards, drill-downs and forecasts on one shared model." },
  { slug: "governance", name: "Governance", body: "Definitions, lineage, access and audit trails in one place." },
  { slug: "automation", name: "Automation", body: "Alerts, workflows and scheduled actions across your systems." },
  { slug: "agents", name: "AI Agents", body: "Agents that read the Second Brain and answer or act." },
] as const;

export const SYSTEMS = ["ERP", "CRM", "Warehouse", "BI tools", "Sheets", "Cloud apps"] as const;

export const STEPS = [
  { name: "Design", body: "We map your systems, data and decisions, and design the target architecture." },
  { name: "Build", body: "We connect, engineer, model and deploy every layer, on the Genius Portal." },
  { name: "Run", body: "We host, monitor and support it, with clear service levels." },
  { name: "Improve", body: "We keep extending metrics, dashboards and agents as the business changes." },
] as const;

export const INCLUDED = ["Implementation", "Hosting", "Monitoring", "Security", "Support", "Continuous improvement"] as const;

export const SEGMENTS = [
  {
    slug: "investment-firms",
    name: "Investment Firms",
    body: "One live view across every portfolio company, with value creation tracked against the plan.",
    outcomes: ["Portfolio monitoring", "Value creation plans", "Board-ready reporting"],
  },
  {
    slug: "m-and-a",
    name: "M&A Teams",
    body: "Diligence on real data, then integration that connects two companies' systems from day one.",
    outcomes: ["Data-driven diligence", "Day-one integration", "Synergy tracking"],
  },
  {
    slug: "multi-entity",
    name: "Multi-Entity Companies",
    body: "Every entity, currency and ledger consolidated into one trusted group picture.",
    outcomes: ["Automated consolidation", "Entity comparisons", "Group-wide KPIs"],
  },
  {
    slug: "operating",
    name: "Operating Companies",
    body: "Daily operations run on shared numbers, with agents that flag what needs attention.",
    outcomes: ["Operational dashboards", "Forecasting", "Proactive alerts"],
  },
] as const;

/** Placeholder quote slots, attributed by role only. To be replaced with approved client quotes. */
export const VOICES = [
  { q: "They didn't sell us another tool. They built on what we already had and ran it for us.", role: "COO, specialty retailer" },
  { q: "Our analysts spend their time on decisions now, not on reconciling reports.", role: "VP Finance, logistics company" },
  { q: "The Second Brain understands our definitions. When it says margin, it means our margin.", role: "CEO, distribution business" },
] as const;

/** Placeholder client marks, to be replaced with approved logos. */
export const LOGOS = ["Vanta Group", "Helios", "Caldera", "Orbis", "Stratum", "Northpeak"] as const;

/** Illustrative growth of what a company has to hold together, founding to enterprise. */
export const COUNTS = [
  { label: "systems", from: 3, to: 46 },
  { label: "reports", from: 8, to: 940 },
  { label: "manual handoffs", from: 2, to: 210 },
  { label: "people in a decision", from: 2, to: 19 },
] as const;

export const EVENTS = {
  palette: "v11:palette",
  run: "v11:run",
  film: "v11:film",
} as const;

/** Jump to a section, then hand it keyboard focus. */
export function jumpTo(id: string, reduce: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  el.focus({ preventScroll: true });
}
