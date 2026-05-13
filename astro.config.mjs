// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
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
      expressiveCode: {
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
          items: [{ autogenerate: { directory: "usage" } }],
        },
        {
          label: "Development",
          items: [
            {
              label: "Gadget SDK",
              items: [
                { autogenerate: { directory: "development/gadget-sdk" } },
              ],
            },
          ],
        },
      ],
    }),
  ],
});
