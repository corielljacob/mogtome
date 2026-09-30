/** Sun-warmed Turali cloth, with a separate moonlit dye for each fixed exposure. */
export function dawntrailPigments(isDark: boolean) {
  return {
    ink: isDark ? "#233e49" : "#624f43",
    paper: isDark ? "#e9ddbf" : "#fff1cd",
    stone: isDark ? "#9f957e" : "#dfbd83",
    stoneLight: isDark ? "#c4b79c" : "#f5d79b",
    stoneSide: isDark ? "#646f70" : "#ae885f",
    stoneDeep: isDark ? "#3c535b" : "#826449",
    trim: isDark ? "#b6a981" : "#eac080",
    terracotta: isDark ? "#a17972" : "#cf8365",
    terracottaLight: isDark ? "#b99583" : "#eaa47e",
    terracottaSide: isDark ? "#765c61" : "#aa624d",
    roof: isDark ? "#387c80" : "#499d90",
    roofLight: isDark ? "#70aaa1" : "#81c1a3",
    roofSide: isDark ? "#285864" : "#30786f",
    window: isDark ? "#efc886" : "#4b7776",
    gold: isDark ? "#c4a465" : "#d5a34e",
    goldLight: isDark ? "#ecd09b" : "#f6d887",
    recess: isDark ? "#293f4a" : "#755640",
    cliff: isDark ? "#536e70" : "#94a78e",
    cliffSide: isDark ? "#3f5c62" : "#6e8f79",
    distant: isDark ? "#52787e" : "#a1c4b0",
    sea: isDark ? "#2f727e" : "#65b9af",
    seaDeep: isDark ? "#285768" : "#3c9995",
    foam: isDark ? "#8fbfbe" : "#d5ead1",
    foliage: isDark ? "#3f7064" : "#5e956a",
    foliageLight: isDark ? "#77a17a" : "#a9bd78",
    foliageShade: isDark ? "#2b5052" : "#39755b",
    path: isDark ? "#ac9c7c" : "#eacb91",
    wood: isDark ? "#7c776b" : "#9f7e55",
    flower: isDark ? "#c59382" : "#edab84",
  };
}

export type DawntrailPigments = ReturnType<typeof dawntrailPigments>;
