import { useId } from "react";

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

function pointOnVine(vine: Vine, t: number): Point {
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

function vinePath(vine: Vine) {
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

const blades = [
  // Rounded lobes and an off-centre tip keep the mature leaves from looking stamped.
  "M0 0C-4-5-12-3-16-9Q-13-12-13-16Q-19-19-21-27Q-13-26-8-29Q-5-34 1-41Q5-32 10-28Q16-29 21-27Q19-20 13-16Q14-10 17-8Q7-4 0 0Z",
  "M0 0Q-5-6-13-6Q-12-13-18-20Q-11-21-7-25Q-3-34 3-40Q5-29 10-25L18-25Q16-18 10-13Q12-8 11-5Q5-4 0 0Z",
  // New growth has smaller, simpler blades.
  "M0 0C-10-4-14-14-10-22Q-4-27 1-35Q6-28 11-21C16-12 9-3 0 0Z",
];

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
          <path
            d={vinePath(vine)}
            fill="none"
            stroke="color-mix(in srgb, var(--scene-leaf) 65%, var(--scene-wood-dark))"
            strokeWidth={layer === "back" ? 1.35 : 1.8}
          />
          <path
            d={vinePath(vine)}
            fill="none"
            stroke="var(--scene-leaf-light)"
            strokeWidth=".55"
            opacity=".55"
            transform="translate(-.45 -.2)"
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
            return (
              <g key={i}>
                {/* The petiole remains anchored while just the blade gently turns. */}
                <path
                  d={`M${anchor.join(" ")}Q${anchor[0] + Math.cos(direction + 0.35) * reach * 0.55} ${anchor[1] + Math.sin(direction + 0.35) * reach * 0.55} ${base.join(" ")}`}
                  fill="none"
                  stroke="var(--scene-leaf)"
                  strokeWidth=".95"
                />
                <g
                  transform={`translate(${base.join(" ")}) rotate(${angle}) scale(${size})`}
                >
                  <g
                    className="nook-ivy-leaf"
                    style={{
                      transformOrigin: "0px 0px",
                      animationDelay: `${-(i * 0.73 + vineIndex * 2.3)}s`,
                      animationDuration: `${9 + (i % 5)}s`,
                    }}
                  >
                    <path
                      d={blades[variant]}
                      fill="var(--scene-shadow)"
                      stroke="none"
                      opacity=".14"
                      transform="translate(.9 1.4)"
                    />
                    <path
                      d={blades[variant]}
                      fill={paint(`tone-${tone}`)}
                      stroke="var(--scene-wood-dark)"
                      strokeOpacity=".36"
                      strokeWidth=".8"
                    />
                    <path
                      d={
                        variant === 2
                          ? "M0-1Q0-16 1-33Q6-28 11-21C16-12 9-3 0-1Z"
                          : "M0-1Q-1-16 1-39Q5-30 10-27L14-22Q10-16 12-9Q5-5 0-1Z"
                      }
                      fill="var(--scene-wood-dark)"
                      opacity=".12"
                      stroke="none"
                    />
                    <path
                      d={
                        variant === 2
                          ? "M0-1Q-1-16 1-32M0-9-7-16M0-17 7-23"
                          : "M0-1Q-2-19 1-36M-1-11Q-7-15-12-20M-1-18Q-6-23-9-26M-1-11Q7-15 12-20M0-22 7-28"
                      }
                      fill="none"
                      stroke="var(--scene-leaf-light)"
                      strokeWidth=".85"
                      opacity=".8"
                    />
                    {variant !== 2 && (
                      <path
                        d="M-12-23q3-1 6-4M-11-11l-3-1M5-7q4-1 6-4"
                        fill="none"
                        stroke="var(--scene-paper)"
                        strokeWidth=".65"
                        opacity=".3"
                      />
                    )}
                  </g>
                </g>
              </g>
            );
          })}
        </g>
      ))}

      {layer === "front" && (
        <g
          fill="none"
          stroke="var(--scene-leaf)"
          strokeWidth=".85"
          opacity=".8"
        >
          {/* Fine searching tips curl back toward the timber. */}
          {[
            [0, 0.48, 1, 0],
            [0, 0.79, 1, -30],
            [1, 0.55, -1, 15],
            [1, 0.965, 1, -80],
          ].map(([vineIndex, t, mirror, angle], i) => (
            <path
              key={i}
              d="M0 0C-9-3-18 2-19-7C-20-13-12-17-9-11C-7-7-11-4-13-7"
              transform={`translate(${pointOnVine(frontVines[vineIndex], t).join(" ")}) scale(${mirror} 1) rotate(${angle})`}
            />
          ))}
        </g>
      )}
    </g>
  );
}
