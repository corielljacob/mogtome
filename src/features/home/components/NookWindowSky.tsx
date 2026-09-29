import { useId } from "react";
import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";
import { NookThread } from "./NookThread";
import { skySewnModels } from "./nookSkyModels";
import "./nook-halloween-sky.css";

type SkyLayer = "sun" | "moon" | "clouds" | "stars";

const bat =
  "M-2-1-2.5-4 0-2.7 2.5-4 2-1Q6-7 12-6Q8-2 9 2Q5-1 3 3L0 5-3 3Q-5-1-9 2Q-8-2-12-6Q-6-7-2-1Z";

/** A warm satin-stitched moon, with a little flight of bats in its glow. */
function HarvestMoon({ id, frame }: { id: string; frame: number }) {
  return (
    <>
      <defs>
        <clipPath id={`${id}-harvest-shape`}>
          <ellipse
            cx="238"
            cy="126"
            rx={32 + [0, 0.6, -0.4][frame]}
            ry={32 + [0, -0.4, 0.6][frame]}
          />
        </clipPath>
        <radialGradient id={`${id}-harvest-halo`}>
          <stop stopColor="#f6d294" stopOpacity=".36" />
          <stop offset=".54" stopColor="#edb875" stopOpacity=".12" />
          <stop offset="1" stopColor="#edb875" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-harvest-fill`} cx="32%" cy="26%" r="80%">
          <stop stopColor="#fff2ca" />
          <stop offset=".62" stopColor="#f0d6a0" />
          <stop offset="1" stopColor="#d8b77d" />
        </radialGradient>
      </defs>
      <circle cx="238" cy="126" r="73" fill={`url(#${id}-harvest-halo)`} />
      <circle cx="238" cy="126" r="32.5" fill={`url(#${id}-harvest-fill)`} />
      <g clipPath={`url(#${id}-harvest-shape)`}>
        <NookThread
          d={skySewnModels[frame].harvestMoonThreads}
          color="#efd8aa"
          shadow="#b39568"
          highlight="#fff3d0"
          width={2.45}
          relief={1.35}
          opacity={0.68}
        />
        <g fill="#b99664" opacity=".18">
          <ellipse
            cx="246"
            cy="111"
            rx="6"
            ry="4.5"
            transform="rotate(24 246 111)"
          />
          <ellipse
            cx="222"
            cy="125"
            rx="4"
            ry="6"
            transform="rotate(-26 222 125)"
          />
          <ellipse
            cx="250"
            cy="139"
            rx="7.5"
            ry="5"
            transform="rotate(-25 250 139)"
          />
          <circle cx="234" cy="146" r="2.5" />
          <circle cx="230" cy="107" r="1.6" />
        </g>
        <NookThread
          d="M241 108q5-3 9 2M219 121q-2 4 1 7M245 140q6 3 10-3"
          color="#dbc393"
          shadow="#b4976e"
          highlight="#fff1c8"
          width={1.25}
          opacity={0.55}
        />
      </g>
      <circle
        cx="238"
        cy="126"
        r="32"
        stroke="#b89a6c"
        strokeWidth="2.8"
        strokeDasharray="1.6 1.35"
        opacity=".6"
      />
      <circle
        cx="238"
        cy="126"
        r="31.2"
        stroke="#f9e9be"
        strokeWidth="1.55"
        strokeDasharray={skySewnModels[frame].seam}
      />
      <path
        d="M211 121a28 28 0 0 1 26-23"
        stroke="#fff5d8"
        strokeWidth="1.9"
        strokeLinecap="round"
        opacity=".7"
      />
      <g transform="translate(220 145) rotate(-16)">
        <g className="nook-halloween-sky-bat">
          <path d={bat} fill="#35283b" stroke="#b89a9a" strokeWidth=".6" />
          <path d="M-2 0-7-3M2 0 7-3" stroke="#735669" strokeWidth=".75" />
        </g>
      </g>
      <g transform="translate(276 120) rotate(12) scale(.68)">
        <g className="nook-halloween-sky-bat nook-halloween-sky-bat--distant">
          <path d={bat} fill="#4b3450" stroke="#a08a91" strokeWidth=".7" />
        </g>
      </g>
    </>
  );
}

/** Each moving object gets its own unfiltered surface; the window clips its orbit. */
export function NookWindowSky({
  layer,
  eventId,
}: {
  layer: SkyLayer;
  eventId: SeasonalEventId | null;
}) {
  const id = useId().replace(/:/g, "");
  const isHalloween = eventId === "all-saints-wake";
  return (
    <svg
      className={`nook-cycle-surface nook-cycle-${layer}`}
      data-cycle={layer}
      viewBox="70 58 262 373"
      fill="none"
      focusable="false"
    >
      {isHalloween && (layer === "sun" || layer === "moon") && (
        <g transform={layer === "sun" ? "translate(-112 16)" : undefined}>
          {skySewnModels.map((_, frame) => (
            <g
              key={frame}
              data-cycle-model={frame}
              data-sewn-model={frame}
              opacity={frame === 0 ? 1 : 0}
            >
              <HarvestMoon id={`${id}-${frame}`} frame={frame} />
            </g>
          ))}
        </g>
      )}
      {layer === "sun" && !isHalloween && (
        <>
          <defs>
            <radialGradient id={`${id}-sun-halo`}>
              <stop stopColor="#fff2cb" stopOpacity=".48" />
              <stop offset=".45" stopColor="#fff2cb" stopOpacity=".18" />
              <stop offset="1" stopColor="#fff2cb" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="126" cy="142" r="64" fill={`url(#${id}-sun-halo)`} />
          {skySewnModels.map((model, frame) => (
            <g
              key={frame}
              data-cycle-model={frame}
              data-sewn-model={frame}
              opacity={frame === 0 ? 1 : 0}
            >
              <defs>
                <clipPath id={`${id}-sun-${frame}`}>
                  <path d={model.sun} />
                </clipPath>
              </defs>
              <path d={model.sun} fill="#f9e3b2" />
              <g clipPath={`url(#${id}-sun-${frame})`}>
                <NookThread
                  d={model.sunThreads}
                  color="#efd39b"
                  shadow="#a58450"
                  highlight="#fff0c9"
                  width={2.65}
                  relief={1.8}
                />
              </g>
              <path
                d={model.sun}
                stroke="#d8b87e"
                strokeWidth="2.4"
                strokeDasharray={model.seam}
              />
              <path
                d={
                  [
                    "M112 132q5-9 16-8",
                    "M113 131q6-8 15-7",
                    "M111 134q4-10 16-10",
                  ][frame]
                }
                stroke="#fff0c9"
                strokeWidth="1.3"
                opacity=".55"
              />
            </g>
          ))}
        </>
      )}
      {layer === "moon" && !isHalloween && (
        <>
          <defs>
            <radialGradient id={`${id}-moon-halo`}>
              <stop stopColor="#f4ddbe" stopOpacity=".26" />
              <stop offset=".45" stopColor="#eadfc9" stopOpacity=".08" />
              <stop offset="1" stopColor="#eadfc9" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="238" cy="126" r="58" fill={`url(#${id}-moon-halo)`} />
          {skySewnModels.map((model, frame) => (
            <g
              key={frame}
              data-cycle-model={frame}
              data-sewn-model={frame}
              opacity={frame === 0 ? 1 : 0}
            >
              <defs>
                <clipPath id={`${id}-moon-${frame}`}>
                  <path d={model.moon} />
                </clipPath>
              </defs>
              <path d={model.moon} fill="#f3dcaf" />
              <g clipPath={`url(#${id}-moon-${frame})`}>
                <NookThread
                  d={model.moonThreads}
                  color="#ebd2a0"
                  shadow="#a48960"
                  highlight="#fff0c9"
                  width={2.65}
                  relief={1.8}
                />
              </g>
              <NookThread
                d={model.moon}
                color="#eed5a5"
                shadow="#bfa377"
                highlight="#fff0c9"
                width={2.1}
                relief={1.8}
                dasharray={model.seam}
              />
            </g>
          ))}
          <path
            d="M228 111q-8 11-5 23"
            stroke="#fff0c9"
            strokeWidth="1.2"
            opacity=".55"
          />
          <g fill="#c5ad91" opacity=".24">
            <ellipse cx="226" cy="126" rx="2" ry="3" />
            <circle cx="233" cy="144" r="1.5" />
            <circle cx="233" cy="108" r="1" />
          </g>
        </>
      )}
      {layer === "clouds" && (
        <g fill="#f8ead5">
          {skySewnModels.map((model, frame) => (
            <g
              key={frame}
              data-cycle-model={frame}
              data-sewn-model={frame}
              opacity={frame === 0 ? 1 : 0}
            >
              <defs>
                <clipPath id={`${id}-cloud-${frame}`}>
                  <path d={model.clouds} />
                </clipPath>
              </defs>
              <path d={model.clouds} fill="#d8cdbb" />
              <g clipPath={`url(#${id}-cloud-${frame})`}>
                <NookThread
                  d={model.cloudThreads}
                  color="#f1e5ce"
                  shadow="#b2a08e"
                  highlight="#fff4df"
                  width={2.2}
                  relief={1.8}
                />
              </g>
              <NookThread
                d={model.clouds}
                color="#efdfc4"
                shadow="#a99280"
                highlight="#fff4df"
                width={2}
                relief={1.8}
                dasharray={model.seam}
              />
            </g>
          ))}
          {!isHalloween && (
            <path
              d="M170 177q4-5 8 0q4-5 8 0M146 197q3-4 6 0q3-4 6 0"
              stroke="#8c8caa"
              strokeWidth="1"
              fill="none"
              opacity=".8"
            />
          )}
        </g>
      )}
      {layer === "stars" && (
        <g fill="#eadbbf">
          {[
            [106, 130],
            [159, 93],
            [187, 153],
            [298, 173],
            [111, 236],
            [286, 228],
            [305, 106],
            [155, 213],
            [207, 186],
            [291, 142],
            [142, 118],
            [181, 240],
          ].map(([x, y], i) => (
            <g key={x}>
              <circle
                cx={x + 0.4}
                cy={y + 0.55}
                r={i % 2 ? 1.6 : 2.1}
                fill="#171d32"
                opacity=".5"
              />
              <circle cx={x} cy={y} r={i % 2 ? 1.05 : 1.55} opacity=".9" />
              <path
                d={`M${x - 1} ${y + 0.3}q-1-2 1-2q2 0 1 2`}
                fill="none"
                stroke="#fff1d0"
                strokeWidth="1.15"
                strokeLinecap="round"
                opacity=".8"
              />
              {i % 4 === 0 && (
                <path
                  d={`M${x - 3} ${y}h6m-3-3v6`}
                  stroke="#eadbbf"
                  strokeWidth="1.1"
                  opacity=".85"
                />
              )}
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
