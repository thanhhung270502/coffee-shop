"use client";

import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (callback: (event: MediaQueryListEvent) => void) => {
      const matchMedia = window.matchMedia(query);

      matchMedia.addEventListener("change", callback);
      return () => {
        matchMedia.removeEventListener("change", callback);
      };
    },
    [query]
  );

  const getSnapshot = (): boolean => {
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => {
    throw Error("useMediaQuery is a client-only hook");
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
