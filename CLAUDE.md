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
- Todos live in `todos/`. `todos/README.md` describes their format.
- Once a todo is implemented, delete its file and every reference to it
  (find them with `rg <ulid> . ../torchsnap ../torchsnap-web`). If a
  referencing file needs information from the todo, copy just that part
  into it, compact and precise.
- After a large work package is done, have Sonnet or Haiku agents
  (choose per scan) check all todos for work that is already done.
  Delete todos that are fully done and rewrite partly done ones so they
  cover only the remaining work.
