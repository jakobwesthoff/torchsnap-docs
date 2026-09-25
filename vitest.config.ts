/// <reference types="vitest/config" />

// Tests run through Astro's own Vite config, so image imports, `astro:*`
// modules and the site's aliases resolve exactly as in the build.
//
// The default environment is Node, which fits the scripts in `tools/`.
// Tests of browser code opt into jsdom with a
// `// @vitest-environment jsdom` comment.

import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["src/**/*.test.ts", "tools/**/*.test.{ts,tsx}"],
    environment: "node",
    restoreMocks: true,
    unstubGlobals: true,
    unstubEnvs: true,
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts", "tools/**/*.{ts,tsx}"],
      exclude: ["src/test/**", "**/*.test.{ts,tsx}", "src/content.config.ts"],
    },
  },
});
