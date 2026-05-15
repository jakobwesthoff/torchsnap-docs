// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
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
            "development/permissions",
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
