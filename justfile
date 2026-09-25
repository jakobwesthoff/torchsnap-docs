# Task runner and build entrypoint for the Torchsnap documentation.
# Run `just --list` to see all available recipes.

# Show available recipes
default:
    @just --list

# Install dependencies exactly as pinned in bun.lock
install:
    bun install --frozen-lockfile

# Start the dev server on http://localhost:4321
dev:
    bun run dev

# Build the static site into dist/
build:
    bun run build

# Serve dist/ on http://localhost:4321
preview:
    bun run preview

# Regenerate the favicons in public/ from the reading mascot
build-favicon:
    bun run build:favicon

# Regenerate the social card public/og.png
build-og:
    bun run build:og

# Format all code and config (Markdown and MDX pages are left as written)
fmt:
    bunx prettier --write .

# Check formatting without writing
fmt-check:
    bunx prettier --check .

# The site and the Bun scripts in `tools/` run in different environments
# (browser vs. Bun), so they are two TypeScript projects: the site's
# `tsconfig.json` excludes `tools/`, which has its own with Bun's types.

# Type-check the site (astro check) and the scripts in tools/ (tsc)
check:
    bun run astro check
    bunx tsc -p tools

# The frozen install comes first so the gates run against the versions
# in bun.lock, not whatever an older install left in node_modules.

# Run the full quality cycle: install, format check, type check, then build
fullcycle:
    just install
    just fmt-check
    just check
    just build
