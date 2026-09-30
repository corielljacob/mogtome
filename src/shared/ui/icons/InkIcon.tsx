import type { SVGProps } from "react";

/**
 * MogTome's small ink drawings. Use one 24px grid, rounded 1.65px strokes,
 * and a little breathing room around every silhouette. Detail belongs in the
 * illustrations; these marks need to remain readable inside a 16px control.
 */
const drawings = {
  album: (
    <>
      <rect x="4.5" y="3.5" width="15.5" height="17" rx="2" />
      <path d="M8 3.5v17M3 8h3m-3 8h3" />
      <rect x="11" y="7" width="6" height="7" rx=".8" />
      <path d="m11 12 2-2 4 3m-6 4h6" />
    </>
  ),
  book: (
    <>
      <path d="M12 5.5C9.5 3.9 6 3.6 3 4.5v14c3-.9 6.5-.6 9 1 2.5-1.6 6-1.9 9-1v-14c-3-.9-6.5-.6-9 1Zm0 0v14" />
      <path d="M6.5 8.5c.8 0 1.5.2 2.3.5m-2.3 3c.8 0 1.5.2 2.3.5m6.4-3.5c.8-.3 1.5-.5 2.3-.5m-2.3 4c.8-.3 1.5-.5 2.3-.5" />
    </>
  ),
  bookmark: (
    <path d="M7 3.5h10a1 1 0 0 1 1 1v16l-6-3.5-6 3.5v-16a1 1 0 0 1 1-1Z" />
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.3 15.3 5.2 5.2" />
    </>
  ),
  close: <path d="m6.5 6.5 11 11m0-11-11 11" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-up": <path d="m6 15 6-6 6 6" />,
  "chevron-left": <path d="m15 6-6 6 6 6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  "arrow-left": <path d="M20 12H4m6-6-6 6 6 6" />,
  "arrow-right": <path d="M4 12h16m-6-6 6 6-6 6" />,
  up: <path d="M12 20V4m-6 6 6-6 6 6" />,
  "arrow-down": <path d="M12 4v16m-6-6 6 6 6-6" />,
  sort: <path d="M6 4.5v15m-3-3 3 3 3-3M12 6h9m-9 6h6m-6 6h3" />,
  external: (
    <path d="M14 4h6v6m0-6-9 9M9 5H5.5A1.5 1.5 0 0 0 4 6.5v12A1.5 1.5 0 0 0 5.5 20h12a1.5 1.5 0 0 0 1.5-1.5V15" />
  ),
  refresh: (
    <path d="M20 9a8.5 8.5 0 0 0-14-4L3 8m0-4.5V8h4.5M4 15a8.5 8.5 0 0 0 14 4l3-3m0 4.5V16h-4.5" />
  ),
  reset: <path d="M4 9a8.5 8.5 0 1 1 0 6M4 4v5h5" />,
  heart: (
    <path d="M12 20S3.5 14.8 3.5 9.4a4.6 4.6 0 0 1 8.5-2.3 4.6 4.6 0 0 1 8.5 2.3C20.5 14.8 12 20 12 20Z" />
  ),
  flower: (
    <>
      <path d="M12 5.5c2.5-4 6.5-.8 4.5 2.5 4.5.4 4 5.4 0 5.5 1.5 4-3.5 6-4.5 2-1 4-6 2-4.5-2-4-.1-4.5-5.1 0-5.5-2-3.3 2-6.5 4.5-2.5Z" />
      <circle cx="12" cy="10.5" r="2" />
      <path d="M12 17v4m0-1c2.5 0 4-1 4.5-2.5" />
    </>
  ),
  leaf: (
    <>
      <path d="M6 17C2 8 11 3 20 3c0 9-5 17-14 14Zm-2 4L16 9" />
      <path d="M11 14h5m-5 0V9" />
    </>
  ),
  sparkle: (
    <path d="M12 3c1.3 6.1 2.9 7.7 9 9-6.1 1.3-7.7 2.9-9 9-1.3-6.1-2.9-7.7-9-9 6.1-1.3 7.7-2.9 9-9Z" />
  ),
  sparkles: (
    <>
      <path d="M10 4c1 4.9 2.1 6 7 7-4.9 1-6 2.1-7 7-1-4.9-2.1-6-7-7 4.9-1 6-2.1 7-7Z" />
      <path d="M19 3v4m-2-2h4m-3 11v5m-2.5-2.5h5" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="7.5" r="3" />
      <path d="M3 20v-1.5a6 6 0 0 1 12 0V20H3ZM16 4.7a3 3 0 0 1 0 5.6m2 3.8a5 5 0 0 1 3 4.6V20" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="7.5" r="3.5" />
      <path d="M5 20v-1a7 7 0 0 1 14 0v1H5Z" />
    </>
  ),
  "user-circle": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="9" r="2.5" />
      <path d="M6.3 18.3a5.8 5.8 0 0 1 11.4 0" />
    </>
  ),
  crown: (
    <>
      <path d="m4 7 4 3 4-6 4 6 4-3-2 13H6L4 7Z" />
      <path d="M6 16h12" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  home: (
    <>
      <path d="m3 10.5 9-7.5 9 7.5M5 9v10a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19V9" />
      <path d="M9.5 20.5v-7h5v7" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3c2.4 1.8 5.1 2.6 8 3-.3 7-2.8 11.8-8 15-5.2-3.2-7.7-8-8-15 2.9-.4 5.6-1.2 8-3Z" />
      <path d="m8.5 11.8 2.5 2.7 4.5-5" />
    </>
  ),
  link: (
    <path d="m10 8 3-3a4.2 4.2 0 0 1 6 6l-3 3m-2 2-3 3a4.2 4.2 0 0 1-6-6l3-3m0 6 8-8" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M8 3v4m8-4v4M3.5 10h17M8 14h2m4 0h2m-8 3.5h2" />
    </>
  ),
  inbox: (
    <>
      <path d="m3.5 13 3-9h11l3 9v5.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V13Z" />
      <path d="M3.5 13H8l1.5 3h5l1.5-3h4.5M9 8h6" />
    </>
  ),
  alert: (
    <>
      <path d="m10.7 4.5-8 14A1.5 1.5 0 0 0 4 20.8h16a1.5 1.5 0 0 0 1.3-2.3l-8-14a1.5 1.5 0 0 0-2.6 0ZM12 9v5" />
      <circle cx="12" cy="17.4" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v6" />
      <circle cx="12" cy="7.5" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  feather: (
    <>
      <path d="M7 17C4 11 9 3 20.5 3.5c.2 3.3-.5 6.1-1.8 8.5H15l2.1 2.1C14.6 17.3 11.2 18.3 7 17ZM3.5 20.5 16 8" />
      <path d="M10 14v-4" />
    </>
  ),
  edit: (
    <>
      <path d="m14.5 5.5 4 4M4 20l5-1 11-11a2.8 2.8 0 0 0-4-4L5 15l-1 5Zm1-5 4 4M13 20h7" />
    </>
  ),
  crystal: (
    <>
      <path d="m12 3 6 5v8l-6 5-6-5V8l6-5Zm0 0v18M6 8l6 3 6-3M6 16l6-5 6 5" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z" />
    </>
  ),
  camera: (
    <>
      <path d="M5 7h2.5L9 4.5h6L16.5 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
      <circle cx="12" cy="13.5" r="3.5" />
      <circle cx="18" cy="10" r=".8" fill="currentColor" stroke="none" />
    </>
  ),
  treasure: (
    <>
      <path d="M3.5 12V8.5a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4V12m-17 0h17v6.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V12ZM7.5 4.5V12m9-7.5V12" />
      <path d="M10 12h4v4h-4z" fill="currentColor" fillOpacity=".12" />
    </>
  ),
  chat: (
    <>
      <path d="M21 11.5c0 4.1-4 7.5-9 7.5-1.1 0-2.2-.2-3.2-.5L4 21l.9-5A6.6 6.6 0 0 1 3 11.5C3 7.4 7 4 12 4s9 3.4 9 7.5Z" />
      <path d="M8 10h8m-8 4h5" />
    </>
  ),
  wifi: (
    <>
      <path d="M3 8.5a14 14 0 0 1 18 0m-14.7 4a9 9 0 0 1 11.4 0m-8.1 3.7a4 4 0 0 1 4.8 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.8 0 2.6-1.1 1.9-2.4l-.6-1c-.6-1.1 0-2.1 1.3-2.1h2.2c2.5 0 3.7-1.5 3.7-3.8 0-4.3-3.8-7.7-8.5-7.7Z" />
      <circle cx="7.2" cy="10" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="11" cy="7" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="15.8" cy="8.5" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="7.8" cy="15" r="1.15" fill="currentColor" stroke="none" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2m0 15v2M2.5 12h2m15 0h2M5.3 5.3l1.4 1.4m10.6 10.6 1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </>
  ),
  moon: <path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.7 8.7 0 1 0 20.5 14Z" />,
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8m-4-4v4" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5s9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  logout: (
    <path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10m0-8h11m-4-4 4 4-4 4" />
  ),
  login: (
    <path d="M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14M3 12h11m-4-4 4 4-4 4" />
  ),
  sliders: (
    <>
      <path d="M3 6h4m4 0h10M3 12h10m4 0h4M3 18h4m4 0h10" />
      <circle cx="9" cy="6" r="2" />
      <circle cx="15" cy="12" r="2" />
      <circle cx="9" cy="18" r="2" />
    </>
  ),
  motion: (
    <>
      <path d="M3 7h5m-5 5h3m-3 5h5m7-13 6 8-6 8m-4-12 3 4-3 4" />
    </>
  ),
  focus: (
    <>
      <path d="M8 3.5H5a1.5 1.5 0 0 0-1.5 1.5v3m12.5-4.5h3A1.5 1.5 0 0 1 20.5 5v3m-17 8v3A1.5 1.5 0 0 0 5 20.5h3m12.5-4.5v3a1.5 1.5 0 0 1-1.5 1.5h-3" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  contrast: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path
        d="M12 3.5v17a8.5 8.5 0 0 0 0-17Z"
        fill="currentColor"
        stroke="none"
      />
    </>
  ),
  settings: (
    <>
      <path
        d="m9.5 3-.6 2.4-2.2 1.3-2.4-.7-2.5 4.3L3.5 12l.1 2.5-1.7 1.7L4.4 20l2.3-.7 2.2 1.3.6 2.4h5l.6-2.4 2.2-1.3 2.4.7 2.5-4.3-1.7-1.7V12l1.7-1.7L19.7 6l-2.4.7-2.2-1.3-.6-2.4h-5Z"
        transform="translate(1.8 .5) scale(.85)"
      />
      <circle cx="12" cy="11.6" r="3.2" />
    </>
  ),
} as const;

export type InkIconName = keyof typeof drawings;
export type InkIconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: InkIconName;
  size?: number | string;
  title?: string;
};

export function InkIcon({ name, size = 24, title, ...props }: InkIconProps) {
  const label = title ?? props["aria-label"];
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
      aria-hidden={label || props["aria-labelledby"] ? undefined : true}
      aria-label={label}
      role={label || props["aria-labelledby"] ? "img" : undefined}
      focusable="false"
      data-ink-icon={name}
      {...props}
    >
      {title && <title>{title}</title>}
      {drawings[name]}
    </svg>
  );
}
