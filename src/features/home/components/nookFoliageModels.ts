/** Three repeatable pieces of needlework, not a new noise sample per paint.
 * This small, non-rigid change moves both the cloth edge and its needle holes.
 * Absolute M/L/Q/C paths only; origin points stay pinned to their stems. */
export function resewnFoliagePath(
  path: string,
  model: number,
  seed = 0,
  amount = 0.55,
) {
  if (model === 0 || /[a-zAHVST]/.test(path)) return path;
  const coordinates = path.match(/[-+]?(?:\d*\.?\d+)/g)?.map(Number) ?? [];
  let index = 0;
  return path.replace(/[-+]?(?:\d*\.?\d+)/g, () => {
    const axis = index % 2;
    const x = coordinates[index - axis];
    const y = coordinates[index - axis + 1];
    const pinned = Math.min(1, Math.hypot(x, y) / 7);
    const tension = model === 1 ? 1 : -1.12;
    const offset =
      Math.sin(x * 0.23 + y * 0.17 + seed * 0.41 + axis * 2.2) *
      amount *
      tension *
      pinned;
    return (coordinates[index++] + offset).toFixed(2);
  });
}
