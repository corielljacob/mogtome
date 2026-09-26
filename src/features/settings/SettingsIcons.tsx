import type { SVGProps } from "react";
import { InkIcon } from "@/shared/ui/icons/InkIcon";

export type SettingsIconName =
  | "palette"
  | "sun"
  | "moon"
  | "monitor"
  | "calendar"
  | "check"
  | "chevron"
  | "sparkles"
  | "arrow-right"
  | "reset"
  | "eye"
  | "user"
  | "logout"
  | "sliders"
  | "book"
  | "motion"
  | "focus"
  | "contrast"
  | "info"
  | "shield";

export function SettingsIcon({
  name,
  size = 22,
  ...props
}: SVGProps<SVGSVGElement> & { name: SettingsIconName; size?: number }) {
  return (
    <InkIcon
      name={name === "chevron" ? "chevron-down" : name}
      size={size}
      {...props}
    />
  );
}
