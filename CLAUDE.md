# torchsnap-docs: project rules

- Follow `docs/documentation-writing-howto.md` for every page change
  (writing conventions, page workflow, screenshots, components).
- Facts come from the torchsnap repo (`../torchsnap`). Verify every
  behavioral claim against its source before writing it.
- `bun run build` must finish with only the warnings listed in
  `README.md`, "Expected build warnings". Fix any other warning or error.
- At the start of a session, before the first change that can affect
  the build's outcome, run `bun run build` once to get a baseline. If
  the baseline already fails, tell the user what fails and propose
  fixing it before starting the other work.
- The scripts in `tools/` get thorough tests with `bun test` whenever
  you touch them, edited code as much as new code. Cover the error and
  edge cases, not just the happy path. For a bug, write a regression
  test that reproduces it, run it and see it fail, then fix the code
  until it passes.
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
