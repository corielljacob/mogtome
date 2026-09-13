import { useState } from "react";
import { DiscordIcon } from "@/shared/ui/DiscordIcon";
import ffxivIcon from "@/assets/icons/ffxiv.png";
import "../mapping-platform.css";

export function MappingPlatformIcon({
  platform,
  size = 20,
  className = "",
}: {
  platform: "ffxiv" | "discord";
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`dash-mapping-platform-icon ${className}`.trim()}
      data-platform={platform}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {platform === "discord" ? (
        <DiscordIcon width={size} height={size} focusable="false" />
      ) : (
        <img src={ffxivIcon} alt="" width={size} height={size} />
      )}
    </span>
  );
}

function CharacterPortraitImage({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <img
      src={src}
      alt=""
      className="dash-mapping-portrait-image"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <MappingPlatformIcon platform="ffxiv" size={25} />
  );
}

export function MappingCharacterPortrait({ src }: { src: string }) {
  return (
    <span
      className="dash-mapping-avatar dash-mapping-portrait"
      aria-hidden="true"
    >
      <CharacterPortraitImage key={src} src={src} />
    </span>
  );
}
