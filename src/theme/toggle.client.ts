import {
  applyTheme,
  readPreference,
  resolvePreference,
  writePreference,
  type ThemePreference,
} from "./preference";

const ORDER: ThemePreference[] = ["system", "light", "dark"];

export function initThemeToggle(): void {
  document.querySelectorAll<HTMLElement>(".theme-toggle").forEach((root) => {
    const buttons = Array.from(
      root.querySelectorAll<HTMLButtonElement>("button[role='radio'][data-value]"),
    );
    if (buttons.length === 0) return;

    let detachSystemListener: (() => void) | null = null;

    function attachSystemListener() {
      detachSystemListener?.();
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme(resolvePreference("system"));
      mql.addEventListener("change", handler);
      detachSystemListener = () => mql.removeEventListener("change", handler);
    }

    function setPreference(next: ThemePreference) {
      writePreference(next);
      applyTheme(resolvePreference(next));
      document.documentElement.dataset.themePreference = next;
      for (const btn of buttons) {
        btn.setAttribute("aria-checked", String(btn.dataset.value === next));
      }
      if (next === "system") {
        attachSystemListener();
      } else {
        detachSystemListener?.();
        detachSystemListener = null;
      }
    }

    const initial = readPreference();
    for (const btn of buttons) {
      btn.setAttribute("aria-checked", String(btn.dataset.value === initial));
    }
    if (initial === "system") attachSystemListener();

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
  });
}
