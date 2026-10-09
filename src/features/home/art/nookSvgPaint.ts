/** librsvg silently paints CSS Color 4's color(srgb ...) notation black.
 * Keep the resolved channels and alpha, but use its supported RGB syntax. */
export function toSvgPaint(value: string): string {
  if (!value.startsWith("color(")) return value;
  const match = /^color\(srgb\s+([^/]+?)(?:\s*\/\s*([\d.]+))?\)$/.exec(value);
  if (!match) throw new Error(`Unsupported exported artwork color: ${value}`);
  const channels = match[1].trim().split(/\s+/).map(Number);
  if (
    channels.length !== 3 ||
    channels.some((channel) => !Number.isFinite(channel))
  ) {
    throw new Error(`Invalid exported artwork color: ${value}`);
  }
  const rgb = channels.map((channel) =>
    Math.round(Math.max(0, Math.min(1, channel)) * 255),
  );
  return match[2] === undefined
    ? `rgb(${rgb.join(", ")})`
    : `rgba(${rgb.join(", ")}, ${Math.max(0, Math.min(1, Number(match[2])))})`;
}
