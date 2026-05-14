# macOS: Allowing Unsigned Applications

Path: `usage/macos-unsigned-app/` (or similar)

- Torchsnap is currently not code-signed
- macOS Gatekeeper will block it on first launch
- Step-by-step guide to allow it via System Settings → Privacy & Security
- Possibly mention `xattr -cr` as alternative
- Screenshots of the macOS dialogs
- Note that signing is planned for the future
