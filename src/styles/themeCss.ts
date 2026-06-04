import { THEME_PALETTES, EVENT_PALETTES, type Palette } from "./themePalettes";

/**
 * Emit one `.theme-*` / `.event-*` variable block. Themes/events only carry their
 * three identity colours (+ optional bg); the derived tokens (--shadow, the
 * gradient mesh) are computed from them with color-mix, identically for every
 * palette, so they never have to be repeated by hand.
 */
function paletteBlock(selector: string, p: Palette, isDark: boolean): string {
  const shadowPct = isDark ? 24 : 18;
  const g1 = isDark ? 12 : 14;
  const g2 = isDark ? 13 : 16;
  const g4 = isDark ? 9 : 11;

  const lines: string[] = [];
  if (p.bg) lines.push(`  --bg: ${p.bg};`);
  lines.push(`  --primary: ${p.primary};`);
  lines.push(`  --secondary: ${p.secondary};`);
  lines.push(`  --accent: ${p.accent};`);
  lines.push(
    `  --shadow: color-mix(in srgb, var(--primary) ${shadowPct}%, transparent);`,
  );
  lines.push(
    `  --gradient-1: color-mix(in srgb, var(--secondary) ${g1}%, transparent);`,
  );
  lines.push(
    `  --gradient-2: color-mix(in srgb, var(--primary) ${g2}%, transparent);`,
  );
  lines.push(
    `  --gradient-3: color-mix(in srgb, var(--accent) 9%, transparent);`,
  );
  lines.push(
    `  --gradient-4: color-mix(in srgb, var(--secondary) ${g4}%, transparent);`,
  );

  return `${selector} {\n${lines.join("\n")}\n}`;
}

/** Build the full generated stylesheet (served as `virtual:theme.css`). */
export function generateThemeCss(): string {
  const out: string[] = [
    "/* GENERATED from src/styles/themePalettes.ts — do not edit by hand. */",
  ];

  // User themes (pom-pom is the default and lives in :root, so it's skipped).
  for (const [id, modes] of Object.entries(THEME_PALETTES)) {
    if (id === "pom-pom") continue;
    out.push(paletteBlock(`.theme-${id}`, modes.light, false));
    out.push(paletteBlock(`.dark.theme-${id}`, modes.dark, true));
  }

  // Simple seasonal events.
  for (const [id, modes] of Object.entries(EVENT_PALETTES)) {
    out.push(paletteBlock(`.event-${id}`, modes.light, false));
    out.push(paletteBlock(`.dark.event-${id}`, modes.dark, true));
  }

  return out.join("\n\n") + "\n";
}
