/** @jsxRuntime classic */
/** @jsx jsx */
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { jsx, renderCard } from "./build-og";

const ROOT = resolve(import.meta.dirname, "..");

// The test build compiles JSX in development mode, which adds `__self`
// and `__source` props. Satori ignores them, so the assertions below
// check only the props the factory itself produces.
describe("jsx", () => {
  it("builds the { type, props } node Satori expects", () => {
    const node = <div style={{ display: "flex" }} />;
    expect(node.type).toBe("div");
    expect(node.props).toMatchObject({ style: { display: "flex" }, children: [] });
  });

  it("passes a single child through unwrapped", () => {
    expect((<span>Docs</span>).props.children).toBe("Docs");
  });

  it("builds a node without props", () => {
    expect(jsx("br", null)).toEqual({ type: "br", props: { children: [] } });
  });

  it("flattens nested child lists", () => {
    const items = ["a", ["b", ["c"]]];
    expect((<p>{items}</p>).props.children).toEqual(["a", "b", "c"]);
  });
});

describe("renderCard", () => {
  it("renders the committed og.png pixel for pixel", async () => {
    const [semibold, bold, mascotPng] = await Promise.all([
      readFile(join(ROOT, "tools/fonts/Inter-SemiBold.ttf")),
      readFile(join(ROOT, "tools/fonts/Inter-Bold.ttf")),
      readFile(join(ROOT, "src/assets/mascot-reading-1024.png")),
    ]);

    const card = await renderCard({ semibold, bold, mascotPng });

    // og.png is committed after lossless oxipng compression, so the
    // decoded pixels, not the bytes, have to match.
    const rendered = await sharp(card).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const committed = await sharp(join(ROOT, "public/og.png"))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    expect(rendered.info).toMatchObject({ width: 1200, height: 630 });
    expect(rendered.info.width).toBe(committed.info.width);
    expect(rendered.info.height).toBe(committed.info.height);
    expect(rendered.data.equals(committed.data)).toBe(true);
  });
});
