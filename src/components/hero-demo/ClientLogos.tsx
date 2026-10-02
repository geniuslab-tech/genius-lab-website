/* eslint-disable @next/next/no-img-element -- small decorative brand marks in a marquee */

/**
 * Client logos for the "Trusted by" strip. White marks on transparent ground,
 * trimmed to their artwork; each has its own height so wordmarks and round
 * seals read at the same optical size.
 */
export const CLIENTS = [
  { src: "/clients/3.png", name: "Aspen", h: 15 },
  { src: "/clients/4.png", name: "Atlas", h: 13 },
  { src: "/clients/5.png", name: "Grupo Carvalho", h: 26 },
  { src: "/clients/6.png", name: "MRS CMC", h: 32 },
  { src: "/clients/7.png", name: "Hypper Brands", h: 22 },
  { src: "/clients/8.png", name: "Calera Capital", h: 14 },
] as const;

export function ClientLogo({ c, className = "" }: { c: (typeof CLIENTS)[number]; className?: string }) {
  return <img src={c.src} alt={c.name} style={{ height: c.h }} className={`w-auto shrink-0 select-none object-contain ${className}`} draggable={false} />;
}

/** Endless marquee of the client logos (two copies, scrolled by the v24 marquee-track keyframes). */
export function ClientLogoMarquee({ className = "", dim = "opacity-55" }: { className?: string; dim?: string }) {
  return (
    <div className={`relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] ${className}`}>
      <div className="marquee-track flex shrink-0 items-center gap-12 pr-12">
        {[...CLIENTS, ...CLIENTS].map((c, i) => (
          <ClientLogo key={`${c.name}-${i}`} c={c} className={dim} />
        ))}
      </div>
    </div>
  );
}
