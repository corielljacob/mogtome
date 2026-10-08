import { lazy, Suspense, type ComponentType } from "react";
import type { ColorTheme } from "@/shared/contexts/ThemeContext";
import { NookPressedFlower } from "./NookPressedFlower";
import { NookWallHanging } from "./NookWallHanging";

type Placement = "wall" | "letter";
interface KeepsakeProps {
  placement: Placement;
}
interface KeepsakePair {
  wall: ComponentType;
  letter: ComponentType;
}

// Both placements share one import, so only the active theme's artwork is
// downloaded and its stitch paths are prepared once when that theme is shown.
function lazyKeepsakePair(load: () => Promise<KeepsakePair>) {
  return lazy(async () => {
    const pair = await load();
    return {
      default: function ThemeKeepsake({ placement }: KeepsakeProps) {
        const Decoration = pair[placement];
        return <Decoration />;
      },
    };
  });
}

const keepsakes = {
  arr: lazyKeepsakePair(() =>
    import("./NookArrKeepsakes").then((m) => ({
      wall: m.NookArrWayfinder,
      letter: m.NookArrCrystalCharm,
    })),
  ),
  heavensward: lazyKeepsakePair(() =>
    import("./NookHeavenswardKeepsakes").then((m) => ({
      wall: m.NookHeavenswardBanner,
      letter: m.NookHeavenswardSeal,
    })),
  ),
  stormblood: lazyKeepsakePair(() =>
    import("./NookStormbloodKeepsakes").then((m) => ({
      wall: m.NookStormbloodBanner,
      letter: m.NookStormbloodCharm,
    })),
  ),
  shadowbringers: lazyKeepsakePair(() =>
    import("./NookShadowbringersKeepsakes").then((m) => ({
      wall: m.NookShadowbringersBanner,
      letter: m.NookShadowbringersCharm,
    })),
  ),
  endwalker: lazyKeepsakePair(() =>
    import("./NookEndwalkerKeepsakes").then((m) => ({
      wall: m.NookEndwalkerBanner,
      letter: m.NookEndwalkerCharm,
    })),
  ),
  dawntrail: lazyKeepsakePair(() =>
    import("./NookDawntrailKeepsakes").then((m) => ({
      wall: m.NookDawntrailNoticePin,
      letter: m.NookDawntrailCharm,
    })),
  ),
  evercold: lazyKeepsakePair(() =>
    import("./NookEvercoldKeepsakes").then((m) => ({
      wall: m.NookEvercoldBanner,
      letter: m.NookEvercoldCharm,
    })),
  ),
};

export function NookThemeKeepsake({
  theme,
  placement,
}: KeepsakeProps & { theme: ColorTheme | null }) {
  if (!theme || theme === "pom-pom") {
    return placement === "wall" ? <NookWallHanging /> : <NookPressedFlower />;
  }

  const Decoration = keepsakes[theme];
  return (
    <Suspense fallback={null}>
      <Decoration placement={placement} />
    </Suspense>
  );
}
