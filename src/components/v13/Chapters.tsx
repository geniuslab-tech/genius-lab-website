import { ArrowRight, Check } from "@phosphor-icons/react/dist/ssr";
import { BrandLogo } from "@/components/v2/ui";
import { AgentDemo } from "./AgentDemo";
import { FilmFrame } from "./FilmFrame";
import { Btn, Chapter, Label, h2Class } from "./ui";

const lead = "text-pretty mt-8 max-w-[54ch] text-[1.0625rem] leading-[1.75] v13-soft";

/* 01 Complexity */
const LOGOS = ["Vanta Group", "Helios", "Caldera", "Orbis", "Stratum", "Northpeak"];
export function HeroCh() {
  return (
    <Chapter index={0} labelledBy="v13-hero-title" visualAfter>
      <Label>One partner. One platform. One source of truth.</Label>
      <h1 id="v13-hero-title" className="v13-display v13-hero-title mt-7">
        Transform Business Complexity into Strategic Advantage
      </h1>
      <p className="mt-9 max-w-[40ch] text-[1.1875rem] font-semibold leading-snug tracking-[-0.01em]">
        A fully managed intelligence and execution layer for your entire business.
      </p>
      <p className="text-pretty mt-4 max-w-[52ch] text-[1.0625rem] leading-[1.75] v13-soft">
        We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the
        software you already rely on.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Btn href="#action">See Genius Lab in action</Btn>
        <Btn href="#contact" tone="line">
          Book a demo
        </Btn>
      </div>
      <div className="v13-rule mt-16 border-t pt-6">
        <p className="v13-label v13-muted">Trusted by operators, manufacturers and value creation teams · placeholder marks</p>
        <ul className="mt-5 flex flex-wrap gap-x-10 gap-y-3" aria-label="Client logos (placeholders)">
          {LOGOS.map((l) => (
            <li key={l} className="v13-mark">
              {l}
            </li>
          ))}
        </ul>
      </div>
    </Chapter>
  );
}

/* 02 Cost of growth */
const COUNTS = [
  { label: "Systems", from: 3, to: 46 },
  { label: "Reports", from: 8, to: 940 },
  { label: "Manual handoffs", from: 2, to: 210 },
  { label: "People in a decision", from: 2, to: 19 },
];
export function ProblemCh() {
  return (
    <Chapter index={1} labelledBy="v13-problem-title">
      <Label>The problem</Label>
      <h2 id="v13-problem-title" className={`${h2Class} mt-7 max-w-[14ch]`}>
        Complexity Is the Cost of Growth
      </h2>
      <p className={lead}>
        Systems, teams, and processes expand. What once worked starts to strain, and people become the glue holding
        everything together. Leadership loses visibility, execution slows down, and the business pays the price.
      </p>

      <dl className="v13-rule mt-14 grid grid-cols-2 border-t">
        {COUNTS.map((c, i) => (
          <div key={c.label} className={`v13-rule border-b py-6 ${i % 2 === 0 ? "border-r pr-4" : "pl-5 sm:pl-8"}`}>
            <dt className="v13-label v13-muted">{c.label}</dt>
            <dd className="mt-3 flex items-baseline gap-3">
              <span className="font-mono text-[0.875rem] v13-muted">{c.from}</span>
              <ArrowRight size={13} className="v13-muted" aria-hidden="true" />
              <span className="v13-display text-[clamp(2rem,4.4cqw,2.75rem)]">{c.to.toLocaleString("en-US")}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="v13-label v13-muted mt-4">Founding to enterprise · illustrative</p>

      <p className="text-pretty mt-16 max-w-[34ch] text-[1.25rem] font-medium leading-[1.5]">
        When the business becomes fragmented, replacing systems can feel like the natural next step.
      </p>
      <h3 className="v13-display mt-14 text-[clamp(1.875rem,4cqw,2.75rem)]">
        Solve the <span className="v13-accent">Right</span> Problem.
      </h3>
      <p className={lead}>
        Sometimes replacement is necessary. But often, the problem can be solved without the cost, operational load, and
        disruption risk of a system transition. Building on what already works reduces complexity, expands capabilities,
        and unlocks more value from your systems and people.
      </p>
    </Chapter>
  );
}

/* 03 Four layers */
const LAYERS = [
  {
    n: "01",
    name: "Data Engineering",
    role: "The foundation.",
    body: "We connect your systems and engineer their data into one governed, reliable foundation: integration, pipelines, modeling and quality.",
    gives: ["Connected systems", "A unified data platform", "Trusted, tested pipelines"],
  },
  {
    n: "02",
    name: "Analytics",
    role: "Organized data becomes understanding.",
    body: "Analysis and modeling explain what is happening, why it is happening and what is likely to happen next.",
    gives: ["Performance analysis", "Forecasts and drivers", "Customer and operational insight"],
  },
  {
    n: "03",
    name: "Business Intelligence",
    role: "Understanding becomes visible.",
    body: "One set of definitions behind every dashboard and report, so leadership sees the same numbers, at the same time.",
    gives: ["Executive dashboards", "Shared metrics and KPIs", "Self-service reporting"],
  },
  {
    n: "04",
    name: "Artificial Intelligence",
    role: "Visibility gains context and reasoning.",
    body: "AI learns your business context and becomes its Second Brain. AI Agents reason across systems, tables, metrics and processes to answer and act.",
    gives: ["Second Brain", "AI Agents", "Orchestrated execution"],
  },
];
export function LayersCh() {
  return (
    <Chapter index={2} labelledBy="v13-layers-title">
      <Label>Platform</Label>
      <h2 id="v13-layers-title" className={`${h2Class} mt-7 max-w-[17ch]`}>
        One intelligence and execution layer across your business.
      </h2>
      <p className={lead}>Not four products. Every layer is built on the one beneath it, and the top of the stack is a better decision.</p>

      <ol className="mt-14" aria-label="Layers, foundation first">
        {LAYERS.map((l) => (
          <li key={l.n} className="v13-rule grid gap-x-8 gap-y-4 border-t py-9 sm:grid-cols-[5.5rem_minmax(0,1fr)]">
            <span className="v13-layer-n" aria-hidden="true">
              {l.n}
            </span>
            <div>
              <h3 className="text-[1.5rem] font-semibold tracking-[-0.02em]">
                <span className="sr-only">Layer {l.n}: </span>
                {l.name}
              </h3>
              <p className="v13-accent mt-1 font-medium">{l.role}</p>
              <p className="v13-soft mt-3 max-w-[56ch] leading-[1.7]">{l.body}</p>
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.8125rem]" aria-label={`${l.name} delivers`}>
                {l.gives.map((g) => (
                  <li key={g} className="flex items-center gap-2">
                    <span className="v13-dot" aria-hidden="true" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
        <li data-theme="light" className="v13-inset mt-4 p-7 sm:p-9">
          <p className="v13-label">The outcome</p>
          <h3 className="v13-display mt-4 text-[clamp(1.75rem,4cqw,2.5rem)]">Better business decisions</h3>
          <p className="mt-4 max-w-[52ch] leading-[1.7] v13-soft">
            Each layer builds on the one beneath it. Together they give executives clear insight, full visibility and the
            confidence to act.
          </p>
        </li>
      </ol>
    </Chapter>
  );
}

/* 04 Second Brain */
const TOPICS = [
  {
    name: "Semantic Context",
    body: "What every number means. Shared definitions for metrics, tables and dashboards, so revenue means the same thing in every report.",
    tags: ["Metrics", "Definitions", "Dashboards"],
  },
  {
    name: "Business Context",
    body: "How the company actually works. Customers, operations and finance, and the relationships that connect them.",
    tags: ["Customers", "Operations", "Finance"],
  },
  {
    name: "Event Context",
    body: "What is happening right now. Transactions, process steps and system events, captured as they occur.",
    tags: ["Transactions", "Process steps", "System events"],
  },
];
export function BrainCh() {
  return (
    <Chapter index={3} labelledBy="v13-brain-title">
      <Label>Second Brain</Label>
      <h2 id="v13-brain-title" className={`${h2Class} mt-7 max-w-[14ch]`}>
        A Second Brain for your business.
      </h2>
      <p className={lead}>
        The intelligence layer holds the full context of the company: its systems, tables, metrics, dashboards, processes,
        customers, operations and finances. AI Agents work on top of it, end to end.
      </p>
      <ol className="mt-14" aria-label="Context in the Second Brain">
        {TOPICS.map((t, i) => (
          <li key={t.name} className="v13-rule border-t py-8">
            <div className="flex items-baseline justify-between gap-6">
              <h3 className="text-[1.375rem] font-semibold tracking-[-0.015em]">{t.name}</h3>
              <span className="v13-label v13-muted">0{i + 1}</span>
            </div>
            <p className="v13-soft mt-3 max-w-[56ch] leading-[1.7]">{t.body}</p>
            <p className="mt-4 font-mono text-[0.8125rem] v13-accent">{t.tags.join("  /  ")}</p>
          </li>
        ))}
      </ol>
    </Chapter>
  );
}

/* 05 AI Agents */
export function AgentsCh() {
  return (
    <Chapter index={4} labelledBy="v13-agents-title">
      <Label>AI Agents</Label>
      <h2 id="v13-agents-title" className={`${h2Class} mt-7 max-w-[14ch]`}>
        AI Agents that know your business.
      </h2>
      <p className={lead}>
        Built on the Second Brain, Genius agents answer executive questions end to end, reading the systems, tables and
        metrics behind every number.
      </p>
      <AgentDemo />
    </Chapter>
  );
}

/* 06 Ontology */
const AXES = [
  { name: "Data", role: "The facts", body: "Every system connected and reconciled into one set of trusted records." },
  { name: "Analytics", role: "The meaning", body: "Metrics and rules defined once, on the business objects themselves." },
  { name: "AI", role: "The reasoning", body: "Agents that read the model, answer questions and act on what they find." },
  { name: "People", role: "The judgement", body: "Owners, roles and decisions: who is accountable, who approves, who acts." },
  { name: "Business Context", role: "The why", body: "Strategy, processes and rules of the business that give every number its purpose." },
];
export function OntologyCh() {
  return (
    <Chapter index={5} labelledBy="v13-ontology-title">
      <Label>Our approach</Label>
      <h2 id="v13-ontology-title" className={`${h2Class} mt-7 max-w-[14ch]`}>
        Data Ontology Intelligence.
      </h2>
      <p className={lead}>
        We are not only a data, analytics or AI company. We work where data, analytics, AI, people and business context
        meet.
      </p>
      <p className="v13-soft text-pretty mt-5 max-w-[56ch] leading-[1.75]">
        An ontology is a living model of your business: its objects, such as customers, orders, products and suppliers, the
        relationships between them, and the rules that give them meaning. Every axis works on that same model, so they move
        in harmony instead of in hand-offs.
      </p>
      <dl className="mt-14" aria-label="The five axes">
        {AXES.map((a) => (
          <div key={a.name} className="v13-rule grid gap-x-8 gap-y-2 border-t py-6 sm:grid-cols-[11rem_minmax(0,1fr)]">
            <dt>
              <span className="block text-[1.1875rem] font-semibold tracking-[-0.015em]">{a.name}</span>
              <span className="v13-label v13-accent mt-1 block">{a.role}</span>
            </dt>
            <dd className="v13-soft leading-[1.7]">{a.body}</dd>
          </div>
        ))}
      </dl>
    </Chapter>
  );
}

/* 07 Genius Portal + managed service */
const MODULES = [
  { name: "Connectors", body: "Ready integrations for ERP, CRM, finance, files and APIs." },
  { name: "Data Transformation", body: "Pipelines that clean, model and unify data, tested like software." },
  { name: "Analytics", body: "Dashboards, drill-downs and forecasts on one shared model." },
  { name: "Governance", body: "Definitions, lineage, access and audit trails in one place." },
  { name: "Automation", body: "Alerts, workflows and scheduled actions across your systems." },
  { name: "AI Agents", body: "Agents that read the Second Brain and answer or act." },
];
const SYSTEMS = ["ERP", "CRM", "Warehouse", "BI tools", "Sheets", "Cloud apps"];
const STEPS = [
  { name: "Design", body: "We map your systems, data and decisions, and design the target architecture." },
  { name: "Build", body: "We connect, engineer, model and deploy every layer, on the Genius Portal." },
  { name: "Run", body: "We host, monitor and support it, with clear service levels." },
  { name: "Improve", body: "We keep extending metrics, dashboards and agents as the business changes." },
];
const INCLUDED = ["Implementation", "Hosting", "Monitoring", "Security", "Support", "Continuous improvement"];
export function PlatformCh() {
  return (
    <Chapter index={6} labelledBy="v13-portal-title">
      <Label>Genius Portal</Label>
      <h2 id="v13-portal-title" className={`${h2Class} mt-7 max-w-[15ch]`}>
        Expertise and technology, working as one.
      </h2>
      <p className={lead}>
        Our specialists build on the Genius Portal, our own platform. Everything a client needs to connect, govern and run
        intelligence lives in one place.
      </p>

      <ol className="v13-rule mt-14 grid border-t sm:grid-cols-2" aria-label="Inside the Genius Portal">
        {MODULES.map((m, i) => (
          <li key={m.name} className={`v13-rule border-b py-6 ${i % 2 === 0 ? "sm:border-r sm:pr-8" : "sm:pl-8"}`}>
            <span className="v13-label v13-muted">0{i + 1}</span>
            <h3 className="mt-3 text-[1.1875rem] font-semibold tracking-[-0.015em]">{m.name}</h3>
            <p className="v13-soft mt-1.5 leading-[1.65]">{m.body}</p>
          </li>
        ))}
      </ol>

      <div data-theme="light" className="v13-inset mt-12 p-7 sm:p-9">
        <p className="v13-label">Integrations</p>
        <p className="v13-display mt-4 max-w-[20ch] text-[clamp(1.5rem,3.4cqw,2rem)]">Keep the technology that already runs the business.</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <ul className="flex flex-wrap gap-2" aria-label="ERP, CRM, data warehouse, BI tools, spreadsheets and cloud apps all connect into Genius Lab.">
            {SYSTEMS.map((s) => (
              <li key={s} className="v13-sys">
                {s}
              </li>
            ))}
          </ul>
          <span className="flex items-center gap-3" aria-hidden="true">
            <ArrowRight size={16} />
            <span className="v13-logo-white">
              <BrandLogo tone="white" className="h-[13px] w-auto" />
            </span>
            <span className="v13-logo-navy">
              <BrandLogo tone="navy" className="h-[13px] w-auto" />
            </span>
          </span>
        </div>
      </div>

      <h3 id="v13-managed-title" className="v13-display mt-24 text-[clamp(1.875rem,4.4cqw,3rem)]">
        Fully managed by Genius Lab.
      </h3>
      <p className={lead}>
        You don&rsquo;t need to hire a data team, stitch tools together or maintain infrastructure. We implement everything,
        hand it over ready to use, and keep it running.
      </p>
      <ol className="mt-12 grid gap-x-8 sm:grid-cols-2" aria-labelledby="v13-managed-title">
        {STEPS.map((s, i) => (
          <li key={s.name} className="v13-rule border-t py-6">
            <span className="font-mono text-[0.8125rem] v13-accent">0{i + 1}</span>
            <p className="mt-3 text-[1.25rem] font-semibold tracking-[-0.015em]">We {s.name.toLowerCase()} it.</p>
            <p className="v13-soft mt-1.5 max-w-[34ch] leading-[1.65]">{s.body}</p>
          </li>
        ))}
      </ol>
      <div className="v13-rule mt-6 border-t pt-6">
        <p className="v13-label v13-muted">Included in every engagement</p>
        <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3" aria-label="Included">
          {INCLUDED.map((x) => (
            <li key={x} className="flex items-center gap-2.5 text-[0.9375rem] font-medium">
              <span className="v13-tick" aria-hidden="true">
                <Check size={10} weight="bold" />
              </span>
              {x}
            </li>
          ))}
        </ul>
      </div>
    </Chapter>
  );
}

/* 08 Solutions */
const SEGMENTS = [
  {
    name: "Investment Firms",
    body: "One live view across every portfolio company, with value creation tracked against the plan.",
    outcomes: ["Portfolio monitoring", "Value creation plans", "Board-ready reporting"],
  },
  {
    name: "M&A Teams",
    body: "Diligence on real data, then integration that connects two companies' systems from day one.",
    outcomes: ["Data-driven diligence", "Day-one integration", "Synergy tracking"],
  },
  {
    name: "Multi-Entity Companies",
    body: "Every entity, currency and ledger consolidated into one trusted group picture.",
    outcomes: ["Automated consolidation", "Entity comparisons", "Group-wide KPIs"],
  },
  {
    name: "Operating Companies",
    body: "Daily operations run on shared numbers, with agents that flag what needs attention.",
    outcomes: ["Operational dashboards", "Forecasting", "Proactive alerts"],
  },
];
export function SolutionsCh() {
  return (
    <Chapter index={7} labelledBy="v13-segments-title">
      <Label>Solutions</Label>
      <h2 id="v13-segments-title" className={`${h2Class} mt-7 max-w-[15ch]`}>
        Value creation for every stage of growth.
      </h2>
      <ul className="mt-14">
        {SEGMENTS.map((s, i) => (
          <li key={s.name} className="v13-rule grid gap-x-8 gap-y-3 border-t py-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div>
              <span className="v13-label v13-muted">0{i + 1}</span>
              <h3 className="mt-3 text-[1.5rem] font-semibold tracking-[-0.02em]">{s.name}</h3>
              <p className="v13-soft mt-2 max-w-[44ch] leading-[1.7]">{s.body}</p>
            </div>
            <ul className="space-y-2 self-end font-mono text-[0.8125rem]" aria-label={`${s.name} outcomes`}>
              {s.outcomes.map((o) => (
                <li key={o} className="flex items-center gap-2.5">
                  <span className="v13-dot" aria-hidden="true" />
                  {o}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Chapter>
  );
}

/* 09 In action */
const FILM = ["Connecting the systems", "Building the Second Brain", "Agents at work"];
export function ActionCh() {
  return (
    <Chapter index={8} labelledBy="v13-action-title">
      <Label>Product film</Label>
      <h2 id="v13-action-title" className={`${h2Class} mt-7`}>
        Genius Lab in action.
      </h2>
      <p className={lead}>From scattered systems to an agent answering a CFO&rsquo;s question.</p>
      <FilmFrame />
      <ol className="mt-5 grid gap-x-6 sm:grid-cols-3" aria-label="Film chapters">
        {FILM.map((c, i) => (
          <li key={c} className="v13-rule flex items-baseline gap-3 border-t py-4">
            <span className="font-mono text-[0.8125rem] v13-accent">0{i + 1}</span>
            <span className="font-medium">{c}</span>
          </li>
        ))}
      </ol>

      <div className="v13-rule mt-20 border-t pt-8">
        <p className="v13-label v13-muted">Clients</p>
        <h3 className="mt-4 text-[1.5rem] font-semibold tracking-[-0.02em]">Client voices, when they are ready to be quoted.</h3>
        <p className="v13-soft mt-3 max-w-[54ch] leading-[1.7]">
          This space is reserved for approved client stories. Until then, we would rather show you the work itself: a
          walkthrough on your own systems and data.
        </p>
      </div>
    </Chapter>
  );
}

/* 10 Clarity */
export function ContactCh() {
  return (
    <Chapter index={9} labelledBy="v13-cta-title">
      <Label>One partner. One platform. One source of truth.</Label>
      <h2 id="v13-cta-title" className="v13-display mt-7 max-w-[16ch] text-[clamp(2.5rem,6.4cqw,4.75rem)]">
        Turn your business knowledge into intelligent systems.
      </h2>
      <p className={lead}>
        Tell us where your systems and data stand today. We&rsquo;ll show you how Genius Lab turns them into one
        intelligence and execution layer, fully managed.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Btn href="#">Talk to us</Btn>
        <Btn href="#action" tone="line">
          Watch it in action
        </Btn>
      </div>
    </Chapter>
  );
}

/* Footer */
const COLUMNS = [
  { title: "Capabilities", links: ["Data Engineering", "Analytics", "Business Intelligence", "Artificial Intelligence"] },
  { title: "Genius", links: ["Second Brain", "AI Agents", "Genius Portal"] },
  { title: "Company", links: ["About", "Careers", "Contact"] },
];
export function FooterV13() {
  return (
    <footer data-theme="dark" className="v13-footer relative z-20">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pb-12 pt-16 sm:px-8 md:grid-cols-12 lg:px-[clamp(1.75rem,3.2vw,3.5rem)]">
        <div className="md:col-span-5">
          <BrandLogo tone="white" className="h-5 w-auto" />
          <p className="v13-soft mt-5 max-w-[34ch] leading-[1.7]">Connected systems, unified data and intelligence for the decisions that matter.</p>
        </div>
        {COLUMNS.map((c, i) => (
          <nav key={c.title} aria-label={c.title} className={`md:col-span-2 ${i === 0 ? "md:col-start-7" : ""}`}>
            <h2 className="v13-label v13-muted">{c.title}</h2>
            <ul className="mt-5 space-y-3">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="v13-navlink">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="v13-rule mx-auto flex max-w-[1440px] flex-col gap-3 border-t px-5 py-6 text-[0.8125rem] sm:flex-row sm:justify-between sm:px-8 lg:px-[clamp(1.75rem,3.2vw,3.5rem)]">
        <span className="v13-muted">&copy; 2026 Genius Lab Technology. Figures, conversations and client marks shown are illustrative.</span>
        <span className="flex gap-6">
          <a href="#" className="v13-navlink">
            Privacy
          </a>
          <a href="#" className="v13-navlink">
            Terms
          </a>
        </span>
      </div>
    </footer>
  );
}
