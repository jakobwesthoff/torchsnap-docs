# Torchsnap Docs

Documentation for the [Torchsnap](https://github.com/jakobwesthoff/torchsnap)
launcher, published at <https://docs.torchsnap.app>. The site is built
with [Starlight](https://starlight.astro.build) on Astro.

## Requirements

- [just](https://github.com/casey/just). The `justfile` is the
  entrypoint for every task below. Its recipes call the Bun scripts from
  `package.json`, and `just --list` shows them all.
- [Bun](https://bun.sh) as the package manager and script runner.
  `bun.lock` is the committed lockfile.
- Node.js 22.12 or newer. `bun run` starts the Astro CLI, and the CLI
  runs on Node. Astro 7 requires at least that version.
- [oxipng](https://github.com/shssoichiro/oxipng) on your `PATH` if you
  regenerate the favicons or the social card. `build-favicon` and
  `build-og` fail without it.

## Development

```sh
just install
just dev
```

The dev server listens on <http://localhost:4321>. It also accepts
requests through
`*.trycloudflare.com` hosts, so
`cloudflared tunnel --url http://localhost:4321` exposes it publicly.

The pages are MDX files in `src/content/docs/`. The sidebar is defined in
`astro.config.mjs`. The landing page and the Impressum are Astro pages in
`src/pages/`. `docs/documentation-writing-howto.md` explains how to write
and structure pages.

## Building

```sh
just install
just build
just preview
```

`just install` installs exactly the versions in `bun.lock`. `just build`
writes the static site to `dist/`, and `just preview` serves that folder
on <http://localhost:4321>.

`just fullcycle` is the quality gate: it installs, runs every check and
builds the site. It must pass before every push, and the deploy workflow
runs it as well.

The build output contains:

- One `index.html` per page, plus `404.html`.
- `pagefind/`, the index behind the search dialog.
- `sitemap-index.xml` and `sitemap-0.xml`.
- The LLM-oriented text files from starlight-llms-txt: `llms.txt`,
  `llms-small.txt`, `llms-full.txt`, and one file per custom set in
  `_llms-txt/` (`user-guide.txt`, `gadget-api.txt`,
  `gadget-frontend.txt`, `packaging.txt`, `devtools.txt`,
  `control-api.txt`). The sets are configured in `astro.config.mjs`.
- Everything in `public/`, including the favicons and `manifest.json`.

Absolute URLs in the output come from `site` in `astro.config.mjs`, which
is `https://docs.torchsnap.app`.

`astro.config.mjs` sets `compressHTML: true`. With Astro's default
whitespace handling, starlight-llms-txt glues link titles and adjacent
images to the following word in the generated text files. Check the
`llms*.txt` output if you change that setting.

### Expected build warnings

The build prints warnings that need no action:

- `[astro-icon] Failed to load icons from "src/icons"`. The site uses
  only Iconify icon sets and has no local icon directory.
- `[content] The collection "i18n" does not exist or is empty`. The site
  has no translations, so Starlight uses its built-in UI strings.
- `Could not render /404 from route /[...slug]`. The dedicated 404 page
  from `src/content/docs/404.mdx` takes precedence and is the one written
  to `dist/404.html`.
- `[vite] [MODULE_LEVEL_DIRECTIVE]` for `"use astro:head-inject"`, once
  per MDX page. Styles of components used in MDX pages still reach the
  built pages.

## Generated assets

`just build-favicon` generates `favicon.ico`, `favicon-32.png`,
`apple-touch-icon.png`, `icon-192.png`, and `icon-192-maskable.png` in
`public/` from `src/assets/mascot-reading-1024.png`. The files are committed.
Regenerate them only when the mascot changes, and commit the results.

`just build-og` generates `public/og.png`, the social card that link
previews show for every page. It is committed as well. The card is the
docs variant of the torchsnap.app card from `web/tools/build-og.tsx` in
the torchsnap-web repository. A design change to one card usually
needs the same change in the other.

## Releasing

The site is published with GitHub Pages under the custom domain
`docs.torchsnap.app` (ADR 0002 in `docs/adr/`). The workflow
`.github/workflows/deploy.yml` runs `just fullcycle` on every push to
`main`, on pull requests, and on manual runs. It deploys `dist/` only
from `main`, and only while the repository is public. A private
repository gets the checks and the build as CI and no deployment.

Before pushing a change to `main`:

1. Run `just fullcycle` and confirm it passes and the build prints only
   the expected warnings listed above.
2. Run `just preview` and check the pages you changed, the search
   dialog, and the light and dark themes in a browser.

The first deployment needs these repository settings:

1. The repository is public.
2. Under Settings, Pages, the source is "GitHub Actions" and the custom
   domain is `docs.torchsnap.app`. The workflow does not write a `CNAME`
   file, and GitHub ignores one for workflow deployments.
3. `docs.torchsnap.app` has a CNAME record pointing to
   `jakobwesthoff.github.io`.
4. Once GitHub offers it, "Enforce HTTPS" is on. GitHub says this can
   take up to 24 hours after the domain is set.
