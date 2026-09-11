import type { SVGProps } from "react";
import { InkIcon } from "@/shared/ui/icons/InkIcon";

export type DashboardIconName =
  | "book"
  | "link"
  | "sparkles"
  | "check"
  | "close"
  | "refresh"
  | "search"
  | "arrow-right"
  | "arrow-left"
  | "chevron-down"
  | "clock"
  | "people"
  | "alert"
  | "feather"
  | "leaf"
  | "home"
  | "inbox"
  | "shield";

export function DashboardIcon({
  name,
  size = 20,
  ...props
}: Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: DashboardIconName;
  size?: number;
}) {
  return <InkIcon name={name} size={size} {...props} />;
}
