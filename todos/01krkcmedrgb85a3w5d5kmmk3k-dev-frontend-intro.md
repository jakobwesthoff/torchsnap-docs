# Frontend Development Introduction

Section index page. Path: `development/gadget-sdk/frontend/`

- What gadget frontends are: React components rendered in the host's webview
- Three UI surfaces: custom views (full launcher takeover), inline views (above result list), settings panels
- The `@torchsnap/gadget-sdk` TypeScript package
- How frontend bundles are declared in `[frontend]` manifest section
- Shim pattern: SDK reads from `window.__torchsnap` at runtime
- Vite plugin for building gadget frontends
