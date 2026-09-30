import { useId } from "react";
import { NookThread } from "./NookThread";

const ghost =
  "M16 41V26C16 5 49 3 50 26L56 57Q48 66 41 57Q33 68 25 58Q17 65 10 57Z";
const ghostFloss = Array.from({ length: 24 }, (_, i) => {
  const x = 10 + i * 2;
  const spread = (x - 33) * 0.13;
  return `M${x} 8Q${x - spread} 32 ${x + spread} 64`;
}).join(" ");
const ghostHem = "M14 53Q19 59 24 54Q33 65 41 53Q47 60 52 54";
const bow = "M31 49q-17-9-12 4l12-1q17 9 15-4l-12 2";
const bowTail = "m30 52-3 14 6-3 4 3-2-14Z";
const bowFloss =
  "M20 46l10 4M19 48l10 3M19 51h10M38 50l7-3M38 52l8-3M38 54l8-3M30 54l-2 11M32 54v9M34 54l2 11";
const pumpkin = "M15 8C1 1-2 24 10 26q6 3 12-1C34 19 29 1 17 8Z";
const pumpkinFloss =
  "M2 8q-4 10 5 18M4 6q-5 12 5 21M7 5q-6 13 4 22M9 5q-5 14 4 22M12 6q-3 12 2 21M15 6v21M18 6q3 12-1 21M21 5q6 12-2 22M24 5q7 13-3 22M27 7q6 11-4 19M29 10q3 9-4 15";

/** The festival label is a linen patch; the pumpkin uses the same lobe stitches as the sill. */
export function NookHalloweenBadge() {
  const id = useId().replace(/:/g, "");
  return (
    <p className="nook-halloween-badge">
      <svg
        viewBox="-3 -2 37 34"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id={`${id}-badge-pumpkin`}>
            <path d={pumpkin} />
          </clipPath>
        </defs>
        <path d={pumpkin} fill="#bb7c48" stroke="#83553c" strokeWidth="2" />
        <g clipPath={`url(#${id}-badge-pumpkin)`}>
          <NookThread
            d={pumpkinFloss}
            color="#dda86a"
            shadow="#8e5d40"
            highlight="#f7d5a0"
            width={1.6}
            relief={1.3}
          />
        </g>
        <NookThread
          d={pumpkin}
          color="#e8ba80"
          shadow="#97663e"
          width={1.2}
          dasharray=".8 .9"
        />
        <NookThread
          d="M16 8q-4-5 1-7"
          color="#a6a079"
          shadow="#57573f"
          width={2.2}
        />
        <path
          d="m7 15 5-4 1 5m6 0 1-5 5 4M9 19q6 9 14-1l-6 3-2-2-2 2Z"
          fill="#684932"
        />
        <NookThread
          d="m9 14 2-1m10 0 2 1M12 21q4 4 8-1"
          color="#765539"
          highlight="#e8b874"
          width={0.9}
        />
      </svg>
      <span className="nook-halloween-badge-label">All Saints’ Wake</span>
      <span className="nook-halloween-badge-star" aria-hidden="true">
        ✦
      </span>
    </p>
  );
}

/** A padded linen ghost, secured with a brass pin and a satin-stitched bow. */
export function NookHalloweenNote() {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className="nook-halloween-note"
      viewBox="0 0 68 78"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={`${id}-ghost`}>
          <path d={ghost} />
        </clipPath>
        <clipPath id={`${id}-bow`}>
          <path d={bow} />
          <path d={bowTail} />
        </clipPath>
      </defs>
      <path d={ghost} fill="#e5d6b8" stroke="#9e8776" strokeWidth="2.7" />
      <g clipPath={`url(#${id}-ghost)`}>
        <NookThread
          d={ghostFloss}
          color="#eddec0"
          shadow="#ac947e"
          highlight="#fff3d9"
          width={2.25}
          relief={1.4}
        />
      </g>
      <NookThread
        d={ghost}
        color="#f0dfbf"
        shadow="#9b806c"
        highlight="#fff4d9"
        width={2.4}
        relief={1.6}
      />
      <NookThread
        d={ghost}
        color="#c4a98d"
        highlight="#fff1d2"
        width={1.2}
        dasharray="1.15 2.1"
      />
      <NookThread
        d={ghostHem}
        color="#dac4a1"
        shadow="#b0967e"
        highlight="#fff0cf"
        width={1.3}
      />
      <NookThread
        d="M25 30v3m16-3v3m-11 8q4 4 7-1"
        color="#705570"
        shadow="#483849"
        highlight="#b89aa8"
        width={2.1}
        relief={1.3}
      />
      <NookThread
        d="M19 37l5 1m17 0 5-1"
        color="#c89b96"
        shadow="#c0a28d"
        width={1.8}
        opacity={0.8}
      />
      <path d={bow} fill="#806482" stroke="#553e5b" strokeWidth="1.1" />
      <path d={bowTail} fill="#806482" stroke="#553e5b" strokeWidth="1.1" />
      <g clipPath={`url(#${id}-bow)`}>
        <NookThread
          d={bowFloss}
          color="#9e7e9e"
          shadow="#5b435e"
          highlight="#d5b6c8"
          width={1.6}
        />
      </g>
      <NookThread
        d={`${bow} ${bowTail}`}
        color="#b895b0"
        shadow="#735275"
        width={0.8}
      />
      <circle cx="33" cy="51" r="3" fill="#a789a3" />
      <NookThread
        d="M31 49v4m2-5v6m2-5v4"
        color="#b899ac"
        shadow="#745572"
        width={1.2}
      />
      <path
        d="M34 12V5q0-5 4-3q3 1 1 5l-1 10q-3 6-5 0V8"
        stroke="#937448"
        strokeWidth="2.1"
      />
      <path
        d="M34.4 11V5q0-4 3-3"
        stroke="#dfc18a"
        strokeWidth=".8"
        strokeLinecap="round"
      />
    </svg>
  );
}
