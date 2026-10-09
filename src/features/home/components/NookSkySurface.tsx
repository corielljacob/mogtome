import type { ReactNode } from "react";
import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";
import type { ColorTheme } from "@/shared/contexts/ThemeContext";
import { nookAssetUrl } from "../art/nookAssets";

interface NookSkySurfaceProps {
  scene: ColorTheme | SeasonalEventId;
  exposure?: "day" | "night" | "dusk";
  /** The dusk glazing inherits the room palette in the authored Evercold sky. */
  isDark?: boolean;
  active?: boolean;
  children?: ReactNode;
}

function SkyImage({
  name,
  className,
  active,
}: {
  name: string;
  className: string;
  active: boolean;
}) {
  return (
    <img
      className={className}
      src={nookAssetUrl(`${name}@2x`)}
      srcSet={`${nookAssetUrl(`${name}@2x`)} 524w, ${nookAssetUrl(`${name}@4x`)} 1048w`}
      sizes="(min-width: 1600px) 440px, (min-width: 1024px) 300px, 200px"
      width={262}
      height={373}
      alt=""
      aria-hidden="true"
      draggable={false}
      decoding="async"
      fetchPriority={active ? "high" : "low"}
      data-sky={name}
    />
  );
}

/** Frozen needlework leaves only weather and celestial models as live SVGs. */
export function NookSkySurface({
  scene,
  exposure = "day",
  isDark = false,
  active = exposure !== "dusk",
  children,
}: NookSkySurfaceProps) {
  const surface =
    scene === "evercold" && exposure === "dusk"
      ? `dusk-${isDark ? "night" : "day"}`
      : exposure;
  const name = `sky-${scene}-${surface}`;
  if (scene === "evercold") {
    return (
      <div className="nook-sky-embroidery nook-ec-vault" aria-hidden="true">
        <SkyImage
          name={`${name}-background`}
          className="nook-cycle-surface"
          active={active}
        />
        {children}
        <SkyImage
          name={`${name}-foreground`}
          className="nook-cycle-surface"
          active={active}
        />
      </div>
    );
  }
  return (
    <SkyImage name={name} className="nook-sky-embroidery" active={active} />
  );
}
