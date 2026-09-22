# Installation page: first launch of signed builds

Page: `src/content/docs/start/installation.mdx` (macOS section)

The page describes the first launch of the unsigned 0.9.x builds. Once
releases are built with `just build --release --sign` (torchsnap commit
`3e8795e`, ADR 0047 there), macOS shows a different dialog and offers a
different way out. The page, its screenshots and the Homebrew section
need updating. Do this together with the first release built with
`--sign`, not before: until then the current text matches what users
see.

## What changes for users (verified 2026-09-22, macOS 26.6.2)

Verified with an ad-hoc signed test build downloaded in a browser, so it
carried the quarantine flag. The test app was named "Torchsnap Test";
the real release shows "torchsnap" (the Tauri `productName`).

Unsigned 0.9.x builds (current screenshot `gatekeeper-light.png`):
"“torchsnap” is damaged and can’t be opened. You should move it to the
Trash." with "Move to Trash" and "Cancel". `syspolicy_check
distribution` rejects that build with a fatal code-signing error.

Ad-hoc signed builds:

1. Double-click shows "“torchsnap” Not Opened" / "Apple could not
   verify “torchsnap” is free of malware that may harm your Mac or
   compromise your privacy." Buttons: "Move to Trash" (the highlighted
   default) and "Done". The user has to click "Done".
2. System Settings → Privacy & Security, section Security (below "Allow
   applications from: App Store & Known Developers"): "“torchsnap” was
   blocked to protect your Mac." with an "Open Anyway" button.
3. "Open Anyway" opens a "Privacy & Security" dialog: "You are
   attempting to open an app that may cause harm to your Mac or
   compromise your privacy. Enter an administrator’s username and
   password to allow this." Touch ID was not offered. A user without
   admin rights cannot finish this step alone.
4. After OK the app does not start by itself. Double-click it again; it
   starts without another dialog.
5. Every later launch starts without a dialog.

## Page changes

- Replace the section "Removing the quarantine flag" with a first-launch
  section for the flow above, one screenshot per step 1 to 3. Mention the
  administrator password and the second double-click; drop "Click
  Cancel" (the button is now "Done").
- Keep the `xattr -dr com.apple.quarantine /Applications/torchsnap.app`
  command as the alternative. Before writing it up, check that it still
  works on a signed build and whether it needs admin rights. Neither was
  tested on 2026-09-22.
- Keep the existing reasoning that the workaround is safe because the
  source is open (the writing guide asks for the why).
- Homebrew section: remove "Homebrew will handle the quarantine flag
  automatically with no manual step needed." Homebrew 7.0.2 has no
  quarantine options any more, and casks that fail the Gatekeeper check
  are disabled in the official tap since 2026-09-01. Until the app is
  notarized, a Homebrew install hits the same first-launch flow.
- The DMG screenshot (`dmg-light.png` / `dmg-dark.png`, window
  `/Volumes/torchsnap` with `torchsnap` and `Applications`) can stay if
  the signed DMG window looks the same; compare once when building.
- Not decided yet, so not part of this todo: an install command that
  downloads with `curl` (such downloads carry no quarantine flag and
  start without any dialog, verified 2026-09-22). It depends on the
  website hosting decision.

## Screenshots to produce

All in `src/assets/screenshots/`, each as a `-light` and a `-dark`
variant. They replace `gatekeeper-light.png` / `gatekeeper-dark.png`;
delete those and their imports once the new ones are in.

| File stem | Content |
| --- | --- |
| `gatekeeper-not-opened` | Step 1 dialog: "“torchsnap” Not Opened", Gatekeeper icon, text, "Move to Trash" and "Done". Window capture including the shadow, like the existing `gatekeeper-*.png`. |
| `gatekeeper-open-anyway` | Step 2: System Settings → Privacy & Security, cropped to the Security section with "Allow applications from" and the row "“torchsnap” was blocked to protect your Mac." plus "Open Anyway". |
| `gatekeeper-admin-auth` | Step 3 dialog: padlock icon, "Privacy & Security", the text, username and password fields, Cancel / OK. The username field is prefilled with the account name, so take it from a neutral account (see below) or replace the name before capturing. |

Suggested alt texts: "macOS dialog saying torchsnap was not opened
because Apple could not verify it", "Privacy & Security settings with
the Open Anyway button for torchsnap", "macOS asking for an
administrator password to open torchsnap".

## How to produce them

1. In the torchsnap repo, at the commit of the release, run
   `just build --release --sign`. The DMG is
   `src-tauri/target/release/bundle/dmg/torchsnap_<version>_aarch64.dmg`.
   `codesign -dv src-tauri/target/release/bundle/macos/torchsnap.app`
   must show `flags=0x10002(adhoc,runtime)`.
2. Use a separate macOS user account with admin rights and no Torchsnap
   installed. The screenshots need the real name "torchsnap", which would
   collide with an installed copy in `/Applications`, and the account
   name shows up in the step 3 dialog.
3. The DMG must be downloaded in a browser, otherwise it has no
   quarantine flag and no dialog appears. Either download it from the
   GitHub release, or serve it locally with
   `python3 -m http.server 4830 -d <dmg directory>` and open
   `http://localhost:4830/<dmg file>` in the browser.
4. Set the appearance to Light (System Settings → Appearance), install
   from the DMG, and capture steps 1 to 3 (window captures:
   Cmd+Shift+4, then Space, then click the window). Finish the approval.
5. Approval sticks to that copy (its quarantine flag changed from `0381`
   to `03c1` in the test). For the Dark set, delete the app, set the
   appearance to Dark, download the DMG again and repeat. That a fresh
   download asks again is expected but was not tested.
6. Post-process as the writing guide describes: trim with
   `../torchsnap-web/web/tools/trim-image.ts` (no padding), flatten the
   light variants onto white, and set `maxWidth` to about half the pixel
   width.

Reference screenshots of the test build ("Torchsnap Test", dark
appearance) exist from 2026-09-22 but are not in this repo; take new ones
with the real name for both themes.
