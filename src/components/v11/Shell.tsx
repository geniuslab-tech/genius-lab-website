"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EVENTS } from "./data";
import { useInView, useReduced } from "./hooks";
import { Pane, Tag } from "./ui";

type Tone = "fg" | "dim" | "faint" | "amber" | "ice" | "warn";
type Out = { t: string; tone?: Tone };
type Program = { id: string; cmd: string; chip: string; out: Out[] };

/** An illustrative session. Nothing here is a client's data. */
const PROGRAMS: Program[] = [
  {
    id: "connect",
    chip: "connect",
    cmd: "genius connect --systems erp,crm,warehouse",
    out: [
      { t: "» discovering systems (read-only)", tone: "dim" },
      { t: "  erp ............ linked   [ok]", tone: "ice" },
      { t: "  crm ............ linked   [ok]", tone: "ice" },
      { t: "  warehouse ...... linked   [ok]", tone: "ice" },
      { t: "» mapping customers, orders, products, suppliers", tone: "dim" },
      { t: "3 systems connected. Nothing replaced, nothing migrated.", tone: "amber" },
    ],
  },
  {
    id: "layers",
    chip: "layers",
    cmd: "genius layers --status",
    out: [
      { t: "01 data-engineering  foundation     ready", tone: "fg" },
      { t: "02 analytics         understanding  ready", tone: "fg" },
      { t: "03 business-intel    visibility     ready", tone: "fg" },
      { t: "04 artificial-intel  reasoning      ready", tone: "fg" },
      { t: "   └── better business decisions", tone: "amber" },
    ],
  },
  {
    id: "ask",
    chip: "ask",
    cmd: 'genius ask "cash position, next 90 days?"',
    out: [
      { t: "» reading ar.invoices, ap.schedule", tone: "dim" },
      { t: "» applying payment behaviour by customer", tone: "dim" },
      { t: "» projecting weekly balances", tone: "dim" },
      {
        t: "Cash stays above the $4M floor. The low point is $4.6M in week 7, when the insurance premium and two supplier payments land together.",
        tone: "fg",
      },
      { t: "# illustrative answer, not client data", tone: "faint" },
    ],
  },
  {
    id: "ontology",
    chip: "ontology",
    cmd: "genius ontology --tree",
    out: [
      { t: "ontology/", tone: "amber" },
      { t: "├── data/              the facts", tone: "fg" },
      { t: "├── analytics/         the meaning", tone: "fg" },
      { t: "├── ai/                the reasoning", tone: "fg" },
      { t: "├── people/            the judgement", tone: "fg" },
      { t: "└── business-context/  the why", tone: "fg" },
    ],
  },
  {
    id: "help",
    chip: "help",
    cmd: "genius help",
    out: [
      { t: "usage: genius <command>", tone: "dim" },
      { t: "  connect   link the systems you already run", tone: "fg" },
      { t: "  layers    show the four connected layers", tone: "fg" },
      { t: "  ask       question the Second Brain", tone: "fg" },
      { t: "  ontology  print the shared business model", tone: "fg" },
      { t: "  clear     clear the screen", tone: "fg" },
    ],
  },
];

const TONE: Record<Tone, string> = {
  fg: "text-(--fg)",
  dim: "text-(--fg-2)",
  faint: "text-(--fg-3)",
  amber: "text-(--amber)",
  ice: "text-(--ice)",
  warn: "text-(--warn)",
};

type Entry = { key: number; cmd: string; out: Out[]; typed: number; shown: number; done: boolean };

const find = (raw: string): Program | "clear" | null => {
  const words = raw.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words[0] === "genius") words.shift();
  const w = words[0] ?? "";
  if (w === "clear" || w === "cls") return "clear";
  return PROGRAMS.find((p) => p.id === w || (w === "--help" && p.id === "help")) ?? null;
};

function Prompt() {
  return (
    <span className="select-none">
      <span className="text-(--ice)">genius@lab</span>
      <span className="text-(--fg-3)">:</span>
      <span className="text-(--fg-2)">~</span>
      <span className="text-(--amber)"> $ </span>
    </span>
  );
}

export function Shell() {
  const reduce = useReduced();
  const paneRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inView = useInView(paneRef, { threshold: 0.3 });
  const [entries, setEntries] = useState<Entry[]>([]);
  const [value, setValue] = useState("");
  const seq = useRef(0);
  const autoplayed = useRef(false);

  const running = entries.length > 0 && !entries[entries.length - 1].done;

  const start = useCallback(
    (raw: string, typedByUser: boolean) => {
      const p = find(raw);
      if (p === "clear") {
        setEntries([]);
        return;
      }
      const cmd = p && !typedByUser ? p.cmd : raw.trim();
      const out: Out[] = p ? p.out : [{ t: `genius: command not found: ${raw.trim()}. Try "help".`, tone: "warn" }];
      const instant = reduce;
      seq.current += 1;
      const entry: Entry = {
        key: seq.current,
        cmd,
        out,
        typed: instant || typedByUser ? cmd.length : 0,
        shown: instant ? out.length : 0,
        done: instant,
      };
      setEntries((list) => [...list.slice(-5), entry]);
    },
    [reduce],
  );

  // The machine: type the command, then print its output line by line.
  useEffect(() => {
    if (!running) return;
    const i = entries.length - 1;
    const e = entries[i];
    const patch = (fn: (x: Entry) => Entry) => setEntries((list) => list.map((x, j) => (j === i ? fn(x) : x)));
    let id: ReturnType<typeof setTimeout>;
    if (e.typed < e.cmd.length) id = setTimeout(() => patch((x) => ({ ...x, typed: x.typed + 1 })), e.cmd[e.typed] === " " ? 60 : 24);
    else if (e.shown < e.out.length) id = setTimeout(() => patch((x) => ({ ...x, shown: x.shown + 1 })), e.shown === 0 ? 320 : 150);
    else id = setTimeout(() => patch((x) => ({ ...x, done: true })), 60);
    return () => clearTimeout(id);
  }, [entries, running]);

  // Autoplay one command the first time the shell is seen.
  useEffect(() => {
    if (!inView || autoplayed.current) return;
    autoplayed.current = true;
    const id = setTimeout(() => start("connect", false), reduce ? 0 : 900);
    return () => clearTimeout(id);
  }, [inView, reduce, start]);

  // Commands sent from the palette.
  useEffect(() => {
    const onRun = (e: Event) => {
      const cmd = (e as CustomEvent<string>).detail;
      autoplayed.current = true;
      setTimeout(() => start(cmd, false), 450);
    };
    window.addEventListener(EVENTS.run, onRun);
    return () => window.removeEventListener(EVENTS.run, onRun);
  }, [start]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  return (
    <div ref={paneRef}>
      <Pane
        boot="intro"
        delay={180}
        title="genius — shell"
        meta={<Tag>illustrative session</Tag>}
        className="shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9),0_0_80px_-40px_rgb(255_173_66/0.25)]"
      >
        <div
          ref={bodyRef}
          role="log"
          aria-live="polite"
          aria-busy={running}
          aria-label="Shell output"
          className="v11-term v11-noscroll h-[300px] overflow-y-auto px-4 py-4 text-[12.5px] leading-[1.65] sm:h-[340px] sm:px-5 sm:text-[13.5px]"
          onClick={() => inputRef.current?.focus({ preventScroll: true })}
        >
          <p className="text-(--fg-3)">Genius OS &middot; four layers mounted &middot; type &ldquo;help&rdquo; or pick a command below.</p>
          {entries.map((e) => (
            <div key={e.key} className="mt-3">
              <p className="whitespace-pre-wrap break-words">
                <Prompt />
                <span className="text-(--fg)">{e.cmd.slice(0, e.typed)}</span>
                {!e.done && e.typed < e.cmd.length && <span className="v11-cursor" aria-hidden="true" />}
              </p>
              {e.out.slice(0, e.shown).map((o, i) => (
                <p key={i} className={`whitespace-pre-wrap break-words ${TONE[o.tone ?? "fg"]}`}>
                  {o.t}
                </p>
              ))}
            </div>
          ))}
        </div>

        <form
          className="v11-term flex items-center gap-2 border-t border-(--rule) px-4 py-2.5 text-[13.5px] sm:px-5"
          onSubmit={(ev) => {
            ev.preventDefault();
            if (!value.trim() || running) return;
            start(value, true);
            setValue("");
          }}
        >
          <label htmlFor="v11-shell-input" className="sr-only">
            Type a command. Try connect, layers, ask, ontology, help or clear.
          </label>
          <span className="text-(--amber)" aria-hidden="true">
            $
          </span>
          <input
            id="v11-shell-input"
            ref={inputRef}
            value={value}
            onChange={(ev) => setValue(ev.target.value)}
            placeholder="type a command, e.g. help"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="h-9 min-w-0 flex-1 bg-transparent text-[16px] text-(--fg) outline-none placeholder:text-(--fg-3) sm:text-[13.5px]"
          />
          <button type="submit" disabled={running} className="px-2 text-[12px] text-(--fg-2) hover:text-(--fg) disabled:opacity-40">
            enter &crarr;
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 border-t border-(--rule) bg-(--bg-3) px-4 py-3 sm:px-5">
          <span className="v11-label mr-1 text-[10.5px] text-(--fg-3)">Try</span>
          {PROGRAMS.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={running}
              onClick={() => start(p.id, false)}
              aria-label={`Run ${p.cmd}`}
              className="v11-term border border-(--rule-2) px-2.5 py-1 text-[12.5px] text-(--fg-2) transition-colors hover:border-(--amber-2) hover:text-(--amber) disabled:cursor-wait disabled:opacity-40"
            >
              {p.chip}
            </button>
          ))}
          <button
            type="button"
            disabled={running}
            onClick={() => start("clear", false)}
            className="v11-term px-2 py-1 text-[12.5px] text-(--fg-3) hover:text-(--fg) disabled:opacity-40"
          >
            clear
          </button>
        </div>
      </Pane>
    </div>
  );
}
