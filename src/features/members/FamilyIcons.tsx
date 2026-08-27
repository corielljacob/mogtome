import type { ReactNode, SVGProps } from "react";
import { InkIcon } from "@/shared/ui/icons/InkIcon";

export type FamilyIconName =
  | "album"
  | "search"
  | "close"
  | "sort"
  | "chevron-down"
  | "arrow-left"
  | "arrow-right"
  | "external"
  | "heart"
  | "flower"
  | "refresh"
  | "up"
  | "check"
  | "people";
type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };

/** Family controls use the same ink drawings as the rest of the nook. */
export function FamilyIcon({
  name,
  size = 24,
  ...props
}: IconProps & { name: FamilyIconName }) {
  return <InkIcon name={name} size={size} {...props} />;
}

const rankPaths: Record<string, ReactNode> = {
  "Moogle Guardian": (
    <>
      <path d="m4 8 4 3 4-7 4 7 4-3-1.6 12H5.6L4 8Z" />
      <path d="M6.1 16.5h11.8" />
      <path
        d="m12 10.8 1.4 1.5-1.4 1.5-1.4-1.5Z"
        fill="currentColor"
        stroke="none"
      />
    </>
  ),
  "Moogle Knight": (
    <>
      <path d="M12 3.5c2.1 1.4 5 2.3 8 2.7v4.9c0 4.5-3.3 7.3-8 9.4-4.7-2.1-8-4.9-8-9.4V6.2c3-.4 5.9-1.3 8-2.7Z" />
      <path d="M12 7.5v9M9 12.5h6" />
    </>
  ),
  "Paissa Trainer": (
    <>
      <path d="m5.4 8.3-.9-3.8 4 1.5c2.3-.7 4.7-.7 7 0l4-1.5-.9 3.8c1.1 1.6 1.9 3.6 1.7 5.7-.5 4.5-3.6 6.3-8.3 6.3S4.2 18.5 3.7 14c-.2-2.1.6-4.1 1.7-5.7Z" />
      <circle cx="8.5" cy="11.4" r="2.4" />
      <circle cx="15.5" cy="11.4" r="2.4" />
      <g fill="currentColor" stroke="none">
        <circle cx="8.5" cy="11.4" r="0.7" />
        <circle cx="15.5" cy="11.4" r="0.7" />
      </g>
      <path d="M9 16.8q3 2.2 6 0" />
    </>
  ),
  "Coeurl Hunter": (
    <>
      <path d="m4.5 4 4.5 2.7h6L19.5 4l-.8 7c1.8 5.2-1 9-6.7 9s-8.5-3.8-6.7-9l-.8-7Z" />
      <path d="m7.3 10.8 1.9 1m5.6 0 1.9-1M6.2 14.8 3 14m14.8.8L21 14M9.5 17q2.5 1.5 5 0" />
      <path d="M10.7 14h2.6L12 15.5Z" fill="currentColor" stroke="none" />
    </>
  ),
  Mandragora: (
    <>
      <path d="M12 8.5c-4 0-6.5-1.7-6.5-4.7 4 0 6.5 1.8 6.5 4.7Zm0 0C12 4.8 14.5 3 18.5 3c0 3.4-2.5 5.5-6.5 5.5Z" />
      <path d="M12 8.5c-5.2 0-8.2 3.7-6.4 7.8.7 1.6 2 2.5 3.9 2.9L12 21l2.5-1.8c1.9-.4 3.2-1.3 3.9-2.9 1.8-4.1-1.2-7.8-6.4-7.8Z" />
      <g fill="currentColor" stroke="none">
        <circle cx="9" cy="13.5" r="0.85" />
        <circle cx="15" cy="13.5" r="0.85" />
      </g>
      <path d="M10.6 16.5h2.8" />
    </>
  ),
  "Apkallu Seeker": (
    <>
      <path d="M8.5 8C8.3 5.5 9.8 3.8 12 3.8c2.8 0 4.6 2 4.6 4.9l3.3 1.8-3.2 1.7c1.4 4.5-.3 6.8-5.4 6.8-5.3 0-7.7-2.1-6.9-6 .4-2 1.6-3.5 4.1-5Z" />
      <path d="M8.5 11.4c-2 3.3-.6 5.2 2.6 4.7M8.5 19v2H7m6.5-2v2H15" />
      <circle cx="12.8" cy="7.5" r="0.85" fill="currentColor" stroke="none" />
    </>
  ),
  "Kupo Shelf": (
    <>
      <path d="M3 20.5h18M4.5 19.5V9h4v10.5Zm6 0V4.5h4v15ZM16 8.5l3.3-.7 1.7 11.5-3.3.7ZM4.5 15h4m2-6.5h4" />
    </>
  ),
  "Bom Boko": (
    <>
      <path d="M7 7c-3.8-4.3-5.8.4-3 3.2M17 7c3.8-4.3 5.8.4 3 3.2" />
      <path d="M12 6.5c-5.6 0-8.5 4.4-8 8.7.4 3.7 3.5 5.5 8 5.5s7.6-1.8 8-5.5c.5-4.3-2.4-8.7-8-8.7Z" />
      <path d="M11.3 6.5c-.4-2.8 1.3-4.2 4.6-3.6-.3 2.8-1.6 4-4.6 3.6Z" />
      <path
        d="M6.4 12.4c.4-2.4 3.1-2.9 5-.7-1 2.2-3.3 3-5 .7Zm11.2 0c-.4-2.4-3.1-2.9-5-.7 1 2.2 3.3 3 5 .7Z"
        fill="currentColor"
        stroke="none"
      />
      <circle cx="12" cy="15.7" r="0.9" fill="currentColor" stroke="none" />
      <path d="M9 18q3 1.5 6 0" />
    </>
  ),
};

/** Distinct rank silhouettes share an optical scale at 16, 20, and 24 pixels. */
export function FamilyRankIcon({
  rank,
  size = 24,
  ...props
}: IconProps & { rank: string }) {
  const drawing = rankPaths[rank];
  if (!drawing) return <InkIcon {...props} name="heart" size={size} />;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {drawing}
    </svg>
  );
}
