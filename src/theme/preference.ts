export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

// Starlight stores the theme preference under this key.
export const THEME_STORAGE_KEY = "starlight-theme";

export function readPreference(): ThemePreference {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "system";
}

export function writePreference(value: ThemePreference): void {
  if (value === "system") {
    localStorage.setItem(THEME_STORAGE_KEY, "");
  } else {
    localStorage.setItem(THEME_STORAGE_KEY, value);
  }
}

export function resolvePreference(preference: ThemePreference): ResolvedTheme {
  if (preference === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return preference;
}

// Starlight always sets data-theme to "light" or "dark" (never deletes it).
export function applyTheme(resolved: ResolvedTheme): void {
  document.documentElement.dataset.theme = resolved;
}
