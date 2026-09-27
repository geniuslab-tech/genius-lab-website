"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowClockwise, Check, CircleNotch, Pause, Play } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { Illustrative, SectionHead, Segmented, Tile, TileHead, useInView } from "./ui";

/* ---------- Second Brain Q&A ---------- */

/** Illustrative conversations with the Genius agent. */
const SCRIPT = [
  {
    chip: "EBITDA margin in Q3",
    q: "Why did our EBITDA margin drop in Q3, and what should we do about it?",
    reads: ["Reading finance.gl_entries", "Comparing Q2 and Q3 cost centres", "Tracing freight and discount drivers"],
    a: "EBITDA margin fell from 18.2% to 15.9%. Two drivers explain most of it: freight costs rose 14% after the July carrier change, and Northeast discounting added $1.1M in promotional spend. Renegotiating freight and capping regional discounts recovers about 1.8 points next quarter.",
  },
  {
    chip: "Cash, next 90 days",
    q: "What will our cash position look like over the next 90 days?",
    reads: ["Reading ar.invoices and ap.schedule", "Applying payment behaviour by customer", "Projecting weekly balances"],
    a: "Cash stays above the $4M floor, with a low of $4.6M in week 7 when the annual insurance premium and two supplier payments land together. Collecting the three overdue enterprise invoices early lifts that low point to $5.9M.",
  },
];

type Phase = "reading" | "speaking" | "done";

function BrainChat() {
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState<Phase>("done");
  const [read, setRead] = useState(SCRIPT[0].reads.length);
  const [spoken, setSpoken] = useState(Number.MAX_SAFE_INTEGER);
  const [touched, setTouched] = useState(false);
  const started = useRef(false);

  const S = SCRIPT[turn];
  const words = S.a.split(" ");

  const ask = (i: number) => {
    started.current = true;
    setTurn(i);
    setRead(0);
    setSpoken(0);
    setPhase(reduce ? "done" : "reading");
    if (reduce) {
      setRead(SCRIPT[i].reads.length);
      setSpoken(Number.MAX_SAFE_INTEGER);
    }
  };

  // First time the tile is seen, replay the answer from the start.
  useEffect(() => {
    if (!inView || reduce || started.current) return;
    started.current = true;
    const id = setTimeout(() => {
      setRead(0);
      setSpoken(0);
      setPhase("reading");
    }, 200);
    return () => clearTimeout(id);
  }, [inView, reduce]);

  useEffect(() => {
    if (!inView || reduce) return;
    let id: ReturnType<typeof setTimeout> | undefined;
    if (phase === "reading") {
      if (read < S.reads.length) id = setTimeout(() => setRead((n) => n + 1), 700);
      else id = setTimeout(() => setPhase("speaking"), 350);
    } else if (phase === "speaking") {
      if (spoken < words.length) id = setTimeout(() => setSpoken((n) => n + 1), 45);
      else id = setTimeout(() => setPhase("done"), 100);
    } else if (!touched && started.current) {
      id = setTimeout(() => {
        const next = (turn + 1) % SCRIPT.length;
        setTurn(next);
        setRead(0);
        setSpoken(0);
        setPhase("reading");
      }, 6500);
    }
    return () => clearTimeout(id);
  }, [inView, reduce, phase, read, spoken, words.length, S.reads.length, touched, turn]);

  const answer = phase === "done" ? S.a : words.slice(0, spoken).join(" ");

  return (
    <div ref={ref} className="flex h-full flex-col">
      <TileHead
        label="Ask the Second Brain"
        right={<Illustrative>Illustrative conversation</Illustrative>}
      />

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Example questions">
        {SCRIPT.map((s, i) => (
          <button
            key={s.chip}
            type="button"
            aria-pressed={turn === i}
            onClick={() => {
              setTouched(true);
              ask(i);
            }}
            className={`h-9 rounded-full px-3.5 text-[0.8125rem] font-medium transition-[background-color,color,box-shadow] duration-300 ${
              turn === i ? "bg-(--ink) text-white" : "bg-white text-(--ink-2) shadow-[inset_0_0_0_1px_var(--rule-2)] hover:text-(--ink) hover:shadow-[inset_0_0_0_1px_var(--ink-3)]"
            }`}
          >
            {s.chip}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setTouched(true);
            ask(turn);
          }}
          className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] font-medium text-(--blue) hover:bg-(--blue-soft)"
        >
          <ArrowClockwise size={14} weight="bold" aria-hidden="true" />
          Replay
        </button>
      </div>

      <div className="v12-well mt-4 flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <p className="ml-auto max-w-[88%] rounded-[16px] rounded-br-[4px] bg-(--ink) px-4 py-3 text-[0.9375rem] leading-[1.55] text-white">{S.q}</p>

        <ol className="grid gap-1.5" aria-label="What the agent read">
          {S.reads.map((r, i) => {
            const ok = i < read;
            const now = phase === "reading" && i === read;
            return (
              <li key={r} className={`flex items-center gap-2.5 text-[0.8125rem] transition-opacity duration-300 ${ok || now ? "opacity-100" : "opacity-30"}`}>
                <span
                  className={`inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${ok ? "bg-(--lime) text-(--ink)" : now ? "bg-(--blue) text-white" : "bg-(--ground-2)"}`}
                  aria-hidden="true"
                >
                  {ok ? <Check size={10} weight="bold" /> : now ? <CircleNotch size={10} weight="bold" className="motion-safe:animate-spin" /> : null}
                </span>
                <span className="v12-mono text-(--ink-2)">{r}</span>
              </li>
            );
          })}
        </ol>

        <div className="min-h-[9.5rem] max-w-[94%] rounded-[16px] rounded-tl-[4px] bg-white px-4 py-3.5 shadow-[0_0_0_1px_var(--rule)] sm:min-h-[8rem]">
          <p className="v12-label flex items-center gap-2 text-(--blue)">
            <span className="h-1.5 w-1.5 rounded-full bg-(--blue)" aria-hidden="true" />
            Genius agent
          </p>
          <p className="mt-2 text-[0.9375rem] leading-[1.6] text-(--ink)" aria-hidden="true">
            {phase === "reading" ? <span className="text-(--ink-3)">Reading your systems…</span> : answer}
            {phase === "speaking" && <span className="v12-caret" />}
          </p>
          <p className="sr-only" aria-live="polite">
            {phase === "done" ? S.a : ""}
          </p>
        </div>
      </div>
      <p className="mt-3 text-[0.75rem] text-(--ink-3)">Questions, figures and answers shown are illustrative.</p>
    </div>
  );
}

/* ---------- Context tabs ---------- */

const TOPICS = [
  {
    id: "semantic",
    name: "Semantic",
    title: "Semantic Context",
    body: "What every number means. Shared definitions for metrics, tables and dashboards, so revenue means the same thing in every report.",
    tags: ["Metrics", "Tables", "Dashboards"],
  },
  {
    id: "business",
    name: "Business",
    title: "Business Context",
    body: "How the company actually works. Customers, operations and finance, and the relationships that connect them.",
    tags: ["Customers", "Operations", "Finance"],
  },
  {
    id: "event",
    name: "Event",
    title: "Event Context",
    body: "What is happening right now. Transactions, process steps and system events, captured as they occur.",
    tags: ["Systems", "Processes"],
  },
] as const;

type TopicId = (typeof TOPICS)[number]["id"];

function ContextTabs() {
  const [id, setId] = useState<TopicId>("semantic");
  const t = TOPICS.find((x) => x.id === id) ?? TOPICS[0];
  return (
    <div className="flex h-full flex-col">
      <TileHead label="What it knows" />
      <div className="mt-5">
        <Segmented label="Context in the Second Brain" value={id} onChange={setId} options={TOPICS.map((x) => ({ id: x.id, label: x.name }))} />
      </div>
      <div key={t.id} className="v12-intro mt-5 [--d:0ms]">
        <h3 className="text-[1.25rem] font-semibold tracking-[-0.025em]">{t.title}</h3>
        <p className="mt-2 text-[0.9375rem] leading-[1.65] text-(--ink-2)">{t.body}</p>
      </div>
      <ul className="mt-auto flex flex-wrap gap-1.5 pt-5" aria-label="Covers">
        {t.tags.map((g) => (
          <li key={g} className="v12-chip bg-(--blue-soft) text-(--blue-ink)">
            {g}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Agent task queue ---------- */

const TASKS = [
  { name: "Reconcile intercompany balances", sys: "ERP · GL" },
  { name: "Flag overdue enterprise invoices", sys: "AR · CRM" },
  { name: "Refresh margin dashboard", sys: "BI" },
  { name: "Draft the weekly board note", sys: "Second Brain" },
];
const STEP_MS = 260;
const TASK_STEPS = 10;

function AgentQueue() {
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const [paused, setPaused] = useState(false);
  // One tick advances the running task by a tenth. Starts part-way, so the tile reads well unscripted.
  const [tick, setTick] = useState(16);
  const total = TASKS.length * TASK_STEPS;

  useEffect(() => {
    if (!inView || reduce || paused) return;
    const id = setInterval(() => setTick((t) => (t >= total + 8 ? 0 : t + 1)), STEP_MS);
    return () => clearInterval(id);
  }, [inView, reduce, paused, total]);

  const doneCount = Math.min(TASKS.length, Math.floor(tick / TASK_STEPS));

  return (
    <div ref={ref} className="flex h-full flex-col">
      <TileHead
        dark
        label="AI Agents · task queue"
        right={
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/10 px-3 text-[0.75rem] font-medium text-white hover:bg-white/15"
          >
            {paused ? <Play size={12} weight="fill" aria-hidden="true" /> : <Pause size={12} weight="fill" aria-hidden="true" />}
            {paused ? "Resume" : "Pause"}
          </button>
        }
      />
      <h3 className="mt-5 text-[1.375rem] font-semibold leading-tight tracking-[-0.03em] text-white">AI Agents that know your business.</h3>
      <p className="mt-2 text-[0.9375rem] leading-[1.6] text-white/60">They read the Second Brain, answer, and act across your systems.</p>

      <ul className="mt-5 grid gap-1.5">
        {TASKS.map((t, i) => {
          const p = Math.max(0, Math.min(1, (tick - i * TASK_STEPS) / TASK_STEPS));
          const state = p >= 1 ? "done" : p > 0 ? "running" : "queued";
          return (
            <li key={t.name} className="relative overflow-hidden rounded-[10px] bg-white/[0.06] px-3 py-2.5">
              <span className="absolute inset-y-0 left-0 bg-white/[0.06] transition-[width] duration-300 ease-linear" style={{ width: `${Math.round(p * 100)}%` }} aria-hidden="true" />
              <span className="relative flex items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate text-[0.875rem] font-medium text-white">{t.name}</span>
                  <span className="v12-mono block text-[0.6875rem] text-white/45">{t.sys}</span>
                </span>
                <span
                  className={`v12-chip shrink-0 ${state === "done" ? "bg-(--lime) text-(--ink)" : state === "running" ? "bg-(--blue) text-white" : "bg-white/10 text-white/55"}`}
                >
                  {state === "running" && <CircleNotch size={10} weight="bold" className="motion-safe:animate-spin" aria-hidden="true" />}
                  {state}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-auto flex items-center justify-between pt-4 text-[0.75rem] text-white/45">
        <span aria-live="polite">
          {doneCount} of {TASKS.length} done
        </span>
        <span>Illustrative queue</span>
      </p>
    </div>
  );
}

export function BrainV12() {
  return (
    <section id="brain" className="scroll-mt-24 py-20 sm:py-28" aria-labelledby="v12-brain-title">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <SectionHead
          id="v12-brain-title"
          index="03"
          label="Second Brain · AI Agents"
          title="A Second Brain for your business."
          lead="The intelligence layer holds the full context of the company: its systems, tables, metrics, dashboards, processes, customers, operations and finances. AI Agents work on top of it, end to end."
        />
        <div className="mt-12 grid gap-3 sm:gap-4 lg:grid-cols-12">
          <Tile className="p-5 sm:p-7 lg:col-span-7 lg:row-span-2">
            <BrainChat />
          </Tile>
          <Tile delay={80} className="p-5 sm:p-7 lg:col-span-5">
            <ContextTabs />
          </Tile>
          <Tile dark delay={140} className="p-5 sm:p-7 lg:col-span-5">
            <AgentQueue />
          </Tile>
        </div>
      </div>
    </section>
  );
}
