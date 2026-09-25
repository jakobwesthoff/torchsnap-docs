# torchsnap-docs: project rules

- Follow `docs/documentation-writing-howto.md` for every page change
  (writing conventions, page workflow, screenshots, components).
- Facts come from the torchsnap repo (`../torchsnap`). Verify every
  behavioral claim against its source before writing it.
- The `justfile` is the entrypoint for every task. Add new tasks there
  as recipes.
- The quality gate is `just fullcycle`. It must pass, and the build must
  print only the warnings listed in `README.md`, "Expected build
  warnings". Fix any other warning or error.
- At the start of a session, before the first change that can affect
  the gate's outcome, run `just fullcycle` once to get a baseline. If
  the baseline already fails, tell the user what fails and propose
  fixing it before starting the other work.
- Every piece of TypeScript you touch gets thorough Vitest tests
  (`just test`), edited code as much as new code. Cover the error and
  edge cases, not just the happy path. `just test-coverage` shows what
  is still untested.
- Browser behavior lives in `*.client.ts` modules next to their
  component, which only imports and calls them. Test them under jsdom
  (`// @vitest-environment jsdom`). Scripts that must stay inline, like
  the pre-paint script in `ThemeSelect.astro` or the `define:vars`
  script of the Impressum, are the exception.
- Scripts in `tools/` export their logic and run `main` only under
  `import.meta.main`, so tests import them without side effects. They
  use `node:` APIs, not Bun globals, so Vitest can run them.
- Work test-first. For a bug, write a regression test that reproduces
  it, run it and see it fail, then fix the code until it passes.
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
