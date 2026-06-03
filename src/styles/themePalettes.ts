/**
 * Single source of truth for the candy colour palettes.
 *
 * Every user theme and every "simple" seasonal event lives here as just its three
 * identity colours (primary / secondary / accent) for light + dark, plus an
 * optional page-background tint. From this one file:
 *   • the `.theme-*` / `.event-*` CSS variable blocks are GENERATED at build time
 *     (see `themeCss.ts` + the `themeCssPlugin` in vite.config.ts → `virtual:theme.css`)
 *   • the Settings preview swatches + `THEME_DEFINITIONS` are derived (ThemeContext)
 *   • the seasonal-event preview swatches are derived (constants/seasonalEvents.ts)
 *
 * Intentionally NOT here (kept hand-tuned in index.css): the accessibility
 * high-contrast variants (tuned for 7:1 contrast) and the two flagship events
 * (All Saints' Wake, Starlight) which restyle bg/card/text wholesale.
 */

export interface Palette {
  primary: string;
  secondary: string;
  accent: string;
  /** Optional page background tint (some events wash the page in their colour). */
  bg?: string;
}

export interface ModePalette {
  light: Palette;
  dark: Palette;
}

/** Display metadata for the user-selectable themes (order = Settings order). */
export const THEME_META: { id: string; name: string; description: string }[] = [
  { id: "pom-pom", name: "Pom-Pom Classic", description: "Candy pink, mint & butter" },
  { id: "crystal", name: "Crystal Tower", description: "Candy sky-blue & turquoise" },
  { id: "chocobo", name: "Chocobo Gold", description: "Sunny gold & warm amber" },
  { id: "tonberry", name: "Tonberry Lantern", description: "Lantern teal & leafy green" },
  { id: "cactuar", name: "Cactuar Fresh", description: "Fresh green & sunlit lime" },
  { id: "moogle-cloud", name: "Moogle Cloud", description: "Soft pom-pink & lavender" },
  { id: "midnight", name: "Midnight Realm", description: "Candy indigo & lavender" },
  { id: "sunset", name: "Costa del Sol", description: "Sunset orange & coral" },
];

/** User-selectable colour themes. "pom-pom" is the default (lives in :root). */
export const THEME_PALETTES: Record<string, ModePalette> = {
  "pom-pom": {
    light: { primary: "#e25d88", secondary: "#3fae95", accent: "#f4be4c" },
    dark: { primary: "#f48bae", secondary: "#66cdb4", accent: "#ffcf79" },
  },
  crystal: {
    light: { primary: "#3a8ed2", secondary: "#34bfd6", accent: "#f4be4c" },
    dark: { primary: "#6cb2e6", secondary: "#54d4e6", accent: "#ffd57e" },
  },
  chocobo: {
    light: { primary: "#d3851a", secondary: "#ef9a3a", accent: "#f5cd5f" },
    dark: { primary: "#f0bb45", secondary: "#f5a85a", accent: "#fbe08a" },
  },
  tonberry: {
    light: { primary: "#1fa68c", secondary: "#4fbf78", accent: "#f0b94a" },
    dark: { primary: "#52cca6", secondary: "#7dd98e", accent: "#f7cf6e" },
  },
  cactuar: {
    light: { primary: "#2f9e4c", secondary: "#8cbf3a", accent: "#f0cf4a" },
    dark: { primary: "#66cf82", secondary: "#b0d95e", accent: "#f7dd72" },
  },
  "moogle-cloud": {
    light: { primary: "#d9527f", secondary: "#8e72c2", accent: "#f2a6c6" },
    dark: { primary: "#f07da6", secondary: "#b49ae6", accent: "#f8c2da" },
  },
  midnight: {
    light: { primary: "#6a5cd4", secondary: "#9a6ed6", accent: "#a0aef5" },
    dark: { primary: "#9b90f0", secondary: "#bd96ef", accent: "#b9c6ff" },
  },
  sunset: {
    light: { primary: "#e8682e", secondary: "#ec5f7c", accent: "#f6bd6c" },
    dark: { primary: "#f58a50", secondary: "#f0788e", accent: "#f8c888" },
  },
};

/**
 * Simple seasonal events (override primary/secondary/accent, sometimes the page
 * background). The flagship events (all-saints-wake, starlight) are NOT here —
 * they keep their bespoke palettes in index.css.
 */
export const EVENT_PALETTES: Record<string, ModePalette> = {
  heavensturn: {
    light: { primary: "#e0503f", secondary: "#e8a634", accent: "#f5cf5c" },
    dark: { primary: "#f0756a", secondary: "#f3c356", accent: "#f8dd8a" },
  },
  valentiones: {
    light: { primary: "#d6325c", secondary: "#d14f8c", accent: "#f08aa0", bg: "#fff5f7" },
    dark: { primary: "#f07090", secondary: "#ec7fb0", accent: "#f8b0c4", bg: "#1c1520" },
  },
  "little-ladies": {
    light: { primary: "#e06699", secondary: "#ee9cc0", accent: "#f7d9e6", bg: "#fdf2f8" },
    dark: { primary: "#f08bb4", secondary: "#f4adcb", accent: "#fbd7e6", bg: "#1a1520" },
  },
  "hatching-tide": {
    light: { primary: "#9b7be0", secondary: "#52c99a", accent: "#f2c94c", bg: "#fefdf5" },
    dark: { primary: "#b49aec", secondary: "#7ddcb4", accent: "#f7de7e", bg: "#181820" },
  },
  "make-it-rain": {
    light: { primary: "#d18e1e", secondary: "#9b6fd6", accent: "#f5cf52", bg: "#fffbeb" },
    dark: { primary: "#f0c63e", secondary: "#b491ec", accent: "#f8de7a", bg: "#1a1810" },
  },
  "moonfire-faire": {
    light: { primary: "#e8682e", secondary: "#2fa3d4", accent: "#f5d27a", bg: "#fffaf5" },
    dark: { primary: "#f5874a", secondary: "#4fbce6", accent: "#f8de96", bg: "#1a1614" },
  },
  "the-rising": {
    light: { primary: "#e0503f", secondary: "#3f7fd6", accent: "#f0b94a" },
    dark: { primary: "#f0756a", secondary: "#6ba0ec", accent: "#f5cd6e" },
  },
};
