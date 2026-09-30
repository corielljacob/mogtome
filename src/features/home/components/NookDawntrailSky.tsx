import { useId } from "react";
import { NookThread } from "./NookThread";
import { dawntrailSkyModels } from "./nookDawntrailSkyModels";
import "./nook-dawntrail-window.css";

type SkyLayer = "sun" | "moon" | "clouds" | "stars";
const stars = [
  [133, 96],
  [167, 83],
  [190, 128],
  [219, 99],
  [240, 79],
  [304, 158],
  [157, 166],
  [225, 188],
  [114, 190],
];

/** Three cut cotton pieces exchange with the reversible exposure transition. */
export function NookDawntrailSky({ layer }: { layer: SkyLayer }) {
  const id = `${useId().replace(/:/g, "")}-dawntrail-${layer}`;
  return (
    <svg
      className={`nook-cycle-surface nook-cycle-${layer} nook-dt-${layer}`}
      data-cycle={layer}
      viewBox="70 58 262 373"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {layer === "stars" ? (
        <g>
          {stars.map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <g className={`nook-dt-star nook-dt-star--${i % 3}`}>
                <NookThread
                  d={
                    i % 3
                      ? "M-.6-.3q.5-.65 1 .05q.25.65-.55.75q-.75-.05-.45-.8"
                      : "M-2.4 0h4.8M0-2.5v5"
                  }
                  color="#f0dcb3"
                  shadow="#23424b"
                  highlight="#fff6dd"
                  width={1.05}
                />
              </g>
            </g>
          ))}
        </g>
      ) : (
        dawntrailSkyModels.map((model, frame) => (
          <g
            key={frame}
            data-cycle-model={frame}
            data-sewn-model={frame}
            opacity={frame === 0 ? 1 : 0}
          >
            {(layer === "sun" || layer === "moon") && (
              <g
                transform={
                  layer === "sun" ? "translate(144 105)" : "translate(275 116)"
                }
              >
                <defs>
                  <clipPath id={`${id}-${frame}`}>
                    <path d={layer === "sun" ? model.sun : model.moon} />
                  </clipPath>
                  <radialGradient
                    id={`${id}-${frame}-pad`}
                    cx=".34"
                    cy=".28"
                    r=".8"
                  >
                    <stop stopColor={layer === "sun" ? "#f6d48b" : "#f6edda"} />
                    <stop
                      offset=".52"
                      stopColor={layer === "sun" ? "#e7b65f" : "#e7dfc6"}
                    />
                    <stop
                      offset="1"
                      stopColor={layer === "sun" ? "#c99451" : "#b5beb0"}
                    />
                  </radialGradient>
                </defs>
                {layer === "sun" && (
                  <NookThread
                    d={model.rays}
                    color="#e8bb6e"
                    shadow="#bd9356"
                    highlight="#ffebaf"
                    width={2}
                    relief={1.35}
                  />
                )}
                <path
                  d={layer === "sun" ? model.sun : model.moon}
                  fill={layer === "sun" ? "#b17c49" : "#455e68"}
                  transform="translate(.5 1)"
                  opacity=".28"
                />
                <path
                  d={layer === "sun" ? model.sun : model.moon}
                  fill={`url(#${id}-${frame}-pad)`}
                />
                <g clipPath={`url(#${id}-${frame})`}>
                  {(layer === "sun" ? model.sunThreads : model.moonThreads).map(
                    (d, i) => (
                      <NookThread
                        key={i}
                        d={d}
                        color={
                          i === 1
                            ? layer === "sun"
                              ? "#ecc477"
                              : "#eae3ce"
                            : `url(#${id}-${frame}-pad)`
                        }
                        shadow={layer === "sun" ? "#bd8e55" : "#93a39c"}
                        highlight={layer === "sun" ? "#f6ddb0" : "#f8f0df"}
                        width={1.45}
                        relief={1.5}
                      />
                    ),
                  )}
                </g>
                <NookThread
                  d={layer === "sun" ? model.sun : model.moon}
                  color={layer === "sun" ? "#f7daa0" : "#f4ebcf"}
                  shadow={layer === "sun" ? "#cba160" : "#93a39c"}
                  highlight={layer === "sun" ? "#fff1c8" : "#fff4df"}
                  width={1.5}
                  dasharray={model.seam}
                  relief={1.5}
                />
                {layer === "sun" && (
                  <NookThread
                    d={model.sunShine}
                    color="#f9dba0"
                    shadow="#cba160"
                    highlight="#fff1c8"
                    width={1.3}
                  />
                )}
              </g>
            )}
            {layer === "clouds" &&
              model.clouds.map((cloud, index) => (
                <g
                  key={index}
                  className={`nook-dt-cloud-piece nook-dt-cloud-piece--${index}`}
                >
                  <defs>
                    <clipPath id={`${id}-${frame}-${index}`}>
                      <path d={cloud.shape} />
                    </clipPath>
                    <linearGradient
                      id={`${id}-${frame}-${index}-pad`}
                      x1=".2"
                      y1="0"
                      x2=".45"
                      y2="1"
                    >
                      <stop stopColor="#faf0d9" />
                      <stop offset=".47" stopColor="#ede5cd" />
                      <stop offset="1" stopColor="#cad3bb" />
                    </linearGradient>
                  </defs>
                  <path
                    d={cloud.shape}
                    fill="#709998"
                    transform="translate(.5 1)"
                    opacity=".25"
                  />
                  <path
                    d={cloud.shape}
                    fill={`url(#${id}-${frame}-${index}-pad)`}
                  />
                  <g clipPath={`url(#${id}-${frame}-${index})`}>
                    {cloud.threads.map((d, i) => (
                      <NookThread
                        key={i}
                        d={d}
                        color={
                          i === 1
                            ? "#f2ead5"
                            : `url(#${id}-${frame}-${index}-pad)`
                        }
                        shadow="#9dafaa"
                        highlight="#fff1db"
                        width={1.45 + i * 0.05}
                        relief={1.5}
                      />
                    ))}
                    <NookThread
                      d={cloud.fold}
                      color="#e2e0c8"
                      shadow="#8ea9a1"
                      highlight="#fff2da"
                      width={1.15}
                      relief={1.5}
                    />
                  </g>
                  <NookThread
                    d={cloud.shape}
                    color="#e0dcc2"
                    shadow="#7baba9"
                    highlight="#fff2d7"
                    width={1.2}
                    relief={1.45}
                    dasharray={model.seam}
                  />
                </g>
              ))}
          </g>
        ))
      )}
    </svg>
  );
}

const wings = [
  {
    far: "M0 0Q-5-2-12 0L-8 2-1 2Z",
    near: "M0 1Q6-2 13 0L9 2 2 3Z",
    stitches: "M1 1Q6-.8 11 0M3 1.4l4 .3m-3.5.6 3 .2",
  },
  {
    far: "M0 0Q-3-6-9-9L-7-3-1 2Z",
    near: "M0 1Q4-8 10-11L8-4 2 3Z",
    stitches: "M1 1Q4-5 9-9M3-1l3-2m-2 4 2-2",
  },
  {
    far: "M0 0Q-4 3-8 7L-4 6 1 2Z",
    near: "M0 1Q5 4 10 9L7 9 1 3Z",
    stitches: "M1 2Q5 5 8.5 8M2.5 3.4l2 3m-1.1-2.2 2 3",
  },
];

function SewnGull() {
  return (
    <g className="nook-dt-gull">
      {wings.map(({ far, near, stitches }, pose) => (
        <g
          key={pose}
          data-ambient-model={pose}
          data-sewn-model={pose}
          opacity={pose === 0 ? 1 : 0}
        >
          <path d={far} fill="#729997" stroke="#416b70" strokeWidth=".8" />
          <path
            d="M-3 1-6 4-2 3Q1 4 4 0L5-1 6 .1 7-.4 5.4-1.5Q3.8-3 2.5-1.2Z"
            fill="#eee6cd"
            stroke="#547b7b"
            strokeWidth=".6"
          />
          <NookThread
            d="M-3 2Q.5 .7 3-.8"
            color="#dddcc6"
            shadow="#416b70"
            highlight="#fff0d3"
            width={1.7}
            relief={1.1}
          />
          <path d={near} fill="#cbd7c5" stroke="#50797b" strokeWidth=".85" />
          <NookThread
            d={stitches}
            color="#e6e6ce"
            shadow="#53797b"
            highlight="#fff1d3"
            width={1.15}
            relief={1.2}
          />
          <path d="M5.2-1.3 7-.4 5.5-.1" stroke="#b89763" strokeWidth=".7" />
        </g>
      ))}
    </g>
  );
}

/** Birds keep their own flight clock and remain above the city's tallest roofs. */
export function NookDawntrailBirds() {
  return (
    <svg
      className="nook-cycle-surface nook-dt-birds"
      viewBox="70 58 262 373"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {[0.66, 0.49, 0.39].map((scale, bird) => (
        <g
          key={bird}
          className={`nook-dt-flight nook-dt-flight--${bird}`}
          transform={`translate(${[248, 278, 292][bird]} ${[128, 143, 123][bird]})`}
        >
          <g transform={`scale(${scale})`}>
            <SewnGull />
          </g>
        </g>
      ))}
    </svg>
  );
}

export function NookDawntrailTide() {
  return (
    <svg
      className="nook-cycle-surface nook-dt-tide"
      viewBox="70 58 262 373"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {[
        [291, 331],
        [271, 365],
        [313, 397],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <g className={`nook-dt-glint nook-dt-glint--${i}`}>
            <NookThread
              d="M-9 0q5-1 9 0m3 0 6-.5M-3 4h5"
              color="#e0e6be"
              shadow="#326b71"
              highlight="#fff0c8"
              width={1.1}
              relief={1.1}
            />
          </g>
        </g>
      ))}
    </svg>
  );
}
