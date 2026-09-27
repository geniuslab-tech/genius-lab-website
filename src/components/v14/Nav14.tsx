"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/v2/ui";

const LINKS = [
  { n: "01", label: "Problem", href: "#problem" },
  { n: "02", label: "Platform", href: "#layers" },
  { n: "03", label: "Second Brain", href: "#brain" },
  { n: "06", label: "Genius Portal", href: "#portal" },
  { n: "08", label: "Solutions", href: "#segments" },
];

/** A ruled bar of cells. The last cell is the one colour field. */
export function Nav14() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b-2 border-black bg-white">
        <div className="flex h-14 items-stretch">
          <a href="#top" aria-label="Genius Lab, home" className="flex shrink-0 items-center border-r-2 border-black px-4 sm:px-6">
            <BrandLogo tone="navy" className="h-[15px] w-auto sm:h-[17px]" />
          </a>
          <nav aria-label="Primary" className="hidden min-w-0 flex-1 lg:block">
            <ul className="flex h-full">
              {LINKS.map((l) => (
                <li key={l.href} className="flex border-r-2 border-black">
                  <a href={l.href} className="v14-inv v14-mono flex items-center gap-2 px-4 text-[0.75rem] xl:px-5">
                    <span className="v14-soft text-[#555]">{l.n}</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-stretch">
            <a href="#action" className="v14-inv v14-mono hidden items-center border-l-2 border-black px-5 sm:flex">
              Watch film
            </a>
            <a href="#contact" className="v14-mono flex items-center gap-3 border-l-2 border-black bg-[#1f3bff] px-4 text-white hover:bg-black sm:px-6">
              Book a demo <span aria-hidden="true">&rarr;</span>
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="v14-menu"
              className="v14-mono flex w-16 items-center justify-center border-l-2 border-black lg:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <div
        id="v14-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-14 z-30 overflow-y-auto bg-white lg:hidden"
      >
        <ul>
          {[...LINKS, { n: "09", label: "Watch film", href: "#action" }].map((l) => (
            <li key={l.href} className="border-b-2 border-black">
              <a href={l.href} onClick={() => setOpen(false)} className="v14-inv flex items-baseline gap-4 px-4 py-4 sm:px-6">
                <span className="v14-mono v14-soft text-[#555]">{l.n}</span>
                <span className="v14-head text-[2.5rem]">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
