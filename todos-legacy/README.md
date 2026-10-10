# Todos

Each file is one piece of deferred work: a bug, a feature, a refactor,
an investigation or an open question. The file is all that carries
forward once the conversation that produced it is gone, so it has to
stand on its own.

## Layout

Todos live directly in `todos/`. Once three or more todos share a
scope (the part of the site you would open the editor in to work on
them), move them into a subdirectory named after it. Kind, severity and
status live in the frontmatter, not in the directory tree.

## File names

`<ulid>-<short-description>.md`, with the ULID from `mkulid -l`. The
ULID is the todo's stable identifier. Keep it when moving or renaming
the file.

## Frontmatter

Every todo starts with YAML frontmatter, then a blank line, then the H1
title. Fields appear in this order. Lists are always flow style
(`[a, b]`) so each field stays on one grep-able line. Leave out a field
that does not apply instead of writing it empty.

```yaml
---
kind: docs
status: open
area: [src/content/docs/start/installation.mdx]
tags: [<tag>]
depends-on: [todos/<ulid>-<name>.md]
---
```

- `kind` (required): `bug`, `feature` (new capability), `improvement`
  (makes existing behavior better), `refactor`, `chore`,
  `investigation`, `question`, `decision`, `docs`.
- `severity` (optional): `critical`, `high`, `medium`, `low`.
- `status` (required): `open`, `needs-discussion`, `blocked` (waiting on
  a named todo or external event), `deferred` (parked on purpose, no
  named trigger), `in-progress`. Put any nuance in the first paragraph
  after the title.
- `area` (optional): repo-relative paths the todo is about.
- `tags` (optional): only from the tag list below.
- `depends-on` (optional): todos that must land first. Looser relations
  stay as prose in the body.

Tags: none defined yet. Add a tag to this list before using it
anywhere.

## Writing a todo

After the title, capture the topic, what was found, any discussion and
the decisions made. Point at code with repo-relative `path:line`
references and link other todos by their path under `todos/`.

## Finding work

The frontmatter is built for `rg`:

```sh
rg -l '^status: open' todos/
rg -l '^kind: bug' todos/
```

Line numbers in older todos drift as the code changes. Find the code
again before acting on a reference.

## Closing a todo

Once a todo is implemented, delete its file and every reference to it.
`rg <ulid> . ../torchsnap ../torchsnap-web` from the repository root
finds references in this repo and the sibling repos, whether they cite
the full path or only the file name. If a referencing file needs
information from the todo, copy just that part into it, compact and
precise.

## Sweeping for finished work

After a large work package is done, Sonnet or Haiku agents check every
todo for work that has already been done. Todos that are fully done are
deleted as described above. Todos that are partly done are rewritten to
cover only the remaining work.
