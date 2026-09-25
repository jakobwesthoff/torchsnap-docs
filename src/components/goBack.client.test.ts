// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { initGoBack } from "./goBack.client";

function render() {
  document.body.innerHTML = `<a href="/" data-go-back>Go back</a>`;
  return document.querySelector<HTMLAnchorElement>("[data-go-back]")!;
}

function click(link: HTMLElement) {
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });
  link.dispatchEvent(event);
  return event;
}

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("initGoBack", () => {
  it("goes back in history when there is a previous page", () => {
    vi.spyOn(history, "length", "get").mockReturnValue(3);
    const back = vi.spyOn(history, "back").mockImplementation(() => {});
    const link = render();
    initGoBack();

    const event = click(link);

    expect(event.defaultPrevented).toBe(true);
    expect(back).toHaveBeenCalledTimes(1);
  });

  it("follows the link to the start page when the tab has no history", () => {
    vi.spyOn(history, "length", "get").mockReturnValue(1);
    const back = vi.spyOn(history, "back").mockImplementation(() => {});
    const link = render();
    initGoBack();

    const event = click(link);

    expect(event.defaultPrevented).toBe(false);
    expect(back).not.toHaveBeenCalled();
  });

  it("does nothing on a page without the button", () => {
    expect(() => initGoBack()).not.toThrow();
  });
});
