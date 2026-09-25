// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import { installFakeMatchMedia } from "../test/fakeMatchMedia";
import { THEME_STORAGE_KEY } from "./preference";
import { initThemeToggle } from "./toggle.client";

// Starlight renders ThemeSelect twice on every page: in the header and
// in the mobile menu footer. The fixture mirrors that, reduced to the
// markup the handler reads.
function renderToggles(count = 2) {
  const toggle = `
    <div class="theme-toggle" role="radiogroup" aria-label="Theme">
      <button type="button" role="radio" data-value="system" aria-checked="false"></button>
      <button type="button" role="radio" data-value="light" aria-checked="false"></button>
      <button type="button" role="radio" data-value="dark" aria-checked="false"></button>
    </div>
  `;
  document.body.innerHTML = toggle.repeat(count);
  return Array.from(document.querySelectorAll<HTMLElement>(".theme-toggle")).map((root) => {
    const [system, light, dark] = Array.from(root.querySelectorAll("button"));
    return { root, system, light, dark };
  });
}

function checkedIn(root: HTMLElement) {
  return Array.from(root.querySelectorAll("button"))
    .filter((b) => b.getAttribute("aria-checked") === "true")
    .map((b) => b.dataset.value);
}

function press(button: HTMLElement, key: string) {
  const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
  button.dispatchEvent(event);
  return event;
}

const html = document.documentElement;

beforeEach(() => {
  localStorage.clear();
  delete html.dataset.theme;
  delete html.dataset.themePreference;
  document.body.innerHTML = "";
});

describe("initThemeToggle", () => {
  it("does nothing without a toggle on the page", () => {
    const media = installFakeMatchMedia("light");
    initThemeToggle();
    expect(media.listenerCount()).toBe(0);
  });

  it("does nothing when the toggles have no options", () => {
    const media = installFakeMatchMedia("light");
    document.body.innerHTML = `<div class="theme-toggle"></div>`;
    initThemeToggle();
    expect(media.listenerCount()).toBe(0);
  });

  it("checks the stored preference in every toggle on load", () => {
    installFakeMatchMedia("light");
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    const [header, menu] = renderToggles();

    initThemeToggle();

    expect(checkedIn(header.root)).toEqual(["dark"]);
    expect(checkedIn(menu.root)).toEqual(["dark"]);
  });
});

describe("selecting with the mouse", () => {
  it("stores, applies and marks the clicked option", () => {
    installFakeMatchMedia("light");
    const [header] = renderToggles(1);
    initThemeToggle();

    header.dark.click();

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(html.dataset.theme).toBe("dark");
    expect(html.dataset.themePreference).toBe("dark");
    expect(checkedIn(header.root)).toEqual(["dark"]);
  });

  it("resolves system through the OS setting", () => {
    installFakeMatchMedia("dark");
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    const [header] = renderToggles(1);
    initThemeToggle();

    header.system.click();

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("");
    expect(html.dataset.theme).toBe("dark");
    expect(html.dataset.themePreference).toBe("system");
  });

  it("ignores an option with an unknown value", () => {
    installFakeMatchMedia("light");
    const [header] = renderToggles(1);
    header.light.dataset.value = "sepia";
    initThemeToggle();

    header.light.click();

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
    expect(html.dataset.themePreference).toBeUndefined();
  });

  it("keeps the other toggle in sync", () => {
    installFakeMatchMedia("light");
    const [header, menu] = renderToggles();
    initThemeToggle();

    header.dark.click();

    expect(checkedIn(menu.root)).toEqual(["dark"]);
  });
});

describe("selecting with the keyboard", () => {
  it.each([
    ["ArrowRight", "system", "light"],
    ["ArrowDown", "light", "dark"],
    ["ArrowRight", "dark", "system"],
    ["ArrowLeft", "light", "system"],
    ["ArrowUp", "system", "dark"],
    ["Home", "dark", "system"],
    ["End", "system", "dark"],
  ] as const)("%s from %s selects and focuses %s", (key, from, to) => {
    installFakeMatchMedia("light");
    const [header, menu] = renderToggles();
    initThemeToggle();

    const event = press(header[from], key);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(header[to]);
    expect(checkedIn(header.root)).toEqual([to]);
    expect(checkedIn(menu.root)).toEqual([to]);
    expect(html.dataset.themePreference).toBe(to);
  });

  it("stays within its own toggle when wrapping", () => {
    installFakeMatchMedia("light");
    const [header, menu] = renderToggles();
    initThemeToggle();

    press(menu.dark, "ArrowRight");

    expect(document.activeElement).toBe(menu.system);
    expect(document.activeElement).not.toBe(header.system);
  });

  it("moves focus but selects nothing when landing on an unknown value", () => {
    installFakeMatchMedia("light");
    const [header] = renderToggles(1);
    header.light.dataset.value = "sepia";
    initThemeToggle();

    press(header.system, "ArrowRight");

    expect(document.activeElement).toBe(header.light);
    expect(html.dataset.themePreference).toBeUndefined();
  });

  it("leaves other keys to the browser", () => {
    installFakeMatchMedia("light");
    const [header] = renderToggles(1);
    initThemeToggle();

    const event = press(header.light, "Enter");

    expect(event.defaultPrevented).toBe(false);
    expect(checkedIn(header.root)).toEqual(["system"]);
  });
});

describe("following the OS in system mode", () => {
  it("re-applies the theme when the OS scheme changes", () => {
    const media = installFakeMatchMedia("light");
    renderToggles();
    initThemeToggle();

    media.setScheme("dark");
    expect(html.dataset.theme).toBe("dark");

    media.setScheme("light");
    expect(html.dataset.theme).toBe("light");
  });

  it("listens once, however many toggles the page has", () => {
    const media = installFakeMatchMedia("light");
    renderToggles();
    initThemeToggle();
    expect(media.listenerCount()).toBe(1);
  });

  it("stops following the OS once an explicit theme is picked in either toggle", () => {
    const media = installFakeMatchMedia("light");
    const [header] = renderToggles();
    initThemeToggle();

    header.light.click();
    media.setScheme("dark");

    expect(media.listenerCount()).toBe(0);
    expect(html.dataset.theme).toBe("light");
  });

  it("does not listen when an explicit theme is stored", () => {
    const media = installFakeMatchMedia("light");
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    renderToggles();
    initThemeToggle();
    expect(media.listenerCount()).toBe(0);
  });

  it("keeps a single listener when system is picked again", () => {
    const media = installFakeMatchMedia("light");
    const [header, menu] = renderToggles();
    initThemeToggle();

    header.system.click();
    menu.system.click();

    expect(media.listenerCount()).toBe(1);
  });
});
