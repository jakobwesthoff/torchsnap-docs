import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", ".astro"]),
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  astro.configs["jsx-a11y-recommended"],
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  // In TypeScript, the compiler (`just check`) reports undefined names
  // and also knows ambient types such as Astro's `ImageMetadata`, which
  // `no-undef` flags wrongly.
  {
    files: ["**/*.{ts,tsx,astro}"],
    rules: {
      "no-undef": "off",
    },
  },
  // Config files and the scripts in `tools/` run under Bun or Node, not
  // in the browser.
  {
    files: ["*.{js,mjs,ts}", "tools/**"],
    languageOptions: {
      globals: { ...globals.node, Bun: "readonly" },
    },
  },
  // The OG card uses classic-runtime JSX with its own `jsx` factory. The
  // parser has to be told the factory's name to count JSX as a use of
  // it, and TypeScript finds the factory's JSX types only in a
  // `declare namespace`.
  {
    files: ["tools/build-og.tsx"],
    languageOptions: {
      parserOptions: { jsxPragma: "jsx" },
    },
    rules: {
      "@typescript-eslint/no-namespace": ["error", { allowDeclarations: true }],
    },
  },
]);
