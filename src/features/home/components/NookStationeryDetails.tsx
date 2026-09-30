import { useId } from "react";

const paperclipWire =
  "M7 17v19c0 4 6 4 6 0V11c0-7-10-7-10 0v27c0 11 16 11 16 0V15";

/** Bent wire with a thin reflected edge and a close contact shadow. */
export function NookPaperclip() {
  const metalId = useId();

  return (
    <svg
      className="nook-paperclip"
      viewBox="0 0 22 50"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={metalId} x1="0" y1="0" x2="1" y2=".3">
          <stop stopColor="var(--scene-wood-dark)" />
          <stop offset=".19" stopColor="var(--scene-wood-light)" />
          <stop offset=".38" stopColor="var(--ui-surface)" />
          <stop offset=".53" stopColor="var(--scene-wood)" />
          <stop offset=".78" stopColor="var(--scene-paper)" />
          <stop offset="1" stopColor="var(--scene-wood-dark)" />
        </linearGradient>
      </defs>
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          d={paperclipWire}
          stroke="var(--scene-wood-dark)"
          strokeWidth="3.3"
          opacity=".16"
          transform="translate(.8 1.5)"
        />
        <path
          d={paperclipWire}
          stroke="var(--scene-wood-dark)"
          strokeWidth="2.6"
          opacity=".52"
          transform="translate(.3 .5)"
        />
        <path d={paperclipWire} stroke={`url(#${metalId})`} strokeWidth="2.2" />
        <path
          d="M6.6 17v18.6M3 29V11c0-5 5-6 7.5-3.9M12.6 13v19M3.5 39.8q1.6 6.2 7.6 6.2M18.5 17v18"
          stroke="var(--ui-surface)"
          strokeWidth=".55"
          opacity=".86"
        />
      </g>
    </svg>
  );
}

/** Folded paper sleeves sit over the photograph's four corners. */
export function NookPhotoCorners() {
  return (
    <svg
      className="nook-photo-corners"
      viewBox="0 0 300 250"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {[
        "translate(0 0)",
        "translate(300 0) scale(-1 1)",
        "translate(0 250) scale(1 -1)",
        "translate(300 250) scale(-1 -1)",
      ].map((transform) => (
        <g key={transform} transform={transform} strokeLinejoin="round">
          <path
            d="M1 1h19L1 20Z"
            fill="var(--scene-wood)"
            opacity=".26"
            transform="translate(.6 1.1)"
          />
          <path
            d="M.5.5H18L.5 18Z"
            fill="var(--scene-paper)"
            stroke="var(--scene-wood)"
            strokeOpacity=".28"
            strokeWidth=".6"
          />
          <path d="M.8.8H18L.8 4.2Z" fill="var(--ui-surface)" />
          <path d="M.8.8V18l3.4-17.2Z" fill="var(--scene-wood)" opacity=".1" />
          <path
            d="M2.1 15.5 15.5 2.1"
            stroke="var(--ui-surface)"
            strokeWidth="1"
          />
          <path
            d="M1 17.6 17.6 1"
            stroke="var(--scene-wood)"
            strokeWidth=".65"
            opacity=".3"
          />
        </g>
      ))}
    </svg>
  );
}
