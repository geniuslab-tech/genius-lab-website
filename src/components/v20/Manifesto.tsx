"use client";

import { useEffect, useRef } from "react";
import { Note, R } from "./ui";

const TEXT =
  "We are not only a data, analytics or AI company. We work where data, analytics, AI, people and business context meet, on one living model of your business, so every part moves in harmony instead of in hand-offs.";
const WORDS = TEXT.split(" ");
// Words that carry the idea take the accent once they light up.
const KEY = new Set(["harmony", "living"]);

const AXES = [
  { name: "Data", role: "The facts", body: "Every system connected and reconciled into one set of trusted records." },
  { name: "Analytics", role: "The meaning", body: "Metrics and rules defined once, on the business objects themselves." },
  { name: "AI", role: "The reasoning", body: "Agents that read the model, answer questions and act on what they find." },
  { name: "People", role: "The judgement", body: "Owners, roles and decisions: who is accountable, who approves, who acts." },
  { name: "Business Context", role: "The why", body: "Strategy, processes and rules that give every number its purpose." },
];

/**
 * Our approach, told as one paragraph that holds still while you scroll through it. Each word
 * lights up as you reach it, so the sentence is read at the pace of the page.
 */
export function Manifesto() {
  const track = useRef<HTMLDivElement>(null);
  const para = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = track.current;
    const p = para.current;
    if (!el || !p) return;
    const words = Array.from(p.querySelectorAll<HTMLElement>(".v20-word"));
    const lightAll = () => words.forEach((w) => w.setAttribute("data-lit", ""));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.hidden) {
      lightAll();
      return;
    }
    let lit = -1;
    const read = () => {
      const r = el.getBoundingClientRect();
      const H = window.innerHeight;
      const span = Math.max(1, r.height - H * 0.6);
      const prog = Math.min(1, Math.max(0, (H * 0.55 - r.top) / span));
      const n = Math.round(prog * 1.12 * words.length);
      if (n === lit) return;
      lit = n;
      words.forEach((w, i) => {
        if (i < n) w.setAttribute("data-lit", "");
        else w.removeAttribute("data-lit");
      });
    };
    read();
    const onHidden = () => document.hidden && lightAll();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, []);

  return (
    <section id="approach" data-tone="black" className="v20-sec" aria-labelledby="v20-approach-title">
      <div ref={track} className="relative motion-safe:min-h-[190svh]">
        <div className="mx-auto flex max-w-[1120px] flex-col justify-center px-5 py-28 motion-safe:sticky motion-safe:top-0 motion-safe:min-h-[100svh] sm:py-32">
          <h2 id="v20-approach-title" className="v20-eyebrow text-center">
            Data Ontology Intelligence
          </h2>
          <p ref={para} className="v20-display mx-auto mt-8 max-w-[24ch] text-center text-[clamp(1.875rem,4.6vw,4rem)] leading-[1.12] tracking-[-0.038em]">
            {WORDS.map((w, i) => (
              <span key={i}>
                <span className={`v20-word ${KEY.has(w.replace(/[^a-z]/gi, "")) ? "v20-acc" : ""}`}>{w}</span>
                {i < WORDS.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1120px] px-5 pb-28 sm:pb-40">
        <R as="p" className="v20-lead mx-auto max-w-[46ch] text-center">
          An ontology is a living model of your business: its objects, such as customers, orders, products and suppliers, the
          relationships between them, and the rules that give them meaning.
        </R>
        <ol className="mt-16 grid border-t v20-rule sm:grid-cols-2 lg:grid-cols-5" aria-label="The five axes of the model">
          {AXES.map((a, i) => (
            <R as="li" key={a.name} delay={i * 70} className="border-b v20-rule py-7 sm:pr-6 lg:border-b-0 lg:pt-8">
              <p className="v20-acc text-[0.875rem] font-medium">{a.role}</p>
              <h3 className="v20-display v20-h4 mt-3">{a.name}</h3>
              <p className="v20-fg2 mt-2 text-[0.9375rem] leading-[1.6]">{a.body}</p>
            </R>
          ))}
        </ol>
        <Note className="mt-10 text-center">One shared model, five ways of working on it.</Note>
      </div>
    </section>
  );
}
