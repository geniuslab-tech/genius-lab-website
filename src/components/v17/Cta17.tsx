"use client";

import { DrawPath, Eyebrow, PillLink, Rise, Underline } from "./ui";

export function Cta17() {
  return (
    <section id="contact" className="scroll-mt-20 pb-24 pt-12 sm:pb-32" aria-labelledby="v17-cta-title">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
        <div className="v17-panel relative overflow-hidden bg-[var(--terra-tint)] px-6 py-14 sm:px-12 sm:py-20 lg:px-16">
          {/* A sprout, the same one that grows from the stones. */}
          <svg viewBox="0 0 200 260" className="absolute -bottom-4 right-4 hidden h-64 w-auto sm:block lg:right-16 lg:h-80" aria-hidden="true" fill="none">
            <DrawPath d="M100 258 C 96 200, 108 150, 100 70" stroke="var(--sage-ink)" width={3} duration={1.2} />
            <DrawPath d="M100 170 C 70 168, 42 146, 34 112 C 66 112, 94 134, 100 166" stroke="var(--sage-ink)" width={2.4} delay={0.9} />
            <DrawPath d="M102 120 C 128 108, 156 84, 164 50 C 132 52, 108 78, 102 116" stroke="var(--sage-ink)" width={2.4} delay={1.2} />
            <DrawPath d="M100 72 C 92 52, 96 30, 110 14" stroke="var(--sage-ink)" width={2.4} delay={1.6} duration={0.6} />
          </svg>
          <div className="relative max-w-[46rem]">
            <Eyebrow>One partner. One platform. One source of truth.</Eyebrow>
            <Rise>
              <h2 id="v17-cta-title" className="v17-display mt-7 text-balance text-[clamp(2.4rem,5.6vw,4.5rem)]">
                Turn your business knowledge into{" "}
                <span className="relative inline-block">
                  <em>intelligent systems</em>
                  <Underline className="absolute -bottom-2 left-0 h-4 w-full" color="var(--terra)" delay={0.4} />
                </span>
                .
              </h2>
            </Rise>
            <Rise delay={0.1}>
              <p className="mt-8 max-w-[52ch] text-pretty text-[1.0625rem] leading-[1.7] text-[var(--ink-2)] sm:text-[1.125rem]">
                Tell us where your systems and data stand today. We&rsquo;ll show you how Genius Lab turns them into one intelligence
                and execution layer, fully managed.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <PillLink href="#top">Talk to us</PillLink>
                <PillLink href="#action" tone="outline">
                  Watch it in action
                </PillLink>
              </div>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  );
}
