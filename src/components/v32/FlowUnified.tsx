"use client";

import { useEffect, useRef, useState } from "react";
import { AppDashboard } from "@/components/v24/AppDashboard";
import { ExecutiveBriefing } from "./ExecutiveBriefing";
import { LifecycleScene } from "./LifecycleScene";

/* ------------------------------------------------------------------ *
 * v3 — the unified cinematic
 * 01 Fragmented systems · 02 Business units · 03 Genius Lab Data Hub ·
 * 04 Executive Operating System · 05 Executive briefing · 06 AI agents
 * ------------------------------------------------------------------ */

const stages = [
  {
    index: "01",
    title: "Fragmented",
    lede: "Dozens of systems of record.",
    body: "ERP, CRM, MES, HRIS, retail and cloud platforms — each with its own model, its own cadence, its own truth.",
  },
  {
    index: "02",
    title: "Entities",
    lede: "And every entity runs a different stack.",
    body: "Business units acquired over a decade never converged. Ask for group revenue and four teams return four numbers.",
  },
  {
    index: "03",
    title: "Harmonized",
    lede: "One hub. One definition.",
    body: "Every entity lands raw into the Genius Lab hub — structured, cleansed, merged and defined once in the semantic layer.",
  },
  {
    index: "04",
    title: "Decide",
    lede: "One surface the board trusts.",
    body: "Governed KPIs plot straight into the executive operating system — no reconciliation, no spreadsheet detour, no debate.",
  },
  {
    index: "05",
    title: "Brief",
    lede: "The morning briefing, written for you.",
    body: "Genius reads the governed numbers overnight and returns a plain-language brief: what moved, what is at risk, and the priorities to act on today.",
  },
  {
    index: "06",
    title: "Act",
    lede: "Agents that close the loop.",
    body: "AI agents read the same definitions, take governed action, and write results back into the systems of record.",
  },
];

const lifecycleStages = [
  {
    index: "01",
    title: "Connect",
    lede: "Connect everything the business depends on.",
    body: "Genius Lab connects operational systems, organizational knowledge, and relevant external sources without disrupting the technology already in place.",
  },
  {
    index: "02",
    title: "Unify",
    lede: "One managed foundation for data and context.",
    body: "Operational data is governed while conversations, documents, decisions, and market signals become connected business memory.",
  },
  {
    index: "03",
    title: "Understand",
    lede: "Know what happened, why, and what comes next.",
    body: "Genius Lab combines internal performance, organizational context, and external signals to surface risks, opportunities, and recommended actions.",
  },
  {
    index: "04",
    title: "Execute",
    lede: "Turn intelligence into coordinated action.",
    body: "Governed workflows and AI agents act across systems and teams, while outcomes and decisions return to the intelligence layer.",
  },
];

/* ---------- math ---------- */
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => {
  const x = cl(t);
  return x * x * (3 - 2 * x);
};
const phase = (p: number, start: number, end: number) =>
  smooth((p - start) / (end - start));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, seed: number) => {
  const v = Math.sin(i * 91.3 + seed * 217.9) * 43758.5453;
  // rounded so SSR and client render byte-identical values
  return Math.round((v - Math.floor(v)) * 1e4) / 1e4;
};

function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        setP(total <= 0 ? 0 : cl(-rect.top / total));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return { ref, p };
}

/* ---------- viewport ---------- */
const W = 1900;
const H = 900;

const LOGO_TOKEN = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN;
/** logo.dev needs a token; without one, fall back to the favicon service the source also uses. */
const logoUrl = (domain: string, recover = false) =>
  recover || !LOGO_TOKEN
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
    : `https://img.logo.dev/${domain}?token=${LOGO_TOKEN}&size=80&format=png&theme=dark&retina=true`;

/* ---------- 01 sources ---------- */
const SRC_X = 60;
const SRC_W = 570;
const SRC_H = 92;
const SRC_TILE = 56;
const SRC_TILE_X = SRC_X + 118;
const SRC_TILE_GAP = 86;
const srcY = (i: number) => 120 + i * 116;


const SOURCES: { label: string; domains: string[] }[] = [
  { label: "ERP", domains: ["sap.com", "netsuite.com", "epicor.com", "qad.com", "microsoft.com"] },
  {
    label: "CRM",
    domains: ["salesforce.com", "hubspot.com", "zoho.com", "zendesk.com", "pipedrive.com"],
  },
  {
    label: "MES",
    domains: ["plex.com", "inductiveautomation.com", "rockwellautomation.com", "siemens.com", "ptc.com"],
  },
  { label: "HRIS", domains: ["workday.com", "adp.com", "sage.com", "gusto.com", "bamboohr.com"] },
  {
    label: "RETAIL",
    domains: ["shopify.com", "woocommerce.com", "squareup.com", "manh.com", "stripe.com"],
  },
  {
    label: "CLOUD",
    domains: ["aws.amazon.com", "azure.microsoft.com", "snowflake.com", "slack.com", "google.com"],
  },
];

/** exact centre of a source logo tile, for the swirl origins */
function srcTile(domain: string): { x: number; y: number } | null {
  for (let i = 0; i < SOURCES.length; i++) {
    const k = SOURCES[i]!.domains.indexOf(domain);
    if (k >= 0)
      return {
        x: SRC_TILE_X + k * SRC_TILE_GAP + SRC_TILE / 2,
        y: srcY(i) + SRC_H / 2,
      };

  }
  return null;
}

/* ---------- 02 business units ---------- */
const BU_W = 380;
const BU_H = 250;

type Unit = {
  name: string;
  region: string;
  metric: string;
  domains: string[];
  /** quadrant position */
  qx: number;
  qy: number;
  /** vertical-stack position */
  sx: number;
  sy: number;
};

const STACK_X = 1140;
const STACK_GAP = 268;
const STACK_TOP = 24;

const UNITS: Unit[] = [
  {
    name: "NORTHWIND MFG",
    region: "EMEA · EUR",
    metric: "€412.8M",
    domains: ["sap.com", "salesforce.com", "plex.com", "workday.com"],
    qx: 620,
    qy: 150,
    sx: STACK_X,
    sy: STACK_TOP,
  },
  {
    name: "ATLAS RETAIL",
    region: "AMER · USD",
    metric: "$438.1M",
    domains: ["netsuite.com", "shopify.com", "squareup.com", "adp.com"],
    qx: 1080,
    qy: 150,
    sx: STACK_X,
    sy: STACK_TOP + STACK_GAP,
  },
  {
    name: "MERIDIAN SERVICES",
    region: "APAC · SGD",
    metric: "S$401.5M",
    domains: ["microsoft.com", "zoho.com", "zendesk.com", "sage.com"],
    qx: 620,
    qy: 470,
    sx: STACK_X,
    sy: STACK_TOP + STACK_GAP * 2,
  },
  {
    name: "KESTREL INDUSTRIAL",
    region: "LATAM · BRL",
    metric: "R$429.6M",
    domains: ["epicor.com", "hubspot.com", "inductiveautomation.com", "gusto.com"],
    qx: 1080,
    qy: 470,
    sx: STACK_X,
    sy: STACK_TOP + STACK_GAP * 3,
  },
];

/** systems that fly out of the left panel into an entity */
const picked = new Set(UNITS.flatMap((u) => u.domains));

/** centre of the vertical stack — the hub raw band lines up with this */
const STACK_CY = STACK_TOP + (STACK_GAP * 3 + BU_H) / 2;

/* ---------- 03 hub ---------- */
const HB_X = 1780;
const HB_W = 460;
const RAW_H = 150;
const HB_Y = STACK_CY - RAW_H / 2;
const HB_H = 720;
const LANE_Y = (i: number) => HB_Y + RAW_H + 60 + i * 118;
const SEM_Y = HB_Y + HB_H - 152;
const SEM_H = 124;
const SEM_CY = SEM_Y + SEM_H / 2;

const LANES = [
  { label: "BRONZE", note: "structured", accent: "oklch(0.72 0.11 62)" },
  { label: "SILVER", note: "cleansed", accent: "oklch(0.84 0.02 254)" },
  { label: "GOLD", note: "merged · calculated", accent: "var(--gold)" },
];

/* ---------- layer captions — one at a time, beside the hub ---------- */
const CAP_X = HB_X + HB_W + 90;
const CAP_W = 660;
const CAPTIONS: {
  tag: string;
  title: string;
  lines: string[];
  accent: string;
  cy: number;
  in: [number, number];
  out: [number, number];
}[] = [
  {
    tag: "RAW",
    title: "Seamless Data Extraction",
    lines: [
      "Capture data exactly as it exists across every ERP, CRM,",
      "MES, WMS, HRIS, API, and operational system.",
    ],
    accent: "oklch(0.88 0.012 250)",
    cy: HB_Y + RAW_H / 2,
    in: [0.425, 0.475],
    out: [0.5, 0.535],
  },
  {
    tag: "BRONZE",
    title: "Customized Data Architecture",
    lines: [
      "Standardize and organize data into a scalable enterprise",
      "foundation while preserving source integrity.",
    ],
    accent: "oklch(0.72 0.11 62)",
    cy: LANE_Y(0) + 10,
    in: [0.5, 0.545],
    out: [0.565, 0.6],
  },
  {
    tag: "SILVER",
    title: "Deterministic Data Harmonization",
    lines: [
      "Clean, validate, reconcile, and enrich data using governed",
      "business rules to create a trusted semantic layer.",
    ],
    accent: "oklch(0.84 0.02 254)",
    cy: LANE_Y(1) + 10,
    in: [0.56, 0.605],
    out: [0.625, 0.66],
  },
  {
    tag: "GOLD",
    title: "Executive Intelligence Layer",
    lines: [
      "Transform harmonized data into customized dashboards,",
      "consolidated reporting, AI-powered insights, workflow",
      "automation, and business-ready data products.",
    ],
    accent: "var(--gold)",
    cy: SEM_CY,
    in: [0.62, 0.67],
    out: [0.7, 0.735],
  },
];

const LIFECYCLE_CAPTIONS = [
  { tag: "RAW", title: "Seamless Data Extraction", detail: ["Capture data exactly as it exists across every ERP, CRM,", "MES, WMS, HRIS, API, and operational system."], accent: "oklch(0.88 0.012 250)", cy: HB_Y + RAW_H / 2, in: [0.425, 0.47], out: [0.49, 0.52] },
  { tag: "BRONZE", title: "Customized Data Architecture", detail: ["Standardize and organize data into a scalable enterprise", "foundation while preserving source integrity."], accent: "oklch(0.72 0.11 62)", cy: LANE_Y(0) + 10, in: [0.49, 0.535], out: [0.55, 0.58] },
  { tag: "SILVER", title: "Deterministic Data Harmonization", detail: ["Clean, validate, reconcile, and enrich data using governed", "business rules to create a trusted semantic layer."], accent: "oklch(0.84 0.02 254)", cy: LANE_Y(1) + 10, in: [0.55, 0.595], out: [0.615, 0.645] },
  { tag: "GOLD", title: "Executive Intelligence Layer", detail: ["Transform harmonized data into customized dashboards,", "consolidated reporting, AI-powered insights, workflow", "automation, and business-ready data products."], accent: "var(--gold)", cy: LANE_Y(2) + 10, in: [0.61, 0.655], out: [0.68, 0.71] },
  { tag: "SEMANTIC", title: "Governed Semantic Layer", detail: ["Shared definitions, KPIs, lineage, and business rules", "keep every metric consistent across the business."], accent: "var(--gold)", cy: SEM_CY, in: [0.69, 0.735], out: [0.76, 0.79] },
] as const;

/* ---------- 04 command center ---------- */
const DB_W = 1180;
const DB_H = 880;
const DB_X = 3060;
const DB_Y = SEM_CY - DB_H / 2;

/* ---------- 05 executive briefing — magnified out of the dashboard ---------- */
/* the briefing card's real position inside the dashboard surface */
const LN_X = DB_X + 229;
const LN_Y = DB_Y + 476;
const LN_W = 490;
const LN_H = 379;

const BR_W = 760;
const BR_H = 588;
const BR_X = LN_X + LN_W / 2 - BR_W / 2;
const BR_Y = LN_Y + LN_H / 2 - BR_H / 2;


/* ---------- 06 agents ---------- */
const AG_X = BR_X + BR_W + 620;


const AG_W = 380;
const AG_CH = 88;
const AGENTS = [
  ["REPLENISH", "STOCK COVER · 14 SITES", "412 POs raised", "+4.1d cover"],
  ["PRICE GUARD", "MARGIN FLOOR · LIVE", "1,284 SKUs held", "+120bp margin"],
  ["CASH CHASE", "DSO · 4.2K INVOICES", "$18.4M collected", "−6.2d DSO"],
  ["CLOSE COPILOT", "GROUP CONSOLIDATION", "4 entities closed", "−3d close"],
  ["SUPPLY SENTINEL", "SUPPLIER RISK · TIER 1", "38 alerts routed", "9 mitigations"],
];
const agY = (i: number) => SEM_CY - 260 + i * (AG_CH + 18);


function Packet({
  d,
  color,
  dur,
  begin = 0,
  opacity = 1,
  r = 2.6,
}: {
  d: string;
  color: string;
  dur: number;
  begin?: number;
  opacity?: number;
  r?: number;
}) {
  if (opacity <= 0.02) return null;
  return (
    <circle r={r} fill={color} opacity={opacity} style={{ filter: "url(#uGlow)" }}>
      <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={d} />
      <animate
        attributeName="opacity"
        values={`0;${opacity};${opacity};0`}
        keyTimes="0;0.12;0.82;1"
        dur={`${dur}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
      />
    </circle>
  );
}

function Scene({ p, vw, recoverLogos = false }: { p: number; vw: number; recoverLogos?: boolean }) {
  const sources = phase(p, 0.0, 0.08);
  const split = phase(p, 0.09, 0.2);
  const conflict = phase(p, 0.18, 0.27);
  const stack = phase(p, 0.28, 0.38);
  const toHub = phase(p, 0.38, 0.45);
  const hub = phase(p, 0.4, 0.48);
  const semantic = phase(p, recoverLogos ? 0.7 : 0.66, recoverLogos ? 0.76 : 0.72);
  const flowOut = phase(p, recoverLogos ? 0.76 : 0.72, recoverLogos ? 0.82 : 0.78);
  const dash = phase(p, 0.72, 0.79);
  const brief = phase(p, 0.81, 0.86);
  const agents = phase(p, 0.89, 0.93);
  const writeback = phase(p, 0.95, 1.0);

  const CAM = [
    { at: 0.0, cx: SRC_X + SRC_W / 2, cy: 448, z: 1.16 },
    { at: 0.12, cx: SRC_X + SRC_W / 2 + 90, cy: 448, z: 1.04 },


    { at: 0.22, cx: 1040, cy: 435, z: 0.8 },
    { at: 0.3, cx: 1040, cy: 435, z: 0.82 },
    { at: 0.38, cx: STACK_X + BU_W / 2, cy: STACK_CY, z: 0.6 },
    { at: 0.44, cx: 1680, cy: HB_Y + RAW_H / 2, z: 0.72 },
    { at: 0.48, cx: HB_X + HB_W / 2 + 380, cy: HB_Y + HB_H / 2, z: 0.78 },
    { at: 0.72, cx: HB_X + HB_W / 2 + 380, cy: HB_Y + HB_H / 2, z: 0.78 },
    { at: 0.78, cx: DB_X + DB_W / 2 + 120, cy: SEM_CY, z: 0.56 },
    { at: 0.845, cx: DB_X + 927, cy: SEM_CY + 225, z: 0.9 },
    { at: 0.89, cx: DB_X + 947, cy: SEM_CY + 225, z: 0.9 },






    { at: 0.94, cx: AG_X - 200, cy: SEM_CY - 40, z: 0.6 },
    { at: 0.98, cx: AG_X + AG_W / 2 - 320, cy: SEM_CY - 60, z: 0.62 },
    { at: 1.0, cx: AG_X + AG_W / 2 - 320, cy: SEM_CY - 60, z: 0.62 },



  ];





  let cam = CAM[0]!;
  for (let i = 0; i < CAM.length - 1; i++) {
    const a = CAM[i]!;
    const b = CAM[i + 1]!;
    if (p >= a.at && p <= b.at) {
      const t = smooth((p - a.at) / (b.at - a.at));
      cam = { at: p, cx: mix(a.cx, b.cx, t), cy: mix(a.cy, b.cy, t), z: mix(a.z, b.z, t) };
      break;
    }
    if (p > b.at) cam = b;
  }

  /* the artwork viewport is as wide as the screen allows — scale the scene so
     the later, wider acts still fit instead of being cropped off-screen */
  const fit = cl(vw / W, 0.45, 1);
  const lifecycleScale = p < 0.4 ? 0.8 : p < 0.745 ? 1.06 : p < 0.905 ? 1.05 : 1.08;
  const z = cam.z * fit * (recoverLogos ? lifecycleScale : 1);

  /* the left column carries the copy — later acts sit further right */
  const anchorX =
    vw / 2 +
    ((recoverLogos ? 285 : 230) + phase(p, 0.74, 0.84) * (recoverLogos ? 475 : 520)) * fit;



  const camT = `translate(${anchorX} ${H / 2}) scale(${z}) translate(${-cam.cx} ${-cam.cy})`;


  /* animated unit positions: quadrant → vertical stack */
  const unitPos = UNITS.map((u) => ({
    x: mix(u.qx, u.sx, stack),
    y: mix(u.qy, u.sy, stack),
  }));

  const rawCy = HB_Y + RAW_H / 2;

  /* left panel dissolves as the selected systems fly out */
  const lift = phase(p, 0.09, 0.15);
  const vanish = phase(p, 0.10, 0.17);


  return (
    <svg viewBox={`0 0 ${vw} ${H}`} className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="uSoft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="uGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="uVig" cx="50%" cy="50%" r="72%">
          <stop offset="55%" stopColor="var(--background)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--background)" stopOpacity="0.92" />
        </radialGradient>
        <linearGradient id="uArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--data)" stopOpacity="0.34" />
          <stop offset="100%" stopColor="var(--data)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="uSilver" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.92 0.012 250)" stopOpacity="0.55" />
          <stop offset="45%" stopColor="oklch(0.97 0.008 250)" stopOpacity="1" />
          <stop offset="100%" stopColor="oklch(0.80 0.02 250)" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="uGold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.55" />
          <stop offset="45%" stopColor="var(--gold)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.9" />
        </linearGradient>
        <mask id="uLensMask">
          <rect x={DB_X} y={DB_Y} width={DB_W} height={DB_H} fill="white" />
          <rect x={LN_X} y={LN_Y} width={LN_W} height={LN_H} rx="14" fill="black" />
        </mask>

        <linearGradient id="uPanel" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="oklch(0.32 0.055 258)" stopOpacity="0.92" />
          <stop offset="55%" stopColor="oklch(0.24 0.05 258)" stopOpacity="0.86" />
          <stop offset="100%" stopColor="oklch(0.19 0.045 258)" stopOpacity="0.94" />
        </linearGradient>
        <linearGradient id="uCard" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="oklch(0.29 0.05 258)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="oklch(0.18 0.035 258)" stopOpacity="0.94" />
        </linearGradient>
        <linearGradient id="uEdge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.95 0.01 250)" stopOpacity="0.85" />
          <stop offset="50%" stopColor="var(--data)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(0.80 0.02 250)" stopOpacity="0.5" />
        </linearGradient>
        <pattern id="uGrid" width="110" height="110" patternUnits="userSpaceOnUse">
          <path
            d="M 110 0 L 0 0 0 110"
            fill="none"
            stroke="color-mix(in oklab, var(--data) 30%, transparent)"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <rect x="0" y="0" width={W} height={H} fill="url(#uGrid)" opacity="0.85" />

      <g transform={camT}>


        {/* ---------- 01 FRAGMENTED SYSTEMS ---------- */}
        <g
          opacity={p >= 0.18 ? 0 : mix(0.5, 1, sources) * (1 - vanish)}
          visibility={p >= 0.18 ? "hidden" : "visible"}
        >
          <text x={SRC_X} y={srcY(0) - 36} fill="var(--data)" fontSize="15" letterSpacing="4.2" opacity="0.9">
            FRAGMENTED DATA ACROSS MULTIPLE SYSTEMS
          </text>
          {SOURCES.map((s, i) => (
            <g key={s.label} opacity={phase(p, i * 0.012, 0.05 + i * 0.012)}>
              <rect
                x={SRC_X}
                y={srcY(i)}
                width={SRC_W}
                height={SRC_H}
                rx="20"
                fill="oklch(0.30 0.06 258 / 85%)"
                stroke="var(--data)"
                strokeOpacity="0.6"
              />
              <text
                x={SRC_X + 26}
                y={srcY(i) + SRC_H / 2 + 6}
                fill="var(--data)"
                fontSize="16"
                letterSpacing="2.4"
                opacity="0.95"
              >
                {s.label}
              </text>
              {s.domains.map((dm, k) => (
                <g key={dm} opacity={picked.has(dm) ? 1 - lift : 1}>
                  <rect
                    x={SRC_TILE_X + k * SRC_TILE_GAP}
                    y={srcY(i) + (SRC_H - SRC_TILE) / 2}
                    width={SRC_TILE}
                    height={SRC_TILE}
                    rx="14"
                    fill="oklch(1 0 0 / 16%)"
                    stroke="oklch(1 0 0 / 26%)"
                  />
                  <image
                    href={logoUrl(dm, recoverLogos)}
                    x={SRC_TILE_X + k * SRC_TILE_GAP + 14}
                    y={srcY(i) + (SRC_H - SRC_TILE) / 2 + 14}
                    width={28}
                    height={28}
                    preserveAspectRatio="xMidYMid meet"
                  />
                </g>
              ))}
            </g>
          ))}
        </g>

        {/* the swirl: the selected system tiles physically fly into their entity */}
        {p < 0.18 && UNITS.map((u, j) =>
          u.domains.map((dm, k) => {
            const s = srcTile(dm);
            if (!s) return null;
            const pos = unitPos[j]!;
            const tx = pos.x + 26 + k * 66 + 26;
            const ty = pos.y + 118;
            const t = phase(p, 0.09 + (j * 4 + k) * 0.005, 0.17 + (j * 4 + k) * 0.005);
            if (t <= 0.001 || t >= 0.999) return null;

            /* quadratic bezier with a perpendicular bow = swirl */
            const mx = mix(s.x, tx, 0.5);
            const my = mix(s.y, ty, 0.5);
            const dx = tx - s.x;
            const dy = ty - s.y;
            const len = Math.hypot(dx, dy) || 1;
            const bow = (k % 2 === 0 ? -1 : 1) * (170 + k * 55);
            const cx1 = mx + (-dy / len) * bow;
            const cy1 = my + (dx / len) * bow;
            const it = 1 - t;
            const px = it * it * s.x + 2 * it * t * cx1 + t * t * tx;
            const py = it * it * s.y + 2 * it * t * cy1 + t * t * ty;
            const scale = mix(0.8, 1, t);
            const rot = it * (k % 2 === 0 ? -300 : 300);
            const fade = Math.min(1, t / 0.12) * Math.min(1, (1 - t) / 0.1);

            return (
              <g
                key={`sw${j}${dm}`}
                transform={`translate(${px} ${py}) rotate(${rot}) scale(${scale})`}
                opacity={0.35 + 0.65 * fade}
              >
                <rect
                  x={-26}
                  y={-26}
                  width={52}
                  height={52}
                  rx="11"
                  fill="oklch(1 0 0 / 12%)"
                  stroke="oklch(0.92 0.02 250)"
                  strokeOpacity={0.4}
                />
                <image
                  href={logoUrl(dm, recoverLogos)}
                  x={-13}
                  y={-13}
                  width={26}
                  height={26}
                  preserveAspectRatio="xMidYMid meet"
                />
              </g>
            );
          }),
        )}





        {/* ---------- 02 BUSINESS UNITS ---------- */}
        <g opacity={split}>
          <text
            x={mix(UNITS[0]!.qx, UNITS[0]!.sx, stack)}
            y={mix(UNITS[0]!.qy, UNITS[0]!.sy, stack) - 34}
            fill="var(--data)"
            fontSize="13"
            letterSpacing="3.6"
          >
            BUSINESS UNITS · ENTITIES
          </text>
          {UNITS.map((u, i) => {
            const pos = unitPos[i]!;
            return (
              <g
                key={u.name}
                transform={`translate(${pos.x} ${pos.y})`}
                opacity={phase(p, 0.09 + i * 0.02, 0.17 + i * 0.02)}
              >
                <rect
                  width={BU_W}
                  height={BU_H}
                  rx="16"
                  fill="url(#uCard)"
                  stroke="var(--border)"
                  strokeOpacity="0.95"
                />
                <rect
                  x="0.5"
                  y="0.5"
                  width={BU_W - 1}
                  height={BU_H - 1}
                  rx="15.5"
                  fill="none"
                  stroke="oklch(0.88 0.02 250)"
                  strokeOpacity={0.12 + 0.16 * toHub}
                />
                <text x="26" y="42" fill="var(--foreground)" fontSize="16" letterSpacing="1.8" opacity="0.95">
                  {u.name}
                </text>
                <text x="26" y="64" fill="var(--muted-foreground)" fontSize="11" letterSpacing="2">
                  {u.region}
                </text>

                {u.domains.map((d, k) => (
                  <g
                    key={d}
                    transform={`translate(${26 + k * 66} 92)`}
                    opacity={phase(p, 0.165 + (i * 4 + k) * 0.005, 0.195 + (i * 4 + k) * 0.005)}
                  >
                    <rect width={52} height={52} rx="11" fill="oklch(1 0 0 / 12%)" stroke="oklch(1 0 0 / 24%)" />
                    <image href={logoUrl(d, recoverLogos)} x="13" y="13" width="26" height="26" preserveAspectRatio="xMidYMid meet" />
                  </g>
                ))}

                <text x="26" y="188" fill="var(--muted-foreground)" fontSize="10" letterSpacing="2.2">
                  FY REVENUE · LOCAL CLOSE
                </text>
                <text
                  x="26"
                  y="220"
                  fill="oklch(0.93 0.01 250)"
                  fontSize="24"
                  opacity="0.95"
                >
                  {u.metric}
                </text>
                <text
                  x={BU_W - 26}
                  y="220"
                  textAnchor="end"
                  fill="oklch(0.78 0.01 250)"
                  fontSize="10"
                  letterSpacing="1.8"
                  opacity={conflict * (1 - stack)}
                >
                  UNRECONCILED
                </text>
              </g>
            );
          })}
        </g>

        {/* stacked entities → raw section of the hub */}
        {UNITS.map((u, i) => {
          const pos = unitPos[i]!;
          const x1 = pos.x + BU_W;
          const y1 = pos.y + BU_H / 2;
          const x2 = HB_X;
          const y2 = HB_Y + 34 + i * 28;
          const lead = Math.max(40, (x2 - x1) * 0.22);
          const a = x1 + lead;
          const b = x2 - lead;
          const mxp = (a + b) / 2;
          const d = `M ${x1} ${y1} L ${a} ${y1} C ${mxp} ${y1}, ${mxp} ${y2}, ${b} ${y2} L ${x2} ${y2}`;
          return (
            <g key={`h-${u.name}`}>
              <path
                d={d}
                fill="none"
                stroke="url(#uSilver)"
                strokeOpacity={0.26 * toHub}
                strokeWidth="4"
                strokeLinecap="round"
                style={{ filter: "url(#uGlow)" }}
              />
              <path
                d={d}
                fill="none"
                stroke="url(#uSilver)"
                strokeOpacity={0.9 * toHub}
                strokeWidth="1.4"
                strokeLinecap="round"
              />

              <Packet
                d={d}
                color="oklch(0.98 0.006 250)"
                dur={2.8 + i * 0.24}
                begin={i * 0.35}
                opacity={toHub}
                r={3.2}
              />
              <Packet
                d={d}
                color="oklch(0.88 0.012 250)"
                dur={2.8 + i * 0.24}
                begin={i * 0.35 + 1.4}
                opacity={0.7 * toHub}
                r={2}
              />
            </g>
          );
        })}

        {/* ---------- 03 GENIUS LAB DATA HUB ---------- */}
        <g opacity={hub}>
          <rect
            x={HB_X - 6}
            y={HB_Y - 6}
            width={HB_W + 12}
            height={HB_H + 12}
            rx="26"
            fill="none"
            stroke="url(#uSilver)"
            strokeOpacity="0.14"
          />
          <rect
            x={HB_X}
            y={HB_Y}
            width={HB_W}
            height={HB_H}
            rx="20"
            fill="url(#uPanel)"
            stroke="url(#uEdge)"
            strokeOpacity="0.9"
            strokeWidth="1.4"
            style={{ filter: "url(#uGlow)" }}
          />
          <text x={HB_X + 26} y={HB_Y - 22} fill="var(--data)" fontSize="11" letterSpacing="3.4">
            GENIUS LAB DATA HUB
          </text>

          {/* raw layer — aligned fragments, almost dots */}
          <g>
            <text x={HB_X + 26} y={HB_Y + 34} fill="var(--muted-foreground)" fontSize="9" letterSpacing="2.6">
              UNSTRUCTURED RAW DATA · AS LANDED · IMMUTABLE
            </text>
            {Array.from({ length: 5 }).map((_, row) =>
              Array.from({ length: 14 }).map((__, col) => {
                const x = HB_X + 26 + col * 26;
                const y = HB_Y + 52 + row * 16;
                const w = 6 + Math.round(rnd(row * 14 + col, 3) * 12);
                return (
                  <rect
                    key={`raw${row}-${col}`}
                    x={x}
                    y={y}
                    width={w}
                    height={4}
                    rx="2"
                    fill="var(--foreground)"
                    opacity={0.14 + rnd(row * 14 + col, 6) * 0.3}
                  />
                );
              }),
            )}
            <line
              x1={HB_X + 20}
              y1={HB_Y + RAW_H - 6}
              x2={HB_X + HB_W - 20}
              y2={HB_Y + RAW_H - 6}
              stroke="oklch(0.95 0.01 250)"
              strokeOpacity="0.18"
            />
            <circle cx={HB_X} cy={rawCy} r="4" fill="var(--data)" opacity={0.8 * toHub}>
              <animate attributeName="opacity" values="0.2;0.9;0.2" dur="2.2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* medallion lanes — each layer rises into place as you scroll */}
          {LANES.map((l, i) => {
            const y = LANE_Y(i);
            const t = phase(p, 0.47 + i * 0.06, 0.55 + i * 0.06);
            return (
              <g key={l.label} opacity={t} transform={`translate(0 ${mix(46, 0, t)})`}>
                <line
                  x1={HB_X + 26}
                  y1={y - 22}
                  x2={HB_X + HB_W - 26}
                  y2={y - 22}
                  stroke={l.accent}
                  strokeOpacity="0.55"
                />
                <text x={HB_X + 26} y={y} fill={l.accent} fontSize="9.5" letterSpacing="2.6">
                  {l.label}
                </text>
                <text
                  x={HB_X + HB_W - 26}
                  y={y}
                  textAnchor="end"
                  fill="var(--muted-foreground)"
                  fontSize="8"
                  letterSpacing="1.6"
                >
                  {l.note}
                </text>
                {Array.from({ length: 4 }).map((_, k) => (
                  <rect
                    key={k}
                    x={HB_X + 26 + k * 88}
                    y={y + 16}
                    width={mix(40, 70, i === 0 ? rnd(k, 7) : 1)}
                    height={9}
                    rx="4.5"
                    fill={l.accent}
                    opacity={mix(0.72, 1, (i + 1) / 3)}
                    style={{ filter: "url(#uSoft)" }}
                  />
                ))}
              </g>
            );
          })}

          {/* semantic layer at the base — the hero of the hub */}
          <g opacity={semantic} transform={`translate(0 ${mix(46, 0, semantic)})`}>
            <rect
              x={HB_X + 14}
              y={SEM_Y - 8}
              width={HB_W - 28}
              height={SEM_H + 16}
              rx="18"
              fill="none"
              stroke="var(--gold)"
              strokeOpacity="0.22"
            />
            <rect
              x={HB_X + 26}
              y={SEM_Y}
              width={HB_W - 52}
              height={SEM_H}
              rx="14"
              fill="var(--gold)"
              fillOpacity="0.2"
              stroke="var(--gold)"
              strokeOpacity="0.75"
              strokeWidth="1.4"
              style={{ filter: "url(#uGlow)" }}
            />
            <text x={HB_X + 44} y={SEM_Y + 30} fill="var(--gold)" fontSize="13" letterSpacing="2.6">
              SEMANTIC LAYER
            </text>
            <text
              x={HB_X + HB_W - 44}
              y={SEM_Y + 30}
              textAnchor="end"
              fill="var(--gold)"
              fillOpacity="0.7"
              fontSize="8"
              letterSpacing="1.8"
            >
              ONE DEFINITION · GOVERNED
            </text>
            <line
              x1={HB_X + 44}
              y1={SEM_Y + 46}
              x2={HB_X + HB_W - 44}
              y2={SEM_Y + 46}
              stroke="var(--gold)"
              strokeOpacity="0.3"
            />
            {["KPI LIBRARY", "BUSINESS RULES", "METRIC LINEAGE", "ENTITY MAPPING"].map((t, k) => (
              <g key={t}>
                <rect
                  x={HB_X + 44 + (k % 2) * ((HB_W - 88) / 2)}
                  y={SEM_Y + 58 + Math.floor(k / 2) * 30}
                  width={(HB_W - 88) / 2 - 12}
                  height={22}
                  rx="6"
                  fill="var(--gold)"
                  fillOpacity="0.14"
                  stroke="var(--gold)"
                  strokeOpacity="0.4"
                />
                <text
                  x={HB_X + 54 + (k % 2) * ((HB_W - 88) / 2)}
                  y={SEM_Y + 73 + Math.floor(k / 2) * 30}
                  fill="var(--gold)"
                  fontSize="8"
                  letterSpacing="1.6"
                >
                  {t}
                </text>
              </g>
            ))}
          </g>
        </g>

        {/* ---------- layer captions ---------- */}
        {(recoverLogos ? LIFECYCLE_CAPTIONS : CAPTIONS).map((c) => {
          const o = phase(p, c.in[0], c.in[1]) * (1 - phase(p, c.out[0], c.out[1]));
          if (o <= 0.01) return null;
          const shift = mix(26, 0, phase(p, c.in[0], c.in[1]));
          const lines = "lines" in c ? c.lines : [];
          const h = 66 + lines.length * 24;
          const y = c.cy - h / 2;
          if (recoverLogos) {
            const cardW = 480;
            const cardH = 116;
            return (
              <g key={c.tag} opacity={o} transform={`translate(${shift} 0)`}>
                <line
                  x1={HB_X + HB_W + 14}
                  y1={c.cy}
                  x2={CAP_X - 22}
                  y2={c.cy}
                  stroke={c.accent}
                  strokeOpacity="0.42"
                />
                <circle cx={CAP_X - 22} cy={c.cy} r="3.4" fill={c.accent} />
                <rect
                  x={CAP_X}
                  y={c.cy - cardH / 2}
                  width={cardW}
                  height={cardH}
                  rx="14"
                  fill="url(#uPanel)"
                  fillOpacity="0.94"
                  stroke={c.accent}
                  strokeOpacity="0.3"
                />
                <rect x={CAP_X} y={c.cy - 36} width="3" height="72" fill={c.accent} opacity="0.85" />
                <text x={CAP_X + 28} y={c.cy - 30} fill={c.accent} fontSize="9" letterSpacing="3">
                  {c.tag}
                </text>
                <text x={CAP_X + 28} y={c.cy - 4} fill="var(--foreground)" fontSize="20" letterSpacing="-0.3">
                  {c.title}
                </text>
                {("detail" in c ? c.detail : []).map((line: string, index: number) => (
                  <text
                    key={line}
                    x={CAP_X + 28}
                    y={c.cy + 21 + index * 18}
                    fill="var(--muted-foreground)"
                    fontSize="11.5"
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          }
          return (
            <g key={c.tag} opacity={o} transform={`translate(${shift} 0)`}>
              <line
                x1={HB_X + HB_W + 14}
                y1={c.cy}
                x2={CAP_X - 22}
                y2={c.cy}
                stroke={c.accent}
                strokeOpacity="0.4"
              />
              <circle cx={CAP_X - 22} cy={c.cy} r="3.4" fill={c.accent} />
              <rect
                x={CAP_X}
                y={y}
                width={CAP_W}
                height={h}
                rx="16"
                fill="url(#uPanel)"
                stroke={c.accent}
                strokeOpacity="0.35"
              />
              <rect x={CAP_X} y={y + 16} width="3" height={h - 32} fill={c.accent} opacity="0.85" />
              <text x={CAP_X + 34} y={y + 34} fill={c.accent} fontSize="10" letterSpacing="3.4">
                {c.tag}
              </text>
              <text
                x={CAP_X + 34}
                y={y + 62}
                fill="var(--foreground)"
                fontSize="24"
                letterSpacing="-0.4"
              >
                {c.title}
              </text>
              {lines.map((ln, k) => (
                <text
                  key={ln}
                  x={CAP_X + 34}
                  y={y + 94 + k * 24}
                  fill="var(--muted-foreground)"
                  fontSize="15"
                >
                  {ln}
                </text>
              ))}
            </g>
          );
        })}

        {/* semantic layer → command center */}
        {Array.from({ length: 4 }).map((_, i) => {
          const x0 = HB_X + HB_W;
          const x1 = DB_X;
          const y1 = SEM_CY + (i - 1.5) * 22;
          const y2 = DB_Y + 190 + i * 140;
          const lead = Math.max(40, (x1 - x0) * 0.22);

          const a = x0 + lead;
          const b = x1 - lead;
          const mxp = (a + b) / 2;
          const d = `M ${x0} ${y1} L ${a} ${y1} C ${mxp} ${y1}, ${mxp} ${y2}, ${b} ${y2} L ${x1} ${y2}`;
          return (
            <g key={`o-${i}`}>
              <path
                d={d}
                fill="none"
                stroke="url(#uGold)"
                strokeOpacity={0.26 * flowOut}
                strokeWidth="4"
                strokeLinecap="round"
                style={{ filter: "url(#uGlow)" }}
              />
              <path
                d={d}
                fill="none"
                stroke="url(#uGold)"
                strokeOpacity={0.9 * flowOut}
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <Packet
                d={d}
                color="oklch(0.86 0.14 82)"
                dur={2.8 + i * 0.24}
                begin={i * 0.35}
                opacity={flowOut}
                r={3.2}
              />
              <Packet
                d={d}
                color="oklch(0.76 0.11 82)"
                dur={2.8 + i * 0.24}
                begin={i * 0.35 + 1.4}
                opacity={0.7 * flowOut}
                r={2}
              />
            </g>
          );
        })}



        <g
          opacity={dash * (1 - 0.92 * brief)}
          style={{ filter: brief > 0.01 ? `blur(${(14 * brief).toFixed(2)}px)` : undefined }}
        >

          <rect
            x={DB_X - 10}
            y={DB_Y - 10}
            width={DB_W + 20}
            height={DB_H + 20}
            rx="28"
            fill="none"
            stroke="url(#uSilver)"
            strokeOpacity="0.16"
          />
          <text x={DB_X} y={DB_Y - 30} fill="var(--data)" fontSize="13" letterSpacing="3.6">
            EXECUTIVE OPERATING SYSTEM
          </text>
          {dash > 0.01 ? (
          <foreignObject x={DB_X} y={DB_Y} width={DB_W} height={DB_H}>
            <div
              // @ts-expect-error — xmlns is valid inside foreignObject
              xmlns="http://www.w3.org/1999/xhtml"
              style={{ width: `${DB_W}px` }}
            >
              <AppDashboard />
            </div>
          </foreignObject>
          ) : null}

        </g>

        {/* ---------- 05 EXECUTIVE BRIEFING — zoomed in, everything else blurs away ---------- */}
        {brief > 0.005 ? (
          <g>
            {/* the panel grows out of the card's own position in the dashboard */}
            <g
              opacity={Math.min(1, brief * 1.6)}
              transform={`translate(${BR_X + BR_W / 2} ${BR_Y + BR_H / 2}) scale(${mix(
                LN_W / BR_W,
                1,
                brief,
              )}) translate(${-(BR_X + BR_W / 2)} ${-(BR_Y + BR_H / 2)})`}
            >

              <rect
                x={BR_X - 10}
                y={BR_Y - 10}
                width={BR_W + 20}
                height={BR_H + 20}
                rx="26"
                fill="var(--background)"
                fillOpacity="0.9"
                stroke="url(#uGold)"
                strokeOpacity="0.45"
              />
              <text x={BR_X} y={BR_Y - 30} fill="var(--gold)" fontSize="13" letterSpacing="3.6">
                EXECUTIVE BRIEFING · IN FOCUS
              </text>
              {brief > 0.01 ? (
                <foreignObject x={BR_X} y={BR_Y} width={BR_W} height={BR_H}>
                  <div
                    // @ts-expect-error — xmlns is valid inside foreignObject
                    xmlns="http://www.w3.org/1999/xhtml"
                    style={{ width: `${BR_W}px` }}
                  >
                    <ExecutiveBriefing />
                  </div>
                </foreignObject>
              ) : null}
            </g>
          </g>
        ) : null}


        {/* executive briefing → agents */}
        {AGENTS.map(([a], i) => {
          const x0 = BR_X + BR_W;
          const lead = 140;
          const y1 = BR_Y + 120 + i * 100;
          const y2 = agY(i) + AG_CH / 2;
          const s = x0 + lead;
          const e = AG_X - lead;
          const mxp = (s + e) / 2;
          const d = `M ${x0} ${y1} L ${s} ${y1} C ${mxp} ${y1}, ${mxp} ${y2}, ${e} ${y2} L ${AG_X} ${y2}`;

          return (
            <g key={`a-${a}`}>
              <path
                d={d}
                fill="none"
                stroke="var(--data)"
                strokeOpacity={0.3 * agents}
                strokeWidth="4"
                style={{ filter: "url(#uGlow)" }}
              />
              <path d={d} fill="none" stroke="var(--data)" strokeOpacity={0.9 * agents} strokeWidth="1.4" />
              <Packet d={d} color="var(--data)" dur={2.4 + i * 0.3} begin={i * 0.4} opacity={agents} r={3.2} />
            </g>
          );
        })}


        {/* ---------- 06 AI AGENTS ---------- */}
        <g opacity={agents}>
          <text x={AG_X} y={agY(0) - 48} fill="var(--gold)" fontSize="13" letterSpacing="3.6">
            AI AGENTS DEPLOYED
          </text>
          <text
            x={AG_X}
            y={agY(0) - 26}
            fill="var(--muted-foreground)"
            fontSize="9.5"
            letterSpacing="1.8"
          >
            GOVERNED ACTION ON THE SAME DEFINITIONS · HUMAN-IN-THE-LOOP
          </text>
          {AGENTS.map(([a, note, result, impact], i) => (
            <g key={a} opacity={phase(p, 0.885 + i * 0.012, 0.925 + i * 0.012)}>
              <rect
                x={AG_X}
                y={agY(i)}
                width={AG_W}
                height={AG_CH}
                rx="14"
                fill="oklch(0.22 0.025 258 / 78%)"
                stroke="var(--gold)"
                strokeOpacity="0.28"
              />
              <circle cx={AG_X + 30} cy={agY(i) + 34} r="5.5" fill="var(--gold)" opacity="0.8">
                <animate
                  attributeName="opacity"
                  values="0.25;0.95;0.25"
                  dur={`${2 + i * 0.4}s`}
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx={AG_X + 30} cy={agY(i) + 34} r="5.5" fill="none" stroke="var(--gold)" strokeOpacity="0.5">
                <animate attributeName="r" values="5.5;18" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
                <animate
                  attributeName="stroke-opacity"
                  values="0.5;0"
                  dur={`${2 + i * 0.4}s`}
                  repeatCount="indefinite"
                />
              </circle>
              <text x={AG_X + 54} y={agY(i) + 30} fill="var(--foreground)" fontSize="13" opacity="0.92">
                {a}
              </text>
              <text x={AG_X + 54} y={agY(i) + 48} fill="var(--muted-foreground)" fontSize="8.5" letterSpacing="1.6">
                {note}
              </text>
              <line
                x1={AG_X + 54}
                y1={agY(i) + 58}
                x2={AG_X + AG_W - 20}
                y2={agY(i) + 58}
                stroke="var(--gold)"
                strokeOpacity="0.16"
              />
              <text x={AG_X + 54} y={agY(i) + 76} fill="oklch(0.93 0.01 250)" fontSize="10" opacity="0.9">
                {result}
              </text>
              <text
                x={AG_X + AG_W - 20}
                y={agY(i) + 76}
                textAnchor="end"
                fill="var(--gold)"
                fontSize="10"
                letterSpacing="0.6"
              >
                {impact}
              </text>
              <rect
                x={AG_X + AG_W - 78}
                y={agY(i) + 16}
                width={58}
                height={16}
                rx="8"
                fill="var(--gold)"
                fillOpacity="0.14"
              />
              <text
                x={AG_X + AG_W - 49}
                y={agY(i) + 27}
                textAnchor="middle"
                fill="var(--gold)"
                fontSize="7.5"
                letterSpacing="1.4"
              >
                ACTIVE
              </text>
            </g>
          ))}

          {/* write-back loop into the systems of record */}
          {(() => {
            const yb = agY(AGENTS.length - 1) + AG_CH;
            const wb = `M ${AG_X + AG_W / 2} ${yb} C ${AG_X + AG_W / 2} ${yb + 200}, ${SRC_X + 120} ${yb + 230}, ${SRC_X + 120} ${srcY(5) + 58}`;
            return (
              <>
                <path
                  d={wb}
                  fill="none"
                  stroke="var(--gold)"
                  strokeOpacity={0.35 * writeback}
                  strokeWidth="1.1"
                  strokeDasharray="6 8"
                >
                  <animate attributeName="stroke-dashoffset" values="0;-28" dur="1.4s" repeatCount="indefinite" />
                </path>
                <Packet d={wb} color="var(--gold)" dur={4.4} opacity={0.9 * writeback} />
                <Packet d={wb} color="var(--gold)" dur={4.4} begin={2.2} opacity={0.55 * writeback} r={1.8} />
                <text
                  x={(AG_X + SRC_X) / 2}
                  y={yb + 232}
                  textAnchor="middle"
                  fill="var(--gold)"
                  fontSize="9"
                  letterSpacing="2.6"
                  opacity={0.75 * writeback}
                >
                  WRITE-BACK TO SYSTEMS OF RECORD
                </text>
              </>
            );
          })()}
        </g>
      </g>

      <rect x="0" y="0" width={vw} height={H} fill="url(#uVig)" />
    </svg>
  );
}

export function FlowUnified({ lifecycle = false }: { lifecycle?: boolean }) {
  const { ref, p } = useScrollProgress();
  const [desktop, setDesktop] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(W);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReducedMotion(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.height > 0) setVw(Math.round(cl((r.width / r.height) * H, 700, 3200)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* copy is pinned to the art beats, not to an even split of the track */
  const copyStages = lifecycle ? lifecycleStages : stages;
  const BEATS = lifecycle ? [0, 0.2, 0.55, 0.8] : [0, 0.17, 0.4, 0.745, 0.83, 0.905];
  let active = 0;
  for (let i = 0; i < BEATS.length; i++) if (p >= BEATS[i]!) active = i;

  const sceneProgress = lifecycle
    ? p < 0.2
      ? mix(0, 0.4, p / 0.2)
      : p < 0.55
        ? mix(0.4, 0.745, (p - 0.2) / 0.35)
        : p < 0.8
          ? mix(0.745, 0.905, (p - 0.55) / 0.25)
          : mix(0.905, 1, (p - 0.8) / 0.2)
    : p;

  const staticProgress = lifecycle ? [0.1, 0.38, 0.67, 0.91] : [0.08, 0.56, 0.82, 0.965];


  return (
    <section id="how" className="relative border-b border-gl-border">
      <div
        ref={ref}
        className={`relative max-lg:h-auto ${lifecycle ? "h-[600vh] max-lg:hidden motion-reduce:lg:hidden" : "h-[2400vh]"}`}
      >
        <div className="sticky top-0 h-screen overflow-hidden max-lg:static max-lg:h-auto">
          <div ref={stageRef} className="absolute inset-0 max-lg:relative max-lg:aspect-[4/3]">
            {lifecycle ? (
              <LifecycleScene p={desktop ? p : 0.5} vw={vw} />
            ) : (
              <Scene p={desktop ? sceneProgress : 0.5} vw={vw} recoverLogos={false} />
            )}

            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_92%_74%_at_50%_50%,transparent,var(--background))] opacity-25" />
            <div
              className={`pointer-events-none absolute inset-y-0 left-0 max-lg:hidden ${
                lifecycle
                  ? "w-[47%] [background:linear-gradient(90deg,var(--background)_68%,color-mix(in_oklab,var(--background)_88%,transparent)_82%,transparent)]"
                  : "w-[40%] [background:linear-gradient(90deg,var(--background)_52%,color-mix(in_oklab,var(--background)_74%,transparent)_80%,transparent)]"
              }`}
            />
          </div>

          <div className="relative flex h-full items-center">
            <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-10">
              <div className="max-w-[23rem]">
                <p className="eyebrow mb-4">How it works</p>
                <h2 className="font-gl-display text-3xl leading-tight tracking-tight text-gradient-light sm:text-4xl">
                  Turn everything your business knows into intelligent action.
                </h2>

                {lifecycle && (
                  <p className="mt-4 text-sm leading-relaxed text-gl-muted-foreground">
                    Operational data, organizational knowledge, and external intelligence, connected in one governed layer.
                  </p>
                )}

                <div className="relative mt-12 lg:h-[15rem]">
                  {copyStages.map((s, i) => (
                    <div
                      key={s.title}
                      className="transition-all duration-700 ease-out lg:absolute lg:inset-0 max-lg:mb-10 max-lg:!translate-y-0 max-lg:!opacity-100 max-lg:!blur-0"
                      style={{
                        opacity: active === i ? 1 : 0,
                        transform: `translateY(${active === i ? 0 : 16}px)`,
                        filter: active === i ? "blur(0px)" : "blur(6px)",
                        pointerEvents: active === i ? "auto" : "none",
                      }}
                    >
                      <p className="font-gl-mono text-[0.65rem] tracking-[0.24em] text-gl-data">
                        {s.index} / {lifecycle ? "04" : "06"}
                      </p>
                      <h3 className="mt-4 font-gl-display text-2xl tracking-tight sm:text-[1.75rem]">
                        {s.title}
                      </h3>
                      <p className="mt-3 font-gl-display text-base text-gl-gold/90">{s.lede}</p>
                      <p className="mt-4 text-[0.92rem] leading-relaxed text-gl-muted-foreground">
                        {s.body}
                      </p>
                    </div>
                  ))}

                  <div className="mt-8 flex gap-1.5 lg:absolute lg:bottom-0 lg:left-0 lg:mt-0">
                    {copyStages.map((s, i) => (
                      <span
                        key={s.title}
                        className="h-[2px] w-9 rounded-full transition-colors duration-500"
                        style={{ background: i <= active ? "var(--data)" : "var(--border)" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {lifecycle && (
        <div className={`mx-auto max-w-6xl space-y-16 px-6 pb-20 pt-10 lg:px-10 ${reducedMotion ? "lg:block" : "lg:hidden"}`}>
          <div>
            <p className="eyebrow mb-4">How it works</p>
            <h2 className="max-w-2xl font-gl-display text-3xl leading-tight tracking-tight text-gradient-light sm:text-4xl">
              Turn everything your business knows into intelligent action.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gl-muted-foreground">
              Operational data, organizational knowledge, and external intelligence, connected in one governed layer.
            </p>
          </div>

          {lifecycleStages.map((stage, index) => (
            <article key={stage.title} className="border-t border-gl-border/70 pt-9">
              <div className="grid gap-7 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-center">
                <div>
                  <p className="font-gl-mono text-[0.65rem] tracking-[0.24em] text-gl-data">{stage.index} / 04</p>
                  <h3 className="mt-4 font-gl-display text-2xl tracking-tight">{stage.title}</h3>
                  <p className="mt-3 font-gl-display text-base text-gl-gold/90">{stage.lede}</p>
                  <p className="mt-4 text-[0.92rem] leading-relaxed text-gl-muted-foreground">{stage.body}</p>
                </div>
                <div className="relative aspect-[16/10] min-h-[18rem] overflow-hidden rounded-lg border border-gl-border/60 bg-gl-background">
                  <LifecycleScene p={staticProgress[index]!} vw={W} />
                  <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_94%_82%_at_50%_50%,transparent,var(--background))] opacity-15" />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
