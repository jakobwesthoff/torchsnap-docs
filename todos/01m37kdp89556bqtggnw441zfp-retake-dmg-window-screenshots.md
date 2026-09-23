# Retake the DMG window screenshots

Page: `src/content/docs/start/installation.mdx` (macOS, "DMG Download")

`src/assets/screenshots/dmg-light.png` and `dmg-dark.png` show the DMG
window of the old bundle: title `/Volumes/torchsnap` and the app labelled
"torchsnap". Since torchsnap commit `afc4014` the product name is
`Torchsnap`, so the DMG mounts as volume `Torchsnap` and contains
`Torchsnap.app` next to the `Applications` link. The page text already
uses the new name.

## Current files

| File | Pixels | Resolution | Alpha |
| --- | --- | --- | --- |
| `dmg-light.png` | 1508 × 1179 | 144 dpi (Retina, 2x) | no, flattened onto white |
| `dmg-dark.png` | 1512 × 1183 | 144 dpi (Retina, 2x) | yes |

Both are window captures including the window shadow, trimmed. They were added in `65f7f3d` and compressed with oxipng in
`64613f8`. The page renders them with `maxWidth="400px"`.

## New screenshots

- Same framing: the whole Finder window of the mounted DMG, as it opens,
  with shadow, on a Retina display. Keep the pixel size
  close to the current ~1510 × 1180 so the layout at `maxWidth="400px"`
  stays the same.
- Keep the file names, so the imports in `installation.mdx` need no
  change.
- Check in both: window title `/Volumes/Torchsnap`, app label
  "Torchsnap", the `Applications` link.

## How to produce them

1. Open the DMG of a current build,
   `../torchsnap/src-tauri/target/release/bundle/dmg/Torchsnap_<version>_aarch64.dmg`,
   or `Torchsnap.dmg` from the latest release. Do not resize the window.
   Unmount any other `Torchsnap` volume first, or the title reads
   `/Volumes/Torchsnap 1`.
2. With the appearance set to Light, capture the window: Cmd+Shift+4,
   then Space, then click the window. Repeat with Dark.
3. Trim both without padding, as the writing guide describes
   (`bun run tools/trim-image.ts <input> <output>` in
   `../torchsnap-web/web`).
4. Flatten the light variant onto white (writing guide, step 6). The dark
   variant keeps its alpha.
5. Compress both with `oxipng`, then replace the two files.
