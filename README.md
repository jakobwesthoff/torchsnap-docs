# Torchsnap Docs

Documentation for the [Torchsnap](https://github.com/jakobwesthoff/torchsnap)
launcher, published at <https://docs.torchsnap.app>. The site is built
with [Starlight](https://starlight.astro.build) on Astro.

## Requirements

- [Bun](https://bun.sh) as the package manager and script runner.
  `bun.lock` is the committed lockfile.
- Node.js 22.12 or newer. `bun run` starts the Astro CLI, and the CLI
  runs on Node. Astro 7 requires at least that version.
- [oxipng](https://github.com/shssoichiro/oxipng) on your `PATH` if you
  regenerate the favicons. `build:favicon` fails without it.

## Development

```sh
bun install
bun run dev
```

The dev server listens on <http://localhost:4321>. `bun run start` is an
alias for `bun run dev`. The dev server also accepts requests through
`*.trycloudflare.com` hosts, so
`cloudflared tunnel --url http://localhost:4321` exposes it publicly.

The pages are MDX files in `src/content/docs/`. The sidebar is defined in
`astro.config.mjs`. The landing page and the Impressum are Astro pages in
`src/pages/`. `docs/documentation-writing-howto.md` explains how to write
and structure pages.

## Building

```sh
bun install --frozen-lockfile
bun run build
bun run preview
```

`bun run build` writes the static site to `dist/`, and `bun run preview`
serves that folder on <http://localhost:4321>.

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

`bun run build:favicon` generates `favicon.ico`, `favicon-32.png`,
`apple-touch-icon.png`, `icon-192.png`, and `icon-192-maskable.png` in
`public/` from `src/assets/mascot-1024.png`. The files are committed.
Regenerate them only when the mascot changes, and commit the results.

## Releasing

1. Start from a clean checkout of the commit you want to release.
2. Run `bun install --frozen-lockfile`.
3. Run `bun run build` and confirm it finishes with only the expected
   warnings listed above.
4. Run `bun run preview` and check the pages you changed, the search
   dialog, and the light and dark themes in a browser.
5. Publish the contents of `dist/`.

Publishing is not set up yet. No hosting target is configured and the
repository has no deploy workflow.
