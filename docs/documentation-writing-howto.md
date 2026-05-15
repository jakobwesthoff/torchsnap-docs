# Documentation Writing Guide

How to create and maintain pages for the Torchsnap documentation site.

## Project layout

```
src/
  assets/screenshots/     Screenshots (always light + dark pairs)
  components/             Custom Astro components
  content/docs/           All documentation pages (.mdx)
    start/                "Getting Started" section
      gadgets/            Gadget sub-pages
    development/          "Development" section
      interfaces/         Interface sub-pages
      frontend/           Frontend sub-pages
    control-api/          "Control API" section
  pages/                  Non-docs pages (landing, impressum)
todos/                    Outstanding work items
```

File paths mirror the sidebar hierarchy. Each section's landing page is an
`index.mdx` with title "Introduction".

## Workflow for creating a page

1. **Read the todo** — understand what the page should cover.
2. **Research the source** — gather facts from the Torchsnap project at
   `../torchsnap`. Use explore agents to find user-facing behavior, defaults,
   settings keys, and keyboard shortcuts. Never invent or assume details.
3. **Propose a plan** — before writing, present a brief content outline and
   list which screenshots are needed. Discuss with the user before proceeding.
4. **Collect screenshots** — the user provides macOS screenshots from their
   Desktop. Always get both light and dark variants.
5. **Trim screenshots** — use the trim tool from `../torchsnap-web`:
   ```sh
   cd ../torchsnap-web/web
   bun run tools/trim-image.ts <input> <output>
   ```
   No padding. The tool removes fully-transparent margins.
6. **Flatten light screenshots if needed** — macOS dialogs and windows have
   semi-transparent backgrounds that render as grey on the page. Flatten
   light-mode screenshots onto a white background:
   ```sh
   cd ../torchsnap-web/web
   bun -e "
   import sharp from 'sharp';
   const buf = await sharp('<path>').flatten({ background: { r: 255, g: 255, b: 255 } }).png().toBuffer();
   await Bun.write('<path>', buf);
   "
   ```
   Dark screenshots do not need flattening.
7. **Write the page** — follow the writing conventions below.
8. **Build and verify** — run `npx astro build` to confirm no errors.
9. **Remove the todo** — `git rm todos/<file>`.
10. **Commit** — follow the project's git commit conventions.

## Writing conventions

### Voice and perspective

Write from the user's perspective. The reader wants to accomplish something —
guide them through it. Use "you" and imperative mood.

- Good: "Press Cmd+Shift+Space to open the search bar."
- Bad: "Torchsnap provides a search bar that can be opened with a shortcut."

### Platform neutrality

Torchsnap is planned to be cross-platform. Do not describe it as "for macOS"
or assume macOS is the only platform.

- Keyboard shortcuts: show both variants —
  `<kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd> on macOS or
  <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd> on other platforms`.
- When mentioning defaults that are configurable, say so:
  "This is the default shortcut — you can change it in Settings."
- Platform-specific content (like the macOS quarantine flag) goes under a
  platform heading, not in the general flow.

### Tone

- Concise and direct. No filler words or marketing language.
- Explain the "why" when something might surprise the user (e.g., why the
  Gatekeeper dialog appears and why the workaround is safe).
- Don't over-document obvious UI — a screenshot often says enough.

### Page structure

- **Frontmatter**: title, description, sidebar order. Section index pages use
  `order: 0`.
- **Imports**: Starlight components first, then custom components, then assets.
- **Opening paragraph**: one or two sentences establishing what the page covers.
  Link to prerequisites if any (e.g., "If you haven't installed it yet, head
  over to the Installation guide first.").
- **H2 sections** for major topics. H3 for subtopics within.
- **LinkCard grids** at the end for "Next steps" when linking to related pages.
  Give the section its own `## Next steps` heading.

### Keyboard shortcuts

Use `<kbd>` tags for individual keys, joined with `+`:

```mdx
<kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd>
```

### Links

- Internal links use absolute paths: `/start/installation/`
- Link text should describe what the user will find, not "click here".
- When mentioning a gadget, link to its page:
  `[App Launcher](/start/gadgets/app-launcher/)`.
- When mentioning a configurable setting, link to the Configuration page.

## Screenshots

### Naming convention

Screenshots live in `src/assets/screenshots/` and are always provided as
light + dark pairs with a `-light` / `-dark` suffix:

```
launcher-light.png
launcher-dark.png
search-light.png
search-dark.png
```

### Using the Screenshot component

The `Screenshot` component renders both variants and crossfades between them
based on the site's theme. Import it and the image assets:

```mdx
import Screenshot from '../../../components/Screenshot.astro';
import exampleDark from '../../../assets/screenshots/example-dark.png';
import exampleLight from '../../../assets/screenshots/example-light.png';

<Screenshot dark={exampleDark} light={exampleLight} alt="Description of what the screenshot shows" />
```

Use the `maxWidth` prop to constrain display size. Retina screenshots are 2x,
so set maxWidth to roughly half the pixel width:

```mdx
<Screenshot ... maxWidth="400px" />
```

Full-width screenshots (like the launcher bar) do not need `maxWidth`.

### Alt text

Describe what the screenshot shows, not what it is:

- Good: `alt="Searching for 'ghost' showing the Ghostty application as a result"`
- Bad: `alt="search screenshot"`

## Available Starlight components

Import from `@astrojs/starlight/components`:

- `CardGrid`, `LinkCard` — grid of linked cards for navigation
- `Card` — standalone card
- `Tabs`, `TabItem` — tabbed content (e.g., platform-specific instructions)
- `Steps` — numbered step-by-step instructions
- `Aside` — callout boxes (note, tip, caution, danger)
- `Badge` — inline status badges
- `FileTree` — directory tree visualization

## Available custom components

### Screenshot

Theme-aware image pair with crossfade. See the screenshots section above.

### PlatformBadge

Shows an OS icon with availability status:

```mdx
import PlatformBadge from '../../../components/PlatformBadge.astro';

<div class="not-content flex flex-wrap gap-2 mb-4">
  <PlatformBadge os="mac" available />
  <PlatformBadge os="linux" />
  <PlatformBadge os="win" />
</div>
```

Without `available`, the badge shows "coming soon" in muted text.

## Sidebar configuration

The sidebar is defined in `astro.config.mjs`. Each section lists its pages
explicitly (not autogenerated) except for subsections like Gadgets, Interfaces,
and Frontend which use `autogenerate`. Page order within sections is controlled
by the `sidebar.order` frontmatter field.

## Commit conventions

- Atomic commits grouped by semantic change.
- Commit message: concise present-tense title, no prefixes (feat:, fix:, etc.).
- Body only for caveats or non-obvious trade-offs.
- Write the commit message to `.tmp-commit-msg` using the Write tool, commit
  with `git commit -F .tmp-commit-msg`, then delete the temp file.
- Never mention AI, Claude, or Anthropic.
- Remove completed todos in the same commit as the page content, or in a
  follow-up commit.
