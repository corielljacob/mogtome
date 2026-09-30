import type { SVGProps } from "react";
import { InkIcon } from "@/shared/ui/icons/InkIcon";

export type AboutIconName =
  | "external"
  | "heart"
  | "sparkle"
  | "edit"
  | "check"
  | "close"
  | "chevron-down"
  | "arrow-right"
  | "arrow-left"
  | "up"
  | "people"
  | "leaf"
  | "crystal"
  | "compass"
  | "camera"
  | "treasure"
  | "chat"
  | "search"
  | "refresh";

/** Small ink drawings for the FC welcome note and crew album. */
export function AboutIcon({
  name,
  size = 24,
  ...props
}: SVGProps<SVGSVGElement> & { name: AboutIconName; size?: number | string }) {
  return <InkIcon name={name} size={size} {...props} />;
}
