// Client wiring for GoBackButton.astro. The button is a link to "/",
// which stays the fallback when the tab has no page to go back to
// (e.g. the page was opened directly in a new tab).

export function initGoBack(): void {
  document.querySelector("[data-go-back]")?.addEventListener("click", (e) => {
    if (history.length > 1) {
      e.preventDefault();
      history.back();
    }
  });
}
