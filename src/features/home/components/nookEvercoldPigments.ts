/** Pearl-lit glass, slate cloth and violet petals inside the sheltered city. */
export function evercoldPigments(isDark: boolean) {
  return {
    ink: isDark ? "#223641" : "#3c5059",
    paper: isDark ? "#d5e3db" : "#ecf1e6",
    stone: isDark ? "#607d83" : "#829e9c",
    stoneLight: isDark ? "#91afad" : "#b3c8bc",
    stoneSide: isDark ? "#3e5d67" : "#5b7c81",
    stoneDeep: isDark ? "#2c4652" : "#425e66",
    trim: isDark ? "#a3b6a8" : "#c2cbb3",
    roof: isDark ? "#365b6c" : "#517881",
    roofLight: isDark ? "#759694" : "#93b3ae",
    roofSide: isDark ? "#293f54" : "#3b5b6c",
    glass: isDark ? "#83b3c0" : "#bad9d7",
    glassLight: isDark ? "#d0ded6" : "#e2eee1",
    window: isDark ? "#e5b578" : "#cba877",
    amber: isDark ? "#d2a15f" : "#d8b16e",
    amberLight: isDark ? "#f0d7a0" : "#f5dfac",
    recess: isDark ? "#213a48" : "#355862",
    water: isDark ? "#517e8c" : "#88b6bb",
    waterDeep: isDark ? "#34576b" : "#527f8d",
    reflection: isDark ? "#8fb8c0" : "#cee0d7",
    bark: isDark ? "#374b52" : "#536469",
    barkLight: isDark ? "#617675" : "#7e9290",
    barkShade: isDark ? "#283943" : "#384e58",
    canopy: isDark ? "#897796" : "#ac90ac",
    canopyLight: isDark ? "#b29bb5" : "#cfb3c2",
    canopyShade: isDark ? "#5f5576" : "#846e91",
    moss: isDark ? "#556f70" : "#728e80",
    mossLight: isDark ? "#8eaaa0" : "#abc0a4",
    mossShade: isDark ? "#364e57" : "#4b6d6b",
    flower: isDark ? "#bca4bc" : "#d6bad1",
    path: isDark ? "#8f9c94" : "#b5c0aa",
  };
}

export type EvercoldPigments = ReturnType<typeof evercoldPigments>;
