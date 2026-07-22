import { useId } from "react";

type SkyLayer = "sun" | "moon" | "clouds" | "stars";

/** Each moving object gets its own unfiltered surface; the window clips its orbit. */
export function NookWindowSky({ layer }: { layer: SkyLayer }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={`nook-cycle-surface nook-cycle-${layer}`}
      data-cycle={layer}
      viewBox="70 58 262 373"
      fill="none"
      focusable="false"
    >
      {layer === "sun" && (
        <>
          <defs>
            <radialGradient id={`${id}-sun-halo`}>
              <stop stopColor="#fff2cb" stopOpacity=".48" />
              <stop offset=".45" stopColor="#fff2cb" stopOpacity=".18" />
              <stop offset="1" stopColor="#fff2cb" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="126" cy="142" r="64" fill={`url(#${id}-sun-halo)`} />
          <circle cx="126" cy="142" r="22" fill="#f9e3b2" />
          <path
            d="M112 132q5-9 16-8"
            stroke="#fff0c9"
            strokeWidth="1.3"
            opacity=".55"
          />
        </>
      )}
      {layer === "moon" && (
        <>
          <defs>
            <radialGradient id={`${id}-moon-halo`}>
              <stop stopColor="#f4ddbe" stopOpacity=".26" />
              <stop offset=".45" stopColor="#eadfc9" stopOpacity=".08" />
              <stop offset="1" stopColor="#eadfc9" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="238" cy="126" r="58" fill={`url(#${id}-moon-halo)`} />
          <path
            d="M252 103C230 114 231 145 254 152C229 157 213 137 219 117C224 102 241 97 252 103Z"
            fill="#f3dcaf"
          />
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
          <path d="M62 193Q72 182 83 186Q91 168 106 178Q111 180 113 186Q126 181 137 195Q105 199 62 193Z" />
          <path
            d="M201 126Q211 116 222 119Q233 104 245 118Q260 116 271 128Q236 132 201 126Z"
            opacity=".75"
          />
          <path d="M276 240q10-8 17-4q9-12 19-3q11-1 19 8Z" opacity=".4" />
          <path
            d="M170 177q4-5 8 0q4-5 8 0M146 197q3-4 6 0q3-4 6 0"
            stroke="#8c8caa"
            strokeWidth="1"
            fill="none"
            opacity=".8"
          />
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
              <circle cx={x} cy={y} r={i % 2 ? 0.85 : 1.35} opacity=".75" />
              {i % 4 === 0 && (
                <path
                  d={`M${x - 3} ${y}h6m-3-3v6`}
                  stroke="#eadbbf"
                  strokeWidth=".6"
                  opacity=".7"
                />
              )}
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
