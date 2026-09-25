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

# The frozen install comes first so the gates run against the versions
# in bun.lock, not whatever an older install left in node_modules.

# Run the full quality cycle: install, then build
fullcycle:
    just install
    just build
