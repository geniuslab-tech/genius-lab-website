import { FilmPlayer } from "./FilmPlayer";
import { TERRAIN, TERRAIN_H, TERRAIN_W } from "./terrain";
import { Caption, Opener, Rule, Up, shell } from "./type";

const RUNNING_ORDER = [
  { t: "00:00", name: "Connecting the systems" },
  { t: "00:48", name: "Building the Second Brain" },
  { t: "01:32", name: "Agents at work" },
];

export function Film() {
  return (
    <section id="action" data-chapter="action" className="scroll-mt-[var(--head-h)] border-t border-[color:var(--rule)] bg-[color:var(--paper-2)]/60 py-20 sm:py-28" aria-labelledby="v8-action-title">
      <div className={shell}>
        <Opener numeral="IX" kicker="Product film" title="Genius Lab *in action.*" titleId="v8-action-title" folio="66">
          <Up delay={250}>
            <p className="f-text mt-8 max-w-[44ch] text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.4]">
              Two minutes from scattered systems to an agent answering a CFO&rsquo;s question.
            </p>
          </Up>
        </Opener>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <figure className="lg:col-span-9">
            <div className="relative aspect-[16/10] overflow-hidden border border-[color:var(--ink)] bg-[color:var(--paper)] sm:aspect-[16/9]">
              {/* The film's first frame: the cover terrain, faint, with its title card. */}
              <svg viewBox={`0 0 ${TERRAIN_W} ${TERRAIN_H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full opacity-[0.2]" aria-hidden="true">
                {TERRAIN.filter((_, i) => i % 2 === 1).map((c, i) => (
                  <path key={i} d={c.d} fill="none" stroke="var(--ink)" strokeWidth={c.index ? 1.4 : 0.7} />
                ))}
              </svg>
              <div className="label absolute left-4 top-4 flex gap-4 text-[color:var(--ink-2)] sm:left-6 sm:top-5">
                <span className="text-[color:var(--red)]">&#9679; Frame 0001</span>
                <span className="hidden sm:inline">Genius Lab, product film</span>
              </div>
              <p className="label absolute right-4 top-4 tabular-nums text-[color:var(--ink-2)] sm:right-6 sm:top-5">2:14</p>
              <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
                <p className="f-display text-[clamp(1.75rem,4.4vw,4rem)] leading-[0.95]">
                  From complexity <span className="italic text-[color:var(--red)]">to clarity</span>
                </p>
              </div>
              <FilmPlayer />
            </div>
            <Caption fig="Fig. 5">Genius Lab, product film, 2:14. The film is in production; this frame is a placeholder.</Caption>
          </figure>

          <div className="lg:col-span-3">
            <p className="label text-[color:var(--ink-3)]">Running order</p>
            <Rule ink className="mt-3" />
            <ol>
              {RUNNING_ORDER.map((c, i) => (
                <li key={c.t} className="border-b border-[color:var(--rule)]">
                  <Up delay={i * 80} className="flex items-baseline gap-4 py-5 lg:block">
                    <span className={`smallcaps tabular-nums ${i === 0 ? "text-[color:var(--red)]" : "text-[color:var(--ink-3)]"}`}>{c.t}</span>
                    <span className="f-display block text-[1.625rem] leading-[1.05] lg:mt-2">{c.name}</span>
                  </Up>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
