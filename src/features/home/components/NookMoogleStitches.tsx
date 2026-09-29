import { NookThread } from "./NookThread";

const n = (value: number) => value.toFixed(1);

// Long-and-short stitches bow out with the padding. Each column staggers its
// needle entries; the face and tummy have different lengths and curvatures.
function cottonRows(
  left: number,
  top: number,
  columns: number,
  rows: number,
  center: number,
) {
  return Array.from({ length: columns }, (_, column) => {
    const x = left + column * 3.5;
    const bend = (x - center) * 0.035;
    return Array.from({ length: rows }, (_, row) => {
      const y =
        top + row * 12 + (column % 2) * 6 + Math.abs(x - center) * 0.045;
      return `M${n(x)} ${n(y)}q${n(bend)} 4.8 ${n(bend * 2)} 10`;
    }).join(" ");
  }).join(" ");
}

const face = cottonRows(29, 76, 42, 9, 100);
const belly = cottonRows(52, 157, 28, 8, 100);
const pom = Array.from({ length: 18 }, (_, i) => {
  const x = 106.5 + i * 2.9;
  const reach = Math.sqrt(Math.max(0, 26 ** 2 - (x - 131) ** 2));
  return `M${n(x)} ${n(29 - reach)}Q${n(x - 4)} 27 ${n(x)} ${n(29 + reach)}`;
}).join(" ");
const wings = Array.from({ length: 13 }, (_, i) => {
  const t = i / 12;
  return `M${n(23 + t * 4)} ${n(155 + t * 27)}Q${n(33 + t * 10)} ${n(167 + t * 13)} ${n(60 - t * 15)} ${n(172 + t * 14)}M${n(179 - t * 3)} ${n(157 + t * 28)}Q${n(170 - t * 10)} ${n(169 + t * 13)} ${n(142 + t * 18)} ${n(173 + t * 14)}`;
}).join(" ");

const paths = { face, belly, pom, wings };

export function NookMoogleStitches({
  part,
  color,
  shade,
  light,
}: {
  part: keyof typeof paths;
  color: string;
  shade: string;
  light: string;
}) {
  return (
    <NookThread
      d={paths[part]}
      color={color}
      shadow={shade}
      highlight={light}
      width={part === "pom" ? 2 : 2.05}
    />
  );
}
