import { NookThread } from "./NookThread";
import type { MoogleModel } from "./NookMoogleStitches";
import { threadVariation } from "./nookNeedlework";

interface FlossProps {
  model: MoogleModel;
  color: string;
  shade: string;
  light: string;
}

const n = (value: number) => value.toFixed(2);

// Like the keepsake satin, each strand bows over the stuffing and lands at
// the edge of its own shape. Tiny tension changes keep the three poses sewn.
const noses = ([0, 1, 2] as const).map((model) => {
  const bundles = ["", ""];
  for (let stitch = 0; stitch < 13; stitch++) {
    const x = 89.8 + stitch * 1.7;
    const reach = Math.sqrt(1 - ((x - 100) / 11.5) ** 2) * 7.5;
    const tension = threadVariation(stitch, 613 + model) * 0.18;
    bundles[stitch % 2] +=
      `M${n(x)} ${n(148 - reach)}Q${n(x - 1.4 + tension)} 147.2 ${n(x + tension)} ${n(148 + reach)} `;
  }
  const catches = Array.from({ length: 27 }, (_, stitch) => {
    const angle = (stitch / 27) * Math.PI * 2;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    return `M${n(100 + dx * 10.6)} ${n(148 + dy * 7.1)}l${n(dx * 0.7)} ${n(dy * 0.55)}`;
  }).join(" ");
  return { bundles, catches };
});

export function NookMoogleNoseStitches({
  model,
  color,
  shade,
  light,
  padding,
}: FlossProps & { padding: string }) {
  return (
    <g>
      {noses[model].bundles.map((d, tone) => (
        <NookThread
          key={tone}
          d={d}
          color={tone ? color : padding}
          shadow={shade}
          highlight={light}
          width={1.47}
          relief={1.4}
        />
      ))}
      <NookThread
        d="M89.4 148.6C90.5 157.7 109.1 158.6 110.6 148.6"
        color={color}
        shadow={shade}
        highlight={light}
        width={0.75}
        relief={0.7}
      />
      <path
        d={noses[model].catches}
        fill="none"
        stroke={light}
        strokeWidth=".42"
        opacity=".65"
      />
    </g>
  );
}

type Point = readonly [number, number];
type Curve = readonly [Point, Point, Point];
const restingMouth: readonly Curve[] = [
  [
    [91, 160],
    [96, 166],
    [100, 160],
  ],
  [
    [100, 160],
    [104, 166],
    [110, 159],
  ],
];
const smilingMouth: readonly Curve[] = [
  [
    [92, 160],
    [101, 168],
    [109, 160],
  ],
];

function pointOn([a, b, c]: Curve, t: number): Point {
  const s = 1 - t;
  return [
    s * s * a[0] + 2 * s * t * b[0] + t * t * c[0],
    s * s * a[1] + 2 * s * t * b[1] + t * t * c[1],
  ];
}

// Short overlapping stem stitches follow the smile. Oblique catches wrap the
// cord, using the same tangent/normal construction as the sewn window ribs.
function sewMouth(curves: readonly Curve[], model: MoogleModel) {
  const stems: string[] = [];
  const wraps: string[] = [];
  curves.forEach((curve, index) => {
    const [a, b, c] = curve;
    const count = Math.ceil(
      (Math.hypot(b[0] - a[0], b[1] - a[1]) +
        Math.hypot(c[0] - b[0], c[1] - b[1])) /
        2.6,
    );
    for (let stitch = 0; stitch < count; stitch++) {
      const start = pointOn(curve, stitch / count);
      const end = pointOn(curve, Math.min(1, (stitch + 1.07) / count));
      const t = (stitch + 0.5) / count;
      const mid = pointOn(curve, t);
      const dx = (1 - t) * (b[0] - a[0]) + t * (c[0] - b[0]);
      const dy = (1 - t) * (b[1] - a[1]) + t * (c[1] - b[1]);
      const length = Math.hypot(dx, dy);
      const tx = dx / length,
        ty = dy / length;
      const bow =
        0.23 + threadVariation(stitch + index * 11, 629 + model) * 0.08;
      stems.push(
        `M${n(start[0])} ${n(start[1])}Q${n(mid[0] - ty * bow)} ${n(mid[1] + tx * bow)} ${n(end[0])} ${n(end[1])}`,
      );
      wraps.push(
        `M${n(mid[0] + ty * 0.55 - tx * 0.2)} ${n(mid[1] - tx * 0.55 - ty * 0.2)}q${n(tx * 0.55)} ${n(ty * 0.55)} ${n(-ty * 1.1 + tx * 0.4)} ${n(tx * 1.1 + ty * 0.4)}`,
      );
    }
  });
  return { stems: stems.join(" "), wraps: wraps.join(" ") };
}
const mouths = ([0, 1, 2] as const).map((model) => ({
  rest: sewMouth(restingMouth, model),
  smile: sewMouth(smilingMouth, model),
}));

export function NookMoogleMouthStitches({
  model,
  color,
  shade,
  light,
  pleased,
}: FlossProps & { pleased: boolean }) {
  const mouth = mouths[model][pleased ? "smile" : "rest"];
  return (
    <g>
      <NookThread
        d={mouth.stems}
        color={color}
        shadow={shade}
        highlight={light}
        width={1.5}
        relief={0.85}
      />
      <path
        d={mouth.wraps}
        fill="none"
        stroke={light}
        strokeWidth=".45"
        opacity=".7"
      />
    </g>
  );
}
