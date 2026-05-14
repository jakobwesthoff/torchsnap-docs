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
      favicon: "/favicon.png",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/jakobwesthoff/torchsnap",
        },
      ],
      components: {
        SiteTitle: "./src/components/SiteTitle.astro",
        Hero: "./src/components/Hero.astro",
        ThemeSelect: "./src/components/ThemeSelect.astro",
        Footer: "./src/components/Footer.astro",
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
          label: "Usage",
          autogenerate: { directory: "usage" },
        },
        {
          label: "Gadgets",
          autogenerate: { directory: "usage/gadgets" },
        },
        {
          label: "Gadget SDK",
          autogenerate: { directory: "development/gadget-sdk" },
        },
        {
          label: "WIT Interfaces",
          autogenerate: { directory: "development/gadget-sdk/interfaces" },
        },
        {
          label: "Frontend SDK",
          autogenerate: { directory: "development/gadget-sdk/frontend" },
        },
      ],
    }),
  ],
});
