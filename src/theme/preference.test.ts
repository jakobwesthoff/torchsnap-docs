// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import { installFakeMatchMedia } from "../test/fakeMatchMedia";
import {
  THEME_STORAGE_KEY,
  applyTheme,
  readPreference,
  resolvePreference,
  writePreference,
} from "./preference";

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

describe("readPreference", () => {
  it("shares Starlight's storage key", () => {
    expect(THEME_STORAGE_KEY).toBe("starlight-theme");
  });

  it("defaults to system when nothing is stored", () => {
    expect(readPreference()).toBe("system");
  });

  it.each(["light", "dark"] as const)("returns a stored %s", (value) => {
    localStorage.setItem(THEME_STORAGE_KEY, value);
    expect(readPreference()).toBe(value);
  });

  it.each(["", "auto", "sepia"])("reads %j as system", (value) => {
    localStorage.setItem(THEME_STORAGE_KEY, value);
    expect(readPreference()).toBe("system");
  });
});

describe("writePreference", () => {
  it.each(["light", "dark"] as const)("stores %s", (value) => {
    writePreference(value);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(value);
  });

  it("stores system as the empty string Starlight uses for auto", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    writePreference("system");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("");
    expect(readPreference()).toBe("system");
  });
});

describe("resolvePreference", () => {
  it.each(["light", "dark"] as const)("returns an explicit %s unchanged", (value) => {
    installFakeMatchMedia(value === "light" ? "dark" : "light");
    expect(resolvePreference(value)).toBe(value);
  });

  it.each(["light", "dark"] as const)("follows the OS for system when it is %s", (scheme) => {
    installFakeMatchMedia(scheme);
    expect(resolvePreference("system")).toBe(scheme);
  });
});

describe("applyTheme", () => {
  it.each(["light", "dark"] as const)("sets data-theme to %s", (theme) => {
    applyTheme(theme);
    expect(document.documentElement.dataset.theme).toBe(theme);
  });
});
