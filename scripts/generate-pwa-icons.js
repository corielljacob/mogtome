// Generates the PWA / home-screen icon set from the brand mark (public/favicon.png).
// Run with: node scripts/generate-pwa-icons.js
//
// Outputs into public/icons/:
//   - icon-192.png, icon-512.png            (purpose: any)
//   - icon-maskable-192/512.png             (extra safe-zone padding for OS masks)
//   - apple-touch-icon.png (180)            (iOS home screen, opaque bg)
//
// The moogle mark sits on a soft warm background so the installed icon looks
// finished on both light and dark home screens instead of a transparent blob.

import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const SRC = path.join(root, "public", "favicon.png");
const OUT = path.join(root, "public", "icons");

// soft warm peach (a tint between brand cream #fff6f4 and accent #f6bd6c)
const BG = { r: 0xff, g: 0xed, b: 0xe4, alpha: 1 };

fs.mkdirSync(OUT, { recursive: true });

// scale = fraction of the canvas the mark occupies; maskable leaves more room
// so nothing important is clipped by a circular/squircle mask (safe zone ~80%).
async function make(size, scale, file, background = BG) {
  const inner = Math.round(size * scale);
  const mark = await sharp(SRC)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const offset = Math.round((size - inner) / 2);
  await sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: mark, top: offset, left: offset }])
    .png()
    .toFile(path.join(OUT, file));
  console.log("wrote", path.relative(root, path.join(OUT, file)), `(${size}px)`);
}

await Promise.all([
  make(192, 0.78, "icon-192.png"),
  make(512, 0.78, "icon-512.png"),
  make(192, 0.62, "icon-maskable-192.png"),
  make(512, 0.62, "icon-maskable-512.png"),
  make(180, 0.76, "apple-touch-icon.png"),
]);

console.log("PWA icons generated.");
