import type { SVGProps } from "react";
import { InkIcon } from "@/shared/ui/icons/InkIcon";

export type ChronicleSvgProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};
export type ChronicleIconName =
  | "search"
  | "close"
  | "book"
  | "calendar"
  | "bookmark"
  | "arrow-left"
  | "arrow-right"
  | "refresh"
  | "check"
  | "chevron-down"
  | "up"
  | "heart"
  | "sparkle"
  | "wifi";

/** The Chronicle's controls use the same ink marks as the rest of MogTome. */
export function ChronicleIcon({
  name,
  size = 24,
  ...props
}: ChronicleSvgProps & { name: ChronicleIconName }) {
  return <InkIcon name={name} size={size} {...props} />;
}

// Open shapes and a common stroke keep these stamps legible beside small text.
const stampPaths = {
  joined: (
    <>
      <path d="M13 6h11a2 2 0 0 1 2 2v19H13" />
      <path d="m13 6 8 3v18l-8-3V6Z" />
      <path d="M4 16h9m-4-4 4 4-4 4M11 27h17" />
      <circle cx="18" cy="17" r=".85" fill="currentColor" stroke="none" />
    </>
  ),
  rejoined: (
    <>
      <path d="m9 16 9-8 10 8M11 14.5V27h14V14.5M16 27v-7h4v7" />
      <path d="M17 5.5A8 8 0 0 0 5 12M5 6.5V12h5.5" />
    </>
  ),
  renamed: (
    <>
      <path d="M15 6H7a2 2 0 0 0-2 2v17a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8" />
      <path d="m15.5 16.5 1-4L24 5a1.7 1.7 0 0 1 2.4 0l.6.6a1.7 1.7 0 0 1 0 2.4l-7.5 7.5-4 1ZM22 7l3 3" />
      <path d="M9 20h5m-5 4h11" />
    </>
  ),
  promoted: (
    <>
      <path d="m4.5 10 6 4L16 5l5.5 9 6-4-3 13h-17l-3-13Z" />
      <path d="M8 27h16" />
    </>
  ),
  announcement: (
    <>
      <path d="M9 5h15a3 3 0 0 1 3 3v2h-6" />
      <path d="M9 5a3 3 0 0 0-3 3v2h3v14a3 3 0 0 0 3 3h12a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3" />
      <path d="M12 27a3 3 0 0 0 3-3H9M12 13h6m-6 5h6" />
    </>
  ),
  event: (
    <>
      <path d="M16 7c-4-6-10-2-7 4-7 0-7 8 0 8-3 6 3 10 7 4 4 6 10 2 7-4 7 0 7-8 0-8 3-6-3-10-7-4Z" />
      <circle cx="16" cy="15" r="3" />
    </>
  ),
};

function EventStamp({
  stampDesign,
  size = 32,
  ...props
}: ChronicleSvgProps & { stampDesign: keyof typeof stampPaths }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {stampPaths[stampDesign]}
    </svg>
  );
}

export function MemberJoinedStamp(props: ChronicleSvgProps) {
  return <EventStamp {...props} stampDesign="joined" />;
}
export function MemberRejoinedStamp(props: ChronicleSvgProps) {
  return <EventStamp {...props} stampDesign="rejoined" />;
}
export function NameChangedStamp(props: ChronicleSvgProps) {
  return <EventStamp {...props} stampDesign="renamed" />;
}
export function RankPromotedStamp(props: ChronicleSvgProps) {
  return <EventStamp {...props} stampDesign="promoted" />;
}
export function AnnouncementStamp(props: ChronicleSvgProps) {
  return <EventStamp {...props} stampDesign="announcement" />;
}
export function ChronicleEventStamp(props: ChronicleSvgProps) {
  return <EventStamp {...props} stampDesign="event" />;
}
