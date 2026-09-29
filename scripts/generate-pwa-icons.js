// Generates the fallback favicon and PWA / home-screen icons from the SVG mark.
// Run `npm run brand:generate` to export the React artwork and all icon sizes,
// or `npm run icons` to regenerate PNGs from the current public SVG.
//
// Outputs into public/icons/:
//   - icon-192.png, icon-512.png            (purpose: any)
//   - icon-maskable-192/512.png             (extra safe-zone padding for OS masks)
//   - apple-touch-icon.png (180)            (iOS home screen, opaque bg)
//
// Installed icons sit on the same warm linen as the embroidered brand label.

import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const SRC = path.join(root, "public", "mogtome-mark.svg");
const OUT = path.join(root, "public", "icons");

const BG = { r: 0xf7, g: 0xee, b: 0xdb, alpha: 1 };
// Rasterize the vector at 8x CSS density, then downsample for clean small stitches.
const DENSITY = 576;

fs.mkdirSync(OUT, { recursive: true });

// scale = fraction of the canvas the mark occupies; maskable leaves more room
// so nothing important is clipped by a circular/squircle mask (safe zone ~80%).
async function make(size, scale, file, background = BG) {
  const inner = Math.round(size * scale);
  const mark = await sharp(SRC, { density: DENSITY })
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const offset = Math.round((size - inner) / 2);
  await sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: mark, top: offset, left: offset }])
    .png()
    .toFile(path.join(OUT, file));
  console.log(
    "wrote",
    path.relative(root, path.join(OUT, file)),
    `(${size}px)`,
  );
}

await Promise.all([
  sharp(SRC, { density: DENSITY })
    .resize(64, 64, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(path.join(root, "public", "favicon.png")),
  make(192, 0.78, "icon-192.png"),
  make(512, 0.78, "icon-512.png"),
  make(192, 0.62, "icon-maskable-192.png"),
  make(512, 0.62, "icon-maskable-512.png"),
  make(180, 0.76, "apple-touch-icon.png"),
]);

console.log("Fallback favicon and PWA icons generated.");
