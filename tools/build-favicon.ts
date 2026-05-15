// Generates the full Torchsnap favicon set from the 1024 px mascot
// source (src/assets/mascot-1024.png).
//
// Small sizes (32 px tab icon, .ico) use the mascot on a transparent
// background: trim → square-pad → resize.
//
// Large sizes (180 px apple-touch-icon, 192 px Android/PWA icon) place
// the mascot on the brand orange gradient. Both iOS and Android apply
// their own rounded masks at display time, so these are full opaque
// squares — no pre-applied corner rounding.
//
// The script shells out to `oxipng` at the end to losslessly crush
// every generated PNG.
//
// Output (all written to public/):
//   favicon.ico          32×32 ICO (PNG payload)
//   favicon-32.png       32×32 transparent
//   apple-touch-icon.png 180×180 gradient background
//   icon-192.png         192×192 gradient background

import sharp from "sharp";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(HERE, "..");
const SRC_MASCOT = resolve(PROJECT_ROOT, "src/assets/mascot-1024.png");
const PUBLIC = resolve(PROJECT_ROOT, "public");

// =========================================================
// Brand gradient
// =========================================================

// Stops sampled from the desktop app icon, widened for visibility at
// small sizes: light warm peach at top, deep red-orange at bottom.
const TOP_COLOR = "#ffb060";
const BOT_COLOR = "#e0600a";

function gradientSvg(size: number): Buffer {
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${TOP_COLOR}"/>
          <stop offset="1" stop-color="${BOT_COLOR}"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#g)"/>
    </svg>
  `);
}

// =========================================================
// Mascot preparation: trim → square-pad
// =========================================================

async function prepareMascot(): Promise<Buffer> {
  const trimmedBuf = await sharp(SRC_MASCOT)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 0 })
    .toBuffer();

  const meta = await sharp(trimmedBuf).metadata();
  const w = meta.width!;
  const h = meta.height!;
  const maxDim = Math.max(w, h);

  return sharp(trimmedBuf)
    .extend({
      top: Math.floor((maxDim - h) / 2),
      bottom: Math.ceil((maxDim - h) / 2),
      left: Math.floor((maxDim - w) / 2),
      right: Math.ceil((maxDim - w) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();
}

// =========================================================
// Output generators
// =========================================================

async function writeTransparent(
  mascot: Buffer,
  size: number,
  outPath: string,
): Promise<void> {
  await sharp(mascot)
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(outPath);
}

// The mascot is scaled to fill ~75 % of the canvas so it sits
// comfortably inside both the iOS superellipse mask and Android's
// adaptive-icon safe zone (~66 % inner circle).
const MASCOT_FILL = 0.75;

async function writeGradientIcon(
  mascot: Buffer,
  size: number,
  outPath: string,
): Promise<void> {
  const mascotSize = Math.round(size * MASCOT_FILL);
  const resized = await sharp(mascot).resize(mascotSize, mascotSize).toBuffer();
  const offset = Math.round((size - mascotSize) / 2);

  await sharp(gradientSvg(size))
    .ensureAlpha()
    .composite([{ input: resized, left: offset, top: offset }])
    .png({ compressionLevel: 9 })
    .toFile(outPath);
}

// =========================================================
// ICO construction (single 32 px PNG payload)
// =========================================================

function buildIco(pngData: Buffer): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type = ICO
  header.writeUInt16LE(1, 4); // image count

  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0); // width
  entry.writeUInt8(32, 1); // height
  entry.writeUInt8(0, 2); // color count (0 = no palette)
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(pngData.length, 8);
  entry.writeUInt32LE(22, 12); // offset = 6 (header) + 16 (entry)

  return Buffer.concat([header, entry, pngData]);
}

// =========================================================
// Main
// =========================================================

const mascot = await prepareMascot();

const pngOutputs: string[] = [];

// 32 px transparent — tab icon
const fav32Path = resolve(PUBLIC, "favicon-32.png");
await writeTransparent(mascot, 32, fav32Path);
pngOutputs.push(fav32Path);

// 180 px gradient — iOS home screen
const applePath = resolve(PUBLIC, "apple-touch-icon.png");
await writeGradientIcon(mascot, 180, applePath);
pngOutputs.push(applePath);

// 192 px gradient — Android / PWA
const androidPath = resolve(PUBLIC, "icon-192.png");
await writeGradientIcon(mascot, 192, androidPath);
pngOutputs.push(androidPath);

// favicon.ico from the 32 px PNG
const png32 = await sharp(mascot).resize(32, 32).png().toBuffer();
const icoPath = resolve(PUBLIC, "favicon.ico");
await Bun.write(icoPath, buildIco(png32));

// Crush all PNGs with oxipng
execFileSync("oxipng", ["-o", "max", "--strip", "safe", ...pngOutputs], {
  stdio: "inherit",
});

for (const p of [...pngOutputs, icoPath]) {
  console.log(`wrote ${p}`);
}
