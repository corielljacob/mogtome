// Build-time (vite config) module — keep this import relative; the "@/" alias
// is an app-build alias and isn't resolvable when vite loads its config.
import {
  THEME_PALETTES,
  THEME_META,
  EVENT_PALETTES,
  type Palette,
} from "./themePalettes";

/**
 * Palettes carry only their three identity colours (+ optional bg); the derived
 * --shadow token is computed via color-mix the same way for every palette, so it
 * never has to be repeated by hand.
 */
function paletteBlock(
  selector: string,
  p: Palette,
  isDark: boolean,
  font?: string,
): string {
  const shadowPct = isDark ? 24 : 18;

  const lines: string[] = [];
  if (p.bg) lines.push(`  --bg: ${p.bg};`);
  if (p.card) lines.push(`  --card: ${p.card};`);
  if (font) lines.push(`  --font-heading: ${font};`);
  lines.push(`  --primary: ${p.primary};`);
  lines.push(`  --secondary: ${p.secondary};`);
  lines.push(`  --accent: ${p.accent};`);
  lines.push(
    `  --shadow: color-mix(in srgb, var(--primary) ${shadowPct}%, transparent);`,
  );

  return `${selector} {\n${lines.join("\n")}\n}`;
}

/** served as `virtual:theme.css` */
export function generateThemeCss(): string {
  const out: string[] = [
    "/* GENERATED from src/styles/themePalettes.ts - do not edit by hand. */",
  ];

  const fontById = new Map(THEME_META.map((m) => [m.id, m.displayFont]));

  // pom-pom is the default and lives in :root, so skip it
  for (const [id, modes] of Object.entries(THEME_PALETTES)) {
    if (id === "pom-pom") continue;
    const font = fontById.get(id);
    out.push(paletteBlock(`.theme-${id}`, modes.light, false, font));
    out.push(paletteBlock(`.dark.theme-${id}`, modes.dark, true, font));
  }

  for (const [id, modes] of Object.entries(EVENT_PALETTES)) {
    out.push(paletteBlock(`.event-${id}`, modes.light, false));
    out.push(paletteBlock(`.dark.event-${id}`, modes.dark, true));
  }

  return out.join("\n\n") + "\n";
}
