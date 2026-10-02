"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CaretDown as ChevronDown, List as Menu, X } from "@phosphor-icons/react";
import { Reveal } from "./Reveal";
import { FlowField, ParticleField } from "./motion";
import { AppDashboard } from "./AppDashboard";
import { ClientLogoMarquee } from "@/components/hero-demo/ClientLogos";

const brandLogo = "/brand/genius-lab-logo-white.svg";
const brandLogoBlue = { url: "/brand/logo_dark_blue.png" };

/** Design width the dashboard is rendered at before being scaled to fit its column. */
const DASHBOARD_DESIGN_WIDTH = 1250;

/**
 * Scales a fixed-width render so the whole interface is always visible,
 * proportionally resized to whatever width the screen allows.
 */
function useScaleToFit(designWidth: number) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ scale: number; height: number } | null>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const update = () => {
      const scale = outer.clientWidth / designWidth;
      setFit({ scale, height: inner.offsetHeight * scale });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [designWidth]);

  return { outerRef, innerRef, fit };
}



/** V24 ships only the hero, so nav destinations stay on this page. */
function Link({
  className,
  onClick,
  children,
}: {
  to: string;
  className?: string;
  onClick?: () => void;
  activeProps?: { className?: string };
  children: ReactNode;
}) {
  return (
    <a href="#top" className={className} onClick={onClick}>
      {children}
    </a>
  );
}

type NavItem = { label: string; to: string; description: string };

const productItems: NavItem[] = [
  {
    label: "Connectors",
    to: "/connectors",
    description: "1,000+ integrations into one governed data foundation",
  },
  {
    label: "Analytics",
    to: "/analytics",
    description: "Executive dashboards and self-serve exploration",
  },
  {
    label: "Data Transformation",
    to: "/data-transformation",
    description: "Harmonize fragmented sources into trusted data",
  },
  {
    label: "AI Reports",
    to: "/ai-reports",
    description: "Board-ready narratives from governed metrics",
  },
  {
    label: "Chart of Accounts Consolidator",
    to: "/chart-of-accounts-consolidator",
    description: "One standardized financial structure across entities",
  },
];

const solutionItems: NavItem[] = [
  {
    label: "Investment Firms",
    to: "/investment-firms",
    description: "Portfolio visibility and value creation",
  },
  {
    label: "M&A Teams",
    to: "/ma-teams",
    description: "Integrate acquired entities in weeks, not months",
  },
];

const navLinkClass =
  "whitespace-nowrap text-[0.8rem] text-gl-muted-foreground transition-colors duration-500 hover:text-gl-foreground";

/** Desktop hover/focus dropdown with a glass panel and cyan item highlights. */
function NavDropdown({
  label,
  items,
  light = false,
}: {
  label: string;
  items: NavItem[];
  light?: boolean;
}) {
  const hoverBg = light ? "hover:bg-gl-data/10" : "hover:bg-gl-cyan/10";
  const hoverText = light ? "group-hover/item:text-gl-data" : "group-hover/item:text-gl-cyan";
  return (
    <div className="group relative">
      <button
        type="button"
        aria-haspopup="true"
        className={`flex items-center gap-1.5 ${navLinkClass} group-hover:text-gl-foreground group-focus-within:text-gl-foreground`}
      >
        {label}
        <ChevronDown className="h-3 w-3 opacity-60 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" />
      </button>
      <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <div
          className={`glass-panel w-72 overflow-hidden rounded-xl p-1.5 ${
            light ? "!bg-gl-card/95 shadow-xl" : "!bg-[oklch(0.16_0.02_258/96%)]"
          }`}
        >
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`group/item block rounded-lg px-3.5 py-2.5 transition-colors duration-300 ${hoverBg}`}
              activeProps={{ className: light ? "bg-gl-data/10" : "bg-gl-cyan/10" }}
            >
              <span
                className={`block text-[0.8rem] font-medium text-gl-foreground transition-colors duration-300 ${hoverText}`}
              >
                {item.label}
              </span>
              <span className="mt-0.5 block text-[0.7rem] leading-snug text-gl-muted-foreground">
                {item.description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Collapsible group inside the mobile menu. */
function MobileGroup({
  label,
  items,
  expanded,
  onToggle,
  onNavigate,
  light = false,
}: {
  label: string;
  items: NavItem[];
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  light?: boolean;
}) {
  const accent = light ? "text-gl-data" : "text-gl-cyan";
  return (
    <div className="border-b border-gl-border/60">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between px-6 py-4 text-[0.85rem] font-medium text-gl-foreground"
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 text-gl-muted-foreground transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="pb-3">
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                className={`block px-9 py-2 text-[0.8rem] text-gl-muted-foreground transition-colors duration-300 ${light ? "hover:text-gl-data" : "hover:text-gl-cyan"}`}
                activeProps={{ className: accent }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Nav({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const closeMobile = () => setMobileOpen(false);
  const light = variant === "light";
  const mobileActive = light ? "text-gl-data" : "text-gl-cyan";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={`glass-panel border-x-0 border-t-0 !bg-gl-background ${light ? "light-band" : ""}`}>
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <a href="#top" className="flex items-center" aria-label="Genius Lab home">
            <img
              src={light ? brandLogoBlue.url : brandLogo}
              alt="Genius Lab"
              className={light ? "h-5 w-auto" : "h-4 w-auto"}
            />
          </a>
          <div className="hidden items-center gap-5 lg:flex xl:gap-7">
            <NavDropdown label="Product" items={productItems} light={light} />
            <NavDropdown label="Solutions" items={solutionItems} light={light} />
            <Link to="/about" className={navLinkClass} activeProps={{ className: "text-gl-foreground" }}>
              About
            </Link>
            <Link to="/why-genius" className={navLinkClass} activeProps={{ className: "text-gl-foreground" }}>
              Why Genius
            </Link>
            <Link to="/blog" className={navLinkClass} activeProps={{ className: "text-gl-foreground" }}>
              Blog
            </Link>
            <Link to="/partners" className={navLinkClass} activeProps={{ className: "text-gl-foreground" }}>
              Partners
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/contact-sales"
              className="hidden rounded-md px-3 py-2 text-[0.8rem] text-gl-muted-foreground transition-colors duration-500 hover:text-gl-foreground xl:block"
            >
              Contact Sales
            </Link>
            <a
              href="#demo"
              className="hidden rounded-md border border-gl-border px-3.5 py-2 text-[0.8rem] transition-colors duration-500 hover:border-gl-foreground/30 xl:block"
            >
              Watch Demo
            </a>
            <a
              href="#cta"
              className="rounded-md bg-gl-gold px-3.5 py-2 text-[0.8rem] font-medium text-gl-background transition-opacity duration-500 hover:opacity-90"
            >
              Free Trial
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="rounded-md border border-gl-border p-2 text-gl-foreground transition-colors duration-300 hover:border-gl-foreground/30 lg:hidden"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </div>

      {/* mobile menu */}
      <div
        className={`glass-panel border-x-0 !bg-gl-background transition-all duration-300 lg:hidden ${light ? "light-band" : ""} ${mobileOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <div className="mx-auto max-w-7xl py-2">
          <MobileGroup
            label="Product"
            items={productItems}
            expanded={expandedGroup === "product"}
            onToggle={() => setExpandedGroup((g) => (g === "product" ? null : "product"))}
            onNavigate={closeMobile}
            light={light}
          />
          <MobileGroup
            label="Solutions"
            items={solutionItems}
            expanded={expandedGroup === "solutions"}
            onToggle={() => setExpandedGroup((g) => (g === "solutions" ? null : "solutions"))}
            onNavigate={closeMobile}
            light={light}
          />
          <Link
            to="/about"
            onClick={closeMobile}
            className="block border-b border-gl-border/60 px-6 py-4 text-[0.85rem] font-medium text-gl-foreground"
            activeProps={{ className: mobileActive }}
          >
            About
          </Link>
          <Link
            to="/why-genius"
            onClick={closeMobile}
            className="block border-b border-gl-border/60 px-6 py-4 text-[0.85rem] font-medium text-gl-foreground"
            activeProps={{ className: mobileActive }}
          >
            Why Genius
          </Link>
          <Link
            to="/blog"
            onClick={closeMobile}
            className="block border-b border-gl-border/60 px-6 py-4 text-[0.85rem] font-medium text-gl-foreground"
            activeProps={{ className: mobileActive }}
          >
            Blog
          </Link>
          <Link
            to="/partners"
            onClick={closeMobile}
            className="block border-b border-gl-border/60 px-6 py-4 text-[0.85rem] font-medium text-gl-foreground"
            activeProps={{ className: mobileActive }}
          >
            Partners
          </Link>
          <Link
            to="/contact-sales"
            onClick={closeMobile}
            className="block px-6 py-4 text-[0.85rem] font-medium text-gl-foreground"
            activeProps={{ className: mobileActive }}
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Hero({
  variant = "default",
  v13Refinements = false,
  budgetComparison = false,
}: {
  variant?: "default" | "spotlight";
  v13Refinements?: boolean;
  budgetComparison?: boolean;
}) {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-16"
    >
      {variant === "spotlight" ? (
        /* v2 — clean stage: no line work, one blue spotlight falling from above */
        <div className="pointer-events-none absolute inset-0">
          <div className="glow-breathe absolute -top-[24rem] left-1/2 h-[50rem] w-[78rem] -translate-x-1/2 rounded-full blur-[120px] [background:radial-gradient(ellipse_at_center,oklch(0.62_0.19_252/48%),oklch(0.5_0.17_254/17%)_52%,transparent_74%)]" />
          <ParticleField count={14} tone="cyan" className="opacity-40" />
          {/* deep vignette */}
          <div className="absolute inset-0 [background:radial-gradient(ellipse_at_50%_0%,transparent_30%,var(--background)_88%)]" />
          <div className="absolute inset-x-0 bottom-0 h-64 [background:linear-gradient(180deg,transparent,var(--background))]" />
        </div>
      ) : (
        /* ambient architecture — pure light, no imagery */
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 grid-veil opacity-40" />
          {/* top bloom */}
          <div className="glow-breathe absolute -top-[26rem] left-1/2 h-[52rem] w-[76rem] -translate-x-1/2 rounded-full blur-[150px] [background:radial-gradient(ellipse_at_center,var(--data-soft),transparent_62%)]" />
          {/* upper-left cool wash */}
          <div className="absolute -left-40 -top-32 h-[34rem] w-[34rem] rounded-full blur-[130px] opacity-70 [background:radial-gradient(circle_at_center,var(--data-soft),transparent_68%)]" />
          {/* cyan wash behind the copy */}
          <div className="glow-breathe absolute -left-24 top-1/3 h-[26rem] w-[26rem] rounded-full blur-[120px] opacity-70 [background:radial-gradient(circle_at_center,var(--cyan-soft),transparent_70%)]" />
          {/* animated data paths + particles */}
          <FlowField className="absolute inset-x-0 top-14 h-[30rem] w-full opacity-30" colorVar="--cyan" />
          <ParticleField count={18} tone="cyan" className="opacity-60" />
          {/* deep vignette */}
          <div className="absolute inset-0 [background:radial-gradient(ellipse_at_50%_0%,transparent_35%,var(--background)_85%)]" />
          <div className="absolute inset-x-0 bottom-0 h-64 [background:linear-gradient(180deg,transparent,var(--background))]" />
        </div>
      )}


      <div className="relative mx-auto grid max-w-[112rem] grid-cols-[minmax(0,1fr)] items-center gap-10 px-6 pt-20 lg:grid-cols-[minmax(0,36rem)_minmax(0,1fr)] lg:gap-8 lg:px-10 lg:pt-8 xl:grid-cols-[minmax(0,40rem)_minmax(0,1fr)] xl:gap-10">
        <Reveal className="self-center min-w-0">
          <p className="eyebrow mb-8">One partner. One platform. One source of truth.</p>
          <div className="lg:w-fit">
            <h1 className="font-gl-display text-[2.15rem] font-semibold leading-[1.06] tracking-[-0.03em] text-gradient-light sm:text-[2.4rem] lg:whitespace-nowrap lg:text-[2.6rem] xl:text-[2.5rem]">
              <span className="block">Transform Business Complexity</span>

              <span className="block">into Strategic Advantage</span>
            </h1>
            <p className={`${v13Refinements ? "mt-10" : "mt-8"} max-w-[38rem] text-[1.05rem] leading-relaxed text-gl-muted-foreground lg:max-w-[40.5rem]`}>
              <span className={`font-medium text-gl-foreground ${v13Refinements ? "lg:block" : ""}`}>
                A fully managed intelligence and execution layer for your entire business.
              </span>{" "}
              <span className={v13Refinements ? "lg:mt-2 lg:block" : ""}>
                We connect your systems and unify your data to deliver clear insights and orchestrate execution, building on the software you already rely on.
              </span>
            </p>
          </div>


          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#demo"
              className="light-sweep rounded-md bg-gl-gold px-6 py-3.5 text-sm font-medium text-gl-background transition-opacity duration-500 hover:opacity-90"
            >
              See Genius Lab in action
            </a>
            <a
              href="#cta"
              className="rounded-md border border-gl-border px-6 py-3.5 text-sm transition-colors duration-500 hover:border-gl-foreground/30"
            >
              Book a demo
            </a>
          </div>

          {/* client logos, anchored under the CTAs */}
          <Reveal delay={380} className="mt-14 lg:mt-16">
            <p className={`text-[0.62rem] uppercase tracking-[0.3em] ${v13Refinements ? "text-gl-muted-foreground/65" : "text-gl-muted-foreground/55"}`}>
              Trusted by operators, manufacturers and value creation teams
            </p>
            <ClientLogoMarquee className="mt-5" dim={v13Refinements ? "opacity-55" : "opacity-45"} />
          </Reveal>
        </Reveal>

        <HeroDashboard budgetComparison={budgetComparison} />
      </div>

      <div className="h-16 lg:h-20" />
    </section>
  );
}

/**
 * Hero product surface. On desktop the interface is rendered at a fixed design
 * width, scaled to a column that is deliberately wider than the grid track, so
 * the right side of the dashboard bleeds past the viewport edge (clipped by the
 * section). Below lg it falls back to the natural fluid layout.
 */
function HeroDashboard({ budgetComparison = false }: { budgetComparison?: boolean }) {
  const { outerRef, innerRef, fit } = useScaleToFit(DASHBOARD_DESIGN_WIDTH);

  return (
    <Reveal className="relative min-w-0">
      {/* blue glow shadow behind the product surface */}
      <div className="glow-breathe pointer-events-none absolute -inset-x-10 -inset-y-8 -z-10 blur-[90px] [background:radial-gradient(ellipse_at_center,oklch(0.7_0.17_252/26%),transparent_70%)]" />

      {/* desktop: wider than its column — right side runs off-screen */}
      <div
        ref={outerRef}
        className="hidden lg:block lg:w-[calc(100%+6rem)] xl:w-[calc(100%+9rem)]"
      >
        <div
          className="light-sweep relative w-full overflow-hidden rounded-[1.15rem] shadow-[var(--shadow-glow-blue)]"
          style={
            fit
              ? { height: fit.height }
              : { aspectRatio: `${DASHBOARD_DESIGN_WIDTH} / 780` }
          }
        >
          <div
            ref={innerRef}
            className="origin-top-left"
            style={{
              width: DASHBOARD_DESIGN_WIDTH,
              transform: fit ? `scale(${fit.scale})` : undefined,
            }}
          >
            <AppDashboard animated compact budgetComparison={budgetComparison} />
          </div>
        </div>
      </div>

      {/* mobile / tablet: natural fluid layout */}
      <div className="light-sweep relative w-full rounded-[1.15rem] shadow-[var(--shadow-glow-blue)] lg:hidden">
        <AppDashboard fluid animated budgetComparison={budgetComparison} />
      </div>
    </Reveal>
  );
}



