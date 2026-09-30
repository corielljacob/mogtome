import { useId, type CSSProperties } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";
import { resewnFoliagePath } from "./nookFoliageModels";
import "./nook-foliage-models.css";

type Point = [number, number];
type Curve = [Point, Point, Point, Point];
interface Vine {
  curves: Curve[];
  count: number;
  seed: number;
  scale: number;
}

const frontVines: Vine[] = [
  {
    curves: [
      [
        [202, 34],
        [140, 31],
        [91, 70],
        [63, 115],
      ],
      [
        [63, 115],
        [43, 150],
        [46, 177],
        [49, 198],
      ],
      [
        [49, 198],
        [43, 263],
        [58, 308],
        [42, 375],
      ],
    ],
    count: 24,
    seed: 1,
    scale: 0.67,
  },
  {
    curves: [
      [
        [202, 34],
        [273, 34],
        [331, 86],
        [349, 151],
      ],
      [
        [349, 151],
        [365, 197],
        [346, 241],
        [355, 283],
      ],
    ],
    count: 19,
    seed: 4,
    scale: 0.59,
  },
];
const rearVines: Vine[] = [
  {
    curves: [
      [
        [165, 29],
        [95, 28],
        [33, 112],
        [39, 196],
      ],
      [
        [39, 196],
        [31, 253],
        [40, 301],
        [33, 344],
      ],
    ],
    count: 17,
    seed: 5,
    scale: 0.49,
  },
  {
    curves: [
      [
        [236, 29],
        [316, 48],
        [371, 119],
        [363, 217],
      ],
    ],
    count: 9,
    seed: 3,
    scale: 0.47,
  },
];

function pointOnVine(vine: Pick<Vine, "curves">, t: number): Point {
  const position = Math.min(t, 0.99999) * vine.curves.length;
  const curve = vine.curves[Math.floor(position)];
  const u = position % 1;
  const v = 1 - u;
  return [0, 1].map(
    (axis) =>
      v ** 3 * curve[0][axis] +
      3 * v ** 2 * u * curve[1][axis] +
      3 * v * u ** 2 * curve[2][axis] +
      u ** 3 * curve[3][axis],
  ) as Point;
}

function vinePath(vine: Pick<Vine, "curves">) {
  return (
    `M${vine.curves[0][0].join(" ")}` +
    vine.curves
      .map(
        (curve) =>
          `C${curve[1].join(" ")} ${curve[2].join(" ")} ${curve[3].join(" ")}`,
      )
      .join("")
  );
}

/** Small changes in tension and spacing follow the cord, including on bends. */
function cordWraps(points: Point[], radius: number, pitch: number, seed = 0) {
  let length = 0;
  let nextWrap = pitch * 0.5;
  const stitches: string[] = [];
  for (let i = 1; i < points.length; i++) {
    const [x, y] = points[i - 1];
    const dx = points[i][0] - x;
    const dy = points[i][1] - y;
    const step = Math.hypot(dx, dy);
    if (step === 0) continue;
    const tx = dx / step;
    const ty = dy / step;
    while (nextWrap <= length + step) {
      const index = stitches.length;
      const spread = radius * (1 + threadVariation(index, seed) * 0.09);
      const slant = 0.7 + threadVariation(index, seed + 1) * 0.2;
      const distance = nextWrap - length;
      const cx = x + tx * distance;
      const cy = y + ty * distance;
      const start: Point = [
        cx + ty * spread - tx * slant,
        cy - tx * spread - ty * slant,
      ];
      const end: Point = [
        cx - ty * spread + tx * slant,
        cy + tx * spread + ty * slant,
      ];
      stitches.push(
        `M${start[0].toFixed(2)} ${start[1].toFixed(2)}Q${(cx - tx * 0.5).toFixed(2)} ${(cy - ty * 0.5).toFixed(2)} ${end[0].toFixed(2)} ${end[1].toFixed(2)}`,
      );
      nextWrap += pitch * (1 + threadVariation(index, seed + 2) * 0.13);
    }
    length += step;
  }
  return stitches.join(" ");
}

const tendril: Pick<Vine, "curves"> = {
  curves: [
    [
      [0, 0],
      [-9, -3],
      [-18, 2],
      [-19, -7],
    ],
    [
      [-19, -7],
      [-20, -13],
      [-12, -17],
      [-9, -11],
    ],
    [
      [-9, -11],
      [-7, -7],
      [-11, -4],
      [-13, -7],
    ],
  ],
};
const tendrilWraps = cordWraps(
  Array.from({ length: 100 }, (_, i) => pointOnVine(tendril, i / 99)),
  0.8,
  3.4,
);

const blades = [
  // Rounded lobes and an off-centre tip keep the mature leaves from looking stamped.
  "M0 0C-4-5-12-3-16-9Q-13-12-13-16Q-19-19-21-27Q-13-26-8-29Q-5-34 1-41Q5-32 10-28Q16-29 21-27Q19-20 13-16Q14-10 17-8Q7-4 0 0Z",
  "M0 0Q-5-6-13-6Q-12-13-18-20Q-11-21-7-25Q-3-34 3-40Q5-29 10-25L18-25Q16-18 10-13Q12-8 11-5Q5-4 0 0Z",
  // New growth has smaller, simpler blades.
  "M0 0C-10-4-14-14-10-22Q-4-27 1-35Q6-28 11-21C16-12 9-3 0 0Z",
];

// Scale the leaf geometry, never the floss. Even new growth retains raised strands.
function scaledBlade(d: string, scale: number) {
  return d.replace(/[-+]?(?:\d*\.?\d+)(?:[eE][-+]?\d+)?/g, (number) =>
    (Number(number) * scale).toFixed(2),
  );
}

function fishboneFill(
  scale: number,
  side: -1 | 1,
  seed: number,
  model: number,
) {
  const stitches: string[] = [];
  const pitch = [2.45, 2.52, 2.38][model];
  const needleSeed = seed + model * 97;
  for (let y = -48 * scale + model * 0.38; y < 2; y += pitch) {
    const index = stitches.length;
    const stagger = side === 1 ? pitch * 0.5 : 0;
    const row = y + stagger + threadVariation(index, needleSeed + side) * 0.28;
    const tip = -side * (0.9 + threadVariation(index, needleSeed + 4) * 0.3);
    const rise = (10 + threadVariation(index, needleSeed + 8) * 0.75) * scale;
    stitches.push(
      `M${side * 25 * scale} ${row.toFixed(2)}Q${side * 11 * scale} ${(row + 4 * scale).toFixed(2)} ${tip.toFixed(2)} ${(row + rise).toFixed(2)}`,
    );
  }
  return stitches.join(" ");
}

interface NookVinesProps {
  layer: "back" | "front";
  hasGarland: boolean;
}

export function NookVines({ layer, hasGarland }: NookVinesProps) {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-ivy-${name})`;
  const vines = layer === "back" ? rearVines : frontVines;

  return (
    <g
      className={`nook-vines nook-vines--${layer}`}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        {[0, 1, 2].map((tone) => (
          <linearGradient
            key={tone}
            id={`${id}-ivy-tone-${tone}`}
            x1=".08"
            y1=".1"
            x2=".9"
            y2=".8"
          >
            <stop
              stopColor={
                tone === 1
                  ? "var(--scene-leaf-light)"
                  : "color-mix(in srgb, var(--scene-leaf-light) 58%, var(--scene-leaf))"
              }
            />
            <stop
              offset=".46"
              stopColor={
                tone === 2
                  ? "color-mix(in srgb, var(--scene-leaf) 86%, var(--scene-wood-dark))"
                  : "var(--scene-leaf)"
              }
            />
            <stop
              offset="1"
              stopColor="color-mix(in srgb, var(--scene-leaf) 74%, var(--scene-wood-dark))"
            />
          </linearGradient>
        ))}
      </defs>

      {vines.map((vine, vineIndex) => (
        <g key={vineIndex}>
          <path
            d={vinePath(vine)}
            fill="none"
            stroke="var(--scene-shadow)"
            strokeWidth="3.4"
            opacity=".12"
            transform="translate(1 1.8)"
          />
          <NookThread
            d={vinePath(vine)}
            color="color-mix(in srgb, var(--scene-leaf) 65%, var(--scene-wood-dark))"
            highlight="var(--scene-leaf-light)"
            shadow="var(--scene-wood-dark)"
            width={layer === "back" ? 2.6 : 3.4}
            relief={2.3}
          />
          <NookThread
            d={cordWraps(
              Array.from({ length: 220 }, (_, i) => pointOnVine(vine, i / 219)),
              layer === "back" ? 1.1 : 1.45,
              4.1,
              vine.seed,
            )}
            color="var(--scene-leaf-light)"
            shadow="var(--scene-wood-dark)"
            highlight="color-mix(in srgb, var(--scene-leaf-light) 82%, var(--scene-paper))"
            width={1.3}
            relief={1.8}
          />

          {Array.from({ length: vine.count }, (_, i) => {
            const t = 0.035 + (i / vine.count) * 0.935;
            if (hasGarland && layer === "front" && t < 0.36 && i % 2 === 0)
              return null;
            const anchor = pointOnVine(vine, t);
            const next = pointOnVine(vine, t + 0.004);
            const tangent = Math.atan2(
              next[1] - anchor[1],
              next[0] - anchor[0],
            );
            const side = i % 2 ? 1 : -1;
            const direction =
              tangent + side * (1.02 + 0.16 * Math.sin(i * 2.1));
            const reach = 5.5 + (i % 3) * 1.4;
            const base: Point = [
              anchor[0] + Math.cos(direction) * reach,
              anchor[1] + Math.sin(direction) * reach,
            ];
            const angle = (direction * 180) / Math.PI + 90;
            const size =
              vine.scale *
              (0.74 +
                0.22 * Math.sin(i * 1.8 + vine.seed) +
                0.16 * (i % 3 === 0 ? 1 : 0)) *
              (t > 0.78 ? 0.8 : 1);
            const variant = i > vine.count - 4 ? 2 : (i + vine.seed) % 3;
            const tone = (i + vine.seed) % 3;
            const stitchSeed = vine.seed * 37 + i;
            const cycleDuration = `${12 + (i % 5) * 1.25}s`;
            const clip = `${id}-ivy-leaf-${vineIndex}-${i}`;
            const control: Point = [
              anchor[0] + Math.cos(direction + 0.35) * reach * 0.55,
              anchor[1] + Math.sin(direction + 0.35) * reach * 0.55,
            ];
            const petiole = `M${anchor.join(" ")}Q${control.join(" ")} ${base.join(" ")}`;
            const petiolePoints = Array.from({ length: 12 }, (_, n): Point => {
              const u = n / 11;
              const v = 1 - u;
              return [
                v * v * anchor[0] + 2 * v * u * control[0] + u * u * base[0],
                v * v * anchor[1] + 2 * v * u * control[1] + u * u * base[1],
              ];
            });
            return (
              <g key={i}>
                {/* The petiole remains anchored while just the blade gently turns. */}
                <NookThread
                  d={petiole}
                  color="var(--scene-leaf)"
                  shadow="var(--scene-wood-dark)"
                  highlight="var(--scene-leaf-light)"
                  width={1.95}
                  relief={2.2}
                />
                <NookThread
                  d={cordWraps(petiolePoints, 0.85, 3.1, stitchSeed)}
                  color="var(--scene-leaf-light)"
                  shadow="var(--scene-leaf)"
                  highlight="color-mix(in srgb, var(--scene-leaf-light) 80%, var(--scene-paper))"
                  width={1.05}
                  relief={1.8}
                />
                <g transform={`translate(${base.join(" ")}) rotate(${angle})`}>
                  <g
                    className="nook-ivy-leaf"
                    style={
                      {
                        transformOrigin: "0px 0px",
                        animationDelay: `${-(i * 0.73 + vineIndex * 2.3)}s`,
                        animationDuration: cycleDuration,
                        "--foliage-delay": `${-(i * 0.73 + vineIndex * 2.3)}s`,
                        "--foliage-duration": cycleDuration,
                      } as CSSProperties
                    }
                  >
                    {[0, 1, 2].map((model) => {
                      const blade = scaledBlade(
                        resewnFoliagePath(
                          blades[variant],
                          model,
                          stitchSeed,
                          1.1,
                        ),
                        size,
                      );
                      const modelClip = `${clip}-${model}`;
                      return (
                        <g
                          key={model}
                          data-sewn-model={model}
                          className={`nook-foliage-model nook-foliage-model--${model}`}
                        >
                          <defs>
                            <clipPath id={modelClip}>
                              <path d={blade} />
                            </clipPath>
                          </defs>
                          <path
                            d={blade}
                            fill="var(--scene-shadow)"
                            stroke="none"
                            opacity=".24"
                            transform="translate(.7 1.1)"
                          />
                          <path
                            d={blade}
                            fill={paint(`tone-${tone}`)}
                            stroke="var(--scene-wood-dark)"
                            strokeOpacity=".5"
                            strokeWidth="1.6"
                          />
                          <g clipPath={`url(#${modelClip})`}>
                            <NookThread
                              d={fishboneFill(size, -1, stitchSeed, model)}
                              color={
                                tone === 2
                                  ? "color-mix(in srgb, var(--scene-leaf-light) 65%, var(--scene-leaf))"
                                  : "var(--scene-leaf-light)"
                              }
                              highlight="color-mix(in srgb, var(--scene-leaf-light) 76%, var(--scene-paper))"
                              shadow="color-mix(in srgb, var(--scene-leaf) 65%, var(--scene-wood-dark))"
                              width={
                                2.05 + threadVariation(i, vine.seed) * 0.12
                              }
                              relief={2.4}
                            />
                            <NookThread
                              d={fishboneFill(size, 1, stitchSeed + 11, model)}
                              color="color-mix(in srgb, var(--scene-leaf-light) 55%, var(--scene-leaf))"
                              highlight="var(--scene-leaf-light)"
                              shadow="color-mix(in srgb, var(--scene-leaf) 65%, var(--scene-wood-dark))"
                              width={
                                2.05 + threadVariation(i, vine.seed + 1) * 0.12
                              }
                              relief={2.4}
                            />
                          </g>
                          <NookThread
                            d={scaledBlade(
                              resewnFoliagePath(
                                variant === 2
                                  ? "M0-1Q-1-16 1-32"
                                  : "M0-1Q-2-19 1-36",
                                model,
                                stitchSeed,
                                0.9,
                              ),
                              size,
                            )}
                            color="color-mix(in srgb, var(--scene-leaf) 70%, var(--scene-wood-dark))"
                            highlight="var(--scene-leaf-light)"
                            width={1.3}
                            relief={1.9}
                          />
                          <NookThread
                            d={blade}
                            color="var(--scene-leaf)"
                            highlight="var(--scene-leaf-light)"
                            shadow="var(--scene-wood-dark)"
                            width={1.65}
                            relief={2.3}
                          />
                          <NookThread
                            d={blade}
                            color="var(--scene-leaf-light)"
                            highlight="color-mix(in srgb, var(--scene-leaf-light) 83%, var(--scene-paper))"
                            shadow="var(--scene-leaf)"
                            width={0.9}
                            relief={1.8}
                            dasharray=".55 2.3 .48 2.6 .7 2.1"
                          />
                        </g>
                      );
                    })}
                  </g>
                </g>
              </g>
            );
          })}
        </g>
      ))}

      {layer === "front" && (
        <g fill="none">
          {/* Fine searching tips curl back toward the timber. */}
          {[
            [0, 0.48, 1, 0],
            [0, 0.79, 1, -30],
            [1, 0.55, -1, 15],
            [1, 0.965, 1, -80],
          ].map(([vineIndex, t, mirror, angle], i) => (
            <g
              key={i}
              transform={`translate(${pointOnVine(frontVines[vineIndex], t).join(" ")}) scale(${mirror} 1) rotate(${angle})`}
            >
              <NookThread
                d={vinePath(tendril)}
                color="var(--scene-leaf)"
                shadow="var(--scene-wood-dark)"
                highlight="var(--scene-leaf-light)"
                width={2.2}
                relief={2.3}
              />
              <NookThread
                d={tendrilWraps}
                color="var(--scene-leaf-light)"
                shadow="var(--scene-leaf)"
                highlight="color-mix(in srgb, var(--scene-leaf-light) 83%, var(--scene-paper))"
                width={1.15}
                relief={1.8}
              />
            </g>
          ))}
        </g>
      )}
    </g>
  );
}
