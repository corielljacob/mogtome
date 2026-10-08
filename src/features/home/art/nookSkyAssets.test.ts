import path from "node:path";
import sharp from "sharp";
import { expect, it } from "vitest";

const scenes = [
  "pom-pom",
  "heavensward",
  "stormblood",
  "shadowbringers",
  "dawntrail",
  "evercold",
  "heavensturn",
  "valentiones",
  "little-ladies",
  "hatching-tide",
  "make-it-rain",
  "moonfire-faire",
  "the-rising",
  "all-saints-wake",
  "starlight",
  "endwalker",
];

const fileFor = (name: string, density: number) =>
  path.resolve("src/features/home/art/generated", `${name}@${density}x.webp`);

it("ships every fixed sky exposure at the original window coordinates", async () => {
  for (const scene of scenes) {
    const exposures =
      scene === "endwalker"
        ? ["day"]
        : scene === "evercold"
          ? ["day", "night", "dusk-day", "dusk-night"]
          : ["day", "night", "dusk"];
    for (const exposure of exposures) {
      for (const layer of scene === "evercold"
        ? ["-background", "-foreground"]
        : [""]) {
        for (const density of [2, 4]) {
          const file = fileFor(`sky-${scene}-${exposure}${layer}`, density);
          const metadata = await sharp(file).metadata();
          expect(metadata.format, file).toBe("webp");
          expect(metadata.width, file).toBe(262 * density);
          expect(metadata.height, file).toBe(373 * density);
          if (layer === "-foreground")
            expect(metadata.hasAlpha, file).toBe(true);
        }
      }
    }
  }
});

it("preserves open glass in Evercold and distinct day/night paint in cycling skies", async () => {
  const glass = await sharp(fileFor("sky-evercold-day-foreground", 2)).stats();
  expect(glass.channels[3].min).toBe(0);
  expect(glass.channels[3].max).toBe(255);
  for (const scene of scenes.filter((scene) => scene !== "endwalker")) {
    const layer = scene === "evercold" ? "-background" : "";
    const day = await sharp(fileFor(`sky-${scene}-day${layer}`, 2)).stats();
    const night = await sharp(fileFor(`sky-${scene}-night${layer}`, 2)).stats();
    const difference = day.channels
      .slice(0, 3)
      .reduce(
        (total, channel, index) =>
          total + Math.abs(channel.mean - night.channels[index].mean),
        0,
      );
    expect(difference, scene).toBeGreaterThan(25);
  }
});
