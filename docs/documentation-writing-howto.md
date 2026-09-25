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
8. **Validate against source** — every behavioral claim (when a function is
   called, what the host checks, what errors are returned) must be verified
   against the Torchsnap source code. Do not rely on architecture docs or
   prior knowledge alone; the code may have changed. Grep for the function,
   read the implementation, confirm the claim.
9. **Build continuously** — run `just build` after every meaningful
   change, not just once at the end. MDX parsing issues (`${...}` as JSX,
   `<...>` as elements) and broken links surface only at build time.
10. **Create cross-repo todos when docs reveal debt** — if documenting current
   behavior reveals a design flaw, missing feature, or inconsistency, create
   a todo in `../torchsnap/todos/` describing what should change, in the
   format of `../torchsnap/todos/README.md`. Don't block the docs on the fix;
   document current behavior accurately and add a visible TODO aside linking
   to the planned change.
11. **Close the todo** — delete its file and every reference to it, as
   `todos/README.md`, "Closing a todo", describes. Do it in the same commit
   as the page content or in a follow-up commit.

## Writing conventions

### Audience: gadget author, not host implementer

This documentation is written for developers building gadgets. Explain what
they need to know and do, not how the host implements things internally.
Internal mechanics belong in `../torchsnap/docs/Gadget-Architecture/`, not
here.

- Bad: "The host stores a version counter via `PRAGMA user_version` and increments it after each migration."
- Good: "The host remembers how many migrations it has applied. Always add new files at the end."

- Bad: "The `CoalescingDispatcher` deduplicates rapid same-key writes before the change reaches the gadget."
- Good: "Rapid successive writes to the same setting are coalesced, so your `on_setting_changed` callback is not called for every intermediate value."

If internal knowledge is required for the developer to make correct decisions
(e.g., that filesystem permission checks canonicalize symlinks), include just
enough to explain the consequence without exposing the implementation.

### Merge overlapping content

If two pages substantially overlap, merge them. One page is the source of
truth; the other becomes a redirect or is deleted. Update all cross-references
across the entire site. Prefer a single comprehensive page over two thin pages
that repeat each other.

Example: the Permissions page was folded into the Manifest page because every
permission is a manifest declaration and the two pages covered the same fields.

### Voice and perspective

Write from the user's perspective. The reader wants to accomplish something —
guide them through it. Use "you" and imperative mood.

- Good: "Press Cmd+Shift+Space to open the search bar."
- Bad: "Torchsnap provides a search bar that can be opened with a shortcut."

### Emdash restraint

Emdashes are fine, but overuse makes prose choppy. When reaching for an
emdash, consider whether a colon, a period, commas, or a rephrased sentence
reads better. Watch for three or more emdashes in a single paragraph.

- Bad: "The host owns the state — each gadget is wrapped — plus a dispatcher — which deduplicates."
- Bad (mechanical semicolons): "The host owns the state; each gadget is wrapped; it holds a flag."
- Good: "The host owns the state. Each gadget is wrapped in a slot that holds a flag and a dispatcher that deduplicates writes."
- Good (emdash is the right tool): "The bridge silently drops the channel rather than forwarding it — gadgets that need streaming must stay native."

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

### Section flow: intro → fields → example → details

Every reference section should follow this pattern:

1. **Introductory paragraph** — explain what this section is for, why it
   exists, and when a developer would use it. Lead with the purpose, not the
   syntax.
2. **Field table** — the reference data (fields, types, defaults).
3. **Lead-in sentence** — a brief sentence describing what the example shows.
4. **Code example** — a realistic, self-consistent TOML/Rust/JSON block.
5. **Enforcement/detail paragraph** — how the host checks or uses the
   declaration at runtime.

Never drop a code example immediately after a table with no explanation.

**Bad:**

```markdown
| Field | Type | Description |
|---|---|---|
| `origins` | list | Allowed origins. |

\`\`\`toml title="manifest.toml"
[permissions.http]
origins = ["https://api.example.com"]
\`\`\`
```

**Good:**

```markdown
| Field | Type | Description |
|---|---|---|
| `origins` | list | Allowed origins. |

A gadget that fetches data from two endpoints would declare:

\`\`\`toml title="manifest.toml"
[permissions.http]
origins = ["https://api.example.com", "https://cdn.example.com"]
\`\`\`

At call time, the host parses the request URL and extracts its origin...
```

### Section headings: readable names, not syntax

Use descriptive headings. Mention the TOML section name in the opening text,
not in the heading itself.

- Bad: `## \`[storage.sql]\``
- Good: `## SQL storage`
  Then in the text: "The `[storage.sql]` section declares..."

- Bad: `## \`[[permissions.command]]\``
- Good: `## Command execution`
  Then in the text: "The `[[permissions.command]]` section controls..."

### Introduce concepts before referencing them

Don't use a field name, mode name, or technical term before the reader has
seen it defined. If a section needs to reference something explained later,
link forward to it.

**Bad:**

> Each operation is gated separately, so a gadget that only opens web links
> does not need `open-path` or `reveal-path`.

(Reader hasn't seen the field table yet.)

**Good:**

> Each of these three operations has its own permission field, described below.

### Examples must be realistic and self-consistent

Use realistic domain data, not generic placeholders. A quotes gadget with
attributed authors is better than `"Hello World"` entries. `EmojiGrid` and
`EmojiDetail` are better view names than `"MyView"`. The reader should be able
to imagine the gadget working.

If the prose says "a gadget that opens web links and reveals files but does
not launch arbitrary paths," the example must not include `open-path = true`.
Every example should match its lead-in sentence exactly.

**Bad:**

> A gadget that opens web links and reveals files, but does not launch paths:
> ```toml
> open-path = true   # ← contradicts the description
> reveal-path = true
> ```

**Good:**

> A gadget that opens web links and reveals files in the file manager:
> ```toml
> schemes = ["https", "http"]
> reveal-path = true
> ```

### Cross-linking

Link every interface name, mode name, and concept to its documentation page
on first mention in a section. Link inline mentions in prose, not just in
tables. Link to specific anchors where possible.

- Bad: "The gadget reads settings at runtime."
- Good: "The gadget reads settings at runtime through the [`settings`](/development/interfaces/imports/#settings) host import."

Also link:
- External projects: [React](https://react.dev/), [Heroicons](https://heroicons.com/), [TOML](https://toml.io/), [wasmtime](https://wasmtime.dev/)
- The Torchsnap repository: [Torchsnap repository](https://github.com/jakobwesthoff/torchsnap)
- Internal cross-references between sections on the same page using `#anchor` links

### Asides for callouts

Use Starlight `<Aside>` components for information that deserves visual
separation. Available types: `note`, `tip`, `caution`, `danger`.

**When to use which type:**

- `note` — supplementary information, things that are always true
  (e.g., "Always available: logging, assets, platform")
- `tip` — helpful advice, best practices, congratulations
  (e.g., score ranges, configuration prompts)
- `caution` — things that will change, technical debt, current limitations
  (e.g., "TODO: WASM shortcut support", "TODO: Settings are read-only")
- `danger` — security warnings
  (e.g., "Trust-all mode disables origin checking entirely")

**Standalone facts that interrupt the flow belong in asides:**

- Bad: "Most sections are optional. A minimal manifest only needs `[gadget]`."
  (As a sentence in the middle of a paragraph, it gets lost.)
- Good:
  ```mdx
  <Aside type="tip">
    Most sections are optional. A minimal manifest only needs `[gadget]`.
  </Aside>
  ```

**TODO items must be visible in rendered output:**

Include `TODO` in the aside title so it's findable by both readers and grep.
Add an MDX comment above with more detail for future editors.

```mdx
{/* TODO: Update once the SDK is published as a crate. */}

<Aside type="caution" title="TODO: Out-of-tree development">
  Gadget development currently requires working inside the Torchsnap
  repository. A standalone workflow is planned but not yet available.
</Aside>
```

### TOML syntax explanation

When using TOML features the reader might not know (like `[[array of
tables]]`), explain the syntax and link to the TOML spec.

- Bad: "Each `[[permissions.command]]` block declares one rule."
  (Reader may not know what `[[...]]` means.)
- Good: "The double-bracket `[[...]]` syntax is [TOML's array of tables](https://toml.io/en/v1.0.0#array-of-tables): each block declares one rule, and you can repeat it as many times as needed."

### MDX gotchas

MDX parses `{...}` as JSX expressions and `<...>` as JSX elements. This
breaks inline code that contains braces, dollar signs, or angle brackets.

**Substitution variables** like `${home}` in inline text:
- Bad: `` `${home}` `` (MDX tries to parse `{home}` as JSX)
- Good: `{"${home}"}` (JSX string expression, renders literally)

**Struct literals** in inline text:
- Bad: `` `ViewResponse { view: "grid", ... }` ``
- Good: Rephrase to avoid braces: "a `CustomUi` response with `view` set to `\"grid\"`"

**In code blocks** (fenced with triple backticks), these characters are safe.
The problem only affects inline code and prose text.

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
