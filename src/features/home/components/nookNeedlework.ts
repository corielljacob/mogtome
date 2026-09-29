/** Stable, bounded variation for hand-laid stitches. Never changes on rerender. */
export function threadVariation(index: number, seed = 0): number {
  let value = Math.imul(index + 1, 374761393) ^ Math.imul(seed + 1, 668265263);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 2147483647.5 - 1;
}
