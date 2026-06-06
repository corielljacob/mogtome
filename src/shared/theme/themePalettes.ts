/**
 * Single source of truth for the candy colour palettes - each theme/simple event
 * as just its three identity colours (+ optional bg) for light + dark. Derived
 * from here: the `.theme-*` / `.event-*` CSS blocks (themeCss.ts → virtual:theme.css),
 * the Settings swatches (ThemeContext), and the seasonal-event swatches.
 *
 * NOT here (hand-tuned in index.css): the 7:1 high-contrast a11y variants and the
 * two flagship events (All Saints' Wake, Starlight) that restyle bg/card/text wholesale.
 */

export interface Palette {
  primary: string;
  secondary: string;
  accent: string;
  /** some events/themes wash the whole page in their colour */
  bg?: string;
  /** themes may also deepen the card surface (e.g. Heavensward's navy) */
  card?: string;
}

export interface ModePalette {
  light: Palette;
  dark: Palette;
}

/** order here drives Settings order */
export const THEME_META: {
  id: string;
  name: string;
  description: string;
  /** optional per-theme display/heading font stack (overrides --font-heading) */
  displayFont?: string;
}[] = [
  {
    id: "pom-pom",
    name: "Pom-Pom Classic",
    description: "Warm sunset orange, coral & honey",
  },
  {
    id: "arr",
    name: "A Realm Reborn",
    description: "Hydaelyn's crystal blue, radiant cyan & golden light",
    displayFont: '"Cinzel", "Zen Maru Gothic", serif',
  },
  {
    id: "heavensward",
    name: "Heavensward",
    description: "Ishgard ice-blue, frost & dragonfire gold",
    displayFont: '"Cinzel", "Zen Maru Gothic", serif',
  },
  {
    id: "stormblood",
    name: "Stormblood",
    description: "Ala Mhigan scarlet & imperial gold",
    displayFont: '"Cormorant Garamond", "Cinzel", serif',
  },
  {
    id: "shadowbringers",
    name: "Shadowbringers",
    description: "Amethyst violet, aether cyan & the golden Light",
    displayFont: '"Cinzel", "Zen Maru Gothic", serif',
  },
  {
    id: "endwalker",
    name: "Endwalker",
    description: "Cosmic blue, celestial gold & the dawn at journey's end",
    displayFont: '"Cinzel", "Zen Maru Gothic", serif',
  },
  {
    id: "dawntrail",
    name: "Dawntrail",
    description: "Tural dawn - coral sky, golden sun & teal sea",
    displayFont: '"Cinzel", "Zen Maru Gothic", serif',
  },
  {
    id: "evercold",
    name: "Evercold",
    description: "Norse frost - icy blue, aurora green & violet",
    displayFont: '"Cinzel", "Zen Maru Gothic", serif',
  },
  {
    id: "crystal",
    name: "Crystal Tower",
    description: "Candy sky-blue & turquoise",
  },
  {
    id: "chocobo",
    name: "Chocobo Gold",
    description: "Sunny gold & warm amber",
  },
  {
    id: "tonberry",
    name: "Tonberry Lantern",
    description: "Lantern teal & leafy green",
  },
  {
    id: "cactuar",
    name: "Cactuar Fresh",
    description: "Fresh green & sunlit lime",
  },
  {
    id: "moogle-cloud",
    name: "Moogle Cloud",
    description: "Soft pom-pink & lavender",
  },
  {
    id: "midnight",
    name: "Midnight Realm",
    description: "Candy indigo & lavender",
  },
  {
    id: "sunset",
    name: "Costa del Sol",
    description: "Turquoise water, coral & sun",
  },
];

/** "pom-pom" is the default and lives in :root */
export const THEME_PALETTES: Record<string, ModePalette> = {
  "pom-pom": {
    light: { primary: "#e8682e", secondary: "#ec5f7c", accent: "#f6bd6c" },
    dark: { primary: "#f58a50", secondary: "#f0788e", accent: "#f8c888" },
  },
  arr: {
    light: {
      primary: "#3a7fd5",
      secondary: "#4fb8e0",
      accent: "#e6c155",
      bg: "#eef3fb",
    },
    dark: {
      primary: "#5e9ee8",
      secondary: "#6fcdec",
      accent: "#f0cf6e",
      bg: "#08101f",
      card: "#141d30",
    },
  },
  heavensward: {
    light: {
      primary: "#3a6ea2",
      secondary: "#6e93c1",
      accent: "#2596b0",
      bg: "#e8eef6",
    },
    dark: {
      primary: "#4f93d6",
      secondary: "#89b2dd",
      accent: "#57c7dd",
      bg: "#070c15",
      card: "#161f2e",
    },
  },
  stormblood: {
    light: {
      primary: "#d2303a",
      secondary: "#c2922f",
      accent: "#e6b84e",
      bg: "#fceae6",
    },
    dark: {
      primary: "#ee5a62",
      secondary: "#ddb857",
      accent: "#f1d07c",
      bg: "#1a0a0c",
      card: "#2a1316",
    },
  },
  shadowbringers: {
    light: {
      primary: "#8a52d6",
      secondary: "#3ba3c7",
      accent: "#d6a23c",
      bg: "#f3effa",
    },
    dark: {
      primary: "#a47bea",
      secondary: "#57c2dd",
      accent: "#ecc265",
      bg: "#0c0a16",
      card: "#181327",
    },
  },
  endwalker: {
    light: {
      primary: "#4f6fc8",
      secondary: "#d6a44a",
      accent: "#ec8a56",
      bg: "#f2f1f7",
    },
    dark: {
      primary: "#708fe6",
      secondary: "#e8c06e",
      accent: "#f2a06e",
      bg: "#07060f",
      card: "#14131f",
    },
  },
  dawntrail: {
    light: {
      primary: "#e6906a",
      secondary: "#5f9aa8",
      accent: "#f2bb50",
      bg: "#fdeee0",
    },
    dark: {
      primary: "#f0a578",
      secondary: "#6fb3c0",
      accent: "#f7cf6a",
      bg: "#170f0b",
      card: "#251a13",
    },
  },
  evercold: {
    light: {
      primary: "#36a4d4",
      secondary: "#35c79e",
      accent: "#8f86e0",
      bg: "#eef5f9",
    },
    dark: {
      primary: "#5cc0e8",
      secondary: "#4fdcae",
      accent: "#a99cf0",
      bg: "#050f15",
      card: "#0f1c24",
    },
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
    light: { primary: "#14b8c0", secondary: "#ff7e6a", accent: "#f7c95c" },
    dark: { primary: "#43d3db", secondary: "#ff9683", accent: "#ffd97e" },
  },
};

/** flagship events (all-saints-wake, starlight) are NOT here - bespoke palettes in index.css */
export const EVENT_PALETTES: Record<string, ModePalette> = {
  heavensturn: {
    light: { primary: "#e0503f", secondary: "#e8a634", accent: "#f5cf5c" },
    dark: { primary: "#f0756a", secondary: "#f3c356", accent: "#f8dd8a" },
  },
  valentiones: {
    light: {
      primary: "#d6325c",
      secondary: "#d14f8c",
      accent: "#f08aa0",
      bg: "#fff5f7",
    },
    dark: {
      primary: "#f07090",
      secondary: "#ec7fb0",
      accent: "#f8b0c4",
      bg: "#1c1520",
    },
  },
  "little-ladies": {
    light: {
      primary: "#e06699",
      secondary: "#ee9cc0",
      accent: "#f7d9e6",
      bg: "#fdf2f8",
    },
    dark: {
      primary: "#f08bb4",
      secondary: "#f4adcb",
      accent: "#fbd7e6",
      bg: "#1a1520",
    },
  },
  "hatching-tide": {
    light: {
      primary: "#9b7be0",
      secondary: "#52c99a",
      accent: "#f2c94c",
      bg: "#fefdf5",
    },
    dark: {
      primary: "#b49aec",
      secondary: "#7ddcb4",
      accent: "#f7de7e",
      bg: "#181820",
    },
  },
  "make-it-rain": {
    light: {
      primary: "#d18e1e",
      secondary: "#9b6fd6",
      accent: "#f5cf52",
      bg: "#fffbeb",
    },
    dark: {
      primary: "#f0b441",
      secondary: "#b491ec",
      accent: "#f6d06a",
      bg: "#18151e",
    },
  },
  "moonfire-faire": {
    light: {
      primary: "#e8682e",
      secondary: "#2fa3d4",
      accent: "#f5d27a",
      bg: "#fffaf5",
    },
    dark: {
      primary: "#f5874a",
      secondary: "#4fbce6",
      accent: "#f8de96",
      bg: "#1a1614",
    },
  },
  "the-rising": {
    light: { primary: "#e0503f", secondary: "#3f7fd6", accent: "#f0b94a" },
    dark: { primary: "#f0756a", secondary: "#6ba0ec", accent: "#f5cd6e" },
  },
};
