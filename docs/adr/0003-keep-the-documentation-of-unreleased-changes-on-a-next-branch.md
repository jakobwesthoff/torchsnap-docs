# 3. Keep the documentation of unreleased changes on a next branch

Date: 2026-10-24

## Status

Accepted

## Context

`.github/workflows/deploy.yml` publishes the site from `main` on every
push while the repository is public (ADR 0002). Torchsnap changes on its
own `main` between releases, and every change to its behaviour or
interfaces updates these docs in the same work. Pushed to `main`, those
pages would go live before the version they describe is released.
Unpushed, they exist only in a local checkout.

## Decision

The branch `next` holds the documentation of torchsnap's `main`.
Documentation for a torchsnap change is committed to `next` and may be
pushed at any time. The workflow runs `just fullcycle` on pushes to
`next` as well, and deploys only from `main`.

`main` holds the documentation of the latest release. A correction to
that documentation is committed to `main`, pushed, and then merged into
`next`, so `next` always contains `main`.

A release publishes the documentation once torchsnap's
`just release-publish` has finished: `main` is fast-forwarded to `next`
and pushed, and that push deploys the site.

## Consequences

- docs.torchsnap.app describes the latest released version, and the
  documentation of unreleased changes is on GitHub without being
  published.
- The fast-forward at a release fails if a correction on `main` was not
  merged into `next`; merge it, then fast-forward.
- Work on the docs starts from `next`, unless it corrects the released
  documentation.
