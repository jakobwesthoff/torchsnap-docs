// A `matchMedia` stand-in for jsdom, which has none. Only
// `(prefers-color-scheme: dark)` can match, and `setScheme` switches the
// simulated OS setting and notifies every listener that is still
// attached, the way a real `MediaQueryList` fires `change`.

import { vi } from "vitest";

export interface FakeMatchMedia {
  setScheme(scheme: "light" | "dark"): void;
  listenerCount(): number;
}

export function installFakeMatchMedia(initial: "light" | "dark"): FakeMatchMedia {
  let scheme = initial;
  const listeners = new Set<() => void>();

  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      get matches() {
        return query === "(prefers-color-scheme: dark)" && scheme === "dark";
      },
      addEventListener: (_type: "change", listener: () => void) => listeners.add(listener),
      removeEventListener: (_type: "change", listener: () => void) => listeners.delete(listener),
    })),
  );

  return {
    setScheme(next) {
      scheme = next;
      for (const listener of listeners) listener();
    },
    listenerCount: () => listeners.size,
  };
}
