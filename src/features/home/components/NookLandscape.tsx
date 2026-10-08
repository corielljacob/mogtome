import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";
import type { ColorTheme } from "@/shared/contexts/ThemeContext";
import { nookAssetUrl } from "../art/nookAssets";

export function NookLandscape({
  scene,
  night = false,
  active = true,
  className,
}: {
  scene: ColorTheme | SeasonalEventId;
  night?: boolean;
  active?: boolean;
  className?: string;
}) {
  const name = `landscape-${scene}-${night ? "night" : "day"}`;
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
      data-landscape={scene}
      data-mode={night ? "dark" : "light"}
    />
  );
}
