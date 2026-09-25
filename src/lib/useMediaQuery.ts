"use client";

import { useSyncExternalStore } from "react";

/** Subscribes to a media query. Returns false on the server and during hydration. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
