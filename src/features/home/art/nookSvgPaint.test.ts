import sharp from "sharp";
import { expect, it } from "vitest";
import { toSvgPaint } from "./nookSvgPaint";

it("preserves mixed stitch colors in the raster renderer instead of painting black", async () => {
  const paint = toSvgPaint("color(srgb 0.750353 0.66698 0.579294)");
  const pixel = await sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="${paint}"/></svg>`,
    ),
  )
    .ensureAlpha()
    .raw()
    .toBuffer();
  expect([...pixel]).toEqual([191, 170, 148, 255]);
});

it("preserves transparent glows and rejects unsupported color spaces", () => {
  expect(toSvgPaint("color(srgb 1 0.5 0.2 / 0.25)")).toBe(
    "rgba(255, 128, 51, 0.25)",
  );
  expect(toSvgPaint("#abc")).toBe("#abc");
  expect(() => toSvgPaint("color(display-p3 1 0 0)")).toThrow("Unsupported");
});
