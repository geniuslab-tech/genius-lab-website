import { BrandLogo } from "@/components/v2/ui";

export const CONTENTS = [
  { id: "complexity", n: "I", name: "Complexity" },
  { id: "layers", n: "II", name: "Four layers" },
  { id: "brain", n: "III", name: "Second Brain" },
  { id: "agents", n: "IV", name: "AI Agents" },
  { id: "portal", n: "V", name: "Genius Portal" },
  { id: "ontology", n: "VI", name: "Ontology" },
  { id: "managed", n: "VII", name: "Fully managed" },
  { id: "segments", n: "VIII", name: "Who it serves" },
  { id: "action", n: "IX", name: "In action" },
  { id: "voices", n: "X", name: "Voices" },
];

/** Running head: wordmark, a horizontal table of contents that is the navigation, and the reply card. */
export function Masthead() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--ink)] bg-[color:var(--paper)]/95 backdrop-blur-[6px]">
      <a
        href="#v8-main"
        className="label sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:bg-[color:var(--ink)] focus:px-3 focus:py-2 focus:text-[color:var(--paper)]"
      >
        Skip to the issue
      </a>
      <div className="mx-auto flex h-[var(--head-h)] w-full max-w-[1360px] items-center gap-5 px-5 sm:px-8 lg:gap-8 lg:px-10">
        <a href="#top" className="shrink-0" aria-label="Genius Lab, back to the cover">
          <BrandLogo tone="navy" className="h-[13px] w-auto sm:h-[15px]" />
        </a>
        <span className="hidden h-5 w-px bg-[color:var(--rule)] md:block" aria-hidden="true" />
        <nav aria-label="Contents" className="relative min-w-0 flex-1 [mask-image:linear-gradient(to_right,#000_88%,transparent)] xl:[mask-image:none]">
          <ol className="toc-strip flex items-center gap-5 overflow-x-auto whitespace-nowrap xl:justify-between xl:gap-3">
            {CONTENTS.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} className="toc-link flex items-baseline gap-1.5 py-3 text-[0.8125rem] font-medium">
                  <span className="toc-n f-display text-[0.9375rem] italic text-[color:var(--ink-3)]">{c.n}</span>
                  {c.name}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <a href="#contact" className="label hidden shrink-0 bg-[color:var(--ink)] px-3.5 py-2.5 text-[color:var(--paper)] transition-colors hover:bg-[color:var(--red)] sm:inline-block">
          Talk to us
        </a>
      </div>
      <div className="progress absolute inset-x-0 -bottom-px h-[2px] bg-[color:var(--red)]" aria-hidden="true" />
    </header>
  );
}
