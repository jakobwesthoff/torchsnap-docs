// Client wiring for ThemeSelect.astro. Starlight renders the component
// twice on every page, in the header and in the mobile menu footer, and
// both instances share one preference: picking an option in either
// updates both, and the page follows the OS through a single listener
// while the preference is "system".

import {
  applyTheme,
  readPreference,
  resolvePreference,
  writePreference,
  type ThemePreference,
} from "./preference";

const ORDER: ThemePreference[] = ["system", "light", "dark"];

export function initThemeToggle(): void {
  const groups = Array.from(document.querySelectorAll<HTMLElement>(".theme-toggle"))
    .map((root) =>
      Array.from(root.querySelectorAll<HTMLButtonElement>("button[role='radio'][data-value]")),
    )
    .filter((buttons) => buttons.length > 0);
  if (groups.length === 0) return;
  const allButtons = groups.flat();

  // The system-mode listener is only attached while the active
  // preference is "system" — track its disposer so we can detach
  // when the user picks an explicit Light/Dark.
  let detachSystemListener: (() => void) | null = null;

  function attachSystemListener() {
    detachSystemListener?.();
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme(resolvePreference("system"));
    mql.addEventListener("change", handler);
    detachSystemListener = () => mql.removeEventListener("change", handler);
  }

  function markChecked(value: ThemePreference) {
    for (const btn of allButtons) {
      btn.setAttribute("aria-checked", String(btn.dataset.value === value));
    }
  }

  function setPreference(next: ThemePreference) {
    writePreference(next);
    applyTheme(resolvePreference(next));
    document.documentElement.dataset.themePreference = next;
    markChecked(next);
    if (next === "system") {
      attachSystemListener();
    } else {
      detachSystemListener?.();
      detachSystemListener = null;
    }
  }

  const initial = readPreference();
  markChecked(initial);
  if (initial === "system") attachSystemListener();

  // Click selects the option. Arrow keys move focus and selection
  // within one toggle, matching the WAI-ARIA radiogroup pattern.
  // Home/End jump to its first/last option.
  for (const buttons of groups) {
    for (const btn of buttons) {
      btn.addEventListener("click", () => {
        const value = btn.dataset.value as ThemePreference | undefined;
        if (value && ORDER.includes(value)) setPreference(value);
      });

      btn.addEventListener("keydown", (event) => {
        const idx = buttons.indexOf(btn);
        let target: number | null = null;
        switch (event.key) {
          case "ArrowRight":
          case "ArrowDown":
            target = (idx + 1) % buttons.length;
            break;
          case "ArrowLeft":
          case "ArrowUp":
            target = (idx - 1 + buttons.length) % buttons.length;
            break;
          case "Home":
            target = 0;
            break;
          case "End":
            target = buttons.length - 1;
            break;
        }
        if (target === null) return;
        event.preventDefault();
        const next = buttons[target];
        next.focus();
        const value = next.dataset.value as ThemePreference | undefined;
        if (value && ORDER.includes(value)) setPreference(value);
      });
    }
  }
}
