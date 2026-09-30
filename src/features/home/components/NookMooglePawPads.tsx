import { NookThread } from "./NookThread";
import type { MoogleModel } from "./NookMoogleStitches";
import { threadVariation } from "./nookNeedlework";

interface NookMooglePawPadsProps {
  model: MoogleModel;
  color: string;
  shade: string;
  light: string;
}

const n = (value: number) => value.toFixed(2);
const pads = [
  { x: 69, y: 235, rx: 7.5, ry: 4.8, angle: 12 },
  { x: 131, y: 235, rx: 7.5, ry: 4.8, angle: -12 },
  { x: 60, y: 228, rx: 2.4, ry: 2.4, angle: -12 },
  { x: 67, y: 225, rx: 2.5, ry: 2.5, angle: -4 },
  { x: 74, y: 226, rx: 2.1, ry: 2.1, angle: 12 },
  { x: 140, y: 228, rx: 2.4, ry: 2.4, angle: 12 },
  { x: 133, y: 225, rx: 2.5, ry: 2.5, angle: 4 },
  { x: 126, y: 226, rx: 2.1, ry: 2.1, angle: -12 },
] as const;

function sewPad(rx: number, ry: number, model: MoogleModel, seed: number) {
  const count = Math.max(4, Math.round((rx * 2) / 1.1));
  const bundles = ["", ""];
  for (let stitch = 0; stitch < count; stitch++) {
    const jitter = threadVariation(stitch, seed + model * 79) * 0.09;
    const x = -rx + ((stitch + 0.5) / count) * rx * 2 + jitter;
    const reach = ry * Math.sqrt(Math.max(0, 1 - (x / rx) ** 2));
    const bow = (x / rx) * 0.4 + jitter;
    bundles[stitch % 2] +=
      `M${n(x)} ${n(-reach + 0.2)}Q${n(x + bow)} ${n(-0.35 + jitter)} ${n(x)} ${n(reach - 0.2)} `;
  }
  return bundles;
}

const sewnPads = ([0, 1, 2] as const).map((model) =>
  pads.map((pad, index) => ({
    ...pad,
    outline: `M${-pad.rx} 0a${pad.rx} ${pad.ry} 0 1 0 ${pad.rx * 2} 0a${pad.rx} ${pad.ry} 0 1 0 ${-pad.rx * 2} 0Z`,
    satin: sewPad(pad.rx, pad.ry, model, 270 + index),
  })),
);

/** Small rose appliqués: closely laid satin and a softly wrapped cotton edge. */
export function NookMooglePawPads({
  model,
  color,
  shade,
  light,
}: NookMooglePawPadsProps) {
  return (
    <g className="nook-moogle__paw-pads" stroke="none">
      {sewnPads[model].map(({ x, y, rx, outline, angle, satin }) => (
        <g
          key={`${x}-${y}`}
          transform={`translate(${x} ${y}) rotate(${angle})`}
        >
          <path
            d={outline}
            fill={shade}
            opacity=".24"
            transform="translate(.2 .45)"
          />
          <path d={outline} fill={color} />
          {satin.map((d, tone) => (
            <NookThread
              key={tone}
              d={d}
              color={
                tone ? `color-mix(in srgb, ${color} 86%, ${light})` : color
              }
              shadow={shade}
              highlight={light}
              width={rx > 3 ? 0.95 : 0.85}
              relief={0.7}
            />
          ))}
          <NookThread
            d={outline}
            color={color}
            shadow={shade}
            highlight={light}
            width={rx > 3 ? 0.6 : 0.45}
            relief={0.55}
          />
          {rx > 3 && (
            <NookThread
              d={outline}
              color={`color-mix(in srgb, ${color} 86%, ${light})`}
              shadow={shade}
              highlight={light}
              width={0.6}
              dasharray=".4 1.9 .55 2.1"
              relief={0.45}
            />
          )}
        </g>
      ))}
    </g>
  );
}
