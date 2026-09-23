# torchsnap-docs: project rules

- Writing, page workflow, screenshots, components, commit rules:
  `docs/documentation-writing-howto.md`. Follow it for every page change.
- Facts come from the torchsnap repo (`../torchsnap`); verify every
  behavioral claim against its source before writing it.
- Pages: `src/content/docs/` (MDX). Sidebar: `astro.config.mjs`.
- Build: `bun run build`; the expected warnings are listed in `README.md`,
  "Expected build warnings". Any other warning or error needs fixing.
- ADRs: `docs/adr/`, created with `EDITOR=true adrs new "<title>"`,
  Status set to `Accepted` when decided.
- Open work: `todos/`.
- Deployment: GitHub Pages via `.github/workflows/deploy.yml`, only while
  the repository is public (ADR 0002). Go-live settings: `README.md`,
  "Releasing".
