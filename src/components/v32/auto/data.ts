import type { Segment } from "@/components/hero-demo/screens";

/* ------------------------------------------------------------------ *
 * Storyboard — one autoplaying loop, six beats
 *  01 Fragmented  Thirty systems of record, each with its own cadence and its own truth.
 *  02 Entities    The systems fly into four business units; asked for group revenue,
 *                 they return four different numbers.
 *  03 Harmonized  Every entity streams into the Genius Lab Data Manager and climbs
 *                 raw → bronze → silver → gold. Revenue reconciles to one number.
 *  04 Decide      The Data Manager folds into a gold node; dashboards build themselves
 *                 from it. The CFO selects free cash flow.
 *  05 Brief       She asks why cash lags revenue; Genius writes the brief.
 *  06 Act         Three executive agents propose moves; she approves each one and the
 *                 results write back into the systems of record.
 * ------------------------------------------------------------------ */

export const CUES = {
  boot: 0,
  s1: 300,
  s1Chips: 2400,
  s2: 7000,
  s2Land: 9300,
  s2Ask: 9900,
  s2Ans: 11000,
  s2Clash: 12400,
  s3: 15000,
  raw: 16200,
  bronze: 18100,
  silver: 20000,
  gold: 21900,
  s3Done: 23700,
  s4: 26000,
  w1: 27000,
  w2: 27900,
  w3: 28800,
  w4: 29700,
  w5: 30600,
  toKpi: 32400,
  pressKpi: 33400,
  kpiSel: 33650,
  s5: 35400,
  toAsk: 36200,
  pressAsk: 37100,
  type: 37350,
  toSend: 40000,
  pressSend: 40700,
  asked: 40950,
  think: 41050,
  write: 42300,
  facts: 45600,
  toAct: 46500,
  pressAct: 47400,
  s6: 47700,
  c1: 48100,
  c2: 48350,
  c3: 48600,
  toA1: 49800,
  pressA1: 50700,
  ok1: 50950,
  toA2: 52000,
  pressA2: 52800,
  ok2: 53050,
  toA3: 54100,
  pressA3: 54900,
  ok3: 55150,
  writeback: 56000,
  toast: 57000,
  exit: 61200,
} as const;
export const LOOP = 62400;

export type CueName = keyof typeof CUES;

/** where each step begins, and the cue a reduced-motion visitor is shown for it */
export const STEPS: { cue: CueName; still: CueName; index: string; title: string; lede: string; body: string }[] = [
  {
    cue: "boot",
    still: "s1Chips",
    index: "01",
    title: "Fragmented",
    lede: "Thirty systems. No shared truth.",
    body: "ERP, CRM, MES, HRIS, commerce and cloud platforms, each with its own model, its own cadence and its own version of the numbers.",
  },
  {
    cue: "s2",
    still: "s2Clash",
    index: "02",
    title: "Entities",
    lede: "Every entity runs a different stack.",
    body: "Business units acquired over a decade never converged. Ask for group revenue and four teams return four numbers.",
  },
  {
    cue: "s3",
    still: "s3Done",
    index: "03",
    title: "Harmonized",
    lede: "One Data Manager. One definition.",
    body: "Every entity lands in the Genius Lab Data Manager and climbs raw, bronze, silver and gold: captured, typed, cleansed and reconciled once.",
  },
  {
    cue: "s4",
    still: "kpiSel",
    index: "04",
    title: "Decide",
    lede: "Dashboards that build themselves from gold.",
    body: "Governed KPIs flow straight into the executive operating system. No reconciliation, no spreadsheet detour, no debate about whose number is right.",
  },
  {
    cue: "s5",
    still: "facts",
    index: "05",
    title: "Brief",
    lede: "Ask a question. Get the brief.",
    body: "Genius reads the gold layer and answers in plain language: what moved, why it moved and what it is worth.",
  },
  {
    cue: "s6",
    still: "toast",
    index: "06",
    title: "Act",
    lede: "Agents propose. You approve.",
    body: "Executive agents turn the brief into owned, dated moves. You approve them, and the results write back to the systems of record.",
  },
];

/** the stage is designed at this size and scaled to its column */
export const W = 1200;
export const H = 760;

/* ---------- 01 systems ---------- */
export type Sys = { domain: string; name: string; cadence: string };
export const CATEGORIES: { label: string; systems: Sys[] }[] = [
  {
    label: "ERP",
    systems: [
      { domain: "sap.com", name: "SAP S/4HANA", cadence: "nightly batch" },
      { domain: "netsuite.com", name: "NetSuite", cadence: "API · 15 min" },
      { domain: "epicor.com", name: "Epicor", cadence: "CSV export" },
      { domain: "qad.com", name: "QAD", cadence: "weekly" },
      { domain: "microsoft.com", name: "Dynamics 365", cadence: "nightly batch" },
    ],
  },
  {
    label: "CRM",
    systems: [
      { domain: "salesforce.com", name: "Salesforce", cadence: "API · live" },
      { domain: "hubspot.com", name: "HubSpot", cadence: "API · hourly" },
      { domain: "zoho.com", name: "Zoho CRM", cadence: "CSV export" },
      { domain: "zendesk.com", name: "Zendesk", cadence: "API · hourly" },
      { domain: "pipedrive.com", name: "Pipedrive", cadence: "manual" },
    ],
  },
  {
    label: "MES",
    systems: [
      { domain: "plex.com", name: "Plex", cadence: "OPC · live" },
      { domain: "inductiveautomation.com", name: "Ignition", cadence: "historian" },
      { domain: "rockwellautomation.com", name: "Rockwell", cadence: "historian" },
      { domain: "siemens.com", name: "Siemens Opcenter", cadence: "nightly batch" },
      { domain: "ptc.com", name: "PTC ThingWorx", cadence: "API · live" },
    ],
  },
  {
    label: "HRIS",
    systems: [
      { domain: "workday.com", name: "Workday", cadence: "API · daily" },
      { domain: "adp.com", name: "ADP", cadence: "payroll cycle" },
      { domain: "sage.com", name: "Sage People", cadence: "CSV export" },
      { domain: "gusto.com", name: "Gusto", cadence: "manual" },
      { domain: "bamboohr.com", name: "BambooHR", cadence: "API · daily" },
    ],
  },
  {
    label: "COMMERCE",
    systems: [
      { domain: "shopify.com", name: "Shopify", cadence: "webhooks" },
      { domain: "woocommerce.com", name: "WooCommerce", cadence: "CSV export" },
      { domain: "squareup.com", name: "Square", cadence: "API · live" },
      { domain: "manh.com", name: "Manhattan WMS", cadence: "nightly batch" },
      { domain: "stripe.com", name: "Stripe", cadence: "webhooks" },
    ],
  },
  {
    label: "CLOUD",
    systems: [
      { domain: "aws.amazon.com", name: "AWS", cadence: "S3 drops" },
      { domain: "azure.microsoft.com", name: "Azure", cadence: "blob drops" },
      { domain: "snowflake.com", name: "Snowflake", cadence: "shared views" },
      { domain: "slack.com", name: "Slack", cadence: "threads" },
      { domain: "google.com", name: "Google Sheets", cadence: "manual" },
    ],
  },
];

const r4 = (v: number) => Math.round(v * 100) / 100;
const rnd = (i: number, seed: number) => {
  const v = Math.sin(i * 91.3 + seed * 217.9) * 43758.5453;
  return r4(v - Math.floor(v));
};

export const TILE = { w: 150, h: 58 };
export const SLOT = 56;
/** centre of a system tile on the fragmented wall — loose, a little uneven */
export function wallPos(c: number, r: number) {
  const k = c * 5 + r;
  return { x: r4(125 + c * 190 + (rnd(k, 1) - 0.5) * 22), y: r4(228 + r * 100 + (rnd(k, 2) - 0.5) * 18), float: rnd(k, 3) };
}

/** conflicts that pop up between the systems in step 01 */
export const CLASHES: { x: number; y: number; t: string; tone: "red" | "gold" }[] = [
  { x: 220, y: 276, t: "Revenue · $1.39B", tone: "red" },
  { x: 404, y: 474, t: "Customer ID ≠ Account ID", tone: "gold" },
  { x: 600, y: 378, t: "Revenue · $1.45B", tone: "red" },
  { x: 792, y: 568, t: "3 versions of headcount", tone: "gold" },
  { x: 985, y: 278, t: "EUR · BRL · SGD · USD", tone: "gold" },
  { x: 1040, y: 662, t: "Revenue · $1.36B", tone: "red" },
];

/* ---------- 02 entities ---------- */
export type Entity = {
  name: string;
  region: string;
  hue: string;
  local: string;
  claim: string;
  usd: string;
  plan: string;
  domains: string[];
};
export const ENTITIES: Entity[] = [
  { name: "Northwind MFG", region: "EMEA · EUR", hue: "oklch(0.72 0.14 252)", local: "€412.8M", claim: "$1.39B", usd: "$452.1M", plan: "+8.1%", domains: ["sap.com", "salesforce.com", "plex.com", "workday.com"] },
  { name: "Atlas Retail", region: "AMER · USD", hue: "oklch(0.8 0.12 200)", local: "$438.1M", claim: "$1.45B", usd: "$438.1M", plan: "+4.7%", domains: ["netsuite.com", "shopify.com", "squareup.com", "adp.com"] },
  { name: "Meridian Services", region: "APAC · SGD", hue: "oklch(0.78 0.12 160)", local: "S$401.5M", claim: "$1.41B", usd: "$298.6M", plan: "+11.3%", domains: ["microsoft.com", "zoho.com", "zendesk.com", "sage.com"] },
  { name: "Kestrel Industrial", region: "LATAM · BRL", hue: "oklch(0.8 0.13 70)", local: "R$1.27B", claim: "$1.36B", usd: "$231.2M", plan: "−2.4%", domains: ["epicor.com", "hubspot.com", "inductiveautomation.com", "gusto.com"] },
];
export const CARD = { w: 252, h: 364, y: 210 };
export const cardX = (i: number) => 58 + i * 276;
/** where a system lands inside its entity card (centre, stage coords) */
export const slotPos = (i: number, k: number) => ({ x: cardX(i) + 24 + (k % 2) * 70 + SLOT / 2, y: CARD.y + 98 + Math.floor(k / 2) * 70 + SLOT / 2 });
/** the compact column the entities fold into in step 03 */
export const COMPACT = { x: 34, s: 0.47, y: (i: number) => 34 + i * 176 };

/* ---------- 03 Data Manager ---------- */
export const DM = { x: 330, y: 36, w: 836, h: 690 };
export const BAND = { top: 80, h: 136, gap: 12 };
export const bandY = (i: number) => BAND.top + i * (BAND.h + BAND.gap);

export const LAYERS = [
  {
    key: "raw",
    tag: "RAW",
    title: "Seamless extraction",
    note: "Captured exactly as it exists, immutable",
    accent: "oklch(0.86 0.015 250)",
    rows: 48.2,
    rowsLabel: "M records landed",
    quality: 41,
  },
  {
    key: "bronze",
    tag: "BRONZE",
    title: "Structured architecture",
    note: "Typed and organized, source integrity kept",
    accent: "oklch(0.72 0.11 62)",
    rows: 48.2,
    rowsLabel: "M rows · 312 tables",
    quality: 78,
  },
  {
    key: "silver",
    tag: "SILVER",
    title: "Deterministic harmonization",
    note: "Cleansed, validated and reconciled by rule",
    accent: "oklch(0.88 0.02 254)",
    rows: 30.0,
    rowsLabel: "M rows · 18.2M dupes out",
    quality: 96,
  },
  {
    key: "gold",
    tag: "GOLD",
    title: "Executive intelligence",
    note: "Merged, calculated, one definition each",
    accent: "oklch(0.8 0.15 75)",
    rows: 4,
    rowsLabel: " governed KPIs · 1 definition",
    quality: 99.8,
  },
] as const;

export const RAW_CHIPS = [
  ["NWD-4471", "€ 12.40", "31.07.26", "null", "ACCT_88", "€1.204,00", "DE-0091", "—"],
  ["ATL#0091", "$12.40", "07/31/26", "SKU-77A", "N/A", "1,204.00", "cust_402", "TRUE"],
  ["MER/SG/12", "S$ 16,8", "2026-07-31", "  ", "acc.0402", "SGD", "#REF!", "0"],
  ["KST_BR_9", "R$ 9,1", "31/07/2026", "NULL", "conta-88", "BRL 6.420", "LATAM", "?"],
];
export const BRONZE_ROWS = [
  ["NWD", "4000-REV", "1,204.00", "EUR", "2026-07-31"],
  ["ATL", "REV-SALES", "1,204.00", "USD", "2026-07-31"],
  ["KST", "3.1.01", "6,420.00", "BRL", "2026-07-31"],
];
export const SILVER_ROWS = [
  ["NWD", "revenue", "1,318.38", "USD", "2026-07-31"],
  ["ATL", "revenue", "1,204.00", "USD", "2026-07-31"],
  ["KST", "revenue", "1,168.44", "USD", "2026-07-31"],
];
export const GOLD_KPIS = [
  { k: "Revenue", v: "$1.42B" },
  { k: "Free cash flow", v: "$96.4M" },
  { k: "Gross margin", v: "38.6%" },
  { k: "EBITDA", v: "$284M" },
];

/* ---------- 04 executive operating system ---------- */
export const NODE = { x: 30, y: 196, w: 200, h: 372 };
export const WIN = { x: 316, y: 30, w: 856, h: 700 };

export const KPIS = [
  { key: "rev", label: "Revenue", value: 1.42, fmt: (n: number) => `$${n.toFixed(2)}B`, delta: "+6.4% vs budget", tone: "data", src: "gold.fct_revenue" },
  { key: "fcf", label: "Free cash flow", value: 96.4, fmt: (n: number) => `$${n.toFixed(1)}M`, delta: "−$4.2M vs budget", tone: "gold", src: "gold.fct_cash" },
  { key: "gm", label: "Gross margin", value: 38.6, fmt: (n: number) => `${n.toFixed(1)}%`, delta: "+0.8pp vs budget", tone: "data", src: "gold.fct_margin" },
  { key: "ebitda", label: "EBITDA", value: 284, fmt: (n: number) => `$${Math.round(n)}M`, delta: "+1.2pp vs budget", tone: "data", src: "gold.fct_pnl" },
] as const;
export const REV = [96, 101, 99, 106, 112, 110, 117, 122, 120, 127.4, 133, 138];
export const GM = [36.4, 36.5, 36.3, 36.9, 37.2, 37.1, 37.6, 37.9, 37.8, 38.2, 38.4, 38.6];
export const BRIDGE = [
  { k: "Budget", v: 100.6, kind: "total" },
  { k: "Inventory", v: -2.6, kind: "neg" },
  { k: "Receivables", v: -1.9, kind: "neg" },
  { k: "Capex timing", v: 0.3, kind: "pos" },
  { k: "Actual", v: 96.4, kind: "total" },
] as const;

/* ---------- 05 brief ---------- */
export const QUESTION = "Revenue is 6.4% ahead. Why is free cash flow $4.2M behind budget?";
export const BRIEF: Segment[] = [
  { t: "Revenue is " },
  { t: "6.4% ahead", tone: "data" },
  { t: ", but free cash flow is " },
  { t: "$4.2M behind", tone: "gold" },
  { t: ". The cash is tied up in " },
  { t: "Kestrel inventory (+18%)", tone: "strong" },
  { t: " and " },
  { t: "slower EMEA collections", tone: "strong" },
  { t: ". Three moves recover $3.4M before month-end close." },
];
export const DRIVERS = [
  { k: "Inventory build · Kestrel, 3 sites", v: "−$2.6M", w: 0.62, tone: "gold" },
  { k: "Collections · 11 EMEA accounts > 60d", v: "−$1.9M", w: 0.45, tone: "gold" },
  { k: "Capex timing · deferred to Q4", v: "+$0.3M", w: 0.08, tone: "success" },
] as const;

/* ---------- 06 act ---------- */
export const MOVES = [
  {
    agent: "COO agent",
    scope: "Operations & supply",
    tint: "#a0e7ff",
    color: "oklch(0.85 0.11 205)",
    title: "Release slow Kestrel inventory to EMEA distributors",
    value: 1.4,
    owner: "Marcus Hale · COO",
    due: "by day 5",
    steps: ["Free 1,920 slow pallets at 3 sites", "Re-route to 4 EMEA distributors", "Update stock reservations"],
    system: { domain: "sap.com", name: "SAP S/4HANA" },
  },
  {
    agent: "CCO agent",
    scope: "Customers & revenue",
    tint: "#b8ffcf",
    color: "oklch(0.82 0.14 155)",
    title: "Chase 11 EMEA accounts over 60 days",
    value: 1.1,
    owner: "Priya Rao · CCO",
    due: "by day 7",
    steps: ["Rank accounts by exposure", "Send tailored reminders", "Log promises to pay"],
    system: { domain: "salesforce.com", name: "Salesforce" },
  },
  {
    agent: "CHRO agent",
    scope: "People & workforce",
    tint: "#ffb8d9",
    color: "oklch(0.78 0.13 350)",
    title: "Pause 14 non-critical Q4 backfills",
    value: 0.9,
    owner: "Daniel Okafor · CHRO",
    due: "by day 9",
    steps: ["Screen 14 open requisitions", "Protect 6 critical roles", "Freeze approvals in HRIS"],
    system: { domain: "workday.com", name: "Workday" },
  },
] as const;

/** favicons need no token; logo.dev is used when one is configured, like the scroll cinematic above */
const LOGO_TOKEN = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN;
export const logoUrl = (domain: string) =>
  LOGO_TOKEN
    ? `https://img.logo.dev/${domain}?token=${LOGO_TOKEN}&size=80&format=png&theme=dark&retina=true`
    : `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
