---
kind: docs
status: open
area: [src/content/docs/start/installation.mdx, src/content/docs/start/settings.mdx]
---

# Screenshots for updating and the welcome window

Pages: `src/content/docs/start/installation.mdx` ("First launch",
"Updating") and `src/content/docs/start/settings.mdx` ("General").

The text for the self-updating Torchsnap (torchsnap 0.12.0) and its
welcome window landed without screenshots (decided 2026-09-24, to be
added later). One existing screenshot is outdated, and three new ones
are wanted.

## Retake

- `settings-general-light.png` / `-dark.png`: the General section now
  ends with an **Updates** section (switch "Check for updates
  automatically", buttons **Show Welcome** and **Check for Updates**).
  Same framing and size as the current files, so the page needs no
  change.

## New

- **Welcome window, page 1** (launcher preview with Snappy, "Welcome to
  Torchsnap", button "Choose your shortcut"), for "First launch" on the
  installation page. Suggested names `welcome-light.png` /
  `welcome-dark.png`.
- **Welcome window, page 3** ("Startup and updates" with both switches),
  optional, for the same section.
- **Update window with an update available** (versions, notes of more
  than one release, **Skip This Version**, **Later**, **Install and
  Restart**), for "Updating". Suggested names `update-available-light.png`
  / `update-available-dark.png`.

## How to reach the states

- Welcome window: Settings → General → **Show Welcome**.
- Update window with notes of several releases: needs a newer version to
  exist. Either take it right after a real release, from the previous
  version via **Check for Updates...**, or run a build with the
  environment variable `TORCHSNAP_UPDATE_FEED` pointing at a locally
  served feed (torchsnap ADR 0053). Release builds accept only https
  there unless the build sets `dangerousInsecureTransportProtocol`.

## Processing

As in the writing guide: window captures with shadow on a Retina
display (Cmd+Shift+4, Space, click), trimmed with
`bun run tools/trim-image.ts` in `../torchsnap-web/web`, light variants
flattened onto white, all compressed with `oxipng`. Then add the
`<Screenshot>` imports to the two pages.
