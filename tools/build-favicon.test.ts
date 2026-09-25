import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  buildIco,
  generateFavicons,
  gradientSvg,
  prepareMascot,
  writeGradientIcon,
  writeTransparent,
} from "./build-favicon";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "build-favicon-"));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

// A transparent canvas with one opaque block, standing in for the
// mascot PNG and its built-in transparent padding.
async function mascotSource(block: { width: number; height: number }, canvas = 100) {
  const path = join(dir, "mascot.png");
  const opaque = await sharp({
    create: { ...block, channels: 4, background: { r: 30, g: 144, b: 255, alpha: 1 } },
  })
    .png()
    .toBuffer();
  await sharp({
    create: {
      width: canvas,
      height: canvas,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: opaque, left: 17, top: 23 }])
    .png()
    .toFile(path);
  return path;
}

async function pixels(input: string | Buffer) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return {
    width: info.width,
    height: info.height,
    at(x: number, y: number) {
      const i = (y * info.width + x) * 4;
      return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] };
    },
  };
}

describe("prepareMascot", () => {
  it("trims the transparent padding and centres a wide figure on a square", async () => {
    const mascot = await pixels(await prepareMascot(await mascotSource({ width: 40, height: 20 })));

    expect(mascot.width).toBe(40);
    expect(mascot.height).toBe(40);
    expect(mascot.at(20, 9).a).toBe(0);
    expect(mascot.at(20, 10).a).toBe(255);
    expect(mascot.at(20, 29).a).toBe(255);
    expect(mascot.at(20, 30).a).toBe(0);
  });

  it("puts the odd pixel of padding below and to the right", async () => {
    const tall = await pixels(await prepareMascot(await mascotSource({ width: 17, height: 20 })));

    expect(tall.width).toBe(20);
    // 3 px of horizontal padding: 1 on the left, 2 on the right.
    expect(tall.at(0, 10).a).toBe(0);
    expect(tall.at(1, 10).a).toBe(255);
    expect(tall.at(17, 10).a).toBe(255);
    expect(tall.at(18, 10).a).toBe(0);
  });
});

describe("gradientSvg", () => {
  it("renders a square from the light top colour to the deep bottom colour", async () => {
    const gradient = await pixels(await sharp(gradientSvg(100)).png().toBuffer());

    expect(gradient.width).toBe(100);
    expect(gradient.height).toBe(100);
    const top = gradient.at(50, 0);
    const bottom = gradient.at(50, 99);
    expect(top.a).toBe(255);
    expect(bottom.a).toBe(255);
    // #ffb060 at the top, #e0600a at the bottom.
    expect(top.r).toBeGreaterThan(bottom.r);
    expect(top.g).toBeGreaterThan(bottom.g);
    expect(Math.abs(top.r - 0xff)).toBeLessThanOrEqual(2);
    expect(Math.abs(bottom.g - 0x60)).toBeLessThanOrEqual(2);
  });
});

describe("writeTransparent", () => {
  it("scales the mascot to the size and keeps the background transparent", async () => {
    const mascot = await prepareMascot(await mascotSource({ width: 40, height: 20 }));
    const out = join(dir, "icon.png");

    await writeTransparent(mascot, 32, out);

    const icon = await pixels(out);
    expect(icon.width).toBe(32);
    expect(icon.height).toBe(32);
    expect(icon.at(0, 0).a).toBe(0);
    expect(icon.at(16, 16).a).toBe(255);
  });
});

describe("writeGradientIcon", () => {
  it("places the mascot at 75 % of the canvas on an opaque gradient", async () => {
    // A square figure fills its whole prepared canvas, so its edges mark
    // exactly where the mascot lands.
    const mascot = await prepareMascot(await mascotSource({ width: 50, height: 50 }));
    const out = join(dir, "icon.png");

    await writeGradientIcon(mascot, 192, out);

    const icon = await pixels(out);
    expect(icon.width).toBe(192);
    expect(icon.at(0, 0).a).toBe(255);
    expect(icon.at(191, 191).a).toBe(255);
    // 144 px mascot, inset by 24 px on each side.
    const mascotBlue = { r: 30, g: 144, b: 255 };
    expect(icon.at(24, 96)).toMatchObject(mascotBlue);
    expect(icon.at(167, 96)).toMatchObject(mascotBlue);
    expect(icon.at(23, 96)).not.toMatchObject(mascotBlue);
    expect(icon.at(168, 96)).not.toMatchObject(mascotBlue);
  });
});

describe("buildIco", () => {
  it("wraps a PNG in a single-image 32×32 ICO container", () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 1, 2, 3, 4, 5]);

    const ico = buildIco(png);

    expect(ico).toHaveLength(6 + 16 + png.length);
    // ICONDIR: reserved, type 1 (icon), one image.
    expect([ico.readUInt16LE(0), ico.readUInt16LE(2), ico.readUInt16LE(4)]).toEqual([0, 1, 1]);
    // ICONDIRENTRY: 32×32, no palette, 1 plane, 32 bpp, payload size and offset.
    expect([ico.readUInt8(6), ico.readUInt8(7), ico.readUInt8(8), ico.readUInt8(9)]).toEqual([
      32, 32, 0, 0,
    ]);
    expect([ico.readUInt16LE(10), ico.readUInt16LE(12)]).toEqual([1, 32]);
    expect(ico.readUInt32LE(14)).toBe(png.length);
    expect(ico.readUInt32LE(18)).toBe(22);
    expect(ico.subarray(22)).toEqual(png);
  });
});

describe("generateFavicons", () => {
  it("writes every icon at its size, and an ICO carrying a 32 px PNG", async () => {
    const source = await mascotSource({ width: 40, height: 20 });

    const { pngs, ico } = await generateFavicons(source, dir);

    const sizes = await Promise.all(
      pngs.map(async (path) => {
        const { width, height } = await sharp(path).metadata();
        return [path.slice(dir.length + 1), width, height];
      }),
    );
    expect(sizes).toEqual([
      ["favicon-32.png", 32, 32],
      ["apple-touch-icon.png", 180, 180],
      ["icon-192.png", 192, 192],
      ["icon-192-maskable.png", 192, 192],
    ]);

    expect(ico).toBe(join(dir, "favicon.ico"));
    const embedded = (await readFile(ico)).subarray(22);
    expect(await sharp(embedded).metadata()).toMatchObject({
      format: "png",
      width: 32,
      height: 32,
    });
  });

  it("keeps tab icons transparent and home-screen icons opaque", async () => {
    await generateFavicons(await mascotSource({ width: 40, height: 20 }), dir);

    for (const name of ["favicon-32.png", "icon-192.png"]) {
      expect((await pixels(join(dir, name))).at(0, 0).a).toBe(0);
    }
    for (const name of ["apple-touch-icon.png", "icon-192-maskable.png"]) {
      expect((await pixels(join(dir, name))).at(0, 0).a).toBe(255);
    }
  });
});
