// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightLlmsTxt from "starlight-llms-txt";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";

const macchiatoModule = await import("@shikijs/themes/catppuccin-macchiato");
const macchiato = JSON.parse(JSON.stringify(macchiatoModule.default));
macchiato.colors["editor.background"] = "#1f1f21";
macchiato.colors["editorGroupHeader.tabsBackground"] = "#1a1a1c";
macchiato.colors["tab.activeBackground"] = "#1f1f21";
macchiato.colors["titleBar.activeBackground"] = "#1a1a1c";
macchiato.colors["tab.activeBorderTop"] = "#f97316";
macchiato.colors["tab.activeForeground"] = "#f97316";
macchiato.colors["terminal.background"] = "#1f1f21";
macchiato.colors["titleBar.activeForeground"] = "#f97316";

const latteModule = await import("@shikijs/themes/catppuccin-latte");
const latte = JSON.parse(JSON.stringify(latteModule.default));
latte.colors["editor.background"] = "#f9fafb";
latte.colors["editorGroupHeader.tabsBackground"] = "#f3f4f6";
latte.colors["tab.activeBackground"] = "#f9fafb";
latte.colors["titleBar.activeBackground"] = "#f3f4f6";
latte.colors["tab.activeBorderTop"] = "#f97316";
latte.colors["tab.activeForeground"] = "#ea580c";
latte.colors["terminal.background"] = "#f9fafb";
latte.colors["titleBar.activeForeground"] = "#ea580c";

export default defineConfig({
  site: "https://docs.torchsnap.app",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    icon(),
    starlight({
      title: "Torchsnap",
      logo: {
        src: "./src/assets/logo.png",
      },
      favicon: "/favicon-32.png",
      head: [
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/favicon.ico",
            sizes: "32x32",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "apple-touch-icon",
            href: "/apple-touch-icon.png",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "icon",
            type: "image/png",
            sizes: "192x192",
            href: "/icon-192.png",
          },
        },
      ],
      social: [],
      components: {
        SiteTitle: "./src/components/SiteTitle.astro",
        Hero: "./src/components/Hero.astro",
        ThemeSelect: "./src/components/ThemeSelect.astro",
        Footer: "./src/components/Footer.astro",
        SocialIcons: "./src/components/SocialIcons.astro",
      },
      plugins: [
        starlightLlmsTxt({
          description:
            "Documentation for Torchsnap, a keyboard-driven launcher for macOS with sandboxed WebAssembly gadgets.",
          details: [
            "Torchsnap is a keyboard-driven application launcher for macOS. Everything the launcher can do is provided by gadgets: sandboxed WebAssembly components that plug into the search pipeline. A set of built-in gadgets ships with Torchsnap (app launcher, clipboard manager, calculator, emoji picker, system commands, and others). Users can also install third-party gadgets or build their own.",
            "## Documentation structure",
            "This documentation is organized into three areas, each available as a separate subset file for targeted retrieval:",
            "**User Guide** covers installation, configuration, keyboard shortcuts, and the built-in gadgets. Start here if you need to understand what Torchsnap does and how end users interact with it.",
            "**Gadget development** is split across multiple subsets. The **Gadget API** subset covers the core development workflow: a step-by-step tutorial for building a first gadget, the search pipeline (catalog mode for static entries, query mode for dynamic results, prefix routing for dedicated UI), the manifest format (metadata, permissions, settings schema, storage, tasks, frontend bundles, keyboard shortcuts), and the WIT interface contract that defines the boundary between host and gadget. The **Gadget Frontend** subset covers the React-based frontend SDK for gadgets that need custom views inside the launcher or settings panels for configuration. The **Packaging** subset covers building `.torchsnap` archives for distribution. The **Devtools** subset covers the built-in devtools panel used for debugging gadgets during development.",
            "**Control API** covers driving Torchsnap programmatically from external programs via JSON-RPC over a Unix domain socket.",
            "## Technical context",
            "Gadgets compile to the `wasm32-wasip2` target using the WebAssembly Component Model. The host loads them at runtime via wasmtime. The host-gadget boundary is defined by a WIT (WebAssembly Interface Types) contract specifying what the gadget exports (lifecycle, search, messaging, tasks) and what the host provides (logging, settings, clipboard, SQLite storage, HTTP, filesystem, command execution, and more). Every host capability beyond a minimal baseline requires an explicit permission grant in the gadget's manifest.",
            "The backend (gadget logic) is written in Rust using the `torchsnap-gadget-sdk` crate. The frontend (custom views and settings panels) is written in React/TypeScript using the `@torchsnap/gadget-sdk` package. Gadgets that only provide search results do not need a frontend.",
          ].join("\n\n"),
          exclude: ["style-reference"],
          promote: ["start/**", "development/**"],
          demote: ["control-api/**"],
          customSets: [
            {
              label: "User Guide",
              description:
                "installation, configuration, keyboard shortcuts, and built-in gadgets",
              paths: ["start/**"],
            },
            {
              label: "Gadget API",
              description:
                "core gadget development: search, manifests, permissions, and WIT interfaces",
              paths: [
                "development/index",
                "development/hello-world",
                "development/search",
                "development/manifests",
                "development/interfaces/**",
              ],
            },
            {
              label: "Gadget Frontend",
              description:
                "React-based views, settings panels, and frontend-to-backend messaging",
              paths: ["development/frontend/**"],
            },
            {
              label: "Packaging",
              description:
                "packaging gadgets for distribution and use outside development",
              paths: ["development/packaging"],
            },
            {
              label: "Devtools",
              description:
                "the devtools panel for gadget debugging and logging",
              paths: ["development/devtools"],
            },
            {
              label: "Control API",
              description:
                "JSON-RPC automation over a Unix domain socket",
              paths: ["control-api/**"],
            },
          ],
        }),
      ],
      expressiveCode: {
        themes: [macchiato, latte],
        styleOverrides: {
          frames: {
            tooltipSuccessBackground: "#f97316",
            tooltipSuccessForeground: "#ffffff",
          },
        },
      },
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            "start",
            "start/installation",
            "start/settings",
            "start/keyboard-shortcuts",
            {
              label: "Gadgets",
              items: [{ autogenerate: { directory: "start/gadgets" } }],
            },
          ],
        },
        {
          label: "Development",
          items: [
            "development",
            "development/hello-world",
            "development/search",
            "development/manifests",
            {
              label: "Interfaces",
              items: [
                {
                  autogenerate: {
                    directory: "development/interfaces",
                  },
                },
              ],
            },
            {
              label: "Frontend",
              items: [
                {
                  autogenerate: {
                    directory: "development/frontend",
                  },
                },
              ],
            },
            "development/packaging",
            "development/devtools",
          ],
        },
        {
          label: "Control API",
          items: ["control-api", "control-api/commands"],
        },
      ],
    }),
  ],
});
