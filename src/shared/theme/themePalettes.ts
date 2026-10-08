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
    name: "MogTome (Default)",
    description: "Pink, lavender, and cream",
  },
  {
    id: "arr",
    name: "A Realm Reborn",
    description: "Crystal blue, ivory, and gold",
    displayFont: '"Cinzel", "Zen Maru Gothic", serif',
  },
  {
    id: "heavensward",
    name: "Heavensward",
    description: "Ice blue, silver, and midnight blue",
    displayFont: '"Cinzel", "Zen Maru Gothic", serif',
  },
  {
    id: "stormblood",
    name: "Stormblood",
    description: "Sandstone, scarlet, and gold",
    displayFont: '"Cormorant Garamond", "Cinzel", serif',
  },
  {
    id: "shadowbringers",
    name: "Shadowbringers",
    description: "Violet, cyan, and copper",
    displayFont: '"Cinzel", "Zen Maru Gothic", serif',
  },
  {
    id: "endwalker",
    name: "Endwalker",
    description: "Blue, silver, and gold",
    displayFont: '"Cinzel", "Zen Maru Gothic", serif',
  },
  {
    id: "dawntrail",
    name: "Dawntrail",
    description: "Coral and teal",
    displayFont: '"Cinzel", "Zen Maru Gothic", serif',
  },
  {
    id: "evercold",
    name: "Evercold",
    description: "Pearl, violet, and amber",
    displayFont: '"Cinzel", "Zen Maru Gothic", serif',
  },
];

/** "pom-pom" is the default and lives in :root */
export const THEME_PALETTES: Record<string, ModePalette> = {
  "pom-pom": {
    light: { primary: "#ce536d", secondary: "#9c84bf", accent: "#e7ad62" },
    dark: { primary: "#f38ba2", secondary: "#b9a0df", accent: "#f8c888" },
  },
  arr: {
    light: {
      primary: "#2f7194",
      secondary: "#58afc0",
      accent: "#bd9554",
      bg: "#e6edf0",
      card: "#f8f4eb",
    },
    dark: {
      primary: "#8bcce8",
      secondary: "#73c5ce",
      accent: "#dfbd78",
      bg: "#101e2d",
      card: "#1b3040",
    },
  },
  heavensward: {
    light: {
      primary: "#354b72",
      secondary: "#8297b4",
      accent: "#814b5d",
      bg: "#e1e5ee",
      card: "#f2f1ed",
    },
    dark: {
      primary: "#a5bce2",
      secondary: "#859abf",
      accent: "#c492aa",
      bg: "#111b2e",
      card: "#202d45",
    },
  },
  stormblood: {
    light: {
      primary: "#963e40",
      secondary: "#ae8650",
      accent: "#9c5f42",
      bg: "#efe0c9",
      card: "#faf0de",
    },
    dark: {
      primary: "#dd9b8e",
      secondary: "#d8b781",
      accent: "#d29872",
      bg: "#201d2c",
      card: "#352735",
    },
  },
  shadowbringers: {
    light: {
      primary: "#695879",
      secondary: "#68919b",
      accent: "#aa8259",
      bg: "#e9e5ed",
      card: "#f8f1e6",
    },
    dark: {
      primary: "#b9aaca",
      secondary: "#96c1c6",
      accent: "#ccb187",
      bg: "#181a2d",
      card: "#292b43",
    },
  },
  endwalker: {
    light: {
      primary: "#526b8c",
      secondary: "#8b97af",
      accent: "#b4a176",
      bg: "#eeebe7",
      card: "#f8f2e7",
    },
    dark: {
      primary: "#acbfdc",
      secondary: "#b9c7d8",
      accent: "#d9ccac",
      bg: "#101727",
      card: "#222c43",
    },
  },
  dawntrail: {
    light: {
      primary: "#944b35",
      secondary: "#4d837a",
      accent: "#c19a51",
      bg: "#f3ead9",
      card: "#fbf3e3",
    },
    dark: {
      primary: "#e6a485",
      secondary: "#8dbdb0",
      accent: "#e2c080",
      bg: "#122c2b",
      card: "#203d39",
    },
  },
  evercold: {
    light: {
      primary: "#3e6170",
      secondary: "#685575",
      accent: "#79603d",
      bg: "#e7e5e7",
      card: "#f6f0e8",
    },
    dark: {
      primary: "#accad5",
      secondary: "#c1accb",
      accent: "#dcc294",
      bg: "#152c38",
      card: "#273e4b",
    },
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
