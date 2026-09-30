import { threadVariation } from "./nookNeedlework";

type Point = readonly [number, number];
export type EvercoldCurve = readonly [Point, Point, Point, Point];
const n = (v: number) => v.toFixed(2);

/** Laid silk follows an authored spine; crosswise satin wraps a turning walk. */
export function evercoldContourStitches(
  curves: readonly EvercoldCurve[],
  halfWidth: number,
  { across = false, seed = 1911 } = {},
) {
  const samples: { point: Point; distance: number }[] = [];
  let distance = 0;
  curves.forEach(([a, b, c, d]) => {
    for (let i = 0; i <= 80; i++) {
      const t = i / 80;
      const u = 1 - t;
      const point: Point = [
        u ** 3 * a[0] +
          3 * u ** 2 * t * b[0] +
          3 * u * t ** 2 * c[0] +
          t ** 3 * d[0],
        u ** 3 * a[1] +
          3 * u ** 2 * t * b[1] +
          3 * u * t ** 2 * c[1] +
          t ** 3 * d[1],
      ];
      const previous = samples.at(-1);
      if (previous)
        distance += Math.hypot(
          point[0] - previous.point[0],
          point[1] - previous.point[1],
        );
      samples.push({ point, distance });
    }
  });
  const at = (along: number, lateral: number): Point => {
    const next = samples.findIndex((sample) => sample.distance >= along);
    const i = next < 1 ? (next < 0 ? samples.length - 1 : 1) : next;
    const a = samples[i - 1];
    const b = samples[i];
    const length = Math.max(0.001, b.distance - a.distance);
    const t = (along - a.distance) / length;
    const dx = (b.point[0] - a.point[0]) / length;
    const dy = (b.point[1] - a.point[1]) / length;
    return [
      a.point[0] + (b.point[0] - a.point[0]) * t - dy * lateral,
      a.point[1] + (b.point[1] - a.point[1]) * t + dx * lateral,
    ];
  };
  const tones: string[][] = [[], [], []];
  const stitch = (a: Point, b: Point, c: Point, tone: number) => {
    tones[tone].push(
      `M${n(a[0])} ${n(a[1])}Q${n(b[0])} ${n(b[1])} ${n(c[0])} ${n(c[1])}`,
    );
  };
  if (across) {
    for (let i = 0, along = 0; along < distance; i++) {
      const tilt = threadVariation(i, seed) * 0.5;
      stitch(
        at(along - 0.3, -halfWidth),
        at(along + 0.9 + tilt, 0),
        at(along + 0.3, halfWidth),
        i % 3,
      );
      along += 1.45 + threadVariation(i, seed + 1) * 0.13;
    }
  } else {
    for (
      let col = 0, lateral = -halfWidth;
      lateral <= halfWidth;
      col++, lateral += 1.5
    ) {
      for (let row = 0, along = -12 + (col % 3) * 4; along < distance; row++) {
        const index = col * 97 + row;
        const length = 11.8 + threadVariation(index, seed) * 2.3;
        const bow = 0.28 + threadVariation(index, seed + 1) * 0.2;
        stitch(
          at(along, lateral),
          at(along + length * 0.5, lateral + bow),
          at(along + length, lateral),
          (col + row) % 3,
        );
        along += length + 0.8 + threadVariation(index, seed + 2) * 0.18;
      }
    }
  }
  return tones.map((paths) => paths.join(" "));
}
