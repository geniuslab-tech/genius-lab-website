"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { EVENTS, EXTRA_SECTIONS, SECTIONS, jumpTo } from "./data";
import { useReduced } from "./hooks";

type Item = { id: string; group: "Go to" | "Run" | "Action"; label: string; hint: string; key?: string; run: () => void };

/** The command palette: ⌘K / Ctrl+K, "/" or the visible buttons. A modal dialog with a filterable listbox. */
export function Palette() {
  const reduce = useReduced();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const listId = useId();

  const items = useMemo<Item[]>(() => {
    const go = (id: string) => () => jumpTo(id, reduce);
    const run = (cmd: string) => () => {
      jumpTo("top", reduce);
      window.dispatchEvent(new CustomEvent(EVENTS.run, { detail: cmd }));
    };
    return [
      ...SECTIONS.map((s) => ({ id: s.id, group: "Go to" as const, label: s.label, hint: `~/${s.path}`, key: s.key, run: go(s.id) })),
      ...EXTRA_SECTIONS.map((s) => ({ id: s.id, group: "Go to" as const, label: s.label, hint: `~/${s.path}`, run: go(s.id) })),
      { id: "run-connect", group: "Run" as const, label: "genius connect --systems erp,crm", hint: "shell", run: run("connect") },
      { id: "run-layers", group: "Run" as const, label: "genius layers --status", hint: "shell", run: run("layers") },
      { id: "run-ask", group: "Run" as const, label: "genius ask \"cash, next 90 days?\"", hint: "shell", run: run("ask") },
      {
        id: "film",
        group: "Action" as const,
        label: "Play the product film",
        hint: "~/film",
        run: () => {
          jumpTo("action", reduce);
          window.dispatchEvent(new CustomEvent(EVENTS.film));
        },
      },
      { id: "demo", group: "Action" as const, label: "Book a demo", hint: "~/contact", run: go("contact") },
      {
        id: "crt",
        group: "Action" as const,
        label: "Toggle CRT scanlines",
        hint: "display",
        run: () => document.querySelector(".v11")?.classList.toggle("no-crt"),
      },
      { id: "top", group: "Action" as const, label: "Back to top", hint: "~/", run: go("top") },
    ];
  }, [reduce]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((i) => `${i.group} ${i.label} ${i.hint}`.toLowerCase().includes(s));
  }, [items, q]);

  const show = useCallback(() => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setQ("");
    setSel(0);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else show();
        return;
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const t = e.target as HTMLElement | null;
        if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
        if (dialog.current?.open) return;
        e.preventDefault();
        show();
      }
    };
    const onOpen = () => show();
    window.addEventListener("keydown", onKey);
    window.addEventListener(EVENTS.palette, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(EVENTS.palette, onOpen);
    };
  }, [show]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      input.current?.focus();
    } else if (!open && d.open) d.close();
  }, [open]);

  const choose = (item: Item | undefined) => {
    if (!item) return;
    opener.current = null;
    setOpen(false);
    dialog.current?.close();
    // Let the dialog leave the top layer before scrolling and moving focus.
    requestAnimationFrame(() => item.run());
  };

  const onInputKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => (filtered.length ? (s + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => (filtered.length ? (s - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === "Home") {
      setSel(0);
    } else if (e.key === "End") {
      setSel(Math.max(0, filtered.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(filtered[sel]);
    }
  };

  useEffect(() => {
    document.getElementById(`${listId}-${sel}`)?.scrollIntoView({ block: "nearest" });
  }, [sel, listId]);

  const active = filtered[sel];

  return (
    <dialog
      ref={dialog}
      className="v11-palette v11-term"
      aria-label="Command palette"
      onClose={() => {
        setOpen(false);
        opener.current?.focus();
        opener.current = null;
      }}
      onClick={(e) => {
        if (e.target === dialog.current) dialog.current?.close();
      }}
    >
      <div className="flex max-h-[inherit] flex-col">
        <div className="flex items-center gap-3 border-b border-(--rule-2) px-4">
          <span className="text-(--amber)" aria-hidden="true">
            &gt;
          </span>
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={onInputKey}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={active ? `${listId}-${sel}` : undefined}
            aria-autocomplete="list"
            aria-label="Type a command or section"
            placeholder="Jump to a section or run a command"
            className="h-14 min-w-0 flex-1 bg-transparent text-[16px] text-(--fg) outline-none placeholder:text-(--fg-3)"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden sm:inline-flex">esc</kbd>
        </div>

        <ul id={listId} role="listbox" aria-label="Commands" className="v11-noscroll flex-1 overflow-y-auto py-2">
          {filtered.length === 0 && <li className="px-4 py-6 text-[14px] text-(--fg-3)">genius: no match for &ldquo;{q}&rdquo;</li>}
          {filtered.map((item, i) => {
            const head = i === 0 || filtered[i - 1].group !== item.group ? item.group : null;
            const on = i === sel;
            return (
              <li key={item.id} role="presentation">
                {head && <p className="v11-label px-4 pb-1 pt-3 text-[10.5px] text-(--fg-3)">{head}</p>}
                <div
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={on}
                  onPointerMove={() => setSel(i)}
                  onClick={() => choose(item)}
                  className={`mx-2 flex cursor-pointer items-center justify-between gap-4 border-l-2 px-3 py-2.5 text-[14px] ${
                    on ? "border-(--amber) bg-(--amber-soft) text-(--fg)" : "border-transparent text-(--fg-2)"
                  }`}
                >
                  <span className="min-w-0 truncate">
                    {item.group === "Run" && <span className="text-(--amber)">$ </span>}
                    {item.label}
                  </span>
                  <span className="flex shrink-0 items-center gap-3 text-[12px] text-(--fg-3)">
                    <span className="hidden sm:inline">{item.hint}</span>
                    {item.key && <kbd>{item.key}</kbd>}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between gap-4 border-t border-(--rule) px-4 py-2.5 text-[11.5px] text-(--fg-3)">
          <span className="flex items-center gap-2">
            <kbd>&uarr;</kbd>
            <kbd>&darr;</kbd> navigate <kbd>&crarr;</kbd> run
          </span>
          <span className="hidden sm:inline">number keys jump to sections</span>
        </div>
      </div>
    </dialog>
  );
}
