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
  const paws = Array.from({ length: 15 }, (_, i) => {
    const x = i * 3.35 + offset + variation(i, 35) * 0.45;
    const pull = variation(i, 36) * 1.2 + slant;
    return `M${n(44 + x)} 159q${n(-9 + pull)} 26 8 53M${n(112 + x)} 159q${n(9 + pull)} 26-8 53M${n(44 + x)} 215q${n(-4 + pull)} 15 5 30M${n(109 + x)} 215q${n(4 + pull)} 15-5 30`;
  }).join(" ");

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
