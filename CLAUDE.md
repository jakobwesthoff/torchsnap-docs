# torchsnap-docs: project rules

- Follow `docs/documentation-writing-howto.md` for every page change
  (writing conventions, page workflow, screenshots, components, commit
  rules).
- Facts come from the torchsnap repo (`../torchsnap`). Verify every
  behavioral claim against its source before writing it.
- `bun run build` must finish with only the warnings listed in
  `README.md`, "Expected build warnings". Fix any other warning or error.
- ADRs: `EDITOR=true adrs new "<title>"` in `docs/adr/`, Status set to
  `Accepted` when decided.
