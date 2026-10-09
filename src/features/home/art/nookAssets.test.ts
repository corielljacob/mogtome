import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { expect, it } from "vitest";

const events = [
  "heavensturn",
  "valentiones",
  "little-ladies",
  "hatching-tide",
  "make-it-rain",
  "moonfire-faire",
  "the-rising",
  "all-saints-wake",
  "starlight",
];
const landscapes = [
  "pom-pom",
  "heavensward",
  "stormblood",
  "shadowbringers",
  "dawntrail",
  "evercold",
  ...events,
];

it.each([...landscapes, "endwalker"])(
  "ships transparent day/night landscapes for %s",
  async (scene) => {
    for (const mode of scene === "endwalker" ? ["day"] : ["day", "night"]) {
      for (const density of [2, 4]) {
        const file = path.resolve(
          "src/features/home/art/generated",
          `landscape-${scene}-${mode}@${density}x.webp`,
        );
        const metadata = await sharp(await readFile(file)).metadata();
        expect(metadata.width, file).toBe(262 * density);
        expect(metadata.height, file).toBe(373 * density);
        expect(metadata.hasAlpha, file).toBe(true);
      }
    }
  },
);
