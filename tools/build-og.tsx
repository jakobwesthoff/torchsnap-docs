// Composes the Torchsnap Docs social-share (Open Graph) card at
// 1200×630.
//
// KEEP IN SYNC: this card is the docs variant of the torchsnap.app
// card, built by web/tools/build-og.tsx in the torchsnap-web
// repository. Both cards share layout, colours, typography and
// pipeline and the vertical, square-safe layout. This card differs in
// the mascot (reading owl), the "Docs" suffix on the wordmark and the
// sizes that suffix forces. A change to the shared design here likely
// needs the same change there, and the other way round.
//
// Pipeline:
//   1. Satori takes a JSX tree built with Flexbox layout and resolves
//      every position and size.
//   2. Resvg renders the resulting SVG to a PNG.
//   3. Oxipng losslessly compresses the final asset.
//
// Fonts: Satori needs static-font buffers (its bundled opentype.js
// fork cannot parse fvar tables, so the site's variable Inter woff2
// does not work here). The two static TTFs in tools/fonts/ are
// SemiBold (600, wordmark) and Bold (700, eyebrow).
//
// JSX without React: Bun runs .tsx natively, and Satori accepts
// React-style elements regardless of the framework. The pragmas wire
// the JSX factory to a small node constructor that produces Satori's
// `{ type, props }` shape. Bun honors `@jsx` only under the classic
// runtime.
//
// Output: public/og.png. The og:image / twitter:image meta tags live
// in the Starlight `head` config in astro.config.mjs.

/** @jsxRuntime classic */
/** @jsx jsx */
import satori from "satori";
import sharp from "sharp";
import { Resvg } from "@resvg/resvg-js";
import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

function jsx(type: string, props: Record<string, unknown> | null, ...children: unknown[]) {
  const flat = children.flat(Infinity);
  return {
    type,
    props: {
      ...(props ?? {}),
      children: flat.length === 1 ? flat[0] : flat,
    },
  };
}

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(HERE, "..");
const FONT_SEMIBOLD_PATH = resolve(HERE, "fonts/Inter-SemiBold.ttf");
const FONT_BOLD_PATH = resolve(HERE, "fonts/Inter-Bold.ttf");
const MASCOT_PATH = resolve(PROJECT_ROOT, "src/assets/mascot-reading-1024.png");
const OUT = resolve(PROJECT_ROOT, "public/og.png");

// Canvas: Open Graph standard 1.91:1 aspect.
const W = 1200;
const H = 630;

// Colours match the torchsnap.app card: its dark surface token and
// the orange app-icon gradient for the eyebrow.
const SURFACE = "#1c1c1e";
const TOP = "#f87316";
const BOT = "#da7707";

// =========================================================
// Assets
// =========================================================

// The mascot master carries transparent padding. Satori lays out the
// image box, not the visible figure, so the padding is trimmed here to
// make the layout box match the owl.
const trimmed = await sharp(MASCOT_PATH)
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 0 })
  .png()
  .toBuffer({ resolveWithObject: true });
const mascotDataUrl = `data:image/png;base64,${trimmed.data.toString("base64")}`;
const MASCOT_NATIVE_W = trimmed.info.width;
const MASCOT_NATIVE_H = trimmed.info.height;

const [semibold, bold] = await Promise.all([
  readFile(FONT_SEMIBOLD_PATH),
  readFile(FONT_BOLD_PATH),
]);

// =========================================================
// Layout
// =========================================================

// Slack shows link-card images in a square slot and centre-crops the
// 1200×630 card to its middle 630×630. Owl, eyebrow and wordmark are
// therefore stacked vertically and sized so the whole group fits that
// square with about 50 px to spare on every side. Wider platforms (X,
// LinkedIn, Discord) show the full card with the same group centred.
//
// The wordmark sets the width limit: at 70 px "Torchsnap Docs" is
// about 526 px wide. The eyebrow stays at 26 px rather than matching
// the wordmark's width, which would need ~36 px and outweigh it.
const MASCOT_HEIGHT = 380;
const mascotW = Math.round(MASCOT_HEIGHT * (MASCOT_NATIVE_W / MASCOT_NATIVE_H));

const EYEBROW_FONT = 26;
const WORDMARK_FONT = 70;

const gradientText = {
  backgroundImage: `linear-gradient(180deg, ${TOP} 0%, ${BOT} 100%)`,
  backgroundClip: "text",
  color: "transparent",
};

const tree = (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: SURFACE,
    }}
  >
    <img src={mascotDataUrl} width={mascotW} height={MASCOT_HEIGHT} style={{ display: "block", marginBottom: 28 }} />
    <div
      style={{
        fontSize: EYEBROW_FONT,
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: EYEBROW_FONT * 0.2,
        textTransform: "uppercase",
        marginBottom: Math.round(EYEBROW_FONT * 0.6),
        ...gradientText,
      }}
    >
      {/* Satori applies letter-spacing to non-breaking spaces but not
          to regular ones, and the separators need the same tracking
          as the letters around them. */}
      {"Light · Find · Launch"}
    </div>
    <div
      style={{
        display: "flex",
        fontSize: WORDMARK_FONT,
        fontWeight: 600,
        color: "#ffffff",
        letterSpacing: WORDMARK_FONT * -0.025,
        lineHeight: 1.05,
      }}
    >
      {/* "Docs" takes the eyebrow gradient so the suffix reads as an
          addition to the Torchsnap wordmark. Satori's flex layout
          drops whitespace between the spans, hence the margin. */}
      <span>Torchsnap</span>
      <span style={{ marginLeft: WORDMARK_FONT * 0.25, ...gradientText }}>Docs</span>
    </div>
  </div>
);

// =========================================================
// Render
// =========================================================

const svg = await satori(tree as Parameters<typeof satori>[0], {
  width: W,
  height: H,
  fonts: [
    { name: "Inter", data: semibold, weight: 600, style: "normal" },
    { name: "Inter", data: bold, weight: 700, style: "normal" },
  ],
});

const resvg = new Resvg(svg, { font: { loadSystemFonts: false } });
await writeFile(OUT, resvg.render().asPng());

execFileSync("oxipng", ["-o", "max", "--strip", "safe", OUT], { stdio: "inherit" });
console.log(`wrote ${OUT}`);
