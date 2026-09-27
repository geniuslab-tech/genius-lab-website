"use client";

import { useRef } from "react";
import { Play, X } from "@phosphor-icons/react";
import { Console } from "./Console";
import { SectionHead, rd } from "./ui";

const CHAPTERS = [
  { t: "00:00", name: "Connecting the systems" },
  { t: "00:48", name: "Building the Second Brain" },
  { t: "01:32", name: "Agents at work" },
];

/** Slots for approved client quotes. Nothing here is a real testimonial. */
const VOICE_SLOTS = [
  { role: "CFO, multi-entity group", topic: "One source for the board pack and the operating numbers" },
  { role: "Operating Partner, investment firm", topic: "Portfolio companies connected, questions answered by an agent" },
  { role: "COO, operating company", topic: "Built on existing systems, run as a managed service" },
];

export function Action() {
  const dlg = useRef<HTMLDialogElement>(null);
  return (
    <section id="action" className="scroll-mt-16 bg-[#f4f7fb] py-24 sm:py-32" data-v23-tone="light" data-v23-chapter="In action" aria-labelledby="v23-action-title">
      <div className="v23-wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead n="08" id="v23-action-title" kicker="Product film" title="Genius Lab in action." className="lg:col-span-7" />
          <p data-v23-rv style={rd(120)} className="max-w-[46ch] text-[1.0625rem] leading-[1.7] text-(--tx-2) lg:col-span-5">
            Two minutes from scattered systems to an agent answering a CFO&rsquo;s question.
          </p>
        </div>

        <div data-v23-rv className="relative mt-14 overflow-hidden rounded-[18px] bg-[#060a1a]">
          <div className="pointer-events-none p-4 opacity-45 sm:p-8 lg:p-12">
            <Console />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgb(6_10_26/0.2),rgb(6_10_26/0.85))]" aria-hidden="true" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center">
            <button
              type="button"
              onClick={() => dlg.current?.showModal()}
              aria-label="Play video: Genius Lab in action"
              className="v23-play inline-flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#101440] sm:h-24 sm:w-24"
            >
              <Play size={28} weight="fill" aria-hidden="true" />
            </button>
            <div>
              <p className="text-[1.125rem] font-semibold text-white">From complexity to clarity</p>
              <p className="v23-mono mt-1 text-[0.75rem] text-white/65">Genius Lab, product film, 2:14 · coming soon</p>
            </div>
          </div>
        </div>
        <ol className="mt-4 grid gap-2 sm:grid-cols-3" aria-label="Film chapters">
          {CHAPTERS.map((c, i) => (
            <li key={c.t} data-v23-rv style={rd(i * 70)} className="flex items-baseline gap-4 rounded-[12px] border border-(--line-2) bg-white px-5 py-4">
              <span className="v23-mono text-[0.75rem] text-(--accent-2)">{c.t}</span>
              <span className="font-medium">{c.name}</span>
            </li>
          ))}
        </ol>

        <div id="clients" className="mt-24 scroll-mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4" data-v23-rv>
            <h2 className="text-[1.75rem] font-semibold tracking-[-0.025em]">What our clients say.</h2>
            <p className="v23-label text-(--tx-3)">Placeholders · approved client quotes to follow</p>
          </div>
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {VOICE_SLOTS.map((v, i) => (
              <li key={v.role} data-v23-rv style={rd(i * 80)} className="flex flex-col rounded-[14px] border border-dashed border-(--line-2) bg-white/60 p-6">
                <span className="v23-label text-(--tx-3)">Quote slot 0{i + 1}</span>
                <p className="mt-4 text-[1.0625rem] leading-[1.6] text-(--tx-2)">
                  <span className="text-(--tx-3)">Awaiting an approved quote on:</span> {v.topic}.
                </p>
                <p className="mt-auto pt-6 text-[0.875rem] font-medium text-(--tx-2)">{v.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <dialog
        ref={dlg}
        className="v23-dialog m-auto w-[min(92vw,560px)] rounded-[16px] bg-[#060a1a] p-0 text-white backdrop:bg-[rgb(3_5_13/0.72)]"
        aria-labelledby="v23-film-title"
        onClick={(e) => e.target === e.currentTarget && dlg.current?.close()}
      >
        <div className="p-8">
          <div className="flex items-start justify-between gap-6">
            <p id="v23-film-title" className="text-[1.25rem] font-semibold">
              The product film is coming soon.
            </p>
            <button type="button" onClick={() => dlg.current?.close()} aria-label="Close" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 hover:border-white/50">
              <X size={15} aria-hidden="true" />
            </button>
          </div>
          <p className="mt-3 text-white/70">This frame is a placeholder for the Genius Lab video.</p>
        </div>
      </dialog>
    </section>
  );
}
