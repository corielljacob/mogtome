import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";

const n = (value: number) => value.toFixed(1);
export type MoogleModel = 0 | 1 | 2;

// The replacement pieces share one weave. Only a little thread tension and
// needle placement changes, so the face keeps reading as the same cloth.
const sewing = [
  { seed: 0, slant: 0, offset: 0 },
  { seed: 79, slant: -0.25, offset: 0.3 },
  { seed: 163, slant: 0.25, offset: -0.25 },
] as const;

function modelVariation(index: number, salt: number, model: MoogleModel) {
  const base = threadVariation(index, salt);
  return model === 0
    ? base
    : base + threadVariation(index, salt + sewing[model].seed) * 0.18;
}

// Long-and-short stitches follow the padding, with small changes in where the
// needle enters and how tightly each length of cotton is pulled.
function cottonRows(
  left: number,
  top: number,
  columns: number,
  rows: number,
  center: number,
  model: MoogleModel,
) {
  const { slant, offset } = sewing[model];
  const pitch = 3.5;
  const rowPitch = 12;
  const stitchLength = 10;
  const variation = (index: number, salt: number) =>
    modelVariation(index, salt, model);
  return Array.from({ length: columns }, (_, column) => {
    const columnX =
      left + column * pitch + offset + variation(column, top) * 0.65;
    const stagger =
      (column % 2) * (rowPitch / 2) + variation(column, top + 1) * 2.6;
    return Array.from({ length: rows }, (_, row) => {
      const stitch = column * rows + row;
      const x = columnX + variation(stitch, top + 2) * 0.35;
      const y =
        top +
        row * rowPitch +
        stagger +
        Math.abs(x - center) * 0.045 +
        variation(stitch, top + 3) * 0.8;
      const length = stitchLength + variation(stitch, top + 4) * 1.5;
      const bend =
        (x - center) * 0.035 + slant + variation(stitch, top + 5) * 0.75;
      const drift = bend * 2 + variation(stitch, top + 6) * 0.8;
      return `M${n(x)} ${n(y)}q${n(bend)} ${n(length * 0.48)} ${n(drift)} ${n(length)}`;
    }).join(" ");
  }).join(" ");
}

// Each paw is a separate padded piece. Long satin turns down the cupped hands,
// while shorter, upright runs fan over the toes.
function pawSatin(model: MoogleModel) {
  const bundles = ["", "", ""];
  const variation = (index: number, salt: number) =>
    modelVariation(index, salt, model);

  for (let side = 0; side < 2; side++) {
    const mirror = (x: number) => (side ? 203 - x : x);
    for (let column = 0; column < 23; column++) {
      const index = side * 40 + column;
      const x = 48 + column * 1.7 + variation(index, 35) * 0.16;
      const pull = variation(index, 36) * 0.45;
      // The strand first turns around the shoulder, then bows into the palm.
      // End before the foot clip: the hands and feet never share a stitch.
      bundles[column % 3] +=
        `M${n(mirror(x))} 177.8C${n(mirror(x - 8 + pull))} 186 ${n(mirror(x + 1 + pull))} 204 ${n(mirror(x + 14))} ${n(213.5 + variation(index, 37) * 0.12)} `;
    }

    // The feet are wider than the hands, so the grain fans away from the ankle.
    const cx = side ? 131 : 69;
    for (let column = 0; column < 26; column++) {
      const index = side * 40 + column;
      const x = cx - 21.5 + column * 1.75 + variation(index, 38) * 0.18;
      const u = (x - cx) / 23;
      const reach = Math.sqrt(Math.max(0, 1 - u * u));
      const top = 231 - reach * 15;
      const bottom = 232 + reach * 14;
      const bow = u * 2.4 + variation(index, 39) * 0.25;
      bundles[column % 3] +=
        `M${n(x - u * 2.2)} ${n(top)}Q${n(x + bow)} ${n(230 + variation(index, 40) * 0.4)} ${n(x)} ${n(bottom)} `;
    }
  }
  return bundles;
}

function makeModel(model: MoogleModel) {
  const { slant, offset } = sewing[model];
  const variation = (index: number, salt: number) =>
    modelVariation(index, salt, model);
  const face = cottonRows(27, 74, 45, 11, 100, model);
  const belly = cottonRows(49, 153, 32, 10, 100, model);
  const pom = Array.from({ length: 19 }, (_, i) => {
    const x = 105.5 + i * 2.9 + offset * 0.35 + variation(i, 11) * 0.5;
    const reach = Math.sqrt(Math.max(0, 26 ** 2 - (x - 131) ** 2));
    const start = 29 - reach + 0.55 + variation(i, 12) * 0.65;
    const end = 29 + reach - 1 - variation(i, 13) * 0.8;
    return `M${n(x)} ${n(start)}Q${n(x - 4 + slant * 2 + variation(i, 14) * 1.1)} ${n(27 + variation(i, 15) * 2.3)} ${n(x + variation(i, 16) * 0.65)} ${n(end)}`;
  }).join(" ");
  const wings = Array.from({ length: 13 }, (_, i) => {
    const left = (i + variation(i, 21) * 0.4) / 12;
    const right = (i + variation(i, 22) * 0.4) / 12;
    return `M${n(23 + left * 4)} ${n(155 + left * 27)}Q${n(33 + left * 10 + slant + variation(i, 23) * 1.1)} ${n(167 + left * 13)} ${n(60 - left * 15)} ${n(172 + left * 14 + variation(i, 24) * 1.1)}M${n(179 - right * 3)} ${n(157 + right * 28)}Q${n(170 - right * 10 - slant + variation(i, 25) * 1.1)} ${n(169 + right * 13)} ${n(142 + right * 18)} ${n(173 + right * 14 + variation(i, 26) * 1.1)}`;
  }).join(" ");
  const paws = pawSatin(model);

  return { face, belly, pom, wings, paws };
}
const paths = ([0, 1, 2] as const).map(makeModel);

export function NookMoogleStitches({
  part,
  color,
  shade,
  light,
  model = 0,
}: {
  part: keyof (typeof paths)[number];
  color: string;
  shade: string;
  light: string;
  model?: MoogleModel;
}) {
  if (part === "paws") {
    return (
      <g>
        {paths[model].paws.map((d, tone) => (
          <NookThread
            key={tone}
            d={d}
            color={
              tone === 1 ? `color-mix(in srgb, ${color} 90%, ${light})` : color
            }
            shadow={shade}
            highlight={light}
            width={tone === 1 ? 1.35 : 1.5}
            relief={1.3}
          />
        ))}
      </g>
    );
  }
  return (
    <NookThread
      d={paths[model][part]}
      color={color}
      shadow={shade}
      highlight={light}
      width={part === "pom" ? 2 : 2.05}
    />
  );
}
